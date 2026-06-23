#version 460

layout(location = 0) out float SV_Target;
uint _11 = 0u;

void main()
{
    _11 = uint(0u == uint(gl_SampleMaskIn[0u]));
    float _25;
    if ((_11 & 1u) != 0u)
    {
        _25 = 2.0;
    }
    else
    {
        _25 = 1.0;
    }
    SV_Target = dFdxFine(_25);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 33
; Schema: 0
OpCapability Shader
OpCapability DerivativeControl
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SV_Target"
OpDecorate %7 Location 0
OpDecorate %15 BuiltIn SampleMask
OpDecorate %15 Flat
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Output %5
%7 = OpVariable %6 Output
%8 = OpTypeInt 32 0
%9 = OpConstant %8 0
%10 = OpTypePointer Private %8
%11 = OpVariable %10 Private %9
%12 = OpConstant %8 1
%13 = OpTypeArray %8 %12
%14 = OpTypePointer Input %13
%15 = OpVariable %14 Input
%16 = OpTypePointer Input %8
%19 = OpTypeBool
%26 = OpConstant %5 2
%27 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %29
%29 = OpLabel
%17 = OpAccessChain %16 %15 %9
%18 = OpLoad %8 %17
%20 = OpIEqual %19 %9 %18
%21 = OpSelect %8 %20 %12 %9
OpStore %11 %21
%22 = OpLoad %8 %11
%23 = OpBitwiseAnd %8 %22 %12
%24 = OpINotEqual %19 %23 %9
OpSelectionMerge %31 None
OpBranchConditional %24 %30 %31
%30 = OpLabel
OpBranch %31
%31 = OpLabel
%25 = OpPhi %5 %27 %29 %26 %30
%28 = OpDPdxFine %5 %25
OpStore %7 %28
OpReturn
OpFunctionEnd
#endif
