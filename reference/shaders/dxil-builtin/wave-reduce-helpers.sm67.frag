#version 460
#extension GL_KHR_shader_subgroup_arithmetic : require

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;
layout(set = 0, binding = 1, r32ui) uniform writeonly uimageBuffer _9;
layout(set = 0, binding = 2, r32ui) uniform writeonly uimageBuffer _10;

layout(location = 0) flat in uint INDEX;
bool discard_state;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
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
    if (INDEX == 40u)
    {
        discard_state = true;
    }
    uint _22 = INDEX * 28u;
    imageStore(_8, int(ByteAddressMask(INDEX * 7u, 4u)), uvec4(subgroupAdd(INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 1u, 4u)), uvec4(subgroupMul(INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 2u, 4u)), uvec4(subgroupAnd(INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 3u, 4u)), uvec4(subgroupOr(INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 4u, 4u)), uvec4(subgroupXor(INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 5u, 4u)), uvec4(subgroupMin(INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 6u, 4u)), uvec4(subgroupMax(INDEX)));
    imageStore(_9, int(ByteAddressMask(INDEX * 7u, 4u)), uvec4(subgroupAdd(INDEX)));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 1u, 4u)), uvec4(subgroupMul(INDEX)));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 2u, 4u)), uvec4(subgroupAnd(INDEX)));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 3u, 4u)), uvec4(subgroupOr(INDEX)));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 4u, 4u)), uvec4(subgroupXor(INDEX)));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 5u, 4u)), uvec4(uint(subgroupMin(int(INDEX)))));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 6u, 4u)), uvec4(uint(subgroupMax(int(INDEX)))));
    float _133 = float(INDEX);
    imageStore(_10, int(ByteAddressMask(INDEX * 7u, 4u)), uvec4(uint(subgroupAdd(_133))));
    imageStore(_10, int(ByteAddressMask((INDEX * 7u) + 1u, 4u)), uvec4(uint(subgroupMul(_133))));
    imageStore(_10, int(ByteAddressMask((INDEX * 7u) + 5u, 4u)), uvec4(uint(subgroupMin(_133))));
    imageStore(_10, int(ByteAddressMask((INDEX * 7u) + 6u, 4u)), uvec4(uint(subgroupMax(_133))));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 175
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformArithmetic
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %9 %10 %12 %18
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "INDEX"
OpName %18 "discard_state"
OpName %30 "ByteAddressMask"
OpName %28 "index"
OpName %29 "stride"
OpName %167 "discard_exit"
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
%27 = OpTypeFunction %5 %5 %5
%33 = OpConstant %5 4294967295
%37 = OpConstant %5 4
%38 = OpTypeVector %5 4
%45 = OpConstant %5 1
%50 = OpConstant %5 8
%54 = OpConstant %5 2
%59 = OpConstant %5 12
%67 = OpConstant %5 16
%75 = OpConstant %5 20
%79 = OpConstant %5 5
%84 = OpConstant %5 24
%88 = OpConstant %5 6
%132 = OpTypeFloat 32
%166 = OpConstantTrue %14
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %18 %19
OpBranch %161
%161 = OpLabel
%13 = OpLoad %5 %12
%15 = OpIEqual %14 %13 %16
OpSelectionMerge %163 None
OpBranchConditional %15 %162 %163
%162 = OpLabel
OpStore %18 %166
OpBranch %163
%163 = OpLabel
OpBranch %164
%164 = OpLabel
OpBranch %165
%165 = OpLabel
%20 = OpGroupNonUniformIAdd %5 %21 Reduce %13
%22 = OpIMul %5 %13 %23
%24 = OpLoad %6 %8
%25 = OpIMul %5 %13 %26
%36 = OpFunctionCall %5 %30 %25 %37
%39 = OpCompositeConstruct %38 %20 %20 %20 %20
OpImageWrite %24 %36 %39
%40 = OpGroupNonUniformIMul %5 %21 Reduce %13
%41 = OpIAdd %5 %22 %37
%42 = OpLoad %6 %8
%43 = OpIMul %5 %13 %26
%44 = OpIAdd %5 %43 %45
%46 = OpFunctionCall %5 %30 %44 %37
%47 = OpCompositeConstruct %38 %40 %40 %40 %40
OpImageWrite %42 %46 %47
%48 = OpGroupNonUniformBitwiseAnd %5 %21 Reduce %13
%49 = OpIAdd %5 %22 %50
%51 = OpLoad %6 %8
%52 = OpIMul %5 %13 %26
%53 = OpIAdd %5 %52 %54
%55 = OpFunctionCall %5 %30 %53 %37
%56 = OpCompositeConstruct %38 %48 %48 %48 %48
OpImageWrite %51 %55 %56
%57 = OpGroupNonUniformBitwiseOr %5 %21 Reduce %13
%58 = OpIAdd %5 %22 %59
%60 = OpLoad %6 %8
%61 = OpIMul %5 %13 %26
%62 = OpIAdd %5 %61 %21
%63 = OpFunctionCall %5 %30 %62 %37
%64 = OpCompositeConstruct %38 %57 %57 %57 %57
OpImageWrite %60 %63 %64
%65 = OpGroupNonUniformBitwiseXor %5 %21 Reduce %13
%66 = OpIAdd %5 %22 %67
%68 = OpLoad %6 %8
%69 = OpIMul %5 %13 %26
%70 = OpIAdd %5 %69 %37
%71 = OpFunctionCall %5 %30 %70 %37
%72 = OpCompositeConstruct %38 %65 %65 %65 %65
OpImageWrite %68 %71 %72
%73 = OpGroupNonUniformUMin %5 %21 Reduce %13
%74 = OpIAdd %5 %22 %75
%76 = OpLoad %6 %8
%77 = OpIMul %5 %13 %26
%78 = OpIAdd %5 %77 %79
%80 = OpFunctionCall %5 %30 %78 %37
%81 = OpCompositeConstruct %38 %73 %73 %73 %73
OpImageWrite %76 %80 %81
%82 = OpGroupNonUniformUMax %5 %21 Reduce %13
%83 = OpIAdd %5 %22 %84
%85 = OpLoad %6 %8
%86 = OpIMul %5 %13 %26
%87 = OpIAdd %5 %86 %88
%89 = OpFunctionCall %5 %30 %87 %37
%90 = OpCompositeConstruct %38 %82 %82 %82 %82
OpImageWrite %85 %89 %90
%91 = OpGroupNonUniformIAdd %5 %21 Reduce %13
%92 = OpLoad %6 %9
%93 = OpIMul %5 %13 %26
%94 = OpFunctionCall %5 %30 %93 %37
%95 = OpCompositeConstruct %38 %91 %91 %91 %91
OpImageWrite %92 %94 %95
%96 = OpGroupNonUniformIMul %5 %21 Reduce %13
%97 = OpLoad %6 %9
%98 = OpIMul %5 %13 %26
%99 = OpIAdd %5 %98 %45
%100 = OpFunctionCall %5 %30 %99 %37
%101 = OpCompositeConstruct %38 %96 %96 %96 %96
OpImageWrite %97 %100 %101
%102 = OpGroupNonUniformBitwiseAnd %5 %21 Reduce %13
%103 = OpLoad %6 %9
%104 = OpIMul %5 %13 %26
%105 = OpIAdd %5 %104 %54
%106 = OpFunctionCall %5 %30 %105 %37
%107 = OpCompositeConstruct %38 %102 %102 %102 %102
OpImageWrite %103 %106 %107
%108 = OpGroupNonUniformBitwiseOr %5 %21 Reduce %13
%109 = OpLoad %6 %9
%110 = OpIMul %5 %13 %26
%111 = OpIAdd %5 %110 %21
%112 = OpFunctionCall %5 %30 %111 %37
%113 = OpCompositeConstruct %38 %108 %108 %108 %108
OpImageWrite %109 %112 %113
%114 = OpGroupNonUniformBitwiseXor %5 %21 Reduce %13
%115 = OpLoad %6 %9
%116 = OpIMul %5 %13 %26
%117 = OpIAdd %5 %116 %37
%118 = OpFunctionCall %5 %30 %117 %37
%119 = OpCompositeConstruct %38 %114 %114 %114 %114
OpImageWrite %115 %118 %119
%120 = OpGroupNonUniformSMin %5 %21 Reduce %13
%121 = OpLoad %6 %9
%122 = OpIMul %5 %13 %26
%123 = OpIAdd %5 %122 %79
%124 = OpFunctionCall %5 %30 %123 %37
%125 = OpCompositeConstruct %38 %120 %120 %120 %120
OpImageWrite %121 %124 %125
%126 = OpGroupNonUniformSMax %5 %21 Reduce %13
%127 = OpLoad %6 %9
%128 = OpIMul %5 %13 %26
%129 = OpIAdd %5 %128 %88
%130 = OpFunctionCall %5 %30 %129 %37
%131 = OpCompositeConstruct %38 %126 %126 %126 %126
OpImageWrite %127 %130 %131
%133 = OpConvertUToF %132 %13
%134 = OpGroupNonUniformFAdd %132 %21 Reduce %133
%135 = OpConvertFToU %5 %134
%136 = OpLoad %6 %10
%137 = OpIMul %5 %13 %26
%138 = OpFunctionCall %5 %30 %137 %37
%139 = OpCompositeConstruct %38 %135 %135 %135 %135
OpImageWrite %136 %138 %139
%140 = OpGroupNonUniformFMul %132 %21 Reduce %133
%141 = OpConvertFToU %5 %140
%142 = OpLoad %6 %10
%143 = OpIMul %5 %13 %26
%144 = OpIAdd %5 %143 %45
%145 = OpFunctionCall %5 %30 %144 %37
%146 = OpCompositeConstruct %38 %141 %141 %141 %141
OpImageWrite %142 %145 %146
%147 = OpGroupNonUniformFMin %132 %21 Reduce %133
%148 = OpConvertFToU %5 %147
%149 = OpLoad %6 %10
%150 = OpIMul %5 %13 %26
%151 = OpIAdd %5 %150 %79
%152 = OpFunctionCall %5 %30 %151 %37
%153 = OpCompositeConstruct %38 %148 %148 %148 %148
OpImageWrite %149 %152 %153
%154 = OpGroupNonUniformFMax %132 %21 Reduce %133
%155 = OpConvertFToU %5 %154
%156 = OpLoad %6 %10
%157 = OpIMul %5 %13 %26
%158 = OpIAdd %5 %157 %88
%159 = OpFunctionCall %5 %30 %158 %37
%160 = OpCompositeConstruct %38 %155 %155 %155 %155
OpImageWrite %156 %159 %160
%173 = OpFunctionCall %1 %167
OpReturn
OpFunctionEnd
%30 = OpFunction %5 None %27
%28 = OpFunctionParameter %5
%29 = OpFunctionParameter %5
%31 = OpLabel
%32 = OpUDiv %5 %33 %29
%34 = OpBitwiseAnd %5 %28 %32
OpReturnValue %34
OpFunctionEnd
%167 = OpFunction %1 None %2
%168 = OpLabel
%171 = OpLoad %14 %18
OpSelectionMerge %170 None
OpBranchConditional %171 %169 %170
%169 = OpLabel
OpKill
%170 = OpLabel
OpReturn
OpFunctionEnd
#endif
