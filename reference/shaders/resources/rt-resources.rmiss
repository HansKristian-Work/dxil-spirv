#version 460
#extension GL_NV_ray_tracing : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

struct _16
{
    vec4 _m0;
    uint _m1;
};

struct _19
{
    uint _m0;
};

struct _20
{
    vec4 _m0;
    _19 _m1;
};

layout(set = 0, binding = 0) uniform texture2D Tex[2];
layout(set = 1, binding = 0) uniform texture2D TexUnsized[];
layout(location = 0) rayPayloadInNV _16 payload;

_20 _23[2];

vec4 _57;

void main()
{
    vec4 _35 = texelFetch(Tex[nonuniformEXT(payload._m1 & 1u)], ivec2(uvec2(0u)), int(0u));
    vec4 _46 = texelFetch(TexUnsized[nonuniformEXT(payload._m1)], ivec2(uvec2(0u)), int(0u));
    vec4 _56 = _57;
    _56.x = _35.x + _46.x;
    vec4 _58 = _56;
    _58.y = _35.y + _46.y;
    vec4 _59 = _58;
    _59.z = _35.z + _46.z;
    vec4 _60 = _59;
    _60.w = _35.w + _46.w;
    payload._m0 = _60;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 63
; Schema: 0
OpCapability Shader
OpCapability UniformBufferArrayDynamicIndexing
OpCapability SampledImageArrayDynamicIndexing
OpCapability StorageBufferArrayDynamicIndexing
OpCapability StorageImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability UniformBufferArrayNonUniformIndexing
OpCapability SampledImageArrayNonUniformIndexing
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability StorageImageArrayNonUniformIndexing
OpCapability RayTracingProvisionalKHR
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_ray_tracing"
OpMemoryModel Logical GLSL450
OpEntryPoint MissNV %3 "main"
OpName %3 "main"
OpName %11 "Tex"
OpName %14 "TexUnsized"
OpName %16 ""
OpName %18 "payload"
OpName %19 ""
OpName %20 ""
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 0
OpDecorate %18 Location 0
OpDecorate %28 NonUniform
OpDecorate %31 NonUniform
OpDecorate %27 NonUniform
OpDecorate %45 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypeInt 32 0
%8 = OpConstant %7 2
%9 = OpTypeArray %6 %8
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeRuntimeArray %6
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeVector %5 4
%16 = OpTypeStruct %15 %7
%17 = OpTypePointer IncomingRayPayloadNV %16
%18 = OpVariable %17 IncomingRayPayloadNV
%19 = OpTypeStruct %7
%20 = OpTypeStruct %15 %19
%21 = OpTypeArray %20 %8
%22 = OpTypePointer Private %21
%23 = OpVariable %22 Private
%24 = OpTypePointer IncomingRayPayloadNV %7
%26 = OpConstant %7 1
%29 = OpTypePointer UniformConstant %6
%32 = OpConstant %7 0
%33 = OpTypeInt 32 1
%34 = OpConstant %33 0
%36 = OpTypeVector %7 2
%42 = OpTypePointer IncomingRayPayloadNV %15
%3 = OpFunction %1 None %2
%4 = OpLabel
%57 = OpUndef %15
OpBranch %61
%61 = OpLabel
%25 = OpInBoundsAccessChain %24 %18 %26
%27 = OpLoad %7 %25
%28 = OpBitwiseAnd %7 %27 %26
%30 = OpAccessChain %29 %11 %28
%31 = OpLoad %6 %30
%37 = OpCompositeConstruct %36 %32 %32
%35 = OpImageFetch %15 %31 %37 Lod %32
%38 = OpCompositeExtract %5 %35 0
%39 = OpCompositeExtract %5 %35 1
%40 = OpCompositeExtract %5 %35 2
%41 = OpCompositeExtract %5 %35 3
%43 = OpInBoundsAccessChain %42 %18 %32
%44 = OpAccessChain %29 %14 %27
%45 = OpLoad %6 %44
%47 = OpCompositeConstruct %36 %32 %32
%46 = OpImageFetch %15 %45 %47 Lod %32
%48 = OpCompositeExtract %5 %46 0
%49 = OpCompositeExtract %5 %46 1
%50 = OpCompositeExtract %5 %46 2
%51 = OpCompositeExtract %5 %46 3
%52 = OpFAdd %5 %38 %48
%53 = OpFAdd %5 %39 %49
%54 = OpFAdd %5 %40 %50
%55 = OpFAdd %5 %41 %51
%56 = OpCompositeInsert %15 %52 %57 0
%58 = OpCompositeInsert %15 %53 %56 1
%59 = OpCompositeInsert %15 %54 %58 2
%60 = OpCompositeInsert %15 %55 %59 3
OpStore %43 %60
OpReturn
OpFunctionEnd
#endif
