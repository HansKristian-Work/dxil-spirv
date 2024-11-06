#version 460
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
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
layout(location = 0) out mediump ivec4 SV_Target;

void main()
{
    u16vec4 _47 = u16vec4(uvec4(registers._m4, registers._m5, registers._m6, registers._m7));
    u16vec4 _65 = u16vec4(uvec4(registers._m8, registers._m9, registers._m10, registers._m11));
    SV_Target.x = int(int16_t((_47.x + uint16_t(int16_t(C.x))) + _65.x));
    SV_Target.y = int(int16_t((_47.y + uint16_t(int16_t(C.y))) + _65.y));
    SV_Target.z = int(int16_t((_47.z + uint16_t(int16_t(C.z))) + _65.z));
    SV_Target.w = int(int16_t((_47.w + uint16_t(int16_t(C.w))) + _65.w));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 93
; Schema: 0
OpCapability Shader
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
%22 = OpConstant %5 1
%25 = OpConstant %5 2
%28 = OpConstant %5 3
%30 = OpTypePointer PushConstant %5
%32 = OpConstant %5 4
%35 = OpConstant %5 5
%38 = OpConstant %5 6
%41 = OpConstant %5 7
%43 = OpTypeVector %5 4
%45 = OpTypeInt 16 0
%46 = OpTypeVector %45 4
%53 = OpConstant %5 8
%56 = OpConstant %5 9
%59 = OpConstant %5 10
%62 = OpConstant %5 11
%82 = OpTypePointer Output %13
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %91
%91 = OpLabel
%18 = OpAccessChain %17 %12 %19
%20 = OpLoad %9 %18
%21 = OpAccessChain %17 %12 %22
%23 = OpLoad %9 %21
%24 = OpAccessChain %17 %12 %25
%26 = OpLoad %9 %24
%27 = OpAccessChain %17 %12 %28
%29 = OpLoad %9 %27
%31 = OpAccessChain %30 %8 %32
%33 = OpLoad %5 %31
%34 = OpAccessChain %30 %8 %35
%36 = OpLoad %5 %34
%37 = OpAccessChain %30 %8 %38
%39 = OpLoad %5 %37
%40 = OpAccessChain %30 %8 %41
%42 = OpLoad %5 %40
%44 = OpCompositeConstruct %43 %33 %36 %39 %42
%47 = OpUConvert %46 %44
%48 = OpCompositeExtract %45 %47 0
%49 = OpCompositeExtract %45 %47 1
%50 = OpCompositeExtract %45 %47 2
%51 = OpCompositeExtract %45 %47 3
%52 = OpAccessChain %30 %8 %53
%54 = OpLoad %5 %52
%55 = OpAccessChain %30 %8 %56
%57 = OpLoad %5 %55
%58 = OpAccessChain %30 %8 %59
%60 = OpLoad %5 %58
%61 = OpAccessChain %30 %8 %62
%63 = OpLoad %5 %61
%64 = OpCompositeConstruct %43 %54 %57 %60 %63
%65 = OpUConvert %46 %64
%66 = OpCompositeExtract %45 %65 0
%67 = OpCompositeExtract %45 %65 1
%68 = OpCompositeExtract %45 %65 2
%69 = OpCompositeExtract %45 %65 3
%70 = OpConvertFToS %45 %20
%71 = OpConvertFToS %45 %23
%72 = OpConvertFToS %45 %26
%73 = OpConvertFToS %45 %29
%74 = OpIAdd %45 %48 %70
%75 = OpIAdd %45 %74 %66
%76 = OpIAdd %45 %49 %71
%77 = OpIAdd %45 %76 %67
%78 = OpIAdd %45 %50 %72
%79 = OpIAdd %45 %78 %68
%80 = OpIAdd %45 %51 %73
%81 = OpIAdd %45 %80 %69
%83 = OpAccessChain %82 %16 %19
%84 = OpSConvert %13 %75
OpStore %83 %84
%85 = OpAccessChain %82 %16 %22
%86 = OpSConvert %13 %77
OpStore %85 %86
%87 = OpAccessChain %82 %16 %25
%88 = OpSConvert %13 %79
OpStore %87 %88
%89 = OpAccessChain %82 %16 %28
%90 = OpSConvert %13 %81
OpStore %89 %90
OpReturn
OpFunctionEnd
#endif
