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
    float16_t _168 = float16_t(UV.x);
    float16_t _169 = float16_t(UV.y);
    uint _170 = uint(int(UV.x));
    uint _171 = uint(int(UV.y));
    imageStore(_38[registers._m3], ivec2(uvec2(_170, _171)), vec4(f16vec4(_168, _169, _168, _169)));
    uint16_t _178 = uint16_t(int16_t(UV.x));
    uint16_t _179 = uint16_t(int16_t(UV.y));
    imageStore(_42[registers._m3 + 1u], ivec2(uvec2(_170, _171)), ivec4(i16vec4(u16vec4(_178, _179, _178, _179))));
    uint16_t _184 = uint16_t(UV.x);
    uint16_t _185 = uint16_t(UV.y);
    imageStore(_46[registers._m3 + 2u], ivec2(uvec2(_170, _171)), uvec4(u16vec4(_184, _185, _184, _185)));
    imageStore(_50[registers._m4 + 3u], int(_170), vec4(f16vec4(float16_t(8.0))));
    imageStore(_54[registers._m4 + 4u], int(_170), ivec4(i16vec4(u16vec4(65516us))));
    imageStore(_58[registers._m4 + 5u], int(_170), uvec4(u16vec4(80us)));
    f16vec4 _203 = f16vec4(texture(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y)));
    uvec4 _210 = uvec4(texelFetch(_18[_145], ivec2(uvec2(1u, 2u)), int(3u)));
    mediump uvec4 _220 = texelFetch(_22[_139], ivec2(uvec2(4u, 5u)), int(6u));
    f16vec4 _232 = f16vec4(textureGather(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y)));
    u16vec4 _245 = u16vec4(textureGather(isampler2D(_18[_145], _62[registers._m2]), vec2(UV.x, UV.y), int(1u)));
    u16vec4 _258 = u16vec4(textureGather(usampler2D(_22[_139], _62[registers._m2]), vec2(UV.x, UV.y), int(2u)));
    mediump vec4 _273 = vec4(texture(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), vec3(vec2(UV.x, UV.y), 0.5)));
    mediump float _274 = _273.x;
    mediump vec4 _289 = vec4(textureLod(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), vec3(vec2(UV.x, UV.y), 0.5), 0.0));
    mediump float _290 = _289.x;
    vec2 _303 = vec2(UV.x, UV.y);
    f16vec4 _305 = f16vec4(textureGather(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), _303, 0.5));
    f16vec4 _312 = f16vec4(textureLod(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), 0.0));
    f16vec4 _324 = f16vec4(textureGrad(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), vec2(0.20000000298023223876953125, 0.300000011920928955078125), vec2(0.4000000059604644775390625, 0.5)));
    f16vec4 _331 = f16vec4(texture(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), 0.5));
    mediump vec4 _336 = texelFetch(_26[registers._m1 + 3u], int(_170));
    uvec4 _366 = uvec4(texelFetch(_30[registers._m1 + 4u], int(_170)));
    mediump uvec4 _379 = texelFetch(_34[registers._m1 + 5u], int(_170));
    SV_Target.x = float(((((_312.x + _305.x) + _324.x) + float16_t(float(float16_t(_274 + float(_232.x + _203.x))) + _290)) + _331.x) + float16_t(_336.x));
    SV_Target.y = float(((((_312.y + _305.y) + _324.y) + float16_t(float(float16_t(_274 + float(_232.y + _203.y))) + _290)) + _331.y) + float16_t(_336.y));
    SV_Target.z = float(((((_312.z + _305.z) + _324.z) + float16_t(float(float16_t(_274 + float(_232.z + _203.z))) + _290)) + _331.z) + float16_t(_336.z));
    SV_Target.w = float(((((_312.w + _305.w) + _324.w) + float16_t(float(float16_t(_274 + float(_232.w + _203.w))) + _290)) + _331.w) + float16_t(_336.w));
    SV_Target_1.x = int(int16_t((_245.x + uint16_t(_210.x)) + uint16_t(_366.x)));
    SV_Target_1.y = int(int16_t((_245.y + uint16_t(_210.y)) + uint16_t(_366.y)));
    SV_Target_1.z = int(int16_t((_245.z + uint16_t(_210.z)) + uint16_t(_366.z)));
    SV_Target_1.w = int(int16_t((_245.w + uint16_t(_210.w)) + uint16_t(_366.w)));
    SV_Target_2.x = uint((_258.x + uint16_t(_220.x)) + uint16_t(_379.x));
    SV_Target_2.y = uint((_258.y + uint16_t(_220.y)) + uint16_t(_379.y));
    SV_Target_2.z = uint((_258.z + uint16_t(_220.z)) + uint16_t(_379.z));
    SV_Target_2.w = uint((_258.w + uint16_t(_220.w)) + uint16_t(_379.w));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 422
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpCapability DenormPreserve
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpCapability FloatControls2
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_float_controls"
OpExtension "SPV_KHR_float_controls2"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %65 %68 %71 %74
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpExecutionModeId %3 FPFastMathDefault %9 %419
OpExecutionModeId %3 FPFastMathDefault %167 %419
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
OpDecorate %168 FPFastMathMode AllowRecip
OpDecorate %169 FPFastMathMode AllowRecip
OpDecorate %283 FPFastMathMode AllowRecip
OpDecorate %284 FPFastMathMode AllowRecip
OpDecorate %285 FPFastMathMode AllowRecip
OpDecorate %286 FPFastMathMode AllowRecip
OpDecorate %299 FPFastMathMode AllowRecip
OpDecorate %300 FPFastMathMode AllowRecip
OpDecorate %301 FPFastMathMode AllowRecip
OpDecorate %302 FPFastMathMode AllowRecip
OpDecorate %341 FPFastMathMode AllowRecip
OpDecorate %342 FPFastMathMode AllowRecip
OpDecorate %343 FPFastMathMode AllowRecip
OpDecorate %344 FPFastMathMode AllowRecip
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
%167 = OpTypeFloat 16
%172 = OpTypeVector %5 2
%174 = OpTypeVector %167 4
%177 = OpTypeInt 16 0
%181 = OpTypeVector %177 4
%189 = OpConstant %167 0x1p+3
%192 = OpConstant %177 65516
%195 = OpConstant %177 80
%198 = OpTypeSampledImage %10
%200 = OpConstant %9 0
%219 = OpConstant %5 6
%241 = OpTypeSampledImage %15
%254 = OpTypeSampledImage %19
%267 = OpTypeImage %9 2D 1 0 0 1 Unknown
%268 = OpTypeSampledImage %267
%270 = OpConstant %9 0.5
%317 = OpConstant %9 0.200000003
%318 = OpConstant %9 0.300000012
%319 = OpConstant %9 0.400000006
%392 = OpTypePointer Output %9
%401 = OpTypePointer Output %14
%410 = OpTypePointer Output %5
%419 = OpConstant %5 458767
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %420
%420 = OpLabel
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
%168 = OpFConvert %167 %164
%169 = OpFConvert %167 %166
%170 = OpConvertFToS %5 %164
%171 = OpConvertFToS %5 %166
%173 = OpCompositeConstruct %172 %170 %171
%175 = OpCompositeConstruct %174 %168 %169 %168 %169
%176 = OpFConvert %66 %175
OpImageWrite %115 %173 %176
%178 = OpConvertFToS %177 %164
%179 = OpConvertFToS %177 %166
%180 = OpCompositeConstruct %172 %170 %171
%182 = OpCompositeConstruct %181 %178 %179 %178 %179
%183 = OpSConvert %69 %182
OpImageWrite %110 %180 %183
%184 = OpConvertFToU %177 %164
%185 = OpConvertFToU %177 %166
%186 = OpCompositeConstruct %172 %170 %171
%187 = OpCompositeConstruct %181 %184 %185 %184 %185
%188 = OpUConvert %72 %187
OpImageWrite %103 %186 %188
%190 = OpCompositeConstruct %174 %189 %189 %189 %189
%191 = OpFConvert %66 %190
OpImageWrite %96 %170 %191
%193 = OpCompositeConstruct %181 %192 %192 %192 %192
%194 = OpSConvert %69 %193
OpImageWrite %89 %170 %194
%196 = OpCompositeConstruct %181 %195 %195 %195 %195
%197 = OpUConvert %72 %196
OpImageWrite %83 %170 %197
%199 = OpSampledImage %198 %151 %161
%202 = OpCompositeConstruct %63 %164 %166
%201 = OpImageSampleImplicitLod %66 %199 %202 None
%203 = OpFConvert %174 %201
%204 = OpCompositeExtract %167 %203 0
%205 = OpCompositeExtract %167 %203 1
%206 = OpCompositeExtract %167 %203 2
%207 = OpCompositeExtract %167 %203 3
%209 = OpCompositeConstruct %172 %109 %102
%208 = OpImageFetch %69 %146 %209 Lod %95
%210 = OpBitcast %72 %208
%211 = OpCompositeExtract %5 %210 0
%212 = OpCompositeExtract %5 %210 1
%213 = OpCompositeExtract %5 %210 2
%214 = OpCompositeExtract %5 %210 3
%215 = OpUConvert %177 %211
%216 = OpUConvert %177 %212
%217 = OpUConvert %177 %213
%218 = OpUConvert %177 %214
%221 = OpCompositeConstruct %172 %79 %82
%220 = OpImageFetch %72 %140 %221 Lod %219
%222 = OpCompositeExtract %5 %220 0
%223 = OpCompositeExtract %5 %220 1
%224 = OpCompositeExtract %5 %220 2
%225 = OpCompositeExtract %5 %220 3
%226 = OpUConvert %177 %222
%227 = OpUConvert %177 %223
%228 = OpUConvert %177 %224
%229 = OpUConvert %177 %225
%230 = OpCompositeConstruct %63 %164 %166
%231 = OpImageGather %66 %199 %230 %137
%232 = OpFConvert %174 %231
%233 = OpCompositeExtract %167 %232 0
%234 = OpCompositeExtract %167 %232 1
%235 = OpCompositeExtract %167 %232 2
%236 = OpCompositeExtract %167 %232 3
%237 = OpFAdd %167 %233 %204
%238 = OpFAdd %167 %234 %205
%239 = OpFAdd %167 %235 %206
%240 = OpFAdd %167 %236 %207
%242 = OpSampledImage %241 %146 %161
%243 = OpCompositeConstruct %63 %164 %166
%244 = OpImageGather %69 %242 %243 %109
%245 = OpSConvert %181 %244
%246 = OpCompositeExtract %177 %245 0
%247 = OpCompositeExtract %177 %245 1
%248 = OpCompositeExtract %177 %245 2
%249 = OpCompositeExtract %177 %245 3
%250 = OpIAdd %177 %246 %215
%251 = OpIAdd %177 %247 %216
%252 = OpIAdd %177 %248 %217
%253 = OpIAdd %177 %249 %218
%255 = OpSampledImage %254 %140 %161
%256 = OpCompositeConstruct %63 %164 %166
%257 = OpImageGather %72 %255 %256 %102
%258 = OpUConvert %181 %257
%259 = OpCompositeExtract %177 %258 0
%260 = OpCompositeExtract %177 %258 1
%261 = OpCompositeExtract %177 %258 2
%262 = OpCompositeExtract %177 %258 3
%263 = OpIAdd %177 %259 %226
%264 = OpIAdd %177 %260 %227
%265 = OpIAdd %177 %261 %228
%266 = OpIAdd %177 %262 %229
%269 = OpSampledImage %268 %151 %157
%272 = OpCompositeConstruct %63 %164 %166
%271 = OpImageSampleDrefImplicitLod %9 %269 %272 %270 None
%273 = OpCompositeConstruct %66 %271 %271 %271 %271
%274 = OpCompositeExtract %9 %273 0
%275 = OpFConvert %9 %237
%276 = OpFConvert %9 %238
%277 = OpFConvert %9 %239
%278 = OpFConvert %9 %240
%279 = OpFAdd %9 %274 %275
%280 = OpFAdd %9 %274 %276
%281 = OpFAdd %9 %274 %277
%282 = OpFAdd %9 %274 %278
%283 = OpFConvert %167 %279
%284 = OpFConvert %167 %280
%285 = OpFConvert %167 %281
%286 = OpFConvert %167 %282
%288 = OpCompositeConstruct %63 %164 %166
%287 = OpImageSampleDrefExplicitLod %9 %269 %288 %270 Lod %200
%289 = OpCompositeConstruct %66 %287 %287 %287 %287
%290 = OpCompositeExtract %9 %289 0
%291 = OpFConvert %9 %283
%292 = OpFConvert %9 %284
%293 = OpFConvert %9 %285
%294 = OpFConvert %9 %286
%295 = OpFAdd %9 %291 %290
%296 = OpFAdd %9 %292 %290
%297 = OpFAdd %9 %293 %290
%298 = OpFAdd %9 %294 %290
%299 = OpFConvert %167 %295
%300 = OpFConvert %167 %296
%301 = OpFConvert %167 %297
%302 = OpFConvert %167 %298
%303 = OpCompositeConstruct %63 %164 %166
%304 = OpImageDrefGather %66 %269 %303 %270
%305 = OpFConvert %174 %304
%306 = OpCompositeExtract %167 %305 0
%307 = OpCompositeExtract %167 %305 1
%308 = OpCompositeExtract %167 %305 2
%309 = OpCompositeExtract %167 %305 3
%311 = OpCompositeConstruct %63 %164 %166
%310 = OpImageSampleExplicitLod %66 %199 %311 Lod %200
%312 = OpFConvert %174 %310
%313 = OpCompositeExtract %167 %312 0
%314 = OpCompositeExtract %167 %312 1
%315 = OpCompositeExtract %167 %312 2
%316 = OpCompositeExtract %167 %312 3
%321 = OpCompositeConstruct %63 %164 %166
%322 = OpCompositeConstruct %63 %317 %318
%323 = OpCompositeConstruct %63 %319 %270
%320 = OpImageSampleExplicitLod %66 %199 %321 Grad %322 %323
%324 = OpFConvert %174 %320
%325 = OpCompositeExtract %167 %324 0
%326 = OpCompositeExtract %167 %324 1
%327 = OpCompositeExtract %167 %324 2
%328 = OpCompositeExtract %167 %324 3
%330 = OpCompositeConstruct %63 %164 %166
%329 = OpImageSampleImplicitLod %66 %199 %330 Bias %270
%331 = OpFConvert %174 %329
%332 = OpCompositeExtract %167 %331 0
%333 = OpCompositeExtract %167 %331 1
%334 = OpCompositeExtract %167 %331 2
%335 = OpCompositeExtract %167 %331 3
%336 = OpImageFetch %66 %133 %170
%337 = OpCompositeExtract %9 %336 0
%338 = OpCompositeExtract %9 %336 1
%339 = OpCompositeExtract %9 %336 2
%340 = OpCompositeExtract %9 %336 3
%341 = OpFConvert %167 %337
%342 = OpFConvert %167 %338
%343 = OpFConvert %167 %339
%344 = OpFConvert %167 %340
%345 = OpFAdd %167 %313 %306
%346 = OpFAdd %167 %345 %325
%347 = OpFAdd %167 %346 %299
%348 = OpFAdd %167 %347 %332
%349 = OpFAdd %167 %348 %341
%350 = OpFAdd %167 %314 %307
%351 = OpFAdd %167 %350 %326
%352 = OpFAdd %167 %351 %300
%353 = OpFAdd %167 %352 %333
%354 = OpFAdd %167 %353 %342
%355 = OpFAdd %167 %315 %308
%356 = OpFAdd %167 %355 %327
%357 = OpFAdd %167 %356 %301
%358 = OpFAdd %167 %357 %334
%359 = OpFAdd %167 %358 %343
%360 = OpFAdd %167 %316 %309
%361 = OpFAdd %167 %360 %328
%362 = OpFAdd %167 %361 %302
%363 = OpFAdd %167 %362 %335
%364 = OpFAdd %167 %363 %344
%365 = OpImageFetch %69 %127 %170
%366 = OpBitcast %72 %365
%367 = OpCompositeExtract %5 %366 0
%368 = OpCompositeExtract %5 %366 1
%369 = OpCompositeExtract %5 %366 2
%370 = OpCompositeExtract %5 %366 3
%371 = OpUConvert %177 %367
%372 = OpUConvert %177 %368
%373 = OpUConvert %177 %369
%374 = OpUConvert %177 %370
%375 = OpIAdd %177 %250 %371
%376 = OpIAdd %177 %251 %372
%377 = OpIAdd %177 %252 %373
%378 = OpIAdd %177 %253 %374
%379 = OpImageFetch %72 %121 %170
%380 = OpCompositeExtract %5 %379 0
%381 = OpCompositeExtract %5 %379 1
%382 = OpCompositeExtract %5 %379 2
%383 = OpCompositeExtract %5 %379 3
%384 = OpUConvert %177 %380
%385 = OpUConvert %177 %381
%386 = OpUConvert %177 %382
%387 = OpUConvert %177 %383
%388 = OpIAdd %177 %263 %384
%389 = OpIAdd %177 %264 %385
%390 = OpIAdd %177 %265 %386
%391 = OpIAdd %177 %266 %387
%393 = OpAccessChain %392 %68 %137
%394 = OpFConvert %9 %349
OpStore %393 %394
%395 = OpAccessChain %392 %68 %109
%396 = OpFConvert %9 %354
OpStore %395 %396
%397 = OpAccessChain %392 %68 %102
%398 = OpFConvert %9 %359
OpStore %397 %398
%399 = OpAccessChain %392 %68 %95
%400 = OpFConvert %9 %364
OpStore %399 %400
%402 = OpAccessChain %401 %71 %137
%403 = OpSConvert %14 %375
OpStore %402 %403
%404 = OpAccessChain %401 %71 %109
%405 = OpSConvert %14 %376
OpStore %404 %405
%406 = OpAccessChain %401 %71 %102
%407 = OpSConvert %14 %377
OpStore %406 %407
%408 = OpAccessChain %401 %71 %95
%409 = OpSConvert %14 %378
OpStore %408 %409
%411 = OpAccessChain %410 %74 %137
%412 = OpUConvert %5 %388
OpStore %411 %412
%413 = OpAccessChain %410 %74 %109
%414 = OpUConvert %5 %389
OpStore %413 %414
%415 = OpAccessChain %410 %74 %102
%416 = OpUConvert %5 %390
OpStore %415 %416
%417 = OpAccessChain %410 %74 %95
%418 = OpUConvert %5 %391
OpStore %417 %418
OpReturn
OpFunctionEnd
#endif
