#version 460
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_EXT_demote_to_helper_invocation : require
#extension GL_EXT_samplerless_texture_functions : require

uint _60;

layout(set = 0, binding = 0) uniform usamplerBuffer _8;
layout(set = 0, binding = 1) uniform usamplerBuffer _9;
layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _12;

layout(location = 0) flat in uint THR;

uint WaveMultiPrefixCountBits(bool _50, uvec4 _51, bool _52)
{
    uint _70;
    if (_52)
    {
        _70 = _60;
    }
    else
    {
        uvec4 _61 = subgroupBallot(true);
        uvec4 _63 = _61 & _51;
        uint _69;
        for (;;)
        {
            bool _66 = all(equal(_63, subgroupBroadcastFirst(_63)));
            _69 = subgroupBallotExclusiveBitCount(subgroupBallot(_66 && _50));
            if (_66)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _70 = _69;
    }
    return _70;
}

void main()
{
    if (THR == 40u)
    {
        demote;
    }
    uint _22 = THR * 4u;
    bool _73 = helperInvocationEXT();
    imageStore(_12, int(THR), uvec4(WaveMultiPrefixCountBits(texelFetch(_8, int(THR)).x != 10u, uvec4(uvec4(texelFetch(_9, int(_22)).x, texelFetch(_9, int(_22 + 1u)).x, texelFetch(_9, int(_22 + 2u)).x, texelFetch(_9, int(_22 + 3u)).x)), _73)));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 80
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability GroupNonUniformArithmetic
OpCapability GroupNonUniformBallot
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %9 %12 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "THR"
OpName %53 "WaveMultiPrefixCountBits"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 1
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %12 NonReadable
OpDecorate %14 Flat
OpDecorate %14 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpVariable %7 UniformConstant
%10 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpTypePointer Input %5
%14 = OpVariable %13 Input
%19 = OpTypeBool
%21 = OpConstant %5 40
%23 = OpConstant %5 4
%24 = OpTypeVector %5 4
%29 = OpConstant %5 1
%33 = OpConstant %5 2
%37 = OpConstant %5 3
%47 = OpConstant %5 10
%48 = OpTypeVector %19 4
%49 = OpTypeFunction %5 %19 %24 %19
%62 = OpConstantTrue %19
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %75
%75 = OpLabel
%15 = OpLoad %10 %12
%16 = OpLoad %6 %9
%17 = OpLoad %6 %8
%18 = OpLoad %5 %14
%20 = OpIEqual %19 %18 %21
OpSelectionMerge %77 None
OpBranchConditional %20 %76 %77
%76 = OpLabel
OpDemoteToHelperInvocation
OpBranch %77
%77 = OpLabel
OpBranch %78
%78 = OpLabel
OpBranch %79
%79 = OpLabel
%22 = OpIMul %5 %18 %23
%25 = OpImageFetch %24 %16 %22
%26 = OpCompositeExtract %5 %25 0
%28 = OpIAdd %5 %22 %29
%27 = OpImageFetch %24 %16 %28
%30 = OpCompositeExtract %5 %27 0
%32 = OpIAdd %5 %22 %33
%31 = OpImageFetch %24 %16 %32
%34 = OpCompositeExtract %5 %31 0
%36 = OpIAdd %5 %22 %37
%35 = OpImageFetch %24 %16 %36
%38 = OpCompositeExtract %5 %35 0
%39 = OpCompositeConstruct %24 %26 %30 %34 %38
%40 = OpCompositeExtract %5 %39 0
%41 = OpCompositeExtract %5 %39 1
%42 = OpCompositeExtract %5 %39 2
%43 = OpCompositeExtract %5 %39 3
%44 = OpImageFetch %24 %17 %18
%45 = OpCompositeExtract %5 %44 0
%46 = OpINotEqual %19 %45 %47
%72 = OpCompositeConstruct %24 %40 %41 %42 %43
%73 = OpIsHelperInvocationEXT %19
%71 = OpFunctionCall %5 %53 %46 %72 %73
%74 = OpCompositeConstruct %24 %71 %71 %71 %71
OpImageWrite %15 %18 %74
OpReturn
OpFunctionEnd
%53 = OpFunction %5 None %49
%50 = OpFunctionParameter %19
%51 = OpFunctionParameter %24
%52 = OpFunctionParameter %19
%54 = OpLabel
%60 = OpUndef %5
OpSelectionMerge %59 None
OpBranchConditional %52 %59 %58
%58 = OpLabel
%61 = OpGroupNonUniformBallot %24 %37 %62
%63 = OpBitwiseAnd %24 %61 %51
OpBranch %55
%55 = OpLabel
OpLoopMerge %57 %56 None
OpBranch %56
%56 = OpLabel
%64 = OpGroupNonUniformBroadcastFirst %24 %37 %63
%65 = OpIEqual %48 %63 %64
%66 = OpAll %19 %65
%67 = OpLogicalAnd %19 %66 %50
%68 = OpGroupNonUniformBallot %24 %37 %67
%69 = OpGroupNonUniformBallotBitCount %5 %37 ExclusiveScan %68
OpBranchConditional %66 %57 %55
%57 = OpLabel
OpBranch %59
%59 = OpLabel
%70 = OpPhi %5 %69 %57 %60 %54
OpReturnValue %70
OpFunctionEnd
#endif
