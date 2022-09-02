#version 460
#extension GL_KHR_shader_subgroup_quad : require
#extension GL_KHR_shader_subgroup_basic : require
#extension GL_KHR_shader_subgroup_shuffle : require

layout(location = 0) in float V;
layout(location = 1) flat in uint INDEX;
layout(location = 0) out vec2 SV_Target;

void main()
{
    SV_Target.x = subgroupQuadBroadcast(V, 2u);
    SV_Target.y = subgroupShuffle(V, (gl_SubgroupInvocationID & 4294967292u) + INDEX);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 32
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniform
OpCapability GroupNonUniformShuffle
OpCapability GroupNonUniformQuad
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %10 %13 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "V"
OpName %10 "INDEX"
OpName %13 "SV_Target"
OpDecorate %7 Location 0
OpDecorate %10 Flat
OpDecorate %10 Location 1
OpDecorate %13 Location 0
OpDecorate %19 BuiltIn SubgroupLocalInvocationId
OpDecorate %19 Flat
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeInt 32 0
%9 = OpTypePointer Input %8
%10 = OpVariable %9 Input
%11 = OpTypeVector %5 2
%12 = OpTypePointer Output %11
%13 = OpVariable %12 Output
%17 = OpConstant %8 3
%18 = OpConstant %8 2
%19 = OpVariable %9 Input
%22 = OpConstant %8 4294967292
%25 = OpTypePointer Output %5
%27 = OpConstant %8 0
%29 = OpConstant %8 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %30
%30 = OpLabel
%14 = OpLoad %8 %10
%15 = OpLoad %5 %7
%16 = OpGroupNonUniformQuadBroadcast %5 %17 %15 %18
%20 = OpLoad %8 %19
%21 = OpBitwiseAnd %8 %20 %22
%23 = OpIAdd %8 %21 %14
%24 = OpGroupNonUniformShuffle %5 %17 %15 %23
%26 = OpAccessChain %25 %13 %27
OpStore %26 %16
%28 = OpAccessChain %25 %13 %29
OpStore %28 %24
OpReturn
OpFunctionEnd
#endif
