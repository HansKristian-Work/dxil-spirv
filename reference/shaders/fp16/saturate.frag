#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require

layout(location = 0) in f16vec4 V;
layout(location = 0) out f16vec4 SV_Target;

void main()
{
    float16_t _39 = isnan(float16_t(0.0)) ? V.x : (isnan(V.x) ? float16_t(0.0) : max(V.x, float16_t(0.0)));
    float16_t _50 = isnan(float16_t(0.0)) ? V.y : (isnan(V.y) ? float16_t(0.0) : max(V.y, float16_t(0.0)));
    float16_t _61 = isnan(float16_t(0.0)) ? V.z : (isnan(V.z) ? float16_t(0.0) : max(V.z, float16_t(0.0)));
    float16_t _72 = isnan(float16_t(0.0)) ? V.w : (isnan(V.w) ? float16_t(0.0) : max(V.w, float16_t(0.0)));
    SV_Target.x = isnan(float16_t(1.0)) ? _39 : (isnan(_39) ? float16_t(1.0) : min(_39, float16_t(1.0)));
    SV_Target.y = isnan(float16_t(1.0)) ? _50 : (isnan(_50) ? float16_t(1.0) : min(_50, float16_t(1.0)));
    SV_Target.z = isnan(float16_t(1.0)) ? _61 : (isnan(_61) ? float16_t(1.0) : min(_61, float16_t(1.0)));
    SV_Target.w = isnan(float16_t(1.0)) ? _72 : (isnan(_72) ? float16_t(1.0) : min(_72, float16_t(1.0)));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 39
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability StorageInputOutput16
%25 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "V"
OpName %10 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 16
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %6
%10 = OpVariable %9 Output
%11 = OpTypePointer Input %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%17 = OpConstant %13 1
%20 = OpConstant %13 2
%23 = OpConstant %13 3
%26 = OpConstant %5 0x0p+0
%27 = OpConstant %5 0x1p+0
%32 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %37
%37 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%16 = OpAccessChain %11 %8 %17
%18 = OpLoad %5 %16
%19 = OpAccessChain %11 %8 %20
%21 = OpLoad %5 %19
%22 = OpAccessChain %11 %8 %23
%24 = OpLoad %5 %22
%28 = OpExtInst %5 %25 NClamp %15 %26 %27
%29 = OpExtInst %5 %25 NClamp %18 %26 %27
%30 = OpExtInst %5 %25 NClamp %21 %26 %27
%31 = OpExtInst %5 %25 NClamp %24 %26 %27
%33 = OpAccessChain %32 %10 %14
OpStore %33 %28
%34 = OpAccessChain %32 %10 %17
OpStore %34 %29
%35 = OpAccessChain %32 %10 %20
OpStore %35 %30
%36 = OpAccessChain %32 %10 %23
OpStore %36 %31
OpReturn
OpFunctionEnd
#endif
