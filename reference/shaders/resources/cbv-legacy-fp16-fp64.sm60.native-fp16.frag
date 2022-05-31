#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#extension GL_ARB_gpu_shader_int64 : require

layout(set = 0, binding = 0, std140) uniform _10_12
{
    vec4 _m0[5];
} _12;

layout(set = 0, binding = 0, std140) uniform _16_18
{
    dvec2 _m0[5];
} _18;

layout(location = 0) out vec4 SV_Target;

void main()
{
    f16vec4 _34 = f16vec4(_12._m0[1u]);
    f16vec4 _50 = f16vec4(_12._m0[2u]);
    u64vec2 _69 = doubleBitsToUint64(_18._m0[3u]);
    u64vec2 _75 = doubleBitsToUint64(_18._m0[4u]);
    SV_Target.x = ((float(_34.x) + _12._m0[0u].x) + float(_50.x)) + float(int64_t(_69.x));
    SV_Target.y = ((float(_34.y) + _12._m0[0u].y) + float(_50.y)) + float(int64_t(_69.y));
    SV_Target.z = ((float(_34.z) + _12._m0[0u].z) + float(_50.z)) + float(int64_t(_75.x));
    SV_Target.w = ((float(_34.w) + _12._m0[0u].w) + float(_50.w)) + float(int64_t(_75.y));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 93
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Float64
OpCapability Int64
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %20
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %16 ""
OpName %20 "SV_Target"
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
OpDecorate %35 RelaxedPrecision
OpDecorate %36 RelaxedPrecision
OpDecorate %37 RelaxedPrecision
OpDecorate %38 RelaxedPrecision
OpDecorate %51 RelaxedPrecision
OpDecorate %52 RelaxedPrecision
OpDecorate %53 RelaxedPrecision
OpDecorate %54 RelaxedPrecision
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 5
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
%29 = OpConstant %5 1
%32 = OpTypeFloat 16
%33 = OpTypeVector %32 4
%47 = OpConstant %5 2
%63 = OpTypeInt 64 0
%64 = OpConstant %5 3
%65 = OpTypePointer Uniform %14
%68 = OpTypeVector %63 2
%72 = OpConstant %5 4
%86 = OpTypePointer Output %7
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %91
%91 = OpLabel
%23 = OpAccessChain %22 %12 %21 %21
%24 = OpLoad %8 %23
%25 = OpCompositeExtract %7 %24 0
%26 = OpCompositeExtract %7 %24 1
%27 = OpCompositeExtract %7 %24 2
%28 = OpCompositeExtract %7 %24 3
%30 = OpAccessChain %22 %12 %21 %29
%31 = OpLoad %8 %30
%34 = OpFConvert %33 %31
%35 = OpCompositeExtract %32 %34 0
%36 = OpCompositeExtract %32 %34 1
%37 = OpCompositeExtract %32 %34 2
%38 = OpCompositeExtract %32 %34 3
%39 = OpFConvert %7 %35
%40 = OpFConvert %7 %36
%41 = OpFConvert %7 %37
%42 = OpFConvert %7 %38
%43 = OpFAdd %7 %39 %25
%44 = OpFAdd %7 %40 %26
%45 = OpFAdd %7 %41 %27
%46 = OpFAdd %7 %42 %28
%48 = OpAccessChain %22 %12 %21 %47
%49 = OpLoad %8 %48
%50 = OpFConvert %33 %49
%51 = OpCompositeExtract %32 %50 0
%52 = OpCompositeExtract %32 %50 1
%53 = OpCompositeExtract %32 %50 2
%54 = OpCompositeExtract %32 %50 3
%55 = OpFConvert %7 %51
%56 = OpFConvert %7 %52
%57 = OpFConvert %7 %53
%58 = OpFConvert %7 %54
%59 = OpFAdd %7 %43 %55
%60 = OpFAdd %7 %44 %56
%61 = OpFAdd %7 %45 %57
%62 = OpFAdd %7 %46 %58
%66 = OpAccessChain %65 %18 %21 %64
%67 = OpLoad %14 %66
%69 = OpBitcast %68 %67
%70 = OpCompositeExtract %63 %69 0
%71 = OpCompositeExtract %63 %69 1
%73 = OpAccessChain %65 %18 %21 %72
%74 = OpLoad %14 %73
%75 = OpBitcast %68 %74
%76 = OpCompositeExtract %63 %75 0
%77 = OpCompositeExtract %63 %75 1
%78 = OpConvertSToF %7 %70
%79 = OpConvertSToF %7 %71
%80 = OpConvertSToF %7 %76
%81 = OpConvertSToF %7 %77
%82 = OpFAdd %7 %59 %78
%83 = OpFAdd %7 %60 %79
%84 = OpFAdd %7 %61 %80
%85 = OpFAdd %7 %62 %81
%87 = OpAccessChain %86 %20 %21
OpStore %87 %82
%88 = OpAccessChain %86 %20 %29
OpStore %88 %83
%89 = OpAccessChain %86 %20 %47
OpStore %89 %84
%90 = OpAccessChain %86 %20 %64
OpStore %90 %85
OpReturn
OpFunctionEnd
#endif
