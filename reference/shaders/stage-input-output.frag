#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require

layout(location = 0) in f16vec2 V;
layout(location = 0) out f16vec2 SV_Target;

void main()
{
    SV_Target.x = (V.x * float16_t(8.0)) + float16_t(4.0);
    SV_Target.y = (V.y * float16_t(8.0)) + float16_t(4.0);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 30
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability StorageInputOutput16
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
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %6
%10 = OpVariable %9 Output
%11 = OpTypePointer Input %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%17 = OpConstant %13 1
%20 = OpConstant %5 0x1p+3
%23 = OpConstant %5 0x1p+2
%25 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %28
%28 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%16 = OpAccessChain %11 %8 %17
%18 = OpLoad %5 %16
%19 = OpFMul %5 %15 %20
%21 = OpFMul %5 %18 %20
%22 = OpFAdd %5 %19 %23
%24 = OpFAdd %5 %21 %23
%26 = OpAccessChain %25 %10 %14
OpStore %26 %22
%27 = OpAccessChain %25 %10 %17
OpStore %27 %24
OpReturn
OpFunctionEnd
#endif
