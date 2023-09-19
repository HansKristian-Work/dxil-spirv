#version 460
#extension GL_EXT_ray_tracing : require
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

struct _15
{
    vec4 _m0;
    uint _m1;
};

vec4 _73;

layout(push_constant, std430) uniform RootConstants
{
    uint _m0;
    uint _m1;
    uint _m2;
    uint _m3;
    uint _m4;
    uint _m5;
    uint _m6;
    uint _m7;
} registers;

layout(set = 0, binding = 0) uniform texture2D _13[];
layout(location = 0) rayPayloadInEXT _15 payload;

void main()
{
    vec4 _31 = texelFetch(_13[registers._m0 + (payload._m1 & 1u)], ivec2(uvec2(0u)), int(0u));
    vec4 _45 = texelFetch(_13[registers._m0 + payload._m1], ivec2(uvec2(0u)), int(0u));
    vec4 _62 = texelFetch(_13[(registers._m0 + 10u) + payload._m1], ivec2(uvec2(0u)), int(0u));
    vec4 _72;
    _72.x = (_31.x + _45.x) + _62.x;
    _72.y = (_31.y + _45.y) + _62.y;
    _72.z = (_31.z + _45.z) + _62.z;
    _72.w = (_31.w + _45.w) + _62.w;
    payload._m0 = _72;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.4
; Generator: Unknown(30017); 21022
; Bound: 79
; Schema: 0
OpCapability Shader
OpCapability UniformBufferArrayDynamicIndexing
OpCapability SampledImageArrayDynamicIndexing
OpCapability StorageBufferArrayDynamicIndexing
OpCapability StorageImageArrayDynamicIndexing
OpCapability RayTracingKHR
OpCapability RuntimeDescriptorArray
OpCapability UniformBufferArrayNonUniformIndexing
OpCapability SampledImageArrayNonUniformIndexing
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability StorageImageArrayNonUniformIndexing
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpExtension "SPV_KHR_ray_tracing"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint MissNV %3 "main" %8 %13 %17
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %15 ""
OpName %17 "payload"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeFloat 32
%10 = OpTypeImage %9 2D 0 0 0 1 Unknown
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer UniformConstant %11
%13 = OpVariable %12 UniformConstant
%14 = OpTypeVector %9 4
%15 = OpTypeStruct %14 %5
%16 = OpTypePointer IncomingRayPayloadNV %15
%17 = OpVariable %16 IncomingRayPayloadNV
%18 = OpTypePointer IncomingRayPayloadNV %5
%20 = OpConstant %5 1
%23 = OpTypePointer UniformConstant %10
%25 = OpTypePointer PushConstant %5
%27 = OpConstant %5 0
%32 = OpTypeVector %5 2
%38 = OpTypePointer IncomingRayPayloadNV %14
%59 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
%73 = OpUndef %14
OpBranch %77
%77 = OpLabel
%19 = OpInBoundsAccessChain %18 %17 %20
%21 = OpLoad %5 %19
%22 = OpBitwiseAnd %5 %21 %20
%26 = OpAccessChain %25 %8 %27
%28 = OpLoad %5 %26
%29 = OpIAdd %5 %28 %22
%24 = OpAccessChain %23 %13 %29
%30 = OpLoad %10 %24
%33 = OpCompositeConstruct %32 %27 %27
%31 = OpImageFetch %14 %30 %33 Lod %27
%34 = OpCompositeExtract %9 %31 0
%35 = OpCompositeExtract %9 %31 1
%36 = OpCompositeExtract %9 %31 2
%37 = OpCompositeExtract %9 %31 3
%39 = OpInBoundsAccessChain %38 %17 %27
%41 = OpAccessChain %25 %8 %27
%42 = OpLoad %5 %41
%43 = OpIAdd %5 %42 %21
%40 = OpAccessChain %23 %13 %43
%44 = OpLoad %10 %40
%46 = OpCompositeConstruct %32 %27 %27
%45 = OpImageFetch %14 %44 %46 Lod %27
%47 = OpCompositeExtract %9 %45 0
%48 = OpCompositeExtract %9 %45 1
%49 = OpCompositeExtract %9 %45 2
%50 = OpCompositeExtract %9 %45 3
%51 = OpFAdd %9 %34 %47
%52 = OpFAdd %9 %35 %48
%53 = OpFAdd %9 %36 %49
%54 = OpFAdd %9 %37 %50
%56 = OpAccessChain %25 %8 %27
%57 = OpLoad %5 %56
%58 = OpIAdd %5 %57 %59
%60 = OpIAdd %5 %58 %21
%55 = OpAccessChain %23 %13 %60
%61 = OpLoad %10 %55
%63 = OpCompositeConstruct %32 %27 %27
%62 = OpImageFetch %14 %61 %63 Lod %27
%64 = OpCompositeExtract %9 %62 0
%65 = OpCompositeExtract %9 %62 1
%66 = OpCompositeExtract %9 %62 2
%67 = OpCompositeExtract %9 %62 3
%68 = OpFAdd %9 %51 %64
%69 = OpFAdd %9 %52 %65
%70 = OpFAdd %9 %53 %66
%71 = OpFAdd %9 %54 %67
%72 = OpCompositeInsert %14 %68 %73 0
%74 = OpCompositeInsert %14 %69 %72 1
%75 = OpCompositeInsert %14 %70 %74 2
%76 = OpCompositeInsert %14 %71 %75 3
OpStore %39 %76
OpReturn
OpFunctionEnd
#endif
