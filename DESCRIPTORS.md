# Full SM 6.0+ descriptor compatibility in Vulkan

In this document, I aim to rethink how we implement descriptors.
The goal is to efficiently implement descriptors even in bindless scenarios, i.e. SM 5.1/6.0+.

## Descriptor heaps in D3D12

The API lets you allocate a descriptor heap with N elements. Each element can be a SRV, UAV or CBV or any arbitrary type.
The API exposes some kind of "stride" here, which implies that max(sizeof(SRV), sizeof(UAV), sizeof(CBV)) is some value, i.e. 32 on drivers I've tested.

## Root signatures

Here we can specify up to 64 DWORDs (256 bytes) which gets passed to the shader.

- Descriptor table pointer: 1 DWORD, (not two? interesting ...)
- Root descriptor (UAV/CBV), apparently not bounds checked? (2 DWORD)
- Root constants (1 DWORD each)

First thought that comes to mind is that a descriptor table pointer can correlate to a descriptor set, but this will not work.
We only have 8 descriptor sets available. (4 is technically min-spec, but only some mobile chips expose that. I think it's fair to rely on 8.)

### Descriptor table pointer as an offset

A weird design of D3D12 is SetDescriptorHeaps which lets you bind only two heaps, one SRV/CBV/UAV heap and one SAMPLER heap, and all descriptor table pointers
must refer to one of these.
Looking at the descriptor table pointer only taking 1 DWORD this starts making sense. We should just encode offsets here into the two heaps.

SetDesciptorHeaps now becomes vkCmdBindDescriptorSets directly. The root signature becomes push constants (for 256 byte implementations),
or spills into a versioned uniform buffer (for 128 byte implementations and root sig > 128 bytes, which should be rare).

### Descriptor types

While descriptor types are kind of irrelevant in D3D12 inside heaps, we have very particular types in Vulkan.
`SAMPLED_IMAGE`, `UNIFORM_TEXEL_BUFFER`, `STORAGE_TEXEL_BUFFER`, `UNIFORM_BUFFER` and friends. Ideally, we'd have a "GENERAL" descriptor type which could be anything and we'd save on a lot of bloat in this scenario.

With a descriptor heap, we do not know the root signature yet, so we have two choices on how to allocate the descriptors, either with `VARIABLE_COUNT` or not.
With `VARIABLE_COUNT` we can declare descriptor set layouts which have the maximum number of bindings we expect to support (At least 1M according to Tier2),
and then allocating the descriptor pools we can allocate just the right amount of descriptors. This seems like the correct approach.
Two effects of this is that each descriptor type must live in their own descriptor sets, as only one descriptor binding can have VARYING count.

So far, we thus have 6 descriptor set layouts which will be common across all pipelines. Each set contains one binding, with VARYING size array of that type.

- Set0: `SAMPLED_IMAGE` - Texture
- Set1: `UNIFORM_TEXEL_BUFFER` - TypedBuffer, StructuredBuffer, ByteAddressBuffer
- Set2: `STORAGE_TEXEL_BUFFER` - RWTypedBuffer, RWStructuredBuffer, RWByteAddressBuffer. Descriptors come in pairs of two, the odd indices can deal with UAV counters.
- Set3: `STORAGE_IMAGE`
- Set4: `UNIFORM_BUFFER`
- Set5: `SAMPLER`

This leaves three sets which can be derived from a root signature directly. These include:

- Set6: Immutable samplers. It's useful to keep these in their own set since we don't have to deal with push descriptor restrictions of having to push immutable samplers
(and thus having to keep track of them as well).

- Set4 (reuse `UNIFORM_BUFFER` set): Virtualized bindings. These are bindings we have to repack from descriptor heaps to support implementations with few CBVs (like older Nvidia cards).
Due to RS 1.0 volatile descriptor behavior (descriptor needs only be valid in GPU timeline and can change anytime)
we need to defer the actual vkUpdateDescriptorSet calls to QueueSubmit() time. Using a descriptor update template here would be nice!
Virtualized bindings is currently the *only* path used by vkd3d and it crumbles down for any interesting uses of SM 5.1 and up, i.e. larger arrays of resources.
If we use virtualized descriptors, we can pilfer the set used for uniform buffers as that's the descriptor type we're going to virtualize anyways.

- Set7 (reuse `UNIFORM_BUFFER` set): Versioned push descriptor set. Here we can place:
- Root constants which spill outside maxPushConstantSize
- Root descriptors

For implementations which don't support push descriptors, we can fallback to a versioned descriptor set instead, just like vkd3d does.

#### Why not `STORAGE_BUFFER` for buffer UAVs?

Alignment is a big issue for SSBOs, especially on Nvidia. StructuredBuffers can be bound at very awkward alignments and only `STORAGE_TEXEL_BUFFER` of R32UI can express those.
This might lead us into an awkward path when dealing with 16-bit load/store in SM 6.2. Using physical storage buffers (PSB) for untyped buffers would be great, but we need to consider out-of-bounds behavior, which PSB does not support. Also, if we go the PSB route, we will have another indirection to consider. Since rather than going:

- Load UAV descriptor
- Load/Store data

we end up with:

- Load CBV/UAV descriptor
- Load PSB pointer
- Load/store data

## Sample shader

```
layout(push_constant) uniform RootConstants
{
	uint descriptor_table_offset0;
	uint descriptor_table_offset1;
	uint descriptor_table_offset2;
	uint descriptor_table_offset3;
	uint root_constant0;
	uint root_constant1;
	uint root_constant2;
	uint root_constant3;
} root;

// We can alias descriptors.
layout(set = 0, binding = 0) uniform texture2D Tex2D[];
layout(set = 0, binding = 0) uniform texture3D Tex3D[];

layout(set = 1, binding = 0) textureBuffer TypedBuffers[];
layout(set = 1, binding = 0) textureBuffer StructuredBuffers[];
layout(set = 1, binding = 0) textureBuffer ByteAddressBuffers[];

layout(set = 2, binding = 0) imageBuffer RWTypedBuffers[];
layout(set = 2, binding = 1, r32ui) uimageBuffer RWStructureBuffers[];
layout(set = 2, binding = 2, r32ui) uimageBuffer RWByteAddressBuffers[];

layout(set = 3, binding = 0) uniform image2D RWTex2D[];
layout(set = 3, binding = 0) uniform image3D RWTex3D[];

#if SUPPORTS_MANY_CBVS
layout(set = 4, binding = 0, std140) uniform UBOs
{
	vec4 data[MAX_SIZE];
} CBV[];
#else
// Versioned descriptors.
layout(set = 4, binding = 0, std140) uniform UBO0
{
	vec4 data[MAX_SIZE];
} ubo0;
layout(set = 4, binding = 1, std140) uniform UBO0
{
	vec4 data[MAX_SIZE];
} ubo0;
#endif

layout(set = 5, binding = 0) uniform sampler DynamicSamplers[];
layout(set = 6, binding = 0) uniform sampler ImmutableSampler0;
layout(set = 6, binding = 1) uniform sampler ImmutableSampler1;
layout(set = 6, binding = 2) uniform sampler ImmutableSampler2;

// Root descriptors.
layout(set = 7, binding = 0) uniform RootCBV0
{
	vec4 data[MAX_SIZE];
} root_cbv0;

layout(set = 7, binding = 1) uniform RootCBV1
{
	vec4 data[MAX_SIZE];
} root_cbv1;

void main()
{
	const uint OffsetIntoRootTable = 42; // This is deduced from D3D12_DESCRIPTOR_RANGE.

	// descriptor_table_offset is offset into a SetDescriptorHeaps, which we can find by looking at
	// SetGraphicsRootDescriptor table compared to SetDescriptorHeaps.
	// Tack on nonuniformEXT as required by IL.
	texelFetch(Tex2D[OffsetIntoRootTable + root.descriptor_table_offset1]);
}
