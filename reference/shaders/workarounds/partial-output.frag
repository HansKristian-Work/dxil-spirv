#version 460

layout(location = 0) in vec2 V;
layout(location = 4) out float SV_Target_4;
const float _10_init = 0.0;

void main()
{
    SV_Target_4 = _10_init;
    if (V.x == 10.0)
    {
        SV_Target_4 = 40.0;
    }
    else
    {
        if (V.x == 20.0)
        {
            SV_Target_4 = 50.0;
        }
    }
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 31
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "V"
OpName %10 "SV_Target_4"
OpDecorate %8 Location 0
OpDecorate %10 Location 4
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %5
%23 = OpConstantNull %5
%10 = OpVariable %9 Output %23
%11 = OpTypePointer Input %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%16 = OpTypeBool
%18 = OpConstant %5 10
%19 = OpConstant %5 40
%21 = OpConstant %5 20
%22 = OpConstant %5 50
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %24
%24 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%17 = OpFOrdEqual %16 %15 %18
OpSelectionMerge %29 None
OpBranchConditional %17 %28 %25
%28 = OpLabel
OpStore %10 %19
OpBranch %29
%25 = OpLabel
%20 = OpFOrdEqual %16 %15 %21
OpSelectionMerge %27 None
OpBranchConditional %20 %26 %27
%26 = OpLabel
OpStore %10 %22
OpBranch %27
%27 = OpLabel
OpBranch %29
%29 = OpLabel
OpReturn
OpFunctionEnd
#endif
