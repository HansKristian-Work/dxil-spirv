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
    if (subgroupAny((INDEX < 100u) && (!(gl_HelperInvocation || discard_state))))
    {
        imageStore(_8, int(ByteAddressMask(INDEX, 4u)), uvec4(1u));
    }
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 60
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformVote
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %49
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "INDEX"
OpName %17 "discard_state"
OpName %31 "ByteAddressMask"
OpName %29 "index"
OpName %30 "stride"
OpName %52 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %10 Flat
OpDecorate %10 Location 0
OpDecorate %49 BuiltIn HelperInvocation
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
%28 = OpTypeFunction %5 %5 %5
%34 = OpConstant %5 4294967295
%38 = OpConstant %5 4
%39 = OpConstant %5 1
%40 = OpTypeVector %5 4
%47 = OpConstantTrue %13
%48 = OpTypePointer Input %13
%49 = OpVariable %48 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %17 %18
OpBranch %42
%42 = OpLabel
%11 = OpLoad %6 %8
%12 = OpLoad %5 %10
%14 = OpIEqual %13 %12 %15
OpSelectionMerge %44 None
OpBranchConditional %14 %43 %44
%43 = OpLabel
OpStore %17 %47
OpBranch %44
%44 = OpLabel
%19 = OpULessThan %13 %12 %20
%50 = OpLoad %13 %49
%51 = OpLoad %13 %17
%23 = OpLogicalOr %13 %50 %51
%24 = OpLogicalNot %13 %23
%25 = OpLogicalAnd %13 %19 %24
%21 = OpGroupNonUniformAny %13 %22 %25
OpSelectionMerge %46 None
OpBranchConditional %21 %45 %46
%45 = OpLabel
%26 = OpShiftLeftLogical %5 %12 %27
%37 = OpFunctionCall %5 %31 %12 %38
%41 = OpCompositeConstruct %40 %39 %39 %39 %39
OpImageWrite %11 %37 %41
OpBranch %46
%46 = OpLabel
%58 = OpFunctionCall %1 %52
OpReturn
OpFunctionEnd
%31 = OpFunction %5 None %28
%29 = OpFunctionParameter %5
%30 = OpFunctionParameter %5
%32 = OpLabel
%33 = OpUDiv %5 %34 %30
%35 = OpBitwiseAnd %5 %29 %33
OpReturnValue %35
OpFunctionEnd
%52 = OpFunction %1 None %2
%53 = OpLabel
%56 = OpLoad %13 %17
OpSelectionMerge %55 None
OpBranchConditional %56 %54 %55
%54 = OpLabel
OpKill
%55 = OpLabel
OpReturn
OpFunctionEnd
#endif
