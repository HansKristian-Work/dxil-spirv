#version 460
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
    uint _81 = uint(int(UV.x));
    uint _82 = uint(int(UV.y));
    imageStore(_28, ivec2(uvec2(_81, _82)), vec4(UV.x, UV.y, UV.x, UV.y));
    uint _86 = uint(int(UV.x));
    uint _87 = uint(int(UV.y));
    imageStore(_31, ivec2(uvec2(_81, _82)), ivec4(uvec4(_86, _87, _86, _87)));
    uint _91 = uint(UV.x);
    uint _92 = uint(UV.y);
    imageStore(_34, ivec2(uvec2(_81, _82)), uvec4(_91, _92, _91, _92));
    imageStore(_37, int(_81), vec4(8.0));
    imageStore(_40, int(_81), ivec4(uvec4(4294967276u)));
    imageStore(_43, int(_81), uvec4(80u));
    mediump vec4 _105 = texture(sampler2D(_8, _46), vec2(UV.x, UV.y));
    mediump float _107 = _105.x;
    float hp_copy_107 = _107;
    mediump float _108 = _105.y;
    float hp_copy_108 = _108;
    mediump float _109 = _105.z;
    float hp_copy_109 = _109;
    mediump float _110 = _105.w;
    float hp_copy_110 = _110;
    uvec4 _115 = uvec4(texelFetch(_12, ivec2(uvec2(1u, 2u)), int(3u)));
    mediump uvec4 _123 = texelFetch(_16, ivec2(uvec2(4u, 5u)), int(6u));
    mediump uint _125 = _123.x;
    uint hp_copy_125 = _125;
    mediump uint _126 = _123.y;
    uint hp_copy_126 = _126;
    mediump uint _127 = _123.z;
    uint hp_copy_127 = _127;
    mediump uint _128 = _123.w;
    uint hp_copy_128 = _128;
    mediump vec4 _130 = textureGather(sampler2D(_8, _46), vec2(UV.x, UV.y));
    mediump float _131 = _130.x;
    float hp_copy_131 = _131;
    mediump float _132 = _130.y;
    float hp_copy_132 = _132;
    mediump float _133 = _130.z;
    float hp_copy_133 = _133;
    mediump float _134 = _130.w;
    float hp_copy_134 = _134;
    uvec4 _143 = uvec4(textureGather(isampler2D(_12, _46), vec2(UV.x, UV.y), int(1u)));
    mediump uvec4 _155 = textureGather(usampler2D(_16, _46), vec2(UV.x, UV.y), int(2u));
    mediump uint _156 = _155.x;
    uint hp_copy_156 = _156;
    mediump uint _157 = _155.y;
    uint hp_copy_157 = _157;
    mediump uint _158 = _155.z;
    uint hp_copy_158 = _158;
    mediump uint _159 = _155.w;
    uint hp_copy_159 = _159;
    mediump vec4 _170 = vec4(texture(sampler2DShadow(_8, _47), vec3(vec2(UV.x, UV.y), 0.5)));
    mediump float _171 = _170.x;
    mediump vec4 _178 = vec4(textureLod(sampler2DShadow(_8, _47), vec3(vec2(UV.x, UV.y), 0.5), 0.0));
    mediump float _179 = _178.x;
    vec2 _184 = vec2(UV.x, UV.y);
    mediump vec4 _185 = textureGather(sampler2DShadow(_8, _47), _184, 0.5);
    mediump vec4 _194 = textureLod(sampler2D(_8, _46), vec2(UV.x, UV.y), 0.0);
    mediump vec4 _207 = textureGrad(sampler2D(_8, _46), vec2(UV.x, UV.y), vec2(0.20000000298023223876953125, 0.300000011920928955078125), vec2(0.4000000059604644775390625, 0.5));
    mediump vec4 _219 = texture(sampler2D(_8, _46), vec2(UV.x, UV.y), 0.5);
    mediump vec4 _229 = texelFetch(_19, int(_81));
    uvec4 _239 = uvec4(texelFetch(_22, int(_81)));
    mediump uvec4 _248 = texelFetch(_25, int(_81));
    SV_Target.x = ((((_185.x + (_179 + (_171 + (hp_copy_131 + hp_copy_107)))) + _194.x) + _207.x) + _219.x) + _229.x;
    SV_Target.y = ((((_185.y + (_179 + (_171 + (hp_copy_132 + hp_copy_108)))) + _194.y) + _207.y) + _219.y) + _229.y;
    SV_Target.z = ((((_185.z + (_179 + (_171 + (hp_copy_133 + hp_copy_109)))) + _194.z) + _207.z) + _219.z) + _229.z;
    SV_Target.w = ((((_185.w + (_179 + (_171 + (hp_copy_134 + hp_copy_110)))) + _194.w) + _207.w) + _219.w) + _229.w;
    SV_Target_1.x = int((_143.x + _115.x) + _239.x);
    SV_Target_1.y = int((_143.y + _115.y) + _239.y);
    SV_Target_1.z = int((_143.z + _115.z) + _239.z);
    SV_Target_1.w = int((_143.w + _115.w) + _239.w);
    SV_Target_2.x = (hp_copy_156 + hp_copy_125) + _248.x;
    SV_Target_2.y = (hp_copy_157 + hp_copy_126) + _248.y;
    SV_Target_2.z = (hp_copy_158 + hp_copy_127) + _248.z;
    SV_Target_2.w = (hp_copy_159 + hp_copy_128) + _248.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 278
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %50 %53 %56 %59
OpExecutionMode %3 OriginUpperLeft
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
%83 = OpTypeVector %13 2
%95 = OpConstant %5 8
%97 = OpConstant %13 4294967276
%100 = OpConstant %13 80
%102 = OpTypeSampledImage %6
%104 = OpConstant %5 0
%111 = OpConstant %13 3
%112 = OpConstant %13 2
%120 = OpConstant %13 6
%121 = OpConstant %13 4
%122 = OpConstant %13 5
%139 = OpTypeSampledImage %10
%152 = OpTypeSampledImage %14
%164 = OpTypeImage %5 2D 1 0 0 1 Unknown
%165 = OpTypeSampledImage %164
%167 = OpConstant %5 0.5
%204 = OpConstant %5 0.200000003
%205 = OpConstant %5 0.300000012
%206 = OpConstant %5 0.400000006
%257 = OpTypePointer Output %5
%262 = OpTypePointer Output %9
%271 = OpTypePointer Output %13
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %276
%276 = OpLabel
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
%81 = OpConvertFToS %13 %77
%82 = OpConvertFToS %13 %80
%84 = OpCompositeConstruct %83 %81 %82
%85 = OpCompositeConstruct %51 %77 %80 %77 %80
OpImageWrite %65 %84 %85
%86 = OpConvertFToS %13 %77
%87 = OpConvertFToS %13 %80
%88 = OpCompositeConstruct %83 %81 %82
%89 = OpCompositeConstruct %57 %86 %87 %86 %87
%90 = OpBitcast %54 %89
OpImageWrite %64 %88 %90
%91 = OpConvertFToU %13 %77
%92 = OpConvertFToU %13 %80
%93 = OpCompositeConstruct %83 %81 %82
%94 = OpCompositeConstruct %57 %91 %92 %91 %92
OpImageWrite %63 %93 %94
%96 = OpCompositeConstruct %51 %95 %95 %95 %95
OpImageWrite %62 %81 %96
%98 = OpCompositeConstruct %57 %97 %97 %97 %97
%99 = OpBitcast %54 %98
OpImageWrite %61 %81 %99
%101 = OpCompositeConstruct %57 %100 %100 %100 %100
OpImageWrite %60 %81 %101
%103 = OpSampledImage %102 %71 %73
%106 = OpCompositeConstruct %48 %77 %80
%105 = OpImageSampleImplicitLod %51 %103 %106 None
%107 = OpCompositeExtract %5 %105 0
%108 = OpCompositeExtract %5 %105 1
%109 = OpCompositeExtract %5 %105 2
%110 = OpCompositeExtract %5 %105 3
%114 = OpCompositeConstruct %83 %79 %112
%113 = OpImageFetch %54 %70 %114 Lod %111
%115 = OpBitcast %57 %113
%116 = OpCompositeExtract %13 %115 0
%117 = OpCompositeExtract %13 %115 1
%118 = OpCompositeExtract %13 %115 2
%119 = OpCompositeExtract %13 %115 3
%124 = OpCompositeConstruct %83 %121 %122
%123 = OpImageFetch %57 %69 %124 Lod %120
%125 = OpCompositeExtract %13 %123 0
%126 = OpCompositeExtract %13 %123 1
%127 = OpCompositeExtract %13 %123 2
%128 = OpCompositeExtract %13 %123 3
%129 = OpCompositeConstruct %48 %77 %80
%130 = OpImageGather %51 %103 %129 %76
%131 = OpCompositeExtract %5 %130 0
%132 = OpCompositeExtract %5 %130 1
%133 = OpCompositeExtract %5 %130 2
%134 = OpCompositeExtract %5 %130 3
%135 = OpFAdd %5 %131 %107
%136 = OpFAdd %5 %132 %108
%137 = OpFAdd %5 %133 %109
%138 = OpFAdd %5 %134 %110
%140 = OpSampledImage %139 %70 %73
%141 = OpCompositeConstruct %48 %77 %80
%142 = OpImageGather %54 %140 %141 %79
%143 = OpBitcast %57 %142
%144 = OpCompositeExtract %13 %143 0
%145 = OpCompositeExtract %13 %143 1
%146 = OpCompositeExtract %13 %143 2
%147 = OpCompositeExtract %13 %143 3
%148 = OpIAdd %13 %144 %116
%149 = OpIAdd %13 %145 %117
%150 = OpIAdd %13 %146 %118
%151 = OpIAdd %13 %147 %119
%153 = OpSampledImage %152 %69 %73
%154 = OpCompositeConstruct %48 %77 %80
%155 = OpImageGather %57 %153 %154 %112
%156 = OpCompositeExtract %13 %155 0
%157 = OpCompositeExtract %13 %155 1
%158 = OpCompositeExtract %13 %155 2
%159 = OpCompositeExtract %13 %155 3
%160 = OpIAdd %13 %156 %125
%161 = OpIAdd %13 %157 %126
%162 = OpIAdd %13 %158 %127
%163 = OpIAdd %13 %159 %128
%166 = OpSampledImage %165 %71 %72
%169 = OpCompositeConstruct %48 %77 %80
%168 = OpImageSampleDrefImplicitLod %5 %166 %169 %167 None
%170 = OpCompositeConstruct %51 %168 %168 %168 %168
%171 = OpCompositeExtract %5 %170 0
%172 = OpFAdd %5 %171 %135
%173 = OpFAdd %5 %171 %136
%174 = OpFAdd %5 %171 %137
%175 = OpFAdd %5 %171 %138
%177 = OpCompositeConstruct %48 %77 %80
%176 = OpImageSampleDrefExplicitLod %5 %166 %177 %167 Lod %104
%178 = OpCompositeConstruct %51 %176 %176 %176 %176
%179 = OpCompositeExtract %5 %178 0
%180 = OpFAdd %5 %179 %172
%181 = OpFAdd %5 %179 %173
%182 = OpFAdd %5 %179 %174
%183 = OpFAdd %5 %179 %175
%184 = OpCompositeConstruct %48 %77 %80
%185 = OpImageDrefGather %51 %166 %184 %167
%186 = OpCompositeExtract %5 %185 0
%187 = OpCompositeExtract %5 %185 1
%188 = OpCompositeExtract %5 %185 2
%189 = OpCompositeExtract %5 %185 3
%190 = OpFAdd %5 %186 %180
%191 = OpFAdd %5 %187 %181
%192 = OpFAdd %5 %188 %182
%193 = OpFAdd %5 %189 %183
%195 = OpCompositeConstruct %48 %77 %80
%194 = OpImageSampleExplicitLod %51 %103 %195 Lod %104
%196 = OpCompositeExtract %5 %194 0
%197 = OpCompositeExtract %5 %194 1
%198 = OpCompositeExtract %5 %194 2
%199 = OpCompositeExtract %5 %194 3
%200 = OpFAdd %5 %190 %196
%201 = OpFAdd %5 %191 %197
%202 = OpFAdd %5 %192 %198
%203 = OpFAdd %5 %193 %199
%208 = OpCompositeConstruct %48 %77 %80
%209 = OpCompositeConstruct %48 %204 %205
%210 = OpCompositeConstruct %48 %206 %167
%207 = OpImageSampleExplicitLod %51 %103 %208 Grad %209 %210
%211 = OpCompositeExtract %5 %207 0
%212 = OpCompositeExtract %5 %207 1
%213 = OpCompositeExtract %5 %207 2
%214 = OpCompositeExtract %5 %207 3
%215 = OpFAdd %5 %200 %211
%216 = OpFAdd %5 %201 %212
%217 = OpFAdd %5 %202 %213
%218 = OpFAdd %5 %203 %214
%220 = OpCompositeConstruct %48 %77 %80
%219 = OpImageSampleImplicitLod %51 %103 %220 Bias %167
%221 = OpCompositeExtract %5 %219 0
%222 = OpCompositeExtract %5 %219 1
%223 = OpCompositeExtract %5 %219 2
%224 = OpCompositeExtract %5 %219 3
%225 = OpFAdd %5 %215 %221
%226 = OpFAdd %5 %216 %222
%227 = OpFAdd %5 %217 %223
%228 = OpFAdd %5 %218 %224
%229 = OpImageFetch %51 %68 %81
%230 = OpCompositeExtract %5 %229 0
%231 = OpCompositeExtract %5 %229 1
%232 = OpCompositeExtract %5 %229 2
%233 = OpCompositeExtract %5 %229 3
%234 = OpFAdd %5 %225 %230
%235 = OpFAdd %5 %226 %231
%236 = OpFAdd %5 %227 %232
%237 = OpFAdd %5 %228 %233
%238 = OpImageFetch %54 %67 %81
%239 = OpBitcast %57 %238
%240 = OpCompositeExtract %13 %239 0
%241 = OpCompositeExtract %13 %239 1
%242 = OpCompositeExtract %13 %239 2
%243 = OpCompositeExtract %13 %239 3
%244 = OpIAdd %13 %148 %240
%245 = OpIAdd %13 %149 %241
%246 = OpIAdd %13 %150 %242
%247 = OpIAdd %13 %151 %243
%248 = OpImageFetch %57 %66 %81
%249 = OpCompositeExtract %13 %248 0
%250 = OpCompositeExtract %13 %248 1
%251 = OpCompositeExtract %13 %248 2
%252 = OpCompositeExtract %13 %248 3
%253 = OpIAdd %13 %160 %249
%254 = OpIAdd %13 %161 %250
%255 = OpIAdd %13 %162 %251
%256 = OpIAdd %13 %163 %252
%258 = OpAccessChain %257 %53 %76
OpStore %258 %234
%259 = OpAccessChain %257 %53 %79
OpStore %259 %235
%260 = OpAccessChain %257 %53 %112
OpStore %260 %236
%261 = OpAccessChain %257 %53 %111
OpStore %261 %237
%263 = OpAccessChain %262 %56 %76
%264 = OpBitcast %9 %244
OpStore %263 %264
%265 = OpAccessChain %262 %56 %79
%266 = OpBitcast %9 %245
OpStore %265 %266
%267 = OpAccessChain %262 %56 %112
%268 = OpBitcast %9 %246
OpStore %267 %268
%269 = OpAccessChain %262 %56 %111
%270 = OpBitcast %9 %247
OpStore %269 %270
%272 = OpAccessChain %271 %59 %76
OpStore %272 %253
%273 = OpAccessChain %271 %59 %79
OpStore %273 %254
%274 = OpAccessChain %271 %59 %112
OpStore %274 %255
%275 = OpAccessChain %271 %59 %111
OpStore %275 %256
OpReturn
OpFunctionEnd
#endif
