#version 460

layout(location = 0) flat in uint A;
layout(location = 0) out uint SV_Target;

void main()
{
    uint _18 = ((A << 1u) & 170u) | ((A >> 1u) & 85u);
    uint _26 = ((_18 << 2u) & 204u) | ((_18 >> 2u) & 51u);
    SV_Target = bitfieldReverse(A) >> 24u;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 36
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %7 %9
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "A"
OpName %9 "SV_Target"
OpDecorate %7 Flat
OpDecorate %7 Location 0
OpDecorate %9 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypePointer Output %5
%9 = OpVariable %8 Output
%12 = OpConstant %5 1
%14 = OpConstant %5 170
%17 = OpConstant %5 85
%20 = OpConstant %5 2
%22 = OpConstant %5 204
%25 = OpConstant %5 51
%28 = OpConstant %5 4
%30 = OpConstant %5 240
%34 = OpConstant %5 24
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %35
%35 = OpLabel
%10 = OpLoad %5 %7
%11 = OpShiftLeftLogical %5 %10 %12
%13 = OpBitwiseAnd %5 %11 %14
%15 = OpShiftRightLogical %5 %10 %12
%16 = OpBitwiseAnd %5 %15 %17
%18 = OpBitwiseOr %5 %13 %16
%19 = OpShiftLeftLogical %5 %18 %20
%21 = OpBitwiseAnd %5 %19 %22
%23 = OpShiftRightLogical %5 %18 %20
%24 = OpBitwiseAnd %5 %23 %25
%26 = OpBitwiseOr %5 %21 %24
%27 = OpShiftLeftLogical %5 %26 %28
%29 = OpBitwiseAnd %5 %27 %30
%31 = OpShiftRightLogical %5 %26 %28
%32 = OpBitReverse %5 %10
%33 = OpShiftRightLogical %5 %32 %34
OpStore %9 %33
OpReturn
OpFunctionEnd
#endif
