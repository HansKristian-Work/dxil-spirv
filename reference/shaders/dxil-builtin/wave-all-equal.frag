#version 460
#extension GL_EXT_demote_to_helper_invocation : require
#extension GL_KHR_shader_subgroup_vote : require

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;

layout(location = 0) flat in uint INDEX;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    if (INDEX == 40u)
    {
        demote;
    }
    if (subgroupAllEqual(INDEX))
    {
        imageStore(_8, int(ByteAddressMask(INDEX, 4u)), uvec4(1u));
    }
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 39
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformVote
OpCapability VulkanMemoryModel
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "INDEX"
OpName %23 "ByteAddressMask"
OpName %21 "index"
OpName %22 "stride"
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
%17 = OpConstant %5 3
%19 = OpConstant %5 2
%20 = OpTypeFunction %5 %5 %5
%26 = OpConstant %5 4294967295
%29 = OpConstant %5 4
%30 = OpConstant %5 1
%31 = OpTypeVector %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %33
%33 = OpLabel
%11 = OpLoad %6 %8
%12 = OpLoad %5 %10
%14 = OpIEqual %13 %12 %15
OpSelectionMerge %35 None
OpBranchConditional %14 %34 %35
%34 = OpLabel
OpDemoteToHelperInvocation
OpBranch %35
%35 = OpLabel
%16 = OpGroupNonUniformAllEqual %13 %17 %12
OpSelectionMerge %37 None
OpBranchConditional %16 %36 %37
%36 = OpLabel
%18 = OpShiftLeftLogical %5 %12 %19
%28 = OpFunctionCall %5 %23 %12 %29
%32 = OpCompositeConstruct %31 %30 %30 %30 %30
OpImageWrite %11 %28 %32 NonPrivateTexel
OpBranch %37
%37 = OpLabel
OpBranch %38
%38 = OpLabel
OpReturn
OpFunctionEnd
%23 = OpFunction %5 None %20
%21 = OpFunctionParameter %5
%22 = OpFunctionParameter %5
%24 = OpLabel
%25 = OpUDiv %5 %26 %22
%27 = OpBitwiseAnd %5 %21 %25
OpReturnValue %27
OpFunctionEnd
#endif
