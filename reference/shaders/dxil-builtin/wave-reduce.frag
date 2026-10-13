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
    uint _28 = INDEX * 28u;
    imageStore(_8, int(ByteAddressMask(INDEX * 7u, 4u)), uvec4(subgroupAdd((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 1u, 4u)), uvec4(subgroupMul((gl_HelperInvocation || discard_state) ? 1u : INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 2u, 4u)), uvec4(subgroupAnd((gl_HelperInvocation || discard_state) ? 4294967295u : INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 3u, 4u)), uvec4(subgroupOr((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 4u, 4u)), uvec4(subgroupXor((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 5u, 4u)), uvec4(subgroupMin((gl_HelperInvocation || discard_state) ? 4294967295u : INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 6u, 4u)), uvec4(subgroupMax((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_9, int(ByteAddressMask(INDEX * 7u, 4u)), uvec4(subgroupAdd((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 1u, 4u)), uvec4(subgroupMul((gl_HelperInvocation || discard_state) ? 1u : INDEX)));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 2u, 4u)), uvec4(subgroupAnd((gl_HelperInvocation || discard_state) ? 4294967295u : INDEX)));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 3u, 4u)), uvec4(subgroupOr((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 4u, 4u)), uvec4(subgroupXor((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 5u, 4u)), uvec4(uint(subgroupMin(int((gl_HelperInvocation || discard_state) ? 2147483647u : INDEX)))));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 6u, 4u)), uvec4(uint(subgroupMax(int((gl_HelperInvocation || discard_state) ? 2147483648u : INDEX)))));
    float _153 = float(INDEX);
    imageStore(_10, int(ByteAddressMask(INDEX * 7u, 4u)), uvec4(uint(subgroupAdd((gl_HelperInvocation || discard_state) ? 0.0 : _153))));
    imageStore(_10, int(ByteAddressMask((INDEX * 7u) + 1u, 4u)), uvec4(uint(subgroupMul((gl_HelperInvocation || discard_state) ? 1.0 : _153))));
    imageStore(_10, int(ByteAddressMask((INDEX * 7u) + 5u, 4u)), uvec4(uint(subgroupMin((gl_HelperInvocation || discard_state) ? uintBitsToFloat(0x7f800000u /* inf */) : _153))));
    imageStore(_10, int(ByteAddressMask((INDEX * 7u) + 6u, 4u)), uvec4(uint(subgroupMax((gl_HelperInvocation || discard_state) ? uintBitsToFloat(0xff800000u /* -inf */) : _153))));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 241
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformArithmetic
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %9 %10 %12 %21 %196
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "INDEX"
OpName %21 "discard_state"
OpName %35 "ByteAddressMask"
OpName %33 "index"
OpName %34 "stride"
OpName %233 "discard_exit"
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
OpDecorate %196 BuiltIn HelperInvocation
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
%32 = OpTypeFunction %5 %5 %5
%38 = OpConstant %5 4294967295
%42 = OpConstant %5 4
%43 = OpTypeVector %5 4
%47 = OpConstant %5 1
%58 = OpConstant %5 8
%61 = OpConstant %5 2
%68 = OpConstant %5 12
%77 = OpConstant %5 16
%86 = OpConstant %5 20
%89 = OpConstant %5 5
%96 = OpConstant %5 24
%99 = OpConstant %5 6
%138 = OpConstant %5 2147483647
%146 = OpConstant %5 2147483648
%152 = OpTypeFloat 32
%156 = OpConstant %152 0
%164 = OpConstant %152 1
%173 = OpConstant %152 0x1p+128
%182 = OpConstant %152 -0x1p+128
%194 = OpConstantTrue %17
%195 = OpTypePointer Input %17
%196 = OpVariable %195 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %21 %22
OpBranch %189
%189 = OpLabel
%13 = OpLoad %6 %10
%14 = OpLoad %6 %9
%15 = OpLoad %6 %8
%16 = OpLoad %5 %12
%18 = OpIEqual %17 %16 %19
OpSelectionMerge %191 None
OpBranchConditional %18 %190 %191
%190 = OpLabel
OpStore %21 %194
OpBranch %191
%191 = OpLabel
OpBranch %192
%192 = OpLabel
OpBranch %193
%193 = OpLabel
%197 = OpLoad %17 %196
%198 = OpLoad %17 %21
%25 = OpLogicalOr %17 %197 %198
%27 = OpSelect %5 %25 %26 %16
%23 = OpGroupNonUniformIAdd %5 %24 Reduce %27
%28 = OpIMul %5 %16 %29
%30 = OpIMul %5 %16 %31
%41 = OpFunctionCall %5 %35 %30 %42
%44 = OpCompositeConstruct %43 %23 %23 %23 %23
OpImageWrite %15 %41 %44
%199 = OpLoad %17 %196
%200 = OpLoad %17 %21
%46 = OpLogicalOr %17 %199 %200
%48 = OpSelect %5 %46 %47 %16
%45 = OpGroupNonUniformIMul %5 %24 Reduce %48
%49 = OpIAdd %5 %28 %42
%50 = OpIMul %5 %16 %31
%51 = OpIAdd %5 %50 %47
%52 = OpFunctionCall %5 %35 %51 %42
%53 = OpCompositeConstruct %43 %45 %45 %45 %45
OpImageWrite %15 %52 %53
%201 = OpLoad %17 %196
%202 = OpLoad %17 %21
%55 = OpLogicalOr %17 %201 %202
%56 = OpSelect %5 %55 %38 %16
%54 = OpGroupNonUniformBitwiseAnd %5 %24 Reduce %56
%57 = OpIAdd %5 %28 %58
%59 = OpIMul %5 %16 %31
%60 = OpIAdd %5 %59 %61
%62 = OpFunctionCall %5 %35 %60 %42
%63 = OpCompositeConstruct %43 %54 %54 %54 %54
OpImageWrite %15 %62 %63
%203 = OpLoad %17 %196
%204 = OpLoad %17 %21
%65 = OpLogicalOr %17 %203 %204
%66 = OpSelect %5 %65 %26 %16
%64 = OpGroupNonUniformBitwiseOr %5 %24 Reduce %66
%67 = OpIAdd %5 %28 %68
%69 = OpIMul %5 %16 %31
%70 = OpIAdd %5 %69 %24
%71 = OpFunctionCall %5 %35 %70 %42
%72 = OpCompositeConstruct %43 %64 %64 %64 %64
OpImageWrite %15 %71 %72
%205 = OpLoad %17 %196
%206 = OpLoad %17 %21
%74 = OpLogicalOr %17 %205 %206
%75 = OpSelect %5 %74 %26 %16
%73 = OpGroupNonUniformBitwiseXor %5 %24 Reduce %75
%76 = OpIAdd %5 %28 %77
%78 = OpIMul %5 %16 %31
%79 = OpIAdd %5 %78 %42
%80 = OpFunctionCall %5 %35 %79 %42
%81 = OpCompositeConstruct %43 %73 %73 %73 %73
OpImageWrite %15 %80 %81
%207 = OpLoad %17 %196
%208 = OpLoad %17 %21
%83 = OpLogicalOr %17 %207 %208
%84 = OpSelect %5 %83 %38 %16
%82 = OpGroupNonUniformUMin %5 %24 Reduce %84
%85 = OpIAdd %5 %28 %86
%87 = OpIMul %5 %16 %31
%88 = OpIAdd %5 %87 %89
%90 = OpFunctionCall %5 %35 %88 %42
%91 = OpCompositeConstruct %43 %82 %82 %82 %82
OpImageWrite %15 %90 %91
%209 = OpLoad %17 %196
%210 = OpLoad %17 %21
%93 = OpLogicalOr %17 %209 %210
%94 = OpSelect %5 %93 %26 %16
%92 = OpGroupNonUniformUMax %5 %24 Reduce %94
%95 = OpIAdd %5 %28 %96
%97 = OpIMul %5 %16 %31
%98 = OpIAdd %5 %97 %99
%100 = OpFunctionCall %5 %35 %98 %42
%101 = OpCompositeConstruct %43 %92 %92 %92 %92
OpImageWrite %15 %100 %101
%211 = OpLoad %17 %196
%212 = OpLoad %17 %21
%103 = OpLogicalOr %17 %211 %212
%104 = OpSelect %5 %103 %26 %16
%102 = OpGroupNonUniformIAdd %5 %24 Reduce %104
%105 = OpIMul %5 %16 %31
%106 = OpFunctionCall %5 %35 %105 %42
%107 = OpCompositeConstruct %43 %102 %102 %102 %102
OpImageWrite %14 %106 %107
%213 = OpLoad %17 %196
%214 = OpLoad %17 %21
%109 = OpLogicalOr %17 %213 %214
%110 = OpSelect %5 %109 %47 %16
%108 = OpGroupNonUniformIMul %5 %24 Reduce %110
%111 = OpIMul %5 %16 %31
%112 = OpIAdd %5 %111 %47
%113 = OpFunctionCall %5 %35 %112 %42
%114 = OpCompositeConstruct %43 %108 %108 %108 %108
OpImageWrite %14 %113 %114
%215 = OpLoad %17 %196
%216 = OpLoad %17 %21
%116 = OpLogicalOr %17 %215 %216
%117 = OpSelect %5 %116 %38 %16
%115 = OpGroupNonUniformBitwiseAnd %5 %24 Reduce %117
%118 = OpIMul %5 %16 %31
%119 = OpIAdd %5 %118 %61
%120 = OpFunctionCall %5 %35 %119 %42
%121 = OpCompositeConstruct %43 %115 %115 %115 %115
OpImageWrite %14 %120 %121
%217 = OpLoad %17 %196
%218 = OpLoad %17 %21
%123 = OpLogicalOr %17 %217 %218
%124 = OpSelect %5 %123 %26 %16
%122 = OpGroupNonUniformBitwiseOr %5 %24 Reduce %124
%125 = OpIMul %5 %16 %31
%126 = OpIAdd %5 %125 %24
%127 = OpFunctionCall %5 %35 %126 %42
%128 = OpCompositeConstruct %43 %122 %122 %122 %122
OpImageWrite %14 %127 %128
%219 = OpLoad %17 %196
%220 = OpLoad %17 %21
%130 = OpLogicalOr %17 %219 %220
%131 = OpSelect %5 %130 %26 %16
%129 = OpGroupNonUniformBitwiseXor %5 %24 Reduce %131
%132 = OpIMul %5 %16 %31
%133 = OpIAdd %5 %132 %42
%134 = OpFunctionCall %5 %35 %133 %42
%135 = OpCompositeConstruct %43 %129 %129 %129 %129
OpImageWrite %14 %134 %135
%221 = OpLoad %17 %196
%222 = OpLoad %17 %21
%137 = OpLogicalOr %17 %221 %222
%139 = OpSelect %5 %137 %138 %16
%136 = OpGroupNonUniformSMin %5 %24 Reduce %139
%140 = OpIMul %5 %16 %31
%141 = OpIAdd %5 %140 %89
%142 = OpFunctionCall %5 %35 %141 %42
%143 = OpCompositeConstruct %43 %136 %136 %136 %136
OpImageWrite %14 %142 %143
%223 = OpLoad %17 %196
%224 = OpLoad %17 %21
%145 = OpLogicalOr %17 %223 %224
%147 = OpSelect %5 %145 %146 %16
%144 = OpGroupNonUniformSMax %5 %24 Reduce %147
%148 = OpIMul %5 %16 %31
%149 = OpIAdd %5 %148 %99
%150 = OpFunctionCall %5 %35 %149 %42
%151 = OpCompositeConstruct %43 %144 %144 %144 %144
OpImageWrite %14 %150 %151
%153 = OpConvertUToF %152 %16
%225 = OpLoad %17 %196
%226 = OpLoad %17 %21
%155 = OpLogicalOr %17 %225 %226
%157 = OpSelect %152 %155 %156 %153
%154 = OpGroupNonUniformFAdd %152 %24 Reduce %157
%158 = OpConvertFToU %5 %154
%159 = OpIMul %5 %16 %31
%160 = OpFunctionCall %5 %35 %159 %42
%161 = OpCompositeConstruct %43 %158 %158 %158 %158
OpImageWrite %13 %160 %161
%227 = OpLoad %17 %196
%228 = OpLoad %17 %21
%163 = OpLogicalOr %17 %227 %228
%165 = OpSelect %152 %163 %164 %153
%162 = OpGroupNonUniformFMul %152 %24 Reduce %165
%166 = OpConvertFToU %5 %162
%167 = OpIMul %5 %16 %31
%168 = OpIAdd %5 %167 %47
%169 = OpFunctionCall %5 %35 %168 %42
%170 = OpCompositeConstruct %43 %166 %166 %166 %166
OpImageWrite %13 %169 %170
%229 = OpLoad %17 %196
%230 = OpLoad %17 %21
%172 = OpLogicalOr %17 %229 %230
%174 = OpSelect %152 %172 %173 %153
%171 = OpGroupNonUniformFMin %152 %24 Reduce %174
%175 = OpConvertFToU %5 %171
%176 = OpIMul %5 %16 %31
%177 = OpIAdd %5 %176 %89
%178 = OpFunctionCall %5 %35 %177 %42
%179 = OpCompositeConstruct %43 %175 %175 %175 %175
OpImageWrite %13 %178 %179
%231 = OpLoad %17 %196
%232 = OpLoad %17 %21
%181 = OpLogicalOr %17 %231 %232
%183 = OpSelect %152 %181 %182 %153
%180 = OpGroupNonUniformFMax %152 %24 Reduce %183
%184 = OpConvertFToU %5 %180
%185 = OpIMul %5 %16 %31
%186 = OpIAdd %5 %185 %99
%187 = OpFunctionCall %5 %35 %186 %42
%188 = OpCompositeConstruct %43 %184 %184 %184 %184
OpImageWrite %13 %187 %188
%239 = OpFunctionCall %1 %233
OpReturn
OpFunctionEnd
%35 = OpFunction %5 None %32
%33 = OpFunctionParameter %5
%34 = OpFunctionParameter %5
%36 = OpLabel
%37 = OpUDiv %5 %38 %34
%39 = OpBitwiseAnd %5 %33 %37
OpReturnValue %39
OpFunctionEnd
%233 = OpFunction %1 None %2
%234 = OpLabel
%237 = OpLoad %17 %21
OpSelectionMerge %236 None
OpBranchConditional %237 %235 %236
%235 = OpLabel
OpKill
%236 = OpLabel
OpReturn
OpFunctionEnd
#endif
