#version 460
#extension GL_ARB_sparse_texture2 : require
#extension GL_EXT_samplerless_texture_functions : require

struct SparseTexel
{
    uint _m0;
    vec4 _m1;
};

struct _85
{
    float _m0;
    float _m1;
    float _m2;
    float _m3;
    uint _m4;
};

layout(set = 0, binding = 1) uniform texture1D _8;
layout(set = 0, binding = 2) uniform texture1DArray _11;
layout(set = 0, binding = 3) uniform texture2D _14;
layout(set = 0, binding = 4) uniform texture2DArray _17;
layout(set = 0, binding = 5) uniform texture3D _20;
layout(set = 0, binding = 6) uniform texture2DMS _23;
layout(set = 0, binding = 7) uniform texture2DMSArray _26;
layout(set = 0, binding = 1, r32f) uniform readonly image1D _29;
layout(set = 0, binding = 2, r32f) uniform readonly image1DArray _32;
layout(set = 0, binding = 3, r32f) uniform readonly image2D _35;
layout(set = 0, binding = 4, r32f) uniform readonly image2DArray _38;
layout(set = 0, binding = 5, r32f) uniform readonly image3D _41;

layout(location = 0) flat in uvec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    uint _305;
    vec4 _306;
    _305 = sparseTexelFetchOffsetARB(_8, int(TEXCOORD.x), int(TEXCOORD.y), 0, _306);
    SparseTexel _78 = SparseTexel(_305, _306);
    vec4 _80 = _78._m1;
    _85 _86 = _85(_80.x, _80.y, _80.z, _80.w, _78._m0);
    float _92 = float(sparseTexelsResidentARB(int(_86._m4)));
    uint _307;
    vec4 _308;
    _307 = sparseTexelFetchOffsetARB(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z), 0, _308);
    SparseTexel _97 = SparseTexel(_307, _308);
    vec4 _101 = _97._m1;
    _85 _106 = _85(_101.x, _101.y, _101.z, _101.w, _97._m0);
    float _113 = float(sparseTexelsResidentARB(int(_106._m4)));
    uint _309;
    vec4 _310;
    _309 = sparseTexelFetchOffsetARB(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z), ivec2(0), _310);
    SparseTexel _116 = SparseTexel(_309, _310);
    vec4 _121 = _116._m1;
    _85 _126 = _85(_121.x, _121.y, _121.z, _121.w, _116._m0);
    float _133 = float(sparseTexelsResidentARB(int(_126._m4)));
    uint _311;
    vec4 _312;
    _311 = sparseTexelFetchOffsetARB(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w), ivec2(0), _312);
    SparseTexel _136 = SparseTexel(_311, _312);
    vec4 _140 = _136._m1;
    _85 _145 = _85(_140.x, _140.y, _140.z, _140.w, _136._m0);
    float _152 = float(sparseTexelsResidentARB(int(_145._m4)));
    uint _313;
    vec4 _314;
    _313 = sparseTexelFetchOffsetARB(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w), ivec3(0), _314);
    SparseTexel _155 = SparseTexel(_313, _314);
    vec4 _160 = _155._m1;
    _85 _165 = _85(_160.x, _160.y, _160.z, _160.w, _155._m0);
    float _172 = float(sparseTexelsResidentARB(int(_165._m4)));
    uint _315;
    vec4 _316;
    _315 = sparseTexelFetchOffsetARB(_23, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), ivec2(0), TEXCOORD.z, _316);
    SparseTexel _175 = SparseTexel(_315, _316);
    vec4 _178 = _175._m1;
    _85 _183 = _85(_178.x, _178.y, _178.z, _178.w, _175._m0);
    float _190 = float(sparseTexelsResidentARB(int(_183._m4)));
    uint _317;
    vec4 _318;
    _317 = sparseTexelFetchOffsetARB(_26, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), ivec2(0), TEXCOORD.w, _318);
    SparseTexel _193 = SparseTexel(_317, _318);
    vec4 _196 = _193._m1;
    _85 _201 = _85(_196.x, _196.y, _196.z, _196.w, _193._m0);
    float _208 = float(sparseTexelsResidentARB(int(_201._m4)));
    uint _319;
    vec4 _320;
    _319 = sparseImageLoadARB(_29, int(TEXCOORD.x), _320);
    SparseTexel _211 = SparseTexel(_319, _320);
    vec4 _213 = _211._m1;
    _85 _218 = _85(_213.x, _213.y, _213.z, _213.w, _211._m0);
    float _225 = float(sparseTexelsResidentARB(int(_218._m4)));
    uint _321;
    vec4 _322;
    _321 = sparseImageLoadARB(_32, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), _322);
    SparseTexel _228 = SparseTexel(_321, _322);
    vec4 _231 = _228._m1;
    _85 _236 = _85(_231.x, _231.y, _231.z, _231.w, _228._m0);
    float _243 = float(sparseTexelsResidentARB(int(_236._m4)));
    uint _323;
    vec4 _324;
    _323 = sparseImageLoadARB(_35, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), _324);
    SparseTexel _246 = SparseTexel(_323, _324);
    vec4 _249 = _246._m1;
    _85 _254 = _85(_249.x, _249.y, _249.z, _249.w, _246._m0);
    float _261 = float(sparseTexelsResidentARB(int(_254._m4)));
    uint _325;
    vec4 _326;
    _325 = sparseImageLoadARB(_38, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), _326);
    SparseTexel _264 = SparseTexel(_325, _326);
    vec4 _267 = _264._m1;
    _85 _272 = _85(_267.x, _267.y, _267.z, _267.w, _264._m0);
    float _279 = float(sparseTexelsResidentARB(int(_272._m4)));
    uint _327;
    vec4 _328;
    _327 = sparseImageLoadARB(_41, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), _328);
    SparseTexel _282 = SparseTexel(_327, _328);
    vec4 _285 = _282._m1;
    _85 _290 = _85(_285.x, _285.y, _285.z, _285.w, _282._m0);
    float _297 = float(sparseTexelsResidentARB(int(_290._m4)));
    SV_Target.x = ((((((((((((((((((((((_92 + _86._m0) + _106._m0) + _113) + _126._m0) + _133) + _145._m0) + _152) + _165._m0) + _172) + _183._m0) + _190) + _201._m0) + _208) + _218._m0) + _225) + _236._m0) + _243) + _254._m0) + _261) + _272._m0) + _279) + _290._m0) + _297;
    SV_Target.y = ((((((((((((((((((((((_92 + _86._m1) + _106._m1) + _113) + _126._m1) + _133) + _145._m1) + _152) + _165._m1) + _172) + _183._m1) + _190) + _201._m1) + _208) + _218._m1) + _225) + _236._m1) + _243) + _254._m1) + _261) + _272._m1) + _279) + _290._m1) + _297;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 305
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpCapability Sampled1D
OpCapability Image1D
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %45 %48
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %45 "TEXCOORD"
OpName %48 "SV_Target"
OpName %77 "SparseTexel"
OpName %85 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 1
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 2
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 3
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 4
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 5
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 6
OpDecorate %26 DescriptorSet 0
OpDecorate %26 Binding 7
OpDecorate %29 DescriptorSet 0
OpDecorate %29 Binding 1
OpDecorate %29 NonWritable
OpDecorate %32 DescriptorSet 0
OpDecorate %32 Binding 2
OpDecorate %32 NonWritable
OpDecorate %35 DescriptorSet 0
OpDecorate %35 Binding 3
OpDecorate %35 NonWritable
OpDecorate %38 DescriptorSet 0
OpDecorate %38 Binding 4
OpDecorate %38 NonWritable
OpDecorate %41 DescriptorSet 0
OpDecorate %41 Binding 5
OpDecorate %41 NonWritable
OpDecorate %45 Flat
OpDecorate %45 Location 0
OpDecorate %48 Location 0
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
%21 = OpTypeImage %5 2D 0 0 1 1 Unknown
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeImage %5 2D 0 1 1 1 Unknown
%25 = OpTypePointer UniformConstant %24
%26 = OpVariable %25 UniformConstant
%27 = OpTypeImage %5 1D 0 0 0 2 R32f
%28 = OpTypePointer UniformConstant %27
%29 = OpVariable %28 UniformConstant
%30 = OpTypeImage %5 1D 0 1 0 2 R32f
%31 = OpTypePointer UniformConstant %30
%32 = OpVariable %31 UniformConstant
%33 = OpTypeImage %5 2D 0 0 0 2 R32f
%34 = OpTypePointer UniformConstant %33
%35 = OpVariable %34 UniformConstant
%36 = OpTypeImage %5 2D 0 1 0 2 R32f
%37 = OpTypePointer UniformConstant %36
%38 = OpVariable %37 UniformConstant
%39 = OpTypeImage %5 3D 0 0 0 2 R32f
%40 = OpTypePointer UniformConstant %39
%41 = OpVariable %40 UniformConstant
%42 = OpTypeInt 32 0
%43 = OpTypeVector %42 4
%44 = OpTypePointer Input %43
%45 = OpVariable %44 Input
%46 = OpTypeVector %5 2
%47 = OpTypePointer Output %46
%48 = OpVariable %47 Output
%61 = OpTypePointer Input %42
%63 = OpConstant %42 0
%66 = OpConstant %42 1
%69 = OpConstant %42 2
%72 = OpConstant %42 3
%74 = OpTypeInt 32 1
%75 = OpConstant %74 0
%76 = OpTypeVector %5 4
%77 = OpTypeStruct %42 %76
%85 = OpTypeStruct %5 %5 %5 %5 %42
%90 = OpTypeBool
%93 = OpConstant %5 1
%94 = OpConstant %5 0
%98 = OpTypeVector %42 2
%118 = OpTypeVector %74 2
%119 = OpConstantComposite %118 %75 %75
%137 = OpTypeVector %42 3
%157 = OpTypeVector %74 3
%158 = OpConstantComposite %157 %75 %75 %75
%300 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %303
%303 = OpLabel
%49 = OpLoad %39 %41
%50 = OpLoad %36 %38
%51 = OpLoad %33 %35
%52 = OpLoad %30 %32
%53 = OpLoad %27 %29
%54 = OpLoad %24 %26
%55 = OpLoad %21 %23
%56 = OpLoad %18 %20
%57 = OpLoad %15 %17
%58 = OpLoad %12 %14
%59 = OpLoad %9 %11
%60 = OpLoad %6 %8
%62 = OpAccessChain %61 %45 %63
%64 = OpLoad %42 %62
%65 = OpAccessChain %61 %45 %66
%67 = OpLoad %42 %65
%68 = OpAccessChain %61 %45 %69
%70 = OpLoad %42 %68
%71 = OpAccessChain %61 %45 %72
%73 = OpLoad %42 %71
%78 = OpImageSparseFetch %77 %60 %64 Lod|ConstOffset %67 %75
%79 = OpCompositeExtract %42 %78 0
%80 = OpCompositeExtract %76 %78 1
%81 = OpCompositeExtract %5 %80 0
%82 = OpCompositeExtract %5 %80 1
%83 = OpCompositeExtract %5 %80 2
%84 = OpCompositeExtract %5 %80 3
%86 = OpCompositeConstruct %85 %81 %82 %83 %84 %79
%87 = OpCompositeExtract %5 %86 0
%88 = OpCompositeExtract %5 %86 1
%89 = OpCompositeExtract %42 %86 4
%91 = OpImageSparseTexelsResident %90 %89
%92 = OpSelect %5 %91 %93 %94
%95 = OpFAdd %5 %92 %87
%96 = OpFAdd %5 %92 %88
%99 = OpCompositeConstruct %98 %64 %67
%97 = OpImageSparseFetch %77 %59 %99 Lod|ConstOffset %70 %75
%100 = OpCompositeExtract %42 %97 0
%101 = OpCompositeExtract %76 %97 1
%102 = OpCompositeExtract %5 %101 0
%103 = OpCompositeExtract %5 %101 1
%104 = OpCompositeExtract %5 %101 2
%105 = OpCompositeExtract %5 %101 3
%106 = OpCompositeConstruct %85 %102 %103 %104 %105 %100
%107 = OpCompositeExtract %5 %106 0
%108 = OpCompositeExtract %5 %106 1
%109 = OpCompositeExtract %42 %106 4
%110 = OpImageSparseTexelsResident %90 %109
%111 = OpFAdd %5 %95 %107
%112 = OpFAdd %5 %96 %108
%113 = OpSelect %5 %110 %93 %94
%114 = OpFAdd %5 %111 %113
%115 = OpFAdd %5 %112 %113
%117 = OpCompositeConstruct %98 %64 %67
%116 = OpImageSparseFetch %77 %58 %117 Lod|ConstOffset %70 %119
%120 = OpCompositeExtract %42 %116 0
%121 = OpCompositeExtract %76 %116 1
%122 = OpCompositeExtract %5 %121 0
%123 = OpCompositeExtract %5 %121 1
%124 = OpCompositeExtract %5 %121 2
%125 = OpCompositeExtract %5 %121 3
%126 = OpCompositeConstruct %85 %122 %123 %124 %125 %120
%127 = OpCompositeExtract %5 %126 0
%128 = OpCompositeExtract %5 %126 1
%129 = OpCompositeExtract %42 %126 4
%130 = OpImageSparseTexelsResident %90 %129
%131 = OpFAdd %5 %114 %127
%132 = OpFAdd %5 %115 %128
%133 = OpSelect %5 %130 %93 %94
%134 = OpFAdd %5 %131 %133
%135 = OpFAdd %5 %132 %133
%138 = OpCompositeConstruct %137 %64 %67 %70
%136 = OpImageSparseFetch %77 %57 %138 Lod|ConstOffset %73 %119
%139 = OpCompositeExtract %42 %136 0
%140 = OpCompositeExtract %76 %136 1
%141 = OpCompositeExtract %5 %140 0
%142 = OpCompositeExtract %5 %140 1
%143 = OpCompositeExtract %5 %140 2
%144 = OpCompositeExtract %5 %140 3
%145 = OpCompositeConstruct %85 %141 %142 %143 %144 %139
%146 = OpCompositeExtract %5 %145 0
%147 = OpCompositeExtract %5 %145 1
%148 = OpCompositeExtract %42 %145 4
%149 = OpImageSparseTexelsResident %90 %148
%150 = OpFAdd %5 %134 %146
%151 = OpFAdd %5 %135 %147
%152 = OpSelect %5 %149 %93 %94
%153 = OpFAdd %5 %150 %152
%154 = OpFAdd %5 %151 %152
%156 = OpCompositeConstruct %137 %64 %67 %70
%155 = OpImageSparseFetch %77 %56 %156 Lod|ConstOffset %73 %158
%159 = OpCompositeExtract %42 %155 0
%160 = OpCompositeExtract %76 %155 1
%161 = OpCompositeExtract %5 %160 0
%162 = OpCompositeExtract %5 %160 1
%163 = OpCompositeExtract %5 %160 2
%164 = OpCompositeExtract %5 %160 3
%165 = OpCompositeConstruct %85 %161 %162 %163 %164 %159
%166 = OpCompositeExtract %5 %165 0
%167 = OpCompositeExtract %5 %165 1
%168 = OpCompositeExtract %42 %165 4
%169 = OpImageSparseTexelsResident %90 %168
%170 = OpFAdd %5 %153 %166
%171 = OpFAdd %5 %154 %167
%172 = OpSelect %5 %169 %93 %94
%173 = OpFAdd %5 %170 %172
%174 = OpFAdd %5 %171 %172
%176 = OpCompositeConstruct %98 %64 %67
%175 = OpImageSparseFetch %77 %55 %176 ConstOffset|Sample %119 %70
%177 = OpCompositeExtract %42 %175 0
%178 = OpCompositeExtract %76 %175 1
%179 = OpCompositeExtract %5 %178 0
%180 = OpCompositeExtract %5 %178 1
%181 = OpCompositeExtract %5 %178 2
%182 = OpCompositeExtract %5 %178 3
%183 = OpCompositeConstruct %85 %179 %180 %181 %182 %177
%184 = OpCompositeExtract %5 %183 0
%185 = OpCompositeExtract %5 %183 1
%186 = OpCompositeExtract %42 %183 4
%187 = OpImageSparseTexelsResident %90 %186
%188 = OpFAdd %5 %173 %184
%189 = OpFAdd %5 %174 %185
%190 = OpSelect %5 %187 %93 %94
%191 = OpFAdd %5 %188 %190
%192 = OpFAdd %5 %189 %190
%194 = OpCompositeConstruct %137 %64 %67 %70
%193 = OpImageSparseFetch %77 %54 %194 ConstOffset|Sample %119 %73
%195 = OpCompositeExtract %42 %193 0
%196 = OpCompositeExtract %76 %193 1
%197 = OpCompositeExtract %5 %196 0
%198 = OpCompositeExtract %5 %196 1
%199 = OpCompositeExtract %5 %196 2
%200 = OpCompositeExtract %5 %196 3
%201 = OpCompositeConstruct %85 %197 %198 %199 %200 %195
%202 = OpCompositeExtract %5 %201 0
%203 = OpCompositeExtract %5 %201 1
%204 = OpCompositeExtract %42 %201 4
%205 = OpImageSparseTexelsResident %90 %204
%206 = OpFAdd %5 %191 %202
%207 = OpFAdd %5 %192 %203
%208 = OpSelect %5 %205 %93 %94
%209 = OpFAdd %5 %206 %208
%210 = OpFAdd %5 %207 %208
%211 = OpImageSparseRead %77 %53 %64 None
%212 = OpCompositeExtract %42 %211 0
%213 = OpCompositeExtract %76 %211 1
%214 = OpCompositeExtract %5 %213 0
%215 = OpCompositeExtract %5 %213 1
%216 = OpCompositeExtract %5 %213 2
%217 = OpCompositeExtract %5 %213 3
%218 = OpCompositeConstruct %85 %214 %215 %216 %217 %212
%219 = OpCompositeExtract %5 %218 0
%220 = OpCompositeExtract %5 %218 1
%221 = OpCompositeExtract %42 %218 4
%222 = OpImageSparseTexelsResident %90 %221
%223 = OpFAdd %5 %209 %219
%224 = OpFAdd %5 %210 %220
%225 = OpSelect %5 %222 %93 %94
%226 = OpFAdd %5 %223 %225
%227 = OpFAdd %5 %224 %225
%229 = OpCompositeConstruct %98 %64 %67
%228 = OpImageSparseRead %77 %52 %229 None
%230 = OpCompositeExtract %42 %228 0
%231 = OpCompositeExtract %76 %228 1
%232 = OpCompositeExtract %5 %231 0
%233 = OpCompositeExtract %5 %231 1
%234 = OpCompositeExtract %5 %231 2
%235 = OpCompositeExtract %5 %231 3
%236 = OpCompositeConstruct %85 %232 %233 %234 %235 %230
%237 = OpCompositeExtract %5 %236 0
%238 = OpCompositeExtract %5 %236 1
%239 = OpCompositeExtract %42 %236 4
%240 = OpImageSparseTexelsResident %90 %239
%241 = OpFAdd %5 %226 %237
%242 = OpFAdd %5 %227 %238
%243 = OpSelect %5 %240 %93 %94
%244 = OpFAdd %5 %241 %243
%245 = OpFAdd %5 %242 %243
%247 = OpCompositeConstruct %98 %64 %67
%246 = OpImageSparseRead %77 %51 %247 None
%248 = OpCompositeExtract %42 %246 0
%249 = OpCompositeExtract %76 %246 1
%250 = OpCompositeExtract %5 %249 0
%251 = OpCompositeExtract %5 %249 1
%252 = OpCompositeExtract %5 %249 2
%253 = OpCompositeExtract %5 %249 3
%254 = OpCompositeConstruct %85 %250 %251 %252 %253 %248
%255 = OpCompositeExtract %5 %254 0
%256 = OpCompositeExtract %5 %254 1
%257 = OpCompositeExtract %42 %254 4
%258 = OpImageSparseTexelsResident %90 %257
%259 = OpFAdd %5 %244 %255
%260 = OpFAdd %5 %245 %256
%261 = OpSelect %5 %258 %93 %94
%262 = OpFAdd %5 %259 %261
%263 = OpFAdd %5 %260 %261
%265 = OpCompositeConstruct %137 %64 %67 %70
%264 = OpImageSparseRead %77 %50 %265 None
%266 = OpCompositeExtract %42 %264 0
%267 = OpCompositeExtract %76 %264 1
%268 = OpCompositeExtract %5 %267 0
%269 = OpCompositeExtract %5 %267 1
%270 = OpCompositeExtract %5 %267 2
%271 = OpCompositeExtract %5 %267 3
%272 = OpCompositeConstruct %85 %268 %269 %270 %271 %266
%273 = OpCompositeExtract %5 %272 0
%274 = OpCompositeExtract %5 %272 1
%275 = OpCompositeExtract %42 %272 4
%276 = OpImageSparseTexelsResident %90 %275
%277 = OpFAdd %5 %262 %273
%278 = OpFAdd %5 %263 %274
%279 = OpSelect %5 %276 %93 %94
%280 = OpFAdd %5 %277 %279
%281 = OpFAdd %5 %278 %279
%283 = OpCompositeConstruct %137 %64 %67 %70
%282 = OpImageSparseRead %77 %49 %283 None
%284 = OpCompositeExtract %42 %282 0
%285 = OpCompositeExtract %76 %282 1
%286 = OpCompositeExtract %5 %285 0
%287 = OpCompositeExtract %5 %285 1
%288 = OpCompositeExtract %5 %285 2
%289 = OpCompositeExtract %5 %285 3
%290 = OpCompositeConstruct %85 %286 %287 %288 %289 %284
%291 = OpCompositeExtract %5 %290 0
%292 = OpCompositeExtract %5 %290 1
%293 = OpCompositeExtract %42 %290 4
%294 = OpImageSparseTexelsResident %90 %293
%295 = OpFAdd %5 %280 %291
%296 = OpFAdd %5 %281 %292
%297 = OpSelect %5 %294 %93 %94
%298 = OpFAdd %5 %295 %297
%299 = OpFAdd %5 %296 %297
%301 = OpAccessChain %300 %48 %63
OpStore %301 %298
%302 = OpAccessChain %300 %48 %66
OpStore %302 %299
OpReturn
OpFunctionEnd
#endif
