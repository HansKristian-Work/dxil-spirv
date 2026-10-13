#version 460
#extension GL_KHR_shader_subgroup_vote : require

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;

layout(location = 0) flat in uint INDEX;
bool discard_state;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
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
    if (subgroupAll((INDEX < 100u) || (gl_HelperInvocation || discard_state)))
    {
        imageStore(_8, int(ByteAddressMask(INDEX, 4u)), uvec4(1u));
    }
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 63
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformVote
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10 %17 %52
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "INDEX"
OpName %17 "discard_state"
OpName %30 "ByteAddressMask"
OpName %28 "index"
OpName %29 "stride"
OpName %55 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %10 Flat
OpDecorate %10 Location 0
OpDecorate %52 BuiltIn HelperInvocation
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
%26 = OpConstant %5 2
%27 = OpTypeFunction %5 %5 %5
%33 = OpConstant %5 4294967295
%37 = OpConstant %5 4
%38 = OpConstant %5 1
%39 = OpTypeVector %5 4
%50 = OpConstantTrue %13
%51 = OpTypePointer Input %13
%52 = OpVariable %51 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %17 %18
OpBranch %41
%41 = OpLabel
%11 = OpLoad %6 %8
%12 = OpLoad %5 %10
%14 = OpIEqual %13 %12 %15
OpSelectionMerge %43 None
OpBranchConditional %14 %42 %43
%42 = OpLabel
OpStore %17 %50
OpBranch %43
%43 = OpLabel
OpBranch %44
%44 = OpLabel
OpBranch %45
%45 = OpLabel
%19 = OpULessThan %13 %12 %20
%53 = OpLoad %13 %52
%54 = OpLoad %13 %17
%23 = OpLogicalOr %13 %53 %54
%24 = OpLogicalOr %13 %19 %23
%21 = OpGroupNonUniformAll %13 %22 %24
OpSelectionMerge %47 None
OpBranchConditional %21 %46 %47
%46 = OpLabel
%25 = OpShiftLeftLogical %5 %12 %26
%36 = OpFunctionCall %5 %30 %12 %37
%40 = OpCompositeConstruct %39 %38 %38 %38 %38
OpImageWrite %11 %36 %40
OpBranch %47
%47 = OpLabel
OpBranch %48
%48 = OpLabel
OpBranch %49
%49 = OpLabel
%61 = OpFunctionCall %1 %55
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
%55 = OpFunction %1 None %2
%56 = OpLabel
%59 = OpLoad %13 %17
OpSelectionMerge %58 None
OpBranchConditional %59 %57 %58
%57 = OpLabel
OpKill
%58 = OpLabel
OpReturn
OpFunctionEnd
#endif
