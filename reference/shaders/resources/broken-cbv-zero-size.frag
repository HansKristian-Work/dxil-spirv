#version 460

layout(set = 0, binding = 0, std140) uniform _10_12
{
    vec4 _m0[4096];
} _12;

layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = _12._m0[0u].x;
    SV_Target.y = _12._m0[0u].y;
    SV_Target.z = _12._m0[0u].z;
    SV_Target.w = _12._m0[0u].w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 32
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %12 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %14 "SV_Target"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %14 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 4096
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypePointer Output %8
%14 = OpVariable %13 Output
%15 = OpConstant %5 0
%16 = OpTypePointer Uniform %8
%23 = OpTypePointer Output %7
%26 = OpConstant %5 1
%28 = OpConstant %5 2
%30 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %31
%31 = OpLabel
%17 = OpAccessChain %16 %12 %15 %15
%18 = OpLoad %8 %17
%19 = OpCompositeExtract %7 %18 0
%20 = OpCompositeExtract %7 %18 1
%21 = OpCompositeExtract %7 %18 2
%22 = OpCompositeExtract %7 %18 3
%24 = OpAccessChain %23 %14 %15
OpStore %24 %19
%25 = OpAccessChain %23 %14 %26
OpStore %25 %20
%27 = OpAccessChain %23 %14 %28
OpStore %27 %21
%29 = OpAccessChain %23 %14 %30
OpStore %29 %22
OpReturn
OpFunctionEnd
#endif
