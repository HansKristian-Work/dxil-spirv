#version 460
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#extension GL_EXT_shader_16bit_storage : require
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif

layout(location = 0) in mediump vec2 A;
layout(location = 1) flat in mediump ivec2 B;
layout(location = 1, component = 2) flat in mediump uint C;
layout(location = 0) out mediump vec2 SV_Target;
layout(location = 1) out mediump ivec2 SV_Target_1;
layout(location = 2) out mediump uint SV_Target_2;

void main()
{
    SV_Target.x = float(float16_t(A.x) * float16_t(8.0));
    SV_Target.y = float(float16_t(A.y) * float16_t(8.0));
    SV_Target_1.x = int(int16_t(uint16_t(B.x) * 65528us));
    SV_Target_1.y = int(int16_t(uint16_t(B.y) * 65528us));
    SV_Target_2 = uint(uint16_t(C) << 2us);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 62
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %12 %15 %17 %19 %21
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "A"
OpName %12 "B"
OpName %15 "C"
OpName %17 "SV_Target"
OpName %19 "SV_Target_1"
OpName %21 "SV_Target_2"
OpDecorate %8 RelaxedPrecision
OpDecorate %8 Location 0
OpDecorate %12 RelaxedPrecision
OpDecorate %12 Flat
OpDecorate %12 Location 1
OpDecorate %15 RelaxedPrecision
OpDecorate %15 Flat
OpDecorate %15 Location 1
OpDecorate %15 Component 2
OpDecorate %17 RelaxedPrecision
OpDecorate %17 Location 0
OpDecorate %19 RelaxedPrecision
OpDecorate %19 Location 1
OpDecorate %21 RelaxedPrecision
OpDecorate %21 Location 2
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeInt 32 1
%10 = OpTypeVector %9 2
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypeInt 32 0
%14 = OpTypePointer Input %13
%15 = OpVariable %14 Input
%16 = OpTypePointer Output %6
%17 = OpVariable %16 Output
%18 = OpTypePointer Output %10
%19 = OpVariable %18 Output
%20 = OpTypePointer Output %13
%21 = OpVariable %20 Output
%23 = OpTypeInt 16 0
%25 = OpTypePointer Input %9
%27 = OpConstant %13 0
%31 = OpConstant %13 1
%34 = OpTypePointer Input %5
%37 = OpTypeFloat 16
%43 = OpConstant %37 0x1p+3
%45 = OpTypePointer Output %5
%51 = OpConstant %23 65528
%53 = OpTypePointer Output %9
%59 = OpConstant %23 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %61
%61 = OpLabel
%22 = OpLoad %13 %15
%24 = OpUConvert %23 %22
%26 = OpAccessChain %25 %12 %27
%28 = OpLoad %9 %26
%29 = OpSConvert %23 %28
%30 = OpAccessChain %25 %12 %31
%32 = OpLoad %9 %30
%33 = OpSConvert %23 %32
%35 = OpAccessChain %34 %8 %27
%36 = OpLoad %5 %35
%38 = OpFConvert %37 %36
%39 = OpAccessChain %34 %8 %31
%40 = OpLoad %5 %39
%41 = OpFConvert %37 %40
%42 = OpFMul %37 %38 %43
%44 = OpFMul %37 %41 %43
%46 = OpAccessChain %45 %17 %27
%47 = OpFConvert %5 %42
OpStore %46 %47
%48 = OpAccessChain %45 %17 %31
%49 = OpFConvert %5 %44
OpStore %48 %49
%50 = OpIMul %23 %29 %51
%52 = OpIMul %23 %33 %51
%54 = OpAccessChain %53 %19 %27
%55 = OpSConvert %9 %50
OpStore %54 %55
%56 = OpAccessChain %53 %19 %31
%57 = OpSConvert %9 %52
OpStore %56 %57
%58 = OpShiftLeftLogical %23 %24 %59
%60 = OpUConvert %13 %58
OpStore %21 %60
OpReturn
OpFunctionEnd
#endif
