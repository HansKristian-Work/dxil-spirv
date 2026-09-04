#version 460
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#extension GL_EXT_shader_16bit_storage : require
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_scalar_block_layout : require
#extension GL_KHR_shader_subgroup_arithmetic : require
#extension GL_EXT_shader_subgroup_extended_types_float16 : require

uvec2 _39;
uvec3 _103;
vec4 _163;
f16vec4 _210;

layout(set = 0, binding = 0, std430) writeonly buffer SSBO
{
    uvec2 _m0[];
} _10;

layout(set = 0, binding = 1, scalar) writeonly buffer _13_15
{
    uvec3 _m0[];
} _15;

layout(set = 0, binding = 2, std430) writeonly buffer _18_20
{
    uvec4 _m0[];
} _20;

layout(set = 0, binding = 3, std430) writeonly buffer _24_26
{
    u16vec4 _m0[];
} _26;

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
    uint _36 = INDEX + 1u;
    uvec2 _38;
    _38.x = INDEX;
    _38.y = _36;
    uint _47 = INDEX * 7u;
    _10._m0[INDEX * 7u] = subgroupAdd((gl_HelperInvocation || discard_state) ? uvec2(0u) : _38);
    _10._m0[(INDEX * 7u) + 1u] = subgroupMul((gl_HelperInvocation || discard_state) ? uvec2(1u) : _38);
    _10._m0[(INDEX * 7u) + 2u] = subgroupAnd((gl_HelperInvocation || discard_state) ? uvec2(4294967295u) : _38);
    _10._m0[(INDEX * 7u) + 3u] = subgroupOr((gl_HelperInvocation || discard_state) ? uvec2(0u) : _38);
    _10._m0[(INDEX * 7u) + 4u] = subgroupXor((gl_HelperInvocation || discard_state) ? uvec2(0u) : _38);
    _10._m0[(INDEX * 7u) + 5u] = subgroupMin((gl_HelperInvocation || discard_state) ? uvec2(4294967295u) : _38);
    _10._m0[(INDEX * 7u) + 6u] = subgroupMax((gl_HelperInvocation || discard_state) ? uvec2(0u) : _38);
    uint _101 = INDEX + 2u;
    uvec3 _102;
    _102.x = INDEX;
    _102.y = _36;
    _102.z = _101;
    _15._m0[INDEX * 7u] = subgroupAdd((gl_HelperInvocation || discard_state) ? uvec3(0u) : _102);
    _15._m0[(INDEX * 7u) + 1u] = subgroupMul((gl_HelperInvocation || discard_state) ? uvec3(1u) : _102);
    _15._m0[(INDEX * 7u) + 2u] = subgroupAnd((gl_HelperInvocation || discard_state) ? uvec3(4294967295u) : _102);
    _15._m0[(INDEX * 7u) + 3u] = subgroupOr((gl_HelperInvocation || discard_state) ? uvec3(0u) : _102);
    _15._m0[(INDEX * 7u) + 4u] = subgroupXor((gl_HelperInvocation || discard_state) ? uvec3(0u) : _102);
    _15._m0[(INDEX * 7u) + 5u] = uvec3(subgroupMin(ivec3((gl_HelperInvocation || discard_state) ? uvec3(2147483647u) : _102)));
    _15._m0[(INDEX * 7u) + 6u] = uvec3(subgroupMax(ivec3((gl_HelperInvocation || discard_state) ? uvec3(2147483648u) : _102)));
    uint _159 = INDEX + 3u;
    vec4 _162;
    _162.x = float(INDEX);
    _162.y = float(_36);
    _162.z = float(_101);
    _162.w = float(_159);
    _20._m0[INDEX * 7u] = floatBitsToUint(subgroupAdd((gl_HelperInvocation || discard_state) ? vec4(0.0) : _162));
    _20._m0[(INDEX * 7u) + 1u] = floatBitsToUint(subgroupMul((gl_HelperInvocation || discard_state) ? vec4(1.0) : _162));
    _20._m0[(INDEX * 7u) + 2u] = floatBitsToUint(subgroupMin((gl_HelperInvocation || discard_state) ? vec4(uintBitsToFloat(0x7f800000u /* inf */)) : _162));
    _20._m0[(INDEX * 7u) + 3u] = floatBitsToUint(subgroupMax((gl_HelperInvocation || discard_state) ? vec4(uintBitsToFloat(0xff800000u /* -inf */)) : _162));
    f16vec4 _209;
    _209.x = float16_t(INDEX);
    _209.y = float16_t(_36);
    _209.z = float16_t(_101);
    _209.w = float16_t(_159);
    _26._m0[INDEX * 7u] = float16BitsToUint16(subgroupAdd((gl_HelperInvocation || discard_state) ? f16vec4(float16_t(0.0)) : _209));
    _26._m0[(INDEX * 7u) + 1u] = float16BitsToUint16(subgroupMul((gl_HelperInvocation || discard_state) ? f16vec4(float16_t(1.0)) : _209));
    _26._m0[(INDEX * 7u) + 2u] = float16BitsToUint16(subgroupMin((gl_HelperInvocation || discard_state) ? f16vec4(float16_t(1.0 / 0.0)) : _209));
    _26._m0[(INDEX * 7u) + 3u] = float16BitsToUint16(subgroupMax((gl_HelperInvocation || discard_state) ? f16vec4(float16_t(-1.0 / 0.0)) : _209));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 308
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability GroupNonUniformArithmetic
OpCapability StorageBuffer16BitAccess
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %15 %20 %26 %28 %34 %255
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %8 "SSBO"
OpName %13 "SSBO"
OpName %18 "SSBO"
OpName %24 "SSBO"
OpName %28 "INDEX"
OpName %34 "discard_state"
OpName %300 "discard_exit"
OpDecorate %7 ArrayStride 8
OpMemberDecorate %8 0 Offset 0
OpDecorate %8 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonReadable
OpDecorate %12 ArrayStride 12
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 1
OpDecorate %15 NonReadable
OpDecorate %17 ArrayStride 16
OpMemberDecorate %18 0 Offset 0
OpDecorate %18 Block
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 2
OpDecorate %20 NonReadable
OpDecorate %23 ArrayStride 8
OpMemberDecorate %24 0 Offset 0
OpDecorate %24 Block
OpDecorate %26 DescriptorSet 0
OpDecorate %26 Binding 3
OpDecorate %26 NonReadable
OpDecorate %28 Flat
OpDecorate %28 Location 0
OpDecorate %255 BuiltIn HelperInvocation
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypeRuntimeArray %6
%8 = OpTypeStruct %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypeVector %5 3
%12 = OpTypeRuntimeArray %11
%13 = OpTypeStruct %12
%14 = OpTypePointer StorageBuffer %13
%15 = OpVariable %14 StorageBuffer
%16 = OpTypeVector %5 4
%17 = OpTypeRuntimeArray %16
%18 = OpTypeStruct %17
%19 = OpTypePointer StorageBuffer %18
%20 = OpVariable %19 StorageBuffer
%21 = OpTypeInt 16 0
%22 = OpTypeVector %21 4
%23 = OpTypeRuntimeArray %22
%24 = OpTypeStruct %23
%25 = OpTypePointer StorageBuffer %24
%26 = OpVariable %25 StorageBuffer
%27 = OpTypePointer Input %5
%28 = OpVariable %27 Input
%30 = OpTypeBool
%32 = OpConstant %5 40
%33 = OpTypePointer Private %30
%34 = OpVariable %33 Private
%35 = OpConstantFalse %30
%37 = OpConstant %5 1
%42 = OpConstant %5 3
%44 = OpConstant %5 0
%45 = OpConstantComposite %6 %44 %44
%48 = OpConstant %5 7
%50 = OpTypePointer StorageBuffer %6
%54 = OpConstantComposite %6 %37 %37
%62 = OpConstant %5 4294967295
%63 = OpConstantComposite %6 %62 %62
%66 = OpConstant %5 2
%81 = OpConstant %5 4
%89 = OpConstant %5 5
%97 = OpConstant %5 6
%108 = OpConstantComposite %11 %44 %44 %44
%111 = OpTypePointer StorageBuffer %11
%115 = OpConstantComposite %11 %37 %37 %37
%122 = OpConstantComposite %11 %62 %62 %62
%141 = OpConstant %5 2147483647
%142 = OpConstantComposite %11 %141 %141 %141
%149 = OpConstant %5 2147483648
%150 = OpConstantComposite %11 %149 %149 %149
%155 = OpTypeFloat 32
%161 = OpTypeVector %155 4
%169 = OpConstant %155 0
%170 = OpConstantComposite %161 %169 %169 %169 %169
%174 = OpTypePointer StorageBuffer %16
%178 = OpConstant %155 1
%179 = OpConstantComposite %161 %178 %178 %178 %178
%187 = OpConstant %155 0x1p+128
%188 = OpConstantComposite %161 %187 %187 %187 %187
%196 = OpConstant %155 -0x1p+128
%197 = OpConstantComposite %161 %196 %196 %196 %196
%203 = OpTypeFloat 16
%208 = OpTypeVector %203 4
%216 = OpConstant %203 0x0p+0
%217 = OpConstantComposite %208 %216 %216 %216 %216
%221 = OpTypePointer StorageBuffer %22
%225 = OpConstant %203 0x1p+0
%226 = OpConstantComposite %208 %225 %225 %225 %225
%234 = OpConstant %203 0x1p+16
%235 = OpConstantComposite %208 %234 %234 %234 %234
%243 = OpConstant %203 -0x1p+16
%244 = OpConstantComposite %208 %243 %243 %243 %243
%253 = OpConstantTrue %30
%254 = OpTypePointer Input %30
%255 = OpVariable %254 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %34 %35
%39 = OpUndef %6
%103 = OpUndef %11
%163 = OpUndef %161
%210 = OpUndef %208
OpBranch %250
%250 = OpLabel
%29 = OpLoad %5 %28
%31 = OpIEqual %30 %29 %32
OpSelectionMerge %252 None
OpBranchConditional %31 %251 %252
%251 = OpLabel
OpStore %34 %253
OpBranch %252
%252 = OpLabel
%36 = OpIAdd %5 %29 %37
%38 = OpCompositeInsert %6 %29 %39 0
%40 = OpCompositeInsert %6 %36 %38 1
%256 = OpLoad %30 %255
%257 = OpLoad %30 %34
%43 = OpLogicalOr %30 %256 %257
%46 = OpSelect %6 %43 %45 %40
%41 = OpGroupNonUniformIAdd %6 %42 Reduce %46
%47 = OpIMul %5 %29 %48
%49 = OpIMul %5 %29 %48
%51 = OpAccessChain %50 %10 %44 %49
OpStore %51 %41
%258 = OpLoad %30 %255
%259 = OpLoad %30 %34
%53 = OpLogicalOr %30 %258 %259
%55 = OpSelect %6 %53 %54 %40
%52 = OpGroupNonUniformIMul %6 %42 Reduce %55
%56 = OpIAdd %5 %47 %37
%57 = OpIMul %5 %29 %48
%58 = OpIAdd %5 %57 %37
%59 = OpAccessChain %50 %10 %44 %58
OpStore %59 %52
%260 = OpLoad %30 %255
%261 = OpLoad %30 %34
%61 = OpLogicalOr %30 %260 %261
%64 = OpSelect %6 %61 %63 %40
%60 = OpGroupNonUniformBitwiseAnd %6 %42 Reduce %64
%65 = OpIAdd %5 %47 %66
%67 = OpIMul %5 %29 %48
%68 = OpIAdd %5 %67 %66
%69 = OpAccessChain %50 %10 %44 %68
OpStore %69 %60
%262 = OpLoad %30 %255
%263 = OpLoad %30 %34
%71 = OpLogicalOr %30 %262 %263
%72 = OpSelect %6 %71 %45 %40
%70 = OpGroupNonUniformBitwiseOr %6 %42 Reduce %72
%73 = OpIAdd %5 %47 %42
%74 = OpIMul %5 %29 %48
%75 = OpIAdd %5 %74 %42
%76 = OpAccessChain %50 %10 %44 %75
OpStore %76 %70
%264 = OpLoad %30 %255
%265 = OpLoad %30 %34
%78 = OpLogicalOr %30 %264 %265
%79 = OpSelect %6 %78 %45 %40
%77 = OpGroupNonUniformBitwiseXor %6 %42 Reduce %79
%80 = OpIAdd %5 %47 %81
%82 = OpIMul %5 %29 %48
%83 = OpIAdd %5 %82 %81
%84 = OpAccessChain %50 %10 %44 %83
OpStore %84 %77
%266 = OpLoad %30 %255
%267 = OpLoad %30 %34
%86 = OpLogicalOr %30 %266 %267
%87 = OpSelect %6 %86 %63 %40
%85 = OpGroupNonUniformUMin %6 %42 Reduce %87
%88 = OpIAdd %5 %47 %89
%90 = OpIMul %5 %29 %48
%91 = OpIAdd %5 %90 %89
%92 = OpAccessChain %50 %10 %44 %91
OpStore %92 %85
%268 = OpLoad %30 %255
%269 = OpLoad %30 %34
%94 = OpLogicalOr %30 %268 %269
%95 = OpSelect %6 %94 %45 %40
%93 = OpGroupNonUniformUMax %6 %42 Reduce %95
%96 = OpIAdd %5 %47 %97
%98 = OpIMul %5 %29 %48
%99 = OpIAdd %5 %98 %97
%100 = OpAccessChain %50 %10 %44 %99
OpStore %100 %93
%101 = OpIAdd %5 %29 %66
%102 = OpCompositeInsert %11 %29 %103 0
%104 = OpCompositeInsert %11 %36 %102 1
%105 = OpCompositeInsert %11 %101 %104 2
%270 = OpLoad %30 %255
%271 = OpLoad %30 %34
%107 = OpLogicalOr %30 %270 %271
%109 = OpSelect %11 %107 %108 %105
%106 = OpGroupNonUniformIAdd %11 %42 Reduce %109
%110 = OpIMul %5 %29 %48
%112 = OpAccessChain %111 %15 %44 %110
OpStore %112 %106
%272 = OpLoad %30 %255
%273 = OpLoad %30 %34
%114 = OpLogicalOr %30 %272 %273
%116 = OpSelect %11 %114 %115 %105
%113 = OpGroupNonUniformIMul %11 %42 Reduce %116
%117 = OpIMul %5 %29 %48
%118 = OpIAdd %5 %117 %37
%119 = OpAccessChain %111 %15 %44 %118
OpStore %119 %113
%274 = OpLoad %30 %255
%275 = OpLoad %30 %34
%121 = OpLogicalOr %30 %274 %275
%123 = OpSelect %11 %121 %122 %105
%120 = OpGroupNonUniformBitwiseAnd %11 %42 Reduce %123
%124 = OpIMul %5 %29 %48
%125 = OpIAdd %5 %124 %66
%126 = OpAccessChain %111 %15 %44 %125
OpStore %126 %120
%276 = OpLoad %30 %255
%277 = OpLoad %30 %34
%128 = OpLogicalOr %30 %276 %277
%129 = OpSelect %11 %128 %108 %105
%127 = OpGroupNonUniformBitwiseOr %11 %42 Reduce %129
%130 = OpIMul %5 %29 %48
%131 = OpIAdd %5 %130 %42
%132 = OpAccessChain %111 %15 %44 %131
OpStore %132 %127
%278 = OpLoad %30 %255
%279 = OpLoad %30 %34
%134 = OpLogicalOr %30 %278 %279
%135 = OpSelect %11 %134 %108 %105
%133 = OpGroupNonUniformBitwiseXor %11 %42 Reduce %135
%136 = OpIMul %5 %29 %48
%137 = OpIAdd %5 %136 %81
%138 = OpAccessChain %111 %15 %44 %137
OpStore %138 %133
%280 = OpLoad %30 %255
%281 = OpLoad %30 %34
%140 = OpLogicalOr %30 %280 %281
%143 = OpSelect %11 %140 %142 %105
%139 = OpGroupNonUniformSMin %11 %42 Reduce %143
%144 = OpIMul %5 %29 %48
%145 = OpIAdd %5 %144 %89
%146 = OpAccessChain %111 %15 %44 %145
OpStore %146 %139
%282 = OpLoad %30 %255
%283 = OpLoad %30 %34
%148 = OpLogicalOr %30 %282 %283
%151 = OpSelect %11 %148 %150 %105
%147 = OpGroupNonUniformSMax %11 %42 Reduce %151
%152 = OpIMul %5 %29 %48
%153 = OpIAdd %5 %152 %97
%154 = OpAccessChain %111 %15 %44 %153
OpStore %154 %147
%156 = OpConvertUToF %155 %29
%157 = OpConvertUToF %155 %36
%158 = OpConvertUToF %155 %101
%159 = OpIAdd %5 %29 %42
%160 = OpConvertUToF %155 %159
%162 = OpCompositeInsert %161 %156 %163 0
%164 = OpCompositeInsert %161 %157 %162 1
%165 = OpCompositeInsert %161 %158 %164 2
%166 = OpCompositeInsert %161 %160 %165 3
%284 = OpLoad %30 %255
%285 = OpLoad %30 %34
%168 = OpLogicalOr %30 %284 %285
%171 = OpSelect %161 %168 %170 %166
%167 = OpGroupNonUniformFAdd %161 %42 Reduce %171
%172 = OpIMul %5 %29 %48
%173 = OpBitcast %16 %167
%175 = OpAccessChain %174 %20 %44 %172
OpStore %175 %173
%286 = OpLoad %30 %255
%287 = OpLoad %30 %34
%177 = OpLogicalOr %30 %286 %287
%180 = OpSelect %161 %177 %179 %166
%176 = OpGroupNonUniformFMul %161 %42 Reduce %180
%181 = OpIMul %5 %29 %48
%182 = OpIAdd %5 %181 %37
%183 = OpBitcast %16 %176
%184 = OpAccessChain %174 %20 %44 %182
OpStore %184 %183
%288 = OpLoad %30 %255
%289 = OpLoad %30 %34
%186 = OpLogicalOr %30 %288 %289
%189 = OpSelect %161 %186 %188 %166
%185 = OpGroupNonUniformFMin %161 %42 Reduce %189
%190 = OpIMul %5 %29 %48
%191 = OpIAdd %5 %190 %66
%192 = OpBitcast %16 %185
%193 = OpAccessChain %174 %20 %44 %191
OpStore %193 %192
%290 = OpLoad %30 %255
%291 = OpLoad %30 %34
%195 = OpLogicalOr %30 %290 %291
%198 = OpSelect %161 %195 %197 %166
%194 = OpGroupNonUniformFMax %161 %42 Reduce %198
%199 = OpIMul %5 %29 %48
%200 = OpIAdd %5 %199 %42
%201 = OpBitcast %16 %194
%202 = OpAccessChain %174 %20 %44 %200
OpStore %202 %201
%204 = OpConvertUToF %203 %29
%205 = OpConvertUToF %203 %36
%206 = OpConvertUToF %203 %101
%207 = OpConvertUToF %203 %159
%209 = OpCompositeInsert %208 %204 %210 0
%211 = OpCompositeInsert %208 %205 %209 1
%212 = OpCompositeInsert %208 %206 %211 2
%213 = OpCompositeInsert %208 %207 %212 3
%292 = OpLoad %30 %255
%293 = OpLoad %30 %34
%215 = OpLogicalOr %30 %292 %293
%218 = OpSelect %208 %215 %217 %213
%214 = OpGroupNonUniformFAdd %208 %42 Reduce %218
%219 = OpIMul %5 %29 %48
%220 = OpBitcast %22 %214
%222 = OpAccessChain %221 %26 %44 %219
OpStore %222 %220
%294 = OpLoad %30 %255
%295 = OpLoad %30 %34
%224 = OpLogicalOr %30 %294 %295
%227 = OpSelect %208 %224 %226 %213
%223 = OpGroupNonUniformFMul %208 %42 Reduce %227
%228 = OpIMul %5 %29 %48
%229 = OpIAdd %5 %228 %37
%230 = OpBitcast %22 %223
%231 = OpAccessChain %221 %26 %44 %229
OpStore %231 %230
%296 = OpLoad %30 %255
%297 = OpLoad %30 %34
%233 = OpLogicalOr %30 %296 %297
%236 = OpSelect %208 %233 %235 %213
%232 = OpGroupNonUniformFMin %208 %42 Reduce %236
%237 = OpIMul %5 %29 %48
%238 = OpIAdd %5 %237 %66
%239 = OpBitcast %22 %232
%240 = OpAccessChain %221 %26 %44 %238
OpStore %240 %239
%298 = OpLoad %30 %255
%299 = OpLoad %30 %34
%242 = OpLogicalOr %30 %298 %299
%245 = OpSelect %208 %242 %244 %213
%241 = OpGroupNonUniformFMax %208 %42 Reduce %245
%246 = OpIMul %5 %29 %48
%247 = OpIAdd %5 %246 %42
%248 = OpBitcast %22 %241
%249 = OpAccessChain %221 %26 %44 %247
OpStore %249 %248
%306 = OpFunctionCall %1 %300
OpReturn
OpFunctionEnd
%300 = OpFunction %1 None %2
%301 = OpLabel
%304 = OpLoad %30 %34
OpSelectionMerge %303 None
OpBranchConditional %304 %302 %303
%302 = OpLabel
OpKill
%303 = OpLabel
OpReturn
OpFunctionEnd
#endif
