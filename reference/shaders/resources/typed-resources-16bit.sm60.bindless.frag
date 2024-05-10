#version 460
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

layout(push_constant, std430) uniform RootConstants
{
    uint _m0;
    uint _m1;
    uint _m2;
    uint _m3;
    uint _m4;
    uint _m5;
    uint _m6;
    uint _m7;
} registers;

layout(set = 0, binding = 0) uniform mediump texture2D _13[];
layout(set = 0, binding = 0) uniform mediump itexture2D _18[];
layout(set = 0, binding = 0) uniform mediump utexture2D _22[];
layout(set = 1, binding = 0) uniform mediump samplerBuffer _26[];
layout(set = 1, binding = 0) uniform mediump isamplerBuffer _30[];
layout(set = 1, binding = 0) uniform mediump usamplerBuffer _34[];
layout(set = 3, binding = 0) uniform writeonly mediump image2D _38[];
layout(set = 3, binding = 0) uniform writeonly mediump iimage2D _42[];
layout(set = 3, binding = 0) uniform writeonly mediump uimage2D _46[];
layout(set = 4, binding = 0) uniform writeonly mediump imageBuffer _50[];
layout(set = 4, binding = 0) uniform writeonly mediump iimageBuffer _54[];
layout(set = 4, binding = 0) uniform writeonly mediump uimageBuffer _58[];
layout(set = 2, binding = 0) uniform samplerShadow _62[];

layout(location = 0) in vec2 UV;
layout(location = 0) out mediump vec4 SV_Target;
layout(location = 1) out mediump ivec4 SV_Target_1;
layout(location = 2) out mediump uvec4 SV_Target_2;

void main()
{
    uint _139 = registers._m0 + 2u;
    uint _145 = registers._m0 + 1u;
    mediump float _167 = UV.x;
    mediump float _168 = UV.y;
    uint _169 = uint(int(UV.x));
    uint _170 = uint(int(UV.y));
    imageStore(_38[registers._m3], ivec2(uvec2(_169, _170)), vec4(_167, _168, _167, _168));
    uint _174 = uint(int(UV.x));
    uint _175 = uint(int(UV.y));
    imageStore(_42[registers._m3 + 1u], ivec2(uvec2(_169, _170)), ivec4(uvec4(_174, _175, _174, _175)));
    uint _179 = uint(UV.x);
    uint _180 = uint(UV.y);
    imageStore(_46[registers._m3 + 2u], ivec2(uvec2(_169, _170)), uvec4(_179, _180, _179, _180));
    imageStore(_50[registers._m4 + 3u], int(_169), vec4(8.0));
    imageStore(_54[registers._m4 + 4u], int(_169), ivec4(uvec4(4294967276u)));
    imageStore(_58[registers._m4 + 5u], int(_169), uvec4(80u));
    mediump vec4 _193 = texture(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y));
    uvec4 _201 = uvec4(texelFetch(_18[_145], ivec2(uvec2(1u, 2u)), int(3u)));
    mediump uvec4 _207 = texelFetch(_22[_139], ivec2(uvec2(4u, 5u)), int(6u));
    mediump uint _209 = _207.x;
    uint hp_copy_209 = _209;
    mediump uint _210 = _207.y;
    uint hp_copy_210 = _210;
    mediump uint _211 = _207.z;
    uint hp_copy_211 = _211;
    mediump uint _212 = _207.w;
    uint hp_copy_212 = _212;
    mediump vec4 _214 = textureGather(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y));
    mediump float _219 = _214.x + _193.x;
    float hp_copy_219 = _219;
    mediump float _220 = _214.y + _193.y;
    float hp_copy_220 = _220;
    mediump float _221 = _214.z + _193.z;
    float hp_copy_221 = _221;
    mediump float _222 = _214.w + _193.w;
    float hp_copy_222 = _222;
    uvec4 _227 = uvec4(textureGather(isampler2D(_18[_145], _62[registers._m2]), vec2(UV.x, UV.y), int(1u)));
    mediump uvec4 _239 = textureGather(usampler2D(_22[_139], _62[registers._m2]), vec2(UV.x, UV.y), int(2u));
    mediump uint _240 = _239.x;
    uint hp_copy_240 = _240;
    mediump uint _241 = _239.y;
    uint hp_copy_241 = _241;
    mediump uint _242 = _239.z;
    uint hp_copy_242 = _242;
    mediump uint _243 = _239.w;
    uint hp_copy_243 = _243;
    mediump float _255 = vec4(texture(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), vec3(vec2(UV.x, UV.y), 0.5))).x;
    float hp_copy_255 = _255;
    mediump float _260 = hp_copy_255 + hp_copy_219;
    float hp_copy_260 = _260;
    mediump float _261 = hp_copy_255 + hp_copy_220;
    float hp_copy_261 = _261;
    mediump float _262 = hp_copy_255 + hp_copy_221;
    float hp_copy_262 = _262;
    mediump float _263 = hp_copy_255 + hp_copy_222;
    float hp_copy_263 = _263;
    mediump float _267 = vec4(textureLod(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), vec3(vec2(UV.x, UV.y), 0.5), 0.0)).x;
    float hp_copy_267 = _267;
    mediump float _272 = hp_copy_267 + hp_copy_260;
    mediump float _273 = hp_copy_267 + hp_copy_261;
    mediump float _274 = hp_copy_267 + hp_copy_262;
    mediump float _275 = hp_copy_267 + hp_copy_263;
    vec2 _276 = vec2(UV.x, UV.y);
    mediump vec4 _277 = textureGather(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), _276, 0.5);
    mediump vec4 _286 = textureLod(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), 0.0);
    mediump vec4 _299 = textureGrad(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), vec2(0.20000000298023223876953125, 0.300000011920928955078125), vec2(0.4000000059604644775390625, 0.5));
    mediump vec4 _311 = texture(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), 0.5);
    mediump vec4 _321 = texelFetch(_26[registers._m1 + 3u], int(_169));
    uvec4 _331 = uvec4(texelFetch(_30[registers._m1 + 4u], int(_169)));
    mediump uvec4 _340 = texelFetch(_34[registers._m1 + 5u], int(_169));
    SV_Target.x = ((((_277.x + _272) + _286.x) + _299.x) + _311.x) + _321.x;
    SV_Target.y = ((((_277.y + _273) + _286.y) + _299.y) + _311.y) + _321.y;
    SV_Target.z = ((((_277.z + _274) + _286.z) + _299.z) + _311.z) + _321.z;
    SV_Target.w = ((((_277.w + _275) + _286.w) + _299.w) + _311.w) + _321.w;
    SV_Target_1.x = int((_227.x + _201.x) + _331.x);
    SV_Target_1.y = int((_227.y + _201.y) + _331.y);
    SV_Target_1.z = int((_227.z + _201.z) + _331.z);
    SV_Target_1.w = int((_227.w + _201.w) + _331.w);
    SV_Target_2.x = (hp_copy_240 + hp_copy_209) + _340.x;
    SV_Target_2.y = (hp_copy_241 + hp_copy_210) + _340.y;
    SV_Target_2.z = (hp_copy_242 + hp_copy_211) + _340.z;
    SV_Target_2.w = (hp_copy_243 + hp_copy_212) + _340.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 370
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %65 %68 %71 %74
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %65 "UV"
OpName %68 "SV_Target"
OpName %71 "SV_Target_1"
OpName %74 "SV_Target_2"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %13 RelaxedPrecision
OpDecorate %18 DescriptorSet 0
OpDecorate %18 Binding 0
OpDecorate %18 RelaxedPrecision
OpDecorate %22 DescriptorSet 0
OpDecorate %22 Binding 0
OpDecorate %22 RelaxedPrecision
OpDecorate %26 DescriptorSet 1
OpDecorate %26 Binding 0
OpDecorate %26 RelaxedPrecision
OpDecorate %30 DescriptorSet 1
OpDecorate %30 Binding 0
OpDecorate %30 RelaxedPrecision
OpDecorate %34 DescriptorSet 1
OpDecorate %34 Binding 0
OpDecorate %34 RelaxedPrecision
OpDecorate %38 DescriptorSet 3
OpDecorate %38 Binding 0
OpDecorate %38 RelaxedPrecision
OpDecorate %38 NonReadable
OpDecorate %42 DescriptorSet 3
OpDecorate %42 Binding 0
OpDecorate %42 RelaxedPrecision
OpDecorate %42 NonReadable
OpDecorate %46 DescriptorSet 3
OpDecorate %46 Binding 0
OpDecorate %46 RelaxedPrecision
OpDecorate %46 NonReadable
OpDecorate %50 DescriptorSet 4
OpDecorate %50 Binding 0
OpDecorate %50 RelaxedPrecision
OpDecorate %50 NonReadable
OpDecorate %54 DescriptorSet 4
OpDecorate %54 Binding 0
OpDecorate %54 RelaxedPrecision
OpDecorate %54 NonReadable
OpDecorate %58 DescriptorSet 4
OpDecorate %58 Binding 0
OpDecorate %58 RelaxedPrecision
OpDecorate %58 NonReadable
OpDecorate %62 DescriptorSet 2
OpDecorate %62 Binding 0
OpDecorate %65 Location 0
OpDecorate %68 RelaxedPrecision
OpDecorate %68 Location 0
OpDecorate %71 RelaxedPrecision
OpDecorate %71 Location 1
OpDecorate %74 RelaxedPrecision
OpDecorate %74 Location 2
OpDecorate %167 RelaxedPrecision
OpDecorate %168 RelaxedPrecision
OpDecorate %193 RelaxedPrecision
OpDecorate %195 RelaxedPrecision
OpDecorate %196 RelaxedPrecision
OpDecorate %197 RelaxedPrecision
OpDecorate %198 RelaxedPrecision
OpDecorate %199 RelaxedPrecision
OpDecorate %207 RelaxedPrecision
OpDecorate %214 RelaxedPrecision
OpDecorate %215 RelaxedPrecision
OpDecorate %216 RelaxedPrecision
OpDecorate %217 RelaxedPrecision
OpDecorate %218 RelaxedPrecision
OpDecorate %219 RelaxedPrecision
OpDecorate %220 RelaxedPrecision
OpDecorate %221 RelaxedPrecision
OpDecorate %222 RelaxedPrecision
OpDecorate %226 RelaxedPrecision
OpDecorate %239 RelaxedPrecision
OpDecorate %260 RelaxedPrecision
OpDecorate %261 RelaxedPrecision
OpDecorate %262 RelaxedPrecision
OpDecorate %263 RelaxedPrecision
OpDecorate %272 RelaxedPrecision
OpDecorate %273 RelaxedPrecision
OpDecorate %274 RelaxedPrecision
OpDecorate %275 RelaxedPrecision
OpDecorate %277 RelaxedPrecision
OpDecorate %278 RelaxedPrecision
OpDecorate %279 RelaxedPrecision
OpDecorate %280 RelaxedPrecision
OpDecorate %281 RelaxedPrecision
OpDecorate %282 RelaxedPrecision
OpDecorate %283 RelaxedPrecision
OpDecorate %284 RelaxedPrecision
OpDecorate %285 RelaxedPrecision
OpDecorate %286 RelaxedPrecision
OpDecorate %288 RelaxedPrecision
OpDecorate %289 RelaxedPrecision
OpDecorate %290 RelaxedPrecision
OpDecorate %291 RelaxedPrecision
OpDecorate %292 RelaxedPrecision
OpDecorate %293 RelaxedPrecision
OpDecorate %294 RelaxedPrecision
OpDecorate %295 RelaxedPrecision
OpDecorate %299 RelaxedPrecision
OpDecorate %303 RelaxedPrecision
OpDecorate %304 RelaxedPrecision
OpDecorate %305 RelaxedPrecision
OpDecorate %306 RelaxedPrecision
OpDecorate %307 RelaxedPrecision
OpDecorate %308 RelaxedPrecision
OpDecorate %309 RelaxedPrecision
OpDecorate %310 RelaxedPrecision
OpDecorate %311 RelaxedPrecision
OpDecorate %313 RelaxedPrecision
OpDecorate %314 RelaxedPrecision
OpDecorate %315 RelaxedPrecision
OpDecorate %316 RelaxedPrecision
OpDecorate %317 RelaxedPrecision
OpDecorate %318 RelaxedPrecision
OpDecorate %319 RelaxedPrecision
OpDecorate %320 RelaxedPrecision
OpDecorate %321 RelaxedPrecision
OpDecorate %322 RelaxedPrecision
OpDecorate %323 RelaxedPrecision
OpDecorate %324 RelaxedPrecision
OpDecorate %325 RelaxedPrecision
OpDecorate %326 RelaxedPrecision
OpDecorate %327 RelaxedPrecision
OpDecorate %328 RelaxedPrecision
OpDecorate %329 RelaxedPrecision
OpDecorate %330 RelaxedPrecision
OpDecorate %340 RelaxedPrecision
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeFloat 32
%10 = OpTypeImage %9 2D 0 0 0 1 Unknown
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer UniformConstant %11
%13 = OpVariable %12 UniformConstant
%14 = OpTypeInt 32 1
%15 = OpTypeImage %14 2D 0 0 0 1 Unknown
%16 = OpTypeRuntimeArray %15
%17 = OpTypePointer UniformConstant %16
%18 = OpVariable %17 UniformConstant
%19 = OpTypeImage %5 2D 0 0 0 1 Unknown
%20 = OpTypeRuntimeArray %19
%21 = OpTypePointer UniformConstant %20
%22 = OpVariable %21 UniformConstant
%23 = OpTypeImage %9 Buffer 0 0 0 1 Unknown
%24 = OpTypeRuntimeArray %23
%25 = OpTypePointer UniformConstant %24
%26 = OpVariable %25 UniformConstant
%27 = OpTypeImage %14 Buffer 0 0 0 1 Unknown
%28 = OpTypeRuntimeArray %27
%29 = OpTypePointer UniformConstant %28
%30 = OpVariable %29 UniformConstant
%31 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%32 = OpTypeRuntimeArray %31
%33 = OpTypePointer UniformConstant %32
%34 = OpVariable %33 UniformConstant
%35 = OpTypeImage %9 2D 0 0 0 2 Unknown
%36 = OpTypeRuntimeArray %35
%37 = OpTypePointer UniformConstant %36
%38 = OpVariable %37 UniformConstant
%39 = OpTypeImage %14 2D 0 0 0 2 Unknown
%40 = OpTypeRuntimeArray %39
%41 = OpTypePointer UniformConstant %40
%42 = OpVariable %41 UniformConstant
%43 = OpTypeImage %5 2D 0 0 0 2 Unknown
%44 = OpTypeRuntimeArray %43
%45 = OpTypePointer UniformConstant %44
%46 = OpVariable %45 UniformConstant
%47 = OpTypeImage %9 Buffer 0 0 0 2 Unknown
%48 = OpTypeRuntimeArray %47
%49 = OpTypePointer UniformConstant %48
%50 = OpVariable %49 UniformConstant
%51 = OpTypeImage %14 Buffer 0 0 0 2 Unknown
%52 = OpTypeRuntimeArray %51
%53 = OpTypePointer UniformConstant %52
%54 = OpVariable %53 UniformConstant
%55 = OpTypeImage %5 Buffer 0 0 0 2 Unknown
%56 = OpTypeRuntimeArray %55
%57 = OpTypePointer UniformConstant %56
%58 = OpVariable %57 UniformConstant
%59 = OpTypeSampler
%60 = OpTypeRuntimeArray %59
%61 = OpTypePointer UniformConstant %60
%62 = OpVariable %61 UniformConstant
%63 = OpTypeVector %9 2
%64 = OpTypePointer Input %63
%65 = OpVariable %64 Input
%66 = OpTypeVector %9 4
%67 = OpTypePointer Output %66
%68 = OpVariable %67 Output
%69 = OpTypeVector %14 4
%70 = OpTypePointer Output %69
%71 = OpVariable %70 Output
%72 = OpTypeVector %5 4
%73 = OpTypePointer Output %72
%74 = OpVariable %73 Output
%75 = OpTypePointer UniformConstant %55
%77 = OpTypePointer PushConstant %5
%79 = OpConstant %5 4
%82 = OpConstant %5 5
%84 = OpTypePointer UniformConstant %51
%90 = OpTypePointer UniformConstant %47
%95 = OpConstant %5 3
%97 = OpTypePointer UniformConstant %43
%102 = OpConstant %5 2
%104 = OpTypePointer UniformConstant %39
%109 = OpConstant %5 1
%111 = OpTypePointer UniformConstant %35
%116 = OpTypePointer UniformConstant %31
%122 = OpTypePointer UniformConstant %27
%128 = OpTypePointer UniformConstant %23
%134 = OpTypePointer UniformConstant %19
%137 = OpConstant %5 0
%141 = OpTypePointer UniformConstant %15
%147 = OpTypePointer UniformConstant %10
%152 = OpTypePointer UniformConstant %59
%162 = OpTypePointer Input %9
%171 = OpTypeVector %5 2
%183 = OpConstant %9 8
%185 = OpConstant %5 4294967276
%188 = OpConstant %5 80
%190 = OpTypeSampledImage %10
%192 = OpConstant %9 0
%206 = OpConstant %5 6
%223 = OpTypeSampledImage %15
%236 = OpTypeSampledImage %19
%248 = OpTypeImage %9 2D 1 0 0 1 Unknown
%249 = OpTypeSampledImage %248
%251 = OpConstant %9 0.5
%296 = OpConstant %9 0.200000003
%297 = OpConstant %9 0.300000012
%298 = OpConstant %9 0.400000006
%349 = OpTypePointer Output %9
%354 = OpTypePointer Output %14
%363 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %368
%368 = OpLabel
%78 = OpAccessChain %77 %8 %79
%80 = OpLoad %5 %78
%81 = OpIAdd %5 %80 %82
%76 = OpAccessChain %75 %58 %81
%83 = OpLoad %55 %76
%86 = OpAccessChain %77 %8 %79
%87 = OpLoad %5 %86
%88 = OpIAdd %5 %87 %79
%85 = OpAccessChain %84 %54 %88
%89 = OpLoad %51 %85
%92 = OpAccessChain %77 %8 %79
%93 = OpLoad %5 %92
%94 = OpIAdd %5 %93 %95
%91 = OpAccessChain %90 %50 %94
%96 = OpLoad %47 %91
%99 = OpAccessChain %77 %8 %95
%100 = OpLoad %5 %99
%101 = OpIAdd %5 %100 %102
%98 = OpAccessChain %97 %46 %101
%103 = OpLoad %43 %98
%106 = OpAccessChain %77 %8 %95
%107 = OpLoad %5 %106
%108 = OpIAdd %5 %107 %109
%105 = OpAccessChain %104 %42 %108
%110 = OpLoad %39 %105
%113 = OpAccessChain %77 %8 %95
%114 = OpLoad %5 %113
%112 = OpAccessChain %111 %38 %114
%115 = OpLoad %35 %112
%118 = OpAccessChain %77 %8 %109
%119 = OpLoad %5 %118
%120 = OpIAdd %5 %119 %82
%117 = OpAccessChain %116 %34 %120
%121 = OpLoad %31 %117
%124 = OpAccessChain %77 %8 %109
%125 = OpLoad %5 %124
%126 = OpIAdd %5 %125 %79
%123 = OpAccessChain %122 %30 %126
%127 = OpLoad %27 %123
%130 = OpAccessChain %77 %8 %109
%131 = OpLoad %5 %130
%132 = OpIAdd %5 %131 %95
%129 = OpAccessChain %128 %26 %132
%133 = OpLoad %23 %129
%136 = OpAccessChain %77 %8 %137
%138 = OpLoad %5 %136
%139 = OpIAdd %5 %138 %102
%135 = OpAccessChain %134 %22 %139
%140 = OpLoad %19 %135
%143 = OpAccessChain %77 %8 %137
%144 = OpLoad %5 %143
%145 = OpIAdd %5 %144 %109
%142 = OpAccessChain %141 %18 %145
%146 = OpLoad %15 %142
%149 = OpAccessChain %77 %8 %137
%150 = OpLoad %5 %149
%148 = OpAccessChain %147 %13 %150
%151 = OpLoad %10 %148
%154 = OpAccessChain %77 %8 %102
%155 = OpLoad %5 %154
%156 = OpIAdd %5 %155 %109
%153 = OpAccessChain %152 %62 %156
%157 = OpLoad %59 %153
%159 = OpAccessChain %77 %8 %102
%160 = OpLoad %5 %159
%158 = OpAccessChain %152 %62 %160
%161 = OpLoad %59 %158
%163 = OpAccessChain %162 %65 %137
%164 = OpLoad %9 %163
%165 = OpAccessChain %162 %65 %109
%166 = OpLoad %9 %165
%167 = OpCopyObject %9 %164
%168 = OpCopyObject %9 %166
%169 = OpConvertFToS %5 %164
%170 = OpConvertFToS %5 %166
%172 = OpCompositeConstruct %171 %169 %170
%173 = OpCompositeConstruct %66 %167 %168 %167 %168
OpImageWrite %115 %172 %173
%174 = OpConvertFToS %5 %164
%175 = OpConvertFToS %5 %166
%176 = OpCompositeConstruct %171 %169 %170
%177 = OpCompositeConstruct %72 %174 %175 %174 %175
%178 = OpBitcast %69 %177
OpImageWrite %110 %176 %178
%179 = OpConvertFToU %5 %164
%180 = OpConvertFToU %5 %166
%181 = OpCompositeConstruct %171 %169 %170
%182 = OpCompositeConstruct %72 %179 %180 %179 %180
OpImageWrite %103 %181 %182
%184 = OpCompositeConstruct %66 %183 %183 %183 %183
OpImageWrite %96 %169 %184
%186 = OpCompositeConstruct %72 %185 %185 %185 %185
%187 = OpBitcast %69 %186
OpImageWrite %89 %169 %187
%189 = OpCompositeConstruct %72 %188 %188 %188 %188
OpImageWrite %83 %169 %189
%191 = OpSampledImage %190 %151 %161
%194 = OpCompositeConstruct %63 %164 %166
%193 = OpImageSampleImplicitLod %66 %191 %194 None
%195 = OpCompositeExtract %9 %193 0
%196 = OpCompositeExtract %9 %193 1
%197 = OpCompositeExtract %9 %193 2
%198 = OpCompositeExtract %9 %193 3
%200 = OpCompositeConstruct %171 %109 %102
%199 = OpImageFetch %69 %146 %200 Lod %95
%201 = OpBitcast %72 %199
%202 = OpCompositeExtract %5 %201 0
%203 = OpCompositeExtract %5 %201 1
%204 = OpCompositeExtract %5 %201 2
%205 = OpCompositeExtract %5 %201 3
%208 = OpCompositeConstruct %171 %79 %82
%207 = OpImageFetch %72 %140 %208 Lod %206
%209 = OpCompositeExtract %5 %207 0
%210 = OpCompositeExtract %5 %207 1
%211 = OpCompositeExtract %5 %207 2
%212 = OpCompositeExtract %5 %207 3
%213 = OpCompositeConstruct %63 %164 %166
%214 = OpImageGather %66 %191 %213 %137
%215 = OpCompositeExtract %9 %214 0
%216 = OpCompositeExtract %9 %214 1
%217 = OpCompositeExtract %9 %214 2
%218 = OpCompositeExtract %9 %214 3
%219 = OpFAdd %9 %215 %195
%220 = OpFAdd %9 %216 %196
%221 = OpFAdd %9 %217 %197
%222 = OpFAdd %9 %218 %198
%224 = OpSampledImage %223 %146 %161
%225 = OpCompositeConstruct %63 %164 %166
%226 = OpImageGather %69 %224 %225 %109
%227 = OpBitcast %72 %226
%228 = OpCompositeExtract %5 %227 0
%229 = OpCompositeExtract %5 %227 1
%230 = OpCompositeExtract %5 %227 2
%231 = OpCompositeExtract %5 %227 3
%232 = OpIAdd %5 %228 %202
%233 = OpIAdd %5 %229 %203
%234 = OpIAdd %5 %230 %204
%235 = OpIAdd %5 %231 %205
%237 = OpSampledImage %236 %140 %161
%238 = OpCompositeConstruct %63 %164 %166
%239 = OpImageGather %72 %237 %238 %102
%240 = OpCompositeExtract %5 %239 0
%241 = OpCompositeExtract %5 %239 1
%242 = OpCompositeExtract %5 %239 2
%243 = OpCompositeExtract %5 %239 3
%244 = OpIAdd %5 %240 %209
%245 = OpIAdd %5 %241 %210
%246 = OpIAdd %5 %242 %211
%247 = OpIAdd %5 %243 %212
%250 = OpSampledImage %249 %151 %157
%253 = OpCompositeConstruct %63 %164 %166
%252 = OpImageSampleDrefImplicitLod %9 %250 %253 %251 None
%254 = OpCompositeConstruct %66 %252 %252 %252 %252
%255 = OpCompositeExtract %9 %254 0
%256 = OpFAdd %9 %255 %219
%257 = OpFAdd %9 %255 %220
%258 = OpFAdd %9 %255 %221
%259 = OpFAdd %9 %255 %222
%260 = OpCopyObject %9 %256
%261 = OpCopyObject %9 %257
%262 = OpCopyObject %9 %258
%263 = OpCopyObject %9 %259
%265 = OpCompositeConstruct %63 %164 %166
%264 = OpImageSampleDrefExplicitLod %9 %250 %265 %251 Lod %192
%266 = OpCompositeConstruct %66 %264 %264 %264 %264
%267 = OpCompositeExtract %9 %266 0
%268 = OpFAdd %9 %267 %260
%269 = OpFAdd %9 %267 %261
%270 = OpFAdd %9 %267 %262
%271 = OpFAdd %9 %267 %263
%272 = OpCopyObject %9 %268
%273 = OpCopyObject %9 %269
%274 = OpCopyObject %9 %270
%275 = OpCopyObject %9 %271
%276 = OpCompositeConstruct %63 %164 %166
%277 = OpImageDrefGather %66 %250 %276 %251
%278 = OpCompositeExtract %9 %277 0
%279 = OpCompositeExtract %9 %277 1
%280 = OpCompositeExtract %9 %277 2
%281 = OpCompositeExtract %9 %277 3
%282 = OpFAdd %9 %278 %272
%283 = OpFAdd %9 %279 %273
%284 = OpFAdd %9 %280 %274
%285 = OpFAdd %9 %281 %275
%287 = OpCompositeConstruct %63 %164 %166
%286 = OpImageSampleExplicitLod %66 %191 %287 Lod %192
%288 = OpCompositeExtract %9 %286 0
%289 = OpCompositeExtract %9 %286 1
%290 = OpCompositeExtract %9 %286 2
%291 = OpCompositeExtract %9 %286 3
%292 = OpFAdd %9 %282 %288
%293 = OpFAdd %9 %283 %289
%294 = OpFAdd %9 %284 %290
%295 = OpFAdd %9 %285 %291
%300 = OpCompositeConstruct %63 %164 %166
%301 = OpCompositeConstruct %63 %296 %297
%302 = OpCompositeConstruct %63 %298 %251
%299 = OpImageSampleExplicitLod %66 %191 %300 Grad %301 %302
%303 = OpCompositeExtract %9 %299 0
%304 = OpCompositeExtract %9 %299 1
%305 = OpCompositeExtract %9 %299 2
%306 = OpCompositeExtract %9 %299 3
%307 = OpFAdd %9 %292 %303
%308 = OpFAdd %9 %293 %304
%309 = OpFAdd %9 %294 %305
%310 = OpFAdd %9 %295 %306
%312 = OpCompositeConstruct %63 %164 %166
%311 = OpImageSampleImplicitLod %66 %191 %312 Bias %251
%313 = OpCompositeExtract %9 %311 0
%314 = OpCompositeExtract %9 %311 1
%315 = OpCompositeExtract %9 %311 2
%316 = OpCompositeExtract %9 %311 3
%317 = OpFAdd %9 %307 %313
%318 = OpFAdd %9 %308 %314
%319 = OpFAdd %9 %309 %315
%320 = OpFAdd %9 %310 %316
%321 = OpImageFetch %66 %133 %169
%322 = OpCompositeExtract %9 %321 0
%323 = OpCompositeExtract %9 %321 1
%324 = OpCompositeExtract %9 %321 2
%325 = OpCompositeExtract %9 %321 3
%326 = OpFAdd %9 %317 %322
%327 = OpFAdd %9 %318 %323
%328 = OpFAdd %9 %319 %324
%329 = OpFAdd %9 %320 %325
%330 = OpImageFetch %69 %127 %169
%331 = OpBitcast %72 %330
%332 = OpCompositeExtract %5 %331 0
%333 = OpCompositeExtract %5 %331 1
%334 = OpCompositeExtract %5 %331 2
%335 = OpCompositeExtract %5 %331 3
%336 = OpIAdd %5 %232 %332
%337 = OpIAdd %5 %233 %333
%338 = OpIAdd %5 %234 %334
%339 = OpIAdd %5 %235 %335
%340 = OpImageFetch %72 %121 %169
%341 = OpCompositeExtract %5 %340 0
%342 = OpCompositeExtract %5 %340 1
%343 = OpCompositeExtract %5 %340 2
%344 = OpCompositeExtract %5 %340 3
%345 = OpIAdd %5 %244 %341
%346 = OpIAdd %5 %245 %342
%347 = OpIAdd %5 %246 %343
%348 = OpIAdd %5 %247 %344
%350 = OpAccessChain %349 %68 %137
OpStore %350 %326
%351 = OpAccessChain %349 %68 %109
OpStore %351 %327
%352 = OpAccessChain %349 %68 %102
OpStore %352 %328
%353 = OpAccessChain %349 %68 %95
OpStore %353 %329
%355 = OpAccessChain %354 %71 %137
%356 = OpBitcast %14 %336
OpStore %355 %356
%357 = OpAccessChain %354 %71 %109
%358 = OpBitcast %14 %337
OpStore %357 %358
%359 = OpAccessChain %354 %71 %102
%360 = OpBitcast %14 %338
OpStore %359 %360
%361 = OpAccessChain %354 %71 %95
%362 = OpBitcast %14 %339
OpStore %361 %362
%364 = OpAccessChain %363 %74 %137
OpStore %364 %345
%365 = OpAccessChain %363 %74 %109
OpStore %365 %346
%366 = OpAccessChain %363 %74 %102
OpStore %366 %347
%367 = OpAccessChain %363 %74 %95
OpStore %367 %348
OpReturn
OpFunctionEnd
#endif
