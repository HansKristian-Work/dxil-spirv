#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#extension GL_EXT_spirv_intrinsics : require

layout(location = 0) in mediump vec4 V;
layout(location = 0) out mediump vec4 SV_Target;

spirv_instruction(set = "GLSL.std.450", id = 81) float16_t spvNClamp(float16_t, float16_t, float16_t);
spirv_instruction(set = "GLSL.std.450", id = 81) f16vec2 spvNClamp(f16vec2, f16vec2, f16vec2);
spirv_instruction(set = "GLSL.std.450", id = 81) f16vec3 spvNClamp(f16vec3, f16vec3, f16vec3);
spirv_instruction(set = "GLSL.std.450", id = 81) f16vec4 spvNClamp(f16vec4, f16vec4, f16vec4);

void main()
{
    SV_Target.x = float(spvNClamp(float16_t(V.x), float16_t(0.0), float16_t(1.0)));
    SV_Target.y = float(spvNClamp(float16_t(V.y), float16_t(0.0), float16_t(1.0)));
    SV_Target.z = float(spvNClamp(float16_t(V.z), float16_t(0.0), float16_t(1.0)));
    SV_Target.w = float(spvNClamp(float16_t(V.w), float16_t(0.0), float16_t(1.0)));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 48
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
%30 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %8 "V"
OpName %10 "SV_Target"
OpDecorate %8 RelaxedPrecision
OpDecorate %8 Location 0
OpDecorate %10 RelaxedPrecision
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %6
%10 = OpVariable %9 Output
%11 = OpTypePointer Input %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%16 = OpTypeFloat 16
%19 = OpConstant %13 1
%23 = OpConstant %13 2
%27 = OpConstant %13 3
%31 = OpConstant %16 0x0p+0
%32 = OpConstant %16 0x1p+0
%37 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %46
%46 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%17 = OpFConvert %16 %15
%18 = OpAccessChain %11 %8 %19
%20 = OpLoad %5 %18
%21 = OpFConvert %16 %20
%22 = OpAccessChain %11 %8 %23
%24 = OpLoad %5 %22
%25 = OpFConvert %16 %24
%26 = OpAccessChain %11 %8 %27
%28 = OpLoad %5 %26
%29 = OpFConvert %16 %28
%33 = OpExtInst %16 %30 NClamp %17 %31 %32
%34 = OpExtInst %16 %30 NClamp %21 %31 %32
%35 = OpExtInst %16 %30 NClamp %25 %31 %32
%36 = OpExtInst %16 %30 NClamp %29 %31 %32
%38 = OpAccessChain %37 %10 %14
%39 = OpFConvert %5 %33
OpStore %38 %39
%40 = OpAccessChain %37 %10 %19
%41 = OpFConvert %5 %34
OpStore %40 %41
%42 = OpAccessChain %37 %10 %23
%43 = OpFConvert %5 %35
OpStore %42 %43
%44 = OpAccessChain %37 %10 %27
%45 = OpFConvert %5 %36
OpStore %44 %45
OpReturn
OpFunctionEnd
#endif
