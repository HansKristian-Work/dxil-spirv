#version 460
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
    uint _167 = uint(int(UV.x));
    uint _168 = uint(int(UV.y));
    imageStore(_38[registers._m3], ivec2(uvec2(_167, _168)), vec4(UV.x, UV.y, UV.x, UV.y));
    uint _172 = uint(int(UV.x));
    uint _173 = uint(int(UV.y));
    imageStore(_42[registers._m3 + 1u], ivec2(uvec2(_167, _168)), ivec4(uvec4(_172, _173, _172, _173)));
    uint _177 = uint(UV.x);
    uint _178 = uint(UV.y);
    imageStore(_46[registers._m3 + 2u], ivec2(uvec2(_167, _168)), uvec4(_177, _178, _177, _178));
    imageStore(_50[registers._m4 + 3u], int(_167), vec4(8.0));
    imageStore(_54[registers._m4 + 4u], int(_167), ivec4(uvec4(4294967276u)));
    imageStore(_58[registers._m4 + 5u], int(_167), uvec4(80u));
    vec4 _191 = texture(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y));
    uvec4 _199 = uvec4(texelFetch(_18[_145], ivec2(uvec2(1u, 2u)), int(3u)));
    uvec4 _205 = texelFetch(_22[_139], ivec2(uvec2(4u, 5u)), int(6u));
    vec4 _212 = textureGather(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y));
    uvec4 _225 = uvec4(textureGather(isampler2D(_18[_145], _62[registers._m2]), vec2(UV.x, UV.y), int(1u)));
    uvec4 _237 = textureGather(usampler2D(_22[_139], _62[registers._m2]), vec2(UV.x, UV.y), int(2u));
    vec4 _252 = vec4(texture(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), vec3(vec2(UV.x, UV.y), 0.5)));
    float _253 = _252.x;
    vec4 _260 = vec4(textureLod(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), vec3(vec2(UV.x, UV.y), 0.5), 0.0));
    float _261 = _260.x;
    vec2 _266 = vec2(UV.x, UV.y);
    vec4 _267 = textureGather(sampler2DShadow(_13[registers._m0], _62[registers._m2 + 1u]), _266, 0.5);
    vec4 _276 = textureLod(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), 0.0);
    vec4 _289 = textureGrad(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), vec2(0.20000000298023223876953125, 0.300000011920928955078125), vec2(0.4000000059604644775390625, 0.5));
    vec4 _301 = texture(sampler2D(_13[registers._m0], _62[registers._m2]), vec2(UV.x, UV.y), 0.5);
    vec4 _311 = texelFetch(_26[registers._m1 + 3u], int(_167));
    uvec4 _321 = uvec4(texelFetch(_30[registers._m1 + 4u], int(_167)));
    uvec4 _330 = texelFetch(_34[registers._m1 + 5u], int(_167));
    SV_Target.x = ((((_267.x + (_261 + (_253 + (_212.x + _191.x)))) + _276.x) + _289.x) + _301.x) + _311.x;
    SV_Target.y = ((((_267.y + (_261 + (_253 + (_212.y + _191.y)))) + _276.y) + _289.y) + _301.y) + _311.y;
    SV_Target.z = ((((_267.z + (_261 + (_253 + (_212.z + _191.z)))) + _276.z) + _289.z) + _301.z) + _311.z;
    SV_Target.w = ((((_267.w + (_261 + (_253 + (_212.w + _191.w)))) + _276.w) + _289.w) + _301.w) + _311.w;
    SV_Target_1.x = int((_225.x + _199.x) + _321.x);
    SV_Target_1.y = int((_225.y + _199.y) + _321.y);
    SV_Target_1.z = int((_225.z + _199.z) + _321.z);
    SV_Target_1.w = int((_225.w + _199.w) + _321.w);
    SV_Target_2.x = (_237.x + _205.x) + _330.x;
    SV_Target_2.y = (_237.y + _205.y) + _330.y;
    SV_Target_2.z = (_237.z + _205.z) + _330.z;
    SV_Target_2.w = (_237.w + _205.w) + _330.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 360
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
%169 = OpTypeVector %5 2
%181 = OpConstant %9 8
%183 = OpConstant %5 4294967276
%186 = OpConstant %5 80
%188 = OpTypeSampledImage %10
%190 = OpConstant %9 0
%204 = OpConstant %5 6
%221 = OpTypeSampledImage %15
%234 = OpTypeSampledImage %19
%246 = OpTypeImage %9 2D 1 0 0 1 Unknown
%247 = OpTypeSampledImage %246
%249 = OpConstant %9 0.5
%286 = OpConstant %9 0.200000003
%287 = OpConstant %9 0.300000012
%288 = OpConstant %9 0.400000006
%339 = OpTypePointer Output %9
%344 = OpTypePointer Output %14
%353 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %358
%358 = OpLabel
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
%167 = OpConvertFToS %5 %164
%168 = OpConvertFToS %5 %166
%170 = OpCompositeConstruct %169 %167 %168
%171 = OpCompositeConstruct %66 %164 %166 %164 %166
OpImageWrite %115 %170 %171
%172 = OpConvertFToS %5 %164
%173 = OpConvertFToS %5 %166
%174 = OpCompositeConstruct %169 %167 %168
%175 = OpCompositeConstruct %72 %172 %173 %172 %173
%176 = OpBitcast %69 %175
OpImageWrite %110 %174 %176
%177 = OpConvertFToU %5 %164
%178 = OpConvertFToU %5 %166
%179 = OpCompositeConstruct %169 %167 %168
%180 = OpCompositeConstruct %72 %177 %178 %177 %178
OpImageWrite %103 %179 %180
%182 = OpCompositeConstruct %66 %181 %181 %181 %181
OpImageWrite %96 %167 %182
%184 = OpCompositeConstruct %72 %183 %183 %183 %183
%185 = OpBitcast %69 %184
OpImageWrite %89 %167 %185
%187 = OpCompositeConstruct %72 %186 %186 %186 %186
OpImageWrite %83 %167 %187
%189 = OpSampledImage %188 %151 %161
%192 = OpCompositeConstruct %63 %164 %166
%191 = OpImageSampleImplicitLod %66 %189 %192 None
%193 = OpCompositeExtract %9 %191 0
%194 = OpCompositeExtract %9 %191 1
%195 = OpCompositeExtract %9 %191 2
%196 = OpCompositeExtract %9 %191 3
%198 = OpCompositeConstruct %169 %109 %102
%197 = OpImageFetch %69 %146 %198 Lod %95
%199 = OpBitcast %72 %197
%200 = OpCompositeExtract %5 %199 0
%201 = OpCompositeExtract %5 %199 1
%202 = OpCompositeExtract %5 %199 2
%203 = OpCompositeExtract %5 %199 3
%206 = OpCompositeConstruct %169 %79 %82
%205 = OpImageFetch %72 %140 %206 Lod %204
%207 = OpCompositeExtract %5 %205 0
%208 = OpCompositeExtract %5 %205 1
%209 = OpCompositeExtract %5 %205 2
%210 = OpCompositeExtract %5 %205 3
%211 = OpCompositeConstruct %63 %164 %166
%212 = OpImageGather %66 %189 %211 %137
%213 = OpCompositeExtract %9 %212 0
%214 = OpCompositeExtract %9 %212 1
%215 = OpCompositeExtract %9 %212 2
%216 = OpCompositeExtract %9 %212 3
%217 = OpFAdd %9 %213 %193
%218 = OpFAdd %9 %214 %194
%219 = OpFAdd %9 %215 %195
%220 = OpFAdd %9 %216 %196
%222 = OpSampledImage %221 %146 %161
%223 = OpCompositeConstruct %63 %164 %166
%224 = OpImageGather %69 %222 %223 %109
%225 = OpBitcast %72 %224
%226 = OpCompositeExtract %5 %225 0
%227 = OpCompositeExtract %5 %225 1
%228 = OpCompositeExtract %5 %225 2
%229 = OpCompositeExtract %5 %225 3
%230 = OpIAdd %5 %226 %200
%231 = OpIAdd %5 %227 %201
%232 = OpIAdd %5 %228 %202
%233 = OpIAdd %5 %229 %203
%235 = OpSampledImage %234 %140 %161
%236 = OpCompositeConstruct %63 %164 %166
%237 = OpImageGather %72 %235 %236 %102
%238 = OpCompositeExtract %5 %237 0
%239 = OpCompositeExtract %5 %237 1
%240 = OpCompositeExtract %5 %237 2
%241 = OpCompositeExtract %5 %237 3
%242 = OpIAdd %5 %238 %207
%243 = OpIAdd %5 %239 %208
%244 = OpIAdd %5 %240 %209
%245 = OpIAdd %5 %241 %210
%248 = OpSampledImage %247 %151 %157
%251 = OpCompositeConstruct %63 %164 %166
%250 = OpImageSampleDrefImplicitLod %9 %248 %251 %249 None
%252 = OpCompositeConstruct %66 %250 %250 %250 %250
%253 = OpCompositeExtract %9 %252 0
%254 = OpFAdd %9 %253 %217
%255 = OpFAdd %9 %253 %218
%256 = OpFAdd %9 %253 %219
%257 = OpFAdd %9 %253 %220
%259 = OpCompositeConstruct %63 %164 %166
%258 = OpImageSampleDrefExplicitLod %9 %248 %259 %249 Lod %190
%260 = OpCompositeConstruct %66 %258 %258 %258 %258
%261 = OpCompositeExtract %9 %260 0
%262 = OpFAdd %9 %261 %254
%263 = OpFAdd %9 %261 %255
%264 = OpFAdd %9 %261 %256
%265 = OpFAdd %9 %261 %257
%266 = OpCompositeConstruct %63 %164 %166
%267 = OpImageDrefGather %66 %248 %266 %249
%268 = OpCompositeExtract %9 %267 0
%269 = OpCompositeExtract %9 %267 1
%270 = OpCompositeExtract %9 %267 2
%271 = OpCompositeExtract %9 %267 3
%272 = OpFAdd %9 %268 %262
%273 = OpFAdd %9 %269 %263
%274 = OpFAdd %9 %270 %264
%275 = OpFAdd %9 %271 %265
%277 = OpCompositeConstruct %63 %164 %166
%276 = OpImageSampleExplicitLod %66 %189 %277 Lod %190
%278 = OpCompositeExtract %9 %276 0
%279 = OpCompositeExtract %9 %276 1
%280 = OpCompositeExtract %9 %276 2
%281 = OpCompositeExtract %9 %276 3
%282 = OpFAdd %9 %272 %278
%283 = OpFAdd %9 %273 %279
%284 = OpFAdd %9 %274 %280
%285 = OpFAdd %9 %275 %281
%290 = OpCompositeConstruct %63 %164 %166
%291 = OpCompositeConstruct %63 %286 %287
%292 = OpCompositeConstruct %63 %288 %249
%289 = OpImageSampleExplicitLod %66 %189 %290 Grad %291 %292
%293 = OpCompositeExtract %9 %289 0
%294 = OpCompositeExtract %9 %289 1
%295 = OpCompositeExtract %9 %289 2
%296 = OpCompositeExtract %9 %289 3
%297 = OpFAdd %9 %282 %293
%298 = OpFAdd %9 %283 %294
%299 = OpFAdd %9 %284 %295
%300 = OpFAdd %9 %285 %296
%302 = OpCompositeConstruct %63 %164 %166
%301 = OpImageSampleImplicitLod %66 %189 %302 Bias %249
%303 = OpCompositeExtract %9 %301 0
%304 = OpCompositeExtract %9 %301 1
%305 = OpCompositeExtract %9 %301 2
%306 = OpCompositeExtract %9 %301 3
%307 = OpFAdd %9 %297 %303
%308 = OpFAdd %9 %298 %304
%309 = OpFAdd %9 %299 %305
%310 = OpFAdd %9 %300 %306
%311 = OpImageFetch %66 %133 %167
%312 = OpCompositeExtract %9 %311 0
%313 = OpCompositeExtract %9 %311 1
%314 = OpCompositeExtract %9 %311 2
%315 = OpCompositeExtract %9 %311 3
%316 = OpFAdd %9 %307 %312
%317 = OpFAdd %9 %308 %313
%318 = OpFAdd %9 %309 %314
%319 = OpFAdd %9 %310 %315
%320 = OpImageFetch %69 %127 %167
%321 = OpBitcast %72 %320
%322 = OpCompositeExtract %5 %321 0
%323 = OpCompositeExtract %5 %321 1
%324 = OpCompositeExtract %5 %321 2
%325 = OpCompositeExtract %5 %321 3
%326 = OpIAdd %5 %230 %322
%327 = OpIAdd %5 %231 %323
%328 = OpIAdd %5 %232 %324
%329 = OpIAdd %5 %233 %325
%330 = OpImageFetch %72 %121 %167
%331 = OpCompositeExtract %5 %330 0
%332 = OpCompositeExtract %5 %330 1
%333 = OpCompositeExtract %5 %330 2
%334 = OpCompositeExtract %5 %330 3
%335 = OpIAdd %5 %242 %331
%336 = OpIAdd %5 %243 %332
%337 = OpIAdd %5 %244 %333
%338 = OpIAdd %5 %245 %334
%340 = OpAccessChain %339 %68 %137
OpStore %340 %316
%341 = OpAccessChain %339 %68 %109
OpStore %341 %317
%342 = OpAccessChain %339 %68 %102
OpStore %342 %318
%343 = OpAccessChain %339 %68 %95
OpStore %343 %319
%345 = OpAccessChain %344 %71 %137
%346 = OpBitcast %14 %326
OpStore %345 %346
%347 = OpAccessChain %344 %71 %109
%348 = OpBitcast %14 %327
OpStore %347 %348
%349 = OpAccessChain %344 %71 %102
%350 = OpBitcast %14 %328
OpStore %349 %350
%351 = OpAccessChain %344 %71 %95
%352 = OpBitcast %14 %329
OpStore %351 %352
%354 = OpAccessChain %353 %74 %137
OpStore %354 %335
%355 = OpAccessChain %353 %74 %109
OpStore %355 %336
%356 = OpAccessChain %353 %74 %102
OpStore %356 %337
%357 = OpAccessChain %353 %74 %95
OpStore %357 %338
OpReturn
OpFunctionEnd
#endif
