#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform usamplerBuffer _9[];
layout(set = 0, binding = 0, r32ui) uniform readonly uimageBuffer _13[];
layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _16[];
layout(set = 0, binding = 0, r32ui) uniform coherent readonly uimageBuffer _19[];
layout(set = 0, binding = 0, r32ui) uniform coherent uimageBuffer _22[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _37 = uint(UV.x);
    uint _41 = uint(UV.y);
    uint _45 = uint(UV.z);
    uint _49 = uint(UV.w);
    uint _54 = INDEX + 1u;
    uint _57 = INDEX + 2u;
    uint _60 = INDEX + 3u;
    uint _68 = INDEX + 5u;
    uint _72 = INDEX + 6u;
    uint _76 = INDEX + 7u;
    uint _84 = INDEX + 9u;
    uint _88 = INDEX + 10u;
    uint _92 = INDEX + 11u;
    uint _100 = _41 * 2u;
    vec2 _109 = uintBitsToFloat(uvec2(texelFetch(_9[_54], int(_100)).x, texelFetch(_9[_54], int(_100 + 1u)).x));
    uint _113 = _45 * 3u;
    vec3 _125 = uintBitsToFloat(uvec3(texelFetch(_9[_57], int(_113)).x, texelFetch(_9[_57], int(_113 + 1u)).x, texelFetch(_9[_57], int(_113 + 2u)).x));
    uint _131 = _49 * 4u;
    vec4 _144 = uintBitsToFloat(uvec4(texelFetch(_9[_60], int(_131)).x, texelFetch(_9[_60], int(_131 + 1u)).x, texelFetch(_9[_60], int(_131 + 2u)).x, texelFetch(_9[_60], int(_131 + 3u)).x));
    uvec4 _152 = imageLoad(_13[INDEX + 4u], int(_37));
    uint _156 = _41 * 2u;
    uvec4 _157 = imageLoad(_16[_68], int(_156));
    uvec4 _159 = imageLoad(_16[_68], int(_156 + 1u));
    vec2 _163 = uintBitsToFloat(uvec2(_157.x, _159.x));
    uint _168 = _45 * 3u;
    uvec4 _169 = imageLoad(_13[_72], int(_168));
    uvec4 _171 = imageLoad(_13[_72], int(_168 + 1u));
    uvec4 _174 = imageLoad(_13[_72], int(_168 + 2u));
    vec3 _178 = uintBitsToFloat(uvec3(_169.x, _171.x, _174.x));
    uint _185 = _49 * 4u;
    uvec4 _186 = imageLoad(_13[_76], int(_185));
    uvec4 _188 = imageLoad(_13[_76], int(_185 + 1u));
    uvec4 _191 = imageLoad(_13[_76], int(_185 + 2u));
    uvec4 _194 = imageLoad(_13[_76], int(_185 + 3u));
    vec4 _198 = uintBitsToFloat(uvec4(_186.x, _188.x, _191.x, _194.x));
    uvec4 _207 = imageLoad(_19[INDEX + 8u], int(_37));
    uint _211 = _41 * 2u;
    uvec4 _212 = imageLoad(_19[_84], int(_211));
    uvec4 _214 = imageLoad(_19[_84], int(_211 + 1u));
    vec2 _218 = uintBitsToFloat(uvec2(_212.x, _214.x));
    uint _223 = _45 * 3u;
    uvec4 _224 = imageLoad(_22[_88], int(_223));
    uvec4 _226 = imageLoad(_22[_88], int(_223 + 1u));
    uvec4 _229 = imageLoad(_22[_88], int(_223 + 2u));
    vec3 _233 = uintBitsToFloat(uvec3(_224.x, _226.x, _229.x));
    uint _240 = _49 * 4u;
    uvec4 _241 = imageLoad(_19[_92], int(_240));
    uvec4 _243 = imageLoad(_19[_92], int(_240 + 1u));
    uvec4 _246 = imageLoad(_19[_92], int(_240 + 2u));
    uvec4 _249 = imageLoad(_19[_92], int(_240 + 3u));
    vec4 _253 = uintBitsToFloat(uvec4(_241.x, _243.x, _246.x, _249.x));
    uint _262 = _37 * 2u;
    imageStore(_16[_68], int(_262), uvec4(floatBitsToUint(20.0)));
    imageStore(_16[_68], int(_262 + 1u), uvec4(floatBitsToUint(20.0)));
    uint _269 = _41 * 3u;
    imageStore(_22[_88], int(_269), uvec4(floatBitsToUint(30.0)));
    imageStore(_22[_88], int(_269 + 1u), uvec4(floatBitsToUint(30.0)));
    imageStore(_22[_88], int(_269 + 2u), uvec4(floatBitsToUint(30.0)));
    SV_Target.x = ((((((((((_109.x + uintBitsToFloat(texelFetch(_9[INDEX], int(_37)).x)) + _125.x) + _144.x) + uintBitsToFloat(_152.x)) + _163.x) + _178.x) + _198.x) + uintBitsToFloat(_207.x)) + _218.x) + _233.x) + _253.x;
    SV_Target.y = (((((((_125.y + _109.y) + _144.y) + _163.y) + _178.y) + _198.y) + _218.y) + _233.y) + _253.y;
    SV_Target.z = ((((_144.z + _125.z) + _178.z) + _198.z) + _233.z) + _253.z;
    SV_Target.w = (_198.w + _144.w) + _253.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 286
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %24 %28 %32
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %24 "INDEX"
OpName %28 "UV"
OpName %32 "SV_Target"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %13 NonWritable
OpDecorate %16 DescriptorSet 0
OpDecorate %16 Binding 0
OpDecorate %19 DescriptorSet 0
OpDecorate %19 Binding 0
OpDecorate %19 NonWritable
OpDecorate %19 Coherent
OpDecorate %22 DescriptorSet 0
OpDecorate %22 Binding 0
OpDecorate %22 Coherent
OpDecorate %24 Flat
OpDecorate %24 Location 0
OpDecorate %28 Flat
OpDecorate %28 Location 1
OpDecorate %32 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer UniformConstant %11
%13 = OpVariable %12 UniformConstant
%14 = OpTypeRuntimeArray %10
%15 = OpTypePointer UniformConstant %14
%16 = OpVariable %15 UniformConstant
%17 = OpTypeRuntimeArray %10
%18 = OpTypePointer UniformConstant %17
%19 = OpVariable %18 UniformConstant
%20 = OpTypeRuntimeArray %10
%21 = OpTypePointer UniformConstant %20
%22 = OpVariable %21 UniformConstant
%23 = OpTypePointer Input %5
%24 = OpVariable %23 Input
%25 = OpTypeInt 32 1
%26 = OpTypeVector %25 4
%27 = OpTypePointer Input %26
%28 = OpVariable %27 Input
%29 = OpTypeFloat 32
%30 = OpTypeVector %29 4
%31 = OpTypePointer Output %30
%32 = OpVariable %31 Output
%33 = OpTypePointer Input %25
%35 = OpConstant %5 0
%39 = OpConstant %5 1
%43 = OpConstant %5 2
%47 = OpConstant %5 3
%51 = OpTypePointer UniformConstant %6
%64 = OpConstant %5 4
%65 = OpTypePointer UniformConstant %10
%69 = OpConstant %5 5
%73 = OpConstant %5 6
%77 = OpConstant %5 7
%81 = OpConstant %5 8
%85 = OpConstant %5 9
%89 = OpConstant %5 10
%93 = OpConstant %5 11
%96 = OpTypeVector %5 4
%106 = OpTypeVector %5 2
%108 = OpTypeVector %29 2
%122 = OpTypeVector %5 3
%124 = OpTypeVector %29 3
%263 = OpConstant %29 20
%270 = OpConstant %29 30
%279 = OpTypePointer Output %29
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %284
%284 = OpLabel
%34 = OpAccessChain %33 %28 %35
%36 = OpLoad %25 %34
%37 = OpBitcast %5 %36
%38 = OpAccessChain %33 %28 %39
%40 = OpLoad %25 %38
%41 = OpBitcast %5 %40
%42 = OpAccessChain %33 %28 %43
%44 = OpLoad %25 %42
%45 = OpBitcast %5 %44
%46 = OpAccessChain %33 %28 %47
%48 = OpLoad %25 %46
%49 = OpBitcast %5 %48
%50 = OpLoad %5 %24
%52 = OpAccessChain %51 %9 %50
%53 = OpLoad %6 %52
%54 = OpIAdd %5 %50 %39
%55 = OpAccessChain %51 %9 %54
%56 = OpLoad %6 %55
%57 = OpIAdd %5 %50 %43
%58 = OpAccessChain %51 %9 %57
%59 = OpLoad %6 %58
%60 = OpIAdd %5 %50 %47
%61 = OpAccessChain %51 %9 %60
%62 = OpLoad %6 %61
%63 = OpIAdd %5 %50 %64
%66 = OpAccessChain %65 %13 %63
%67 = OpLoad %10 %66
%68 = OpIAdd %5 %50 %69
%70 = OpAccessChain %65 %16 %68
%71 = OpLoad %10 %70
%72 = OpIAdd %5 %50 %73
%74 = OpAccessChain %65 %13 %72
%75 = OpLoad %10 %74
%76 = OpIAdd %5 %50 %77
%78 = OpAccessChain %65 %13 %76
%79 = OpLoad %10 %78
%80 = OpIAdd %5 %50 %81
%82 = OpAccessChain %65 %19 %80
%83 = OpLoad %10 %82
%84 = OpIAdd %5 %50 %85
%86 = OpAccessChain %65 %19 %84
%87 = OpLoad %10 %86
%88 = OpIAdd %5 %50 %89
%90 = OpAccessChain %65 %22 %88
%91 = OpLoad %10 %90
%92 = OpIAdd %5 %50 %93
%94 = OpAccessChain %65 %19 %92
%95 = OpLoad %10 %94
%97 = OpImageFetch %96 %53 %37
%98 = OpCompositeExtract %5 %97 0
%99 = OpBitcast %29 %98
%100 = OpIMul %5 %41 %43
%101 = OpImageFetch %96 %56 %100
%102 = OpCompositeExtract %5 %101 0
%104 = OpIAdd %5 %100 %39
%103 = OpImageFetch %96 %56 %104
%105 = OpCompositeExtract %5 %103 0
%107 = OpCompositeConstruct %106 %102 %105
%109 = OpBitcast %108 %107
%110 = OpCompositeExtract %29 %109 0
%111 = OpCompositeExtract %29 %109 1
%112 = OpFAdd %29 %110 %99
%113 = OpIMul %5 %45 %47
%114 = OpImageFetch %96 %59 %113
%115 = OpCompositeExtract %5 %114 0
%117 = OpIAdd %5 %113 %39
%116 = OpImageFetch %96 %59 %117
%118 = OpCompositeExtract %5 %116 0
%120 = OpIAdd %5 %113 %43
%119 = OpImageFetch %96 %59 %120
%121 = OpCompositeExtract %5 %119 0
%123 = OpCompositeConstruct %122 %115 %118 %121
%125 = OpBitcast %124 %123
%126 = OpCompositeExtract %29 %125 0
%127 = OpCompositeExtract %29 %125 1
%128 = OpCompositeExtract %29 %125 2
%129 = OpFAdd %29 %112 %126
%130 = OpFAdd %29 %127 %111
%131 = OpIMul %5 %49 %64
%132 = OpImageFetch %96 %62 %131
%133 = OpCompositeExtract %5 %132 0
%135 = OpIAdd %5 %131 %39
%134 = OpImageFetch %96 %62 %135
%136 = OpCompositeExtract %5 %134 0
%138 = OpIAdd %5 %131 %43
%137 = OpImageFetch %96 %62 %138
%139 = OpCompositeExtract %5 %137 0
%141 = OpIAdd %5 %131 %47
%140 = OpImageFetch %96 %62 %141
%142 = OpCompositeExtract %5 %140 0
%143 = OpCompositeConstruct %96 %133 %136 %139 %142
%144 = OpBitcast %30 %143
%145 = OpCompositeExtract %29 %144 0
%146 = OpCompositeExtract %29 %144 1
%147 = OpCompositeExtract %29 %144 2
%148 = OpCompositeExtract %29 %144 3
%149 = OpFAdd %29 %129 %145
%150 = OpFAdd %29 %130 %146
%151 = OpFAdd %29 %147 %128
%152 = OpImageRead %96 %67 %37
%153 = OpCompositeExtract %5 %152 0
%154 = OpBitcast %29 %153
%155 = OpFAdd %29 %149 %154
%156 = OpIMul %5 %41 %43
%157 = OpImageRead %96 %71 %156
%158 = OpCompositeExtract %5 %157 0
%160 = OpIAdd %5 %156 %39
%159 = OpImageRead %96 %71 %160
%161 = OpCompositeExtract %5 %159 0
%162 = OpCompositeConstruct %106 %158 %161
%163 = OpBitcast %108 %162
%164 = OpCompositeExtract %29 %163 0
%165 = OpCompositeExtract %29 %163 1
%166 = OpFAdd %29 %155 %164
%167 = OpFAdd %29 %150 %165
%168 = OpIMul %5 %45 %47
%169 = OpImageRead %96 %75 %168
%170 = OpCompositeExtract %5 %169 0
%172 = OpIAdd %5 %168 %39
%171 = OpImageRead %96 %75 %172
%173 = OpCompositeExtract %5 %171 0
%175 = OpIAdd %5 %168 %43
%174 = OpImageRead %96 %75 %175
%176 = OpCompositeExtract %5 %174 0
%177 = OpCompositeConstruct %122 %170 %173 %176
%178 = OpBitcast %124 %177
%179 = OpCompositeExtract %29 %178 0
%180 = OpCompositeExtract %29 %178 1
%181 = OpCompositeExtract %29 %178 2
%182 = OpFAdd %29 %166 %179
%183 = OpFAdd %29 %167 %180
%184 = OpFAdd %29 %151 %181
%185 = OpIMul %5 %49 %64
%186 = OpImageRead %96 %79 %185
%187 = OpCompositeExtract %5 %186 0
%189 = OpIAdd %5 %185 %39
%188 = OpImageRead %96 %79 %189
%190 = OpCompositeExtract %5 %188 0
%192 = OpIAdd %5 %185 %43
%191 = OpImageRead %96 %79 %192
%193 = OpCompositeExtract %5 %191 0
%195 = OpIAdd %5 %185 %47
%194 = OpImageRead %96 %79 %195
%196 = OpCompositeExtract %5 %194 0
%197 = OpCompositeConstruct %96 %187 %190 %193 %196
%198 = OpBitcast %30 %197
%199 = OpCompositeExtract %29 %198 0
%200 = OpCompositeExtract %29 %198 1
%201 = OpCompositeExtract %29 %198 2
%202 = OpCompositeExtract %29 %198 3
%203 = OpFAdd %29 %182 %199
%204 = OpFAdd %29 %183 %200
%205 = OpFAdd %29 %184 %201
%206 = OpFAdd %29 %202 %148
%207 = OpImageRead %96 %83 %37
%208 = OpCompositeExtract %5 %207 0
%209 = OpBitcast %29 %208
%210 = OpFAdd %29 %203 %209
%211 = OpIMul %5 %41 %43
%212 = OpImageRead %96 %87 %211
%213 = OpCompositeExtract %5 %212 0
%215 = OpIAdd %5 %211 %39
%214 = OpImageRead %96 %87 %215
%216 = OpCompositeExtract %5 %214 0
%217 = OpCompositeConstruct %106 %213 %216
%218 = OpBitcast %108 %217
%219 = OpCompositeExtract %29 %218 0
%220 = OpCompositeExtract %29 %218 1
%221 = OpFAdd %29 %210 %219
%222 = OpFAdd %29 %204 %220
%223 = OpIMul %5 %45 %47
%224 = OpImageRead %96 %91 %223
%225 = OpCompositeExtract %5 %224 0
%227 = OpIAdd %5 %223 %39
%226 = OpImageRead %96 %91 %227
%228 = OpCompositeExtract %5 %226 0
%230 = OpIAdd %5 %223 %43
%229 = OpImageRead %96 %91 %230
%231 = OpCompositeExtract %5 %229 0
%232 = OpCompositeConstruct %122 %225 %228 %231
%233 = OpBitcast %124 %232
%234 = OpCompositeExtract %29 %233 0
%235 = OpCompositeExtract %29 %233 1
%236 = OpCompositeExtract %29 %233 2
%237 = OpFAdd %29 %221 %234
%238 = OpFAdd %29 %222 %235
%239 = OpFAdd %29 %205 %236
%240 = OpIMul %5 %49 %64
%241 = OpImageRead %96 %95 %240
%242 = OpCompositeExtract %5 %241 0
%244 = OpIAdd %5 %240 %39
%243 = OpImageRead %96 %95 %244
%245 = OpCompositeExtract %5 %243 0
%247 = OpIAdd %5 %240 %43
%246 = OpImageRead %96 %95 %247
%248 = OpCompositeExtract %5 %246 0
%250 = OpIAdd %5 %240 %47
%249 = OpImageRead %96 %95 %250
%251 = OpCompositeExtract %5 %249 0
%252 = OpCompositeConstruct %96 %242 %245 %248 %251
%253 = OpBitcast %30 %252
%254 = OpCompositeExtract %29 %253 0
%255 = OpCompositeExtract %29 %253 1
%256 = OpCompositeExtract %29 %253 2
%257 = OpCompositeExtract %29 %253 3
%258 = OpFAdd %29 %237 %254
%259 = OpFAdd %29 %238 %255
%260 = OpFAdd %29 %239 %256
%261 = OpFAdd %29 %206 %257
%262 = OpIMul %5 %37 %43
%264 = OpBitcast %5 %263
%265 = OpBitcast %5 %263
%266 = OpCompositeConstruct %96 %264 %264 %264 %264
OpImageWrite %71 %262 %266
%267 = OpCompositeConstruct %96 %265 %265 %265 %265
%268 = OpIAdd %5 %262 %39
OpImageWrite %71 %268 %267
%269 = OpIMul %5 %41 %47
%271 = OpBitcast %5 %270
%272 = OpBitcast %5 %270
%273 = OpBitcast %5 %270
%274 = OpCompositeConstruct %96 %271 %271 %271 %271
OpImageWrite %91 %269 %274
%275 = OpCompositeConstruct %96 %272 %272 %272 %272
%276 = OpIAdd %5 %269 %39
OpImageWrite %91 %276 %275
%277 = OpCompositeConstruct %96 %273 %273 %273 %273
%278 = OpIAdd %5 %269 %43
OpImageWrite %91 %278 %277
%280 = OpAccessChain %279 %32 %35
OpStore %280 %258
%281 = OpAccessChain %279 %32 %39
OpStore %281 %259
%282 = OpAccessChain %279 %32 %43
OpStore %282 %260
%283 = OpAccessChain %279 %32 %47
OpStore %283 %261
OpReturn
OpFunctionEnd
#endif
