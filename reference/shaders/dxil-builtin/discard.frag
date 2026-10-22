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
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 42
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %23
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %23 "discard_state"
OpName %34 "discard_exit"
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
%22 = OpTypePointer Private %14
%23 = OpVariable %22 Private
%24 = OpConstantFalse %14
%33 = OpConstantTrue %14
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %23 %24
OpBranch %25
%25 = OpLabel
%10 = OpAccessChain %9 %8 %12
%13 = OpLoad %5 %10
%15 = OpFOrdGreaterThan %14 %13 %16
OpSelectionMerge %30 None
OpBranchConditional %15 %29 %26
%29 = OpLabel
OpStore %23 %33
OpBranch %30
%26 = OpLabel
%17 = OpAccessChain %9 %8 %18
%19 = OpLoad %5 %17
%20 = OpFOrdGreaterThan %14 %19 %21
OpSelectionMerge %28 None
OpBranchConditional %20 %27 %28
%27 = OpLabel
OpStore %23 %33
OpBranch %28
%28 = OpLabel
OpBranch %30
%30 = OpLabel
OpBranch %31
%31 = OpLabel
OpBranch %32
%32 = OpLabel
%40 = OpFunctionCall %1 %34
OpReturn
OpFunctionEnd
%34 = OpFunction %1 None %2
%35 = OpLabel
%38 = OpLoad %14 %23
OpSelectionMerge %37 None
OpBranchConditional %38 %36 %37
%36 = OpLabel
OpKill
%37 = OpLabel
OpReturn
OpFunctionEnd
#endif
