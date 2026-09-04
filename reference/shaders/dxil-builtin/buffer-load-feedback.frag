#version 460
#extension GL_ARB_sparse_texture2 : require
#extension GL_EXT_samplerless_texture_functions : require

struct SparseTexel
{
    uint _m0;
    uvec4 _m1;
};

struct _49
{
    uint _m0;
    uint _m1;
    uint _m2;
    uint _m3;
    uint _m4;
};

struct _88
{
    float _m0;
    float _m1;
    float _m2;
    float _m3;
    uint _m4;
};

uint _51;
uint _52;
uint _72;
uint _73;
float _92;
float _93;
float _109;
float _110;

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
    uint _38 = ByteAddressMask(TEXCOORD * 2u, 4u);
    uint _134;
    uvec4 _135;
    _134 = sparseTexelFetchARB(_8, int(_38), _135);
    SparseTexel _42 = SparseTexel(_134, _135);
    _49 _50 = _49(_42._m1.x, texelFetch(_8, int(_38 + 1u)).x, _51, _52, _42._m0);
    uint _64 = ByteAddressMask(TEXCOORD * 2u, 4u);
    uint _136;
    uvec4 _137;
    _136 = sparseImageLoadARB(_12, int(_64), _137);
    SparseTexel _65 = SparseTexel(_136, _137);
    _49 _71 = _49(_65._m1.x, imageLoad(_12, int(_64 + 1u)).x, _72, _73, _65._m0);
    uint _81 = TEXCOORD * 2u;
    uint _138;
    uvec4 _139;
    _138 = sparseTexelFetchARB(_9, int(_81), _139);
    SparseTexel _82 = SparseTexel(_138, _139);
    _88 _89 = _88(uintBitsToFloat(_82._m1.x), uintBitsToFloat(texelFetch(_9, int(_81 + 1u)).x), _92, _93, _82._m0);
    uint _99 = TEXCOORD * 2u;
    uint _140;
    uvec4 _141;
    _140 = sparseImageLoadARB(_13, int(_99), _141);
    SparseTexel _100 = SparseTexel(_140, _141);
    _88 _106 = _88(uintBitsToFloat(_100._m1.x), uintBitsToFloat(imageLoad(_13, int(_99 + 1u)).x), _109, _110, _100._m0);
    float _115 = float(sparseTexelsResidentARB(int(_106._m4)));
    float _117 = float(sparseTexelsResidentARB(int(_89._m4))) + (float(sparseTexelsResidentARB(int(_71._m4))) + float(sparseTexelsResidentARB(int(_50._m4))));
    SV_Target.x = ((((_117 + uintBitsToFloat(_50._m0)) + uintBitsToFloat(_71._m0)) + _89._m0) + _106._m0) + _115;
    SV_Target.y = ((((_117 + uintBitsToFloat(_50._m1)) + uintBitsToFloat(_71._m1)) + _89._m1) + _106._m1) + _115;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 134
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
OpName %32 "ByteAddressMask"
OpName %30 "index"
OpName %31 "stride"
OpName %41 "SparseTexel"
OpName %49 ""
OpName %88 ""
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
%39 = OpConstant %5 4
%40 = OpTypeVector %5 4
%41 = OpTypeStruct %5 %40
%47 = OpConstant %5 1
%49 = OpTypeStruct %5 %5 %5 %5 %5
%56 = OpTypeBool
%61 = OpConstant %16 1
%62 = OpConstant %16 0
%88 = OpTypeStruct %16 %16 %16 %16 %5
%128 = OpTypePointer Output %16
%130 = OpConstant %5 0
%3 = OpFunction %1 None %2
%4 = OpLabel
%51 = OpUndef %5
%52 = OpUndef %5
%72 = OpUndef %5
%73 = OpUndef %5
%92 = OpUndef %16
%93 = OpUndef %16
%109 = OpUndef %16
%110 = OpUndef %16
OpBranch %132
%132 = OpLabel
%20 = OpLoad %10 %13
%21 = OpLoad %10 %12
%22 = OpLoad %6 %9
%23 = OpLoad %6 %8
%24 = OpLoad %5 %15
%25 = OpShiftLeftLogical %5 %24 %26
%27 = OpIMul %5 %24 %28
%38 = OpFunctionCall %5 %32 %27 %39
%42 = OpImageSparseFetch %41 %23 %38
%43 = OpCompositeExtract %5 %42 0
%44 = OpCompositeExtract %5 %42 1 0
%46 = OpIAdd %5 %38 %47
%45 = OpImageFetch %40 %23 %46
%48 = OpCompositeExtract %5 %45 0
%50 = OpCompositeConstruct %49 %44 %48 %51 %52 %43
%53 = OpCompositeExtract %5 %50 0
%54 = OpCompositeExtract %5 %50 1
%55 = OpCompositeExtract %5 %50 4
%57 = OpImageSparseTexelsResident %56 %55
%58 = OpBitcast %16 %53
%59 = OpBitcast %16 %54
%60 = OpSelect %16 %57 %61 %62
%63 = OpIMul %5 %24 %28
%64 = OpFunctionCall %5 %32 %63 %39
%65 = OpImageSparseRead %41 %21 %64
%66 = OpCompositeExtract %5 %65 0
%67 = OpCompositeExtract %5 %65 1 0
%69 = OpIAdd %5 %64 %47
%68 = OpImageRead %40 %21 %69
%70 = OpCompositeExtract %5 %68 0
%71 = OpCompositeConstruct %49 %67 %70 %72 %73 %66
%74 = OpCompositeExtract %5 %71 0
%75 = OpCompositeExtract %5 %71 1
%76 = OpCompositeExtract %5 %71 4
%77 = OpImageSparseTexelsResident %56 %76
%78 = OpBitcast %16 %74
%79 = OpBitcast %16 %75
%80 = OpSelect %16 %77 %61 %62
%81 = OpIMul %5 %24 %28
%82 = OpImageSparseFetch %41 %22 %81
%83 = OpCompositeExtract %5 %82 0
%84 = OpCompositeExtract %5 %82 1 0
%86 = OpIAdd %5 %81 %47
%85 = OpImageFetch %40 %22 %86
%87 = OpCompositeExtract %5 %85 0
%90 = OpBitcast %16 %84
%91 = OpBitcast %16 %87
%89 = OpCompositeConstruct %88 %90 %91 %92 %93 %83
%94 = OpCompositeExtract %16 %89 0
%95 = OpCompositeExtract %16 %89 1
%96 = OpCompositeExtract %5 %89 4
%97 = OpImageSparseTexelsResident %56 %96
%98 = OpSelect %16 %97 %61 %62
%99 = OpIMul %5 %24 %28
%100 = OpImageSparseRead %41 %20 %99
%101 = OpCompositeExtract %5 %100 0
%102 = OpCompositeExtract %5 %100 1 0
%104 = OpIAdd %5 %99 %47
%103 = OpImageRead %40 %20 %104
%105 = OpCompositeExtract %5 %103 0
%107 = OpBitcast %16 %102
%108 = OpBitcast %16 %105
%106 = OpCompositeConstruct %88 %107 %108 %109 %110 %101
%111 = OpCompositeExtract %16 %106 0
%112 = OpCompositeExtract %16 %106 1
%113 = OpCompositeExtract %5 %106 4
%114 = OpImageSparseTexelsResident %56 %113
%115 = OpSelect %16 %114 %61 %62
%116 = OpFAdd %16 %80 %60
%117 = OpFAdd %16 %98 %116
%118 = OpFAdd %16 %117 %58
%119 = OpFAdd %16 %118 %78
%120 = OpFAdd %16 %119 %94
%121 = OpFAdd %16 %120 %111
%122 = OpFAdd %16 %121 %115
%123 = OpFAdd %16 %117 %59
%124 = OpFAdd %16 %123 %79
%125 = OpFAdd %16 %124 %95
%126 = OpFAdd %16 %125 %112
%127 = OpFAdd %16 %126 %115
%129 = OpAccessChain %128 %19 %130
OpStore %129 %122
%131 = OpAccessChain %128 %19 %47
OpStore %131 %127
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
