#version 460
#extension GL_ARB_sparse_texture2 : require

struct SparseTexel
{
    uint _m0;
    uvec4 _m1;
};

struct _44
{
    uint _m0;
    uint _m1;
    uint _m2;
    uint _m3;
    uint _m4;
};

struct _91
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

float _95;
float _96;
float _116;
float _117;

void main()
{
    uint _25 = TEXCOORD << 3u;
    uint _27 = _25 >> 2u;
    uint _132;
    uvec4 _133;
    _132 = sparseTexelFetchARB(_8, int(_27), _133);
    SparseTexel _31 = SparseTexel(_132, _133);
    _44 _45 = _44(_31._m1.x, texelFetch(_8, int(_27 + 1u)).x, texelFetch(_8, int(_27 + 2u)).x, texelFetch(_8, int(_27 + 3u)).x, _31._m0);
    float _53 = float(sparseTexelsResidentARB(int(_45._m4)));
    uint _58 = _25 >> 2u;
    uint _134;
    uvec4 _135;
    _134 = sparseImageLoadARB(_12, int(_58), _135);
    SparseTexel _59 = SparseTexel(_134, _135);
    _44 _71 = _44(_59._m1.x, imageLoad(_12, int(_58 + 1u)).x, imageLoad(_12, int(_58 + 2u)).x, imageLoad(_12, int(_58 + 3u)).x, _59._m0);
    float _80 = float(sparseTexelsResidentARB(int(_71._m4)));
    uint _84 = TEXCOORD * 2u;
    uint _136;
    uvec4 _137;
    _136 = sparseTexelFetchARB(_9, int(_84), _137);
    SparseTexel _85 = SparseTexel(_136, _137);
    _91 _92 = _91(uintBitsToFloat(_85._m1.x), uintBitsToFloat(texelFetch(_9, int(_84 + 1u)).x), _95, _96, _85._m0);
    float _103 = float(sparseTexelsResidentARB(int(_92._m4)));
    uint _106 = TEXCOORD * 2u;
    uint _138;
    uvec4 _139;
    _138 = sparseImageLoadARB(_13, int(_106), _139);
    SparseTexel _107 = SparseTexel(_138, _139);
    _91 _113 = _91(uintBitsToFloat(_107._m1.x), uintBitsToFloat(imageLoad(_13, int(_106 + 1u)).x), _116, _117, _107._m0);
    float _124 = float(sparseTexelsResidentARB(int(_113._m4)));
    SV_Target.x = ((((((uintBitsToFloat(_45._m0) + _53) + uintBitsToFloat(_71._m0)) + _80) + _92._m0) + _103) + _113._m0) + _124;
    SV_Target.y = ((((((uintBitsToFloat(_45._m1) + _53) + uintBitsToFloat(_71._m1)) + _80) + _92._m1) + _103) + _113._m1) + _124;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 132
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
OpName %44 ""
OpName %91 ""
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
%44 = OpTypeStruct %5 %5 %5 %5 %5
%49 = OpTypeBool
%54 = OpConstant %16 1
%55 = OpConstant %16 0
%83 = OpConstant %5 0
%91 = OpTypeStruct %16 %16 %16 %16 %5
%127 = OpTypePointer Output %16
%3 = OpFunction %1 None %2
%4 = OpLabel
%95 = OpUndef %16
%96 = OpUndef %16
%116 = OpUndef %16
%117 = OpUndef %16
OpBranch %130
%130 = OpLabel
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
%39 = OpIAdd %5 %27 %28
%38 = OpImageFetch %29 %23 %39
%40 = OpCompositeExtract %5 %38 0
%42 = OpIAdd %5 %27 %26
%41 = OpImageFetch %29 %23 %42
%43 = OpCompositeExtract %5 %41 0
%45 = OpCompositeConstruct %44 %33 %37 %40 %43 %32
%46 = OpCompositeExtract %5 %45 0
%47 = OpCompositeExtract %5 %45 1
%48 = OpCompositeExtract %5 %45 4
%50 = OpImageSparseTexelsResident %49 %48
%51 = OpBitcast %16 %46
%52 = OpBitcast %16 %47
%53 = OpSelect %16 %50 %54 %55
%56 = OpFAdd %16 %51 %53
%57 = OpFAdd %16 %52 %53
%58 = OpShiftRightLogical %5 %25 %28
%59 = OpImageSparseRead %30 %21 %58
%60 = OpCompositeExtract %5 %59 0
%61 = OpCompositeExtract %5 %59 1 0
%63 = OpIAdd %5 %58 %36
%62 = OpImageRead %29 %21 %63
%64 = OpCompositeExtract %5 %62 0
%66 = OpIAdd %5 %58 %28
%65 = OpImageRead %29 %21 %66
%67 = OpCompositeExtract %5 %65 0
%69 = OpIAdd %5 %58 %26
%68 = OpImageRead %29 %21 %69
%70 = OpCompositeExtract %5 %68 0
%71 = OpCompositeConstruct %44 %61 %64 %67 %70 %60
%72 = OpCompositeExtract %5 %71 0
%73 = OpCompositeExtract %5 %71 1
%74 = OpCompositeExtract %5 %71 4
%75 = OpImageSparseTexelsResident %49 %74
%76 = OpBitcast %16 %72
%77 = OpBitcast %16 %73
%78 = OpFAdd %16 %56 %76
%79 = OpFAdd %16 %57 %77
%80 = OpSelect %16 %75 %54 %55
%81 = OpFAdd %16 %78 %80
%82 = OpFAdd %16 %79 %80
%84 = OpIMul %5 %24 %28
%85 = OpImageSparseFetch %30 %22 %84
%86 = OpCompositeExtract %5 %85 0
%87 = OpCompositeExtract %5 %85 1 0
%89 = OpIAdd %5 %84 %36
%88 = OpImageFetch %29 %22 %89
%90 = OpCompositeExtract %5 %88 0
%93 = OpBitcast %16 %87
%94 = OpBitcast %16 %90
%92 = OpCompositeConstruct %91 %93 %94 %95 %96 %86
%97 = OpCompositeExtract %16 %92 0
%98 = OpCompositeExtract %16 %92 1
%99 = OpCompositeExtract %5 %92 4
%100 = OpImageSparseTexelsResident %49 %99
%101 = OpFAdd %16 %81 %97
%102 = OpFAdd %16 %82 %98
%103 = OpSelect %16 %100 %54 %55
%104 = OpFAdd %16 %101 %103
%105 = OpFAdd %16 %102 %103
%106 = OpIMul %5 %24 %28
%107 = OpImageSparseRead %30 %20 %106
%108 = OpCompositeExtract %5 %107 0
%109 = OpCompositeExtract %5 %107 1 0
%111 = OpIAdd %5 %106 %36
%110 = OpImageRead %29 %20 %111
%112 = OpCompositeExtract %5 %110 0
%114 = OpBitcast %16 %109
%115 = OpBitcast %16 %112
%113 = OpCompositeConstruct %91 %114 %115 %116 %117 %108
%118 = OpCompositeExtract %16 %113 0
%119 = OpCompositeExtract %16 %113 1
%120 = OpCompositeExtract %5 %113 4
%121 = OpImageSparseTexelsResident %49 %120
%122 = OpFAdd %16 %104 %118
%123 = OpFAdd %16 %105 %119
%124 = OpSelect %16 %121 %54 %55
%125 = OpFAdd %16 %122 %124
%126 = OpFAdd %16 %123 %124
%128 = OpAccessChain %127 %19 %83
OpStore %128 %125
%129 = OpAccessChain %127 %19 %36
OpStore %129 %126
OpReturn
OpFunctionEnd
#endif
