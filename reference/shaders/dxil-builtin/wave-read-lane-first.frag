#version 460
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_KHR_shader_subgroup_shuffle : require
#extension GL_EXT_demote_to_helper_invocation : require

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;

layout(location = 0) flat in uvec3 INDEX;

uint WaveReadFirstLane(uint _28, bool _29)
{
    uvec4 _34 = subgroupBallot(!_29);
    return (subgroupBallotBitCount(_34) != 0u) ? subgroupShuffle(_28, subgroupBallotFindLSB(_34)) : 0u;
}

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    if (INDEX.x == 40u)
    {
        demote;
    }
    bool _26 = helperInvocationEXT();
    bool _43 = helperInvocationEXT();
    bool _45 = helperInvocationEXT();
    uint _58 = ByteAddressMask(INDEX.x * 3u, 4u);
    imageStore(_8, int(_58), uvec4(WaveReadFirstLane(INDEX.x, _26)));
    imageStore(_8, int(_58 + 1u), uvec4(WaveReadFirstLane(INDEX.y, _43)));
    imageStore(_8, int(_58 + 2u), uvec4(WaveReadFirstLane(INDEX.z, _45)));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 69
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
OpName %30 "WaveReadFirstLane"
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
%13 = OpTypePointer Input %5
%15 = OpConstant %5 0
%18 = OpConstant %5 1
%21 = OpConstant %5 2
%23 = OpTypeBool
%25 = OpConstant %5 40
%27 = OpTypeFunction %5 %5 %23
%32 = OpTypeVector %5 4
%35 = OpConstant %5 3
%41 = OpConstantNull %5
%48 = OpConstant %5 12
%50 = OpTypeFunction %5 %5 %5
%56 = OpConstant %5 4294967295
%59 = OpConstant %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %65
%65 = OpLabel
%12 = OpLoad %6 %8
%14 = OpAccessChain %13 %11 %15
%16 = OpLoad %5 %14
%17 = OpAccessChain %13 %11 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %13 %11 %21
%22 = OpLoad %5 %20
%24 = OpIEqual %23 %16 %25
OpSelectionMerge %67 None
OpBranchConditional %24 %66 %67
%66 = OpLabel
OpDemoteToHelperInvocation
OpBranch %67
%67 = OpLabel
OpBranch %68
%68 = OpLabel
%26 = OpIsHelperInvocationEXT %23
%42 = OpFunctionCall %5 %30 %16 %26
%43 = OpIsHelperInvocationEXT %23
%44 = OpFunctionCall %5 %30 %19 %43
%45 = OpIsHelperInvocationEXT %23
%46 = OpFunctionCall %5 %30 %22 %45
%47 = OpIMul %5 %16 %48
%49 = OpIMul %5 %16 %35
%58 = OpFunctionCall %5 %53 %49 %59
%60 = OpCompositeConstruct %32 %42 %42 %42 %42
OpImageWrite %12 %58 %60
%61 = OpCompositeConstruct %32 %44 %44 %44 %44
%62 = OpIAdd %5 %58 %18
OpImageWrite %12 %62 %61
%63 = OpCompositeConstruct %32 %46 %46 %46 %46
%64 = OpIAdd %5 %58 %21
OpImageWrite %12 %64 %63
OpReturn
OpFunctionEnd
%30 = OpFunction %5 None %27
%28 = OpFunctionParameter %5
%29 = OpFunctionParameter %23
%31 = OpLabel
%33 = OpLogicalNot %23 %29
%34 = OpGroupNonUniformBallot %32 %35 %33
%36 = OpGroupNonUniformBallotFindLSB %5 %35 %34
%37 = OpGroupNonUniformShuffle %5 %35 %28 %36
%38 = OpGroupNonUniformBallotBitCount %5 %35 Reduce %34
%39 = OpINotEqual %23 %38 %15
%40 = OpSelect %5 %39 %37 %41
OpReturnValue %40
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
