#version 460
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_KHR_shader_subgroup_shuffle : require
#extension GL_EXT_demote_to_helper_invocation : require

uvec3 _17;

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;

layout(location = 0) flat in uvec3 INDEX;

uvec3 WaveReadFirstLane(uvec3 _31, bool _32)
{
    uvec4 _37 = subgroupBallot(!_32);
    return (subgroupBallotBitCount(_37) != 0u) ? subgroupShuffle(_31, subgroupBallotFindLSB(_37)) : uvec3(0u);
}

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    uvec3 _16;
    _16.x = INDEX.x;
    _16.y = INDEX.y;
    _16.z = INDEX.z;
    if (INDEX.x == 40u)
    {
        demote;
    }
    bool _29 = helperInvocationEXT();
    uvec3 _45 = WaveReadFirstLane(_16, _29);
    uint _58 = ByteAddressMask(INDEX.x * 3u, 4u);
    imageStore(_8, int(_58), uvec4(_45.x));
    imageStore(_8, int(_58 + 1u), uvec4(_45.y));
    imageStore(_8, int(_58 + 2u), uvec4(_45.z));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 73
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformBallot
OpCapability GroupNonUniformShuffle
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "INDEX"
OpName %33 "WaveReadFirstLane"
OpName %53 "ByteAddressMask"
OpName %51 "index"
OpName %52 "stride"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %11 Flat
OpDecorate %11 Location 0
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
%30 = OpTypeFunction %9 %9 %26
%35 = OpTypeVector %5 4
%38 = OpConstant %5 3
%44 = OpConstantNull %9
%47 = OpConstant %5 12
%50 = OpTypeFunction %5 %5 %5
%56 = OpConstant %5 4294967295
%59 = OpConstant %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
%17 = OpUndef %9
OpBranch %68
%68 = OpLabel
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
OpSelectionMerge %70 None
OpBranchConditional %27 %69 %70
%69 = OpLabel
OpDemoteToHelperInvocation
OpBranch %70
%70 = OpLabel
OpBranch %71
%71 = OpLabel
OpBranch %72
%72 = OpLabel
%29 = OpIsHelperInvocationEXT %26
%45 = OpFunctionCall %9 %33 %25 %29
%46 = OpIMul %5 %15 %47
%48 = OpLoad %6 %8
%49 = OpIMul %5 %15 %38
%58 = OpFunctionCall %5 %53 %49 %59
%60 = OpCompositeExtract %5 %45 0
%61 = OpCompositeExtract %5 %45 1
%62 = OpCompositeExtract %5 %45 2
%63 = OpCompositeConstruct %35 %60 %60 %60 %60
OpImageWrite %48 %58 %63
%64 = OpCompositeConstruct %35 %61 %61 %61 %61
%65 = OpIAdd %5 %58 %19
OpImageWrite %48 %65 %64
%66 = OpCompositeConstruct %35 %62 %62 %62 %62
%67 = OpIAdd %5 %58 %23
OpImageWrite %48 %67 %66
OpReturn
OpFunctionEnd
%33 = OpFunction %9 None %30
%31 = OpFunctionParameter %9
%32 = OpFunctionParameter %26
%34 = OpLabel
%36 = OpLogicalNot %26 %32
%37 = OpGroupNonUniformBallot %35 %38 %36
%39 = OpGroupNonUniformBallotFindLSB %5 %38 %37
%40 = OpGroupNonUniformShuffle %9 %38 %31 %39
%41 = OpGroupNonUniformBallotBitCount %5 %38 Reduce %37
%42 = OpINotEqual %26 %41 %14
%43 = OpSelect %9 %42 %40 %44
OpReturnValue %43
OpFunctionEnd
%53 = OpFunction %5 None %50
%51 = OpFunctionParameter %5
%52 = OpFunctionParameter %5
%54 = OpLabel
%55 = OpUDiv %5 %56 %52
%57 = OpBitwiseAnd %5 %51 %55
OpReturnValue %57
OpFunctionEnd
#endif
