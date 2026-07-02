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

uvec2 _39;
uvec3 _124;
vec4 _212;
f16vec4 _279;

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
    _10._m0[INDEX * 7u] = uvec2(subgroupAdd((gl_HelperInvocation || discard_state) ? uvec2(0u) : _38));
    _10._m0[(INDEX * 7u) + 1u] = uvec2(subgroupMul((gl_HelperInvocation || discard_state) ? uvec2(1u) : _38));
    _10._m0[(INDEX * 7u) + 2u] = uvec2(subgroupAnd((gl_HelperInvocation || discard_state) ? uvec2(4294967295u) : _38));
    _10._m0[(INDEX * 7u) + 3u] = uvec2(subgroupOr((gl_HelperInvocation || discard_state) ? uvec2(0u) : _38));
    _10._m0[(INDEX * 7u) + 4u] = uvec2(subgroupXor((gl_HelperInvocation || discard_state) ? uvec2(0u) : _38));
    _10._m0[(INDEX * 7u) + 5u] = uvec2(subgroupMin((gl_HelperInvocation || discard_state) ? uvec2(4294967295u) : _38));
    _10._m0[(INDEX * 7u) + 6u] = uvec2(subgroupMax((gl_HelperInvocation || discard_state) ? uvec2(0u) : _38));
    uint _122 = INDEX + 2u;
    uvec3 _123;
    _123.x = INDEX;
    _123.y = _36;
    _123.z = _122;
    _15._m0[INDEX * 7u] = uvec3(subgroupAdd((gl_HelperInvocation || discard_state) ? uvec3(0u) : _123));
    _15._m0[(INDEX * 7u) + 1u] = uvec3(subgroupMul((gl_HelperInvocation || discard_state) ? uvec3(1u) : _123));
    _15._m0[(INDEX * 7u) + 2u] = uvec3(subgroupAnd((gl_HelperInvocation || discard_state) ? uvec3(4294967295u) : _123));
    _15._m0[(INDEX * 7u) + 3u] = uvec3(subgroupOr((gl_HelperInvocation || discard_state) ? uvec3(0u) : _123));
    _15._m0[(INDEX * 7u) + 4u] = uvec3(subgroupXor((gl_HelperInvocation || discard_state) ? uvec3(0u) : _123));
    _15._m0[(INDEX * 7u) + 5u] = uvec3(uvec3(subgroupMin(ivec3((gl_HelperInvocation || discard_state) ? uvec3(2147483647u) : _123))));
    _15._m0[(INDEX * 7u) + 6u] = uvec3(uvec3(subgroupMax(ivec3((gl_HelperInvocation || discard_state) ? uvec3(2147483648u) : _123))));
    uint _208 = INDEX + 3u;
    vec4 _211;
    _211.x = float(INDEX);
    _211.y = float(_36);
    _211.z = float(_122);
    _211.w = float(_208);
    _20._m0[INDEX * 7u] = uvec4(floatBitsToUint(subgroupAdd((gl_HelperInvocation || discard_state) ? vec4(0.0) : _211)));
    _20._m0[(INDEX * 7u) + 1u] = uvec4(floatBitsToUint(subgroupMul((gl_HelperInvocation || discard_state) ? vec4(1.0) : _211)));
    _20._m0[(INDEX * 7u) + 2u] = uvec4(floatBitsToUint(subgroupMin((gl_HelperInvocation || discard_state) ? vec4(uintBitsToFloat(0x7f800000u /* inf */)) : _211)));
    _20._m0[(INDEX * 7u) + 3u] = uvec4(floatBitsToUint(subgroupMax((gl_HelperInvocation || discard_state) ? vec4(uintBitsToFloat(0xff800000u /* -inf */)) : _211)));
    f16vec4 _278;
    _278.x = float16_t(INDEX);
    _278.y = float16_t(_36);
    _278.z = float16_t(_122);
    _278.w = float16_t(_208);
    _26._m0[INDEX * 7u] = u16vec4(float16BitsToUint16(subgroupAdd((gl_HelperInvocation || discard_state) ? f16vec4(float16_t(0.0)) : _278)));
    _26._m0[(INDEX * 7u) + 1u] = u16vec4(float16BitsToUint16(subgroupMul((gl_HelperInvocation || discard_state) ? f16vec4(float16_t(1.0)) : _278)));
    _26._m0[(INDEX * 7u) + 2u] = u16vec4(float16BitsToUint16(subgroupMin((gl_HelperInvocation || discard_state) ? f16vec4(float16_t(1.0 / 0.0)) : _278)));
    _26._m0[(INDEX * 7u) + 3u] = u16vec4(float16BitsToUint16(subgroupMax((gl_HelperInvocation || discard_state) ? f16vec4(float16_t(-1.0 / 0.0)) : _278)));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 397
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability GroupNonUniformArithmetic
OpCapability StorageBuffer16BitAccess
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %15 %20 %26 %28 %34 %344
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %8 "SSBO"
OpName %13 "SSBO"
OpName %18 "SSBO"
OpName %24 "SSBO"
OpName %28 "INDEX"
OpName %34 "discard_state"
OpName %389 "discard_exit"
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
OpDecorate %344 BuiltIn HelperInvocation
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
%53 = OpTypePointer StorageBuffer %6
%57 = OpConstantComposite %6 %37 %37
%68 = OpConstant %5 4294967295
%69 = OpConstantComposite %6 %68 %68
%72 = OpConstant %5 2
%93 = OpConstant %5 4
%104 = OpConstant %5 5
%115 = OpConstant %5 6
%129 = OpConstantComposite %11 %44 %44 %44
%136 = OpTypePointer StorageBuffer %11
%140 = OpConstantComposite %11 %37 %37 %37
%151 = OpConstantComposite %11 %68 %68 %68
%182 = OpConstant %5 2147483647
%183 = OpConstantComposite %11 %182 %182 %182
%194 = OpConstant %5 2147483648
%195 = OpConstantComposite %11 %194 %194 %194
%204 = OpTypeFloat 32
%210 = OpTypeVector %204 4
%218 = OpConstant %204 0
%219 = OpConstantComposite %210 %218 %218 %218 %218
%228 = OpTypePointer StorageBuffer %16
%232 = OpConstant %204 1
%233 = OpConstantComposite %210 %232 %232 %232 %232
%246 = OpConstant %204 0x1p+128
%247 = OpConstantComposite %210 %246 %246 %246 %246
%260 = OpConstant %204 -0x1p+128
%261 = OpConstantComposite %210 %260 %260 %260 %260
%272 = OpTypeFloat 16
%277 = OpTypeVector %272 4
%285 = OpConstant %272 0x0p+0
%286 = OpConstantComposite %277 %285 %285 %285 %285
%295 = OpTypePointer StorageBuffer %22
%299 = OpConstant %272 0x1p+0
%300 = OpConstantComposite %277 %299 %299 %299 %299
%313 = OpConstant %272 0x1p+16
%314 = OpConstantComposite %277 %313 %313 %313 %313
%327 = OpConstant %272 -0x1p+16
%328 = OpConstantComposite %277 %327 %327 %327 %327
%342 = OpConstantTrue %30
%343 = OpTypePointer Input %30
%344 = OpVariable %343 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %34 %35
%39 = OpUndef %6
%124 = OpUndef %11
%212 = OpUndef %210
%279 = OpUndef %277
OpBranch %339
%339 = OpLabel
%29 = OpLoad %5 %28
%31 = OpIEqual %30 %29 %32
OpSelectionMerge %341 None
OpBranchConditional %31 %340 %341
%340 = OpLabel
OpStore %34 %342
OpBranch %341
%341 = OpLabel
%36 = OpIAdd %5 %29 %37
%38 = OpCompositeInsert %6 %29 %39 0
%40 = OpCompositeInsert %6 %36 %38 1
%345 = OpLoad %30 %344
%346 = OpLoad %30 %34
%43 = OpLogicalOr %30 %345 %346
%46 = OpSelect %6 %43 %45 %40
%41 = OpGroupNonUniformIAdd %6 %42 Reduce %46
%47 = OpIMul %5 %29 %48
%49 = OpIMul %5 %29 %48
%50 = OpCompositeExtract %5 %41 0
%51 = OpCompositeExtract %5 %41 1
%52 = OpCompositeConstruct %6 %50 %51
%54 = OpAccessChain %53 %10 %44 %49
OpStore %54 %52
%347 = OpLoad %30 %344
%348 = OpLoad %30 %34
%56 = OpLogicalOr %30 %347 %348
%58 = OpSelect %6 %56 %57 %40
%55 = OpGroupNonUniformIMul %6 %42 Reduce %58
%59 = OpIAdd %5 %47 %37
%60 = OpIMul %5 %29 %48
%61 = OpIAdd %5 %60 %37
%62 = OpCompositeExtract %5 %55 0
%63 = OpCompositeExtract %5 %55 1
%64 = OpCompositeConstruct %6 %62 %63
%65 = OpAccessChain %53 %10 %44 %61
OpStore %65 %64
%349 = OpLoad %30 %344
%350 = OpLoad %30 %34
%67 = OpLogicalOr %30 %349 %350
%70 = OpSelect %6 %67 %69 %40
%66 = OpGroupNonUniformBitwiseAnd %6 %42 Reduce %70
%71 = OpIAdd %5 %47 %72
%73 = OpIMul %5 %29 %48
%74 = OpIAdd %5 %73 %72
%75 = OpCompositeExtract %5 %66 0
%76 = OpCompositeExtract %5 %66 1
%77 = OpCompositeConstruct %6 %75 %76
%78 = OpAccessChain %53 %10 %44 %74
OpStore %78 %77
%351 = OpLoad %30 %344
%352 = OpLoad %30 %34
%80 = OpLogicalOr %30 %351 %352
%81 = OpSelect %6 %80 %45 %40
%79 = OpGroupNonUniformBitwiseOr %6 %42 Reduce %81
%82 = OpIAdd %5 %47 %42
%83 = OpIMul %5 %29 %48
%84 = OpIAdd %5 %83 %42
%85 = OpCompositeExtract %5 %79 0
%86 = OpCompositeExtract %5 %79 1
%87 = OpCompositeConstruct %6 %85 %86
%88 = OpAccessChain %53 %10 %44 %84
OpStore %88 %87
%353 = OpLoad %30 %344
%354 = OpLoad %30 %34
%90 = OpLogicalOr %30 %353 %354
%91 = OpSelect %6 %90 %45 %40
%89 = OpGroupNonUniformBitwiseXor %6 %42 Reduce %91
%92 = OpIAdd %5 %47 %93
%94 = OpIMul %5 %29 %48
%95 = OpIAdd %5 %94 %93
%96 = OpCompositeExtract %5 %89 0
%97 = OpCompositeExtract %5 %89 1
%98 = OpCompositeConstruct %6 %96 %97
%99 = OpAccessChain %53 %10 %44 %95
OpStore %99 %98
%355 = OpLoad %30 %344
%356 = OpLoad %30 %34
%101 = OpLogicalOr %30 %355 %356
%102 = OpSelect %6 %101 %69 %40
%100 = OpGroupNonUniformUMin %6 %42 Reduce %102
%103 = OpIAdd %5 %47 %104
%105 = OpIMul %5 %29 %48
%106 = OpIAdd %5 %105 %104
%107 = OpCompositeExtract %5 %100 0
%108 = OpCompositeExtract %5 %100 1
%109 = OpCompositeConstruct %6 %107 %108
%110 = OpAccessChain %53 %10 %44 %106
OpStore %110 %109
%357 = OpLoad %30 %344
%358 = OpLoad %30 %34
%112 = OpLogicalOr %30 %357 %358
%113 = OpSelect %6 %112 %45 %40
%111 = OpGroupNonUniformUMax %6 %42 Reduce %113
%114 = OpIAdd %5 %47 %115
%116 = OpIMul %5 %29 %48
%117 = OpIAdd %5 %116 %115
%118 = OpCompositeExtract %5 %111 0
%119 = OpCompositeExtract %5 %111 1
%120 = OpCompositeConstruct %6 %118 %119
%121 = OpAccessChain %53 %10 %44 %117
OpStore %121 %120
%122 = OpIAdd %5 %29 %72
%123 = OpCompositeInsert %11 %29 %124 0
%125 = OpCompositeInsert %11 %36 %123 1
%126 = OpCompositeInsert %11 %122 %125 2
%359 = OpLoad %30 %344
%360 = OpLoad %30 %34
%128 = OpLogicalOr %30 %359 %360
%130 = OpSelect %11 %128 %129 %126
%127 = OpGroupNonUniformIAdd %11 %42 Reduce %130
%131 = OpIMul %5 %29 %48
%132 = OpCompositeExtract %5 %127 0
%133 = OpCompositeExtract %5 %127 1
%134 = OpCompositeExtract %5 %127 2
%135 = OpCompositeConstruct %11 %132 %133 %134
%137 = OpAccessChain %136 %15 %44 %131
OpStore %137 %135
%361 = OpLoad %30 %344
%362 = OpLoad %30 %34
%139 = OpLogicalOr %30 %361 %362
%141 = OpSelect %11 %139 %140 %126
%138 = OpGroupNonUniformIMul %11 %42 Reduce %141
%142 = OpIMul %5 %29 %48
%143 = OpIAdd %5 %142 %37
%144 = OpCompositeExtract %5 %138 0
%145 = OpCompositeExtract %5 %138 1
%146 = OpCompositeExtract %5 %138 2
%147 = OpCompositeConstruct %11 %144 %145 %146
%148 = OpAccessChain %136 %15 %44 %143
OpStore %148 %147
%363 = OpLoad %30 %344
%364 = OpLoad %30 %34
%150 = OpLogicalOr %30 %363 %364
%152 = OpSelect %11 %150 %151 %126
%149 = OpGroupNonUniformBitwiseAnd %11 %42 Reduce %152
%153 = OpIMul %5 %29 %48
%154 = OpIAdd %5 %153 %72
%155 = OpCompositeExtract %5 %149 0
%156 = OpCompositeExtract %5 %149 1
%157 = OpCompositeExtract %5 %149 2
%158 = OpCompositeConstruct %11 %155 %156 %157
%159 = OpAccessChain %136 %15 %44 %154
OpStore %159 %158
%365 = OpLoad %30 %344
%366 = OpLoad %30 %34
%161 = OpLogicalOr %30 %365 %366
%162 = OpSelect %11 %161 %129 %126
%160 = OpGroupNonUniformBitwiseOr %11 %42 Reduce %162
%163 = OpIMul %5 %29 %48
%164 = OpIAdd %5 %163 %42
%165 = OpCompositeExtract %5 %160 0
%166 = OpCompositeExtract %5 %160 1
%167 = OpCompositeExtract %5 %160 2
%168 = OpCompositeConstruct %11 %165 %166 %167
%169 = OpAccessChain %136 %15 %44 %164
OpStore %169 %168
%367 = OpLoad %30 %344
%368 = OpLoad %30 %34
%171 = OpLogicalOr %30 %367 %368
%172 = OpSelect %11 %171 %129 %126
%170 = OpGroupNonUniformBitwiseXor %11 %42 Reduce %172
%173 = OpIMul %5 %29 %48
%174 = OpIAdd %5 %173 %93
%175 = OpCompositeExtract %5 %170 0
%176 = OpCompositeExtract %5 %170 1
%177 = OpCompositeExtract %5 %170 2
%178 = OpCompositeConstruct %11 %175 %176 %177
%179 = OpAccessChain %136 %15 %44 %174
OpStore %179 %178
%369 = OpLoad %30 %344
%370 = OpLoad %30 %34
%181 = OpLogicalOr %30 %369 %370
%184 = OpSelect %11 %181 %183 %126
%180 = OpGroupNonUniformSMin %11 %42 Reduce %184
%185 = OpIMul %5 %29 %48
%186 = OpIAdd %5 %185 %104
%187 = OpCompositeExtract %5 %180 0
%188 = OpCompositeExtract %5 %180 1
%189 = OpCompositeExtract %5 %180 2
%190 = OpCompositeConstruct %11 %187 %188 %189
%191 = OpAccessChain %136 %15 %44 %186
OpStore %191 %190
%371 = OpLoad %30 %344
%372 = OpLoad %30 %34
%193 = OpLogicalOr %30 %371 %372
%196 = OpSelect %11 %193 %195 %126
%192 = OpGroupNonUniformSMax %11 %42 Reduce %196
%197 = OpIMul %5 %29 %48
%198 = OpIAdd %5 %197 %115
%199 = OpCompositeExtract %5 %192 0
%200 = OpCompositeExtract %5 %192 1
%201 = OpCompositeExtract %5 %192 2
%202 = OpCompositeConstruct %11 %199 %200 %201
%203 = OpAccessChain %136 %15 %44 %198
OpStore %203 %202
%205 = OpConvertUToF %204 %29
%206 = OpConvertUToF %204 %36
%207 = OpConvertUToF %204 %122
%208 = OpIAdd %5 %29 %42
%209 = OpConvertUToF %204 %208
%211 = OpCompositeInsert %210 %205 %212 0
%213 = OpCompositeInsert %210 %206 %211 1
%214 = OpCompositeInsert %210 %207 %213 2
%215 = OpCompositeInsert %210 %209 %214 3
%373 = OpLoad %30 %344
%374 = OpLoad %30 %34
%217 = OpLogicalOr %30 %373 %374
%220 = OpSelect %210 %217 %219 %215
%216 = OpGroupNonUniformFAdd %210 %42 Reduce %220
%221 = OpIMul %5 %29 %48
%222 = OpBitcast %16 %216
%223 = OpCompositeExtract %5 %222 0
%224 = OpCompositeExtract %5 %222 1
%225 = OpCompositeExtract %5 %222 2
%226 = OpCompositeExtract %5 %222 3
%227 = OpCompositeConstruct %16 %223 %224 %225 %226
%229 = OpAccessChain %228 %20 %44 %221
OpStore %229 %227
%375 = OpLoad %30 %344
%376 = OpLoad %30 %34
%231 = OpLogicalOr %30 %375 %376
%234 = OpSelect %210 %231 %233 %215
%230 = OpGroupNonUniformFMul %210 %42 Reduce %234
%235 = OpIMul %5 %29 %48
%236 = OpIAdd %5 %235 %37
%237 = OpBitcast %16 %230
%238 = OpCompositeExtract %5 %237 0
%239 = OpCompositeExtract %5 %237 1
%240 = OpCompositeExtract %5 %237 2
%241 = OpCompositeExtract %5 %237 3
%242 = OpCompositeConstruct %16 %238 %239 %240 %241
%243 = OpAccessChain %228 %20 %44 %236
OpStore %243 %242
%377 = OpLoad %30 %344
%378 = OpLoad %30 %34
%245 = OpLogicalOr %30 %377 %378
%248 = OpSelect %210 %245 %247 %215
%244 = OpGroupNonUniformFMin %210 %42 Reduce %248
%249 = OpIMul %5 %29 %48
%250 = OpIAdd %5 %249 %72
%251 = OpBitcast %16 %244
%252 = OpCompositeExtract %5 %251 0
%253 = OpCompositeExtract %5 %251 1
%254 = OpCompositeExtract %5 %251 2
%255 = OpCompositeExtract %5 %251 3
%256 = OpCompositeConstruct %16 %252 %253 %254 %255
%257 = OpAccessChain %228 %20 %44 %250
OpStore %257 %256
%379 = OpLoad %30 %344
%380 = OpLoad %30 %34
%259 = OpLogicalOr %30 %379 %380
%262 = OpSelect %210 %259 %261 %215
%258 = OpGroupNonUniformFMax %210 %42 Reduce %262
%263 = OpIMul %5 %29 %48
%264 = OpIAdd %5 %263 %42
%265 = OpBitcast %16 %258
%266 = OpCompositeExtract %5 %265 0
%267 = OpCompositeExtract %5 %265 1
%268 = OpCompositeExtract %5 %265 2
%269 = OpCompositeExtract %5 %265 3
%270 = OpCompositeConstruct %16 %266 %267 %268 %269
%271 = OpAccessChain %228 %20 %44 %264
OpStore %271 %270
%273 = OpConvertUToF %272 %29
%274 = OpConvertUToF %272 %36
%275 = OpConvertUToF %272 %122
%276 = OpConvertUToF %272 %208
%278 = OpCompositeInsert %277 %273 %279 0
%280 = OpCompositeInsert %277 %274 %278 1
%281 = OpCompositeInsert %277 %275 %280 2
%282 = OpCompositeInsert %277 %276 %281 3
%381 = OpLoad %30 %344
%382 = OpLoad %30 %34
%284 = OpLogicalOr %30 %381 %382
%287 = OpSelect %277 %284 %286 %282
%283 = OpGroupNonUniformFAdd %277 %42 Reduce %287
%288 = OpIMul %5 %29 %48
%289 = OpBitcast %22 %283
%290 = OpCompositeExtract %21 %289 0
%291 = OpCompositeExtract %21 %289 1
%292 = OpCompositeExtract %21 %289 2
%293 = OpCompositeExtract %21 %289 3
%294 = OpCompositeConstruct %22 %290 %291 %292 %293
%296 = OpAccessChain %295 %26 %44 %288
OpStore %296 %294
%383 = OpLoad %30 %344
%384 = OpLoad %30 %34
%298 = OpLogicalOr %30 %383 %384
%301 = OpSelect %277 %298 %300 %282
%297 = OpGroupNonUniformFMul %277 %42 Reduce %301
%302 = OpIMul %5 %29 %48
%303 = OpIAdd %5 %302 %37
%304 = OpBitcast %22 %297
%305 = OpCompositeExtract %21 %304 0
%306 = OpCompositeExtract %21 %304 1
%307 = OpCompositeExtract %21 %304 2
%308 = OpCompositeExtract %21 %304 3
%309 = OpCompositeConstruct %22 %305 %306 %307 %308
%310 = OpAccessChain %295 %26 %44 %303
OpStore %310 %309
%385 = OpLoad %30 %344
%386 = OpLoad %30 %34
%312 = OpLogicalOr %30 %385 %386
%315 = OpSelect %277 %312 %314 %282
%311 = OpGroupNonUniformFMin %277 %42 Reduce %315
%316 = OpIMul %5 %29 %48
%317 = OpIAdd %5 %316 %72
%318 = OpBitcast %22 %311
%319 = OpCompositeExtract %21 %318 0
%320 = OpCompositeExtract %21 %318 1
%321 = OpCompositeExtract %21 %318 2
%322 = OpCompositeExtract %21 %318 3
%323 = OpCompositeConstruct %22 %319 %320 %321 %322
%324 = OpAccessChain %295 %26 %44 %317
OpStore %324 %323
%387 = OpLoad %30 %344
%388 = OpLoad %30 %34
%326 = OpLogicalOr %30 %387 %388
%329 = OpSelect %277 %326 %328 %282
%325 = OpGroupNonUniformFMax %277 %42 Reduce %329
%330 = OpIMul %5 %29 %48
%331 = OpIAdd %5 %330 %42
%332 = OpBitcast %22 %325
%333 = OpCompositeExtract %21 %332 0
%334 = OpCompositeExtract %21 %332 1
%335 = OpCompositeExtract %21 %332 2
%336 = OpCompositeExtract %21 %332 3
%337 = OpCompositeConstruct %22 %333 %334 %335 %336
%338 = OpAccessChain %295 %26 %44 %331
OpStore %338 %337
%395 = OpFunctionCall %1 %389
OpReturn
OpFunctionEnd
%389 = OpFunction %1 None %2
%390 = OpLabel
%393 = OpLoad %30 %34
OpSelectionMerge %392 None
OpBranchConditional %393 %391 %392
%391 = OpLabel
OpKill
%392 = OpLabel
OpReturn
OpFunctionEnd
#endif
