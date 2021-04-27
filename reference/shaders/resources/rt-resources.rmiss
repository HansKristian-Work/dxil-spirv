#version 460
#extension GL_EXT_ray_tracing : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

struct _16
{
    vec4 _m0;
    uint _m1;
};

layout(set = 0, binding = 0) uniform texture2D Tex[2];
layout(set = 1, binding = 0) uniform texture2D TexUnsized[];
layout(location = 0) rayPayloadInEXT _16 payload;

vec4 _50;

void main()
{
    vec4 _28 = texelFetch(Tex[payload._m1 & 1u], ivec2(uvec2(0u)), int(0u));
    vec4 _39 = texelFetch(TexUnsized[payload._m1], ivec2(uvec2(0u)), int(0u));
    vec4 _49 = _50;
    _49.x = _28.x + _39.x;
    vec4 _51 = _49;
    _51.y = _28.y + _39.y;
    vec4 _52 = _51;
    _52.z = _28.z + _39.z;
    vec4 _53 = _52;
    _53.w = _28.w + _39.w;
    payload._m0 = _53;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.4
; Generator: Unknown(30017); 21022
; Bound: 56
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
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_ray_tracing"
OpMemoryModel Logical GLSL450
OpEntryPoint MissNV %3 "main" %11 %14 %18
OpName %3 "main"
OpName %11 "Tex"
OpName %14 "TexUnsized"
OpName %16 ""
OpName %18 "payload"
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 0
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
%19 = OpTypePointer IncomingRayPayloadNV %7
%21 = OpConstant %7 1
%24 = OpTypePointer UniformConstant %6
%27 = OpConstant %7 0
%29 = OpTypeVector %7 2
%35 = OpTypePointer IncomingRayPayloadNV %15
%3 = OpFunction %1 None %2
%4 = OpLabel
%50 = OpUndef %15
OpBranch %54
%54 = OpLabel
%20 = OpInBoundsAccessChain %19 %18 %21
%22 = OpLoad %7 %20
%23 = OpBitwiseAnd %7 %22 %21
%25 = OpAccessChain %24 %11 %23
%26 = OpLoad %6 %25
%30 = OpCompositeConstruct %29 %27 %27
%28 = OpImageFetch %15 %26 %30 Lod %27
%31 = OpCompositeExtract %5 %28 0
%32 = OpCompositeExtract %5 %28 1
%33 = OpCompositeExtract %5 %28 2
%34 = OpCompositeExtract %5 %28 3
%36 = OpInBoundsAccessChain %35 %18 %27
%37 = OpAccessChain %24 %14 %22
%38 = OpLoad %6 %37
%40 = OpCompositeConstruct %29 %27 %27
%39 = OpImageFetch %15 %38 %40 Lod %27
%41 = OpCompositeExtract %5 %39 0
%42 = OpCompositeExtract %5 %39 1
%43 = OpCompositeExtract %5 %39 2
%44 = OpCompositeExtract %5 %39 3
%45 = OpFAdd %5 %31 %41
%46 = OpFAdd %5 %32 %42
%47 = OpFAdd %5 %33 %43
%48 = OpFAdd %5 %34 %44
%49 = OpCompositeInsert %15 %45 %50 0
%51 = OpCompositeInsert %15 %46 %49 1
%52 = OpCompositeInsert %15 %47 %51 2
%53 = OpCompositeInsert %15 %48 %52 3
OpStore %36 %53
OpReturn
OpFunctionEnd
#endif
