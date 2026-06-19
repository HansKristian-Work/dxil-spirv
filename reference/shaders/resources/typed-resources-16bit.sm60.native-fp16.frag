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
    uvec4 _126 = uvec4(texelFetch(_12, ivec2(uvec2(1u, 2u)), int(3u)));
    mediump uvec4 _138 = texelFetch(_16, ivec2(uvec2(4u, 5u)), int(6u));
    f16vec4 _150 = f16vec4(textureGather(sampler2D(_8, _46), vec2(UV.x, UV.y)));
    u16vec4 _163 = u16vec4(textureGather(isampler2D(_12, _46), vec2(UV.x, UV.y), int(1u)));
    u16vec4 _176 = u16vec4(textureGather(usampler2D(_16, _46), vec2(UV.x, UV.y), int(2u)));
    mediump vec4 _191 = vec4(texture(sampler2DShadow(_8, _47), vec3(vec2(UV.x, UV.y), 0.5)));
    mediump float _192 = _191.x;
    mediump vec4 _207 = vec4(textureLod(sampler2DShadow(_8, _47), vec3(vec2(UV.x, UV.y), 0.5), 0.0));
    mediump float _208 = _207.x;
    vec2 _221 = vec2(UV.x, UV.y);
    f16vec4 _223 = f16vec4(textureGather(sampler2DShadow(_8, _47), _221, 0.5));
    f16vec4 _230 = f16vec4(textureLod(sampler2D(_8, _46), vec2(UV.x, UV.y), 0.0));
    f16vec4 _242 = f16vec4(textureGrad(sampler2D(_8, _46), vec2(UV.x, UV.y), vec2(0.20000000298023223876953125, 0.300000011920928955078125), vec2(0.4000000059604644775390625, 0.5)));
    f16vec4 _249 = f16vec4(texture(sampler2D(_8, _46), vec2(UV.x, UV.y), 0.5));
    mediump vec4 _254 = texelFetch(_19, int(_84));
    uvec4 _284 = uvec4(texelFetch(_22, int(_84)));
    mediump uvec4 _297 = texelFetch(_25, int(_84));
    SV_Target.x = float(((((_230.x + _223.x) + _242.x) + float16_t(float(float16_t(_192 + float(_150.x + _117.x))) + _208)) + _249.x) + float16_t(_254.x));
    SV_Target.y = float(((((_230.y + _223.y) + _242.y) + float16_t(float(float16_t(_192 + float(_150.y + _117.y))) + _208)) + _249.y) + float16_t(_254.y));
    SV_Target.z = float(((((_230.z + _223.z) + _242.z) + float16_t(float(float16_t(_192 + float(_150.z + _117.z))) + _208)) + _249.z) + float16_t(_254.z));
    SV_Target.w = float(((((_230.w + _223.w) + _242.w) + float16_t(float(float16_t(_192 + float(_150.w + _117.w))) + _208)) + _249.w) + float16_t(_254.w));
    SV_Target_1.x = int(int16_t((_163.x + uint16_t(_126.x)) + uint16_t(_284.x)));
    SV_Target_1.y = int(int16_t((_163.y + uint16_t(_126.y)) + uint16_t(_284.y)));
    SV_Target_1.z = int(int16_t((_163.z + uint16_t(_126.z)) + uint16_t(_284.z)));
    SV_Target_1.w = int(int16_t((_163.w + uint16_t(_126.w)) + uint16_t(_284.w)));
    SV_Target_2.x = uint((_176.x + uint16_t(_138.x)) + uint16_t(_297.x));
    SV_Target_2.y = uint((_176.y + uint16_t(_138.y)) + uint16_t(_297.y));
    SV_Target_2.z = uint((_176.z + uint16_t(_138.z)) + uint16_t(_297.z));
    SV_Target_2.w = uint((_176.w + uint16_t(_138.w)) + uint16_t(_297.w));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 340
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpCapability DenormPreserve
OpCapability FloatControls2
OpExtension "SPV_KHR_float_controls"
OpExtension "SPV_KHR_float_controls2"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %50 %53 %56 %59
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpExecutionModeId %3 FPFastMathDefault %5 %337
OpExecutionModeId %3 FPFastMathDefault %81 %337
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
OpDecorate %209 FPFastMathMode AllowRecip
OpDecorate %210 FPFastMathMode AllowRecip
OpDecorate %211 FPFastMathMode AllowRecip
OpDecorate %212 FPFastMathMode AllowRecip
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
%135 = OpConstant %13 6
%136 = OpConstant %13 4
%137 = OpConstant %13 5
%159 = OpTypeSampledImage %10
%172 = OpTypeSampledImage %14
%185 = OpTypeImage %5 2D 1 0 0 1 Unknown
%186 = OpTypeSampledImage %185
%188 = OpConstant %5 0.5
%235 = OpConstant %5 0.200000003
%236 = OpConstant %5 0.300000012
%237 = OpConstant %5 0.400000006
%310 = OpTypePointer Output %5
%319 = OpTypePointer Output %9
%328 = OpTypePointer Output %13
%337 = OpConstant %13 458767
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %338
%338 = OpLabel
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
%126 = OpBitcast %57 %124
%127 = OpCompositeExtract %13 %126 0
%128 = OpCompositeExtract %13 %126 1
%129 = OpCompositeExtract %13 %126 2
%130 = OpCompositeExtract %13 %126 3
%131 = OpUConvert %91 %127
%132 = OpUConvert %91 %128
%133 = OpUConvert %91 %129
%134 = OpUConvert %91 %130
%139 = OpCompositeConstruct %86 %136 %137
%138 = OpImageFetch %57 %69 %139 Lod %135
%140 = OpCompositeExtract %13 %138 0
%141 = OpCompositeExtract %13 %138 1
%142 = OpCompositeExtract %13 %138 2
%143 = OpCompositeExtract %13 %138 3
%144 = OpUConvert %91 %140
%145 = OpUConvert %91 %141
%146 = OpUConvert %91 %142
%147 = OpUConvert %91 %143
%148 = OpCompositeConstruct %48 %77 %80
%149 = OpImageGather %51 %113 %148 %76
%150 = OpFConvert %88 %149
%151 = OpCompositeExtract %81 %150 0
%152 = OpCompositeExtract %81 %150 1
%153 = OpCompositeExtract %81 %150 2
%154 = OpCompositeExtract %81 %150 3
%155 = OpFAdd %81 %151 %118
%156 = OpFAdd %81 %152 %119
%157 = OpFAdd %81 %153 %120
%158 = OpFAdd %81 %154 %121
%160 = OpSampledImage %159 %70 %73
%161 = OpCompositeConstruct %48 %77 %80
%162 = OpImageGather %54 %160 %161 %79
%163 = OpSConvert %95 %162
%164 = OpCompositeExtract %91 %163 0
%165 = OpCompositeExtract %91 %163 1
%166 = OpCompositeExtract %91 %163 2
%167 = OpCompositeExtract %91 %163 3
%168 = OpIAdd %91 %164 %131
%169 = OpIAdd %91 %165 %132
%170 = OpIAdd %91 %166 %133
%171 = OpIAdd %91 %167 %134
%173 = OpSampledImage %172 %69 %73
%174 = OpCompositeConstruct %48 %77 %80
%175 = OpImageGather %57 %173 %174 %123
%176 = OpUConvert %95 %175
%177 = OpCompositeExtract %91 %176 0
%178 = OpCompositeExtract %91 %176 1
%179 = OpCompositeExtract %91 %176 2
%180 = OpCompositeExtract %91 %176 3
%181 = OpIAdd %91 %177 %144
%182 = OpIAdd %91 %178 %145
%183 = OpIAdd %91 %179 %146
%184 = OpIAdd %91 %180 %147
%187 = OpSampledImage %186 %71 %72
%190 = OpCompositeConstruct %48 %77 %80
%189 = OpImageSampleDrefImplicitLod %5 %187 %190 %188 None
%191 = OpCompositeConstruct %51 %189 %189 %189 %189
%192 = OpCompositeExtract %5 %191 0
%193 = OpFConvert %5 %155
%194 = OpFConvert %5 %156
%195 = OpFConvert %5 %157
%196 = OpFConvert %5 %158
%197 = OpFAdd %5 %192 %193
%198 = OpFAdd %5 %192 %194
%199 = OpFAdd %5 %192 %195
%200 = OpFAdd %5 %192 %196
%201 = OpFConvert %81 %197
%202 = OpFConvert %81 %198
%203 = OpFConvert %81 %199
%204 = OpFConvert %81 %200
%206 = OpCompositeConstruct %48 %77 %80
%205 = OpImageSampleDrefExplicitLod %5 %187 %206 %188 Lod %114
%207 = OpCompositeConstruct %51 %205 %205 %205 %205
%208 = OpCompositeExtract %5 %207 0
%209 = OpFConvert %5 %201
%210 = OpFConvert %5 %202
%211 = OpFConvert %5 %203
%212 = OpFConvert %5 %204
%213 = OpFAdd %5 %209 %208
%214 = OpFAdd %5 %210 %208
%215 = OpFAdd %5 %211 %208
%216 = OpFAdd %5 %212 %208
%217 = OpFConvert %81 %213
%218 = OpFConvert %81 %214
%219 = OpFConvert %81 %215
%220 = OpFConvert %81 %216
%221 = OpCompositeConstruct %48 %77 %80
%222 = OpImageDrefGather %51 %187 %221 %188
%223 = OpFConvert %88 %222
%224 = OpCompositeExtract %81 %223 0
%225 = OpCompositeExtract %81 %223 1
%226 = OpCompositeExtract %81 %223 2
%227 = OpCompositeExtract %81 %223 3
%229 = OpCompositeConstruct %48 %77 %80
%228 = OpImageSampleExplicitLod %51 %113 %229 Lod %114
%230 = OpFConvert %88 %228
%231 = OpCompositeExtract %81 %230 0
%232 = OpCompositeExtract %81 %230 1
%233 = OpCompositeExtract %81 %230 2
%234 = OpCompositeExtract %81 %230 3
%239 = OpCompositeConstruct %48 %77 %80
%240 = OpCompositeConstruct %48 %235 %236
%241 = OpCompositeConstruct %48 %237 %188
%238 = OpImageSampleExplicitLod %51 %113 %239 Grad %240 %241
%242 = OpFConvert %88 %238
%243 = OpCompositeExtract %81 %242 0
%244 = OpCompositeExtract %81 %242 1
%245 = OpCompositeExtract %81 %242 2
%246 = OpCompositeExtract %81 %242 3
%248 = OpCompositeConstruct %48 %77 %80
%247 = OpImageSampleImplicitLod %51 %113 %248 Bias %188
%249 = OpFConvert %88 %247
%250 = OpCompositeExtract %81 %249 0
%251 = OpCompositeExtract %81 %249 1
%252 = OpCompositeExtract %81 %249 2
%253 = OpCompositeExtract %81 %249 3
%254 = OpImageFetch %51 %68 %84
%255 = OpCompositeExtract %5 %254 0
%256 = OpCompositeExtract %5 %254 1
%257 = OpCompositeExtract %5 %254 2
%258 = OpCompositeExtract %5 %254 3
%259 = OpFConvert %81 %255
%260 = OpFConvert %81 %256
%261 = OpFConvert %81 %257
%262 = OpFConvert %81 %258
%263 = OpFAdd %81 %231 %224
%264 = OpFAdd %81 %263 %243
%265 = OpFAdd %81 %264 %217
%266 = OpFAdd %81 %265 %250
%267 = OpFAdd %81 %266 %259
%268 = OpFAdd %81 %232 %225
%269 = OpFAdd %81 %268 %244
%270 = OpFAdd %81 %269 %218
%271 = OpFAdd %81 %270 %251
%272 = OpFAdd %81 %271 %260
%273 = OpFAdd %81 %233 %226
%274 = OpFAdd %81 %273 %245
%275 = OpFAdd %81 %274 %219
%276 = OpFAdd %81 %275 %252
%277 = OpFAdd %81 %276 %261
%278 = OpFAdd %81 %234 %227
%279 = OpFAdd %81 %278 %246
%280 = OpFAdd %81 %279 %220
%281 = OpFAdd %81 %280 %253
%282 = OpFAdd %81 %281 %262
%283 = OpImageFetch %54 %67 %84
%284 = OpBitcast %57 %283
%285 = OpCompositeExtract %13 %284 0
%286 = OpCompositeExtract %13 %284 1
%287 = OpCompositeExtract %13 %284 2
%288 = OpCompositeExtract %13 %284 3
%289 = OpUConvert %91 %285
%290 = OpUConvert %91 %286
%291 = OpUConvert %91 %287
%292 = OpUConvert %91 %288
%293 = OpIAdd %91 %168 %289
%294 = OpIAdd %91 %169 %290
%295 = OpIAdd %91 %170 %291
%296 = OpIAdd %91 %171 %292
%297 = OpImageFetch %57 %66 %84
%298 = OpCompositeExtract %13 %297 0
%299 = OpCompositeExtract %13 %297 1
%300 = OpCompositeExtract %13 %297 2
%301 = OpCompositeExtract %13 %297 3
%302 = OpUConvert %91 %298
%303 = OpUConvert %91 %299
%304 = OpUConvert %91 %300
%305 = OpUConvert %91 %301
%306 = OpIAdd %91 %181 %302
%307 = OpIAdd %91 %182 %303
%308 = OpIAdd %91 %183 %304
%309 = OpIAdd %91 %184 %305
%311 = OpAccessChain %310 %53 %76
%312 = OpFConvert %5 %267
OpStore %311 %312
%313 = OpAccessChain %310 %53 %79
%314 = OpFConvert %5 %272
OpStore %313 %314
%315 = OpAccessChain %310 %53 %123
%316 = OpFConvert %5 %277
OpStore %315 %316
%317 = OpAccessChain %310 %53 %122
%318 = OpFConvert %5 %282
OpStore %317 %318
%320 = OpAccessChain %319 %56 %76
%321 = OpSConvert %9 %293
OpStore %320 %321
%322 = OpAccessChain %319 %56 %79
%323 = OpSConvert %9 %294
OpStore %322 %323
%324 = OpAccessChain %319 %56 %123
%325 = OpSConvert %9 %295
OpStore %324 %325
%326 = OpAccessChain %319 %56 %122
%327 = OpSConvert %9 %296
OpStore %326 %327
%329 = OpAccessChain %328 %59 %76
%330 = OpUConvert %13 %306
OpStore %329 %330
%331 = OpAccessChain %328 %59 %79
%332 = OpUConvert %13 %307
OpStore %331 %332
%333 = OpAccessChain %328 %59 %123
%334 = OpUConvert %13 %308
OpStore %333 %334
%335 = OpAccessChain %328 %59 %122
%336 = OpUConvert %13 %309
OpStore %335 %336
OpReturn
OpFunctionEnd
#endif
