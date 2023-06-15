#version 460
#extension GL_KHR_shader_subgroup_ballot : require

layout(set = 0, binding = 0) uniform usamplerBuffer _8;
layout(set = 0, binding = 1) uniform usamplerBuffer _9;
layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _12;

layout(location = 0) flat in uint THR;
bool discard_state;

uint _63;

uint WaveMultiPrefixCountBits(bool _53, uvec4 _54, bool _55)
{
    uint _73;
    if (_55)
    {
        _73 = _63;
    }
    else
    {
        uvec4 _64 = subgroupBallot(true);
        uvec4 _66 = _64 & _54;
        uint _72;
        for (;;)
        {
            bool _69 = all(equal(_66, subgroupBroadcastFirst(_66)));
            _72 = subgroupBallotExclusiveBitCount(subgroupBallot(_69 && _53));
            if (_69)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _73 = _72;
    }
    return _73;
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
    uint _25 = THR * 4u;
    imageStore(_12, int(THR), uvec4(WaveMultiPrefixCountBits(texelFetch(_8, int(THR)).x != 10u, uvec4(uvec4(texelFetch(_9, int(_25)).x, texelFetch(_9, int(_25 + 1u)).x, texelFetch(_9, int(_25 + 2u)).x, texelFetch(_9, int(_25 + 3u)).x)), gl_HelperInvocation || discard_state)));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 94
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability GroupNonUniformArithmetic
OpCapability GroupNonUniformBallot
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14 %83
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "THR"
OpName %23 "discard_state"
OpName %56 "WaveMultiPrefixCountBits"
OpName %86 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 1
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %12 NonReadable
OpDecorate %14 Flat
OpDecorate %14 Location 0
OpDecorate %83 BuiltIn HelperInvocation
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
%22 = OpTypePointer Private %19
%23 = OpVariable %22 Private
%24 = OpConstantFalse %19
%26 = OpConstant %5 4
%27 = OpTypeVector %5 4
%32 = OpConstant %5 1
%36 = OpConstant %5 2
%40 = OpConstant %5 3
%50 = OpConstant %5 10
%51 = OpTypeVector %19 4
%52 = OpTypeFunction %5 %19 %27 %19
%65 = OpConstantTrue %19
%82 = OpTypePointer Input %19
%83 = OpVariable %82 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %23 %24
OpBranch %79
%79 = OpLabel
%15 = OpLoad %10 %12
%16 = OpLoad %6 %9
%17 = OpLoad %6 %8
%18 = OpLoad %5 %14
%20 = OpIEqual %19 %18 %21
OpSelectionMerge %81 None
OpBranchConditional %20 %80 %81
%80 = OpLabel
OpStore %23 %65
OpBranch %81
%81 = OpLabel
%25 = OpIMul %5 %18 %26
%28 = OpImageFetch %27 %16 %25
%29 = OpCompositeExtract %5 %28 0
%31 = OpIAdd %5 %25 %32
%30 = OpImageFetch %27 %16 %31
%33 = OpCompositeExtract %5 %30 0
%35 = OpIAdd %5 %25 %36
%34 = OpImageFetch %27 %16 %35
%37 = OpCompositeExtract %5 %34 0
%39 = OpIAdd %5 %25 %40
%38 = OpImageFetch %27 %16 %39
%41 = OpCompositeExtract %5 %38 0
%42 = OpCompositeConstruct %27 %29 %33 %37 %41
%43 = OpCompositeExtract %5 %42 0
%44 = OpCompositeExtract %5 %42 1
%45 = OpCompositeExtract %5 %42 2
%46 = OpCompositeExtract %5 %42 3
%47 = OpImageFetch %27 %17 %18
%48 = OpCompositeExtract %5 %47 0
%49 = OpINotEqual %19 %48 %50
%76 = OpCompositeConstruct %27 %43 %44 %45 %46
%84 = OpLoad %19 %83
%85 = OpLoad %19 %23
%77 = OpLogicalOr %19 %84 %85
%75 = OpFunctionCall %5 %56 %49 %76 %77
%78 = OpCompositeConstruct %27 %75 %75 %75 %75
OpImageWrite %15 %18 %78
%92 = OpFunctionCall %1 %86
OpReturn
OpFunctionEnd
%56 = OpFunction %5 None %52
%53 = OpFunctionParameter %19
%54 = OpFunctionParameter %27
%55 = OpFunctionParameter %19
%57 = OpLabel
%63 = OpUndef %5
OpSelectionMerge %61 None
OpBranchConditional %55 %61 %62
%62 = OpLabel
%64 = OpGroupNonUniformBallot %27 %40 %65
%66 = OpBitwiseAnd %27 %64 %54
OpBranch %58
%58 = OpLabel
OpLoopMerge %60 %59 None
OpBranch %59
%59 = OpLabel
%67 = OpGroupNonUniformBroadcastFirst %27 %40 %66
%68 = OpIEqual %51 %66 %67
%69 = OpAll %19 %68
%70 = OpLogicalAnd %19 %69 %53
%71 = OpGroupNonUniformBallot %27 %40 %70
%72 = OpGroupNonUniformBallotBitCount %5 %40 ExclusiveScan %71
OpBranchConditional %69 %60 %58
%60 = OpLabel
OpBranch %61
%61 = OpLabel
%73 = OpPhi %5 %72 %60 %63 %57
OpReturnValue %73
OpFunctionEnd
%86 = OpFunction %1 None %2
%87 = OpLabel
%90 = OpLoad %19 %23
OpSelectionMerge %89 None
OpBranchConditional %90 %88 %89
%88 = OpLabel
OpKill
%89 = OpLabel
OpReturn
OpFunctionEnd
#endif
