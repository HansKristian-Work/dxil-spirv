#version 460
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#extension GL_EXT_shader_16bit_storage : require
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_KHR_shader_subgroup_ballot : require

layout(set = 15, binding = 0, std430) restrict readonly buffer SSBO_Offsets
{
    uvec2 _m0[];
} _13;

layout(set = 1, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _18[];

layout(set = 1, binding = 0, std430) restrict readonly buffer _21_24
{
    uint16_t _m0[];
} _24[];

layout(set = 1, binding = 0, std430) restrict readonly buffer _26_29
{
    uint _m0[];
} _29[];

layout(set = 4, binding = 0, std430) buffer _31_34
{
    uint _m0[];
} _34[];

layout(set = 4, binding = 0, std430) buffer _36_39
{
    uint16_t _m0[];
} _39[];

layout(set = 4, binding = 0, std430) writeonly readonly buffer _41_44
{
    uint _m0[];
} _44[];

layout(set = 4, binding = 0, std430) writeonly readonly buffer _46_49
{
    uint _m0[];
} _49[];

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

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

uint _200;

void main()
{
    uint _64 = uint(UV.x);
    uint _72 = uint(UV.z);
    uvec2 _90 = _13._m0[subgroupBroadcastFirst(registers._m1)] >> uvec2(2u);
    uint _112 = uint(UV.y) * 2u;
    uvec2 _113 = _13._m0[subgroupBroadcastFirst(registers._m1)] >> uvec2(1u);
    uint _119 = (_112 < _113.y) ? (_112 + _113.x) : 2147483644u;
    f16vec2 _131 = uint16BitsToFloat16(u16vec2(_24[registers._m1]._m0[_119], _24[registers._m1]._m0[_119 + 1u]));
    uint _146 = registers._m4 + 2u;
    uvec2 _150 = _13._m0[subgroupBroadcastFirst(_146)] >> uvec2(2u);
    uint _157 = _34[_146]._m0[(_72 < _150.y) ? (_72 + _150.x) : 1073741820u];
    uint _163 = registers._m4 + 2u;
    uint _171 = uint(UV.w) * 2u;
    uvec2 _172 = _13._m0[subgroupBroadcastFirst(registers._m4 + 2u)] >> uvec2(1u);
    uint _177 = (_171 < _172.y) ? (_171 + _172.x) : 2147483644u;
    uint16_t _179 = _39[_163]._m0[_177];
    uint16_t _182 = _39[_163]._m0[_177 + 1u];
    f16vec2 _184 = uint16BitsToFloat16(u16vec2(_179, _182));
    uint _196 = subgroupBroadcastFirst(registers._m1);
    uint _203 = (8u * 2u) + (_200 >> 1u);
    uvec2 _204 = _13._m0[_196] >> uvec2(1u);
    uint _209 = (_203 < _204.y) ? (_203 + _204.x) : 2147483644u;
    f16vec4 _224 = uint16BitsToFloat16(u16vec4(_24[registers._m1]._m0[_209], _24[registers._m1]._m0[_209 + 1u], _24[registers._m1]._m0[_209 + 2u], _24[registers._m1]._m0[_209 + 3u]));
    uint _239 = 16u + (_200 >> 2u);
    uvec2 _240 = _13._m0[_196] >> uvec2(2u);
    uint _245 = (_239 < _240.y) ? (_239 + _240.x) : 1073741820u;
    vec4 _259 = uintBitsToFloat(uvec4(_18[registers._m1]._m0[_245], _18[registers._m1]._m0[_245 + 1u], _18[registers._m1]._m0[_245 + 2u], _18[registers._m1]._m0[_245 + 3u]));
    uint _271 = registers._m4 + 2u;
    uint _275 = registers._m4 + 2u;
    uint _276 = subgroupBroadcastFirst(_275);
    uint _281 = (8u * 2u) + (_200 >> 1u);
    uvec2 _282 = _13._m0[_276] >> uvec2(1u);
    uint _287 = (_281 < _282.y) ? (_281 + _282.x) : 2147483644u;
    uint16_t _289 = _39[_271]._m0[_287];
    uint16_t _292 = _39[_271]._m0[_287 + 1u];
    uint16_t _295 = _39[_271]._m0[_287 + 2u];
    uint16_t _298 = _39[_271]._m0[_287 + 3u];
    f16vec4 _300 = uint16BitsToFloat16(u16vec4(_289, _292, _295, _298));
    float _309 = (((float(_184.y) + uintBitsToFloat(_18[registers._m1]._m0[(_64 < _90.y) ? (_64 + _90.x) : 1073741820u])) + float(_224.x)) + _259.x) + float(_300.x);
    float _310 = ((float(_224.y) + float(_131.x)) + _259.y) + float(_300.y);
    float _311 = (((uintBitsToFloat(_157) + float(_131.y)) + float(_224.z)) + _259.z) + float(_300.z);
    float _312 = ((float(_224.w) + float(_184.x)) + _259.w) + float(_300.w);
    uint _314 = 16u + (_200 >> 2u);
    uvec2 _315 = _13._m0[_276] >> uvec2(2u);
    uint _320 = (_314 < _315.y) ? (_314 + _315.x) : 1073741820u;
    _34[_275]._m0[_320] = floatBitsToUint(_309);
    _34[_275]._m0[_320 + 1u] = floatBitsToUint(_310);
    _34[_275]._m0[_320 + 2u] = floatBitsToUint(_311);
    _34[_275]._m0[_320 + 3u] = floatBitsToUint(_312);
    SV_Target.x = _309;
    SV_Target.y = _310;
    SV_Target.z = _311;
    SV_Target.w = _312;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 339
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability GroupNonUniformBallot
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %51 %55 %59
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %11 "SSBO_Offsets"
OpName %15 "SSBO"
OpName %21 "SSBO"
OpName %26 "SSBO"
OpName %31 "SSBO"
OpName %36 "SSBO"
OpName %41 "SSBO"
OpName %46 "SSBO"
OpName %51 "INDEX"
OpName %55 "UV"
OpName %59 "SV_Target"
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
OpDecorate %14 ArrayStride 4
OpMemberDecorate %15 0 Offset 0
OpDecorate %15 Block
OpDecorate %18 DescriptorSet 1
OpDecorate %18 Binding 0
OpDecorate %18 NonWritable
OpDecorate %18 Restrict
OpDecorate %20 ArrayStride 2
OpMemberDecorate %21 0 Offset 0
OpDecorate %21 Block
OpDecorate %24 DescriptorSet 1
OpDecorate %24 Binding 0
OpDecorate %24 NonWritable
OpDecorate %24 Restrict
OpDecorate %25 ArrayStride 4
OpMemberDecorate %26 0 Offset 0
OpDecorate %26 Block
OpDecorate %29 DescriptorSet 1
OpDecorate %29 Binding 0
OpDecorate %29 NonWritable
OpDecorate %29 Restrict
OpDecorate %30 ArrayStride 4
OpMemberDecorate %31 0 Offset 0
OpDecorate %31 Block
OpDecorate %34 DescriptorSet 4
OpDecorate %34 Binding 0
OpDecorate %34 Aliased
OpDecorate %35 ArrayStride 2
OpMemberDecorate %36 0 Offset 0
OpDecorate %36 Block
OpDecorate %39 DescriptorSet 4
OpDecorate %39 Binding 0
OpDecorate %39 Aliased
OpDecorate %40 ArrayStride 4
OpMemberDecorate %41 0 Offset 0
OpDecorate %41 Block
OpDecorate %44 DescriptorSet 4
OpDecorate %44 Binding 0
OpDecorate %44 NonReadable
OpDecorate %44 NonWritable
OpDecorate %45 ArrayStride 4
OpMemberDecorate %46 0 Offset 0
OpDecorate %46 Block
OpDecorate %49 DescriptorSet 4
OpDecorate %49 Binding 0
OpDecorate %49 NonReadable
OpDecorate %49 NonWritable
OpDecorate %51 Flat
OpDecorate %51 Location 0
OpDecorate %55 Flat
OpDecorate %55 Location 1
OpDecorate %59 Location 0
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
%14 = OpTypeRuntimeArray %5
%15 = OpTypeStruct %14
%16 = OpTypeRuntimeArray %15
%17 = OpTypePointer StorageBuffer %16
%18 = OpVariable %17 StorageBuffer
%19 = OpTypeInt 16 0
%20 = OpTypeRuntimeArray %19
%21 = OpTypeStruct %20
%22 = OpTypeRuntimeArray %21
%23 = OpTypePointer StorageBuffer %22
%24 = OpVariable %23 StorageBuffer
%25 = OpTypeRuntimeArray %5
%26 = OpTypeStruct %25
%27 = OpTypeRuntimeArray %26
%28 = OpTypePointer StorageBuffer %27
%29 = OpVariable %28 StorageBuffer
%30 = OpTypeRuntimeArray %5
%31 = OpTypeStruct %30
%32 = OpTypeRuntimeArray %31
%33 = OpTypePointer StorageBuffer %32
%34 = OpVariable %33 StorageBuffer
%35 = OpTypeRuntimeArray %19
%36 = OpTypeStruct %35
%37 = OpTypeRuntimeArray %36
%38 = OpTypePointer StorageBuffer %37
%39 = OpVariable %38 StorageBuffer
%40 = OpTypeRuntimeArray %5
%41 = OpTypeStruct %40
%42 = OpTypeRuntimeArray %41
%43 = OpTypePointer StorageBuffer %42
%44 = OpVariable %43 StorageBuffer
%45 = OpTypeRuntimeArray %5
%46 = OpTypeStruct %45
%47 = OpTypeRuntimeArray %46
%48 = OpTypePointer StorageBuffer %47
%49 = OpVariable %48 StorageBuffer
%50 = OpTypePointer Input %5
%51 = OpVariable %50 Input
%52 = OpTypeInt 32 1
%53 = OpTypeVector %52 4
%54 = OpTypePointer Input %53
%55 = OpVariable %54 Input
%56 = OpTypeFloat 32
%57 = OpTypeVector %56 4
%58 = OpTypePointer Output %57
%59 = OpVariable %58 Output
%60 = OpTypePointer Input %52
%62 = OpConstant %5 0
%66 = OpConstant %5 1
%70 = OpConstant %5 2
%74 = OpConstant %5 3
%77 = OpTypePointer StorageBuffer %21
%79 = OpTypePointer PushConstant %5
%82 = OpTypePointer StorageBuffer %15
%87 = OpTypePointer StorageBuffer %9
%91 = OpConstantComposite %9 %70 %70
%95 = OpTypeBool
%98 = OpConstant %5 1073741820
%99 = OpTypePointer StorageBuffer %5
%114 = OpConstantComposite %9 %66 %66
%120 = OpConstant %5 2147483644
%121 = OpTypePointer StorageBuffer %19
%127 = OpTypeVector %19 2
%129 = OpTypeFloat 16
%130 = OpTypeVector %129 2
%136 = OpTypePointer StorageBuffer %36
%139 = OpConstant %5 4
%142 = OpTypePointer StorageBuffer %31
%199 = OpConstant %5 8
%221 = OpTypeVector %19 4
%223 = OpTypeVector %129 4
%237 = OpConstant %5 16
%257 = OpTypeVector %5 4
%332 = OpTypePointer Output %56
%3 = OpFunction %1 None %2
%4 = OpLabel
%200 = OpUndef %5
OpBranch %337
%337 = OpLabel
%61 = OpAccessChain %60 %55 %62
%63 = OpLoad %52 %61
%64 = OpBitcast %5 %63
%65 = OpAccessChain %60 %55 %66
%67 = OpLoad %52 %65
%68 = OpBitcast %5 %67
%69 = OpAccessChain %60 %55 %70
%71 = OpLoad %52 %69
%72 = OpBitcast %5 %71
%73 = OpAccessChain %60 %55 %74
%75 = OpLoad %52 %73
%76 = OpBitcast %5 %75
%80 = OpAccessChain %79 %8 %66
%81 = OpLoad %5 %80
%78 = OpAccessChain %77 %24 %81
%84 = OpAccessChain %79 %8 %66
%85 = OpLoad %5 %84
%83 = OpAccessChain %82 %18 %85
%86 = OpGroupNonUniformBroadcastFirst %5 %74 %85
%88 = OpAccessChain %87 %13 %62 %86
%89 = OpLoad %9 %88
%90 = OpShiftRightLogical %9 %89 %91
%92 = OpCompositeExtract %5 %90 0
%93 = OpCompositeExtract %5 %90 1
%94 = OpIAdd %5 %64 %92
%96 = OpULessThan %95 %64 %93
%97 = OpSelect %5 %96 %94 %98
%100 = OpAccessChain %99 %83 %62 %97
%101 = OpLoad %5 %100
%102 = OpBitcast %56 %101
%104 = OpAccessChain %79 %8 %66
%105 = OpLoad %5 %104
%103 = OpAccessChain %77 %24 %105
%107 = OpAccessChain %79 %8 %66
%108 = OpLoad %5 %107
%106 = OpAccessChain %82 %18 %108
%109 = OpGroupNonUniformBroadcastFirst %5 %74 %108
%110 = OpAccessChain %87 %13 %62 %109
%111 = OpLoad %9 %110
%112 = OpIMul %5 %68 %70
%113 = OpShiftRightLogical %9 %111 %114
%115 = OpCompositeExtract %5 %113 0
%116 = OpCompositeExtract %5 %113 1
%117 = OpIAdd %5 %112 %115
%118 = OpULessThan %95 %112 %116
%119 = OpSelect %5 %118 %117 %120
%122 = OpAccessChain %121 %103 %62 %119
%123 = OpLoad %19 %122
%125 = OpIAdd %5 %119 %66
%124 = OpAccessChain %121 %103 %62 %125
%126 = OpLoad %19 %124
%128 = OpCompositeConstruct %127 %123 %126
%131 = OpBitcast %130 %128
%132 = OpCompositeExtract %129 %131 0
%133 = OpCompositeExtract %129 %131 1
%134 = OpFConvert %56 %132
%135 = OpFConvert %56 %133
%138 = OpAccessChain %79 %8 %139
%140 = OpLoad %5 %138
%141 = OpIAdd %5 %140 %70
%137 = OpAccessChain %136 %39 %141
%144 = OpAccessChain %79 %8 %139
%145 = OpLoad %5 %144
%146 = OpIAdd %5 %145 %70
%143 = OpAccessChain %142 %34 %146
%147 = OpGroupNonUniformBroadcastFirst %5 %74 %146
%148 = OpAccessChain %87 %13 %62 %147
%149 = OpLoad %9 %148
%150 = OpShiftRightLogical %9 %149 %91
%151 = OpCompositeExtract %5 %150 0
%152 = OpCompositeExtract %5 %150 1
%153 = OpIAdd %5 %72 %151
%154 = OpULessThan %95 %72 %152
%155 = OpSelect %5 %154 %153 %98
%156 = OpAccessChain %99 %143 %62 %155
%157 = OpLoad %5 %156
%158 = OpBitcast %56 %157
%159 = OpFAdd %56 %158 %135
%161 = OpAccessChain %79 %8 %139
%162 = OpLoad %5 %161
%163 = OpIAdd %5 %162 %70
%160 = OpAccessChain %136 %39 %163
%165 = OpAccessChain %79 %8 %139
%166 = OpLoad %5 %165
%167 = OpIAdd %5 %166 %70
%164 = OpAccessChain %142 %34 %167
%168 = OpGroupNonUniformBroadcastFirst %5 %74 %167
%169 = OpAccessChain %87 %13 %62 %168
%170 = OpLoad %9 %169
%171 = OpIMul %5 %76 %70
%172 = OpShiftRightLogical %9 %170 %114
%173 = OpCompositeExtract %5 %172 0
%174 = OpCompositeExtract %5 %172 1
%175 = OpIAdd %5 %171 %173
%176 = OpULessThan %95 %171 %174
%177 = OpSelect %5 %176 %175 %120
%178 = OpAccessChain %121 %160 %62 %177
%179 = OpLoad %19 %178
%181 = OpIAdd %5 %177 %66
%180 = OpAccessChain %121 %160 %62 %181
%182 = OpLoad %19 %180
%183 = OpCompositeConstruct %127 %179 %182
%184 = OpBitcast %130 %183
%185 = OpCompositeExtract %129 %184 0
%186 = OpCompositeExtract %129 %184 1
%187 = OpFConvert %56 %185
%188 = OpFConvert %56 %186
%189 = OpFAdd %56 %188 %102
%191 = OpAccessChain %79 %8 %66
%192 = OpLoad %5 %191
%190 = OpAccessChain %77 %24 %192
%194 = OpAccessChain %79 %8 %66
%195 = OpLoad %5 %194
%193 = OpAccessChain %82 %18 %195
%196 = OpGroupNonUniformBroadcastFirst %5 %74 %195
%197 = OpAccessChain %87 %13 %62 %196
%198 = OpLoad %9 %197
%201 = OpIMul %5 %199 %70
%202 = OpShiftRightLogical %5 %200 %66
%203 = OpIAdd %5 %201 %202
%204 = OpShiftRightLogical %9 %198 %114
%205 = OpCompositeExtract %5 %204 0
%206 = OpCompositeExtract %5 %204 1
%207 = OpIAdd %5 %203 %205
%208 = OpULessThan %95 %203 %206
%209 = OpSelect %5 %208 %207 %120
%210 = OpAccessChain %121 %190 %62 %209
%211 = OpLoad %19 %210
%213 = OpIAdd %5 %209 %66
%212 = OpAccessChain %121 %190 %62 %213
%214 = OpLoad %19 %212
%216 = OpIAdd %5 %209 %70
%215 = OpAccessChain %121 %190 %62 %216
%217 = OpLoad %19 %215
%219 = OpIAdd %5 %209 %74
%218 = OpAccessChain %121 %190 %62 %219
%220 = OpLoad %19 %218
%222 = OpCompositeConstruct %221 %211 %214 %217 %220
%224 = OpBitcast %223 %222
%225 = OpCompositeExtract %129 %224 0
%226 = OpCompositeExtract %129 %224 1
%227 = OpCompositeExtract %129 %224 2
%228 = OpCompositeExtract %129 %224 3
%229 = OpFConvert %56 %225
%230 = OpFConvert %56 %226
%231 = OpFConvert %56 %227
%232 = OpFConvert %56 %228
%233 = OpFAdd %56 %189 %229
%234 = OpFAdd %56 %230 %134
%235 = OpFAdd %56 %159 %231
%236 = OpFAdd %56 %232 %187
%238 = OpShiftRightLogical %5 %200 %70
%239 = OpIAdd %5 %237 %238
%240 = OpShiftRightLogical %9 %198 %91
%241 = OpCompositeExtract %5 %240 0
%242 = OpCompositeExtract %5 %240 1
%243 = OpIAdd %5 %239 %241
%244 = OpULessThan %95 %239 %242
%245 = OpSelect %5 %244 %243 %98
%246 = OpAccessChain %99 %193 %62 %245
%247 = OpLoad %5 %246
%249 = OpIAdd %5 %245 %66
%248 = OpAccessChain %99 %193 %62 %249
%250 = OpLoad %5 %248
%252 = OpIAdd %5 %245 %70
%251 = OpAccessChain %99 %193 %62 %252
%253 = OpLoad %5 %251
%255 = OpIAdd %5 %245 %74
%254 = OpAccessChain %99 %193 %62 %255
%256 = OpLoad %5 %254
%258 = OpCompositeConstruct %257 %247 %250 %253 %256
%259 = OpBitcast %57 %258
%260 = OpCompositeExtract %56 %259 0
%261 = OpCompositeExtract %56 %259 1
%262 = OpCompositeExtract %56 %259 2
%263 = OpCompositeExtract %56 %259 3
%264 = OpFAdd %56 %233 %260
%265 = OpFAdd %56 %234 %261
%266 = OpFAdd %56 %235 %262
%267 = OpFAdd %56 %236 %263
%269 = OpAccessChain %79 %8 %139
%270 = OpLoad %5 %269
%271 = OpIAdd %5 %270 %70
%268 = OpAccessChain %136 %39 %271
%273 = OpAccessChain %79 %8 %139
%274 = OpLoad %5 %273
%275 = OpIAdd %5 %274 %70
%272 = OpAccessChain %142 %34 %275
%276 = OpGroupNonUniformBroadcastFirst %5 %74 %275
%277 = OpAccessChain %87 %13 %62 %276
%278 = OpLoad %9 %277
%279 = OpIMul %5 %199 %70
%280 = OpShiftRightLogical %5 %200 %66
%281 = OpIAdd %5 %279 %280
%282 = OpShiftRightLogical %9 %278 %114
%283 = OpCompositeExtract %5 %282 0
%284 = OpCompositeExtract %5 %282 1
%285 = OpIAdd %5 %281 %283
%286 = OpULessThan %95 %281 %284
%287 = OpSelect %5 %286 %285 %120
%288 = OpAccessChain %121 %268 %62 %287
%289 = OpLoad %19 %288
%291 = OpIAdd %5 %287 %66
%290 = OpAccessChain %121 %268 %62 %291
%292 = OpLoad %19 %290
%294 = OpIAdd %5 %287 %70
%293 = OpAccessChain %121 %268 %62 %294
%295 = OpLoad %19 %293
%297 = OpIAdd %5 %287 %74
%296 = OpAccessChain %121 %268 %62 %297
%298 = OpLoad %19 %296
%299 = OpCompositeConstruct %221 %289 %292 %295 %298
%300 = OpBitcast %223 %299
%301 = OpCompositeExtract %129 %300 0
%302 = OpCompositeExtract %129 %300 1
%303 = OpCompositeExtract %129 %300 2
%304 = OpCompositeExtract %129 %300 3
%305 = OpFConvert %56 %301
%306 = OpFConvert %56 %302
%307 = OpFConvert %56 %303
%308 = OpFConvert %56 %304
%309 = OpFAdd %56 %264 %305
%310 = OpFAdd %56 %265 %306
%311 = OpFAdd %56 %266 %307
%312 = OpFAdd %56 %267 %308
%313 = OpShiftRightLogical %5 %200 %70
%314 = OpIAdd %5 %237 %313
%315 = OpShiftRightLogical %9 %278 %91
%316 = OpCompositeExtract %5 %315 0
%317 = OpCompositeExtract %5 %315 1
%318 = OpIAdd %5 %314 %316
%319 = OpULessThan %95 %314 %317
%320 = OpSelect %5 %319 %318 %98
%321 = OpBitcast %5 %309
%322 = OpBitcast %5 %310
%323 = OpBitcast %5 %311
%324 = OpBitcast %5 %312
%325 = OpAccessChain %99 %272 %62 %320
OpStore %325 %321
%327 = OpIAdd %5 %320 %66
%326 = OpAccessChain %99 %272 %62 %327
OpStore %326 %322
%329 = OpIAdd %5 %320 %70
%328 = OpAccessChain %99 %272 %62 %329
OpStore %328 %323
%331 = OpIAdd %5 %320 %74
%330 = OpAccessChain %99 %272 %62 %331
OpStore %330 %324
%333 = OpAccessChain %332 %59 %62
OpStore %333 %309
%334 = OpAccessChain %332 %59 %66
OpStore %334 %310
%335 = OpAccessChain %332 %59 %70
OpStore %335 %311
%336 = OpAccessChain %332 %59 %74
OpStore %336 %312
OpReturn
OpFunctionEnd
#endif
