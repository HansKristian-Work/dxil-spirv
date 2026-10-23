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
    if (subgroupAny((INDEX < 100u) && (!_20)))
    {
        imageStore(_8, int(ByteAddressMask(INDEX, 4u)), uvec4(1u));
    }
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 44
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformVote
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "INDEX"
OpName %28 "ByteAddressMask"
OpName %26 "index"
OpName %27 "stride"
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
%24 = OpConstant %5 2
%25 = OpTypeFunction %5 %5 %5
%31 = OpConstant %5 4294967295
%34 = OpConstant %5 4
%35 = OpConstant %5 1
%36 = OpTypeVector %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %38
%38 = OpLabel
%11 = OpLoad %6 %8
%12 = OpLoad %5 %10
%14 = OpIEqual %13 %12 %15
OpSelectionMerge %40 None
OpBranchConditional %14 %39 %40
%39 = OpLabel
OpDemoteToHelperInvocation
OpBranch %40
%40 = OpLabel
%16 = OpULessThan %13 %12 %17
%20 = OpIsHelperInvocationEXT %13
%21 = OpLogicalNot %13 %20
%22 = OpLogicalAnd %13 %16 %21
%18 = OpGroupNonUniformAny %13 %19 %22
OpSelectionMerge %42 None
OpBranchConditional %18 %41 %42
%41 = OpLabel
%23 = OpShiftLeftLogical %5 %12 %24
%33 = OpFunctionCall %5 %28 %12 %34
%37 = OpCompositeConstruct %36 %35 %35 %35 %35
OpImageWrite %11 %33 %37
OpBranch %42
%42 = OpLabel
OpBranch %43
%43 = OpLabel
OpReturn
OpFunctionEnd
%28 = OpFunction %5 None %25
%26 = OpFunctionParameter %5
%27 = OpFunctionParameter %5
%29 = OpLabel
%30 = OpUDiv %5 %31 %27
%32 = OpBitwiseAnd %5 %26 %30
OpReturnValue %32
OpFunctionEnd
#endif
