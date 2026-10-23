#version 460
#extension GL_EXT_demote_to_helper_invocation : require
#extension GL_KHR_shader_subgroup_vote : require

vec2 _22;

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
    vec2 _21;
    _21.x = float(INDEX);
    _21.y = float(INDEX + 1u);
    if (notEqual(uvec2(bvec2(subgroupAllEqual(_21.x), subgroupAllEqual(_21.y))), uvec2(0u)).x)
    {
        imageStore(_8, int(ByteAddressMask(INDEX, 4u)), uvec4(1u));
    }
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 60
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
OpName %45 "ByteAddressMask"
OpName %43 "index"
OpName %44 "stride"
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
%12 = OpTypeBool
%14 = OpConstant %5 40
%15 = OpTypeFloat 32
%18 = OpConstant %5 1
%20 = OpTypeVector %15 2
%24 = OpTypeVector %12 2
%28 = OpConstant %5 3
%31 = OpConstant %5 0
%32 = OpTypeVector %5 2
%33 = OpConstantComposite %32 %31 %31
%34 = OpConstantComposite %32 %18 %18
%37 = OpConstantNull %32
%40 = OpConstant %5 2
%42 = OpTypeFunction %5 %5 %5
%48 = OpConstant %5 4294967295
%51 = OpConstant %5 4
%52 = OpTypeVector %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
%22 = OpUndef %20
OpBranch %54
%54 = OpLabel
%11 = OpLoad %5 %10
%13 = OpIEqual %12 %11 %14
OpSelectionMerge %56 None
OpBranchConditional %13 %55 %56
%55 = OpLabel
OpDemoteToHelperInvocation
OpBranch %56
%56 = OpLabel
%16 = OpConvertUToF %15 %11
%17 = OpIAdd %5 %11 %18
%19 = OpConvertUToF %15 %17
%21 = OpCompositeInsert %20 %16 %22 0
%23 = OpCompositeInsert %20 %19 %21 1
%26 = OpCompositeExtract %15 %23 0
%27 = OpGroupNonUniformAllEqual %12 %28 %26
%29 = OpCompositeExtract %15 %23 1
%30 = OpGroupNonUniformAllEqual %12 %28 %29
%25 = OpCompositeConstruct %24 %27 %30
%35 = OpSelect %32 %25 %34 %33
%36 = OpINotEqual %24 %35 %37
%38 = OpCompositeExtract %12 %36 0
OpSelectionMerge %58 None
OpBranchConditional %38 %57 %58
%57 = OpLabel
%39 = OpShiftLeftLogical %5 %11 %40
%41 = OpLoad %6 %8
%50 = OpFunctionCall %5 %45 %11 %51
%53 = OpCompositeConstruct %52 %18 %18 %18 %18
OpImageWrite %41 %50 %53
OpBranch %58
%58 = OpLabel
OpBranch %59
%59 = OpLabel
OpReturn
OpFunctionEnd
%45 = OpFunction %5 None %42
%43 = OpFunctionParameter %5
%44 = OpFunctionParameter %5
%46 = OpLabel
%47 = OpUDiv %5 %48 %44
%49 = OpBitwiseAnd %5 %43 %47
OpReturnValue %49
OpFunctionEnd
#endif
