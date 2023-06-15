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
    uint _28 = INDEX * 28u;
    imageStore(_8, int(INDEX * 7u), uvec4(subgroupAdd((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_8, int((INDEX * 7u) + 1u), uvec4(subgroupMul((gl_HelperInvocation || discard_state) ? 1u : INDEX)));
    imageStore(_8, int((INDEX * 7u) + 2u), uvec4(subgroupAnd((gl_HelperInvocation || discard_state) ? 4294967295u : INDEX)));
    imageStore(_8, int((INDEX * 7u) + 3u), uvec4(subgroupOr((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_8, int((INDEX * 7u) + 4u), uvec4(subgroupXor((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_8, int((INDEX * 7u) + 5u), uvec4(subgroupMin((gl_HelperInvocation || discard_state) ? 4294967295u : INDEX)));
    imageStore(_8, int((INDEX * 7u) + 6u), uvec4(subgroupMax((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_9, int(INDEX * 7u), uvec4(subgroupAdd((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_9, int((INDEX * 7u) + 1u), uvec4(subgroupMul((gl_HelperInvocation || discard_state) ? 1u : INDEX)));
    imageStore(_9, int((INDEX * 7u) + 2u), uvec4(subgroupAnd((gl_HelperInvocation || discard_state) ? 4294967295u : INDEX)));
    imageStore(_9, int((INDEX * 7u) + 3u), uvec4(subgroupOr((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_9, int((INDEX * 7u) + 4u), uvec4(subgroupXor((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_9, int((INDEX * 7u) + 5u), uvec4(uint(subgroupMin(int((gl_HelperInvocation || discard_state) ? 2147483647u : INDEX)))));
    imageStore(_9, int((INDEX * 7u) + 6u), uvec4(uint(subgroupMax(int((gl_HelperInvocation || discard_state) ? 2147483648u : INDEX)))));
    float _131 = float(INDEX);
    imageStore(_10, int(INDEX * 7u), uvec4(uint(subgroupAdd((gl_HelperInvocation || discard_state) ? 0.0 : _131))));
    imageStore(_10, int((INDEX * 7u) + 1u), uvec4(uint(subgroupMul((gl_HelperInvocation || discard_state) ? 1.0 : _131))));
    imageStore(_10, int((INDEX * 7u) + 5u), uvec4(uint(subgroupMin((gl_HelperInvocation || discard_state) ? uintBitsToFloat(0x7f800000u /* inf */) : _131))));
    imageStore(_10, int((INDEX * 7u) + 6u), uvec4(uint(subgroupMax((gl_HelperInvocation || discard_state) ? uintBitsToFloat(0xff800000u /* -inf */) : _131))));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 213
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformArithmetic
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %12 %168
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "INDEX"
OpName %21 "discard_state"
OpName %205 "discard_exit"
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
OpDecorate %168 BuiltIn HelperInvocation
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
%20 = OpTypePointer Private %17
%21 = OpVariable %20 Private
%22 = OpConstantFalse %17
%24 = OpConstant %5 3
%26 = OpConstant %5 0
%29 = OpConstant %5 28
%31 = OpConstant %5 7
%32 = OpTypeVector %5 4
%36 = OpConstant %5 1
%39 = OpConstant %5 4
%45 = OpConstant %5 4294967295
%48 = OpConstant %5 8
%51 = OpConstant %5 2
%57 = OpConstant %5 12
%65 = OpConstant %5 16
%73 = OpConstant %5 20
%76 = OpConstant %5 5
%82 = OpConstant %5 24
%85 = OpConstant %5 6
%118 = OpConstant %5 2147483647
%125 = OpConstant %5 2147483648
%130 = OpTypeFloat 32
%134 = OpConstant %130 0
%141 = OpConstant %130 1
%149 = OpConstant %130 0x1p+128
%157 = OpConstant %130 -0x1p+128
%166 = OpConstantTrue %17
%167 = OpTypePointer Input %17
%168 = OpVariable %167 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %21 %22
OpBranch %163
%163 = OpLabel
%13 = OpLoad %6 %10
%14 = OpLoad %6 %9
%15 = OpLoad %6 %8
%16 = OpLoad %5 %12
%18 = OpIEqual %17 %16 %19
OpSelectionMerge %165 None
OpBranchConditional %18 %164 %165
%164 = OpLabel
OpStore %21 %166
OpBranch %165
%165 = OpLabel
%169 = OpLoad %17 %168
%170 = OpLoad %17 %21
%25 = OpLogicalOr %17 %169 %170
%27 = OpSelect %5 %25 %26 %16
%23 = OpGroupNonUniformIAdd %5 %24 Reduce %27
%28 = OpIMul %5 %16 %29
%30 = OpIMul %5 %16 %31
%33 = OpCompositeConstruct %32 %23 %23 %23 %23
OpImageWrite %15 %30 %33
%171 = OpLoad %17 %168
%172 = OpLoad %17 %21
%35 = OpLogicalOr %17 %171 %172
%37 = OpSelect %5 %35 %36 %16
%34 = OpGroupNonUniformIMul %5 %24 Reduce %37
%38 = OpIAdd %5 %28 %39
%40 = OpIMul %5 %16 %31
%41 = OpIAdd %5 %40 %36
%42 = OpCompositeConstruct %32 %34 %34 %34 %34
OpImageWrite %15 %41 %42
%173 = OpLoad %17 %168
%174 = OpLoad %17 %21
%44 = OpLogicalOr %17 %173 %174
%46 = OpSelect %5 %44 %45 %16
%43 = OpGroupNonUniformBitwiseAnd %5 %24 Reduce %46
%47 = OpIAdd %5 %28 %48
%49 = OpIMul %5 %16 %31
%50 = OpIAdd %5 %49 %51
%52 = OpCompositeConstruct %32 %43 %43 %43 %43
OpImageWrite %15 %50 %52
%175 = OpLoad %17 %168
%176 = OpLoad %17 %21
%54 = OpLogicalOr %17 %175 %176
%55 = OpSelect %5 %54 %26 %16
%53 = OpGroupNonUniformBitwiseOr %5 %24 Reduce %55
%56 = OpIAdd %5 %28 %57
%58 = OpIMul %5 %16 %31
%59 = OpIAdd %5 %58 %24
%60 = OpCompositeConstruct %32 %53 %53 %53 %53
OpImageWrite %15 %59 %60
%177 = OpLoad %17 %168
%178 = OpLoad %17 %21
%62 = OpLogicalOr %17 %177 %178
%63 = OpSelect %5 %62 %26 %16
%61 = OpGroupNonUniformBitwiseXor %5 %24 Reduce %63
%64 = OpIAdd %5 %28 %65
%66 = OpIMul %5 %16 %31
%67 = OpIAdd %5 %66 %39
%68 = OpCompositeConstruct %32 %61 %61 %61 %61
OpImageWrite %15 %67 %68
%179 = OpLoad %17 %168
%180 = OpLoad %17 %21
%70 = OpLogicalOr %17 %179 %180
%71 = OpSelect %5 %70 %45 %16
%69 = OpGroupNonUniformUMin %5 %24 Reduce %71
%72 = OpIAdd %5 %28 %73
%74 = OpIMul %5 %16 %31
%75 = OpIAdd %5 %74 %76
%77 = OpCompositeConstruct %32 %69 %69 %69 %69
OpImageWrite %15 %75 %77
%181 = OpLoad %17 %168
%182 = OpLoad %17 %21
%79 = OpLogicalOr %17 %181 %182
%80 = OpSelect %5 %79 %26 %16
%78 = OpGroupNonUniformUMax %5 %24 Reduce %80
%81 = OpIAdd %5 %28 %82
%83 = OpIMul %5 %16 %31
%84 = OpIAdd %5 %83 %85
%86 = OpCompositeConstruct %32 %78 %78 %78 %78
OpImageWrite %15 %84 %86
%183 = OpLoad %17 %168
%184 = OpLoad %17 %21
%88 = OpLogicalOr %17 %183 %184
%89 = OpSelect %5 %88 %26 %16
%87 = OpGroupNonUniformIAdd %5 %24 Reduce %89
%90 = OpIMul %5 %16 %31
%91 = OpCompositeConstruct %32 %87 %87 %87 %87
OpImageWrite %14 %90 %91
%185 = OpLoad %17 %168
%186 = OpLoad %17 %21
%93 = OpLogicalOr %17 %185 %186
%94 = OpSelect %5 %93 %36 %16
%92 = OpGroupNonUniformIMul %5 %24 Reduce %94
%95 = OpIMul %5 %16 %31
%96 = OpIAdd %5 %95 %36
%97 = OpCompositeConstruct %32 %92 %92 %92 %92
OpImageWrite %14 %96 %97
%187 = OpLoad %17 %168
%188 = OpLoad %17 %21
%99 = OpLogicalOr %17 %187 %188
%100 = OpSelect %5 %99 %45 %16
%98 = OpGroupNonUniformBitwiseAnd %5 %24 Reduce %100
%101 = OpIMul %5 %16 %31
%102 = OpIAdd %5 %101 %51
%103 = OpCompositeConstruct %32 %98 %98 %98 %98
OpImageWrite %14 %102 %103
%189 = OpLoad %17 %168
%190 = OpLoad %17 %21
%105 = OpLogicalOr %17 %189 %190
%106 = OpSelect %5 %105 %26 %16
%104 = OpGroupNonUniformBitwiseOr %5 %24 Reduce %106
%107 = OpIMul %5 %16 %31
%108 = OpIAdd %5 %107 %24
%109 = OpCompositeConstruct %32 %104 %104 %104 %104
OpImageWrite %14 %108 %109
%191 = OpLoad %17 %168
%192 = OpLoad %17 %21
%111 = OpLogicalOr %17 %191 %192
%112 = OpSelect %5 %111 %26 %16
%110 = OpGroupNonUniformBitwiseXor %5 %24 Reduce %112
%113 = OpIMul %5 %16 %31
%114 = OpIAdd %5 %113 %39
%115 = OpCompositeConstruct %32 %110 %110 %110 %110
OpImageWrite %14 %114 %115
%193 = OpLoad %17 %168
%194 = OpLoad %17 %21
%117 = OpLogicalOr %17 %193 %194
%119 = OpSelect %5 %117 %118 %16
%116 = OpGroupNonUniformSMin %5 %24 Reduce %119
%120 = OpIMul %5 %16 %31
%121 = OpIAdd %5 %120 %76
%122 = OpCompositeConstruct %32 %116 %116 %116 %116
OpImageWrite %14 %121 %122
%195 = OpLoad %17 %168
%196 = OpLoad %17 %21
%124 = OpLogicalOr %17 %195 %196
%126 = OpSelect %5 %124 %125 %16
%123 = OpGroupNonUniformSMax %5 %24 Reduce %126
%127 = OpIMul %5 %16 %31
%128 = OpIAdd %5 %127 %85
%129 = OpCompositeConstruct %32 %123 %123 %123 %123
OpImageWrite %14 %128 %129
%131 = OpConvertUToF %130 %16
%197 = OpLoad %17 %168
%198 = OpLoad %17 %21
%133 = OpLogicalOr %17 %197 %198
%135 = OpSelect %130 %133 %134 %131
%132 = OpGroupNonUniformFAdd %130 %24 Reduce %135
%136 = OpConvertFToU %5 %132
%137 = OpIMul %5 %16 %31
%138 = OpCompositeConstruct %32 %136 %136 %136 %136
OpImageWrite %13 %137 %138
%199 = OpLoad %17 %168
%200 = OpLoad %17 %21
%140 = OpLogicalOr %17 %199 %200
%142 = OpSelect %130 %140 %141 %131
%139 = OpGroupNonUniformFMul %130 %24 Reduce %142
%143 = OpConvertFToU %5 %139
%144 = OpIMul %5 %16 %31
%145 = OpIAdd %5 %144 %36
%146 = OpCompositeConstruct %32 %143 %143 %143 %143
OpImageWrite %13 %145 %146
%201 = OpLoad %17 %168
%202 = OpLoad %17 %21
%148 = OpLogicalOr %17 %201 %202
%150 = OpSelect %130 %148 %149 %131
%147 = OpGroupNonUniformFMin %130 %24 Reduce %150
%151 = OpConvertFToU %5 %147
%152 = OpIMul %5 %16 %31
%153 = OpIAdd %5 %152 %76
%154 = OpCompositeConstruct %32 %151 %151 %151 %151
OpImageWrite %13 %153 %154
%203 = OpLoad %17 %168
%204 = OpLoad %17 %21
%156 = OpLogicalOr %17 %203 %204
%158 = OpSelect %130 %156 %157 %131
%155 = OpGroupNonUniformFMax %130 %24 Reduce %158
%159 = OpConvertFToU %5 %155
%160 = OpIMul %5 %16 %31
%161 = OpIAdd %5 %160 %85
%162 = OpCompositeConstruct %32 %159 %159 %159 %159
OpImageWrite %13 %161 %162
%211 = OpFunctionCall %1 %205
OpReturn
OpFunctionEnd
%205 = OpFunction %1 None %2
%206 = OpLabel
%209 = OpLoad %17 %21
OpSelectionMerge %208 None
OpBranchConditional %209 %207 %208
%207 = OpLabel
OpKill
%208 = OpLabel
OpReturn
OpFunctionEnd
#endif
