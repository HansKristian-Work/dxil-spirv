#version 460
layout(early_fragment_tests) in;

layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = 1.0;
    SV_Target.y = 1.0;
    SV_Target.z = 1.0;
    SV_Target.w = 1.0;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 21
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpName %3 "main"
OpName %8 "SV_Target"
OpDecorate %8 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpTypePointer Output %5
%11 = OpTypeInt 32 0
%12 = OpConstant %11 0
%13 = OpConstant %5 1
%15 = OpConstant %11 1
%17 = OpConstant %11 2
%19 = OpConstant %11 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %20
%20 = OpLabel
%10 = OpAccessChain %9 %8 %12
OpStore %10 %13
%14 = OpAccessChain %9 %8 %15
OpStore %14 %13
%16 = OpAccessChain %9 %8 %17
OpStore %16 %13
%18 = OpAccessChain %9 %8 %19
OpStore %18 %13
OpReturn
OpFunctionEnd
#endif
