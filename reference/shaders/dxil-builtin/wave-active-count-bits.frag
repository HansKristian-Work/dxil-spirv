#version 460
#extension GL_KHR_shader_subgroup_ballot : require

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;

layout(location = 0) flat in uint INDEX;
bool discard_state;

void discard_exit()
{
    if (discard_state)
    {
        discard;
    }
}

void main()
{
    discard_state = false;
    if (INDEX == 40u)
    {
        discard_state = true;
    }
    imageStore(_8, int(INDEX), uvec4(subgroupBallotBitCount(subgroupBallot((INDEX < 100u) && (!(gl_HelperInvocation || discard_state))))));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 47
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformBallot
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %36
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "INDEX"
OpName %17 "discard_state"
OpName %39 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %10 Flat
OpDecorate %10 Location 0
OpDecorate %36 BuiltIn HelperInvocation
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypePointer Input %5
%10 = OpVariable %9 Input
%13 = OpTypeBool
%15 = OpConstant %5 40
%16 = OpTypePointer Private %13
%17 = OpVariable %16 Private
%18 = OpConstantFalse %13
%20 = OpConstant %5 100
%21 = OpTypeVector %5 4
%23 = OpConstant %5 3
%29 = OpConstant %5 2
%34 = OpConstantTrue %13
%35 = OpTypePointer Input %13
%36 = OpVariable %35 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %17 %18
OpBranch %31
%31 = OpLabel
%11 = OpLoad %6 %8
%12 = OpLoad %5 %10
%14 = OpIEqual %13 %12 %15
OpSelectionMerge %33 None
OpBranchConditional %14 %32 %33
%32 = OpLabel
OpStore %17 %34
OpBranch %33
%33 = OpLabel
%19 = OpULessThan %13 %12 %20
%37 = OpLoad %13 %36
%38 = OpLoad %13 %17
%24 = OpLogicalOr %13 %37 %38
%25 = OpLogicalNot %13 %24
%26 = OpLogicalAnd %13 %19 %25
%22 = OpGroupNonUniformBallot %21 %23 %26
%27 = OpGroupNonUniformBallotBitCount %5 %23 Reduce %22
%28 = OpShiftLeftLogical %5 %12 %29
%30 = OpCompositeConstruct %21 %27 %27 %27 %27
OpImageWrite %11 %12 %30
%45 = OpFunctionCall %1 %39
OpReturn
OpFunctionEnd
%39 = OpFunction %1 None %2
%40 = OpLabel
%43 = OpLoad %13 %17
OpSelectionMerge %42 None
OpBranchConditional %43 %41 %42
%41 = OpLabel
OpKill
%42 = OpLabel
OpReturn
OpFunctionEnd
#endif
