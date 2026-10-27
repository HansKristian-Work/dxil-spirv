#version 460
#extension GL_KHR_shader_subgroup_basic : require
#extension GL_EXT_demote_to_helper_invocation : require

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;

layout(location = 0) flat in uint THR;

bool WaveIsFirstLane(bool _18)
{
    bool _26;
    if (_18)
    {
        _26 = false;
    }
    else
    {
        _26 = subgroupElect();
    }
    return _26;
}

void main()
{
    if (THR == 40u)
    {
        demote;
    }
    bool _16 = helperInvocationEXT();
    if (WaveIsFirstLane(_16))
    {
        imageStore(_8, int(0u), uvec4(1u));
    }
    else
    {
        imageStore(_8, int(0u), uvec4(0u));
    }
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 41
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniform
OpCapability VulkanMemoryModel
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "THR"
OpName %19 "WaveIsFirstLane"
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
%17 = OpTypeFunction %13 %13
%25 = OpConstant %5 3
%27 = OpConstantFalse %13
%29 = OpConstant %5 0
%30 = OpTypeVector %5 4
%32 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %34
%34 = OpLabel
%11 = OpLoad %6 %8
%12 = OpLoad %5 %10
%14 = OpIEqual %13 %12 %15
OpSelectionMerge %36 None
OpBranchConditional %14 %35 %36
%35 = OpLabel
OpDemoteToHelperInvocation
OpBranch %36
%36 = OpLabel
%16 = OpIsHelperInvocationEXT %13
%28 = OpFunctionCall %13 %19 %16
OpSelectionMerge %39 None
OpBranchConditional %28 %38 %37
%37 = OpLabel
%31 = OpCompositeConstruct %30 %29 %29 %29 %29
OpImageWrite %11 %29 %31 NonPrivateTexel
OpBranch %39
%38 = OpLabel
%33 = OpCompositeConstruct %30 %32 %32 %32 %32
OpImageWrite %11 %29 %33 NonPrivateTexel
OpBranch %39
%39 = OpLabel
OpBranch %40
%40 = OpLabel
OpReturn
OpFunctionEnd
%19 = OpFunction %13 None %17
%18 = OpFunctionParameter %13
%20 = OpLabel
OpSelectionMerge %23 None
OpBranchConditional %18 %21 %22
%21 = OpLabel
OpBranch %23
%22 = OpLabel
%24 = OpGroupNonUniformElect %13 %25
OpBranch %23
%23 = OpLabel
%26 = OpPhi %13 %24 %22 %27 %21
OpReturnValue %26
OpFunctionEnd
#endif
