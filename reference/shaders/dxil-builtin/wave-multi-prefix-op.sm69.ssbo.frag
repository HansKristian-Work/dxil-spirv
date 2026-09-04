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
#extension GL_EXT_shader_subgroup_extended_types_float16 : require

vec3 _37;
f16vec2 _45;
uvec4 _118;
uvec4 _59;
vec3 _91;
f16vec2 _133;
uvec4 _171;
vec3 _200;
f16vec2 _240;
uvec4 _278;
uvec3 _311;
uvec2 _351;

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

vec3 WaveMultiPrefixSum(vec3 _86, uvec4 _87, bool _88)
{
    vec3 _106;
    if (_88)
    {
        _106 = _91;
    }
    else
    {
        uvec4 _99 = subgroupBallot(true);
        uvec4 _100 = _99 & _87;
        bool _103;
        vec3 _105;
        for (;;)
        {
            _103 = all(equal(_100, subgroupBroadcastFirst(_100)));
            if (_103)
            {
                _105 = subgroupExclusiveAdd(_86);
            }
            else
            {
                _105 = _91;
            }
            if (_103)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _106 = _105;
    }
    return _106;
}

f16vec2 WaveMultiPrefixSum(f16vec2 _128, uvec4 _129, bool _130)
{
    f16vec2 _148;
    if (_130)
    {
        _148 = _133;
    }
    else
    {
        uvec4 _141 = subgroupBallot(true);
        uvec4 _142 = _141 & _129;
        bool _145;
        f16vec2 _147;
        for (;;)
        {
            _145 = all(equal(_142, subgroupBroadcastFirst(_142)));
            if (_145)
            {
                _147 = subgroupExclusiveAdd(_128);
            }
            else
            {
                _147 = _133;
            }
            if (_145)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _148 = _147;
    }
    return _148;
}

uvec4 WaveMultiPrefixProduct(uvec4 _166, uvec4 _167, bool _168)
{
    uvec4 _186;
    if (_168)
    {
        _186 = _171;
    }
    else
    {
        uvec4 _179 = subgroupBallot(true);
        uvec4 _180 = _179 & _167;
        bool _183;
        uvec4 _185;
        for (;;)
        {
            _183 = all(equal(_180, subgroupBroadcastFirst(_180)));
            if (_183)
            {
                _185 = subgroupExclusiveMul(_166);
            }
            else
            {
                _185 = _171;
            }
            if (_183)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _186 = _185;
    }
    return _186;
}

vec3 WaveMultiPrefixProduct(vec3 _195, uvec4 _196, bool _197)
{
    vec3 _215;
    if (_197)
    {
        _215 = _200;
    }
    else
    {
        uvec4 _208 = subgroupBallot(true);
        uvec4 _209 = _208 & _196;
        bool _212;
        vec3 _214;
        for (;;)
        {
            _212 = all(equal(_209, subgroupBroadcastFirst(_209)));
            if (_212)
            {
                _214 = subgroupExclusiveMul(_195);
            }
            else
            {
                _214 = _200;
            }
            if (_212)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _215 = _214;
    }
    return _215;
}

f16vec2 WaveMultiPrefixProduct(f16vec2 _235, uvec4 _236, bool _237)
{
    f16vec2 _255;
    if (_237)
    {
        _255 = _240;
    }
    else
    {
        uvec4 _248 = subgroupBallot(true);
        uvec4 _249 = _248 & _236;
        bool _252;
        f16vec2 _254;
        for (;;)
        {
            _252 = all(equal(_249, subgroupBroadcastFirst(_249)));
            if (_252)
            {
                _254 = subgroupExclusiveMul(_235);
            }
            else
            {
                _254 = _240;
            }
            if (_252)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _255 = _254;
    }
    return _255;
}

uvec4 WaveMultiPrefixBitOr(uvec4 _273, uvec4 _274, bool _275)
{
    uvec4 _293;
    if (_275)
    {
        _293 = _278;
    }
    else
    {
        uvec4 _286 = subgroupBallot(true);
        uvec4 _287 = _286 & _274;
        bool _290;
        uvec4 _292;
        for (;;)
        {
            _290 = all(equal(_287, subgroupBroadcastFirst(_287)));
            if (_290)
            {
                _292 = subgroupExclusiveOr(_273);
            }
            else
            {
                _292 = _278;
            }
            if (_290)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _293 = _292;
    }
    return _293;
}

uvec3 WaveMultiPrefixBitAnd(uvec3 _306, uvec4 _307, bool _308)
{
    uvec3 _326;
    if (_308)
    {
        _326 = _311;
    }
    else
    {
        uvec4 _319 = subgroupBallot(true);
        uvec4 _320 = _319 & _307;
        bool _323;
        uvec3 _325;
        for (;;)
        {
            _323 = all(equal(_320, subgroupBroadcastFirst(_320)));
            if (_323)
            {
                _325 = subgroupExclusiveAnd(_306);
            }
            else
            {
                _325 = _311;
            }
            if (_323)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _326 = _325;
    }
    return _326;
}

uvec2 WaveMultiPrefixBitXor(uvec2 _346, uvec4 _347, bool _348)
{
    uvec2 _366;
    if (_348)
    {
        _366 = _351;
    }
    else
    {
        uvec4 _359 = subgroupBallot(true);
        uvec4 _360 = _359 & _347;
        bool _363;
        uvec2 _365;
        for (;;)
        {
            _363 = all(equal(_360, subgroupBroadcastFirst(_360)));
            if (_363)
            {
                _365 = subgroupExclusiveXor(_346);
            }
            else
            {
                _365 = _351;
            }
            if (_363)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _366 = _365;
    }
    return _366;
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
    _18._m0[THR * 9u] = WaveMultiPrefixSum(_10._m0[THR], uvec4(_14._m0[THR]), gl_HelperInvocation);
    vec3 _108 = WaveMultiPrefixSum(_36, uvec4(_14._m0[THR]), gl_HelperInvocation);
    uvec4 _117;
    _117.x = uint(_108.x);
    _117.y = uint(_108.y);
    _117.z = uint(_108.z);
    _117.w = 0u;
    _18._m0[(THR * 9u) + 1u] = _117;
    f16vec2 _150 = WaveMultiPrefixSum(_44, uvec4(_14._m0[THR]), gl_HelperInvocation);
    uvec4 _157;
    _157.x = uint(_150.x);
    _157.y = uint(_150.y);
    _157.z = 0u;
    _157.w = 0u;
    _18._m0[(THR * 9u) + 2u] = _157;
    _18._m0[(THR * 9u) + 3u] = WaveMultiPrefixProduct(_10._m0[THR], uvec4(_14._m0[THR]), gl_HelperInvocation);
    vec3 _217 = WaveMultiPrefixProduct(_36, uvec4(_14._m0[THR]), gl_HelperInvocation);
    uvec4 _226;
    _226.x = uint(_217.x);
    _226.y = uint(_217.y);
    _226.z = uint(_217.z);
    _226.w = 0u;
    _18._m0[(THR * 9u) + 4u] = _226;
    f16vec2 _257 = WaveMultiPrefixProduct(_44, uvec4(_14._m0[THR]), gl_HelperInvocation);
    uvec4 _264;
    _264.x = uint(_257.x);
    _264.y = uint(_257.y);
    _264.z = 0u;
    _264.w = 0u;
    _18._m0[(THR * 9u) + 5u] = _264;
    _18._m0[(THR * 9u) + 6u] = WaveMultiPrefixBitOr(_10._m0[THR], uvec4(_14._m0[THR]), gl_HelperInvocation);
    uvec3 _328 = WaveMultiPrefixBitAnd(uvec3(ivec3(_36)), uvec4(_14._m0[THR]), gl_HelperInvocation);
    uvec4 _334;
    _334.x = _328.x;
    _334.y = _328.y;
    _334.z = _328.z;
    _334.w = 0u;
    _18._m0[(THR * 9u) + 7u] = _334;
    uvec2 _368 = WaveMultiPrefixBitXor(uvec2(ivec2(_44)), uvec4(_14._m0[THR]), gl_HelperInvocation);
    uvec4 _373;
    _373.x = _368.x;
    _373.y = _368.y;
    _373.z = 0u;
    _373.w = 0u;
    _18._m0[(THR * 9u) + 8u] = _373;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 386
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability GroupNonUniformArithmetic
OpCapability GroupNonUniformBallot
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %14 %18 %20 %384
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %8 "SSBO"
OpName %12 "SSBO"
OpName %16 "SSBO"
OpName %20 "THR"
OpName %57 "WaveMultiPrefixSum"
OpName %89 "WaveMultiPrefixSum"
OpName %131 "WaveMultiPrefixSum"
OpName %169 "WaveMultiPrefixProduct"
OpName %198 "WaveMultiPrefixProduct"
OpName %238 "WaveMultiPrefixProduct"
OpName %276 "WaveMultiPrefixBitOr"
OpName %309 "WaveMultiPrefixBitAnd"
OpName %349 "WaveMultiPrefixBitXor"
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
OpDecorate %384 BuiltIn HelperInvocation
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
%85 = OpTypeFunction %35 %35 %6 %51
%123 = OpConstant %5 1
%127 = OpTypeFunction %43 %43 %6 %51
%162 = OpConstant %5 2
%231 = OpConstant %5 4
%269 = OpConstant %5 5
%299 = OpConstant %5 6
%303 = OpTypeVector %5 3
%305 = OpTypeFunction %303 %303 %6 %51
%339 = OpConstant %5 7
%343 = OpTypeVector %5 2
%345 = OpTypeFunction %343 %343 %6 %51
%378 = OpConstant %5 8
%383 = OpTypePointer Input %51
%384 = OpVariable %383 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
%37 = OpUndef %35
%45 = OpUndef %43
%118 = OpUndef %6
OpBranch %382
%382 = OpLabel
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
%80 = OpLoad %51 %384
%78 = OpFunctionCall %6 %57 %27 %79 %80
%81 = OpIMul %5 %21 %82
%83 = OpIMul %5 %21 %82
%84 = OpAccessChain %22 %18 %24 %83
OpStore %84 %78
%109 = OpCompositeConstruct %6 %47 %48 %49 %50
%110 = OpLoad %51 %384
%108 = OpFunctionCall %35 %89 %39 %109 %110
%111 = OpCompositeExtract %31 %108 0
%112 = OpCompositeExtract %31 %108 1
%113 = OpCompositeExtract %31 %108 2
%114 = OpConvertFToU %5 %111
%115 = OpConvertFToU %5 %112
%116 = OpConvertFToU %5 %113
%117 = OpCompositeInsert %6 %114 %118 0
%119 = OpCompositeInsert %6 %115 %117 1
%120 = OpCompositeInsert %6 %116 %119 2
%121 = OpCompositeInsert %6 %24 %120 3
%122 = OpIAdd %5 %81 %123
%124 = OpIMul %5 %21 %82
%125 = OpIAdd %5 %124 %123
%126 = OpAccessChain %22 %18 %24 %125
OpStore %126 %121
%151 = OpCompositeConstruct %6 %47 %48 %49 %50
%152 = OpLoad %51 %384
%150 = OpFunctionCall %43 %131 %46 %151 %152
%153 = OpCompositeExtract %40 %150 0
%154 = OpCompositeExtract %40 %150 1
%155 = OpConvertFToU %5 %153
%156 = OpConvertFToU %5 %154
%157 = OpCompositeInsert %6 %155 %118 0
%158 = OpCompositeInsert %6 %156 %157 1
%159 = OpCompositeInsert %6 %24 %158 2
%160 = OpCompositeInsert %6 %24 %159 3
%161 = OpIAdd %5 %81 %162
%163 = OpIMul %5 %21 %82
%164 = OpIAdd %5 %163 %162
%165 = OpAccessChain %22 %18 %24 %164
OpStore %165 %160
%189 = OpCompositeConstruct %6 %47 %48 %49 %50
%190 = OpLoad %51 %384
%188 = OpFunctionCall %6 %169 %27 %189 %190
%191 = OpIAdd %5 %81 %68
%192 = OpIMul %5 %21 %82
%193 = OpIAdd %5 %192 %68
%194 = OpAccessChain %22 %18 %24 %193
OpStore %194 %188
%218 = OpCompositeConstruct %6 %47 %48 %49 %50
%219 = OpLoad %51 %384
%217 = OpFunctionCall %35 %198 %39 %218 %219
%220 = OpCompositeExtract %31 %217 0
%221 = OpCompositeExtract %31 %217 1
%222 = OpCompositeExtract %31 %217 2
%223 = OpConvertFToU %5 %220
%224 = OpConvertFToU %5 %221
%225 = OpConvertFToU %5 %222
%226 = OpCompositeInsert %6 %223 %118 0
%227 = OpCompositeInsert %6 %224 %226 1
%228 = OpCompositeInsert %6 %225 %227 2
%229 = OpCompositeInsert %6 %24 %228 3
%230 = OpIAdd %5 %81 %231
%232 = OpIMul %5 %21 %82
%233 = OpIAdd %5 %232 %231
%234 = OpAccessChain %22 %18 %24 %233
OpStore %234 %229
%258 = OpCompositeConstruct %6 %47 %48 %49 %50
%259 = OpLoad %51 %384
%257 = OpFunctionCall %43 %238 %46 %258 %259
%260 = OpCompositeExtract %40 %257 0
%261 = OpCompositeExtract %40 %257 1
%262 = OpConvertFToU %5 %260
%263 = OpConvertFToU %5 %261
%264 = OpCompositeInsert %6 %262 %118 0
%265 = OpCompositeInsert %6 %263 %264 1
%266 = OpCompositeInsert %6 %24 %265 2
%267 = OpCompositeInsert %6 %24 %266 3
%268 = OpIAdd %5 %81 %269
%270 = OpIMul %5 %21 %82
%271 = OpIAdd %5 %270 %269
%272 = OpAccessChain %22 %18 %24 %271
OpStore %272 %267
%296 = OpCompositeConstruct %6 %47 %48 %49 %50
%297 = OpLoad %51 %384
%295 = OpFunctionCall %6 %276 %27 %296 %297
%298 = OpIAdd %5 %81 %299
%300 = OpIMul %5 %21 %82
%301 = OpIAdd %5 %300 %299
%302 = OpAccessChain %22 %18 %24 %301
OpStore %302 %295
%304 = OpConvertFToS %303 %39
%329 = OpCompositeConstruct %6 %47 %48 %49 %50
%330 = OpLoad %51 %384
%328 = OpFunctionCall %303 %309 %304 %329 %330
%331 = OpCompositeExtract %5 %328 0
%332 = OpCompositeExtract %5 %328 1
%333 = OpCompositeExtract %5 %328 2
%334 = OpCompositeInsert %6 %331 %118 0
%335 = OpCompositeInsert %6 %332 %334 1
%336 = OpCompositeInsert %6 %333 %335 2
%337 = OpCompositeInsert %6 %24 %336 3
%338 = OpIAdd %5 %81 %339
%340 = OpIMul %5 %21 %82
%341 = OpIAdd %5 %340 %339
%342 = OpAccessChain %22 %18 %24 %341
OpStore %342 %337
%344 = OpConvertFToS %343 %46
%369 = OpCompositeConstruct %6 %47 %48 %49 %50
%370 = OpLoad %51 %384
%368 = OpFunctionCall %343 %349 %344 %369 %370
%371 = OpCompositeExtract %5 %368 0
%372 = OpCompositeExtract %5 %368 1
%373 = OpCompositeInsert %6 %371 %118 0
%374 = OpCompositeInsert %6 %372 %373 1
%375 = OpCompositeInsert %6 %24 %374 2
%376 = OpCompositeInsert %6 %24 %375 3
%377 = OpIAdd %5 %81 %378
%379 = OpIMul %5 %21 %82
%380 = OpIAdd %5 %379 %378
%381 = OpAccessChain %22 %18 %24 %380
OpStore %381 %376
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
%89 = OpFunction %35 None %85
%86 = OpFunctionParameter %35
%87 = OpFunctionParameter %6
%88 = OpFunctionParameter %51
%90 = OpLabel
%91 = OpUndef %35
OpSelectionMerge %97 None
OpBranchConditional %88 %97 %98
%98 = OpLabel
%99 = OpGroupNonUniformBallot %6 %68 %69
%100 = OpBitwiseAnd %6 %99 %87
OpBranch %92
%92 = OpLabel
OpLoopMerge %94 %93 None
OpBranch %93
%93 = OpLabel
%101 = OpGroupNonUniformBroadcastFirst %6 %68 %100
%102 = OpIEqual %52 %100 %101
%103 = OpAll %51 %102
OpSelectionMerge %96 None
OpBranchConditional %103 %95 %96
%95 = OpLabel
%104 = OpGroupNonUniformFAdd %35 %68 ExclusiveScan %86
OpBranch %96
%96 = OpLabel
%105 = OpPhi %35 %104 %95 %91 %93
OpBranchConditional %103 %94 %92
%94 = OpLabel
OpBranch %97
%97 = OpLabel
%106 = OpPhi %35 %105 %94 %91 %90
OpReturnValue %106
OpFunctionEnd
%131 = OpFunction %43 None %127
%128 = OpFunctionParameter %43
%129 = OpFunctionParameter %6
%130 = OpFunctionParameter %51
%132 = OpLabel
%133 = OpUndef %43
OpSelectionMerge %139 None
OpBranchConditional %130 %139 %140
%140 = OpLabel
%141 = OpGroupNonUniformBallot %6 %68 %69
%142 = OpBitwiseAnd %6 %141 %129
OpBranch %134
%134 = OpLabel
OpLoopMerge %136 %135 None
OpBranch %135
%135 = OpLabel
%143 = OpGroupNonUniformBroadcastFirst %6 %68 %142
%144 = OpIEqual %52 %142 %143
%145 = OpAll %51 %144
OpSelectionMerge %138 None
OpBranchConditional %145 %137 %138
%137 = OpLabel
%146 = OpGroupNonUniformFAdd %43 %68 ExclusiveScan %128
OpBranch %138
%138 = OpLabel
%147 = OpPhi %43 %146 %137 %133 %135
OpBranchConditional %145 %136 %134
%136 = OpLabel
OpBranch %139
%139 = OpLabel
%148 = OpPhi %43 %147 %136 %133 %132
OpReturnValue %148
OpFunctionEnd
%169 = OpFunction %6 None %53
%166 = OpFunctionParameter %6
%167 = OpFunctionParameter %6
%168 = OpFunctionParameter %51
%170 = OpLabel
%171 = OpUndef %6
OpSelectionMerge %177 None
OpBranchConditional %168 %177 %178
%178 = OpLabel
%179 = OpGroupNonUniformBallot %6 %68 %69
%180 = OpBitwiseAnd %6 %179 %167
OpBranch %172
%172 = OpLabel
OpLoopMerge %174 %173 None
OpBranch %173
%173 = OpLabel
%181 = OpGroupNonUniformBroadcastFirst %6 %68 %180
%182 = OpIEqual %52 %180 %181
%183 = OpAll %51 %182
OpSelectionMerge %176 None
OpBranchConditional %183 %175 %176
%175 = OpLabel
%184 = OpGroupNonUniformIMul %6 %68 ExclusiveScan %166
OpBranch %176
%176 = OpLabel
%185 = OpPhi %6 %184 %175 %171 %173
OpBranchConditional %183 %174 %172
%174 = OpLabel
OpBranch %177
%177 = OpLabel
%186 = OpPhi %6 %185 %174 %171 %170
OpReturnValue %186
OpFunctionEnd
%198 = OpFunction %35 None %85
%195 = OpFunctionParameter %35
%196 = OpFunctionParameter %6
%197 = OpFunctionParameter %51
%199 = OpLabel
%200 = OpUndef %35
OpSelectionMerge %206 None
OpBranchConditional %197 %206 %207
%207 = OpLabel
%208 = OpGroupNonUniformBallot %6 %68 %69
%209 = OpBitwiseAnd %6 %208 %196
OpBranch %201
%201 = OpLabel
OpLoopMerge %203 %202 None
OpBranch %202
%202 = OpLabel
%210 = OpGroupNonUniformBroadcastFirst %6 %68 %209
%211 = OpIEqual %52 %209 %210
%212 = OpAll %51 %211
OpSelectionMerge %205 None
OpBranchConditional %212 %204 %205
%204 = OpLabel
%213 = OpGroupNonUniformFMul %35 %68 ExclusiveScan %195
OpBranch %205
%205 = OpLabel
%214 = OpPhi %35 %213 %204 %200 %202
OpBranchConditional %212 %203 %201
%203 = OpLabel
OpBranch %206
%206 = OpLabel
%215 = OpPhi %35 %214 %203 %200 %199
OpReturnValue %215
OpFunctionEnd
%238 = OpFunction %43 None %127
%235 = OpFunctionParameter %43
%236 = OpFunctionParameter %6
%237 = OpFunctionParameter %51
%239 = OpLabel
%240 = OpUndef %43
OpSelectionMerge %246 None
OpBranchConditional %237 %246 %247
%247 = OpLabel
%248 = OpGroupNonUniformBallot %6 %68 %69
%249 = OpBitwiseAnd %6 %248 %236
OpBranch %241
%241 = OpLabel
OpLoopMerge %243 %242 None
OpBranch %242
%242 = OpLabel
%250 = OpGroupNonUniformBroadcastFirst %6 %68 %249
%251 = OpIEqual %52 %249 %250
%252 = OpAll %51 %251
OpSelectionMerge %245 None
OpBranchConditional %252 %244 %245
%244 = OpLabel
%253 = OpGroupNonUniformFMul %43 %68 ExclusiveScan %235
OpBranch %245
%245 = OpLabel
%254 = OpPhi %43 %253 %244 %240 %242
OpBranchConditional %252 %243 %241
%243 = OpLabel
OpBranch %246
%246 = OpLabel
%255 = OpPhi %43 %254 %243 %240 %239
OpReturnValue %255
OpFunctionEnd
%276 = OpFunction %6 None %53
%273 = OpFunctionParameter %6
%274 = OpFunctionParameter %6
%275 = OpFunctionParameter %51
%277 = OpLabel
%278 = OpUndef %6
OpSelectionMerge %284 None
OpBranchConditional %275 %284 %285
%285 = OpLabel
%286 = OpGroupNonUniformBallot %6 %68 %69
%287 = OpBitwiseAnd %6 %286 %274
OpBranch %279
%279 = OpLabel
OpLoopMerge %281 %280 None
OpBranch %280
%280 = OpLabel
%288 = OpGroupNonUniformBroadcastFirst %6 %68 %287
%289 = OpIEqual %52 %287 %288
%290 = OpAll %51 %289
OpSelectionMerge %283 None
OpBranchConditional %290 %282 %283
%282 = OpLabel
%291 = OpGroupNonUniformBitwiseOr %6 %68 ExclusiveScan %273
OpBranch %283
%283 = OpLabel
%292 = OpPhi %6 %291 %282 %278 %280
OpBranchConditional %290 %281 %279
%281 = OpLabel
OpBranch %284
%284 = OpLabel
%293 = OpPhi %6 %292 %281 %278 %277
OpReturnValue %293
OpFunctionEnd
%309 = OpFunction %303 None %305
%306 = OpFunctionParameter %303
%307 = OpFunctionParameter %6
%308 = OpFunctionParameter %51
%310 = OpLabel
%311 = OpUndef %303
OpSelectionMerge %317 None
OpBranchConditional %308 %317 %318
%318 = OpLabel
%319 = OpGroupNonUniformBallot %6 %68 %69
%320 = OpBitwiseAnd %6 %319 %307
OpBranch %312
%312 = OpLabel
OpLoopMerge %314 %313 None
OpBranch %313
%313 = OpLabel
%321 = OpGroupNonUniformBroadcastFirst %6 %68 %320
%322 = OpIEqual %52 %320 %321
%323 = OpAll %51 %322
OpSelectionMerge %316 None
OpBranchConditional %323 %315 %316
%315 = OpLabel
%324 = OpGroupNonUniformBitwiseAnd %303 %68 ExclusiveScan %306
OpBranch %316
%316 = OpLabel
%325 = OpPhi %303 %324 %315 %311 %313
OpBranchConditional %323 %314 %312
%314 = OpLabel
OpBranch %317
%317 = OpLabel
%326 = OpPhi %303 %325 %314 %311 %310
OpReturnValue %326
OpFunctionEnd
%349 = OpFunction %343 None %345
%346 = OpFunctionParameter %343
%347 = OpFunctionParameter %6
%348 = OpFunctionParameter %51
%350 = OpLabel
%351 = OpUndef %343
OpSelectionMerge %357 None
OpBranchConditional %348 %357 %358
%358 = OpLabel
%359 = OpGroupNonUniformBallot %6 %68 %69
%360 = OpBitwiseAnd %6 %359 %347
OpBranch %352
%352 = OpLabel
OpLoopMerge %354 %353 None
OpBranch %353
%353 = OpLabel
%361 = OpGroupNonUniformBroadcastFirst %6 %68 %360
%362 = OpIEqual %52 %360 %361
%363 = OpAll %51 %362
OpSelectionMerge %356 None
OpBranchConditional %363 %355 %356
%355 = OpLabel
%364 = OpGroupNonUniformBitwiseXor %343 %68 ExclusiveScan %346
OpBranch %356
%356 = OpLabel
%365 = OpPhi %343 %364 %355 %351 %353
OpBranchConditional %363 %354 %352
%354 = OpLabel
OpBranch %357
%357 = OpLabel
%366 = OpPhi %343 %365 %354 %351 %350
OpReturnValue %366
OpFunctionEnd
#endif
