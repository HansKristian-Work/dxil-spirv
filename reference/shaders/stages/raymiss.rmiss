#version 460
#extension GL_EXT_ray_tracing : require
#extension GL_EXT_nonuniform_qualifier : require

struct _7
{
    vec4 _m0;
};

layout(location = 0) rayPayloadInEXT _7 payload;

void main()
{
    payload._m0 = vec4(1.0, 2.0, 3.0, 4.0);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.4
; Generator: Unknown(30017); 21022
; Bound: 21
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
OpEntryPoint MissKHR %3 "main" %9
OpName %3 "main"
OpName %7 ""
OpName %9 "payload"
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeStruct %6
%8 = OpTypePointer IncomingRayPayloadKHR %7
%9 = OpVariable %8 IncomingRayPayloadKHR
%10 = OpTypePointer IncomingRayPayloadKHR %6
%12 = OpTypeInt 32 0
%13 = OpConstant %12 0
%14 = OpConstant %5 1
%15 = OpConstant %5 2
%16 = OpConstant %5 3
%17 = OpConstant %5 4
%18 = OpConstantComposite %6 %14 %15 %16 %17
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %19
%19 = OpLabel
%11 = OpInBoundsAccessChain %10 %9 %13
OpStore %11 %18
OpReturn
OpFunctionEnd
#endif
