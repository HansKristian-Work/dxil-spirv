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
layout(location = 0) out mediump vec4 SV_Target;

void main()
{
    vec4 _43 = uintBitsToFloat(uvec4(registers._m4, registers._m5, registers._m6, registers._m7));
    vec4 _61 = uintBitsToFloat(uvec4(registers._m8, registers._m9, registers._m10, registers._m11));
    SV_Target.x = (_43.x + C.x) + _61.x;
    SV_Target.y = (_43.y + C.y) + _61.y;
    SV_Target.z = (_43.z + C.z) + _61.z;
    SV_Target.w = (_43.w + C.w) + _61.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 81
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %12 %14
OpExecutionMode %3 OriginUpperLeft
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
OpDecorate %44 RelaxedPrecision
OpDecorate %45 RelaxedPrecision
OpDecorate %46 RelaxedPrecision
OpDecorate %47 RelaxedPrecision
OpDecorate %62 RelaxedPrecision
OpDecorate %63 RelaxedPrecision
OpDecorate %64 RelaxedPrecision
OpDecorate %65 RelaxedPrecision
OpDecorate %66 RelaxedPrecision
OpDecorate %67 RelaxedPrecision
OpDecorate %68 RelaxedPrecision
OpDecorate %69 RelaxedPrecision
OpDecorate %70 RelaxedPrecision
OpDecorate %71 RelaxedPrecision
OpDecorate %72 RelaxedPrecision
OpDecorate %73 RelaxedPrecision
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
%20 = OpConstant %5 1
%23 = OpConstant %5 2
%26 = OpConstant %5 3
%28 = OpTypePointer PushConstant %5
%30 = OpConstant %5 4
%33 = OpConstant %5 5
%36 = OpConstant %5 6
%39 = OpConstant %5 7
%41 = OpTypeVector %5 4
%49 = OpConstant %5 8
%52 = OpConstant %5 9
%55 = OpConstant %5 10
%58 = OpConstant %5 11
%74 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %79
%79 = OpLabel
%16 = OpAccessChain %15 %12 %17
%18 = OpLoad %9 %16
%19 = OpAccessChain %15 %12 %20
%21 = OpLoad %9 %19
%22 = OpAccessChain %15 %12 %23
%24 = OpLoad %9 %22
%25 = OpAccessChain %15 %12 %26
%27 = OpLoad %9 %25
%29 = OpAccessChain %28 %8 %30
%31 = OpLoad %5 %29
%32 = OpAccessChain %28 %8 %33
%34 = OpLoad %5 %32
%35 = OpAccessChain %28 %8 %36
%37 = OpLoad %5 %35
%38 = OpAccessChain %28 %8 %39
%40 = OpLoad %5 %38
%42 = OpCompositeConstruct %41 %31 %34 %37 %40
%43 = OpBitcast %10 %42
%44 = OpCompositeExtract %9 %43 0
%45 = OpCompositeExtract %9 %43 1
%46 = OpCompositeExtract %9 %43 2
%47 = OpCompositeExtract %9 %43 3
%48 = OpAccessChain %28 %8 %49
%50 = OpLoad %5 %48
%51 = OpAccessChain %28 %8 %52
%53 = OpLoad %5 %51
%54 = OpAccessChain %28 %8 %55
%56 = OpLoad %5 %54
%57 = OpAccessChain %28 %8 %58
%59 = OpLoad %5 %57
%60 = OpCompositeConstruct %41 %50 %53 %56 %59
%61 = OpBitcast %10 %60
%62 = OpCompositeExtract %9 %61 0
%63 = OpCompositeExtract %9 %61 1
%64 = OpCompositeExtract %9 %61 2
%65 = OpCompositeExtract %9 %61 3
%66 = OpFAdd %9 %44 %18
%67 = OpFAdd %9 %66 %62
%68 = OpFAdd %9 %45 %21
%69 = OpFAdd %9 %68 %63
%70 = OpFAdd %9 %46 %24
%71 = OpFAdd %9 %70 %64
%72 = OpFAdd %9 %47 %27
%73 = OpFAdd %9 %72 %65
%75 = OpAccessChain %74 %14 %17
OpStore %75 %67
%76 = OpAccessChain %74 %14 %20
OpStore %76 %69
%77 = OpAccessChain %74 %14 %23
OpStore %77 %71
%78 = OpAccessChain %74 %14 %26
OpStore %78 %73
OpReturn
OpFunctionEnd
#endif
