#version 460
#extension GL_KHR_shader_subgroup_basic : require

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;

layout(location = 0) flat in uint THR;
bool discard_state;

bool WaveIsFirstLane(bool _21)
{
    bool _29;
    if (_21)
    {
        _29 = false;
    }
    else
    {
        _29 = subgroupElect();
    }
    return _29;
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
    if (THR == 40u)
    {
        discard_state = true;
    }
    if (WaveIsFirstLane(gl_HelperInvocation || discard_state))
    {
        imageStore(_8, int(0u), uvec4(1u));
    }
    else
    {
        imageStore(_8, int(0u), uvec4(0u));
    }
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 56
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniform
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %45
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "THR"
OpName %17 "discard_state"
OpName %22 "WaveIsFirstLane"
OpName %48 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %10 Flat
OpDecorate %10 Location 0
OpDecorate %45 BuiltIn HelperInvocation
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
%20 = OpTypeFunction %13 %13
%28 = OpConstant %5 3
%32 = OpConstant %5 0
%33 = OpConstant %5 1
%34 = OpTypeVector %5 4
%43 = OpConstantTrue %13
%44 = OpTypePointer Input %13
%45 = OpVariable %44 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %17 %18
OpBranch %37
%37 = OpLabel
%11 = OpLoad %6 %8
%12 = OpLoad %5 %10
%14 = OpIEqual %13 %12 %15
OpSelectionMerge %39 None
OpBranchConditional %14 %38 %39
%38 = OpLabel
OpStore %17 %43
OpBranch %39
%39 = OpLabel
%46 = OpLoad %13 %45
%47 = OpLoad %13 %17
%19 = OpLogicalOr %13 %46 %47
%31 = OpFunctionCall %13 %22 %19
OpSelectionMerge %42 None
OpBranchConditional %31 %41 %40
%41 = OpLabel
%35 = OpCompositeConstruct %34 %33 %33 %33 %33
OpImageWrite %11 %32 %35
OpBranch %42
%40 = OpLabel
%36 = OpCompositeConstruct %34 %32 %32 %32 %32
OpImageWrite %11 %32 %36
OpBranch %42
%42 = OpLabel
%54 = OpFunctionCall %1 %48
OpReturn
OpFunctionEnd
%22 = OpFunction %13 None %20
%21 = OpFunctionParameter %13
%23 = OpLabel
OpSelectionMerge %26 None
OpBranchConditional %21 %24 %25
%24 = OpLabel
OpBranch %26
%25 = OpLabel
%27 = OpGroupNonUniformElect %13 %28
OpBranch %26
%26 = OpLabel
%29 = OpPhi %13 %27 %25 %18 %24
OpReturnValue %29
OpFunctionEnd
%48 = OpFunction %1 None %2
%49 = OpLabel
%52 = OpLoad %13 %17
OpSelectionMerge %51 None
OpBranchConditional %52 %50 %51
%50 = OpLabel
OpKill
%51 = OpLabel
OpReturn
OpFunctionEnd
#endif
