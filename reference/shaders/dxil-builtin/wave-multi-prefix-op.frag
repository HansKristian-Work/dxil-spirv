#version 460
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_KHR_shader_subgroup_arithmetic : require

uint _51;
float _103;
uint _152;
float _201;
uint _250;
uint _300;
uint _351;

layout(set = 0, binding = 0) uniform usamplerBuffer _8;
layout(set = 0, binding = 1) uniform usamplerBuffer _9;
layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _12;

layout(location = 0) flat in uint THR;

uint WaveMultiPrefixSum(uint _46, uvec4 _47, bool _48)
{
    uint _67;
    if (_48)
    {
        _67 = _51;
    }
    else
    {
        uvec4 _59 = subgroupBallot(true);
        uvec4 _61 = _59 & _47;
        bool _64;
        uint _66;
        for (;;)
        {
            _64 = all(equal(_61, subgroupBroadcastFirst(_61)));
            if (_64)
            {
                _66 = subgroupExclusiveAdd(_46);
            }
            else
            {
                _66 = _51;
            }
            if (_64)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _67 = _66;
    }
    return _67;
}

float WaveMultiPrefixSum(float _98, uvec4 _99, bool _100)
{
    float _118;
    if (_100)
    {
        _118 = _103;
    }
    else
    {
        uvec4 _111 = subgroupBallot(true);
        uvec4 _112 = _111 & _99;
        bool _115;
        float _117;
        for (;;)
        {
            _115 = all(equal(_112, subgroupBroadcastFirst(_112)));
            if (_115)
            {
                _117 = subgroupExclusiveAdd(_98);
            }
            else
            {
                _117 = _103;
            }
            if (_115)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _118 = _117;
    }
    return _118;
}

uint WaveMultiPrefixProduct(uint _147, uvec4 _148, bool _149)
{
    uint _167;
    if (_149)
    {
        _167 = _152;
    }
    else
    {
        uvec4 _160 = subgroupBallot(true);
        uvec4 _161 = _160 & _148;
        bool _164;
        uint _166;
        for (;;)
        {
            _164 = all(equal(_161, subgroupBroadcastFirst(_161)));
            if (_164)
            {
                _166 = subgroupExclusiveMul(_147);
            }
            else
            {
                _166 = _152;
            }
            if (_164)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _167 = _166;
    }
    return _167;
}

float WaveMultiPrefixProduct(float _196, uvec4 _197, bool _198)
{
    float _216;
    if (_198)
    {
        _216 = _201;
    }
    else
    {
        uvec4 _209 = subgroupBallot(true);
        uvec4 _210 = _209 & _197;
        bool _213;
        float _215;
        for (;;)
        {
            _213 = all(equal(_210, subgroupBroadcastFirst(_210)));
            if (_213)
            {
                _215 = subgroupExclusiveMul(_196);
            }
            else
            {
                _215 = _201;
            }
            if (_213)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _216 = _215;
    }
    return _216;
}

uint WaveMultiPrefixBitOr(uint _245, uvec4 _246, bool _247)
{
    uint _265;
    if (_247)
    {
        _265 = _250;
    }
    else
    {
        uvec4 _258 = subgroupBallot(true);
        uvec4 _259 = _258 & _246;
        bool _262;
        uint _264;
        for (;;)
        {
            _262 = all(equal(_259, subgroupBroadcastFirst(_259)));
            if (_262)
            {
                _264 = subgroupExclusiveOr(_245);
            }
            else
            {
                _264 = _250;
            }
            if (_262)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _265 = _264;
    }
    return _265;
}

uint WaveMultiPrefixBitAnd(uint _295, uvec4 _296, bool _297)
{
    uint _315;
    if (_297)
    {
        _315 = _300;
    }
    else
    {
        uvec4 _308 = subgroupBallot(true);
        uvec4 _309 = _308 & _296;
        bool _312;
        uint _314;
        for (;;)
        {
            _312 = all(equal(_309, subgroupBroadcastFirst(_309)));
            if (_312)
            {
                _314 = subgroupExclusiveAnd(_295);
            }
            else
            {
                _314 = _300;
            }
            if (_312)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _315 = _314;
    }
    return _315;
}

uint WaveMultiPrefixBitXor(uint _346, uvec4 _347, bool _348)
{
    uint _366;
    if (_348)
    {
        _366 = _351;
    }
    else
    {
        uvec4 _359 = subgroupBallot(true);
        uvec4 _360 = _359 & _347;
        bool _363;
        uint _365;
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
    uint _19 = THR * 4u;
    uint _72 = THR * 7u;
    imageStore(_12, int(THR * 7u), uvec4(WaveMultiPrefixSum(texelFetch(_8, int(THR)).x, uvec4(uvec4(texelFetch(_9, int(_19)).x, texelFetch(_9, int(_19 + 1u)).x, texelFetch(_9, int(_19 + 2u)).x, texelFetch(_9, int(_19 + 3u)).x)), gl_HelperInvocation)));
    uint _76 = THR * 4u;
    imageStore(_12, int((THR * 7u) + 1u), uvec4(uint(WaveMultiPrefixSum(uintBitsToFloat(texelFetch(_8, int(THR)).x), uvec4(uvec4(texelFetch(_9, int(_76)).x, texelFetch(_9, int(_76 + 1u)).x, texelFetch(_9, int(_76 + 2u)).x, texelFetch(_9, int(_76 + 3u)).x)), gl_HelperInvocation))));
    uint _128 = THR * 4u;
    imageStore(_12, int((THR * 7u) + 2u), uvec4(WaveMultiPrefixProduct(texelFetch(_8, int(THR)).x, uvec4(uvec4(texelFetch(_9, int(_128)).x, texelFetch(_9, int(_128 + 1u)).x, texelFetch(_9, int(_128 + 2u)).x, texelFetch(_9, int(_128 + 3u)).x)), gl_HelperInvocation)));
    uint _176 = THR * 4u;
    imageStore(_12, int((THR * 7u) + 3u), uvec4(uint(WaveMultiPrefixProduct(uintBitsToFloat(texelFetch(_8, int(THR)).x), uvec4(uvec4(texelFetch(_9, int(_176)).x, texelFetch(_9, int(_176 + 1u)).x, texelFetch(_9, int(_176 + 2u)).x, texelFetch(_9, int(_176 + 3u)).x)), gl_HelperInvocation))));
    uint _226 = THR * 4u;
    imageStore(_12, int((THR * 7u) + 4u), uvec4(WaveMultiPrefixBitOr(texelFetch(_8, int(THR)).x, uvec4(uvec4(texelFetch(_9, int(_226)).x, texelFetch(_9, int(_226 + 1u)).x, texelFetch(_9, int(_226 + 2u)).x, texelFetch(_9, int(_226 + 3u)).x)), gl_HelperInvocation)));
    uint _274 = THR * 4u;
    imageStore(_12, int((THR * 7u) + 5u), uvec4(WaveMultiPrefixBitAnd(uint(int(uintBitsToFloat(texelFetch(_8, int(THR)).x))), uvec4(uvec4(texelFetch(_9, int(_274)).x, texelFetch(_9, int(_274 + 1u)).x, texelFetch(_9, int(_274 + 2u)).x, texelFetch(_9, int(_274 + 3u)).x)), gl_HelperInvocation)));
    uint _325 = THR * 4u;
    imageStore(_12, int((THR * 7u) + 6u), uvec4(WaveMultiPrefixBitXor(uint(int(uintBitsToFloat(texelFetch(_8, int(THR)).x))), uvec4(uvec4(texelFetch(_9, int(_325)).x, texelFetch(_9, int(_325 + 1u)).x, texelFetch(_9, int(_325 + 2u)).x, texelFetch(_9, int(_325 + 3u)).x)), gl_HelperInvocation)));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 380
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability GroupNonUniformArithmetic
OpCapability GroupNonUniformBallot
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14 %378
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "THR"
OpName %49 "WaveMultiPrefixSum"
OpName %101 "WaveMultiPrefixSum"
OpName %150 "WaveMultiPrefixProduct"
OpName %199 "WaveMultiPrefixProduct"
OpName %248 "WaveMultiPrefixBitOr"
OpName %298 "WaveMultiPrefixBitAnd"
OpName %349 "WaveMultiPrefixBitXor"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 1
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %12 NonReadable
OpDecorate %14 Flat
OpDecorate %14 Location 0
OpDecorate %378 BuiltIn HelperInvocation
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
%20 = OpConstant %5 4
%21 = OpTypeVector %5 4
%26 = OpConstant %5 1
%30 = OpConstant %5 2
%34 = OpConstant %5 3
%43 = OpTypeBool
%44 = OpTypeVector %43 4
%45 = OpTypeFunction %5 %5 %21 %43
%60 = OpConstantTrue %43
%73 = OpConstant %5 7
%95 = OpTypeFloat 32
%97 = OpTypeFunction %95 %95 %21 %43
%321 = OpConstant %5 5
%372 = OpConstant %5 6
%377 = OpTypePointer Input %43
%378 = OpVariable %377 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %376
%376 = OpLabel
%15 = OpLoad %10 %12
%16 = OpLoad %6 %9
%17 = OpLoad %6 %8
%18 = OpLoad %5 %14
%19 = OpIMul %5 %18 %20
%22 = OpImageFetch %21 %16 %19
%23 = OpCompositeExtract %5 %22 0
%25 = OpIAdd %5 %19 %26
%24 = OpImageFetch %21 %16 %25
%27 = OpCompositeExtract %5 %24 0
%29 = OpIAdd %5 %19 %30
%28 = OpImageFetch %21 %16 %29
%31 = OpCompositeExtract %5 %28 0
%33 = OpIAdd %5 %19 %34
%32 = OpImageFetch %21 %16 %33
%35 = OpCompositeExtract %5 %32 0
%36 = OpCompositeConstruct %21 %23 %27 %31 %35
%37 = OpCompositeExtract %5 %36 0
%38 = OpCompositeExtract %5 %36 1
%39 = OpCompositeExtract %5 %36 2
%40 = OpCompositeExtract %5 %36 3
%41 = OpImageFetch %21 %17 %18
%42 = OpCompositeExtract %5 %41 0
%70 = OpCompositeConstruct %21 %37 %38 %39 %40
%71 = OpLoad %43 %378
%69 = OpFunctionCall %5 %49 %42 %70 %71
%72 = OpIMul %5 %18 %73
%74 = OpIMul %5 %18 %73
%75 = OpCompositeConstruct %21 %69 %69 %69 %69
OpImageWrite %15 %74 %75
%76 = OpIMul %5 %18 %20
%77 = OpImageFetch %21 %16 %76
%78 = OpCompositeExtract %5 %77 0
%80 = OpIAdd %5 %76 %26
%79 = OpImageFetch %21 %16 %80
%81 = OpCompositeExtract %5 %79 0
%83 = OpIAdd %5 %76 %30
%82 = OpImageFetch %21 %16 %83
%84 = OpCompositeExtract %5 %82 0
%86 = OpIAdd %5 %76 %34
%85 = OpImageFetch %21 %16 %86
%87 = OpCompositeExtract %5 %85 0
%88 = OpCompositeConstruct %21 %78 %81 %84 %87
%89 = OpCompositeExtract %5 %88 0
%90 = OpCompositeExtract %5 %88 1
%91 = OpCompositeExtract %5 %88 2
%92 = OpCompositeExtract %5 %88 3
%93 = OpImageFetch %21 %17 %18
%94 = OpCompositeExtract %5 %93 0
%96 = OpBitcast %95 %94
%121 = OpCompositeConstruct %21 %89 %90 %91 %92
%122 = OpLoad %43 %378
%120 = OpFunctionCall %95 %101 %96 %121 %122
%123 = OpConvertFToU %5 %120
%124 = OpIAdd %5 %72 %26
%125 = OpIMul %5 %18 %73
%126 = OpIAdd %5 %125 %26
%127 = OpCompositeConstruct %21 %123 %123 %123 %123
OpImageWrite %15 %126 %127
%128 = OpIMul %5 %18 %20
%129 = OpImageFetch %21 %16 %128
%130 = OpCompositeExtract %5 %129 0
%132 = OpIAdd %5 %128 %26
%131 = OpImageFetch %21 %16 %132
%133 = OpCompositeExtract %5 %131 0
%135 = OpIAdd %5 %128 %30
%134 = OpImageFetch %21 %16 %135
%136 = OpCompositeExtract %5 %134 0
%138 = OpIAdd %5 %128 %34
%137 = OpImageFetch %21 %16 %138
%139 = OpCompositeExtract %5 %137 0
%140 = OpCompositeConstruct %21 %130 %133 %136 %139
%141 = OpCompositeExtract %5 %140 0
%142 = OpCompositeExtract %5 %140 1
%143 = OpCompositeExtract %5 %140 2
%144 = OpCompositeExtract %5 %140 3
%145 = OpImageFetch %21 %17 %18
%146 = OpCompositeExtract %5 %145 0
%170 = OpCompositeConstruct %21 %141 %142 %143 %144
%171 = OpLoad %43 %378
%169 = OpFunctionCall %5 %150 %146 %170 %171
%172 = OpIAdd %5 %72 %30
%173 = OpIMul %5 %18 %73
%174 = OpIAdd %5 %173 %30
%175 = OpCompositeConstruct %21 %169 %169 %169 %169
OpImageWrite %15 %174 %175
%176 = OpIMul %5 %18 %20
%177 = OpImageFetch %21 %16 %176
%178 = OpCompositeExtract %5 %177 0
%180 = OpIAdd %5 %176 %26
%179 = OpImageFetch %21 %16 %180
%181 = OpCompositeExtract %5 %179 0
%183 = OpIAdd %5 %176 %30
%182 = OpImageFetch %21 %16 %183
%184 = OpCompositeExtract %5 %182 0
%186 = OpIAdd %5 %176 %34
%185 = OpImageFetch %21 %16 %186
%187 = OpCompositeExtract %5 %185 0
%188 = OpCompositeConstruct %21 %178 %181 %184 %187
%189 = OpCompositeExtract %5 %188 0
%190 = OpCompositeExtract %5 %188 1
%191 = OpCompositeExtract %5 %188 2
%192 = OpCompositeExtract %5 %188 3
%193 = OpImageFetch %21 %17 %18
%194 = OpCompositeExtract %5 %193 0
%195 = OpBitcast %95 %194
%219 = OpCompositeConstruct %21 %189 %190 %191 %192
%220 = OpLoad %43 %378
%218 = OpFunctionCall %95 %199 %195 %219 %220
%221 = OpConvertFToU %5 %218
%222 = OpIAdd %5 %72 %34
%223 = OpIMul %5 %18 %73
%224 = OpIAdd %5 %223 %34
%225 = OpCompositeConstruct %21 %221 %221 %221 %221
OpImageWrite %15 %224 %225
%226 = OpIMul %5 %18 %20
%227 = OpImageFetch %21 %16 %226
%228 = OpCompositeExtract %5 %227 0
%230 = OpIAdd %5 %226 %26
%229 = OpImageFetch %21 %16 %230
%231 = OpCompositeExtract %5 %229 0
%233 = OpIAdd %5 %226 %30
%232 = OpImageFetch %21 %16 %233
%234 = OpCompositeExtract %5 %232 0
%236 = OpIAdd %5 %226 %34
%235 = OpImageFetch %21 %16 %236
%237 = OpCompositeExtract %5 %235 0
%238 = OpCompositeConstruct %21 %228 %231 %234 %237
%239 = OpCompositeExtract %5 %238 0
%240 = OpCompositeExtract %5 %238 1
%241 = OpCompositeExtract %5 %238 2
%242 = OpCompositeExtract %5 %238 3
%243 = OpImageFetch %21 %17 %18
%244 = OpCompositeExtract %5 %243 0
%268 = OpCompositeConstruct %21 %239 %240 %241 %242
%269 = OpLoad %43 %378
%267 = OpFunctionCall %5 %248 %244 %268 %269
%270 = OpIAdd %5 %72 %20
%271 = OpIMul %5 %18 %73
%272 = OpIAdd %5 %271 %20
%273 = OpCompositeConstruct %21 %267 %267 %267 %267
OpImageWrite %15 %272 %273
%274 = OpIMul %5 %18 %20
%275 = OpImageFetch %21 %16 %274
%276 = OpCompositeExtract %5 %275 0
%278 = OpIAdd %5 %274 %26
%277 = OpImageFetch %21 %16 %278
%279 = OpCompositeExtract %5 %277 0
%281 = OpIAdd %5 %274 %30
%280 = OpImageFetch %21 %16 %281
%282 = OpCompositeExtract %5 %280 0
%284 = OpIAdd %5 %274 %34
%283 = OpImageFetch %21 %16 %284
%285 = OpCompositeExtract %5 %283 0
%286 = OpCompositeConstruct %21 %276 %279 %282 %285
%287 = OpCompositeExtract %5 %286 0
%288 = OpCompositeExtract %5 %286 1
%289 = OpCompositeExtract %5 %286 2
%290 = OpCompositeExtract %5 %286 3
%291 = OpImageFetch %21 %17 %18
%292 = OpCompositeExtract %5 %291 0
%293 = OpBitcast %95 %292
%294 = OpConvertFToS %5 %293
%318 = OpCompositeConstruct %21 %287 %288 %289 %290
%319 = OpLoad %43 %378
%317 = OpFunctionCall %5 %298 %294 %318 %319
%320 = OpIAdd %5 %72 %321
%322 = OpIMul %5 %18 %73
%323 = OpIAdd %5 %322 %321
%324 = OpCompositeConstruct %21 %317 %317 %317 %317
OpImageWrite %15 %323 %324
%325 = OpIMul %5 %18 %20
%326 = OpImageFetch %21 %16 %325
%327 = OpCompositeExtract %5 %326 0
%329 = OpIAdd %5 %325 %26
%328 = OpImageFetch %21 %16 %329
%330 = OpCompositeExtract %5 %328 0
%332 = OpIAdd %5 %325 %30
%331 = OpImageFetch %21 %16 %332
%333 = OpCompositeExtract %5 %331 0
%335 = OpIAdd %5 %325 %34
%334 = OpImageFetch %21 %16 %335
%336 = OpCompositeExtract %5 %334 0
%337 = OpCompositeConstruct %21 %327 %330 %333 %336
%338 = OpCompositeExtract %5 %337 0
%339 = OpCompositeExtract %5 %337 1
%340 = OpCompositeExtract %5 %337 2
%341 = OpCompositeExtract %5 %337 3
%342 = OpImageFetch %21 %17 %18
%343 = OpCompositeExtract %5 %342 0
%344 = OpBitcast %95 %343
%345 = OpConvertFToS %5 %344
%369 = OpCompositeConstruct %21 %338 %339 %340 %341
%370 = OpLoad %43 %378
%368 = OpFunctionCall %5 %349 %345 %369 %370
%371 = OpIAdd %5 %72 %372
%373 = OpIMul %5 %18 %73
%374 = OpIAdd %5 %373 %372
%375 = OpCompositeConstruct %21 %368 %368 %368 %368
OpImageWrite %15 %374 %375
OpReturn
OpFunctionEnd
%49 = OpFunction %5 None %45
%46 = OpFunctionParameter %5
%47 = OpFunctionParameter %21
%48 = OpFunctionParameter %43
%50 = OpLabel
%51 = OpUndef %5
OpSelectionMerge %57 None
OpBranchConditional %48 %57 %58
%58 = OpLabel
%59 = OpGroupNonUniformBallot %21 %34 %60
%61 = OpBitwiseAnd %21 %59 %47
OpBranch %52
%52 = OpLabel
OpLoopMerge %54 %53 None
OpBranch %53
%53 = OpLabel
%62 = OpGroupNonUniformBroadcastFirst %21 %34 %61
%63 = OpIEqual %44 %61 %62
%64 = OpAll %43 %63
OpSelectionMerge %56 None
OpBranchConditional %64 %55 %56
%55 = OpLabel
%65 = OpGroupNonUniformIAdd %5 %34 ExclusiveScan %46
OpBranch %56
%56 = OpLabel
%66 = OpPhi %5 %65 %55 %51 %53
OpBranchConditional %64 %54 %52
%54 = OpLabel
OpBranch %57
%57 = OpLabel
%67 = OpPhi %5 %66 %54 %51 %50
OpReturnValue %67
OpFunctionEnd
%101 = OpFunction %95 None %97
%98 = OpFunctionParameter %95
%99 = OpFunctionParameter %21
%100 = OpFunctionParameter %43
%102 = OpLabel
%103 = OpUndef %95
OpSelectionMerge %109 None
OpBranchConditional %100 %109 %110
%110 = OpLabel
%111 = OpGroupNonUniformBallot %21 %34 %60
%112 = OpBitwiseAnd %21 %111 %99
OpBranch %104
%104 = OpLabel
OpLoopMerge %106 %105 None
OpBranch %105
%105 = OpLabel
%113 = OpGroupNonUniformBroadcastFirst %21 %34 %112
%114 = OpIEqual %44 %112 %113
%115 = OpAll %43 %114
OpSelectionMerge %108 None
OpBranchConditional %115 %107 %108
%107 = OpLabel
%116 = OpGroupNonUniformFAdd %95 %34 ExclusiveScan %98
OpBranch %108
%108 = OpLabel
%117 = OpPhi %95 %116 %107 %103 %105
OpBranchConditional %115 %106 %104
%106 = OpLabel
OpBranch %109
%109 = OpLabel
%118 = OpPhi %95 %117 %106 %103 %102
OpReturnValue %118
OpFunctionEnd
%150 = OpFunction %5 None %45
%147 = OpFunctionParameter %5
%148 = OpFunctionParameter %21
%149 = OpFunctionParameter %43
%151 = OpLabel
%152 = OpUndef %5
OpSelectionMerge %158 None
OpBranchConditional %149 %158 %159
%159 = OpLabel
%160 = OpGroupNonUniformBallot %21 %34 %60
%161 = OpBitwiseAnd %21 %160 %148
OpBranch %153
%153 = OpLabel
OpLoopMerge %155 %154 None
OpBranch %154
%154 = OpLabel
%162 = OpGroupNonUniformBroadcastFirst %21 %34 %161
%163 = OpIEqual %44 %161 %162
%164 = OpAll %43 %163
OpSelectionMerge %157 None
OpBranchConditional %164 %156 %157
%156 = OpLabel
%165 = OpGroupNonUniformIMul %5 %34 ExclusiveScan %147
OpBranch %157
%157 = OpLabel
%166 = OpPhi %5 %165 %156 %152 %154
OpBranchConditional %164 %155 %153
%155 = OpLabel
OpBranch %158
%158 = OpLabel
%167 = OpPhi %5 %166 %155 %152 %151
OpReturnValue %167
OpFunctionEnd
%199 = OpFunction %95 None %97
%196 = OpFunctionParameter %95
%197 = OpFunctionParameter %21
%198 = OpFunctionParameter %43
%200 = OpLabel
%201 = OpUndef %95
OpSelectionMerge %207 None
OpBranchConditional %198 %207 %208
%208 = OpLabel
%209 = OpGroupNonUniformBallot %21 %34 %60
%210 = OpBitwiseAnd %21 %209 %197
OpBranch %202
%202 = OpLabel
OpLoopMerge %204 %203 None
OpBranch %203
%203 = OpLabel
%211 = OpGroupNonUniformBroadcastFirst %21 %34 %210
%212 = OpIEqual %44 %210 %211
%213 = OpAll %43 %212
OpSelectionMerge %206 None
OpBranchConditional %213 %205 %206
%205 = OpLabel
%214 = OpGroupNonUniformFMul %95 %34 ExclusiveScan %196
OpBranch %206
%206 = OpLabel
%215 = OpPhi %95 %214 %205 %201 %203
OpBranchConditional %213 %204 %202
%204 = OpLabel
OpBranch %207
%207 = OpLabel
%216 = OpPhi %95 %215 %204 %201 %200
OpReturnValue %216
OpFunctionEnd
%248 = OpFunction %5 None %45
%245 = OpFunctionParameter %5
%246 = OpFunctionParameter %21
%247 = OpFunctionParameter %43
%249 = OpLabel
%250 = OpUndef %5
OpSelectionMerge %256 None
OpBranchConditional %247 %256 %257
%257 = OpLabel
%258 = OpGroupNonUniformBallot %21 %34 %60
%259 = OpBitwiseAnd %21 %258 %246
OpBranch %251
%251 = OpLabel
OpLoopMerge %253 %252 None
OpBranch %252
%252 = OpLabel
%260 = OpGroupNonUniformBroadcastFirst %21 %34 %259
%261 = OpIEqual %44 %259 %260
%262 = OpAll %43 %261
OpSelectionMerge %255 None
OpBranchConditional %262 %254 %255
%254 = OpLabel
%263 = OpGroupNonUniformBitwiseOr %5 %34 ExclusiveScan %245
OpBranch %255
%255 = OpLabel
%264 = OpPhi %5 %263 %254 %250 %252
OpBranchConditional %262 %253 %251
%253 = OpLabel
OpBranch %256
%256 = OpLabel
%265 = OpPhi %5 %264 %253 %250 %249
OpReturnValue %265
OpFunctionEnd
%298 = OpFunction %5 None %45
%295 = OpFunctionParameter %5
%296 = OpFunctionParameter %21
%297 = OpFunctionParameter %43
%299 = OpLabel
%300 = OpUndef %5
OpSelectionMerge %306 None
OpBranchConditional %297 %306 %307
%307 = OpLabel
%308 = OpGroupNonUniformBallot %21 %34 %60
%309 = OpBitwiseAnd %21 %308 %296
OpBranch %301
%301 = OpLabel
OpLoopMerge %303 %302 None
OpBranch %302
%302 = OpLabel
%310 = OpGroupNonUniformBroadcastFirst %21 %34 %309
%311 = OpIEqual %44 %309 %310
%312 = OpAll %43 %311
OpSelectionMerge %305 None
OpBranchConditional %312 %304 %305
%304 = OpLabel
%313 = OpGroupNonUniformBitwiseAnd %5 %34 ExclusiveScan %295
OpBranch %305
%305 = OpLabel
%314 = OpPhi %5 %313 %304 %300 %302
OpBranchConditional %312 %303 %301
%303 = OpLabel
OpBranch %306
%306 = OpLabel
%315 = OpPhi %5 %314 %303 %300 %299
OpReturnValue %315
OpFunctionEnd
%349 = OpFunction %5 None %45
%346 = OpFunctionParameter %5
%347 = OpFunctionParameter %21
%348 = OpFunctionParameter %43
%350 = OpLabel
%351 = OpUndef %5
OpSelectionMerge %357 None
OpBranchConditional %348 %357 %358
%358 = OpLabel
%359 = OpGroupNonUniformBallot %21 %34 %60
%360 = OpBitwiseAnd %21 %359 %347
OpBranch %352
%352 = OpLabel
OpLoopMerge %354 %353 None
OpBranch %353
%353 = OpLabel
%361 = OpGroupNonUniformBroadcastFirst %21 %34 %360
%362 = OpIEqual %44 %360 %361
%363 = OpAll %43 %362
OpSelectionMerge %356 None
OpBranchConditional %363 %355 %356
%355 = OpLabel
%364 = OpGroupNonUniformBitwiseXor %5 %34 ExclusiveScan %346
OpBranch %356
%356 = OpLabel
%365 = OpPhi %5 %364 %355 %351 %353
OpBranchConditional %363 %354 %352
%354 = OpLabel
OpBranch %357
%357 = OpLabel
%366 = OpPhi %5 %365 %354 %351 %350
OpReturnValue %366
OpFunctionEnd
#endif
