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
layout(location = 0) out mediump ivec4 SV_Target;

void main()
{
    u16vec4 _52 = u16vec4(uvec4(registers._m4, registers._m5, registers._m6, registers._m7));
    u16vec4 _70 = u16vec4(uvec4(registers._m8, registers._m9, registers._m10, registers._m11));
    SV_Target.x = int(int16_t((_52.x + uint16_t(int16_t(float16_t(C.x)))) + _70.x));
    SV_Target.y = int(int16_t((_52.y + uint16_t(int16_t(float16_t(C.y)))) + _70.y));
    SV_Target.z = int(int16_t((_52.z + uint16_t(int16_t(float16_t(C.z)))) + _70.z));
    SV_Target.w = int(int16_t((_52.w + uint16_t(int16_t(float16_t(C.w)))) + _70.w));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 98
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %12 %16
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %12 "C"
OpName %16 "SV_Target"
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
OpDecorate %16 RelaxedPrecision
OpDecorate %16 Location 0
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
%13 = OpTypeInt 32 1
%14 = OpTypeVector %13 4
%15 = OpTypePointer Output %14
%16 = OpVariable %15 Output
%17 = OpTypePointer Input %9
%19 = OpConstant %5 0
%21 = OpTypeFloat 16
%24 = OpConstant %5 1
%28 = OpConstant %5 2
%32 = OpConstant %5 3
%35 = OpTypePointer PushConstant %5
%37 = OpConstant %5 4
%40 = OpConstant %5 5
%43 = OpConstant %5 6
%46 = OpConstant %5 7
%48 = OpTypeVector %5 4
%50 = OpTypeInt 16 0
%51 = OpTypeVector %50 4
%58 = OpConstant %5 8
%61 = OpConstant %5 9
%64 = OpConstant %5 10
%67 = OpConstant %5 11
%87 = OpTypePointer Output %13
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %96
%96 = OpLabel
%18 = OpAccessChain %17 %12 %19
%20 = OpLoad %9 %18
%22 = OpFConvert %21 %20
%23 = OpAccessChain %17 %12 %24
%25 = OpLoad %9 %23
%26 = OpFConvert %21 %25
%27 = OpAccessChain %17 %12 %28
%29 = OpLoad %9 %27
%30 = OpFConvert %21 %29
%31 = OpAccessChain %17 %12 %32
%33 = OpLoad %9 %31
%34 = OpFConvert %21 %33
%36 = OpAccessChain %35 %8 %37
%38 = OpLoad %5 %36
%39 = OpAccessChain %35 %8 %40
%41 = OpLoad %5 %39
%42 = OpAccessChain %35 %8 %43
%44 = OpLoad %5 %42
%45 = OpAccessChain %35 %8 %46
%47 = OpLoad %5 %45
%49 = OpCompositeConstruct %48 %38 %41 %44 %47
%52 = OpUConvert %51 %49
%53 = OpCompositeExtract %50 %52 0
%54 = OpCompositeExtract %50 %52 1
%55 = OpCompositeExtract %50 %52 2
%56 = OpCompositeExtract %50 %52 3
%57 = OpAccessChain %35 %8 %58
%59 = OpLoad %5 %57
%60 = OpAccessChain %35 %8 %61
%62 = OpLoad %5 %60
%63 = OpAccessChain %35 %8 %64
%65 = OpLoad %5 %63
%66 = OpAccessChain %35 %8 %67
%68 = OpLoad %5 %66
%69 = OpCompositeConstruct %48 %59 %62 %65 %68
%70 = OpUConvert %51 %69
%71 = OpCompositeExtract %50 %70 0
%72 = OpCompositeExtract %50 %70 1
%73 = OpCompositeExtract %50 %70 2
%74 = OpCompositeExtract %50 %70 3
%75 = OpConvertFToS %50 %22
%76 = OpConvertFToS %50 %26
%77 = OpConvertFToS %50 %30
%78 = OpConvertFToS %50 %34
%79 = OpIAdd %50 %53 %75
%80 = OpIAdd %50 %79 %71
%81 = OpIAdd %50 %54 %76
%82 = OpIAdd %50 %81 %72
%83 = OpIAdd %50 %55 %77
%84 = OpIAdd %50 %83 %73
%85 = OpIAdd %50 %56 %78
%86 = OpIAdd %50 %85 %74
%88 = OpAccessChain %87 %16 %19
%89 = OpSConvert %13 %80
OpStore %88 %89
%90 = OpAccessChain %87 %16 %24
%91 = OpSConvert %13 %82
OpStore %90 %91
%92 = OpAccessChain %87 %16 %28
%93 = OpSConvert %13 %84
OpStore %92 %93
%94 = OpAccessChain %87 %16 %32
%95 = OpSConvert %13 %86
OpStore %94 %95
OpReturn
OpFunctionEnd
#endif
