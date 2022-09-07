#version 460
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_KHR_shader_subgroup_ballot : require

layout(set = 15, binding = 0, std430) restrict readonly buffer SSBO_Offsets
{
    uvec2 _m0[];
} _13;

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

layout(set = 0, binding = 0) uniform usamplerBuffer _17[];
layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _21[];
layout(set = 0, binding = 0, r32ui) uniform coherent uimageBuffer _24[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _39 = uint(UV.x);
    uint _43 = uint(UV.y);
    uint _47 = uint(UV.z);
    uint _51 = uint(UV.w);
    uint _56 = subgroupBroadcastFirst(INDEX);
    uint _60 = INDEX + 1u;
    uint _63 = subgroupBroadcastFirst(_60);
    uint _66 = INDEX + 2u;
    uint _69 = subgroupBroadcastFirst(_66);
    uint _72 = INDEX + 3u;
    uint _75 = subgroupBroadcastFirst(_72);
    uint _78 = INDEX + 4u;
    uint _83 = subgroupBroadcastFirst(_78);
    uint _86 = INDEX + 5u;
    uint _90 = subgroupBroadcastFirst(_86);
    uint _93 = INDEX + 6u;
    uint _97 = subgroupBroadcastFirst(_93);
    uint _100 = INDEX + 7u;
    uint _104 = subgroupBroadcastFirst(_100);
    uint _107 = INDEX + 8u;
    uint _111 = subgroupBroadcastFirst(_107);
    uint _114 = INDEX + 9u;
    uint _118 = subgroupBroadcastFirst(_114);
    uint _121 = INDEX + 10u;
    uint _125 = subgroupBroadcastFirst(_121);
    uint _128 = INDEX + 11u;
    uint _132 = subgroupBroadcastFirst(_128);
    uint _146 = _43 * 2u;
    uint _151 = (_146 < _13._m0[_63].y) ? (_146 + _13._m0[_63].x) : 1073741820u;
    vec2 _159 = uintBitsToFloat(uvec2(texelFetch(_17[_60], int(_151)).x, texelFetch(_17[_60], int(_151 + 1u)).x));
    uint _163 = _47 * 3u;
    uint _168 = (_163 < _13._m0[_69].y) ? (_163 + _13._m0[_69].x) : 1073741820u;
    vec3 _180 = uintBitsToFloat(uvec3(texelFetch(_17[_66], int(_168)).x, texelFetch(_17[_66], int(_168 + 1u)).x, texelFetch(_17[_66], int(_168 + 2u)).x));
    uint _186 = _51 * 4u;
    uint _191 = (_186 < _13._m0[_75].y) ? (_186 + _13._m0[_75].x) : 1073741820u;
    vec4 _204 = uintBitsToFloat(uvec4(texelFetch(_17[_72], int(_191)).x, texelFetch(_17[_72], int(_191 + 1u)).x, texelFetch(_17[_72], int(_191 + 2u)).x, texelFetch(_17[_72], int(_191 + 3u)).x));
    uvec4 _217 = imageLoad(_21[_78], int((_39 < _13._m0[_83].y) ? (_39 + _13._m0[_83].x) : 1073741820u));
    uint _221 = _43 * 2u;
    uint _226 = (_221 < _13._m0[_90].y) ? (_221 + _13._m0[_90].x) : 1073741820u;
    vec2 _233 = uintBitsToFloat(uvec2(imageLoad(_21[_86], int(_226)).x, imageLoad(_21[_86], int(_226 + 1u)).x));
    uint _238 = _47 * 3u;
    uint _243 = (_238 < _13._m0[_97].y) ? (_238 + _13._m0[_97].x) : 1073741820u;
    uvec4 _244 = imageLoad(_21[_93], int(_243));
    uvec4 _246 = imageLoad(_21[_93], int(_243 + 1u));
    uvec4 _249 = imageLoad(_21[_93], int(_243 + 2u));
    vec3 _253 = uintBitsToFloat(uvec3(_244.x, _246.x, _249.x));
    uint _260 = _51 * 4u;
    uint _265 = (_260 < _13._m0[_104].y) ? (_260 + _13._m0[_104].x) : 1073741820u;
    uvec4 _266 = imageLoad(_21[_100], int(_265));
    uvec4 _268 = imageLoad(_21[_100], int(_265 + 1u));
    uvec4 _271 = imageLoad(_21[_100], int(_265 + 2u));
    uvec4 _274 = imageLoad(_21[_100], int(_265 + 3u));
    vec4 _278 = uintBitsToFloat(uvec4(_266.x, _268.x, _271.x, _274.x));
    uvec4 _292 = imageLoad(_24[_107], int((_39 < _13._m0[_111].y) ? (_39 + _13._m0[_111].x) : 1073741820u));
    uint _296 = _43 * 2u;
    uint _301 = (_296 < _13._m0[_118].y) ? (_296 + _13._m0[_118].x) : 1073741820u;
    uvec4 _302 = imageLoad(_24[_114], int(_301));
    uvec4 _304 = imageLoad(_24[_114], int(_301 + 1u));
    vec2 _308 = uintBitsToFloat(uvec2(_302.x, _304.x));
    uint _313 = _47 * 3u;
    uint _318 = (_313 < _13._m0[_125].y) ? (_313 + _13._m0[_125].x) : 1073741820u;
    uvec4 _319 = imageLoad(_24[_121], int(_318));
    uvec4 _321 = imageLoad(_24[_121], int(_318 + 1u));
    uvec4 _324 = imageLoad(_24[_121], int(_318 + 2u));
    vec3 _328 = uintBitsToFloat(uvec3(_319.x, _321.x, _324.x));
    uint _335 = _51 * 4u;
    uint _340 = (_335 < _13._m0[_132].y) ? (_335 + _13._m0[_132].x) : 1073741820u;
    uvec4 _341 = imageLoad(_24[_128], int(_340));
    uvec4 _343 = imageLoad(_24[_128], int(_340 + 1u));
    uvec4 _346 = imageLoad(_24[_128], int(_340 + 2u));
    uvec4 _349 = imageLoad(_24[_128], int(_340 + 3u));
    vec4 _353 = uintBitsToFloat(uvec4(_341.x, _343.x, _346.x, _349.x));
    uint _362 = _39 * 2u;
    uint _367 = (_362 < _13._m0[_90].y) ? (_362 + _13._m0[_90].x) : 1073741820u;
    imageStore(_21[_86], int(_367), uvec4(floatBitsToUint(20.0)));
    imageStore(_21[_86], int(_367 + 1u), uvec4(floatBitsToUint(20.0)));
    uint _374 = _43 * 3u;
    uint _379 = (_374 < _13._m0[_125].y) ? (_374 + _13._m0[_125].x) : 1073741820u;
    imageStore(_24[_121], int(_379), uvec4(floatBitsToUint(30.0)));
    imageStore(_24[_121], int(_379 + 1u), uvec4(floatBitsToUint(30.0)));
    imageStore(_24[_121], int(_379 + 2u), uvec4(floatBitsToUint(30.0)));
    SV_Target.x = ((((((((((_159.x + uintBitsToFloat(texelFetch(_17[INDEX], int((_39 < _13._m0[_56].y) ? (_39 + _13._m0[_56].x) : 1073741820u)).x)) + _180.x) + _204.x) + uintBitsToFloat(_217.x)) + _233.x) + _253.x) + _278.x) + uintBitsToFloat(_292.x)) + _308.x) + _328.x) + _353.x;
    SV_Target.y = (((((((_180.y + _159.y) + _204.y) + _233.y) + _253.y) + _278.y) + _308.y) + _328.y) + _353.y;
    SV_Target.z = ((((_204.z + _180.z) + _253.z) + _278.z) + _328.z) + _353.z;
    SV_Target.w = (_278.w + _204.w) + _353.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 396
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability GroupNonUniformBallot
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %26 %30 %34
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %11 "SSBO_Offsets"
OpName %26 "INDEX"
OpName %30 "UV"
OpName %34 "SV_Target"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %10 ArrayStride 8
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %13 DescriptorSet 15
OpDecorate %13 Binding 0
OpDecorate %13 NonWritable
OpDecorate %13 Restrict
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %21 DescriptorSet 0
OpDecorate %21 Binding 0
OpDecorate %24 DescriptorSet 0
OpDecorate %24 Binding 0
OpDecorate %24 Coherent
OpDecorate %26 Flat
OpDecorate %26 Location 0
OpDecorate %30 Flat
OpDecorate %30 Location 1
OpDecorate %34 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeVector %5 2
%10 = OpTypeRuntimeArray %9
%11 = OpTypeStruct %10
%12 = OpTypePointer StorageBuffer %11
%13 = OpVariable %12 StorageBuffer
%14 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%15 = OpTypeRuntimeArray %14
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%19 = OpTypeRuntimeArray %18
%20 = OpTypePointer UniformConstant %19
%21 = OpVariable %20 UniformConstant
%22 = OpTypeRuntimeArray %18
%23 = OpTypePointer UniformConstant %22
%24 = OpVariable %23 UniformConstant
%25 = OpTypePointer Input %5
%26 = OpVariable %25 Input
%27 = OpTypeInt 32 1
%28 = OpTypeVector %27 4
%29 = OpTypePointer Input %28
%30 = OpVariable %29 Input
%31 = OpTypeFloat 32
%32 = OpTypeVector %31 4
%33 = OpTypePointer Output %32
%34 = OpVariable %33 Output
%35 = OpTypePointer Input %27
%37 = OpConstant %5 0
%41 = OpConstant %5 1
%45 = OpConstant %5 2
%49 = OpConstant %5 3
%53 = OpTypePointer UniformConstant %14
%57 = OpTypePointer StorageBuffer %9
%79 = OpConstant %5 4
%80 = OpTypePointer UniformConstant %18
%87 = OpConstant %5 5
%94 = OpConstant %5 6
%101 = OpConstant %5 7
%108 = OpConstant %5 8
%115 = OpConstant %5 9
%122 = OpConstant %5 10
%129 = OpConstant %5 11
%138 = OpTypeBool
%141 = OpConstant %5 1073741820
%142 = OpTypeVector %5 4
%158 = OpTypeVector %31 2
%177 = OpTypeVector %5 3
%179 = OpTypeVector %31 3
%368 = OpConstant %31 20
%380 = OpConstant %31 30
%389 = OpTypePointer Output %31
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %394
%394 = OpLabel
%36 = OpAccessChain %35 %30 %37
%38 = OpLoad %27 %36
%39 = OpBitcast %5 %38
%40 = OpAccessChain %35 %30 %41
%42 = OpLoad %27 %40
%43 = OpBitcast %5 %42
%44 = OpAccessChain %35 %30 %45
%46 = OpLoad %27 %44
%47 = OpBitcast %5 %46
%48 = OpAccessChain %35 %30 %49
%50 = OpLoad %27 %48
%51 = OpBitcast %5 %50
%52 = OpLoad %5 %26
%54 = OpAccessChain %53 %17 %52
%55 = OpLoad %14 %54
%56 = OpGroupNonUniformBroadcastFirst %5 %49 %52
%58 = OpAccessChain %57 %13 %37 %56
%59 = OpLoad %9 %58
%60 = OpIAdd %5 %52 %41
%61 = OpAccessChain %53 %17 %60
%62 = OpLoad %14 %61
%63 = OpGroupNonUniformBroadcastFirst %5 %49 %60
%64 = OpAccessChain %57 %13 %37 %63
%65 = OpLoad %9 %64
%66 = OpIAdd %5 %52 %45
%67 = OpAccessChain %53 %17 %66
%68 = OpLoad %14 %67
%69 = OpGroupNonUniformBroadcastFirst %5 %49 %66
%70 = OpAccessChain %57 %13 %37 %69
%71 = OpLoad %9 %70
%72 = OpIAdd %5 %52 %49
%73 = OpAccessChain %53 %17 %72
%74 = OpLoad %14 %73
%75 = OpGroupNonUniformBroadcastFirst %5 %49 %72
%76 = OpAccessChain %57 %13 %37 %75
%77 = OpLoad %9 %76
%78 = OpIAdd %5 %52 %79
%81 = OpAccessChain %80 %21 %78
%82 = OpLoad %18 %81
%83 = OpGroupNonUniformBroadcastFirst %5 %49 %78
%84 = OpAccessChain %57 %13 %37 %83
%85 = OpLoad %9 %84
%86 = OpIAdd %5 %52 %87
%88 = OpAccessChain %80 %21 %86
%89 = OpLoad %18 %88
%90 = OpGroupNonUniformBroadcastFirst %5 %49 %86
%91 = OpAccessChain %57 %13 %37 %90
%92 = OpLoad %9 %91
%93 = OpIAdd %5 %52 %94
%95 = OpAccessChain %80 %21 %93
%96 = OpLoad %18 %95
%97 = OpGroupNonUniformBroadcastFirst %5 %49 %93
%98 = OpAccessChain %57 %13 %37 %97
%99 = OpLoad %9 %98
%100 = OpIAdd %5 %52 %101
%102 = OpAccessChain %80 %21 %100
%103 = OpLoad %18 %102
%104 = OpGroupNonUniformBroadcastFirst %5 %49 %100
%105 = OpAccessChain %57 %13 %37 %104
%106 = OpLoad %9 %105
%107 = OpIAdd %5 %52 %108
%109 = OpAccessChain %80 %24 %107
%110 = OpLoad %18 %109
%111 = OpGroupNonUniformBroadcastFirst %5 %49 %107
%112 = OpAccessChain %57 %13 %37 %111
%113 = OpLoad %9 %112
%114 = OpIAdd %5 %52 %115
%116 = OpAccessChain %80 %24 %114
%117 = OpLoad %18 %116
%118 = OpGroupNonUniformBroadcastFirst %5 %49 %114
%119 = OpAccessChain %57 %13 %37 %118
%120 = OpLoad %9 %119
%121 = OpIAdd %5 %52 %122
%123 = OpAccessChain %80 %24 %121
%124 = OpLoad %18 %123
%125 = OpGroupNonUniformBroadcastFirst %5 %49 %121
%126 = OpAccessChain %57 %13 %37 %125
%127 = OpLoad %9 %126
%128 = OpIAdd %5 %52 %129
%130 = OpAccessChain %80 %24 %128
%131 = OpLoad %18 %130
%132 = OpGroupNonUniformBroadcastFirst %5 %49 %128
%133 = OpAccessChain %57 %13 %37 %132
%134 = OpLoad %9 %133
%135 = OpCompositeExtract %5 %59 0
%136 = OpCompositeExtract %5 %59 1
%137 = OpIAdd %5 %39 %135
%139 = OpULessThan %138 %39 %136
%140 = OpSelect %5 %139 %137 %141
%143 = OpImageFetch %142 %55 %140
%144 = OpCompositeExtract %5 %143 0
%145 = OpBitcast %31 %144
%146 = OpIMul %5 %43 %45
%147 = OpCompositeExtract %5 %65 0
%148 = OpCompositeExtract %5 %65 1
%149 = OpIAdd %5 %146 %147
%150 = OpULessThan %138 %146 %148
%151 = OpSelect %5 %150 %149 %141
%152 = OpImageFetch %142 %62 %151
%153 = OpCompositeExtract %5 %152 0
%155 = OpIAdd %5 %151 %41
%154 = OpImageFetch %142 %62 %155
%156 = OpCompositeExtract %5 %154 0
%157 = OpCompositeConstruct %9 %153 %156
%159 = OpBitcast %158 %157
%160 = OpCompositeExtract %31 %159 0
%161 = OpCompositeExtract %31 %159 1
%162 = OpFAdd %31 %160 %145
%163 = OpIMul %5 %47 %49
%164 = OpCompositeExtract %5 %71 0
%165 = OpCompositeExtract %5 %71 1
%166 = OpIAdd %5 %163 %164
%167 = OpULessThan %138 %163 %165
%168 = OpSelect %5 %167 %166 %141
%169 = OpImageFetch %142 %68 %168
%170 = OpCompositeExtract %5 %169 0
%172 = OpIAdd %5 %168 %41
%171 = OpImageFetch %142 %68 %172
%173 = OpCompositeExtract %5 %171 0
%175 = OpIAdd %5 %168 %45
%174 = OpImageFetch %142 %68 %175
%176 = OpCompositeExtract %5 %174 0
%178 = OpCompositeConstruct %177 %170 %173 %176
%180 = OpBitcast %179 %178
%181 = OpCompositeExtract %31 %180 0
%182 = OpCompositeExtract %31 %180 1
%183 = OpCompositeExtract %31 %180 2
%184 = OpFAdd %31 %162 %181
%185 = OpFAdd %31 %182 %161
%186 = OpIMul %5 %51 %79
%187 = OpCompositeExtract %5 %77 0
%188 = OpCompositeExtract %5 %77 1
%189 = OpIAdd %5 %186 %187
%190 = OpULessThan %138 %186 %188
%191 = OpSelect %5 %190 %189 %141
%192 = OpImageFetch %142 %74 %191
%193 = OpCompositeExtract %5 %192 0
%195 = OpIAdd %5 %191 %41
%194 = OpImageFetch %142 %74 %195
%196 = OpCompositeExtract %5 %194 0
%198 = OpIAdd %5 %191 %45
%197 = OpImageFetch %142 %74 %198
%199 = OpCompositeExtract %5 %197 0
%201 = OpIAdd %5 %191 %49
%200 = OpImageFetch %142 %74 %201
%202 = OpCompositeExtract %5 %200 0
%203 = OpCompositeConstruct %142 %193 %196 %199 %202
%204 = OpBitcast %32 %203
%205 = OpCompositeExtract %31 %204 0
%206 = OpCompositeExtract %31 %204 1
%207 = OpCompositeExtract %31 %204 2
%208 = OpCompositeExtract %31 %204 3
%209 = OpFAdd %31 %184 %205
%210 = OpFAdd %31 %185 %206
%211 = OpFAdd %31 %207 %183
%212 = OpCompositeExtract %5 %85 0
%213 = OpCompositeExtract %5 %85 1
%214 = OpIAdd %5 %39 %212
%215 = OpULessThan %138 %39 %213
%216 = OpSelect %5 %215 %214 %141
%217 = OpImageRead %142 %82 %216
%218 = OpCompositeExtract %5 %217 0
%219 = OpBitcast %31 %218
%220 = OpFAdd %31 %209 %219
%221 = OpIMul %5 %43 %45
%222 = OpCompositeExtract %5 %92 0
%223 = OpCompositeExtract %5 %92 1
%224 = OpIAdd %5 %221 %222
%225 = OpULessThan %138 %221 %223
%226 = OpSelect %5 %225 %224 %141
%227 = OpImageRead %142 %89 %226
%228 = OpCompositeExtract %5 %227 0
%230 = OpIAdd %5 %226 %41
%229 = OpImageRead %142 %89 %230
%231 = OpCompositeExtract %5 %229 0
%232 = OpCompositeConstruct %9 %228 %231
%233 = OpBitcast %158 %232
%234 = OpCompositeExtract %31 %233 0
%235 = OpCompositeExtract %31 %233 1
%236 = OpFAdd %31 %220 %234
%237 = OpFAdd %31 %210 %235
%238 = OpIMul %5 %47 %49
%239 = OpCompositeExtract %5 %99 0
%240 = OpCompositeExtract %5 %99 1
%241 = OpIAdd %5 %238 %239
%242 = OpULessThan %138 %238 %240
%243 = OpSelect %5 %242 %241 %141
%244 = OpImageRead %142 %96 %243
%245 = OpCompositeExtract %5 %244 0
%247 = OpIAdd %5 %243 %41
%246 = OpImageRead %142 %96 %247
%248 = OpCompositeExtract %5 %246 0
%250 = OpIAdd %5 %243 %45
%249 = OpImageRead %142 %96 %250
%251 = OpCompositeExtract %5 %249 0
%252 = OpCompositeConstruct %177 %245 %248 %251
%253 = OpBitcast %179 %252
%254 = OpCompositeExtract %31 %253 0
%255 = OpCompositeExtract %31 %253 1
%256 = OpCompositeExtract %31 %253 2
%257 = OpFAdd %31 %236 %254
%258 = OpFAdd %31 %237 %255
%259 = OpFAdd %31 %211 %256
%260 = OpIMul %5 %51 %79
%261 = OpCompositeExtract %5 %106 0
%262 = OpCompositeExtract %5 %106 1
%263 = OpIAdd %5 %260 %261
%264 = OpULessThan %138 %260 %262
%265 = OpSelect %5 %264 %263 %141
%266 = OpImageRead %142 %103 %265
%267 = OpCompositeExtract %5 %266 0
%269 = OpIAdd %5 %265 %41
%268 = OpImageRead %142 %103 %269
%270 = OpCompositeExtract %5 %268 0
%272 = OpIAdd %5 %265 %45
%271 = OpImageRead %142 %103 %272
%273 = OpCompositeExtract %5 %271 0
%275 = OpIAdd %5 %265 %49
%274 = OpImageRead %142 %103 %275
%276 = OpCompositeExtract %5 %274 0
%277 = OpCompositeConstruct %142 %267 %270 %273 %276
%278 = OpBitcast %32 %277
%279 = OpCompositeExtract %31 %278 0
%280 = OpCompositeExtract %31 %278 1
%281 = OpCompositeExtract %31 %278 2
%282 = OpCompositeExtract %31 %278 3
%283 = OpFAdd %31 %257 %279
%284 = OpFAdd %31 %258 %280
%285 = OpFAdd %31 %259 %281
%286 = OpFAdd %31 %282 %208
%287 = OpCompositeExtract %5 %113 0
%288 = OpCompositeExtract %5 %113 1
%289 = OpIAdd %5 %39 %287
%290 = OpULessThan %138 %39 %288
%291 = OpSelect %5 %290 %289 %141
%292 = OpImageRead %142 %110 %291
%293 = OpCompositeExtract %5 %292 0
%294 = OpBitcast %31 %293
%295 = OpFAdd %31 %283 %294
%296 = OpIMul %5 %43 %45
%297 = OpCompositeExtract %5 %120 0
%298 = OpCompositeExtract %5 %120 1
%299 = OpIAdd %5 %296 %297
%300 = OpULessThan %138 %296 %298
%301 = OpSelect %5 %300 %299 %141
%302 = OpImageRead %142 %117 %301
%303 = OpCompositeExtract %5 %302 0
%305 = OpIAdd %5 %301 %41
%304 = OpImageRead %142 %117 %305
%306 = OpCompositeExtract %5 %304 0
%307 = OpCompositeConstruct %9 %303 %306
%308 = OpBitcast %158 %307
%309 = OpCompositeExtract %31 %308 0
%310 = OpCompositeExtract %31 %308 1
%311 = OpFAdd %31 %295 %309
%312 = OpFAdd %31 %284 %310
%313 = OpIMul %5 %47 %49
%314 = OpCompositeExtract %5 %127 0
%315 = OpCompositeExtract %5 %127 1
%316 = OpIAdd %5 %313 %314
%317 = OpULessThan %138 %313 %315
%318 = OpSelect %5 %317 %316 %141
%319 = OpImageRead %142 %124 %318
%320 = OpCompositeExtract %5 %319 0
%322 = OpIAdd %5 %318 %41
%321 = OpImageRead %142 %124 %322
%323 = OpCompositeExtract %5 %321 0
%325 = OpIAdd %5 %318 %45
%324 = OpImageRead %142 %124 %325
%326 = OpCompositeExtract %5 %324 0
%327 = OpCompositeConstruct %177 %320 %323 %326
%328 = OpBitcast %179 %327
%329 = OpCompositeExtract %31 %328 0
%330 = OpCompositeExtract %31 %328 1
%331 = OpCompositeExtract %31 %328 2
%332 = OpFAdd %31 %311 %329
%333 = OpFAdd %31 %312 %330
%334 = OpFAdd %31 %285 %331
%335 = OpIMul %5 %51 %79
%336 = OpCompositeExtract %5 %134 0
%337 = OpCompositeExtract %5 %134 1
%338 = OpIAdd %5 %335 %336
%339 = OpULessThan %138 %335 %337
%340 = OpSelect %5 %339 %338 %141
%341 = OpImageRead %142 %131 %340
%342 = OpCompositeExtract %5 %341 0
%344 = OpIAdd %5 %340 %41
%343 = OpImageRead %142 %131 %344
%345 = OpCompositeExtract %5 %343 0
%347 = OpIAdd %5 %340 %45
%346 = OpImageRead %142 %131 %347
%348 = OpCompositeExtract %5 %346 0
%350 = OpIAdd %5 %340 %49
%349 = OpImageRead %142 %131 %350
%351 = OpCompositeExtract %5 %349 0
%352 = OpCompositeConstruct %142 %342 %345 %348 %351
%353 = OpBitcast %32 %352
%354 = OpCompositeExtract %31 %353 0
%355 = OpCompositeExtract %31 %353 1
%356 = OpCompositeExtract %31 %353 2
%357 = OpCompositeExtract %31 %353 3
%358 = OpFAdd %31 %332 %354
%359 = OpFAdd %31 %333 %355
%360 = OpFAdd %31 %334 %356
%361 = OpFAdd %31 %286 %357
%362 = OpIMul %5 %39 %45
%363 = OpCompositeExtract %5 %92 0
%364 = OpCompositeExtract %5 %92 1
%365 = OpIAdd %5 %362 %363
%366 = OpULessThan %138 %362 %364
%367 = OpSelect %5 %366 %365 %141
%369 = OpBitcast %5 %368
%370 = OpBitcast %5 %368
%371 = OpCompositeConstruct %142 %369 %369 %369 %369
OpImageWrite %89 %367 %371
%372 = OpCompositeConstruct %142 %370 %370 %370 %370
%373 = OpIAdd %5 %367 %41
OpImageWrite %89 %373 %372
%374 = OpIMul %5 %43 %49
%375 = OpCompositeExtract %5 %127 0
%376 = OpCompositeExtract %5 %127 1
%377 = OpIAdd %5 %374 %375
%378 = OpULessThan %138 %374 %376
%379 = OpSelect %5 %378 %377 %141
%381 = OpBitcast %5 %380
%382 = OpBitcast %5 %380
%383 = OpBitcast %5 %380
%384 = OpCompositeConstruct %142 %381 %381 %381 %381
OpImageWrite %124 %379 %384
%385 = OpCompositeConstruct %142 %382 %382 %382 %382
%386 = OpIAdd %5 %379 %41
OpImageWrite %124 %386 %385
%387 = OpCompositeConstruct %142 %383 %383 %383 %383
%388 = OpIAdd %5 %379 %45
OpImageWrite %124 %388 %387
%390 = OpAccessChain %389 %34 %37
OpStore %390 %358
%391 = OpAccessChain %389 %34 %41
OpStore %391 %359
%392 = OpAccessChain %389 %34 %45
OpStore %392 %360
%393 = OpAccessChain %389 %34 %49
OpStore %393 %361
OpReturn
OpFunctionEnd
#endif
