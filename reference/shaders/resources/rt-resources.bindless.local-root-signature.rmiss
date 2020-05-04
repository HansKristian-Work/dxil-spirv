#version 460
#extension GL_ARB_gpu_shader_int64 : require
#extension GL_NV_ray_tracing : require
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

struct _28
{
    vec4 _m0;
    uint _m1;
};

struct _32
{
    uint _m0;
};

struct _33
{
    vec4 _m0;
    _32 _m1;
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
layout(set = 3, binding = 0, r32f) uniform readonly image2D _26[];
layout(location = 0) rayPayloadInNV _28 payload;

_33 _36[2];

vec4 _114;

void main()
{
    vec4 _52 = texelFetch(_22[nonuniformEXT(registers._m0 + (payload._m1 & 1u))], ivec2(uvec2(0u)), int(0u));
    vec4 _65 = texelFetch(_22[nonuniformEXT(registers._m0 + payload._m1)], ivec2(uvec2(0u)), int(0u));
    vec4 _84 = texelFetch(_22[nonuniformEXT(((SBT._m5.x >> 6u) + 17u) + payload._m1)], ivec2(uvec2(0u)), int(0u));
    vec4 _103 = imageLoad(_26[nonuniformEXT(((SBT._m6.x >> 6u) + 18u) + payload._m1)], ivec2(uvec2(0u)));
    vec4 _113 = _114;
    _113.x = ((_52.x + _65.x) + _84.x) + _103.x;
    vec4 _115 = _113;
    _115.y = ((_52.y + _65.y) + _84.y) + _103.y;
    vec4 _116 = _115;
    _116.z = ((_52.z + _65.z) + _84.z) + _103.z;
    vec4 _117 = _116;
    _117.w = ((_52.w + _65.w) + _84.w) + _103.w;
    payload._m0 = _117;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 120
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
OpName %28 ""
OpName %30 "payload"
OpName %32 ""
OpName %33 ""
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
OpDecorate %26 DescriptorSet 3
OpDecorate %26 Binding 0
OpDecorate %26 NonWritable
OpDecorate %30 Location 0
OpDecorate %41 NonUniform
OpDecorate %49 NonUniform
OpDecorate %40 NonUniform
OpDecorate %64 NonUniform
OpDecorate %40 NonUniform
OpDecorate %83 NonUniform
OpDecorate %40 NonUniform
OpDecorate %102 NonUniform
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
%23 = OpTypeImage %18 2D 0 0 0 2 R32f
%24 = OpTypeRuntimeArray %23
%25 = OpTypePointer UniformConstant %24
%26 = OpVariable %25 UniformConstant
%27 = OpTypeVector %18 4
%28 = OpTypeStruct %27 %5
%29 = OpTypePointer IncomingRayPayloadNV %28
%30 = OpVariable %29 IncomingRayPayloadNV
%31 = OpConstant %5 2
%32 = OpTypeStruct %5
%33 = OpTypeStruct %27 %32
%34 = OpTypeArray %33 %31
%35 = OpTypePointer Private %34
%36 = OpVariable %35 Private
%37 = OpTypePointer IncomingRayPayloadNV %5
%39 = OpConstant %5 1
%42 = OpTypePointer UniformConstant %19
%44 = OpTypePointer PushConstant %5
%46 = OpConstant %5 0
%50 = OpTypeInt 32 1
%51 = OpConstant %50 0
%58 = OpTypePointer IncomingRayPayloadNV %27
%76 = OpTypePointer ShaderRecordBufferNV %5
%81 = OpConstant %5 17
%94 = OpTypePointer UniformConstant %23
%100 = OpConstant %5 18
%3 = OpFunction %1 None %2
%4 = OpLabel
%114 = OpUndef %27
OpBranch %118
%118 = OpLabel
%38 = OpInBoundsAccessChain %37 %30 %39
%40 = OpLoad %5 %38
%41 = OpBitwiseAnd %5 %40 %39
%45 = OpAccessChain %44 %8 %46
%47 = OpLoad %5 %45
%48 = OpIAdd %5 %47 %41
%43 = OpAccessChain %42 %22 %48
%49 = OpLoad %19 %43
%53 = OpCompositeConstruct %14 %46 %46
%52 = OpImageFetch %27 %49 %53 Lod %46
%54 = OpCompositeExtract %18 %52 0
%55 = OpCompositeExtract %18 %52 1
%56 = OpCompositeExtract %18 %52 2
%57 = OpCompositeExtract %18 %52 3
%59 = OpInBoundsAccessChain %58 %30 %46
%61 = OpAccessChain %44 %8 %46
%62 = OpLoad %5 %61
%63 = OpIAdd %5 %62 %40
%60 = OpAccessChain %42 %22 %63
%64 = OpLoad %19 %60
%66 = OpCompositeConstruct %14 %46 %46
%65 = OpImageFetch %27 %64 %66 Lod %46
%67 = OpCompositeExtract %18 %65 0
%68 = OpCompositeExtract %18 %65 1
%69 = OpCompositeExtract %18 %65 2
%70 = OpCompositeExtract %18 %65 3
%71 = OpFAdd %18 %54 %67
%72 = OpFAdd %18 %55 %68
%73 = OpFAdd %18 %56 %69
%74 = OpFAdd %18 %57 %70
%77 = OpAccessChain %76 %17 %9 %46
%78 = OpLoad %5 %77
%79 = OpShiftRightLogical %5 %78 %11
%80 = OpIAdd %5 %79 %81
%82 = OpIAdd %5 %80 %40
%75 = OpAccessChain %42 %22 %82
%83 = OpLoad %19 %75
%85 = OpCompositeConstruct %14 %46 %46
%84 = OpImageFetch %27 %83 %85 Lod %46
%86 = OpCompositeExtract %18 %84 0
%87 = OpCompositeExtract %18 %84 1
%88 = OpCompositeExtract %18 %84 2
%89 = OpCompositeExtract %18 %84 3
%90 = OpFAdd %18 %71 %86
%91 = OpFAdd %18 %72 %87
%92 = OpFAdd %18 %73 %88
%93 = OpFAdd %18 %74 %89
%96 = OpAccessChain %76 %17 %11 %46
%97 = OpLoad %5 %96
%98 = OpShiftRightLogical %5 %97 %11
%99 = OpIAdd %5 %98 %100
%101 = OpIAdd %5 %99 %40
%95 = OpAccessChain %94 %26 %101
%102 = OpLoad %23 %95
%104 = OpCompositeConstruct %14 %46 %46
%103 = OpImageRead %27 %102 %104 None
%105 = OpCompositeExtract %18 %103 0
%106 = OpCompositeExtract %18 %103 1
%107 = OpCompositeExtract %18 %103 2
%108 = OpCompositeExtract %18 %103 3
%109 = OpFAdd %18 %90 %105
%110 = OpFAdd %18 %91 %106
%111 = OpFAdd %18 %92 %107
%112 = OpFAdd %18 %93 %108
%113 = OpCompositeInsert %27 %109 %114 0
%115 = OpCompositeInsert %27 %110 %113 1
%116 = OpCompositeInsert %27 %111 %115 2
%117 = OpCompositeInsert %27 %112 %116 3
OpStore %59 %117
OpReturn
OpFunctionEnd
#endif
