#version 460
#extension GL_KHR_shader_subgroup_ballot : require

layout(set = 0, binding = 0) uniform usamplerBuffer _8;
layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _11;

layout(location = 0) flat in uint THR;
bool discard_state;

uvec4 _36;

uvec4 WaveMatch(uint _27, bool _28)
{
    uvec4 _41;
    if (_28)
    {
        _41 = _36;
    }
    else
    {
        uvec4 _40;
        for (;;)
        {
            bool _39 = _27 == subgroupBroadcastFirst(_27);
            _40 = subgroupBallot(_39);
            if (_39)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _41 = _40;
    }
    return _41;
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
    uvec4 _43 = WaveMatch(texelFetch(_8, int(THR)).x, gl_HelperInvocation || discard_state);
    uvec4 _54 = WaveMatch(floatBitsToUint(uintBitsToFloat(texelFetch(_8, int(THR)).x)), gl_HelperInvocation || discard_state);
    uvec4 _72 = WaveMatch(floatBitsToUint(float(texelFetch(_8, int(THR)).x != 20u)), gl_HelperInvocation || discard_state);
    uint _82 = THR * 4u;
    imageStore(_11, int(_82), uvec4((_54.x | _43.x) | _72.x));
    imageStore(_11, int(_82 + 1u), uvec4((_54.y | _43.y) | _72.y));
    imageStore(_11, int(_82 + 2u), uvec4((_54.z | _43.z) | _72.z));
    imageStore(_11, int(_82 + 3u), uvec4((_54.w | _43.w) | _72.w));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 113
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability GroupNonUniform
OpCapability GroupNonUniformBallot
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %13 %98
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 "THR"
OpName %21 "discard_state"
OpName %29 "WaveMatch"
OpName %105 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %11 NonReadable
OpDecorate %13 Flat
OpDecorate %13 Location 0
OpDecorate %98 BuiltIn HelperInvocation
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
%20 = OpTypePointer Private %17
%21 = OpVariable %20 Private
%22 = OpConstantFalse %17
%23 = OpTypeVector %5 4
%26 = OpTypeFunction %23 %5 %17
%38 = OpConstant %5 3
%51 = OpTypeFloat 32
%67 = OpConstant %5 20
%68 = OpConstant %51 0
%69 = OpConstant %51 1
%83 = OpConstant %5 4
%87 = OpConstant %5 1
%90 = OpConstant %5 2
%96 = OpConstantTrue %17
%97 = OpTypePointer Input %17
%98 = OpVariable %97 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %21 %22
OpBranch %93
%93 = OpLabel
%14 = OpLoad %9 %11
%15 = OpLoad %6 %8
%16 = OpLoad %5 %13
%18 = OpIEqual %17 %16 %19
OpSelectionMerge %95 None
OpBranchConditional %18 %94 %95
%94 = OpLabel
OpStore %21 %96
OpBranch %95
%95 = OpLabel
%24 = OpImageFetch %23 %15 %16
%25 = OpCompositeExtract %5 %24 0
%99 = OpLoad %17 %98
%100 = OpLoad %17 %21
%44 = OpLogicalOr %17 %99 %100
%43 = OpFunctionCall %23 %29 %25 %44
%45 = OpCompositeExtract %5 %43 0
%46 = OpCompositeExtract %5 %43 1
%47 = OpCompositeExtract %5 %43 2
%48 = OpCompositeExtract %5 %43 3
%49 = OpImageFetch %23 %15 %16
%50 = OpCompositeExtract %5 %49 0
%52 = OpBitcast %51 %50
%53 = OpBitcast %5 %52
%101 = OpLoad %17 %98
%102 = OpLoad %17 %21
%55 = OpLogicalOr %17 %101 %102
%54 = OpFunctionCall %23 %29 %53 %55
%56 = OpCompositeExtract %5 %54 0
%57 = OpCompositeExtract %5 %54 1
%58 = OpCompositeExtract %5 %54 2
%59 = OpCompositeExtract %5 %54 3
%60 = OpBitwiseOr %5 %56 %45
%61 = OpBitwiseOr %5 %57 %46
%62 = OpBitwiseOr %5 %58 %47
%63 = OpBitwiseOr %5 %59 %48
%64 = OpImageFetch %23 %15 %16
%65 = OpCompositeExtract %5 %64 0
%66 = OpINotEqual %17 %65 %67
%70 = OpSelect %51 %66 %69 %68
%71 = OpBitcast %5 %70
%103 = OpLoad %17 %98
%104 = OpLoad %17 %21
%73 = OpLogicalOr %17 %103 %104
%72 = OpFunctionCall %23 %29 %71 %73
%74 = OpCompositeExtract %5 %72 0
%75 = OpCompositeExtract %5 %72 1
%76 = OpCompositeExtract %5 %72 2
%77 = OpCompositeExtract %5 %72 3
%78 = OpBitwiseOr %5 %60 %74
%79 = OpBitwiseOr %5 %61 %75
%80 = OpBitwiseOr %5 %62 %76
%81 = OpBitwiseOr %5 %63 %77
%82 = OpIMul %5 %16 %83
%84 = OpCompositeConstruct %23 %78 %78 %78 %78
OpImageWrite %14 %82 %84
%85 = OpCompositeConstruct %23 %79 %79 %79 %79
%86 = OpIAdd %5 %82 %87
OpImageWrite %14 %86 %85
%88 = OpCompositeConstruct %23 %80 %80 %80 %80
%89 = OpIAdd %5 %82 %90
OpImageWrite %14 %89 %88
%91 = OpCompositeConstruct %23 %81 %81 %81 %81
%92 = OpIAdd %5 %82 %38
OpImageWrite %14 %92 %91
%111 = OpFunctionCall %1 %105
OpReturn
OpFunctionEnd
%29 = OpFunction %23 None %26
%27 = OpFunctionParameter %5
%28 = OpFunctionParameter %17
%30 = OpLabel
OpBranch %31
%31 = OpLabel
%36 = OpUndef %23
OpSelectionMerge %34 None
OpBranchConditional %28 %34 %35
%35 = OpLabel
OpLoopMerge %33 %32 None
OpBranch %32
%32 = OpLabel
%37 = OpGroupNonUniformBroadcastFirst %5 %38 %27
%39 = OpIEqual %17 %27 %37
%40 = OpGroupNonUniformBallot %23 %38 %39
OpBranchConditional %39 %33 %35
%33 = OpLabel
OpBranch %34
%34 = OpLabel
%41 = OpPhi %23 %40 %33 %36 %31
OpReturnValue %41
OpFunctionEnd
%105 = OpFunction %1 None %2
%106 = OpLabel
%109 = OpLoad %17 %21
OpSelectionMerge %108 None
OpBranchConditional %109 %107 %108
%107 = OpLabel
OpKill
%108 = OpLabel
OpReturn
OpFunctionEnd
#endif
