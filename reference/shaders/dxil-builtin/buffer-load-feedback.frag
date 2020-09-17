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

struct _83
{
    float _m0;
    float _m1;
    float _m2;
    float _m3;
    uint _m4;
};

layout(set = 0, binding = 1) uniform usamplerBuffer _8;
layout(set = 0, binding = 2) uniform usamplerBuffer _9;
layout(set = 0, binding = 1, r32ui) uniform readonly uimageBuffer _12;
layout(set = 0, binding = 2, r32ui) uniform readonly uimageBuffer _13;

layout(location = 0) flat in uint TEXCOORD;
layout(location = 0) out vec2 SV_Target;

uint _40;
uint _41;
uint _62;
uint _63;
float _87;
float _88;
float _108;
float _109;

void main()
{
    uint _25 = TEXCOORD << 3u;
    uint _27 = _25 >> 2u;
    uint _124;
    uvec4 _125;
    _124 = sparseTexelFetchARB(_8, int(_27), _125);
    SparseTexel _31 = SparseTexel(_124, _125);
    _38 _39 = _38(_31._m1.x, texelFetch(_8, int(_27 + 1u)).x, _40, _41, _31._m0);
    float _49 = float(sparseTexelsResidentARB(int(_39._m4)));
    uint _54 = _25 >> 2u;
    uint _126;
    uvec4 _127;
    _126 = sparseImageLoadARB(_12, int(_54), _127);
    SparseTexel _55 = SparseTexel(_126, _127);
    _38 _61 = _38(_55._m1.x, imageLoad(_12, int(_54 + 1u)).x, _62, _63, _55._m0);
    float _72 = float(sparseTexelsResidentARB(int(_61._m4)));
    uint _76 = TEXCOORD * 2u;
    uint _128;
    uvec4 _129;
    _128 = sparseTexelFetchARB(_9, int(_76), _129);
    SparseTexel _77 = SparseTexel(_128, _129);
    _83 _84 = _83(uintBitsToFloat(_77._m1.x), uintBitsToFloat(texelFetch(_9, int(_76 + 1u)).x), _87, _88, _77._m0);
    float _95 = float(sparseTexelsResidentARB(int(_84._m4)));
    uint _98 = TEXCOORD * 2u;
    uint _130;
    uvec4 _131;
    _130 = sparseImageLoadARB(_13, int(_98), _131);
    SparseTexel _99 = SparseTexel(_130, _131);
    _83 _105 = _83(uintBitsToFloat(_99._m1.x), uintBitsToFloat(imageLoad(_13, int(_98 + 1u)).x), _108, _109, _99._m0);
    float _116 = float(sparseTexelsResidentARB(int(_105._m4)));
    SV_Target.x = ((((((uintBitsToFloat(_39._m0) + _49) + uintBitsToFloat(_61._m0)) + _72) + _84._m0) + _95) + _105._m0) + _116;
    SV_Target.y = ((((((uintBitsToFloat(_39._m1) + _49) + uintBitsToFloat(_61._m1)) + _72) + _84._m1) + _95) + _105._m1) + _116;
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
OpName %83 ""
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
%75 = OpConstant %5 0
%83 = OpTypeStruct %16 %16 %16 %16 %5
%119 = OpTypePointer Output %16
%3 = OpFunction %1 None %2
%4 = OpLabel
%40 = OpUndef %5
%41 = OpUndef %5
%62 = OpUndef %5
%63 = OpUndef %5
%87 = OpUndef %16
%88 = OpUndef %16
%108 = OpUndef %16
%109 = OpUndef %16
OpBranch %122
%122 = OpLabel
%20 = OpLoad %10 %13
%21 = OpLoad %10 %12
%22 = OpLoad %6 %9
%23 = OpLoad %6 %8
%24 = OpLoad %5 %15
%25 = OpShiftLeftLogical %5 %24 %26
%27 = OpShiftRightLogical %5 %25 %28
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
%54 = OpShiftRightLogical %5 %25 %28
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
%76 = OpIMul %5 %24 %28
%77 = OpImageSparseFetch %30 %22 %76
%78 = OpCompositeExtract %5 %77 0
%79 = OpCompositeExtract %5 %77 1 0
%81 = OpIAdd %5 %76 %36
%80 = OpImageFetch %29 %22 %81
%82 = OpCompositeExtract %5 %80 0
%85 = OpBitcast %16 %79
%86 = OpBitcast %16 %82
%84 = OpCompositeConstruct %83 %85 %86 %87 %88 %78
%89 = OpCompositeExtract %16 %84 0
%90 = OpCompositeExtract %16 %84 1
%91 = OpCompositeExtract %5 %84 4
%92 = OpImageSparseTexelsResident %45 %91
%93 = OpFAdd %16 %73 %89
%94 = OpFAdd %16 %74 %90
%95 = OpSelect %16 %92 %50 %51
%96 = OpFAdd %16 %93 %95
%97 = OpFAdd %16 %94 %95
%98 = OpIMul %5 %24 %28
%99 = OpImageSparseRead %30 %20 %98
%100 = OpCompositeExtract %5 %99 0
%101 = OpCompositeExtract %5 %99 1 0
%103 = OpIAdd %5 %98 %36
%102 = OpImageRead %29 %20 %103
%104 = OpCompositeExtract %5 %102 0
%106 = OpBitcast %16 %101
%107 = OpBitcast %16 %104
%105 = OpCompositeConstruct %83 %106 %107 %108 %109 %100
%110 = OpCompositeExtract %16 %105 0
%111 = OpCompositeExtract %16 %105 1
%112 = OpCompositeExtract %5 %105 4
%113 = OpImageSparseTexelsResident %45 %112
%114 = OpFAdd %16 %96 %110
%115 = OpFAdd %16 %97 %111
%116 = OpSelect %16 %113 %50 %51
%117 = OpFAdd %16 %114 %116
%118 = OpFAdd %16 %115 %116
%120 = OpAccessChain %119 %19 %75
OpStore %120 %117
%121 = OpAccessChain %119 %19 %36
OpStore %121 %118
OpReturn
OpFunctionEnd
#endif
