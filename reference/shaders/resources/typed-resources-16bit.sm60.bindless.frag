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
    u16vec4 _205 = u16vec4(texelFetch(_18[_145], ivec2(uvec2(1u, 2u)), int(3u)));
    u16vec4 _213 = u16vec4(texelFetch(_22[_139], ivec2(uvec2(4u, 5u)), int(6u)));
    mediump vec4 _219 = textureGather(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y));
    mediump float _224 = _219.x + _197.x;
    float hp_copy_224 = _224;
    mediump float _225 = _219.y + _197.y;
    float hp_copy_225 = _225;
    mediump float _226 = _219.z + _197.z;
    float hp_copy_226 = _226;
    mediump float _227 = _219.w + _197.w;
    float hp_copy_227 = _227;
    u16vec4 _232 = u16vec4(textureGather(isampler2D(_18[_145], _62[registers._m2]), vec2(UV.x, UV.y), int(1u)));
    u16vec4 _245 = u16vec4(textureGather(usampler2D(_22[_139], _62[registers._m2]), vec2(UV.x, UV.y), int(2u)));
    mediump float _261 = vec4(texture(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), vec3(vec2(UV.x, UV.y), 0.5))).x;
    float hp_copy_261 = _261;
    mediump float _266 = hp_copy_261 + hp_copy_224;
    float hp_copy_266 = _266;
    mediump float _267 = hp_copy_261 + hp_copy_225;
    float hp_copy_267 = _267;
    mediump float _268 = hp_copy_261 + hp_copy_226;
    float hp_copy_268 = _268;
    mediump float _269 = hp_copy_261 + hp_copy_227;
    float hp_copy_269 = _269;
    mediump float _273 = vec4(textureLod(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), vec3(vec2(UV.x, UV.y), 0.5), 0.0)).x;
    float hp_copy_273 = _273;
    mediump float _278 = hp_copy_273 + hp_copy_266;
    mediump float _279 = hp_copy_273 + hp_copy_267;
    mediump float _280 = hp_copy_273 + hp_copy_268;
    mediump float _281 = hp_copy_273 + hp_copy_269;
    vec2 _282 = vec2(UV.x, UV.y);
    mediump vec4 _283 = textureGather(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), _282, 0.5);
    mediump vec4 _292 = textureLod(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), 0.0);
    mediump vec4 _305 = textureGrad(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), vec2(0.20000000298023223876953125, 0.300000011920928955078125), vec2(0.4000000059604644775390625, 0.5));
    mediump vec4 _317 = texture(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), 0.5);
    mediump vec4 _327 = texelFetch(_26[registers._m1 + 3u], int(_169));
    u16vec4 _337 = u16vec4(texelFetch(_30[registers._m1 + 4u], int(_169)));
    u16vec4 _347 = u16vec4(texelFetch(_34[registers._m1 + 5u], int(_169)));
    SV_Target.x = ((((_283.x + _278) + _292.x) + _305.x) + _317.x) + _327.x;
    SV_Target.y = ((((_283.y + _279) + _292.y) + _305.y) + _317.y) + _327.y;
    SV_Target.z = ((((_283.z + _280) + _292.z) + _305.z) + _317.z) + _327.z;
    SV_Target.w = ((((_283.w + _281) + _292.w) + _305.w) + _317.w) + _327.w;
    SV_Target_1.x = int(int16_t((_232.x + _205.x) + _337.x));
    SV_Target_1.y = int(int16_t((_232.y + _205.y) + _337.y));
    SV_Target_1.z = int(int16_t((_232.z + _205.z) + _337.z));
    SV_Target_1.w = int(int16_t((_232.w + _205.w) + _337.w));
    SV_Target_2.x = uint((_245.x + _213.x) + _347.x);
    SV_Target_2.y = uint((_245.y + _213.y) + _347.y);
    SV_Target_2.z = uint((_245.z + _213.z) + _347.z);
    SV_Target_2.w = uint((_245.w + _213.w) + _347.w);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 381
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
OpDecorate %203 RelaxedPrecision
OpDecorate %211 RelaxedPrecision
OpDecorate %219 RelaxedPrecision
OpDecorate %220 RelaxedPrecision
OpDecorate %221 RelaxedPrecision
OpDecorate %222 RelaxedPrecision
OpDecorate %223 RelaxedPrecision
OpDecorate %224 RelaxedPrecision
OpDecorate %225 RelaxedPrecision
OpDecorate %226 RelaxedPrecision
OpDecorate %227 RelaxedPrecision
OpDecorate %231 RelaxedPrecision
OpDecorate %244 RelaxedPrecision
OpDecorate %266 RelaxedPrecision
OpDecorate %267 RelaxedPrecision
OpDecorate %268 RelaxedPrecision
OpDecorate %269 RelaxedPrecision
OpDecorate %278 RelaxedPrecision
OpDecorate %279 RelaxedPrecision
OpDecorate %280 RelaxedPrecision
OpDecorate %281 RelaxedPrecision
OpDecorate %283 RelaxedPrecision
OpDecorate %284 RelaxedPrecision
OpDecorate %285 RelaxedPrecision
OpDecorate %286 RelaxedPrecision
OpDecorate %287 RelaxedPrecision
OpDecorate %288 RelaxedPrecision
OpDecorate %289 RelaxedPrecision
OpDecorate %290 RelaxedPrecision
OpDecorate %291 RelaxedPrecision
OpDecorate %292 RelaxedPrecision
OpDecorate %294 RelaxedPrecision
OpDecorate %295 RelaxedPrecision
OpDecorate %296 RelaxedPrecision
OpDecorate %297 RelaxedPrecision
OpDecorate %298 RelaxedPrecision
OpDecorate %299 RelaxedPrecision
OpDecorate %300 RelaxedPrecision
OpDecorate %301 RelaxedPrecision
OpDecorate %305 RelaxedPrecision
OpDecorate %309 RelaxedPrecision
OpDecorate %310 RelaxedPrecision
OpDecorate %311 RelaxedPrecision
OpDecorate %312 RelaxedPrecision
OpDecorate %313 RelaxedPrecision
OpDecorate %314 RelaxedPrecision
OpDecorate %315 RelaxedPrecision
OpDecorate %316 RelaxedPrecision
OpDecorate %317 RelaxedPrecision
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
OpDecorate %331 RelaxedPrecision
OpDecorate %332 RelaxedPrecision
OpDecorate %333 RelaxedPrecision
OpDecorate %334 RelaxedPrecision
OpDecorate %335 RelaxedPrecision
OpDecorate %336 RelaxedPrecision
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
%210 = OpConstant %5 6
%228 = OpTypeSampledImage %15
%241 = OpTypeSampledImage %19
%254 = OpTypeImage %9 2D 1 0 0 1 Unknown
%255 = OpTypeSampledImage %254
%257 = OpConstant %9 0.5
%302 = OpConstant %9 0.200000003
%303 = OpConstant %9 0.300000012
%304 = OpConstant %9 0.400000006
%356 = OpTypePointer Output %9
%361 = OpTypePointer Output %14
%370 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %379
%379 = OpLabel
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
%205 = OpSConvert %178 %203
%206 = OpCompositeExtract %174 %205 0
%207 = OpCompositeExtract %174 %205 1
%208 = OpCompositeExtract %174 %205 2
%209 = OpCompositeExtract %174 %205 3
%212 = OpCompositeConstruct %171 %79 %82
%211 = OpImageFetch %72 %140 %212 Lod %210
%213 = OpUConvert %178 %211
%214 = OpCompositeExtract %174 %213 0
%215 = OpCompositeExtract %174 %213 1
%216 = OpCompositeExtract %174 %213 2
%217 = OpCompositeExtract %174 %213 3
%218 = OpCompositeConstruct %63 %164 %166
%219 = OpImageGather %66 %195 %218 %137
%220 = OpCompositeExtract %9 %219 0
%221 = OpCompositeExtract %9 %219 1
%222 = OpCompositeExtract %9 %219 2
%223 = OpCompositeExtract %9 %219 3
%224 = OpFAdd %9 %220 %199
%225 = OpFAdd %9 %221 %200
%226 = OpFAdd %9 %222 %201
%227 = OpFAdd %9 %223 %202
%229 = OpSampledImage %228 %146 %161
%230 = OpCompositeConstruct %63 %164 %166
%231 = OpImageGather %69 %229 %230 %109
%232 = OpSConvert %178 %231
%233 = OpCompositeExtract %174 %232 0
%234 = OpCompositeExtract %174 %232 1
%235 = OpCompositeExtract %174 %232 2
%236 = OpCompositeExtract %174 %232 3
%237 = OpIAdd %174 %233 %206
%238 = OpIAdd %174 %234 %207
%239 = OpIAdd %174 %235 %208
%240 = OpIAdd %174 %236 %209
%242 = OpSampledImage %241 %140 %161
%243 = OpCompositeConstruct %63 %164 %166
%244 = OpImageGather %72 %242 %243 %102
%245 = OpUConvert %178 %244
%246 = OpCompositeExtract %174 %245 0
%247 = OpCompositeExtract %174 %245 1
%248 = OpCompositeExtract %174 %245 2
%249 = OpCompositeExtract %174 %245 3
%250 = OpIAdd %174 %246 %214
%251 = OpIAdd %174 %247 %215
%252 = OpIAdd %174 %248 %216
%253 = OpIAdd %174 %249 %217
%256 = OpSampledImage %255 %151 %157
%259 = OpCompositeConstruct %63 %164 %166
%258 = OpImageSampleDrefImplicitLod %9 %256 %259 %257 None
%260 = OpCompositeConstruct %66 %258 %258 %258 %258
%261 = OpCompositeExtract %9 %260 0
%262 = OpFAdd %9 %261 %224
%263 = OpFAdd %9 %261 %225
%264 = OpFAdd %9 %261 %226
%265 = OpFAdd %9 %261 %227
%266 = OpCopyObject %9 %262
%267 = OpCopyObject %9 %263
%268 = OpCopyObject %9 %264
%269 = OpCopyObject %9 %265
%271 = OpCompositeConstruct %63 %164 %166
%270 = OpImageSampleDrefExplicitLod %9 %256 %271 %257 Lod %196
%272 = OpCompositeConstruct %66 %270 %270 %270 %270
%273 = OpCompositeExtract %9 %272 0
%274 = OpFAdd %9 %273 %266
%275 = OpFAdd %9 %273 %267
%276 = OpFAdd %9 %273 %268
%277 = OpFAdd %9 %273 %269
%278 = OpCopyObject %9 %274
%279 = OpCopyObject %9 %275
%280 = OpCopyObject %9 %276
%281 = OpCopyObject %9 %277
%282 = OpCompositeConstruct %63 %164 %166
%283 = OpImageDrefGather %66 %256 %282 %257
%284 = OpCompositeExtract %9 %283 0
%285 = OpCompositeExtract %9 %283 1
%286 = OpCompositeExtract %9 %283 2
%287 = OpCompositeExtract %9 %283 3
%288 = OpFAdd %9 %284 %278
%289 = OpFAdd %9 %285 %279
%290 = OpFAdd %9 %286 %280
%291 = OpFAdd %9 %287 %281
%293 = OpCompositeConstruct %63 %164 %166
%292 = OpImageSampleExplicitLod %66 %195 %293 Lod %196
%294 = OpCompositeExtract %9 %292 0
%295 = OpCompositeExtract %9 %292 1
%296 = OpCompositeExtract %9 %292 2
%297 = OpCompositeExtract %9 %292 3
%298 = OpFAdd %9 %288 %294
%299 = OpFAdd %9 %289 %295
%300 = OpFAdd %9 %290 %296
%301 = OpFAdd %9 %291 %297
%306 = OpCompositeConstruct %63 %164 %166
%307 = OpCompositeConstruct %63 %302 %303
%308 = OpCompositeConstruct %63 %304 %257
%305 = OpImageSampleExplicitLod %66 %195 %306 Grad %307 %308
%309 = OpCompositeExtract %9 %305 0
%310 = OpCompositeExtract %9 %305 1
%311 = OpCompositeExtract %9 %305 2
%312 = OpCompositeExtract %9 %305 3
%313 = OpFAdd %9 %298 %309
%314 = OpFAdd %9 %299 %310
%315 = OpFAdd %9 %300 %311
%316 = OpFAdd %9 %301 %312
%318 = OpCompositeConstruct %63 %164 %166
%317 = OpImageSampleImplicitLod %66 %195 %318 Bias %257
%319 = OpCompositeExtract %9 %317 0
%320 = OpCompositeExtract %9 %317 1
%321 = OpCompositeExtract %9 %317 2
%322 = OpCompositeExtract %9 %317 3
%323 = OpFAdd %9 %313 %319
%324 = OpFAdd %9 %314 %320
%325 = OpFAdd %9 %315 %321
%326 = OpFAdd %9 %316 %322
%327 = OpImageFetch %66 %133 %169
%328 = OpCompositeExtract %9 %327 0
%329 = OpCompositeExtract %9 %327 1
%330 = OpCompositeExtract %9 %327 2
%331 = OpCompositeExtract %9 %327 3
%332 = OpFAdd %9 %323 %328
%333 = OpFAdd %9 %324 %329
%334 = OpFAdd %9 %325 %330
%335 = OpFAdd %9 %326 %331
%336 = OpImageFetch %69 %127 %169
%337 = OpSConvert %178 %336
%338 = OpCompositeExtract %174 %337 0
%339 = OpCompositeExtract %174 %337 1
%340 = OpCompositeExtract %174 %337 2
%341 = OpCompositeExtract %174 %337 3
%342 = OpIAdd %174 %237 %338
%343 = OpIAdd %174 %238 %339
%344 = OpIAdd %174 %239 %340
%345 = OpIAdd %174 %240 %341
%346 = OpImageFetch %72 %121 %169
%347 = OpUConvert %178 %346
%348 = OpCompositeExtract %174 %347 0
%349 = OpCompositeExtract %174 %347 1
%350 = OpCompositeExtract %174 %347 2
%351 = OpCompositeExtract %174 %347 3
%352 = OpIAdd %174 %250 %348
%353 = OpIAdd %174 %251 %349
%354 = OpIAdd %174 %252 %350
%355 = OpIAdd %174 %253 %351
%357 = OpAccessChain %356 %68 %137
OpStore %357 %332
%358 = OpAccessChain %356 %68 %109
OpStore %358 %333
%359 = OpAccessChain %356 %68 %102
OpStore %359 %334
%360 = OpAccessChain %356 %68 %95
OpStore %360 %335
%362 = OpAccessChain %361 %71 %137
%363 = OpSConvert %14 %342
OpStore %362 %363
%364 = OpAccessChain %361 %71 %109
%365 = OpSConvert %14 %343
OpStore %364 %365
%366 = OpAccessChain %361 %71 %102
%367 = OpSConvert %14 %344
OpStore %366 %367
%368 = OpAccessChain %361 %71 %95
%369 = OpSConvert %14 %345
OpStore %368 %369
%371 = OpAccessChain %370 %74 %137
%372 = OpUConvert %5 %352
OpStore %371 %372
%373 = OpAccessChain %370 %74 %109
%374 = OpUConvert %5 %353
OpStore %373 %374
%375 = OpAccessChain %370 %74 %102
%376 = OpUConvert %5 %354
OpStore %375 %376
%377 = OpAccessChain %370 %74 %95
%378 = OpUConvert %5 %355
OpStore %377 %378
OpReturn
OpFunctionEnd
#endif
