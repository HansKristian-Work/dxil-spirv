#version 460
#extension GL_EXT_demote_to_helper_invocation : require

layout(location = 0) in vec2 TEXCOORD;

void demote_cond(bool _37)
{
    if (_37)
    {
        demote;
    }
}

void main()
{
    bool _28 = (TEXCOORD.x + (-10.0)) < 0.0;
    demote_cond(_28);
    bool _33 = (TEXCOORD.y + (-20.0)) < 0.0;
    demote_cond(_33);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 46
; Schema: 0
OpCapability Shader
OpCapability DemoteToHelperInvocationEXT
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %38 "demote_cond"
OpDecorate %8 Location 0
OpDecorate %13 BuiltIn SampleMask
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeInt 32 0
%10 = OpConstant %9 1
%11 = OpTypeArray %9 %10
%12 = OpTypePointer Input %11
%13 = OpVariable %12 Input
%14 = OpTypePointer Input %9
%16 = OpConstant %9 0
%18 = OpTypeBool
%21 = OpTypePointer Input %5
%27 = OpConstant %5 -10
%29 = OpConstant %5 0
%32 = OpConstant %5 -20
%36 = OpTypeFunction %1 %18
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %35
%35 = OpLabel
%15 = OpAccessChain %14 %13 %16
%17 = OpLoad %9 %15
%19 = OpIEqual %18 %16 %17
%20 = OpSelect %9 %19 %10 %16
%22 = OpAccessChain %21 %8 %16
%23 = OpLoad %5 %22
%24 = OpAccessChain %21 %8 %10
%25 = OpLoad %5 %24
%26 = OpFAdd %5 %23 %27
%28 = OpFOrdLessThan %18 %26 %29
%30 = OpSelect %9 %28 %10 %16
%43 = OpFunctionCall %1 %38 %28
%31 = OpFAdd %5 %25 %32
%33 = OpFOrdLessThan %18 %31 %29
%34 = OpSelect %9 %33 %10 %16
%44 = OpFunctionCall %1 %38 %33
OpReturn
OpFunctionEnd
%38 = OpFunction %1 None %36
%37 = OpFunctionParameter %18
%39 = OpLabel
OpSelectionMerge %41 None
OpBranchConditional %37 %40 %41
%40 = OpLabel
OpDemoteToHelperInvocationEXT
OpBranch %41
%41 = OpLabel
OpReturn
OpFunctionEnd
#endif
