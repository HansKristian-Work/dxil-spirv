#version 460
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _9_11
{
    float _m0[24];
} _11;

layout(set = 0, binding = 0, std140) uniform _15_17
{
    vec4 _m0[6];
} _17;

layout(location = 0) flat in uint A;
layout(location = 1) in vec4 P;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _77 = A % 6u;
    SV_Target.x = _11._m0[_77 * 4u] * P.x;
    SV_Target.y = _11._m0[(_77 * 4u) + 1u] * P.y;
    SV_Target.z = _11._m0[(_77 * 4u) + 2u] * P.z;
    SV_Target.w = _11._m0[(_77 * 4u) + 3u] * P.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 105
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %19 %21 %23
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %9 ""
OpName %15 ""
OpName %19 "A"
OpName %21 "P"
OpName %23 "SV_Target"
OpDecorate %8 ArrayStride 4
OpMemberDecorate %9 0 Offset 0
OpDecorate %9 Block
OpDecorate %14 ArrayStride 16
OpMemberDecorate %15 0 Offset 0
OpDecorate %15 Block
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %19 Flat
OpDecorate %19 Location 0
OpDecorate %21 Location 1
OpDecorate %23 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 24
%7 = OpTypeFloat 32
%8 = OpTypeArray %7 %6
%9 = OpTypeStruct %8
%10 = OpTypePointer Uniform %9
%11 = OpVariable %10 Uniform
%12 = OpConstant %5 6
%13 = OpTypeVector %7 4
%14 = OpTypeArray %13 %12
%15 = OpTypeStruct %14
%16 = OpTypePointer Uniform %15
%17 = OpVariable %16 Uniform
%18 = OpTypePointer Input %5
%19 = OpVariable %18 Input
%20 = OpTypePointer Input %13
%21 = OpVariable %20 Input
%22 = OpTypePointer Output %13
%23 = OpVariable %22 Output
%24 = OpTypePointer Input %7
%26 = OpConstant %5 0
%29 = OpConstant %5 1
%32 = OpConstant %5 2
%35 = OpConstant %5 3
%38 = OpTypePointer Uniform %13
%63 = OpConstant %5 4
%70 = OpConstant %5 5
%79 = OpTypePointer Uniform %7
%98 = OpTypePointer Output %7
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %103
%103 = OpLabel
%25 = OpAccessChain %24 %21 %26
%27 = OpLoad %7 %25
%28 = OpAccessChain %24 %21 %29
%30 = OpLoad %7 %28
%31 = OpAccessChain %24 %21 %32
%33 = OpLoad %7 %31
%34 = OpAccessChain %24 %21 %35
%36 = OpLoad %7 %34
%37 = OpLoad %5 %19
%39 = OpAccessChain %38 %17 %26 %26
%40 = OpLoad %13 %39
%41 = OpCompositeExtract %7 %40 0
%42 = OpCompositeExtract %7 %40 1
%43 = OpCompositeExtract %7 %40 2
%44 = OpCompositeExtract %7 %40 3
%45 = OpAccessChain %38 %17 %26 %29
%46 = OpLoad %13 %45
%47 = OpCompositeExtract %7 %46 0
%48 = OpCompositeExtract %7 %46 1
%49 = OpCompositeExtract %7 %46 2
%50 = OpCompositeExtract %7 %46 3
%51 = OpAccessChain %38 %17 %26 %32
%52 = OpLoad %13 %51
%53 = OpCompositeExtract %7 %52 0
%54 = OpCompositeExtract %7 %52 1
%55 = OpCompositeExtract %7 %52 2
%56 = OpCompositeExtract %7 %52 3
%57 = OpAccessChain %38 %17 %26 %35
%58 = OpLoad %13 %57
%59 = OpCompositeExtract %7 %58 0
%60 = OpCompositeExtract %7 %58 1
%61 = OpCompositeExtract %7 %58 2
%62 = OpCompositeExtract %7 %58 3
%64 = OpAccessChain %38 %17 %26 %63
%65 = OpLoad %13 %64
%66 = OpCompositeExtract %7 %65 0
%67 = OpCompositeExtract %7 %65 1
%68 = OpCompositeExtract %7 %65 2
%69 = OpCompositeExtract %7 %65 3
%71 = OpAccessChain %38 %17 %26 %70
%72 = OpLoad %13 %71
%73 = OpCompositeExtract %7 %72 0
%74 = OpCompositeExtract %7 %72 1
%75 = OpCompositeExtract %7 %72 2
%76 = OpCompositeExtract %7 %72 3
%77 = OpUMod %5 %37 %12
%78 = OpIMul %5 %77 %63
%80 = OpAccessChain %79 %11 %26 %78
%81 = OpIMul %5 %77 %63
%82 = OpIAdd %5 %81 %29
%83 = OpAccessChain %79 %11 %26 %82
%84 = OpIMul %5 %77 %63
%85 = OpIAdd %5 %84 %32
%86 = OpAccessChain %79 %11 %26 %85
%87 = OpIMul %5 %77 %63
%88 = OpIAdd %5 %87 %35
%89 = OpAccessChain %79 %11 %26 %88
%90 = OpLoad %7 %80
%91 = OpLoad %7 %83
%92 = OpLoad %7 %86
%93 = OpLoad %7 %89
%94 = OpFMul %7 %90 %27
%95 = OpFMul %7 %91 %30
%96 = OpFMul %7 %92 %33
%97 = OpFMul %7 %93 %36
%99 = OpAccessChain %98 %23 %26
OpStore %99 %94
%100 = OpAccessChain %98 %23 %29
OpStore %100 %95
%101 = OpAccessChain %98 %23 %32
OpStore %101 %96
%102 = OpAccessChain %98 %23 %35
OpStore %102 %97
OpReturn
OpFunctionEnd
#endif
