#version 460
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _8_10
{
    uint _m0[24];
} _10;

layout(set = 0, binding = 0, std140) uniform _15_17
{
    vec4 _m0[6];
} _17;

layout(location = 0) flat in uint A;
layout(location = 1) in vec4 P;
layout(location = 0) out uvec4 SV_Target;

void main()
{
    uint _84 = A % 6u;
    SV_Target.x = uint(float(_10._m0[_84 * 4u]) * P.x);
    SV_Target.y = uint(float(_10._m0[(_84 * 4u) + 1u]) * P.y);
    SV_Target.z = uint(float(_10._m0[(_84 * 4u) + 2u]) * P.z);
    SV_Target.w = uint(float(_10._m0[(_84 * 4u) + 3u]) * P.w);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 120
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %19 %21 %24
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 ""
OpName %15 ""
OpName %19 "A"
OpName %21 "P"
OpName %24 "SV_Target"
OpDecorate %7 ArrayStride 4
OpMemberDecorate %8 0 Offset 0
OpDecorate %8 Block
OpDecorate %14 ArrayStride 16
OpMemberDecorate %15 0 Offset 0
OpDecorate %15 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %19 Flat
OpDecorate %19 Location 0
OpDecorate %21 Location 1
OpDecorate %24 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 24
%7 = OpTypeArray %5 %6
%8 = OpTypeStruct %7
%9 = OpTypePointer Uniform %8
%10 = OpVariable %9 Uniform
%11 = OpConstant %5 6
%12 = OpTypeFloat 32
%13 = OpTypeVector %12 4
%14 = OpTypeArray %13 %11
%15 = OpTypeStruct %14
%16 = OpTypePointer Uniform %15
%17 = OpVariable %16 Uniform
%18 = OpTypePointer Input %5
%19 = OpVariable %18 Input
%20 = OpTypePointer Input %13
%21 = OpVariable %20 Input
%22 = OpTypeVector %5 4
%23 = OpTypePointer Output %22
%24 = OpVariable %23 Output
%25 = OpTypePointer Input %12
%27 = OpConstant %5 0
%30 = OpConstant %5 1
%33 = OpConstant %5 2
%36 = OpConstant %5 3
%39 = OpTypePointer Uniform %13
%68 = OpConstant %5 4
%76 = OpConstant %5 5
%86 = OpTypePointer Uniform %5
%113 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %118
%118 = OpLabel
%26 = OpAccessChain %25 %21 %27
%28 = OpLoad %12 %26
%29 = OpAccessChain %25 %21 %30
%31 = OpLoad %12 %29
%32 = OpAccessChain %25 %21 %33
%34 = OpLoad %12 %32
%35 = OpAccessChain %25 %21 %36
%37 = OpLoad %12 %35
%38 = OpLoad %5 %19
%40 = OpAccessChain %39 %17 %27 %27
%41 = OpLoad %13 %40
%42 = OpBitcast %22 %41
%43 = OpCompositeExtract %5 %42 0
%44 = OpCompositeExtract %5 %42 1
%45 = OpCompositeExtract %5 %42 2
%46 = OpCompositeExtract %5 %42 3
%47 = OpAccessChain %39 %17 %27 %30
%48 = OpLoad %13 %47
%49 = OpBitcast %22 %48
%50 = OpCompositeExtract %5 %49 0
%51 = OpCompositeExtract %5 %49 1
%52 = OpCompositeExtract %5 %49 2
%53 = OpCompositeExtract %5 %49 3
%54 = OpAccessChain %39 %17 %27 %33
%55 = OpLoad %13 %54
%56 = OpBitcast %22 %55
%57 = OpCompositeExtract %5 %56 0
%58 = OpCompositeExtract %5 %56 1
%59 = OpCompositeExtract %5 %56 2
%60 = OpCompositeExtract %5 %56 3
%61 = OpAccessChain %39 %17 %27 %36
%62 = OpLoad %13 %61
%63 = OpBitcast %22 %62
%64 = OpCompositeExtract %5 %63 0
%65 = OpCompositeExtract %5 %63 1
%66 = OpCompositeExtract %5 %63 2
%67 = OpCompositeExtract %5 %63 3
%69 = OpAccessChain %39 %17 %27 %68
%70 = OpLoad %13 %69
%71 = OpBitcast %22 %70
%72 = OpCompositeExtract %5 %71 0
%73 = OpCompositeExtract %5 %71 1
%74 = OpCompositeExtract %5 %71 2
%75 = OpCompositeExtract %5 %71 3
%77 = OpAccessChain %39 %17 %27 %76
%78 = OpLoad %13 %77
%79 = OpBitcast %22 %78
%80 = OpCompositeExtract %5 %79 0
%81 = OpCompositeExtract %5 %79 1
%82 = OpCompositeExtract %5 %79 2
%83 = OpCompositeExtract %5 %79 3
%84 = OpUMod %5 %38 %11
%85 = OpIMul %5 %84 %68
%87 = OpAccessChain %86 %10 %27 %85
%88 = OpIMul %5 %84 %68
%89 = OpIAdd %5 %88 %30
%90 = OpAccessChain %86 %10 %27 %89
%91 = OpIMul %5 %84 %68
%92 = OpIAdd %5 %91 %33
%93 = OpAccessChain %86 %10 %27 %92
%94 = OpIMul %5 %84 %68
%95 = OpIAdd %5 %94 %36
%96 = OpAccessChain %86 %10 %27 %95
%97 = OpLoad %5 %87
%98 = OpLoad %5 %90
%99 = OpLoad %5 %93
%100 = OpLoad %5 %96
%101 = OpConvertUToF %12 %97
%102 = OpConvertUToF %12 %98
%103 = OpConvertUToF %12 %99
%104 = OpConvertUToF %12 %100
%105 = OpFMul %12 %101 %28
%106 = OpFMul %12 %102 %31
%107 = OpFMul %12 %103 %34
%108 = OpFMul %12 %104 %37
%109 = OpConvertFToU %5 %105
%110 = OpConvertFToU %5 %106
%111 = OpConvertFToU %5 %107
%112 = OpConvertFToU %5 %108
%114 = OpAccessChain %113 %24 %27
OpStore %114 %109
%115 = OpAccessChain %113 %24 %30
OpStore %115 %110
%116 = OpAccessChain %113 %24 %33
OpStore %116 %111
%117 = OpAccessChain %113 %24 %36
OpStore %117 %112
OpReturn
OpFunctionEnd
#endif
