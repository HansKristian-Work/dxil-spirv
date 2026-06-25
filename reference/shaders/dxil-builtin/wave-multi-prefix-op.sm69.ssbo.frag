#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_KHR_shader_subgroup_arithmetic : require

vec3 _37;
f16vec2 _45;
uvec4 _123;
uvec4 _59;
vec3 _96;
f16vec2 _143;
uvec4 _186;
vec3 _220;
f16vec2 _265;
uvec4 _308;
uvec3 _346;
uvec2 _391;

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uvec4 _m0[];
} _10;

layout(set = 0, binding = 1, std430) restrict readonly buffer _12_14
{
    uvec4 _m0[];
} _14;

layout(set = 0, binding = 0, std430) writeonly buffer _16_18
{
    uvec4 _m0[];
} _18;

layout(location = 0) flat in uint THR;

uvec4 WaveMultiPrefixSum(uvec4 _54, uvec4 _55, bool _56)
{
    uvec4 _76;
    if (_56)
    {
        _76 = _59;
    }
    else
    {
        uvec4 _67 = subgroupBallot(true);
        uvec4 _70 = _67 & _55;
        bool _73;
        uvec4 _75;
        for (;;)
        {
            _73 = all(equal(_70, subgroupBroadcastFirst(_70)));
            if (_73)
            {
                _75 = subgroupExclusiveAdd(_54);
            }
            else
            {
                _75 = _59;
            }
            if (_73)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _76 = _75;
    }
    return _76;
}

vec3 WaveMultiPrefixSum(vec3 _91, uvec4 _92, bool _93)
{
    vec3 _111;
    if (_93)
    {
        _111 = _96;
    }
    else
    {
        uvec4 _104 = subgroupBallot(true);
        uvec4 _105 = _104 & _92;
        bool _108;
        vec3 _110;
        for (;;)
        {
            _108 = all(equal(_105, subgroupBroadcastFirst(_105)));
            if (_108)
            {
                _110 = subgroupExclusiveAdd(_91);
            }
            else
            {
                _110 = _96;
            }
            if (_108)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _111 = _110;
    }
    return _111;
}

f16vec2 WaveMultiPrefixSum(f16vec2 _138, uvec4 _139, bool _140)
{
    f16vec2 _158;
    if (_140)
    {
        _158 = _143;
    }
    else
    {
        uvec4 _151 = subgroupBallot(true);
        uvec4 _152 = _151 & _139;
        bool _155;
        f16vec2 _157;
        for (;;)
        {
            _155 = all(equal(_152, subgroupBroadcastFirst(_152)));
            if (_155)
            {
                _157 = subgroupExclusiveAdd(_138);
            }
            else
            {
                _157 = _143;
            }
            if (_155)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _158 = _157;
    }
    return _158;
}

uvec4 WaveMultiPrefixProduct(uvec4 _181, uvec4 _182, bool _183)
{
    uvec4 _201;
    if (_183)
    {
        _201 = _186;
    }
    else
    {
        uvec4 _194 = subgroupBallot(true);
        uvec4 _195 = _194 & _182;
        bool _198;
        uvec4 _200;
        for (;;)
        {
            _198 = all(equal(_195, subgroupBroadcastFirst(_195)));
            if (_198)
            {
                _200 = subgroupExclusiveMul(_181);
            }
            else
            {
                _200 = _186;
            }
            if (_198)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _201 = _200;
    }
    return _201;
}

vec3 WaveMultiPrefixProduct(vec3 _215, uvec4 _216, bool _217)
{
    vec3 _235;
    if (_217)
    {
        _235 = _220;
    }
    else
    {
        uvec4 _228 = subgroupBallot(true);
        uvec4 _229 = _228 & _216;
        bool _232;
        vec3 _234;
        for (;;)
        {
            _232 = all(equal(_229, subgroupBroadcastFirst(_229)));
            if (_232)
            {
                _234 = subgroupExclusiveMul(_215);
            }
            else
            {
                _234 = _220;
            }
            if (_232)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _235 = _234;
    }
    return _235;
}

f16vec2 WaveMultiPrefixProduct(f16vec2 _260, uvec4 _261, bool _262)
{
    f16vec2 _280;
    if (_262)
    {
        _280 = _265;
    }
    else
    {
        uvec4 _273 = subgroupBallot(true);
        uvec4 _274 = _273 & _261;
        bool _277;
        f16vec2 _279;
        for (;;)
        {
            _277 = all(equal(_274, subgroupBroadcastFirst(_274)));
            if (_277)
            {
                _279 = subgroupExclusiveMul(_260);
            }
            else
            {
                _279 = _265;
            }
            if (_277)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _280 = _279;
    }
    return _280;
}

uvec4 WaveMultiPrefixBitOr(uvec4 _303, uvec4 _304, bool _305)
{
    uvec4 _323;
    if (_305)
    {
        _323 = _308;
    }
    else
    {
        uvec4 _316 = subgroupBallot(true);
        uvec4 _317 = _316 & _304;
        bool _320;
        uvec4 _322;
        for (;;)
        {
            _320 = all(equal(_317, subgroupBroadcastFirst(_317)));
            if (_320)
            {
                _322 = subgroupExclusiveOr(_303);
            }
            else
            {
                _322 = _308;
            }
            if (_320)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _323 = _322;
    }
    return _323;
}

uvec3 WaveMultiPrefixBitAnd(uvec3 _341, uvec4 _342, bool _343)
{
    uvec3 _361;
    if (_343)
    {
        _361 = _346;
    }
    else
    {
        uvec4 _354 = subgroupBallot(true);
        uvec4 _355 = _354 & _342;
        bool _358;
        uvec3 _360;
        for (;;)
        {
            _358 = all(equal(_355, subgroupBroadcastFirst(_355)));
            if (_358)
            {
                _360 = subgroupExclusiveAnd(_341);
            }
            else
            {
                _360 = _346;
            }
            if (_358)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _361 = _360;
    }
    return _361;
}

uvec2 WaveMultiPrefixBitXor(uvec2 _386, uvec4 _387, bool _388)
{
    uvec2 _406;
    if (_388)
    {
        _406 = _391;
    }
    else
    {
        uvec4 _399 = subgroupBallot(true);
        uvec4 _400 = _399 & _387;
        bool _403;
        uvec2 _405;
        for (;;)
        {
            _403 = all(equal(_400, subgroupBroadcastFirst(_400)));
            if (_403)
            {
                _405 = subgroupExclusiveXor(_386);
            }
            else
            {
                _405 = _391;
            }
            if (_403)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _406 = _405;
    }
    return _406;
}

void main()
{
    float _32 = float(_10._m0[THR].x);
    float _33 = float(_10._m0[THR].y);
    vec3 _36;
    _36.x = _32;
    _36.y = _33;
    _36.z = float(_10._m0[THR].z);
    f16vec2 _44;
    _44.x = float16_t(_32);
    _44.y = float16_t(_33);
    uint _81 = THR * 9u;
    _18._m0[THR * 9u] = uvec4(WaveMultiPrefixSum(_10._m0[THR], uvec4(_14._m0[THR]), gl_HelperInvocation));
    vec3 _113 = WaveMultiPrefixSum(_36, uvec4(_14._m0[THR]), gl_HelperInvocation);
    uvec4 _122;
    _122.x = uint(_113.x);
    _122.y = uint(_113.y);
    _122.z = uint(_113.z);
    _122.w = 0u;
    _18._m0[(THR * 9u) + 1u] = uvec4(_122);
    f16vec2 _160 = WaveMultiPrefixSum(_44, uvec4(_14._m0[THR]), gl_HelperInvocation);
    uvec4 _167;
    _167.x = uint(_160.x);
    _167.y = uint(_160.y);
    _167.z = 0u;
    _167.w = 0u;
    _18._m0[(THR * 9u) + 2u] = uvec4(_167);
    _18._m0[(THR * 9u) + 3u] = uvec4(WaveMultiPrefixProduct(_10._m0[THR], uvec4(_14._m0[THR]), gl_HelperInvocation));
    vec3 _237 = WaveMultiPrefixProduct(_36, uvec4(_14._m0[THR]), gl_HelperInvocation);
    uvec4 _246;
    _246.x = uint(_237.x);
    _246.y = uint(_237.y);
    _246.z = uint(_237.z);
    _246.w = 0u;
    _18._m0[(THR * 9u) + 4u] = uvec4(_246);
    f16vec2 _282 = WaveMultiPrefixProduct(_44, uvec4(_14._m0[THR]), gl_HelperInvocation);
    uvec4 _289;
    _289.x = uint(_282.x);
    _289.y = uint(_282.y);
    _289.z = 0u;
    _289.w = 0u;
    _18._m0[(THR * 9u) + 5u] = uvec4(_289);
    _18._m0[(THR * 9u) + 6u] = uvec4(WaveMultiPrefixBitOr(_10._m0[THR], uvec4(_14._m0[THR]), gl_HelperInvocation));
    uvec3 _363 = WaveMultiPrefixBitAnd(uvec3(ivec3(_36)), uvec4(_14._m0[THR]), gl_HelperInvocation);
    uvec4 _369;
    _369.x = _363.x;
    _369.y = _363.y;
    _369.z = _363.z;
    _369.w = 0u;
    _18._m0[(THR * 9u) + 7u] = uvec4(_369);
    uvec2 _408 = WaveMultiPrefixBitXor(uvec2(ivec2(_44)), uvec4(_14._m0[THR]), gl_HelperInvocation);
    uvec4 _413;
    _413.x = _408.x;
    _413.y = _408.y;
    _413.z = 0u;
    _413.w = 0u;
    _18._m0[(THR * 9u) + 8u] = uvec4(_413);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 431
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability GroupNonUniformArithmetic
OpCapability GroupNonUniformBallot
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %14 %18 %20 %429
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %8 "SSBO"
OpName %12 "SSBO"
OpName %16 "SSBO"
OpName %20 "THR"
OpName %57 "WaveMultiPrefixSum"
OpName %94 "WaveMultiPrefixSum"
OpName %141 "WaveMultiPrefixSum"
OpName %184 "WaveMultiPrefixProduct"
OpName %218 "WaveMultiPrefixProduct"
OpName %263 "WaveMultiPrefixProduct"
OpName %306 "WaveMultiPrefixBitOr"
OpName %344 "WaveMultiPrefixBitAnd"
OpName %389 "WaveMultiPrefixBitXor"
OpDecorate %7 ArrayStride 16
OpMemberDecorate %8 0 Offset 0
OpDecorate %8 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonWritable
OpDecorate %10 Restrict
OpDecorate %11 ArrayStride 16
OpMemberDecorate %12 0 Offset 0
OpDecorate %12 Block
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 1
OpDecorate %14 NonWritable
OpDecorate %14 Restrict
OpDecorate %15 ArrayStride 16
OpMemberDecorate %16 0 Offset 0
OpDecorate %16 Block
OpDecorate %18 DescriptorSet 0
OpDecorate %18 Binding 0
OpDecorate %18 NonReadable
OpDecorate %20 Flat
OpDecorate %20 Location 0
OpDecorate %429 BuiltIn HelperInvocation
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 4
%7 = OpTypeRuntimeArray %6
%8 = OpTypeStruct %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypeRuntimeArray %6
%12 = OpTypeStruct %11
%13 = OpTypePointer StorageBuffer %12
%14 = OpVariable %13 StorageBuffer
%15 = OpTypeRuntimeArray %6
%16 = OpTypeStruct %15
%17 = OpTypePointer StorageBuffer %16
%18 = OpVariable %17 StorageBuffer
%19 = OpTypePointer Input %5
%20 = OpVariable %19 Input
%22 = OpTypePointer StorageBuffer %6
%24 = OpConstant %5 0
%31 = OpTypeFloat 32
%35 = OpTypeVector %31 3
%40 = OpTypeFloat 16
%43 = OpTypeVector %40 2
%51 = OpTypeBool
%52 = OpTypeVector %51 4
%53 = OpTypeFunction %6 %6 %6 %51
%68 = OpConstant %5 3
%69 = OpConstantTrue %51
%82 = OpConstant %5 9
%90 = OpTypeFunction %35 %35 %6 %51
%128 = OpConstant %5 1
%137 = OpTypeFunction %43 %43 %6 %51
%172 = OpConstant %5 2
%251 = OpConstant %5 4
%294 = OpConstant %5 5
%329 = OpConstant %5 6
%338 = OpTypeVector %5 3
%340 = OpTypeFunction %338 %338 %6 %51
%374 = OpConstant %5 7
%383 = OpTypeVector %5 2
%385 = OpTypeFunction %383 %383 %6 %51
%418 = OpConstant %5 8
%428 = OpTypePointer Input %51
%429 = OpVariable %428 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
%37 = OpUndef %35
%45 = OpUndef %43
%123 = OpUndef %6
OpBranch %427
%427 = OpLabel
%21 = OpLoad %5 %20
%23 = OpAccessChain %22 %14 %24 %21
%25 = OpLoad %6 %23
%26 = OpAccessChain %22 %10 %24 %21
%27 = OpLoad %6 %26
%28 = OpCompositeExtract %5 %27 0
%29 = OpCompositeExtract %5 %27 1
%30 = OpCompositeExtract %5 %27 2
%32 = OpConvertUToF %31 %28
%33 = OpConvertUToF %31 %29
%34 = OpConvertUToF %31 %30
%36 = OpCompositeInsert %35 %32 %37 0
%38 = OpCompositeInsert %35 %33 %36 1
%39 = OpCompositeInsert %35 %34 %38 2
%41 = OpFConvert %40 %32
%42 = OpFConvert %40 %33
%44 = OpCompositeInsert %43 %41 %45 0
%46 = OpCompositeInsert %43 %42 %44 1
%47 = OpCompositeExtract %5 %25 0
%48 = OpCompositeExtract %5 %25 1
%49 = OpCompositeExtract %5 %25 2
%50 = OpCompositeExtract %5 %25 3
%79 = OpCompositeConstruct %6 %47 %48 %49 %50
%80 = OpLoad %51 %429
%78 = OpFunctionCall %6 %57 %27 %79 %80
%81 = OpIMul %5 %21 %82
%83 = OpIMul %5 %21 %82
%84 = OpCompositeExtract %5 %78 0
%85 = OpCompositeExtract %5 %78 1
%86 = OpCompositeExtract %5 %78 2
%87 = OpCompositeExtract %5 %78 3
%88 = OpCompositeConstruct %6 %84 %85 %86 %87
%89 = OpAccessChain %22 %18 %24 %83
OpStore %89 %88
%114 = OpCompositeConstruct %6 %47 %48 %49 %50
%115 = OpLoad %51 %429
%113 = OpFunctionCall %35 %94 %39 %114 %115
%116 = OpCompositeExtract %31 %113 0
%117 = OpCompositeExtract %31 %113 1
%118 = OpCompositeExtract %31 %113 2
%119 = OpConvertFToU %5 %116
%120 = OpConvertFToU %5 %117
%121 = OpConvertFToU %5 %118
%122 = OpCompositeInsert %6 %119 %123 0
%124 = OpCompositeInsert %6 %120 %122 1
%125 = OpCompositeInsert %6 %121 %124 2
%126 = OpCompositeInsert %6 %24 %125 3
%127 = OpIAdd %5 %81 %128
%129 = OpIMul %5 %21 %82
%130 = OpIAdd %5 %129 %128
%131 = OpCompositeExtract %5 %126 0
%132 = OpCompositeExtract %5 %126 1
%133 = OpCompositeExtract %5 %126 2
%134 = OpCompositeExtract %5 %126 3
%135 = OpCompositeConstruct %6 %131 %132 %133 %134
%136 = OpAccessChain %22 %18 %24 %130
OpStore %136 %135
%161 = OpCompositeConstruct %6 %47 %48 %49 %50
%162 = OpLoad %51 %429
%160 = OpFunctionCall %43 %141 %46 %161 %162
%163 = OpCompositeExtract %40 %160 0
%164 = OpCompositeExtract %40 %160 1
%165 = OpConvertFToU %5 %163
%166 = OpConvertFToU %5 %164
%167 = OpCompositeInsert %6 %165 %123 0
%168 = OpCompositeInsert %6 %166 %167 1
%169 = OpCompositeInsert %6 %24 %168 2
%170 = OpCompositeInsert %6 %24 %169 3
%171 = OpIAdd %5 %81 %172
%173 = OpIMul %5 %21 %82
%174 = OpIAdd %5 %173 %172
%175 = OpCompositeExtract %5 %170 0
%176 = OpCompositeExtract %5 %170 1
%177 = OpCompositeExtract %5 %170 2
%178 = OpCompositeExtract %5 %170 3
%179 = OpCompositeConstruct %6 %175 %176 %177 %178
%180 = OpAccessChain %22 %18 %24 %174
OpStore %180 %179
%204 = OpCompositeConstruct %6 %47 %48 %49 %50
%205 = OpLoad %51 %429
%203 = OpFunctionCall %6 %184 %27 %204 %205
%206 = OpIAdd %5 %81 %68
%207 = OpIMul %5 %21 %82
%208 = OpIAdd %5 %207 %68
%209 = OpCompositeExtract %5 %203 0
%210 = OpCompositeExtract %5 %203 1
%211 = OpCompositeExtract %5 %203 2
%212 = OpCompositeExtract %5 %203 3
%213 = OpCompositeConstruct %6 %209 %210 %211 %212
%214 = OpAccessChain %22 %18 %24 %208
OpStore %214 %213
%238 = OpCompositeConstruct %6 %47 %48 %49 %50
%239 = OpLoad %51 %429
%237 = OpFunctionCall %35 %218 %39 %238 %239
%240 = OpCompositeExtract %31 %237 0
%241 = OpCompositeExtract %31 %237 1
%242 = OpCompositeExtract %31 %237 2
%243 = OpConvertFToU %5 %240
%244 = OpConvertFToU %5 %241
%245 = OpConvertFToU %5 %242
%246 = OpCompositeInsert %6 %243 %123 0
%247 = OpCompositeInsert %6 %244 %246 1
%248 = OpCompositeInsert %6 %245 %247 2
%249 = OpCompositeInsert %6 %24 %248 3
%250 = OpIAdd %5 %81 %251
%252 = OpIMul %5 %21 %82
%253 = OpIAdd %5 %252 %251
%254 = OpCompositeExtract %5 %249 0
%255 = OpCompositeExtract %5 %249 1
%256 = OpCompositeExtract %5 %249 2
%257 = OpCompositeExtract %5 %249 3
%258 = OpCompositeConstruct %6 %254 %255 %256 %257
%259 = OpAccessChain %22 %18 %24 %253
OpStore %259 %258
%283 = OpCompositeConstruct %6 %47 %48 %49 %50
%284 = OpLoad %51 %429
%282 = OpFunctionCall %43 %263 %46 %283 %284
%285 = OpCompositeExtract %40 %282 0
%286 = OpCompositeExtract %40 %282 1
%287 = OpConvertFToU %5 %285
%288 = OpConvertFToU %5 %286
%289 = OpCompositeInsert %6 %287 %123 0
%290 = OpCompositeInsert %6 %288 %289 1
%291 = OpCompositeInsert %6 %24 %290 2
%292 = OpCompositeInsert %6 %24 %291 3
%293 = OpIAdd %5 %81 %294
%295 = OpIMul %5 %21 %82
%296 = OpIAdd %5 %295 %294
%297 = OpCompositeExtract %5 %292 0
%298 = OpCompositeExtract %5 %292 1
%299 = OpCompositeExtract %5 %292 2
%300 = OpCompositeExtract %5 %292 3
%301 = OpCompositeConstruct %6 %297 %298 %299 %300
%302 = OpAccessChain %22 %18 %24 %296
OpStore %302 %301
%326 = OpCompositeConstruct %6 %47 %48 %49 %50
%327 = OpLoad %51 %429
%325 = OpFunctionCall %6 %306 %27 %326 %327
%328 = OpIAdd %5 %81 %329
%330 = OpIMul %5 %21 %82
%331 = OpIAdd %5 %330 %329
%332 = OpCompositeExtract %5 %325 0
%333 = OpCompositeExtract %5 %325 1
%334 = OpCompositeExtract %5 %325 2
%335 = OpCompositeExtract %5 %325 3
%336 = OpCompositeConstruct %6 %332 %333 %334 %335
%337 = OpAccessChain %22 %18 %24 %331
OpStore %337 %336
%339 = OpConvertFToS %338 %39
%364 = OpCompositeConstruct %6 %47 %48 %49 %50
%365 = OpLoad %51 %429
%363 = OpFunctionCall %338 %344 %339 %364 %365
%366 = OpCompositeExtract %5 %363 0
%367 = OpCompositeExtract %5 %363 1
%368 = OpCompositeExtract %5 %363 2
%369 = OpCompositeInsert %6 %366 %123 0
%370 = OpCompositeInsert %6 %367 %369 1
%371 = OpCompositeInsert %6 %368 %370 2
%372 = OpCompositeInsert %6 %24 %371 3
%373 = OpIAdd %5 %81 %374
%375 = OpIMul %5 %21 %82
%376 = OpIAdd %5 %375 %374
%377 = OpCompositeExtract %5 %372 0
%378 = OpCompositeExtract %5 %372 1
%379 = OpCompositeExtract %5 %372 2
%380 = OpCompositeExtract %5 %372 3
%381 = OpCompositeConstruct %6 %377 %378 %379 %380
%382 = OpAccessChain %22 %18 %24 %376
OpStore %382 %381
%384 = OpConvertFToS %383 %46
%409 = OpCompositeConstruct %6 %47 %48 %49 %50
%410 = OpLoad %51 %429
%408 = OpFunctionCall %383 %389 %384 %409 %410
%411 = OpCompositeExtract %5 %408 0
%412 = OpCompositeExtract %5 %408 1
%413 = OpCompositeInsert %6 %411 %123 0
%414 = OpCompositeInsert %6 %412 %413 1
%415 = OpCompositeInsert %6 %24 %414 2
%416 = OpCompositeInsert %6 %24 %415 3
%417 = OpIAdd %5 %81 %418
%419 = OpIMul %5 %21 %82
%420 = OpIAdd %5 %419 %418
%421 = OpCompositeExtract %5 %416 0
%422 = OpCompositeExtract %5 %416 1
%423 = OpCompositeExtract %5 %416 2
%424 = OpCompositeExtract %5 %416 3
%425 = OpCompositeConstruct %6 %421 %422 %423 %424
%426 = OpAccessChain %22 %18 %24 %420
OpStore %426 %425
OpReturn
OpFunctionEnd
%57 = OpFunction %6 None %53
%54 = OpFunctionParameter %6
%55 = OpFunctionParameter %6
%56 = OpFunctionParameter %51
%58 = OpLabel
%59 = OpUndef %6
OpSelectionMerge %65 None
OpBranchConditional %56 %65 %66
%66 = OpLabel
%67 = OpGroupNonUniformBallot %6 %68 %69
%70 = OpBitwiseAnd %6 %67 %55
OpBranch %60
%60 = OpLabel
OpLoopMerge %62 %61 None
OpBranch %61
%61 = OpLabel
%71 = OpGroupNonUniformBroadcastFirst %6 %68 %70
%72 = OpIEqual %52 %70 %71
%73 = OpAll %51 %72
OpSelectionMerge %64 None
OpBranchConditional %73 %63 %64
%63 = OpLabel
%74 = OpGroupNonUniformIAdd %6 %68 ExclusiveScan %54
OpBranch %64
%64 = OpLabel
%75 = OpPhi %6 %74 %63 %59 %61
OpBranchConditional %73 %62 %60
%62 = OpLabel
OpBranch %65
%65 = OpLabel
%76 = OpPhi %6 %75 %62 %59 %58
OpReturnValue %76
OpFunctionEnd
%94 = OpFunction %35 None %90
%91 = OpFunctionParameter %35
%92 = OpFunctionParameter %6
%93 = OpFunctionParameter %51
%95 = OpLabel
%96 = OpUndef %35
OpSelectionMerge %102 None
OpBranchConditional %93 %102 %103
%103 = OpLabel
%104 = OpGroupNonUniformBallot %6 %68 %69
%105 = OpBitwiseAnd %6 %104 %92
OpBranch %97
%97 = OpLabel
OpLoopMerge %99 %98 None
OpBranch %98
%98 = OpLabel
%106 = OpGroupNonUniformBroadcastFirst %6 %68 %105
%107 = OpIEqual %52 %105 %106
%108 = OpAll %51 %107
OpSelectionMerge %101 None
OpBranchConditional %108 %100 %101
%100 = OpLabel
%109 = OpGroupNonUniformFAdd %35 %68 ExclusiveScan %91
OpBranch %101
%101 = OpLabel
%110 = OpPhi %35 %109 %100 %96 %98
OpBranchConditional %108 %99 %97
%99 = OpLabel
OpBranch %102
%102 = OpLabel
%111 = OpPhi %35 %110 %99 %96 %95
OpReturnValue %111
OpFunctionEnd
%141 = OpFunction %43 None %137
%138 = OpFunctionParameter %43
%139 = OpFunctionParameter %6
%140 = OpFunctionParameter %51
%142 = OpLabel
%143 = OpUndef %43
OpSelectionMerge %149 None
OpBranchConditional %140 %149 %150
%150 = OpLabel
%151 = OpGroupNonUniformBallot %6 %68 %69
%152 = OpBitwiseAnd %6 %151 %139
OpBranch %144
%144 = OpLabel
OpLoopMerge %146 %145 None
OpBranch %145
%145 = OpLabel
%153 = OpGroupNonUniformBroadcastFirst %6 %68 %152
%154 = OpIEqual %52 %152 %153
%155 = OpAll %51 %154
OpSelectionMerge %148 None
OpBranchConditional %155 %147 %148
%147 = OpLabel
%156 = OpGroupNonUniformFAdd %43 %68 ExclusiveScan %138
OpBranch %148
%148 = OpLabel
%157 = OpPhi %43 %156 %147 %143 %145
OpBranchConditional %155 %146 %144
%146 = OpLabel
OpBranch %149
%149 = OpLabel
%158 = OpPhi %43 %157 %146 %143 %142
OpReturnValue %158
OpFunctionEnd
%184 = OpFunction %6 None %53
%181 = OpFunctionParameter %6
%182 = OpFunctionParameter %6
%183 = OpFunctionParameter %51
%185 = OpLabel
%186 = OpUndef %6
OpSelectionMerge %192 None
OpBranchConditional %183 %192 %193
%193 = OpLabel
%194 = OpGroupNonUniformBallot %6 %68 %69
%195 = OpBitwiseAnd %6 %194 %182
OpBranch %187
%187 = OpLabel
OpLoopMerge %189 %188 None
OpBranch %188
%188 = OpLabel
%196 = OpGroupNonUniformBroadcastFirst %6 %68 %195
%197 = OpIEqual %52 %195 %196
%198 = OpAll %51 %197
OpSelectionMerge %191 None
OpBranchConditional %198 %190 %191
%190 = OpLabel
%199 = OpGroupNonUniformIMul %6 %68 ExclusiveScan %181
OpBranch %191
%191 = OpLabel
%200 = OpPhi %6 %199 %190 %186 %188
OpBranchConditional %198 %189 %187
%189 = OpLabel
OpBranch %192
%192 = OpLabel
%201 = OpPhi %6 %200 %189 %186 %185
OpReturnValue %201
OpFunctionEnd
%218 = OpFunction %35 None %90
%215 = OpFunctionParameter %35
%216 = OpFunctionParameter %6
%217 = OpFunctionParameter %51
%219 = OpLabel
%220 = OpUndef %35
OpSelectionMerge %226 None
OpBranchConditional %217 %226 %227
%227 = OpLabel
%228 = OpGroupNonUniformBallot %6 %68 %69
%229 = OpBitwiseAnd %6 %228 %216
OpBranch %221
%221 = OpLabel
OpLoopMerge %223 %222 None
OpBranch %222
%222 = OpLabel
%230 = OpGroupNonUniformBroadcastFirst %6 %68 %229
%231 = OpIEqual %52 %229 %230
%232 = OpAll %51 %231
OpSelectionMerge %225 None
OpBranchConditional %232 %224 %225
%224 = OpLabel
%233 = OpGroupNonUniformFMul %35 %68 ExclusiveScan %215
OpBranch %225
%225 = OpLabel
%234 = OpPhi %35 %233 %224 %220 %222
OpBranchConditional %232 %223 %221
%223 = OpLabel
OpBranch %226
%226 = OpLabel
%235 = OpPhi %35 %234 %223 %220 %219
OpReturnValue %235
OpFunctionEnd
%263 = OpFunction %43 None %137
%260 = OpFunctionParameter %43
%261 = OpFunctionParameter %6
%262 = OpFunctionParameter %51
%264 = OpLabel
%265 = OpUndef %43
OpSelectionMerge %271 None
OpBranchConditional %262 %271 %272
%272 = OpLabel
%273 = OpGroupNonUniformBallot %6 %68 %69
%274 = OpBitwiseAnd %6 %273 %261
OpBranch %266
%266 = OpLabel
OpLoopMerge %268 %267 None
OpBranch %267
%267 = OpLabel
%275 = OpGroupNonUniformBroadcastFirst %6 %68 %274
%276 = OpIEqual %52 %274 %275
%277 = OpAll %51 %276
OpSelectionMerge %270 None
OpBranchConditional %277 %269 %270
%269 = OpLabel
%278 = OpGroupNonUniformFMul %43 %68 ExclusiveScan %260
OpBranch %270
%270 = OpLabel
%279 = OpPhi %43 %278 %269 %265 %267
OpBranchConditional %277 %268 %266
%268 = OpLabel
OpBranch %271
%271 = OpLabel
%280 = OpPhi %43 %279 %268 %265 %264
OpReturnValue %280
OpFunctionEnd
%306 = OpFunction %6 None %53
%303 = OpFunctionParameter %6
%304 = OpFunctionParameter %6
%305 = OpFunctionParameter %51
%307 = OpLabel
%308 = OpUndef %6
OpSelectionMerge %314 None
OpBranchConditional %305 %314 %315
%315 = OpLabel
%316 = OpGroupNonUniformBallot %6 %68 %69
%317 = OpBitwiseAnd %6 %316 %304
OpBranch %309
%309 = OpLabel
OpLoopMerge %311 %310 None
OpBranch %310
%310 = OpLabel
%318 = OpGroupNonUniformBroadcastFirst %6 %68 %317
%319 = OpIEqual %52 %317 %318
%320 = OpAll %51 %319
OpSelectionMerge %313 None
OpBranchConditional %320 %312 %313
%312 = OpLabel
%321 = OpGroupNonUniformBitwiseOr %6 %68 ExclusiveScan %303
OpBranch %313
%313 = OpLabel
%322 = OpPhi %6 %321 %312 %308 %310
OpBranchConditional %320 %311 %309
%311 = OpLabel
OpBranch %314
%314 = OpLabel
%323 = OpPhi %6 %322 %311 %308 %307
OpReturnValue %323
OpFunctionEnd
%344 = OpFunction %338 None %340
%341 = OpFunctionParameter %338
%342 = OpFunctionParameter %6
%343 = OpFunctionParameter %51
%345 = OpLabel
%346 = OpUndef %338
OpSelectionMerge %352 None
OpBranchConditional %343 %352 %353
%353 = OpLabel
%354 = OpGroupNonUniformBallot %6 %68 %69
%355 = OpBitwiseAnd %6 %354 %342
OpBranch %347
%347 = OpLabel
OpLoopMerge %349 %348 None
OpBranch %348
%348 = OpLabel
%356 = OpGroupNonUniformBroadcastFirst %6 %68 %355
%357 = OpIEqual %52 %355 %356
%358 = OpAll %51 %357
OpSelectionMerge %351 None
OpBranchConditional %358 %350 %351
%350 = OpLabel
%359 = OpGroupNonUniformBitwiseAnd %338 %68 ExclusiveScan %341
OpBranch %351
%351 = OpLabel
%360 = OpPhi %338 %359 %350 %346 %348
OpBranchConditional %358 %349 %347
%349 = OpLabel
OpBranch %352
%352 = OpLabel
%361 = OpPhi %338 %360 %349 %346 %345
OpReturnValue %361
OpFunctionEnd
%389 = OpFunction %383 None %385
%386 = OpFunctionParameter %383
%387 = OpFunctionParameter %6
%388 = OpFunctionParameter %51
%390 = OpLabel
%391 = OpUndef %383
OpSelectionMerge %397 None
OpBranchConditional %388 %397 %398
%398 = OpLabel
%399 = OpGroupNonUniformBallot %6 %68 %69
%400 = OpBitwiseAnd %6 %399 %387
OpBranch %392
%392 = OpLabel
OpLoopMerge %394 %393 None
OpBranch %393
%393 = OpLabel
%401 = OpGroupNonUniformBroadcastFirst %6 %68 %400
%402 = OpIEqual %52 %400 %401
%403 = OpAll %51 %402
OpSelectionMerge %396 None
OpBranchConditional %403 %395 %396
%395 = OpLabel
%404 = OpGroupNonUniformBitwiseXor %383 %68 ExclusiveScan %386
OpBranch %396
%396 = OpLabel
%405 = OpPhi %383 %404 %395 %391 %393
OpBranchConditional %403 %394 %392
%394 = OpLabel
OpBranch %397
%397 = OpLabel
%406 = OpPhi %383 %405 %394 %391 %390
OpReturnValue %406
OpFunctionEnd
#endif
