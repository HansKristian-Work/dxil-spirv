#version 460
#extension GL_ARB_sparse_texture2 : require
#extension GL_ARB_sparse_texture_clamp : require

struct SparseTexel
{
    uint _m0;
    vec4 _m1;
};

struct _70
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
    uint _204;
    vec4 _205;
    _204 = sparseTextureClampARB(sampler1D(_8, _29), TEXCOORD.x, 1.5, _205, 0.0);
    SparseTexel _63 = SparseTexel(_204, _205);
    vec4 _65 = _63._m1;
    _70 _71 = _70(_65.x, _65.y, _65.z, _65.w, _63._m0);
    float _77 = float(sparseTexelsResidentARB(int(_71._m4)));
    uint _206;
    vec4 _207;
    _206 = sparseTextureClampARB(sampler1DArray(_11, _29), vec2(TEXCOORD.x, TEXCOORD.y), 1.5, _207, 0.0);
    SparseTexel _83 = SparseTexel(_206, _207);
    vec4 _86 = _83._m1;
    _70 _91 = _70(_86.x, _86.y, _86.z, _86.w, _83._m0);
    float _92 = _91._m0;
    float _97 = float(sparseTexelsResidentARB(int(_91._m4)));
    uint _208;
    vec4 _209;
    _208 = sparseTextureClampARB(sampler2D(_14, _29), vec2(TEXCOORD.x, TEXCOORD.y), 1.5, _209, 0.0);
    SparseTexel _102 = SparseTexel(_208, _209);
    vec4 _105 = _102._m1;
    _70 _110 = _70(_105.x, _105.y, _105.z, _105.w, _102._m0);
    float _117 = float(sparseTexelsResidentARB(int(_110._m4)));
    uint _210;
    vec4 _211;
    _210 = sparseTextureClampARB(sampler2DArray(_17, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), 1.5, _211, 0.0);
    SparseTexel _122 = SparseTexel(_210, _211);
    vec4 _126 = _122._m1;
    _70 _131 = _70(_126.x, _126.y, _126.z, _126.w, _122._m0);
    float _132 = _131._m0;
    float _137 = float(sparseTexelsResidentARB(int(_131._m4)));
    uint _212;
    vec4 _213;
    _212 = sparseTextureClampARB(sampler3D(_20, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), 1.5, _213, 0.0);
    SparseTexel _142 = SparseTexel(_212, _213);
    vec4 _145 = _142._m1;
    _70 _150 = _70(_145.x, _145.y, _145.z, _145.w, _142._m0);
    float _157 = float(sparseTexelsResidentARB(int(_150._m4)));
    uint _214;
    vec4 _215;
    _214 = sparseTextureClampARB(samplerCube(_23, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), 1.5, _215, 0.0);
    SparseTexel _162 = SparseTexel(_214, _215);
    vec4 _165 = _162._m1;
    _70 _170 = _70(_165.x, _165.y, _165.z, _165.w, _162._m0);
    float _177 = float(sparseTexelsResidentARB(int(_170._m4)));
    uint _216;
    vec4 _217;
    _216 = sparseTextureClampARB(samplerCubeArray(_26, _29), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), 1.5, _217, 0.0);
    SparseTexel _182 = SparseTexel(_216, _217);
    vec4 _185 = _182._m1;
    _70 _190 = _70(_185.x, _185.y, _185.z, _185.w, _182._m0);
    float _191 = _190._m0;
    float _196 = float(sparseTexelsResidentARB(int(_190._m4)));
    SV_Target.x = ((((((((((((_77 + _71._m0) + _92) + _97) + _110._m0) + _117) + _132) + _137) + _150._m0) + _157) + _170._m0) + _177) + _191) + _196;
    SV_Target.y = ((((((((((((_77 + _71._m1) + _92) + _97) + _110._m1) + _117) + _132) + _137) + _150._m1) + _157) + _170._m1) + _177) + _191) + _196;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 204
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
OpName %62 "SparseTexel"
OpName %70 ""
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
%60 = OpConstant %5 1.5
%61 = OpConstant %5 0
%62 = OpTypeStruct %46 %30
%70 = OpTypeStruct %5 %5 %5 %5 %46
%75 = OpTypeBool
%78 = OpConstant %5 1
%81 = OpTypeSampledImage %9
%100 = OpTypeSampledImage %12
%120 = OpTypeSampledImage %15
%123 = OpTypeVector %5 3
%140 = OpTypeSampledImage %18
%160 = OpTypeSampledImage %21
%180 = OpTypeSampledImage %24
%199 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %202
%202 = OpLabel
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
%63 = OpImageSparseSampleImplicitLod %62 %59 %48 Bias|MinLod %61 %60
%64 = OpCompositeExtract %46 %63 0
%65 = OpCompositeExtract %30 %63 1
%66 = OpCompositeExtract %5 %65 0
%67 = OpCompositeExtract %5 %65 1
%68 = OpCompositeExtract %5 %65 2
%69 = OpCompositeExtract %5 %65 3
%71 = OpCompositeConstruct %70 %66 %67 %68 %69 %64
%72 = OpCompositeExtract %5 %71 0
%73 = OpCompositeExtract %5 %71 1
%74 = OpCompositeExtract %46 %71 4
%76 = OpImageSparseTexelsResident %75 %74
%77 = OpSelect %5 %76 %78 %61
%79 = OpFAdd %5 %77 %72
%80 = OpFAdd %5 %77 %73
%82 = OpSampledImage %81 %41 %43
%84 = OpCompositeConstruct %33 %48 %51
%83 = OpImageSparseSampleImplicitLod %62 %82 %84 Bias|MinLod %61 %60
%85 = OpCompositeExtract %46 %83 0
%86 = OpCompositeExtract %30 %83 1
%87 = OpCompositeExtract %5 %86 0
%88 = OpCompositeExtract %5 %86 1
%89 = OpCompositeExtract %5 %86 2
%90 = OpCompositeExtract %5 %86 3
%91 = OpCompositeConstruct %70 %87 %88 %89 %90 %85
%92 = OpCompositeExtract %5 %91 0
%93 = OpCompositeExtract %46 %91 4
%94 = OpImageSparseTexelsResident %75 %93
%95 = OpFAdd %5 %79 %92
%96 = OpFAdd %5 %80 %92
%97 = OpSelect %5 %94 %78 %61
%98 = OpFAdd %5 %95 %97
%99 = OpFAdd %5 %96 %97
%101 = OpSampledImage %100 %40 %43
%103 = OpCompositeConstruct %33 %48 %51
%102 = OpImageSparseSampleImplicitLod %62 %101 %103 Bias|MinLod %61 %60
%104 = OpCompositeExtract %46 %102 0
%105 = OpCompositeExtract %30 %102 1
%106 = OpCompositeExtract %5 %105 0
%107 = OpCompositeExtract %5 %105 1
%108 = OpCompositeExtract %5 %105 2
%109 = OpCompositeExtract %5 %105 3
%110 = OpCompositeConstruct %70 %106 %107 %108 %109 %104
%111 = OpCompositeExtract %5 %110 0
%112 = OpCompositeExtract %5 %110 1
%113 = OpCompositeExtract %46 %110 4
%114 = OpImageSparseTexelsResident %75 %113
%115 = OpFAdd %5 %98 %111
%116 = OpFAdd %5 %99 %112
%117 = OpSelect %5 %114 %78 %61
%118 = OpFAdd %5 %115 %117
%119 = OpFAdd %5 %116 %117
%121 = OpSampledImage %120 %39 %43
%124 = OpCompositeConstruct %123 %48 %51 %54
%122 = OpImageSparseSampleImplicitLod %62 %121 %124 Bias|MinLod %61 %60
%125 = OpCompositeExtract %46 %122 0
%126 = OpCompositeExtract %30 %122 1
%127 = OpCompositeExtract %5 %126 0
%128 = OpCompositeExtract %5 %126 1
%129 = OpCompositeExtract %5 %126 2
%130 = OpCompositeExtract %5 %126 3
%131 = OpCompositeConstruct %70 %127 %128 %129 %130 %125
%132 = OpCompositeExtract %5 %131 0
%133 = OpCompositeExtract %46 %131 4
%134 = OpImageSparseTexelsResident %75 %133
%135 = OpFAdd %5 %118 %132
%136 = OpFAdd %5 %119 %132
%137 = OpSelect %5 %134 %78 %61
%138 = OpFAdd %5 %135 %137
%139 = OpFAdd %5 %136 %137
%141 = OpSampledImage %140 %38 %43
%143 = OpCompositeConstruct %123 %48 %51 %54
%142 = OpImageSparseSampleImplicitLod %62 %141 %143 Bias|MinLod %61 %60
%144 = OpCompositeExtract %46 %142 0
%145 = OpCompositeExtract %30 %142 1
%146 = OpCompositeExtract %5 %145 0
%147 = OpCompositeExtract %5 %145 1
%148 = OpCompositeExtract %5 %145 2
%149 = OpCompositeExtract %5 %145 3
%150 = OpCompositeConstruct %70 %146 %147 %148 %149 %144
%151 = OpCompositeExtract %5 %150 0
%152 = OpCompositeExtract %5 %150 1
%153 = OpCompositeExtract %46 %150 4
%154 = OpImageSparseTexelsResident %75 %153
%155 = OpFAdd %5 %138 %151
%156 = OpFAdd %5 %139 %152
%157 = OpSelect %5 %154 %78 %61
%158 = OpFAdd %5 %155 %157
%159 = OpFAdd %5 %156 %157
%161 = OpSampledImage %160 %37 %43
%163 = OpCompositeConstruct %123 %48 %51 %54
%162 = OpImageSparseSampleImplicitLod %62 %161 %163 Bias|MinLod %61 %60
%164 = OpCompositeExtract %46 %162 0
%165 = OpCompositeExtract %30 %162 1
%166 = OpCompositeExtract %5 %165 0
%167 = OpCompositeExtract %5 %165 1
%168 = OpCompositeExtract %5 %165 2
%169 = OpCompositeExtract %5 %165 3
%170 = OpCompositeConstruct %70 %166 %167 %168 %169 %164
%171 = OpCompositeExtract %5 %170 0
%172 = OpCompositeExtract %5 %170 1
%173 = OpCompositeExtract %46 %170 4
%174 = OpImageSparseTexelsResident %75 %173
%175 = OpFAdd %5 %158 %171
%176 = OpFAdd %5 %159 %172
%177 = OpSelect %5 %174 %78 %61
%178 = OpFAdd %5 %175 %177
%179 = OpFAdd %5 %176 %177
%181 = OpSampledImage %180 %36 %43
%183 = OpCompositeConstruct %30 %48 %51 %54 %57
%182 = OpImageSparseSampleImplicitLod %62 %181 %183 Bias|MinLod %61 %60
%184 = OpCompositeExtract %46 %182 0
%185 = OpCompositeExtract %30 %182 1
%186 = OpCompositeExtract %5 %185 0
%187 = OpCompositeExtract %5 %185 1
%188 = OpCompositeExtract %5 %185 2
%189 = OpCompositeExtract %5 %185 3
%190 = OpCompositeConstruct %70 %186 %187 %188 %189 %184
%191 = OpCompositeExtract %5 %190 0
%192 = OpCompositeExtract %46 %190 4
%193 = OpImageSparseTexelsResident %75 %192
%194 = OpFAdd %5 %178 %191
%195 = OpFAdd %5 %179 %191
%196 = OpSelect %5 %193 %78 %61
%197 = OpFAdd %5 %194 %196
%198 = OpFAdd %5 %195 %196
%200 = OpAccessChain %199 %35 %47
OpStore %200 %197
%201 = OpAccessChain %199 %35 %50
OpStore %201 %198
OpReturn
OpFunctionEnd
#endif
