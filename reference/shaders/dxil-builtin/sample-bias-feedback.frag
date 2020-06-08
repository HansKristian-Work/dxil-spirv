#version 460
#extension GL_ARB_sparse_texture2 : require

struct SparseTexel
{
    uint _m0;
    vec4 _m1;
};

struct _71
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
    uint _209;
    vec4 _210;
    _209 = sparseTextureOffsetARB(sampler1D(_8, _29), TEXCOORD.x, 0, _210, 0.0);
    SparseTexel _64 = SparseTexel(_209, _210);
    vec4 _66 = _64._m1;
    _71 _72 = _71(_66.x, _66.y, _66.z, _66.w, _64._m0);
    float _78 = float(sparseTexelsResidentARB(int(_72._m4)));
    uint _211;
    vec4 _212;
    _211 = sparseTextureOffsetARB(sampler1DArray(_11, _29), vec2(TEXCOORD.x, TEXCOORD.y), 0, _212, 0.0);
    SparseTexel _84 = SparseTexel(_211, _212);
    vec4 _87 = _84._m1;
    _71 _92 = _71(_87.x, _87.y, _87.z, _87.w, _84._m0);
    float _93 = _92._m0;
    float _98 = float(sparseTexelsResidentARB(int(_92._m4)));
    uint _213;
    vec4 _214;
    _213 = sparseTextureOffsetARB(sampler2D(_14, _29), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(0), _214, 0.0);
    SparseTexel _103 = SparseTexel(_213, _214);
    vec4 _108 = _103._m1;
    _71 _113 = _71(_108.x, _108.y, _108.z, _108.w, _103._m0);
    float _120 = float(sparseTexelsResidentARB(int(_113._m4)));
    uint _215;
    vec4 _216;
    _215 = sparseTextureOffsetARB(sampler2DArray(_17, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(0), _216, 0.0);
    SparseTexel _125 = SparseTexel(_215, _216);
    vec4 _129 = _125._m1;
    _71 _134 = _71(_129.x, _129.y, _129.z, _129.w, _125._m0);
    float _135 = _134._m0;
    float _140 = float(sparseTexelsResidentARB(int(_134._m4)));
    uint _217;
    vec4 _218;
    _217 = sparseTextureOffsetARB(sampler3D(_20, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(0), _218, 0.0);
    SparseTexel _145 = SparseTexel(_217, _218);
    vec4 _150 = _145._m1;
    _71 _155 = _71(_150.x, _150.y, _150.z, _150.w, _145._m0);
    float _162 = float(sparseTexelsResidentARB(int(_155._m4)));
    uint _219;
    vec4 _220;
    _219 = sparseTextureARB(samplerCube(_23, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), _220, 0.0);
    SparseTexel _167 = SparseTexel(_219, _220);
    vec4 _170 = _167._m1;
    _71 _175 = _71(_170.x, _170.y, _170.z, _170.w, _167._m0);
    float _182 = float(sparseTexelsResidentARB(int(_175._m4)));
    uint _221;
    vec4 _222;
    _221 = sparseTextureARB(samplerCubeArray(_26, _29), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), _222, 0.0);
    SparseTexel _187 = SparseTexel(_221, _222);
    vec4 _190 = _187._m1;
    _71 _195 = _71(_190.x, _190.y, _190.z, _190.w, _187._m0);
    float _196 = _195._m0;
    float _201 = float(sparseTexelsResidentARB(int(_195._m4)));
    SV_Target.x = ((((((((((((_78 + _72._m0) + _93) + _98) + _113._m0) + _120) + _135) + _140) + _155._m0) + _162) + _175._m0) + _182) + _196) + _201;
    SV_Target.y = ((((((((((((_78 + _72._m1) + _93) + _98) + _113._m1) + _120) + _135) + _140) + _155._m1) + _162) + _175._m1) + _182) + _196) + _201;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 209
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpCapability Sampled1D
OpCapability SampledCubeArray
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %32 %35
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %32 "TEXCOORD"
OpName %35 "SV_Target"
OpName %63 "SparseTexel"
OpName %71 ""
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
%62 = OpConstant %5 0
%63 = OpTypeStruct %46 %30
%71 = OpTypeStruct %5 %5 %5 %5 %46
%76 = OpTypeBool
%79 = OpConstant %5 1
%82 = OpTypeSampledImage %9
%101 = OpTypeSampledImage %12
%105 = OpTypeVector %60 2
%106 = OpConstantComposite %105 %61 %61
%123 = OpTypeSampledImage %15
%126 = OpTypeVector %5 3
%143 = OpTypeSampledImage %18
%147 = OpTypeVector %60 3
%148 = OpConstantComposite %147 %61 %61 %61
%165 = OpTypeSampledImage %21
%185 = OpTypeSampledImage %24
%204 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %207
%207 = OpLabel
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
%64 = OpImageSparseSampleImplicitLod %63 %59 %48 Bias|ConstOffset %62 %61
%65 = OpCompositeExtract %46 %64 0
%66 = OpCompositeExtract %30 %64 1
%67 = OpCompositeExtract %5 %66 0
%68 = OpCompositeExtract %5 %66 1
%69 = OpCompositeExtract %5 %66 2
%70 = OpCompositeExtract %5 %66 3
%72 = OpCompositeConstruct %71 %67 %68 %69 %70 %65
%73 = OpCompositeExtract %5 %72 0
%74 = OpCompositeExtract %5 %72 1
%75 = OpCompositeExtract %46 %72 4
%77 = OpImageSparseTexelsResident %76 %75
%78 = OpSelect %5 %77 %79 %62
%80 = OpFAdd %5 %78 %73
%81 = OpFAdd %5 %78 %74
%83 = OpSampledImage %82 %41 %43
%85 = OpCompositeConstruct %33 %48 %51
%84 = OpImageSparseSampleImplicitLod %63 %83 %85 Bias|ConstOffset %62 %61
%86 = OpCompositeExtract %46 %84 0
%87 = OpCompositeExtract %30 %84 1
%88 = OpCompositeExtract %5 %87 0
%89 = OpCompositeExtract %5 %87 1
%90 = OpCompositeExtract %5 %87 2
%91 = OpCompositeExtract %5 %87 3
%92 = OpCompositeConstruct %71 %88 %89 %90 %91 %86
%93 = OpCompositeExtract %5 %92 0
%94 = OpCompositeExtract %46 %92 4
%95 = OpImageSparseTexelsResident %76 %94
%96 = OpFAdd %5 %80 %93
%97 = OpFAdd %5 %81 %93
%98 = OpSelect %5 %95 %79 %62
%99 = OpFAdd %5 %96 %98
%100 = OpFAdd %5 %97 %98
%102 = OpSampledImage %101 %40 %43
%104 = OpCompositeConstruct %33 %48 %51
%103 = OpImageSparseSampleImplicitLod %63 %102 %104 Bias|ConstOffset %62 %106
%107 = OpCompositeExtract %46 %103 0
%108 = OpCompositeExtract %30 %103 1
%109 = OpCompositeExtract %5 %108 0
%110 = OpCompositeExtract %5 %108 1
%111 = OpCompositeExtract %5 %108 2
%112 = OpCompositeExtract %5 %108 3
%113 = OpCompositeConstruct %71 %109 %110 %111 %112 %107
%114 = OpCompositeExtract %5 %113 0
%115 = OpCompositeExtract %5 %113 1
%116 = OpCompositeExtract %46 %113 4
%117 = OpImageSparseTexelsResident %76 %116
%118 = OpFAdd %5 %99 %114
%119 = OpFAdd %5 %100 %115
%120 = OpSelect %5 %117 %79 %62
%121 = OpFAdd %5 %118 %120
%122 = OpFAdd %5 %119 %120
%124 = OpSampledImage %123 %39 %43
%127 = OpCompositeConstruct %126 %48 %51 %54
%125 = OpImageSparseSampleImplicitLod %63 %124 %127 Bias|ConstOffset %62 %106
%128 = OpCompositeExtract %46 %125 0
%129 = OpCompositeExtract %30 %125 1
%130 = OpCompositeExtract %5 %129 0
%131 = OpCompositeExtract %5 %129 1
%132 = OpCompositeExtract %5 %129 2
%133 = OpCompositeExtract %5 %129 3
%134 = OpCompositeConstruct %71 %130 %131 %132 %133 %128
%135 = OpCompositeExtract %5 %134 0
%136 = OpCompositeExtract %46 %134 4
%137 = OpImageSparseTexelsResident %76 %136
%138 = OpFAdd %5 %121 %135
%139 = OpFAdd %5 %122 %135
%140 = OpSelect %5 %137 %79 %62
%141 = OpFAdd %5 %138 %140
%142 = OpFAdd %5 %139 %140
%144 = OpSampledImage %143 %38 %43
%146 = OpCompositeConstruct %126 %48 %51 %54
%145 = OpImageSparseSampleImplicitLod %63 %144 %146 Bias|ConstOffset %62 %148
%149 = OpCompositeExtract %46 %145 0
%150 = OpCompositeExtract %30 %145 1
%151 = OpCompositeExtract %5 %150 0
%152 = OpCompositeExtract %5 %150 1
%153 = OpCompositeExtract %5 %150 2
%154 = OpCompositeExtract %5 %150 3
%155 = OpCompositeConstruct %71 %151 %152 %153 %154 %149
%156 = OpCompositeExtract %5 %155 0
%157 = OpCompositeExtract %5 %155 1
%158 = OpCompositeExtract %46 %155 4
%159 = OpImageSparseTexelsResident %76 %158
%160 = OpFAdd %5 %141 %156
%161 = OpFAdd %5 %142 %157
%162 = OpSelect %5 %159 %79 %62
%163 = OpFAdd %5 %160 %162
%164 = OpFAdd %5 %161 %162
%166 = OpSampledImage %165 %37 %43
%168 = OpCompositeConstruct %126 %48 %51 %54
%167 = OpImageSparseSampleImplicitLod %63 %166 %168 Bias %62
%169 = OpCompositeExtract %46 %167 0
%170 = OpCompositeExtract %30 %167 1
%171 = OpCompositeExtract %5 %170 0
%172 = OpCompositeExtract %5 %170 1
%173 = OpCompositeExtract %5 %170 2
%174 = OpCompositeExtract %5 %170 3
%175 = OpCompositeConstruct %71 %171 %172 %173 %174 %169
%176 = OpCompositeExtract %5 %175 0
%177 = OpCompositeExtract %5 %175 1
%178 = OpCompositeExtract %46 %175 4
%179 = OpImageSparseTexelsResident %76 %178
%180 = OpFAdd %5 %163 %176
%181 = OpFAdd %5 %164 %177
%182 = OpSelect %5 %179 %79 %62
%183 = OpFAdd %5 %180 %182
%184 = OpFAdd %5 %181 %182
%186 = OpSampledImage %185 %36 %43
%188 = OpCompositeConstruct %30 %48 %51 %54 %57
%187 = OpImageSparseSampleImplicitLod %63 %186 %188 Bias %62
%189 = OpCompositeExtract %46 %187 0
%190 = OpCompositeExtract %30 %187 1
%191 = OpCompositeExtract %5 %190 0
%192 = OpCompositeExtract %5 %190 1
%193 = OpCompositeExtract %5 %190 2
%194 = OpCompositeExtract %5 %190 3
%195 = OpCompositeConstruct %71 %191 %192 %193 %194 %189
%196 = OpCompositeExtract %5 %195 0
%197 = OpCompositeExtract %46 %195 4
%198 = OpImageSparseTexelsResident %76 %197
%199 = OpFAdd %5 %183 %196
%200 = OpFAdd %5 %184 %196
%201 = OpSelect %5 %198 %79 %62
%202 = OpFAdd %5 %199 %201
%203 = OpFAdd %5 %200 %201
%205 = OpAccessChain %204 %35 %47
OpStore %205 %202
%206 = OpAccessChain %204 %35 %50
OpStore %206 %203
OpReturn
OpFunctionEnd
#endif
