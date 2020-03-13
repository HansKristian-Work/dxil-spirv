#version 460
#extension GL_KHR_shader_subgroup_quad : require

layout(location = 0) in float A;
layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = A;
    SV_Target.y = subgroupQuadSwapHorizontal(A);
    SV_Target.z = subgroupQuadSwapVertical(A);
    SV_Target.w = subgroupQuadSwapDiagonal(A);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 27
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformQuad
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "A"
OpName %10 "SV_Target"
OpDecorate %7 Location 0
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeVector %5 4
%9 = OpTypePointer Output %8
%10 = OpVariable %9 Output
%13 = OpTypeInt 32 0
%14 = OpConstant %13 3
%15 = OpConstant %13 0
%17 = OpConstant %13 1
%19 = OpConstant %13 2
%20 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %25
%25 = OpLabel
%11 = OpLoad %5 %7
%12 = OpGroupNonUniformQuadSwap %5 %14 %11 %15
%16 = OpGroupNonUniformQuadSwap %5 %14 %11 %17
%18 = OpGroupNonUniformQuadSwap %5 %14 %11 %19
%21 = OpAccessChain %20 %10 %15
OpStore %21 %11
%22 = OpAccessChain %20 %10 %17
OpStore %22 %12
%23 = OpAccessChain %20 %10 %19
OpStore %23 %16
%24 = OpAccessChain %20 %10 %14
OpStore %24 %18
OpReturn
OpFunctionEnd
#endif
