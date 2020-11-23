#version 460
#extension GL_KHR_shader_subgroup_ballot : require

layout(location = 0) flat in uint INDEX;
layout(location = 0) out uvec4 SV_Target;

void main()
{
    uvec4 _18 = subgroupBallot((INDEX < 100u) && (!gl_HelperInvocation));
    SV_Target.x = _18.x;
    SV_Target.y = _18.y;
    SV_Target.z = _18.z;
    SV_Target.w = _18.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 36
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformBallot
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %10 %34
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "INDEX"
OpName %10 "SV_Target"
OpDecorate %7 Flat
OpDecorate %7 Location 0
OpDecorate %10 Location 0
OpDecorate %34 BuiltIn HelperInvocation
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeVector %5 4
%9 = OpTypePointer Output %8
%10 = OpVariable %9 Output
%12 = OpTypeBool
%14 = OpConstant %5 100
%19 = OpConstant %5 3
%24 = OpTypePointer Output %5
%26 = OpConstant %5 0
%28 = OpConstant %5 1
%30 = OpConstant %5 2
%33 = OpTypePointer Input %12
%34 = OpVariable %33 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %32
%32 = OpLabel
%11 = OpLoad %5 %7
%13 = OpULessThan %12 %11 %14
%15 = OpLoad %12 %34
%16 = OpLogicalNot %12 %15
%17 = OpLogicalAnd %12 %13 %16
%18 = OpGroupNonUniformBallot %8 %19 %17
%20 = OpCompositeExtract %5 %18 0
%21 = OpCompositeExtract %5 %18 1
%22 = OpCompositeExtract %5 %18 2
%23 = OpCompositeExtract %5 %18 3
%25 = OpAccessChain %24 %10 %26
OpStore %25 %20
%27 = OpAccessChain %24 %10 %28
OpStore %27 %21
%29 = OpAccessChain %24 %10 %30
OpStore %29 %22
%31 = OpAccessChain %24 %10 %19
OpStore %31 %23
OpReturn
OpFunctionEnd
#endif
