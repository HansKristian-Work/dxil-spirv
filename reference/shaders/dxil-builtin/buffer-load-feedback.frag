#version 460
#extension GL_ARB_sparse_texture2 : require
#extension GL_EXT_samplerless_texture_functions : require

struct SparseTexel
{
    uint _m0;
    uvec4 _m1;
};

struct _48
{
    uint _m0;
    uint _m1;
    uint _m2;
    uint _m3;
    uint _m4;
};

struct _87
{
    float _m0;
    float _m1;
    float _m2;
    float _m3;
    uint _m4;
};

uint _50;
uint _51;
uint _71;
uint _72;
float _91;
float _92;
float _108;
float _109;

layout(set = 0, binding = 1) uniform usamplerBuffer _8;
layout(set = 0, binding = 2) uniform usamplerBuffer _9;
layout(set = 0, binding = 1, r32ui) uniform readonly uimageBuffer _12;
layout(set = 0, binding = 2, r32ui) uniform readonly uimageBuffer _13;

layout(location = 0) flat in uint TEXCOORD;
layout(location = 0) out vec2 SV_Target;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    uint _37 = ByteAddressMask(TEXCOORD * 2u, 4u);
    uint _132;
    uvec4 _133;
    _132 = sparseTexelFetchARB(_8, int(_37), _133);
    SparseTexel _41 = SparseTexel(_132, _133);
    _48 _49 = _48(_41._m1.x, texelFetch(_8, int(_37 + 1u)).x, _50, _51, _41._m0);
    uint _63 = ByteAddressMask(TEXCOORD * 2u, 4u);
    uint _134;
    uvec4 _135;
    _134 = sparseImageLoadARB(_12, int(_63), _135);
    SparseTexel _64 = SparseTexel(_134, _135);
    _48 _70 = _48(_64._m1.x, imageLoad(_12, int(_63 + 1u)).x, _71, _72, _64._m0);
    uint _80 = TEXCOORD * 2u;
    uint _136;
    uvec4 _137;
    _136 = sparseTexelFetchARB(_9, int(_80), _137);
    SparseTexel _81 = SparseTexel(_136, _137);
    _87 _88 = _87(uintBitsToFloat(_81._m1.x), uintBitsToFloat(texelFetch(_9, int(_80 + 1u)).x), _91, _92, _81._m0);
    uint _98 = TEXCOORD * 2u;
    uint _138;
    uvec4 _139;
    _138 = sparseImageLoadARB(_13, int(_98), _139);
    SparseTexel _99 = SparseTexel(_138, _139);
    _87 _105 = _87(uintBitsToFloat(_99._m1.x), uintBitsToFloat(imageLoad(_13, int(_98 + 1u)).x), _108, _109, _99._m0);
    float _114 = float(sparseTexelsResidentARB(int(_105._m4)));
    float _116 = float(sparseTexelsResidentARB(int(_88._m4))) + (float(sparseTexelsResidentARB(int(_70._m4))) + float(sparseTexelsResidentARB(int(_49._m4))));
    SV_Target.x = ((((_116 + uintBitsToFloat(_49._m0)) + uintBitsToFloat(_70._m0)) + _88._m0) + _105._m0) + _114;
    SV_Target.y = ((((_116 + uintBitsToFloat(_49._m1)) + uintBitsToFloat(_70._m1)) + _88._m1) + _105._m1) + _114;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 132
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpCapability SampledBuffer
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %9 %12 %13 %15 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %15 "TEXCOORD"
OpName %19 "SV_Target"
OpName %32 "ByteAddressMask"
OpName %30 "index"
OpName %31 "stride"
OpName %40 "SparseTexel"
OpName %48 ""
OpName %87 ""
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
%29 = OpTypeFunction %5 %5 %5
%35 = OpConstant %5 4294967295
%38 = OpConstant %5 4
%39 = OpTypeVector %5 4
%40 = OpTypeStruct %5 %39
%46 = OpConstant %5 1
%48 = OpTypeStruct %5 %5 %5 %5 %5
%55 = OpTypeBool
%60 = OpConstant %16 1
%61 = OpConstant %16 0
%87 = OpTypeStruct %16 %16 %16 %16 %5
%127 = OpTypePointer Output %16
%129 = OpConstant %5 0
%3 = OpFunction %1 None %2
%4 = OpLabel
%50 = OpUndef %5
%51 = OpUndef %5
%71 = OpUndef %5
%72 = OpUndef %5
%91 = OpUndef %16
%92 = OpUndef %16
%108 = OpUndef %16
%109 = OpUndef %16
OpBranch %131
%131 = OpLabel
%20 = OpLoad %10 %13
%21 = OpLoad %10 %12
%22 = OpLoad %6 %9
%23 = OpLoad %6 %8
%24 = OpLoad %5 %15
%25 = OpShiftLeftLogical %5 %24 %26
%27 = OpIMul %5 %24 %28
%37 = OpFunctionCall %5 %32 %27 %38
%41 = OpImageSparseFetch %40 %23 %37
%42 = OpCompositeExtract %5 %41 0
%43 = OpCompositeExtract %5 %41 1 0
%45 = OpIAdd %5 %37 %46
%44 = OpImageFetch %39 %23 %45
%47 = OpCompositeExtract %5 %44 0
%49 = OpCompositeConstruct %48 %43 %47 %50 %51 %42
%52 = OpCompositeExtract %5 %49 0
%53 = OpCompositeExtract %5 %49 1
%54 = OpCompositeExtract %5 %49 4
%56 = OpImageSparseTexelsResident %55 %54
%57 = OpBitcast %16 %52
%58 = OpBitcast %16 %53
%59 = OpSelect %16 %56 %60 %61
%62 = OpIMul %5 %24 %28
%63 = OpFunctionCall %5 %32 %62 %38
%64 = OpImageSparseRead %40 %21 %63
%65 = OpCompositeExtract %5 %64 0
%66 = OpCompositeExtract %5 %64 1 0
%68 = OpIAdd %5 %63 %46
%67 = OpImageRead %39 %21 %68
%69 = OpCompositeExtract %5 %67 0
%70 = OpCompositeConstruct %48 %66 %69 %71 %72 %65
%73 = OpCompositeExtract %5 %70 0
%74 = OpCompositeExtract %5 %70 1
%75 = OpCompositeExtract %5 %70 4
%76 = OpImageSparseTexelsResident %55 %75
%77 = OpBitcast %16 %73
%78 = OpBitcast %16 %74
%79 = OpSelect %16 %76 %60 %61
%80 = OpIMul %5 %24 %28
%81 = OpImageSparseFetch %40 %22 %80
%82 = OpCompositeExtract %5 %81 0
%83 = OpCompositeExtract %5 %81 1 0
%85 = OpIAdd %5 %80 %46
%84 = OpImageFetch %39 %22 %85
%86 = OpCompositeExtract %5 %84 0
%89 = OpBitcast %16 %83
%90 = OpBitcast %16 %86
%88 = OpCompositeConstruct %87 %89 %90 %91 %92 %82
%93 = OpCompositeExtract %16 %88 0
%94 = OpCompositeExtract %16 %88 1
%95 = OpCompositeExtract %5 %88 4
%96 = OpImageSparseTexelsResident %55 %95
%97 = OpSelect %16 %96 %60 %61
%98 = OpIMul %5 %24 %28
%99 = OpImageSparseRead %40 %20 %98
%100 = OpCompositeExtract %5 %99 0
%101 = OpCompositeExtract %5 %99 1 0
%103 = OpIAdd %5 %98 %46
%102 = OpImageRead %39 %20 %103
%104 = OpCompositeExtract %5 %102 0
%106 = OpBitcast %16 %101
%107 = OpBitcast %16 %104
%105 = OpCompositeConstruct %87 %106 %107 %108 %109 %100
%110 = OpCompositeExtract %16 %105 0
%111 = OpCompositeExtract %16 %105 1
%112 = OpCompositeExtract %5 %105 4
%113 = OpImageSparseTexelsResident %55 %112
%114 = OpSelect %16 %113 %60 %61
%115 = OpFAdd %16 %79 %59
%116 = OpFAdd %16 %97 %115
%117 = OpFAdd %16 %116 %57
%118 = OpFAdd %16 %117 %77
%119 = OpFAdd %16 %118 %93
%120 = OpFAdd %16 %119 %110
%121 = OpFAdd %16 %120 %114
%122 = OpFAdd %16 %116 %58
%123 = OpFAdd %16 %122 %78
%124 = OpFAdd %16 %123 %94
%125 = OpFAdd %16 %124 %111
%126 = OpFAdd %16 %125 %114
%128 = OpAccessChain %127 %19 %129
OpStore %128 %121
%130 = OpAccessChain %127 %19 %46
OpStore %130 %126
OpReturn
OpFunctionEnd
%32 = OpFunction %5 None %29
%30 = OpFunctionParameter %5
%31 = OpFunctionParameter %5
%33 = OpLabel
%34 = OpUDiv %5 %35 %31
%36 = OpBitwiseAnd %5 %30 %34
OpReturnValue %36
OpFunctionEnd
#endif
