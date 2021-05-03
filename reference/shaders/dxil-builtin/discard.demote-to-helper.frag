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
; Bound: 37
; Schema: 0
OpCapability Shader
OpCapability DemoteToHelperInvocationEXT
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
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
%25 = OpConstant %5 10
%29 = OpConstant %5 20
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %30
%30 = OpLabel
%15 = OpAccessChain %14 %13 %16
%17 = OpLoad %9 %15
%19 = OpIEqual %18 %16 %17
%20 = OpSelect %9 %19 %10 %16
%22 = OpAccessChain %21 %8 %16
%23 = OpLoad %5 %22
%24 = OpFOrdGreaterThan %18 %23 %25
OpSelectionMerge %35 None
OpBranchConditional %24 %34 %31
%34 = OpLabel
OpDemoteToHelperInvocationEXT
OpBranch %35
%31 = OpLabel
%26 = OpAccessChain %21 %8 %10
%27 = OpLoad %5 %26
%28 = OpFOrdGreaterThan %18 %27 %29
OpSelectionMerge %33 None
OpBranchConditional %28 %32 %33
%32 = OpLabel
OpDemoteToHelperInvocationEXT
OpBranch %33
%33 = OpLabel
OpBranch %35
%35 = OpLabel
OpReturn
OpFunctionEnd
#endif
