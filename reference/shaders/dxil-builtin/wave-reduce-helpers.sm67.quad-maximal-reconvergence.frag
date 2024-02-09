#version 460
#extension GL_KHR_shader_subgroup_arithmetic : require

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;
layout(set = 0, binding = 1, r32ui) uniform writeonly uimageBuffer _9;
layout(set = 0, binding = 2, r32ui) uniform writeonly uimageBuffer _10;

layout(location = 0) flat in uint INDEX;
bool discard_state;

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
    if (INDEX == 40u)
    {
        discard_state = true;
    }
    uint _22 = INDEX * 28u;
    imageStore(_8, int(INDEX * 7u), uvec4(subgroupAdd(INDEX)));
    imageStore(_8, int((INDEX * 7u) + 1u), uvec4(subgroupMul(INDEX)));
    imageStore(_8, int((INDEX * 7u) + 2u), uvec4(subgroupAnd(INDEX)));
    imageStore(_8, int((INDEX * 7u) + 3u), uvec4(subgroupOr(INDEX)));
    imageStore(_8, int((INDEX * 7u) + 4u), uvec4(subgroupXor(INDEX)));
    imageStore(_8, int((INDEX * 7u) + 5u), uvec4(subgroupMin(INDEX)));
    imageStore(_8, int((INDEX * 7u) + 6u), uvec4(subgroupMax(INDEX)));
    imageStore(_9, int(INDEX * 7u), uvec4(subgroupAdd(INDEX)));
    imageStore(_9, int((INDEX * 7u) + 1u), uvec4(subgroupMul(INDEX)));
    imageStore(_9, int((INDEX * 7u) + 2u), uvec4(subgroupAnd(INDEX)));
    imageStore(_9, int((INDEX * 7u) + 3u), uvec4(subgroupOr(INDEX)));
    imageStore(_9, int((INDEX * 7u) + 4u), uvec4(subgroupXor(INDEX)));
    imageStore(_9, int((INDEX * 7u) + 5u), uvec4(uint(subgroupMin(int(INDEX)))));
    imageStore(_9, int((INDEX * 7u) + 6u), uvec4(uint(subgroupMax(int(INDEX)))));
    float _110 = float(INDEX);
    imageStore(_10, int(INDEX * 7u), uvec4(uint(subgroupAdd(_110))));
    imageStore(_10, int((INDEX * 7u) + 1u), uvec4(uint(subgroupMul(_110))));
    imageStore(_10, int((INDEX * 7u) + 5u), uvec4(uint(subgroupMin(_110))));
    imageStore(_10, int((INDEX * 7u) + 6u), uvec4(uint(subgroupMax(_110))));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 146
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformArithmetic
OpExtension "SPV_KHR_maximal_reconvergence"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %12
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 MaximallyReconvergesKHR
OpName %3 "main"
OpName %12 "INDEX"
OpName %18 "discard_state"
OpName %138 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 1
OpDecorate %9 NonReadable
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 2
OpDecorate %10 NonReadable
OpDecorate %12 Flat
OpDecorate %12 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpVariable %7 UniformConstant
%10 = OpVariable %7 UniformConstant
%11 = OpTypePointer Input %5
%12 = OpVariable %11 Input
%14 = OpTypeBool
%16 = OpConstant %5 40
%17 = OpTypePointer Private %14
%18 = OpVariable %17 Private
%19 = OpConstantFalse %14
%21 = OpConstant %5 3
%23 = OpConstant %5 28
%26 = OpConstant %5 7
%27 = OpTypeVector %5 4
%31 = OpConstant %5 4
%35 = OpConstant %5 1
%39 = OpConstant %5 8
%43 = OpConstant %5 2
%47 = OpConstant %5 12
%54 = OpConstant %5 16
%61 = OpConstant %5 20
%65 = OpConstant %5 5
%69 = OpConstant %5 24
%73 = OpConstant %5 6
%109 = OpTypeFloat 32
%137 = OpConstantTrue %14
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %18 %19
OpBranch %134
%134 = OpLabel
%13 = OpLoad %5 %12
%15 = OpIEqual %14 %13 %16
OpSelectionMerge %136 None
OpBranchConditional %15 %135 %136
%135 = OpLabel
OpStore %18 %137
OpBranch %136
%136 = OpLabel
%20 = OpGroupNonUniformIAdd %5 %21 Reduce %13
%22 = OpIMul %5 %13 %23
%24 = OpLoad %6 %8
%25 = OpIMul %5 %13 %26
%28 = OpCompositeConstruct %27 %20 %20 %20 %20
OpImageWrite %24 %25 %28
%29 = OpGroupNonUniformIMul %5 %21 Reduce %13
%30 = OpIAdd %5 %22 %31
%32 = OpLoad %6 %8
%33 = OpIMul %5 %13 %26
%34 = OpIAdd %5 %33 %35
%36 = OpCompositeConstruct %27 %29 %29 %29 %29
OpImageWrite %32 %34 %36
%37 = OpGroupNonUniformBitwiseAnd %5 %21 Reduce %13
%38 = OpIAdd %5 %22 %39
%40 = OpLoad %6 %8
%41 = OpIMul %5 %13 %26
%42 = OpIAdd %5 %41 %43
%44 = OpCompositeConstruct %27 %37 %37 %37 %37
OpImageWrite %40 %42 %44
%45 = OpGroupNonUniformBitwiseOr %5 %21 Reduce %13
%46 = OpIAdd %5 %22 %47
%48 = OpLoad %6 %8
%49 = OpIMul %5 %13 %26
%50 = OpIAdd %5 %49 %21
%51 = OpCompositeConstruct %27 %45 %45 %45 %45
OpImageWrite %48 %50 %51
%52 = OpGroupNonUniformBitwiseXor %5 %21 Reduce %13
%53 = OpIAdd %5 %22 %54
%55 = OpLoad %6 %8
%56 = OpIMul %5 %13 %26
%57 = OpIAdd %5 %56 %31
%58 = OpCompositeConstruct %27 %52 %52 %52 %52
OpImageWrite %55 %57 %58
%59 = OpGroupNonUniformUMin %5 %21 Reduce %13
%60 = OpIAdd %5 %22 %61
%62 = OpLoad %6 %8
%63 = OpIMul %5 %13 %26
%64 = OpIAdd %5 %63 %65
%66 = OpCompositeConstruct %27 %59 %59 %59 %59
OpImageWrite %62 %64 %66
%67 = OpGroupNonUniformUMax %5 %21 Reduce %13
%68 = OpIAdd %5 %22 %69
%70 = OpLoad %6 %8
%71 = OpIMul %5 %13 %26
%72 = OpIAdd %5 %71 %73
%74 = OpCompositeConstruct %27 %67 %67 %67 %67
OpImageWrite %70 %72 %74
%75 = OpGroupNonUniformIAdd %5 %21 Reduce %13
%76 = OpLoad %6 %9
%77 = OpIMul %5 %13 %26
%78 = OpCompositeConstruct %27 %75 %75 %75 %75
OpImageWrite %76 %77 %78
%79 = OpGroupNonUniformIMul %5 %21 Reduce %13
%80 = OpLoad %6 %9
%81 = OpIMul %5 %13 %26
%82 = OpIAdd %5 %81 %35
%83 = OpCompositeConstruct %27 %79 %79 %79 %79
OpImageWrite %80 %82 %83
%84 = OpGroupNonUniformBitwiseAnd %5 %21 Reduce %13
%85 = OpLoad %6 %9
%86 = OpIMul %5 %13 %26
%87 = OpIAdd %5 %86 %43
%88 = OpCompositeConstruct %27 %84 %84 %84 %84
OpImageWrite %85 %87 %88
%89 = OpGroupNonUniformBitwiseOr %5 %21 Reduce %13
%90 = OpLoad %6 %9
%91 = OpIMul %5 %13 %26
%92 = OpIAdd %5 %91 %21
%93 = OpCompositeConstruct %27 %89 %89 %89 %89
OpImageWrite %90 %92 %93
%94 = OpGroupNonUniformBitwiseXor %5 %21 Reduce %13
%95 = OpLoad %6 %9
%96 = OpIMul %5 %13 %26
%97 = OpIAdd %5 %96 %31
%98 = OpCompositeConstruct %27 %94 %94 %94 %94
OpImageWrite %95 %97 %98
%99 = OpGroupNonUniformSMin %5 %21 Reduce %13
%100 = OpLoad %6 %9
%101 = OpIMul %5 %13 %26
%102 = OpIAdd %5 %101 %65
%103 = OpCompositeConstruct %27 %99 %99 %99 %99
OpImageWrite %100 %102 %103
%104 = OpGroupNonUniformSMax %5 %21 Reduce %13
%105 = OpLoad %6 %9
%106 = OpIMul %5 %13 %26
%107 = OpIAdd %5 %106 %73
%108 = OpCompositeConstruct %27 %104 %104 %104 %104
OpImageWrite %105 %107 %108
%110 = OpConvertUToF %109 %13
%111 = OpGroupNonUniformFAdd %109 %21 Reduce %110
%112 = OpConvertFToU %5 %111
%113 = OpLoad %6 %10
%114 = OpIMul %5 %13 %26
%115 = OpCompositeConstruct %27 %112 %112 %112 %112
OpImageWrite %113 %114 %115
%116 = OpGroupNonUniformFMul %109 %21 Reduce %110
%117 = OpConvertFToU %5 %116
%118 = OpLoad %6 %10
%119 = OpIMul %5 %13 %26
%120 = OpIAdd %5 %119 %35
%121 = OpCompositeConstruct %27 %117 %117 %117 %117
OpImageWrite %118 %120 %121
%122 = OpGroupNonUniformFMin %109 %21 Reduce %110
%123 = OpConvertFToU %5 %122
%124 = OpLoad %6 %10
%125 = OpIMul %5 %13 %26
%126 = OpIAdd %5 %125 %65
%127 = OpCompositeConstruct %27 %123 %123 %123 %123
OpImageWrite %124 %126 %127
%128 = OpGroupNonUniformFMax %109 %21 Reduce %110
%129 = OpConvertFToU %5 %128
%130 = OpLoad %6 %10
%131 = OpIMul %5 %13 %26
%132 = OpIAdd %5 %131 %73
%133 = OpCompositeConstruct %27 %129 %129 %129 %129
OpImageWrite %130 %132 %133
%144 = OpFunctionCall %1 %138
OpReturn
OpFunctionEnd
%138 = OpFunction %1 None %2
%139 = OpLabel
%142 = OpLoad %14 %18
OpSelectionMerge %141 None
OpBranchConditional %142 %140 %141
%140 = OpLabel
OpKill
%141 = OpLabel
OpReturn
OpFunctionEnd
#endif
