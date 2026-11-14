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

uint _50;

struct _84
{
    float _m0;
    float _m1;
    float _m2;
    float _m3;
    uint _m4;
};

float _88;

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
    uint _126;
    uvec4 _127;
    _126 = sparseTexelFetchARB(_8, int(_37), _127);
    SparseTexel _41 = SparseTexel(_126, _127);
    _48 _49 = _48(_41._m1.x, texelFetch(_8, int(_37 + 1u)).x, _50, _50, _41._m0);
    uint _62 = ByteAddressMask(TEXCOORD * 2u, 4u);
    uint _128;
    uvec4 _129;
    _128 = sparseImageLoadARB(_12, int(_62), _129);
    SparseTexel _63 = SparseTexel(_128, _129);
    _48 _69 = _48(_63._m1.x, imageLoad(_12, int(_62 + 1u)).x, _50, _50, _63._m0);
    uint _77 = TEXCOORD * 2u;
    uint _130;
    uvec4 _131;
    _130 = sparseTexelFetchARB(_9, int(_77), _131);
    SparseTexel _78 = SparseTexel(_130, _131);
    _84 _85 = _84(uintBitsToFloat(_78._m1.x), uintBitsToFloat(texelFetch(_9, int(_77 + 1u)).x), _88, _88, _78._m0);
    uint _94 = TEXCOORD * 2u;
    uint _132;
    uvec4 _133;
    _132 = sparseImageLoadARB(_13, int(_94), _133);
    SparseTexel _95 = SparseTexel(_132, _133);
    _84 _101 = _84(uintBitsToFloat(_95._m1.x), uintBitsToFloat(imageLoad(_13, int(_94 + 1u)).x), _88, _88, _95._m0);
    float _108 = float(sparseTexelsResidentARB(int(_101._m4)));
    float _110 = float(sparseTexelsResidentARB(int(_85._m4))) + (float(sparseTexelsResidentARB(int(_69._m4))) + float(sparseTexelsResidentARB(int(_49._m4))));
    SV_Target.x = ((((_110 + uintBitsToFloat(_49._m0)) + uintBitsToFloat(_69._m0)) + _85._m0) + _101._m0) + _108;
    SV_Target.y = ((((_110 + uintBitsToFloat(_49._m1)) + uintBitsToFloat(_69._m1)) + _85._m1) + _101._m1) + _108;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 126
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
OpName %32 "ByteAddressMask"
OpName %30 "index"
OpName %31 "stride"
OpName %40 "SparseTexel"
OpName %48 ""
OpName %84 ""
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
%50 = OpUndef %5
%54 = OpTypeBool
%59 = OpConstant %16 1
%60 = OpConstant %16 0
%84 = OpTypeStruct %16 %16 %16 %16 %5
%88 = OpUndef %16
%121 = OpTypePointer Output %16
%123 = OpConstant %5 0
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %125
%125 = OpLabel
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
%49 = OpCompositeConstruct %48 %43 %47 %50 %50 %42
%51 = OpCompositeExtract %5 %49 0
%52 = OpCompositeExtract %5 %49 1
%53 = OpCompositeExtract %5 %49 4
%55 = OpImageSparseTexelsResident %54 %53
%56 = OpBitcast %16 %51
%57 = OpBitcast %16 %52
%58 = OpSelect %16 %55 %59 %60
%61 = OpIMul %5 %24 %28
%62 = OpFunctionCall %5 %32 %61 %38
%63 = OpImageSparseRead %40 %21 %62 NonPrivateTexel
%64 = OpCompositeExtract %5 %63 0
%65 = OpCompositeExtract %5 %63 1 0
%67 = OpIAdd %5 %62 %46
%66 = OpImageRead %39 %21 %67 NonPrivateTexel
%68 = OpCompositeExtract %5 %66 0
%69 = OpCompositeConstruct %48 %65 %68 %50 %50 %64
%70 = OpCompositeExtract %5 %69 0
%71 = OpCompositeExtract %5 %69 1
%72 = OpCompositeExtract %5 %69 4
%73 = OpImageSparseTexelsResident %54 %72
%74 = OpBitcast %16 %70
%75 = OpBitcast %16 %71
%76 = OpSelect %16 %73 %59 %60
%77 = OpIMul %5 %24 %28
%78 = OpImageSparseFetch %40 %22 %77
%79 = OpCompositeExtract %5 %78 0
%80 = OpCompositeExtract %5 %78 1 0
%82 = OpIAdd %5 %77 %46
%81 = OpImageFetch %39 %22 %82
%83 = OpCompositeExtract %5 %81 0
%86 = OpBitcast %16 %80
%87 = OpBitcast %16 %83
%85 = OpCompositeConstruct %84 %86 %87 %88 %88 %79
%89 = OpCompositeExtract %16 %85 0
%90 = OpCompositeExtract %16 %85 1
%91 = OpCompositeExtract %5 %85 4
%92 = OpImageSparseTexelsResident %54 %91
%93 = OpSelect %16 %92 %59 %60
%94 = OpIMul %5 %24 %28
%95 = OpImageSparseRead %40 %20 %94 NonPrivateTexel
%96 = OpCompositeExtract %5 %95 0
%97 = OpCompositeExtract %5 %95 1 0
%99 = OpIAdd %5 %94 %46
%98 = OpImageRead %39 %20 %99 NonPrivateTexel
%100 = OpCompositeExtract %5 %98 0
%102 = OpBitcast %16 %97
%103 = OpBitcast %16 %100
%101 = OpCompositeConstruct %84 %102 %103 %88 %88 %96
%104 = OpCompositeExtract %16 %101 0
%105 = OpCompositeExtract %16 %101 1
%106 = OpCompositeExtract %5 %101 4
%107 = OpImageSparseTexelsResident %54 %106
%108 = OpSelect %16 %107 %59 %60
%109 = OpFAdd %16 %76 %58
%110 = OpFAdd %16 %93 %109
%111 = OpFAdd %16 %110 %56
%112 = OpFAdd %16 %111 %74
%113 = OpFAdd %16 %112 %89
%114 = OpFAdd %16 %113 %104
%115 = OpFAdd %16 %114 %108
%116 = OpFAdd %16 %110 %57
%117 = OpFAdd %16 %116 %75
%118 = OpFAdd %16 %117 %90
%119 = OpFAdd %16 %118 %105
%120 = OpFAdd %16 %119 %108
%122 = OpAccessChain %121 %19 %123
OpStore %122 %115
%124 = OpAccessChain %121 %19 %46
OpStore %124 %120
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
