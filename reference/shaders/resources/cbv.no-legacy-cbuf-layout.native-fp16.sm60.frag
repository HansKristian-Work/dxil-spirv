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
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _9_11
{
    float _m0[20];
} _11;

layout(set = 0, binding = 0, scalar) uniform _15_17
{
    double _m0[10];
} _17;

layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = ((float(float16_t(_11._m0[4u])) + _11._m0[0u]) + float(float16_t(_11._m0[8u]))) + float(int64_t(doubleBitsToUint64(_17._m0[6u])));
    SV_Target.y = ((float(float16_t(_11._m0[5u])) + _11._m0[1u]) + float(float16_t(_11._m0[9u]))) + float(int64_t(doubleBitsToUint64(_17._m0[7u])));
    SV_Target.z = ((float(float16_t(_11._m0[6u])) + _11._m0[2u]) + float(float16_t(_11._m0[10u]))) + float(int64_t(doubleBitsToUint64(_17._m0[8u])));
    SV_Target.w = ((float(float16_t(_11._m0[7u])) + _11._m0[3u]) + float(float16_t(_11._m0[11u]))) + float(int64_t(doubleBitsToUint64(_17._m0[9u])));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 111
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Float64
OpCapability Int64
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %20
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %9 ""
OpName %15 ""
OpName %20 "SV_Target"
OpDecorate %8 ArrayStride 4
OpMemberDecorate %9 0 Offset 0
OpDecorate %9 Block
OpDecorate %14 ArrayStride 8
OpMemberDecorate %15 0 Offset 0
OpDecorate %15 Block
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %20 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 20
%7 = OpTypeFloat 32
%8 = OpTypeArray %7 %6
%9 = OpTypeStruct %8
%10 = OpTypePointer Uniform %9
%11 = OpVariable %10 Uniform
%12 = OpConstant %5 10
%13 = OpTypeFloat 64
%14 = OpTypeArray %13 %12
%15 = OpTypeStruct %14
%16 = OpTypePointer Uniform %15
%17 = OpVariable %16 Uniform
%18 = OpTypeVector %7 4
%19 = OpTypePointer Output %18
%20 = OpVariable %19 Output
%21 = OpConstant %5 0
%22 = OpTypePointer Uniform %7
%25 = OpConstant %5 1
%28 = OpConstant %5 2
%31 = OpConstant %5 3
%34 = OpConstant %5 4
%37 = OpTypeFloat 16
%39 = OpConstant %5 5
%43 = OpConstant %5 6
%47 = OpConstant %5 7
%59 = OpConstant %5 8
%63 = OpConstant %5 9
%70 = OpConstant %5 11
%82 = OpTypeInt 64 0
%83 = OpTypePointer Uniform %13
%104 = OpTypePointer Output %7
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %109
%109 = OpLabel
%23 = OpAccessChain %22 %11 %21 %21
%24 = OpLoad %7 %23
%26 = OpAccessChain %22 %11 %21 %25
%27 = OpLoad %7 %26
%29 = OpAccessChain %22 %11 %21 %28
%30 = OpLoad %7 %29
%32 = OpAccessChain %22 %11 %21 %31
%33 = OpLoad %7 %32
%35 = OpAccessChain %22 %11 %21 %34
%36 = OpLoad %7 %35
%38 = OpFConvert %37 %36
%40 = OpAccessChain %22 %11 %21 %39
%41 = OpLoad %7 %40
%42 = OpFConvert %37 %41
%44 = OpAccessChain %22 %11 %21 %43
%45 = OpLoad %7 %44
%46 = OpFConvert %37 %45
%48 = OpAccessChain %22 %11 %21 %47
%49 = OpLoad %7 %48
%50 = OpFConvert %37 %49
%51 = OpFConvert %7 %38
%52 = OpFConvert %7 %42
%53 = OpFConvert %7 %46
%54 = OpFConvert %7 %50
%55 = OpFAdd %7 %51 %24
%56 = OpFAdd %7 %52 %27
%57 = OpFAdd %7 %53 %30
%58 = OpFAdd %7 %54 %33
%60 = OpAccessChain %22 %11 %21 %59
%61 = OpLoad %7 %60
%62 = OpFConvert %37 %61
%64 = OpAccessChain %22 %11 %21 %63
%65 = OpLoad %7 %64
%66 = OpFConvert %37 %65
%67 = OpAccessChain %22 %11 %21 %12
%68 = OpLoad %7 %67
%69 = OpFConvert %37 %68
%71 = OpAccessChain %22 %11 %21 %70
%72 = OpLoad %7 %71
%73 = OpFConvert %37 %72
%74 = OpFConvert %7 %62
%75 = OpFConvert %7 %66
%76 = OpFConvert %7 %69
%77 = OpFConvert %7 %73
%78 = OpFAdd %7 %55 %74
%79 = OpFAdd %7 %56 %75
%80 = OpFAdd %7 %57 %76
%81 = OpFAdd %7 %58 %77
%84 = OpAccessChain %83 %17 %21 %43
%85 = OpLoad %13 %84
%86 = OpBitcast %82 %85
%87 = OpAccessChain %83 %17 %21 %47
%88 = OpLoad %13 %87
%89 = OpBitcast %82 %88
%90 = OpAccessChain %83 %17 %21 %59
%91 = OpLoad %13 %90
%92 = OpBitcast %82 %91
%93 = OpAccessChain %83 %17 %21 %63
%94 = OpLoad %13 %93
%95 = OpBitcast %82 %94
%96 = OpConvertSToF %7 %86
%97 = OpConvertSToF %7 %89
%98 = OpConvertSToF %7 %92
%99 = OpConvertSToF %7 %95
%100 = OpFAdd %7 %78 %96
%101 = OpFAdd %7 %79 %97
%102 = OpFAdd %7 %80 %98
%103 = OpFAdd %7 %81 %99
%105 = OpAccessChain %104 %20 %21
OpStore %105 %100
%106 = OpAccessChain %104 %20 %25
OpStore %106 %101
%107 = OpAccessChain %104 %20 %28
OpStore %107 %102
%108 = OpAccessChain %104 %20 %31
OpStore %108 %103
OpReturn
OpFunctionEnd
#endif
