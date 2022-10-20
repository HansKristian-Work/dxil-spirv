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
#extension GL_EXT_buffer_reference : require
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
    u16vec4 _210 = u16vec4(texelFetch(_18[_145], ivec2(uvec2(1u, 2u)), int(3u)));
    u16vec4 _218 = u16vec4(texelFetch(_22[_139], ivec2(uvec2(4u, 5u)), int(6u)));
    f16vec4 _225 = f16vec4(textureGather(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y)));
    u16vec4 _238 = u16vec4(textureGather(isampler2D(_18[_145], _62[registers._m2]), vec2(UV.x, UV.y), int(1u)));
    u16vec4 _251 = u16vec4(textureGather(usampler2D(_22[_139], _62[registers._m2]), vec2(UV.x, UV.y), int(2u)));
    mediump vec4 _266 = vec4(texture(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), vec3(vec2(UV.x, UV.y), 0.5)));
    mediump float _267 = _266.x;
    mediump vec4 _282 = vec4(textureLod(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), vec3(vec2(UV.x, UV.y), 0.5), 0.0));
    mediump float _283 = _282.x;
    vec2 _296 = vec2(UV.x, UV.y);
    f16vec4 _298 = f16vec4(textureGather(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), _296, 0.5));
    f16vec4 _309 = f16vec4(textureLod(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), 0.0));
    f16vec4 _325 = f16vec4(textureGrad(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), vec2(0.20000000298023223876953125, 0.300000011920928955078125), vec2(0.4000000059604644775390625, 0.5)));
    f16vec4 _336 = f16vec4(texture(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), 0.5));
    f16vec4 _346 = f16vec4(texelFetch(_26[registers._m1 + 3u], int(_170)));
    u16vec4 _356 = u16vec4(texelFetch(_30[registers._m1 + 4u], int(_170)));
    u16vec4 _366 = u16vec4(texelFetch(_34[registers._m1 + 5u], int(_170)));
    SV_Target.x = float(((((_298.x + float16_t(_283 + float(float16_t(_267 + float(_225.x + _203.x))))) + _309.x) + _325.x) + _336.x) + _346.x);
    SV_Target.y = float(((((_298.y + float16_t(_283 + float(float16_t(_267 + float(_225.y + _203.y))))) + _309.y) + _325.y) + _336.y) + _346.y);
    SV_Target.z = float(((((_298.z + float16_t(_283 + float(float16_t(_267 + float(_225.z + _203.z))))) + _309.z) + _325.z) + _336.z) + _346.z);
    SV_Target.w = float(((((_298.w + float16_t(_283 + float(float16_t(_267 + float(_225.w + _203.w))))) + _309.w) + _325.w) + _336.w) + _346.w);
    SV_Target_1.x = int(int16_t((_238.x + _210.x) + _356.x));
    SV_Target_1.y = int(int16_t((_238.y + _210.y) + _356.y));
    SV_Target_1.z = int(int16_t((_238.z + _210.z) + _356.z));
    SV_Target_1.w = int(int16_t((_238.w + _210.w) + _356.w));
    SV_Target_2.x = uint((_251.x + _218.x) + _366.x);
    SV_Target_2.y = uint((_251.y + _218.y) + _366.y);
    SV_Target_2.z = uint((_251.z + _218.z) + _366.z);
    SV_Target_2.w = uint((_251.w + _218.w) + _366.w);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 404
; Schema: 0
OpCapability Shader
OpCapability Float16
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
%215 = OpConstant %5 6
%234 = OpTypeSampledImage %15
%247 = OpTypeSampledImage %19
%260 = OpTypeImage %9 2D 1 0 0 1 Unknown
%261 = OpTypeSampledImage %260
%263 = OpConstant %9 0.5
%318 = OpConstant %9 0.200000003
%319 = OpConstant %9 0.300000012
%320 = OpConstant %9 0.400000006
%375 = OpTypePointer Output %9
%384 = OpTypePointer Output %14
%393 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %402
%402 = OpLabel
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
%210 = OpSConvert %181 %208
%211 = OpCompositeExtract %177 %210 0
%212 = OpCompositeExtract %177 %210 1
%213 = OpCompositeExtract %177 %210 2
%214 = OpCompositeExtract %177 %210 3
%217 = OpCompositeConstruct %172 %79 %82
%216 = OpImageFetch %72 %140 %217 Lod %215
%218 = OpUConvert %181 %216
%219 = OpCompositeExtract %177 %218 0
%220 = OpCompositeExtract %177 %218 1
%221 = OpCompositeExtract %177 %218 2
%222 = OpCompositeExtract %177 %218 3
%223 = OpCompositeConstruct %63 %164 %166
%224 = OpImageGather %66 %199 %223 %137
%225 = OpFConvert %174 %224
%226 = OpCompositeExtract %167 %225 0
%227 = OpCompositeExtract %167 %225 1
%228 = OpCompositeExtract %167 %225 2
%229 = OpCompositeExtract %167 %225 3
%230 = OpFAdd %167 %226 %204
%231 = OpFAdd %167 %227 %205
%232 = OpFAdd %167 %228 %206
%233 = OpFAdd %167 %229 %207
%235 = OpSampledImage %234 %146 %161
%236 = OpCompositeConstruct %63 %164 %166
%237 = OpImageGather %69 %235 %236 %109
%238 = OpSConvert %181 %237
%239 = OpCompositeExtract %177 %238 0
%240 = OpCompositeExtract %177 %238 1
%241 = OpCompositeExtract %177 %238 2
%242 = OpCompositeExtract %177 %238 3
%243 = OpIAdd %177 %239 %211
%244 = OpIAdd %177 %240 %212
%245 = OpIAdd %177 %241 %213
%246 = OpIAdd %177 %242 %214
%248 = OpSampledImage %247 %140 %161
%249 = OpCompositeConstruct %63 %164 %166
%250 = OpImageGather %72 %248 %249 %102
%251 = OpUConvert %181 %250
%252 = OpCompositeExtract %177 %251 0
%253 = OpCompositeExtract %177 %251 1
%254 = OpCompositeExtract %177 %251 2
%255 = OpCompositeExtract %177 %251 3
%256 = OpIAdd %177 %252 %219
%257 = OpIAdd %177 %253 %220
%258 = OpIAdd %177 %254 %221
%259 = OpIAdd %177 %255 %222
%262 = OpSampledImage %261 %151 %157
%265 = OpCompositeConstruct %63 %164 %166
%264 = OpImageSampleDrefImplicitLod %9 %262 %265 %263 None
%266 = OpCompositeConstruct %66 %264 %264 %264 %264
%267 = OpCompositeExtract %9 %266 0
%268 = OpFConvert %9 %230
%269 = OpFConvert %9 %231
%270 = OpFConvert %9 %232
%271 = OpFConvert %9 %233
%272 = OpFAdd %9 %267 %268
%273 = OpFAdd %9 %267 %269
%274 = OpFAdd %9 %267 %270
%275 = OpFAdd %9 %267 %271
%276 = OpFConvert %167 %272
%277 = OpFConvert %167 %273
%278 = OpFConvert %167 %274
%279 = OpFConvert %167 %275
%281 = OpCompositeConstruct %63 %164 %166
%280 = OpImageSampleDrefExplicitLod %9 %262 %281 %263 Lod %200
%282 = OpCompositeConstruct %66 %280 %280 %280 %280
%283 = OpCompositeExtract %9 %282 0
%284 = OpFConvert %9 %276
%285 = OpFConvert %9 %277
%286 = OpFConvert %9 %278
%287 = OpFConvert %9 %279
%288 = OpFAdd %9 %283 %284
%289 = OpFAdd %9 %283 %285
%290 = OpFAdd %9 %283 %286
%291 = OpFAdd %9 %283 %287
%292 = OpFConvert %167 %288
%293 = OpFConvert %167 %289
%294 = OpFConvert %167 %290
%295 = OpFConvert %167 %291
%296 = OpCompositeConstruct %63 %164 %166
%297 = OpImageDrefGather %66 %262 %296 %263
%298 = OpFConvert %174 %297
%299 = OpCompositeExtract %167 %298 0
%300 = OpCompositeExtract %167 %298 1
%301 = OpCompositeExtract %167 %298 2
%302 = OpCompositeExtract %167 %298 3
%303 = OpFAdd %167 %299 %292
%304 = OpFAdd %167 %300 %293
%305 = OpFAdd %167 %301 %294
%306 = OpFAdd %167 %302 %295
%308 = OpCompositeConstruct %63 %164 %166
%307 = OpImageSampleExplicitLod %66 %199 %308 Lod %200
%309 = OpFConvert %174 %307
%310 = OpCompositeExtract %167 %309 0
%311 = OpCompositeExtract %167 %309 1
%312 = OpCompositeExtract %167 %309 2
%313 = OpCompositeExtract %167 %309 3
%314 = OpFAdd %167 %303 %310
%315 = OpFAdd %167 %304 %311
%316 = OpFAdd %167 %305 %312
%317 = OpFAdd %167 %306 %313
%322 = OpCompositeConstruct %63 %164 %166
%323 = OpCompositeConstruct %63 %318 %319
%324 = OpCompositeConstruct %63 %320 %263
%321 = OpImageSampleExplicitLod %66 %199 %322 Grad %323 %324
%325 = OpFConvert %174 %321
%326 = OpCompositeExtract %167 %325 0
%327 = OpCompositeExtract %167 %325 1
%328 = OpCompositeExtract %167 %325 2
%329 = OpCompositeExtract %167 %325 3
%330 = OpFAdd %167 %314 %326
%331 = OpFAdd %167 %315 %327
%332 = OpFAdd %167 %316 %328
%333 = OpFAdd %167 %317 %329
%335 = OpCompositeConstruct %63 %164 %166
%334 = OpImageSampleImplicitLod %66 %199 %335 Bias %263
%336 = OpFConvert %174 %334
%337 = OpCompositeExtract %167 %336 0
%338 = OpCompositeExtract %167 %336 1
%339 = OpCompositeExtract %167 %336 2
%340 = OpCompositeExtract %167 %336 3
%341 = OpFAdd %167 %330 %337
%342 = OpFAdd %167 %331 %338
%343 = OpFAdd %167 %332 %339
%344 = OpFAdd %167 %333 %340
%345 = OpImageFetch %66 %133 %170
%346 = OpFConvert %174 %345
%347 = OpCompositeExtract %167 %346 0
%348 = OpCompositeExtract %167 %346 1
%349 = OpCompositeExtract %167 %346 2
%350 = OpCompositeExtract %167 %346 3
%351 = OpFAdd %167 %341 %347
%352 = OpFAdd %167 %342 %348
%353 = OpFAdd %167 %343 %349
%354 = OpFAdd %167 %344 %350
%355 = OpImageFetch %69 %127 %170
%356 = OpSConvert %181 %355
%357 = OpCompositeExtract %177 %356 0
%358 = OpCompositeExtract %177 %356 1
%359 = OpCompositeExtract %177 %356 2
%360 = OpCompositeExtract %177 %356 3
%361 = OpIAdd %177 %243 %357
%362 = OpIAdd %177 %244 %358
%363 = OpIAdd %177 %245 %359
%364 = OpIAdd %177 %246 %360
%365 = OpImageFetch %72 %121 %170
%366 = OpUConvert %181 %365
%367 = OpCompositeExtract %177 %366 0
%368 = OpCompositeExtract %177 %366 1
%369 = OpCompositeExtract %177 %366 2
%370 = OpCompositeExtract %177 %366 3
%371 = OpIAdd %177 %256 %367
%372 = OpIAdd %177 %257 %368
%373 = OpIAdd %177 %258 %369
%374 = OpIAdd %177 %259 %370
%376 = OpAccessChain %375 %68 %137
%377 = OpFConvert %9 %351
OpStore %376 %377
%378 = OpAccessChain %375 %68 %109
%379 = OpFConvert %9 %352
OpStore %378 %379
%380 = OpAccessChain %375 %68 %102
%381 = OpFConvert %9 %353
OpStore %380 %381
%382 = OpAccessChain %375 %68 %95
%383 = OpFConvert %9 %354
OpStore %382 %383
%385 = OpAccessChain %384 %71 %137
%386 = OpSConvert %14 %361
OpStore %385 %386
%387 = OpAccessChain %384 %71 %109
%388 = OpSConvert %14 %362
OpStore %387 %388
%389 = OpAccessChain %384 %71 %102
%390 = OpSConvert %14 %363
OpStore %389 %390
%391 = OpAccessChain %384 %71 %95
%392 = OpSConvert %14 %364
OpStore %391 %392
%394 = OpAccessChain %393 %74 %137
%395 = OpUConvert %5 %371
OpStore %394 %395
%396 = OpAccessChain %393 %74 %109
%397 = OpUConvert %5 %372
OpStore %396 %397
%398 = OpAccessChain %393 %74 %102
%399 = OpUConvert %5 %373
OpStore %398 %399
%400 = OpAccessChain %393 %74 %95
%401 = OpUConvert %5 %374
OpStore %400 %401
OpReturn
OpFunctionEnd
#endif
