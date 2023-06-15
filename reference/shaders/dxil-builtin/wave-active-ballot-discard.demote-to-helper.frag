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
    bool _17 = helperInvocationEXT();
    uvec4 _20 = subgroupBallot((INDEX < 100u) && (!_17));
    SV_Target.x = _20.x;
    SV_Target.y = _20.y;
    SV_Target.z = _20.z;
    SV_Target.w = _20.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 38
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformBallot
OpCapability DemoteToHelperInvocation
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
%21 = OpConstant %5 3
%26 = OpTypePointer Output %5
%28 = OpConstant %5 0
%30 = OpConstant %5 1
%32 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %34
%34 = OpLabel
%11 = OpLoad %5 %7
%13 = OpIEqual %12 %11 %14
OpSelectionMerge %36 None
OpBranchConditional %13 %35 %36
%35 = OpLabel
OpDemoteToHelperInvocation
OpBranch %36
%36 = OpLabel
%15 = OpULessThan %12 %11 %16
%17 = OpIsHelperInvocationEXT %12
%18 = OpLogicalNot %12 %17
%19 = OpLogicalAnd %12 %15 %18
%20 = OpGroupNonUniformBallot %8 %21 %19
%22 = OpCompositeExtract %5 %20 0
%23 = OpCompositeExtract %5 %20 1
%24 = OpCompositeExtract %5 %20 2
%25 = OpCompositeExtract %5 %20 3
%27 = OpAccessChain %26 %10 %28
OpStore %27 %22
%29 = OpAccessChain %26 %10 %30
OpStore %29 %23
%31 = OpAccessChain %26 %10 %32
OpStore %31 %24
%33 = OpAccessChain %26 %10 %21
OpStore %33 %25
OpReturn
OpFunctionEnd
#endif
