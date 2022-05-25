#version 460
#extension GL_EXT_demote_to_helper_invocation : require

layout(location = 0) in vec2 TEXCOORD;

void demote_cond(bool _27)
{
    if (_27)
    {
        demote;
    }
}

void main()
{
    demote_cond((TEXCOORD.x + (-10.0)) < 0.0);
    demote_cond((TEXCOORD.y + (-20.0)) < 0.0);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 36
; Schema: 0
OpCapability Shader
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %28 "demote_cond"
OpDecorate %8 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Input %5
%11 = OpTypeInt 32 0
%12 = OpConstant %11 0
%15 = OpConstant %11 1
%18 = OpConstant %5 -10
%19 = OpTypeBool
%21 = OpConstant %5 0
%23 = OpConstant %5 -20
%26 = OpTypeFunction %1 %19
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %25
%25 = OpLabel
%10 = OpAccessChain %9 %8 %12
%13 = OpLoad %5 %10
%14 = OpAccessChain %9 %8 %15
%16 = OpLoad %5 %14
%17 = OpFAdd %5 %13 %18
%20 = OpFOrdLessThan %19 %17 %21
%33 = OpFunctionCall %1 %28 %20
%22 = OpFAdd %5 %16 %23
%24 = OpFOrdLessThan %19 %22 %21
%34 = OpFunctionCall %1 %28 %24
OpReturn
OpFunctionEnd
%28 = OpFunction %1 None %26
%27 = OpFunctionParameter %19
%29 = OpLabel
OpSelectionMerge %31 None
OpBranchConditional %27 %30 %31
%30 = OpLabel
OpDemoteToHelperInvocation
OpBranch %31
%31 = OpLabel
OpReturn
OpFunctionEnd
#endif
