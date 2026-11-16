#version 460
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_KHR_shader_subgroup_arithmetic : require
#extension GL_EXT_samplerless_texture_functions : require
#extension GL_EXT_demote_to_helper_invocation : require

uint _51;
float _102;

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

float WaveMultiPrefixSum(float _97, uvec4 _98, bool _99)
{
    float _117;
    if (_99)
    {
        _117 = _102;
    }
    else
    {
        uvec4 _110 = subgroupBallot(true);
        uvec4 _111 = _110 & _98;
        bool _114;
        float _116;
        for (;;)
        {
            _114 = all(equal(_111, subgroupBroadcastFirst(_111)));
            if (_114)
            {
                _116 = subgroupExclusiveAdd(_97);
            }
            else
            {
                _116 = _102;
            }
            if (_114)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _117 = _116;
    }
    return _117;
}

uint WaveMultiPrefixProduct(uint _145, uvec4 _146, bool _147)
{
    uint _164;
    if (_147)
    {
        _164 = _51;
    }
    else
    {
        uvec4 _157 = subgroupBallot(true);
        uvec4 _158 = _157 & _146;
        bool _161;
        uint _163;
        for (;;)
        {
            _161 = all(equal(_158, subgroupBroadcastFirst(_158)));
            if (_161)
            {
                _163 = subgroupExclusiveMul(_145);
            }
            else
            {
                _163 = _51;
            }
            if (_161)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _164 = _163;
    }
    return _164;
}

float WaveMultiPrefixProduct(float _192, uvec4 _193, bool _194)
{
    float _211;
    if (_194)
    {
        _211 = _102;
    }
    else
    {
        uvec4 _204 = subgroupBallot(true);
        uvec4 _205 = _204 & _193;
        bool _208;
        float _210;
        for (;;)
        {
            _208 = all(equal(_205, subgroupBroadcastFirst(_205)));
            if (_208)
            {
                _210 = subgroupExclusiveMul(_192);
            }
            else
            {
                _210 = _102;
            }
            if (_208)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _211 = _210;
    }
    return _211;
}

uint WaveMultiPrefixBitOr(uint _239, uvec4 _240, bool _241)
{
    uint _258;
    if (_241)
    {
        _258 = _51;
    }
    else
    {
        uvec4 _251 = subgroupBallot(true);
        uvec4 _252 = _251 & _240;
        bool _255;
        uint _257;
        for (;;)
        {
            _255 = all(equal(_252, subgroupBroadcastFirst(_252)));
            if (_255)
            {
                _257 = subgroupExclusiveOr(_239);
            }
            else
            {
                _257 = _51;
            }
            if (_255)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _258 = _257;
    }
    return _258;
}

uint WaveMultiPrefixBitAnd(uint _287, uvec4 _288, bool _289)
{
    uint _306;
    if (_289)
    {
        _306 = _51;
    }
    else
    {
        uvec4 _299 = subgroupBallot(true);
        uvec4 _300 = _299 & _288;
        bool _303;
        uint _305;
        for (;;)
        {
            _303 = all(equal(_300, subgroupBroadcastFirst(_300)));
            if (_303)
            {
                _305 = subgroupExclusiveAnd(_287);
            }
            else
            {
                _305 = _51;
            }
            if (_303)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _306 = _305;
    }
    return _306;
}

uint WaveMultiPrefixBitXor(uint _336, uvec4 _337, bool _338)
{
    uint _355;
    if (_338)
    {
        _355 = _51;
    }
    else
    {
        uvec4 _348 = subgroupBallot(true);
        uvec4 _349 = _348 & _337;
        bool _352;
        uint _354;
        for (;;)
        {
            _352 = all(equal(_349, subgroupBroadcastFirst(_349)));
            if (_352)
            {
                _354 = subgroupExclusiveXor(_336);
            }
            else
            {
                _354 = _51;
            }
            if (_352)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _355 = _354;
    }
    return _355;
}

void main()
{
    uint _19 = THR * 4u;
    bool _70 = helperInvocationEXT();
    uint _71 = THR * 7u;
    imageStore(_12, int(THR * 7u), uvec4(WaveMultiPrefixSum(texelFetch(_8, int(THR)).x, uvec4(uvec4(texelFetch(_9, int(_19)).x, texelFetch(_9, int(_19 + 1u)).x, texelFetch(_9, int(_19 + 2u)).x, texelFetch(_9, int(_19 + 3u)).x)), _70)));
    uint _75 = THR * 4u;
    bool _120 = helperInvocationEXT();
    imageStore(_12, int((THR * 7u) + 1u), uvec4(uint(WaveMultiPrefixSum(uintBitsToFloat(texelFetch(_8, int(THR)).x), uvec4(uvec4(texelFetch(_9, int(_75)).x, texelFetch(_9, int(_75 + 1u)).x, texelFetch(_9, int(_75 + 2u)).x, texelFetch(_9, int(_75 + 3u)).x)), _120))));
    uint _126 = THR * 4u;
    bool _167 = helperInvocationEXT();
    imageStore(_12, int((THR * 7u) + 2u), uvec4(WaveMultiPrefixProduct(texelFetch(_8, int(THR)).x, uvec4(uvec4(texelFetch(_9, int(_126)).x, texelFetch(_9, int(_126 + 1u)).x, texelFetch(_9, int(_126 + 2u)).x, texelFetch(_9, int(_126 + 3u)).x)), _167)));
    uint _172 = THR * 4u;
    bool _214 = helperInvocationEXT();
    imageStore(_12, int((THR * 7u) + 3u), uvec4(uint(WaveMultiPrefixProduct(uintBitsToFloat(texelFetch(_8, int(THR)).x), uvec4(uvec4(texelFetch(_9, int(_172)).x, texelFetch(_9, int(_172 + 1u)).x, texelFetch(_9, int(_172 + 2u)).x, texelFetch(_9, int(_172 + 3u)).x)), _214))));
    uint _220 = THR * 4u;
    bool _261 = helperInvocationEXT();
    imageStore(_12, int((THR * 7u) + 4u), uvec4(WaveMultiPrefixBitOr(texelFetch(_8, int(THR)).x, uvec4(uvec4(texelFetch(_9, int(_220)).x, texelFetch(_9, int(_220 + 1u)).x, texelFetch(_9, int(_220 + 2u)).x, texelFetch(_9, int(_220 + 3u)).x)), _261)));
    uint _266 = THR * 4u;
    bool _309 = helperInvocationEXT();
    imageStore(_12, int((THR * 7u) + 5u), uvec4(WaveMultiPrefixBitAnd(uint(int(uintBitsToFloat(texelFetch(_8, int(THR)).x))), uvec4(uvec4(texelFetch(_9, int(_266)).x, texelFetch(_9, int(_266 + 1u)).x, texelFetch(_9, int(_266 + 2u)).x, texelFetch(_9, int(_266 + 3u)).x)), _309)));
    uint _315 = THR * 4u;
    bool _358 = helperInvocationEXT();
    imageStore(_12, int((THR * 7u) + 6u), uvec4(WaveMultiPrefixBitXor(uint(int(uintBitsToFloat(texelFetch(_8, int(THR)).x))), uvec4(uvec4(texelFetch(_9, int(_315)).x, texelFetch(_9, int(_315 + 1u)).x, texelFetch(_9, int(_315 + 2u)).x, texelFetch(_9, int(_315 + 3u)).x)), _358)));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 365
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability GroupNonUniformArithmetic
OpCapability GroupNonUniformBallot
OpCapability VulkanMemoryModel
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %9 %12 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "THR"
OpName %49 "WaveMultiPrefixSum"
OpName %100 "WaveMultiPrefixSum"
OpName %148 "WaveMultiPrefixProduct"
OpName %195 "WaveMultiPrefixProduct"
OpName %242 "WaveMultiPrefixBitOr"
OpName %290 "WaveMultiPrefixBitAnd"
OpName %339 "WaveMultiPrefixBitXor"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 1
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %12 NonReadable
OpDecorate %14 Flat
OpDecorate %14 Location 0
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
%51 = OpUndef %5
%60 = OpConstantTrue %43
%72 = OpConstant %5 7
%94 = OpTypeFloat 32
%96 = OpTypeFunction %94 %94 %21 %43
%102 = OpUndef %94
%311 = OpConstant %5 5
%360 = OpConstant %5 6
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %364
%364 = OpLabel
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
%69 = OpCompositeConstruct %21 %37 %38 %39 %40
%70 = OpIsHelperInvocationEXT %43
%68 = OpFunctionCall %5 %49 %42 %69 %70
%71 = OpIMul %5 %18 %72
%73 = OpIMul %5 %18 %72
%74 = OpCompositeConstruct %21 %68 %68 %68 %68
OpImageWrite %15 %73 %74 NonPrivateTexel
%75 = OpIMul %5 %18 %20
%76 = OpImageFetch %21 %16 %75
%77 = OpCompositeExtract %5 %76 0
%79 = OpIAdd %5 %75 %26
%78 = OpImageFetch %21 %16 %79
%80 = OpCompositeExtract %5 %78 0
%82 = OpIAdd %5 %75 %30
%81 = OpImageFetch %21 %16 %82
%83 = OpCompositeExtract %5 %81 0
%85 = OpIAdd %5 %75 %34
%84 = OpImageFetch %21 %16 %85
%86 = OpCompositeExtract %5 %84 0
%87 = OpCompositeConstruct %21 %77 %80 %83 %86
%88 = OpCompositeExtract %5 %87 0
%89 = OpCompositeExtract %5 %87 1
%90 = OpCompositeExtract %5 %87 2
%91 = OpCompositeExtract %5 %87 3
%92 = OpImageFetch %21 %17 %18
%93 = OpCompositeExtract %5 %92 0
%95 = OpBitcast %94 %93
%119 = OpCompositeConstruct %21 %88 %89 %90 %91
%120 = OpIsHelperInvocationEXT %43
%118 = OpFunctionCall %94 %100 %95 %119 %120
%121 = OpConvertFToU %5 %118
%122 = OpIAdd %5 %71 %26
%123 = OpIMul %5 %18 %72
%124 = OpIAdd %5 %123 %26
%125 = OpCompositeConstruct %21 %121 %121 %121 %121
OpImageWrite %15 %124 %125 NonPrivateTexel
%126 = OpIMul %5 %18 %20
%127 = OpImageFetch %21 %16 %126
%128 = OpCompositeExtract %5 %127 0
%130 = OpIAdd %5 %126 %26
%129 = OpImageFetch %21 %16 %130
%131 = OpCompositeExtract %5 %129 0
%133 = OpIAdd %5 %126 %30
%132 = OpImageFetch %21 %16 %133
%134 = OpCompositeExtract %5 %132 0
%136 = OpIAdd %5 %126 %34
%135 = OpImageFetch %21 %16 %136
%137 = OpCompositeExtract %5 %135 0
%138 = OpCompositeConstruct %21 %128 %131 %134 %137
%139 = OpCompositeExtract %5 %138 0
%140 = OpCompositeExtract %5 %138 1
%141 = OpCompositeExtract %5 %138 2
%142 = OpCompositeExtract %5 %138 3
%143 = OpImageFetch %21 %17 %18
%144 = OpCompositeExtract %5 %143 0
%166 = OpCompositeConstruct %21 %139 %140 %141 %142
%167 = OpIsHelperInvocationEXT %43
%165 = OpFunctionCall %5 %148 %144 %166 %167
%168 = OpIAdd %5 %71 %30
%169 = OpIMul %5 %18 %72
%170 = OpIAdd %5 %169 %30
%171 = OpCompositeConstruct %21 %165 %165 %165 %165
OpImageWrite %15 %170 %171 NonPrivateTexel
%172 = OpIMul %5 %18 %20
%173 = OpImageFetch %21 %16 %172
%174 = OpCompositeExtract %5 %173 0
%176 = OpIAdd %5 %172 %26
%175 = OpImageFetch %21 %16 %176
%177 = OpCompositeExtract %5 %175 0
%179 = OpIAdd %5 %172 %30
%178 = OpImageFetch %21 %16 %179
%180 = OpCompositeExtract %5 %178 0
%182 = OpIAdd %5 %172 %34
%181 = OpImageFetch %21 %16 %182
%183 = OpCompositeExtract %5 %181 0
%184 = OpCompositeConstruct %21 %174 %177 %180 %183
%185 = OpCompositeExtract %5 %184 0
%186 = OpCompositeExtract %5 %184 1
%187 = OpCompositeExtract %5 %184 2
%188 = OpCompositeExtract %5 %184 3
%189 = OpImageFetch %21 %17 %18
%190 = OpCompositeExtract %5 %189 0
%191 = OpBitcast %94 %190
%213 = OpCompositeConstruct %21 %185 %186 %187 %188
%214 = OpIsHelperInvocationEXT %43
%212 = OpFunctionCall %94 %195 %191 %213 %214
%215 = OpConvertFToU %5 %212
%216 = OpIAdd %5 %71 %34
%217 = OpIMul %5 %18 %72
%218 = OpIAdd %5 %217 %34
%219 = OpCompositeConstruct %21 %215 %215 %215 %215
OpImageWrite %15 %218 %219 NonPrivateTexel
%220 = OpIMul %5 %18 %20
%221 = OpImageFetch %21 %16 %220
%222 = OpCompositeExtract %5 %221 0
%224 = OpIAdd %5 %220 %26
%223 = OpImageFetch %21 %16 %224
%225 = OpCompositeExtract %5 %223 0
%227 = OpIAdd %5 %220 %30
%226 = OpImageFetch %21 %16 %227
%228 = OpCompositeExtract %5 %226 0
%230 = OpIAdd %5 %220 %34
%229 = OpImageFetch %21 %16 %230
%231 = OpCompositeExtract %5 %229 0
%232 = OpCompositeConstruct %21 %222 %225 %228 %231
%233 = OpCompositeExtract %5 %232 0
%234 = OpCompositeExtract %5 %232 1
%235 = OpCompositeExtract %5 %232 2
%236 = OpCompositeExtract %5 %232 3
%237 = OpImageFetch %21 %17 %18
%238 = OpCompositeExtract %5 %237 0
%260 = OpCompositeConstruct %21 %233 %234 %235 %236
%261 = OpIsHelperInvocationEXT %43
%259 = OpFunctionCall %5 %242 %238 %260 %261
%262 = OpIAdd %5 %71 %20
%263 = OpIMul %5 %18 %72
%264 = OpIAdd %5 %263 %20
%265 = OpCompositeConstruct %21 %259 %259 %259 %259
OpImageWrite %15 %264 %265 NonPrivateTexel
%266 = OpIMul %5 %18 %20
%267 = OpImageFetch %21 %16 %266
%268 = OpCompositeExtract %5 %267 0
%270 = OpIAdd %5 %266 %26
%269 = OpImageFetch %21 %16 %270
%271 = OpCompositeExtract %5 %269 0
%273 = OpIAdd %5 %266 %30
%272 = OpImageFetch %21 %16 %273
%274 = OpCompositeExtract %5 %272 0
%276 = OpIAdd %5 %266 %34
%275 = OpImageFetch %21 %16 %276
%277 = OpCompositeExtract %5 %275 0
%278 = OpCompositeConstruct %21 %268 %271 %274 %277
%279 = OpCompositeExtract %5 %278 0
%280 = OpCompositeExtract %5 %278 1
%281 = OpCompositeExtract %5 %278 2
%282 = OpCompositeExtract %5 %278 3
%283 = OpImageFetch %21 %17 %18
%284 = OpCompositeExtract %5 %283 0
%285 = OpBitcast %94 %284
%286 = OpConvertFToS %5 %285
%308 = OpCompositeConstruct %21 %279 %280 %281 %282
%309 = OpIsHelperInvocationEXT %43
%307 = OpFunctionCall %5 %290 %286 %308 %309
%310 = OpIAdd %5 %71 %311
%312 = OpIMul %5 %18 %72
%313 = OpIAdd %5 %312 %311
%314 = OpCompositeConstruct %21 %307 %307 %307 %307
OpImageWrite %15 %313 %314 NonPrivateTexel
%315 = OpIMul %5 %18 %20
%316 = OpImageFetch %21 %16 %315
%317 = OpCompositeExtract %5 %316 0
%319 = OpIAdd %5 %315 %26
%318 = OpImageFetch %21 %16 %319
%320 = OpCompositeExtract %5 %318 0
%322 = OpIAdd %5 %315 %30
%321 = OpImageFetch %21 %16 %322
%323 = OpCompositeExtract %5 %321 0
%325 = OpIAdd %5 %315 %34
%324 = OpImageFetch %21 %16 %325
%326 = OpCompositeExtract %5 %324 0
%327 = OpCompositeConstruct %21 %317 %320 %323 %326
%328 = OpCompositeExtract %5 %327 0
%329 = OpCompositeExtract %5 %327 1
%330 = OpCompositeExtract %5 %327 2
%331 = OpCompositeExtract %5 %327 3
%332 = OpImageFetch %21 %17 %18
%333 = OpCompositeExtract %5 %332 0
%334 = OpBitcast %94 %333
%335 = OpConvertFToS %5 %334
%357 = OpCompositeConstruct %21 %328 %329 %330 %331
%358 = OpIsHelperInvocationEXT %43
%356 = OpFunctionCall %5 %339 %335 %357 %358
%359 = OpIAdd %5 %71 %360
%361 = OpIMul %5 %18 %72
%362 = OpIAdd %5 %361 %360
%363 = OpCompositeConstruct %21 %356 %356 %356 %356
OpImageWrite %15 %362 %363 NonPrivateTexel
OpReturn
OpFunctionEnd
%49 = OpFunction %5 None %45
%46 = OpFunctionParameter %5
%47 = OpFunctionParameter %21
%48 = OpFunctionParameter %43
%50 = OpLabel
OpSelectionMerge %58 None
OpBranchConditional %48 %58 %57
%57 = OpLabel
%59 = OpGroupNonUniformBallot %21 %34 %60
%61 = OpBitwiseAnd %21 %59 %47
OpBranch %52
%52 = OpLabel
OpLoopMerge %56 %53 None
OpBranch %53
%53 = OpLabel
%62 = OpGroupNonUniformBroadcastFirst %21 %34 %61
%63 = OpIEqual %44 %61 %62
%64 = OpAll %43 %63
OpSelectionMerge %55 None
OpBranchConditional %64 %54 %55
%54 = OpLabel
%65 = OpGroupNonUniformIAdd %5 %34 ExclusiveScan %46
OpBranch %55
%55 = OpLabel
%66 = OpPhi %5 %65 %54 %51 %53
OpBranchConditional %64 %56 %52
%56 = OpLabel
OpBranch %58
%58 = OpLabel
%67 = OpPhi %5 %66 %56 %51 %50
OpReturnValue %67
OpFunctionEnd
%100 = OpFunction %94 None %96
%97 = OpFunctionParameter %94
%98 = OpFunctionParameter %21
%99 = OpFunctionParameter %43
%101 = OpLabel
OpSelectionMerge %109 None
OpBranchConditional %99 %109 %108
%108 = OpLabel
%110 = OpGroupNonUniformBallot %21 %34 %60
%111 = OpBitwiseAnd %21 %110 %98
OpBranch %103
%103 = OpLabel
OpLoopMerge %107 %104 None
OpBranch %104
%104 = OpLabel
%112 = OpGroupNonUniformBroadcastFirst %21 %34 %111
%113 = OpIEqual %44 %111 %112
%114 = OpAll %43 %113
OpSelectionMerge %106 None
OpBranchConditional %114 %105 %106
%105 = OpLabel
%115 = OpGroupNonUniformFAdd %94 %34 ExclusiveScan %97
OpBranch %106
%106 = OpLabel
%116 = OpPhi %94 %115 %105 %102 %104
OpBranchConditional %114 %107 %103
%107 = OpLabel
OpBranch %109
%109 = OpLabel
%117 = OpPhi %94 %116 %107 %102 %101
OpReturnValue %117
OpFunctionEnd
%148 = OpFunction %5 None %45
%145 = OpFunctionParameter %5
%146 = OpFunctionParameter %21
%147 = OpFunctionParameter %43
%149 = OpLabel
OpSelectionMerge %156 None
OpBranchConditional %147 %156 %155
%155 = OpLabel
%157 = OpGroupNonUniformBallot %21 %34 %60
%158 = OpBitwiseAnd %21 %157 %146
OpBranch %150
%150 = OpLabel
OpLoopMerge %154 %151 None
OpBranch %151
%151 = OpLabel
%159 = OpGroupNonUniformBroadcastFirst %21 %34 %158
%160 = OpIEqual %44 %158 %159
%161 = OpAll %43 %160
OpSelectionMerge %153 None
OpBranchConditional %161 %152 %153
%152 = OpLabel
%162 = OpGroupNonUniformIMul %5 %34 ExclusiveScan %145
OpBranch %153
%153 = OpLabel
%163 = OpPhi %5 %162 %152 %51 %151
OpBranchConditional %161 %154 %150
%154 = OpLabel
OpBranch %156
%156 = OpLabel
%164 = OpPhi %5 %163 %154 %51 %149
OpReturnValue %164
OpFunctionEnd
%195 = OpFunction %94 None %96
%192 = OpFunctionParameter %94
%193 = OpFunctionParameter %21
%194 = OpFunctionParameter %43
%196 = OpLabel
OpSelectionMerge %203 None
OpBranchConditional %194 %203 %202
%202 = OpLabel
%204 = OpGroupNonUniformBallot %21 %34 %60
%205 = OpBitwiseAnd %21 %204 %193
OpBranch %197
%197 = OpLabel
OpLoopMerge %201 %198 None
OpBranch %198
%198 = OpLabel
%206 = OpGroupNonUniformBroadcastFirst %21 %34 %205
%207 = OpIEqual %44 %205 %206
%208 = OpAll %43 %207
OpSelectionMerge %200 None
OpBranchConditional %208 %199 %200
%199 = OpLabel
%209 = OpGroupNonUniformFMul %94 %34 ExclusiveScan %192
OpBranch %200
%200 = OpLabel
%210 = OpPhi %94 %209 %199 %102 %198
OpBranchConditional %208 %201 %197
%201 = OpLabel
OpBranch %203
%203 = OpLabel
%211 = OpPhi %94 %210 %201 %102 %196
OpReturnValue %211
OpFunctionEnd
%242 = OpFunction %5 None %45
%239 = OpFunctionParameter %5
%240 = OpFunctionParameter %21
%241 = OpFunctionParameter %43
%243 = OpLabel
OpSelectionMerge %250 None
OpBranchConditional %241 %250 %249
%249 = OpLabel
%251 = OpGroupNonUniformBallot %21 %34 %60
%252 = OpBitwiseAnd %21 %251 %240
OpBranch %244
%244 = OpLabel
OpLoopMerge %248 %245 None
OpBranch %245
%245 = OpLabel
%253 = OpGroupNonUniformBroadcastFirst %21 %34 %252
%254 = OpIEqual %44 %252 %253
%255 = OpAll %43 %254
OpSelectionMerge %247 None
OpBranchConditional %255 %246 %247
%246 = OpLabel
%256 = OpGroupNonUniformBitwiseOr %5 %34 ExclusiveScan %239
OpBranch %247
%247 = OpLabel
%257 = OpPhi %5 %256 %246 %51 %245
OpBranchConditional %255 %248 %244
%248 = OpLabel
OpBranch %250
%250 = OpLabel
%258 = OpPhi %5 %257 %248 %51 %243
OpReturnValue %258
OpFunctionEnd
%290 = OpFunction %5 None %45
%287 = OpFunctionParameter %5
%288 = OpFunctionParameter %21
%289 = OpFunctionParameter %43
%291 = OpLabel
OpSelectionMerge %298 None
OpBranchConditional %289 %298 %297
%297 = OpLabel
%299 = OpGroupNonUniformBallot %21 %34 %60
%300 = OpBitwiseAnd %21 %299 %288
OpBranch %292
%292 = OpLabel
OpLoopMerge %296 %293 None
OpBranch %293
%293 = OpLabel
%301 = OpGroupNonUniformBroadcastFirst %21 %34 %300
%302 = OpIEqual %44 %300 %301
%303 = OpAll %43 %302
OpSelectionMerge %295 None
OpBranchConditional %303 %294 %295
%294 = OpLabel
%304 = OpGroupNonUniformBitwiseAnd %5 %34 ExclusiveScan %287
OpBranch %295
%295 = OpLabel
%305 = OpPhi %5 %304 %294 %51 %293
OpBranchConditional %303 %296 %292
%296 = OpLabel
OpBranch %298
%298 = OpLabel
%306 = OpPhi %5 %305 %296 %51 %291
OpReturnValue %306
OpFunctionEnd
%339 = OpFunction %5 None %45
%336 = OpFunctionParameter %5
%337 = OpFunctionParameter %21
%338 = OpFunctionParameter %43
%340 = OpLabel
OpSelectionMerge %347 None
OpBranchConditional %338 %347 %346
%346 = OpLabel
%348 = OpGroupNonUniformBallot %21 %34 %60
%349 = OpBitwiseAnd %21 %348 %337
OpBranch %341
%341 = OpLabel
OpLoopMerge %345 %342 None
OpBranch %342
%342 = OpLabel
%350 = OpGroupNonUniformBroadcastFirst %21 %34 %349
%351 = OpIEqual %44 %349 %350
%352 = OpAll %43 %351
OpSelectionMerge %344 None
OpBranchConditional %352 %343 %344
%343 = OpLabel
%353 = OpGroupNonUniformBitwiseXor %5 %34 ExclusiveScan %336
OpBranch %344
%344 = OpLabel
%354 = OpPhi %5 %353 %343 %51 %342
OpBranchConditional %352 %345 %341
%345 = OpLabel
OpBranch %347
%347 = OpLabel
%355 = OpPhi %5 %354 %345 %51 %340
OpReturnValue %355
OpFunctionEnd
#endif
