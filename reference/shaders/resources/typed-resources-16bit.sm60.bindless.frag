#version 460
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#extension GL_EXT_shader_16bit_storage : require
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
    uint16_t _175 = uint16_t(int16_t(UV.x));
    uint16_t _176 = uint16_t(int16_t(UV.y));
    imageStore(_42[registers._m3 + 1u], ivec2(uvec2(_169, _170)), ivec4(i16vec4(u16vec4(_175, _176, _175, _176))));
    uint16_t _181 = uint16_t(UV.x);
    uint16_t _182 = uint16_t(UV.y);
    imageStore(_46[registers._m3 + 2u], ivec2(uvec2(_169, _170)), uvec4(u16vec4(_181, _182, _181, _182)));
    imageStore(_50[registers._m4 + 3u], int(_169), vec4(8.0));
    imageStore(_54[registers._m4 + 4u], int(_169), ivec4(i16vec4(u16vec4(65516us))));
    imageStore(_58[registers._m4 + 5u], int(_169), uvec4(u16vec4(80us)));
    mediump vec4 _197 = texture(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y));
    uvec4 _205 = uvec4(texelFetch(_18[_145], ivec2(uvec2(1u, 2u)), int(3u)));
    mediump uvec4 _215 = texelFetch(_22[_139], ivec2(uvec2(4u, 5u)), int(6u));
    mediump vec4 _226 = textureGather(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y));
    mediump float _231 = _226.x + _197.x;
    float hp_copy_231 = _231;
    mediump float _232 = _226.y + _197.y;
    float hp_copy_232 = _232;
    mediump float _233 = _226.z + _197.z;
    float hp_copy_233 = _233;
    mediump float _234 = _226.w + _197.w;
    float hp_copy_234 = _234;
    u16vec4 _239 = u16vec4(textureGather(isampler2D(_18[_145], _62[registers._m2]), vec2(UV.x, UV.y), int(1u)));
    u16vec4 _252 = u16vec4(textureGather(usampler2D(_22[_139], _62[registers._m2]), vec2(UV.x, UV.y), int(2u)));
    mediump float _268 = vec4(texture(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), vec3(vec2(UV.x, UV.y), 0.5))).x;
    float hp_copy_268 = _268;
    mediump float _273 = hp_copy_268 + hp_copy_231;
    float hp_copy_273 = _273;
    mediump float _274 = hp_copy_268 + hp_copy_232;
    float hp_copy_274 = _274;
    mediump float _275 = hp_copy_268 + hp_copy_233;
    float hp_copy_275 = _275;
    mediump float _276 = hp_copy_268 + hp_copy_234;
    float hp_copy_276 = _276;
    mediump float _280 = vec4(textureLod(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), vec3(vec2(UV.x, UV.y), 0.5), 0.0)).x;
    float hp_copy_280 = _280;
    mediump float _285 = hp_copy_273 + hp_copy_280;
    mediump float _286 = hp_copy_274 + hp_copy_280;
    mediump float _287 = hp_copy_275 + hp_copy_280;
    mediump float _288 = hp_copy_276 + hp_copy_280;
    vec2 _289 = vec2(UV.x, UV.y);
    mediump vec4 _290 = textureGather(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), _289, 0.5);
    mediump vec4 _295 = textureLod(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), 0.0);
    mediump vec4 _304 = textureGrad(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), vec2(0.20000000298023223876953125, 0.300000011920928955078125), vec2(0.4000000059604644775390625, 0.5));
    mediump vec4 _312 = texture(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), 0.5);
    mediump vec4 _318 = texelFetch(_26[registers._m1 + 3u], int(_169));
    mediump float _323 = _318.x;
    mediump float _324 = _318.y;
    mediump float _325 = _318.z;
    mediump float _326 = _318.w;
    uvec4 _348 = uvec4(texelFetch(_30[registers._m1 + 4u], int(_169)));
    mediump uvec4 _361 = texelFetch(_34[registers._m1 + 5u], int(_169));
    SV_Target.x = ((((_295.x + _290.x) + _304.x) + _285) + _312.x) + _323;
    SV_Target.y = ((((_295.y + _290.y) + _304.y) + _286) + _312.y) + _324;
    SV_Target.z = ((((_295.z + _290.z) + _304.z) + _287) + _312.z) + _325;
    SV_Target.w = ((((_295.w + _290.w) + _304.w) + _288) + _312.w) + _326;
    SV_Target_1.x = int(int16_t((_239.x + uint16_t(_205.x)) + uint16_t(_348.x)));
    SV_Target_1.y = int(int16_t((_239.y + uint16_t(_205.y)) + uint16_t(_348.y)));
    SV_Target_1.z = int(int16_t((_239.z + uint16_t(_205.z)) + uint16_t(_348.z)));
    SV_Target_1.w = int(int16_t((_239.w + uint16_t(_205.w)) + uint16_t(_348.w)));
    SV_Target_2.x = uint((_252.x + uint16_t(_215.x)) + uint16_t(_361.x));
    SV_Target_2.y = uint((_252.y + uint16_t(_215.y)) + uint16_t(_361.y));
    SV_Target_2.z = uint((_252.z + uint16_t(_215.z)) + uint16_t(_361.z));
    SV_Target_2.w = uint((_252.w + uint16_t(_215.w)) + uint16_t(_361.w));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 399
; Schema: 0
OpCapability Shader
OpCapability Int16
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
OpDecorate %197 RelaxedPrecision
OpDecorate %199 RelaxedPrecision
OpDecorate %200 RelaxedPrecision
OpDecorate %201 RelaxedPrecision
OpDecorate %202 RelaxedPrecision
OpDecorate %226 RelaxedPrecision
OpDecorate %227 RelaxedPrecision
OpDecorate %228 RelaxedPrecision
OpDecorate %229 RelaxedPrecision
OpDecorate %230 RelaxedPrecision
OpDecorate %231 RelaxedPrecision
OpDecorate %232 RelaxedPrecision
OpDecorate %233 RelaxedPrecision
OpDecorate %234 RelaxedPrecision
OpDecorate %238 RelaxedPrecision
OpDecorate %251 RelaxedPrecision
OpDecorate %273 RelaxedPrecision
OpDecorate %274 RelaxedPrecision
OpDecorate %275 RelaxedPrecision
OpDecorate %276 RelaxedPrecision
OpDecorate %285 RelaxedPrecision
OpDecorate %286 RelaxedPrecision
OpDecorate %287 RelaxedPrecision
OpDecorate %288 RelaxedPrecision
OpDecorate %290 RelaxedPrecision
OpDecorate %291 RelaxedPrecision
OpDecorate %292 RelaxedPrecision
OpDecorate %293 RelaxedPrecision
OpDecorate %294 RelaxedPrecision
OpDecorate %295 RelaxedPrecision
OpDecorate %297 RelaxedPrecision
OpDecorate %298 RelaxedPrecision
OpDecorate %299 RelaxedPrecision
OpDecorate %300 RelaxedPrecision
OpDecorate %304 RelaxedPrecision
OpDecorate %308 RelaxedPrecision
OpDecorate %309 RelaxedPrecision
OpDecorate %310 RelaxedPrecision
OpDecorate %311 RelaxedPrecision
OpDecorate %312 RelaxedPrecision
OpDecorate %314 RelaxedPrecision
OpDecorate %315 RelaxedPrecision
OpDecorate %316 RelaxedPrecision
OpDecorate %317 RelaxedPrecision
OpDecorate %323 RelaxedPrecision
OpDecorate %324 RelaxedPrecision
OpDecorate %325 RelaxedPrecision
OpDecorate %326 RelaxedPrecision
OpDecorate %327 RelaxedPrecision
OpDecorate %328 RelaxedPrecision
OpDecorate %329 RelaxedPrecision
OpDecorate %330 RelaxedPrecision
OpDecorate %331 RelaxedPrecision
OpDecorate %332 RelaxedPrecision
OpDecorate %333 RelaxedPrecision
OpDecorate %334 RelaxedPrecision
OpDecorate %335 RelaxedPrecision
OpDecorate %336 RelaxedPrecision
OpDecorate %337 RelaxedPrecision
OpDecorate %338 RelaxedPrecision
OpDecorate %339 RelaxedPrecision
OpDecorate %340 RelaxedPrecision
OpDecorate %341 RelaxedPrecision
OpDecorate %342 RelaxedPrecision
OpDecorate %343 RelaxedPrecision
OpDecorate %344 RelaxedPrecision
OpDecorate %345 RelaxedPrecision
OpDecorate %346 RelaxedPrecision
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
%174 = OpTypeInt 16 0
%178 = OpTypeVector %174 4
%186 = OpConstant %9 8
%188 = OpConstant %174 65516
%191 = OpConstant %174 80
%194 = OpTypeSampledImage %10
%196 = OpConstant %9 0
%214 = OpConstant %5 6
%235 = OpTypeSampledImage %15
%248 = OpTypeSampledImage %19
%261 = OpTypeImage %9 2D 1 0 0 1 Unknown
%262 = OpTypeSampledImage %261
%264 = OpConstant %9 0.5
%301 = OpConstant %9 0.200000003
%302 = OpConstant %9 0.300000012
%303 = OpConstant %9 0.400000006
%374 = OpTypePointer Output %9
%379 = OpTypePointer Output %14
%388 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %397
%397 = OpLabel
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
%175 = OpConvertFToS %174 %164
%176 = OpConvertFToS %174 %166
%177 = OpCompositeConstruct %171 %169 %170
%179 = OpCompositeConstruct %178 %175 %176 %175 %176
%180 = OpSConvert %69 %179
OpImageWrite %110 %177 %180
%181 = OpConvertFToU %174 %164
%182 = OpConvertFToU %174 %166
%183 = OpCompositeConstruct %171 %169 %170
%184 = OpCompositeConstruct %178 %181 %182 %181 %182
%185 = OpUConvert %72 %184
OpImageWrite %103 %183 %185
%187 = OpCompositeConstruct %66 %186 %186 %186 %186
OpImageWrite %96 %169 %187
%189 = OpCompositeConstruct %178 %188 %188 %188 %188
%190 = OpSConvert %69 %189
OpImageWrite %89 %169 %190
%192 = OpCompositeConstruct %178 %191 %191 %191 %191
%193 = OpUConvert %72 %192
OpImageWrite %83 %169 %193
%195 = OpSampledImage %194 %151 %161
%198 = OpCompositeConstruct %63 %164 %166
%197 = OpImageSampleImplicitLod %66 %195 %198 None
%199 = OpCompositeExtract %9 %197 0
%200 = OpCompositeExtract %9 %197 1
%201 = OpCompositeExtract %9 %197 2
%202 = OpCompositeExtract %9 %197 3
%204 = OpCompositeConstruct %171 %109 %102
%203 = OpImageFetch %69 %146 %204 Lod %95
%205 = OpBitcast %72 %203
%206 = OpCompositeExtract %5 %205 0
%207 = OpCompositeExtract %5 %205 1
%208 = OpCompositeExtract %5 %205 2
%209 = OpCompositeExtract %5 %205 3
%210 = OpUConvert %174 %206
%211 = OpUConvert %174 %207
%212 = OpUConvert %174 %208
%213 = OpUConvert %174 %209
%216 = OpCompositeConstruct %171 %79 %82
%215 = OpImageFetch %72 %140 %216 Lod %214
%217 = OpCompositeExtract %5 %215 0
%218 = OpCompositeExtract %5 %215 1
%219 = OpCompositeExtract %5 %215 2
%220 = OpCompositeExtract %5 %215 3
%221 = OpUConvert %174 %217
%222 = OpUConvert %174 %218
%223 = OpUConvert %174 %219
%224 = OpUConvert %174 %220
%225 = OpCompositeConstruct %63 %164 %166
%226 = OpImageGather %66 %195 %225 %137
%227 = OpCompositeExtract %9 %226 0
%228 = OpCompositeExtract %9 %226 1
%229 = OpCompositeExtract %9 %226 2
%230 = OpCompositeExtract %9 %226 3
%231 = OpFAdd %9 %227 %199
%232 = OpFAdd %9 %228 %200
%233 = OpFAdd %9 %229 %201
%234 = OpFAdd %9 %230 %202
%236 = OpSampledImage %235 %146 %161
%237 = OpCompositeConstruct %63 %164 %166
%238 = OpImageGather %69 %236 %237 %109
%239 = OpSConvert %178 %238
%240 = OpCompositeExtract %174 %239 0
%241 = OpCompositeExtract %174 %239 1
%242 = OpCompositeExtract %174 %239 2
%243 = OpCompositeExtract %174 %239 3
%244 = OpIAdd %174 %240 %210
%245 = OpIAdd %174 %241 %211
%246 = OpIAdd %174 %242 %212
%247 = OpIAdd %174 %243 %213
%249 = OpSampledImage %248 %140 %161
%250 = OpCompositeConstruct %63 %164 %166
%251 = OpImageGather %72 %249 %250 %102
%252 = OpUConvert %178 %251
%253 = OpCompositeExtract %174 %252 0
%254 = OpCompositeExtract %174 %252 1
%255 = OpCompositeExtract %174 %252 2
%256 = OpCompositeExtract %174 %252 3
%257 = OpIAdd %174 %253 %221
%258 = OpIAdd %174 %254 %222
%259 = OpIAdd %174 %255 %223
%260 = OpIAdd %174 %256 %224
%263 = OpSampledImage %262 %151 %157
%266 = OpCompositeConstruct %63 %164 %166
%265 = OpImageSampleDrefImplicitLod %9 %263 %266 %264 None
%267 = OpCompositeConstruct %66 %265 %265 %265 %265
%268 = OpCompositeExtract %9 %267 0
%269 = OpFAdd %9 %268 %231
%270 = OpFAdd %9 %268 %232
%271 = OpFAdd %9 %268 %233
%272 = OpFAdd %9 %268 %234
%273 = OpCopyObject %9 %269
%274 = OpCopyObject %9 %270
%275 = OpCopyObject %9 %271
%276 = OpCopyObject %9 %272
%278 = OpCompositeConstruct %63 %164 %166
%277 = OpImageSampleDrefExplicitLod %9 %263 %278 %264 Lod %196
%279 = OpCompositeConstruct %66 %277 %277 %277 %277
%280 = OpCompositeExtract %9 %279 0
%281 = OpFAdd %9 %273 %280
%282 = OpFAdd %9 %274 %280
%283 = OpFAdd %9 %275 %280
%284 = OpFAdd %9 %276 %280
%285 = OpCopyObject %9 %281
%286 = OpCopyObject %9 %282
%287 = OpCopyObject %9 %283
%288 = OpCopyObject %9 %284
%289 = OpCompositeConstruct %63 %164 %166
%290 = OpImageDrefGather %66 %263 %289 %264
%291 = OpCompositeExtract %9 %290 0
%292 = OpCompositeExtract %9 %290 1
%293 = OpCompositeExtract %9 %290 2
%294 = OpCompositeExtract %9 %290 3
%296 = OpCompositeConstruct %63 %164 %166
%295 = OpImageSampleExplicitLod %66 %195 %296 Lod %196
%297 = OpCompositeExtract %9 %295 0
%298 = OpCompositeExtract %9 %295 1
%299 = OpCompositeExtract %9 %295 2
%300 = OpCompositeExtract %9 %295 3
%305 = OpCompositeConstruct %63 %164 %166
%306 = OpCompositeConstruct %63 %301 %302
%307 = OpCompositeConstruct %63 %303 %264
%304 = OpImageSampleExplicitLod %66 %195 %305 Grad %306 %307
%308 = OpCompositeExtract %9 %304 0
%309 = OpCompositeExtract %9 %304 1
%310 = OpCompositeExtract %9 %304 2
%311 = OpCompositeExtract %9 %304 3
%313 = OpCompositeConstruct %63 %164 %166
%312 = OpImageSampleImplicitLod %66 %195 %313 Bias %264
%314 = OpCompositeExtract %9 %312 0
%315 = OpCompositeExtract %9 %312 1
%316 = OpCompositeExtract %9 %312 2
%317 = OpCompositeExtract %9 %312 3
%318 = OpImageFetch %66 %133 %169
%319 = OpCompositeExtract %9 %318 0
%320 = OpCompositeExtract %9 %318 1
%321 = OpCompositeExtract %9 %318 2
%322 = OpCompositeExtract %9 %318 3
%323 = OpCopyObject %9 %319
%324 = OpCopyObject %9 %320
%325 = OpCopyObject %9 %321
%326 = OpCopyObject %9 %322
%327 = OpFAdd %9 %297 %291
%328 = OpFAdd %9 %327 %308
%329 = OpFAdd %9 %328 %285
%330 = OpFAdd %9 %329 %314
%331 = OpFAdd %9 %330 %323
%332 = OpFAdd %9 %298 %292
%333 = OpFAdd %9 %332 %309
%334 = OpFAdd %9 %333 %286
%335 = OpFAdd %9 %334 %315
%336 = OpFAdd %9 %335 %324
%337 = OpFAdd %9 %299 %293
%338 = OpFAdd %9 %337 %310
%339 = OpFAdd %9 %338 %287
%340 = OpFAdd %9 %339 %316
%341 = OpFAdd %9 %340 %325
%342 = OpFAdd %9 %300 %294
%343 = OpFAdd %9 %342 %311
%344 = OpFAdd %9 %343 %288
%345 = OpFAdd %9 %344 %317
%346 = OpFAdd %9 %345 %326
%347 = OpImageFetch %69 %127 %169
%348 = OpBitcast %72 %347
%349 = OpCompositeExtract %5 %348 0
%350 = OpCompositeExtract %5 %348 1
%351 = OpCompositeExtract %5 %348 2
%352 = OpCompositeExtract %5 %348 3
%353 = OpUConvert %174 %349
%354 = OpUConvert %174 %350
%355 = OpUConvert %174 %351
%356 = OpUConvert %174 %352
%357 = OpIAdd %174 %244 %353
%358 = OpIAdd %174 %245 %354
%359 = OpIAdd %174 %246 %355
%360 = OpIAdd %174 %247 %356
%361 = OpImageFetch %72 %121 %169
%362 = OpCompositeExtract %5 %361 0
%363 = OpCompositeExtract %5 %361 1
%364 = OpCompositeExtract %5 %361 2
%365 = OpCompositeExtract %5 %361 3
%366 = OpUConvert %174 %362
%367 = OpUConvert %174 %363
%368 = OpUConvert %174 %364
%369 = OpUConvert %174 %365
%370 = OpIAdd %174 %257 %366
%371 = OpIAdd %174 %258 %367
%372 = OpIAdd %174 %259 %368
%373 = OpIAdd %174 %260 %369
%375 = OpAccessChain %374 %68 %137
OpStore %375 %331
%376 = OpAccessChain %374 %68 %109
OpStore %376 %336
%377 = OpAccessChain %374 %68 %102
OpStore %377 %341
%378 = OpAccessChain %374 %68 %95
OpStore %378 %346
%380 = OpAccessChain %379 %71 %137
%381 = OpSConvert %14 %357
OpStore %380 %381
%382 = OpAccessChain %379 %71 %109
%383 = OpSConvert %14 %358
OpStore %382 %383
%384 = OpAccessChain %379 %71 %102
%385 = OpSConvert %14 %359
OpStore %384 %385
%386 = OpAccessChain %379 %71 %95
%387 = OpSConvert %14 %360
OpStore %386 %387
%389 = OpAccessChain %388 %74 %137
%390 = OpUConvert %5 %370
OpStore %389 %390
%391 = OpAccessChain %388 %74 %109
%392 = OpUConvert %5 %371
OpStore %391 %392
%393 = OpAccessChain %388 %74 %102
%394 = OpUConvert %5 %372
OpStore %393 %394
%395 = OpAccessChain %388 %74 %95
%396 = OpUConvert %5 %373
OpStore %395 %396
OpReturn
OpFunctionEnd
#endif
