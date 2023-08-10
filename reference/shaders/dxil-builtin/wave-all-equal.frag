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
    if (subgroupAllEqual(INDEX))
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
; Bound: 40
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformVote
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "INDEX"
OpName %17 "discard_state"
OpName %32 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %10 Flat
OpDecorate %10 Location 0
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
%20 = OpConstant %5 3
%22 = OpConstant %5 2
%23 = OpConstant %5 1
%24 = OpTypeVector %5 4
%31 = OpConstantTrue %13
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %17 %18
OpBranch %26
%26 = OpLabel
%11 = OpLoad %6 %8
%12 = OpLoad %5 %10
%14 = OpIEqual %13 %12 %15
OpSelectionMerge %28 None
OpBranchConditional %14 %27 %28
%27 = OpLabel
OpStore %17 %31
OpBranch %28
%28 = OpLabel
%19 = OpGroupNonUniformAllEqual %13 %20 %12
OpSelectionMerge %30 None
OpBranchConditional %19 %29 %30
%29 = OpLabel
%21 = OpShiftLeftLogical %5 %12 %22
%25 = OpCompositeConstruct %24 %23 %23 %23 %23
OpImageWrite %11 %12 %25
OpBranch %30
%30 = OpLabel
%38 = OpFunctionCall %1 %32
OpReturn
OpFunctionEnd
%32 = OpFunction %1 None %2
%33 = OpLabel
%36 = OpLoad %13 %17
OpSelectionMerge %35 None
OpBranchConditional %36 %34 %35
%34 = OpLabel
OpKill
%35 = OpLabel
OpReturn
OpFunctionEnd
#endif
