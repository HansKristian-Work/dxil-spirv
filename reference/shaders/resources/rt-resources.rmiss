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
rayPayloadInEXT _16 payload;

vec4 _52;

void main()
{
    vec4 _30 = texelFetch(Tex[payload._m1 & 1u], ivec2(uvec2(0u)), int(0u));
    vec4 _41 = texelFetch(TexUnsized[payload._m1], ivec2(uvec2(0u)), int(0u));
    vec4 _51 = _52;
    _51.x = _30.x + _41.x;
    vec4 _53 = _51;
    _53.y = _30.y + _41.y;
    vec4 _54 = _53;
    _54.z = _30.z + _41.z;
    vec4 _55 = _54;
    _55.w = _30.w + _41.w;
    payload._m0 = _55;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.4
; Generator: Unknown(30017); 21022
; Bound: 57
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
%28 = OpTypeInt 32 1
%29 = OpConstant %28 0
%31 = OpTypeVector %7 2
%37 = OpTypePointer IncomingRayPayloadNV %15
%3 = OpFunction %1 None %2
%4 = OpLabel
%52 = OpUndef %15
OpBranch %56
%56 = OpLabel
%20 = OpInBoundsAccessChain %19 %18 %21
%22 = OpLoad %7 %20
%23 = OpBitwiseAnd %7 %22 %21
%25 = OpAccessChain %24 %11 %23
%26 = OpLoad %6 %25
%32 = OpCompositeConstruct %31 %27 %27
%30 = OpImageFetch %15 %26 %32 Lod %27
%33 = OpCompositeExtract %5 %30 0
%34 = OpCompositeExtract %5 %30 1
%35 = OpCompositeExtract %5 %30 2
%36 = OpCompositeExtract %5 %30 3
%38 = OpInBoundsAccessChain %37 %18 %27
%39 = OpAccessChain %24 %14 %22
%40 = OpLoad %6 %39
%42 = OpCompositeConstruct %31 %27 %27
%41 = OpImageFetch %15 %40 %42 Lod %27
%43 = OpCompositeExtract %5 %41 0
%44 = OpCompositeExtract %5 %41 1
%45 = OpCompositeExtract %5 %41 2
%46 = OpCompositeExtract %5 %41 3
%47 = OpFAdd %5 %33 %43
%48 = OpFAdd %5 %34 %44
%49 = OpFAdd %5 %35 %45
%50 = OpFAdd %5 %36 %46
%51 = OpCompositeInsert %15 %47 %52 0
%53 = OpCompositeInsert %15 %48 %51 1
%54 = OpCompositeInsert %15 %49 %53 2
%55 = OpCompositeInsert %15 %50 %54 3
OpStore %38 %55
OpReturn
OpFunctionEnd
#endif
