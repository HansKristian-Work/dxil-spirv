#version 460
#extension GL_EXT_ray_tracing : require
#extension GL_EXT_nonuniform_qualifier : require

struct _11
{
    vec4 _m0;
};

layout(set = 0, binding = 0) uniform accelerationStructureEXT AS;
rayPayloadInEXT _11 payload;
layout(location = 0) rayPayloadEXT _11 _15;

void main()
{
    _15._m0 = payload._m0;
    traceRayEXT(AS, 0u, 0u, 0u, 0u, 0u, vec3(1.0, 2.0, 3.0), 1.0, vec3(0.0, 0.0, 1.0), 4.0, 0);
    payload._m0 = _15._m0;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.4
; Generator: Unknown(30017); 21022
; Bound: 34
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
OpEntryPoint MissNV %3 "main" %8 %13 %15
OpName %3 "main"
OpName %8 "AS"
OpName %11 ""
OpName %13 "payload"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
%6 = OpTypeAccelerationStructureKHR
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeFloat 32
%10 = OpTypeVector %9 4
%11 = OpTypeStruct %10
%12 = OpTypePointer IncomingRayPayloadNV %11
%13 = OpVariable %12 IncomingRayPayloadNV
%14 = OpTypePointer RayPayloadNV %11
%15 = OpVariable %14 RayPayloadNV
%16 = OpTypePointer IncomingRayPayloadNV %10
%18 = OpTypeInt 32 0
%19 = OpConstant %18 0
%21 = OpTypePointer RayPayloadNV %10
%24 = OpConstant %9 1
%25 = OpConstant %9 0
%26 = OpConstant %9 2
%27 = OpConstant %9 3
%28 = OpConstant %9 4
%29 = OpTypeVector %9 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %33
%33 = OpLabel
%17 = OpInBoundsAccessChain %16 %13 %19
%20 = OpLoad %10 %17
%22 = OpInBoundsAccessChain %21 %15 %19
OpStore %22 %20
%23 = OpLoad %6 %8
%30 = OpCompositeConstruct %29 %24 %26 %27
%31 = OpCompositeConstruct %29 %25 %25 %24
OpTraceRayKHR %23 %19 %19 %19 %19 %19 %30 %24 %31 %28 %15
%32 = OpLoad %10 %22
OpStore %17 %32
OpReturn
OpFunctionEnd
#endif
