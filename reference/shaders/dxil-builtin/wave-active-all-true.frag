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
    bool _20 = helperInvocationEXT();
    if (subgroupAll((INDEX < 100u) || _20))
    {
        imageStore(_8, int(ByteAddressMask(INDEX, 4u)), uvec4(1u));
    }
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 43
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
OpName %27 "ByteAddressMask"
OpName %25 "index"
OpName %26 "stride"
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
%17 = OpConstant %5 100
%19 = OpConstant %5 3
%23 = OpConstant %5 2
%24 = OpTypeFunction %5 %5 %5
%30 = OpConstant %5 4294967295
%33 = OpConstant %5 4
%34 = OpConstant %5 1
%35 = OpTypeVector %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %37
%37 = OpLabel
%11 = OpLoad %6 %8
%12 = OpLoad %5 %10
%14 = OpIEqual %13 %12 %15
OpSelectionMerge %39 None
OpBranchConditional %14 %38 %39
%38 = OpLabel
OpDemoteToHelperInvocation
OpBranch %39
%39 = OpLabel
%16 = OpULessThan %13 %12 %17
%20 = OpIsHelperInvocationEXT %13
%21 = OpLogicalOr %13 %16 %20
%18 = OpGroupNonUniformAll %13 %19 %21
OpSelectionMerge %41 None
OpBranchConditional %18 %40 %41
%40 = OpLabel
%22 = OpShiftLeftLogical %5 %12 %23
%32 = OpFunctionCall %5 %27 %12 %33
%36 = OpCompositeConstruct %35 %34 %34 %34 %34
OpImageWrite %11 %32 %36 NonPrivateTexel
OpBranch %41
%41 = OpLabel
OpBranch %42
%42 = OpLabel
OpReturn
OpFunctionEnd
%27 = OpFunction %5 None %24
%25 = OpFunctionParameter %5
%26 = OpFunctionParameter %5
%28 = OpLabel
%29 = OpUDiv %5 %30 %26
%31 = OpBitwiseAnd %5 %25 %29
OpReturnValue %31
OpFunctionEnd
#endif
