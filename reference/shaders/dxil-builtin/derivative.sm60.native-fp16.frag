#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require

layout(location = 0) in vec2 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    float16_t _33 = float16_t(TEXCOORD.x);
    float16_t _34 = float16_t(TEXCOORD.y);
    SV_Target.x = ((dFdxFine(TEXCOORD.x) + dFdxCoarse(TEXCOORD.x)) + float(float16_t(dFdxCoarse(float(_33))))) + float(float16_t(dFdxFine(float(_33))));
    SV_Target.y = ((dFdxFine(TEXCOORD.y) + dFdxCoarse(TEXCOORD.y)) + float(float16_t(dFdxCoarse(float(_34))))) + float(float16_t(dFdxFine(float(_34))));
    SV_Target.z = ((dFdyFine(TEXCOORD.x) + dFdyCoarse(TEXCOORD.x)) + float(float16_t(dFdyCoarse(float(_33))))) + float(float16_t(dFdyFine(float(_33))));
    SV_Target.w = ((dFdyFine(TEXCOORD.y) + dFdyCoarse(TEXCOORD.y)) + float(float16_t(dFdyCoarse(float(_34))))) + float(float16_t(dFdyFine(float(_34))));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 84
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability DerivativeControl
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %11 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeVector %5 4
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%12 = OpTypePointer Input %5
%14 = OpTypeInt 32 0
%15 = OpConstant %14 0
%18 = OpConstant %14 1
%32 = OpTypeFloat 16
%75 = OpTypePointer Output %5
%79 = OpConstant %14 2
%81 = OpConstant %14 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %82
%82 = OpLabel
%13 = OpAccessChain %12 %8 %15
%16 = OpLoad %5 %13
%17 = OpAccessChain %12 %8 %18
%19 = OpLoad %5 %17
%20 = OpDPdxCoarse %5 %16
%21 = OpDPdxCoarse %5 %19
%22 = OpDPdyCoarse %5 %16
%23 = OpDPdyCoarse %5 %19
%24 = OpDPdxFine %5 %16
%25 = OpDPdxFine %5 %19
%26 = OpFAdd %5 %24 %20
%27 = OpFAdd %5 %25 %21
%28 = OpDPdyFine %5 %16
%29 = OpDPdyFine %5 %19
%30 = OpFAdd %5 %28 %22
%31 = OpFAdd %5 %29 %23
%33 = OpFConvert %32 %16
%34 = OpFConvert %32 %19
%35 = OpFConvert %5 %33
%36 = OpDPdxCoarse %5 %35
%37 = OpFConvert %32 %36
%38 = OpFConvert %5 %34
%39 = OpDPdxCoarse %5 %38
%40 = OpFConvert %32 %39
%41 = OpFConvert %5 %37
%42 = OpFConvert %5 %40
%43 = OpFAdd %5 %26 %41
%44 = OpFAdd %5 %27 %42
%45 = OpFConvert %5 %33
%46 = OpDPdyCoarse %5 %45
%47 = OpFConvert %32 %46
%48 = OpFConvert %5 %34
%49 = OpDPdyCoarse %5 %48
%50 = OpFConvert %32 %49
%51 = OpFConvert %5 %47
%52 = OpFConvert %5 %50
%53 = OpFAdd %5 %30 %51
%54 = OpFAdd %5 %31 %52
%55 = OpFConvert %5 %33
%56 = OpDPdxFine %5 %55
%57 = OpFConvert %32 %56
%58 = OpFConvert %5 %34
%59 = OpDPdxFine %5 %58
%60 = OpFConvert %32 %59
%61 = OpFConvert %5 %57
%62 = OpFConvert %5 %60
%63 = OpFAdd %5 %43 %61
%64 = OpFAdd %5 %44 %62
%65 = OpFConvert %5 %33
%66 = OpDPdyFine %5 %65
%67 = OpFConvert %32 %66
%68 = OpFConvert %5 %34
%69 = OpDPdyFine %5 %68
%70 = OpFConvert %32 %69
%71 = OpFConvert %5 %67
%72 = OpFConvert %5 %70
%73 = OpFAdd %5 %53 %71
%74 = OpFAdd %5 %54 %72
%76 = OpAccessChain %75 %11 %15
OpStore %76 %63
%77 = OpAccessChain %75 %11 %18
OpStore %77 %64
%78 = OpAccessChain %75 %11 %79
OpStore %78 %73
%80 = OpAccessChain %75 %11 %81
OpStore %80 %74
OpReturn
OpFunctionEnd
#endif
