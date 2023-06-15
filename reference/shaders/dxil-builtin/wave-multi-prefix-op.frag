#version 460
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_KHR_shader_subgroup_arithmetic : require

layout(set = 0, binding = 0) uniform usamplerBuffer _8;
layout(set = 0, binding = 1) uniform usamplerBuffer _9;
layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _12;

layout(location = 0) flat in uint THR;

uint _50;
float _97;
uint _141;
float _185;
uint _229;
uint _274;
uint _320;

uint WaveMultiPrefixSum(uint _46, uvec4 _47)
{
    uvec4 _56 = subgroupBallot(true);
    uvec4 _58 = _56 & _47;
    bool _61;
    uint _63;
    for (;;)
    {
        _61 = all(equal(_58, subgroupBroadcastFirst(_58)));
        if (_61)
        {
            _63 = subgroupExclusiveAdd(_46);
        }
        else
        {
            _63 = _50;
        }
        if (_61)
        {
            break;
        }
        else
        {
            continue;
        }
    }
    return _63;
}

float WaveMultiPrefixSum(float _93, uvec4 _94)
{
    uvec4 _103 = subgroupBallot(true);
    uvec4 _104 = _103 & _94;
    bool _107;
    float _109;
    for (;;)
    {
        _107 = all(equal(_104, subgroupBroadcastFirst(_104)));
        if (_107)
        {
            _109 = subgroupExclusiveAdd(_93);
        }
        else
        {
            _109 = _97;
        }
        if (_107)
        {
            break;
        }
        else
        {
            continue;
        }
    }
    return _109;
}

uint WaveMultiPrefixProduct(uint _137, uvec4 _138)
{
    uvec4 _147 = subgroupBallot(true);
    uvec4 _148 = _147 & _138;
    bool _151;
    uint _153;
    for (;;)
    {
        _151 = all(equal(_148, subgroupBroadcastFirst(_148)));
        if (_151)
        {
            _153 = subgroupExclusiveMul(_137);
        }
        else
        {
            _153 = _141;
        }
        if (_151)
        {
            break;
        }
        else
        {
            continue;
        }
    }
    return _153;
}

float WaveMultiPrefixProduct(float _181, uvec4 _182)
{
    uvec4 _191 = subgroupBallot(true);
    uvec4 _192 = _191 & _182;
    bool _195;
    float _197;
    for (;;)
    {
        _195 = all(equal(_192, subgroupBroadcastFirst(_192)));
        if (_195)
        {
            _197 = subgroupExclusiveMul(_181);
        }
        else
        {
            _197 = _185;
        }
        if (_195)
        {
            break;
        }
        else
        {
            continue;
        }
    }
    return _197;
}

uint WaveMultiPrefixBitOr(uint _225, uvec4 _226)
{
    uvec4 _235 = subgroupBallot(true);
    uvec4 _236 = _235 & _226;
    bool _239;
    uint _241;
    for (;;)
    {
        _239 = all(equal(_236, subgroupBroadcastFirst(_236)));
        if (_239)
        {
            _241 = subgroupExclusiveOr(_225);
        }
        else
        {
            _241 = _229;
        }
        if (_239)
        {
            break;
        }
        else
        {
            continue;
        }
    }
    return _241;
}

uint WaveMultiPrefixBitAnd(uint _270, uvec4 _271)
{
    uvec4 _280 = subgroupBallot(true);
    uvec4 _281 = _280 & _271;
    bool _284;
    uint _286;
    for (;;)
    {
        _284 = all(equal(_281, subgroupBroadcastFirst(_281)));
        if (_284)
        {
            _286 = subgroupExclusiveAnd(_270);
        }
        else
        {
            _286 = _274;
        }
        if (_284)
        {
            break;
        }
        else
        {
            continue;
        }
    }
    return _286;
}

uint WaveMultiPrefixBitXor(uint _316, uvec4 _317)
{
    uvec4 _326 = subgroupBallot(true);
    uvec4 _327 = _326 & _317;
    bool _330;
    uint _332;
    for (;;)
    {
        _330 = all(equal(_327, subgroupBroadcastFirst(_327)));
        if (_330)
        {
            _332 = subgroupExclusiveXor(_316);
        }
        else
        {
            _332 = _320;
        }
        if (_330)
        {
            break;
        }
        else
        {
            continue;
        }
    }
    return _332;
}

void main()
{
    uint _19 = THR * 4u;
    uint _67 = THR * 7u;
    imageStore(_12, int(THR * 7u), uvec4(WaveMultiPrefixSum(texelFetch(_8, int(THR)).x, uvec4(uvec4(texelFetch(_9, int(_19)).x, texelFetch(_9, int(_19 + 1u)).x, texelFetch(_9, int(_19 + 2u)).x, texelFetch(_9, int(_19 + 3u)).x)))));
    uint _71 = THR * 4u;
    imageStore(_12, int((THR * 7u) + 1u), uvec4(uint(WaveMultiPrefixSum(uintBitsToFloat(texelFetch(_8, int(THR)).x), uvec4(uvec4(texelFetch(_9, int(_71)).x, texelFetch(_9, int(_71 + 1u)).x, texelFetch(_9, int(_71 + 2u)).x, texelFetch(_9, int(_71 + 3u)).x))))));
    uint _118 = THR * 4u;
    imageStore(_12, int((THR * 7u) + 2u), uvec4(WaveMultiPrefixProduct(texelFetch(_8, int(THR)).x, uvec4(uvec4(texelFetch(_9, int(_118)).x, texelFetch(_9, int(_118 + 1u)).x, texelFetch(_9, int(_118 + 2u)).x, texelFetch(_9, int(_118 + 3u)).x)))));
    uint _161 = THR * 4u;
    imageStore(_12, int((THR * 7u) + 3u), uvec4(uint(WaveMultiPrefixProduct(uintBitsToFloat(texelFetch(_8, int(THR)).x), uvec4(uvec4(texelFetch(_9, int(_161)).x, texelFetch(_9, int(_161 + 1u)).x, texelFetch(_9, int(_161 + 2u)).x, texelFetch(_9, int(_161 + 3u)).x))))));
    uint _206 = THR * 4u;
    imageStore(_12, int((THR * 7u) + 4u), uvec4(WaveMultiPrefixBitOr(texelFetch(_8, int(THR)).x, uvec4(uvec4(texelFetch(_9, int(_206)).x, texelFetch(_9, int(_206 + 1u)).x, texelFetch(_9, int(_206 + 2u)).x, texelFetch(_9, int(_206 + 3u)).x)))));
    uint _249 = THR * 4u;
    imageStore(_12, int((THR * 7u) + 5u), uvec4(WaveMultiPrefixBitAnd(uint(int(uintBitsToFloat(texelFetch(_8, int(THR)).x))), uvec4(uvec4(texelFetch(_9, int(_249)).x, texelFetch(_9, int(_249 + 1u)).x, texelFetch(_9, int(_249 + 2u)).x, texelFetch(_9, int(_249 + 3u)).x)))));
    uint _295 = THR * 4u;
    imageStore(_12, int((THR * 7u) + 6u), uvec4(WaveMultiPrefixBitXor(uint(int(uintBitsToFloat(texelFetch(_8, int(THR)).x))), uvec4(uvec4(texelFetch(_9, int(_295)).x, texelFetch(_9, int(_295 + 1u)).x, texelFetch(_9, int(_295 + 2u)).x, texelFetch(_9, int(_295 + 3u)).x)))));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 343
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability GroupNonUniformArithmetic
OpCapability GroupNonUniformBallot
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "THR"
OpName %48 "WaveMultiPrefixSum"
OpName %95 "WaveMultiPrefixSum"
OpName %139 "WaveMultiPrefixProduct"
OpName %183 "WaveMultiPrefixProduct"
OpName %227 "WaveMultiPrefixBitOr"
OpName %272 "WaveMultiPrefixBitAnd"
OpName %318 "WaveMultiPrefixBitXor"
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
%45 = OpTypeFunction %5 %5 %21
%57 = OpConstantTrue %43
%68 = OpConstant %5 7
%90 = OpTypeFloat 32
%92 = OpTypeFunction %90 %90 %21
%291 = OpConstant %5 5
%337 = OpConstant %5 6
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %341
%341 = OpLabel
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
%66 = OpCompositeConstruct %21 %37 %38 %39 %40
%65 = OpFunctionCall %5 %48 %42 %66
%67 = OpIMul %5 %18 %68
%69 = OpIMul %5 %18 %68
%70 = OpCompositeConstruct %21 %65 %65 %65 %65
OpImageWrite %15 %69 %70
%71 = OpIMul %5 %18 %20
%72 = OpImageFetch %21 %16 %71
%73 = OpCompositeExtract %5 %72 0
%75 = OpIAdd %5 %71 %26
%74 = OpImageFetch %21 %16 %75
%76 = OpCompositeExtract %5 %74 0
%78 = OpIAdd %5 %71 %30
%77 = OpImageFetch %21 %16 %78
%79 = OpCompositeExtract %5 %77 0
%81 = OpIAdd %5 %71 %34
%80 = OpImageFetch %21 %16 %81
%82 = OpCompositeExtract %5 %80 0
%83 = OpCompositeConstruct %21 %73 %76 %79 %82
%84 = OpCompositeExtract %5 %83 0
%85 = OpCompositeExtract %5 %83 1
%86 = OpCompositeExtract %5 %83 2
%87 = OpCompositeExtract %5 %83 3
%88 = OpImageFetch %21 %17 %18
%89 = OpCompositeExtract %5 %88 0
%91 = OpBitcast %90 %89
%112 = OpCompositeConstruct %21 %84 %85 %86 %87
%111 = OpFunctionCall %90 %95 %91 %112
%113 = OpConvertFToU %5 %111
%114 = OpIAdd %5 %67 %26
%115 = OpIMul %5 %18 %68
%116 = OpIAdd %5 %115 %26
%117 = OpCompositeConstruct %21 %113 %113 %113 %113
OpImageWrite %15 %116 %117
%118 = OpIMul %5 %18 %20
%119 = OpImageFetch %21 %16 %118
%120 = OpCompositeExtract %5 %119 0
%122 = OpIAdd %5 %118 %26
%121 = OpImageFetch %21 %16 %122
%123 = OpCompositeExtract %5 %121 0
%125 = OpIAdd %5 %118 %30
%124 = OpImageFetch %21 %16 %125
%126 = OpCompositeExtract %5 %124 0
%128 = OpIAdd %5 %118 %34
%127 = OpImageFetch %21 %16 %128
%129 = OpCompositeExtract %5 %127 0
%130 = OpCompositeConstruct %21 %120 %123 %126 %129
%131 = OpCompositeExtract %5 %130 0
%132 = OpCompositeExtract %5 %130 1
%133 = OpCompositeExtract %5 %130 2
%134 = OpCompositeExtract %5 %130 3
%135 = OpImageFetch %21 %17 %18
%136 = OpCompositeExtract %5 %135 0
%156 = OpCompositeConstruct %21 %131 %132 %133 %134
%155 = OpFunctionCall %5 %139 %136 %156
%157 = OpIAdd %5 %67 %30
%158 = OpIMul %5 %18 %68
%159 = OpIAdd %5 %158 %30
%160 = OpCompositeConstruct %21 %155 %155 %155 %155
OpImageWrite %15 %159 %160
%161 = OpIMul %5 %18 %20
%162 = OpImageFetch %21 %16 %161
%163 = OpCompositeExtract %5 %162 0
%165 = OpIAdd %5 %161 %26
%164 = OpImageFetch %21 %16 %165
%166 = OpCompositeExtract %5 %164 0
%168 = OpIAdd %5 %161 %30
%167 = OpImageFetch %21 %16 %168
%169 = OpCompositeExtract %5 %167 0
%171 = OpIAdd %5 %161 %34
%170 = OpImageFetch %21 %16 %171
%172 = OpCompositeExtract %5 %170 0
%173 = OpCompositeConstruct %21 %163 %166 %169 %172
%174 = OpCompositeExtract %5 %173 0
%175 = OpCompositeExtract %5 %173 1
%176 = OpCompositeExtract %5 %173 2
%177 = OpCompositeExtract %5 %173 3
%178 = OpImageFetch %21 %17 %18
%179 = OpCompositeExtract %5 %178 0
%180 = OpBitcast %90 %179
%200 = OpCompositeConstruct %21 %174 %175 %176 %177
%199 = OpFunctionCall %90 %183 %180 %200
%201 = OpConvertFToU %5 %199
%202 = OpIAdd %5 %67 %34
%203 = OpIMul %5 %18 %68
%204 = OpIAdd %5 %203 %34
%205 = OpCompositeConstruct %21 %201 %201 %201 %201
OpImageWrite %15 %204 %205
%206 = OpIMul %5 %18 %20
%207 = OpImageFetch %21 %16 %206
%208 = OpCompositeExtract %5 %207 0
%210 = OpIAdd %5 %206 %26
%209 = OpImageFetch %21 %16 %210
%211 = OpCompositeExtract %5 %209 0
%213 = OpIAdd %5 %206 %30
%212 = OpImageFetch %21 %16 %213
%214 = OpCompositeExtract %5 %212 0
%216 = OpIAdd %5 %206 %34
%215 = OpImageFetch %21 %16 %216
%217 = OpCompositeExtract %5 %215 0
%218 = OpCompositeConstruct %21 %208 %211 %214 %217
%219 = OpCompositeExtract %5 %218 0
%220 = OpCompositeExtract %5 %218 1
%221 = OpCompositeExtract %5 %218 2
%222 = OpCompositeExtract %5 %218 3
%223 = OpImageFetch %21 %17 %18
%224 = OpCompositeExtract %5 %223 0
%244 = OpCompositeConstruct %21 %219 %220 %221 %222
%243 = OpFunctionCall %5 %227 %224 %244
%245 = OpIAdd %5 %67 %20
%246 = OpIMul %5 %18 %68
%247 = OpIAdd %5 %246 %20
%248 = OpCompositeConstruct %21 %243 %243 %243 %243
OpImageWrite %15 %247 %248
%249 = OpIMul %5 %18 %20
%250 = OpImageFetch %21 %16 %249
%251 = OpCompositeExtract %5 %250 0
%253 = OpIAdd %5 %249 %26
%252 = OpImageFetch %21 %16 %253
%254 = OpCompositeExtract %5 %252 0
%256 = OpIAdd %5 %249 %30
%255 = OpImageFetch %21 %16 %256
%257 = OpCompositeExtract %5 %255 0
%259 = OpIAdd %5 %249 %34
%258 = OpImageFetch %21 %16 %259
%260 = OpCompositeExtract %5 %258 0
%261 = OpCompositeConstruct %21 %251 %254 %257 %260
%262 = OpCompositeExtract %5 %261 0
%263 = OpCompositeExtract %5 %261 1
%264 = OpCompositeExtract %5 %261 2
%265 = OpCompositeExtract %5 %261 3
%266 = OpImageFetch %21 %17 %18
%267 = OpCompositeExtract %5 %266 0
%268 = OpBitcast %90 %267
%269 = OpConvertFToS %5 %268
%289 = OpCompositeConstruct %21 %262 %263 %264 %265
%288 = OpFunctionCall %5 %272 %269 %289
%290 = OpIAdd %5 %67 %291
%292 = OpIMul %5 %18 %68
%293 = OpIAdd %5 %292 %291
%294 = OpCompositeConstruct %21 %288 %288 %288 %288
OpImageWrite %15 %293 %294
%295 = OpIMul %5 %18 %20
%296 = OpImageFetch %21 %16 %295
%297 = OpCompositeExtract %5 %296 0
%299 = OpIAdd %5 %295 %26
%298 = OpImageFetch %21 %16 %299
%300 = OpCompositeExtract %5 %298 0
%302 = OpIAdd %5 %295 %30
%301 = OpImageFetch %21 %16 %302
%303 = OpCompositeExtract %5 %301 0
%305 = OpIAdd %5 %295 %34
%304 = OpImageFetch %21 %16 %305
%306 = OpCompositeExtract %5 %304 0
%307 = OpCompositeConstruct %21 %297 %300 %303 %306
%308 = OpCompositeExtract %5 %307 0
%309 = OpCompositeExtract %5 %307 1
%310 = OpCompositeExtract %5 %307 2
%311 = OpCompositeExtract %5 %307 3
%312 = OpImageFetch %21 %17 %18
%313 = OpCompositeExtract %5 %312 0
%314 = OpBitcast %90 %313
%315 = OpConvertFToS %5 %314
%335 = OpCompositeConstruct %21 %308 %309 %310 %311
%334 = OpFunctionCall %5 %318 %315 %335
%336 = OpIAdd %5 %67 %337
%338 = OpIMul %5 %18 %68
%339 = OpIAdd %5 %338 %337
%340 = OpCompositeConstruct %21 %334 %334 %334 %334
OpImageWrite %15 %339 %340
OpReturn
OpFunctionEnd
%48 = OpFunction %5 None %45
%46 = OpFunctionParameter %5
%47 = OpFunctionParameter %21
%49 = OpLabel
%50 = OpUndef %5
%56 = OpGroupNonUniformBallot %21 %34 %57
%58 = OpBitwiseAnd %21 %56 %47
OpBranch %51
%51 = OpLabel
OpLoopMerge %53 %52 None
OpBranch %52
%52 = OpLabel
%59 = OpGroupNonUniformBroadcastFirst %21 %34 %58
%60 = OpIEqual %44 %58 %59
%61 = OpAll %43 %60
OpSelectionMerge %55 None
OpBranchConditional %61 %54 %55
%54 = OpLabel
%62 = OpGroupNonUniformIAdd %5 %34 ExclusiveScan %46
OpBranch %55
%55 = OpLabel
%63 = OpPhi %5 %62 %54 %50 %52
OpBranchConditional %61 %53 %51
%53 = OpLabel
OpReturnValue %63
OpFunctionEnd
%95 = OpFunction %90 None %92
%93 = OpFunctionParameter %90
%94 = OpFunctionParameter %21
%96 = OpLabel
%97 = OpUndef %90
%103 = OpGroupNonUniformBallot %21 %34 %57
%104 = OpBitwiseAnd %21 %103 %94
OpBranch %98
%98 = OpLabel
OpLoopMerge %100 %99 None
OpBranch %99
%99 = OpLabel
%105 = OpGroupNonUniformBroadcastFirst %21 %34 %104
%106 = OpIEqual %44 %104 %105
%107 = OpAll %43 %106
OpSelectionMerge %102 None
OpBranchConditional %107 %101 %102
%101 = OpLabel
%108 = OpGroupNonUniformFAdd %90 %34 ExclusiveScan %93
OpBranch %102
%102 = OpLabel
%109 = OpPhi %90 %108 %101 %97 %99
OpBranchConditional %107 %100 %98
%100 = OpLabel
OpReturnValue %109
OpFunctionEnd
%139 = OpFunction %5 None %45
%137 = OpFunctionParameter %5
%138 = OpFunctionParameter %21
%140 = OpLabel
%141 = OpUndef %5
%147 = OpGroupNonUniformBallot %21 %34 %57
%148 = OpBitwiseAnd %21 %147 %138
OpBranch %142
%142 = OpLabel
OpLoopMerge %144 %143 None
OpBranch %143
%143 = OpLabel
%149 = OpGroupNonUniformBroadcastFirst %21 %34 %148
%150 = OpIEqual %44 %148 %149
%151 = OpAll %43 %150
OpSelectionMerge %146 None
OpBranchConditional %151 %145 %146
%145 = OpLabel
%152 = OpGroupNonUniformIMul %5 %34 ExclusiveScan %137
OpBranch %146
%146 = OpLabel
%153 = OpPhi %5 %152 %145 %141 %143
OpBranchConditional %151 %144 %142
%144 = OpLabel
OpReturnValue %153
OpFunctionEnd
%183 = OpFunction %90 None %92
%181 = OpFunctionParameter %90
%182 = OpFunctionParameter %21
%184 = OpLabel
%185 = OpUndef %90
%191 = OpGroupNonUniformBallot %21 %34 %57
%192 = OpBitwiseAnd %21 %191 %182
OpBranch %186
%186 = OpLabel
OpLoopMerge %188 %187 None
OpBranch %187
%187 = OpLabel
%193 = OpGroupNonUniformBroadcastFirst %21 %34 %192
%194 = OpIEqual %44 %192 %193
%195 = OpAll %43 %194
OpSelectionMerge %190 None
OpBranchConditional %195 %189 %190
%189 = OpLabel
%196 = OpGroupNonUniformFMul %90 %34 ExclusiveScan %181
OpBranch %190
%190 = OpLabel
%197 = OpPhi %90 %196 %189 %185 %187
OpBranchConditional %195 %188 %186
%188 = OpLabel
OpReturnValue %197
OpFunctionEnd
%227 = OpFunction %5 None %45
%225 = OpFunctionParameter %5
%226 = OpFunctionParameter %21
%228 = OpLabel
%229 = OpUndef %5
%235 = OpGroupNonUniformBallot %21 %34 %57
%236 = OpBitwiseAnd %21 %235 %226
OpBranch %230
%230 = OpLabel
OpLoopMerge %232 %231 None
OpBranch %231
%231 = OpLabel
%237 = OpGroupNonUniformBroadcastFirst %21 %34 %236
%238 = OpIEqual %44 %236 %237
%239 = OpAll %43 %238
OpSelectionMerge %234 None
OpBranchConditional %239 %233 %234
%233 = OpLabel
%240 = OpGroupNonUniformBitwiseOr %5 %34 ExclusiveScan %225
OpBranch %234
%234 = OpLabel
%241 = OpPhi %5 %240 %233 %229 %231
OpBranchConditional %239 %232 %230
%232 = OpLabel
OpReturnValue %241
OpFunctionEnd
%272 = OpFunction %5 None %45
%270 = OpFunctionParameter %5
%271 = OpFunctionParameter %21
%273 = OpLabel
%274 = OpUndef %5
%280 = OpGroupNonUniformBallot %21 %34 %57
%281 = OpBitwiseAnd %21 %280 %271
OpBranch %275
%275 = OpLabel
OpLoopMerge %277 %276 None
OpBranch %276
%276 = OpLabel
%282 = OpGroupNonUniformBroadcastFirst %21 %34 %281
%283 = OpIEqual %44 %281 %282
%284 = OpAll %43 %283
OpSelectionMerge %279 None
OpBranchConditional %284 %278 %279
%278 = OpLabel
%285 = OpGroupNonUniformBitwiseAnd %5 %34 ExclusiveScan %270
OpBranch %279
%279 = OpLabel
%286 = OpPhi %5 %285 %278 %274 %276
OpBranchConditional %284 %277 %275
%277 = OpLabel
OpReturnValue %286
OpFunctionEnd
%318 = OpFunction %5 None %45
%316 = OpFunctionParameter %5
%317 = OpFunctionParameter %21
%319 = OpLabel
%320 = OpUndef %5
%326 = OpGroupNonUniformBallot %21 %34 %57
%327 = OpBitwiseAnd %21 %326 %317
OpBranch %321
%321 = OpLabel
OpLoopMerge %323 %322 None
OpBranch %322
%322 = OpLabel
%328 = OpGroupNonUniformBroadcastFirst %21 %34 %327
%329 = OpIEqual %44 %327 %328
%330 = OpAll %43 %329
OpSelectionMerge %325 None
OpBranchConditional %330 %324 %325
%324 = OpLabel
%331 = OpGroupNonUniformBitwiseXor %5 %34 ExclusiveScan %316
OpBranch %325
%325 = OpLabel
%332 = OpPhi %5 %331 %324 %320 %322
OpBranchConditional %330 %323 %321
%323 = OpLabel
OpReturnValue %332
OpFunctionEnd
#endif
