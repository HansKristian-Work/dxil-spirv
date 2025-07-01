#version 460
#extension GL_ARB_sparse_texture2 : require

struct SparseTexel
{
    uint _m0;
    vec4 _m1;
};

struct _62
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
layout(set = 1, binding = 4) uniform texture3D _20;
layout(set = 0, binding = 0) uniform sampler _23;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    uint _167;
    vec4 _168;
    _167 = sparseTextureLodOffsetARB(sampler1D(_8, _23), TEXCOORD.x, TEXCOORD.w, 1, _168);
    SparseTexel _55 = SparseTexel(_167, _168);
    vec4 _57 = _55._m1;
    _62 _63 = _62(_57.x, _57.y, _57.z, _57.w, _55._m0);
    uint _169;
    vec4 _170;
    _169 = sparseTextureLodOffsetARB(sampler1DArray(_11, _23), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w, 2, _170);
    SparseTexel _75 = SparseTexel(_169, _170);
    vec4 _78 = _75._m1;
    _62 _83 = _62(_78.x, _78.y, _78.z, _78.w, _75._m0);
    uint _171;
    vec4 _172;
    _171 = sparseTextureLodOffsetARB(sampler2D(_14, _23), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w, ivec2(2, 3), _172);
    SparseTexel _91 = SparseTexel(_171, _172);
    vec4 _96 = _91._m1;
    _62 _101 = _62(_96.x, _96.y, _96.z, _96.w, _91._m0);
    float _106 = float(sparseTexelsResidentARB(int(_101._m4)));
    uint _173;
    vec4 _174;
    _173 = sparseTextureLodOffsetARB(sampler2DArray(_17, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w, ivec2(-1, -3), _174);
    SparseTexel _111 = SparseTexel(_173, _174);
    vec4 _116 = _111._m1;
    _62 _121 = _62(_116.x, _116.y, _116.z, _116.w, _111._m0);
    float _122 = _121._m0;
    float _125 = float(sparseTexelsResidentARB(int(_121._m4)));
    uint _175;
    vec4 _176;
    _175 = sparseTextureLodOffsetARB(sampler3D(_20, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w, ivec3(-4, -5, 3), _176);
    SparseTexel _130 = SparseTexel(_175, _176);
    vec4 _135 = _130._m1;
    _62 _140 = _62(_135.x, _135.y, _135.z, _135.w, _130._m0);
    float _145 = float(sparseTexelsResidentARB(int(_140._m4)));
    float _147 = float(sparseTexelsResidentARB(int(_83._m4))) + (_83._m0 + float(sparseTexelsResidentARB(int(_63._m4))));
    SV_Target.x = ((((((_147 + _63._m0) + _101._m0) + _106) + _122) + _125) + _140._m0) + _145;
    SV_Target.y = ((((((_147 + _63._m1) + _101._m1) + _106) + _122) + _125) + _140._m1) + _145;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 167
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpCapability Sampled1D
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %26 %29
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %26 "TEXCOORD"
OpName %29 "SV_Target"
OpName %54 "SparseTexel"
OpName %62 ""
OpDecorate %8 DescriptorSet 1
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 1
OpDecorate %11 Binding 1
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 2
OpDecorate %17 DescriptorSet 1
OpDecorate %17 Binding 3
OpDecorate %20 DescriptorSet 1
OpDecorate %20 Binding 4
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 0
OpDecorate %26 Location 0
OpDecorate %29 Location 0
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
%18 = OpTypeImage %5 3D 0 0 0 1 Unknown
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeSampler
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeVector %5 4
%25 = OpTypePointer Input %24
%26 = OpVariable %25 Input
%27 = OpTypeVector %5 2
%28 = OpTypePointer Output %27
%29 = OpVariable %28 Output
%36 = OpTypePointer Input %5
%38 = OpTypeInt 32 0
%39 = OpConstant %38 0
%42 = OpConstant %38 1
%45 = OpConstant %38 2
%48 = OpConstant %38 3
%50 = OpTypeSampledImage %6
%52 = OpTypeInt 32 1
%53 = OpConstant %52 1
%54 = OpTypeStruct %38 %24
%62 = OpTypeStruct %5 %5 %5 %5 %38
%67 = OpTypeBool
%70 = OpConstant %5 1
%71 = OpConstant %5 0
%72 = OpTypeSampledImage %9
%74 = OpConstant %52 2
%88 = OpTypeSampledImage %12
%90 = OpConstant %52 3
%93 = OpTypeVector %52 2
%94 = OpConstantComposite %93 %74 %90
%107 = OpTypeSampledImage %15
%109 = OpConstant %52 -1
%110 = OpConstant %52 -3
%112 = OpTypeVector %5 3
%114 = OpConstantComposite %93 %109 %110
%126 = OpTypeSampledImage %18
%128 = OpConstant %52 -4
%129 = OpConstant %52 -5
%132 = OpTypeVector %52 3
%133 = OpConstantComposite %132 %128 %129 %90
%162 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %165
%165 = OpLabel
%30 = OpLoad %18 %20
%31 = OpLoad %15 %17
%32 = OpLoad %12 %14
%33 = OpLoad %9 %11
%34 = OpLoad %6 %8
%35 = OpLoad %21 %23
%37 = OpAccessChain %36 %26 %39
%40 = OpLoad %5 %37
%41 = OpAccessChain %36 %26 %42
%43 = OpLoad %5 %41
%44 = OpAccessChain %36 %26 %45
%46 = OpLoad %5 %44
%47 = OpAccessChain %36 %26 %48
%49 = OpLoad %5 %47
%51 = OpSampledImage %50 %34 %35
%55 = OpImageSparseSampleExplicitLod %54 %51 %40 Lod|ConstOffset %49 %53
%56 = OpCompositeExtract %38 %55 0
%57 = OpCompositeExtract %24 %55 1
%58 = OpCompositeExtract %5 %57 0
%59 = OpCompositeExtract %5 %57 1
%60 = OpCompositeExtract %5 %57 2
%61 = OpCompositeExtract %5 %57 3
%63 = OpCompositeConstruct %62 %58 %59 %60 %61 %56
%64 = OpCompositeExtract %5 %63 0
%65 = OpCompositeExtract %5 %63 1
%66 = OpCompositeExtract %38 %63 4
%68 = OpImageSparseTexelsResident %67 %66
%69 = OpSelect %5 %68 %70 %71
%73 = OpSampledImage %72 %33 %35
%76 = OpCompositeConstruct %27 %40 %43
%75 = OpImageSparseSampleExplicitLod %54 %73 %76 Lod|ConstOffset %49 %74
%77 = OpCompositeExtract %38 %75 0
%78 = OpCompositeExtract %24 %75 1
%79 = OpCompositeExtract %5 %78 0
%80 = OpCompositeExtract %5 %78 1
%81 = OpCompositeExtract %5 %78 2
%82 = OpCompositeExtract %5 %78 3
%83 = OpCompositeConstruct %62 %79 %80 %81 %82 %77
%84 = OpCompositeExtract %5 %83 0
%85 = OpCompositeExtract %38 %83 4
%86 = OpImageSparseTexelsResident %67 %85
%87 = OpSelect %5 %86 %70 %71
%89 = OpSampledImage %88 %32 %35
%92 = OpCompositeConstruct %27 %40 %43
%91 = OpImageSparseSampleExplicitLod %54 %89 %92 Lod|ConstOffset %49 %94
%95 = OpCompositeExtract %38 %91 0
%96 = OpCompositeExtract %24 %91 1
%97 = OpCompositeExtract %5 %96 0
%98 = OpCompositeExtract %5 %96 1
%99 = OpCompositeExtract %5 %96 2
%100 = OpCompositeExtract %5 %96 3
%101 = OpCompositeConstruct %62 %97 %98 %99 %100 %95
%102 = OpCompositeExtract %5 %101 0
%103 = OpCompositeExtract %5 %101 1
%104 = OpCompositeExtract %38 %101 4
%105 = OpImageSparseTexelsResident %67 %104
%106 = OpSelect %5 %105 %70 %71
%108 = OpSampledImage %107 %31 %35
%113 = OpCompositeConstruct %112 %40 %43 %46
%111 = OpImageSparseSampleExplicitLod %54 %108 %113 Lod|ConstOffset %49 %114
%115 = OpCompositeExtract %38 %111 0
%116 = OpCompositeExtract %24 %111 1
%117 = OpCompositeExtract %5 %116 0
%118 = OpCompositeExtract %5 %116 1
%119 = OpCompositeExtract %5 %116 2
%120 = OpCompositeExtract %5 %116 3
%121 = OpCompositeConstruct %62 %117 %118 %119 %120 %115
%122 = OpCompositeExtract %5 %121 0
%123 = OpCompositeExtract %38 %121 4
%124 = OpImageSparseTexelsResident %67 %123
%125 = OpSelect %5 %124 %70 %71
%127 = OpSampledImage %126 %30 %35
%131 = OpCompositeConstruct %112 %40 %43 %46
%130 = OpImageSparseSampleExplicitLod %54 %127 %131 Lod|ConstOffset %49 %133
%134 = OpCompositeExtract %38 %130 0
%135 = OpCompositeExtract %24 %130 1
%136 = OpCompositeExtract %5 %135 0
%137 = OpCompositeExtract %5 %135 1
%138 = OpCompositeExtract %5 %135 2
%139 = OpCompositeExtract %5 %135 3
%140 = OpCompositeConstruct %62 %136 %137 %138 %139 %134
%141 = OpCompositeExtract %5 %140 0
%142 = OpCompositeExtract %5 %140 1
%143 = OpCompositeExtract %38 %140 4
%144 = OpImageSparseTexelsResident %67 %143
%145 = OpSelect %5 %144 %70 %71
%146 = OpFAdd %5 %84 %69
%147 = OpFAdd %5 %87 %146
%148 = OpFAdd %5 %147 %64
%149 = OpFAdd %5 %148 %102
%150 = OpFAdd %5 %149 %106
%151 = OpFAdd %5 %150 %122
%152 = OpFAdd %5 %151 %125
%153 = OpFAdd %5 %152 %141
%154 = OpFAdd %5 %153 %145
%155 = OpFAdd %5 %147 %65
%156 = OpFAdd %5 %155 %103
%157 = OpFAdd %5 %156 %106
%158 = OpFAdd %5 %157 %122
%159 = OpFAdd %5 %158 %125
%160 = OpFAdd %5 %159 %142
%161 = OpFAdd %5 %160 %145
%163 = OpAccessChain %162 %29 %39
OpStore %163 %154
%164 = OpAccessChain %162 %29 %42
OpStore %164 %161
OpReturn
OpFunctionEnd
#endif
