#version 460
#extension GL_ARB_sparse_texture2 : require
#extension GL_EXT_samplerless_texture_functions : require

struct SparseTexel
{
    uint _m0;
    vec4 _m1;
};

struct _83
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
    uint _299;
    vec4 _300;
    _299 = sparseTexelFetchARB(_8, int(TEXCOORD.x), int(TEXCOORD.y), _300);
    SparseTexel _76 = SparseTexel(_299, _300);
    vec4 _78 = _76._m1;
    _83 _84 = _83(_78.x, _78.y, _78.z, _78.w, _76._m0);
    float _90 = float(sparseTexelsResidentARB(int(_84._m4)));
    uint _301;
    vec4 _302;
    _301 = sparseTexelFetchARB(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z), _302);
    SparseTexel _95 = SparseTexel(_301, _302);
    vec4 _99 = _95._m1;
    _83 _104 = _83(_99.x, _99.y, _99.z, _99.w, _95._m0);
    float _111 = float(sparseTexelsResidentARB(int(_104._m4)));
    uint _303;
    vec4 _304;
    _303 = sparseTexelFetchARB(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z), _304);
    SparseTexel _114 = SparseTexel(_303, _304);
    vec4 _117 = _114._m1;
    _83 _122 = _83(_117.x, _117.y, _117.z, _117.w, _114._m0);
    float _129 = float(sparseTexelsResidentARB(int(_122._m4)));
    uint _305;
    vec4 _306;
    _305 = sparseTexelFetchARB(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w), _306);
    SparseTexel _132 = SparseTexel(_305, _306);
    vec4 _136 = _132._m1;
    _83 _141 = _83(_136.x, _136.y, _136.z, _136.w, _132._m0);
    float _148 = float(sparseTexelsResidentARB(int(_141._m4)));
    uint _307;
    vec4 _308;
    _307 = sparseTexelFetchARB(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w), _308);
    SparseTexel _151 = SparseTexel(_307, _308);
    vec4 _154 = _151._m1;
    _83 _159 = _83(_154.x, _154.y, _154.z, _154.w, _151._m0);
    float _166 = float(sparseTexelsResidentARB(int(_159._m4)));
    uint _309;
    vec4 _310;
    _309 = sparseTexelFetchARB(_23, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z), _310);
    SparseTexel _169 = SparseTexel(_309, _310);
    vec4 _172 = _169._m1;
    _83 _177 = _83(_172.x, _172.y, _172.z, _172.w, _169._m0);
    float _184 = float(sparseTexelsResidentARB(int(_177._m4)));
    uint _311;
    vec4 _312;
    _311 = sparseTexelFetchARB(_26, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w), _312);
    SparseTexel _187 = SparseTexel(_311, _312);
    vec4 _190 = _187._m1;
    _83 _195 = _83(_190.x, _190.y, _190.z, _190.w, _187._m0);
    float _202 = float(sparseTexelsResidentARB(int(_195._m4)));
    uint _313;
    vec4 _314;
    _313 = sparseImageLoadARB(_29, int(TEXCOORD.x), _314);
    SparseTexel _205 = SparseTexel(_313, _314);
    vec4 _207 = _205._m1;
    _83 _212 = _83(_207.x, _207.y, _207.z, _207.w, _205._m0);
    float _219 = float(sparseTexelsResidentARB(int(_212._m4)));
    uint _315;
    vec4 _316;
    _315 = sparseImageLoadARB(_32, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), _316);
    SparseTexel _222 = SparseTexel(_315, _316);
    vec4 _225 = _222._m1;
    _83 _230 = _83(_225.x, _225.y, _225.z, _225.w, _222._m0);
    float _237 = float(sparseTexelsResidentARB(int(_230._m4)));
    uint _317;
    vec4 _318;
    _317 = sparseImageLoadARB(_35, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), _318);
    SparseTexel _240 = SparseTexel(_317, _318);
    vec4 _243 = _240._m1;
    _83 _248 = _83(_243.x, _243.y, _243.z, _243.w, _240._m0);
    float _255 = float(sparseTexelsResidentARB(int(_248._m4)));
    uint _319;
    vec4 _320;
    _319 = sparseImageLoadARB(_38, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), _320);
    SparseTexel _258 = SparseTexel(_319, _320);
    vec4 _261 = _258._m1;
    _83 _266 = _83(_261.x, _261.y, _261.z, _261.w, _258._m0);
    float _273 = float(sparseTexelsResidentARB(int(_266._m4)));
    uint _321;
    vec4 _322;
    _321 = sparseImageLoadARB(_41, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), _322);
    SparseTexel _276 = SparseTexel(_321, _322);
    vec4 _279 = _276._m1;
    _83 _284 = _83(_279.x, _279.y, _279.z, _279.w, _276._m0);
    float _291 = float(sparseTexelsResidentARB(int(_284._m4)));
    SV_Target.x = ((((((((((((((((((((((_90 + _84._m0) + _104._m0) + _111) + _122._m0) + _129) + _141._m0) + _148) + _159._m0) + _166) + _177._m0) + _184) + _195._m0) + _202) + _212._m0) + _219) + _230._m0) + _237) + _248._m0) + _255) + _266._m0) + _273) + _284._m0) + _291;
    SV_Target.y = ((((((((((((((((((((((_90 + _84._m1) + _104._m1) + _111) + _122._m1) + _129) + _141._m1) + _148) + _159._m1) + _166) + _177._m1) + _184) + _195._m1) + _202) + _212._m1) + _219) + _230._m1) + _237) + _248._m1) + _255) + _266._m1) + _273) + _284._m1) + _291;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 299
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
OpName %75 "SparseTexel"
OpName %83 ""
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
%74 = OpTypeVector %5 4
%75 = OpTypeStruct %42 %74
%83 = OpTypeStruct %5 %5 %5 %5 %42
%88 = OpTypeBool
%91 = OpConstant %5 1
%92 = OpConstant %5 0
%96 = OpTypeVector %42 2
%133 = OpTypeVector %42 3
%294 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %297
%297 = OpLabel
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
%76 = OpImageSparseFetch %75 %60 %64 Lod %67
%77 = OpCompositeExtract %42 %76 0
%78 = OpCompositeExtract %74 %76 1
%79 = OpCompositeExtract %5 %78 0
%80 = OpCompositeExtract %5 %78 1
%81 = OpCompositeExtract %5 %78 2
%82 = OpCompositeExtract %5 %78 3
%84 = OpCompositeConstruct %83 %79 %80 %81 %82 %77
%85 = OpCompositeExtract %5 %84 0
%86 = OpCompositeExtract %5 %84 1
%87 = OpCompositeExtract %42 %84 4
%89 = OpImageSparseTexelsResident %88 %87
%90 = OpSelect %5 %89 %91 %92
%93 = OpFAdd %5 %90 %85
%94 = OpFAdd %5 %90 %86
%97 = OpCompositeConstruct %96 %64 %67
%95 = OpImageSparseFetch %75 %59 %97 Lod %70
%98 = OpCompositeExtract %42 %95 0
%99 = OpCompositeExtract %74 %95 1
%100 = OpCompositeExtract %5 %99 0
%101 = OpCompositeExtract %5 %99 1
%102 = OpCompositeExtract %5 %99 2
%103 = OpCompositeExtract %5 %99 3
%104 = OpCompositeConstruct %83 %100 %101 %102 %103 %98
%105 = OpCompositeExtract %5 %104 0
%106 = OpCompositeExtract %5 %104 1
%107 = OpCompositeExtract %42 %104 4
%108 = OpImageSparseTexelsResident %88 %107
%109 = OpFAdd %5 %93 %105
%110 = OpFAdd %5 %94 %106
%111 = OpSelect %5 %108 %91 %92
%112 = OpFAdd %5 %109 %111
%113 = OpFAdd %5 %110 %111
%115 = OpCompositeConstruct %96 %64 %67
%114 = OpImageSparseFetch %75 %58 %115 Lod %70
%116 = OpCompositeExtract %42 %114 0
%117 = OpCompositeExtract %74 %114 1
%118 = OpCompositeExtract %5 %117 0
%119 = OpCompositeExtract %5 %117 1
%120 = OpCompositeExtract %5 %117 2
%121 = OpCompositeExtract %5 %117 3
%122 = OpCompositeConstruct %83 %118 %119 %120 %121 %116
%123 = OpCompositeExtract %5 %122 0
%124 = OpCompositeExtract %5 %122 1
%125 = OpCompositeExtract %42 %122 4
%126 = OpImageSparseTexelsResident %88 %125
%127 = OpFAdd %5 %112 %123
%128 = OpFAdd %5 %113 %124
%129 = OpSelect %5 %126 %91 %92
%130 = OpFAdd %5 %127 %129
%131 = OpFAdd %5 %128 %129
%134 = OpCompositeConstruct %133 %64 %67 %70
%132 = OpImageSparseFetch %75 %57 %134 Lod %73
%135 = OpCompositeExtract %42 %132 0
%136 = OpCompositeExtract %74 %132 1
%137 = OpCompositeExtract %5 %136 0
%138 = OpCompositeExtract %5 %136 1
%139 = OpCompositeExtract %5 %136 2
%140 = OpCompositeExtract %5 %136 3
%141 = OpCompositeConstruct %83 %137 %138 %139 %140 %135
%142 = OpCompositeExtract %5 %141 0
%143 = OpCompositeExtract %5 %141 1
%144 = OpCompositeExtract %42 %141 4
%145 = OpImageSparseTexelsResident %88 %144
%146 = OpFAdd %5 %130 %142
%147 = OpFAdd %5 %131 %143
%148 = OpSelect %5 %145 %91 %92
%149 = OpFAdd %5 %146 %148
%150 = OpFAdd %5 %147 %148
%152 = OpCompositeConstruct %133 %64 %67 %70
%151 = OpImageSparseFetch %75 %56 %152 Lod %73
%153 = OpCompositeExtract %42 %151 0
%154 = OpCompositeExtract %74 %151 1
%155 = OpCompositeExtract %5 %154 0
%156 = OpCompositeExtract %5 %154 1
%157 = OpCompositeExtract %5 %154 2
%158 = OpCompositeExtract %5 %154 3
%159 = OpCompositeConstruct %83 %155 %156 %157 %158 %153
%160 = OpCompositeExtract %5 %159 0
%161 = OpCompositeExtract %5 %159 1
%162 = OpCompositeExtract %42 %159 4
%163 = OpImageSparseTexelsResident %88 %162
%164 = OpFAdd %5 %149 %160
%165 = OpFAdd %5 %150 %161
%166 = OpSelect %5 %163 %91 %92
%167 = OpFAdd %5 %164 %166
%168 = OpFAdd %5 %165 %166
%170 = OpCompositeConstruct %96 %64 %67
%169 = OpImageSparseFetch %75 %55 %170 Sample %70
%171 = OpCompositeExtract %42 %169 0
%172 = OpCompositeExtract %74 %169 1
%173 = OpCompositeExtract %5 %172 0
%174 = OpCompositeExtract %5 %172 1
%175 = OpCompositeExtract %5 %172 2
%176 = OpCompositeExtract %5 %172 3
%177 = OpCompositeConstruct %83 %173 %174 %175 %176 %171
%178 = OpCompositeExtract %5 %177 0
%179 = OpCompositeExtract %5 %177 1
%180 = OpCompositeExtract %42 %177 4
%181 = OpImageSparseTexelsResident %88 %180
%182 = OpFAdd %5 %167 %178
%183 = OpFAdd %5 %168 %179
%184 = OpSelect %5 %181 %91 %92
%185 = OpFAdd %5 %182 %184
%186 = OpFAdd %5 %183 %184
%188 = OpCompositeConstruct %133 %64 %67 %70
%187 = OpImageSparseFetch %75 %54 %188 Sample %73
%189 = OpCompositeExtract %42 %187 0
%190 = OpCompositeExtract %74 %187 1
%191 = OpCompositeExtract %5 %190 0
%192 = OpCompositeExtract %5 %190 1
%193 = OpCompositeExtract %5 %190 2
%194 = OpCompositeExtract %5 %190 3
%195 = OpCompositeConstruct %83 %191 %192 %193 %194 %189
%196 = OpCompositeExtract %5 %195 0
%197 = OpCompositeExtract %5 %195 1
%198 = OpCompositeExtract %42 %195 4
%199 = OpImageSparseTexelsResident %88 %198
%200 = OpFAdd %5 %185 %196
%201 = OpFAdd %5 %186 %197
%202 = OpSelect %5 %199 %91 %92
%203 = OpFAdd %5 %200 %202
%204 = OpFAdd %5 %201 %202
%205 = OpImageSparseRead %75 %53 %64 None
%206 = OpCompositeExtract %42 %205 0
%207 = OpCompositeExtract %74 %205 1
%208 = OpCompositeExtract %5 %207 0
%209 = OpCompositeExtract %5 %207 1
%210 = OpCompositeExtract %5 %207 2
%211 = OpCompositeExtract %5 %207 3
%212 = OpCompositeConstruct %83 %208 %209 %210 %211 %206
%213 = OpCompositeExtract %5 %212 0
%214 = OpCompositeExtract %5 %212 1
%215 = OpCompositeExtract %42 %212 4
%216 = OpImageSparseTexelsResident %88 %215
%217 = OpFAdd %5 %203 %213
%218 = OpFAdd %5 %204 %214
%219 = OpSelect %5 %216 %91 %92
%220 = OpFAdd %5 %217 %219
%221 = OpFAdd %5 %218 %219
%223 = OpCompositeConstruct %96 %64 %67
%222 = OpImageSparseRead %75 %52 %223 None
%224 = OpCompositeExtract %42 %222 0
%225 = OpCompositeExtract %74 %222 1
%226 = OpCompositeExtract %5 %225 0
%227 = OpCompositeExtract %5 %225 1
%228 = OpCompositeExtract %5 %225 2
%229 = OpCompositeExtract %5 %225 3
%230 = OpCompositeConstruct %83 %226 %227 %228 %229 %224
%231 = OpCompositeExtract %5 %230 0
%232 = OpCompositeExtract %5 %230 1
%233 = OpCompositeExtract %42 %230 4
%234 = OpImageSparseTexelsResident %88 %233
%235 = OpFAdd %5 %220 %231
%236 = OpFAdd %5 %221 %232
%237 = OpSelect %5 %234 %91 %92
%238 = OpFAdd %5 %235 %237
%239 = OpFAdd %5 %236 %237
%241 = OpCompositeConstruct %96 %64 %67
%240 = OpImageSparseRead %75 %51 %241 None
%242 = OpCompositeExtract %42 %240 0
%243 = OpCompositeExtract %74 %240 1
%244 = OpCompositeExtract %5 %243 0
%245 = OpCompositeExtract %5 %243 1
%246 = OpCompositeExtract %5 %243 2
%247 = OpCompositeExtract %5 %243 3
%248 = OpCompositeConstruct %83 %244 %245 %246 %247 %242
%249 = OpCompositeExtract %5 %248 0
%250 = OpCompositeExtract %5 %248 1
%251 = OpCompositeExtract %42 %248 4
%252 = OpImageSparseTexelsResident %88 %251
%253 = OpFAdd %5 %238 %249
%254 = OpFAdd %5 %239 %250
%255 = OpSelect %5 %252 %91 %92
%256 = OpFAdd %5 %253 %255
%257 = OpFAdd %5 %254 %255
%259 = OpCompositeConstruct %133 %64 %67 %70
%258 = OpImageSparseRead %75 %50 %259 None
%260 = OpCompositeExtract %42 %258 0
%261 = OpCompositeExtract %74 %258 1
%262 = OpCompositeExtract %5 %261 0
%263 = OpCompositeExtract %5 %261 1
%264 = OpCompositeExtract %5 %261 2
%265 = OpCompositeExtract %5 %261 3
%266 = OpCompositeConstruct %83 %262 %263 %264 %265 %260
%267 = OpCompositeExtract %5 %266 0
%268 = OpCompositeExtract %5 %266 1
%269 = OpCompositeExtract %42 %266 4
%270 = OpImageSparseTexelsResident %88 %269
%271 = OpFAdd %5 %256 %267
%272 = OpFAdd %5 %257 %268
%273 = OpSelect %5 %270 %91 %92
%274 = OpFAdd %5 %271 %273
%275 = OpFAdd %5 %272 %273
%277 = OpCompositeConstruct %133 %64 %67 %70
%276 = OpImageSparseRead %75 %49 %277 None
%278 = OpCompositeExtract %42 %276 0
%279 = OpCompositeExtract %74 %276 1
%280 = OpCompositeExtract %5 %279 0
%281 = OpCompositeExtract %5 %279 1
%282 = OpCompositeExtract %5 %279 2
%283 = OpCompositeExtract %5 %279 3
%284 = OpCompositeConstruct %83 %280 %281 %282 %283 %278
%285 = OpCompositeExtract %5 %284 0
%286 = OpCompositeExtract %5 %284 1
%287 = OpCompositeExtract %42 %284 4
%288 = OpImageSparseTexelsResident %88 %287
%289 = OpFAdd %5 %274 %285
%290 = OpFAdd %5 %275 %286
%291 = OpSelect %5 %288 %91 %92
%292 = OpFAdd %5 %289 %291
%293 = OpFAdd %5 %290 %291
%295 = OpAccessChain %294 %48 %63
OpStore %295 %292
%296 = OpAccessChain %294 %48 %66
OpStore %296 %293
OpReturn
OpFunctionEnd
#endif
