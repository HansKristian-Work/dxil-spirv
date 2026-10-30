#version 460

layout(location = 0) flat in uint A;
layout(location = 0) out uint SV_Target;

void main()
{
    uint _18 = ((A << 1u) & 2863311530u) | ((A >> 1u) & 1431655765u);
    uint _26 = ((_18 << 2u) & 3435973836u) | ((_18 >> 2u) & 858993459u);
    uint _34 = ((_26 << 4u) & 4042322160u) | ((_26 >> 4u) & 252645135u);
    uint _42 = ((_34 << 8u) & 4278255360u) | ((_34 >> 8u) & 16711935u);
    SV_Target = bitfieldReverse(A);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 48
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
%14 = OpConstant %5 2863311530
%17 = OpConstant %5 1431655765
%20 = OpConstant %5 2
%22 = OpConstant %5 3435973836
%25 = OpConstant %5 858993459
%28 = OpConstant %5 4
%30 = OpConstant %5 4042322160
%33 = OpConstant %5 252645135
%36 = OpConstant %5 8
%38 = OpConstant %5 4278255360
%41 = OpConstant %5 16711935
%44 = OpConstant %5 16
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %47
%47 = OpLabel
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
%32 = OpBitwiseAnd %5 %31 %33
%34 = OpBitwiseOr %5 %29 %32
%35 = OpShiftLeftLogical %5 %34 %36
%37 = OpBitwiseAnd %5 %35 %38
%39 = OpShiftRightLogical %5 %34 %36
%40 = OpBitwiseAnd %5 %39 %41
%42 = OpBitwiseOr %5 %37 %40
%43 = OpShiftLeftLogical %5 %42 %44
%45 = OpShiftRightLogical %5 %42 %44
%46 = OpBitReverse %5 %10
OpStore %9 %46
OpReturn
OpFunctionEnd
#endif
