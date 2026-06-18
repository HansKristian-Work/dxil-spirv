#version 460
#extension GL_ARB_sparse_texture2 : require

struct SparseTexel
{
    uint _m0;
    uvec4 _m1;
};

struct _47
{
    uvec2 _m0;
    uint _m1;
};

struct _90
{
    vec2 _m0;
    uint _m1;
};

vec2 _59;

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
    uint _35 = ByteAddressMask(TEXCOORD * 2u, 4u);
    uint _131;
    uvec4 _132;
    _131 = sparseTexelFetchARB(_8, int(_35), _132);
    SparseTexel _39 = SparseTexel(_131, _132);
    _47 _48 = _47(uvec2(_39._m1.x, texelFetch(_8, int(_35 + 1u)).x), _39._m0);
    vec2 _58;
    _58.x = float(sparseTexelsResidentARB(int(_48._m1)));
    uint _64 = ByteAddressMask(TEXCOORD * 2u, 4u);
    uint _133;
    uvec4 _134;
    _133 = sparseImageLoadARB(_12, int(_64), _134);
    SparseTexel _65 = SparseTexel(_133, _134);
    _47 _71 = _47(uvec2(_65._m1.x, imageLoad(_12, int(_64 + 1u)).x), _65._m0);
    vec2 _79;
    _79.x = float(sparseTexelsResidentARB(int(_71._m1)));
    uint _83 = TEXCOORD * 2u;
    uint _135;
    uvec4 _136;
    _135 = sparseTexelFetchARB(_9, int(_83), _136);
    SparseTexel _84 = SparseTexel(_135, _136);
    _90 _91 = _90(vec2(uintBitsToFloat(_84._m1.x), uintBitsToFloat(texelFetch(_9, int(_83 + 1u)).x)), _84._m0);
    vec2 _100;
    _100.x = float(sparseTexelsResidentARB(int(_91._m1)));
    uint _104 = TEXCOORD * 2u;
    uint _137;
    uvec4 _138;
    _137 = sparseImageLoadARB(_13, int(_104), _138);
    SparseTexel _105 = SparseTexel(_137, _138);
    _90 _111 = _90(vec2(uintBitsToFloat(_105._m1.x), uintBitsToFloat(imageLoad(_13, int(_104 + 1u)).x)), _105._m0);
    vec2 _120;
    _120.x = float(sparseTexelsResidentARB(int(_111._m1)));
    vec2 _122 = ((((((_58.xx + uintBitsToFloat(_48._m0)) + uintBitsToFloat(_71._m0)) + _79.xx) + _91._m0) + _100.xx) + _111._m0) + _120.xx;
    SV_Target.x = _122.x;
    SV_Target.y = _122.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 131
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
OpName %29 "ByteAddressMask"
OpName %27 "index"
OpName %28 "stride"
OpName %38 "SparseTexel"
OpName %47 ""
OpName %90 ""
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
%36 = OpConstant %5 4
%37 = OpTypeVector %5 4
%38 = OpTypeStruct %5 %37
%44 = OpConstant %5 1
%46 = OpTypeVector %5 2
%47 = OpTypeStruct %46 %5
%52 = OpTypeBool
%56 = OpConstant %16 1
%57 = OpConstant %16 0
%90 = OpTypeStruct %17 %5
%124 = OpTypePointer Output %16
%126 = OpConstant %5 0
%3 = OpFunction %1 None %2
%4 = OpLabel
%59 = OpUndef %17
OpBranch %129
%129 = OpLabel
%20 = OpLoad %5 %15
%21 = OpShiftLeftLogical %5 %20 %22
%23 = OpLoad %6 %8
%24 = OpIMul %5 %20 %25
%35 = OpFunctionCall %5 %29 %24 %36
%39 = OpImageSparseFetch %38 %23 %35
%40 = OpCompositeExtract %5 %39 0
%41 = OpCompositeExtract %5 %39 1 0
%43 = OpIAdd %5 %35 %44
%42 = OpImageFetch %37 %23 %43
%45 = OpCompositeExtract %5 %42 0
%49 = OpCompositeConstruct %46 %41 %45
%48 = OpCompositeConstruct %47 %49 %40
%50 = OpCompositeExtract %46 %48 0
%51 = OpCompositeExtract %5 %48 1
%53 = OpImageSparseTexelsResident %52 %51
%54 = OpBitcast %17 %50
%55 = OpSelect %16 %53 %56 %57
%58 = OpCompositeInsert %17 %55 %59 0
%60 = OpVectorShuffle %17 %58 %59 0 0
%61 = OpFAdd %17 %60 %54
%62 = OpLoad %10 %12
%63 = OpIMul %5 %20 %25
%64 = OpFunctionCall %5 %29 %63 %36
%65 = OpImageSparseRead %38 %62 %64
%66 = OpCompositeExtract %5 %65 0
%67 = OpCompositeExtract %5 %65 1 0
%69 = OpIAdd %5 %64 %44
%68 = OpImageRead %37 %62 %69
%70 = OpCompositeExtract %5 %68 0
%72 = OpCompositeConstruct %46 %67 %70
%71 = OpCompositeConstruct %47 %72 %66
%73 = OpCompositeExtract %46 %71 0
%74 = OpCompositeExtract %5 %71 1
%75 = OpImageSparseTexelsResident %52 %74
%76 = OpBitcast %17 %73
%77 = OpFAdd %17 %61 %76
%78 = OpSelect %16 %75 %56 %57
%79 = OpCompositeInsert %17 %78 %59 0
%80 = OpVectorShuffle %17 %79 %59 0 0
%81 = OpFAdd %17 %77 %80
%82 = OpLoad %6 %9
%83 = OpIMul %5 %20 %25
%84 = OpImageSparseFetch %38 %82 %83
%85 = OpCompositeExtract %5 %84 0
%86 = OpCompositeExtract %5 %84 1 0
%88 = OpIAdd %5 %83 %44
%87 = OpImageFetch %37 %82 %88
%89 = OpCompositeExtract %5 %87 0
%92 = OpBitcast %16 %86
%93 = OpBitcast %16 %89
%94 = OpCompositeConstruct %17 %92 %93
%91 = OpCompositeConstruct %90 %94 %85
%95 = OpCompositeExtract %17 %91 0
%96 = OpCompositeExtract %5 %91 1
%97 = OpImageSparseTexelsResident %52 %96
%98 = OpFAdd %17 %81 %95
%99 = OpSelect %16 %97 %56 %57
%100 = OpCompositeInsert %17 %99 %59 0
%101 = OpVectorShuffle %17 %100 %59 0 0
%102 = OpFAdd %17 %98 %101
%103 = OpLoad %10 %13
%104 = OpIMul %5 %20 %25
%105 = OpImageSparseRead %38 %103 %104
%106 = OpCompositeExtract %5 %105 0
%107 = OpCompositeExtract %5 %105 1 0
%109 = OpIAdd %5 %104 %44
%108 = OpImageRead %37 %103 %109
%110 = OpCompositeExtract %5 %108 0
%112 = OpBitcast %16 %107
%113 = OpBitcast %16 %110
%114 = OpCompositeConstruct %17 %112 %113
%111 = OpCompositeConstruct %90 %114 %106
%115 = OpCompositeExtract %17 %111 0
%116 = OpCompositeExtract %5 %111 1
%117 = OpImageSparseTexelsResident %52 %116
%118 = OpFAdd %17 %102 %115
%119 = OpSelect %16 %117 %56 %57
%120 = OpCompositeInsert %17 %119 %59 0
%121 = OpVectorShuffle %17 %120 %59 0 0
%122 = OpFAdd %17 %118 %121
%123 = OpCompositeExtract %16 %122 0
%125 = OpAccessChain %124 %19 %126
OpStore %125 %123
%127 = OpCompositeExtract %16 %122 1
%128 = OpAccessChain %124 %19 %44
OpStore %128 %127
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
