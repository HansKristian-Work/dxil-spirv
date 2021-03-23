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
layout(location = 0) out vec2 SV_Target;

void main()
{
    uint _120;
    float _121;
    _120 = sparseTextureLodOffsetARB(sampler1DShadow(_8, _20), vec2(TEXCOORD.x, TEXCOORD.w), 0.0, 1, _121);
    SparseTexel _53 = SparseTexel(_120, _121);
    float _55 = _53._m1;
    _56 _57 = _56(_55, _55, _55, _55, _53._m0);
    uint _122;
    float _123;
    _122 = sparseTextureLodOffsetARB(sampler1DArrayShadow(_11, _20), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w), 0.0, 2, _123);
    SparseTexel _69 = SparseTexel(_122, _123);
    float _72 = _69._m1;
    _56 _73 = _56(_72, _72, _72, _72, _69._m0);
    uint _124;
    float _125;
    _124 = sparseTextureLodOffsetARB(sampler2DShadow(_14, _20), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w), 0.0, ivec2(-3, -2), _125);
    SparseTexel _85 = SparseTexel(_124, _125);
    float _90 = _85._m1;
    _56 _91 = _56(_90, _90, _90, _90, _85._m0);
    uint _126;
    float _127;
    _126 = sparseTextureGradOffsetARB(sampler2DArrayShadow(_17, _20), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w), vec2(0.0), vec2(0.0), ivec2(4, 5), _127);
    SparseTexel _103 = SparseTexel(_126, _127);
    float _108 = _103._m1;
    _56 _109 = _56(_108, _108, _108, _108, _103._m0);
    float _115 = ((((((float(sparseTexelsResidentARB(int(_57._m4))) + _57._m0) + _73._m0) + float(sparseTexelsResidentARB(int(_73._m4)))) + _91._m0) + float(sparseTexelsResidentARB(int(_91._m4)))) + _109._m0) + float(sparseTexelsResidentARB(int(_109._m4)));
    SV_Target.x = _115;
    SV_Target.y = _115;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 120
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpCapability Sampled1D
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %23 %26
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %23 "TEXCOORD"
OpName %26 "SV_Target"
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
OpDecorate %26 Location 0
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
%24 = OpTypeVector %5 2
%25 = OpTypePointer Output %24
%26 = OpVariable %25 Output
%32 = OpTypePointer Input %5
%34 = OpTypeInt 32 0
%35 = OpConstant %34 0
%38 = OpConstant %34 1
%41 = OpConstant %34 2
%44 = OpConstant %34 3
%46 = OpTypeImage %5 1D 1 0 0 1 Unknown
%47 = OpTypeSampledImage %46
%49 = OpTypeInt 32 1
%50 = OpConstant %49 1
%51 = OpConstant %5 0
%52 = OpTypeStruct %34 %5
%56 = OpTypeStruct %5 %5 %5 %5 %34
%60 = OpTypeBool
%63 = OpConstant %5 1
%65 = OpTypeImage %5 1D 1 1 0 1 Unknown
%66 = OpTypeSampledImage %65
%68 = OpConstant %49 2
%80 = OpTypeImage %5 2D 1 0 0 1 Unknown
%81 = OpTypeSampledImage %80
%83 = OpConstant %49 -3
%84 = OpConstant %49 -2
%87 = OpTypeVector %49 2
%88 = OpConstantComposite %87 %83 %84
%98 = OpTypeImage %5 2D 1 1 0 1 Unknown
%99 = OpTypeSampledImage %98
%101 = OpConstant %49 4
%102 = OpConstant %49 5
%104 = OpTypeVector %5 3
%106 = OpConstantComposite %87 %101 %102
%116 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %119
%119 = OpLabel
%27 = OpLoad %15 %17
%28 = OpLoad %12 %14
%29 = OpLoad %9 %11
%30 = OpLoad %6 %8
%31 = OpLoad %18 %20
%33 = OpAccessChain %32 %23 %35
%36 = OpLoad %5 %33
%37 = OpAccessChain %32 %23 %38
%39 = OpLoad %5 %37
%40 = OpAccessChain %32 %23 %41
%42 = OpLoad %5 %40
%43 = OpAccessChain %32 %23 %44
%45 = OpLoad %5 %43
%48 = OpSampledImage %47 %30 %31
%53 = OpImageSparseSampleDrefExplicitLod %52 %48 %36 %45 Lod|ConstOffset %51 %50
%54 = OpCompositeExtract %34 %53 0
%55 = OpCompositeExtract %5 %53 1
%57 = OpCompositeConstruct %56 %55 %55 %55 %55 %54
%58 = OpCompositeExtract %5 %57 0
%59 = OpCompositeExtract %34 %57 4
%61 = OpImageSparseTexelsResident %60 %59
%62 = OpSelect %5 %61 %63 %51
%64 = OpFAdd %5 %62 %58
%67 = OpSampledImage %66 %29 %31
%70 = OpCompositeConstruct %24 %36 %39
%69 = OpImageSparseSampleDrefExplicitLod %52 %67 %70 %45 Lod|ConstOffset %51 %68
%71 = OpCompositeExtract %34 %69 0
%72 = OpCompositeExtract %5 %69 1
%73 = OpCompositeConstruct %56 %72 %72 %72 %72 %71
%74 = OpCompositeExtract %5 %73 0
%75 = OpCompositeExtract %34 %73 4
%76 = OpImageSparseTexelsResident %60 %75
%77 = OpFAdd %5 %64 %74
%78 = OpSelect %5 %76 %63 %51
%79 = OpFAdd %5 %77 %78
%82 = OpSampledImage %81 %28 %31
%86 = OpCompositeConstruct %24 %36 %39
%85 = OpImageSparseSampleDrefExplicitLod %52 %82 %86 %45 Lod|ConstOffset %51 %88
%89 = OpCompositeExtract %34 %85 0
%90 = OpCompositeExtract %5 %85 1
%91 = OpCompositeConstruct %56 %90 %90 %90 %90 %89
%92 = OpCompositeExtract %5 %91 0
%93 = OpCompositeExtract %34 %91 4
%94 = OpImageSparseTexelsResident %60 %93
%95 = OpFAdd %5 %79 %92
%96 = OpSelect %5 %94 %63 %51
%97 = OpFAdd %5 %95 %96
%100 = OpSampledImage %99 %27 %31
%105 = OpCompositeConstruct %104 %36 %39 %42
%103 = OpImageSparseSampleDrefExplicitLod %52 %100 %105 %45 Lod|ConstOffset %51 %106
%107 = OpCompositeExtract %34 %103 0
%108 = OpCompositeExtract %5 %103 1
%109 = OpCompositeConstruct %56 %108 %108 %108 %108 %107
%110 = OpCompositeExtract %5 %109 0
%111 = OpCompositeExtract %34 %109 4
%112 = OpImageSparseTexelsResident %60 %111
%113 = OpFAdd %5 %97 %110
%114 = OpSelect %5 %112 %63 %51
%115 = OpFAdd %5 %113 %114
%117 = OpAccessChain %116 %26 %35
OpStore %117 %115
%118 = OpAccessChain %116 %26 %38
OpStore %118 %115
OpReturn
OpFunctionEnd
#endif
