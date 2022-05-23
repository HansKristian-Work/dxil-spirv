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

layout(set = 0, binding = 0, std430) restrict readonly buffer _17_20
{
    uvec2 _m0[];
} _20[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _23_26
{
    uvec4 _m0[];
} _26[];

layout(set = 0, binding = 0, std430) readonly buffer _28_31
{
    uint _m0[];
} _31[];

layout(set = 0, binding = 0, std430) buffer _33_36
{
    uvec2 _m0[];
} _36[];

layout(set = 0, binding = 0, std430) readonly buffer _38_41
{
    uvec4 _m0[];
} _41[];

layout(set = 0, binding = 0, std430) coherent readonly buffer _43_46
{
    uint _m0[];
} _46[];

layout(set = 0, binding = 0, std430) coherent readonly buffer _48_51
{
    uvec2 _m0[];
} _51[];

layout(set = 0, binding = 0, std430) coherent buffer _53_56
{
    uint _m0[];
} _56[];

layout(set = 0, binding = 0, std430) coherent readonly buffer _58_61
{
    uvec4 _m0[];
} _61[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _76 = uint(UV.x);
    uint _80 = uint(UV.y);
    uint _84 = uint(UV.z);
    uint _88 = uint(UV.w);
    uvec2 _96 = _10._m0[subgroupBroadcastFirst(INDEX)] >> uvec2(2u);
    uint _98 = INDEX + 1u;
    uvec2 _104 = _10._m0[subgroupBroadcastFirst(_98)] >> uvec2(3u);
    uint _106 = INDEX + 2u;
    uvec2 _111 = _10._m0[subgroupBroadcastFirst(_106)] >> uvec2(2u);
    uint _112 = INDEX + 3u;
    uvec2 _118 = _10._m0[subgroupBroadcastFirst(_112)] >> uvec2(4u);
    uint _121 = INDEX + 4u;
    uvec2 _127 = _10._m0[subgroupBroadcastFirst(_121)] >> uvec2(2u);
    uint _128 = INDEX + 5u;
    uvec2 _135 = _10._m0[subgroupBroadcastFirst(_128)] >> uvec2(3u);
    uint _136 = INDEX + 6u;
    uvec2 _142 = _10._m0[subgroupBroadcastFirst(_136)] >> uvec2(2u);
    uint _143 = INDEX + 7u;
    uvec2 _150 = _10._m0[subgroupBroadcastFirst(_143)] >> uvec2(4u);
    uint _151 = INDEX + 8u;
    uvec2 _158 = _10._m0[subgroupBroadcastFirst(_151)] >> uvec2(2u);
    uint _159 = INDEX + 9u;
    uvec2 _166 = _10._m0[subgroupBroadcastFirst(_159)] >> uvec2(3u);
    uint _167 = INDEX + 10u;
    uvec2 _174 = _10._m0[subgroupBroadcastFirst(_167)] >> uvec2(2u);
    uint _175 = INDEX + 11u;
    uvec2 _182 = _10._m0[subgroupBroadcastFirst(_175)] >> uvec2(4u);
    vec2 _203 = uintBitsToFloat(_20[_98]._m0[(_80 < _104.y) ? (_80 + _104.x) : 536870911u]);
    uint _207 = _84 * 3u;
    uint _212 = (_207 < _111.y) ? (_207 + _111.x) : 1073741820u;
    vec3 _224 = uintBitsToFloat(uvec3(_15[_106]._m0[_212], _15[_106]._m0[_212 + 1u], _15[_106]._m0[_212 + 2u]));
    vec4 _239 = uintBitsToFloat(_26[_112]._m0[(_88 < _118.y) ? (_88 + _118.x) : 268435455u]);
    uint _253 = _31[_121]._m0[(_76 < _127.y) ? (_76 + _127.x) : 1073741820u];
    vec2 _263 = uintBitsToFloat(_36[_128]._m0[(_80 < _135.y) ? (_80 + _135.x) : 536870911u]);
    uint _268 = _84 * 3u;
    uint _273 = (_268 < _142.y) ? (_268 + _142.x) : 1073741820u;
    vec3 _283 = uintBitsToFloat(uvec3(_31[_136]._m0[_273], _31[_136]._m0[_273 + 1u], _31[_136]._m0[_273 + 2u]));
    uvec4 _296 = _41[_143]._m0[(_88 < _150.y) ? (_88 + _150.x) : 268435455u];
    vec4 _297 = uintBitsToFloat(_296);
    uint _312 = _46[_151]._m0[(_76 < _158.y) ? (_76 + _158.x) : 1073741820u];
    uvec2 _321 = _51[_159]._m0[(_80 < _166.y) ? (_80 + _166.x) : 536870911u];
    vec2 _322 = uintBitsToFloat(_321);
    uint _327 = _84 * 3u;
    uint _332 = (_327 < _174.y) ? (_327 + _174.x) : 1073741820u;
    uint _334 = _56[_167]._m0[_332];
    uint _337 = _56[_167]._m0[_332 + 1u];
    uint _340 = _56[_167]._m0[_332 + 2u];
    vec3 _342 = uintBitsToFloat(uvec3(_334, _337, _340));
    uvec4 _355 = _61[_175]._m0[(_88 < _182.y) ? (_88 + _182.x) : 268435455u];
    vec4 _356 = uintBitsToFloat(_355);
    _36[_128]._m0[(_76 < _135.y) ? (_76 + _135.x) : 536870911u] = uvec2(floatBitsToUint(20.0), floatBitsToUint(20.0));
    uint _375 = _80 * 3u;
    uint _380 = (_375 < _174.y) ? (_375 + _174.x) : 1073741820u;
    _56[_167]._m0[_380] = floatBitsToUint(30.0);
    _56[_167]._m0[_380 + 1u] = floatBitsToUint(30.0);
    _56[_167]._m0[_380 + 2u] = floatBitsToUint(30.0);
    SV_Target.x = ((((((((((_203.x + uintBitsToFloat(_15[INDEX]._m0[(_76 < _96.y) ? (_76 + _96.x) : 1073741820u])) + _224.x) + _239.x) + uintBitsToFloat(_253)) + _263.x) + _283.x) + _297.x) + uintBitsToFloat(_312)) + _322.x) + _342.x) + _356.x;
    SV_Target.y = (((((((_224.y + _203.y) + _239.y) + _263.y) + _283.y) + _297.y) + _322.y) + _342.y) + _356.y;
    SV_Target.z = ((((_239.z + _224.z) + _283.z) + _297.z) + _342.z) + _356.z;
    SV_Target.w = (_297.w + _239.w) + _356.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 397
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformBallot
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %63 %67 %71
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SSBO_Offsets"
OpName %12 "SSBO"
OpName %17 "SSBO"
OpName %23 "SSBO"
OpName %28 "SSBO"
OpName %33 "SSBO"
OpName %38 "SSBO"
OpName %43 "SSBO"
OpName %48 "SSBO"
OpName %53 "SSBO"
OpName %58 "SSBO"
OpName %63 "INDEX"
OpName %67 "UV"
OpName %71 "SV_Target"
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
OpDecorate %16 ArrayStride 8
OpMemberDecorate %17 0 Offset 0
OpDecorate %17 Block
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 0
OpDecorate %20 NonWritable
OpDecorate %20 Restrict
OpDecorate %22 ArrayStride 16
OpMemberDecorate %23 0 Offset 0
OpDecorate %23 Block
OpDecorate %26 DescriptorSet 0
OpDecorate %26 Binding 0
OpDecorate %26 NonWritable
OpDecorate %26 Restrict
OpDecorate %27 ArrayStride 4
OpMemberDecorate %28 0 Offset 0
OpDecorate %28 Block
OpDecorate %31 DescriptorSet 0
OpDecorate %31 Binding 0
OpDecorate %31 NonWritable
OpDecorate %32 ArrayStride 8
OpMemberDecorate %33 0 Offset 0
OpDecorate %33 Block
OpDecorate %36 DescriptorSet 0
OpDecorate %36 Binding 0
OpDecorate %37 ArrayStride 16
OpMemberDecorate %38 0 Offset 0
OpDecorate %38 Block
OpDecorate %41 DescriptorSet 0
OpDecorate %41 Binding 0
OpDecorate %41 NonWritable
OpDecorate %42 ArrayStride 4
OpMemberDecorate %43 0 Offset 0
OpDecorate %43 Block
OpDecorate %46 DescriptorSet 0
OpDecorate %46 Binding 0
OpDecorate %46 NonWritable
OpDecorate %46 Coherent
OpDecorate %47 ArrayStride 8
OpMemberDecorate %48 0 Offset 0
OpDecorate %48 Block
OpDecorate %51 DescriptorSet 0
OpDecorate %51 Binding 0
OpDecorate %51 NonWritable
OpDecorate %51 Coherent
OpDecorate %52 ArrayStride 4
OpMemberDecorate %53 0 Offset 0
OpDecorate %53 Block
OpDecorate %56 DescriptorSet 0
OpDecorate %56 Binding 0
OpDecorate %56 Coherent
OpDecorate %57 ArrayStride 16
OpMemberDecorate %58 0 Offset 0
OpDecorate %58 Block
OpDecorate %61 DescriptorSet 0
OpDecorate %61 Binding 0
OpDecorate %61 NonWritable
OpDecorate %61 Coherent
OpDecorate %63 Flat
OpDecorate %63 Location 0
OpDecorate %67 Flat
OpDecorate %67 Location 1
OpDecorate %71 Location 0
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
%16 = OpTypeRuntimeArray %6
%17 = OpTypeStruct %16
%18 = OpTypeRuntimeArray %17
%19 = OpTypePointer StorageBuffer %18
%20 = OpVariable %19 StorageBuffer
%21 = OpTypeVector %5 4
%22 = OpTypeRuntimeArray %21
%23 = OpTypeStruct %22
%24 = OpTypeRuntimeArray %23
%25 = OpTypePointer StorageBuffer %24
%26 = OpVariable %25 StorageBuffer
%27 = OpTypeRuntimeArray %5
%28 = OpTypeStruct %27
%29 = OpTypeRuntimeArray %28
%30 = OpTypePointer StorageBuffer %29
%31 = OpVariable %30 StorageBuffer
%32 = OpTypeRuntimeArray %6
%33 = OpTypeStruct %32
%34 = OpTypeRuntimeArray %33
%35 = OpTypePointer StorageBuffer %34
%36 = OpVariable %35 StorageBuffer
%37 = OpTypeRuntimeArray %21
%38 = OpTypeStruct %37
%39 = OpTypeRuntimeArray %38
%40 = OpTypePointer StorageBuffer %39
%41 = OpVariable %40 StorageBuffer
%42 = OpTypeRuntimeArray %5
%43 = OpTypeStruct %42
%44 = OpTypeRuntimeArray %43
%45 = OpTypePointer StorageBuffer %44
%46 = OpVariable %45 StorageBuffer
%47 = OpTypeRuntimeArray %6
%48 = OpTypeStruct %47
%49 = OpTypeRuntimeArray %48
%50 = OpTypePointer StorageBuffer %49
%51 = OpVariable %50 StorageBuffer
%52 = OpTypeRuntimeArray %5
%53 = OpTypeStruct %52
%54 = OpTypeRuntimeArray %53
%55 = OpTypePointer StorageBuffer %54
%56 = OpVariable %55 StorageBuffer
%57 = OpTypeRuntimeArray %21
%58 = OpTypeStruct %57
%59 = OpTypeRuntimeArray %58
%60 = OpTypePointer StorageBuffer %59
%61 = OpVariable %60 StorageBuffer
%62 = OpTypePointer Input %5
%63 = OpVariable %62 Input
%64 = OpTypeInt 32 1
%65 = OpTypeVector %64 4
%66 = OpTypePointer Input %65
%67 = OpVariable %66 Input
%68 = OpTypeFloat 32
%69 = OpTypeVector %68 4
%70 = OpTypePointer Output %69
%71 = OpVariable %70 Output
%72 = OpTypePointer Input %64
%74 = OpConstant %5 0
%78 = OpConstant %5 1
%82 = OpConstant %5 2
%86 = OpConstant %5 3
%90 = OpTypePointer StorageBuffer %12
%93 = OpTypePointer StorageBuffer %6
%97 = OpConstantComposite %6 %82 %82
%99 = OpTypePointer StorageBuffer %17
%105 = OpConstantComposite %6 %86 %86
%113 = OpTypePointer StorageBuffer %23
%119 = OpConstant %5 4
%120 = OpConstantComposite %6 %119 %119
%122 = OpTypePointer StorageBuffer %28
%129 = OpConstant %5 5
%130 = OpTypePointer StorageBuffer %33
%137 = OpConstant %5 6
%144 = OpConstant %5 7
%145 = OpTypePointer StorageBuffer %38
%152 = OpConstant %5 8
%153 = OpTypePointer StorageBuffer %43
%160 = OpConstant %5 9
%161 = OpTypePointer StorageBuffer %48
%168 = OpConstant %5 10
%169 = OpTypePointer StorageBuffer %53
%176 = OpConstant %5 11
%177 = OpTypePointer StorageBuffer %58
%186 = OpTypeBool
%189 = OpConstant %5 1073741820
%190 = OpTypePointer StorageBuffer %5
%199 = OpConstant %5 536870911
%202 = OpTypeVector %68 2
%221 = OpTypeVector %5 3
%223 = OpTypeVector %68 3
%235 = OpConstant %5 268435455
%236 = OpTypePointer StorageBuffer %21
%370 = OpConstant %68 20
%381 = OpConstant %68 30
%390 = OpTypePointer Output %68
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %395
%395 = OpLabel
%73 = OpAccessChain %72 %67 %74
%75 = OpLoad %64 %73
%76 = OpBitcast %5 %75
%77 = OpAccessChain %72 %67 %78
%79 = OpLoad %64 %77
%80 = OpBitcast %5 %79
%81 = OpAccessChain %72 %67 %82
%83 = OpLoad %64 %81
%84 = OpBitcast %5 %83
%85 = OpAccessChain %72 %67 %86
%87 = OpLoad %64 %85
%88 = OpBitcast %5 %87
%89 = OpLoad %5 %63
%91 = OpAccessChain %90 %15 %89
%92 = OpGroupNonUniformBroadcastFirst %5 %86 %89
%94 = OpAccessChain %93 %10 %74 %92
%95 = OpLoad %6 %94
%96 = OpShiftRightLogical %6 %95 %97
%98 = OpIAdd %5 %89 %78
%100 = OpAccessChain %99 %20 %98
%101 = OpGroupNonUniformBroadcastFirst %5 %86 %98
%102 = OpAccessChain %93 %10 %74 %101
%103 = OpLoad %6 %102
%104 = OpShiftRightLogical %6 %103 %105
%106 = OpIAdd %5 %89 %82
%107 = OpAccessChain %90 %15 %106
%108 = OpGroupNonUniformBroadcastFirst %5 %86 %106
%109 = OpAccessChain %93 %10 %74 %108
%110 = OpLoad %6 %109
%111 = OpShiftRightLogical %6 %110 %97
%112 = OpIAdd %5 %89 %86
%114 = OpAccessChain %113 %26 %112
%115 = OpGroupNonUniformBroadcastFirst %5 %86 %112
%116 = OpAccessChain %93 %10 %74 %115
%117 = OpLoad %6 %116
%118 = OpShiftRightLogical %6 %117 %120
%121 = OpIAdd %5 %89 %119
%123 = OpAccessChain %122 %31 %121
%124 = OpGroupNonUniformBroadcastFirst %5 %86 %121
%125 = OpAccessChain %93 %10 %74 %124
%126 = OpLoad %6 %125
%127 = OpShiftRightLogical %6 %126 %97
%128 = OpIAdd %5 %89 %129
%131 = OpAccessChain %130 %36 %128
%132 = OpGroupNonUniformBroadcastFirst %5 %86 %128
%133 = OpAccessChain %93 %10 %74 %132
%134 = OpLoad %6 %133
%135 = OpShiftRightLogical %6 %134 %105
%136 = OpIAdd %5 %89 %137
%138 = OpAccessChain %122 %31 %136
%139 = OpGroupNonUniformBroadcastFirst %5 %86 %136
%140 = OpAccessChain %93 %10 %74 %139
%141 = OpLoad %6 %140
%142 = OpShiftRightLogical %6 %141 %97
%143 = OpIAdd %5 %89 %144
%146 = OpAccessChain %145 %41 %143
%147 = OpGroupNonUniformBroadcastFirst %5 %86 %143
%148 = OpAccessChain %93 %10 %74 %147
%149 = OpLoad %6 %148
%150 = OpShiftRightLogical %6 %149 %120
%151 = OpIAdd %5 %89 %152
%154 = OpAccessChain %153 %46 %151
%155 = OpGroupNonUniformBroadcastFirst %5 %86 %151
%156 = OpAccessChain %93 %10 %74 %155
%157 = OpLoad %6 %156
%158 = OpShiftRightLogical %6 %157 %97
%159 = OpIAdd %5 %89 %160
%162 = OpAccessChain %161 %51 %159
%163 = OpGroupNonUniformBroadcastFirst %5 %86 %159
%164 = OpAccessChain %93 %10 %74 %163
%165 = OpLoad %6 %164
%166 = OpShiftRightLogical %6 %165 %105
%167 = OpIAdd %5 %89 %168
%170 = OpAccessChain %169 %56 %167
%171 = OpGroupNonUniformBroadcastFirst %5 %86 %167
%172 = OpAccessChain %93 %10 %74 %171
%173 = OpLoad %6 %172
%174 = OpShiftRightLogical %6 %173 %97
%175 = OpIAdd %5 %89 %176
%178 = OpAccessChain %177 %61 %175
%179 = OpGroupNonUniformBroadcastFirst %5 %86 %175
%180 = OpAccessChain %93 %10 %74 %179
%181 = OpLoad %6 %180
%182 = OpShiftRightLogical %6 %181 %120
%183 = OpCompositeExtract %5 %96 0
%184 = OpCompositeExtract %5 %96 1
%185 = OpIAdd %5 %76 %183
%187 = OpULessThan %186 %76 %184
%188 = OpSelect %5 %187 %185 %189
%191 = OpAccessChain %190 %91 %74 %188
%192 = OpLoad %5 %191
%193 = OpBitcast %68 %192
%194 = OpCompositeExtract %5 %104 0
%195 = OpCompositeExtract %5 %104 1
%196 = OpIAdd %5 %80 %194
%197 = OpULessThan %186 %80 %195
%198 = OpSelect %5 %197 %196 %199
%200 = OpAccessChain %93 %100 %74 %198
%201 = OpLoad %6 %200
%203 = OpBitcast %202 %201
%204 = OpCompositeExtract %68 %203 0
%205 = OpCompositeExtract %68 %203 1
%206 = OpFAdd %68 %204 %193
%207 = OpIMul %5 %84 %86
%208 = OpCompositeExtract %5 %111 0
%209 = OpCompositeExtract %5 %111 1
%210 = OpIAdd %5 %207 %208
%211 = OpULessThan %186 %207 %209
%212 = OpSelect %5 %211 %210 %189
%213 = OpAccessChain %190 %107 %74 %212
%214 = OpLoad %5 %213
%216 = OpIAdd %5 %212 %78
%215 = OpAccessChain %190 %107 %74 %216
%217 = OpLoad %5 %215
%219 = OpIAdd %5 %212 %82
%218 = OpAccessChain %190 %107 %74 %219
%220 = OpLoad %5 %218
%222 = OpCompositeConstruct %221 %214 %217 %220
%224 = OpBitcast %223 %222
%225 = OpCompositeExtract %68 %224 0
%226 = OpCompositeExtract %68 %224 1
%227 = OpCompositeExtract %68 %224 2
%228 = OpFAdd %68 %206 %225
%229 = OpFAdd %68 %226 %205
%230 = OpCompositeExtract %5 %118 0
%231 = OpCompositeExtract %5 %118 1
%232 = OpIAdd %5 %88 %230
%233 = OpULessThan %186 %88 %231
%234 = OpSelect %5 %233 %232 %235
%237 = OpAccessChain %236 %114 %74 %234
%238 = OpLoad %21 %237
%239 = OpBitcast %69 %238
%240 = OpCompositeExtract %68 %239 0
%241 = OpCompositeExtract %68 %239 1
%242 = OpCompositeExtract %68 %239 2
%243 = OpCompositeExtract %68 %239 3
%244 = OpFAdd %68 %228 %240
%245 = OpFAdd %68 %229 %241
%246 = OpFAdd %68 %242 %227
%247 = OpCompositeExtract %5 %127 0
%248 = OpCompositeExtract %5 %127 1
%249 = OpIAdd %5 %76 %247
%250 = OpULessThan %186 %76 %248
%251 = OpSelect %5 %250 %249 %189
%252 = OpAccessChain %190 %123 %74 %251
%253 = OpLoad %5 %252
%254 = OpBitcast %68 %253
%255 = OpFAdd %68 %244 %254
%256 = OpCompositeExtract %5 %135 0
%257 = OpCompositeExtract %5 %135 1
%258 = OpIAdd %5 %80 %256
%259 = OpULessThan %186 %80 %257
%260 = OpSelect %5 %259 %258 %199
%261 = OpAccessChain %93 %131 %74 %260
%262 = OpLoad %6 %261
%263 = OpBitcast %202 %262
%264 = OpCompositeExtract %68 %263 0
%265 = OpCompositeExtract %68 %263 1
%266 = OpFAdd %68 %255 %264
%267 = OpFAdd %68 %245 %265
%268 = OpIMul %5 %84 %86
%269 = OpCompositeExtract %5 %142 0
%270 = OpCompositeExtract %5 %142 1
%271 = OpIAdd %5 %268 %269
%272 = OpULessThan %186 %268 %270
%273 = OpSelect %5 %272 %271 %189
%274 = OpAccessChain %190 %138 %74 %273
%275 = OpLoad %5 %274
%277 = OpIAdd %5 %273 %78
%276 = OpAccessChain %190 %138 %74 %277
%278 = OpLoad %5 %276
%280 = OpIAdd %5 %273 %82
%279 = OpAccessChain %190 %138 %74 %280
%281 = OpLoad %5 %279
%282 = OpCompositeConstruct %221 %275 %278 %281
%283 = OpBitcast %223 %282
%284 = OpCompositeExtract %68 %283 0
%285 = OpCompositeExtract %68 %283 1
%286 = OpCompositeExtract %68 %283 2
%287 = OpFAdd %68 %266 %284
%288 = OpFAdd %68 %267 %285
%289 = OpFAdd %68 %246 %286
%290 = OpCompositeExtract %5 %150 0
%291 = OpCompositeExtract %5 %150 1
%292 = OpIAdd %5 %88 %290
%293 = OpULessThan %186 %88 %291
%294 = OpSelect %5 %293 %292 %235
%295 = OpAccessChain %236 %146 %74 %294
%296 = OpLoad %21 %295
%297 = OpBitcast %69 %296
%298 = OpCompositeExtract %68 %297 0
%299 = OpCompositeExtract %68 %297 1
%300 = OpCompositeExtract %68 %297 2
%301 = OpCompositeExtract %68 %297 3
%302 = OpFAdd %68 %287 %298
%303 = OpFAdd %68 %288 %299
%304 = OpFAdd %68 %289 %300
%305 = OpFAdd %68 %301 %243
%306 = OpCompositeExtract %5 %158 0
%307 = OpCompositeExtract %5 %158 1
%308 = OpIAdd %5 %76 %306
%309 = OpULessThan %186 %76 %307
%310 = OpSelect %5 %309 %308 %189
%311 = OpAccessChain %190 %154 %74 %310
%312 = OpLoad %5 %311
%313 = OpBitcast %68 %312
%314 = OpFAdd %68 %302 %313
%315 = OpCompositeExtract %5 %166 0
%316 = OpCompositeExtract %5 %166 1
%317 = OpIAdd %5 %80 %315
%318 = OpULessThan %186 %80 %316
%319 = OpSelect %5 %318 %317 %199
%320 = OpAccessChain %93 %162 %74 %319
%321 = OpLoad %6 %320
%322 = OpBitcast %202 %321
%323 = OpCompositeExtract %68 %322 0
%324 = OpCompositeExtract %68 %322 1
%325 = OpFAdd %68 %314 %323
%326 = OpFAdd %68 %303 %324
%327 = OpIMul %5 %84 %86
%328 = OpCompositeExtract %5 %174 0
%329 = OpCompositeExtract %5 %174 1
%330 = OpIAdd %5 %327 %328
%331 = OpULessThan %186 %327 %329
%332 = OpSelect %5 %331 %330 %189
%333 = OpAccessChain %190 %170 %74 %332
%334 = OpLoad %5 %333
%336 = OpIAdd %5 %332 %78
%335 = OpAccessChain %190 %170 %74 %336
%337 = OpLoad %5 %335
%339 = OpIAdd %5 %332 %82
%338 = OpAccessChain %190 %170 %74 %339
%340 = OpLoad %5 %338
%341 = OpCompositeConstruct %221 %334 %337 %340
%342 = OpBitcast %223 %341
%343 = OpCompositeExtract %68 %342 0
%344 = OpCompositeExtract %68 %342 1
%345 = OpCompositeExtract %68 %342 2
%346 = OpFAdd %68 %325 %343
%347 = OpFAdd %68 %326 %344
%348 = OpFAdd %68 %304 %345
%349 = OpCompositeExtract %5 %182 0
%350 = OpCompositeExtract %5 %182 1
%351 = OpIAdd %5 %88 %349
%352 = OpULessThan %186 %88 %350
%353 = OpSelect %5 %352 %351 %235
%354 = OpAccessChain %236 %178 %74 %353
%355 = OpLoad %21 %354
%356 = OpBitcast %69 %355
%357 = OpCompositeExtract %68 %356 0
%358 = OpCompositeExtract %68 %356 1
%359 = OpCompositeExtract %68 %356 2
%360 = OpCompositeExtract %68 %356 3
%361 = OpFAdd %68 %346 %357
%362 = OpFAdd %68 %347 %358
%363 = OpFAdd %68 %348 %359
%364 = OpFAdd %68 %305 %360
%365 = OpCompositeExtract %5 %135 0
%366 = OpCompositeExtract %5 %135 1
%367 = OpIAdd %5 %76 %365
%368 = OpULessThan %186 %76 %366
%369 = OpSelect %5 %368 %367 %199
%371 = OpBitcast %5 %370
%372 = OpBitcast %5 %370
%373 = OpCompositeConstruct %6 %371 %372
%374 = OpAccessChain %93 %131 %74 %369
OpStore %374 %373
%375 = OpIMul %5 %80 %86
%376 = OpCompositeExtract %5 %174 0
%377 = OpCompositeExtract %5 %174 1
%378 = OpIAdd %5 %375 %376
%379 = OpULessThan %186 %375 %377
%380 = OpSelect %5 %379 %378 %189
%382 = OpBitcast %5 %381
%383 = OpBitcast %5 %381
%384 = OpBitcast %5 %381
%385 = OpAccessChain %190 %170 %74 %380
OpStore %385 %382
%387 = OpIAdd %5 %380 %78
%386 = OpAccessChain %190 %170 %74 %387
OpStore %386 %383
%389 = OpIAdd %5 %380 %82
%388 = OpAccessChain %190 %170 %74 %389
OpStore %388 %384
%391 = OpAccessChain %390 %71 %74
OpStore %391 %361
%392 = OpAccessChain %390 %71 %78
OpStore %392 %362
%393 = OpAccessChain %390 %71 %82
OpStore %393 %363
%394 = OpAccessChain %390 %71 %86
OpStore %394 %364
OpReturn
OpFunctionEnd
#endif
