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
uvec3 _62;
vec4 _87;
f16vec4 _116;

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
    _10._m0[INDEX * 2u] = subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? uvec2(0u) : _38);
    _10._m0[(INDEX * 2u) + 1u] = subgroupExclusiveMul((gl_HelperInvocation || discard_state) ? uvec2(1u) : _38);
    uint _60 = INDEX + 2u;
    uvec3 _61;
    _61.x = INDEX;
    _61.y = _36;
    _61.z = _60;
    _15._m0[INDEX * 2u] = subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? uvec3(0u) : _61);
    _15._m0[(INDEX * 2u) + 1u] = subgroupExclusiveMul((gl_HelperInvocation || discard_state) ? uvec3(1u) : _61);
    uint _83 = INDEX + 3u;
    vec4 _86;
    _86.x = float(INDEX);
    _86.y = float(_36);
    _86.z = float(_60);
    _86.w = float(_83);
    _20._m0[INDEX * 2u] = floatBitsToUint(subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? vec4(0.0) : _86));
    _20._m0[(INDEX * 2u) + 1u] = floatBitsToUint(subgroupExclusiveMul((gl_HelperInvocation || discard_state) ? vec4(1.0) : _86));
    f16vec4 _115;
    _115.x = float16_t(INDEX);
    _115.y = float16_t(_36);
    _115.z = float16_t(_60);
    _115.w = float16_t(_83);
    _26._m0[INDEX * 2u] = float16BitsToUint16(subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? f16vec4(float16_t(0.0)) : _115));
    _26._m0[(INDEX * 2u) + 1u] = float16BitsToUint16(subgroupExclusiveMul((gl_HelperInvocation || discard_state) ? f16vec4(float16_t(1.0)) : _115));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 168
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability GroupNonUniformArithmetic
OpCapability StorageBuffer16BitAccess
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %15 %20 %26 %28 %34 %143
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %8 "SSBO"
OpName %13 "SSBO"
OpName %18 "SSBO"
OpName %24 "SSBO"
OpName %28 "INDEX"
OpName %34 "discard_state"
OpName %160 "discard_exit"
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
OpDecorate %143 BuiltIn HelperInvocation
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
%50 = OpTypePointer StorageBuffer %6
%54 = OpConstantComposite %6 %37 %37
%67 = OpConstantComposite %11 %44 %44 %44
%70 = OpTypePointer StorageBuffer %11
%74 = OpConstantComposite %11 %37 %37 %37
%79 = OpTypeFloat 32
%85 = OpTypeVector %79 4
%93 = OpConstant %79 0
%94 = OpConstantComposite %85 %93 %93 %93 %93
%98 = OpTypePointer StorageBuffer %16
%102 = OpConstant %79 1
%103 = OpConstantComposite %85 %102 %102 %102 %102
%109 = OpTypeFloat 16
%114 = OpTypeVector %109 4
%122 = OpConstant %109 0x0p+0
%123 = OpConstantComposite %114 %122 %122 %122 %122
%127 = OpTypePointer StorageBuffer %22
%131 = OpConstant %109 0x1p+0
%132 = OpConstantComposite %114 %131 %131 %131 %131
%141 = OpConstantTrue %30
%142 = OpTypePointer Input %30
%143 = OpVariable %142 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %34 %35
%39 = OpUndef %6
%62 = OpUndef %11
%87 = OpUndef %85
%116 = OpUndef %114
OpBranch %138
%138 = OpLabel
%29 = OpLoad %5 %28
%31 = OpIEqual %30 %29 %32
OpSelectionMerge %140 None
OpBranchConditional %31 %139 %140
%139 = OpLabel
OpStore %34 %141
OpBranch %140
%140 = OpLabel
%36 = OpIAdd %5 %29 %37
%38 = OpCompositeInsert %6 %29 %39 0
%40 = OpCompositeInsert %6 %36 %38 1
%144 = OpLoad %30 %143
%145 = OpLoad %30 %34
%43 = OpLogicalOr %30 %144 %145
%46 = OpSelect %6 %43 %45 %40
%41 = OpGroupNonUniformIAdd %6 %42 ExclusiveScan %46
%47 = OpShiftLeftLogical %5 %29 %37
%48 = OpIMul %5 %29 %49
%51 = OpAccessChain %50 %10 %44 %48
OpStore %51 %41
%146 = OpLoad %30 %143
%147 = OpLoad %30 %34
%53 = OpLogicalOr %30 %146 %147
%55 = OpSelect %6 %53 %54 %40
%52 = OpGroupNonUniformIMul %6 %42 ExclusiveScan %55
%56 = OpBitwiseOr %5 %47 %37
%57 = OpIMul %5 %29 %49
%58 = OpIAdd %5 %57 %37
%59 = OpAccessChain %50 %10 %44 %58
OpStore %59 %52
%60 = OpIAdd %5 %29 %49
%61 = OpCompositeInsert %11 %29 %62 0
%63 = OpCompositeInsert %11 %36 %61 1
%64 = OpCompositeInsert %11 %60 %63 2
%148 = OpLoad %30 %143
%149 = OpLoad %30 %34
%66 = OpLogicalOr %30 %148 %149
%68 = OpSelect %11 %66 %67 %64
%65 = OpGroupNonUniformIAdd %11 %42 ExclusiveScan %68
%69 = OpIMul %5 %29 %49
%71 = OpAccessChain %70 %15 %44 %69
OpStore %71 %65
%150 = OpLoad %30 %143
%151 = OpLoad %30 %34
%73 = OpLogicalOr %30 %150 %151
%75 = OpSelect %11 %73 %74 %64
%72 = OpGroupNonUniformIMul %11 %42 ExclusiveScan %75
%76 = OpIMul %5 %29 %49
%77 = OpIAdd %5 %76 %37
%78 = OpAccessChain %70 %15 %44 %77
OpStore %78 %72
%80 = OpConvertUToF %79 %29
%81 = OpConvertUToF %79 %36
%82 = OpConvertUToF %79 %60
%83 = OpIAdd %5 %29 %42
%84 = OpConvertUToF %79 %83
%86 = OpCompositeInsert %85 %80 %87 0
%88 = OpCompositeInsert %85 %81 %86 1
%89 = OpCompositeInsert %85 %82 %88 2
%90 = OpCompositeInsert %85 %84 %89 3
%152 = OpLoad %30 %143
%153 = OpLoad %30 %34
%92 = OpLogicalOr %30 %152 %153
%95 = OpSelect %85 %92 %94 %90
%91 = OpGroupNonUniformFAdd %85 %42 ExclusiveScan %95
%96 = OpIMul %5 %29 %49
%97 = OpBitcast %16 %91
%99 = OpAccessChain %98 %20 %44 %96
OpStore %99 %97
%154 = OpLoad %30 %143
%155 = OpLoad %30 %34
%101 = OpLogicalOr %30 %154 %155
%104 = OpSelect %85 %101 %103 %90
%100 = OpGroupNonUniformFMul %85 %42 ExclusiveScan %104
%105 = OpIMul %5 %29 %49
%106 = OpIAdd %5 %105 %37
%107 = OpBitcast %16 %100
%108 = OpAccessChain %98 %20 %44 %106
OpStore %108 %107
%110 = OpConvertUToF %109 %29
%111 = OpConvertUToF %109 %36
%112 = OpConvertUToF %109 %60
%113 = OpConvertUToF %109 %83
%115 = OpCompositeInsert %114 %110 %116 0
%117 = OpCompositeInsert %114 %111 %115 1
%118 = OpCompositeInsert %114 %112 %117 2
%119 = OpCompositeInsert %114 %113 %118 3
%156 = OpLoad %30 %143
%157 = OpLoad %30 %34
%121 = OpLogicalOr %30 %156 %157
%124 = OpSelect %114 %121 %123 %119
%120 = OpGroupNonUniformFAdd %114 %42 ExclusiveScan %124
%125 = OpIMul %5 %29 %49
%126 = OpBitcast %22 %120
%128 = OpAccessChain %127 %26 %44 %125
OpStore %128 %126
%158 = OpLoad %30 %143
%159 = OpLoad %30 %34
%130 = OpLogicalOr %30 %158 %159
%133 = OpSelect %114 %130 %132 %119
%129 = OpGroupNonUniformFMul %114 %42 ExclusiveScan %133
%134 = OpIMul %5 %29 %49
%135 = OpIAdd %5 %134 %37
%136 = OpBitcast %22 %129
%137 = OpAccessChain %127 %26 %44 %135
OpStore %137 %136
%166 = OpFunctionCall %1 %160
OpReturn
OpFunctionEnd
%160 = OpFunction %1 None %2
%161 = OpLabel
%164 = OpLoad %30 %34
OpSelectionMerge %163 None
OpBranchConditional %164 %162 %163
%162 = OpLabel
OpKill
%163 = OpLabel
OpReturn
OpFunctionEnd
#endif
