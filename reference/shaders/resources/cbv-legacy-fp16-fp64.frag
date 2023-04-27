#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#if defined(GL_ARB_gpu_shader_int64)
#extension GL_ARB_gpu_shader_int64 : require
#else
#error No extension available for 64-bit integers.
#endif

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
    vec4 _m0[4];
} _12;

layout(set = 0, binding = 0, std140) uniform _16_18
{
    dvec2 _m0[4];
} _18;

layout(location = 0) out vec4 SV_Target;

void main()
{
    f16vec2 _38 = unpackFloat2x16(floatBitsToUint(_12._m0[1u].x));
    f16vec2 _41 = unpackFloat2x16(floatBitsToUint(_12._m0[1u].y));
    f16vec2 _44 = unpackFloat2x16(floatBitsToUint(_12._m0[1u].z));
    f16vec2 _47 = unpackFloat2x16(floatBitsToUint(_12._m0[1u].w));
    CBVComposite16x8 _51 = CBVComposite16x8(_38.x, _38.y, _41.x, _41.y, _44.x, _44.y, _47.x, _47.y);
    u64vec2 _82 = doubleBitsToUint64(_18._m0[2u]);
    u64vec2 _88 = doubleBitsToUint64(_18._m0[3u]);
    SV_Target.x = ((float(_51._m0) + _12._m0[0u].x) + float(_51._m4)) + float(int64_t(_82.x));
    SV_Target.y = ((float(_51._m1) + _12._m0[0u].y) + float(_51._m5)) + float(int64_t(_82.y));
    SV_Target.z = ((float(_51._m2) + _12._m0[0u].z) + float(_51._m6)) + float(int64_t(_88.x));
    SV_Target.w = ((float(_51._m3) + _12._m0[0u].w) + float(_51._m7)) + float(int64_t(_88.y));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 106
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Float64
OpCapability Int64
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %20
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpExecutionMode %3 DenormPreserve 64
OpName %3 "main"
OpName %10 ""
OpName %16 ""
OpName %20 "SV_Target"
OpName %50 "CBVComposite16x8"
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
OpDecorate %20 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 4
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypeFloat 64
%14 = OpTypeVector %13 2
%15 = OpTypeArray %14 %6
%16 = OpTypeStruct %15
%17 = OpTypePointer Uniform %16
%18 = OpVariable %17 Uniform
%19 = OpTypePointer Output %8
%20 = OpVariable %19 Output
%21 = OpConstant %5 0
%22 = OpTypePointer Uniform %8
%29 = OpTypeFloat 16
%30 = OpConstant %5 1
%33 = OpTypeVector %29 2
%50 = OpTypeStruct %29 %29 %29 %29 %29 %29 %29 %29
%76 = OpTypeInt 64 0
%77 = OpConstant %5 2
%78 = OpTypePointer Uniform %14
%81 = OpTypeVector %76 2
%85 = OpConstant %5 3
%99 = OpTypePointer Output %7
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %104
%104 = OpLabel
%23 = OpAccessChain %22 %12 %21 %21
%24 = OpLoad %8 %23
%25 = OpCompositeExtract %7 %24 0
%26 = OpCompositeExtract %7 %24 1
%27 = OpCompositeExtract %7 %24 2
%28 = OpCompositeExtract %7 %24 3
%31 = OpAccessChain %22 %12 %21 %30
%32 = OpLoad %8 %31
%34 = OpCompositeExtract %7 %32 0
%35 = OpCompositeExtract %7 %32 1
%36 = OpCompositeExtract %7 %32 2
%37 = OpCompositeExtract %7 %32 3
%38 = OpBitcast %33 %34
%39 = OpCompositeExtract %29 %38 0
%40 = OpCompositeExtract %29 %38 1
%41 = OpBitcast %33 %35
%42 = OpCompositeExtract %29 %41 0
%43 = OpCompositeExtract %29 %41 1
%44 = OpBitcast %33 %36
%45 = OpCompositeExtract %29 %44 0
%46 = OpCompositeExtract %29 %44 1
%47 = OpBitcast %33 %37
%48 = OpCompositeExtract %29 %47 0
%49 = OpCompositeExtract %29 %47 1
%51 = OpCompositeConstruct %50 %39 %40 %42 %43 %45 %46 %48 %49
%52 = OpCompositeExtract %29 %51 0
%53 = OpCompositeExtract %29 %51 1
%54 = OpCompositeExtract %29 %51 2
%55 = OpCompositeExtract %29 %51 3
%56 = OpFConvert %7 %52
%57 = OpFConvert %7 %53
%58 = OpFConvert %7 %54
%59 = OpFConvert %7 %55
%60 = OpFAdd %7 %56 %25
%61 = OpFAdd %7 %57 %26
%62 = OpFAdd %7 %58 %27
%63 = OpFAdd %7 %59 %28
%64 = OpCompositeExtract %29 %51 4
%65 = OpCompositeExtract %29 %51 5
%66 = OpCompositeExtract %29 %51 6
%67 = OpCompositeExtract %29 %51 7
%68 = OpFConvert %7 %64
%69 = OpFConvert %7 %65
%70 = OpFConvert %7 %66
%71 = OpFConvert %7 %67
%72 = OpFAdd %7 %60 %68
%73 = OpFAdd %7 %61 %69
%74 = OpFAdd %7 %62 %70
%75 = OpFAdd %7 %63 %71
%79 = OpAccessChain %78 %18 %21 %77
%80 = OpLoad %14 %79
%82 = OpBitcast %81 %80
%83 = OpCompositeExtract %76 %82 0
%84 = OpCompositeExtract %76 %82 1
%86 = OpAccessChain %78 %18 %21 %85
%87 = OpLoad %14 %86
%88 = OpBitcast %81 %87
%89 = OpCompositeExtract %76 %88 0
%90 = OpCompositeExtract %76 %88 1
%91 = OpConvertSToF %7 %83
%92 = OpConvertSToF %7 %84
%93 = OpConvertSToF %7 %89
%94 = OpConvertSToF %7 %90
%95 = OpFAdd %7 %72 %91
%96 = OpFAdd %7 %73 %92
%97 = OpFAdd %7 %74 %93
%98 = OpFAdd %7 %75 %94
%100 = OpAccessChain %99 %20 %21
OpStore %100 %95
%101 = OpAccessChain %99 %20 %30
OpStore %101 %96
%102 = OpAccessChain %99 %20 %77
OpStore %102 %97
%103 = OpAccessChain %99 %20 %85
OpStore %103 %98
OpReturn
OpFunctionEnd
#endif
