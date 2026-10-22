#version 460
#extension GL_EXT_demote_to_helper_invocation : require
#extension GL_KHR_shader_subgroup_ballot : require

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
    bool _21 = helperInvocationEXT();
    imageStore(_8, int(ByteAddressMask(INDEX, 4u)), uvec4(subgroupBallotBitCount(subgroupBallot((INDEX < 100u) && (!_21)))));
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
OpCapability GroupNonUniformBallot
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "INDEX"
OpName %30 "ByteAddressMask"
OpName %28 "index"
OpName %29 "stride"
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
%18 = OpTypeVector %5 4
%20 = OpConstant %5 3
%26 = OpConstant %5 2
%27 = OpTypeFunction %5 %5 %5
%33 = OpConstant %5 4294967295
%36 = OpConstant %5 4
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
OpBranch %41
%41 = OpLabel
OpBranch %42
%42 = OpLabel
%16 = OpULessThan %13 %12 %17
%21 = OpIsHelperInvocationEXT %13
%22 = OpLogicalNot %13 %21
%23 = OpLogicalAnd %13 %16 %22
%19 = OpGroupNonUniformBallot %18 %20 %23
%24 = OpGroupNonUniformBallotBitCount %5 %20 Reduce %19
%25 = OpShiftLeftLogical %5 %12 %26
%35 = OpFunctionCall %5 %30 %12 %36
%37 = OpCompositeConstruct %18 %24 %24 %24 %24
OpImageWrite %11 %35 %37
OpReturn
OpFunctionEnd
%30 = OpFunction %5 None %27
%28 = OpFunctionParameter %5
%29 = OpFunctionParameter %5
%31 = OpLabel
%32 = OpUDiv %5 %33 %29
%34 = OpBitwiseAnd %5 %28 %32
OpReturnValue %34
OpFunctionEnd
#endif
