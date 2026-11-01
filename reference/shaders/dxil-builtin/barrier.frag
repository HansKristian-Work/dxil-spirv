#version 460

layout(set = 0, binding = 1, r32ui) uniform uimageBuffer _8;

layout(location = 0) flat in uint I;
layout(location = 0) out vec4 SV_Target;

void main()
{
    imageStore(_8, int(I), uvec4(1u));
    memoryBarrierBuffer();
    memoryBarrierImage();
    float _24 = float(imageLoad(_8, int(I + 1u)).x);
    SV_Target.x = _24;
    SV_Target.y = _24;
    SV_Target.z = _24;
    SV_Target.w = _24;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 34
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpCapability VulkanMemoryModel
OpCapability VulkanMemoryModelDeviceScope
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %10 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "I"
OpName %14 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 1
OpDecorate %10 Flat
OpDecorate %10 Location 0
OpDecorate %14 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypePointer Input %5
%10 = OpVariable %9 Input
%11 = OpTypeFloat 32
%12 = OpTypeVector %11 4
%13 = OpTypePointer Output %12
%14 = OpVariable %13 Output
%17 = OpConstant %5 1
%18 = OpTypeVector %5 4
%20 = OpConstant %5 26696
%25 = OpTypePointer Output %11
%27 = OpConstant %5 0
%30 = OpConstant %5 2
%32 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %33
%33 = OpLabel
%15 = OpLoad %6 %8
%16 = OpLoad %5 %10
%19 = OpCompositeConstruct %18 %17 %17 %17 %17
OpImageWrite %15 %16 %19 NonPrivateTexel
OpMemoryBarrier %17 %20
%21 = OpIAdd %5 %16 %17
%22 = OpImageRead %18 %15 %21 NonPrivateTexel
%23 = OpCompositeExtract %5 %22 0
%24 = OpConvertUToF %11 %23
%26 = OpAccessChain %25 %14 %27
OpStore %26 %24
%28 = OpAccessChain %25 %14 %17
OpStore %28 %24
%29 = OpAccessChain %25 %14 %30
OpStore %29 %24
%31 = OpAccessChain %25 %14 %32
OpStore %31 %24
OpReturn
OpFunctionEnd
#endif
