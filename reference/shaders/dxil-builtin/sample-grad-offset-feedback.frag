#version 460
#extension GL_ARB_sparse_texture2 : require
#extension GL_ARB_sparse_texture_clamp : require

struct SparseTexel
{
    uint _m0;
    vec4 _m1;
};

struct _63
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
    uint _176;
    vec4 _177;
    _176 = sparseTextureGradOffsetClampARB(sampler1D(_8, _23), TEXCOORD.x, TEXCOORD.z, TEXCOORD.w, 1, 0.0, _177);
    SparseTexel _56 = SparseTexel(_176, _177);
    vec4 _58 = _56._m1;
    _63 _64 = _63(_58.x, _58.y, _58.z, _58.w, _56._m0);
    float _70 = float(sparseTexelsResidentARB(int(_64._m4)));
    uint _178;
    vec4 _179;
    _178 = sparseTextureGradOffsetClampARB(sampler1DArray(_11, _23), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.z, TEXCOORD.y, 2, 0.0, _179);
    SparseTexel _77 = SparseTexel(_178, _179);
    vec4 _80 = _77._m1;
    _63 _85 = _63(_80.x, _80.y, _80.z, _80.w, _77._m0);
    float _86 = _85._m0;
    float _91 = float(sparseTexelsResidentARB(int(_85._m4)));
    uint _180;
    vec4 _181;
    _180 = sparseTextureGradOffsetClampARB(sampler2D(_14, _23), vec2(TEXCOORD.x, TEXCOORD.y), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(-3, -4), 0.0, _181);
    SparseTexel _98 = SparseTexel(_180, _181);
    vec4 _105 = _98._m1;
    _63 _110 = _63(_105.x, _105.y, _105.z, _105.w, _98._m0);
    float _117 = float(sparseTexelsResidentARB(int(_110._m4)));
    uint _182;
    vec4 _183;
    _182 = sparseTextureGradOffsetClampARB(sampler2DArray(_17, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(4, -5), 0.0, _183);
    SparseTexel _124 = SparseTexel(_182, _183);
    vec4 _131 = _124._m1;
    _63 _136 = _63(_131.x, _131.y, _131.z, _131.w, _124._m0);
    float _137 = _136._m0;
    float _142 = float(sparseTexelsResidentARB(int(_136._m4)));
    uint _184;
    vec4 _185;
    _184 = sparseTextureGradOffsetClampARB(sampler3D(_20, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(TEXCOORD.z), vec3(TEXCOORD.w), ivec3(5, 6, 7), 0.0, _185);
    SparseTexel _150 = SparseTexel(_184, _185);
    vec4 _157 = _150._m1;
    _63 _162 = _63(_157.x, _157.y, _157.z, _157.w, _150._m0);
    float _169 = float(sparseTexelsResidentARB(int(_162._m4)));
    SV_Target.x = ((((((((_70 + _64._m0) + _86) + _91) + _110._m0) + _117) + _137) + _142) + _162._m0) + _169;
    SV_Target.y = ((((((((_70 + _64._m1) + _86) + _91) + _110._m1) + _117) + _137) + _142) + _162._m1) + _169;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 176
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpCapability MinLod
OpCapability Sampled1D
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %26 %29
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %26 "TEXCOORD"
OpName %29 "SV_Target"
OpName %55 "SparseTexel"
OpName %63 ""
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
%54 = OpConstant %5 0
%55 = OpTypeStruct %38 %24
%63 = OpTypeStruct %5 %5 %5 %5 %38
%68 = OpTypeBool
%71 = OpConstant %5 1
%74 = OpTypeSampledImage %9
%76 = OpConstant %52 2
%94 = OpTypeSampledImage %12
%96 = OpConstant %52 -3
%97 = OpConstant %52 -4
%102 = OpTypeVector %52 2
%103 = OpConstantComposite %102 %96 %97
%120 = OpTypeSampledImage %15
%122 = OpConstant %52 4
%123 = OpConstant %52 -5
%125 = OpTypeVector %5 3
%129 = OpConstantComposite %102 %122 %123
%145 = OpTypeSampledImage %18
%147 = OpConstant %52 5
%148 = OpConstant %52 6
%149 = OpConstant %52 7
%154 = OpTypeVector %52 3
%155 = OpConstantComposite %154 %147 %148 %149
%172 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %175
%175 = OpLabel
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
%56 = OpImageSparseSampleExplicitLod %55 %51 %40 Grad|ConstOffset|MinLod %46 %49 %53 %54
%57 = OpCompositeExtract %38 %56 0
%58 = OpCompositeExtract %24 %56 1
%59 = OpCompositeExtract %5 %58 0
%60 = OpCompositeExtract %5 %58 1
%61 = OpCompositeExtract %5 %58 2
%62 = OpCompositeExtract %5 %58 3
%64 = OpCompositeConstruct %63 %59 %60 %61 %62 %57
%65 = OpCompositeExtract %5 %64 0
%66 = OpCompositeExtract %5 %64 1
%67 = OpCompositeExtract %38 %64 4
%69 = OpImageSparseTexelsResident %68 %67
%70 = OpSelect %5 %69 %71 %54
%72 = OpFAdd %5 %70 %65
%73 = OpFAdd %5 %70 %66
%75 = OpSampledImage %74 %33 %35
%78 = OpCompositeConstruct %27 %40 %43
%77 = OpImageSparseSampleExplicitLod %55 %75 %78 Grad|ConstOffset|MinLod %46 %43 %76 %54
%79 = OpCompositeExtract %38 %77 0
%80 = OpCompositeExtract %24 %77 1
%81 = OpCompositeExtract %5 %80 0
%82 = OpCompositeExtract %5 %80 1
%83 = OpCompositeExtract %5 %80 2
%84 = OpCompositeExtract %5 %80 3
%85 = OpCompositeConstruct %63 %81 %82 %83 %84 %79
%86 = OpCompositeExtract %5 %85 0
%87 = OpCompositeExtract %38 %85 4
%88 = OpImageSparseTexelsResident %68 %87
%89 = OpFAdd %5 %72 %86
%90 = OpFAdd %5 %73 %86
%91 = OpSelect %5 %88 %71 %54
%92 = OpFAdd %5 %89 %91
%93 = OpFAdd %5 %90 %91
%95 = OpSampledImage %94 %32 %35
%99 = OpCompositeConstruct %27 %40 %43
%100 = OpCompositeConstruct %27 %46 %46
%101 = OpCompositeConstruct %27 %49 %49
%98 = OpImageSparseSampleExplicitLod %55 %95 %99 Grad|ConstOffset|MinLod %100 %101 %103 %54
%104 = OpCompositeExtract %38 %98 0
%105 = OpCompositeExtract %24 %98 1
%106 = OpCompositeExtract %5 %105 0
%107 = OpCompositeExtract %5 %105 1
%108 = OpCompositeExtract %5 %105 2
%109 = OpCompositeExtract %5 %105 3
%110 = OpCompositeConstruct %63 %106 %107 %108 %109 %104
%111 = OpCompositeExtract %5 %110 0
%112 = OpCompositeExtract %5 %110 1
%113 = OpCompositeExtract %38 %110 4
%114 = OpImageSparseTexelsResident %68 %113
%115 = OpFAdd %5 %92 %111
%116 = OpFAdd %5 %93 %112
%117 = OpSelect %5 %114 %71 %54
%118 = OpFAdd %5 %115 %117
%119 = OpFAdd %5 %116 %117
%121 = OpSampledImage %120 %31 %35
%126 = OpCompositeConstruct %125 %40 %43 %46
%127 = OpCompositeConstruct %27 %46 %46
%128 = OpCompositeConstruct %27 %49 %49
%124 = OpImageSparseSampleExplicitLod %55 %121 %126 Grad|ConstOffset|MinLod %127 %128 %129 %54
%130 = OpCompositeExtract %38 %124 0
%131 = OpCompositeExtract %24 %124 1
%132 = OpCompositeExtract %5 %131 0
%133 = OpCompositeExtract %5 %131 1
%134 = OpCompositeExtract %5 %131 2
%135 = OpCompositeExtract %5 %131 3
%136 = OpCompositeConstruct %63 %132 %133 %134 %135 %130
%137 = OpCompositeExtract %5 %136 0
%138 = OpCompositeExtract %38 %136 4
%139 = OpImageSparseTexelsResident %68 %138
%140 = OpFAdd %5 %118 %137
%141 = OpFAdd %5 %119 %137
%142 = OpSelect %5 %139 %71 %54
%143 = OpFAdd %5 %140 %142
%144 = OpFAdd %5 %141 %142
%146 = OpSampledImage %145 %30 %35
%151 = OpCompositeConstruct %125 %40 %43 %46
%152 = OpCompositeConstruct %125 %46 %46 %46
%153 = OpCompositeConstruct %125 %49 %49 %49
%150 = OpImageSparseSampleExplicitLod %55 %146 %151 Grad|ConstOffset|MinLod %152 %153 %155 %54
%156 = OpCompositeExtract %38 %150 0
%157 = OpCompositeExtract %24 %150 1
%158 = OpCompositeExtract %5 %157 0
%159 = OpCompositeExtract %5 %157 1
%160 = OpCompositeExtract %5 %157 2
%161 = OpCompositeExtract %5 %157 3
%162 = OpCompositeConstruct %63 %158 %159 %160 %161 %156
%163 = OpCompositeExtract %5 %162 0
%164 = OpCompositeExtract %5 %162 1
%165 = OpCompositeExtract %38 %162 4
%166 = OpImageSparseTexelsResident %68 %165
%167 = OpFAdd %5 %143 %163
%168 = OpFAdd %5 %144 %164
%169 = OpSelect %5 %166 %71 %54
%170 = OpFAdd %5 %167 %169
%171 = OpFAdd %5 %168 %169
%173 = OpAccessChain %172 %29 %39
OpStore %173 %170
%174 = OpAccessChain %172 %29 %42
OpStore %174 %171
OpReturn
OpFunctionEnd
#endif
