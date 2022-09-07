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

layout(set = 0, binding = 0, std430) buffer _28_31
{
    uint _m0[];
} _31[];

layout(set = 0, binding = 0, std430) buffer _33_36
{
    uvec2 _m0[];
} _36[];

layout(set = 0, binding = 0, std430) buffer _38_41
{
    uvec4 _m0[];
} _41[];

layout(set = 0, binding = 0, std430) coherent buffer _43_46
{
    uint _m0[];
} _46[];

layout(set = 0, binding = 0, std430) coherent buffer _48_51
{
    uvec2 _m0[];
} _51[];

layout(set = 0, binding = 0, std430) coherent buffer _53_56
{
    uvec4 _m0[];
} _56[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _71 = uint(UV.x);
    uint _75 = uint(UV.y);
    uint _79 = uint(UV.z);
    uint _83 = uint(UV.w);
    uvec2 _91 = _10._m0[subgroupBroadcastFirst(INDEX)] >> uvec2(2u);
    uint _93 = INDEX + 1u;
    uvec2 _99 = _10._m0[subgroupBroadcastFirst(_93)] >> uvec2(3u);
    uint _101 = INDEX + 2u;
    uvec2 _106 = _10._m0[subgroupBroadcastFirst(_101)] >> uvec2(2u);
    uint _107 = INDEX + 3u;
    uvec2 _113 = _10._m0[subgroupBroadcastFirst(_107)] >> uvec2(4u);
    uint _116 = INDEX + 4u;
    uvec2 _122 = _10._m0[subgroupBroadcastFirst(_116)] >> uvec2(2u);
    uint _123 = INDEX + 5u;
    uvec2 _130 = _10._m0[subgroupBroadcastFirst(_123)] >> uvec2(3u);
    uint _131 = INDEX + 6u;
    uvec2 _137 = _10._m0[subgroupBroadcastFirst(_131)] >> uvec2(2u);
    uint _138 = INDEX + 7u;
    uvec2 _145 = _10._m0[subgroupBroadcastFirst(_138)] >> uvec2(4u);
    uint _146 = INDEX + 8u;
    uvec2 _153 = _10._m0[subgroupBroadcastFirst(_146)] >> uvec2(2u);
    uint _154 = INDEX + 9u;
    uvec2 _161 = _10._m0[subgroupBroadcastFirst(_154)] >> uvec2(3u);
    uint _162 = INDEX + 10u;
    uvec2 _168 = _10._m0[subgroupBroadcastFirst(_162)] >> uvec2(2u);
    uint _169 = INDEX + 11u;
    uvec2 _176 = _10._m0[subgroupBroadcastFirst(_169)] >> uvec2(4u);
    vec2 _197 = uintBitsToFloat(_20[_93]._m0[(_75 < _99.y) ? (_75 + _99.x) : 536870911u]);
    uint _201 = _79 * 3u;
    uint _206 = (_201 < _106.y) ? (_201 + _106.x) : 1073741820u;
    vec3 _218 = uintBitsToFloat(uvec3(_15[_101]._m0[_206], _15[_101]._m0[_206 + 1u], _15[_101]._m0[_206 + 2u]));
    vec4 _233 = uintBitsToFloat(_26[_107]._m0[(_83 < _113.y) ? (_83 + _113.x) : 268435455u]);
    uint _247 = _31[_116]._m0[(_71 < _122.y) ? (_71 + _122.x) : 1073741820u];
    vec2 _257 = uintBitsToFloat(_36[_123]._m0[(_75 < _130.y) ? (_75 + _130.x) : 536870911u]);
    uint _262 = _79 * 3u;
    uint _267 = (_262 < _137.y) ? (_262 + _137.x) : 1073741820u;
    vec3 _277 = uintBitsToFloat(uvec3(_31[_131]._m0[_267], _31[_131]._m0[_267 + 1u], _31[_131]._m0[_267 + 2u]));
    uvec4 _290 = _41[_138]._m0[(_83 < _145.y) ? (_83 + _145.x) : 268435455u];
    vec4 _291 = uintBitsToFloat(_290);
    uint _306 = _46[_146]._m0[(_71 < _153.y) ? (_71 + _153.x) : 1073741820u];
    uvec2 _315 = _51[_154]._m0[(_75 < _161.y) ? (_75 + _161.x) : 536870911u];
    vec2 _316 = uintBitsToFloat(_315);
    uint _321 = _79 * 3u;
    uint _326 = (_321 < _168.y) ? (_321 + _168.x) : 1073741820u;
    uint _328 = _46[_162]._m0[_326];
    uint _331 = _46[_162]._m0[_326 + 1u];
    uint _334 = _46[_162]._m0[_326 + 2u];
    vec3 _336 = uintBitsToFloat(uvec3(_328, _331, _334));
    uvec4 _349 = _56[_169]._m0[(_83 < _176.y) ? (_83 + _176.x) : 268435455u];
    vec4 _350 = uintBitsToFloat(_349);
    _36[_123]._m0[(_71 < _130.y) ? (_71 + _130.x) : 536870911u] = uvec2(floatBitsToUint(20.0), floatBitsToUint(20.0));
    uint _369 = _75 * 3u;
    uint _374 = (_369 < _168.y) ? (_369 + _168.x) : 1073741820u;
    _46[_162]._m0[_374] = floatBitsToUint(30.0);
    _46[_162]._m0[_374 + 1u] = floatBitsToUint(30.0);
    _46[_162]._m0[_374 + 2u] = floatBitsToUint(30.0);
    SV_Target.x = ((((((((((_197.x + uintBitsToFloat(_15[INDEX]._m0[(_71 < _91.y) ? (_71 + _91.x) : 1073741820u])) + _218.x) + _233.x) + uintBitsToFloat(_247)) + _257.x) + _277.x) + _291.x) + uintBitsToFloat(_306)) + _316.x) + _336.x) + _350.x;
    SV_Target.y = (((((((_218.y + _197.y) + _233.y) + _257.y) + _277.y) + _291.y) + _316.y) + _336.y) + _350.y;
    SV_Target.z = ((((_233.z + _218.z) + _277.z) + _291.z) + _336.z) + _350.z;
    SV_Target.w = (_291.w + _233.w) + _350.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 391
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformBallot
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %58 %62 %66
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
OpName %58 "INDEX"
OpName %62 "UV"
OpName %66 "SV_Target"
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
OpDecorate %42 ArrayStride 4
OpMemberDecorate %43 0 Offset 0
OpDecorate %43 Block
OpDecorate %46 DescriptorSet 0
OpDecorate %46 Binding 0
OpDecorate %46 Coherent
OpDecorate %47 ArrayStride 8
OpMemberDecorate %48 0 Offset 0
OpDecorate %48 Block
OpDecorate %51 DescriptorSet 0
OpDecorate %51 Binding 0
OpDecorate %51 Coherent
OpDecorate %52 ArrayStride 16
OpMemberDecorate %53 0 Offset 0
OpDecorate %53 Block
OpDecorate %56 DescriptorSet 0
OpDecorate %56 Binding 0
OpDecorate %56 Coherent
OpDecorate %58 Flat
OpDecorate %58 Location 0
OpDecorate %62 Flat
OpDecorate %62 Location 1
OpDecorate %66 Location 0
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
%52 = OpTypeRuntimeArray %21
%53 = OpTypeStruct %52
%54 = OpTypeRuntimeArray %53
%55 = OpTypePointer StorageBuffer %54
%56 = OpVariable %55 StorageBuffer
%57 = OpTypePointer Input %5
%58 = OpVariable %57 Input
%59 = OpTypeInt 32 1
%60 = OpTypeVector %59 4
%61 = OpTypePointer Input %60
%62 = OpVariable %61 Input
%63 = OpTypeFloat 32
%64 = OpTypeVector %63 4
%65 = OpTypePointer Output %64
%66 = OpVariable %65 Output
%67 = OpTypePointer Input %59
%69 = OpConstant %5 0
%73 = OpConstant %5 1
%77 = OpConstant %5 2
%81 = OpConstant %5 3
%85 = OpTypePointer StorageBuffer %12
%88 = OpTypePointer StorageBuffer %6
%92 = OpConstantComposite %6 %77 %77
%94 = OpTypePointer StorageBuffer %17
%100 = OpConstantComposite %6 %81 %81
%108 = OpTypePointer StorageBuffer %23
%114 = OpConstant %5 4
%115 = OpConstantComposite %6 %114 %114
%117 = OpTypePointer StorageBuffer %28
%124 = OpConstant %5 5
%125 = OpTypePointer StorageBuffer %33
%132 = OpConstant %5 6
%139 = OpConstant %5 7
%140 = OpTypePointer StorageBuffer %38
%147 = OpConstant %5 8
%148 = OpTypePointer StorageBuffer %43
%155 = OpConstant %5 9
%156 = OpTypePointer StorageBuffer %48
%163 = OpConstant %5 10
%170 = OpConstant %5 11
%171 = OpTypePointer StorageBuffer %53
%180 = OpTypeBool
%183 = OpConstant %5 1073741820
%184 = OpTypePointer StorageBuffer %5
%193 = OpConstant %5 536870911
%196 = OpTypeVector %63 2
%215 = OpTypeVector %5 3
%217 = OpTypeVector %63 3
%229 = OpConstant %5 268435455
%230 = OpTypePointer StorageBuffer %21
%364 = OpConstant %63 20
%375 = OpConstant %63 30
%384 = OpTypePointer Output %63
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %389
%389 = OpLabel
%68 = OpAccessChain %67 %62 %69
%70 = OpLoad %59 %68
%71 = OpBitcast %5 %70
%72 = OpAccessChain %67 %62 %73
%74 = OpLoad %59 %72
%75 = OpBitcast %5 %74
%76 = OpAccessChain %67 %62 %77
%78 = OpLoad %59 %76
%79 = OpBitcast %5 %78
%80 = OpAccessChain %67 %62 %81
%82 = OpLoad %59 %80
%83 = OpBitcast %5 %82
%84 = OpLoad %5 %58
%86 = OpAccessChain %85 %15 %84
%87 = OpGroupNonUniformBroadcastFirst %5 %81 %84
%89 = OpAccessChain %88 %10 %69 %87
%90 = OpLoad %6 %89
%91 = OpShiftRightLogical %6 %90 %92
%93 = OpIAdd %5 %84 %73
%95 = OpAccessChain %94 %20 %93
%96 = OpGroupNonUniformBroadcastFirst %5 %81 %93
%97 = OpAccessChain %88 %10 %69 %96
%98 = OpLoad %6 %97
%99 = OpShiftRightLogical %6 %98 %100
%101 = OpIAdd %5 %84 %77
%102 = OpAccessChain %85 %15 %101
%103 = OpGroupNonUniformBroadcastFirst %5 %81 %101
%104 = OpAccessChain %88 %10 %69 %103
%105 = OpLoad %6 %104
%106 = OpShiftRightLogical %6 %105 %92
%107 = OpIAdd %5 %84 %81
%109 = OpAccessChain %108 %26 %107
%110 = OpGroupNonUniformBroadcastFirst %5 %81 %107
%111 = OpAccessChain %88 %10 %69 %110
%112 = OpLoad %6 %111
%113 = OpShiftRightLogical %6 %112 %115
%116 = OpIAdd %5 %84 %114
%118 = OpAccessChain %117 %31 %116
%119 = OpGroupNonUniformBroadcastFirst %5 %81 %116
%120 = OpAccessChain %88 %10 %69 %119
%121 = OpLoad %6 %120
%122 = OpShiftRightLogical %6 %121 %92
%123 = OpIAdd %5 %84 %124
%126 = OpAccessChain %125 %36 %123
%127 = OpGroupNonUniformBroadcastFirst %5 %81 %123
%128 = OpAccessChain %88 %10 %69 %127
%129 = OpLoad %6 %128
%130 = OpShiftRightLogical %6 %129 %100
%131 = OpIAdd %5 %84 %132
%133 = OpAccessChain %117 %31 %131
%134 = OpGroupNonUniformBroadcastFirst %5 %81 %131
%135 = OpAccessChain %88 %10 %69 %134
%136 = OpLoad %6 %135
%137 = OpShiftRightLogical %6 %136 %92
%138 = OpIAdd %5 %84 %139
%141 = OpAccessChain %140 %41 %138
%142 = OpGroupNonUniformBroadcastFirst %5 %81 %138
%143 = OpAccessChain %88 %10 %69 %142
%144 = OpLoad %6 %143
%145 = OpShiftRightLogical %6 %144 %115
%146 = OpIAdd %5 %84 %147
%149 = OpAccessChain %148 %46 %146
%150 = OpGroupNonUniformBroadcastFirst %5 %81 %146
%151 = OpAccessChain %88 %10 %69 %150
%152 = OpLoad %6 %151
%153 = OpShiftRightLogical %6 %152 %92
%154 = OpIAdd %5 %84 %155
%157 = OpAccessChain %156 %51 %154
%158 = OpGroupNonUniformBroadcastFirst %5 %81 %154
%159 = OpAccessChain %88 %10 %69 %158
%160 = OpLoad %6 %159
%161 = OpShiftRightLogical %6 %160 %100
%162 = OpIAdd %5 %84 %163
%164 = OpAccessChain %148 %46 %162
%165 = OpGroupNonUniformBroadcastFirst %5 %81 %162
%166 = OpAccessChain %88 %10 %69 %165
%167 = OpLoad %6 %166
%168 = OpShiftRightLogical %6 %167 %92
%169 = OpIAdd %5 %84 %170
%172 = OpAccessChain %171 %56 %169
%173 = OpGroupNonUniformBroadcastFirst %5 %81 %169
%174 = OpAccessChain %88 %10 %69 %173
%175 = OpLoad %6 %174
%176 = OpShiftRightLogical %6 %175 %115
%177 = OpCompositeExtract %5 %91 0
%178 = OpCompositeExtract %5 %91 1
%179 = OpIAdd %5 %71 %177
%181 = OpULessThan %180 %71 %178
%182 = OpSelect %5 %181 %179 %183
%185 = OpAccessChain %184 %86 %69 %182
%186 = OpLoad %5 %185
%187 = OpBitcast %63 %186
%188 = OpCompositeExtract %5 %99 0
%189 = OpCompositeExtract %5 %99 1
%190 = OpIAdd %5 %75 %188
%191 = OpULessThan %180 %75 %189
%192 = OpSelect %5 %191 %190 %193
%194 = OpAccessChain %88 %95 %69 %192
%195 = OpLoad %6 %194
%197 = OpBitcast %196 %195
%198 = OpCompositeExtract %63 %197 0
%199 = OpCompositeExtract %63 %197 1
%200 = OpFAdd %63 %198 %187
%201 = OpIMul %5 %79 %81
%202 = OpCompositeExtract %5 %106 0
%203 = OpCompositeExtract %5 %106 1
%204 = OpIAdd %5 %201 %202
%205 = OpULessThan %180 %201 %203
%206 = OpSelect %5 %205 %204 %183
%207 = OpAccessChain %184 %102 %69 %206
%208 = OpLoad %5 %207
%210 = OpIAdd %5 %206 %73
%209 = OpAccessChain %184 %102 %69 %210
%211 = OpLoad %5 %209
%213 = OpIAdd %5 %206 %77
%212 = OpAccessChain %184 %102 %69 %213
%214 = OpLoad %5 %212
%216 = OpCompositeConstruct %215 %208 %211 %214
%218 = OpBitcast %217 %216
%219 = OpCompositeExtract %63 %218 0
%220 = OpCompositeExtract %63 %218 1
%221 = OpCompositeExtract %63 %218 2
%222 = OpFAdd %63 %200 %219
%223 = OpFAdd %63 %220 %199
%224 = OpCompositeExtract %5 %113 0
%225 = OpCompositeExtract %5 %113 1
%226 = OpIAdd %5 %83 %224
%227 = OpULessThan %180 %83 %225
%228 = OpSelect %5 %227 %226 %229
%231 = OpAccessChain %230 %109 %69 %228
%232 = OpLoad %21 %231
%233 = OpBitcast %64 %232
%234 = OpCompositeExtract %63 %233 0
%235 = OpCompositeExtract %63 %233 1
%236 = OpCompositeExtract %63 %233 2
%237 = OpCompositeExtract %63 %233 3
%238 = OpFAdd %63 %222 %234
%239 = OpFAdd %63 %223 %235
%240 = OpFAdd %63 %236 %221
%241 = OpCompositeExtract %5 %122 0
%242 = OpCompositeExtract %5 %122 1
%243 = OpIAdd %5 %71 %241
%244 = OpULessThan %180 %71 %242
%245 = OpSelect %5 %244 %243 %183
%246 = OpAccessChain %184 %118 %69 %245
%247 = OpLoad %5 %246
%248 = OpBitcast %63 %247
%249 = OpFAdd %63 %238 %248
%250 = OpCompositeExtract %5 %130 0
%251 = OpCompositeExtract %5 %130 1
%252 = OpIAdd %5 %75 %250
%253 = OpULessThan %180 %75 %251
%254 = OpSelect %5 %253 %252 %193
%255 = OpAccessChain %88 %126 %69 %254
%256 = OpLoad %6 %255
%257 = OpBitcast %196 %256
%258 = OpCompositeExtract %63 %257 0
%259 = OpCompositeExtract %63 %257 1
%260 = OpFAdd %63 %249 %258
%261 = OpFAdd %63 %239 %259
%262 = OpIMul %5 %79 %81
%263 = OpCompositeExtract %5 %137 0
%264 = OpCompositeExtract %5 %137 1
%265 = OpIAdd %5 %262 %263
%266 = OpULessThan %180 %262 %264
%267 = OpSelect %5 %266 %265 %183
%268 = OpAccessChain %184 %133 %69 %267
%269 = OpLoad %5 %268
%271 = OpIAdd %5 %267 %73
%270 = OpAccessChain %184 %133 %69 %271
%272 = OpLoad %5 %270
%274 = OpIAdd %5 %267 %77
%273 = OpAccessChain %184 %133 %69 %274
%275 = OpLoad %5 %273
%276 = OpCompositeConstruct %215 %269 %272 %275
%277 = OpBitcast %217 %276
%278 = OpCompositeExtract %63 %277 0
%279 = OpCompositeExtract %63 %277 1
%280 = OpCompositeExtract %63 %277 2
%281 = OpFAdd %63 %260 %278
%282 = OpFAdd %63 %261 %279
%283 = OpFAdd %63 %240 %280
%284 = OpCompositeExtract %5 %145 0
%285 = OpCompositeExtract %5 %145 1
%286 = OpIAdd %5 %83 %284
%287 = OpULessThan %180 %83 %285
%288 = OpSelect %5 %287 %286 %229
%289 = OpAccessChain %230 %141 %69 %288
%290 = OpLoad %21 %289
%291 = OpBitcast %64 %290
%292 = OpCompositeExtract %63 %291 0
%293 = OpCompositeExtract %63 %291 1
%294 = OpCompositeExtract %63 %291 2
%295 = OpCompositeExtract %63 %291 3
%296 = OpFAdd %63 %281 %292
%297 = OpFAdd %63 %282 %293
%298 = OpFAdd %63 %283 %294
%299 = OpFAdd %63 %295 %237
%300 = OpCompositeExtract %5 %153 0
%301 = OpCompositeExtract %5 %153 1
%302 = OpIAdd %5 %71 %300
%303 = OpULessThan %180 %71 %301
%304 = OpSelect %5 %303 %302 %183
%305 = OpAccessChain %184 %149 %69 %304
%306 = OpLoad %5 %305
%307 = OpBitcast %63 %306
%308 = OpFAdd %63 %296 %307
%309 = OpCompositeExtract %5 %161 0
%310 = OpCompositeExtract %5 %161 1
%311 = OpIAdd %5 %75 %309
%312 = OpULessThan %180 %75 %310
%313 = OpSelect %5 %312 %311 %193
%314 = OpAccessChain %88 %157 %69 %313
%315 = OpLoad %6 %314
%316 = OpBitcast %196 %315
%317 = OpCompositeExtract %63 %316 0
%318 = OpCompositeExtract %63 %316 1
%319 = OpFAdd %63 %308 %317
%320 = OpFAdd %63 %297 %318
%321 = OpIMul %5 %79 %81
%322 = OpCompositeExtract %5 %168 0
%323 = OpCompositeExtract %5 %168 1
%324 = OpIAdd %5 %321 %322
%325 = OpULessThan %180 %321 %323
%326 = OpSelect %5 %325 %324 %183
%327 = OpAccessChain %184 %164 %69 %326
%328 = OpLoad %5 %327
%330 = OpIAdd %5 %326 %73
%329 = OpAccessChain %184 %164 %69 %330
%331 = OpLoad %5 %329
%333 = OpIAdd %5 %326 %77
%332 = OpAccessChain %184 %164 %69 %333
%334 = OpLoad %5 %332
%335 = OpCompositeConstruct %215 %328 %331 %334
%336 = OpBitcast %217 %335
%337 = OpCompositeExtract %63 %336 0
%338 = OpCompositeExtract %63 %336 1
%339 = OpCompositeExtract %63 %336 2
%340 = OpFAdd %63 %319 %337
%341 = OpFAdd %63 %320 %338
%342 = OpFAdd %63 %298 %339
%343 = OpCompositeExtract %5 %176 0
%344 = OpCompositeExtract %5 %176 1
%345 = OpIAdd %5 %83 %343
%346 = OpULessThan %180 %83 %344
%347 = OpSelect %5 %346 %345 %229
%348 = OpAccessChain %230 %172 %69 %347
%349 = OpLoad %21 %348
%350 = OpBitcast %64 %349
%351 = OpCompositeExtract %63 %350 0
%352 = OpCompositeExtract %63 %350 1
%353 = OpCompositeExtract %63 %350 2
%354 = OpCompositeExtract %63 %350 3
%355 = OpFAdd %63 %340 %351
%356 = OpFAdd %63 %341 %352
%357 = OpFAdd %63 %342 %353
%358 = OpFAdd %63 %299 %354
%359 = OpCompositeExtract %5 %130 0
%360 = OpCompositeExtract %5 %130 1
%361 = OpIAdd %5 %71 %359
%362 = OpULessThan %180 %71 %360
%363 = OpSelect %5 %362 %361 %193
%365 = OpBitcast %5 %364
%366 = OpBitcast %5 %364
%367 = OpCompositeConstruct %6 %365 %366
%368 = OpAccessChain %88 %126 %69 %363
OpStore %368 %367
%369 = OpIMul %5 %75 %81
%370 = OpCompositeExtract %5 %168 0
%371 = OpCompositeExtract %5 %168 1
%372 = OpIAdd %5 %369 %370
%373 = OpULessThan %180 %369 %371
%374 = OpSelect %5 %373 %372 %183
%376 = OpBitcast %5 %375
%377 = OpBitcast %5 %375
%378 = OpBitcast %5 %375
%379 = OpAccessChain %184 %164 %69 %374
OpStore %379 %376
%381 = OpIAdd %5 %374 %73
%380 = OpAccessChain %184 %164 %69 %381
OpStore %380 %377
%383 = OpIAdd %5 %374 %77
%382 = OpAccessChain %184 %164 %69 %383
OpStore %382 %378
%385 = OpAccessChain %384 %66 %69
OpStore %385 %355
%386 = OpAccessChain %384 %66 %73
OpStore %386 %356
%387 = OpAccessChain %384 %66 %77
OpStore %387 %357
%388 = OpAccessChain %384 %66 %81
OpStore %388 %358
OpReturn
OpFunctionEnd
#endif
