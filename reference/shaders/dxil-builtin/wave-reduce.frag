#version 460
#extension GL_EXT_demote_to_helper_invocation : require
#extension GL_KHR_shader_subgroup_arithmetic : require

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;
layout(set = 0, binding = 1, r32ui) uniform writeonly uimageBuffer _9;
layout(set = 0, binding = 2, r32ui) uniform writeonly uimageBuffer _10;

layout(location = 0) flat in uint INDEX;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    if (INDEX == 40u)
    {
        demote;
    }
    bool _22 = helperInvocationEXT();
    uint _25 = INDEX * 28u;
    imageStore(_8, int(ByteAddressMask(INDEX * 7u, 4u)), uvec4(subgroupAdd(_22 ? 0u : INDEX)));
    bool _42 = helperInvocationEXT();
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 1u, 4u)), uvec4(subgroupMul(_42 ? 1u : INDEX)));
    bool _51 = helperInvocationEXT();
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 2u, 4u)), uvec4(subgroupAnd(_51 ? 4294967295u : INDEX)));
    bool _61 = helperInvocationEXT();
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 3u, 4u)), uvec4(subgroupOr(_61 ? 0u : INDEX)));
    bool _70 = helperInvocationEXT();
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 4u, 4u)), uvec4(subgroupXor(_70 ? 0u : INDEX)));
    bool _79 = helperInvocationEXT();
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 5u, 4u)), uvec4(subgroupMin(_79 ? 4294967295u : INDEX)));
    bool _89 = helperInvocationEXT();
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 6u, 4u)), uvec4(subgroupMax(_89 ? 0u : INDEX)));
    bool _99 = helperInvocationEXT();
    imageStore(_9, int(ByteAddressMask(INDEX * 7u, 4u)), uvec4(subgroupAdd(_99 ? 0u : INDEX)));
    bool _105 = helperInvocationEXT();
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 1u, 4u)), uvec4(subgroupMul(_105 ? 1u : INDEX)));
    bool _112 = helperInvocationEXT();
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 2u, 4u)), uvec4(subgroupAnd(_112 ? 4294967295u : INDEX)));
    bool _119 = helperInvocationEXT();
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 3u, 4u)), uvec4(subgroupOr(_119 ? 0u : INDEX)));
    bool _126 = helperInvocationEXT();
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 4u, 4u)), uvec4(subgroupXor(_126 ? 0u : INDEX)));
    bool _133 = helperInvocationEXT();
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 5u, 4u)), uvec4(uint(subgroupMin(int(_133 ? 2147483647u : INDEX)))));
    bool _141 = helperInvocationEXT();
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 6u, 4u)), uvec4(uint(subgroupMax(int(_141 ? 2147483648u : INDEX)))));
    float _149 = float(INDEX);
    bool _151 = helperInvocationEXT();
    imageStore(_10, int(ByteAddressMask(INDEX * 7u, 4u)), uvec4(uint(subgroupAdd(_151 ? 0.0 : _149))));
    bool _159 = helperInvocationEXT();
    imageStore(_10, int(ByteAddressMask((INDEX * 7u) + 1u, 4u)), uvec4(uint(subgroupMul(_159 ? 1.0 : _149))));
    bool _168 = helperInvocationEXT();
    imageStore(_10, int(ByteAddressMask((INDEX * 7u) + 5u, 4u)), uvec4(uint(subgroupMin(_168 ? uintBitsToFloat(0x7f800000u /* inf */) : _149))));
    bool _177 = helperInvocationEXT();
    imageStore(_10, int(ByteAddressMask((INDEX * 7u) + 6u, 4u)), uvec4(uint(subgroupMax(_177 ? uintBitsToFloat(0xff800000u /* -inf */) : _149))));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 189
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformArithmetic
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %9 %10 %12
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "INDEX"
OpName %32 "ByteAddressMask"
OpName %30 "index"
OpName %31 "stride"
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
%17 = OpTypeBool
%19 = OpConstant %5 40
%21 = OpConstant %5 3
%23 = OpConstant %5 0
%26 = OpConstant %5 28
%28 = OpConstant %5 7
%29 = OpTypeFunction %5 %5 %5
%35 = OpConstant %5 4294967295
%38 = OpConstant %5 4
%39 = OpTypeVector %5 4
%43 = OpConstant %5 1
%54 = OpConstant %5 8
%57 = OpConstant %5 2
%64 = OpConstant %5 12
%73 = OpConstant %5 16
%82 = OpConstant %5 20
%85 = OpConstant %5 5
%92 = OpConstant %5 24
%95 = OpConstant %5 6
%134 = OpConstant %5 2147483647
%142 = OpConstant %5 2147483648
%148 = OpTypeFloat 32
%152 = OpConstant %148 0
%160 = OpConstant %148 1
%169 = OpConstant %148 0x1p+128
%178 = OpConstant %148 -0x1p+128
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %185
%185 = OpLabel
%13 = OpLoad %6 %10
%14 = OpLoad %6 %9
%15 = OpLoad %6 %8
%16 = OpLoad %5 %12
%18 = OpIEqual %17 %16 %19
OpSelectionMerge %187 None
OpBranchConditional %18 %186 %187
%186 = OpLabel
OpDemoteToHelperInvocation
OpBranch %187
%187 = OpLabel
OpBranch %188
%188 = OpLabel
%22 = OpIsHelperInvocationEXT %17
%24 = OpSelect %5 %22 %23 %16
%20 = OpGroupNonUniformIAdd %5 %21 Reduce %24
%25 = OpIMul %5 %16 %26
%27 = OpIMul %5 %16 %28
%37 = OpFunctionCall %5 %32 %27 %38
%40 = OpCompositeConstruct %39 %20 %20 %20 %20
OpImageWrite %15 %37 %40
%42 = OpIsHelperInvocationEXT %17
%44 = OpSelect %5 %42 %43 %16
%41 = OpGroupNonUniformIMul %5 %21 Reduce %44
%45 = OpIAdd %5 %25 %38
%46 = OpIMul %5 %16 %28
%47 = OpIAdd %5 %46 %43
%48 = OpFunctionCall %5 %32 %47 %38
%49 = OpCompositeConstruct %39 %41 %41 %41 %41
OpImageWrite %15 %48 %49
%51 = OpIsHelperInvocationEXT %17
%52 = OpSelect %5 %51 %35 %16
%50 = OpGroupNonUniformBitwiseAnd %5 %21 Reduce %52
%53 = OpIAdd %5 %25 %54
%55 = OpIMul %5 %16 %28
%56 = OpIAdd %5 %55 %57
%58 = OpFunctionCall %5 %32 %56 %38
%59 = OpCompositeConstruct %39 %50 %50 %50 %50
OpImageWrite %15 %58 %59
%61 = OpIsHelperInvocationEXT %17
%62 = OpSelect %5 %61 %23 %16
%60 = OpGroupNonUniformBitwiseOr %5 %21 Reduce %62
%63 = OpIAdd %5 %25 %64
%65 = OpIMul %5 %16 %28
%66 = OpIAdd %5 %65 %21
%67 = OpFunctionCall %5 %32 %66 %38
%68 = OpCompositeConstruct %39 %60 %60 %60 %60
OpImageWrite %15 %67 %68
%70 = OpIsHelperInvocationEXT %17
%71 = OpSelect %5 %70 %23 %16
%69 = OpGroupNonUniformBitwiseXor %5 %21 Reduce %71
%72 = OpIAdd %5 %25 %73
%74 = OpIMul %5 %16 %28
%75 = OpIAdd %5 %74 %38
%76 = OpFunctionCall %5 %32 %75 %38
%77 = OpCompositeConstruct %39 %69 %69 %69 %69
OpImageWrite %15 %76 %77
%79 = OpIsHelperInvocationEXT %17
%80 = OpSelect %5 %79 %35 %16
%78 = OpGroupNonUniformUMin %5 %21 Reduce %80
%81 = OpIAdd %5 %25 %82
%83 = OpIMul %5 %16 %28
%84 = OpIAdd %5 %83 %85
%86 = OpFunctionCall %5 %32 %84 %38
%87 = OpCompositeConstruct %39 %78 %78 %78 %78
OpImageWrite %15 %86 %87
%89 = OpIsHelperInvocationEXT %17
%90 = OpSelect %5 %89 %23 %16
%88 = OpGroupNonUniformUMax %5 %21 Reduce %90
%91 = OpIAdd %5 %25 %92
%93 = OpIMul %5 %16 %28
%94 = OpIAdd %5 %93 %95
%96 = OpFunctionCall %5 %32 %94 %38
%97 = OpCompositeConstruct %39 %88 %88 %88 %88
OpImageWrite %15 %96 %97
%99 = OpIsHelperInvocationEXT %17
%100 = OpSelect %5 %99 %23 %16
%98 = OpGroupNonUniformIAdd %5 %21 Reduce %100
%101 = OpIMul %5 %16 %28
%102 = OpFunctionCall %5 %32 %101 %38
%103 = OpCompositeConstruct %39 %98 %98 %98 %98
OpImageWrite %14 %102 %103
%105 = OpIsHelperInvocationEXT %17
%106 = OpSelect %5 %105 %43 %16
%104 = OpGroupNonUniformIMul %5 %21 Reduce %106
%107 = OpIMul %5 %16 %28
%108 = OpIAdd %5 %107 %43
%109 = OpFunctionCall %5 %32 %108 %38
%110 = OpCompositeConstruct %39 %104 %104 %104 %104
OpImageWrite %14 %109 %110
%112 = OpIsHelperInvocationEXT %17
%113 = OpSelect %5 %112 %35 %16
%111 = OpGroupNonUniformBitwiseAnd %5 %21 Reduce %113
%114 = OpIMul %5 %16 %28
%115 = OpIAdd %5 %114 %57
%116 = OpFunctionCall %5 %32 %115 %38
%117 = OpCompositeConstruct %39 %111 %111 %111 %111
OpImageWrite %14 %116 %117
%119 = OpIsHelperInvocationEXT %17
%120 = OpSelect %5 %119 %23 %16
%118 = OpGroupNonUniformBitwiseOr %5 %21 Reduce %120
%121 = OpIMul %5 %16 %28
%122 = OpIAdd %5 %121 %21
%123 = OpFunctionCall %5 %32 %122 %38
%124 = OpCompositeConstruct %39 %118 %118 %118 %118
OpImageWrite %14 %123 %124
%126 = OpIsHelperInvocationEXT %17
%127 = OpSelect %5 %126 %23 %16
%125 = OpGroupNonUniformBitwiseXor %5 %21 Reduce %127
%128 = OpIMul %5 %16 %28
%129 = OpIAdd %5 %128 %38
%130 = OpFunctionCall %5 %32 %129 %38
%131 = OpCompositeConstruct %39 %125 %125 %125 %125
OpImageWrite %14 %130 %131
%133 = OpIsHelperInvocationEXT %17
%135 = OpSelect %5 %133 %134 %16
%132 = OpGroupNonUniformSMin %5 %21 Reduce %135
%136 = OpIMul %5 %16 %28
%137 = OpIAdd %5 %136 %85
%138 = OpFunctionCall %5 %32 %137 %38
%139 = OpCompositeConstruct %39 %132 %132 %132 %132
OpImageWrite %14 %138 %139
%141 = OpIsHelperInvocationEXT %17
%143 = OpSelect %5 %141 %142 %16
%140 = OpGroupNonUniformSMax %5 %21 Reduce %143
%144 = OpIMul %5 %16 %28
%145 = OpIAdd %5 %144 %95
%146 = OpFunctionCall %5 %32 %145 %38
%147 = OpCompositeConstruct %39 %140 %140 %140 %140
OpImageWrite %14 %146 %147
%149 = OpConvertUToF %148 %16
%151 = OpIsHelperInvocationEXT %17
%153 = OpSelect %148 %151 %152 %149
%150 = OpGroupNonUniformFAdd %148 %21 Reduce %153
%154 = OpConvertFToU %5 %150
%155 = OpIMul %5 %16 %28
%156 = OpFunctionCall %5 %32 %155 %38
%157 = OpCompositeConstruct %39 %154 %154 %154 %154
OpImageWrite %13 %156 %157
%159 = OpIsHelperInvocationEXT %17
%161 = OpSelect %148 %159 %160 %149
%158 = OpGroupNonUniformFMul %148 %21 Reduce %161
%162 = OpConvertFToU %5 %158
%163 = OpIMul %5 %16 %28
%164 = OpIAdd %5 %163 %43
%165 = OpFunctionCall %5 %32 %164 %38
%166 = OpCompositeConstruct %39 %162 %162 %162 %162
OpImageWrite %13 %165 %166
%168 = OpIsHelperInvocationEXT %17
%170 = OpSelect %148 %168 %169 %149
%167 = OpGroupNonUniformFMin %148 %21 Reduce %170
%171 = OpConvertFToU %5 %167
%172 = OpIMul %5 %16 %28
%173 = OpIAdd %5 %172 %85
%174 = OpFunctionCall %5 %32 %173 %38
%175 = OpCompositeConstruct %39 %171 %171 %171 %171
OpImageWrite %13 %174 %175
%177 = OpIsHelperInvocationEXT %17
%179 = OpSelect %148 %177 %178 %149
%176 = OpGroupNonUniformFMax %148 %21 Reduce %179
%180 = OpConvertFToU %5 %176
%181 = OpIMul %5 %16 %28
%182 = OpIAdd %5 %181 %95
%183 = OpFunctionCall %5 %32 %182 %38
%184 = OpCompositeConstruct %39 %180 %180 %180 %180
OpImageWrite %13 %183 %184
OpReturn
OpFunctionEnd
%32 = OpFunction %5 None %29
%30 = OpFunctionParameter %5
%31 = OpFunctionParameter %5
%33 = OpLabel
%34 = OpUDiv %5 %35 %31
%36 = OpBitwiseAnd %5 %30 %34
OpReturnValue %36
OpFunctionEnd
#endif
