#version 460
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_EXT_samplerless_texture_functions : require

uvec4 _62;
vec3 _92;
uvec4 _50;
uvec4 _107;

layout(set = 0, binding = 0) uniform usamplerBuffer _8;
layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _11;

layout(location = 0) flat in uint THR;
bool discard_state;

uvec4 WaveMatch(uvec4 _41, bool _42)
{
    uvec4 _56;
    if (_42)
    {
        _56 = _50;
    }
    else
    {
        uvec4 _55;
        for (;;)
        {
            bool _54 = all(equal(_41, subgroupBroadcastFirst(_41)));
            _55 = subgroupBallot(_54);
            if (_54)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _56 = _55;
    }
    return _56;
}

uvec4 WaveMatch(uvec3 _98, bool _99)
{
    uvec4 _113;
    if (_99)
    {
        _113 = _107;
    }
    else
    {
        uvec4 _112;
        for (;;)
        {
            bool _111 = all(equal(_98, subgroupBroadcastFirst(_98)));
            _112 = subgroupBallot(_111);
            if (_111)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _113 = _112;
    }
    return _113;
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
    if (THR == 40u)
    {
        discard_state = true;
    }
    uint _22 = THR * 4u;
    uvec4 _58 = WaveMatch(uvec4(texelFetch(_8, int(_22)).x, texelFetch(_8, int(_22 + 1u)).x, texelFetch(_8, int(_22 + 2u)).x, texelFetch(_8, int(_22 + 3u)).x), gl_HelperInvocation || discard_state);
    uvec4 _61;
    _61.x = _58.x;
    _61.y = _58.y;
    _61.z = _58.z;
    _61.w = _58.w;
    uint _70 = THR * 4u;
    uvec4 _82 = uvec4(texelFetch(_8, int(_70)).x, texelFetch(_8, int(_70 + 1u)).x, texelFetch(_8, int(_70 + 2u)).x, texelFetch(_8, int(_70 + 3u)).x);
    vec3 _91;
    _91.x = float(_82.x);
    _91.y = float(_82.y);
    _91.z = float(_82.z);
    uvec4 _115 = WaveMatch(floatBitsToUint(_91), gl_HelperInvocation || discard_state);
    uvec4 _118;
    _118.x = _115.x;
    _118.y = _115.y;
    _118.z = _115.z;
    _118.w = _115.w;
    uvec4 _125 = _118 | _61;
    uint _127 = THR * 4u;
    imageStore(_11, int(_127), uvec4(_125.x));
    imageStore(_11, int(_127 + 1u), uvec4(_125.y));
    imageStore(_11, int(_127 + 2u), uvec4(_125.z));
    imageStore(_11, int(_127 + 3u), uvec4(_125.w));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 157
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability GroupNonUniform
OpCapability GroupNonUniformBallot
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11 %13 %19 %144
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 "THR"
OpName %19 "discard_state"
OpName %43 "WaveMatch"
OpName %100 "WaveMatch"
OpName %149 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %11 NonReadable
OpDecorate %13 Flat
OpDecorate %13 Location 0
OpDecorate %144 BuiltIn HelperInvocation
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
%18 = OpTypePointer Private %15
%19 = OpVariable %18 Private
%20 = OpConstantFalse %15
%23 = OpConstant %5 4
%24 = OpTypeVector %5 4
%29 = OpConstant %5 1
%33 = OpConstant %5 2
%37 = OpConstant %5 3
%40 = OpTypeFunction %24 %24 %15
%52 = OpTypeVector %15 4
%86 = OpTypeFloat 32
%90 = OpTypeVector %86 3
%95 = OpTypeVector %5 3
%97 = OpTypeFunction %24 %95 %15
%109 = OpTypeVector %15 3
%142 = OpConstantTrue %15
%143 = OpTypePointer Input %15
%144 = OpVariable %143 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %19 %20
%62 = OpUndef %24
%92 = OpUndef %90
OpBranch %139
%139 = OpLabel
%14 = OpLoad %5 %13
%16 = OpIEqual %15 %14 %17
OpSelectionMerge %141 None
OpBranchConditional %16 %140 %141
%140 = OpLabel
OpStore %19 %142
OpBranch %141
%141 = OpLabel
%21 = OpLoad %6 %8
%22 = OpIMul %5 %14 %23
%25 = OpImageFetch %24 %21 %22
%26 = OpCompositeExtract %5 %25 0
%28 = OpIAdd %5 %22 %29
%27 = OpImageFetch %24 %21 %28
%30 = OpCompositeExtract %5 %27 0
%32 = OpIAdd %5 %22 %33
%31 = OpImageFetch %24 %21 %32
%34 = OpCompositeExtract %5 %31 0
%36 = OpIAdd %5 %22 %37
%35 = OpImageFetch %24 %21 %36
%38 = OpCompositeExtract %5 %35 0
%39 = OpCompositeConstruct %24 %26 %30 %34 %38
%145 = OpLoad %15 %144
%146 = OpLoad %15 %19
%59 = OpLogicalOr %15 %145 %146
%58 = OpFunctionCall %24 %43 %39 %59
%60 = OpCompositeExtract %5 %58 0
%61 = OpCompositeInsert %24 %60 %62 0
%63 = OpCompositeExtract %5 %58 1
%64 = OpCompositeInsert %24 %63 %61 1
%65 = OpCompositeExtract %5 %58 2
%66 = OpCompositeInsert %24 %65 %64 2
%67 = OpCompositeExtract %5 %58 3
%68 = OpCompositeInsert %24 %67 %66 3
%69 = OpLoad %6 %8
%70 = OpIMul %5 %14 %23
%71 = OpImageFetch %24 %69 %70
%72 = OpCompositeExtract %5 %71 0
%74 = OpIAdd %5 %70 %29
%73 = OpImageFetch %24 %69 %74
%75 = OpCompositeExtract %5 %73 0
%77 = OpIAdd %5 %70 %33
%76 = OpImageFetch %24 %69 %77
%78 = OpCompositeExtract %5 %76 0
%80 = OpIAdd %5 %70 %37
%79 = OpImageFetch %24 %69 %80
%81 = OpCompositeExtract %5 %79 0
%82 = OpCompositeConstruct %24 %72 %75 %78 %81
%83 = OpCompositeExtract %5 %82 0
%84 = OpCompositeExtract %5 %82 1
%85 = OpCompositeExtract %5 %82 2
%87 = OpConvertUToF %86 %83
%88 = OpConvertUToF %86 %84
%89 = OpConvertUToF %86 %85
%91 = OpCompositeInsert %90 %87 %92 0
%93 = OpCompositeInsert %90 %88 %91 1
%94 = OpCompositeInsert %90 %89 %93 2
%96 = OpBitcast %95 %94
%147 = OpLoad %15 %144
%148 = OpLoad %15 %19
%116 = OpLogicalOr %15 %147 %148
%115 = OpFunctionCall %24 %100 %96 %116
%117 = OpCompositeExtract %5 %115 0
%118 = OpCompositeInsert %24 %117 %62 0
%119 = OpCompositeExtract %5 %115 1
%120 = OpCompositeInsert %24 %119 %118 1
%121 = OpCompositeExtract %5 %115 2
%122 = OpCompositeInsert %24 %121 %120 2
%123 = OpCompositeExtract %5 %115 3
%124 = OpCompositeInsert %24 %123 %122 3
%125 = OpBitwiseOr %24 %124 %68
%126 = OpLoad %9 %11
%127 = OpIMul %5 %14 %23
%128 = OpCompositeExtract %5 %125 0
%129 = OpCompositeExtract %5 %125 1
%130 = OpCompositeExtract %5 %125 2
%131 = OpCompositeExtract %5 %125 3
%132 = OpCompositeConstruct %24 %128 %128 %128 %128
OpImageWrite %126 %127 %132
%133 = OpCompositeConstruct %24 %129 %129 %129 %129
%134 = OpIAdd %5 %127 %29
OpImageWrite %126 %134 %133
%135 = OpCompositeConstruct %24 %130 %130 %130 %130
%136 = OpIAdd %5 %127 %33
OpImageWrite %126 %136 %135
%137 = OpCompositeConstruct %24 %131 %131 %131 %131
%138 = OpIAdd %5 %127 %37
OpImageWrite %126 %138 %137
%155 = OpFunctionCall %1 %149
OpReturn
OpFunctionEnd
%43 = OpFunction %24 None %40
%41 = OpFunctionParameter %24
%42 = OpFunctionParameter %15
%44 = OpLabel
OpBranch %45
%45 = OpLabel
%50 = OpUndef %24
OpSelectionMerge %48 None
OpBranchConditional %42 %48 %49
%49 = OpLabel
OpLoopMerge %47 %46 None
OpBranch %46
%46 = OpLabel
%51 = OpGroupNonUniformBroadcastFirst %24 %37 %41
%53 = OpIEqual %52 %41 %51
%54 = OpAll %15 %53
%55 = OpGroupNonUniformBallot %24 %37 %54
OpBranchConditional %54 %47 %49
%47 = OpLabel
OpBranch %48
%48 = OpLabel
%56 = OpPhi %24 %55 %47 %50 %45
OpReturnValue %56
OpFunctionEnd
%100 = OpFunction %24 None %97
%98 = OpFunctionParameter %95
%99 = OpFunctionParameter %15
%101 = OpLabel
OpBranch %102
%102 = OpLabel
%107 = OpUndef %24
OpSelectionMerge %105 None
OpBranchConditional %99 %105 %106
%106 = OpLabel
OpLoopMerge %104 %103 None
OpBranch %103
%103 = OpLabel
%108 = OpGroupNonUniformBroadcastFirst %95 %37 %98
%110 = OpIEqual %109 %98 %108
%111 = OpAll %15 %110
%112 = OpGroupNonUniformBallot %24 %37 %111
OpBranchConditional %111 %104 %106
%104 = OpLabel
OpBranch %105
%105 = OpLabel
%113 = OpPhi %24 %112 %104 %107 %102
OpReturnValue %113
OpFunctionEnd
%149 = OpFunction %1 None %2
%150 = OpLabel
%153 = OpLoad %15 %19
OpSelectionMerge %152 None
OpBranchConditional %153 %151 %152
%151 = OpLabel
OpKill
%152 = OpLabel
OpReturn
OpFunctionEnd
#endif
