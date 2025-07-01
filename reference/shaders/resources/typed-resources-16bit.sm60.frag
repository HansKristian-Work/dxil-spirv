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
    u16vec4 _121 = u16vec4(texelFetch(_12, ivec2(uvec2(1u, 2u)), int(3u)));
    u16vec4 _131 = u16vec4(texelFetch(_16, ivec2(uvec2(4u, 5u)), int(6u)));
    mediump vec4 _137 = textureGather(sampler2D(_8, _46), vec2(UV.x, UV.y));
    mediump float _142 = _137.x + _111.x;
    float hp_copy_142 = _142;
    mediump float _143 = _137.y + _111.y;
    float hp_copy_143 = _143;
    mediump float _144 = _137.z + _111.z;
    float hp_copy_144 = _144;
    mediump float _145 = _137.w + _111.w;
    float hp_copy_145 = _145;
    u16vec4 _150 = u16vec4(textureGather(isampler2D(_12, _46), vec2(UV.x, UV.y), int(1u)));
    u16vec4 _163 = u16vec4(textureGather(usampler2D(_16, _46), vec2(UV.x, UV.y), int(2u)));
    mediump float _179 = vec4(texture(sampler2DShadow(_8, _47), vec3(vec2(UV.x, UV.y), 0.5))).x;
    float hp_copy_179 = _179;
    mediump float _184 = hp_copy_179 + hp_copy_142;
    float hp_copy_184 = _184;
    mediump float _185 = hp_copy_179 + hp_copy_143;
    float hp_copy_185 = _185;
    mediump float _186 = hp_copy_179 + hp_copy_144;
    float hp_copy_186 = _186;
    mediump float _187 = hp_copy_179 + hp_copy_145;
    float hp_copy_187 = _187;
    mediump float _191 = vec4(textureLod(sampler2DShadow(_8, _47), vec3(vec2(UV.x, UV.y), 0.5), 0.0)).x;
    float hp_copy_191 = _191;
    mediump float _196 = hp_copy_184 + hp_copy_191;
    mediump float _197 = hp_copy_185 + hp_copy_191;
    mediump float _198 = hp_copy_186 + hp_copy_191;
    mediump float _199 = hp_copy_187 + hp_copy_191;
    vec2 _200 = vec2(UV.x, UV.y);
    mediump vec4 _201 = textureGather(sampler2DShadow(_8, _47), _200, 0.5);
    mediump vec4 _206 = textureLod(sampler2D(_8, _46), vec2(UV.x, UV.y), 0.0);
    mediump vec4 _215 = textureGrad(sampler2D(_8, _46), vec2(UV.x, UV.y), vec2(0.20000000298023223876953125, 0.300000011920928955078125), vec2(0.4000000059604644775390625, 0.5));
    mediump vec4 _223 = texture(sampler2D(_8, _46), vec2(UV.x, UV.y), 0.5);
    mediump vec4 _229 = texelFetch(_19, int(_83));
    u16vec4 _255 = u16vec4(texelFetch(_22, int(_83)));
    u16vec4 _265 = u16vec4(texelFetch(_25, int(_83)));
    SV_Target.x = ((((_206.x + _201.x) + _215.x) + _196) + _223.x) + _229.x;
    SV_Target.y = ((((_206.y + _201.y) + _215.y) + _197) + _223.y) + _229.y;
    SV_Target.z = ((((_206.z + _201.z) + _215.z) + _198) + _223.z) + _229.z;
    SV_Target.w = ((((_206.w + _201.w) + _215.w) + _199) + _223.w) + _229.w;
    SV_Target_1.x = int(int16_t((_150.x + _121.x) + _255.x));
    SV_Target_1.y = int(int16_t((_150.y + _121.y) + _255.y));
    SV_Target_1.z = int(int16_t((_150.z + _121.z) + _255.z));
    SV_Target_1.w = int(int16_t((_150.w + _121.w) + _255.w));
    SV_Target_2.x = uint((_163.x + _131.x) + _265.x);
    SV_Target_2.y = uint((_163.y + _131.y) + _265.y);
    SV_Target_2.z = uint((_163.z + _131.z) + _265.z);
    SV_Target_2.w = uint((_163.w + _131.w) + _265.w);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 299
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
OpDecorate %119 RelaxedPrecision
OpDecorate %129 RelaxedPrecision
OpDecorate %137 RelaxedPrecision
OpDecorate %138 RelaxedPrecision
OpDecorate %139 RelaxedPrecision
OpDecorate %140 RelaxedPrecision
OpDecorate %141 RelaxedPrecision
OpDecorate %142 RelaxedPrecision
OpDecorate %143 RelaxedPrecision
OpDecorate %144 RelaxedPrecision
OpDecorate %145 RelaxedPrecision
OpDecorate %149 RelaxedPrecision
OpDecorate %162 RelaxedPrecision
OpDecorate %184 RelaxedPrecision
OpDecorate %185 RelaxedPrecision
OpDecorate %186 RelaxedPrecision
OpDecorate %187 RelaxedPrecision
OpDecorate %196 RelaxedPrecision
OpDecorate %197 RelaxedPrecision
OpDecorate %198 RelaxedPrecision
OpDecorate %199 RelaxedPrecision
OpDecorate %201 RelaxedPrecision
OpDecorate %202 RelaxedPrecision
OpDecorate %203 RelaxedPrecision
OpDecorate %204 RelaxedPrecision
OpDecorate %205 RelaxedPrecision
OpDecorate %206 RelaxedPrecision
OpDecorate %208 RelaxedPrecision
OpDecorate %209 RelaxedPrecision
OpDecorate %210 RelaxedPrecision
OpDecorate %211 RelaxedPrecision
OpDecorate %215 RelaxedPrecision
OpDecorate %219 RelaxedPrecision
OpDecorate %220 RelaxedPrecision
OpDecorate %221 RelaxedPrecision
OpDecorate %222 RelaxedPrecision
OpDecorate %223 RelaxedPrecision
OpDecorate %225 RelaxedPrecision
OpDecorate %226 RelaxedPrecision
OpDecorate %227 RelaxedPrecision
OpDecorate %228 RelaxedPrecision
OpDecorate %229 RelaxedPrecision
OpDecorate %230 RelaxedPrecision
OpDecorate %231 RelaxedPrecision
OpDecorate %232 RelaxedPrecision
OpDecorate %233 RelaxedPrecision
OpDecorate %234 RelaxedPrecision
OpDecorate %235 RelaxedPrecision
OpDecorate %236 RelaxedPrecision
OpDecorate %237 RelaxedPrecision
OpDecorate %238 RelaxedPrecision
OpDecorate %239 RelaxedPrecision
OpDecorate %240 RelaxedPrecision
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
%126 = OpConstant %13 6
%127 = OpConstant %13 4
%128 = OpConstant %13 5
%146 = OpTypeSampledImage %10
%159 = OpTypeSampledImage %14
%172 = OpTypeImage %5 2D 1 0 0 1 Unknown
%173 = OpTypeSampledImage %172
%175 = OpConstant %5 0.5
%212 = OpConstant %5 0.200000003
%213 = OpConstant %5 0.300000012
%214 = OpConstant %5 0.400000006
%274 = OpTypePointer Output %5
%279 = OpTypePointer Output %9
%288 = OpTypePointer Output %13
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %297
%297 = OpLabel
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
%121 = OpSConvert %92 %119
%122 = OpCompositeExtract %88 %121 0
%123 = OpCompositeExtract %88 %121 1
%124 = OpCompositeExtract %88 %121 2
%125 = OpCompositeExtract %88 %121 3
%130 = OpCompositeConstruct %85 %127 %128
%129 = OpImageFetch %57 %69 %130 Lod %126
%131 = OpUConvert %92 %129
%132 = OpCompositeExtract %88 %131 0
%133 = OpCompositeExtract %88 %131 1
%134 = OpCompositeExtract %88 %131 2
%135 = OpCompositeExtract %88 %131 3
%136 = OpCompositeConstruct %48 %77 %80
%137 = OpImageGather %51 %109 %136 %76
%138 = OpCompositeExtract %5 %137 0
%139 = OpCompositeExtract %5 %137 1
%140 = OpCompositeExtract %5 %137 2
%141 = OpCompositeExtract %5 %137 3
%142 = OpFAdd %5 %138 %113
%143 = OpFAdd %5 %139 %114
%144 = OpFAdd %5 %140 %115
%145 = OpFAdd %5 %141 %116
%147 = OpSampledImage %146 %70 %73
%148 = OpCompositeConstruct %48 %77 %80
%149 = OpImageGather %54 %147 %148 %79
%150 = OpSConvert %92 %149
%151 = OpCompositeExtract %88 %150 0
%152 = OpCompositeExtract %88 %150 1
%153 = OpCompositeExtract %88 %150 2
%154 = OpCompositeExtract %88 %150 3
%155 = OpIAdd %88 %151 %122
%156 = OpIAdd %88 %152 %123
%157 = OpIAdd %88 %153 %124
%158 = OpIAdd %88 %154 %125
%160 = OpSampledImage %159 %69 %73
%161 = OpCompositeConstruct %48 %77 %80
%162 = OpImageGather %57 %160 %161 %118
%163 = OpUConvert %92 %162
%164 = OpCompositeExtract %88 %163 0
%165 = OpCompositeExtract %88 %163 1
%166 = OpCompositeExtract %88 %163 2
%167 = OpCompositeExtract %88 %163 3
%168 = OpIAdd %88 %164 %132
%169 = OpIAdd %88 %165 %133
%170 = OpIAdd %88 %166 %134
%171 = OpIAdd %88 %167 %135
%174 = OpSampledImage %173 %71 %72
%177 = OpCompositeConstruct %48 %77 %80
%176 = OpImageSampleDrefImplicitLod %5 %174 %177 %175 None
%178 = OpCompositeConstruct %51 %176 %176 %176 %176
%179 = OpCompositeExtract %5 %178 0
%180 = OpFAdd %5 %179 %142
%181 = OpFAdd %5 %179 %143
%182 = OpFAdd %5 %179 %144
%183 = OpFAdd %5 %179 %145
%184 = OpCopyObject %5 %180
%185 = OpCopyObject %5 %181
%186 = OpCopyObject %5 %182
%187 = OpCopyObject %5 %183
%189 = OpCompositeConstruct %48 %77 %80
%188 = OpImageSampleDrefExplicitLod %5 %174 %189 %175 Lod %110
%190 = OpCompositeConstruct %51 %188 %188 %188 %188
%191 = OpCompositeExtract %5 %190 0
%192 = OpFAdd %5 %184 %191
%193 = OpFAdd %5 %185 %191
%194 = OpFAdd %5 %186 %191
%195 = OpFAdd %5 %187 %191
%196 = OpCopyObject %5 %192
%197 = OpCopyObject %5 %193
%198 = OpCopyObject %5 %194
%199 = OpCopyObject %5 %195
%200 = OpCompositeConstruct %48 %77 %80
%201 = OpImageDrefGather %51 %174 %200 %175
%202 = OpCompositeExtract %5 %201 0
%203 = OpCompositeExtract %5 %201 1
%204 = OpCompositeExtract %5 %201 2
%205 = OpCompositeExtract %5 %201 3
%207 = OpCompositeConstruct %48 %77 %80
%206 = OpImageSampleExplicitLod %51 %109 %207 Lod %110
%208 = OpCompositeExtract %5 %206 0
%209 = OpCompositeExtract %5 %206 1
%210 = OpCompositeExtract %5 %206 2
%211 = OpCompositeExtract %5 %206 3
%216 = OpCompositeConstruct %48 %77 %80
%217 = OpCompositeConstruct %48 %212 %213
%218 = OpCompositeConstruct %48 %214 %175
%215 = OpImageSampleExplicitLod %51 %109 %216 Grad %217 %218
%219 = OpCompositeExtract %5 %215 0
%220 = OpCompositeExtract %5 %215 1
%221 = OpCompositeExtract %5 %215 2
%222 = OpCompositeExtract %5 %215 3
%224 = OpCompositeConstruct %48 %77 %80
%223 = OpImageSampleImplicitLod %51 %109 %224 Bias %175
%225 = OpCompositeExtract %5 %223 0
%226 = OpCompositeExtract %5 %223 1
%227 = OpCompositeExtract %5 %223 2
%228 = OpCompositeExtract %5 %223 3
%229 = OpImageFetch %51 %68 %83
%230 = OpCompositeExtract %5 %229 0
%231 = OpCompositeExtract %5 %229 1
%232 = OpCompositeExtract %5 %229 2
%233 = OpCompositeExtract %5 %229 3
%234 = OpFAdd %5 %208 %202
%235 = OpFAdd %5 %234 %219
%236 = OpFAdd %5 %235 %196
%237 = OpFAdd %5 %236 %225
%238 = OpFAdd %5 %237 %230
%239 = OpFAdd %5 %209 %203
%240 = OpFAdd %5 %239 %220
%241 = OpFAdd %5 %240 %197
%242 = OpFAdd %5 %241 %226
%243 = OpFAdd %5 %242 %231
%244 = OpFAdd %5 %210 %204
%245 = OpFAdd %5 %244 %221
%246 = OpFAdd %5 %245 %198
%247 = OpFAdd %5 %246 %227
%248 = OpFAdd %5 %247 %232
%249 = OpFAdd %5 %211 %205
%250 = OpFAdd %5 %249 %222
%251 = OpFAdd %5 %250 %199
%252 = OpFAdd %5 %251 %228
%253 = OpFAdd %5 %252 %233
%254 = OpImageFetch %54 %67 %83
%255 = OpSConvert %92 %254
%256 = OpCompositeExtract %88 %255 0
%257 = OpCompositeExtract %88 %255 1
%258 = OpCompositeExtract %88 %255 2
%259 = OpCompositeExtract %88 %255 3
%260 = OpIAdd %88 %155 %256
%261 = OpIAdd %88 %156 %257
%262 = OpIAdd %88 %157 %258
%263 = OpIAdd %88 %158 %259
%264 = OpImageFetch %57 %66 %83
%265 = OpUConvert %92 %264
%266 = OpCompositeExtract %88 %265 0
%267 = OpCompositeExtract %88 %265 1
%268 = OpCompositeExtract %88 %265 2
%269 = OpCompositeExtract %88 %265 3
%270 = OpIAdd %88 %168 %266
%271 = OpIAdd %88 %169 %267
%272 = OpIAdd %88 %170 %268
%273 = OpIAdd %88 %171 %269
%275 = OpAccessChain %274 %53 %76
OpStore %275 %238
%276 = OpAccessChain %274 %53 %79
OpStore %276 %243
%277 = OpAccessChain %274 %53 %118
OpStore %277 %248
%278 = OpAccessChain %274 %53 %117
OpStore %278 %253
%280 = OpAccessChain %279 %56 %76
%281 = OpSConvert %9 %260
OpStore %280 %281
%282 = OpAccessChain %279 %56 %79
%283 = OpSConvert %9 %261
OpStore %282 %283
%284 = OpAccessChain %279 %56 %118
%285 = OpSConvert %9 %262
OpStore %284 %285
%286 = OpAccessChain %279 %56 %117
%287 = OpSConvert %9 %263
OpStore %286 %287
%289 = OpAccessChain %288 %59 %76
%290 = OpUConvert %13 %270
OpStore %289 %290
%291 = OpAccessChain %288 %59 %79
%292 = OpUConvert %13 %271
OpStore %291 %292
%293 = OpAccessChain %288 %59 %118
%294 = OpUConvert %13 %272
OpStore %293 %294
%295 = OpAccessChain %288 %59 %117
%296 = OpUConvert %13 %273
OpStore %295 %296
OpReturn
OpFunctionEnd
#endif
