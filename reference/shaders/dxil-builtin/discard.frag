#version 460

layout(location = 0) in vec2 TEXCOORD;
bool discard_state;

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
    if (TEXCOORD.x > 10.0)
    {
        discard_state = true;
    }
    else
    {
        if (TEXCOORD.y > 20.0)
        {
            discard_state = true;
        }
    }
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 48
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %27 "discard_state"
OpName %40 "discard_exit"
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
%26 = OpTypePointer Private %18
%27 = OpVariable %26 Private
%28 = OpConstantFalse %18
%32 = OpConstant %5 20
%39 = OpConstantTrue %18
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %27 %28
OpBranch %33
%33 = OpLabel
%15 = OpAccessChain %14 %13 %16
%17 = OpLoad %9 %15
%19 = OpIEqual %18 %16 %17
%20 = OpSelect %9 %19 %10 %16
%22 = OpAccessChain %21 %8 %16
%23 = OpLoad %5 %22
%24 = OpFOrdGreaterThan %18 %23 %25
OpSelectionMerge %38 None
OpBranchConditional %24 %37 %34
%37 = OpLabel
OpStore %27 %39
OpBranch %38
%34 = OpLabel
%29 = OpAccessChain %21 %8 %10
%30 = OpLoad %5 %29
%31 = OpFOrdGreaterThan %18 %30 %32
OpSelectionMerge %36 None
OpBranchConditional %31 %35 %36
%35 = OpLabel
OpStore %27 %39
OpBranch %36
%36 = OpLabel
OpBranch %38
%38 = OpLabel
%46 = OpFunctionCall %1 %40
OpReturn
OpFunctionEnd
%40 = OpFunction %1 None %2
%41 = OpLabel
%44 = OpLoad %18 %27
OpSelectionMerge %43 None
OpBranchConditional %44 %42 %43
%42 = OpLabel
OpKill
%43 = OpLabel
OpReturn
OpFunctionEnd
#endif
