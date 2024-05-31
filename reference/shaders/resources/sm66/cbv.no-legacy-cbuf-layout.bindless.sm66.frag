#version 460
#if defined(GL_ARB_gpu_shader_int64)
#extension GL_ARB_gpu_shader_int64 : require
#else
#error No extension available for 64-bit integers.
#endif
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require

struct CBVComposite16x8
{
    float16_t _m0;
    float16_t _m1;
    float16_t _m2;
    float16_t _m3;
    float16_t _m4;
    float16_t _m5;
    float16_t _m6;
    float16_t _m7;
};

layout(set = 5, binding = 0, std140) uniform BindlessCBV
{
    u64vec2 _m0[4096];
} _16[];

layout(set = 5, binding = 0, std140) uniform _20_23
{
    vec4 _m0[4096];
} _23[];

layout(set = 5, binding = 0, std140) uniform _27_30
{
    dvec2 _m0[4096];
} _30[];

layout(push_constant, std430) uniform RootConstants
{
    uint _m0;
    uint _m1;
    uint _m2;
    uint _m3;
    uint _m4;
    uint _m5;
    uint _m6;
    uint _m7;
} registers;

layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _39 = registers._m5 + 2u;
    uint _45 = registers._m5 + 1u;
    f16vec2 _70 = unpackFloat2x16(floatBitsToUint(_23[registers._m5]._m0[1u].x));
    f16vec2 _73 = unpackFloat2x16(floatBitsToUint(_23[registers._m5]._m0[1u].y));
    f16vec2 _76 = unpackFloat2x16(floatBitsToUint(_23[registers._m5]._m0[1u].z));
    f16vec2 _79 = unpackFloat2x16(floatBitsToUint(_23[registers._m5]._m0[1u].w));
    CBVComposite16x8 _83 = CBVComposite16x8(_70.x, _70.y, _73.x, _73.y, _76.x, _76.y, _79.x, _79.y);
    SV_Target.x = (((float(_83._m0) + _23[registers._m5]._m0[0u].x) + float(int64_t(_16[registers._m5]._m0[2u].x))) + _23[_45]._m0[0u].x) + float(_30[_39]._m0[0u].x);
    SV_Target.y = (((float(_83._m1) + _23[registers._m5]._m0[0u].y) + float(int64_t(_16[registers._m5]._m0[2u].y))) + _23[_45]._m0[0u].y) + float(_30[_39]._m0[0u].y);
    SV_Target.z = (((float(_83._m2) + _23[registers._m5]._m0[0u].z) + float(int64_t(_16[registers._m5]._m0[3u].x))) + _23[_45]._m0[0u].z) + float(_30[_39]._m0[1u].x);
    SV_Target.w = (((float(_83._m3) + _23[registers._m5]._m0[0u].w) + float(int64_t(_16[registers._m5]._m0[3u].y))) + _23[_45]._m0[0u].w) + float(_30[_39]._m0[1u].y);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 148
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Float64
OpCapability Int64
OpCapability DenormPreserve
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_float_controls"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %32
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpExecutionMode %3 DenormPreserve 64
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %13 "BindlessCBV"
OpName %20 "BindlessCBV"
OpName %27 "BindlessCBV"
OpName %32 "SV_Target"
OpName %82 "CBVComposite16x8"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %12 ArrayStride 16
OpDecorate %13 Block
OpMemberDecorate %13 0 Offset 0
OpDecorate %16 DescriptorSet 5
OpDecorate %16 Binding 0
OpDecorate %19 ArrayStride 16
OpDecorate %20 Block
OpMemberDecorate %20 0 Offset 0
OpDecorate %23 DescriptorSet 5
OpDecorate %23 Binding 0
OpDecorate %26 ArrayStride 16
OpDecorate %27 Block
OpMemberDecorate %27 0 Offset 0
OpDecorate %30 DescriptorSet 5
OpDecorate %30 Binding 0
OpDecorate %32 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeInt 64 0
%10 = OpTypeVector %9 2
%11 = OpConstant %5 4096
%12 = OpTypeArray %10 %11
%13 = OpTypeStruct %12
%14 = OpTypeRuntimeArray %13
%15 = OpTypePointer Uniform %14
%16 = OpVariable %15 Uniform
%17 = OpTypeFloat 32
%18 = OpTypeVector %17 4
%19 = OpTypeArray %18 %11
%20 = OpTypeStruct %19
%21 = OpTypeRuntimeArray %20
%22 = OpTypePointer Uniform %21
%23 = OpVariable %22 Uniform
%24 = OpTypeFloat 64
%25 = OpTypeVector %24 2
%26 = OpTypeArray %25 %11
%27 = OpTypeStruct %26
%28 = OpTypeRuntimeArray %27
%29 = OpTypePointer Uniform %28
%30 = OpVariable %29 Uniform
%31 = OpTypePointer Output %18
%32 = OpVariable %31 Output
%33 = OpTypePointer Uniform %27
%35 = OpTypePointer PushConstant %5
%37 = OpConstant %5 5
%40 = OpConstant %5 2
%41 = OpTypePointer Uniform %20
%46 = OpConstant %5 1
%47 = OpTypePointer Uniform %13
%54 = OpConstant %5 0
%55 = OpTypePointer Uniform %18
%62 = OpTypeFloat 16
%65 = OpTypeVector %62 2
%82 = OpTypeStruct %62 %62 %62 %62 %62 %62 %62 %62
%96 = OpTypePointer Uniform %10
%101 = OpConstant %5 3
%124 = OpTypePointer Uniform %25
%141 = OpTypePointer Output %17
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %146
%146 = OpLabel
%36 = OpAccessChain %35 %8 %37
%38 = OpLoad %5 %36
%39 = OpIAdd %5 %38 %40
%34 = OpAccessChain %33 %30 %39
%43 = OpAccessChain %35 %8 %37
%44 = OpLoad %5 %43
%45 = OpIAdd %5 %44 %46
%42 = OpAccessChain %41 %23 %45
%49 = OpAccessChain %35 %8 %37
%50 = OpLoad %5 %49
%48 = OpAccessChain %47 %16 %50
%52 = OpAccessChain %35 %8 %37
%53 = OpLoad %5 %52
%51 = OpAccessChain %41 %23 %53
%56 = OpAccessChain %55 %51 %54 %54
%57 = OpLoad %18 %56
%58 = OpCompositeExtract %17 %57 0
%59 = OpCompositeExtract %17 %57 1
%60 = OpCompositeExtract %17 %57 2
%61 = OpCompositeExtract %17 %57 3
%63 = OpAccessChain %55 %51 %54 %46
%64 = OpLoad %18 %63
%66 = OpCompositeExtract %17 %64 0
%67 = OpCompositeExtract %17 %64 1
%68 = OpCompositeExtract %17 %64 2
%69 = OpCompositeExtract %17 %64 3
%70 = OpBitcast %65 %66
%71 = OpCompositeExtract %62 %70 0
%72 = OpCompositeExtract %62 %70 1
%73 = OpBitcast %65 %67
%74 = OpCompositeExtract %62 %73 0
%75 = OpCompositeExtract %62 %73 1
%76 = OpBitcast %65 %68
%77 = OpCompositeExtract %62 %76 0
%78 = OpCompositeExtract %62 %76 1
%79 = OpBitcast %65 %69
%80 = OpCompositeExtract %62 %79 0
%81 = OpCompositeExtract %62 %79 1
%83 = OpCompositeConstruct %82 %71 %72 %74 %75 %77 %78 %80 %81
%84 = OpCompositeExtract %62 %83 0
%85 = OpCompositeExtract %62 %83 1
%86 = OpCompositeExtract %62 %83 2
%87 = OpCompositeExtract %62 %83 3
%88 = OpFConvert %17 %84
%89 = OpFConvert %17 %85
%90 = OpFConvert %17 %86
%91 = OpFConvert %17 %87
%92 = OpFAdd %17 %88 %58
%93 = OpFAdd %17 %89 %59
%94 = OpFAdd %17 %90 %60
%95 = OpFAdd %17 %91 %61
%97 = OpAccessChain %96 %48 %54 %40
%98 = OpLoad %10 %97
%99 = OpCompositeExtract %9 %98 0
%100 = OpCompositeExtract %9 %98 1
%102 = OpAccessChain %96 %48 %54 %101
%103 = OpLoad %10 %102
%104 = OpCompositeExtract %9 %103 0
%105 = OpCompositeExtract %9 %103 1
%106 = OpConvertSToF %17 %99
%107 = OpConvertSToF %17 %100
%108 = OpConvertSToF %17 %104
%109 = OpConvertSToF %17 %105
%110 = OpFAdd %17 %92 %106
%111 = OpFAdd %17 %93 %107
%112 = OpFAdd %17 %94 %108
%113 = OpFAdd %17 %95 %109
%114 = OpAccessChain %55 %42 %54 %54
%115 = OpLoad %18 %114
%116 = OpCompositeExtract %17 %115 0
%117 = OpCompositeExtract %17 %115 1
%118 = OpCompositeExtract %17 %115 2
%119 = OpCompositeExtract %17 %115 3
%120 = OpFAdd %17 %110 %116
%121 = OpFAdd %17 %111 %117
%122 = OpFAdd %17 %112 %118
%123 = OpFAdd %17 %113 %119
%125 = OpAccessChain %124 %34 %54 %54
%126 = OpLoad %25 %125
%127 = OpCompositeExtract %24 %126 0
%128 = OpCompositeExtract %24 %126 1
%129 = OpAccessChain %124 %34 %54 %46
%130 = OpLoad %25 %129
%131 = OpCompositeExtract %24 %130 0
%132 = OpCompositeExtract %24 %130 1
%133 = OpFConvert %17 %127
%134 = OpFConvert %17 %128
%135 = OpFConvert %17 %131
%136 = OpFConvert %17 %132
%137 = OpFAdd %17 %120 %133
%138 = OpFAdd %17 %121 %134
%139 = OpFAdd %17 %122 %135
%140 = OpFAdd %17 %123 %136
%142 = OpAccessChain %141 %32 %54
OpStore %142 %137
%143 = OpAccessChain %141 %32 %46
OpStore %143 %138
%144 = OpAccessChain %141 %32 %40
OpStore %144 %139
%145 = OpAccessChain %141 %32 %101
OpStore %145 %140
OpReturn
OpFunctionEnd
#endif
