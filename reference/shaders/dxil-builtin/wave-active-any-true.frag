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
    if (subgroupAny((INDEX < 100u) && (!(gl_HelperInvocation || discard_state))))
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
; Bound: 49
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformVote
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %38
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "INDEX"
OpName %17 "discard_state"
OpName %41 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %10 Flat
OpDecorate %10 Location 0
OpDecorate %38 BuiltIn HelperInvocation
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
%27 = OpConstant %5 2
%28 = OpConstant %5 1
%29 = OpTypeVector %5 4
%36 = OpConstantTrue %13
%37 = OpTypePointer Input %13
%38 = OpVariable %37 Input
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
OpStore %17 %36
OpBranch %33
%33 = OpLabel
%19 = OpULessThan %13 %12 %20
%39 = OpLoad %13 %38
%40 = OpLoad %13 %17
%23 = OpLogicalOr %13 %39 %40
%24 = OpLogicalNot %13 %23
%25 = OpLogicalAnd %13 %19 %24
%21 = OpGroupNonUniformAny %13 %22 %25
OpSelectionMerge %35 None
OpBranchConditional %21 %34 %35
%34 = OpLabel
%26 = OpShiftLeftLogical %5 %12 %27
%30 = OpCompositeConstruct %29 %28 %28 %28 %28
OpImageWrite %11 %12 %30
OpBranch %35
%35 = OpLabel
%47 = OpFunctionCall %1 %41
OpReturn
OpFunctionEnd
%41 = OpFunction %1 None %2
%42 = OpLabel
%45 = OpLoad %13 %17
OpSelectionMerge %44 None
OpBranchConditional %45 %43 %44
%43 = OpLabel
OpKill
%44 = OpLabel
OpReturn
OpFunctionEnd
#endif
