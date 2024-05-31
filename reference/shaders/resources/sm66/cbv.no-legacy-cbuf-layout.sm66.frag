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

layout(set = 0, binding = 0, std140) uniform _10_12
{
    u64vec2 _m0[4];
} _12;

layout(set = 0, binding = 0, std140) uniform _16_18
{
    vec4 _m0[4];
} _18;

layout(set = 0, binding = 1, std140) uniform _21_23
{
    vec4 _m0[1];
} _23;

layout(set = 0, binding = 2, std140) uniform _28_30
{
    dvec2 _m0[2];
} _30;

layout(location = 0) out vec4 SV_Target;

void main()
{
    f16vec2 _49 = unpackFloat2x16(floatBitsToUint(_18._m0[1u].x));
    f16vec2 _52 = unpackFloat2x16(floatBitsToUint(_18._m0[1u].y));
    f16vec2 _55 = unpackFloat2x16(floatBitsToUint(_18._m0[1u].z));
    f16vec2 _58 = unpackFloat2x16(floatBitsToUint(_18._m0[1u].w));
    CBVComposite16x8 _62 = CBVComposite16x8(_49.x, _49.y, _52.x, _52.y, _55.x, _55.y, _58.x, _58.y);
    SV_Target.x = (((float(_62._m0) + _18._m0[0u].x) + float(int64_t(_12._m0[2u].x))) + _23._m0[0u].x) + float(_30._m0[0u].x);
    SV_Target.y = (((float(_62._m1) + _18._m0[0u].y) + float(int64_t(_12._m0[2u].y))) + _23._m0[0u].y) + float(_30._m0[0u].y);
    SV_Target.z = (((float(_62._m2) + _18._m0[0u].z) + float(int64_t(_12._m0[3u].x))) + _23._m0[0u].z) + float(_30._m0[1u].x);
    SV_Target.w = (((float(_62._m3) + _18._m0[0u].w) + float(int64_t(_12._m0[3u].y))) + _23._m0[0u].w) + float(_30._m0[1u].y);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 127
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Float64
OpCapability Int64
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %32
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpExecutionMode %3 DenormPreserve 64
OpName %3 "main"
OpName %10 ""
OpName %16 ""
OpName %21 ""
OpName %28 ""
OpName %32 "SV_Target"
OpName %61 "CBVComposite16x8"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %15 ArrayStride 16
OpMemberDecorate %16 0 Offset 0
OpDecorate %16 Block
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %18 DescriptorSet 0
OpDecorate %18 Binding 0
OpDecorate %20 ArrayStride 16
OpMemberDecorate %21 0 Offset 0
OpDecorate %21 Block
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 1
OpDecorate %27 ArrayStride 16
OpMemberDecorate %28 0 Offset 0
OpDecorate %28 Block
OpDecorate %30 DescriptorSet 0
OpDecorate %30 Binding 2
OpDecorate %32 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 4
%7 = OpTypeInt 64 0
%8 = OpTypeVector %7 2
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypeFloat 32
%14 = OpTypeVector %13 4
%15 = OpTypeArray %14 %6
%16 = OpTypeStruct %15
%17 = OpTypePointer Uniform %16
%18 = OpVariable %17 Uniform
%19 = OpConstant %5 1
%20 = OpTypeArray %14 %19
%21 = OpTypeStruct %20
%22 = OpTypePointer Uniform %21
%23 = OpVariable %22 Uniform
%24 = OpConstant %5 2
%25 = OpTypeFloat 64
%26 = OpTypeVector %25 2
%27 = OpTypeArray %26 %24
%28 = OpTypeStruct %27
%29 = OpTypePointer Uniform %28
%30 = OpVariable %29 Uniform
%31 = OpTypePointer Output %14
%32 = OpVariable %31 Output
%33 = OpConstant %5 0
%34 = OpTypePointer Uniform %14
%41 = OpTypeFloat 16
%44 = OpTypeVector %41 2
%61 = OpTypeStruct %41 %41 %41 %41 %41 %41 %41 %41
%75 = OpTypePointer Uniform %8
%80 = OpConstant %5 3
%103 = OpTypePointer Uniform %26
%120 = OpTypePointer Output %13
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %125
%125 = OpLabel
%35 = OpAccessChain %34 %18 %33 %33
%36 = OpLoad %14 %35
%37 = OpCompositeExtract %13 %36 0
%38 = OpCompositeExtract %13 %36 1
%39 = OpCompositeExtract %13 %36 2
%40 = OpCompositeExtract %13 %36 3
%42 = OpAccessChain %34 %18 %33 %19
%43 = OpLoad %14 %42
%45 = OpCompositeExtract %13 %43 0
%46 = OpCompositeExtract %13 %43 1
%47 = OpCompositeExtract %13 %43 2
%48 = OpCompositeExtract %13 %43 3
%49 = OpBitcast %44 %45
%50 = OpCompositeExtract %41 %49 0
%51 = OpCompositeExtract %41 %49 1
%52 = OpBitcast %44 %46
%53 = OpCompositeExtract %41 %52 0
%54 = OpCompositeExtract %41 %52 1
%55 = OpBitcast %44 %47
%56 = OpCompositeExtract %41 %55 0
%57 = OpCompositeExtract %41 %55 1
%58 = OpBitcast %44 %48
%59 = OpCompositeExtract %41 %58 0
%60 = OpCompositeExtract %41 %58 1
%62 = OpCompositeConstruct %61 %50 %51 %53 %54 %56 %57 %59 %60
%63 = OpCompositeExtract %41 %62 0
%64 = OpCompositeExtract %41 %62 1
%65 = OpCompositeExtract %41 %62 2
%66 = OpCompositeExtract %41 %62 3
%67 = OpFConvert %13 %63
%68 = OpFConvert %13 %64
%69 = OpFConvert %13 %65
%70 = OpFConvert %13 %66
%71 = OpFAdd %13 %67 %37
%72 = OpFAdd %13 %68 %38
%73 = OpFAdd %13 %69 %39
%74 = OpFAdd %13 %70 %40
%76 = OpAccessChain %75 %12 %33 %24
%77 = OpLoad %8 %76
%78 = OpCompositeExtract %7 %77 0
%79 = OpCompositeExtract %7 %77 1
%81 = OpAccessChain %75 %12 %33 %80
%82 = OpLoad %8 %81
%83 = OpCompositeExtract %7 %82 0
%84 = OpCompositeExtract %7 %82 1
%85 = OpConvertSToF %13 %78
%86 = OpConvertSToF %13 %79
%87 = OpConvertSToF %13 %83
%88 = OpConvertSToF %13 %84
%89 = OpFAdd %13 %71 %85
%90 = OpFAdd %13 %72 %86
%91 = OpFAdd %13 %73 %87
%92 = OpFAdd %13 %74 %88
%93 = OpAccessChain %34 %23 %33 %33
%94 = OpLoad %14 %93
%95 = OpCompositeExtract %13 %94 0
%96 = OpCompositeExtract %13 %94 1
%97 = OpCompositeExtract %13 %94 2
%98 = OpCompositeExtract %13 %94 3
%99 = OpFAdd %13 %89 %95
%100 = OpFAdd %13 %90 %96
%101 = OpFAdd %13 %91 %97
%102 = OpFAdd %13 %92 %98
%104 = OpAccessChain %103 %30 %33 %33
%105 = OpLoad %26 %104
%106 = OpCompositeExtract %25 %105 0
%107 = OpCompositeExtract %25 %105 1
%108 = OpAccessChain %103 %30 %33 %19
%109 = OpLoad %26 %108
%110 = OpCompositeExtract %25 %109 0
%111 = OpCompositeExtract %25 %109 1
%112 = OpFConvert %13 %106
%113 = OpFConvert %13 %107
%114 = OpFConvert %13 %110
%115 = OpFConvert %13 %111
%116 = OpFAdd %13 %99 %112
%117 = OpFAdd %13 %100 %113
%118 = OpFAdd %13 %101 %114
%119 = OpFAdd %13 %102 %115
%121 = OpAccessChain %120 %32 %33
OpStore %121 %116
%122 = OpAccessChain %120 %32 %19
OpStore %122 %117
%123 = OpAccessChain %120 %32 %24
OpStore %123 %118
%124 = OpAccessChain %120 %32 %80
OpStore %124 %119
OpReturn
OpFunctionEnd
#endif
