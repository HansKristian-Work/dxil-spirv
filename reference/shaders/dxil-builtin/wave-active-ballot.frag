#version 460
#extension GL_KHR_shader_subgroup_ballot : require

layout(location = 0) flat in uint INDEX;
layout(location = 0) out uvec4 SV_Target;

void main()
{
    uvec4 _15 = subgroupBallot(INDEX < 100u);
    SV_Target.x = _15.x;
    SV_Target.y = _15.y;
    SV_Target.z = _15.z;
    SV_Target.w = _15.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 31
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformBallot
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "INDEX"
OpName %10 "SV_Target"
OpDecorate %7 Flat
OpDecorate %7 Location 0
OpDecorate %10 Location 0
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
%16 = OpConstant %5 3
%21 = OpTypePointer Output %5
%23 = OpConstant %5 0
%25 = OpConstant %5 1
%27 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %29
%29 = OpLabel
%11 = OpLoad %5 %7
%13 = OpULessThan %12 %11 %14
%15 = OpGroupNonUniformBallot %8 %16 %13
%17 = OpCompositeExtract %5 %15 0
%18 = OpCompositeExtract %5 %15 1
%19 = OpCompositeExtract %5 %15 2
%20 = OpCompositeExtract %5 %15 3
%22 = OpAccessChain %21 %10 %23
OpStore %22 %17
%24 = OpAccessChain %21 %10 %25
OpStore %24 %18
%26 = OpAccessChain %21 %10 %27
OpStore %26 %19
%28 = OpAccessChain %21 %10 %16
OpStore %28 %20
OpReturn
OpFunctionEnd
#endif
