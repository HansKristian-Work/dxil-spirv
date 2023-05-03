#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require

layout(location = 0) in f16vec2 A;
layout(location = 1) flat in i16vec2 B;
layout(location = 1, component = 2) flat in uint16_t C;
layout(location = 0) out f16vec2 SV_Target;
layout(location = 1) out i16vec2 SV_Target_1;
layout(location = 2) out uint16_t SV_Target_2;

void main()
{
    SV_Target.x = A.x * float16_t(8.0);
    SV_Target.y = A.y * float16_t(8.0);
    SV_Target_1.x = int16_t(uint16_t(B.x) * 65528us);
    SV_Target_1.y = int16_t(uint16_t(B.y) * 65528us);
    SV_Target_2 = C << 2us;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 56
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability StorageInputOutput16
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %12 %15 %17 %19 %21
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %8 "A"
OpName %12 "B"
OpName %15 "C"
OpName %17 "SV_Target"
OpName %19 "SV_Target_1"
OpName %21 "SV_Target_2"
OpDecorate %8 Location 0
OpDecorate %12 Flat
OpDecorate %12 Location 1
OpDecorate %15 Flat
OpDecorate %15 Location 1
OpDecorate %15 Component 2
OpDecorate %17 Location 0
OpDecorate %19 Location 1
OpDecorate %21 Location 2
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 16
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeInt 16 1
%10 = OpTypeVector %9 2
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypeInt 16 0
%14 = OpTypePointer Input %13
%15 = OpVariable %14 Input
%16 = OpTypePointer Output %6
%17 = OpVariable %16 Output
%18 = OpTypePointer Output %10
%19 = OpVariable %18 Output
%20 = OpTypePointer Output %13
%21 = OpVariable %20 Output
%23 = OpTypePointer Input %9
%25 = OpTypeInt 32 0
%26 = OpConstant %25 0
%30 = OpConstant %25 1
%33 = OpTypePointer Input %5
%39 = OpConstant %5 0x1p+3
%42 = OpConstant %13 65528
%45 = OpConstant %13 2
%46 = OpTypePointer Output %5
%49 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %54
%54 = OpLabel
%22 = OpLoad %13 %15
%24 = OpAccessChain %23 %12 %26
%27 = OpLoad %9 %24
%28 = OpBitcast %13 %27
%29 = OpAccessChain %23 %12 %30
%31 = OpLoad %9 %29
%32 = OpBitcast %13 %31
%34 = OpAccessChain %33 %8 %26
%35 = OpLoad %5 %34
%36 = OpAccessChain %33 %8 %30
%37 = OpLoad %5 %36
%38 = OpFMul %5 %35 %39
%40 = OpFMul %5 %37 %39
%41 = OpIMul %13 %28 %42
%43 = OpIMul %13 %32 %42
%44 = OpShiftLeftLogical %13 %22 %45
%47 = OpAccessChain %46 %17 %26
OpStore %47 %38
%48 = OpAccessChain %46 %17 %30
OpStore %48 %40
%50 = OpAccessChain %49 %19 %26
%51 = OpBitcast %9 %41
OpStore %50 %51
%52 = OpAccessChain %49 %19 %30
%53 = OpBitcast %9 %43
OpStore %52 %53
OpStore %21 %44
OpReturn
OpFunctionEnd
#endif
