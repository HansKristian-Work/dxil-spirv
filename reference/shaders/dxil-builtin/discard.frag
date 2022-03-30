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
; Bound: 40
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %18 "discard_state"
OpName %32 "discard_exit"
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
%17 = OpTypePointer Private %14
%18 = OpVariable %17 Private
%19 = OpConstantFalse %14
%21 = OpConstant %11 1
%24 = OpConstant %5 20
%31 = OpConstantTrue %14
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %18 %19
OpBranch %25
%25 = OpLabel
%10 = OpAccessChain %9 %8 %12
%13 = OpLoad %5 %10
%15 = OpFOrdGreaterThan %14 %13 %16
OpSelectionMerge %30 None
OpBranchConditional %15 %29 %26
%29 = OpLabel
OpStore %18 %31
OpBranch %30
%26 = OpLabel
%20 = OpAccessChain %9 %8 %21
%22 = OpLoad %5 %20
%23 = OpFOrdGreaterThan %14 %22 %24
OpSelectionMerge %28 None
OpBranchConditional %23 %27 %28
%27 = OpLabel
OpStore %18 %31
OpBranch %28
%28 = OpLabel
OpBranch %30
%30 = OpLabel
%38 = OpFunctionCall %1 %32
OpReturn
OpFunctionEnd
%32 = OpFunction %1 None %2
%33 = OpLabel
%36 = OpLoad %14 %18
OpSelectionMerge %35 None
OpBranchConditional %36 %34 %35
%34 = OpLabel
OpKill
%35 = OpLabel
OpReturn
OpFunctionEnd
#endif
