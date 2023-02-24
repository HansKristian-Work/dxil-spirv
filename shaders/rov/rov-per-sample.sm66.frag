[earlydepthstencil]
void main(float4 pos : SV_Position, uint id : SV_SampleIndex)
{
	uint3 coord = uint3(pos.xyz);
	coord += id;

	RasterizerOrderedByteAddressBuffer RW0 = ResourceDescriptorHeap[0];

	uint offset = 16 * (coord.y * 1000 + coord.x);
	RW0.Store4(offset, RW0.Load4(offset) + uint4(1, 2, 3, 4));

	RasterizerOrderedStructuredBuffer<float4> RW1 = ResourceDescriptorHeap[1];
	RW1[coord.y * 1000 + coord.x] += float4(1, 2, 3, 4);

	RasterizerOrderedBuffer<float4> RW2 = ResourceDescriptorHeap[2];
	RW2[coord.y * 1000 + coord.x] += float4(1, 2, 3, 4);

	RasterizerOrderedTexture1D<float4> RW3 = ResourceDescriptorHeap[3];
	RW3[coord.y * 1000 + coord.x] += float4(1, 2, 3, 4);

	RasterizerOrderedTexture2D<float4> RW4 = ResourceDescriptorHeap[4];
	RW4[coord.xy] += float4(1, 2, 3, 4);
}
