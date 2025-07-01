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
    uint _175;
    vec4 _176;
    _175 = sparseTextureGradOffsetARB(sampler1D(_8, _23), TEXCOORD.x, TEXCOORD.z, TEXCOORD.w, 1, _176);
    SparseTexel _55 = SparseTexel(_175, _176);
    vec4 _57 = _55._m1;
    _62 _63 = _62(_57.x, _57.y, _57.z, _57.w, _55._m0);
    uint _177;
    vec4 _178;
    _177 = sparseTextureGradOffsetARB(sampler1DArray(_11, _23), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.z, TEXCOORD.y, 2, _178);
    SparseTexel _75 = SparseTexel(_177, _178);
    vec4 _78 = _75._m1;
    _62 _83 = _62(_78.x, _78.y, _78.z, _78.w, _75._m0);
    uint _179;
    vec4 _180;
    _179 = sparseTextureGradOffsetARB(sampler2D(_14, _23), vec2(TEXCOORD.x, TEXCOORD.y), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(-3, -4), _180);
    SparseTexel _92 = SparseTexel(_179, _180);
    vec4 _99 = _92._m1;
    _62 _104 = _62(_99.x, _99.y, _99.z, _99.w, _92._m0);
    float _109 = float(sparseTexelsResidentARB(int(_104._m4)));
    uint _181;
    vec4 _182;
    _181 = sparseTextureGradOffsetARB(sampler2DArray(_17, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(4, -5), _182);
    SparseTexel _114 = SparseTexel(_181, _182);
    vec4 _121 = _114._m1;
    _62 _126 = _62(_121.x, _121.y, _121.z, _121.w, _114._m0);
    float _127 = _126._m0;
    float _130 = float(sparseTexelsResidentARB(int(_126._m4)));
    uint _183;
    vec4 _184;
    _183 = sparseTextureGradOffsetARB(sampler3D(_20, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(TEXCOORD.z), vec3(TEXCOORD.w), ivec3(5, 6, 7), _184);
    SparseTexel _136 = SparseTexel(_183, _184);
    vec4 _143 = _136._m1;
    _62 _148 = _62(_143.x, _143.y, _143.z, _143.w, _136._m0);
    float _153 = float(sparseTexelsResidentARB(int(_148._m4)));
    float _155 = float(sparseTexelsResidentARB(int(_83._m4))) + (_83._m0 + float(sparseTexelsResidentARB(int(_63._m4))));
    SV_Target.x = ((((((_155 + _63._m0) + _104._m0) + _109) + _127) + _130) + _148._m0) + _153;
    SV_Target.y = ((((((_155 + _63._m1) + _104._m1) + _109) + _127) + _130) + _148._m1) + _153;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 175
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
%90 = OpConstant %52 -3
%91 = OpConstant %52 -4
%96 = OpTypeVector %52 2
%97 = OpConstantComposite %96 %90 %91
%110 = OpTypeSampledImage %15
%112 = OpConstant %52 4
%113 = OpConstant %52 -5
%115 = OpTypeVector %5 3
%119 = OpConstantComposite %96 %112 %113
%131 = OpTypeSampledImage %18
%133 = OpConstant %52 5
%134 = OpConstant %52 6
%135 = OpConstant %52 7
%140 = OpTypeVector %52 3
%141 = OpConstantComposite %140 %133 %134 %135
%170 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %173
%173 = OpLabel
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
%55 = OpImageSparseSampleExplicitLod %54 %51 %40 Grad|ConstOffset %46 %49 %53
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
%75 = OpImageSparseSampleExplicitLod %54 %73 %76 Grad|ConstOffset %46 %43 %74
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
%93 = OpCompositeConstruct %27 %40 %43
%94 = OpCompositeConstruct %27 %46 %46
%95 = OpCompositeConstruct %27 %49 %49
%92 = OpImageSparseSampleExplicitLod %54 %89 %93 Grad|ConstOffset %94 %95 %97
%98 = OpCompositeExtract %38 %92 0
%99 = OpCompositeExtract %24 %92 1
%100 = OpCompositeExtract %5 %99 0
%101 = OpCompositeExtract %5 %99 1
%102 = OpCompositeExtract %5 %99 2
%103 = OpCompositeExtract %5 %99 3
%104 = OpCompositeConstruct %62 %100 %101 %102 %103 %98
%105 = OpCompositeExtract %5 %104 0
%106 = OpCompositeExtract %5 %104 1
%107 = OpCompositeExtract %38 %104 4
%108 = OpImageSparseTexelsResident %67 %107
%109 = OpSelect %5 %108 %70 %71
%111 = OpSampledImage %110 %31 %35
%116 = OpCompositeConstruct %115 %40 %43 %46
%117 = OpCompositeConstruct %27 %46 %46
%118 = OpCompositeConstruct %27 %49 %49
%114 = OpImageSparseSampleExplicitLod %54 %111 %116 Grad|ConstOffset %117 %118 %119
%120 = OpCompositeExtract %38 %114 0
%121 = OpCompositeExtract %24 %114 1
%122 = OpCompositeExtract %5 %121 0
%123 = OpCompositeExtract %5 %121 1
%124 = OpCompositeExtract %5 %121 2
%125 = OpCompositeExtract %5 %121 3
%126 = OpCompositeConstruct %62 %122 %123 %124 %125 %120
%127 = OpCompositeExtract %5 %126 0
%128 = OpCompositeExtract %38 %126 4
%129 = OpImageSparseTexelsResident %67 %128
%130 = OpSelect %5 %129 %70 %71
%132 = OpSampledImage %131 %30 %35
%137 = OpCompositeConstruct %115 %40 %43 %46
%138 = OpCompositeConstruct %115 %46 %46 %46
%139 = OpCompositeConstruct %115 %49 %49 %49
%136 = OpImageSparseSampleExplicitLod %54 %132 %137 Grad|ConstOffset %138 %139 %141
%142 = OpCompositeExtract %38 %136 0
%143 = OpCompositeExtract %24 %136 1
%144 = OpCompositeExtract %5 %143 0
%145 = OpCompositeExtract %5 %143 1
%146 = OpCompositeExtract %5 %143 2
%147 = OpCompositeExtract %5 %143 3
%148 = OpCompositeConstruct %62 %144 %145 %146 %147 %142
%149 = OpCompositeExtract %5 %148 0
%150 = OpCompositeExtract %5 %148 1
%151 = OpCompositeExtract %38 %148 4
%152 = OpImageSparseTexelsResident %67 %151
%153 = OpSelect %5 %152 %70 %71
%154 = OpFAdd %5 %84 %69
%155 = OpFAdd %5 %87 %154
%156 = OpFAdd %5 %155 %64
%157 = OpFAdd %5 %156 %105
%158 = OpFAdd %5 %157 %109
%159 = OpFAdd %5 %158 %127
%160 = OpFAdd %5 %159 %130
%161 = OpFAdd %5 %160 %149
%162 = OpFAdd %5 %161 %153
%163 = OpFAdd %5 %155 %65
%164 = OpFAdd %5 %163 %106
%165 = OpFAdd %5 %164 %109
%166 = OpFAdd %5 %165 %127
%167 = OpFAdd %5 %166 %130
%168 = OpFAdd %5 %167 %150
%169 = OpFAdd %5 %168 %153
%171 = OpAccessChain %170 %29 %39
OpStore %171 %162
%172 = OpAccessChain %170 %29 %42
OpStore %172 %169
OpReturn
OpFunctionEnd
#endif
