#version 460
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#extension GL_EXT_shader_16bit_storage : require
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
    mediump float _81 = UV.x;
    mediump float _82 = UV.y;
    uint _83 = uint(int(UV.x));
    uint _84 = uint(int(UV.y));
    imageStore(_28, ivec2(uvec2(_83, _84)), vec4(_81, _82, _81, _82));
    uint16_t _89 = uint16_t(int16_t(UV.x));
    uint16_t _90 = uint16_t(int16_t(UV.y));
    imageStore(_31, ivec2(uvec2(_83, _84)), ivec4(i16vec4(u16vec4(_89, _90, _89, _90))));
    uint16_t _95 = uint16_t(UV.x);
    uint16_t _96 = uint16_t(UV.y);
    imageStore(_34, ivec2(uvec2(_83, _84)), uvec4(u16vec4(_95, _96, _95, _96)));
    imageStore(_37, int(_83), vec4(8.0));
    imageStore(_40, int(_83), ivec4(i16vec4(u16vec4(65516us))));
    imageStore(_43, int(_83), uvec4(u16vec4(80us)));
    mediump vec4 _111 = texture(sampler2D(_8, _46), vec2(UV.x, UV.y));
    uvec4 _121 = uvec4(texelFetch(_12, ivec2(uvec2(1u, 2u)), int(3u)));
    mediump uvec4 _133 = texelFetch(_16, ivec2(uvec2(4u, 5u)), int(6u));
    mediump vec4 _144 = textureGather(sampler2D(_8, _46), vec2(UV.x, UV.y));
    mediump float _149 = _144.x + _111.x;
    float hp_copy_149 = _149;
    mediump float _150 = _144.y + _111.y;
    float hp_copy_150 = _150;
    mediump float _151 = _144.z + _111.z;
    float hp_copy_151 = _151;
    mediump float _152 = _144.w + _111.w;
    float hp_copy_152 = _152;
    u16vec4 _157 = u16vec4(textureGather(isampler2D(_12, _46), vec2(UV.x, UV.y), int(1u)));
    u16vec4 _170 = u16vec4(textureGather(usampler2D(_16, _46), vec2(UV.x, UV.y), int(2u)));
    mediump float _186 = vec4(texture(sampler2DShadow(_8, _47), vec3(vec2(UV.x, UV.y), 0.5))).x;
    float hp_copy_186 = _186;
    mediump float _191 = hp_copy_186 + hp_copy_149;
    float hp_copy_191 = _191;
    mediump float _192 = hp_copy_186 + hp_copy_150;
    float hp_copy_192 = _192;
    mediump float _193 = hp_copy_186 + hp_copy_151;
    float hp_copy_193 = _193;
    mediump float _194 = hp_copy_186 + hp_copy_152;
    float hp_copy_194 = _194;
    mediump float _198 = vec4(textureLod(sampler2DShadow(_8, _47), vec3(vec2(UV.x, UV.y), 0.5), 0.0)).x;
    float hp_copy_198 = _198;
    mediump float _203 = hp_copy_191 + hp_copy_198;
    mediump float _204 = hp_copy_192 + hp_copy_198;
    mediump float _205 = hp_copy_193 + hp_copy_198;
    mediump float _206 = hp_copy_194 + hp_copy_198;
    vec2 _207 = vec2(UV.x, UV.y);
    mediump vec4 _208 = textureGather(sampler2DShadow(_8, _47), _207, 0.5);
    mediump vec4 _213 = textureLod(sampler2D(_8, _46), vec2(UV.x, UV.y), 0.0);
    mediump vec4 _222 = textureGrad(sampler2D(_8, _46), vec2(UV.x, UV.y), vec2(0.20000000298023223876953125, 0.300000011920928955078125), vec2(0.4000000059604644775390625, 0.5));
    mediump vec4 _230 = texture(sampler2D(_8, _46), vec2(UV.x, UV.y), 0.5);
    mediump vec4 _236 = texelFetch(_19, int(_83));
    mediump float _241 = _236.x;
    mediump float _242 = _236.y;
    mediump float _243 = _236.z;
    mediump float _244 = _236.w;
    uvec4 _266 = uvec4(texelFetch(_22, int(_83)));
    mediump uvec4 _279 = texelFetch(_25, int(_83));
    SV_Target.x = ((((_213.x + _208.x) + _222.x) + _203) + _230.x) + _241;
    SV_Target.y = ((((_213.y + _208.y) + _222.y) + _204) + _230.y) + _242;
    SV_Target.z = ((((_213.z + _208.z) + _222.z) + _205) + _230.z) + _243;
    SV_Target.w = ((((_213.w + _208.w) + _222.w) + _206) + _230.w) + _244;
    SV_Target_1.x = int(int16_t((_157.x + uint16_t(_121.x)) + uint16_t(_266.x)));
    SV_Target_1.y = int(int16_t((_157.y + uint16_t(_121.y)) + uint16_t(_266.y)));
    SV_Target_1.z = int(int16_t((_157.z + uint16_t(_121.z)) + uint16_t(_266.z)));
    SV_Target_1.w = int(int16_t((_157.w + uint16_t(_121.w)) + uint16_t(_266.w)));
    SV_Target_2.x = uint((_170.x + uint16_t(_133.x)) + uint16_t(_279.x));
    SV_Target_2.y = uint((_170.y + uint16_t(_133.y)) + uint16_t(_279.y));
    SV_Target_2.z = uint((_170.z + uint16_t(_133.z)) + uint16_t(_279.z));
    SV_Target_2.w = uint((_170.w + uint16_t(_133.w)) + uint16_t(_279.w));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 317
; Schema: 0
OpCapability Shader
OpCapability Int16
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
OpDecorate %81 RelaxedPrecision
OpDecorate %82 RelaxedPrecision
OpDecorate %111 RelaxedPrecision
OpDecorate %113 RelaxedPrecision
OpDecorate %114 RelaxedPrecision
OpDecorate %115 RelaxedPrecision
OpDecorate %116 RelaxedPrecision
OpDecorate %144 RelaxedPrecision
OpDecorate %145 RelaxedPrecision
OpDecorate %146 RelaxedPrecision
OpDecorate %147 RelaxedPrecision
OpDecorate %148 RelaxedPrecision
OpDecorate %149 RelaxedPrecision
OpDecorate %150 RelaxedPrecision
OpDecorate %151 RelaxedPrecision
OpDecorate %152 RelaxedPrecision
OpDecorate %156 RelaxedPrecision
OpDecorate %169 RelaxedPrecision
OpDecorate %191 RelaxedPrecision
OpDecorate %192 RelaxedPrecision
OpDecorate %193 RelaxedPrecision
OpDecorate %194 RelaxedPrecision
OpDecorate %203 RelaxedPrecision
OpDecorate %204 RelaxedPrecision
OpDecorate %205 RelaxedPrecision
OpDecorate %206 RelaxedPrecision
OpDecorate %208 RelaxedPrecision
OpDecorate %209 RelaxedPrecision
OpDecorate %210 RelaxedPrecision
OpDecorate %211 RelaxedPrecision
OpDecorate %212 RelaxedPrecision
OpDecorate %213 RelaxedPrecision
OpDecorate %215 RelaxedPrecision
OpDecorate %216 RelaxedPrecision
OpDecorate %217 RelaxedPrecision
OpDecorate %218 RelaxedPrecision
OpDecorate %222 RelaxedPrecision
OpDecorate %226 RelaxedPrecision
OpDecorate %227 RelaxedPrecision
OpDecorate %228 RelaxedPrecision
OpDecorate %229 RelaxedPrecision
OpDecorate %230 RelaxedPrecision
OpDecorate %232 RelaxedPrecision
OpDecorate %233 RelaxedPrecision
OpDecorate %234 RelaxedPrecision
OpDecorate %235 RelaxedPrecision
OpDecorate %241 RelaxedPrecision
OpDecorate %242 RelaxedPrecision
OpDecorate %243 RelaxedPrecision
OpDecorate %244 RelaxedPrecision
OpDecorate %245 RelaxedPrecision
OpDecorate %246 RelaxedPrecision
OpDecorate %247 RelaxedPrecision
OpDecorate %248 RelaxedPrecision
OpDecorate %249 RelaxedPrecision
OpDecorate %250 RelaxedPrecision
OpDecorate %251 RelaxedPrecision
OpDecorate %252 RelaxedPrecision
OpDecorate %253 RelaxedPrecision
OpDecorate %254 RelaxedPrecision
OpDecorate %255 RelaxedPrecision
OpDecorate %256 RelaxedPrecision
OpDecorate %257 RelaxedPrecision
OpDecorate %258 RelaxedPrecision
OpDecorate %259 RelaxedPrecision
OpDecorate %260 RelaxedPrecision
OpDecorate %261 RelaxedPrecision
OpDecorate %262 RelaxedPrecision
OpDecorate %263 RelaxedPrecision
OpDecorate %264 RelaxedPrecision
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
%85 = OpTypeVector %13 2
%88 = OpTypeInt 16 0
%92 = OpTypeVector %88 4
%100 = OpConstant %5 8
%102 = OpConstant %88 65516
%105 = OpConstant %88 80
%108 = OpTypeSampledImage %6
%110 = OpConstant %5 0
%117 = OpConstant %13 3
%118 = OpConstant %13 2
%130 = OpConstant %13 6
%131 = OpConstant %13 4
%132 = OpConstant %13 5
%153 = OpTypeSampledImage %10
%166 = OpTypeSampledImage %14
%179 = OpTypeImage %5 2D 1 0 0 1 Unknown
%180 = OpTypeSampledImage %179
%182 = OpConstant %5 0.5
%219 = OpConstant %5 0.200000003
%220 = OpConstant %5 0.300000012
%221 = OpConstant %5 0.400000006
%292 = OpTypePointer Output %5
%297 = OpTypePointer Output %9
%306 = OpTypePointer Output %13
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %315
%315 = OpLabel
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
%81 = OpCopyObject %5 %77
%82 = OpCopyObject %5 %80
%83 = OpConvertFToS %13 %77
%84 = OpConvertFToS %13 %80
%86 = OpCompositeConstruct %85 %83 %84
%87 = OpCompositeConstruct %51 %81 %82 %81 %82
OpImageWrite %65 %86 %87
%89 = OpConvertFToS %88 %77
%90 = OpConvertFToS %88 %80
%91 = OpCompositeConstruct %85 %83 %84
%93 = OpCompositeConstruct %92 %89 %90 %89 %90
%94 = OpSConvert %54 %93
OpImageWrite %64 %91 %94
%95 = OpConvertFToU %88 %77
%96 = OpConvertFToU %88 %80
%97 = OpCompositeConstruct %85 %83 %84
%98 = OpCompositeConstruct %92 %95 %96 %95 %96
%99 = OpUConvert %57 %98
OpImageWrite %63 %97 %99
%101 = OpCompositeConstruct %51 %100 %100 %100 %100
OpImageWrite %62 %83 %101
%103 = OpCompositeConstruct %92 %102 %102 %102 %102
%104 = OpSConvert %54 %103
OpImageWrite %61 %83 %104
%106 = OpCompositeConstruct %92 %105 %105 %105 %105
%107 = OpUConvert %57 %106
OpImageWrite %60 %83 %107
%109 = OpSampledImage %108 %71 %73
%112 = OpCompositeConstruct %48 %77 %80
%111 = OpImageSampleImplicitLod %51 %109 %112 None
%113 = OpCompositeExtract %5 %111 0
%114 = OpCompositeExtract %5 %111 1
%115 = OpCompositeExtract %5 %111 2
%116 = OpCompositeExtract %5 %111 3
%120 = OpCompositeConstruct %85 %79 %118
%119 = OpImageFetch %54 %70 %120 Lod %117
%121 = OpBitcast %57 %119
%122 = OpCompositeExtract %13 %121 0
%123 = OpCompositeExtract %13 %121 1
%124 = OpCompositeExtract %13 %121 2
%125 = OpCompositeExtract %13 %121 3
%126 = OpUConvert %88 %122
%127 = OpUConvert %88 %123
%128 = OpUConvert %88 %124
%129 = OpUConvert %88 %125
%134 = OpCompositeConstruct %85 %131 %132
%133 = OpImageFetch %57 %69 %134 Lod %130
%135 = OpCompositeExtract %13 %133 0
%136 = OpCompositeExtract %13 %133 1
%137 = OpCompositeExtract %13 %133 2
%138 = OpCompositeExtract %13 %133 3
%139 = OpUConvert %88 %135
%140 = OpUConvert %88 %136
%141 = OpUConvert %88 %137
%142 = OpUConvert %88 %138
%143 = OpCompositeConstruct %48 %77 %80
%144 = OpImageGather %51 %109 %143 %76
%145 = OpCompositeExtract %5 %144 0
%146 = OpCompositeExtract %5 %144 1
%147 = OpCompositeExtract %5 %144 2
%148 = OpCompositeExtract %5 %144 3
%149 = OpFAdd %5 %145 %113
%150 = OpFAdd %5 %146 %114
%151 = OpFAdd %5 %147 %115
%152 = OpFAdd %5 %148 %116
%154 = OpSampledImage %153 %70 %73
%155 = OpCompositeConstruct %48 %77 %80
%156 = OpImageGather %54 %154 %155 %79
%157 = OpSConvert %92 %156
%158 = OpCompositeExtract %88 %157 0
%159 = OpCompositeExtract %88 %157 1
%160 = OpCompositeExtract %88 %157 2
%161 = OpCompositeExtract %88 %157 3
%162 = OpIAdd %88 %158 %126
%163 = OpIAdd %88 %159 %127
%164 = OpIAdd %88 %160 %128
%165 = OpIAdd %88 %161 %129
%167 = OpSampledImage %166 %69 %73
%168 = OpCompositeConstruct %48 %77 %80
%169 = OpImageGather %57 %167 %168 %118
%170 = OpUConvert %92 %169
%171 = OpCompositeExtract %88 %170 0
%172 = OpCompositeExtract %88 %170 1
%173 = OpCompositeExtract %88 %170 2
%174 = OpCompositeExtract %88 %170 3
%175 = OpIAdd %88 %171 %139
%176 = OpIAdd %88 %172 %140
%177 = OpIAdd %88 %173 %141
%178 = OpIAdd %88 %174 %142
%181 = OpSampledImage %180 %71 %72
%184 = OpCompositeConstruct %48 %77 %80
%183 = OpImageSampleDrefImplicitLod %5 %181 %184 %182 None
%185 = OpCompositeConstruct %51 %183 %183 %183 %183
%186 = OpCompositeExtract %5 %185 0
%187 = OpFAdd %5 %186 %149
%188 = OpFAdd %5 %186 %150
%189 = OpFAdd %5 %186 %151
%190 = OpFAdd %5 %186 %152
%191 = OpCopyObject %5 %187
%192 = OpCopyObject %5 %188
%193 = OpCopyObject %5 %189
%194 = OpCopyObject %5 %190
%196 = OpCompositeConstruct %48 %77 %80
%195 = OpImageSampleDrefExplicitLod %5 %181 %196 %182 Lod %110
%197 = OpCompositeConstruct %51 %195 %195 %195 %195
%198 = OpCompositeExtract %5 %197 0
%199 = OpFAdd %5 %191 %198
%200 = OpFAdd %5 %192 %198
%201 = OpFAdd %5 %193 %198
%202 = OpFAdd %5 %194 %198
%203 = OpCopyObject %5 %199
%204 = OpCopyObject %5 %200
%205 = OpCopyObject %5 %201
%206 = OpCopyObject %5 %202
%207 = OpCompositeConstruct %48 %77 %80
%208 = OpImageDrefGather %51 %181 %207 %182
%209 = OpCompositeExtract %5 %208 0
%210 = OpCompositeExtract %5 %208 1
%211 = OpCompositeExtract %5 %208 2
%212 = OpCompositeExtract %5 %208 3
%214 = OpCompositeConstruct %48 %77 %80
%213 = OpImageSampleExplicitLod %51 %109 %214 Lod %110
%215 = OpCompositeExtract %5 %213 0
%216 = OpCompositeExtract %5 %213 1
%217 = OpCompositeExtract %5 %213 2
%218 = OpCompositeExtract %5 %213 3
%223 = OpCompositeConstruct %48 %77 %80
%224 = OpCompositeConstruct %48 %219 %220
%225 = OpCompositeConstruct %48 %221 %182
%222 = OpImageSampleExplicitLod %51 %109 %223 Grad %224 %225
%226 = OpCompositeExtract %5 %222 0
%227 = OpCompositeExtract %5 %222 1
%228 = OpCompositeExtract %5 %222 2
%229 = OpCompositeExtract %5 %222 3
%231 = OpCompositeConstruct %48 %77 %80
%230 = OpImageSampleImplicitLod %51 %109 %231 Bias %182
%232 = OpCompositeExtract %5 %230 0
%233 = OpCompositeExtract %5 %230 1
%234 = OpCompositeExtract %5 %230 2
%235 = OpCompositeExtract %5 %230 3
%236 = OpImageFetch %51 %68 %83
%237 = OpCompositeExtract %5 %236 0
%238 = OpCompositeExtract %5 %236 1
%239 = OpCompositeExtract %5 %236 2
%240 = OpCompositeExtract %5 %236 3
%241 = OpCopyObject %5 %237
%242 = OpCopyObject %5 %238
%243 = OpCopyObject %5 %239
%244 = OpCopyObject %5 %240
%245 = OpFAdd %5 %215 %209
%246 = OpFAdd %5 %245 %226
%247 = OpFAdd %5 %246 %203
%248 = OpFAdd %5 %247 %232
%249 = OpFAdd %5 %248 %241
%250 = OpFAdd %5 %216 %210
%251 = OpFAdd %5 %250 %227
%252 = OpFAdd %5 %251 %204
%253 = OpFAdd %5 %252 %233
%254 = OpFAdd %5 %253 %242
%255 = OpFAdd %5 %217 %211
%256 = OpFAdd %5 %255 %228
%257 = OpFAdd %5 %256 %205
%258 = OpFAdd %5 %257 %234
%259 = OpFAdd %5 %258 %243
%260 = OpFAdd %5 %218 %212
%261 = OpFAdd %5 %260 %229
%262 = OpFAdd %5 %261 %206
%263 = OpFAdd %5 %262 %235
%264 = OpFAdd %5 %263 %244
%265 = OpImageFetch %54 %67 %83
%266 = OpBitcast %57 %265
%267 = OpCompositeExtract %13 %266 0
%268 = OpCompositeExtract %13 %266 1
%269 = OpCompositeExtract %13 %266 2
%270 = OpCompositeExtract %13 %266 3
%271 = OpUConvert %88 %267
%272 = OpUConvert %88 %268
%273 = OpUConvert %88 %269
%274 = OpUConvert %88 %270
%275 = OpIAdd %88 %162 %271
%276 = OpIAdd %88 %163 %272
%277 = OpIAdd %88 %164 %273
%278 = OpIAdd %88 %165 %274
%279 = OpImageFetch %57 %66 %83
%280 = OpCompositeExtract %13 %279 0
%281 = OpCompositeExtract %13 %279 1
%282 = OpCompositeExtract %13 %279 2
%283 = OpCompositeExtract %13 %279 3
%284 = OpUConvert %88 %280
%285 = OpUConvert %88 %281
%286 = OpUConvert %88 %282
%287 = OpUConvert %88 %283
%288 = OpIAdd %88 %175 %284
%289 = OpIAdd %88 %176 %285
%290 = OpIAdd %88 %177 %286
%291 = OpIAdd %88 %178 %287
%293 = OpAccessChain %292 %53 %76
OpStore %293 %249
%294 = OpAccessChain %292 %53 %79
OpStore %294 %254
%295 = OpAccessChain %292 %53 %118
OpStore %295 %259
%296 = OpAccessChain %292 %53 %117
OpStore %296 %264
%298 = OpAccessChain %297 %56 %76
%299 = OpSConvert %9 %275
OpStore %298 %299
%300 = OpAccessChain %297 %56 %79
%301 = OpSConvert %9 %276
OpStore %300 %301
%302 = OpAccessChain %297 %56 %118
%303 = OpSConvert %9 %277
OpStore %302 %303
%304 = OpAccessChain %297 %56 %117
%305 = OpSConvert %9 %278
OpStore %304 %305
%307 = OpAccessChain %306 %59 %76
%308 = OpUConvert %13 %288
OpStore %307 %308
%309 = OpAccessChain %306 %59 %79
%310 = OpUConvert %13 %289
OpStore %309 %310
%311 = OpAccessChain %306 %59 %118
%312 = OpUConvert %13 %290
OpStore %311 %312
%313 = OpAccessChain %306 %59 %117
%314 = OpUConvert %13 %291
OpStore %313 %314
OpReturn
OpFunctionEnd
#endif
