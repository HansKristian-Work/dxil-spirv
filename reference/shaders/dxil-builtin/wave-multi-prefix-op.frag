#version 460
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_KHR_shader_subgroup_arithmetic : require
#extension GL_EXT_samplerless_texture_functions : require
#extension GL_EXT_demote_to_helper_invocation : require

uint _51;
float _102;
uint _150;
float _198;
uint _246;
uint _295;
uint _345;

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
    uint _165;
    if (_147)
    {
        _165 = _150;
    }
    else
    {
        uvec4 _158 = subgroupBallot(true);
        uvec4 _159 = _158 & _146;
        bool _162;
        uint _164;
        for (;;)
        {
            _162 = all(equal(_159, subgroupBroadcastFirst(_159)));
            if (_162)
            {
                _164 = subgroupExclusiveMul(_145);
            }
            else
            {
                _164 = _150;
            }
            if (_162)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _165 = _164;
    }
    return _165;
}

float WaveMultiPrefixProduct(float _193, uvec4 _194, bool _195)
{
    float _213;
    if (_195)
    {
        _213 = _198;
    }
    else
    {
        uvec4 _206 = subgroupBallot(true);
        uvec4 _207 = _206 & _194;
        bool _210;
        float _212;
        for (;;)
        {
            _210 = all(equal(_207, subgroupBroadcastFirst(_207)));
            if (_210)
            {
                _212 = subgroupExclusiveMul(_193);
            }
            else
            {
                _212 = _198;
            }
            if (_210)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _213 = _212;
    }
    return _213;
}

uint WaveMultiPrefixBitOr(uint _241, uvec4 _242, bool _243)
{
    uint _261;
    if (_243)
    {
        _261 = _246;
    }
    else
    {
        uvec4 _254 = subgroupBallot(true);
        uvec4 _255 = _254 & _242;
        bool _258;
        uint _260;
        for (;;)
        {
            _258 = all(equal(_255, subgroupBroadcastFirst(_255)));
            if (_258)
            {
                _260 = subgroupExclusiveOr(_241);
            }
            else
            {
                _260 = _246;
            }
            if (_258)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _261 = _260;
    }
    return _261;
}

uint WaveMultiPrefixBitAnd(uint _290, uvec4 _291, bool _292)
{
    uint _310;
    if (_292)
    {
        _310 = _295;
    }
    else
    {
        uvec4 _303 = subgroupBallot(true);
        uvec4 _304 = _303 & _291;
        bool _307;
        uint _309;
        for (;;)
        {
            _307 = all(equal(_304, subgroupBroadcastFirst(_304)));
            if (_307)
            {
                _309 = subgroupExclusiveAnd(_290);
            }
            else
            {
                _309 = _295;
            }
            if (_307)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _310 = _309;
    }
    return _310;
}

uint WaveMultiPrefixBitXor(uint _340, uvec4 _341, bool _342)
{
    uint _360;
    if (_342)
    {
        _360 = _345;
    }
    else
    {
        uvec4 _353 = subgroupBallot(true);
        uvec4 _354 = _353 & _341;
        bool _357;
        uint _359;
        for (;;)
        {
            _357 = all(equal(_354, subgroupBroadcastFirst(_354)));
            if (_357)
            {
                _359 = subgroupExclusiveXor(_340);
            }
            else
            {
                _359 = _345;
            }
            if (_357)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _360 = _359;
    }
    return _360;
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
    bool _168 = helperInvocationEXT();
    imageStore(_12, int((THR * 7u) + 2u), uvec4(WaveMultiPrefixProduct(texelFetch(_8, int(THR)).x, uvec4(uvec4(texelFetch(_9, int(_126)).x, texelFetch(_9, int(_126 + 1u)).x, texelFetch(_9, int(_126 + 2u)).x, texelFetch(_9, int(_126 + 3u)).x)), _168)));
    uint _173 = THR * 4u;
    bool _216 = helperInvocationEXT();
    imageStore(_12, int((THR * 7u) + 3u), uvec4(uint(WaveMultiPrefixProduct(uintBitsToFloat(texelFetch(_8, int(THR)).x), uvec4(uvec4(texelFetch(_9, int(_173)).x, texelFetch(_9, int(_173 + 1u)).x, texelFetch(_9, int(_173 + 2u)).x, texelFetch(_9, int(_173 + 3u)).x)), _216))));
    uint _222 = THR * 4u;
    bool _264 = helperInvocationEXT();
    imageStore(_12, int((THR * 7u) + 4u), uvec4(WaveMultiPrefixBitOr(texelFetch(_8, int(THR)).x, uvec4(uvec4(texelFetch(_9, int(_222)).x, texelFetch(_9, int(_222 + 1u)).x, texelFetch(_9, int(_222 + 2u)).x, texelFetch(_9, int(_222 + 3u)).x)), _264)));
    uint _269 = THR * 4u;
    bool _313 = helperInvocationEXT();
    imageStore(_12, int((THR * 7u) + 5u), uvec4(WaveMultiPrefixBitAnd(uint(int(uintBitsToFloat(texelFetch(_8, int(THR)).x))), uvec4(uvec4(texelFetch(_9, int(_269)).x, texelFetch(_9, int(_269 + 1u)).x, texelFetch(_9, int(_269 + 2u)).x, texelFetch(_9, int(_269 + 3u)).x)), _313)));
    uint _319 = THR * 4u;
    bool _363 = helperInvocationEXT();
    imageStore(_12, int((THR * 7u) + 6u), uvec4(WaveMultiPrefixBitXor(uint(int(uintBitsToFloat(texelFetch(_8, int(THR)).x))), uvec4(uvec4(texelFetch(_9, int(_319)).x, texelFetch(_9, int(_319 + 1u)).x, texelFetch(_9, int(_319 + 2u)).x, texelFetch(_9, int(_319 + 3u)).x)), _363)));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 370
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
OpName %196 "WaveMultiPrefixProduct"
OpName %244 "WaveMultiPrefixBitOr"
OpName %293 "WaveMultiPrefixBitAnd"
OpName %343 "WaveMultiPrefixBitXor"
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
%60 = OpConstantTrue %43
%72 = OpConstant %5 7
%94 = OpTypeFloat 32
%96 = OpTypeFunction %94 %94 %21 %43
%315 = OpConstant %5 5
%365 = OpConstant %5 6
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %369
%369 = OpLabel
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
%167 = OpCompositeConstruct %21 %139 %140 %141 %142
%168 = OpIsHelperInvocationEXT %43
%166 = OpFunctionCall %5 %148 %144 %167 %168
%169 = OpIAdd %5 %71 %30
%170 = OpIMul %5 %18 %72
%171 = OpIAdd %5 %170 %30
%172 = OpCompositeConstruct %21 %166 %166 %166 %166
OpImageWrite %15 %171 %172 NonPrivateTexel
%173 = OpIMul %5 %18 %20
%174 = OpImageFetch %21 %16 %173
%175 = OpCompositeExtract %5 %174 0
%177 = OpIAdd %5 %173 %26
%176 = OpImageFetch %21 %16 %177
%178 = OpCompositeExtract %5 %176 0
%180 = OpIAdd %5 %173 %30
%179 = OpImageFetch %21 %16 %180
%181 = OpCompositeExtract %5 %179 0
%183 = OpIAdd %5 %173 %34
%182 = OpImageFetch %21 %16 %183
%184 = OpCompositeExtract %5 %182 0
%185 = OpCompositeConstruct %21 %175 %178 %181 %184
%186 = OpCompositeExtract %5 %185 0
%187 = OpCompositeExtract %5 %185 1
%188 = OpCompositeExtract %5 %185 2
%189 = OpCompositeExtract %5 %185 3
%190 = OpImageFetch %21 %17 %18
%191 = OpCompositeExtract %5 %190 0
%192 = OpBitcast %94 %191
%215 = OpCompositeConstruct %21 %186 %187 %188 %189
%216 = OpIsHelperInvocationEXT %43
%214 = OpFunctionCall %94 %196 %192 %215 %216
%217 = OpConvertFToU %5 %214
%218 = OpIAdd %5 %71 %34
%219 = OpIMul %5 %18 %72
%220 = OpIAdd %5 %219 %34
%221 = OpCompositeConstruct %21 %217 %217 %217 %217
OpImageWrite %15 %220 %221 NonPrivateTexel
%222 = OpIMul %5 %18 %20
%223 = OpImageFetch %21 %16 %222
%224 = OpCompositeExtract %5 %223 0
%226 = OpIAdd %5 %222 %26
%225 = OpImageFetch %21 %16 %226
%227 = OpCompositeExtract %5 %225 0
%229 = OpIAdd %5 %222 %30
%228 = OpImageFetch %21 %16 %229
%230 = OpCompositeExtract %5 %228 0
%232 = OpIAdd %5 %222 %34
%231 = OpImageFetch %21 %16 %232
%233 = OpCompositeExtract %5 %231 0
%234 = OpCompositeConstruct %21 %224 %227 %230 %233
%235 = OpCompositeExtract %5 %234 0
%236 = OpCompositeExtract %5 %234 1
%237 = OpCompositeExtract %5 %234 2
%238 = OpCompositeExtract %5 %234 3
%239 = OpImageFetch %21 %17 %18
%240 = OpCompositeExtract %5 %239 0
%263 = OpCompositeConstruct %21 %235 %236 %237 %238
%264 = OpIsHelperInvocationEXT %43
%262 = OpFunctionCall %5 %244 %240 %263 %264
%265 = OpIAdd %5 %71 %20
%266 = OpIMul %5 %18 %72
%267 = OpIAdd %5 %266 %20
%268 = OpCompositeConstruct %21 %262 %262 %262 %262
OpImageWrite %15 %267 %268 NonPrivateTexel
%269 = OpIMul %5 %18 %20
%270 = OpImageFetch %21 %16 %269
%271 = OpCompositeExtract %5 %270 0
%273 = OpIAdd %5 %269 %26
%272 = OpImageFetch %21 %16 %273
%274 = OpCompositeExtract %5 %272 0
%276 = OpIAdd %5 %269 %30
%275 = OpImageFetch %21 %16 %276
%277 = OpCompositeExtract %5 %275 0
%279 = OpIAdd %5 %269 %34
%278 = OpImageFetch %21 %16 %279
%280 = OpCompositeExtract %5 %278 0
%281 = OpCompositeConstruct %21 %271 %274 %277 %280
%282 = OpCompositeExtract %5 %281 0
%283 = OpCompositeExtract %5 %281 1
%284 = OpCompositeExtract %5 %281 2
%285 = OpCompositeExtract %5 %281 3
%286 = OpImageFetch %21 %17 %18
%287 = OpCompositeExtract %5 %286 0
%288 = OpBitcast %94 %287
%289 = OpConvertFToS %5 %288
%312 = OpCompositeConstruct %21 %282 %283 %284 %285
%313 = OpIsHelperInvocationEXT %43
%311 = OpFunctionCall %5 %293 %289 %312 %313
%314 = OpIAdd %5 %71 %315
%316 = OpIMul %5 %18 %72
%317 = OpIAdd %5 %316 %315
%318 = OpCompositeConstruct %21 %311 %311 %311 %311
OpImageWrite %15 %317 %318 NonPrivateTexel
%319 = OpIMul %5 %18 %20
%320 = OpImageFetch %21 %16 %319
%321 = OpCompositeExtract %5 %320 0
%323 = OpIAdd %5 %319 %26
%322 = OpImageFetch %21 %16 %323
%324 = OpCompositeExtract %5 %322 0
%326 = OpIAdd %5 %319 %30
%325 = OpImageFetch %21 %16 %326
%327 = OpCompositeExtract %5 %325 0
%329 = OpIAdd %5 %319 %34
%328 = OpImageFetch %21 %16 %329
%330 = OpCompositeExtract %5 %328 0
%331 = OpCompositeConstruct %21 %321 %324 %327 %330
%332 = OpCompositeExtract %5 %331 0
%333 = OpCompositeExtract %5 %331 1
%334 = OpCompositeExtract %5 %331 2
%335 = OpCompositeExtract %5 %331 3
%336 = OpImageFetch %21 %17 %18
%337 = OpCompositeExtract %5 %336 0
%338 = OpBitcast %94 %337
%339 = OpConvertFToS %5 %338
%362 = OpCompositeConstruct %21 %332 %333 %334 %335
%363 = OpIsHelperInvocationEXT %43
%361 = OpFunctionCall %5 %343 %339 %362 %363
%364 = OpIAdd %5 %71 %365
%366 = OpIMul %5 %18 %72
%367 = OpIAdd %5 %366 %365
%368 = OpCompositeConstruct %21 %361 %361 %361 %361
OpImageWrite %15 %367 %368 NonPrivateTexel
OpReturn
OpFunctionEnd
%49 = OpFunction %5 None %45
%46 = OpFunctionParameter %5
%47 = OpFunctionParameter %21
%48 = OpFunctionParameter %43
%50 = OpLabel
%51 = OpUndef %5
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
%102 = OpUndef %94
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
%150 = OpUndef %5
OpSelectionMerge %157 None
OpBranchConditional %147 %157 %156
%156 = OpLabel
%158 = OpGroupNonUniformBallot %21 %34 %60
%159 = OpBitwiseAnd %21 %158 %146
OpBranch %151
%151 = OpLabel
OpLoopMerge %155 %152 None
OpBranch %152
%152 = OpLabel
%160 = OpGroupNonUniformBroadcastFirst %21 %34 %159
%161 = OpIEqual %44 %159 %160
%162 = OpAll %43 %161
OpSelectionMerge %154 None
OpBranchConditional %162 %153 %154
%153 = OpLabel
%163 = OpGroupNonUniformIMul %5 %34 ExclusiveScan %145
OpBranch %154
%154 = OpLabel
%164 = OpPhi %5 %163 %153 %150 %152
OpBranchConditional %162 %155 %151
%155 = OpLabel
OpBranch %157
%157 = OpLabel
%165 = OpPhi %5 %164 %155 %150 %149
OpReturnValue %165
OpFunctionEnd
%196 = OpFunction %94 None %96
%193 = OpFunctionParameter %94
%194 = OpFunctionParameter %21
%195 = OpFunctionParameter %43
%197 = OpLabel
%198 = OpUndef %94
OpSelectionMerge %205 None
OpBranchConditional %195 %205 %204
%204 = OpLabel
%206 = OpGroupNonUniformBallot %21 %34 %60
%207 = OpBitwiseAnd %21 %206 %194
OpBranch %199
%199 = OpLabel
OpLoopMerge %203 %200 None
OpBranch %200
%200 = OpLabel
%208 = OpGroupNonUniformBroadcastFirst %21 %34 %207
%209 = OpIEqual %44 %207 %208
%210 = OpAll %43 %209
OpSelectionMerge %202 None
OpBranchConditional %210 %201 %202
%201 = OpLabel
%211 = OpGroupNonUniformFMul %94 %34 ExclusiveScan %193
OpBranch %202
%202 = OpLabel
%212 = OpPhi %94 %211 %201 %198 %200
OpBranchConditional %210 %203 %199
%203 = OpLabel
OpBranch %205
%205 = OpLabel
%213 = OpPhi %94 %212 %203 %198 %197
OpReturnValue %213
OpFunctionEnd
%244 = OpFunction %5 None %45
%241 = OpFunctionParameter %5
%242 = OpFunctionParameter %21
%243 = OpFunctionParameter %43
%245 = OpLabel
%246 = OpUndef %5
OpSelectionMerge %253 None
OpBranchConditional %243 %253 %252
%252 = OpLabel
%254 = OpGroupNonUniformBallot %21 %34 %60
%255 = OpBitwiseAnd %21 %254 %242
OpBranch %247
%247 = OpLabel
OpLoopMerge %251 %248 None
OpBranch %248
%248 = OpLabel
%256 = OpGroupNonUniformBroadcastFirst %21 %34 %255
%257 = OpIEqual %44 %255 %256
%258 = OpAll %43 %257
OpSelectionMerge %250 None
OpBranchConditional %258 %249 %250
%249 = OpLabel
%259 = OpGroupNonUniformBitwiseOr %5 %34 ExclusiveScan %241
OpBranch %250
%250 = OpLabel
%260 = OpPhi %5 %259 %249 %246 %248
OpBranchConditional %258 %251 %247
%251 = OpLabel
OpBranch %253
%253 = OpLabel
%261 = OpPhi %5 %260 %251 %246 %245
OpReturnValue %261
OpFunctionEnd
%293 = OpFunction %5 None %45
%290 = OpFunctionParameter %5
%291 = OpFunctionParameter %21
%292 = OpFunctionParameter %43
%294 = OpLabel
%295 = OpUndef %5
OpSelectionMerge %302 None
OpBranchConditional %292 %302 %301
%301 = OpLabel
%303 = OpGroupNonUniformBallot %21 %34 %60
%304 = OpBitwiseAnd %21 %303 %291
OpBranch %296
%296 = OpLabel
OpLoopMerge %300 %297 None
OpBranch %297
%297 = OpLabel
%305 = OpGroupNonUniformBroadcastFirst %21 %34 %304
%306 = OpIEqual %44 %304 %305
%307 = OpAll %43 %306
OpSelectionMerge %299 None
OpBranchConditional %307 %298 %299
%298 = OpLabel
%308 = OpGroupNonUniformBitwiseAnd %5 %34 ExclusiveScan %290
OpBranch %299
%299 = OpLabel
%309 = OpPhi %5 %308 %298 %295 %297
OpBranchConditional %307 %300 %296
%300 = OpLabel
OpBranch %302
%302 = OpLabel
%310 = OpPhi %5 %309 %300 %295 %294
OpReturnValue %310
OpFunctionEnd
%343 = OpFunction %5 None %45
%340 = OpFunctionParameter %5
%341 = OpFunctionParameter %21
%342 = OpFunctionParameter %43
%344 = OpLabel
%345 = OpUndef %5
OpSelectionMerge %352 None
OpBranchConditional %342 %352 %351
%351 = OpLabel
%353 = OpGroupNonUniformBallot %21 %34 %60
%354 = OpBitwiseAnd %21 %353 %341
OpBranch %346
%346 = OpLabel
OpLoopMerge %350 %347 None
OpBranch %347
%347 = OpLabel
%355 = OpGroupNonUniformBroadcastFirst %21 %34 %354
%356 = OpIEqual %44 %354 %355
%357 = OpAll %43 %356
OpSelectionMerge %349 None
OpBranchConditional %357 %348 %349
%348 = OpLabel
%358 = OpGroupNonUniformBitwiseXor %5 %34 ExclusiveScan %340
OpBranch %349
%349 = OpLabel
%359 = OpPhi %5 %358 %348 %345 %347
OpBranchConditional %357 %350 %346
%350 = OpLabel
OpBranch %352
%352 = OpLabel
%360 = OpPhi %5 %359 %350 %345 %344
OpReturnValue %360
OpFunctionEnd
#endif
