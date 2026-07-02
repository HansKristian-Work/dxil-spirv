#version 460
#extension GL_KHR_shader_subgroup_quad : require
#extension GL_KHR_shader_subgroup_basic : require
#extension GL_KHR_shader_subgroup_shuffle : require

vec2 _20;

layout(location = 0) in vec2 V;
layout(location = 1) flat in uint INDEX;
layout(location = 0) out vec2 SV_Target;

void main()
{
    vec2 _19;
    _19.x = V.x;
    _19.y = V.y;
    vec2 _34 = subgroupShuffle(_19, (gl_SubgroupInvocationID & 4294967292u) + INDEX) + subgroupQuadBroadcast(_19, 2u);
    SV_Target.x = _34.x;
    SV_Target.y = _34.y;
}


#if 0
// SPIR-V disassembly
// HeuristicWaveSize(32)
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 42
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniform
OpCapability GroupNonUniformShuffle
OpCapability GroupNonUniformQuad
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11 %13 %28
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "V"
OpName %11 "INDEX"
OpName %13 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %11 Flat
OpDecorate %11 Location 1
OpDecorate %13 Location 0
OpDecorate %28 BuiltIn SubgroupLocalInvocationId
OpDecorate %28 Flat
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeInt 32 0
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypePointer Output %6
%13 = OpVariable %12 Output
%15 = OpTypePointer Input %5
%17 = OpConstant %9 0
%22 = OpConstant %9 1
%26 = OpConstant %9 3
%27 = OpConstant %9 2
%28 = OpVariable %10 Input
%31 = OpConstant %9 4294967292
%36 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%20 = OpUndef %6
OpBranch %40
%40 = OpLabel
%14 = OpLoad %9 %11
%16 = OpAccessChain %15 %8 %17
%18 = OpLoad %5 %16
%19 = OpCompositeInsert %6 %18 %20 0
%21 = OpAccessChain %15 %8 %22
%23 = OpLoad %5 %21
%24 = OpCompositeInsert %6 %23 %19 1
%25 = OpGroupNonUniformQuadBroadcast %6 %26 %24 %27
%29 = OpLoad %9 %28
%30 = OpBitwiseAnd %9 %29 %31
%32 = OpIAdd %9 %30 %14
%33 = OpGroupNonUniformShuffle %6 %26 %24 %32
%34 = OpFAdd %6 %33 %25
%35 = OpCompositeExtract %5 %34 0
%37 = OpAccessChain %36 %13 %17
OpStore %37 %35
%38 = OpCompositeExtract %5 %34 1
%39 = OpAccessChain %36 %13 %22
OpStore %39 %38
OpReturn
OpFunctionEnd
#endif
