#version 460
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_KHR_shader_subgroup_shuffle : require

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;

layout(location = 0) flat in uvec3 INDEX;
bool discard_state;

uint WaveReadFirstLane(uint _31, bool _32)
{
    uvec4 _37 = subgroupBallot(!_32);
    return (subgroupBallotBitCount(_37) != 0u) ? subgroupShuffle(_31, subgroupBallotFindLSB(_37)) : 0u;
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
    uint _53 = INDEX.x * 3u;
    imageStore(_8, int(_53), uvec4(WaveReadFirstLane(INDEX.x, gl_HelperInvocation || discard_state)));
    imageStore(_8, int(_53 + 1u), uvec4(WaveReadFirstLane(INDEX.y, gl_HelperInvocation || discard_state)));
    imageStore(_8, int(_53 + 2u), uvec4(WaveReadFirstLane(INDEX.z, gl_HelperInvocation || discard_state)));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 79
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformBallot
OpCapability GroupNonUniformShuffle
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %11 %64
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "INDEX"
OpName %27 "discard_state"
OpName %33 "WaveReadFirstLane"
OpName %71 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %11 Flat
OpDecorate %11 Location 0
OpDecorate %64 BuiltIn HelperInvocation
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
%44 = OpConstantNull %5
%52 = OpConstant %5 12
%62 = OpConstantTrue %23
%63 = OpTypePointer Input %23
%64 = OpVariable %63 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %27 %28
OpBranch %59
%59 = OpLabel
%12 = OpLoad %6 %8
%14 = OpAccessChain %13 %11 %15
%16 = OpLoad %5 %14
%17 = OpAccessChain %13 %11 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %13 %11 %21
%22 = OpLoad %5 %20
%24 = OpIEqual %23 %16 %25
OpSelectionMerge %61 None
OpBranchConditional %24 %60 %61
%60 = OpLabel
OpStore %27 %62
OpBranch %61
%61 = OpLabel
%65 = OpLoad %23 %64
%66 = OpLoad %23 %27
%29 = OpLogicalOr %23 %65 %66
%46 = OpFunctionCall %5 %33 %16 %29
%67 = OpLoad %23 %64
%68 = OpLoad %23 %27
%47 = OpLogicalOr %23 %67 %68
%48 = OpFunctionCall %5 %33 %19 %47
%69 = OpLoad %23 %64
%70 = OpLoad %23 %27
%49 = OpLogicalOr %23 %69 %70
%50 = OpFunctionCall %5 %33 %22 %49
%51 = OpIMul %5 %16 %52
%53 = OpIMul %5 %16 %38
%54 = OpCompositeConstruct %35 %46 %46 %46 %46
OpImageWrite %12 %53 %54
%55 = OpCompositeConstruct %35 %48 %48 %48 %48
%56 = OpIAdd %5 %53 %18
OpImageWrite %12 %56 %55
%57 = OpCompositeConstruct %35 %50 %50 %50 %50
%58 = OpIAdd %5 %53 %21
OpImageWrite %12 %58 %57
%77 = OpFunctionCall %1 %71
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
%41 = OpGroupNonUniformBallotBitCount %5 %38 Reduce %37
%42 = OpINotEqual %23 %41 %15
%43 = OpSelect %5 %42 %40 %44
OpReturnValue %43
OpFunctionEnd
%71 = OpFunction %1 None %2
%72 = OpLabel
%75 = OpLoad %23 %27
OpSelectionMerge %74 None
OpBranchConditional %75 %73 %74
%73 = OpLabel
OpKill
%74 = OpLabel
OpReturn
OpFunctionEnd
#endif
