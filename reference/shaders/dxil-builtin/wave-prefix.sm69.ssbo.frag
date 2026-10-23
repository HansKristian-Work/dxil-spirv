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
#extension GL_EXT_demote_to_helper_invocation : require
#extension GL_KHR_shader_subgroup_arithmetic : require
#extension GL_EXT_shader_subgroup_extended_types_float16 : require

uvec2 _36;
uvec3 _59;
vec4 _84;
f16vec4 _113;

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

void main()
{
    if (INDEX == 40u)
    {
        demote;
    }
    uint _33 = INDEX + 1u;
    uvec2 _35;
    _35.x = INDEX;
    _35.y = _33;
    bool _40 = helperInvocationEXT();
    _10._m0[INDEX * 2u] = subgroupExclusiveAdd(_40 ? uvec2(0u) : _35);
    bool _50 = helperInvocationEXT();
    _10._m0[(INDEX * 2u) + 1u] = subgroupExclusiveMul(_50 ? uvec2(1u) : _35);
    uint _57 = INDEX + 2u;
    uvec3 _58;
    _58.x = INDEX;
    _58.y = _33;
    _58.z = _57;
    bool _63 = helperInvocationEXT();
    _15._m0[INDEX * 2u] = subgroupExclusiveAdd(_63 ? uvec3(0u) : _58);
    bool _70 = helperInvocationEXT();
    _15._m0[(INDEX * 2u) + 1u] = subgroupExclusiveMul(_70 ? uvec3(1u) : _58);
    uint _80 = INDEX + 3u;
    vec4 _83;
    _83.x = float(INDEX);
    _83.y = float(_33);
    _83.z = float(_57);
    _83.w = float(_80);
    bool _89 = helperInvocationEXT();
    _20._m0[INDEX * 2u] = floatBitsToUint(subgroupExclusiveAdd(_89 ? vec4(0.0) : _83));
    bool _98 = helperInvocationEXT();
    _20._m0[(INDEX * 2u) + 1u] = floatBitsToUint(subgroupExclusiveMul(_98 ? vec4(1.0) : _83));
    f16vec4 _112;
    _112.x = float16_t(INDEX);
    _112.y = float16_t(_33);
    _112.z = float16_t(_57);
    _112.w = float16_t(_80);
    bool _118 = helperInvocationEXT();
    _26._m0[INDEX * 2u] = float16BitsToUint16(subgroupExclusiveAdd(_118 ? f16vec4(float16_t(0.0)) : _112));
    bool _127 = helperInvocationEXT();
    _26._m0[(INDEX * 2u) + 1u] = float16BitsToUint16(subgroupExclusiveMul(_127 ? f16vec4(float16_t(1.0)) : _112));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 139
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability GroupNonUniformArithmetic
OpCapability StorageBuffer16BitAccess
OpCapability DenormPreserve
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %15 %20 %26 %28
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %8 "SSBO"
OpName %13 "SSBO"
OpName %18 "SSBO"
OpName %24 "SSBO"
OpName %28 "INDEX"
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
%34 = OpConstant %5 1
%39 = OpConstant %5 3
%41 = OpConstant %5 0
%42 = OpConstantComposite %6 %41 %41
%46 = OpConstant %5 2
%47 = OpTypePointer StorageBuffer %6
%51 = OpConstantComposite %6 %34 %34
%64 = OpConstantComposite %11 %41 %41 %41
%67 = OpTypePointer StorageBuffer %11
%71 = OpConstantComposite %11 %34 %34 %34
%76 = OpTypeFloat 32
%82 = OpTypeVector %76 4
%90 = OpConstant %76 0
%91 = OpConstantComposite %82 %90 %90 %90 %90
%95 = OpTypePointer StorageBuffer %16
%99 = OpConstant %76 1
%100 = OpConstantComposite %82 %99 %99 %99 %99
%106 = OpTypeFloat 16
%111 = OpTypeVector %106 4
%119 = OpConstant %106 0x0p+0
%120 = OpConstantComposite %111 %119 %119 %119 %119
%124 = OpTypePointer StorageBuffer %22
%128 = OpConstant %106 0x1p+0
%129 = OpConstantComposite %111 %128 %128 %128 %128
%3 = OpFunction %1 None %2
%4 = OpLabel
%36 = OpUndef %6
%59 = OpUndef %11
%84 = OpUndef %82
%113 = OpUndef %111
OpBranch %135
%135 = OpLabel
%29 = OpLoad %5 %28
%31 = OpIEqual %30 %29 %32
OpSelectionMerge %137 None
OpBranchConditional %31 %136 %137
%136 = OpLabel
OpDemoteToHelperInvocation
OpBranch %137
%137 = OpLabel
OpBranch %138
%138 = OpLabel
%33 = OpIAdd %5 %29 %34
%35 = OpCompositeInsert %6 %29 %36 0
%37 = OpCompositeInsert %6 %33 %35 1
%40 = OpIsHelperInvocationEXT %30
%43 = OpSelect %6 %40 %42 %37
%38 = OpGroupNonUniformIAdd %6 %39 ExclusiveScan %43
%44 = OpShiftLeftLogical %5 %29 %34
%45 = OpIMul %5 %29 %46
%48 = OpAccessChain %47 %10 %41 %45
OpStore %48 %38
%50 = OpIsHelperInvocationEXT %30
%52 = OpSelect %6 %50 %51 %37
%49 = OpGroupNonUniformIMul %6 %39 ExclusiveScan %52
%53 = OpBitwiseOr %5 %44 %34
%54 = OpIMul %5 %29 %46
%55 = OpIAdd %5 %54 %34
%56 = OpAccessChain %47 %10 %41 %55
OpStore %56 %49
%57 = OpIAdd %5 %29 %46
%58 = OpCompositeInsert %11 %29 %59 0
%60 = OpCompositeInsert %11 %33 %58 1
%61 = OpCompositeInsert %11 %57 %60 2
%63 = OpIsHelperInvocationEXT %30
%65 = OpSelect %11 %63 %64 %61
%62 = OpGroupNonUniformIAdd %11 %39 ExclusiveScan %65
%66 = OpIMul %5 %29 %46
%68 = OpAccessChain %67 %15 %41 %66
OpStore %68 %62
%70 = OpIsHelperInvocationEXT %30
%72 = OpSelect %11 %70 %71 %61
%69 = OpGroupNonUniformIMul %11 %39 ExclusiveScan %72
%73 = OpIMul %5 %29 %46
%74 = OpIAdd %5 %73 %34
%75 = OpAccessChain %67 %15 %41 %74
OpStore %75 %69
%77 = OpConvertUToF %76 %29
%78 = OpConvertUToF %76 %33
%79 = OpConvertUToF %76 %57
%80 = OpIAdd %5 %29 %39
%81 = OpConvertUToF %76 %80
%83 = OpCompositeInsert %82 %77 %84 0
%85 = OpCompositeInsert %82 %78 %83 1
%86 = OpCompositeInsert %82 %79 %85 2
%87 = OpCompositeInsert %82 %81 %86 3
%89 = OpIsHelperInvocationEXT %30
%92 = OpSelect %82 %89 %91 %87
%88 = OpGroupNonUniformFAdd %82 %39 ExclusiveScan %92
%93 = OpIMul %5 %29 %46
%94 = OpBitcast %16 %88
%96 = OpAccessChain %95 %20 %41 %93
OpStore %96 %94
%98 = OpIsHelperInvocationEXT %30
%101 = OpSelect %82 %98 %100 %87
%97 = OpGroupNonUniformFMul %82 %39 ExclusiveScan %101
%102 = OpIMul %5 %29 %46
%103 = OpIAdd %5 %102 %34
%104 = OpBitcast %16 %97
%105 = OpAccessChain %95 %20 %41 %103
OpStore %105 %104
%107 = OpConvertUToF %106 %29
%108 = OpConvertUToF %106 %33
%109 = OpConvertUToF %106 %57
%110 = OpConvertUToF %106 %80
%112 = OpCompositeInsert %111 %107 %113 0
%114 = OpCompositeInsert %111 %108 %112 1
%115 = OpCompositeInsert %111 %109 %114 2
%116 = OpCompositeInsert %111 %110 %115 3
%118 = OpIsHelperInvocationEXT %30
%121 = OpSelect %111 %118 %120 %116
%117 = OpGroupNonUniformFAdd %111 %39 ExclusiveScan %121
%122 = OpIMul %5 %29 %46
%123 = OpBitcast %22 %117
%125 = OpAccessChain %124 %26 %41 %122
OpStore %125 %123
%127 = OpIsHelperInvocationEXT %30
%130 = OpSelect %111 %127 %129 %116
%126 = OpGroupNonUniformFMul %111 %39 ExclusiveScan %130
%131 = OpIMul %5 %29 %46
%132 = OpIAdd %5 %131 %34
%133 = OpBitcast %22 %126
%134 = OpAccessChain %124 %26 %41 %132
OpStore %134 %133
OpReturn
OpFunctionEnd
#endif
