#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require

layout(push_constant, std430) uniform RootConstants
{
    uint _m0;
    uint _m1;
    uint _m2;
    uint _m3;
    uint _m4;
    uint _m5;
    uint _m6;
    uint _m7;
    uint _m8;
    uint _m9;
    uint _m10;
    uint _m11;
    uint _m12;
    uint _m13;
    uint _m14;
    uint _m15;
} registers;

layout(location = 0) in mediump vec4 C;
layout(location = 0) out mediump vec4 SV_Target;

void main()
{
    f16vec4 _50 = f16vec4(uintBitsToFloat(uvec4(registers._m4, registers._m5, registers._m6, registers._m7)));
    f16vec4 _69 = f16vec4(uintBitsToFloat(uvec4(registers._m8, registers._m9, registers._m10, registers._m11)));
    SV_Target.x = float((_50.x + float16_t(C.x)) + _69.x);
    SV_Target.y = float((_50.y + float16_t(C.y)) + _69.y);
    SV_Target.z = float((_50.z + float16_t(C.z)) + _69.z);
    SV_Target.w = float((_50.w + float16_t(C.w)) + _69.w);
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
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %12 %14
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %12 "C"
OpName %14 "SV_Target"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpMemberDecorate %6 8 Offset 32
OpMemberDecorate %6 9 Offset 36
OpMemberDecorate %6 10 Offset 40
OpMemberDecorate %6 11 Offset 44
OpMemberDecorate %6 12 Offset 48
OpMemberDecorate %6 13 Offset 52
OpMemberDecorate %6 14 Offset 56
OpMemberDecorate %6 15 Offset 60
OpDecorate %12 RelaxedPrecision
OpDecorate %12 Location 0
OpDecorate %14 RelaxedPrecision
OpDecorate %14 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeFloat 32
%10 = OpTypeVector %9 4
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypePointer Output %10
%14 = OpVariable %13 Output
%15 = OpTypePointer Input %9
%17 = OpConstant %5 0
%19 = OpTypeFloat 16
%22 = OpConstant %5 1
%26 = OpConstant %5 2
%30 = OpConstant %5 3
%33 = OpTypePointer PushConstant %5
%35 = OpConstant %5 4
%38 = OpConstant %5 5
%41 = OpConstant %5 6
%44 = OpConstant %5 7
%46 = OpTypeVector %5 4
%49 = OpTypeVector %19 4
%56 = OpConstant %5 8
%59 = OpConstant %5 9
%62 = OpConstant %5 10
%65 = OpConstant %5 11
%82 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %91
%91 = OpLabel
%16 = OpAccessChain %15 %12 %17
%18 = OpLoad %9 %16
%20 = OpFConvert %19 %18
%21 = OpAccessChain %15 %12 %22
%23 = OpLoad %9 %21
%24 = OpFConvert %19 %23
%25 = OpAccessChain %15 %12 %26
%27 = OpLoad %9 %25
%28 = OpFConvert %19 %27
%29 = OpAccessChain %15 %12 %30
%31 = OpLoad %9 %29
%32 = OpFConvert %19 %31
%34 = OpAccessChain %33 %8 %35
%36 = OpLoad %5 %34
%37 = OpAccessChain %33 %8 %38
%39 = OpLoad %5 %37
%40 = OpAccessChain %33 %8 %41
%42 = OpLoad %5 %40
%43 = OpAccessChain %33 %8 %44
%45 = OpLoad %5 %43
%47 = OpCompositeConstruct %46 %36 %39 %42 %45
%48 = OpBitcast %10 %47
%50 = OpFConvert %49 %48
%51 = OpCompositeExtract %19 %50 0
%52 = OpCompositeExtract %19 %50 1
%53 = OpCompositeExtract %19 %50 2
%54 = OpCompositeExtract %19 %50 3
%55 = OpAccessChain %33 %8 %56
%57 = OpLoad %5 %55
%58 = OpAccessChain %33 %8 %59
%60 = OpLoad %5 %58
%61 = OpAccessChain %33 %8 %62
%63 = OpLoad %5 %61
%64 = OpAccessChain %33 %8 %65
%66 = OpLoad %5 %64
%67 = OpCompositeConstruct %46 %57 %60 %63 %66
%68 = OpBitcast %10 %67
%69 = OpFConvert %49 %68
%70 = OpCompositeExtract %19 %69 0
%71 = OpCompositeExtract %19 %69 1
%72 = OpCompositeExtract %19 %69 2
%73 = OpCompositeExtract %19 %69 3
%74 = OpFAdd %19 %51 %20
%75 = OpFAdd %19 %74 %70
%76 = OpFAdd %19 %52 %24
%77 = OpFAdd %19 %76 %71
%78 = OpFAdd %19 %53 %28
%79 = OpFAdd %19 %78 %72
%80 = OpFAdd %19 %54 %32
%81 = OpFAdd %19 %80 %73
%83 = OpAccessChain %82 %14 %17
%84 = OpFConvert %9 %75
OpStore %83 %84
%85 = OpAccessChain %82 %14 %22
%86 = OpFConvert %9 %77
OpStore %85 %86
%87 = OpAccessChain %82 %14 %26
%88 = OpFConvert %9 %79
OpStore %87 %88
%89 = OpAccessChain %82 %14 %30
%90 = OpFConvert %9 %81
OpStore %89 %90
OpReturn
OpFunctionEnd
#endif
