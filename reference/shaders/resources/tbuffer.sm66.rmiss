#version 460
#extension GL_EXT_ray_tracing : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

struct _12
{
    vec4 _m0;
    vec3 _m1;
};

vec4 _22;
vec3 _37;

layout(set = 0, binding = 0) uniform usamplerBuffer TB;
layout(location = 0) rayPayloadInEXT _12 payload;

void main()
{
    uvec4 _18 = texelFetch(TB, int(0u));
    vec4 _21;
    _21.x = uintBitsToFloat(_18.x);
    _21.y = uintBitsToFloat(_18.y);
    _21.z = uintBitsToFloat(_18.z);
    _21.w = uintBitsToFloat(_18.w);
    uvec4 _33 = texelFetch(TB, int(1u));
    vec3 _36;
    _36.x = uintBitsToFloat(_33.x);
    _36.y = uintBitsToFloat(_33.y);
    _36.z = uintBitsToFloat(_33.z);
    payload._m0 = _21;
    payload._m1 = _36;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 49
; Schema: 0
OpCapability Shader
OpCapability UniformBufferArrayDynamicIndexing
OpCapability SampledImageArrayDynamicIndexing
OpCapability StorageBufferArrayDynamicIndexing
OpCapability StorageImageArrayDynamicIndexing
OpCapability SampledBuffer
OpCapability RayTracingKHR
OpCapability RuntimeDescriptorArray
OpCapability UniformBufferArrayNonUniformIndexing
OpCapability SampledImageArrayNonUniformIndexing
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability StorageImageArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_ray_tracing"
OpMemoryModel Logical Vulkan
OpEntryPoint MissKHR %3 "main" %8 %14
OpName %3 "main"
OpName %8 "TB"
OpName %12 ""
OpName %14 "payload"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeFloat 32
%10 = OpTypeVector %9 4
%11 = OpTypeVector %9 3
%12 = OpTypeStruct %10 %11
%13 = OpTypePointer IncomingRayPayloadKHR %12
%14 = OpVariable %13 IncomingRayPayloadKHR
%16 = OpConstant %5 0
%17 = OpTypeVector %5 4
%32 = OpConstant %5 1
%44 = OpTypePointer IncomingRayPayloadKHR %10
%46 = OpTypePointer IncomingRayPayloadKHR %11
%3 = OpFunction %1 None %2
%4 = OpLabel
%22 = OpUndef %10
%37 = OpUndef %11
OpBranch %48
%48 = OpLabel
%15 = OpLoad %6 %8
%18 = OpImageFetch %17 %15 %16
%19 = OpCompositeExtract %5 %18 0
%20 = OpBitcast %9 %19
%21 = OpCompositeInsert %10 %20 %22 0
%23 = OpCompositeExtract %5 %18 1
%24 = OpBitcast %9 %23
%25 = OpCompositeInsert %10 %24 %21 1
%26 = OpCompositeExtract %5 %18 2
%27 = OpBitcast %9 %26
%28 = OpCompositeInsert %10 %27 %25 2
%29 = OpCompositeExtract %5 %18 3
%30 = OpBitcast %9 %29
%31 = OpCompositeInsert %10 %30 %28 3
%33 = OpImageFetch %17 %15 %32
%34 = OpCompositeExtract %5 %33 0
%35 = OpBitcast %9 %34
%36 = OpCompositeInsert %11 %35 %37 0
%38 = OpCompositeExtract %5 %33 1
%39 = OpBitcast %9 %38
%40 = OpCompositeInsert %11 %39 %36 1
%41 = OpCompositeExtract %5 %33 2
%42 = OpBitcast %9 %41
%43 = OpCompositeInsert %11 %42 %40 2
%45 = OpInBoundsAccessChain %44 %14 %16
OpStore %45 %31
%47 = OpInBoundsAccessChain %46 %14 %32
OpStore %47 %43
OpReturn
OpFunctionEnd
#endif
