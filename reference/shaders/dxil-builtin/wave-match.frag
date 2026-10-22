#version 460
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_EXT_demote_to_helper_invocation : require
#extension GL_EXT_samplerless_texture_functions : require

uvec4 _33;

layout(set = 0, binding = 0) uniform usamplerBuffer _8;
layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _11;

layout(location = 0) flat in uint THR;

uvec4 WaveMatch(uint _24, bool _25)
{
    uvec4 _38;
    if (_25)
    {
        _38 = _33;
    }
    else
    {
        uvec4 _37;
        for (;;)
        {
            bool _36 = _24 == subgroupBroadcastFirst(_24);
            _37 = subgroupBallot(_36);
            if (_36)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _38 = _37;
    }
    return _38;
}

void main()
{
    if (THR == 40u)
    {
        demote;
    }
    bool _40 = helperInvocationEXT();
    uvec4 _39 = WaveMatch(texelFetch(_8, int(THR)).x, _40);
    bool _51 = helperInvocationEXT();
    uvec4 _50 = WaveMatch(floatBitsToUint(uintBitsToFloat(texelFetch(_8, int(THR)).x)), _51);
    bool _69 = helperInvocationEXT();
    uvec4 _68 = WaveMatch(floatBitsToUint(float(texelFetch(_8, int(THR)).x != 20u)), _69);
    uint _78 = THR * 4u;
    imageStore(_11, int(_78), uvec4((_50.x | _39.x) | _68.x));
    imageStore(_11, int(_78 + 1u), uvec4((_50.y | _39.y) | _68.y));
    imageStore(_11, int(_78 + 2u), uvec4((_50.z | _39.z) | _68.z));
    imageStore(_11, int(_78 + 3u), uvec4((_50.w | _39.w) | _68.w));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 94
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability GroupNonUniform
OpCapability GroupNonUniformBallot
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11 %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 "THR"
OpName %26 "WaveMatch"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %11 NonReadable
OpDecorate %13 Flat
OpDecorate %13 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypePointer Input %5
%13 = OpVariable %12 Input
%17 = OpTypeBool
%19 = OpConstant %5 40
%20 = OpTypeVector %5 4
%23 = OpTypeFunction %20 %5 %17
%35 = OpConstant %5 3
%47 = OpTypeFloat 32
%63 = OpConstant %5 20
%64 = OpConstant %47 0
%65 = OpConstant %47 1
%79 = OpConstant %5 4
%83 = OpConstant %5 1
%86 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %89
%89 = OpLabel
%14 = OpLoad %9 %11
%15 = OpLoad %6 %8
%16 = OpLoad %5 %13
%18 = OpIEqual %17 %16 %19
OpSelectionMerge %91 None
OpBranchConditional %18 %90 %91
%90 = OpLabel
OpDemoteToHelperInvocation
OpBranch %91
%91 = OpLabel
OpBranch %92
%92 = OpLabel
OpBranch %93
%93 = OpLabel
%21 = OpImageFetch %20 %15 %16
%22 = OpCompositeExtract %5 %21 0
%40 = OpIsHelperInvocationEXT %17
%39 = OpFunctionCall %20 %26 %22 %40
%41 = OpCompositeExtract %5 %39 0
%42 = OpCompositeExtract %5 %39 1
%43 = OpCompositeExtract %5 %39 2
%44 = OpCompositeExtract %5 %39 3
%45 = OpImageFetch %20 %15 %16
%46 = OpCompositeExtract %5 %45 0
%48 = OpBitcast %47 %46
%49 = OpBitcast %5 %48
%51 = OpIsHelperInvocationEXT %17
%50 = OpFunctionCall %20 %26 %49 %51
%52 = OpCompositeExtract %5 %50 0
%53 = OpCompositeExtract %5 %50 1
%54 = OpCompositeExtract %5 %50 2
%55 = OpCompositeExtract %5 %50 3
%56 = OpBitwiseOr %5 %52 %41
%57 = OpBitwiseOr %5 %53 %42
%58 = OpBitwiseOr %5 %54 %43
%59 = OpBitwiseOr %5 %55 %44
%60 = OpImageFetch %20 %15 %16
%61 = OpCompositeExtract %5 %60 0
%62 = OpINotEqual %17 %61 %63
%66 = OpSelect %47 %62 %65 %64
%67 = OpBitcast %5 %66
%69 = OpIsHelperInvocationEXT %17
%68 = OpFunctionCall %20 %26 %67 %69
%70 = OpCompositeExtract %5 %68 0
%71 = OpCompositeExtract %5 %68 1
%72 = OpCompositeExtract %5 %68 2
%73 = OpCompositeExtract %5 %68 3
%74 = OpBitwiseOr %5 %56 %70
%75 = OpBitwiseOr %5 %57 %71
%76 = OpBitwiseOr %5 %58 %72
%77 = OpBitwiseOr %5 %59 %73
%78 = OpIMul %5 %16 %79
%80 = OpCompositeConstruct %20 %74 %74 %74 %74
OpImageWrite %14 %78 %80
%81 = OpCompositeConstruct %20 %75 %75 %75 %75
%82 = OpIAdd %5 %78 %83
OpImageWrite %14 %82 %81
%84 = OpCompositeConstruct %20 %76 %76 %76 %76
%85 = OpIAdd %5 %78 %86
OpImageWrite %14 %85 %84
%87 = OpCompositeConstruct %20 %77 %77 %77 %77
%88 = OpIAdd %5 %78 %35
OpImageWrite %14 %88 %87
OpReturn
OpFunctionEnd
%26 = OpFunction %20 None %23
%24 = OpFunctionParameter %5
%25 = OpFunctionParameter %17
%27 = OpLabel
OpBranch %28
%28 = OpLabel
%33 = OpUndef %20
OpSelectionMerge %32 None
OpBranchConditional %25 %32 %31
%31 = OpLabel
OpLoopMerge %30 %29 None
OpBranch %29
%29 = OpLabel
%34 = OpGroupNonUniformBroadcastFirst %5 %35 %24
%36 = OpIEqual %17 %24 %34
%37 = OpGroupNonUniformBallot %20 %35 %36
OpBranchConditional %36 %30 %31
%30 = OpLabel
OpBranch %32
%32 = OpLabel
%38 = OpPhi %20 %37 %30 %33 %28
OpReturnValue %38
OpFunctionEnd
#endif
