#version 460
#extension GL_EXT_demote_to_helper_invocation : require

layout(location = 0) in vec2 TEXCOORD;

void main()
{
    if (TEXCOORD.x > 10.0)
    {
        demote;
    }
    else
    {
        if (TEXCOORD.y > 20.0)
        {
            demote;
        }
    }
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 29
; Schema: 0
OpCapability Shader
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
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
%14 = OpTypeBool
%16 = OpConstant %5 10
%18 = OpConstant %11 1
%21 = OpConstant %5 20
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %22
%22 = OpLabel
%10 = OpAccessChain %9 %8 %12
%13 = OpLoad %5 %10
%15 = OpFOrdGreaterThan %14 %13 %16
OpSelectionMerge %27 None
OpBranchConditional %15 %26 %23
%26 = OpLabel
OpDemoteToHelperInvocation
OpBranch %27
%23 = OpLabel
%17 = OpAccessChain %9 %8 %18
%19 = OpLoad %5 %17
%20 = OpFOrdGreaterThan %14 %19 %21
OpSelectionMerge %25 None
OpBranchConditional %20 %24 %25
%24 = OpLabel
OpDemoteToHelperInvocation
OpBranch %25
%25 = OpLabel
OpBranch %27
%27 = OpLabel
OpReturn
OpFunctionEnd
#endif
