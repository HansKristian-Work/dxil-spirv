#version 460
#extension GL_KHR_shader_subgroup_vote : require

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
    if (subgroupAll((INDEX < 100u) || (gl_HelperInvocation || discard_state)))
    {
        imageStore(_8, int(INDEX), uvec4(1u));
    }
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 48
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformVote
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %37
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "INDEX"
OpName %17 "discard_state"
OpName %40 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %10 Flat
OpDecorate %10 Location 0
OpDecorate %37 BuiltIn HelperInvocation
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
%22 = OpConstant %5 3
%26 = OpConstant %5 2
%27 = OpConstant %5 1
%28 = OpTypeVector %5 4
%35 = OpConstantTrue %13
%36 = OpTypePointer Input %13
%37 = OpVariable %36 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %17 %18
OpBranch %30
%30 = OpLabel
%11 = OpLoad %6 %8
%12 = OpLoad %5 %10
%14 = OpIEqual %13 %12 %15
OpSelectionMerge %32 None
OpBranchConditional %14 %31 %32
%31 = OpLabel
OpStore %17 %35
OpBranch %32
%32 = OpLabel
%19 = OpULessThan %13 %12 %20
%38 = OpLoad %13 %37
%39 = OpLoad %13 %17
%23 = OpLogicalOr %13 %38 %39
%24 = OpLogicalOr %13 %19 %23
%21 = OpGroupNonUniformAll %13 %22 %24
OpSelectionMerge %34 None
OpBranchConditional %21 %33 %34
%33 = OpLabel
%25 = OpShiftLeftLogical %5 %12 %26
%29 = OpCompositeConstruct %28 %27 %27 %27 %27
OpImageWrite %11 %12 %29
OpBranch %34
%34 = OpLabel
%46 = OpFunctionCall %1 %40
OpReturn
OpFunctionEnd
%40 = OpFunction %1 None %2
%41 = OpLabel
%44 = OpLoad %13 %17
OpSelectionMerge %43 None
OpBranchConditional %44 %42 %43
%42 = OpLabel
OpKill
%43 = OpLabel
OpReturn
OpFunctionEnd
#endif
