#version 460

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
    mediump float _20 = C.x;
    float hp_copy_20 = _20;
    mediump float _23 = C.y;
    float hp_copy_23 = _23;
    mediump float _26 = C.z;
    float hp_copy_26 = _26;
    mediump float _29 = C.w;
    float hp_copy_29 = _29;
    uvec4 _44 = uvec4(registers._m4, registers._m5, registers._m6, registers._m7);
    uvec4 _61 = uvec4(registers._m8, registers._m9, registers._m10, registers._m11);
    SV_Target.x = int((_44.x + uint(int(hp_copy_20))) + _61.x);
    SV_Target.y = int((_44.y + uint(int(hp_copy_23))) + _61.y);
    SV_Target.z = int((_44.z + uint(int(hp_copy_26))) + _61.z);
    SV_Target.w = int((_44.w + uint(int(hp_copy_29))) + _61.w);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 89
; Schema: 0
OpCapability Shader
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
%50 = OpConstant %5 8
%53 = OpConstant %5 9
%56 = OpConstant %5 10
%59 = OpConstant %5 11
%78 = OpTypePointer Output %13
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %87
%87 = OpLabel
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
%45 = OpCompositeExtract %5 %44 0
%46 = OpCompositeExtract %5 %44 1
%47 = OpCompositeExtract %5 %44 2
%48 = OpCompositeExtract %5 %44 3
%49 = OpAccessChain %30 %8 %50
%51 = OpLoad %5 %49
%52 = OpAccessChain %30 %8 %53
%54 = OpLoad %5 %52
%55 = OpAccessChain %30 %8 %56
%57 = OpLoad %5 %55
%58 = OpAccessChain %30 %8 %59
%60 = OpLoad %5 %58
%61 = OpCompositeConstruct %43 %51 %54 %57 %60
%62 = OpCompositeExtract %5 %61 0
%63 = OpCompositeExtract %5 %61 1
%64 = OpCompositeExtract %5 %61 2
%65 = OpCompositeExtract %5 %61 3
%66 = OpConvertFToS %5 %20
%67 = OpConvertFToS %5 %23
%68 = OpConvertFToS %5 %26
%69 = OpConvertFToS %5 %29
%70 = OpIAdd %5 %45 %66
%71 = OpIAdd %5 %70 %62
%72 = OpIAdd %5 %46 %67
%73 = OpIAdd %5 %72 %63
%74 = OpIAdd %5 %47 %68
%75 = OpIAdd %5 %74 %64
%76 = OpIAdd %5 %48 %69
%77 = OpIAdd %5 %76 %65
%79 = OpAccessChain %78 %16 %19
%80 = OpBitcast %13 %71
OpStore %79 %80
%81 = OpAccessChain %78 %16 %22
%82 = OpBitcast %13 %73
OpStore %81 %82
%83 = OpAccessChain %78 %16 %25
%84 = OpBitcast %13 %75
OpStore %83 %84
%85 = OpAccessChain %78 %16 %28
%86 = OpBitcast %13 %77
OpStore %85 %86
OpReturn
OpFunctionEnd
#endif
