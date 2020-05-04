#version 460
#extension GL_ARB_gpu_shader_int64 : require
#extension GL_NV_ray_tracing : require
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

struct _24
{
    vec4 _m0;
    uint _m1;
};

struct _28
{
    uint _m0;
};

struct _29
{
    vec4 _m0;
    _28 _m1;
};

layout(shaderRecordNV, std430) buffer SBTBlock
{
    uint _m0[5];
    uint _m1[6];
    uint64_t _m2;
    uint64_t _m3;
    uint64_t _m4;
    uvec2 _m5;
    uvec2 _m6;
    uvec2 _m7;
    uvec2 _m8;
} SBT;

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

layout(set = 0, binding = 0) uniform texture2D _22[];
layout(location = 0) rayPayloadInNV _24 payload;

_29 _32[2];

vec4 _91;

void main()
{
    vec4 _48 = texelFetch(_22[nonuniformEXT(registers._m0 + (payload._m1 & 1u))], ivec2(uvec2(0u)), int(0u));
    vec4 _61 = texelFetch(_22[nonuniformEXT(registers._m0 + payload._m1)], ivec2(uvec2(0u)), int(0u));
    vec4 _80 = texelFetch(_22[nonuniformEXT(((SBT._m5.x >> 6u) + 17u) + payload._m1)], ivec2(uvec2(0u)), int(0u));
    vec4 _90 = _91;
    _90.x = (_48.x + _61.x) + _80.x;
    vec4 _92 = _90;
    _92.y = (_48.y + _61.y) + _80.y;
    vec4 _93 = _92;
    _93.z = (_48.z + _61.z) + _80.z;
    vec4 _94 = _93;
    _94.w = (_48.w + _61.w) + _80.w;
    payload._m0 = _94;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 97
; Schema: 0
OpCapability Shader
OpCapability Int64
OpCapability UniformBufferArrayDynamicIndexing
OpCapability SampledImageArrayDynamicIndexing
OpCapability StorageBufferArrayDynamicIndexing
OpCapability StorageImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability UniformBufferArrayNonUniformIndexing
OpCapability SampledImageArrayNonUniformIndexing
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability StorageImageArrayNonUniformIndexing
OpCapability PhysicalStorageBufferAddresses
OpCapability RayTracingProvisionalKHR
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpExtension "SPV_KHR_ray_tracing"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint MissNV %3 "main"
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %15 "SBTBlock"
OpName %17 "SBT"
OpName %24 ""
OpName %26 "payload"
OpName %28 ""
OpName %29 ""
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
OpDecorate %15 Block
OpMemberDecorate %15 0 Offset 0
OpMemberDecorate %15 1 Offset 20
OpMemberDecorate %15 2 Offset 48
OpMemberDecorate %15 3 Offset 56
OpMemberDecorate %15 4 Offset 64
OpMemberDecorate %15 5 Offset 72
OpMemberDecorate %15 6 Offset 80
OpMemberDecorate %15 7 Offset 88
OpMemberDecorate %15 8 Offset 96
OpDecorate %22 DescriptorSet 0
OpDecorate %22 Binding 0
OpDecorate %26 Location 0
OpDecorate %37 NonUniform
OpDecorate %45 NonUniform
OpDecorate %36 NonUniform
OpDecorate %60 NonUniform
OpDecorate %36 NonUniform
OpDecorate %79 NonUniform
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
%13 = OpTypeInt 64 0
%14 = OpTypeVector %5 2
%15 = OpTypeStruct %10 %12 %13 %13 %13 %14 %14 %14 %14
%16 = OpTypePointer ShaderRecordBufferNV %15
%17 = OpVariable %16 ShaderRecordBufferNV
%18 = OpTypeFloat 32
%19 = OpTypeImage %18 2D 0 0 0 1 Unknown
%20 = OpTypeRuntimeArray %19
%21 = OpTypePointer UniformConstant %20
%22 = OpVariable %21 UniformConstant
%23 = OpTypeVector %18 4
%24 = OpTypeStruct %23 %5
%25 = OpTypePointer IncomingRayPayloadNV %24
%26 = OpVariable %25 IncomingRayPayloadNV
%27 = OpConstant %5 2
%28 = OpTypeStruct %5
%29 = OpTypeStruct %23 %28
%30 = OpTypeArray %29 %27
%31 = OpTypePointer Private %30
%32 = OpVariable %31 Private
%33 = OpTypePointer IncomingRayPayloadNV %5
%35 = OpConstant %5 1
%38 = OpTypePointer UniformConstant %19
%40 = OpTypePointer PushConstant %5
%42 = OpConstant %5 0
%46 = OpTypeInt 32 1
%47 = OpConstant %46 0
%54 = OpTypePointer IncomingRayPayloadNV %23
%72 = OpTypePointer ShaderRecordBufferNV %5
%77 = OpConstant %5 17
%3 = OpFunction %1 None %2
%4 = OpLabel
%91 = OpUndef %23
OpBranch %95
%95 = OpLabel
%34 = OpInBoundsAccessChain %33 %26 %35
%36 = OpLoad %5 %34
%37 = OpBitwiseAnd %5 %36 %35
%41 = OpAccessChain %40 %8 %42
%43 = OpLoad %5 %41
%44 = OpIAdd %5 %43 %37
%39 = OpAccessChain %38 %22 %44
%45 = OpLoad %19 %39
%49 = OpCompositeConstruct %14 %42 %42
%48 = OpImageFetch %23 %45 %49 Lod %42
%50 = OpCompositeExtract %18 %48 0
%51 = OpCompositeExtract %18 %48 1
%52 = OpCompositeExtract %18 %48 2
%53 = OpCompositeExtract %18 %48 3
%55 = OpInBoundsAccessChain %54 %26 %42
%57 = OpAccessChain %40 %8 %42
%58 = OpLoad %5 %57
%59 = OpIAdd %5 %58 %36
%56 = OpAccessChain %38 %22 %59
%60 = OpLoad %19 %56
%62 = OpCompositeConstruct %14 %42 %42
%61 = OpImageFetch %23 %60 %62 Lod %42
%63 = OpCompositeExtract %18 %61 0
%64 = OpCompositeExtract %18 %61 1
%65 = OpCompositeExtract %18 %61 2
%66 = OpCompositeExtract %18 %61 3
%67 = OpFAdd %18 %50 %63
%68 = OpFAdd %18 %51 %64
%69 = OpFAdd %18 %52 %65
%70 = OpFAdd %18 %53 %66
%73 = OpAccessChain %72 %17 %9 %42
%74 = OpLoad %5 %73
%75 = OpShiftRightLogical %5 %74 %11
%76 = OpIAdd %5 %75 %77
%78 = OpIAdd %5 %76 %36
%71 = OpAccessChain %38 %22 %78
%79 = OpLoad %19 %71
%81 = OpCompositeConstruct %14 %42 %42
%80 = OpImageFetch %23 %79 %81 Lod %42
%82 = OpCompositeExtract %18 %80 0
%83 = OpCompositeExtract %18 %80 1
%84 = OpCompositeExtract %18 %80 2
%85 = OpCompositeExtract %18 %80 3
%86 = OpFAdd %18 %67 %82
%87 = OpFAdd %18 %68 %83
%88 = OpFAdd %18 %69 %84
%89 = OpFAdd %18 %70 %85
%90 = OpCompositeInsert %23 %86 %91 0
%92 = OpCompositeInsert %23 %87 %90 1
%93 = OpCompositeInsert %23 %88 %92 2
%94 = OpCompositeInsert %23 %89 %93 3
OpStore %55 %94
OpReturn
OpFunctionEnd
#endif
