#version 460
#extension GL_ARB_sparse_texture2 : require

struct SparseTexel
{
    uint _m0;
    uvec4 _m1;
};

struct _38
{
    uint _m0;
    uint _m1;
    uint _m2;
    uint _m3;
    uint _m4;
};

struct _76
{
    float _m0;
    float _m1;
    float _m2;
    float _m3;
    uint _m4;
};

uint _40;
uint _41;
uint _60;
uint _61;
float _80;
float _81;
float _97;
float _98;

layout(set = 0, binding = 1) uniform usamplerBuffer _8;
layout(set = 0, binding = 2) uniform usamplerBuffer _9;
layout(set = 0, binding = 1, r32ui) uniform readonly uimageBuffer _12;
layout(set = 0, binding = 2, r32ui) uniform readonly uimageBuffer _13;

layout(location = 0) flat in uint TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    uint _27 = TEXCOORD * 2u;
    uint _122;
    uvec4 _123;
    _122 = sparseTexelFetchARB(_8, int(_27), _123);
    SparseTexel _31 = SparseTexel(_122, _123);
    _38 _39 = _38(_31._m1.x, texelFetch(_8, int(_27 + 1u)).x, _40, _41, _31._m0);
    uint _52 = TEXCOORD * 2u;
    uint _124;
    uvec4 _125;
    _124 = sparseImageLoadARB(_12, int(_52), _125);
    SparseTexel _53 = SparseTexel(_124, _125);
    _38 _59 = _38(_53._m1.x, imageLoad(_12, int(_52 + 1u)).x, _60, _61, _53._m0);
    uint _69 = TEXCOORD * 2u;
    uint _126;
    uvec4 _127;
    _126 = sparseTexelFetchARB(_9, int(_69), _127);
    SparseTexel _70 = SparseTexel(_126, _127);
    _76 _77 = _76(uintBitsToFloat(_70._m1.x), uintBitsToFloat(texelFetch(_9, int(_69 + 1u)).x), _80, _81, _70._m0);
    uint _87 = TEXCOORD * 2u;
    uint _128;
    uvec4 _129;
    _128 = sparseImageLoadARB(_13, int(_87), _129);
    SparseTexel _88 = SparseTexel(_128, _129);
    _76 _94 = _76(uintBitsToFloat(_88._m1.x), uintBitsToFloat(imageLoad(_13, int(_87 + 1u)).x), _97, _98, _88._m0);
    float _103 = float(sparseTexelsResidentARB(int(_94._m4)));
    float _105 = float(sparseTexelsResidentARB(int(_77._m4))) + (float(sparseTexelsResidentARB(int(_59._m4))) + float(sparseTexelsResidentARB(int(_39._m4))));
    SV_Target.x = ((((_105 + uintBitsToFloat(_39._m0)) + uintBitsToFloat(_59._m0)) + _77._m0) + _94._m0) + _103;
    SV_Target.y = ((((_105 + uintBitsToFloat(_39._m1)) + uintBitsToFloat(_59._m1)) + _77._m1) + _94._m1) + _103;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 122
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpCapability SampledBuffer
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %15 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %15 "TEXCOORD"
OpName %19 "SV_Target"
OpName %30 "SparseTexel"
OpName %38 ""
OpName %76 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 1
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 2
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 1
OpDecorate %12 NonWritable
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 2
OpDecorate %13 NonWritable
OpDecorate %15 Flat
OpDecorate %15 Location 0
OpDecorate %19 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpVariable %7 UniformConstant
%10 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpVariable %11 UniformConstant
%14 = OpTypePointer Input %5
%15 = OpVariable %14 Input
%16 = OpTypeFloat 32
%17 = OpTypeVector %16 2
%18 = OpTypePointer Output %17
%19 = OpVariable %18 Output
%26 = OpConstant %5 3
%28 = OpConstant %5 2
%29 = OpTypeVector %5 4
%30 = OpTypeStruct %5 %29
%36 = OpConstant %5 1
%38 = OpTypeStruct %5 %5 %5 %5 %5
%45 = OpTypeBool
%50 = OpConstant %16 1
%51 = OpConstant %16 0
%76 = OpTypeStruct %16 %16 %16 %16 %5
%116 = OpTypePointer Output %16
%118 = OpConstant %5 0
%3 = OpFunction %1 None %2
%4 = OpLabel
%40 = OpUndef %5
%41 = OpUndef %5
%60 = OpUndef %5
%61 = OpUndef %5
%80 = OpUndef %16
%81 = OpUndef %16
%97 = OpUndef %16
%98 = OpUndef %16
OpBranch %120
%120 = OpLabel
%20 = OpLoad %10 %13
%21 = OpLoad %10 %12
%22 = OpLoad %6 %9
%23 = OpLoad %6 %8
%24 = OpLoad %5 %15
%25 = OpShiftLeftLogical %5 %24 %26
%27 = OpIMul %5 %24 %28
%31 = OpImageSparseFetch %30 %23 %27
%32 = OpCompositeExtract %5 %31 0
%33 = OpCompositeExtract %5 %31 1 0
%35 = OpIAdd %5 %27 %36
%34 = OpImageFetch %29 %23 %35
%37 = OpCompositeExtract %5 %34 0
%39 = OpCompositeConstruct %38 %33 %37 %40 %41 %32
%42 = OpCompositeExtract %5 %39 0
%43 = OpCompositeExtract %5 %39 1
%44 = OpCompositeExtract %5 %39 4
%46 = OpImageSparseTexelsResident %45 %44
%47 = OpBitcast %16 %42
%48 = OpBitcast %16 %43
%49 = OpSelect %16 %46 %50 %51
%52 = OpIMul %5 %24 %28
%53 = OpImageSparseRead %30 %21 %52
%54 = OpCompositeExtract %5 %53 0
%55 = OpCompositeExtract %5 %53 1 0
%57 = OpIAdd %5 %52 %36
%56 = OpImageRead %29 %21 %57
%58 = OpCompositeExtract %5 %56 0
%59 = OpCompositeConstruct %38 %55 %58 %60 %61 %54
%62 = OpCompositeExtract %5 %59 0
%63 = OpCompositeExtract %5 %59 1
%64 = OpCompositeExtract %5 %59 4
%65 = OpImageSparseTexelsResident %45 %64
%66 = OpBitcast %16 %62
%67 = OpBitcast %16 %63
%68 = OpSelect %16 %65 %50 %51
%69 = OpIMul %5 %24 %28
%70 = OpImageSparseFetch %30 %22 %69
%71 = OpCompositeExtract %5 %70 0
%72 = OpCompositeExtract %5 %70 1 0
%74 = OpIAdd %5 %69 %36
%73 = OpImageFetch %29 %22 %74
%75 = OpCompositeExtract %5 %73 0
%78 = OpBitcast %16 %72
%79 = OpBitcast %16 %75
%77 = OpCompositeConstruct %76 %78 %79 %80 %81 %71
%82 = OpCompositeExtract %16 %77 0
%83 = OpCompositeExtract %16 %77 1
%84 = OpCompositeExtract %5 %77 4
%85 = OpImageSparseTexelsResident %45 %84
%86 = OpSelect %16 %85 %50 %51
%87 = OpIMul %5 %24 %28
%88 = OpImageSparseRead %30 %20 %87
%89 = OpCompositeExtract %5 %88 0
%90 = OpCompositeExtract %5 %88 1 0
%92 = OpIAdd %5 %87 %36
%91 = OpImageRead %29 %20 %92
%93 = OpCompositeExtract %5 %91 0
%95 = OpBitcast %16 %90
%96 = OpBitcast %16 %93
%94 = OpCompositeConstruct %76 %95 %96 %97 %98 %89
%99 = OpCompositeExtract %16 %94 0
%100 = OpCompositeExtract %16 %94 1
%101 = OpCompositeExtract %5 %94 4
%102 = OpImageSparseTexelsResident %45 %101
%103 = OpSelect %16 %102 %50 %51
%104 = OpFAdd %16 %68 %49
%105 = OpFAdd %16 %86 %104
%106 = OpFAdd %16 %105 %47
%107 = OpFAdd %16 %106 %66
%108 = OpFAdd %16 %107 %82
%109 = OpFAdd %16 %108 %99
%110 = OpFAdd %16 %109 %103
%111 = OpFAdd %16 %105 %48
%112 = OpFAdd %16 %111 %67
%113 = OpFAdd %16 %112 %83
%114 = OpFAdd %16 %113 %100
%115 = OpFAdd %16 %114 %103
%117 = OpAccessChain %116 %19 %118
OpStore %117 %110
%119 = OpAccessChain %116 %19 %36
OpStore %119 %115
OpReturn
OpFunctionEnd
#endif
