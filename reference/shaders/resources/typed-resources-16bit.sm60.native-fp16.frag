#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0) uniform mediump texture2D _8;
layout(set = 0, binding = 1) uniform mediump itexture2D _12;
layout(set = 0, binding = 2) uniform mediump utexture2D _16;
layout(set = 0, binding = 3) uniform mediump samplerBuffer _19;
layout(set = 0, binding = 4) uniform mediump isamplerBuffer _22;
layout(set = 0, binding = 5) uniform mediump usamplerBuffer _25;
layout(set = 0, binding = 0) uniform writeonly mediump image2D _28;
layout(set = 0, binding = 1) uniform writeonly mediump iimage2D _31;
layout(set = 0, binding = 2) uniform writeonly mediump uimage2D _34;
layout(set = 0, binding = 3) uniform writeonly mediump imageBuffer _37;
layout(set = 0, binding = 4) uniform writeonly mediump iimageBuffer _40;
layout(set = 0, binding = 5) uniform writeonly mediump uimageBuffer _43;
layout(set = 0, binding = 0) uniform sampler _46;
layout(set = 0, binding = 1) uniform samplerShadow _47;

layout(location = 0) in vec2 UV;
layout(location = 0) out mediump vec4 SV_Target;
layout(location = 1) out mediump ivec4 SV_Target_1;
layout(location = 2) out mediump uvec4 SV_Target_2;

void main()
{
    float16_t _82 = float16_t(UV.x);
    float16_t _83 = float16_t(UV.y);
    uint _84 = uint(int(UV.x));
    uint _85 = uint(int(UV.y));
    imageStore(_28, ivec2(uvec2(_84, _85)), vec4(f16vec4(_82, _83, _82, _83)));
    uint16_t _92 = uint16_t(int16_t(UV.x));
    uint16_t _93 = uint16_t(int16_t(UV.y));
    imageStore(_31, ivec2(uvec2(_84, _85)), ivec4(i16vec4(u16vec4(_92, _93, _92, _93))));
    uint16_t _98 = uint16_t(UV.x);
    uint16_t _99 = uint16_t(UV.y);
    imageStore(_34, ivec2(uvec2(_84, _85)), uvec4(u16vec4(_98, _99, _98, _99)));
    imageStore(_37, int(_84), vec4(f16vec4(float16_t(8.0))));
    imageStore(_40, int(_84), ivec4(i16vec4(u16vec4(65516us))));
    imageStore(_43, int(_84), uvec4(u16vec4(80us)));
    f16vec4 _117 = f16vec4(texture(sampler2D(_8, _46), vec2(UV.x, UV.y)));
    u16vec4 _126 = u16vec4(texelFetch(_12, ivec2(uvec2(1u, 2u)), int(3u)));
    u16vec4 _136 = u16vec4(texelFetch(_16, ivec2(uvec2(4u, 5u)), int(6u)));
    f16vec4 _143 = f16vec4(textureGather(sampler2D(_8, _46), vec2(UV.x, UV.y)));
    u16vec4 _156 = u16vec4(textureGather(isampler2D(_12, _46), vec2(UV.x, UV.y), int(1u)));
    u16vec4 _169 = u16vec4(textureGather(usampler2D(_16, _46), vec2(UV.x, UV.y), int(2u)));
    mediump vec4 _184 = vec4(texture(sampler2DShadow(_8, _47), vec3(vec2(UV.x, UV.y), 0.5)));
    mediump float _185 = _184.x;
    mediump vec4 _200 = vec4(textureLod(sampler2DShadow(_8, _47), vec3(vec2(UV.x, UV.y), 0.5), 0.0));
    mediump float _201 = _200.x;
    vec2 _214 = vec2(UV.x, UV.y);
    f16vec4 _216 = f16vec4(textureGather(sampler2DShadow(_8, _47), _214, 0.5));
    f16vec4 _223 = f16vec4(textureLod(sampler2D(_8, _46), vec2(UV.x, UV.y), 0.0));
    f16vec4 _235 = f16vec4(textureGrad(sampler2D(_8, _46), vec2(UV.x, UV.y), vec2(0.20000000298023223876953125, 0.300000011920928955078125), vec2(0.4000000059604644775390625, 0.5)));
    f16vec4 _242 = f16vec4(texture(sampler2D(_8, _46), vec2(UV.x, UV.y), 0.5));
    f16vec4 _248 = f16vec4(texelFetch(_19, int(_84)));
    u16vec4 _274 = u16vec4(texelFetch(_22, int(_84)));
    u16vec4 _284 = u16vec4(texelFetch(_25, int(_84)));
    SV_Target.x = float(((((_223.x + _216.x) + _235.x) + float16_t(float(float16_t(_185 + float(_143.x + _117.x))) + _201)) + _242.x) + _248.x);
    SV_Target.y = float(((((_223.y + _216.y) + _235.y) + float16_t(float(float16_t(_185 + float(_143.y + _117.y))) + _201)) + _242.y) + _248.y);
    SV_Target.z = float(((((_223.z + _216.z) + _235.z) + float16_t(float(float16_t(_185 + float(_143.z + _117.z))) + _201)) + _242.z) + _248.z);
    SV_Target.w = float(((((_223.w + _216.w) + _235.w) + float16_t(float(float16_t(_185 + float(_143.w + _117.w))) + _201)) + _242.w) + _248.w);
    SV_Target_1.x = int(int16_t((_156.x + _126.x) + _274.x));
    SV_Target_1.y = int(int16_t((_156.y + _126.y) + _274.y));
    SV_Target_1.z = int(int16_t((_156.z + _126.z) + _274.z));
    SV_Target_1.w = int(int16_t((_156.w + _126.w) + _274.w));
    SV_Target_2.x = uint((_169.x + _136.x) + _284.x);
    SV_Target_2.y = uint((_169.y + _136.y) + _284.y);
    SV_Target_2.z = uint((_169.z + _136.z) + _284.z);
    SV_Target_2.w = uint((_169.w + _136.w) + _284.w);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 322
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %50 %53 %56 %59
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %50 "UV"
OpName %53 "SV_Target"
OpName %56 "SV_Target_1"
OpName %59 "SV_Target_2"
OpDecorate %8 RelaxedPrecision
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %12 RelaxedPrecision
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 1
OpDecorate %16 RelaxedPrecision
OpDecorate %16 DescriptorSet 0
OpDecorate %16 Binding 2
OpDecorate %19 RelaxedPrecision
OpDecorate %19 DescriptorSet 0
OpDecorate %19 Binding 3
OpDecorate %22 RelaxedPrecision
OpDecorate %22 DescriptorSet 0
OpDecorate %22 Binding 4
OpDecorate %25 RelaxedPrecision
OpDecorate %25 DescriptorSet 0
OpDecorate %25 Binding 5
OpDecorate %28 RelaxedPrecision
OpDecorate %28 DescriptorSet 0
OpDecorate %28 Binding 0
OpDecorate %28 NonReadable
OpDecorate %31 RelaxedPrecision
OpDecorate %31 DescriptorSet 0
OpDecorate %31 Binding 1
OpDecorate %31 NonReadable
OpDecorate %34 RelaxedPrecision
OpDecorate %34 DescriptorSet 0
OpDecorate %34 Binding 2
OpDecorate %34 NonReadable
OpDecorate %37 RelaxedPrecision
OpDecorate %37 DescriptorSet 0
OpDecorate %37 Binding 3
OpDecorate %37 NonReadable
OpDecorate %40 RelaxedPrecision
OpDecorate %40 DescriptorSet 0
OpDecorate %40 Binding 4
OpDecorate %40 NonReadable
OpDecorate %43 RelaxedPrecision
OpDecorate %43 DescriptorSet 0
OpDecorate %43 Binding 5
OpDecorate %43 NonReadable
OpDecorate %46 DescriptorSet 0
OpDecorate %46 Binding 0
OpDecorate %47 DescriptorSet 0
OpDecorate %47 Binding 1
OpDecorate %50 Location 0
OpDecorate %53 RelaxedPrecision
OpDecorate %53 Location 0
OpDecorate %56 RelaxedPrecision
OpDecorate %56 Location 1
OpDecorate %59 RelaxedPrecision
OpDecorate %59 Location 2
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 1
%10 = OpTypeImage %9 2D 0 0 0 1 Unknown
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpTypeInt 32 0
%14 = OpTypeImage %13 2D 0 0 0 1 Unknown
%15 = OpTypePointer UniformConstant %14
%16 = OpVariable %15 UniformConstant
%17 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%18 = OpTypePointer UniformConstant %17
%19 = OpVariable %18 UniformConstant
%20 = OpTypeImage %9 Buffer 0 0 0 1 Unknown
%21 = OpTypePointer UniformConstant %20
%22 = OpVariable %21 UniformConstant
%23 = OpTypeImage %13 Buffer 0 0 0 1 Unknown
%24 = OpTypePointer UniformConstant %23
%25 = OpVariable %24 UniformConstant
%26 = OpTypeImage %5 2D 0 0 0 2 Unknown
%27 = OpTypePointer UniformConstant %26
%28 = OpVariable %27 UniformConstant
%29 = OpTypeImage %9 2D 0 0 0 2 Unknown
%30 = OpTypePointer UniformConstant %29
%31 = OpVariable %30 UniformConstant
%32 = OpTypeImage %13 2D 0 0 0 2 Unknown
%33 = OpTypePointer UniformConstant %32
%34 = OpVariable %33 UniformConstant
%35 = OpTypeImage %5 Buffer 0 0 0 2 Unknown
%36 = OpTypePointer UniformConstant %35
%37 = OpVariable %36 UniformConstant
%38 = OpTypeImage %9 Buffer 0 0 0 2 Unknown
%39 = OpTypePointer UniformConstant %38
%40 = OpVariable %39 UniformConstant
%41 = OpTypeImage %13 Buffer 0 0 0 2 Unknown
%42 = OpTypePointer UniformConstant %41
%43 = OpVariable %42 UniformConstant
%44 = OpTypeSampler
%45 = OpTypePointer UniformConstant %44
%46 = OpVariable %45 UniformConstant
%47 = OpVariable %45 UniformConstant
%48 = OpTypeVector %5 2
%49 = OpTypePointer Input %48
%50 = OpVariable %49 Input
%51 = OpTypeVector %5 4
%52 = OpTypePointer Output %51
%53 = OpVariable %52 Output
%54 = OpTypeVector %9 4
%55 = OpTypePointer Output %54
%56 = OpVariable %55 Output
%57 = OpTypeVector %13 4
%58 = OpTypePointer Output %57
%59 = OpVariable %58 Output
%74 = OpTypePointer Input %5
%76 = OpConstant %13 0
%79 = OpConstant %13 1
%81 = OpTypeFloat 16
%86 = OpTypeVector %13 2
%88 = OpTypeVector %81 4
%91 = OpTypeInt 16 0
%95 = OpTypeVector %91 4
%103 = OpConstant %81 0x1p+3
%106 = OpConstant %91 65516
%109 = OpConstant %91 80
%112 = OpTypeSampledImage %6
%114 = OpConstant %5 0
%122 = OpConstant %13 3
%123 = OpConstant %13 2
%131 = OpConstant %13 6
%132 = OpConstant %13 4
%133 = OpConstant %13 5
%152 = OpTypeSampledImage %10
%165 = OpTypeSampledImage %14
%178 = OpTypeImage %5 2D 1 0 0 1 Unknown
%179 = OpTypeSampledImage %178
%181 = OpConstant %5 0.5
%228 = OpConstant %5 0.200000003
%229 = OpConstant %5 0.300000012
%230 = OpConstant %5 0.400000006
%293 = OpTypePointer Output %5
%302 = OpTypePointer Output %9
%311 = OpTypePointer Output %13
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %320
%320 = OpLabel
%60 = OpLoad %41 %43
%61 = OpLoad %38 %40
%62 = OpLoad %35 %37
%63 = OpLoad %32 %34
%64 = OpLoad %29 %31
%65 = OpLoad %26 %28
%66 = OpLoad %23 %25
%67 = OpLoad %20 %22
%68 = OpLoad %17 %19
%69 = OpLoad %14 %16
%70 = OpLoad %10 %12
%71 = OpLoad %6 %8
%72 = OpLoad %44 %47
%73 = OpLoad %44 %46
%75 = OpAccessChain %74 %50 %76
%77 = OpLoad %5 %75
%78 = OpAccessChain %74 %50 %79
%80 = OpLoad %5 %78
%82 = OpFConvert %81 %77
%83 = OpFConvert %81 %80
%84 = OpConvertFToS %13 %77
%85 = OpConvertFToS %13 %80
%87 = OpCompositeConstruct %86 %84 %85
%89 = OpCompositeConstruct %88 %82 %83 %82 %83
%90 = OpFConvert %51 %89
OpImageWrite %65 %87 %90
%92 = OpConvertFToS %91 %77
%93 = OpConvertFToS %91 %80
%94 = OpCompositeConstruct %86 %84 %85
%96 = OpCompositeConstruct %95 %92 %93 %92 %93
%97 = OpSConvert %54 %96
OpImageWrite %64 %94 %97
%98 = OpConvertFToU %91 %77
%99 = OpConvertFToU %91 %80
%100 = OpCompositeConstruct %86 %84 %85
%101 = OpCompositeConstruct %95 %98 %99 %98 %99
%102 = OpUConvert %57 %101
OpImageWrite %63 %100 %102
%104 = OpCompositeConstruct %88 %103 %103 %103 %103
%105 = OpFConvert %51 %104
OpImageWrite %62 %84 %105
%107 = OpCompositeConstruct %95 %106 %106 %106 %106
%108 = OpSConvert %54 %107
OpImageWrite %61 %84 %108
%110 = OpCompositeConstruct %95 %109 %109 %109 %109
%111 = OpUConvert %57 %110
OpImageWrite %60 %84 %111
%113 = OpSampledImage %112 %71 %73
%116 = OpCompositeConstruct %48 %77 %80
%115 = OpImageSampleImplicitLod %51 %113 %116 None
%117 = OpFConvert %88 %115
%118 = OpCompositeExtract %81 %117 0
%119 = OpCompositeExtract %81 %117 1
%120 = OpCompositeExtract %81 %117 2
%121 = OpCompositeExtract %81 %117 3
%125 = OpCompositeConstruct %86 %79 %123
%124 = OpImageFetch %54 %70 %125 Lod %122
%126 = OpSConvert %95 %124
%127 = OpCompositeExtract %91 %126 0
%128 = OpCompositeExtract %91 %126 1
%129 = OpCompositeExtract %91 %126 2
%130 = OpCompositeExtract %91 %126 3
%135 = OpCompositeConstruct %86 %132 %133
%134 = OpImageFetch %57 %69 %135 Lod %131
%136 = OpUConvert %95 %134
%137 = OpCompositeExtract %91 %136 0
%138 = OpCompositeExtract %91 %136 1
%139 = OpCompositeExtract %91 %136 2
%140 = OpCompositeExtract %91 %136 3
%141 = OpCompositeConstruct %48 %77 %80
%142 = OpImageGather %51 %113 %141 %76
%143 = OpFConvert %88 %142
%144 = OpCompositeExtract %81 %143 0
%145 = OpCompositeExtract %81 %143 1
%146 = OpCompositeExtract %81 %143 2
%147 = OpCompositeExtract %81 %143 3
%148 = OpFAdd %81 %144 %118
%149 = OpFAdd %81 %145 %119
%150 = OpFAdd %81 %146 %120
%151 = OpFAdd %81 %147 %121
%153 = OpSampledImage %152 %70 %73
%154 = OpCompositeConstruct %48 %77 %80
%155 = OpImageGather %54 %153 %154 %79
%156 = OpSConvert %95 %155
%157 = OpCompositeExtract %91 %156 0
%158 = OpCompositeExtract %91 %156 1
%159 = OpCompositeExtract %91 %156 2
%160 = OpCompositeExtract %91 %156 3
%161 = OpIAdd %91 %157 %127
%162 = OpIAdd %91 %158 %128
%163 = OpIAdd %91 %159 %129
%164 = OpIAdd %91 %160 %130
%166 = OpSampledImage %165 %69 %73
%167 = OpCompositeConstruct %48 %77 %80
%168 = OpImageGather %57 %166 %167 %123
%169 = OpUConvert %95 %168
%170 = OpCompositeExtract %91 %169 0
%171 = OpCompositeExtract %91 %169 1
%172 = OpCompositeExtract %91 %169 2
%173 = OpCompositeExtract %91 %169 3
%174 = OpIAdd %91 %170 %137
%175 = OpIAdd %91 %171 %138
%176 = OpIAdd %91 %172 %139
%177 = OpIAdd %91 %173 %140
%180 = OpSampledImage %179 %71 %72
%183 = OpCompositeConstruct %48 %77 %80
%182 = OpImageSampleDrefImplicitLod %5 %180 %183 %181 None
%184 = OpCompositeConstruct %51 %182 %182 %182 %182
%185 = OpCompositeExtract %5 %184 0
%186 = OpFConvert %5 %148
%187 = OpFConvert %5 %149
%188 = OpFConvert %5 %150
%189 = OpFConvert %5 %151
%190 = OpFAdd %5 %185 %186
%191 = OpFAdd %5 %185 %187
%192 = OpFAdd %5 %185 %188
%193 = OpFAdd %5 %185 %189
%194 = OpFConvert %81 %190
%195 = OpFConvert %81 %191
%196 = OpFConvert %81 %192
%197 = OpFConvert %81 %193
%199 = OpCompositeConstruct %48 %77 %80
%198 = OpImageSampleDrefExplicitLod %5 %180 %199 %181 Lod %114
%200 = OpCompositeConstruct %51 %198 %198 %198 %198
%201 = OpCompositeExtract %5 %200 0
%202 = OpFConvert %5 %194
%203 = OpFConvert %5 %195
%204 = OpFConvert %5 %196
%205 = OpFConvert %5 %197
%206 = OpFAdd %5 %202 %201
%207 = OpFAdd %5 %203 %201
%208 = OpFAdd %5 %204 %201
%209 = OpFAdd %5 %205 %201
%210 = OpFConvert %81 %206
%211 = OpFConvert %81 %207
%212 = OpFConvert %81 %208
%213 = OpFConvert %81 %209
%214 = OpCompositeConstruct %48 %77 %80
%215 = OpImageDrefGather %51 %180 %214 %181
%216 = OpFConvert %88 %215
%217 = OpCompositeExtract %81 %216 0
%218 = OpCompositeExtract %81 %216 1
%219 = OpCompositeExtract %81 %216 2
%220 = OpCompositeExtract %81 %216 3
%222 = OpCompositeConstruct %48 %77 %80
%221 = OpImageSampleExplicitLod %51 %113 %222 Lod %114
%223 = OpFConvert %88 %221
%224 = OpCompositeExtract %81 %223 0
%225 = OpCompositeExtract %81 %223 1
%226 = OpCompositeExtract %81 %223 2
%227 = OpCompositeExtract %81 %223 3
%232 = OpCompositeConstruct %48 %77 %80
%233 = OpCompositeConstruct %48 %228 %229
%234 = OpCompositeConstruct %48 %230 %181
%231 = OpImageSampleExplicitLod %51 %113 %232 Grad %233 %234
%235 = OpFConvert %88 %231
%236 = OpCompositeExtract %81 %235 0
%237 = OpCompositeExtract %81 %235 1
%238 = OpCompositeExtract %81 %235 2
%239 = OpCompositeExtract %81 %235 3
%241 = OpCompositeConstruct %48 %77 %80
%240 = OpImageSampleImplicitLod %51 %113 %241 Bias %181
%242 = OpFConvert %88 %240
%243 = OpCompositeExtract %81 %242 0
%244 = OpCompositeExtract %81 %242 1
%245 = OpCompositeExtract %81 %242 2
%246 = OpCompositeExtract %81 %242 3
%247 = OpImageFetch %51 %68 %84
%248 = OpFConvert %88 %247
%249 = OpCompositeExtract %81 %248 0
%250 = OpCompositeExtract %81 %248 1
%251 = OpCompositeExtract %81 %248 2
%252 = OpCompositeExtract %81 %248 3
%253 = OpFAdd %81 %224 %217
%254 = OpFAdd %81 %253 %236
%255 = OpFAdd %81 %254 %210
%256 = OpFAdd %81 %255 %243
%257 = OpFAdd %81 %256 %249
%258 = OpFAdd %81 %225 %218
%259 = OpFAdd %81 %258 %237
%260 = OpFAdd %81 %259 %211
%261 = OpFAdd %81 %260 %244
%262 = OpFAdd %81 %261 %250
%263 = OpFAdd %81 %226 %219
%264 = OpFAdd %81 %263 %238
%265 = OpFAdd %81 %264 %212
%266 = OpFAdd %81 %265 %245
%267 = OpFAdd %81 %266 %251
%268 = OpFAdd %81 %227 %220
%269 = OpFAdd %81 %268 %239
%270 = OpFAdd %81 %269 %213
%271 = OpFAdd %81 %270 %246
%272 = OpFAdd %81 %271 %252
%273 = OpImageFetch %54 %67 %84
%274 = OpSConvert %95 %273
%275 = OpCompositeExtract %91 %274 0
%276 = OpCompositeExtract %91 %274 1
%277 = OpCompositeExtract %91 %274 2
%278 = OpCompositeExtract %91 %274 3
%279 = OpIAdd %91 %161 %275
%280 = OpIAdd %91 %162 %276
%281 = OpIAdd %91 %163 %277
%282 = OpIAdd %91 %164 %278
%283 = OpImageFetch %57 %66 %84
%284 = OpUConvert %95 %283
%285 = OpCompositeExtract %91 %284 0
%286 = OpCompositeExtract %91 %284 1
%287 = OpCompositeExtract %91 %284 2
%288 = OpCompositeExtract %91 %284 3
%289 = OpIAdd %91 %174 %285
%290 = OpIAdd %91 %175 %286
%291 = OpIAdd %91 %176 %287
%292 = OpIAdd %91 %177 %288
%294 = OpAccessChain %293 %53 %76
%295 = OpFConvert %5 %257
OpStore %294 %295
%296 = OpAccessChain %293 %53 %79
%297 = OpFConvert %5 %262
OpStore %296 %297
%298 = OpAccessChain %293 %53 %123
%299 = OpFConvert %5 %267
OpStore %298 %299
%300 = OpAccessChain %293 %53 %122
%301 = OpFConvert %5 %272
OpStore %300 %301
%303 = OpAccessChain %302 %56 %76
%304 = OpSConvert %9 %279
OpStore %303 %304
%305 = OpAccessChain %302 %56 %79
%306 = OpSConvert %9 %280
OpStore %305 %306
%307 = OpAccessChain %302 %56 %123
%308 = OpSConvert %9 %281
OpStore %307 %308
%309 = OpAccessChain %302 %56 %122
%310 = OpSConvert %9 %282
OpStore %309 %310
%312 = OpAccessChain %311 %59 %76
%313 = OpUConvert %13 %289
OpStore %312 %313
%314 = OpAccessChain %311 %59 %79
%315 = OpUConvert %13 %290
OpStore %314 %315
%316 = OpAccessChain %311 %59 %123
%317 = OpUConvert %13 %291
OpStore %316 %317
%318 = OpAccessChain %311 %59 %122
%319 = OpUConvert %13 %292
OpStore %318 %319
OpReturn
OpFunctionEnd
#endif
