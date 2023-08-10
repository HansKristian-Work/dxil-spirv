#version 460
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_KHR_shader_subgroup_shuffle : require

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;

layout(location = 0) flat in uvec3 INDEX;
bool discard_state;

uint WaveReadFirstLane(uint _31, bool _32)
{
    return subgroupShuffle(_31, subgroupBallotFindLSB(subgroupBallot(!_32)));
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
    if (INDEX.x == 40u)
    {
        discard_state = true;
    }
    uint _49 = INDEX.x * 3u;
    imageStore(_8, int(_49), uvec4(WaveReadFirstLane(INDEX.x, gl_HelperInvocation || discard_state)));
    imageStore(_8, int(_49 + 1u), uvec4(WaveReadFirstLane(INDEX.y, gl_HelperInvocation || discard_state)));
    imageStore(_8, int(_49 + 2u), uvec4(WaveReadFirstLane(INDEX.z, gl_HelperInvocation || discard_state)));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 75
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformBallot
OpCapability GroupNonUniformShuffle
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %11 %60
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "INDEX"
OpName %27 "discard_state"
OpName %33 "WaveReadFirstLane"
OpName %67 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %11 Flat
OpDecorate %11 Location 0
OpDecorate %60 BuiltIn HelperInvocation
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeVector %5 3
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%13 = OpTypePointer Input %5
%15 = OpConstant %5 0
%18 = OpConstant %5 1
%21 = OpConstant %5 2
%23 = OpTypeBool
%25 = OpConstant %5 40
%26 = OpTypePointer Private %23
%27 = OpVariable %26 Private
%28 = OpConstantFalse %23
%30 = OpTypeFunction %5 %5 %23
%35 = OpTypeVector %5 4
%38 = OpConstant %5 3
%48 = OpConstant %5 12
%58 = OpConstantTrue %23
%59 = OpTypePointer Input %23
%60 = OpVariable %59 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %27 %28
OpBranch %55
%55 = OpLabel
%12 = OpLoad %6 %8
%14 = OpAccessChain %13 %11 %15
%16 = OpLoad %5 %14
%17 = OpAccessChain %13 %11 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %13 %11 %21
%22 = OpLoad %5 %20
%24 = OpIEqual %23 %16 %25
OpSelectionMerge %57 None
OpBranchConditional %24 %56 %57
%56 = OpLabel
OpStore %27 %58
OpBranch %57
%57 = OpLabel
%61 = OpLoad %23 %60
%62 = OpLoad %23 %27
%29 = OpLogicalOr %23 %61 %62
%42 = OpFunctionCall %5 %33 %16 %29
%63 = OpLoad %23 %60
%64 = OpLoad %23 %27
%43 = OpLogicalOr %23 %63 %64
%44 = OpFunctionCall %5 %33 %19 %43
%65 = OpLoad %23 %60
%66 = OpLoad %23 %27
%45 = OpLogicalOr %23 %65 %66
%46 = OpFunctionCall %5 %33 %22 %45
%47 = OpIMul %5 %16 %48
%49 = OpIMul %5 %16 %38
%50 = OpCompositeConstruct %35 %42 %42 %42 %42
OpImageWrite %12 %49 %50
%51 = OpCompositeConstruct %35 %44 %44 %44 %44
%52 = OpIAdd %5 %49 %18
OpImageWrite %12 %52 %51
%53 = OpCompositeConstruct %35 %46 %46 %46 %46
%54 = OpIAdd %5 %49 %21
OpImageWrite %12 %54 %53
%73 = OpFunctionCall %1 %67
OpReturn
OpFunctionEnd
%33 = OpFunction %5 None %30
%31 = OpFunctionParameter %5
%32 = OpFunctionParameter %23
%34 = OpLabel
%36 = OpLogicalNot %23 %32
%37 = OpGroupNonUniformBallot %35 %38 %36
%39 = OpGroupNonUniformBallotFindLSB %5 %38 %37
%40 = OpGroupNonUniformShuffle %5 %38 %31 %39
OpReturnValue %40
OpFunctionEnd
%67 = OpFunction %1 None %2
%68 = OpLabel
%71 = OpLoad %23 %27
OpSelectionMerge %70 None
OpBranchConditional %71 %69 %70
%69 = OpLabel
OpKill
%70 = OpLabel
OpReturn
OpFunctionEnd
#endif
