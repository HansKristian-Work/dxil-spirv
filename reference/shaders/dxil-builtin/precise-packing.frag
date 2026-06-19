#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require

layout(location = 0) in float V;
layout(location = 0) out float SV_Target;

void main()
{
    SV_Target = float(float16_t(V));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 18
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability DenormPreserve
OpCapability FloatControls2
OpExtension "SPV_KHR_float_controls"
OpExtension "SPV_KHR_float_controls2"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %9
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpExecutionModeId %3 FPFastMathDefault %5 %15
OpExecutionModeId %3 FPFastMathDefault %11 %15
OpName %3 "main"
OpName %7 "V"
OpName %9 "SV_Target"
OpDecorate %7 Location 0
OpDecorate %9 Location 0
OpDecorate %13 FPFastMathMode AllowRecip
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypePointer Output %5
%9 = OpVariable %8 Output
%11 = OpTypeFloat 16
%14 = OpTypeInt 32 0
%15 = OpConstant %14 458767
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %16
%16 = OpLabel
%10 = OpLoad %5 %7
%12 = OpFConvert %11 %10
%13 = OpFConvert %5 %12
OpStore %9 %13
OpReturn
OpFunctionEnd
#endif
