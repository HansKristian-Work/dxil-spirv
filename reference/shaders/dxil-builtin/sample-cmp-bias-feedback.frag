#version 460
#extension GL_ARB_sparse_texture2 : require
#extension GL_ARB_sparse_texture_clamp : require

struct SparseTexel
{
    uint _m0;
    float _m1;
};

struct _57
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
layout(set = 1, binding = 5) uniform textureCube _20;
layout(set = 0, binding = 0) uniform samplerShadow _23;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 1) in float DREF;
layout(location = 0) out float SV_Target;

void main()
{
    uint _126;
    float _127;
    _126 = sparseTextureClampARB(sampler1DShadow(_8, _23), vec2(TEXCOORD.x, DREF), 1.5, _127, 0.0);
    SparseTexel _54 = SparseTexel(_126, _127);
    float _56 = _54._m1;
    _57 _58 = _57(_56, _56, _56, _56, _54._m0);
    uint _128;
    float _129;
    _128 = sparseTextureClampARB(sampler1DArrayShadow(_11, _23), vec3(vec2(TEXCOORD.x, TEXCOORD.y), DREF), 1.5, _129, 0.0);
    SparseTexel _69 = SparseTexel(_128, _129);
    float _73 = _69._m1;
    _57 _74 = _57(_73, _73, _73, _73, _69._m0);
    uint _130;
    float _131;
    _130 = sparseTextureClampARB(sampler2DShadow(_14, _23), vec3(vec2(TEXCOORD.x, TEXCOORD.y), DREF), 1.5, _131, 0.0);
    SparseTexel _84 = SparseTexel(_130, _131);
    float _87 = _84._m1;
    _57 _88 = _57(_87, _87, _87, _87, _84._m0);
    uint _132;
    float _133;
    _132 = sparseTextureClampARB(sampler2DArrayShadow(_17, _23), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), DREF), 1.5, _133, 0.0);
    SparseTexel _98 = SparseTexel(_132, _133);
    float _102 = _98._m1;
    _57 _103 = _57(_102, _102, _102, _102, _98._m0);
    uint _134;
    float _135;
    _134 = sparseTextureClampARB(samplerCubeShadow(_20, _23), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), DREF), 1.5, _135, 0.0);
    SparseTexel _113 = SparseTexel(_134, _135);
    float _116 = _113._m1;
    _57 _117 = _57(_116, _116, _116, _116, _113._m0);
    SV_Target = ((((((((float(sparseTexelsResidentARB(int(_58._m4))) + _58._m0) + _74._m0) + float(sparseTexelsResidentARB(int(_74._m4)))) + _88._m0) + float(sparseTexelsResidentARB(int(_88._m4)))) + _103._m0) + float(sparseTexelsResidentARB(int(_103._m4)))) + _117._m0) + float(sparseTexelsResidentARB(int(_117._m4)));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 126
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpCapability MinLod
OpCapability Sampled1D
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %26 %28 %30
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %26 "TEXCOORD"
OpName %28 "DREF"
OpName %30 "SV_Target"
OpName %53 "SparseTexel"
OpName %57 ""
OpDecorate %8 DescriptorSet 1
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 1
OpDecorate %11 Binding 1
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 2
OpDecorate %17 DescriptorSet 1
OpDecorate %17 Binding 3
OpDecorate %20 DescriptorSet 1
OpDecorate %20 Binding 5
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 0
OpDecorate %26 Location 0
OpDecorate %28 Location 1
OpDecorate %30 Location 0
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
%18 = OpTypeImage %5 Cube 0 0 0 1 Unknown
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeSampler
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeVector %5 4
%25 = OpTypePointer Input %24
%26 = OpVariable %25 Input
%27 = OpTypePointer Input %5
%28 = OpVariable %27 Input
%29 = OpTypePointer Output %5
%30 = OpVariable %29 Output
%39 = OpTypeInt 32 0
%40 = OpConstant %39 0
%43 = OpConstant %39 1
%46 = OpConstant %39 2
%48 = OpTypeImage %5 1D 1 0 0 1 Unknown
%49 = OpTypeSampledImage %48
%51 = OpConstant %5 1.5
%52 = OpConstant %5 0
%53 = OpTypeStruct %39 %5
%57 = OpTypeStruct %5 %5 %5 %5 %39
%61 = OpTypeBool
%64 = OpConstant %5 1
%66 = OpTypeImage %5 1D 1 1 0 1 Unknown
%67 = OpTypeSampledImage %66
%70 = OpTypeVector %5 2
%81 = OpTypeImage %5 2D 1 0 0 1 Unknown
%82 = OpTypeSampledImage %81
%95 = OpTypeImage %5 2D 1 1 0 1 Unknown
%96 = OpTypeSampledImage %95
%99 = OpTypeVector %5 3
%110 = OpTypeImage %5 Cube 1 0 0 1 Unknown
%111 = OpTypeSampledImage %110
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %124
%124 = OpLabel
%31 = OpLoad %18 %20
%32 = OpLoad %15 %17
%33 = OpLoad %12 %14
%34 = OpLoad %9 %11
%35 = OpLoad %6 %8
%36 = OpLoad %21 %23
%37 = OpLoad %5 %28
%38 = OpAccessChain %27 %26 %40
%41 = OpLoad %5 %38
%42 = OpAccessChain %27 %26 %43
%44 = OpLoad %5 %42
%45 = OpAccessChain %27 %26 %46
%47 = OpLoad %5 %45
%50 = OpSampledImage %49 %35 %36
%54 = OpImageSparseSampleDrefImplicitLod %53 %50 %41 %37 Bias|MinLod %52 %51
%55 = OpCompositeExtract %39 %54 0
%56 = OpCompositeExtract %5 %54 1
%58 = OpCompositeConstruct %57 %56 %56 %56 %56 %55
%59 = OpCompositeExtract %5 %58 0
%60 = OpCompositeExtract %39 %58 4
%62 = OpImageSparseTexelsResident %61 %60
%63 = OpSelect %5 %62 %64 %52
%65 = OpFAdd %5 %63 %59
%68 = OpSampledImage %67 %34 %36
%71 = OpCompositeConstruct %70 %41 %44
%69 = OpImageSparseSampleDrefImplicitLod %53 %68 %71 %37 Bias|MinLod %52 %51
%72 = OpCompositeExtract %39 %69 0
%73 = OpCompositeExtract %5 %69 1
%74 = OpCompositeConstruct %57 %73 %73 %73 %73 %72
%75 = OpCompositeExtract %5 %74 0
%76 = OpCompositeExtract %39 %74 4
%77 = OpImageSparseTexelsResident %61 %76
%78 = OpFAdd %5 %65 %75
%79 = OpSelect %5 %77 %64 %52
%80 = OpFAdd %5 %78 %79
%83 = OpSampledImage %82 %33 %36
%85 = OpCompositeConstruct %70 %41 %44
%84 = OpImageSparseSampleDrefImplicitLod %53 %83 %85 %37 Bias|MinLod %52 %51
%86 = OpCompositeExtract %39 %84 0
%87 = OpCompositeExtract %5 %84 1
%88 = OpCompositeConstruct %57 %87 %87 %87 %87 %86
%89 = OpCompositeExtract %5 %88 0
%90 = OpCompositeExtract %39 %88 4
%91 = OpImageSparseTexelsResident %61 %90
%92 = OpFAdd %5 %80 %89
%93 = OpSelect %5 %91 %64 %52
%94 = OpFAdd %5 %92 %93
%97 = OpSampledImage %96 %32 %36
%100 = OpCompositeConstruct %99 %41 %44 %47
%98 = OpImageSparseSampleDrefImplicitLod %53 %97 %100 %37 Bias|MinLod %52 %51
%101 = OpCompositeExtract %39 %98 0
%102 = OpCompositeExtract %5 %98 1
%103 = OpCompositeConstruct %57 %102 %102 %102 %102 %101
%104 = OpCompositeExtract %5 %103 0
%105 = OpCompositeExtract %39 %103 4
%106 = OpImageSparseTexelsResident %61 %105
%107 = OpFAdd %5 %94 %104
%108 = OpSelect %5 %106 %64 %52
%109 = OpFAdd %5 %107 %108
%112 = OpSampledImage %111 %31 %36
%114 = OpCompositeConstruct %99 %41 %44 %47
%113 = OpImageSparseSampleDrefImplicitLod %53 %112 %114 %37 Bias|MinLod %52 %51
%115 = OpCompositeExtract %39 %113 0
%116 = OpCompositeExtract %5 %113 1
%117 = OpCompositeConstruct %57 %116 %116 %116 %116 %115
%118 = OpCompositeExtract %5 %117 0
%119 = OpCompositeExtract %39 %117 4
%120 = OpImageSparseTexelsResident %61 %119
%121 = OpFAdd %5 %109 %118
%122 = OpSelect %5 %120 %64 %52
%123 = OpFAdd %5 %121 %122
OpStore %30 %123
OpReturn
OpFunctionEnd
#endif
