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
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _9_11
{
    uint64_t _m0[10];
} _11;

layout(set = 0, binding = 0, scalar) uniform _15_17
{
    float _m0[20];
} _17;

layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = ((float(float16_t(_17._m0[4u])) + _17._m0[0u]) + float(float16_t(_17._m0[8u]))) + float(int64_t(_11._m0[6u]));
    SV_Target.y = ((float(float16_t(_17._m0[5u])) + _17._m0[1u]) + float(float16_t(_17._m0[9u]))) + float(int64_t(_11._m0[7u]));
    SV_Target.z = ((float(float16_t(_17._m0[6u])) + _17._m0[2u]) + float(float16_t(_17._m0[10u]))) + float(int64_t(_11._m0[8u]));
    SV_Target.w = ((float(float16_t(_17._m0[7u])) + _17._m0[3u]) + float(float16_t(_17._m0[11u]))) + float(int64_t(_11._m0[9u]));
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
OpCapability Int64
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %20
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %9 ""
OpName %15 ""
OpName %20 "SV_Target"
OpDecorate %8 ArrayStride 8
OpMemberDecorate %9 0 Offset 0
OpDecorate %9 Block
OpDecorate %14 ArrayStride 4
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
%6 = OpConstant %5 10
%7 = OpTypeInt 64 0
%8 = OpTypeArray %7 %6
%9 = OpTypeStruct %8
%10 = OpTypePointer Uniform %9
%11 = OpVariable %10 Uniform
%12 = OpConstant %5 20
%13 = OpTypeFloat 32
%14 = OpTypeArray %13 %12
%15 = OpTypeStruct %14
%16 = OpTypePointer Uniform %15
%17 = OpVariable %16 Uniform
%18 = OpTypeVector %13 4
%19 = OpTypePointer Output %18
%20 = OpVariable %19 Output
%21 = OpConstant %5 0
%22 = OpTypePointer Uniform %13
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
%82 = OpTypePointer Uniform %7
%99 = OpTypePointer Output %13
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %104
%104 = OpLabel
%23 = OpAccessChain %22 %17 %21 %21
%24 = OpLoad %13 %23
%26 = OpAccessChain %22 %17 %21 %25
%27 = OpLoad %13 %26
%29 = OpAccessChain %22 %17 %21 %28
%30 = OpLoad %13 %29
%32 = OpAccessChain %22 %17 %21 %31
%33 = OpLoad %13 %32
%35 = OpAccessChain %22 %17 %21 %34
%36 = OpLoad %13 %35
%38 = OpFConvert %37 %36
%40 = OpAccessChain %22 %17 %21 %39
%41 = OpLoad %13 %40
%42 = OpFConvert %37 %41
%44 = OpAccessChain %22 %17 %21 %43
%45 = OpLoad %13 %44
%46 = OpFConvert %37 %45
%48 = OpAccessChain %22 %17 %21 %47
%49 = OpLoad %13 %48
%50 = OpFConvert %37 %49
%51 = OpFConvert %13 %38
%52 = OpFConvert %13 %42
%53 = OpFConvert %13 %46
%54 = OpFConvert %13 %50
%55 = OpFAdd %13 %51 %24
%56 = OpFAdd %13 %52 %27
%57 = OpFAdd %13 %53 %30
%58 = OpFAdd %13 %54 %33
%60 = OpAccessChain %22 %17 %21 %59
%61 = OpLoad %13 %60
%62 = OpFConvert %37 %61
%64 = OpAccessChain %22 %17 %21 %63
%65 = OpLoad %13 %64
%66 = OpFConvert %37 %65
%67 = OpAccessChain %22 %17 %21 %6
%68 = OpLoad %13 %67
%69 = OpFConvert %37 %68
%71 = OpAccessChain %22 %17 %21 %70
%72 = OpLoad %13 %71
%73 = OpFConvert %37 %72
%74 = OpFConvert %13 %62
%75 = OpFConvert %13 %66
%76 = OpFConvert %13 %69
%77 = OpFConvert %13 %73
%78 = OpFAdd %13 %55 %74
%79 = OpFAdd %13 %56 %75
%80 = OpFAdd %13 %57 %76
%81 = OpFAdd %13 %58 %77
%83 = OpAccessChain %82 %11 %21 %43
%84 = OpLoad %7 %83
%85 = OpAccessChain %82 %11 %21 %47
%86 = OpLoad %7 %85
%87 = OpAccessChain %82 %11 %21 %59
%88 = OpLoad %7 %87
%89 = OpAccessChain %82 %11 %21 %63
%90 = OpLoad %7 %89
%91 = OpConvertSToF %13 %84
%92 = OpConvertSToF %13 %86
%93 = OpConvertSToF %13 %88
%94 = OpConvertSToF %13 %90
%95 = OpFAdd %13 %78 %91
%96 = OpFAdd %13 %79 %92
%97 = OpFAdd %13 %80 %93
%98 = OpFAdd %13 %81 %94
%100 = OpAccessChain %99 %20 %21
OpStore %100 %95
%101 = OpAccessChain %99 %20 %25
OpStore %101 %96
%102 = OpAccessChain %99 %20 %28
OpStore %102 %97
%103 = OpAccessChain %99 %20 %31
OpStore %103 %98
OpReturn
OpFunctionEnd
#endif
