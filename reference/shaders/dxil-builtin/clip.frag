#version 460

layout(location = 0) in vec2 TEXCOORD;
bool discard_state;

void discard_cond(bool _40)
{
    if (_40)
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
    bool _28 = (TEXCOORD.x + (-10.0)) < 0.0;
    discard_cond(_28);
    bool _36 = (TEXCOORD.y + (-20.0)) < 0.0;
    discard_cond(_36);
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 57
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %32 "discard_state"
OpName %41 "discard_cond"
OpName %49 "discard_exit"
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
%31 = OpTypePointer Private %18
%32 = OpVariable %31 Private
%33 = OpConstantFalse %18
%35 = OpConstant %5 -20
%39 = OpTypeFunction %1 %18
%45 = OpConstantTrue %18
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %32 %33
OpBranch %38
%38 = OpLabel
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
%47 = OpFunctionCall %1 %41 %28
%34 = OpFAdd %5 %25 %35
%36 = OpFOrdLessThan %18 %34 %29
%37 = OpSelect %9 %36 %10 %16
%48 = OpFunctionCall %1 %41 %36
%55 = OpFunctionCall %1 %49
OpReturn
OpFunctionEnd
%41 = OpFunction %1 None %39
%40 = OpFunctionParameter %18
%42 = OpLabel
OpSelectionMerge %44 None
OpBranchConditional %40 %43 %44
%43 = OpLabel
OpStore %32 %45
OpBranch %44
%44 = OpLabel
OpReturn
OpFunctionEnd
%49 = OpFunction %1 None %2
%50 = OpLabel
%53 = OpLoad %18 %32
OpSelectionMerge %52 None
OpBranchConditional %53 %51 %52
%51 = OpLabel
OpKill
%52 = OpLabel
OpReturn
OpFunctionEnd
#endif
