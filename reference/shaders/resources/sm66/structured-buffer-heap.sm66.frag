#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform usamplerBuffer _9[];
layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _13[];
layout(set = 0, binding = 0, r32ui) uniform coherent uimageBuffer _16[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _31 = uint(UV.x);
    uint _35 = uint(UV.y);
    uint _39 = uint(UV.z);
    uint _43 = uint(UV.w);
    uint _48 = INDEX + 1u;
    uint _51 = INDEX + 2u;
    uint _54 = INDEX + 3u;
    uint _62 = INDEX + 5u;
    uint _66 = INDEX + 6u;
    uint _70 = INDEX + 7u;
    uint _78 = INDEX + 9u;
    uint _82 = INDEX + 10u;
    uint _86 = INDEX + 11u;
    uint _94 = _35 * 2u;
    vec2 _103 = uintBitsToFloat(uvec2(texelFetch(_9[_48], int(_94)).x, texelFetch(_9[_48], int(_94 + 1u)).x));
    uint _107 = _39 * 3u;
    vec3 _119 = uintBitsToFloat(uvec3(texelFetch(_9[_51], int(_107)).x, texelFetch(_9[_51], int(_107 + 1u)).x, texelFetch(_9[_51], int(_107 + 2u)).x));
    uint _125 = _43 * 4u;
    vec4 _138 = uintBitsToFloat(uvec4(texelFetch(_9[_54], int(_125)).x, texelFetch(_9[_54], int(_125 + 1u)).x, texelFetch(_9[_54], int(_125 + 2u)).x, texelFetch(_9[_54], int(_125 + 3u)).x));
    uvec4 _146 = imageLoad(_13[INDEX + 4u], int(_31));
    uint _150 = _35 * 2u;
    vec2 _157 = uintBitsToFloat(uvec2(imageLoad(_13[_62], int(_150)).x, imageLoad(_13[_62], int(_150 + 1u)).x));
    uint _162 = _39 * 3u;
    vec3 _172 = uintBitsToFloat(uvec3(imageLoad(_13[_66], int(_162)).x, imageLoad(_13[_66], int(_162 + 1u)).x, imageLoad(_13[_66], int(_162 + 2u)).x));
    uint _179 = _43 * 4u;
    uvec4 _180 = imageLoad(_13[_70], int(_179));
    uvec4 _182 = imageLoad(_13[_70], int(_179 + 1u));
    uvec4 _185 = imageLoad(_13[_70], int(_179 + 2u));
    uvec4 _188 = imageLoad(_13[_70], int(_179 + 3u));
    vec4 _192 = uintBitsToFloat(uvec4(_180.x, _182.x, _185.x, _188.x));
    uvec4 _201 = imageLoad(_16[INDEX + 8u], int(_31));
    uint _205 = _35 * 2u;
    uvec4 _206 = imageLoad(_16[_78], int(_205));
    uvec4 _208 = imageLoad(_16[_78], int(_205 + 1u));
    vec2 _212 = uintBitsToFloat(uvec2(_206.x, _208.x));
    uint _217 = _39 * 3u;
    uvec4 _218 = imageLoad(_16[_82], int(_217));
    uvec4 _220 = imageLoad(_16[_82], int(_217 + 1u));
    uvec4 _223 = imageLoad(_16[_82], int(_217 + 2u));
    vec3 _227 = uintBitsToFloat(uvec3(_218.x, _220.x, _223.x));
    uint _234 = _43 * 4u;
    uvec4 _235 = imageLoad(_16[_86], int(_234));
    uvec4 _237 = imageLoad(_16[_86], int(_234 + 1u));
    uvec4 _240 = imageLoad(_16[_86], int(_234 + 2u));
    uvec4 _243 = imageLoad(_16[_86], int(_234 + 3u));
    vec4 _247 = uintBitsToFloat(uvec4(_235.x, _237.x, _240.x, _243.x));
    uint _256 = _31 * 2u;
    imageStore(_13[_62], int(_256), uvec4(floatBitsToUint(20.0)));
    imageStore(_13[_62], int(_256 + 1u), uvec4(floatBitsToUint(20.0)));
    uint _263 = _35 * 3u;
    imageStore(_16[_82], int(_263), uvec4(floatBitsToUint(30.0)));
    imageStore(_16[_82], int(_263 + 1u), uvec4(floatBitsToUint(30.0)));
    imageStore(_16[_82], int(_263 + 2u), uvec4(floatBitsToUint(30.0)));
    SV_Target.x = ((((((((((_103.x + uintBitsToFloat(texelFetch(_9[INDEX], int(_31)).x)) + _119.x) + _138.x) + uintBitsToFloat(_146.x)) + _157.x) + _172.x) + _192.x) + uintBitsToFloat(_201.x)) + _212.x) + _227.x) + _247.x;
    SV_Target.y = (((((((_119.y + _103.y) + _138.y) + _157.y) + _172.y) + _192.y) + _212.y) + _227.y) + _247.y;
    SV_Target.z = ((((_138.z + _119.z) + _172.z) + _192.z) + _227.z) + _247.z;
    SV_Target.w = (_192.w + _138.w) + _247.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 280
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %18 %22 %26
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %18 "INDEX"
OpName %22 "UV"
OpName %26 "SV_Target"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %16 DescriptorSet 0
OpDecorate %16 Binding 0
OpDecorate %16 Coherent
OpDecorate %18 Flat
OpDecorate %18 Location 0
OpDecorate %22 Flat
OpDecorate %22 Location 1
OpDecorate %26 Location 0
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
%17 = OpTypePointer Input %5
%18 = OpVariable %17 Input
%19 = OpTypeInt 32 1
%20 = OpTypeVector %19 4
%21 = OpTypePointer Input %20
%22 = OpVariable %21 Input
%23 = OpTypeFloat 32
%24 = OpTypeVector %23 4
%25 = OpTypePointer Output %24
%26 = OpVariable %25 Output
%27 = OpTypePointer Input %19
%29 = OpConstant %5 0
%33 = OpConstant %5 1
%37 = OpConstant %5 2
%41 = OpConstant %5 3
%45 = OpTypePointer UniformConstant %6
%58 = OpConstant %5 4
%59 = OpTypePointer UniformConstant %10
%63 = OpConstant %5 5
%67 = OpConstant %5 6
%71 = OpConstant %5 7
%75 = OpConstant %5 8
%79 = OpConstant %5 9
%83 = OpConstant %5 10
%87 = OpConstant %5 11
%90 = OpTypeVector %5 4
%100 = OpTypeVector %5 2
%102 = OpTypeVector %23 2
%116 = OpTypeVector %5 3
%118 = OpTypeVector %23 3
%257 = OpConstant %23 20
%264 = OpConstant %23 30
%273 = OpTypePointer Output %23
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %278
%278 = OpLabel
%28 = OpAccessChain %27 %22 %29
%30 = OpLoad %19 %28
%31 = OpBitcast %5 %30
%32 = OpAccessChain %27 %22 %33
%34 = OpLoad %19 %32
%35 = OpBitcast %5 %34
%36 = OpAccessChain %27 %22 %37
%38 = OpLoad %19 %36
%39 = OpBitcast %5 %38
%40 = OpAccessChain %27 %22 %41
%42 = OpLoad %19 %40
%43 = OpBitcast %5 %42
%44 = OpLoad %5 %18
%46 = OpAccessChain %45 %9 %44
%47 = OpLoad %6 %46
%48 = OpIAdd %5 %44 %33
%49 = OpAccessChain %45 %9 %48
%50 = OpLoad %6 %49
%51 = OpIAdd %5 %44 %37
%52 = OpAccessChain %45 %9 %51
%53 = OpLoad %6 %52
%54 = OpIAdd %5 %44 %41
%55 = OpAccessChain %45 %9 %54
%56 = OpLoad %6 %55
%57 = OpIAdd %5 %44 %58
%60 = OpAccessChain %59 %13 %57
%61 = OpLoad %10 %60
%62 = OpIAdd %5 %44 %63
%64 = OpAccessChain %59 %13 %62
%65 = OpLoad %10 %64
%66 = OpIAdd %5 %44 %67
%68 = OpAccessChain %59 %13 %66
%69 = OpLoad %10 %68
%70 = OpIAdd %5 %44 %71
%72 = OpAccessChain %59 %13 %70
%73 = OpLoad %10 %72
%74 = OpIAdd %5 %44 %75
%76 = OpAccessChain %59 %16 %74
%77 = OpLoad %10 %76
%78 = OpIAdd %5 %44 %79
%80 = OpAccessChain %59 %16 %78
%81 = OpLoad %10 %80
%82 = OpIAdd %5 %44 %83
%84 = OpAccessChain %59 %16 %82
%85 = OpLoad %10 %84
%86 = OpIAdd %5 %44 %87
%88 = OpAccessChain %59 %16 %86
%89 = OpLoad %10 %88
%91 = OpImageFetch %90 %47 %31
%92 = OpCompositeExtract %5 %91 0
%93 = OpBitcast %23 %92
%94 = OpIMul %5 %35 %37
%95 = OpImageFetch %90 %50 %94
%96 = OpCompositeExtract %5 %95 0
%98 = OpIAdd %5 %94 %33
%97 = OpImageFetch %90 %50 %98
%99 = OpCompositeExtract %5 %97 0
%101 = OpCompositeConstruct %100 %96 %99
%103 = OpBitcast %102 %101
%104 = OpCompositeExtract %23 %103 0
%105 = OpCompositeExtract %23 %103 1
%106 = OpFAdd %23 %104 %93
%107 = OpIMul %5 %39 %41
%108 = OpImageFetch %90 %53 %107
%109 = OpCompositeExtract %5 %108 0
%111 = OpIAdd %5 %107 %33
%110 = OpImageFetch %90 %53 %111
%112 = OpCompositeExtract %5 %110 0
%114 = OpIAdd %5 %107 %37
%113 = OpImageFetch %90 %53 %114
%115 = OpCompositeExtract %5 %113 0
%117 = OpCompositeConstruct %116 %109 %112 %115
%119 = OpBitcast %118 %117
%120 = OpCompositeExtract %23 %119 0
%121 = OpCompositeExtract %23 %119 1
%122 = OpCompositeExtract %23 %119 2
%123 = OpFAdd %23 %106 %120
%124 = OpFAdd %23 %121 %105
%125 = OpIMul %5 %43 %58
%126 = OpImageFetch %90 %56 %125
%127 = OpCompositeExtract %5 %126 0
%129 = OpIAdd %5 %125 %33
%128 = OpImageFetch %90 %56 %129
%130 = OpCompositeExtract %5 %128 0
%132 = OpIAdd %5 %125 %37
%131 = OpImageFetch %90 %56 %132
%133 = OpCompositeExtract %5 %131 0
%135 = OpIAdd %5 %125 %41
%134 = OpImageFetch %90 %56 %135
%136 = OpCompositeExtract %5 %134 0
%137 = OpCompositeConstruct %90 %127 %130 %133 %136
%138 = OpBitcast %24 %137
%139 = OpCompositeExtract %23 %138 0
%140 = OpCompositeExtract %23 %138 1
%141 = OpCompositeExtract %23 %138 2
%142 = OpCompositeExtract %23 %138 3
%143 = OpFAdd %23 %123 %139
%144 = OpFAdd %23 %124 %140
%145 = OpFAdd %23 %141 %122
%146 = OpImageRead %90 %61 %31
%147 = OpCompositeExtract %5 %146 0
%148 = OpBitcast %23 %147
%149 = OpFAdd %23 %143 %148
%150 = OpIMul %5 %35 %37
%151 = OpImageRead %90 %65 %150
%152 = OpCompositeExtract %5 %151 0
%154 = OpIAdd %5 %150 %33
%153 = OpImageRead %90 %65 %154
%155 = OpCompositeExtract %5 %153 0
%156 = OpCompositeConstruct %100 %152 %155
%157 = OpBitcast %102 %156
%158 = OpCompositeExtract %23 %157 0
%159 = OpCompositeExtract %23 %157 1
%160 = OpFAdd %23 %149 %158
%161 = OpFAdd %23 %144 %159
%162 = OpIMul %5 %39 %41
%163 = OpImageRead %90 %69 %162
%164 = OpCompositeExtract %5 %163 0
%166 = OpIAdd %5 %162 %33
%165 = OpImageRead %90 %69 %166
%167 = OpCompositeExtract %5 %165 0
%169 = OpIAdd %5 %162 %37
%168 = OpImageRead %90 %69 %169
%170 = OpCompositeExtract %5 %168 0
%171 = OpCompositeConstruct %116 %164 %167 %170
%172 = OpBitcast %118 %171
%173 = OpCompositeExtract %23 %172 0
%174 = OpCompositeExtract %23 %172 1
%175 = OpCompositeExtract %23 %172 2
%176 = OpFAdd %23 %160 %173
%177 = OpFAdd %23 %161 %174
%178 = OpFAdd %23 %145 %175
%179 = OpIMul %5 %43 %58
%180 = OpImageRead %90 %73 %179
%181 = OpCompositeExtract %5 %180 0
%183 = OpIAdd %5 %179 %33
%182 = OpImageRead %90 %73 %183
%184 = OpCompositeExtract %5 %182 0
%186 = OpIAdd %5 %179 %37
%185 = OpImageRead %90 %73 %186
%187 = OpCompositeExtract %5 %185 0
%189 = OpIAdd %5 %179 %41
%188 = OpImageRead %90 %73 %189
%190 = OpCompositeExtract %5 %188 0
%191 = OpCompositeConstruct %90 %181 %184 %187 %190
%192 = OpBitcast %24 %191
%193 = OpCompositeExtract %23 %192 0
%194 = OpCompositeExtract %23 %192 1
%195 = OpCompositeExtract %23 %192 2
%196 = OpCompositeExtract %23 %192 3
%197 = OpFAdd %23 %176 %193
%198 = OpFAdd %23 %177 %194
%199 = OpFAdd %23 %178 %195
%200 = OpFAdd %23 %196 %142
%201 = OpImageRead %90 %77 %31
%202 = OpCompositeExtract %5 %201 0
%203 = OpBitcast %23 %202
%204 = OpFAdd %23 %197 %203
%205 = OpIMul %5 %35 %37
%206 = OpImageRead %90 %81 %205
%207 = OpCompositeExtract %5 %206 0
%209 = OpIAdd %5 %205 %33
%208 = OpImageRead %90 %81 %209
%210 = OpCompositeExtract %5 %208 0
%211 = OpCompositeConstruct %100 %207 %210
%212 = OpBitcast %102 %211
%213 = OpCompositeExtract %23 %212 0
%214 = OpCompositeExtract %23 %212 1
%215 = OpFAdd %23 %204 %213
%216 = OpFAdd %23 %198 %214
%217 = OpIMul %5 %39 %41
%218 = OpImageRead %90 %85 %217
%219 = OpCompositeExtract %5 %218 0
%221 = OpIAdd %5 %217 %33
%220 = OpImageRead %90 %85 %221
%222 = OpCompositeExtract %5 %220 0
%224 = OpIAdd %5 %217 %37
%223 = OpImageRead %90 %85 %224
%225 = OpCompositeExtract %5 %223 0
%226 = OpCompositeConstruct %116 %219 %222 %225
%227 = OpBitcast %118 %226
%228 = OpCompositeExtract %23 %227 0
%229 = OpCompositeExtract %23 %227 1
%230 = OpCompositeExtract %23 %227 2
%231 = OpFAdd %23 %215 %228
%232 = OpFAdd %23 %216 %229
%233 = OpFAdd %23 %199 %230
%234 = OpIMul %5 %43 %58
%235 = OpImageRead %90 %89 %234
%236 = OpCompositeExtract %5 %235 0
%238 = OpIAdd %5 %234 %33
%237 = OpImageRead %90 %89 %238
%239 = OpCompositeExtract %5 %237 0
%241 = OpIAdd %5 %234 %37
%240 = OpImageRead %90 %89 %241
%242 = OpCompositeExtract %5 %240 0
%244 = OpIAdd %5 %234 %41
%243 = OpImageRead %90 %89 %244
%245 = OpCompositeExtract %5 %243 0
%246 = OpCompositeConstruct %90 %236 %239 %242 %245
%247 = OpBitcast %24 %246
%248 = OpCompositeExtract %23 %247 0
%249 = OpCompositeExtract %23 %247 1
%250 = OpCompositeExtract %23 %247 2
%251 = OpCompositeExtract %23 %247 3
%252 = OpFAdd %23 %231 %248
%253 = OpFAdd %23 %232 %249
%254 = OpFAdd %23 %233 %250
%255 = OpFAdd %23 %200 %251
%256 = OpIMul %5 %31 %37
%258 = OpBitcast %5 %257
%259 = OpBitcast %5 %257
%260 = OpCompositeConstruct %90 %258 %258 %258 %258
OpImageWrite %65 %256 %260
%261 = OpCompositeConstruct %90 %259 %259 %259 %259
%262 = OpIAdd %5 %256 %33
OpImageWrite %65 %262 %261
%263 = OpIMul %5 %35 %41
%265 = OpBitcast %5 %264
%266 = OpBitcast %5 %264
%267 = OpBitcast %5 %264
%268 = OpCompositeConstruct %90 %265 %265 %265 %265
OpImageWrite %85 %263 %268
%269 = OpCompositeConstruct %90 %266 %266 %266 %266
%270 = OpIAdd %5 %263 %33
OpImageWrite %85 %270 %269
%271 = OpCompositeConstruct %90 %267 %267 %267 %267
%272 = OpIAdd %5 %263 %37
OpImageWrite %85 %272 %271
%274 = OpAccessChain %273 %26 %29
OpStore %274 %252
%275 = OpAccessChain %273 %26 %33
OpStore %275 %253
%276 = OpAccessChain %273 %26 %37
OpStore %276 %254
%277 = OpAccessChain %273 %26 %41
OpStore %277 %255
OpReturn
OpFunctionEnd
#endif
