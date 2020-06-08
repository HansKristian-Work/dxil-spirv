#version 460
#extension GL_ARB_sparse_texture2 : require
#extension GL_ARB_sparse_texture_clamp : require

struct SparseTexel
{
    uint _m0;
    vec4 _m1;
};

struct _72
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
layout(set = 1, binding = 5) uniform textureCube _23;
layout(set = 1, binding = 6) uniform textureCubeArray _26;
layout(set = 0, binding = 0) uniform sampler _29;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    uint _210;
    vec4 _211;
    _210 = sparseTextureOffsetClampARB(sampler1D(_8, _29), TEXCOORD.x, 0, 1.5, _211, 0.0);
    SparseTexel _65 = SparseTexel(_210, _211);
    vec4 _67 = _65._m1;
    _72 _73 = _72(_67.x, _67.y, _67.z, _67.w, _65._m0);
    float _79 = float(sparseTexelsResidentARB(int(_73._m4)));
    uint _212;
    vec4 _213;
    _212 = sparseTextureOffsetClampARB(sampler1DArray(_11, _29), vec2(TEXCOORD.x, TEXCOORD.y), 0, 1.5, _213, 0.0);
    SparseTexel _85 = SparseTexel(_212, _213);
    vec4 _88 = _85._m1;
    _72 _93 = _72(_88.x, _88.y, _88.z, _88.w, _85._m0);
    float _94 = _93._m0;
    float _99 = float(sparseTexelsResidentARB(int(_93._m4)));
    uint _214;
    vec4 _215;
    _214 = sparseTextureOffsetClampARB(sampler2D(_14, _29), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(0), 1.5, _215, 0.0);
    SparseTexel _104 = SparseTexel(_214, _215);
    vec4 _109 = _104._m1;
    _72 _114 = _72(_109.x, _109.y, _109.z, _109.w, _104._m0);
    float _121 = float(sparseTexelsResidentARB(int(_114._m4)));
    uint _216;
    vec4 _217;
    _216 = sparseTextureOffsetClampARB(sampler2DArray(_17, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(0), 1.5, _217, 0.0);
    SparseTexel _126 = SparseTexel(_216, _217);
    vec4 _130 = _126._m1;
    _72 _135 = _72(_130.x, _130.y, _130.z, _130.w, _126._m0);
    float _136 = _135._m0;
    float _141 = float(sparseTexelsResidentARB(int(_135._m4)));
    uint _218;
    vec4 _219;
    _218 = sparseTextureOffsetClampARB(sampler3D(_20, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(0), 1.5, _219, 0.0);
    SparseTexel _146 = SparseTexel(_218, _219);
    vec4 _151 = _146._m1;
    _72 _156 = _72(_151.x, _151.y, _151.z, _151.w, _146._m0);
    float _163 = float(sparseTexelsResidentARB(int(_156._m4)));
    uint _220;
    vec4 _221;
    _220 = sparseTextureClampARB(samplerCube(_23, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), 1.5, _221, 0.0);
    SparseTexel _168 = SparseTexel(_220, _221);
    vec4 _171 = _168._m1;
    _72 _176 = _72(_171.x, _171.y, _171.z, _171.w, _168._m0);
    float _183 = float(sparseTexelsResidentARB(int(_176._m4)));
    uint _222;
    vec4 _223;
    _222 = sparseTextureClampARB(samplerCubeArray(_26, _29), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), 1.5, _223, 0.0);
    SparseTexel _188 = SparseTexel(_222, _223);
    vec4 _191 = _188._m1;
    _72 _196 = _72(_191.x, _191.y, _191.z, _191.w, _188._m0);
    float _197 = _196._m0;
    float _202 = float(sparseTexelsResidentARB(int(_196._m4)));
    SV_Target.x = ((((((((((((_79 + _73._m0) + _94) + _99) + _114._m0) + _121) + _136) + _141) + _156._m0) + _163) + _176._m0) + _183) + _197) + _202;
    SV_Target.y = ((((((((((((_79 + _73._m1) + _94) + _99) + _114._m1) + _121) + _136) + _141) + _156._m1) + _163) + _176._m1) + _183) + _197) + _202;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 210
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpCapability MinLod
OpCapability Sampled1D
OpCapability SampledCubeArray
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %32 %35
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %32 "TEXCOORD"
OpName %35 "SV_Target"
OpName %64 "SparseTexel"
OpName %72 ""
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
OpDecorate %23 DescriptorSet 1
OpDecorate %23 Binding 5
OpDecorate %26 DescriptorSet 1
OpDecorate %26 Binding 6
OpDecorate %29 DescriptorSet 0
OpDecorate %29 Binding 0
OpDecorate %32 Location 0
OpDecorate %35 Location 0
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
%21 = OpTypeImage %5 Cube 0 0 0 1 Unknown
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeImage %5 Cube 0 1 0 1 Unknown
%25 = OpTypePointer UniformConstant %24
%26 = OpVariable %25 UniformConstant
%27 = OpTypeSampler
%28 = OpTypePointer UniformConstant %27
%29 = OpVariable %28 UniformConstant
%30 = OpTypeVector %5 4
%31 = OpTypePointer Input %30
%32 = OpVariable %31 Input
%33 = OpTypeVector %5 2
%34 = OpTypePointer Output %33
%35 = OpVariable %34 Output
%44 = OpTypePointer Input %5
%46 = OpTypeInt 32 0
%47 = OpConstant %46 0
%50 = OpConstant %46 1
%53 = OpConstant %46 2
%56 = OpConstant %46 3
%58 = OpTypeSampledImage %6
%60 = OpTypeInt 32 1
%61 = OpConstant %60 0
%62 = OpConstant %5 1.5
%63 = OpConstant %5 0
%64 = OpTypeStruct %46 %30
%72 = OpTypeStruct %5 %5 %5 %5 %46
%77 = OpTypeBool
%80 = OpConstant %5 1
%83 = OpTypeSampledImage %9
%102 = OpTypeSampledImage %12
%106 = OpTypeVector %60 2
%107 = OpConstantComposite %106 %61 %61
%124 = OpTypeSampledImage %15
%127 = OpTypeVector %5 3
%144 = OpTypeSampledImage %18
%148 = OpTypeVector %60 3
%149 = OpConstantComposite %148 %61 %61 %61
%166 = OpTypeSampledImage %21
%186 = OpTypeSampledImage %24
%205 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %208
%208 = OpLabel
%36 = OpLoad %24 %26
%37 = OpLoad %21 %23
%38 = OpLoad %18 %20
%39 = OpLoad %15 %17
%40 = OpLoad %12 %14
%41 = OpLoad %9 %11
%42 = OpLoad %6 %8
%43 = OpLoad %27 %29
%45 = OpAccessChain %44 %32 %47
%48 = OpLoad %5 %45
%49 = OpAccessChain %44 %32 %50
%51 = OpLoad %5 %49
%52 = OpAccessChain %44 %32 %53
%54 = OpLoad %5 %52
%55 = OpAccessChain %44 %32 %56
%57 = OpLoad %5 %55
%59 = OpSampledImage %58 %42 %43
%65 = OpImageSparseSampleImplicitLod %64 %59 %48 Bias|ConstOffset|MinLod %63 %61 %62
%66 = OpCompositeExtract %46 %65 0
%67 = OpCompositeExtract %30 %65 1
%68 = OpCompositeExtract %5 %67 0
%69 = OpCompositeExtract %5 %67 1
%70 = OpCompositeExtract %5 %67 2
%71 = OpCompositeExtract %5 %67 3
%73 = OpCompositeConstruct %72 %68 %69 %70 %71 %66
%74 = OpCompositeExtract %5 %73 0
%75 = OpCompositeExtract %5 %73 1
%76 = OpCompositeExtract %46 %73 4
%78 = OpImageSparseTexelsResident %77 %76
%79 = OpSelect %5 %78 %80 %63
%81 = OpFAdd %5 %79 %74
%82 = OpFAdd %5 %79 %75
%84 = OpSampledImage %83 %41 %43
%86 = OpCompositeConstruct %33 %48 %51
%85 = OpImageSparseSampleImplicitLod %64 %84 %86 Bias|ConstOffset|MinLod %63 %61 %62
%87 = OpCompositeExtract %46 %85 0
%88 = OpCompositeExtract %30 %85 1
%89 = OpCompositeExtract %5 %88 0
%90 = OpCompositeExtract %5 %88 1
%91 = OpCompositeExtract %5 %88 2
%92 = OpCompositeExtract %5 %88 3
%93 = OpCompositeConstruct %72 %89 %90 %91 %92 %87
%94 = OpCompositeExtract %5 %93 0
%95 = OpCompositeExtract %46 %93 4
%96 = OpImageSparseTexelsResident %77 %95
%97 = OpFAdd %5 %81 %94
%98 = OpFAdd %5 %82 %94
%99 = OpSelect %5 %96 %80 %63
%100 = OpFAdd %5 %97 %99
%101 = OpFAdd %5 %98 %99
%103 = OpSampledImage %102 %40 %43
%105 = OpCompositeConstruct %33 %48 %51
%104 = OpImageSparseSampleImplicitLod %64 %103 %105 Bias|ConstOffset|MinLod %63 %107 %62
%108 = OpCompositeExtract %46 %104 0
%109 = OpCompositeExtract %30 %104 1
%110 = OpCompositeExtract %5 %109 0
%111 = OpCompositeExtract %5 %109 1
%112 = OpCompositeExtract %5 %109 2
%113 = OpCompositeExtract %5 %109 3
%114 = OpCompositeConstruct %72 %110 %111 %112 %113 %108
%115 = OpCompositeExtract %5 %114 0
%116 = OpCompositeExtract %5 %114 1
%117 = OpCompositeExtract %46 %114 4
%118 = OpImageSparseTexelsResident %77 %117
%119 = OpFAdd %5 %100 %115
%120 = OpFAdd %5 %101 %116
%121 = OpSelect %5 %118 %80 %63
%122 = OpFAdd %5 %119 %121
%123 = OpFAdd %5 %120 %121
%125 = OpSampledImage %124 %39 %43
%128 = OpCompositeConstruct %127 %48 %51 %54
%126 = OpImageSparseSampleImplicitLod %64 %125 %128 Bias|ConstOffset|MinLod %63 %107 %62
%129 = OpCompositeExtract %46 %126 0
%130 = OpCompositeExtract %30 %126 1
%131 = OpCompositeExtract %5 %130 0
%132 = OpCompositeExtract %5 %130 1
%133 = OpCompositeExtract %5 %130 2
%134 = OpCompositeExtract %5 %130 3
%135 = OpCompositeConstruct %72 %131 %132 %133 %134 %129
%136 = OpCompositeExtract %5 %135 0
%137 = OpCompositeExtract %46 %135 4
%138 = OpImageSparseTexelsResident %77 %137
%139 = OpFAdd %5 %122 %136
%140 = OpFAdd %5 %123 %136
%141 = OpSelect %5 %138 %80 %63
%142 = OpFAdd %5 %139 %141
%143 = OpFAdd %5 %140 %141
%145 = OpSampledImage %144 %38 %43
%147 = OpCompositeConstruct %127 %48 %51 %54
%146 = OpImageSparseSampleImplicitLod %64 %145 %147 Bias|ConstOffset|MinLod %63 %149 %62
%150 = OpCompositeExtract %46 %146 0
%151 = OpCompositeExtract %30 %146 1
%152 = OpCompositeExtract %5 %151 0
%153 = OpCompositeExtract %5 %151 1
%154 = OpCompositeExtract %5 %151 2
%155 = OpCompositeExtract %5 %151 3
%156 = OpCompositeConstruct %72 %152 %153 %154 %155 %150
%157 = OpCompositeExtract %5 %156 0
%158 = OpCompositeExtract %5 %156 1
%159 = OpCompositeExtract %46 %156 4
%160 = OpImageSparseTexelsResident %77 %159
%161 = OpFAdd %5 %142 %157
%162 = OpFAdd %5 %143 %158
%163 = OpSelect %5 %160 %80 %63
%164 = OpFAdd %5 %161 %163
%165 = OpFAdd %5 %162 %163
%167 = OpSampledImage %166 %37 %43
%169 = OpCompositeConstruct %127 %48 %51 %54
%168 = OpImageSparseSampleImplicitLod %64 %167 %169 Bias|MinLod %63 %62
%170 = OpCompositeExtract %46 %168 0
%171 = OpCompositeExtract %30 %168 1
%172 = OpCompositeExtract %5 %171 0
%173 = OpCompositeExtract %5 %171 1
%174 = OpCompositeExtract %5 %171 2
%175 = OpCompositeExtract %5 %171 3
%176 = OpCompositeConstruct %72 %172 %173 %174 %175 %170
%177 = OpCompositeExtract %5 %176 0
%178 = OpCompositeExtract %5 %176 1
%179 = OpCompositeExtract %46 %176 4
%180 = OpImageSparseTexelsResident %77 %179
%181 = OpFAdd %5 %164 %177
%182 = OpFAdd %5 %165 %178
%183 = OpSelect %5 %180 %80 %63
%184 = OpFAdd %5 %181 %183
%185 = OpFAdd %5 %182 %183
%187 = OpSampledImage %186 %36 %43
%189 = OpCompositeConstruct %30 %48 %51 %54 %57
%188 = OpImageSparseSampleImplicitLod %64 %187 %189 Bias|MinLod %63 %62
%190 = OpCompositeExtract %46 %188 0
%191 = OpCompositeExtract %30 %188 1
%192 = OpCompositeExtract %5 %191 0
%193 = OpCompositeExtract %5 %191 1
%194 = OpCompositeExtract %5 %191 2
%195 = OpCompositeExtract %5 %191 3
%196 = OpCompositeConstruct %72 %192 %193 %194 %195 %190
%197 = OpCompositeExtract %5 %196 0
%198 = OpCompositeExtract %46 %196 4
%199 = OpImageSparseTexelsResident %77 %198
%200 = OpFAdd %5 %184 %197
%201 = OpFAdd %5 %185 %197
%202 = OpSelect %5 %199 %80 %63
%203 = OpFAdd %5 %200 %202
%204 = OpFAdd %5 %201 %202
%206 = OpAccessChain %205 %35 %47
OpStore %206 %203
%207 = OpAccessChain %205 %35 %50
OpStore %207 %204
OpReturn
OpFunctionEnd
#endif
