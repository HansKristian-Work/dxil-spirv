#version 460
#extension GL_ARB_sparse_texture2 : require

struct SparseTexel
{
    uint _m0;
    float _m1;
};

struct _56
{
    float _m0;
    float _m1;
    float _m2;
    float _m3;
    uint _m4;
};

layout(set = 1, binding = 0) uniform texture1D _8;
layout(set = 1, binding = 1) uniform texture1DArray _11;
layout(set = 1, binding = 2) uniform texture2D _14;
layout(set = 1, binding = 3) uniform texture2DArray _17;
layout(set = 0, binding = 0) uniform samplerShadow _20;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 1) in float DREF;
layout(location = 0) out float SV_Target;

void main()
{
    uint _124;
    float _125;
    _124 = sparseTextureGradOffsetARB(sampler1DShadow(_8, _20), vec2(TEXCOORD.x, DREF), TEXCOORD.z, TEXCOORD.w, 1, _125);
    SparseTexel _53 = SparseTexel(_124, _125);
    float _55 = _53._m1;
    _56 _57 = _56(_55, _55, _55, _55, _53._m0);
    uint _126;
    float _127;
    _126 = sparseTextureGradOffsetARB(sampler1DArrayShadow(_11, _20), vec3(vec2(TEXCOORD.x, TEXCOORD.y), DREF), TEXCOORD.z, TEXCOORD.w, 2, _127);
    SparseTexel _70 = SparseTexel(_126, _127);
    float _74 = _70._m1;
    _56 _75 = _56(_74, _74, _74, _74, _70._m0);
    uint _128;
    float _129;
    _128 = sparseTextureGradOffsetARB(sampler2DShadow(_14, _20), vec3(vec2(TEXCOORD.x, TEXCOORD.y), DREF), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(-3, -4), _129);
    SparseTexel _87 = SparseTexel(_128, _129);
    float _94 = _87._m1;
    _56 _95 = _56(_94, _94, _94, _94, _87._m0);
    uint _130;
    float _131;
    _130 = sparseTextureGradOffsetARB(sampler2DArrayShadow(_17, _20), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), DREF), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(4, -5), _131);
    SparseTexel _107 = SparseTexel(_130, _131);
    float _114 = _107._m1;
    _56 _115 = _56(_114, _114, _114, _114, _107._m0);
    SV_Target = ((((((float(sparseTexelsResidentARB(int(_57._m4))) + _57._m0) + _75._m0) + float(sparseTexelsResidentARB(int(_75._m4)))) + _95._m0) + float(sparseTexelsResidentARB(int(_95._m4)))) + _115._m0) + float(sparseTexelsResidentARB(int(_115._m4)));
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
OpCapability Sampled1D
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %23 %25 %27
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %23 "TEXCOORD"
OpName %25 "DREF"
OpName %27 "SV_Target"
OpName %52 "SparseTexel"
OpName %56 ""
OpDecorate %8 DescriptorSet 1
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 1
OpDecorate %11 Binding 1
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 2
OpDecorate %17 DescriptorSet 1
OpDecorate %17 Binding 3
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 0
OpDecorate %23 Location 0
OpDecorate %25 Location 1
OpDecorate %27 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 1D 0 1 0 1 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeImage %5 2D 0 0 0 1 Unknown
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeImage %5 2D 0 1 0 1 Unknown
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeSampler
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeVector %5 4
%22 = OpTypePointer Input %21
%23 = OpVariable %22 Input
%24 = OpTypePointer Input %5
%25 = OpVariable %24 Input
%26 = OpTypePointer Output %5
%27 = OpVariable %26 Output
%35 = OpTypeInt 32 0
%36 = OpConstant %35 0
%39 = OpConstant %35 1
%42 = OpConstant %35 2
%45 = OpConstant %35 3
%47 = OpTypeImage %5 1D 1 0 0 1 Unknown
%48 = OpTypeSampledImage %47
%50 = OpTypeInt 32 1
%51 = OpConstant %50 1
%52 = OpTypeStruct %35 %5
%56 = OpTypeStruct %5 %5 %5 %5 %35
%60 = OpTypeBool
%63 = OpConstant %5 1
%64 = OpConstant %5 0
%66 = OpTypeImage %5 1D 1 1 0 1 Unknown
%67 = OpTypeSampledImage %66
%69 = OpConstant %50 2
%71 = OpTypeVector %5 2
%82 = OpTypeImage %5 2D 1 0 0 1 Unknown
%83 = OpTypeSampledImage %82
%85 = OpConstant %50 -3
%86 = OpConstant %50 -4
%91 = OpTypeVector %50 2
%92 = OpConstantComposite %91 %85 %86
%102 = OpTypeImage %5 2D 1 1 0 1 Unknown
%103 = OpTypeSampledImage %102
%105 = OpConstant %50 4
%106 = OpConstant %50 -5
%108 = OpTypeVector %5 3
%112 = OpConstantComposite %91 %105 %106
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %122
%122 = OpLabel
%28 = OpLoad %15 %17
%29 = OpLoad %12 %14
%30 = OpLoad %9 %11
%31 = OpLoad %6 %8
%32 = OpLoad %18 %20
%33 = OpLoad %5 %25
%34 = OpAccessChain %24 %23 %36
%37 = OpLoad %5 %34
%38 = OpAccessChain %24 %23 %39
%40 = OpLoad %5 %38
%41 = OpAccessChain %24 %23 %42
%43 = OpLoad %5 %41
%44 = OpAccessChain %24 %23 %45
%46 = OpLoad %5 %44
%49 = OpSampledImage %48 %31 %32
%53 = OpImageSparseSampleDrefExplicitLod %52 %49 %37 %33 Grad|ConstOffset %43 %46 %51
%54 = OpCompositeExtract %35 %53 0
%55 = OpCompositeExtract %5 %53 1
%57 = OpCompositeConstruct %56 %55 %55 %55 %55 %54
%58 = OpCompositeExtract %5 %57 0
%59 = OpCompositeExtract %35 %57 4
%61 = OpImageSparseTexelsResident %60 %59
%62 = OpSelect %5 %61 %63 %64
%65 = OpFAdd %5 %62 %58
%68 = OpSampledImage %67 %30 %32
%72 = OpCompositeConstruct %71 %37 %40
%70 = OpImageSparseSampleDrefExplicitLod %52 %68 %72 %33 Grad|ConstOffset %43 %46 %69
%73 = OpCompositeExtract %35 %70 0
%74 = OpCompositeExtract %5 %70 1
%75 = OpCompositeConstruct %56 %74 %74 %74 %74 %73
%76 = OpCompositeExtract %5 %75 0
%77 = OpCompositeExtract %35 %75 4
%78 = OpImageSparseTexelsResident %60 %77
%79 = OpFAdd %5 %65 %76
%80 = OpSelect %5 %78 %63 %64
%81 = OpFAdd %5 %79 %80
%84 = OpSampledImage %83 %29 %32
%88 = OpCompositeConstruct %71 %37 %40
%89 = OpCompositeConstruct %71 %43 %43
%90 = OpCompositeConstruct %71 %46 %46
%87 = OpImageSparseSampleDrefExplicitLod %52 %84 %88 %33 Grad|ConstOffset %89 %90 %92
%93 = OpCompositeExtract %35 %87 0
%94 = OpCompositeExtract %5 %87 1
%95 = OpCompositeConstruct %56 %94 %94 %94 %94 %93
%96 = OpCompositeExtract %5 %95 0
%97 = OpCompositeExtract %35 %95 4
%98 = OpImageSparseTexelsResident %60 %97
%99 = OpFAdd %5 %81 %96
%100 = OpSelect %5 %98 %63 %64
%101 = OpFAdd %5 %99 %100
%104 = OpSampledImage %103 %28 %32
%109 = OpCompositeConstruct %108 %37 %40 %43
%110 = OpCompositeConstruct %71 %43 %43
%111 = OpCompositeConstruct %71 %46 %46
%107 = OpImageSparseSampleDrefExplicitLod %52 %104 %109 %33 Grad|ConstOffset %110 %111 %112
%113 = OpCompositeExtract %35 %107 0
%114 = OpCompositeExtract %5 %107 1
%115 = OpCompositeConstruct %56 %114 %114 %114 %114 %113
%116 = OpCompositeExtract %5 %115 0
%117 = OpCompositeExtract %35 %115 4
%118 = OpImageSparseTexelsResident %60 %117
%119 = OpFAdd %5 %101 %116
%120 = OpSelect %5 %118 %63 %64
%121 = OpFAdd %5 %119 %120
OpStore %27 %121
OpReturn
OpFunctionEnd
#endif
