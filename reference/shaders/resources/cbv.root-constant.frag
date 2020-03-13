#version 460

layout(set = 2, binding = 2, std140) uniform _13_15
{
    vec4 _m0[1];
} _15;

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

layout(location = 0) out float SV_Target;

void main()
{
    uvec4 _49 = uvec4(registers._m4, registers._m5, registers._m6, registers._m7);
    uvec4 _53 = floatBitsToUint(_15._m0[0u]);
    SV_Target = ((_15._m0[0u].x + uintBitsToFloat(uvec4(registers._m4, registers._m5, registers._m6, registers._m7)).x) + float(_53.y + _49.y)) + float(int(_53.z + _49.z));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 65
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %17
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %13 ""
OpName %17 "SV_Target"
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
OpDecorate %12 ArrayStride 16
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %15 DescriptorSet 2
OpDecorate %15 Binding 2
OpDecorate %17 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpConstant %5 1
%10 = OpTypeFloat 32
%11 = OpTypeVector %10 4
%12 = OpTypeArray %11 %9
%13 = OpTypeStruct %12
%14 = OpTypePointer Uniform %13
%15 = OpVariable %14 Uniform
%16 = OpTypePointer Output %10
%17 = OpVariable %16 Output
%18 = OpTypePointer PushConstant %5
%20 = OpConstant %5 4
%23 = OpConstant %5 5
%26 = OpConstant %5 6
%29 = OpConstant %5 7
%31 = OpTypeVector %5 4
%35 = OpConstant %5 0
%36 = OpTypePointer Uniform %11
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %63
%63 = OpLabel
%19 = OpAccessChain %18 %8 %20
%21 = OpLoad %5 %19
%22 = OpAccessChain %18 %8 %23
%24 = OpLoad %5 %22
%25 = OpAccessChain %18 %8 %26
%27 = OpLoad %5 %25
%28 = OpAccessChain %18 %8 %29
%30 = OpLoad %5 %28
%32 = OpCompositeConstruct %31 %21 %24 %27 %30
%33 = OpBitcast %11 %32
%34 = OpCompositeExtract %10 %33 0
%37 = OpAccessChain %36 %15 %35 %35
%38 = OpLoad %11 %37
%39 = OpCompositeExtract %10 %38 0
%40 = OpFAdd %10 %39 %34
%41 = OpAccessChain %18 %8 %20
%42 = OpLoad %5 %41
%43 = OpAccessChain %18 %8 %23
%44 = OpLoad %5 %43
%45 = OpAccessChain %18 %8 %26
%46 = OpLoad %5 %45
%47 = OpAccessChain %18 %8 %29
%48 = OpLoad %5 %47
%49 = OpCompositeConstruct %31 %42 %44 %46 %48
%50 = OpCompositeExtract %5 %49 1
%51 = OpAccessChain %36 %15 %35 %35
%52 = OpLoad %11 %51
%53 = OpBitcast %31 %52
%54 = OpCompositeExtract %5 %53 1
%55 = OpIAdd %5 %54 %50
%56 = OpConvertUToF %10 %55
%57 = OpFAdd %10 %40 %56
%58 = OpCompositeExtract %5 %49 2
%59 = OpCompositeExtract %5 %53 2
%60 = OpIAdd %5 %59 %58
%61 = OpConvertSToF %10 %60
%62 = OpFAdd %10 %57 %61
OpStore %17 %62
OpReturn
OpFunctionEnd
#endif
