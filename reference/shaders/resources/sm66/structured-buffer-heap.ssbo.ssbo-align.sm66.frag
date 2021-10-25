#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_KHR_shader_subgroup_ballot : require

layout(set = 15, binding = 0, std430) restrict readonly buffer SSBO_Offsets
{
    uvec2 _m0[];
} _10;

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _15[];

layout(set = 0, binding = 0, std430) readonly buffer _17_20
{
    uint _m0[];
} _20[];

layout(set = 0, binding = 0, std430) buffer _22_25
{
    uint _m0[];
} _25[];

layout(set = 0, binding = 0, std430) coherent readonly buffer _27_30
{
    uint _m0[];
} _30[];

layout(set = 0, binding = 0, std430) coherent buffer _32_35
{
    uint _m0[];
} _35[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _50 = uint(UV.x);
    uint _54 = uint(UV.y);
    uint _58 = uint(UV.z);
    uint _62 = uint(UV.w);
    uvec2 _70 = _10._m0[subgroupBroadcastFirst(INDEX)] >> uvec2(2u);
    uint _72 = INDEX + 1u;
    uvec2 _77 = _10._m0[subgroupBroadcastFirst(_72)] >> uvec2(2u);
    uint _78 = INDEX + 2u;
    uvec2 _83 = _10._m0[subgroupBroadcastFirst(_78)] >> uvec2(2u);
    uint _84 = INDEX + 3u;
    uvec2 _89 = _10._m0[subgroupBroadcastFirst(_84)] >> uvec2(2u);
    uint _90 = INDEX + 4u;
    uvec2 _97 = _10._m0[subgroupBroadcastFirst(_90)] >> uvec2(2u);
    uint _98 = INDEX + 5u;
    uvec2 _105 = _10._m0[subgroupBroadcastFirst(_98)] >> uvec2(2u);
    uint _106 = INDEX + 6u;
    uvec2 _112 = _10._m0[subgroupBroadcastFirst(_106)] >> uvec2(2u);
    uint _113 = INDEX + 7u;
    uvec2 _119 = _10._m0[subgroupBroadcastFirst(_113)] >> uvec2(2u);
    uint _120 = INDEX + 8u;
    uvec2 _127 = _10._m0[subgroupBroadcastFirst(_120)] >> uvec2(2u);
    uint _128 = INDEX + 9u;
    uvec2 _134 = _10._m0[subgroupBroadcastFirst(_128)] >> uvec2(2u);
    uint _135 = INDEX + 10u;
    uvec2 _142 = _10._m0[subgroupBroadcastFirst(_135)] >> uvec2(2u);
    uint _143 = INDEX + 11u;
    uvec2 _149 = _10._m0[subgroupBroadcastFirst(_143)] >> uvec2(2u);
    uint _161 = _54 * 2u;
    uint _166 = (_161 < _77.y) ? (_161 + _77.x) : 1073741820u;
    vec2 _174 = uintBitsToFloat(uvec2(_15[_72]._m0[_166], _15[_72]._m0[_166 + 1u]));
    uint _178 = _58 * 3u;
    uint _183 = (_178 < _83.y) ? (_178 + _83.x) : 1073741820u;
    vec3 _195 = uintBitsToFloat(uvec3(_15[_78]._m0[_183], _15[_78]._m0[_183 + 1u], _15[_78]._m0[_183 + 2u]));
    uint _201 = _62 * 4u;
    uint _206 = (_201 < _89.y) ? (_201 + _89.x) : 1073741820u;
    vec4 _220 = uintBitsToFloat(uvec4(_15[_84]._m0[_206], _15[_84]._m0[_206 + 1u], _15[_84]._m0[_206 + 2u], _15[_84]._m0[_206 + 3u]));
    uint _234 = _20[_90]._m0[(_50 < _97.y) ? (_50 + _97.x) : 1073741820u];
    uint _237 = _54 * 2u;
    uint _242 = (_237 < _105.y) ? (_237 + _105.x) : 1073741820u;
    uint _244 = _25[_98]._m0[_242];
    uint _247 = _25[_98]._m0[_242 + 1u];
    vec2 _249 = uintBitsToFloat(uvec2(_244, _247));
    uint _254 = _58 * 3u;
    uint _259 = (_254 < _112.y) ? (_254 + _112.x) : 1073741820u;
    uint _261 = _20[_106]._m0[_259];
    uint _264 = _20[_106]._m0[_259 + 1u];
    uint _267 = _20[_106]._m0[_259 + 2u];
    vec3 _269 = uintBitsToFloat(uvec3(_261, _264, _267));
    uint _276 = _62 * 4u;
    uint _281 = (_276 < _119.y) ? (_276 + _119.x) : 1073741820u;
    uint _283 = _20[_113]._m0[_281];
    uint _286 = _20[_113]._m0[_281 + 1u];
    uint _289 = _20[_113]._m0[_281 + 2u];
    uint _292 = _20[_113]._m0[_281 + 3u];
    vec4 _294 = uintBitsToFloat(uvec4(_283, _286, _289, _292));
    uint _309 = _30[_120]._m0[(_50 < _127.y) ? (_50 + _127.x) : 1073741820u];
    uint _312 = _54 * 2u;
    uint _317 = (_312 < _134.y) ? (_312 + _134.x) : 1073741820u;
    uint _319 = _30[_128]._m0[_317];
    uint _322 = _30[_128]._m0[_317 + 1u];
    vec2 _324 = uintBitsToFloat(uvec2(_319, _322));
    uint _329 = _58 * 3u;
    uint _334 = (_329 < _142.y) ? (_329 + _142.x) : 1073741820u;
    uint _336 = _35[_135]._m0[_334];
    uint _339 = _35[_135]._m0[_334 + 1u];
    uint _342 = _35[_135]._m0[_334 + 2u];
    vec3 _344 = uintBitsToFloat(uvec3(_336, _339, _342));
    uint _351 = _62 * 4u;
    uint _356 = (_351 < _149.y) ? (_351 + _149.x) : 1073741820u;
    uint _358 = _30[_143]._m0[_356];
    uint _361 = _30[_143]._m0[_356 + 1u];
    uint _364 = _30[_143]._m0[_356 + 2u];
    uint _367 = _30[_143]._m0[_356 + 3u];
    vec4 _369 = uintBitsToFloat(uvec4(_358, _361, _364, _367));
    uint _378 = _50 * 2u;
    uint _383 = (_378 < _105.y) ? (_378 + _105.x) : 1073741820u;
    _25[_98]._m0[_383] = floatBitsToUint(20.0);
    _25[_98]._m0[_383 + 1u] = floatBitsToUint(20.0);
    uint _390 = _54 * 3u;
    uint _395 = (_390 < _142.y) ? (_390 + _142.x) : 1073741820u;
    _35[_135]._m0[_395] = floatBitsToUint(30.0);
    _35[_135]._m0[_395 + 1u] = floatBitsToUint(30.0);
    _35[_135]._m0[_395 + 2u] = floatBitsToUint(30.0);
    SV_Target.x = ((((((((((_174.x + uintBitsToFloat(_15[INDEX]._m0[(_50 < _70.y) ? (_50 + _70.x) : 1073741820u])) + _195.x) + _220.x) + uintBitsToFloat(_234)) + _249.x) + _269.x) + _294.x) + uintBitsToFloat(_309)) + _324.x) + _344.x) + _369.x;
    SV_Target.y = (((((((_195.y + _174.y) + _220.y) + _249.y) + _269.y) + _294.y) + _324.y) + _344.y) + _369.y;
    SV_Target.z = ((((_220.z + _195.z) + _269.z) + _294.z) + _344.z) + _369.z;
    SV_Target.w = (_294.w + _220.w) + _369.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 412
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformBallot
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %37 %41 %45
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SSBO_Offsets"
OpName %12 "SSBO"
OpName %17 "SSBO"
OpName %22 "SSBO"
OpName %27 "SSBO"
OpName %32 "SSBO"
OpName %37 "INDEX"
OpName %41 "UV"
OpName %45 "SV_Target"
OpDecorate %7 ArrayStride 8
OpMemberDecorate %8 0 Offset 0
OpDecorate %8 Block
OpDecorate %10 DescriptorSet 15
OpDecorate %10 Binding 0
OpDecorate %10 NonWritable
OpDecorate %10 Restrict
OpDecorate %11 ArrayStride 4
OpMemberDecorate %12 0 Offset 0
OpDecorate %12 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 0
OpDecorate %15 NonWritable
OpDecorate %15 Restrict
OpDecorate %16 ArrayStride 4
OpMemberDecorate %17 0 Offset 0
OpDecorate %17 Block
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 0
OpDecorate %20 NonWritable
OpDecorate %21 ArrayStride 4
OpMemberDecorate %22 0 Offset 0
OpDecorate %22 Block
OpDecorate %25 DescriptorSet 0
OpDecorate %25 Binding 0
OpDecorate %26 ArrayStride 4
OpMemberDecorate %27 0 Offset 0
OpDecorate %27 Block
OpDecorate %30 DescriptorSet 0
OpDecorate %30 Binding 0
OpDecorate %30 NonWritable
OpDecorate %30 Coherent
OpDecorate %31 ArrayStride 4
OpMemberDecorate %32 0 Offset 0
OpDecorate %32 Block
OpDecorate %35 DescriptorSet 0
OpDecorate %35 Binding 0
OpDecorate %35 Coherent
OpDecorate %37 Flat
OpDecorate %37 Location 0
OpDecorate %41 Flat
OpDecorate %41 Location 1
OpDecorate %45 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypeRuntimeArray %6
%8 = OpTypeStruct %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypeRuntimeArray %5
%12 = OpTypeStruct %11
%13 = OpTypeRuntimeArray %12
%14 = OpTypePointer StorageBuffer %13
%15 = OpVariable %14 StorageBuffer
%16 = OpTypeRuntimeArray %5
%17 = OpTypeStruct %16
%18 = OpTypeRuntimeArray %17
%19 = OpTypePointer StorageBuffer %18
%20 = OpVariable %19 StorageBuffer
%21 = OpTypeRuntimeArray %5
%22 = OpTypeStruct %21
%23 = OpTypeRuntimeArray %22
%24 = OpTypePointer StorageBuffer %23
%25 = OpVariable %24 StorageBuffer
%26 = OpTypeRuntimeArray %5
%27 = OpTypeStruct %26
%28 = OpTypeRuntimeArray %27
%29 = OpTypePointer StorageBuffer %28
%30 = OpVariable %29 StorageBuffer
%31 = OpTypeRuntimeArray %5
%32 = OpTypeStruct %31
%33 = OpTypeRuntimeArray %32
%34 = OpTypePointer StorageBuffer %33
%35 = OpVariable %34 StorageBuffer
%36 = OpTypePointer Input %5
%37 = OpVariable %36 Input
%38 = OpTypeInt 32 1
%39 = OpTypeVector %38 4
%40 = OpTypePointer Input %39
%41 = OpVariable %40 Input
%42 = OpTypeFloat 32
%43 = OpTypeVector %42 4
%44 = OpTypePointer Output %43
%45 = OpVariable %44 Output
%46 = OpTypePointer Input %38
%48 = OpConstant %5 0
%52 = OpConstant %5 1
%56 = OpConstant %5 2
%60 = OpConstant %5 3
%64 = OpTypePointer StorageBuffer %12
%67 = OpTypePointer StorageBuffer %6
%71 = OpConstantComposite %6 %56 %56
%91 = OpConstant %5 4
%92 = OpTypePointer StorageBuffer %17
%99 = OpConstant %5 5
%100 = OpTypePointer StorageBuffer %22
%107 = OpConstant %5 6
%114 = OpConstant %5 7
%121 = OpConstant %5 8
%122 = OpTypePointer StorageBuffer %27
%129 = OpConstant %5 9
%136 = OpConstant %5 10
%137 = OpTypePointer StorageBuffer %32
%144 = OpConstant %5 11
%153 = OpTypeBool
%156 = OpConstant %5 1073741820
%157 = OpTypePointer StorageBuffer %5
%173 = OpTypeVector %42 2
%192 = OpTypeVector %5 3
%194 = OpTypeVector %42 3
%218 = OpTypeVector %5 4
%384 = OpConstant %42 20
%396 = OpConstant %42 30
%405 = OpTypePointer Output %42
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %410
%410 = OpLabel
%47 = OpAccessChain %46 %41 %48
%49 = OpLoad %38 %47
%50 = OpBitcast %5 %49
%51 = OpAccessChain %46 %41 %52
%53 = OpLoad %38 %51
%54 = OpBitcast %5 %53
%55 = OpAccessChain %46 %41 %56
%57 = OpLoad %38 %55
%58 = OpBitcast %5 %57
%59 = OpAccessChain %46 %41 %60
%61 = OpLoad %38 %59
%62 = OpBitcast %5 %61
%63 = OpLoad %5 %37
%65 = OpAccessChain %64 %15 %63
%66 = OpGroupNonUniformBroadcastFirst %5 %60 %63
%68 = OpAccessChain %67 %10 %48 %66
%69 = OpLoad %6 %68
%70 = OpShiftRightLogical %6 %69 %71
%72 = OpIAdd %5 %63 %52
%73 = OpAccessChain %64 %15 %72
%74 = OpGroupNonUniformBroadcastFirst %5 %60 %72
%75 = OpAccessChain %67 %10 %48 %74
%76 = OpLoad %6 %75
%77 = OpShiftRightLogical %6 %76 %71
%78 = OpIAdd %5 %63 %56
%79 = OpAccessChain %64 %15 %78
%80 = OpGroupNonUniformBroadcastFirst %5 %60 %78
%81 = OpAccessChain %67 %10 %48 %80
%82 = OpLoad %6 %81
%83 = OpShiftRightLogical %6 %82 %71
%84 = OpIAdd %5 %63 %60
%85 = OpAccessChain %64 %15 %84
%86 = OpGroupNonUniformBroadcastFirst %5 %60 %84
%87 = OpAccessChain %67 %10 %48 %86
%88 = OpLoad %6 %87
%89 = OpShiftRightLogical %6 %88 %71
%90 = OpIAdd %5 %63 %91
%93 = OpAccessChain %92 %20 %90
%94 = OpGroupNonUniformBroadcastFirst %5 %60 %90
%95 = OpAccessChain %67 %10 %48 %94
%96 = OpLoad %6 %95
%97 = OpShiftRightLogical %6 %96 %71
%98 = OpIAdd %5 %63 %99
%101 = OpAccessChain %100 %25 %98
%102 = OpGroupNonUniformBroadcastFirst %5 %60 %98
%103 = OpAccessChain %67 %10 %48 %102
%104 = OpLoad %6 %103
%105 = OpShiftRightLogical %6 %104 %71
%106 = OpIAdd %5 %63 %107
%108 = OpAccessChain %92 %20 %106
%109 = OpGroupNonUniformBroadcastFirst %5 %60 %106
%110 = OpAccessChain %67 %10 %48 %109
%111 = OpLoad %6 %110
%112 = OpShiftRightLogical %6 %111 %71
%113 = OpIAdd %5 %63 %114
%115 = OpAccessChain %92 %20 %113
%116 = OpGroupNonUniformBroadcastFirst %5 %60 %113
%117 = OpAccessChain %67 %10 %48 %116
%118 = OpLoad %6 %117
%119 = OpShiftRightLogical %6 %118 %71
%120 = OpIAdd %5 %63 %121
%123 = OpAccessChain %122 %30 %120
%124 = OpGroupNonUniformBroadcastFirst %5 %60 %120
%125 = OpAccessChain %67 %10 %48 %124
%126 = OpLoad %6 %125
%127 = OpShiftRightLogical %6 %126 %71
%128 = OpIAdd %5 %63 %129
%130 = OpAccessChain %122 %30 %128
%131 = OpGroupNonUniformBroadcastFirst %5 %60 %128
%132 = OpAccessChain %67 %10 %48 %131
%133 = OpLoad %6 %132
%134 = OpShiftRightLogical %6 %133 %71
%135 = OpIAdd %5 %63 %136
%138 = OpAccessChain %137 %35 %135
%139 = OpGroupNonUniformBroadcastFirst %5 %60 %135
%140 = OpAccessChain %67 %10 %48 %139
%141 = OpLoad %6 %140
%142 = OpShiftRightLogical %6 %141 %71
%143 = OpIAdd %5 %63 %144
%145 = OpAccessChain %122 %30 %143
%146 = OpGroupNonUniformBroadcastFirst %5 %60 %143
%147 = OpAccessChain %67 %10 %48 %146
%148 = OpLoad %6 %147
%149 = OpShiftRightLogical %6 %148 %71
%150 = OpCompositeExtract %5 %70 0
%151 = OpCompositeExtract %5 %70 1
%152 = OpIAdd %5 %50 %150
%154 = OpULessThan %153 %50 %151
%155 = OpSelect %5 %154 %152 %156
%158 = OpAccessChain %157 %65 %48 %155
%159 = OpLoad %5 %158
%160 = OpBitcast %42 %159
%161 = OpIMul %5 %54 %56
%162 = OpCompositeExtract %5 %77 0
%163 = OpCompositeExtract %5 %77 1
%164 = OpIAdd %5 %161 %162
%165 = OpULessThan %153 %161 %163
%166 = OpSelect %5 %165 %164 %156
%167 = OpAccessChain %157 %73 %48 %166
%168 = OpLoad %5 %167
%170 = OpIAdd %5 %166 %52
%169 = OpAccessChain %157 %73 %48 %170
%171 = OpLoad %5 %169
%172 = OpCompositeConstruct %6 %168 %171
%174 = OpBitcast %173 %172
%175 = OpCompositeExtract %42 %174 0
%176 = OpCompositeExtract %42 %174 1
%177 = OpFAdd %42 %175 %160
%178 = OpIMul %5 %58 %60
%179 = OpCompositeExtract %5 %83 0
%180 = OpCompositeExtract %5 %83 1
%181 = OpIAdd %5 %178 %179
%182 = OpULessThan %153 %178 %180
%183 = OpSelect %5 %182 %181 %156
%184 = OpAccessChain %157 %79 %48 %183
%185 = OpLoad %5 %184
%187 = OpIAdd %5 %183 %52
%186 = OpAccessChain %157 %79 %48 %187
%188 = OpLoad %5 %186
%190 = OpIAdd %5 %183 %56
%189 = OpAccessChain %157 %79 %48 %190
%191 = OpLoad %5 %189
%193 = OpCompositeConstruct %192 %185 %188 %191
%195 = OpBitcast %194 %193
%196 = OpCompositeExtract %42 %195 0
%197 = OpCompositeExtract %42 %195 1
%198 = OpCompositeExtract %42 %195 2
%199 = OpFAdd %42 %177 %196
%200 = OpFAdd %42 %197 %176
%201 = OpIMul %5 %62 %91
%202 = OpCompositeExtract %5 %89 0
%203 = OpCompositeExtract %5 %89 1
%204 = OpIAdd %5 %201 %202
%205 = OpULessThan %153 %201 %203
%206 = OpSelect %5 %205 %204 %156
%207 = OpAccessChain %157 %85 %48 %206
%208 = OpLoad %5 %207
%210 = OpIAdd %5 %206 %52
%209 = OpAccessChain %157 %85 %48 %210
%211 = OpLoad %5 %209
%213 = OpIAdd %5 %206 %56
%212 = OpAccessChain %157 %85 %48 %213
%214 = OpLoad %5 %212
%216 = OpIAdd %5 %206 %60
%215 = OpAccessChain %157 %85 %48 %216
%217 = OpLoad %5 %215
%219 = OpCompositeConstruct %218 %208 %211 %214 %217
%220 = OpBitcast %43 %219
%221 = OpCompositeExtract %42 %220 0
%222 = OpCompositeExtract %42 %220 1
%223 = OpCompositeExtract %42 %220 2
%224 = OpCompositeExtract %42 %220 3
%225 = OpFAdd %42 %199 %221
%226 = OpFAdd %42 %200 %222
%227 = OpFAdd %42 %223 %198
%228 = OpCompositeExtract %5 %97 0
%229 = OpCompositeExtract %5 %97 1
%230 = OpIAdd %5 %50 %228
%231 = OpULessThan %153 %50 %229
%232 = OpSelect %5 %231 %230 %156
%233 = OpAccessChain %157 %93 %48 %232
%234 = OpLoad %5 %233
%235 = OpBitcast %42 %234
%236 = OpFAdd %42 %225 %235
%237 = OpIMul %5 %54 %56
%238 = OpCompositeExtract %5 %105 0
%239 = OpCompositeExtract %5 %105 1
%240 = OpIAdd %5 %237 %238
%241 = OpULessThan %153 %237 %239
%242 = OpSelect %5 %241 %240 %156
%243 = OpAccessChain %157 %101 %48 %242
%244 = OpLoad %5 %243
%246 = OpIAdd %5 %242 %52
%245 = OpAccessChain %157 %101 %48 %246
%247 = OpLoad %5 %245
%248 = OpCompositeConstruct %6 %244 %247
%249 = OpBitcast %173 %248
%250 = OpCompositeExtract %42 %249 0
%251 = OpCompositeExtract %42 %249 1
%252 = OpFAdd %42 %236 %250
%253 = OpFAdd %42 %226 %251
%254 = OpIMul %5 %58 %60
%255 = OpCompositeExtract %5 %112 0
%256 = OpCompositeExtract %5 %112 1
%257 = OpIAdd %5 %254 %255
%258 = OpULessThan %153 %254 %256
%259 = OpSelect %5 %258 %257 %156
%260 = OpAccessChain %157 %108 %48 %259
%261 = OpLoad %5 %260
%263 = OpIAdd %5 %259 %52
%262 = OpAccessChain %157 %108 %48 %263
%264 = OpLoad %5 %262
%266 = OpIAdd %5 %259 %56
%265 = OpAccessChain %157 %108 %48 %266
%267 = OpLoad %5 %265
%268 = OpCompositeConstruct %192 %261 %264 %267
%269 = OpBitcast %194 %268
%270 = OpCompositeExtract %42 %269 0
%271 = OpCompositeExtract %42 %269 1
%272 = OpCompositeExtract %42 %269 2
%273 = OpFAdd %42 %252 %270
%274 = OpFAdd %42 %253 %271
%275 = OpFAdd %42 %227 %272
%276 = OpIMul %5 %62 %91
%277 = OpCompositeExtract %5 %119 0
%278 = OpCompositeExtract %5 %119 1
%279 = OpIAdd %5 %276 %277
%280 = OpULessThan %153 %276 %278
%281 = OpSelect %5 %280 %279 %156
%282 = OpAccessChain %157 %115 %48 %281
%283 = OpLoad %5 %282
%285 = OpIAdd %5 %281 %52
%284 = OpAccessChain %157 %115 %48 %285
%286 = OpLoad %5 %284
%288 = OpIAdd %5 %281 %56
%287 = OpAccessChain %157 %115 %48 %288
%289 = OpLoad %5 %287
%291 = OpIAdd %5 %281 %60
%290 = OpAccessChain %157 %115 %48 %291
%292 = OpLoad %5 %290
%293 = OpCompositeConstruct %218 %283 %286 %289 %292
%294 = OpBitcast %43 %293
%295 = OpCompositeExtract %42 %294 0
%296 = OpCompositeExtract %42 %294 1
%297 = OpCompositeExtract %42 %294 2
%298 = OpCompositeExtract %42 %294 3
%299 = OpFAdd %42 %273 %295
%300 = OpFAdd %42 %274 %296
%301 = OpFAdd %42 %275 %297
%302 = OpFAdd %42 %298 %224
%303 = OpCompositeExtract %5 %127 0
%304 = OpCompositeExtract %5 %127 1
%305 = OpIAdd %5 %50 %303
%306 = OpULessThan %153 %50 %304
%307 = OpSelect %5 %306 %305 %156
%308 = OpAccessChain %157 %123 %48 %307
%309 = OpLoad %5 %308
%310 = OpBitcast %42 %309
%311 = OpFAdd %42 %299 %310
%312 = OpIMul %5 %54 %56
%313 = OpCompositeExtract %5 %134 0
%314 = OpCompositeExtract %5 %134 1
%315 = OpIAdd %5 %312 %313
%316 = OpULessThan %153 %312 %314
%317 = OpSelect %5 %316 %315 %156
%318 = OpAccessChain %157 %130 %48 %317
%319 = OpLoad %5 %318
%321 = OpIAdd %5 %317 %52
%320 = OpAccessChain %157 %130 %48 %321
%322 = OpLoad %5 %320
%323 = OpCompositeConstruct %6 %319 %322
%324 = OpBitcast %173 %323
%325 = OpCompositeExtract %42 %324 0
%326 = OpCompositeExtract %42 %324 1
%327 = OpFAdd %42 %311 %325
%328 = OpFAdd %42 %300 %326
%329 = OpIMul %5 %58 %60
%330 = OpCompositeExtract %5 %142 0
%331 = OpCompositeExtract %5 %142 1
%332 = OpIAdd %5 %329 %330
%333 = OpULessThan %153 %329 %331
%334 = OpSelect %5 %333 %332 %156
%335 = OpAccessChain %157 %138 %48 %334
%336 = OpLoad %5 %335
%338 = OpIAdd %5 %334 %52
%337 = OpAccessChain %157 %138 %48 %338
%339 = OpLoad %5 %337
%341 = OpIAdd %5 %334 %56
%340 = OpAccessChain %157 %138 %48 %341
%342 = OpLoad %5 %340
%343 = OpCompositeConstruct %192 %336 %339 %342
%344 = OpBitcast %194 %343
%345 = OpCompositeExtract %42 %344 0
%346 = OpCompositeExtract %42 %344 1
%347 = OpCompositeExtract %42 %344 2
%348 = OpFAdd %42 %327 %345
%349 = OpFAdd %42 %328 %346
%350 = OpFAdd %42 %301 %347
%351 = OpIMul %5 %62 %91
%352 = OpCompositeExtract %5 %149 0
%353 = OpCompositeExtract %5 %149 1
%354 = OpIAdd %5 %351 %352
%355 = OpULessThan %153 %351 %353
%356 = OpSelect %5 %355 %354 %156
%357 = OpAccessChain %157 %145 %48 %356
%358 = OpLoad %5 %357
%360 = OpIAdd %5 %356 %52
%359 = OpAccessChain %157 %145 %48 %360
%361 = OpLoad %5 %359
%363 = OpIAdd %5 %356 %56
%362 = OpAccessChain %157 %145 %48 %363
%364 = OpLoad %5 %362
%366 = OpIAdd %5 %356 %60
%365 = OpAccessChain %157 %145 %48 %366
%367 = OpLoad %5 %365
%368 = OpCompositeConstruct %218 %358 %361 %364 %367
%369 = OpBitcast %43 %368
%370 = OpCompositeExtract %42 %369 0
%371 = OpCompositeExtract %42 %369 1
%372 = OpCompositeExtract %42 %369 2
%373 = OpCompositeExtract %42 %369 3
%374 = OpFAdd %42 %348 %370
%375 = OpFAdd %42 %349 %371
%376 = OpFAdd %42 %350 %372
%377 = OpFAdd %42 %302 %373
%378 = OpIMul %5 %50 %56
%379 = OpCompositeExtract %5 %105 0
%380 = OpCompositeExtract %5 %105 1
%381 = OpIAdd %5 %378 %379
%382 = OpULessThan %153 %378 %380
%383 = OpSelect %5 %382 %381 %156
%385 = OpBitcast %5 %384
%386 = OpBitcast %5 %384
%387 = OpAccessChain %157 %101 %48 %383
OpStore %387 %385
%389 = OpIAdd %5 %383 %52
%388 = OpAccessChain %157 %101 %48 %389
OpStore %388 %386
%390 = OpIMul %5 %54 %60
%391 = OpCompositeExtract %5 %142 0
%392 = OpCompositeExtract %5 %142 1
%393 = OpIAdd %5 %390 %391
%394 = OpULessThan %153 %390 %392
%395 = OpSelect %5 %394 %393 %156
%397 = OpBitcast %5 %396
%398 = OpBitcast %5 %396
%399 = OpBitcast %5 %396
%400 = OpAccessChain %157 %138 %48 %395
OpStore %400 %397
%402 = OpIAdd %5 %395 %52
%401 = OpAccessChain %157 %138 %48 %402
OpStore %401 %398
%404 = OpIAdd %5 %395 %56
%403 = OpAccessChain %157 %138 %48 %404
OpStore %403 %399
%406 = OpAccessChain %405 %45 %48
OpStore %406 %374
%407 = OpAccessChain %405 %45 %52
OpStore %407 %375
%408 = OpAccessChain %405 %45 %56
OpStore %408 %376
%409 = OpAccessChain %405 %45 %60
OpStore %409 %377
OpReturn
OpFunctionEnd
#endif
