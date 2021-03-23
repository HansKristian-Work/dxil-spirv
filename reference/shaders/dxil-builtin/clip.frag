#version 460

layout(location = 0) in vec2 TEXCOORD;
bool discard_state;

void discard_cond(bool _30)
{
    if (_30)
    {
        discard_state = true;
    }
}

void discard_exit()
{
    if (discard_state)
    {
        discard;
    }
}

void main()
{
    discard_state = false;
    discard_cond((TEXCOORD.x + (-10.0)) < 0.0);
    discard_cond((TEXCOORD.y + (-20.0)) < 0.0);
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 44
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %23 "discard_state"
OpName %31 "discard_cond"
OpName %38 "discard_exit"
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
%22 = OpTypePointer Private %19
%23 = OpVariable %22 Private
%24 = OpConstantFalse %19
%26 = OpConstant %5 -20
%29 = OpTypeFunction %1 %19
%35 = OpConstantTrue %19
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %23 %24
OpBranch %28
%28 = OpLabel
%10 = OpAccessChain %9 %8 %12
%13 = OpLoad %5 %10
%14 = OpAccessChain %9 %8 %15
%16 = OpLoad %5 %14
%17 = OpFAdd %5 %13 %18
%20 = OpFOrdLessThan %19 %17 %21
%36 = OpFunctionCall %1 %31 %20
%25 = OpFAdd %5 %16 %26
%27 = OpFOrdLessThan %19 %25 %21
%37 = OpFunctionCall %1 %31 %27
%43 = OpFunctionCall %1 %38
OpReturn
OpFunctionEnd
%31 = OpFunction %1 None %29
%30 = OpFunctionParameter %19
%32 = OpLabel
OpSelectionMerge %34 None
OpBranchConditional %30 %33 %34
%33 = OpLabel
OpStore %23 %35
OpBranch %34
%34 = OpLabel
OpReturn
OpFunctionEnd
%38 = OpFunction %1 None %2
%39 = OpLabel
%42 = OpLoad %19 %23
OpSelectionMerge %41 None
OpBranchConditional %42 %40 %41
%40 = OpLabel
OpKill
%41 = OpLabel
OpReturn
OpFunctionEnd
#endif
