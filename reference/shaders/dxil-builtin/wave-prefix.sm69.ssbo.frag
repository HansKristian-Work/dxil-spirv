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
uvec3 _68;
vec4 _101;
f16vec4 _140;

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
    _10._m0[INDEX * 2u] = uvec2(subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? uvec2(0u) : _38));
    _10._m0[(INDEX * 2u) + 1u] = uvec2(subgroupExclusiveMul((gl_HelperInvocation || discard_state) ? uvec2(1u) : _38));
    uint _66 = INDEX + 2u;
    uvec3 _67;
    _67.x = INDEX;
    _67.y = _36;
    _67.z = _66;
    _15._m0[INDEX * 2u] = uvec3(subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? uvec3(0u) : _67));
    _15._m0[(INDEX * 2u) + 1u] = uvec3(subgroupExclusiveMul((gl_HelperInvocation || discard_state) ? uvec3(1u) : _67));
    uint _97 = INDEX + 3u;
    vec4 _100;
    _100.x = float(INDEX);
    _100.y = float(_36);
    _100.z = float(_66);
    _100.w = float(_97);
    _20._m0[INDEX * 2u] = uvec4(floatBitsToUint(subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? vec4(0.0) : _100)));
    _20._m0[(INDEX * 2u) + 1u] = uvec4(floatBitsToUint(subgroupExclusiveMul((gl_HelperInvocation || discard_state) ? vec4(1.0) : _100)));
    f16vec4 _139;
    _139.x = float16_t(INDEX);
    _139.y = float16_t(_36);
    _139.z = float16_t(_66);
    _139.w = float16_t(_97);
    _26._m0[INDEX * 2u] = u16vec4(float16BitsToUint16(subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? f16vec4(float16_t(0.0)) : _139)));
    _26._m0[(INDEX * 2u) + 1u] = u16vec4(float16BitsToUint16(subgroupExclusiveMul((gl_HelperInvocation || discard_state) ? f16vec4(float16_t(1.0)) : _139)));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 202
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability GroupNonUniformArithmetic
OpCapability StorageBuffer16BitAccess
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %15 %20 %26 %28 %34 %177
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %8 "SSBO"
OpName %13 "SSBO"
OpName %18 "SSBO"
OpName %24 "SSBO"
OpName %28 "INDEX"
OpName %34 "discard_state"
OpName %194 "discard_exit"
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
OpDecorate %177 BuiltIn HelperInvocation
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
%49 = OpConstant %5 2
%53 = OpTypePointer StorageBuffer %6
%57 = OpConstantComposite %6 %37 %37
%73 = OpConstantComposite %11 %44 %44 %44
%80 = OpTypePointer StorageBuffer %11
%84 = OpConstantComposite %11 %37 %37 %37
%93 = OpTypeFloat 32
%99 = OpTypeVector %93 4
%107 = OpConstant %93 0
%108 = OpConstantComposite %99 %107 %107 %107 %107
%117 = OpTypePointer StorageBuffer %16
%121 = OpConstant %93 1
%122 = OpConstantComposite %99 %121 %121 %121 %121
%133 = OpTypeFloat 16
%138 = OpTypeVector %133 4
%146 = OpConstant %133 0x0p+0
%147 = OpConstantComposite %138 %146 %146 %146 %146
%156 = OpTypePointer StorageBuffer %22
%160 = OpConstant %133 0x1p+0
%161 = OpConstantComposite %138 %160 %160 %160 %160
%175 = OpConstantTrue %30
%176 = OpTypePointer Input %30
%177 = OpVariable %176 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %34 %35
%39 = OpUndef %6
%68 = OpUndef %11
%101 = OpUndef %99
%140 = OpUndef %138
OpBranch %172
%172 = OpLabel
%29 = OpLoad %5 %28
%31 = OpIEqual %30 %29 %32
OpSelectionMerge %174 None
OpBranchConditional %31 %173 %174
%173 = OpLabel
OpStore %34 %175
OpBranch %174
%174 = OpLabel
%36 = OpIAdd %5 %29 %37
%38 = OpCompositeInsert %6 %29 %39 0
%40 = OpCompositeInsert %6 %36 %38 1
%178 = OpLoad %30 %177
%179 = OpLoad %30 %34
%43 = OpLogicalOr %30 %178 %179
%46 = OpSelect %6 %43 %45 %40
%41 = OpGroupNonUniformIAdd %6 %42 ExclusiveScan %46
%47 = OpShiftLeftLogical %5 %29 %37
%48 = OpIMul %5 %29 %49
%50 = OpCompositeExtract %5 %41 0
%51 = OpCompositeExtract %5 %41 1
%52 = OpCompositeConstruct %6 %50 %51
%54 = OpAccessChain %53 %10 %44 %48
OpStore %54 %52
%180 = OpLoad %30 %177
%181 = OpLoad %30 %34
%56 = OpLogicalOr %30 %180 %181
%58 = OpSelect %6 %56 %57 %40
%55 = OpGroupNonUniformIMul %6 %42 ExclusiveScan %58
%59 = OpBitwiseOr %5 %47 %37
%60 = OpIMul %5 %29 %49
%61 = OpIAdd %5 %60 %37
%62 = OpCompositeExtract %5 %55 0
%63 = OpCompositeExtract %5 %55 1
%64 = OpCompositeConstruct %6 %62 %63
%65 = OpAccessChain %53 %10 %44 %61
OpStore %65 %64
%66 = OpIAdd %5 %29 %49
%67 = OpCompositeInsert %11 %29 %68 0
%69 = OpCompositeInsert %11 %36 %67 1
%70 = OpCompositeInsert %11 %66 %69 2
%182 = OpLoad %30 %177
%183 = OpLoad %30 %34
%72 = OpLogicalOr %30 %182 %183
%74 = OpSelect %11 %72 %73 %70
%71 = OpGroupNonUniformIAdd %11 %42 ExclusiveScan %74
%75 = OpIMul %5 %29 %49
%76 = OpCompositeExtract %5 %71 0
%77 = OpCompositeExtract %5 %71 1
%78 = OpCompositeExtract %5 %71 2
%79 = OpCompositeConstruct %11 %76 %77 %78
%81 = OpAccessChain %80 %15 %44 %75
OpStore %81 %79
%184 = OpLoad %30 %177
%185 = OpLoad %30 %34
%83 = OpLogicalOr %30 %184 %185
%85 = OpSelect %11 %83 %84 %70
%82 = OpGroupNonUniformIMul %11 %42 ExclusiveScan %85
%86 = OpIMul %5 %29 %49
%87 = OpIAdd %5 %86 %37
%88 = OpCompositeExtract %5 %82 0
%89 = OpCompositeExtract %5 %82 1
%90 = OpCompositeExtract %5 %82 2
%91 = OpCompositeConstruct %11 %88 %89 %90
%92 = OpAccessChain %80 %15 %44 %87
OpStore %92 %91
%94 = OpConvertUToF %93 %29
%95 = OpConvertUToF %93 %36
%96 = OpConvertUToF %93 %66
%97 = OpIAdd %5 %29 %42
%98 = OpConvertUToF %93 %97
%100 = OpCompositeInsert %99 %94 %101 0
%102 = OpCompositeInsert %99 %95 %100 1
%103 = OpCompositeInsert %99 %96 %102 2
%104 = OpCompositeInsert %99 %98 %103 3
%186 = OpLoad %30 %177
%187 = OpLoad %30 %34
%106 = OpLogicalOr %30 %186 %187
%109 = OpSelect %99 %106 %108 %104
%105 = OpGroupNonUniformFAdd %99 %42 ExclusiveScan %109
%110 = OpIMul %5 %29 %49
%111 = OpBitcast %16 %105
%112 = OpCompositeExtract %5 %111 0
%113 = OpCompositeExtract %5 %111 1
%114 = OpCompositeExtract %5 %111 2
%115 = OpCompositeExtract %5 %111 3
%116 = OpCompositeConstruct %16 %112 %113 %114 %115
%118 = OpAccessChain %117 %20 %44 %110
OpStore %118 %116
%188 = OpLoad %30 %177
%189 = OpLoad %30 %34
%120 = OpLogicalOr %30 %188 %189
%123 = OpSelect %99 %120 %122 %104
%119 = OpGroupNonUniformFMul %99 %42 ExclusiveScan %123
%124 = OpIMul %5 %29 %49
%125 = OpIAdd %5 %124 %37
%126 = OpBitcast %16 %119
%127 = OpCompositeExtract %5 %126 0
%128 = OpCompositeExtract %5 %126 1
%129 = OpCompositeExtract %5 %126 2
%130 = OpCompositeExtract %5 %126 3
%131 = OpCompositeConstruct %16 %127 %128 %129 %130
%132 = OpAccessChain %117 %20 %44 %125
OpStore %132 %131
%134 = OpConvertUToF %133 %29
%135 = OpConvertUToF %133 %36
%136 = OpConvertUToF %133 %66
%137 = OpConvertUToF %133 %97
%139 = OpCompositeInsert %138 %134 %140 0
%141 = OpCompositeInsert %138 %135 %139 1
%142 = OpCompositeInsert %138 %136 %141 2
%143 = OpCompositeInsert %138 %137 %142 3
%190 = OpLoad %30 %177
%191 = OpLoad %30 %34
%145 = OpLogicalOr %30 %190 %191
%148 = OpSelect %138 %145 %147 %143
%144 = OpGroupNonUniformFAdd %138 %42 ExclusiveScan %148
%149 = OpIMul %5 %29 %49
%150 = OpBitcast %22 %144
%151 = OpCompositeExtract %21 %150 0
%152 = OpCompositeExtract %21 %150 1
%153 = OpCompositeExtract %21 %150 2
%154 = OpCompositeExtract %21 %150 3
%155 = OpCompositeConstruct %22 %151 %152 %153 %154
%157 = OpAccessChain %156 %26 %44 %149
OpStore %157 %155
%192 = OpLoad %30 %177
%193 = OpLoad %30 %34
%159 = OpLogicalOr %30 %192 %193
%162 = OpSelect %138 %159 %161 %143
%158 = OpGroupNonUniformFMul %138 %42 ExclusiveScan %162
%163 = OpIMul %5 %29 %49
%164 = OpIAdd %5 %163 %37
%165 = OpBitcast %22 %158
%166 = OpCompositeExtract %21 %165 0
%167 = OpCompositeExtract %21 %165 1
%168 = OpCompositeExtract %21 %165 2
%169 = OpCompositeExtract %21 %165 3
%170 = OpCompositeConstruct %22 %166 %167 %168 %169
%171 = OpAccessChain %156 %26 %44 %164
OpStore %171 %170
%200 = OpFunctionCall %1 %194
OpReturn
OpFunctionEnd
%194 = OpFunction %1 None %2
%195 = OpLabel
%198 = OpLoad %30 %34
OpSelectionMerge %197 None
OpBranchConditional %198 %196 %197
%196 = OpLabel
OpKill
%197 = OpLabel
OpReturn
OpFunctionEnd
#endif
