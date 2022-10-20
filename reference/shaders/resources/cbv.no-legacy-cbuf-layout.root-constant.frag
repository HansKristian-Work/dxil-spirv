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

layout(location = 0) out vec2 SV_Target;

void main()
{
    float _17 = uintBitsToFloat(registers._m4);
    float _35 = float(registers._m2 + registers._m5);
    float _45 = float(int(registers._m3 + registers._m6));
    SV_Target.x = ((uintBitsToFloat(registers._m0) + _17) + _35) + _45;
    SV_Target.y = ((uintBitsToFloat(registers._m1) + _17) + _35) + _45;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 53
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %12
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %12 "SV_Target"
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
OpDecorate %12 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeFloat 32
%10 = OpTypeVector %9 2
%11 = OpTypePointer Output %10
%12 = OpVariable %11 Output
%13 = OpTypePointer PushConstant %5
%15 = OpConstant %5 4
%19 = OpConstant %5 0
%23 = OpConstant %5 1
%29 = OpConstant %5 5
%32 = OpConstant %5 2
%39 = OpConstant %5 6
%42 = OpConstant %5 3
%48 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %51
%51 = OpLabel
%14 = OpAccessChain %13 %8 %15
%16 = OpLoad %5 %14
%17 = OpBitcast %9 %16
%18 = OpAccessChain %13 %8 %19
%20 = OpLoad %5 %18
%21 = OpBitcast %9 %20
%22 = OpAccessChain %13 %8 %23
%24 = OpLoad %5 %22
%25 = OpBitcast %9 %24
%26 = OpFAdd %9 %21 %17
%27 = OpFAdd %9 %25 %17
%28 = OpAccessChain %13 %8 %29
%30 = OpLoad %5 %28
%31 = OpAccessChain %13 %8 %32
%33 = OpLoad %5 %31
%34 = OpIAdd %5 %33 %30
%35 = OpConvertUToF %9 %34
%36 = OpFAdd %9 %26 %35
%37 = OpFAdd %9 %27 %35
%38 = OpAccessChain %13 %8 %39
%40 = OpLoad %5 %38
%41 = OpAccessChain %13 %8 %42
%43 = OpLoad %5 %41
%44 = OpIAdd %5 %43 %40
%45 = OpConvertSToF %9 %44
%46 = OpFAdd %9 %36 %45
%47 = OpFAdd %9 %37 %45
%49 = OpAccessChain %48 %12 %19
OpStore %49 %46
%50 = OpAccessChain %48 %12 %23
OpStore %50 %47
OpReturn
OpFunctionEnd
#endif
