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
#extension GL_EXT_demote_to_helper_invocation : require

vec3 _37;
f16vec2 _45;
uvec4 _59;
uvec3 _297;
uvec2 _336;

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

vec3 WaveMultiPrefixSum(vec3 _85, uvec4 _86, bool _87)
{
    vec3 _104;
    if (_87)
    {
        _104 = _37;
    }
    else
    {
        uvec4 _97 = subgroupBallot(true);
        uvec4 _98 = _97 & _86;
        bool _101;
        vec3 _103;
        for (;;)
        {
            _101 = all(equal(_98, subgroupBroadcastFirst(_98)));
            if (_101)
            {
                _103 = subgroupExclusiveAdd(_85);
            }
            else
            {
                _103 = _37;
            }
            if (_101)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _104 = _103;
    }
    return _104;
}

f16vec2 WaveMultiPrefixSum(f16vec2 _124, uvec4 _125, bool _126)
{
    f16vec2 _143;
    if (_126)
    {
        _143 = _45;
    }
    else
    {
        uvec4 _136 = subgroupBallot(true);
        uvec4 _137 = _136 & _125;
        bool _140;
        f16vec2 _142;
        for (;;)
        {
            _140 = all(equal(_137, subgroupBroadcastFirst(_137)));
            if (_140)
            {
                _142 = subgroupExclusiveAdd(_124);
            }
            else
            {
                _142 = _45;
            }
            if (_140)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _143 = _142;
    }
    return _143;
}

uvec4 WaveMultiPrefixProduct(uvec4 _160, uvec4 _161, bool _162)
{
    uvec4 _179;
    if (_162)
    {
        _179 = _59;
    }
    else
    {
        uvec4 _172 = subgroupBallot(true);
        uvec4 _173 = _172 & _161;
        bool _176;
        uvec4 _178;
        for (;;)
        {
            _176 = all(equal(_173, subgroupBroadcastFirst(_173)));
            if (_176)
            {
                _178 = subgroupExclusiveMul(_160);
            }
            else
            {
                _178 = _59;
            }
            if (_176)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _179 = _178;
    }
    return _179;
}

vec3 WaveMultiPrefixProduct(vec3 _187, uvec4 _188, bool _189)
{
    vec3 _206;
    if (_189)
    {
        _206 = _37;
    }
    else
    {
        uvec4 _199 = subgroupBallot(true);
        uvec4 _200 = _199 & _188;
        bool _203;
        vec3 _205;
        for (;;)
        {
            _203 = all(equal(_200, subgroupBroadcastFirst(_200)));
            if (_203)
            {
                _205 = subgroupExclusiveMul(_187);
            }
            else
            {
                _205 = _37;
            }
            if (_203)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _206 = _205;
    }
    return _206;
}

f16vec2 WaveMultiPrefixProduct(f16vec2 _225, uvec4 _226, bool _227)
{
    f16vec2 _244;
    if (_227)
    {
        _244 = _45;
    }
    else
    {
        uvec4 _237 = subgroupBallot(true);
        uvec4 _238 = _237 & _226;
        bool _241;
        f16vec2 _243;
        for (;;)
        {
            _241 = all(equal(_238, subgroupBroadcastFirst(_238)));
            if (_241)
            {
                _243 = subgroupExclusiveMul(_225);
            }
            else
            {
                _243 = _45;
            }
            if (_241)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _244 = _243;
    }
    return _244;
}

uvec4 WaveMultiPrefixBitOr(uvec4 _261, uvec4 _262, bool _263)
{
    uvec4 _280;
    if (_263)
    {
        _280 = _59;
    }
    else
    {
        uvec4 _273 = subgroupBallot(true);
        uvec4 _274 = _273 & _262;
        bool _277;
        uvec4 _279;
        for (;;)
        {
            _277 = all(equal(_274, subgroupBroadcastFirst(_274)));
            if (_277)
            {
                _279 = subgroupExclusiveOr(_261);
            }
            else
            {
                _279 = _59;
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

uvec3 WaveMultiPrefixBitAnd(uvec3 _292, uvec4 _293, bool _294)
{
    uvec3 _312;
    if (_294)
    {
        _312 = _297;
    }
    else
    {
        uvec4 _305 = subgroupBallot(true);
        uvec4 _306 = _305 & _293;
        bool _309;
        uvec3 _311;
        for (;;)
        {
            _309 = all(equal(_306, subgroupBroadcastFirst(_306)));
            if (_309)
            {
                _311 = subgroupExclusiveAnd(_292);
            }
            else
            {
                _311 = _297;
            }
            if (_309)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _312 = _311;
    }
    return _312;
}

uvec2 WaveMultiPrefixBitXor(uvec2 _331, uvec4 _332, bool _333)
{
    uvec2 _351;
    if (_333)
    {
        _351 = _336;
    }
    else
    {
        uvec4 _344 = subgroupBallot(true);
        uvec4 _345 = _344 & _332;
        bool _348;
        uvec2 _350;
        for (;;)
        {
            _348 = all(equal(_345, subgroupBroadcastFirst(_345)));
            if (_348)
            {
                _350 = subgroupExclusiveXor(_331);
            }
            else
            {
                _350 = _336;
            }
            if (_348)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _351 = _350;
    }
    return _351;
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
    bool _79 = helperInvocationEXT();
    uint _80 = THR * 9u;
    _18._m0[THR * 9u] = WaveMultiPrefixSum(_10._m0[THR], uvec4(_14._m0[THR]), _79);
    bool _107 = helperInvocationEXT();
    vec3 _105 = WaveMultiPrefixSum(_36, uvec4(_14._m0[THR]), _107);
    uvec4 _114;
    _114.x = uint(_105.x);
    _114.y = uint(_105.y);
    _114.z = uint(_105.z);
    _114.w = 0u;
    _18._m0[(THR * 9u) + 1u] = _114;
    bool _146 = helperInvocationEXT();
    f16vec2 _144 = WaveMultiPrefixSum(_44, uvec4(_14._m0[THR]), _146);
    uvec4 _151;
    _151.x = uint(_144.x);
    _151.y = uint(_144.y);
    _151.z = 0u;
    _151.w = 0u;
    _18._m0[(THR * 9u) + 2u] = _151;
    bool _182 = helperInvocationEXT();
    _18._m0[(THR * 9u) + 3u] = WaveMultiPrefixProduct(_10._m0[THR], uvec4(_14._m0[THR]), _182);
    bool _209 = helperInvocationEXT();
    vec3 _207 = WaveMultiPrefixProduct(_36, uvec4(_14._m0[THR]), _209);
    uvec4 _216;
    _216.x = uint(_207.x);
    _216.y = uint(_207.y);
    _216.z = uint(_207.z);
    _216.w = 0u;
    _18._m0[(THR * 9u) + 4u] = _216;
    bool _247 = helperInvocationEXT();
    f16vec2 _245 = WaveMultiPrefixProduct(_44, uvec4(_14._m0[THR]), _247);
    uvec4 _252;
    _252.x = uint(_245.x);
    _252.y = uint(_245.y);
    _252.z = 0u;
    _252.w = 0u;
    _18._m0[(THR * 9u) + 5u] = _252;
    bool _283 = helperInvocationEXT();
    _18._m0[(THR * 9u) + 6u] = WaveMultiPrefixBitOr(_10._m0[THR], uvec4(_14._m0[THR]), _283);
    bool _315 = helperInvocationEXT();
    uvec3 _313 = WaveMultiPrefixBitAnd(uvec3(ivec3(_36)), uvec4(_14._m0[THR]), _315);
    uvec4 _319;
    _319.x = _313.x;
    _319.y = _313.y;
    _319.z = _313.z;
    _319.w = 0u;
    _18._m0[(THR * 9u) + 7u] = _319;
    bool _354 = helperInvocationEXT();
    uvec2 _352 = WaveMultiPrefixBitXor(uvec2(ivec2(_44)), uvec4(_14._m0[THR]), _354);
    uvec4 _357;
    _357.x = _352.x;
    _357.y = _352.y;
    _357.z = 0u;
    _357.w = 0u;
    _18._m0[(THR * 9u) + 8u] = _357;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 367
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability GroupNonUniformArithmetic
OpCapability GroupNonUniformBallot
OpCapability DenormPreserve
OpCapability VulkanMemoryModel
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %10 %14 %18 %20
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %8 "SSBO"
OpName %12 "SSBO"
OpName %16 "SSBO"
OpName %20 "THR"
OpName %57 "WaveMultiPrefixSum"
OpName %88 "WaveMultiPrefixSum"
OpName %127 "WaveMultiPrefixSum"
OpName %163 "WaveMultiPrefixProduct"
OpName %190 "WaveMultiPrefixProduct"
OpName %228 "WaveMultiPrefixProduct"
OpName %264 "WaveMultiPrefixBitOr"
OpName %295 "WaveMultiPrefixBitAnd"
OpName %334 "WaveMultiPrefixBitXor"
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
%37 = OpUndef %35
%40 = OpTypeFloat 16
%43 = OpTypeVector %40 2
%45 = OpUndef %43
%51 = OpTypeBool
%52 = OpTypeVector %51 4
%53 = OpTypeFunction %6 %6 %6 %51
%59 = OpUndef %6
%68 = OpConstant %5 3
%69 = OpConstantTrue %51
%81 = OpConstant %5 9
%84 = OpTypeFunction %35 %35 %6 %51
%119 = OpConstant %5 1
%123 = OpTypeFunction %43 %43 %6 %51
%156 = OpConstant %5 2
%221 = OpConstant %5 4
%257 = OpConstant %5 5
%285 = OpConstant %5 6
%289 = OpTypeVector %5 3
%291 = OpTypeFunction %289 %289 %6 %51
%297 = OpUndef %289
%324 = OpConstant %5 7
%328 = OpTypeVector %5 2
%330 = OpTypeFunction %328 %328 %6 %51
%336 = OpUndef %328
%362 = OpConstant %5 8
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %366
%366 = OpLabel
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
%78 = OpCompositeConstruct %6 %47 %48 %49 %50
%79 = OpIsHelperInvocationEXT %51
%77 = OpFunctionCall %6 %57 %27 %78 %79
%80 = OpIMul %5 %21 %81
%82 = OpIMul %5 %21 %81
%83 = OpAccessChain %22 %18 %24 %82
OpStore %83 %77 NonPrivatePointer
%106 = OpCompositeConstruct %6 %47 %48 %49 %50
%107 = OpIsHelperInvocationEXT %51
%105 = OpFunctionCall %35 %88 %39 %106 %107
%108 = OpCompositeExtract %31 %105 0
%109 = OpCompositeExtract %31 %105 1
%110 = OpCompositeExtract %31 %105 2
%111 = OpConvertFToU %5 %108
%112 = OpConvertFToU %5 %109
%113 = OpConvertFToU %5 %110
%114 = OpCompositeInsert %6 %111 %59 0
%115 = OpCompositeInsert %6 %112 %114 1
%116 = OpCompositeInsert %6 %113 %115 2
%117 = OpCompositeInsert %6 %24 %116 3
%118 = OpIAdd %5 %80 %119
%120 = OpIMul %5 %21 %81
%121 = OpIAdd %5 %120 %119
%122 = OpAccessChain %22 %18 %24 %121
OpStore %122 %117 NonPrivatePointer
%145 = OpCompositeConstruct %6 %47 %48 %49 %50
%146 = OpIsHelperInvocationEXT %51
%144 = OpFunctionCall %43 %127 %46 %145 %146
%147 = OpCompositeExtract %40 %144 0
%148 = OpCompositeExtract %40 %144 1
%149 = OpConvertFToU %5 %147
%150 = OpConvertFToU %5 %148
%151 = OpCompositeInsert %6 %149 %59 0
%152 = OpCompositeInsert %6 %150 %151 1
%153 = OpCompositeInsert %6 %24 %152 2
%154 = OpCompositeInsert %6 %24 %153 3
%155 = OpIAdd %5 %80 %156
%157 = OpIMul %5 %21 %81
%158 = OpIAdd %5 %157 %156
%159 = OpAccessChain %22 %18 %24 %158
OpStore %159 %154 NonPrivatePointer
%181 = OpCompositeConstruct %6 %47 %48 %49 %50
%182 = OpIsHelperInvocationEXT %51
%180 = OpFunctionCall %6 %163 %27 %181 %182
%183 = OpIAdd %5 %80 %68
%184 = OpIMul %5 %21 %81
%185 = OpIAdd %5 %184 %68
%186 = OpAccessChain %22 %18 %24 %185
OpStore %186 %180 NonPrivatePointer
%208 = OpCompositeConstruct %6 %47 %48 %49 %50
%209 = OpIsHelperInvocationEXT %51
%207 = OpFunctionCall %35 %190 %39 %208 %209
%210 = OpCompositeExtract %31 %207 0
%211 = OpCompositeExtract %31 %207 1
%212 = OpCompositeExtract %31 %207 2
%213 = OpConvertFToU %5 %210
%214 = OpConvertFToU %5 %211
%215 = OpConvertFToU %5 %212
%216 = OpCompositeInsert %6 %213 %59 0
%217 = OpCompositeInsert %6 %214 %216 1
%218 = OpCompositeInsert %6 %215 %217 2
%219 = OpCompositeInsert %6 %24 %218 3
%220 = OpIAdd %5 %80 %221
%222 = OpIMul %5 %21 %81
%223 = OpIAdd %5 %222 %221
%224 = OpAccessChain %22 %18 %24 %223
OpStore %224 %219 NonPrivatePointer
%246 = OpCompositeConstruct %6 %47 %48 %49 %50
%247 = OpIsHelperInvocationEXT %51
%245 = OpFunctionCall %43 %228 %46 %246 %247
%248 = OpCompositeExtract %40 %245 0
%249 = OpCompositeExtract %40 %245 1
%250 = OpConvertFToU %5 %248
%251 = OpConvertFToU %5 %249
%252 = OpCompositeInsert %6 %250 %59 0
%253 = OpCompositeInsert %6 %251 %252 1
%254 = OpCompositeInsert %6 %24 %253 2
%255 = OpCompositeInsert %6 %24 %254 3
%256 = OpIAdd %5 %80 %257
%258 = OpIMul %5 %21 %81
%259 = OpIAdd %5 %258 %257
%260 = OpAccessChain %22 %18 %24 %259
OpStore %260 %255 NonPrivatePointer
%282 = OpCompositeConstruct %6 %47 %48 %49 %50
%283 = OpIsHelperInvocationEXT %51
%281 = OpFunctionCall %6 %264 %27 %282 %283
%284 = OpIAdd %5 %80 %285
%286 = OpIMul %5 %21 %81
%287 = OpIAdd %5 %286 %285
%288 = OpAccessChain %22 %18 %24 %287
OpStore %288 %281 NonPrivatePointer
%290 = OpConvertFToS %289 %39
%314 = OpCompositeConstruct %6 %47 %48 %49 %50
%315 = OpIsHelperInvocationEXT %51
%313 = OpFunctionCall %289 %295 %290 %314 %315
%316 = OpCompositeExtract %5 %313 0
%317 = OpCompositeExtract %5 %313 1
%318 = OpCompositeExtract %5 %313 2
%319 = OpCompositeInsert %6 %316 %59 0
%320 = OpCompositeInsert %6 %317 %319 1
%321 = OpCompositeInsert %6 %318 %320 2
%322 = OpCompositeInsert %6 %24 %321 3
%323 = OpIAdd %5 %80 %324
%325 = OpIMul %5 %21 %81
%326 = OpIAdd %5 %325 %324
%327 = OpAccessChain %22 %18 %24 %326
OpStore %327 %322 NonPrivatePointer
%329 = OpConvertFToS %328 %46
%353 = OpCompositeConstruct %6 %47 %48 %49 %50
%354 = OpIsHelperInvocationEXT %51
%352 = OpFunctionCall %328 %334 %329 %353 %354
%355 = OpCompositeExtract %5 %352 0
%356 = OpCompositeExtract %5 %352 1
%357 = OpCompositeInsert %6 %355 %59 0
%358 = OpCompositeInsert %6 %356 %357 1
%359 = OpCompositeInsert %6 %24 %358 2
%360 = OpCompositeInsert %6 %24 %359 3
%361 = OpIAdd %5 %80 %362
%363 = OpIMul %5 %21 %81
%364 = OpIAdd %5 %363 %362
%365 = OpAccessChain %22 %18 %24 %364
OpStore %365 %360 NonPrivatePointer
OpReturn
OpFunctionEnd
%57 = OpFunction %6 None %53
%54 = OpFunctionParameter %6
%55 = OpFunctionParameter %6
%56 = OpFunctionParameter %51
%58 = OpLabel
OpSelectionMerge %66 None
OpBranchConditional %56 %66 %65
%65 = OpLabel
%67 = OpGroupNonUniformBallot %6 %68 %69
%70 = OpBitwiseAnd %6 %67 %55
OpBranch %60
%60 = OpLabel
OpLoopMerge %64 %61 None
OpBranch %61
%61 = OpLabel
%71 = OpGroupNonUniformBroadcastFirst %6 %68 %70
%72 = OpIEqual %52 %70 %71
%73 = OpAll %51 %72
OpSelectionMerge %63 None
OpBranchConditional %73 %62 %63
%62 = OpLabel
%74 = OpGroupNonUniformIAdd %6 %68 ExclusiveScan %54
OpBranch %63
%63 = OpLabel
%75 = OpPhi %6 %74 %62 %59 %61
OpBranchConditional %73 %64 %60
%64 = OpLabel
OpBranch %66
%66 = OpLabel
%76 = OpPhi %6 %75 %64 %59 %58
OpReturnValue %76
OpFunctionEnd
%88 = OpFunction %35 None %84
%85 = OpFunctionParameter %35
%86 = OpFunctionParameter %6
%87 = OpFunctionParameter %51
%89 = OpLabel
OpSelectionMerge %96 None
OpBranchConditional %87 %96 %95
%95 = OpLabel
%97 = OpGroupNonUniformBallot %6 %68 %69
%98 = OpBitwiseAnd %6 %97 %86
OpBranch %90
%90 = OpLabel
OpLoopMerge %94 %91 None
OpBranch %91
%91 = OpLabel
%99 = OpGroupNonUniformBroadcastFirst %6 %68 %98
%100 = OpIEqual %52 %98 %99
%101 = OpAll %51 %100
OpSelectionMerge %93 None
OpBranchConditional %101 %92 %93
%92 = OpLabel
%102 = OpGroupNonUniformFAdd %35 %68 ExclusiveScan %85
OpBranch %93
%93 = OpLabel
%103 = OpPhi %35 %102 %92 %37 %91
OpBranchConditional %101 %94 %90
%94 = OpLabel
OpBranch %96
%96 = OpLabel
%104 = OpPhi %35 %103 %94 %37 %89
OpReturnValue %104
OpFunctionEnd
%127 = OpFunction %43 None %123
%124 = OpFunctionParameter %43
%125 = OpFunctionParameter %6
%126 = OpFunctionParameter %51
%128 = OpLabel
OpSelectionMerge %135 None
OpBranchConditional %126 %135 %134
%134 = OpLabel
%136 = OpGroupNonUniformBallot %6 %68 %69
%137 = OpBitwiseAnd %6 %136 %125
OpBranch %129
%129 = OpLabel
OpLoopMerge %133 %130 None
OpBranch %130
%130 = OpLabel
%138 = OpGroupNonUniformBroadcastFirst %6 %68 %137
%139 = OpIEqual %52 %137 %138
%140 = OpAll %51 %139
OpSelectionMerge %132 None
OpBranchConditional %140 %131 %132
%131 = OpLabel
%141 = OpGroupNonUniformFAdd %43 %68 ExclusiveScan %124
OpBranch %132
%132 = OpLabel
%142 = OpPhi %43 %141 %131 %45 %130
OpBranchConditional %140 %133 %129
%133 = OpLabel
OpBranch %135
%135 = OpLabel
%143 = OpPhi %43 %142 %133 %45 %128
OpReturnValue %143
OpFunctionEnd
%163 = OpFunction %6 None %53
%160 = OpFunctionParameter %6
%161 = OpFunctionParameter %6
%162 = OpFunctionParameter %51
%164 = OpLabel
OpSelectionMerge %171 None
OpBranchConditional %162 %171 %170
%170 = OpLabel
%172 = OpGroupNonUniformBallot %6 %68 %69
%173 = OpBitwiseAnd %6 %172 %161
OpBranch %165
%165 = OpLabel
OpLoopMerge %169 %166 None
OpBranch %166
%166 = OpLabel
%174 = OpGroupNonUniformBroadcastFirst %6 %68 %173
%175 = OpIEqual %52 %173 %174
%176 = OpAll %51 %175
OpSelectionMerge %168 None
OpBranchConditional %176 %167 %168
%167 = OpLabel
%177 = OpGroupNonUniformIMul %6 %68 ExclusiveScan %160
OpBranch %168
%168 = OpLabel
%178 = OpPhi %6 %177 %167 %59 %166
OpBranchConditional %176 %169 %165
%169 = OpLabel
OpBranch %171
%171 = OpLabel
%179 = OpPhi %6 %178 %169 %59 %164
OpReturnValue %179
OpFunctionEnd
%190 = OpFunction %35 None %84
%187 = OpFunctionParameter %35
%188 = OpFunctionParameter %6
%189 = OpFunctionParameter %51
%191 = OpLabel
OpSelectionMerge %198 None
OpBranchConditional %189 %198 %197
%197 = OpLabel
%199 = OpGroupNonUniformBallot %6 %68 %69
%200 = OpBitwiseAnd %6 %199 %188
OpBranch %192
%192 = OpLabel
OpLoopMerge %196 %193 None
OpBranch %193
%193 = OpLabel
%201 = OpGroupNonUniformBroadcastFirst %6 %68 %200
%202 = OpIEqual %52 %200 %201
%203 = OpAll %51 %202
OpSelectionMerge %195 None
OpBranchConditional %203 %194 %195
%194 = OpLabel
%204 = OpGroupNonUniformFMul %35 %68 ExclusiveScan %187
OpBranch %195
%195 = OpLabel
%205 = OpPhi %35 %204 %194 %37 %193
OpBranchConditional %203 %196 %192
%196 = OpLabel
OpBranch %198
%198 = OpLabel
%206 = OpPhi %35 %205 %196 %37 %191
OpReturnValue %206
OpFunctionEnd
%228 = OpFunction %43 None %123
%225 = OpFunctionParameter %43
%226 = OpFunctionParameter %6
%227 = OpFunctionParameter %51
%229 = OpLabel
OpSelectionMerge %236 None
OpBranchConditional %227 %236 %235
%235 = OpLabel
%237 = OpGroupNonUniformBallot %6 %68 %69
%238 = OpBitwiseAnd %6 %237 %226
OpBranch %230
%230 = OpLabel
OpLoopMerge %234 %231 None
OpBranch %231
%231 = OpLabel
%239 = OpGroupNonUniformBroadcastFirst %6 %68 %238
%240 = OpIEqual %52 %238 %239
%241 = OpAll %51 %240
OpSelectionMerge %233 None
OpBranchConditional %241 %232 %233
%232 = OpLabel
%242 = OpGroupNonUniformFMul %43 %68 ExclusiveScan %225
OpBranch %233
%233 = OpLabel
%243 = OpPhi %43 %242 %232 %45 %231
OpBranchConditional %241 %234 %230
%234 = OpLabel
OpBranch %236
%236 = OpLabel
%244 = OpPhi %43 %243 %234 %45 %229
OpReturnValue %244
OpFunctionEnd
%264 = OpFunction %6 None %53
%261 = OpFunctionParameter %6
%262 = OpFunctionParameter %6
%263 = OpFunctionParameter %51
%265 = OpLabel
OpSelectionMerge %272 None
OpBranchConditional %263 %272 %271
%271 = OpLabel
%273 = OpGroupNonUniformBallot %6 %68 %69
%274 = OpBitwiseAnd %6 %273 %262
OpBranch %266
%266 = OpLabel
OpLoopMerge %270 %267 None
OpBranch %267
%267 = OpLabel
%275 = OpGroupNonUniformBroadcastFirst %6 %68 %274
%276 = OpIEqual %52 %274 %275
%277 = OpAll %51 %276
OpSelectionMerge %269 None
OpBranchConditional %277 %268 %269
%268 = OpLabel
%278 = OpGroupNonUniformBitwiseOr %6 %68 ExclusiveScan %261
OpBranch %269
%269 = OpLabel
%279 = OpPhi %6 %278 %268 %59 %267
OpBranchConditional %277 %270 %266
%270 = OpLabel
OpBranch %272
%272 = OpLabel
%280 = OpPhi %6 %279 %270 %59 %265
OpReturnValue %280
OpFunctionEnd
%295 = OpFunction %289 None %291
%292 = OpFunctionParameter %289
%293 = OpFunctionParameter %6
%294 = OpFunctionParameter %51
%296 = OpLabel
OpSelectionMerge %304 None
OpBranchConditional %294 %304 %303
%303 = OpLabel
%305 = OpGroupNonUniformBallot %6 %68 %69
%306 = OpBitwiseAnd %6 %305 %293
OpBranch %298
%298 = OpLabel
OpLoopMerge %302 %299 None
OpBranch %299
%299 = OpLabel
%307 = OpGroupNonUniformBroadcastFirst %6 %68 %306
%308 = OpIEqual %52 %306 %307
%309 = OpAll %51 %308
OpSelectionMerge %301 None
OpBranchConditional %309 %300 %301
%300 = OpLabel
%310 = OpGroupNonUniformBitwiseAnd %289 %68 ExclusiveScan %292
OpBranch %301
%301 = OpLabel
%311 = OpPhi %289 %310 %300 %297 %299
OpBranchConditional %309 %302 %298
%302 = OpLabel
OpBranch %304
%304 = OpLabel
%312 = OpPhi %289 %311 %302 %297 %296
OpReturnValue %312
OpFunctionEnd
%334 = OpFunction %328 None %330
%331 = OpFunctionParameter %328
%332 = OpFunctionParameter %6
%333 = OpFunctionParameter %51
%335 = OpLabel
OpSelectionMerge %343 None
OpBranchConditional %333 %343 %342
%342 = OpLabel
%344 = OpGroupNonUniformBallot %6 %68 %69
%345 = OpBitwiseAnd %6 %344 %332
OpBranch %337
%337 = OpLabel
OpLoopMerge %341 %338 None
OpBranch %338
%338 = OpLabel
%346 = OpGroupNonUniformBroadcastFirst %6 %68 %345
%347 = OpIEqual %52 %345 %346
%348 = OpAll %51 %347
OpSelectionMerge %340 None
OpBranchConditional %348 %339 %340
%339 = OpLabel
%349 = OpGroupNonUniformBitwiseXor %328 %68 ExclusiveScan %331
OpBranch %340
%340 = OpLabel
%350 = OpPhi %328 %349 %339 %336 %338
OpBranchConditional %348 %341 %337
%341 = OpLabel
OpBranch %343
%343 = OpLabel
%351 = OpPhi %328 %350 %341 %336 %335
OpReturnValue %351
OpFunctionEnd
#endif
