#version 460
#extension GL_EXT_demote_to_helper_invocation : require
#extension GL_KHR_shader_subgroup_ballot : require

layout(location = 0) flat in uint INDEX;
layout(location = 0) out uvec4 SV_Target;

void main()
{
    if (INDEX == 40u)
    {
        demote;
    }
    uvec4 _17 = subgroupBallot(INDEX < 100u);
    SV_Target.x = _17.x;
    SV_Target.y = _17.y;
    SV_Target.z = _17.z;
    SV_Target.w = _17.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 34
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformBallot
OpCapability DemoteToHelperInvocationEXT
OpExtension "SPV_EXT_demote_to_helper_invocation"
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
%14 = OpConstant %5 40
%16 = OpConstant %5 100
%18 = OpConstant %5 3
%23 = OpTypePointer Output %5
%25 = OpConstant %5 0
%27 = OpConstant %5 1
%29 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %31
%31 = OpLabel
%11 = OpLoad %5 %7
%13 = OpIEqual %12 %11 %14
OpSelectionMerge %33 None
OpBranchConditional %13 %32 %33
%32 = OpLabel
OpDemoteToHelperInvocationEXT
OpBranch %33
%33 = OpLabel
%15 = OpULessThan %12 %11 %16
%17 = OpGroupNonUniformBallot %8 %18 %15
%19 = OpCompositeExtract %5 %17 0
%20 = OpCompositeExtract %5 %17 1
%21 = OpCompositeExtract %5 %17 2
%22 = OpCompositeExtract %5 %17 3
%24 = OpAccessChain %23 %10 %25
OpStore %24 %19
%26 = OpAccessChain %23 %10 %27
OpStore %26 %20
%28 = OpAccessChain %23 %10 %29
OpStore %28 %21
%30 = OpAccessChain %23 %10 %18
OpStore %30 %22
OpReturn
OpFunctionEnd
#endif
