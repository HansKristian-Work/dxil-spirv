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
layout(set = 0, binding = 0, r32ui) uniform readonly uimageBuffer _21[];
layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _24[];
layout(set = 0, binding = 0, r32ui) uniform coherent readonly uimageBuffer _27[];
layout(set = 0, binding = 0, r32ui) uniform coherent uimageBuffer _30[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _45 = uint(UV.x);
    uint _49 = uint(UV.y);
    uint _53 = uint(UV.z);
    uint _57 = uint(UV.w);
    uint _62 = subgroupBroadcastFirst(INDEX);
    uint _66 = INDEX + 1u;
    uint _69 = subgroupBroadcastFirst(_66);
    uint _72 = INDEX + 2u;
    uint _75 = subgroupBroadcastFirst(_72);
    uint _78 = INDEX + 3u;
    uint _81 = subgroupBroadcastFirst(_78);
    uint _84 = INDEX + 4u;
    uint _89 = subgroupBroadcastFirst(_84);
    uint _92 = INDEX + 5u;
    uint _96 = subgroupBroadcastFirst(_92);
    uint _99 = INDEX + 6u;
    uint _103 = subgroupBroadcastFirst(_99);
    uint _106 = INDEX + 7u;
    uint _110 = subgroupBroadcastFirst(_106);
    uint _113 = INDEX + 8u;
    uint _117 = subgroupBroadcastFirst(_113);
    uint _120 = INDEX + 9u;
    uint _124 = subgroupBroadcastFirst(_120);
    uint _127 = INDEX + 10u;
    uint _131 = subgroupBroadcastFirst(_127);
    uint _134 = INDEX + 11u;
    uint _138 = subgroupBroadcastFirst(_134);
    uint _152 = _49 * 2u;
    uint _157 = (_152 < _13._m0[_69].y) ? (_152 + _13._m0[_69].x) : 1073741820u;
    vec2 _165 = uintBitsToFloat(uvec2(texelFetch(_17[_66], int(_157)).x, texelFetch(_17[_66], int(_157 + 1u)).x));
    uint _169 = _53 * 3u;
    uint _174 = (_169 < _13._m0[_75].y) ? (_169 + _13._m0[_75].x) : 1073741820u;
    vec3 _186 = uintBitsToFloat(uvec3(texelFetch(_17[_72], int(_174)).x, texelFetch(_17[_72], int(_174 + 1u)).x, texelFetch(_17[_72], int(_174 + 2u)).x));
    uint _192 = _57 * 4u;
    uint _197 = (_192 < _13._m0[_81].y) ? (_192 + _13._m0[_81].x) : 1073741820u;
    vec4 _210 = uintBitsToFloat(uvec4(texelFetch(_17[_78], int(_197)).x, texelFetch(_17[_78], int(_197 + 1u)).x, texelFetch(_17[_78], int(_197 + 2u)).x, texelFetch(_17[_78], int(_197 + 3u)).x));
    uvec4 _223 = imageLoad(_21[_84], int((_45 < _13._m0[_89].y) ? (_45 + _13._m0[_89].x) : 1073741820u));
    uint _227 = _49 * 2u;
    uint _232 = (_227 < _13._m0[_96].y) ? (_227 + _13._m0[_96].x) : 1073741820u;
    vec2 _239 = uintBitsToFloat(uvec2(imageLoad(_24[_92], int(_232)).x, imageLoad(_24[_92], int(_232 + 1u)).x));
    uint _244 = _53 * 3u;
    uint _249 = (_244 < _13._m0[_103].y) ? (_244 + _13._m0[_103].x) : 1073741820u;
    uvec4 _250 = imageLoad(_21[_99], int(_249));
    uvec4 _252 = imageLoad(_21[_99], int(_249 + 1u));
    uvec4 _255 = imageLoad(_21[_99], int(_249 + 2u));
    vec3 _259 = uintBitsToFloat(uvec3(_250.x, _252.x, _255.x));
    uint _266 = _57 * 4u;
    uint _271 = (_266 < _13._m0[_110].y) ? (_266 + _13._m0[_110].x) : 1073741820u;
    uvec4 _272 = imageLoad(_21[_106], int(_271));
    uvec4 _274 = imageLoad(_21[_106], int(_271 + 1u));
    uvec4 _277 = imageLoad(_21[_106], int(_271 + 2u));
    uvec4 _280 = imageLoad(_21[_106], int(_271 + 3u));
    vec4 _284 = uintBitsToFloat(uvec4(_272.x, _274.x, _277.x, _280.x));
    uvec4 _298 = imageLoad(_27[_113], int((_45 < _13._m0[_117].y) ? (_45 + _13._m0[_117].x) : 1073741820u));
    uint _302 = _49 * 2u;
    uint _307 = (_302 < _13._m0[_124].y) ? (_302 + _13._m0[_124].x) : 1073741820u;
    uvec4 _308 = imageLoad(_27[_120], int(_307));
    uvec4 _310 = imageLoad(_27[_120], int(_307 + 1u));
    vec2 _314 = uintBitsToFloat(uvec2(_308.x, _310.x));
    uint _319 = _53 * 3u;
    uint _324 = (_319 < _13._m0[_131].y) ? (_319 + _13._m0[_131].x) : 1073741820u;
    uvec4 _325 = imageLoad(_30[_127], int(_324));
    uvec4 _327 = imageLoad(_30[_127], int(_324 + 1u));
    uvec4 _330 = imageLoad(_30[_127], int(_324 + 2u));
    vec3 _334 = uintBitsToFloat(uvec3(_325.x, _327.x, _330.x));
    uint _341 = _57 * 4u;
    uint _346 = (_341 < _13._m0[_138].y) ? (_341 + _13._m0[_138].x) : 1073741820u;
    uvec4 _347 = imageLoad(_27[_134], int(_346));
    uvec4 _349 = imageLoad(_27[_134], int(_346 + 1u));
    uvec4 _352 = imageLoad(_27[_134], int(_346 + 2u));
    uvec4 _355 = imageLoad(_27[_134], int(_346 + 3u));
    vec4 _359 = uintBitsToFloat(uvec4(_347.x, _349.x, _352.x, _355.x));
    uint _368 = _45 * 2u;
    uint _373 = (_368 < _13._m0[_96].y) ? (_368 + _13._m0[_96].x) : 1073741820u;
    imageStore(_24[_92], int(_373), uvec4(floatBitsToUint(20.0)));
    imageStore(_24[_92], int(_373 + 1u), uvec4(floatBitsToUint(20.0)));
    uint _380 = _49 * 3u;
    uint _385 = (_380 < _13._m0[_131].y) ? (_380 + _13._m0[_131].x) : 1073741820u;
    imageStore(_30[_127], int(_385), uvec4(floatBitsToUint(30.0)));
    imageStore(_30[_127], int(_385 + 1u), uvec4(floatBitsToUint(30.0)));
    imageStore(_30[_127], int(_385 + 2u), uvec4(floatBitsToUint(30.0)));
    SV_Target.x = ((((((((((_165.x + uintBitsToFloat(texelFetch(_17[INDEX], int((_45 < _13._m0[_62].y) ? (_45 + _13._m0[_62].x) : 1073741820u)).x)) + _186.x) + _210.x) + uintBitsToFloat(_223.x)) + _239.x) + _259.x) + _284.x) + uintBitsToFloat(_298.x)) + _314.x) + _334.x) + _359.x;
    SV_Target.y = (((((((_186.y + _165.y) + _210.y) + _239.y) + _259.y) + _284.y) + _314.y) + _334.y) + _359.y;
    SV_Target.z = ((((_210.z + _186.z) + _259.z) + _284.z) + _334.z) + _359.z;
    SV_Target.w = (_284.w + _210.w) + _359.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 402
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
OpEntryPoint Fragment %3 "main" %32 %36 %40
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %11 "SSBO_Offsets"
OpName %32 "INDEX"
OpName %36 "UV"
OpName %40 "SV_Target"
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
OpDecorate %21 NonWritable
OpDecorate %24 DescriptorSet 0
OpDecorate %24 Binding 0
OpDecorate %27 DescriptorSet 0
OpDecorate %27 Binding 0
OpDecorate %27 NonWritable
OpDecorate %27 Coherent
OpDecorate %30 DescriptorSet 0
OpDecorate %30 Binding 0
OpDecorate %30 Coherent
OpDecorate %32 Flat
OpDecorate %32 Location 0
OpDecorate %36 Flat
OpDecorate %36 Location 1
OpDecorate %40 Location 0
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
%25 = OpTypeRuntimeArray %18
%26 = OpTypePointer UniformConstant %25
%27 = OpVariable %26 UniformConstant
%28 = OpTypeRuntimeArray %18
%29 = OpTypePointer UniformConstant %28
%30 = OpVariable %29 UniformConstant
%31 = OpTypePointer Input %5
%32 = OpVariable %31 Input
%33 = OpTypeInt 32 1
%34 = OpTypeVector %33 4
%35 = OpTypePointer Input %34
%36 = OpVariable %35 Input
%37 = OpTypeFloat 32
%38 = OpTypeVector %37 4
%39 = OpTypePointer Output %38
%40 = OpVariable %39 Output
%41 = OpTypePointer Input %33
%43 = OpConstant %5 0
%47 = OpConstant %5 1
%51 = OpConstant %5 2
%55 = OpConstant %5 3
%59 = OpTypePointer UniformConstant %14
%63 = OpTypePointer StorageBuffer %9
%85 = OpConstant %5 4
%86 = OpTypePointer UniformConstant %18
%93 = OpConstant %5 5
%100 = OpConstant %5 6
%107 = OpConstant %5 7
%114 = OpConstant %5 8
%121 = OpConstant %5 9
%128 = OpConstant %5 10
%135 = OpConstant %5 11
%144 = OpTypeBool
%147 = OpConstant %5 1073741820
%148 = OpTypeVector %5 4
%164 = OpTypeVector %37 2
%183 = OpTypeVector %5 3
%185 = OpTypeVector %37 3
%374 = OpConstant %37 20
%386 = OpConstant %37 30
%395 = OpTypePointer Output %37
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %400
%400 = OpLabel
%42 = OpAccessChain %41 %36 %43
%44 = OpLoad %33 %42
%45 = OpBitcast %5 %44
%46 = OpAccessChain %41 %36 %47
%48 = OpLoad %33 %46
%49 = OpBitcast %5 %48
%50 = OpAccessChain %41 %36 %51
%52 = OpLoad %33 %50
%53 = OpBitcast %5 %52
%54 = OpAccessChain %41 %36 %55
%56 = OpLoad %33 %54
%57 = OpBitcast %5 %56
%58 = OpLoad %5 %32
%60 = OpAccessChain %59 %17 %58
%61 = OpLoad %14 %60
%62 = OpGroupNonUniformBroadcastFirst %5 %55 %58
%64 = OpAccessChain %63 %13 %43 %62
%65 = OpLoad %9 %64
%66 = OpIAdd %5 %58 %47
%67 = OpAccessChain %59 %17 %66
%68 = OpLoad %14 %67
%69 = OpGroupNonUniformBroadcastFirst %5 %55 %66
%70 = OpAccessChain %63 %13 %43 %69
%71 = OpLoad %9 %70
%72 = OpIAdd %5 %58 %51
%73 = OpAccessChain %59 %17 %72
%74 = OpLoad %14 %73
%75 = OpGroupNonUniformBroadcastFirst %5 %55 %72
%76 = OpAccessChain %63 %13 %43 %75
%77 = OpLoad %9 %76
%78 = OpIAdd %5 %58 %55
%79 = OpAccessChain %59 %17 %78
%80 = OpLoad %14 %79
%81 = OpGroupNonUniformBroadcastFirst %5 %55 %78
%82 = OpAccessChain %63 %13 %43 %81
%83 = OpLoad %9 %82
%84 = OpIAdd %5 %58 %85
%87 = OpAccessChain %86 %21 %84
%88 = OpLoad %18 %87
%89 = OpGroupNonUniformBroadcastFirst %5 %55 %84
%90 = OpAccessChain %63 %13 %43 %89
%91 = OpLoad %9 %90
%92 = OpIAdd %5 %58 %93
%94 = OpAccessChain %86 %24 %92
%95 = OpLoad %18 %94
%96 = OpGroupNonUniformBroadcastFirst %5 %55 %92
%97 = OpAccessChain %63 %13 %43 %96
%98 = OpLoad %9 %97
%99 = OpIAdd %5 %58 %100
%101 = OpAccessChain %86 %21 %99
%102 = OpLoad %18 %101
%103 = OpGroupNonUniformBroadcastFirst %5 %55 %99
%104 = OpAccessChain %63 %13 %43 %103
%105 = OpLoad %9 %104
%106 = OpIAdd %5 %58 %107
%108 = OpAccessChain %86 %21 %106
%109 = OpLoad %18 %108
%110 = OpGroupNonUniformBroadcastFirst %5 %55 %106
%111 = OpAccessChain %63 %13 %43 %110
%112 = OpLoad %9 %111
%113 = OpIAdd %5 %58 %114
%115 = OpAccessChain %86 %27 %113
%116 = OpLoad %18 %115
%117 = OpGroupNonUniformBroadcastFirst %5 %55 %113
%118 = OpAccessChain %63 %13 %43 %117
%119 = OpLoad %9 %118
%120 = OpIAdd %5 %58 %121
%122 = OpAccessChain %86 %27 %120
%123 = OpLoad %18 %122
%124 = OpGroupNonUniformBroadcastFirst %5 %55 %120
%125 = OpAccessChain %63 %13 %43 %124
%126 = OpLoad %9 %125
%127 = OpIAdd %5 %58 %128
%129 = OpAccessChain %86 %30 %127
%130 = OpLoad %18 %129
%131 = OpGroupNonUniformBroadcastFirst %5 %55 %127
%132 = OpAccessChain %63 %13 %43 %131
%133 = OpLoad %9 %132
%134 = OpIAdd %5 %58 %135
%136 = OpAccessChain %86 %27 %134
%137 = OpLoad %18 %136
%138 = OpGroupNonUniformBroadcastFirst %5 %55 %134
%139 = OpAccessChain %63 %13 %43 %138
%140 = OpLoad %9 %139
%141 = OpCompositeExtract %5 %65 0
%142 = OpCompositeExtract %5 %65 1
%143 = OpIAdd %5 %45 %141
%145 = OpULessThan %144 %45 %142
%146 = OpSelect %5 %145 %143 %147
%149 = OpImageFetch %148 %61 %146
%150 = OpCompositeExtract %5 %149 0
%151 = OpBitcast %37 %150
%152 = OpIMul %5 %49 %51
%153 = OpCompositeExtract %5 %71 0
%154 = OpCompositeExtract %5 %71 1
%155 = OpIAdd %5 %152 %153
%156 = OpULessThan %144 %152 %154
%157 = OpSelect %5 %156 %155 %147
%158 = OpImageFetch %148 %68 %157
%159 = OpCompositeExtract %5 %158 0
%161 = OpIAdd %5 %157 %47
%160 = OpImageFetch %148 %68 %161
%162 = OpCompositeExtract %5 %160 0
%163 = OpCompositeConstruct %9 %159 %162
%165 = OpBitcast %164 %163
%166 = OpCompositeExtract %37 %165 0
%167 = OpCompositeExtract %37 %165 1
%168 = OpFAdd %37 %166 %151
%169 = OpIMul %5 %53 %55
%170 = OpCompositeExtract %5 %77 0
%171 = OpCompositeExtract %5 %77 1
%172 = OpIAdd %5 %169 %170
%173 = OpULessThan %144 %169 %171
%174 = OpSelect %5 %173 %172 %147
%175 = OpImageFetch %148 %74 %174
%176 = OpCompositeExtract %5 %175 0
%178 = OpIAdd %5 %174 %47
%177 = OpImageFetch %148 %74 %178
%179 = OpCompositeExtract %5 %177 0
%181 = OpIAdd %5 %174 %51
%180 = OpImageFetch %148 %74 %181
%182 = OpCompositeExtract %5 %180 0
%184 = OpCompositeConstruct %183 %176 %179 %182
%186 = OpBitcast %185 %184
%187 = OpCompositeExtract %37 %186 0
%188 = OpCompositeExtract %37 %186 1
%189 = OpCompositeExtract %37 %186 2
%190 = OpFAdd %37 %168 %187
%191 = OpFAdd %37 %188 %167
%192 = OpIMul %5 %57 %85
%193 = OpCompositeExtract %5 %83 0
%194 = OpCompositeExtract %5 %83 1
%195 = OpIAdd %5 %192 %193
%196 = OpULessThan %144 %192 %194
%197 = OpSelect %5 %196 %195 %147
%198 = OpImageFetch %148 %80 %197
%199 = OpCompositeExtract %5 %198 0
%201 = OpIAdd %5 %197 %47
%200 = OpImageFetch %148 %80 %201
%202 = OpCompositeExtract %5 %200 0
%204 = OpIAdd %5 %197 %51
%203 = OpImageFetch %148 %80 %204
%205 = OpCompositeExtract %5 %203 0
%207 = OpIAdd %5 %197 %55
%206 = OpImageFetch %148 %80 %207
%208 = OpCompositeExtract %5 %206 0
%209 = OpCompositeConstruct %148 %199 %202 %205 %208
%210 = OpBitcast %38 %209
%211 = OpCompositeExtract %37 %210 0
%212 = OpCompositeExtract %37 %210 1
%213 = OpCompositeExtract %37 %210 2
%214 = OpCompositeExtract %37 %210 3
%215 = OpFAdd %37 %190 %211
%216 = OpFAdd %37 %191 %212
%217 = OpFAdd %37 %213 %189
%218 = OpCompositeExtract %5 %91 0
%219 = OpCompositeExtract %5 %91 1
%220 = OpIAdd %5 %45 %218
%221 = OpULessThan %144 %45 %219
%222 = OpSelect %5 %221 %220 %147
%223 = OpImageRead %148 %88 %222
%224 = OpCompositeExtract %5 %223 0
%225 = OpBitcast %37 %224
%226 = OpFAdd %37 %215 %225
%227 = OpIMul %5 %49 %51
%228 = OpCompositeExtract %5 %98 0
%229 = OpCompositeExtract %5 %98 1
%230 = OpIAdd %5 %227 %228
%231 = OpULessThan %144 %227 %229
%232 = OpSelect %5 %231 %230 %147
%233 = OpImageRead %148 %95 %232
%234 = OpCompositeExtract %5 %233 0
%236 = OpIAdd %5 %232 %47
%235 = OpImageRead %148 %95 %236
%237 = OpCompositeExtract %5 %235 0
%238 = OpCompositeConstruct %9 %234 %237
%239 = OpBitcast %164 %238
%240 = OpCompositeExtract %37 %239 0
%241 = OpCompositeExtract %37 %239 1
%242 = OpFAdd %37 %226 %240
%243 = OpFAdd %37 %216 %241
%244 = OpIMul %5 %53 %55
%245 = OpCompositeExtract %5 %105 0
%246 = OpCompositeExtract %5 %105 1
%247 = OpIAdd %5 %244 %245
%248 = OpULessThan %144 %244 %246
%249 = OpSelect %5 %248 %247 %147
%250 = OpImageRead %148 %102 %249
%251 = OpCompositeExtract %5 %250 0
%253 = OpIAdd %5 %249 %47
%252 = OpImageRead %148 %102 %253
%254 = OpCompositeExtract %5 %252 0
%256 = OpIAdd %5 %249 %51
%255 = OpImageRead %148 %102 %256
%257 = OpCompositeExtract %5 %255 0
%258 = OpCompositeConstruct %183 %251 %254 %257
%259 = OpBitcast %185 %258
%260 = OpCompositeExtract %37 %259 0
%261 = OpCompositeExtract %37 %259 1
%262 = OpCompositeExtract %37 %259 2
%263 = OpFAdd %37 %242 %260
%264 = OpFAdd %37 %243 %261
%265 = OpFAdd %37 %217 %262
%266 = OpIMul %5 %57 %85
%267 = OpCompositeExtract %5 %112 0
%268 = OpCompositeExtract %5 %112 1
%269 = OpIAdd %5 %266 %267
%270 = OpULessThan %144 %266 %268
%271 = OpSelect %5 %270 %269 %147
%272 = OpImageRead %148 %109 %271
%273 = OpCompositeExtract %5 %272 0
%275 = OpIAdd %5 %271 %47
%274 = OpImageRead %148 %109 %275
%276 = OpCompositeExtract %5 %274 0
%278 = OpIAdd %5 %271 %51
%277 = OpImageRead %148 %109 %278
%279 = OpCompositeExtract %5 %277 0
%281 = OpIAdd %5 %271 %55
%280 = OpImageRead %148 %109 %281
%282 = OpCompositeExtract %5 %280 0
%283 = OpCompositeConstruct %148 %273 %276 %279 %282
%284 = OpBitcast %38 %283
%285 = OpCompositeExtract %37 %284 0
%286 = OpCompositeExtract %37 %284 1
%287 = OpCompositeExtract %37 %284 2
%288 = OpCompositeExtract %37 %284 3
%289 = OpFAdd %37 %263 %285
%290 = OpFAdd %37 %264 %286
%291 = OpFAdd %37 %265 %287
%292 = OpFAdd %37 %288 %214
%293 = OpCompositeExtract %5 %119 0
%294 = OpCompositeExtract %5 %119 1
%295 = OpIAdd %5 %45 %293
%296 = OpULessThan %144 %45 %294
%297 = OpSelect %5 %296 %295 %147
%298 = OpImageRead %148 %116 %297
%299 = OpCompositeExtract %5 %298 0
%300 = OpBitcast %37 %299
%301 = OpFAdd %37 %289 %300
%302 = OpIMul %5 %49 %51
%303 = OpCompositeExtract %5 %126 0
%304 = OpCompositeExtract %5 %126 1
%305 = OpIAdd %5 %302 %303
%306 = OpULessThan %144 %302 %304
%307 = OpSelect %5 %306 %305 %147
%308 = OpImageRead %148 %123 %307
%309 = OpCompositeExtract %5 %308 0
%311 = OpIAdd %5 %307 %47
%310 = OpImageRead %148 %123 %311
%312 = OpCompositeExtract %5 %310 0
%313 = OpCompositeConstruct %9 %309 %312
%314 = OpBitcast %164 %313
%315 = OpCompositeExtract %37 %314 0
%316 = OpCompositeExtract %37 %314 1
%317 = OpFAdd %37 %301 %315
%318 = OpFAdd %37 %290 %316
%319 = OpIMul %5 %53 %55
%320 = OpCompositeExtract %5 %133 0
%321 = OpCompositeExtract %5 %133 1
%322 = OpIAdd %5 %319 %320
%323 = OpULessThan %144 %319 %321
%324 = OpSelect %5 %323 %322 %147
%325 = OpImageRead %148 %130 %324
%326 = OpCompositeExtract %5 %325 0
%328 = OpIAdd %5 %324 %47
%327 = OpImageRead %148 %130 %328
%329 = OpCompositeExtract %5 %327 0
%331 = OpIAdd %5 %324 %51
%330 = OpImageRead %148 %130 %331
%332 = OpCompositeExtract %5 %330 0
%333 = OpCompositeConstruct %183 %326 %329 %332
%334 = OpBitcast %185 %333
%335 = OpCompositeExtract %37 %334 0
%336 = OpCompositeExtract %37 %334 1
%337 = OpCompositeExtract %37 %334 2
%338 = OpFAdd %37 %317 %335
%339 = OpFAdd %37 %318 %336
%340 = OpFAdd %37 %291 %337
%341 = OpIMul %5 %57 %85
%342 = OpCompositeExtract %5 %140 0
%343 = OpCompositeExtract %5 %140 1
%344 = OpIAdd %5 %341 %342
%345 = OpULessThan %144 %341 %343
%346 = OpSelect %5 %345 %344 %147
%347 = OpImageRead %148 %137 %346
%348 = OpCompositeExtract %5 %347 0
%350 = OpIAdd %5 %346 %47
%349 = OpImageRead %148 %137 %350
%351 = OpCompositeExtract %5 %349 0
%353 = OpIAdd %5 %346 %51
%352 = OpImageRead %148 %137 %353
%354 = OpCompositeExtract %5 %352 0
%356 = OpIAdd %5 %346 %55
%355 = OpImageRead %148 %137 %356
%357 = OpCompositeExtract %5 %355 0
%358 = OpCompositeConstruct %148 %348 %351 %354 %357
%359 = OpBitcast %38 %358
%360 = OpCompositeExtract %37 %359 0
%361 = OpCompositeExtract %37 %359 1
%362 = OpCompositeExtract %37 %359 2
%363 = OpCompositeExtract %37 %359 3
%364 = OpFAdd %37 %338 %360
%365 = OpFAdd %37 %339 %361
%366 = OpFAdd %37 %340 %362
%367 = OpFAdd %37 %292 %363
%368 = OpIMul %5 %45 %51
%369 = OpCompositeExtract %5 %98 0
%370 = OpCompositeExtract %5 %98 1
%371 = OpIAdd %5 %368 %369
%372 = OpULessThan %144 %368 %370
%373 = OpSelect %5 %372 %371 %147
%375 = OpBitcast %5 %374
%376 = OpBitcast %5 %374
%377 = OpCompositeConstruct %148 %375 %375 %375 %375
OpImageWrite %95 %373 %377
%378 = OpCompositeConstruct %148 %376 %376 %376 %376
%379 = OpIAdd %5 %373 %47
OpImageWrite %95 %379 %378
%380 = OpIMul %5 %49 %55
%381 = OpCompositeExtract %5 %133 0
%382 = OpCompositeExtract %5 %133 1
%383 = OpIAdd %5 %380 %381
%384 = OpULessThan %144 %380 %382
%385 = OpSelect %5 %384 %383 %147
%387 = OpBitcast %5 %386
%388 = OpBitcast %5 %386
%389 = OpBitcast %5 %386
%390 = OpCompositeConstruct %148 %387 %387 %387 %387
OpImageWrite %130 %385 %390
%391 = OpCompositeConstruct %148 %388 %388 %388 %388
%392 = OpIAdd %5 %385 %47
OpImageWrite %130 %392 %391
%393 = OpCompositeConstruct %148 %389 %389 %389 %389
%394 = OpIAdd %5 %385 %51
OpImageWrite %130 %394 %393
%396 = OpAccessChain %395 %40 %43
OpStore %396 %364
%397 = OpAccessChain %395 %40 %47
OpStore %397 %365
%398 = OpAccessChain %395 %40 %51
OpStore %398 %366
%399 = OpAccessChain %395 %40 %55
OpStore %399 %367
OpReturn
OpFunctionEnd
#endif
