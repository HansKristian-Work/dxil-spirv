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
    mediump float _81 = UV.x;
    mediump float _82 = UV.y;
    uint _83 = uint(int(UV.x));
    uint _84 = uint(int(UV.y));
    imageStore(_28, ivec2(uvec2(_83, _84)), vec4(_81, _82, _81, _82));
    uint _88 = uint(int(UV.x));
    uint _89 = uint(int(UV.y));
    imageStore(_31, ivec2(uvec2(_83, _84)), ivec4(uvec4(_88, _89, _88, _89)));
    uint _93 = uint(UV.x);
    uint _94 = uint(UV.y);
    imageStore(_34, ivec2(uvec2(_83, _84)), uvec4(_93, _94, _93, _94));
    imageStore(_37, int(_83), vec4(8.0));
    imageStore(_40, int(_83), ivec4(uvec4(4294967276u)));
    imageStore(_43, int(_83), uvec4(80u));
    mediump vec4 _107 = texture(sampler2D(_8, _46), vec2(UV.x, UV.y));
    uvec4 _117 = uvec4(texelFetch(_12, ivec2(uvec2(1u, 2u)), int(3u)));
    mediump uvec4 _125 = texelFetch(_16, ivec2(uvec2(4u, 5u)), int(6u));
    mediump uint _127 = _125.x;
    uint hp_copy_127 = _127;
    mediump uint _128 = _125.y;
    uint hp_copy_128 = _128;
    mediump uint _129 = _125.z;
    uint hp_copy_129 = _129;
    mediump uint _130 = _125.w;
    uint hp_copy_130 = _130;
    mediump vec4 _132 = textureGather(sampler2D(_8, _46), vec2(UV.x, UV.y));
    mediump float _137 = _132.x + _107.x;
    float hp_copy_137 = _137;
    mediump float _138 = _132.y + _107.y;
    float hp_copy_138 = _138;
    mediump float _139 = _132.z + _107.z;
    float hp_copy_139 = _139;
    mediump float _140 = _132.w + _107.w;
    float hp_copy_140 = _140;
    uvec4 _145 = uvec4(textureGather(isampler2D(_12, _46), vec2(UV.x, UV.y), int(1u)));
    mediump uvec4 _157 = textureGather(usampler2D(_16, _46), vec2(UV.x, UV.y), int(2u));
    mediump uint _158 = _157.x;
    uint hp_copy_158 = _158;
    mediump uint _159 = _157.y;
    uint hp_copy_159 = _159;
    mediump uint _160 = _157.z;
    uint hp_copy_160 = _160;
    mediump uint _161 = _157.w;
    uint hp_copy_161 = _161;
    mediump float _173 = vec4(texture(sampler2DShadow(_8, _47), vec3(vec2(UV.x, UV.y), 0.5))).x;
    float hp_copy_173 = _173;
    mediump float _178 = hp_copy_173 + hp_copy_137;
    float hp_copy_178 = _178;
    mediump float _179 = hp_copy_173 + hp_copy_138;
    float hp_copy_179 = _179;
    mediump float _180 = hp_copy_173 + hp_copy_139;
    float hp_copy_180 = _180;
    mediump float _181 = hp_copy_173 + hp_copy_140;
    float hp_copy_181 = _181;
    mediump float _185 = vec4(textureLod(sampler2DShadow(_8, _47), vec3(vec2(UV.x, UV.y), 0.5), 0.0)).x;
    float hp_copy_185 = _185;
    mediump float _190 = hp_copy_185 + hp_copy_178;
    mediump float _191 = hp_copy_185 + hp_copy_179;
    mediump float _192 = hp_copy_185 + hp_copy_180;
    mediump float _193 = hp_copy_185 + hp_copy_181;
    vec2 _194 = vec2(UV.x, UV.y);
    mediump vec4 _195 = textureGather(sampler2DShadow(_8, _47), _194, 0.5);
    mediump vec4 _204 = textureLod(sampler2D(_8, _46), vec2(UV.x, UV.y), 0.0);
    mediump vec4 _217 = textureGrad(sampler2D(_8, _46), vec2(UV.x, UV.y), vec2(0.20000000298023223876953125, 0.300000011920928955078125), vec2(0.4000000059604644775390625, 0.5));
    mediump vec4 _229 = texture(sampler2D(_8, _46), vec2(UV.x, UV.y), 0.5);
    mediump vec4 _239 = texelFetch(_19, int(_83));
    uvec4 _249 = uvec4(texelFetch(_22, int(_83)));
    mediump uvec4 _258 = texelFetch(_25, int(_83));
    SV_Target.x = ((((_195.x + _190) + _204.x) + _217.x) + _229.x) + _239.x;
    SV_Target.y = ((((_195.y + _191) + _204.y) + _217.y) + _229.y) + _239.y;
    SV_Target.z = ((((_195.z + _192) + _204.z) + _217.z) + _229.z) + _239.z;
    SV_Target.w = ((((_195.w + _193) + _204.w) + _217.w) + _229.w) + _239.w;
    SV_Target_1.x = int((_145.x + _117.x) + _249.x);
    SV_Target_1.y = int((_145.y + _117.y) + _249.y);
    SV_Target_1.z = int((_145.z + _117.z) + _249.z);
    SV_Target_1.w = int((_145.w + _117.w) + _249.w);
    SV_Target_2.x = (hp_copy_158 + hp_copy_127) + _258.x;
    SV_Target_2.y = (hp_copy_159 + hp_copy_128) + _258.y;
    SV_Target_2.z = (hp_copy_160 + hp_copy_129) + _258.z;
    SV_Target_2.w = (hp_copy_161 + hp_copy_130) + _258.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 288
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
OpDecorate %81 RelaxedPrecision
OpDecorate %82 RelaxedPrecision
OpDecorate %107 RelaxedPrecision
OpDecorate %109 RelaxedPrecision
OpDecorate %110 RelaxedPrecision
OpDecorate %111 RelaxedPrecision
OpDecorate %112 RelaxedPrecision
OpDecorate %115 RelaxedPrecision
OpDecorate %125 RelaxedPrecision
OpDecorate %132 RelaxedPrecision
OpDecorate %133 RelaxedPrecision
OpDecorate %134 RelaxedPrecision
OpDecorate %135 RelaxedPrecision
OpDecorate %136 RelaxedPrecision
OpDecorate %137 RelaxedPrecision
OpDecorate %138 RelaxedPrecision
OpDecorate %139 RelaxedPrecision
OpDecorate %140 RelaxedPrecision
OpDecorate %144 RelaxedPrecision
OpDecorate %157 RelaxedPrecision
OpDecorate %178 RelaxedPrecision
OpDecorate %179 RelaxedPrecision
OpDecorate %180 RelaxedPrecision
OpDecorate %181 RelaxedPrecision
OpDecorate %190 RelaxedPrecision
OpDecorate %191 RelaxedPrecision
OpDecorate %192 RelaxedPrecision
OpDecorate %193 RelaxedPrecision
OpDecorate %195 RelaxedPrecision
OpDecorate %196 RelaxedPrecision
OpDecorate %197 RelaxedPrecision
OpDecorate %198 RelaxedPrecision
OpDecorate %199 RelaxedPrecision
OpDecorate %200 RelaxedPrecision
OpDecorate %201 RelaxedPrecision
OpDecorate %202 RelaxedPrecision
OpDecorate %203 RelaxedPrecision
OpDecorate %204 RelaxedPrecision
OpDecorate %206 RelaxedPrecision
OpDecorate %207 RelaxedPrecision
OpDecorate %208 RelaxedPrecision
OpDecorate %209 RelaxedPrecision
OpDecorate %210 RelaxedPrecision
OpDecorate %211 RelaxedPrecision
OpDecorate %212 RelaxedPrecision
OpDecorate %213 RelaxedPrecision
OpDecorate %217 RelaxedPrecision
OpDecorate %221 RelaxedPrecision
OpDecorate %222 RelaxedPrecision
OpDecorate %223 RelaxedPrecision
OpDecorate %224 RelaxedPrecision
OpDecorate %225 RelaxedPrecision
OpDecorate %226 RelaxedPrecision
OpDecorate %227 RelaxedPrecision
OpDecorate %228 RelaxedPrecision
OpDecorate %229 RelaxedPrecision
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
OpDecorate %258 RelaxedPrecision
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
%97 = OpConstant %5 8
%99 = OpConstant %13 4294967276
%102 = OpConstant %13 80
%104 = OpTypeSampledImage %6
%106 = OpConstant %5 0
%113 = OpConstant %13 3
%114 = OpConstant %13 2
%122 = OpConstant %13 6
%123 = OpConstant %13 4
%124 = OpConstant %13 5
%141 = OpTypeSampledImage %10
%154 = OpTypeSampledImage %14
%166 = OpTypeImage %5 2D 1 0 0 1 Unknown
%167 = OpTypeSampledImage %166
%169 = OpConstant %5 0.5
%214 = OpConstant %5 0.200000003
%215 = OpConstant %5 0.300000012
%216 = OpConstant %5 0.400000006
%267 = OpTypePointer Output %5
%272 = OpTypePointer Output %9
%281 = OpTypePointer Output %13
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %286
%286 = OpLabel
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
%88 = OpConvertFToS %13 %77
%89 = OpConvertFToS %13 %80
%90 = OpCompositeConstruct %85 %83 %84
%91 = OpCompositeConstruct %57 %88 %89 %88 %89
%92 = OpBitcast %54 %91
OpImageWrite %64 %90 %92
%93 = OpConvertFToU %13 %77
%94 = OpConvertFToU %13 %80
%95 = OpCompositeConstruct %85 %83 %84
%96 = OpCompositeConstruct %57 %93 %94 %93 %94
OpImageWrite %63 %95 %96
%98 = OpCompositeConstruct %51 %97 %97 %97 %97
OpImageWrite %62 %83 %98
%100 = OpCompositeConstruct %57 %99 %99 %99 %99
%101 = OpBitcast %54 %100
OpImageWrite %61 %83 %101
%103 = OpCompositeConstruct %57 %102 %102 %102 %102
OpImageWrite %60 %83 %103
%105 = OpSampledImage %104 %71 %73
%108 = OpCompositeConstruct %48 %77 %80
%107 = OpImageSampleImplicitLod %51 %105 %108 None
%109 = OpCompositeExtract %5 %107 0
%110 = OpCompositeExtract %5 %107 1
%111 = OpCompositeExtract %5 %107 2
%112 = OpCompositeExtract %5 %107 3
%116 = OpCompositeConstruct %85 %79 %114
%115 = OpImageFetch %54 %70 %116 Lod %113
%117 = OpBitcast %57 %115
%118 = OpCompositeExtract %13 %117 0
%119 = OpCompositeExtract %13 %117 1
%120 = OpCompositeExtract %13 %117 2
%121 = OpCompositeExtract %13 %117 3
%126 = OpCompositeConstruct %85 %123 %124
%125 = OpImageFetch %57 %69 %126 Lod %122
%127 = OpCompositeExtract %13 %125 0
%128 = OpCompositeExtract %13 %125 1
%129 = OpCompositeExtract %13 %125 2
%130 = OpCompositeExtract %13 %125 3
%131 = OpCompositeConstruct %48 %77 %80
%132 = OpImageGather %51 %105 %131 %76
%133 = OpCompositeExtract %5 %132 0
%134 = OpCompositeExtract %5 %132 1
%135 = OpCompositeExtract %5 %132 2
%136 = OpCompositeExtract %5 %132 3
%137 = OpFAdd %5 %133 %109
%138 = OpFAdd %5 %134 %110
%139 = OpFAdd %5 %135 %111
%140 = OpFAdd %5 %136 %112
%142 = OpSampledImage %141 %70 %73
%143 = OpCompositeConstruct %48 %77 %80
%144 = OpImageGather %54 %142 %143 %79
%145 = OpBitcast %57 %144
%146 = OpCompositeExtract %13 %145 0
%147 = OpCompositeExtract %13 %145 1
%148 = OpCompositeExtract %13 %145 2
%149 = OpCompositeExtract %13 %145 3
%150 = OpIAdd %13 %146 %118
%151 = OpIAdd %13 %147 %119
%152 = OpIAdd %13 %148 %120
%153 = OpIAdd %13 %149 %121
%155 = OpSampledImage %154 %69 %73
%156 = OpCompositeConstruct %48 %77 %80
%157 = OpImageGather %57 %155 %156 %114
%158 = OpCompositeExtract %13 %157 0
%159 = OpCompositeExtract %13 %157 1
%160 = OpCompositeExtract %13 %157 2
%161 = OpCompositeExtract %13 %157 3
%162 = OpIAdd %13 %158 %127
%163 = OpIAdd %13 %159 %128
%164 = OpIAdd %13 %160 %129
%165 = OpIAdd %13 %161 %130
%168 = OpSampledImage %167 %71 %72
%171 = OpCompositeConstruct %48 %77 %80
%170 = OpImageSampleDrefImplicitLod %5 %168 %171 %169 None
%172 = OpCompositeConstruct %51 %170 %170 %170 %170
%173 = OpCompositeExtract %5 %172 0
%174 = OpFAdd %5 %173 %137
%175 = OpFAdd %5 %173 %138
%176 = OpFAdd %5 %173 %139
%177 = OpFAdd %5 %173 %140
%178 = OpCopyObject %5 %174
%179 = OpCopyObject %5 %175
%180 = OpCopyObject %5 %176
%181 = OpCopyObject %5 %177
%183 = OpCompositeConstruct %48 %77 %80
%182 = OpImageSampleDrefExplicitLod %5 %168 %183 %169 Lod %106
%184 = OpCompositeConstruct %51 %182 %182 %182 %182
%185 = OpCompositeExtract %5 %184 0
%186 = OpFAdd %5 %185 %178
%187 = OpFAdd %5 %185 %179
%188 = OpFAdd %5 %185 %180
%189 = OpFAdd %5 %185 %181
%190 = OpCopyObject %5 %186
%191 = OpCopyObject %5 %187
%192 = OpCopyObject %5 %188
%193 = OpCopyObject %5 %189
%194 = OpCompositeConstruct %48 %77 %80
%195 = OpImageDrefGather %51 %168 %194 %169
%196 = OpCompositeExtract %5 %195 0
%197 = OpCompositeExtract %5 %195 1
%198 = OpCompositeExtract %5 %195 2
%199 = OpCompositeExtract %5 %195 3
%200 = OpFAdd %5 %196 %190
%201 = OpFAdd %5 %197 %191
%202 = OpFAdd %5 %198 %192
%203 = OpFAdd %5 %199 %193
%205 = OpCompositeConstruct %48 %77 %80
%204 = OpImageSampleExplicitLod %51 %105 %205 Lod %106
%206 = OpCompositeExtract %5 %204 0
%207 = OpCompositeExtract %5 %204 1
%208 = OpCompositeExtract %5 %204 2
%209 = OpCompositeExtract %5 %204 3
%210 = OpFAdd %5 %200 %206
%211 = OpFAdd %5 %201 %207
%212 = OpFAdd %5 %202 %208
%213 = OpFAdd %5 %203 %209
%218 = OpCompositeConstruct %48 %77 %80
%219 = OpCompositeConstruct %48 %214 %215
%220 = OpCompositeConstruct %48 %216 %169
%217 = OpImageSampleExplicitLod %51 %105 %218 Grad %219 %220
%221 = OpCompositeExtract %5 %217 0
%222 = OpCompositeExtract %5 %217 1
%223 = OpCompositeExtract %5 %217 2
%224 = OpCompositeExtract %5 %217 3
%225 = OpFAdd %5 %210 %221
%226 = OpFAdd %5 %211 %222
%227 = OpFAdd %5 %212 %223
%228 = OpFAdd %5 %213 %224
%230 = OpCompositeConstruct %48 %77 %80
%229 = OpImageSampleImplicitLod %51 %105 %230 Bias %169
%231 = OpCompositeExtract %5 %229 0
%232 = OpCompositeExtract %5 %229 1
%233 = OpCompositeExtract %5 %229 2
%234 = OpCompositeExtract %5 %229 3
%235 = OpFAdd %5 %225 %231
%236 = OpFAdd %5 %226 %232
%237 = OpFAdd %5 %227 %233
%238 = OpFAdd %5 %228 %234
%239 = OpImageFetch %51 %68 %83
%240 = OpCompositeExtract %5 %239 0
%241 = OpCompositeExtract %5 %239 1
%242 = OpCompositeExtract %5 %239 2
%243 = OpCompositeExtract %5 %239 3
%244 = OpFAdd %5 %235 %240
%245 = OpFAdd %5 %236 %241
%246 = OpFAdd %5 %237 %242
%247 = OpFAdd %5 %238 %243
%248 = OpImageFetch %54 %67 %83
%249 = OpBitcast %57 %248
%250 = OpCompositeExtract %13 %249 0
%251 = OpCompositeExtract %13 %249 1
%252 = OpCompositeExtract %13 %249 2
%253 = OpCompositeExtract %13 %249 3
%254 = OpIAdd %13 %150 %250
%255 = OpIAdd %13 %151 %251
%256 = OpIAdd %13 %152 %252
%257 = OpIAdd %13 %153 %253
%258 = OpImageFetch %57 %66 %83
%259 = OpCompositeExtract %13 %258 0
%260 = OpCompositeExtract %13 %258 1
%261 = OpCompositeExtract %13 %258 2
%262 = OpCompositeExtract %13 %258 3
%263 = OpIAdd %13 %162 %259
%264 = OpIAdd %13 %163 %260
%265 = OpIAdd %13 %164 %261
%266 = OpIAdd %13 %165 %262
%268 = OpAccessChain %267 %53 %76
OpStore %268 %244
%269 = OpAccessChain %267 %53 %79
OpStore %269 %245
%270 = OpAccessChain %267 %53 %114
OpStore %270 %246
%271 = OpAccessChain %267 %53 %113
OpStore %271 %247
%273 = OpAccessChain %272 %56 %76
%274 = OpBitcast %9 %254
OpStore %273 %274
%275 = OpAccessChain %272 %56 %79
%276 = OpBitcast %9 %255
OpStore %275 %276
%277 = OpAccessChain %272 %56 %114
%278 = OpBitcast %9 %256
OpStore %277 %278
%279 = OpAccessChain %272 %56 %113
%280 = OpBitcast %9 %257
OpStore %279 %280
%282 = OpAccessChain %281 %59 %76
OpStore %282 %263
%283 = OpAccessChain %281 %59 %79
OpStore %283 %264
%284 = OpAccessChain %281 %59 %114
OpStore %284 %265
%285 = OpAccessChain %281 %59 %113
OpStore %285 %266
OpReturn
OpFunctionEnd
#endif
