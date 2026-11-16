#version 460
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_EXT_demote_to_helper_invocation : require
#extension GL_EXT_samplerless_texture_functions : require

uvec4 _47;
vec3 _87;

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

uvec4 WaveMatch(uvec3 _93, bool _94)
{
    uvec4 _107;
    if (_94)
    {
        _107 = _47;
    }
    else
    {
        uvec4 _106;
        for (;;)
        {
            bool _105 = all(equal(_93, subgroupBroadcastFirst(_93)));
            _106 = subgroupBallot(_105);
            if (_105)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _107 = _106;
    }
    return _107;
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
    uint _65 = THR * 4u;
    uvec4 _77 = uvec4(texelFetch(_8, int(_65)).x, texelFetch(_8, int(_65 + 1u)).x, texelFetch(_8, int(_65 + 2u)).x, texelFetch(_8, int(_65 + 3u)).x);
    vec3 _86;
    _86.x = float(_77.x);
    _86.y = float(_77.y);
    _86.z = float(_77.z);
    bool _109 = helperInvocationEXT();
    uvec4 _108 = WaveMatch(floatBitsToUint(_86), _109);
    uvec4 _111;
    _111.x = _108.x;
    _111.y = _108.y;
    _111.z = _108.z;
    _111.w = _108.w;
    uvec4 _118 = _111 | _57;
    uint _120 = THR * 4u;
    imageStore(_11, int(_120), uvec4(_118.x));
    imageStore(_11, int(_120 + 1u), uvec4(_118.y));
    imageStore(_11, int(_120 + 2u), uvec4(_118.z));
    imageStore(_11, int(_120 + 3u), uvec4(_118.w));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 136
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability GroupNonUniform
OpCapability GroupNonUniformBallot
OpCapability VulkanMemoryModel
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 "THR"
OpName %40 "WaveMatch"
OpName %95 "WaveMatch"
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
%47 = OpUndef %21
%49 = OpTypeVector %15 4
%81 = OpTypeFloat 32
%85 = OpTypeVector %81 3
%87 = OpUndef %85
%90 = OpTypeVector %5 3
%92 = OpTypeFunction %21 %90 %15
%103 = OpTypeVector %15 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %132
%132 = OpLabel
%14 = OpLoad %5 %13
%16 = OpIEqual %15 %14 %17
OpSelectionMerge %134 None
OpBranchConditional %16 %133 %134
%133 = OpLabel
OpDemoteToHelperInvocation
OpBranch %134
%134 = OpLabel
OpBranch %135
%135 = OpLabel
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
%57 = OpCompositeInsert %21 %56 %47 0
%58 = OpCompositeExtract %5 %54 1
%59 = OpCompositeInsert %21 %58 %57 1
%60 = OpCompositeExtract %5 %54 2
%61 = OpCompositeInsert %21 %60 %59 2
%62 = OpCompositeExtract %5 %54 3
%63 = OpCompositeInsert %21 %62 %61 3
%64 = OpLoad %6 %8
%65 = OpIMul %5 %14 %20
%66 = OpImageFetch %21 %64 %65
%67 = OpCompositeExtract %5 %66 0
%69 = OpIAdd %5 %65 %26
%68 = OpImageFetch %21 %64 %69
%70 = OpCompositeExtract %5 %68 0
%72 = OpIAdd %5 %65 %30
%71 = OpImageFetch %21 %64 %72
%73 = OpCompositeExtract %5 %71 0
%75 = OpIAdd %5 %65 %34
%74 = OpImageFetch %21 %64 %75
%76 = OpCompositeExtract %5 %74 0
%77 = OpCompositeConstruct %21 %67 %70 %73 %76
%78 = OpCompositeExtract %5 %77 0
%79 = OpCompositeExtract %5 %77 1
%80 = OpCompositeExtract %5 %77 2
%82 = OpConvertUToF %81 %78
%83 = OpConvertUToF %81 %79
%84 = OpConvertUToF %81 %80
%86 = OpCompositeInsert %85 %82 %87 0
%88 = OpCompositeInsert %85 %83 %86 1
%89 = OpCompositeInsert %85 %84 %88 2
%91 = OpBitcast %90 %89
%109 = OpIsHelperInvocationEXT %15
%108 = OpFunctionCall %21 %95 %91 %109
%110 = OpCompositeExtract %5 %108 0
%111 = OpCompositeInsert %21 %110 %47 0
%112 = OpCompositeExtract %5 %108 1
%113 = OpCompositeInsert %21 %112 %111 1
%114 = OpCompositeExtract %5 %108 2
%115 = OpCompositeInsert %21 %114 %113 2
%116 = OpCompositeExtract %5 %108 3
%117 = OpCompositeInsert %21 %116 %115 3
%118 = OpBitwiseOr %21 %117 %63
%119 = OpLoad %9 %11
%120 = OpIMul %5 %14 %20
%121 = OpCompositeExtract %5 %118 0
%122 = OpCompositeExtract %5 %118 1
%123 = OpCompositeExtract %5 %118 2
%124 = OpCompositeExtract %5 %118 3
%125 = OpCompositeConstruct %21 %121 %121 %121 %121
OpImageWrite %119 %120 %125 NonPrivateTexel
%126 = OpCompositeConstruct %21 %122 %122 %122 %122
%127 = OpIAdd %5 %120 %26
OpImageWrite %119 %127 %126 NonPrivateTexel
%128 = OpCompositeConstruct %21 %123 %123 %123 %123
%129 = OpIAdd %5 %120 %30
OpImageWrite %119 %129 %128 NonPrivateTexel
%130 = OpCompositeConstruct %21 %124 %124 %124 %124
%131 = OpIAdd %5 %120 %34
OpImageWrite %119 %131 %130 NonPrivateTexel
OpReturn
OpFunctionEnd
%40 = OpFunction %21 None %37
%38 = OpFunctionParameter %21
%39 = OpFunctionParameter %15
%41 = OpLabel
OpBranch %42
%42 = OpLabel
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
%95 = OpFunction %21 None %92
%93 = OpFunctionParameter %90
%94 = OpFunctionParameter %15
%96 = OpLabel
OpBranch %97
%97 = OpLabel
OpSelectionMerge %101 None
OpBranchConditional %94 %101 %100
%100 = OpLabel
OpLoopMerge %99 %98 None
OpBranch %98
%98 = OpLabel
%102 = OpGroupNonUniformBroadcastFirst %90 %34 %93
%104 = OpIEqual %103 %93 %102
%105 = OpAll %15 %104
%106 = OpGroupNonUniformBallot %21 %34 %105
OpBranchConditional %105 %99 %100
%99 = OpLabel
OpBranch %101
%101 = OpLabel
%107 = OpPhi %21 %106 %99 %47 %97
OpReturnValue %107
OpFunctionEnd
#endif
