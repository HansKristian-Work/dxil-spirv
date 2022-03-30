#version 460
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _9_11
{
    float _m0[1024];
} _11;

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _18 = INDEX << 4u;
    uint _20 = INDEX * 4u;
    float _38 = _11._m0[(INDEX * 4u) + 256u] + _11._m0[_20];
    float _39 = _11._m0[(INDEX * 4u) + 257u] + _11._m0[_20];
    uint _43 = (INDEX * 4u) + 512u;
    SV_Target.x = (_38 + _11._m0[_43]) + _11._m0[(INDEX * 4u) + 768u];
    SV_Target.y = (_39 + _11._m0[(INDEX * 4u) + 513u]) + _11._m0[(INDEX * 4u) + 769u];
    SV_Target.z = (_38 + _11._m0[(INDEX * 4u) + 514u]) + _11._m0[(INDEX * 4u) + 770u];
    SV_Target.w = (_39 + _11._m0[_43]) + _11._m0[(INDEX * 4u) + 771u];
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 107
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %13 %16
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %9 ""
OpName %13 "INDEX"
OpName %16 "SV_Target"
OpDecorate %8 ArrayStride 4
OpMemberDecorate %9 0 Offset 0
OpDecorate %9 Block
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %13 Flat
OpDecorate %13 Location 0
OpDecorate %16 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 1024
%7 = OpTypeFloat 32
%8 = OpTypeArray %7 %6
%9 = OpTypeStruct %8
%10 = OpTypePointer Uniform %9
%11 = OpVariable %10 Uniform
%12 = OpTypePointer Input %5
%13 = OpVariable %12 Input
%14 = OpTypeVector %7 4
%15 = OpTypePointer Output %14
%16 = OpVariable %15 Output
%19 = OpConstant %5 4
%21 = OpTypePointer Uniform %7
%23 = OpConstant %5 0
%28 = OpConstant %5 256
%32 = OpConstant %5 1028
%35 = OpConstant %5 257
%41 = OpConstant %5 2048
%44 = OpConstant %5 512
%48 = OpConstant %5 2052
%51 = OpConstant %5 513
%55 = OpConstant %5 2056
%58 = OpConstant %5 514
%66 = OpConstant %5 3072
%69 = OpConstant %5 768
%73 = OpConstant %5 3076
%76 = OpConstant %5 769
%80 = OpConstant %5 3080
%83 = OpConstant %5 770
%87 = OpConstant %5 3084
%90 = OpConstant %5 771
%97 = OpTypePointer Output %7
%100 = OpConstant %5 1
%102 = OpConstant %5 2
%104 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %105
%105 = OpLabel
%17 = OpLoad %5 %13
%18 = OpShiftLeftLogical %5 %17 %19
%20 = OpIMul %5 %17 %19
%22 = OpAccessChain %21 %11 %23 %20
%24 = OpLoad %7 %22
%25 = OpIAdd %5 %18 %6
%26 = OpIMul %5 %17 %19
%27 = OpIAdd %5 %26 %28
%29 = OpAccessChain %21 %11 %23 %27
%30 = OpLoad %7 %29
%31 = OpIAdd %5 %18 %32
%33 = OpIMul %5 %17 %19
%34 = OpIAdd %5 %33 %35
%36 = OpAccessChain %21 %11 %23 %34
%37 = OpLoad %7 %36
%38 = OpFAdd %7 %30 %24
%39 = OpFAdd %7 %37 %24
%40 = OpIAdd %5 %18 %41
%42 = OpIMul %5 %17 %19
%43 = OpIAdd %5 %42 %44
%45 = OpAccessChain %21 %11 %23 %43
%46 = OpLoad %7 %45
%47 = OpIAdd %5 %18 %48
%49 = OpIMul %5 %17 %19
%50 = OpIAdd %5 %49 %51
%52 = OpAccessChain %21 %11 %23 %50
%53 = OpLoad %7 %52
%54 = OpIAdd %5 %18 %55
%56 = OpIMul %5 %17 %19
%57 = OpIAdd %5 %56 %58
%59 = OpAccessChain %21 %11 %23 %57
%60 = OpLoad %7 %59
%61 = OpFAdd %7 %38 %46
%62 = OpFAdd %7 %39 %53
%63 = OpFAdd %7 %38 %60
%64 = OpFAdd %7 %39 %46
%65 = OpIAdd %5 %18 %66
%67 = OpIMul %5 %17 %19
%68 = OpIAdd %5 %67 %69
%70 = OpAccessChain %21 %11 %23 %68
%71 = OpLoad %7 %70
%72 = OpIAdd %5 %18 %73
%74 = OpIMul %5 %17 %19
%75 = OpIAdd %5 %74 %76
%77 = OpAccessChain %21 %11 %23 %75
%78 = OpLoad %7 %77
%79 = OpIAdd %5 %18 %80
%81 = OpIMul %5 %17 %19
%82 = OpIAdd %5 %81 %83
%84 = OpAccessChain %21 %11 %23 %82
%85 = OpLoad %7 %84
%86 = OpIAdd %5 %18 %87
%88 = OpIMul %5 %17 %19
%89 = OpIAdd %5 %88 %90
%91 = OpAccessChain %21 %11 %23 %89
%92 = OpLoad %7 %91
%93 = OpFAdd %7 %61 %71
%94 = OpFAdd %7 %62 %78
%95 = OpFAdd %7 %63 %85
%96 = OpFAdd %7 %64 %92
%98 = OpAccessChain %97 %16 %23
OpStore %98 %93
%99 = OpAccessChain %97 %16 %100
OpStore %99 %94
%101 = OpAccessChain %97 %16 %102
OpStore %101 %95
%103 = OpAccessChain %97 %16 %104
OpStore %103 %96
OpReturn
OpFunctionEnd
#endif
