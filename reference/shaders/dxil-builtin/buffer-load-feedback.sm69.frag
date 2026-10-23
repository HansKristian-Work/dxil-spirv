#version 460
#extension GL_ARB_sparse_texture2 : require
#extension GL_EXT_samplerless_texture_functions : require

struct SparseTexel
{
    uint _m0;
    uvec4 _m1;
};

struct _46
{
    uvec2 _m0;
    uint _m1;
};

struct _89
{
    vec2 _m0;
    uint _m1;
};

vec2 _58;

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
    uint _34 = ByteAddressMask(TEXCOORD * 2u, 4u);
    uint _129;
    uvec4 _130;
    _129 = sparseTexelFetchARB(_8, int(_34), _130);
    SparseTexel _38 = SparseTexel(_129, _130);
    _46 _47 = _46(uvec2(_38._m1.x, texelFetch(_8, int(_34 + 1u)).x), _38._m0);
    vec2 _57;
    _57.x = float(sparseTexelsResidentARB(int(_47._m1)));
    uint _63 = ByteAddressMask(TEXCOORD * 2u, 4u);
    uint _131;
    uvec4 _132;
    _131 = sparseImageLoadARB(_12, int(_63), _132);
    SparseTexel _64 = SparseTexel(_131, _132);
    _46 _70 = _46(uvec2(_64._m1.x, imageLoad(_12, int(_63 + 1u)).x), _64._m0);
    vec2 _78;
    _78.x = float(sparseTexelsResidentARB(int(_70._m1)));
    uint _82 = TEXCOORD * 2u;
    uint _133;
    uvec4 _134;
    _133 = sparseTexelFetchARB(_9, int(_82), _134);
    SparseTexel _83 = SparseTexel(_133, _134);
    _89 _90 = _89(vec2(uintBitsToFloat(_83._m1.x), uintBitsToFloat(texelFetch(_9, int(_82 + 1u)).x)), _83._m0);
    vec2 _99;
    _99.x = float(sparseTexelsResidentARB(int(_90._m1)));
    uint _103 = TEXCOORD * 2u;
    uint _135;
    uvec4 _136;
    _135 = sparseImageLoadARB(_13, int(_103), _136);
    SparseTexel _104 = SparseTexel(_135, _136);
    _89 _110 = _89(vec2(uintBitsToFloat(_104._m1.x), uintBitsToFloat(imageLoad(_13, int(_103 + 1u)).x)), _104._m0);
    vec2 _119;
    _119.x = float(sparseTexelsResidentARB(int(_110._m1)));
    vec2 _121 = ((((((_57.xx + uintBitsToFloat(_47._m0)) + uintBitsToFloat(_70._m0)) + _78.xx) + _90._m0) + _99.xx) + _110._m0) + _119.xx;
    SV_Target.x = _121.x;
    SV_Target.y = _121.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 129
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %9 %12 %13 %15 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %15 "TEXCOORD"
OpName %19 "SV_Target"
OpName %29 "ByteAddressMask"
OpName %27 "index"
OpName %28 "stride"
OpName %37 "SparseTexel"
OpName %46 ""
OpName %89 ""
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
%22 = OpConstant %5 3
%25 = OpConstant %5 2
%26 = OpTypeFunction %5 %5 %5
%32 = OpConstant %5 4294967295
%35 = OpConstant %5 4
%36 = OpTypeVector %5 4
%37 = OpTypeStruct %5 %36
%43 = OpConstant %5 1
%45 = OpTypeVector %5 2
%46 = OpTypeStruct %45 %5
%51 = OpTypeBool
%55 = OpConstant %16 1
%56 = OpConstant %16 0
%89 = OpTypeStruct %17 %5
%123 = OpTypePointer Output %16
%125 = OpConstant %5 0
%3 = OpFunction %1 None %2
%4 = OpLabel
%58 = OpUndef %17
OpBranch %128
%128 = OpLabel
%20 = OpLoad %5 %15
%21 = OpShiftLeftLogical %5 %20 %22
%23 = OpLoad %6 %8
%24 = OpIMul %5 %20 %25
%34 = OpFunctionCall %5 %29 %24 %35
%38 = OpImageSparseFetch %37 %23 %34
%39 = OpCompositeExtract %5 %38 0
%40 = OpCompositeExtract %5 %38 1 0
%42 = OpIAdd %5 %34 %43
%41 = OpImageFetch %36 %23 %42
%44 = OpCompositeExtract %5 %41 0
%48 = OpCompositeConstruct %45 %40 %44
%47 = OpCompositeConstruct %46 %48 %39
%49 = OpCompositeExtract %45 %47 0
%50 = OpCompositeExtract %5 %47 1
%52 = OpImageSparseTexelsResident %51 %50
%53 = OpBitcast %17 %49
%54 = OpSelect %16 %52 %55 %56
%57 = OpCompositeInsert %17 %54 %58 0
%59 = OpVectorShuffle %17 %57 %58 0 0
%60 = OpFAdd %17 %59 %53
%61 = OpLoad %10 %12
%62 = OpIMul %5 %20 %25
%63 = OpFunctionCall %5 %29 %62 %35
%64 = OpImageSparseRead %37 %61 %63 NonPrivateTexel
%65 = OpCompositeExtract %5 %64 0
%66 = OpCompositeExtract %5 %64 1 0
%68 = OpIAdd %5 %63 %43
%67 = OpImageRead %36 %61 %68 NonPrivateTexel
%69 = OpCompositeExtract %5 %67 0
%71 = OpCompositeConstruct %45 %66 %69
%70 = OpCompositeConstruct %46 %71 %65
%72 = OpCompositeExtract %45 %70 0
%73 = OpCompositeExtract %5 %70 1
%74 = OpImageSparseTexelsResident %51 %73
%75 = OpBitcast %17 %72
%76 = OpFAdd %17 %60 %75
%77 = OpSelect %16 %74 %55 %56
%78 = OpCompositeInsert %17 %77 %58 0
%79 = OpVectorShuffle %17 %78 %58 0 0
%80 = OpFAdd %17 %76 %79
%81 = OpLoad %6 %9
%82 = OpIMul %5 %20 %25
%83 = OpImageSparseFetch %37 %81 %82
%84 = OpCompositeExtract %5 %83 0
%85 = OpCompositeExtract %5 %83 1 0
%87 = OpIAdd %5 %82 %43
%86 = OpImageFetch %36 %81 %87
%88 = OpCompositeExtract %5 %86 0
%91 = OpBitcast %16 %85
%92 = OpBitcast %16 %88
%93 = OpCompositeConstruct %17 %91 %92
%90 = OpCompositeConstruct %89 %93 %84
%94 = OpCompositeExtract %17 %90 0
%95 = OpCompositeExtract %5 %90 1
%96 = OpImageSparseTexelsResident %51 %95
%97 = OpFAdd %17 %80 %94
%98 = OpSelect %16 %96 %55 %56
%99 = OpCompositeInsert %17 %98 %58 0
%100 = OpVectorShuffle %17 %99 %58 0 0
%101 = OpFAdd %17 %97 %100
%102 = OpLoad %10 %13
%103 = OpIMul %5 %20 %25
%104 = OpImageSparseRead %37 %102 %103 NonPrivateTexel
%105 = OpCompositeExtract %5 %104 0
%106 = OpCompositeExtract %5 %104 1 0
%108 = OpIAdd %5 %103 %43
%107 = OpImageRead %36 %102 %108 NonPrivateTexel
%109 = OpCompositeExtract %5 %107 0
%111 = OpBitcast %16 %106
%112 = OpBitcast %16 %109
%113 = OpCompositeConstruct %17 %111 %112
%110 = OpCompositeConstruct %89 %113 %105
%114 = OpCompositeExtract %17 %110 0
%115 = OpCompositeExtract %5 %110 1
%116 = OpImageSparseTexelsResident %51 %115
%117 = OpFAdd %17 %101 %114
%118 = OpSelect %16 %116 %55 %56
%119 = OpCompositeInsert %17 %118 %58 0
%120 = OpVectorShuffle %17 %119 %58 0 0
%121 = OpFAdd %17 %117 %120
%122 = OpCompositeExtract %16 %121 0
%124 = OpAccessChain %123 %19 %125
OpStore %124 %122
%126 = OpCompositeExtract %16 %121 1
%127 = OpAccessChain %123 %19 %43
OpStore %127 %126
OpReturn
OpFunctionEnd
%29 = OpFunction %5 None %26
%27 = OpFunctionParameter %5
%28 = OpFunctionParameter %5
%30 = OpLabel
%31 = OpUDiv %5 %32 %28
%33 = OpBitwiseAnd %5 %27 %31
OpReturnValue %33
OpFunctionEnd
#endif
