#version 460
#extension GL_KHR_shader_subgroup_ballot : require

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
    imageStore(_8, int(ByteAddressMask(INDEX, 4u)), uvec4(subgroupBallotBitCount(subgroupBallot((INDEX < 100u) && (!(gl_HelperInvocation || discard_state))))));
    discard_exit();
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
OpCapability GroupNonUniformBallot
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10 %17 %49
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "INDEX"
OpName %17 "discard_state"
OpName %33 "ByteAddressMask"
OpName %31 "index"
OpName %32 "stride"
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
%21 = OpTypeVector %5 4
%23 = OpConstant %5 3
%29 = OpConstant %5 2
%30 = OpTypeFunction %5 %5 %5
%36 = OpConstant %5 4294967295
%40 = OpConstant %5 4
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
OpBranch %45
%45 = OpLabel
OpBranch %46
%46 = OpLabel
%19 = OpULessThan %13 %12 %20
%50 = OpLoad %13 %49
%51 = OpLoad %13 %17
%24 = OpLogicalOr %13 %50 %51
%25 = OpLogicalNot %13 %24
%26 = OpLogicalAnd %13 %19 %25
%22 = OpGroupNonUniformBallot %21 %23 %26
%27 = OpGroupNonUniformBallotBitCount %5 %23 Reduce %22
%28 = OpShiftLeftLogical %5 %12 %29
%39 = OpFunctionCall %5 %33 %12 %40
%41 = OpCompositeConstruct %21 %27 %27 %27 %27
OpImageWrite %11 %39 %41
%58 = OpFunctionCall %1 %52
OpReturn
OpFunctionEnd
%33 = OpFunction %5 None %30
%31 = OpFunctionParameter %5
%32 = OpFunctionParameter %5
%34 = OpLabel
%35 = OpUDiv %5 %36 %32
%37 = OpBitwiseAnd %5 %31 %35
OpReturnValue %37
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
