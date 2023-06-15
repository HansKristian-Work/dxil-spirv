#version 460
#extension GL_KHR_shader_subgroup_vote : require

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;

layout(location = 0) flat in uint INDEX;
bool discard_state;

bool _28;

bool WaveActiveAllEqual(uint _21, bool _22)
{
    bool _31;
    if (_22)
    {
        _31 = _28;
    }
    else
    {
        _31 = subgroupAllEqual(_21);
    }
    return _31;
}

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
    if (WaveActiveAllEqual(INDEX, gl_HelperInvocation || discard_state))
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
; Bound: 57
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformVote
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %46
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "INDEX"
OpName %17 "discard_state"
OpName %23 "WaveActiveAllEqual"
OpName %49 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %10 Flat
OpDecorate %10 Location 0
OpDecorate %46 BuiltIn HelperInvocation
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
%20 = OpTypeFunction %13 %5 %13
%30 = OpConstant %5 3
%35 = OpConstant %5 2
%36 = OpConstant %5 1
%37 = OpTypeVector %5 4
%44 = OpConstantTrue %13
%45 = OpTypePointer Input %13
%46 = OpVariable %45 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %17 %18
OpBranch %39
%39 = OpLabel
%11 = OpLoad %6 %8
%12 = OpLoad %5 %10
%14 = OpIEqual %13 %12 %15
OpSelectionMerge %41 None
OpBranchConditional %14 %40 %41
%40 = OpLabel
OpStore %17 %44
OpBranch %41
%41 = OpLabel
%47 = OpLoad %13 %46
%48 = OpLoad %13 %17
%19 = OpLogicalOr %13 %47 %48
%33 = OpFunctionCall %13 %23 %12 %19
OpSelectionMerge %43 None
OpBranchConditional %33 %42 %43
%42 = OpLabel
%34 = OpShiftLeftLogical %5 %12 %35
%38 = OpCompositeConstruct %37 %36 %36 %36 %36
OpImageWrite %11 %12 %38
OpBranch %43
%43 = OpLabel
%55 = OpFunctionCall %1 %49
OpReturn
OpFunctionEnd
%23 = OpFunction %13 None %20
%21 = OpFunctionParameter %5
%22 = OpFunctionParameter %13
%24 = OpLabel
OpSelectionMerge %27 None
OpBranchConditional %22 %25 %26
%25 = OpLabel
%28 = OpUndef %13
OpBranch %27
%26 = OpLabel
%29 = OpGroupNonUniformAllEqual %13 %30 %21
OpBranch %27
%27 = OpLabel
%31 = OpPhi %13 %29 %26 %28 %25
OpReturnValue %31
OpFunctionEnd
%49 = OpFunction %1 None %2
%50 = OpLabel
%53 = OpLoad %13 %17
OpSelectionMerge %52 None
OpBranchConditional %53 %51 %52
%51 = OpLabel
OpKill
%52 = OpLabel
OpReturn
OpFunctionEnd
#endif
