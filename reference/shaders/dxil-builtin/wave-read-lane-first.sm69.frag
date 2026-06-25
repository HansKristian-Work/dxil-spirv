#version 460
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_KHR_shader_subgroup_shuffle : require

uvec3 _17;

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;

layout(location = 0) flat in uvec3 INDEX;
bool discard_state;

uvec3 WaveReadFirstLane(uvec3 _34, bool _35)
{
    uvec4 _40 = subgroupBallot(!_35);
    return (subgroupBallotBitCount(_40) != 0u) ? subgroupShuffle(_34, subgroupBallotFindLSB(_40)) : uvec3(0u);
}

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
    uvec3 _16;
    _16.x = INDEX.x;
    _16.y = INDEX.y;
    _16.z = INDEX.z;
    if (INDEX.x == 40u)
    {
        discard_state = true;
    }
    uvec3 _49 = WaveReadFirstLane(_16, gl_HelperInvocation || discard_state);
    uint _63 = ByteAddressMask(INDEX.x * 3u, 4u);
    imageStore(_8, int(_63), uvec4(_49.x));
    imageStore(_8, int(_63 + 1u), uvec4(_49.y));
    imageStore(_8, int(_63 + 2u), uvec4(_49.z));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 89
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformBallot
OpCapability GroupNonUniformShuffle
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11 %30 %78
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "INDEX"
OpName %30 "discard_state"
OpName %36 "WaveReadFirstLane"
OpName %57 "ByteAddressMask"
OpName %55 "index"
OpName %56 "stride"
OpName %81 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %11 Flat
OpDecorate %11 Location 0
OpDecorate %78 BuiltIn HelperInvocation
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeVector %5 3
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypePointer Input %5
%14 = OpConstant %5 0
%19 = OpConstant %5 1
%23 = OpConstant %5 2
%26 = OpTypeBool
%28 = OpConstant %5 40
%29 = OpTypePointer Private %26
%30 = OpVariable %29 Private
%31 = OpConstantFalse %26
%33 = OpTypeFunction %9 %9 %26
%38 = OpTypeVector %5 4
%41 = OpConstant %5 3
%47 = OpConstantNull %9
%51 = OpConstant %5 12
%54 = OpTypeFunction %5 %5 %5
%60 = OpConstant %5 4294967295
%64 = OpConstant %5 4
%76 = OpConstantTrue %26
%77 = OpTypePointer Input %26
%78 = OpVariable %77 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
%17 = OpUndef %9
OpStore %30 %31
OpBranch %73
%73 = OpLabel
%13 = OpAccessChain %12 %11 %14
%15 = OpLoad %5 %13
%16 = OpCompositeInsert %9 %15 %17 0
%18 = OpAccessChain %12 %11 %19
%20 = OpLoad %5 %18
%21 = OpCompositeInsert %9 %20 %16 1
%22 = OpAccessChain %12 %11 %23
%24 = OpLoad %5 %22
%25 = OpCompositeInsert %9 %24 %21 2
%27 = OpIEqual %26 %15 %28
OpSelectionMerge %75 None
OpBranchConditional %27 %74 %75
%74 = OpLabel
OpStore %30 %76
OpBranch %75
%75 = OpLabel
%79 = OpLoad %26 %78
%80 = OpLoad %26 %30
%32 = OpLogicalOr %26 %79 %80
%49 = OpFunctionCall %9 %36 %25 %32
%50 = OpIMul %5 %15 %51
%52 = OpLoad %6 %8
%53 = OpIMul %5 %15 %41
%63 = OpFunctionCall %5 %57 %53 %64
%65 = OpCompositeExtract %5 %49 0
%66 = OpCompositeExtract %5 %49 1
%67 = OpCompositeExtract %5 %49 2
%68 = OpCompositeConstruct %38 %65 %65 %65 %65
OpImageWrite %52 %63 %68
%69 = OpCompositeConstruct %38 %66 %66 %66 %66
%70 = OpIAdd %5 %63 %19
OpImageWrite %52 %70 %69
%71 = OpCompositeConstruct %38 %67 %67 %67 %67
%72 = OpIAdd %5 %63 %23
OpImageWrite %52 %72 %71
%87 = OpFunctionCall %1 %81
OpReturn
OpFunctionEnd
%36 = OpFunction %9 None %33
%34 = OpFunctionParameter %9
%35 = OpFunctionParameter %26
%37 = OpLabel
%39 = OpLogicalNot %26 %35
%40 = OpGroupNonUniformBallot %38 %41 %39
%42 = OpGroupNonUniformBallotFindLSB %5 %41 %40
%43 = OpGroupNonUniformShuffle %9 %41 %34 %42
%44 = OpGroupNonUniformBallotBitCount %5 %41 Reduce %40
%45 = OpINotEqual %26 %44 %14
%46 = OpSelect %9 %45 %43 %47
OpReturnValue %46
OpFunctionEnd
%57 = OpFunction %5 None %54
%55 = OpFunctionParameter %5
%56 = OpFunctionParameter %5
%58 = OpLabel
%59 = OpUDiv %5 %60 %56
%61 = OpBitwiseAnd %5 %55 %59
OpReturnValue %61
OpFunctionEnd
%81 = OpFunction %1 None %2
%82 = OpLabel
%85 = OpLoad %26 %30
OpSelectionMerge %84 None
OpBranchConditional %85 %83 %84
%83 = OpLabel
OpKill
%84 = OpLabel
OpReturn
OpFunctionEnd
#endif
