#version 460
#extension GL_EXT_ray_tracing : require
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_KHR_shader_subgroup_ballot : require

struct _25
{
    vec4 _m0;
    uint _m1;
};

vec4 _89;

layout(shaderRecordEXT, std430) buffer SBTBlock
{
    uint _m0[5];
    uint _m1[6];
    uvec2 _m2;
    uvec2 _m3;
    uvec2 _m4;
    uvec2 _m5;
    uvec2 _m6;
    uvec2 _m7;
    uvec2 _m8;
    uvec2 _m9;
    uvec2 _m10;
} SBT;

layout(set = 5, binding = 0, std140) uniform BindlessCBV
{
    vec4 _m0[4096];
} _24[];

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

layout(location = 0) rayPayloadInEXT _25 payload;

void main()
{
    uint _38 = (SBT._m9.x >> 6u) + 12u;
    vec4 _53 = uintBitsToFloat(uvec4(SBT._m0[0u], SBT._m0[1u], SBT._m0[2u], SBT._m0[3u]));
    vec4 _88;
    _88.x = (payload._m0.x + subgroupBroadcastFirst(_53.x)) + subgroupBroadcastFirst(_24[nonuniformEXT(_38)]._m0[0u].x);
    _88.y = (payload._m0.y + subgroupBroadcastFirst(_53.y)) + subgroupBroadcastFirst(_24[nonuniformEXT(_38)]._m0[0u].y);
    _88.z = (payload._m0.z + subgroupBroadcastFirst(_53.z)) + subgroupBroadcastFirst(_24[nonuniformEXT(_38)]._m0[0u].z);
    _88.w = (payload._m0.w + subgroupBroadcastFirst(_53.w)) + subgroupBroadcastFirst(_24[nonuniformEXT(_38)]._m0[0u].w);
    payload._m0 = _88;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.4
; Generator: Unknown(30017); 21022
; Bound: 95
; Schema: 0
OpCapability Shader
OpCapability UniformBufferArrayDynamicIndexing
OpCapability SampledImageArrayDynamicIndexing
OpCapability StorageBufferArrayDynamicIndexing
OpCapability StorageImageArrayDynamicIndexing
OpCapability GroupNonUniformBallot
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
OpEntryPoint MissKHR %3 "main" %8 %16 %24 %27
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %14 "SBTBlock"
OpName %16 "SBT"
OpName %21 "BindlessCBV"
OpName %25 ""
OpName %27 "payload"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %10 ArrayStride 4
OpDecorate %12 ArrayStride 4
OpDecorate %14 Block
OpMemberDecorate %14 0 Offset 0
OpMemberDecorate %14 1 Offset 20
OpMemberDecorate %14 2 Offset 48
OpMemberDecorate %14 3 Offset 56
OpMemberDecorate %14 4 Offset 64
OpMemberDecorate %14 5 Offset 72
OpMemberDecorate %14 6 Offset 80
OpMemberDecorate %14 7 Offset 88
OpMemberDecorate %14 8 Offset 96
OpMemberDecorate %14 9 Offset 104
OpMemberDecorate %14 10 Offset 112
OpDecorate %20 ArrayStride 16
OpDecorate %21 Block
OpMemberDecorate %21 0 Offset 0
OpDecorate %24 DescriptorSet 5
OpDecorate %24 Binding 0
OpDecorate %32 NonUniform
OpDecorate %74 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpConstant %5 5
%10 = OpTypeArray %5 %9
%11 = OpConstant %5 6
%12 = OpTypeArray %5 %11
%13 = OpTypeVector %5 2
%14 = OpTypeStruct %10 %12 %13 %13 %13 %13 %13 %13 %13 %13 %13
%15 = OpTypePointer ShaderRecordBufferKHR %14
%16 = OpVariable %15 ShaderRecordBufferKHR
%17 = OpTypeFloat 32
%18 = OpTypeVector %17 4
%19 = OpConstant %5 4096
%20 = OpTypeArray %18 %19
%21 = OpTypeStruct %20
%22 = OpTypeRuntimeArray %21
%23 = OpTypePointer Uniform %22
%24 = OpVariable %23 Uniform
%25 = OpTypeStruct %18 %5
%26 = OpTypePointer IncomingRayPayloadKHR %25
%27 = OpVariable %26 IncomingRayPayloadKHR
%28 = OpTypePointer ShaderRecordBufferKHR %10
%30 = OpConstant %5 0
%31 = OpTypePointer Uniform %21
%33 = OpTypePointer ShaderRecordBufferKHR %5
%35 = OpConstant %5 9
%39 = OpConstant %5 12
%43 = OpConstant %5 1
%46 = OpConstant %5 2
%49 = OpConstant %5 3
%51 = OpTypeVector %5 4
%62 = OpTypePointer IncomingRayPayloadKHR %18
%73 = OpTypePointer Uniform %18
%3 = OpFunction %1 None %2
%4 = OpLabel
%89 = OpUndef %18
OpBranch %93
%93 = OpLabel
%29 = OpAccessChain %28 %16 %30
%34 = OpAccessChain %33 %16 %35 %30
%36 = OpLoad %5 %34
%37 = OpShiftRightLogical %5 %36 %11
%38 = OpIAdd %5 %37 %39
%32 = OpAccessChain %31 %24 %38
%40 = OpAccessChain %33 %29 %30
%41 = OpLoad %5 %40
%42 = OpAccessChain %33 %29 %43
%44 = OpLoad %5 %42
%45 = OpAccessChain %33 %29 %46
%47 = OpLoad %5 %45
%48 = OpAccessChain %33 %29 %49
%50 = OpLoad %5 %48
%52 = OpCompositeConstruct %51 %41 %44 %47 %50
%53 = OpBitcast %18 %52
%54 = OpCompositeExtract %17 %53 0
%55 = OpCompositeExtract %17 %53 1
%56 = OpCompositeExtract %17 %53 2
%57 = OpCompositeExtract %17 %53 3
%58 = OpGroupNonUniformBroadcastFirst %17 %49 %54
%59 = OpGroupNonUniformBroadcastFirst %17 %49 %55
%60 = OpGroupNonUniformBroadcastFirst %17 %49 %56
%61 = OpGroupNonUniformBroadcastFirst %17 %49 %57
%63 = OpInBoundsAccessChain %62 %27 %30
%64 = OpLoad %18 %63
%65 = OpCompositeExtract %17 %64 0
%66 = OpFAdd %17 %65 %58
%67 = OpCompositeExtract %17 %64 1
%68 = OpFAdd %17 %67 %59
%69 = OpCompositeExtract %17 %64 2
%70 = OpFAdd %17 %69 %60
%71 = OpCompositeExtract %17 %64 3
%72 = OpFAdd %17 %71 %61
%74 = OpAccessChain %73 %32 %30 %30
%75 = OpLoad %18 %74
%76 = OpCompositeExtract %17 %75 0
%77 = OpCompositeExtract %17 %75 1
%78 = OpCompositeExtract %17 %75 2
%79 = OpCompositeExtract %17 %75 3
%80 = OpGroupNonUniformBroadcastFirst %17 %49 %76
%81 = OpGroupNonUniformBroadcastFirst %17 %49 %77
%82 = OpGroupNonUniformBroadcastFirst %17 %49 %78
%83 = OpGroupNonUniformBroadcastFirst %17 %49 %79
%84 = OpFAdd %17 %66 %80
%85 = OpFAdd %17 %68 %81
%86 = OpFAdd %17 %70 %82
%87 = OpFAdd %17 %72 %83
%88 = OpCompositeInsert %18 %84 %89 0
%90 = OpCompositeInsert %18 %85 %88 1
%91 = OpCompositeInsert %18 %86 %90 2
%92 = OpCompositeInsert %18 %87 %91 3
OpStore %63 %92
OpReturn
OpFunctionEnd
#endif
