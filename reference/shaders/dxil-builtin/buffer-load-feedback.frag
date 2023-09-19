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

struct _82
{
    float _m0;
    float _m1;
    float _m2;
    float _m3;
    uint _m4;
};

uint _40;
uint _41;
uint _62;
uint _63;
float _86;
float _87;
float _107;
float _108;

layout(set = 0, binding = 1) uniform usamplerBuffer _8;
layout(set = 0, binding = 2) uniform usamplerBuffer _9;
layout(set = 0, binding = 1, r32ui) uniform readonly uimageBuffer _12;
layout(set = 0, binding = 2, r32ui) uniform readonly uimageBuffer _13;

layout(location = 0) flat in uint TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    uint _27 = TEXCOORD * 2u;
    uint _124;
    uvec4 _125;
    _124 = sparseTexelFetchARB(_8, int(_27), _125);
    SparseTexel _31 = SparseTexel(_124, _125);
    _38 _39 = _38(_31._m1.x, texelFetch(_8, int(_27 + 1u)).x, _40, _41, _31._m0);
    float _49 = float(sparseTexelsResidentARB(int(_39._m4)));
    uint _54 = TEXCOORD * 2u;
    uint _126;
    uvec4 _127;
    _126 = sparseImageLoadARB(_12, int(_54), _127);
    SparseTexel _55 = SparseTexel(_126, _127);
    _38 _61 = _38(_55._m1.x, imageLoad(_12, int(_54 + 1u)).x, _62, _63, _55._m0);
    float _72 = float(sparseTexelsResidentARB(int(_61._m4)));
    uint _75 = TEXCOORD * 2u;
    uint _128;
    uvec4 _129;
    _128 = sparseTexelFetchARB(_9, int(_75), _129);
    SparseTexel _76 = SparseTexel(_128, _129);
    _82 _83 = _82(uintBitsToFloat(_76._m1.x), uintBitsToFloat(texelFetch(_9, int(_75 + 1u)).x), _86, _87, _76._m0);
    float _94 = float(sparseTexelsResidentARB(int(_83._m4)));
    uint _97 = TEXCOORD * 2u;
    uint _130;
    uvec4 _131;
    _130 = sparseImageLoadARB(_13, int(_97), _131);
    SparseTexel _98 = SparseTexel(_130, _131);
    _82 _104 = _82(uintBitsToFloat(_98._m1.x), uintBitsToFloat(imageLoad(_13, int(_97 + 1u)).x), _107, _108, _98._m0);
    float _115 = float(sparseTexelsResidentARB(int(_104._m4)));
    SV_Target.x = ((((((uintBitsToFloat(_39._m0) + _49) + uintBitsToFloat(_61._m0)) + _72) + _83._m0) + _94) + _104._m0) + _115;
    SV_Target.y = ((((((uintBitsToFloat(_39._m1) + _49) + uintBitsToFloat(_61._m1)) + _72) + _83._m1) + _94) + _104._m1) + _115;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 124
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
OpName %82 ""
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
%82 = OpTypeStruct %16 %16 %16 %16 %5
%118 = OpTypePointer Output %16
%120 = OpConstant %5 0
%3 = OpFunction %1 None %2
%4 = OpLabel
%40 = OpUndef %5
%41 = OpUndef %5
%62 = OpUndef %5
%63 = OpUndef %5
%86 = OpUndef %16
%87 = OpUndef %16
%107 = OpUndef %16
%108 = OpUndef %16
OpBranch %122
%122 = OpLabel
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
%52 = OpFAdd %16 %47 %49
%53 = OpFAdd %16 %48 %49
%54 = OpIMul %5 %24 %28
%55 = OpImageSparseRead %30 %21 %54
%56 = OpCompositeExtract %5 %55 0
%57 = OpCompositeExtract %5 %55 1 0
%59 = OpIAdd %5 %54 %36
%58 = OpImageRead %29 %21 %59
%60 = OpCompositeExtract %5 %58 0
%61 = OpCompositeConstruct %38 %57 %60 %62 %63 %56
%64 = OpCompositeExtract %5 %61 0
%65 = OpCompositeExtract %5 %61 1
%66 = OpCompositeExtract %5 %61 4
%67 = OpImageSparseTexelsResident %45 %66
%68 = OpBitcast %16 %64
%69 = OpBitcast %16 %65
%70 = OpFAdd %16 %52 %68
%71 = OpFAdd %16 %53 %69
%72 = OpSelect %16 %67 %50 %51
%73 = OpFAdd %16 %70 %72
%74 = OpFAdd %16 %71 %72
%75 = OpIMul %5 %24 %28
%76 = OpImageSparseFetch %30 %22 %75
%77 = OpCompositeExtract %5 %76 0
%78 = OpCompositeExtract %5 %76 1 0
%80 = OpIAdd %5 %75 %36
%79 = OpImageFetch %29 %22 %80
%81 = OpCompositeExtract %5 %79 0
%84 = OpBitcast %16 %78
%85 = OpBitcast %16 %81
%83 = OpCompositeConstruct %82 %84 %85 %86 %87 %77
%88 = OpCompositeExtract %16 %83 0
%89 = OpCompositeExtract %16 %83 1
%90 = OpCompositeExtract %5 %83 4
%91 = OpImageSparseTexelsResident %45 %90
%92 = OpFAdd %16 %73 %88
%93 = OpFAdd %16 %74 %89
%94 = OpSelect %16 %91 %50 %51
%95 = OpFAdd %16 %92 %94
%96 = OpFAdd %16 %93 %94
%97 = OpIMul %5 %24 %28
%98 = OpImageSparseRead %30 %20 %97
%99 = OpCompositeExtract %5 %98 0
%100 = OpCompositeExtract %5 %98 1 0
%102 = OpIAdd %5 %97 %36
%101 = OpImageRead %29 %20 %102
%103 = OpCompositeExtract %5 %101 0
%105 = OpBitcast %16 %100
%106 = OpBitcast %16 %103
%104 = OpCompositeConstruct %82 %105 %106 %107 %108 %99
%109 = OpCompositeExtract %16 %104 0
%110 = OpCompositeExtract %16 %104 1
%111 = OpCompositeExtract %5 %104 4
%112 = OpImageSparseTexelsResident %45 %111
%113 = OpFAdd %16 %95 %109
%114 = OpFAdd %16 %96 %110
%115 = OpSelect %16 %112 %50 %51
%116 = OpFAdd %16 %113 %115
%117 = OpFAdd %16 %114 %115
%119 = OpAccessChain %118 %19 %120
OpStore %119 %116
%121 = OpAccessChain %118 %19 %36
OpStore %121 %117
OpReturn
OpFunctionEnd
#endif
