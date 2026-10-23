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
uvec4 _116;
uvec4 _59;
vec3 _90;
f16vec2 _131;
uvec4 _168;
vec3 _196;
f16vec2 _235;
uvec4 _272;
uvec3 _304;
uvec2 _343;

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
    vec3 _105;
    if (_87)
    {
        _105 = _90;
    }
    else
    {
        uvec4 _98 = subgroupBallot(true);
        uvec4 _99 = _98 & _86;
        bool _102;
        vec3 _104;
        for (;;)
        {
            _102 = all(equal(_99, subgroupBroadcastFirst(_99)));
            if (_102)
            {
                _104 = subgroupExclusiveAdd(_85);
            }
            else
            {
                _104 = _90;
            }
            if (_102)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _105 = _104;
    }
    return _105;
}

f16vec2 WaveMultiPrefixSum(f16vec2 _126, uvec4 _127, bool _128)
{
    f16vec2 _146;
    if (_128)
    {
        _146 = _131;
    }
    else
    {
        uvec4 _139 = subgroupBallot(true);
        uvec4 _140 = _139 & _127;
        bool _143;
        f16vec2 _145;
        for (;;)
        {
            _143 = all(equal(_140, subgroupBroadcastFirst(_140)));
            if (_143)
            {
                _145 = subgroupExclusiveAdd(_126);
            }
            else
            {
                _145 = _131;
            }
            if (_143)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _146 = _145;
    }
    return _146;
}

uvec4 WaveMultiPrefixProduct(uvec4 _163, uvec4 _164, bool _165)
{
    uvec4 _183;
    if (_165)
    {
        _183 = _168;
    }
    else
    {
        uvec4 _176 = subgroupBallot(true);
        uvec4 _177 = _176 & _164;
        bool _180;
        uvec4 _182;
        for (;;)
        {
            _180 = all(equal(_177, subgroupBroadcastFirst(_177)));
            if (_180)
            {
                _182 = subgroupExclusiveMul(_163);
            }
            else
            {
                _182 = _168;
            }
            if (_180)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _183 = _182;
    }
    return _183;
}

vec3 WaveMultiPrefixProduct(vec3 _191, uvec4 _192, bool _193)
{
    vec3 _211;
    if (_193)
    {
        _211 = _196;
    }
    else
    {
        uvec4 _204 = subgroupBallot(true);
        uvec4 _205 = _204 & _192;
        bool _208;
        vec3 _210;
        for (;;)
        {
            _208 = all(equal(_205, subgroupBroadcastFirst(_205)));
            if (_208)
            {
                _210 = subgroupExclusiveMul(_191);
            }
            else
            {
                _210 = _196;
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

f16vec2 WaveMultiPrefixProduct(f16vec2 _230, uvec4 _231, bool _232)
{
    f16vec2 _250;
    if (_232)
    {
        _250 = _235;
    }
    else
    {
        uvec4 _243 = subgroupBallot(true);
        uvec4 _244 = _243 & _231;
        bool _247;
        f16vec2 _249;
        for (;;)
        {
            _247 = all(equal(_244, subgroupBroadcastFirst(_244)));
            if (_247)
            {
                _249 = subgroupExclusiveMul(_230);
            }
            else
            {
                _249 = _235;
            }
            if (_247)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _250 = _249;
    }
    return _250;
}

uvec4 WaveMultiPrefixBitOr(uvec4 _267, uvec4 _268, bool _269)
{
    uvec4 _287;
    if (_269)
    {
        _287 = _272;
    }
    else
    {
        uvec4 _280 = subgroupBallot(true);
        uvec4 _281 = _280 & _268;
        bool _284;
        uvec4 _286;
        for (;;)
        {
            _284 = all(equal(_281, subgroupBroadcastFirst(_281)));
            if (_284)
            {
                _286 = subgroupExclusiveOr(_267);
            }
            else
            {
                _286 = _272;
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
        _287 = _286;
    }
    return _287;
}

uvec3 WaveMultiPrefixBitAnd(uvec3 _299, uvec4 _300, bool _301)
{
    uvec3 _319;
    if (_301)
    {
        _319 = _304;
    }
    else
    {
        uvec4 _312 = subgroupBallot(true);
        uvec4 _313 = _312 & _300;
        bool _316;
        uvec3 _318;
        for (;;)
        {
            _316 = all(equal(_313, subgroupBroadcastFirst(_313)));
            if (_316)
            {
                _318 = subgroupExclusiveAnd(_299);
            }
            else
            {
                _318 = _304;
            }
            if (_316)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _319 = _318;
    }
    return _319;
}

uvec2 WaveMultiPrefixBitXor(uvec2 _338, uvec4 _339, bool _340)
{
    uvec2 _358;
    if (_340)
    {
        _358 = _343;
    }
    else
    {
        uvec4 _351 = subgroupBallot(true);
        uvec4 _352 = _351 & _339;
        bool _355;
        uvec2 _357;
        for (;;)
        {
            _355 = all(equal(_352, subgroupBroadcastFirst(_352)));
            if (_355)
            {
                _357 = subgroupExclusiveXor(_338);
            }
            else
            {
                _357 = _343;
            }
            if (_355)
            {
                break;
            }
            else
            {
                continue;
            }
        }
        _358 = _357;
    }
    return _358;
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
    bool _108 = helperInvocationEXT();
    vec3 _106 = WaveMultiPrefixSum(_36, uvec4(_14._m0[THR]), _108);
    uvec4 _115;
    _115.x = uint(_106.x);
    _115.y = uint(_106.y);
    _115.z = uint(_106.z);
    _115.w = 0u;
    _18._m0[(THR * 9u) + 1u] = _115;
    bool _149 = helperInvocationEXT();
    f16vec2 _147 = WaveMultiPrefixSum(_44, uvec4(_14._m0[THR]), _149);
    uvec4 _154;
    _154.x = uint(_147.x);
    _154.y = uint(_147.y);
    _154.z = 0u;
    _154.w = 0u;
    _18._m0[(THR * 9u) + 2u] = _154;
    bool _186 = helperInvocationEXT();
    _18._m0[(THR * 9u) + 3u] = WaveMultiPrefixProduct(_10._m0[THR], uvec4(_14._m0[THR]), _186);
    bool _214 = helperInvocationEXT();
    vec3 _212 = WaveMultiPrefixProduct(_36, uvec4(_14._m0[THR]), _214);
    uvec4 _221;
    _221.x = uint(_212.x);
    _221.y = uint(_212.y);
    _221.z = uint(_212.z);
    _221.w = 0u;
    _18._m0[(THR * 9u) + 4u] = _221;
    bool _253 = helperInvocationEXT();
    f16vec2 _251 = WaveMultiPrefixProduct(_44, uvec4(_14._m0[THR]), _253);
    uvec4 _258;
    _258.x = uint(_251.x);
    _258.y = uint(_251.y);
    _258.z = 0u;
    _258.w = 0u;
    _18._m0[(THR * 9u) + 5u] = _258;
    bool _290 = helperInvocationEXT();
    _18._m0[(THR * 9u) + 6u] = WaveMultiPrefixBitOr(_10._m0[THR], uvec4(_14._m0[THR]), _290);
    bool _322 = helperInvocationEXT();
    uvec3 _320 = WaveMultiPrefixBitAnd(uvec3(ivec3(_36)), uvec4(_14._m0[THR]), _322);
    uvec4 _326;
    _326.x = _320.x;
    _326.y = _320.y;
    _326.z = _320.z;
    _326.w = 0u;
    _18._m0[(THR * 9u) + 7u] = _326;
    bool _361 = helperInvocationEXT();
    uvec2 _359 = WaveMultiPrefixBitXor(uvec2(ivec2(_44)), uvec4(_14._m0[THR]), _361);
    uvec4 _364;
    _364.x = _359.x;
    _364.y = _359.y;
    _364.z = 0u;
    _364.w = 0u;
    _18._m0[(THR * 9u) + 8u] = _364;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 374
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
OpName %129 "WaveMultiPrefixSum"
OpName %166 "WaveMultiPrefixProduct"
OpName %194 "WaveMultiPrefixProduct"
OpName %233 "WaveMultiPrefixProduct"
OpName %270 "WaveMultiPrefixBitOr"
OpName %302 "WaveMultiPrefixBitAnd"
OpName %341 "WaveMultiPrefixBitXor"
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
%40 = OpTypeFloat 16
%43 = OpTypeVector %40 2
%51 = OpTypeBool
%52 = OpTypeVector %51 4
%53 = OpTypeFunction %6 %6 %6 %51
%68 = OpConstant %5 3
%69 = OpConstantTrue %51
%81 = OpConstant %5 9
%84 = OpTypeFunction %35 %35 %6 %51
%121 = OpConstant %5 1
%125 = OpTypeFunction %43 %43 %6 %51
%159 = OpConstant %5 2
%226 = OpConstant %5 4
%263 = OpConstant %5 5
%292 = OpConstant %5 6
%296 = OpTypeVector %5 3
%298 = OpTypeFunction %296 %296 %6 %51
%331 = OpConstant %5 7
%335 = OpTypeVector %5 2
%337 = OpTypeFunction %335 %335 %6 %51
%369 = OpConstant %5 8
%3 = OpFunction %1 None %2
%4 = OpLabel
%37 = OpUndef %35
%45 = OpUndef %43
%116 = OpUndef %6
OpBranch %373
%373 = OpLabel
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
%107 = OpCompositeConstruct %6 %47 %48 %49 %50
%108 = OpIsHelperInvocationEXT %51
%106 = OpFunctionCall %35 %88 %39 %107 %108
%109 = OpCompositeExtract %31 %106 0
%110 = OpCompositeExtract %31 %106 1
%111 = OpCompositeExtract %31 %106 2
%112 = OpConvertFToU %5 %109
%113 = OpConvertFToU %5 %110
%114 = OpConvertFToU %5 %111
%115 = OpCompositeInsert %6 %112 %116 0
%117 = OpCompositeInsert %6 %113 %115 1
%118 = OpCompositeInsert %6 %114 %117 2
%119 = OpCompositeInsert %6 %24 %118 3
%120 = OpIAdd %5 %80 %121
%122 = OpIMul %5 %21 %81
%123 = OpIAdd %5 %122 %121
%124 = OpAccessChain %22 %18 %24 %123
OpStore %124 %119 NonPrivatePointer
%148 = OpCompositeConstruct %6 %47 %48 %49 %50
%149 = OpIsHelperInvocationEXT %51
%147 = OpFunctionCall %43 %129 %46 %148 %149
%150 = OpCompositeExtract %40 %147 0
%151 = OpCompositeExtract %40 %147 1
%152 = OpConvertFToU %5 %150
%153 = OpConvertFToU %5 %151
%154 = OpCompositeInsert %6 %152 %116 0
%155 = OpCompositeInsert %6 %153 %154 1
%156 = OpCompositeInsert %6 %24 %155 2
%157 = OpCompositeInsert %6 %24 %156 3
%158 = OpIAdd %5 %80 %159
%160 = OpIMul %5 %21 %81
%161 = OpIAdd %5 %160 %159
%162 = OpAccessChain %22 %18 %24 %161
OpStore %162 %157 NonPrivatePointer
%185 = OpCompositeConstruct %6 %47 %48 %49 %50
%186 = OpIsHelperInvocationEXT %51
%184 = OpFunctionCall %6 %166 %27 %185 %186
%187 = OpIAdd %5 %80 %68
%188 = OpIMul %5 %21 %81
%189 = OpIAdd %5 %188 %68
%190 = OpAccessChain %22 %18 %24 %189
OpStore %190 %184 NonPrivatePointer
%213 = OpCompositeConstruct %6 %47 %48 %49 %50
%214 = OpIsHelperInvocationEXT %51
%212 = OpFunctionCall %35 %194 %39 %213 %214
%215 = OpCompositeExtract %31 %212 0
%216 = OpCompositeExtract %31 %212 1
%217 = OpCompositeExtract %31 %212 2
%218 = OpConvertFToU %5 %215
%219 = OpConvertFToU %5 %216
%220 = OpConvertFToU %5 %217
%221 = OpCompositeInsert %6 %218 %116 0
%222 = OpCompositeInsert %6 %219 %221 1
%223 = OpCompositeInsert %6 %220 %222 2
%224 = OpCompositeInsert %6 %24 %223 3
%225 = OpIAdd %5 %80 %226
%227 = OpIMul %5 %21 %81
%228 = OpIAdd %5 %227 %226
%229 = OpAccessChain %22 %18 %24 %228
OpStore %229 %224 NonPrivatePointer
%252 = OpCompositeConstruct %6 %47 %48 %49 %50
%253 = OpIsHelperInvocationEXT %51
%251 = OpFunctionCall %43 %233 %46 %252 %253
%254 = OpCompositeExtract %40 %251 0
%255 = OpCompositeExtract %40 %251 1
%256 = OpConvertFToU %5 %254
%257 = OpConvertFToU %5 %255
%258 = OpCompositeInsert %6 %256 %116 0
%259 = OpCompositeInsert %6 %257 %258 1
%260 = OpCompositeInsert %6 %24 %259 2
%261 = OpCompositeInsert %6 %24 %260 3
%262 = OpIAdd %5 %80 %263
%264 = OpIMul %5 %21 %81
%265 = OpIAdd %5 %264 %263
%266 = OpAccessChain %22 %18 %24 %265
OpStore %266 %261 NonPrivatePointer
%289 = OpCompositeConstruct %6 %47 %48 %49 %50
%290 = OpIsHelperInvocationEXT %51
%288 = OpFunctionCall %6 %270 %27 %289 %290
%291 = OpIAdd %5 %80 %292
%293 = OpIMul %5 %21 %81
%294 = OpIAdd %5 %293 %292
%295 = OpAccessChain %22 %18 %24 %294
OpStore %295 %288 NonPrivatePointer
%297 = OpConvertFToS %296 %39
%321 = OpCompositeConstruct %6 %47 %48 %49 %50
%322 = OpIsHelperInvocationEXT %51
%320 = OpFunctionCall %296 %302 %297 %321 %322
%323 = OpCompositeExtract %5 %320 0
%324 = OpCompositeExtract %5 %320 1
%325 = OpCompositeExtract %5 %320 2
%326 = OpCompositeInsert %6 %323 %116 0
%327 = OpCompositeInsert %6 %324 %326 1
%328 = OpCompositeInsert %6 %325 %327 2
%329 = OpCompositeInsert %6 %24 %328 3
%330 = OpIAdd %5 %80 %331
%332 = OpIMul %5 %21 %81
%333 = OpIAdd %5 %332 %331
%334 = OpAccessChain %22 %18 %24 %333
OpStore %334 %329 NonPrivatePointer
%336 = OpConvertFToS %335 %46
%360 = OpCompositeConstruct %6 %47 %48 %49 %50
%361 = OpIsHelperInvocationEXT %51
%359 = OpFunctionCall %335 %341 %336 %360 %361
%362 = OpCompositeExtract %5 %359 0
%363 = OpCompositeExtract %5 %359 1
%364 = OpCompositeInsert %6 %362 %116 0
%365 = OpCompositeInsert %6 %363 %364 1
%366 = OpCompositeInsert %6 %24 %365 2
%367 = OpCompositeInsert %6 %24 %366 3
%368 = OpIAdd %5 %80 %369
%370 = OpIMul %5 %21 %81
%371 = OpIAdd %5 %370 %369
%372 = OpAccessChain %22 %18 %24 %371
OpStore %372 %367 NonPrivatePointer
OpReturn
OpFunctionEnd
%57 = OpFunction %6 None %53
%54 = OpFunctionParameter %6
%55 = OpFunctionParameter %6
%56 = OpFunctionParameter %51
%58 = OpLabel
%59 = OpUndef %6
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
%90 = OpUndef %35
OpSelectionMerge %97 None
OpBranchConditional %87 %97 %96
%96 = OpLabel
%98 = OpGroupNonUniformBallot %6 %68 %69
%99 = OpBitwiseAnd %6 %98 %86
OpBranch %91
%91 = OpLabel
OpLoopMerge %95 %92 None
OpBranch %92
%92 = OpLabel
%100 = OpGroupNonUniformBroadcastFirst %6 %68 %99
%101 = OpIEqual %52 %99 %100
%102 = OpAll %51 %101
OpSelectionMerge %94 None
OpBranchConditional %102 %93 %94
%93 = OpLabel
%103 = OpGroupNonUniformFAdd %35 %68 ExclusiveScan %85
OpBranch %94
%94 = OpLabel
%104 = OpPhi %35 %103 %93 %90 %92
OpBranchConditional %102 %95 %91
%95 = OpLabel
OpBranch %97
%97 = OpLabel
%105 = OpPhi %35 %104 %95 %90 %89
OpReturnValue %105
OpFunctionEnd
%129 = OpFunction %43 None %125
%126 = OpFunctionParameter %43
%127 = OpFunctionParameter %6
%128 = OpFunctionParameter %51
%130 = OpLabel
%131 = OpUndef %43
OpSelectionMerge %138 None
OpBranchConditional %128 %138 %137
%137 = OpLabel
%139 = OpGroupNonUniformBallot %6 %68 %69
%140 = OpBitwiseAnd %6 %139 %127
OpBranch %132
%132 = OpLabel
OpLoopMerge %136 %133 None
OpBranch %133
%133 = OpLabel
%141 = OpGroupNonUniformBroadcastFirst %6 %68 %140
%142 = OpIEqual %52 %140 %141
%143 = OpAll %51 %142
OpSelectionMerge %135 None
OpBranchConditional %143 %134 %135
%134 = OpLabel
%144 = OpGroupNonUniformFAdd %43 %68 ExclusiveScan %126
OpBranch %135
%135 = OpLabel
%145 = OpPhi %43 %144 %134 %131 %133
OpBranchConditional %143 %136 %132
%136 = OpLabel
OpBranch %138
%138 = OpLabel
%146 = OpPhi %43 %145 %136 %131 %130
OpReturnValue %146
OpFunctionEnd
%166 = OpFunction %6 None %53
%163 = OpFunctionParameter %6
%164 = OpFunctionParameter %6
%165 = OpFunctionParameter %51
%167 = OpLabel
%168 = OpUndef %6
OpSelectionMerge %175 None
OpBranchConditional %165 %175 %174
%174 = OpLabel
%176 = OpGroupNonUniformBallot %6 %68 %69
%177 = OpBitwiseAnd %6 %176 %164
OpBranch %169
%169 = OpLabel
OpLoopMerge %173 %170 None
OpBranch %170
%170 = OpLabel
%178 = OpGroupNonUniformBroadcastFirst %6 %68 %177
%179 = OpIEqual %52 %177 %178
%180 = OpAll %51 %179
OpSelectionMerge %172 None
OpBranchConditional %180 %171 %172
%171 = OpLabel
%181 = OpGroupNonUniformIMul %6 %68 ExclusiveScan %163
OpBranch %172
%172 = OpLabel
%182 = OpPhi %6 %181 %171 %168 %170
OpBranchConditional %180 %173 %169
%173 = OpLabel
OpBranch %175
%175 = OpLabel
%183 = OpPhi %6 %182 %173 %168 %167
OpReturnValue %183
OpFunctionEnd
%194 = OpFunction %35 None %84
%191 = OpFunctionParameter %35
%192 = OpFunctionParameter %6
%193 = OpFunctionParameter %51
%195 = OpLabel
%196 = OpUndef %35
OpSelectionMerge %203 None
OpBranchConditional %193 %203 %202
%202 = OpLabel
%204 = OpGroupNonUniformBallot %6 %68 %69
%205 = OpBitwiseAnd %6 %204 %192
OpBranch %197
%197 = OpLabel
OpLoopMerge %201 %198 None
OpBranch %198
%198 = OpLabel
%206 = OpGroupNonUniformBroadcastFirst %6 %68 %205
%207 = OpIEqual %52 %205 %206
%208 = OpAll %51 %207
OpSelectionMerge %200 None
OpBranchConditional %208 %199 %200
%199 = OpLabel
%209 = OpGroupNonUniformFMul %35 %68 ExclusiveScan %191
OpBranch %200
%200 = OpLabel
%210 = OpPhi %35 %209 %199 %196 %198
OpBranchConditional %208 %201 %197
%201 = OpLabel
OpBranch %203
%203 = OpLabel
%211 = OpPhi %35 %210 %201 %196 %195
OpReturnValue %211
OpFunctionEnd
%233 = OpFunction %43 None %125
%230 = OpFunctionParameter %43
%231 = OpFunctionParameter %6
%232 = OpFunctionParameter %51
%234 = OpLabel
%235 = OpUndef %43
OpSelectionMerge %242 None
OpBranchConditional %232 %242 %241
%241 = OpLabel
%243 = OpGroupNonUniformBallot %6 %68 %69
%244 = OpBitwiseAnd %6 %243 %231
OpBranch %236
%236 = OpLabel
OpLoopMerge %240 %237 None
OpBranch %237
%237 = OpLabel
%245 = OpGroupNonUniformBroadcastFirst %6 %68 %244
%246 = OpIEqual %52 %244 %245
%247 = OpAll %51 %246
OpSelectionMerge %239 None
OpBranchConditional %247 %238 %239
%238 = OpLabel
%248 = OpGroupNonUniformFMul %43 %68 ExclusiveScan %230
OpBranch %239
%239 = OpLabel
%249 = OpPhi %43 %248 %238 %235 %237
OpBranchConditional %247 %240 %236
%240 = OpLabel
OpBranch %242
%242 = OpLabel
%250 = OpPhi %43 %249 %240 %235 %234
OpReturnValue %250
OpFunctionEnd
%270 = OpFunction %6 None %53
%267 = OpFunctionParameter %6
%268 = OpFunctionParameter %6
%269 = OpFunctionParameter %51
%271 = OpLabel
%272 = OpUndef %6
OpSelectionMerge %279 None
OpBranchConditional %269 %279 %278
%278 = OpLabel
%280 = OpGroupNonUniformBallot %6 %68 %69
%281 = OpBitwiseAnd %6 %280 %268
OpBranch %273
%273 = OpLabel
OpLoopMerge %277 %274 None
OpBranch %274
%274 = OpLabel
%282 = OpGroupNonUniformBroadcastFirst %6 %68 %281
%283 = OpIEqual %52 %281 %282
%284 = OpAll %51 %283
OpSelectionMerge %276 None
OpBranchConditional %284 %275 %276
%275 = OpLabel
%285 = OpGroupNonUniformBitwiseOr %6 %68 ExclusiveScan %267
OpBranch %276
%276 = OpLabel
%286 = OpPhi %6 %285 %275 %272 %274
OpBranchConditional %284 %277 %273
%277 = OpLabel
OpBranch %279
%279 = OpLabel
%287 = OpPhi %6 %286 %277 %272 %271
OpReturnValue %287
OpFunctionEnd
%302 = OpFunction %296 None %298
%299 = OpFunctionParameter %296
%300 = OpFunctionParameter %6
%301 = OpFunctionParameter %51
%303 = OpLabel
%304 = OpUndef %296
OpSelectionMerge %311 None
OpBranchConditional %301 %311 %310
%310 = OpLabel
%312 = OpGroupNonUniformBallot %6 %68 %69
%313 = OpBitwiseAnd %6 %312 %300
OpBranch %305
%305 = OpLabel
OpLoopMerge %309 %306 None
OpBranch %306
%306 = OpLabel
%314 = OpGroupNonUniformBroadcastFirst %6 %68 %313
%315 = OpIEqual %52 %313 %314
%316 = OpAll %51 %315
OpSelectionMerge %308 None
OpBranchConditional %316 %307 %308
%307 = OpLabel
%317 = OpGroupNonUniformBitwiseAnd %296 %68 ExclusiveScan %299
OpBranch %308
%308 = OpLabel
%318 = OpPhi %296 %317 %307 %304 %306
OpBranchConditional %316 %309 %305
%309 = OpLabel
OpBranch %311
%311 = OpLabel
%319 = OpPhi %296 %318 %309 %304 %303
OpReturnValue %319
OpFunctionEnd
%341 = OpFunction %335 None %337
%338 = OpFunctionParameter %335
%339 = OpFunctionParameter %6
%340 = OpFunctionParameter %51
%342 = OpLabel
%343 = OpUndef %335
OpSelectionMerge %350 None
OpBranchConditional %340 %350 %349
%349 = OpLabel
%351 = OpGroupNonUniformBallot %6 %68 %69
%352 = OpBitwiseAnd %6 %351 %339
OpBranch %344
%344 = OpLabel
OpLoopMerge %348 %345 None
OpBranch %345
%345 = OpLabel
%353 = OpGroupNonUniformBroadcastFirst %6 %68 %352
%354 = OpIEqual %52 %352 %353
%355 = OpAll %51 %354
OpSelectionMerge %347 None
OpBranchConditional %355 %346 %347
%346 = OpLabel
%356 = OpGroupNonUniformBitwiseXor %335 %68 ExclusiveScan %338
OpBranch %347
%347 = OpLabel
%357 = OpPhi %335 %356 %346 %343 %345
OpBranchConditional %355 %348 %344
%348 = OpLabel
OpBranch %350
%350 = OpLabel
%358 = OpPhi %335 %357 %348 %343 %342
OpReturnValue %358
OpFunctionEnd
#endif
