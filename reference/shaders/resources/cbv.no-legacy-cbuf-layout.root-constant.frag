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
    vec4 _44 = uintBitsToFloat(uvec4(registers._m0, registers._m1, registers._m2, registers._m3));
    uvec4 _55 = uvec4(registers._m4, registers._m5, registers._m6, registers._m7);
    uvec4 _65 = uvec4(registers._m0, registers._m1, registers._m2, registers._m3);
    float _74 = (float(_65.z + _55.y) + uintBitsToFloat(uvec4(registers._m4, registers._m5, registers._m6, registers._m7)).x) + float(int(_65.w + _55.z));
    SV_Target.x = _74 + _44.x;
    SV_Target.y = _74 + _44.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 82
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
%18 = OpConstant %5 5
%21 = OpConstant %5 6
%24 = OpConstant %5 7
%26 = OpTypeVector %5 4
%28 = OpTypeVector %9 4
%32 = OpConstant %5 0
%35 = OpConstant %5 1
%38 = OpConstant %5 2
%41 = OpConstant %5 3
%77 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %80
%80 = OpLabel
%14 = OpAccessChain %13 %8 %15
%16 = OpLoad %5 %14
%17 = OpAccessChain %13 %8 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %13 %8 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %13 %8 %24
%25 = OpLoad %5 %23
%27 = OpCompositeConstruct %26 %16 %19 %22 %25
%29 = OpBitcast %28 %27
%30 = OpCompositeExtract %9 %29 0
%31 = OpAccessChain %13 %8 %32
%33 = OpLoad %5 %31
%34 = OpAccessChain %13 %8 %35
%36 = OpLoad %5 %34
%37 = OpAccessChain %13 %8 %38
%39 = OpLoad %5 %37
%40 = OpAccessChain %13 %8 %41
%42 = OpLoad %5 %40
%43 = OpCompositeConstruct %26 %33 %36 %39 %42
%44 = OpBitcast %28 %43
%45 = OpCompositeExtract %9 %44 0
%46 = OpCompositeExtract %9 %44 1
%47 = OpAccessChain %13 %8 %15
%48 = OpLoad %5 %47
%49 = OpAccessChain %13 %8 %18
%50 = OpLoad %5 %49
%51 = OpAccessChain %13 %8 %21
%52 = OpLoad %5 %51
%53 = OpAccessChain %13 %8 %24
%54 = OpLoad %5 %53
%55 = OpCompositeConstruct %26 %48 %50 %52 %54
%56 = OpCompositeExtract %5 %55 1
%57 = OpAccessChain %13 %8 %32
%58 = OpLoad %5 %57
%59 = OpAccessChain %13 %8 %35
%60 = OpLoad %5 %59
%61 = OpAccessChain %13 %8 %38
%62 = OpLoad %5 %61
%63 = OpAccessChain %13 %8 %41
%64 = OpLoad %5 %63
%65 = OpCompositeConstruct %26 %58 %60 %62 %64
%66 = OpCompositeExtract %5 %65 2
%67 = OpIAdd %5 %66 %56
%68 = OpConvertUToF %9 %67
%69 = OpCompositeExtract %5 %55 2
%70 = OpCompositeExtract %5 %65 3
%71 = OpIAdd %5 %70 %69
%72 = OpConvertSToF %9 %71
%73 = OpFAdd %9 %68 %30
%74 = OpFAdd %9 %73 %72
%75 = OpFAdd %9 %74 %45
%76 = OpFAdd %9 %74 %46
%78 = OpAccessChain %77 %12 %32
OpStore %78 %75
%79 = OpAccessChain %77 %12 %35
OpStore %79 %76
OpReturn
OpFunctionEnd
#endif
