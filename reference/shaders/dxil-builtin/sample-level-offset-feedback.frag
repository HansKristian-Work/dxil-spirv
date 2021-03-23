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
    uint _168;
    vec4 _169;
    _168 = sparseTextureLodOffsetARB(sampler1D(_8, _23), TEXCOORD.x, TEXCOORD.w, 1, _169);
    SparseTexel _55 = SparseTexel(_168, _169);
    vec4 _57 = _55._m1;
    _62 _63 = _62(_57.x, _57.y, _57.z, _57.w, _55._m0);
    float _69 = float(sparseTexelsResidentARB(int(_63._m4)));
    uint _170;
    vec4 _171;
    _170 = sparseTextureLodOffsetARB(sampler1DArray(_11, _23), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w, 2, _171);
    SparseTexel _77 = SparseTexel(_170, _171);
    vec4 _80 = _77._m1;
    _62 _85 = _62(_80.x, _80.y, _80.z, _80.w, _77._m0);
    float _86 = _85._m0;
    float _91 = float(sparseTexelsResidentARB(int(_85._m4)));
    uint _172;
    vec4 _173;
    _172 = sparseTextureLodOffsetARB(sampler2D(_14, _23), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w, ivec2(2, 3), _173);
    SparseTexel _97 = SparseTexel(_172, _173);
    vec4 _102 = _97._m1;
    _62 _107 = _62(_102.x, _102.y, _102.z, _102.w, _97._m0);
    float _114 = float(sparseTexelsResidentARB(int(_107._m4)));
    uint _174;
    vec4 _175;
    _174 = sparseTextureLodOffsetARB(sampler2DArray(_17, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w, ivec2(-1, -3), _175);
    SparseTexel _121 = SparseTexel(_174, _175);
    vec4 _126 = _121._m1;
    _62 _131 = _62(_126.x, _126.y, _126.z, _126.w, _121._m0);
    float _132 = _131._m0;
    float _137 = float(sparseTexelsResidentARB(int(_131._m4)));
    uint _176;
    vec4 _177;
    _176 = sparseTextureLodOffsetARB(sampler3D(_20, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w, ivec3(-4, -5, 3), _177);
    SparseTexel _144 = SparseTexel(_176, _177);
    vec4 _149 = _144._m1;
    _62 _154 = _62(_149.x, _149.y, _149.z, _149.w, _144._m0);
    float _161 = float(sparseTexelsResidentARB(int(_154._m4)));
    SV_Target.x = ((((((((_69 + _63._m0) + _86) + _91) + _107._m0) + _114) + _132) + _137) + _154._m0) + _161;
    SV_Target.y = ((((((((_69 + _63._m1) + _86) + _91) + _107._m1) + _114) + _132) + _137) + _154._m1) + _161;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 168
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
%74 = OpTypeSampledImage %9
%76 = OpConstant %52 2
%94 = OpTypeSampledImage %12
%96 = OpConstant %52 3
%99 = OpTypeVector %52 2
%100 = OpConstantComposite %99 %76 %96
%117 = OpTypeSampledImage %15
%119 = OpConstant %52 -1
%120 = OpConstant %52 -3
%122 = OpTypeVector %5 3
%124 = OpConstantComposite %99 %119 %120
%140 = OpTypeSampledImage %18
%142 = OpConstant %52 -4
%143 = OpConstant %52 -5
%146 = OpTypeVector %52 3
%147 = OpConstantComposite %146 %142 %143 %96
%164 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %167
%167 = OpLabel
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
%72 = OpFAdd %5 %69 %64
%73 = OpFAdd %5 %69 %65
%75 = OpSampledImage %74 %33 %35
%78 = OpCompositeConstruct %27 %40 %43
%77 = OpImageSparseSampleExplicitLod %54 %75 %78 Lod|ConstOffset %49 %76
%79 = OpCompositeExtract %38 %77 0
%80 = OpCompositeExtract %24 %77 1
%81 = OpCompositeExtract %5 %80 0
%82 = OpCompositeExtract %5 %80 1
%83 = OpCompositeExtract %5 %80 2
%84 = OpCompositeExtract %5 %80 3
%85 = OpCompositeConstruct %62 %81 %82 %83 %84 %79
%86 = OpCompositeExtract %5 %85 0
%87 = OpCompositeExtract %38 %85 4
%88 = OpImageSparseTexelsResident %67 %87
%89 = OpFAdd %5 %72 %86
%90 = OpFAdd %5 %73 %86
%91 = OpSelect %5 %88 %70 %71
%92 = OpFAdd %5 %89 %91
%93 = OpFAdd %5 %90 %91
%95 = OpSampledImage %94 %32 %35
%98 = OpCompositeConstruct %27 %40 %43
%97 = OpImageSparseSampleExplicitLod %54 %95 %98 Lod|ConstOffset %49 %100
%101 = OpCompositeExtract %38 %97 0
%102 = OpCompositeExtract %24 %97 1
%103 = OpCompositeExtract %5 %102 0
%104 = OpCompositeExtract %5 %102 1
%105 = OpCompositeExtract %5 %102 2
%106 = OpCompositeExtract %5 %102 3
%107 = OpCompositeConstruct %62 %103 %104 %105 %106 %101
%108 = OpCompositeExtract %5 %107 0
%109 = OpCompositeExtract %5 %107 1
%110 = OpCompositeExtract %38 %107 4
%111 = OpImageSparseTexelsResident %67 %110
%112 = OpFAdd %5 %92 %108
%113 = OpFAdd %5 %93 %109
%114 = OpSelect %5 %111 %70 %71
%115 = OpFAdd %5 %112 %114
%116 = OpFAdd %5 %113 %114
%118 = OpSampledImage %117 %31 %35
%123 = OpCompositeConstruct %122 %40 %43 %46
%121 = OpImageSparseSampleExplicitLod %54 %118 %123 Lod|ConstOffset %49 %124
%125 = OpCompositeExtract %38 %121 0
%126 = OpCompositeExtract %24 %121 1
%127 = OpCompositeExtract %5 %126 0
%128 = OpCompositeExtract %5 %126 1
%129 = OpCompositeExtract %5 %126 2
%130 = OpCompositeExtract %5 %126 3
%131 = OpCompositeConstruct %62 %127 %128 %129 %130 %125
%132 = OpCompositeExtract %5 %131 0
%133 = OpCompositeExtract %38 %131 4
%134 = OpImageSparseTexelsResident %67 %133
%135 = OpFAdd %5 %115 %132
%136 = OpFAdd %5 %116 %132
%137 = OpSelect %5 %134 %70 %71
%138 = OpFAdd %5 %135 %137
%139 = OpFAdd %5 %136 %137
%141 = OpSampledImage %140 %30 %35
%145 = OpCompositeConstruct %122 %40 %43 %46
%144 = OpImageSparseSampleExplicitLod %54 %141 %145 Lod|ConstOffset %49 %147
%148 = OpCompositeExtract %38 %144 0
%149 = OpCompositeExtract %24 %144 1
%150 = OpCompositeExtract %5 %149 0
%151 = OpCompositeExtract %5 %149 1
%152 = OpCompositeExtract %5 %149 2
%153 = OpCompositeExtract %5 %149 3
%154 = OpCompositeConstruct %62 %150 %151 %152 %153 %148
%155 = OpCompositeExtract %5 %154 0
%156 = OpCompositeExtract %5 %154 1
%157 = OpCompositeExtract %38 %154 4
%158 = OpImageSparseTexelsResident %67 %157
%159 = OpFAdd %5 %138 %155
%160 = OpFAdd %5 %139 %156
%161 = OpSelect %5 %158 %70 %71
%162 = OpFAdd %5 %159 %161
%163 = OpFAdd %5 %160 %161
%165 = OpAccessChain %164 %29 %39
OpStore %165 %162
%166 = OpAccessChain %164 %29 %42
OpStore %166 %163
OpReturn
OpFunctionEnd
#endif
