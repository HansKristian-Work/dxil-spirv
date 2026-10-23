#version 460
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_EXT_demote_to_helper_invocation : require
#extension GL_EXT_samplerless_texture_functions : require

uvec4 _58;
vec3 _88;
uvec4 _47;
uvec4 _103;

layout(set = 0, binding = 0) uniform usamplerBuffer _8;
layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _11;

layout(location = 0) flat in uint THR;

uvec4 WaveMatch(uvec4 _38, bool _39)
{
    uvec4 _53;
    if (_39)
    {
        _53 = _47;
    }
    else
    {
        uvec4 _52;
        for (;;)
        {
            bool _51 = all(equal(_38, subgroupBroadcastFirst(_38)));
            _52 = subgroupBallot(_51);
            if (_51)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _53 = _52;
    }
    return _53;
}

uvec4 WaveMatch(uvec3 _94, bool _95)
{
    uvec4 _109;
    if (_95)
    {
        _109 = _103;
    }
    else
    {
        uvec4 _108;
        for (;;)
        {
            bool _107 = all(equal(_94, subgroupBroadcastFirst(_94)));
            _108 = subgroupBallot(_107);
            if (_107)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _109 = _108;
    }
    return _109;
}

void main()
{
    if (THR == 40u)
    {
        demote;
    }
    uint _19 = THR * 4u;
    bool _55 = helperInvocationEXT();
    uvec4 _54 = WaveMatch(uvec4(texelFetch(_8, int(_19)).x, texelFetch(_8, int(_19 + 1u)).x, texelFetch(_8, int(_19 + 2u)).x, texelFetch(_8, int(_19 + 3u)).x), _55);
    uvec4 _57;
    _57.x = _54.x;
    _57.y = _54.y;
    _57.z = _54.z;
    _57.w = _54.w;
    uint _66 = THR * 4u;
    uvec4 _78 = uvec4(texelFetch(_8, int(_66)).x, texelFetch(_8, int(_66 + 1u)).x, texelFetch(_8, int(_66 + 2u)).x, texelFetch(_8, int(_66 + 3u)).x);
    vec3 _87;
    _87.x = float(_78.x);
    _87.y = float(_78.y);
    _87.z = float(_78.z);
    bool _111 = helperInvocationEXT();
    uvec4 _110 = WaveMatch(floatBitsToUint(_87), _111);
    uvec4 _113;
    _113.x = _110.x;
    _113.y = _110.y;
    _113.z = _110.z;
    _113.w = _110.w;
    uvec4 _120 = _113 | _57;
    uint _122 = THR * 4u;
    imageStore(_11, int(_122), uvec4(_120.x));
    imageStore(_11, int(_122 + 1u), uvec4(_120.y));
    imageStore(_11, int(_122 + 2u), uvec4(_120.z));
    imageStore(_11, int(_122 + 3u), uvec4(_120.w));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 138
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
OpName %40 "WaveMatch"
OpName %96 "WaveMatch"
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
%15 = OpTypeBool
%17 = OpConstant %5 40
%20 = OpConstant %5 4
%21 = OpTypeVector %5 4
%26 = OpConstant %5 1
%30 = OpConstant %5 2
%34 = OpConstant %5 3
%37 = OpTypeFunction %21 %21 %15
%49 = OpTypeVector %15 4
%82 = OpTypeFloat 32
%86 = OpTypeVector %82 3
%91 = OpTypeVector %5 3
%93 = OpTypeFunction %21 %91 %15
%105 = OpTypeVector %15 3
%3 = OpFunction %1 None %2
%4 = OpLabel
%58 = OpUndef %21
%88 = OpUndef %86
OpBranch %134
%134 = OpLabel
%14 = OpLoad %5 %13
%16 = OpIEqual %15 %14 %17
OpSelectionMerge %136 None
OpBranchConditional %16 %135 %136
%135 = OpLabel
OpDemoteToHelperInvocation
OpBranch %136
%136 = OpLabel
OpBranch %137
%137 = OpLabel
%18 = OpLoad %6 %8
%19 = OpIMul %5 %14 %20
%22 = OpImageFetch %21 %18 %19
%23 = OpCompositeExtract %5 %22 0
%25 = OpIAdd %5 %19 %26
%24 = OpImageFetch %21 %18 %25
%27 = OpCompositeExtract %5 %24 0
%29 = OpIAdd %5 %19 %30
%28 = OpImageFetch %21 %18 %29
%31 = OpCompositeExtract %5 %28 0
%33 = OpIAdd %5 %19 %34
%32 = OpImageFetch %21 %18 %33
%35 = OpCompositeExtract %5 %32 0
%36 = OpCompositeConstruct %21 %23 %27 %31 %35
%55 = OpIsHelperInvocationEXT %15
%54 = OpFunctionCall %21 %40 %36 %55
%56 = OpCompositeExtract %5 %54 0
%57 = OpCompositeInsert %21 %56 %58 0
%59 = OpCompositeExtract %5 %54 1
%60 = OpCompositeInsert %21 %59 %57 1
%61 = OpCompositeExtract %5 %54 2
%62 = OpCompositeInsert %21 %61 %60 2
%63 = OpCompositeExtract %5 %54 3
%64 = OpCompositeInsert %21 %63 %62 3
%65 = OpLoad %6 %8
%66 = OpIMul %5 %14 %20
%67 = OpImageFetch %21 %65 %66
%68 = OpCompositeExtract %5 %67 0
%70 = OpIAdd %5 %66 %26
%69 = OpImageFetch %21 %65 %70
%71 = OpCompositeExtract %5 %69 0
%73 = OpIAdd %5 %66 %30
%72 = OpImageFetch %21 %65 %73
%74 = OpCompositeExtract %5 %72 0
%76 = OpIAdd %5 %66 %34
%75 = OpImageFetch %21 %65 %76
%77 = OpCompositeExtract %5 %75 0
%78 = OpCompositeConstruct %21 %68 %71 %74 %77
%79 = OpCompositeExtract %5 %78 0
%80 = OpCompositeExtract %5 %78 1
%81 = OpCompositeExtract %5 %78 2
%83 = OpConvertUToF %82 %79
%84 = OpConvertUToF %82 %80
%85 = OpConvertUToF %82 %81
%87 = OpCompositeInsert %86 %83 %88 0
%89 = OpCompositeInsert %86 %84 %87 1
%90 = OpCompositeInsert %86 %85 %89 2
%92 = OpBitcast %91 %90
%111 = OpIsHelperInvocationEXT %15
%110 = OpFunctionCall %21 %96 %92 %111
%112 = OpCompositeExtract %5 %110 0
%113 = OpCompositeInsert %21 %112 %58 0
%114 = OpCompositeExtract %5 %110 1
%115 = OpCompositeInsert %21 %114 %113 1
%116 = OpCompositeExtract %5 %110 2
%117 = OpCompositeInsert %21 %116 %115 2
%118 = OpCompositeExtract %5 %110 3
%119 = OpCompositeInsert %21 %118 %117 3
%120 = OpBitwiseOr %21 %119 %64
%121 = OpLoad %9 %11
%122 = OpIMul %5 %14 %20
%123 = OpCompositeExtract %5 %120 0
%124 = OpCompositeExtract %5 %120 1
%125 = OpCompositeExtract %5 %120 2
%126 = OpCompositeExtract %5 %120 3
%127 = OpCompositeConstruct %21 %123 %123 %123 %123
OpImageWrite %121 %122 %127
%128 = OpCompositeConstruct %21 %124 %124 %124 %124
%129 = OpIAdd %5 %122 %26
OpImageWrite %121 %129 %128
%130 = OpCompositeConstruct %21 %125 %125 %125 %125
%131 = OpIAdd %5 %122 %30
OpImageWrite %121 %131 %130
%132 = OpCompositeConstruct %21 %126 %126 %126 %126
%133 = OpIAdd %5 %122 %34
OpImageWrite %121 %133 %132
OpReturn
OpFunctionEnd
%40 = OpFunction %21 None %37
%38 = OpFunctionParameter %21
%39 = OpFunctionParameter %15
%41 = OpLabel
OpBranch %42
%42 = OpLabel
%47 = OpUndef %21
OpSelectionMerge %46 None
OpBranchConditional %39 %46 %45
%45 = OpLabel
OpLoopMerge %44 %43 None
OpBranch %43
%43 = OpLabel
%48 = OpGroupNonUniformBroadcastFirst %21 %34 %38
%50 = OpIEqual %49 %38 %48
%51 = OpAll %15 %50
%52 = OpGroupNonUniformBallot %21 %34 %51
OpBranchConditional %51 %44 %45
%44 = OpLabel
OpBranch %46
%46 = OpLabel
%53 = OpPhi %21 %52 %44 %47 %42
OpReturnValue %53
OpFunctionEnd
%96 = OpFunction %21 None %93
%94 = OpFunctionParameter %91
%95 = OpFunctionParameter %15
%97 = OpLabel
OpBranch %98
%98 = OpLabel
%103 = OpUndef %21
OpSelectionMerge %102 None
OpBranchConditional %95 %102 %101
%101 = OpLabel
OpLoopMerge %100 %99 None
OpBranch %99
%99 = OpLabel
%104 = OpGroupNonUniformBroadcastFirst %91 %34 %94
%106 = OpIEqual %105 %94 %104
%107 = OpAll %15 %106
%108 = OpGroupNonUniformBallot %21 %34 %107
OpBranchConditional %107 %100 %101
%100 = OpLabel
OpBranch %102
%102 = OpLabel
%109 = OpPhi %21 %108 %100 %103 %98
OpReturnValue %109
OpFunctionEnd
#endif
