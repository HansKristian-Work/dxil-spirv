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
    uvec4 _26 = subgroupBallot(INDEX < 100u);
    SV_Target.x = _26.x;
    SV_Target.y = _26.y;
    SV_Target.z = _26.z;
    SV_Target.w = _26.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 42
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformBallot
OpCapability DemoteToHelperInvocationEXT
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %10 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "INDEX"
OpName %10 "SV_Target"
OpDecorate %7 Flat
OpDecorate %7 Location 0
OpDecorate %10 Location 0
OpDecorate %14 BuiltIn SampleMask
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeVector %5 4
%9 = OpTypePointer Output %8
%10 = OpVariable %9 Output
%11 = OpConstant %5 1
%12 = OpTypeArray %5 %11
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%16 = OpConstant %5 0
%18 = OpTypeBool
%23 = OpConstant %5 40
%25 = OpConstant %5 100
%27 = OpConstant %5 3
%32 = OpTypePointer Output %5
%36 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %38
%38 = OpLabel
%15 = OpAccessChain %6 %14 %16
%17 = OpLoad %5 %15
%19 = OpIEqual %18 %16 %17
%20 = OpSelect %5 %19 %11 %16
%21 = OpLoad %5 %7
%22 = OpIEqual %18 %21 %23
OpSelectionMerge %40 None
OpBranchConditional %22 %39 %40
%39 = OpLabel
OpDemoteToHelperInvocationEXT
OpBranch %40
%40 = OpLabel
%24 = OpULessThan %18 %21 %25
%26 = OpGroupNonUniformBallot %8 %27 %24
%28 = OpCompositeExtract %5 %26 0
%29 = OpCompositeExtract %5 %26 1
%30 = OpCompositeExtract %5 %26 2
%31 = OpCompositeExtract %5 %26 3
%33 = OpAccessChain %32 %10 %16
OpStore %33 %28
%34 = OpAccessChain %32 %10 %11
OpStore %34 %29
%35 = OpAccessChain %32 %10 %36
OpStore %35 %30
%37 = OpAccessChain %32 %10 %27
OpStore %37 %31
OpReturn
OpFunctionEnd
#endif
