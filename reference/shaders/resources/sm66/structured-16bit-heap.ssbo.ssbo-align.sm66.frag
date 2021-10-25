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
    uint _m0[];
} _20[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _23_26
{
    uint16_t _m0[];
} _26[];

layout(set = 0, binding = 0, std430) readonly buffer _28_31
{
    uint _m0[];
} _31[];

layout(set = 0, binding = 0, std430) readonly buffer _33_36
{
    uint _m0[];
} _36[];

layout(set = 0, binding = 0, std430) readonly buffer _38_41
{
    uint16_t _m0[];
} _41[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _43_46
{
    uint _m0[];
} _46[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _48_51
{
    uint16_t _m0[];
} _51[];

layout(set = 0, binding = 0, std430) buffer _53_56
{
    uint _m0[];
} _56[];

layout(set = 0, binding = 0, std430) buffer _58_61
{
    uint16_t _m0[];
} _61[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _76 = uint(UV.x);
    uint _84 = uint(UV.z);
    uvec2 _96 = _10._m0[subgroupBroadcastFirst(INDEX)] >> uvec2(2u);
    uint _98 = INDEX + 1u;
    uint _106 = INDEX + 4u;
    uvec2 _113 = _10._m0[subgroupBroadcastFirst(_106)] >> uvec2(2u);
    uint _114 = INDEX + 5u;
    uint _123 = INDEX + 8u;
    uint _129 = subgroupBroadcastFirst(_123);
    uint _132 = INDEX + 9u;
    uint _138 = subgroupBroadcastFirst(_132);
    uint _152 = uint(UV.y) * 2u;
    uvec2 _153 = _10._m0[subgroupBroadcastFirst(_98)] >> uvec2(1u);
    uint _159 = (_152 < _153.y) ? (_152 + _153.x) : 2147483644u;
    f16vec2 _171 = uint16BitsToFloat16(u16vec2(_26[_98]._m0[_159], _26[_98]._m0[_159 + 1u]));
    uint _182 = _31[_106]._m0[(_84 < _113.y) ? (_84 + _113.x) : 1073741820u];
    uint _185 = uint(UV.w) * 2u;
    uvec2 _186 = _10._m0[subgroupBroadcastFirst(_114)] >> uvec2(1u);
    uint _191 = (_185 < _186.y) ? (_185 + _186.x) : 2147483644u;
    uint16_t _193 = _41[_114]._m0[_191];
    uint16_t _196 = _41[_114]._m0[_191 + 1u];
    f16vec2 _198 = uint16BitsToFloat16(u16vec2(_193, _196));
    uvec2 _204 = _10._m0[_129] >> uvec2(1u);
    uint _209 = (4u < _204.y) ? (4u + _204.x) : 2147483644u;
    f16vec4 _224 = uint16BitsToFloat16(u16vec4(_51[_123]._m0[_209], _51[_123]._m0[_209 + 1u], _51[_123]._m0[_209 + 2u], _51[_123]._m0[_209 + 3u]));
    uvec2 _237 = _10._m0[_129] >> uvec2(2u);
    uint _242 = (4u < _237.y) ? (4u + _237.x) : 1073741820u;
    vec4 _256 = uintBitsToFloat(uvec4(_46[_123]._m0[_242], _46[_123]._m0[_242 + 1u], _46[_123]._m0[_242 + 2u], _46[_123]._m0[_242 + 3u]));
    uvec2 _265 = _10._m0[_138] >> uvec2(1u);
    uint _270 = (4u < _265.y) ? (4u + _265.x) : 2147483644u;
    uint16_t _272 = _61[_132]._m0[_270];
    uint16_t _275 = _61[_132]._m0[_270 + 1u];
    uint16_t _278 = _61[_132]._m0[_270 + 2u];
    uint16_t _281 = _61[_132]._m0[_270 + 3u];
    f16vec4 _283 = uint16BitsToFloat16(u16vec4(_272, _275, _278, _281));
    float _292 = (((float(_198.y) + uintBitsToFloat(_15[INDEX]._m0[(_76 < _96.y) ? (_76 + _96.x) : 1073741820u])) + float(_224.x)) + _256.x) + float(_283.x);
    float _293 = ((float(_224.y) + float(_171.x)) + _256.y) + float(_283.y);
    float _294 = (((float(_171.y) + uintBitsToFloat(_182)) + float(_224.z)) + _256.z) + float(_283.z);
    float _295 = ((float(_224.w) + float(_198.x)) + _256.w) + float(_283.w);
    uvec2 _296 = _10._m0[_138] >> uvec2(2u);
    uint _301 = (4u < _296.y) ? (4u + _296.x) : 1073741820u;
    _56[_132]._m0[_301] = floatBitsToUint(_292);
    _56[_132]._m0[_301 + 1u] = floatBitsToUint(_293);
    _56[_132]._m0[_301 + 2u] = floatBitsToUint(_294);
    _56[_132]._m0[_301 + 3u] = floatBitsToUint(_295);
    SV_Target.x = _292;
    SV_Target.y = _293;
    SV_Target.z = _294;
    SV_Target.w = _295;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 320
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
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
OpDecorate %16 ArrayStride 4
OpMemberDecorate %17 0 Offset 0
OpDecorate %17 Block
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 0
OpDecorate %20 NonWritable
OpDecorate %20 Restrict
OpDecorate %22 ArrayStride 2
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
OpDecorate %32 ArrayStride 4
OpMemberDecorate %33 0 Offset 0
OpDecorate %33 Block
OpDecorate %36 DescriptorSet 0
OpDecorate %36 Binding 0
OpDecorate %36 NonWritable
OpDecorate %36 Aliased
OpDecorate %37 ArrayStride 2
OpMemberDecorate %38 0 Offset 0
OpDecorate %38 Block
OpDecorate %41 DescriptorSet 0
OpDecorate %41 Binding 0
OpDecorate %41 NonWritable
OpDecorate %41 Aliased
OpDecorate %42 ArrayStride 4
OpMemberDecorate %43 0 Offset 0
OpDecorate %43 Block
OpDecorate %46 DescriptorSet 0
OpDecorate %46 Binding 0
OpDecorate %46 NonWritable
OpDecorate %46 Restrict
OpDecorate %47 ArrayStride 2
OpMemberDecorate %48 0 Offset 0
OpDecorate %48 Block
OpDecorate %51 DescriptorSet 0
OpDecorate %51 Binding 0
OpDecorate %51 NonWritable
OpDecorate %51 Restrict
OpDecorate %52 ArrayStride 4
OpMemberDecorate %53 0 Offset 0
OpDecorate %53 Block
OpDecorate %56 DescriptorSet 0
OpDecorate %56 Binding 0
OpDecorate %56 Aliased
OpDecorate %57 ArrayStride 2
OpMemberDecorate %58 0 Offset 0
OpDecorate %58 Block
OpDecorate %61 DescriptorSet 0
OpDecorate %61 Binding 0
OpDecorate %61 Aliased
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
%16 = OpTypeRuntimeArray %5
%17 = OpTypeStruct %16
%18 = OpTypeRuntimeArray %17
%19 = OpTypePointer StorageBuffer %18
%20 = OpVariable %19 StorageBuffer
%21 = OpTypeInt 16 0
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
%32 = OpTypeRuntimeArray %5
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
%47 = OpTypeRuntimeArray %21
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
%99 = OpTypePointer StorageBuffer %23
%101 = OpTypePointer StorageBuffer %17
%107 = OpConstant %5 4
%108 = OpTypePointer StorageBuffer %28
%115 = OpConstant %5 5
%116 = OpTypePointer StorageBuffer %38
%118 = OpTypePointer StorageBuffer %33
%124 = OpConstant %5 8
%125 = OpTypePointer StorageBuffer %48
%127 = OpTypePointer StorageBuffer %43
%133 = OpConstant %5 9
%134 = OpTypePointer StorageBuffer %58
%136 = OpTypePointer StorageBuffer %53
%144 = OpTypeBool
%147 = OpConstant %5 1073741820
%148 = OpTypePointer StorageBuffer %5
%154 = OpConstantComposite %6 %78 %78
%160 = OpConstant %5 2147483644
%161 = OpTypePointer StorageBuffer %21
%167 = OpTypeVector %21 2
%169 = OpTypeFloat 16
%170 = OpTypeVector %169 2
%221 = OpTypeVector %21 4
%223 = OpTypeVector %169 4
%254 = OpTypeVector %5 4
%313 = OpTypePointer Output %68
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %318
%318 = OpLabel
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
%100 = OpAccessChain %99 %26 %98
%102 = OpAccessChain %101 %20 %98
%103 = OpGroupNonUniformBroadcastFirst %5 %86 %98
%104 = OpAccessChain %93 %10 %74 %103
%105 = OpLoad %6 %104
%106 = OpIAdd %5 %89 %107
%109 = OpAccessChain %108 %31 %106
%110 = OpGroupNonUniformBroadcastFirst %5 %86 %106
%111 = OpAccessChain %93 %10 %74 %110
%112 = OpLoad %6 %111
%113 = OpShiftRightLogical %6 %112 %97
%114 = OpIAdd %5 %89 %115
%117 = OpAccessChain %116 %41 %114
%119 = OpAccessChain %118 %36 %114
%120 = OpGroupNonUniformBroadcastFirst %5 %86 %114
%121 = OpAccessChain %93 %10 %74 %120
%122 = OpLoad %6 %121
%123 = OpIAdd %5 %89 %124
%126 = OpAccessChain %125 %51 %123
%128 = OpAccessChain %127 %46 %123
%129 = OpGroupNonUniformBroadcastFirst %5 %86 %123
%130 = OpAccessChain %93 %10 %74 %129
%131 = OpLoad %6 %130
%132 = OpIAdd %5 %89 %133
%135 = OpAccessChain %134 %61 %132
%137 = OpAccessChain %136 %56 %132
%138 = OpGroupNonUniformBroadcastFirst %5 %86 %132
%139 = OpAccessChain %93 %10 %74 %138
%140 = OpLoad %6 %139
%141 = OpCompositeExtract %5 %96 0
%142 = OpCompositeExtract %5 %96 1
%143 = OpIAdd %5 %76 %141
%145 = OpULessThan %144 %76 %142
%146 = OpSelect %5 %145 %143 %147
%149 = OpAccessChain %148 %91 %74 %146
%150 = OpLoad %5 %149
%151 = OpBitcast %68 %150
%152 = OpIMul %5 %80 %82
%153 = OpShiftRightLogical %6 %105 %154
%155 = OpCompositeExtract %5 %153 0
%156 = OpCompositeExtract %5 %153 1
%157 = OpIAdd %5 %152 %155
%158 = OpULessThan %144 %152 %156
%159 = OpSelect %5 %158 %157 %160
%162 = OpAccessChain %161 %100 %74 %159
%163 = OpLoad %21 %162
%165 = OpIAdd %5 %159 %78
%164 = OpAccessChain %161 %100 %74 %165
%166 = OpLoad %21 %164
%168 = OpCompositeConstruct %167 %163 %166
%171 = OpBitcast %170 %168
%172 = OpCompositeExtract %169 %171 0
%173 = OpCompositeExtract %169 %171 1
%174 = OpFConvert %68 %172
%175 = OpFConvert %68 %173
%176 = OpCompositeExtract %5 %113 0
%177 = OpCompositeExtract %5 %113 1
%178 = OpIAdd %5 %84 %176
%179 = OpULessThan %144 %84 %177
%180 = OpSelect %5 %179 %178 %147
%181 = OpAccessChain %148 %109 %74 %180
%182 = OpLoad %5 %181
%183 = OpBitcast %68 %182
%184 = OpFAdd %68 %175 %183
%185 = OpIMul %5 %88 %82
%186 = OpShiftRightLogical %6 %122 %154
%187 = OpCompositeExtract %5 %186 0
%188 = OpCompositeExtract %5 %186 1
%189 = OpIAdd %5 %185 %187
%190 = OpULessThan %144 %185 %188
%191 = OpSelect %5 %190 %189 %160
%192 = OpAccessChain %161 %117 %74 %191
%193 = OpLoad %21 %192
%195 = OpIAdd %5 %191 %78
%194 = OpAccessChain %161 %117 %74 %195
%196 = OpLoad %21 %194
%197 = OpCompositeConstruct %167 %193 %196
%198 = OpBitcast %170 %197
%199 = OpCompositeExtract %169 %198 0
%200 = OpCompositeExtract %169 %198 1
%201 = OpFConvert %68 %199
%202 = OpFConvert %68 %200
%203 = OpFAdd %68 %202 %151
%204 = OpShiftRightLogical %6 %131 %154
%205 = OpCompositeExtract %5 %204 0
%206 = OpCompositeExtract %5 %204 1
%207 = OpIAdd %5 %107 %205
%208 = OpULessThan %144 %107 %206
%209 = OpSelect %5 %208 %207 %160
%210 = OpAccessChain %161 %126 %74 %209
%211 = OpLoad %21 %210
%213 = OpIAdd %5 %209 %78
%212 = OpAccessChain %161 %126 %74 %213
%214 = OpLoad %21 %212
%216 = OpIAdd %5 %209 %82
%215 = OpAccessChain %161 %126 %74 %216
%217 = OpLoad %21 %215
%219 = OpIAdd %5 %209 %86
%218 = OpAccessChain %161 %126 %74 %219
%220 = OpLoad %21 %218
%222 = OpCompositeConstruct %221 %211 %214 %217 %220
%224 = OpBitcast %223 %222
%225 = OpCompositeExtract %169 %224 0
%226 = OpCompositeExtract %169 %224 1
%227 = OpCompositeExtract %169 %224 2
%228 = OpCompositeExtract %169 %224 3
%229 = OpFConvert %68 %225
%230 = OpFConvert %68 %226
%231 = OpFConvert %68 %227
%232 = OpFConvert %68 %228
%233 = OpFAdd %68 %203 %229
%234 = OpFAdd %68 %230 %174
%235 = OpFAdd %68 %184 %231
%236 = OpFAdd %68 %232 %201
%237 = OpShiftRightLogical %6 %131 %97
%238 = OpCompositeExtract %5 %237 0
%239 = OpCompositeExtract %5 %237 1
%240 = OpIAdd %5 %107 %238
%241 = OpULessThan %144 %107 %239
%242 = OpSelect %5 %241 %240 %147
%243 = OpAccessChain %148 %128 %74 %242
%244 = OpLoad %5 %243
%246 = OpIAdd %5 %242 %78
%245 = OpAccessChain %148 %128 %74 %246
%247 = OpLoad %5 %245
%249 = OpIAdd %5 %242 %82
%248 = OpAccessChain %148 %128 %74 %249
%250 = OpLoad %5 %248
%252 = OpIAdd %5 %242 %86
%251 = OpAccessChain %148 %128 %74 %252
%253 = OpLoad %5 %251
%255 = OpCompositeConstruct %254 %244 %247 %250 %253
%256 = OpBitcast %69 %255
%257 = OpCompositeExtract %68 %256 0
%258 = OpCompositeExtract %68 %256 1
%259 = OpCompositeExtract %68 %256 2
%260 = OpCompositeExtract %68 %256 3
%261 = OpFAdd %68 %233 %257
%262 = OpFAdd %68 %234 %258
%263 = OpFAdd %68 %235 %259
%264 = OpFAdd %68 %236 %260
%265 = OpShiftRightLogical %6 %140 %154
%266 = OpCompositeExtract %5 %265 0
%267 = OpCompositeExtract %5 %265 1
%268 = OpIAdd %5 %107 %266
%269 = OpULessThan %144 %107 %267
%270 = OpSelect %5 %269 %268 %160
%271 = OpAccessChain %161 %135 %74 %270
%272 = OpLoad %21 %271
%274 = OpIAdd %5 %270 %78
%273 = OpAccessChain %161 %135 %74 %274
%275 = OpLoad %21 %273
%277 = OpIAdd %5 %270 %82
%276 = OpAccessChain %161 %135 %74 %277
%278 = OpLoad %21 %276
%280 = OpIAdd %5 %270 %86
%279 = OpAccessChain %161 %135 %74 %280
%281 = OpLoad %21 %279
%282 = OpCompositeConstruct %221 %272 %275 %278 %281
%283 = OpBitcast %223 %282
%284 = OpCompositeExtract %169 %283 0
%285 = OpCompositeExtract %169 %283 1
%286 = OpCompositeExtract %169 %283 2
%287 = OpCompositeExtract %169 %283 3
%288 = OpFConvert %68 %284
%289 = OpFConvert %68 %285
%290 = OpFConvert %68 %286
%291 = OpFConvert %68 %287
%292 = OpFAdd %68 %261 %288
%293 = OpFAdd %68 %262 %289
%294 = OpFAdd %68 %263 %290
%295 = OpFAdd %68 %264 %291
%296 = OpShiftRightLogical %6 %140 %97
%297 = OpCompositeExtract %5 %296 0
%298 = OpCompositeExtract %5 %296 1
%299 = OpIAdd %5 %107 %297
%300 = OpULessThan %144 %107 %298
%301 = OpSelect %5 %300 %299 %147
%302 = OpBitcast %5 %292
%303 = OpBitcast %5 %293
%304 = OpBitcast %5 %294
%305 = OpBitcast %5 %295
%306 = OpAccessChain %148 %137 %74 %301
OpStore %306 %302
%308 = OpIAdd %5 %301 %78
%307 = OpAccessChain %148 %137 %74 %308
OpStore %307 %303
%310 = OpIAdd %5 %301 %82
%309 = OpAccessChain %148 %137 %74 %310
OpStore %309 %304
%312 = OpIAdd %5 %301 %86
%311 = OpAccessChain %148 %137 %74 %312
OpStore %311 %305
%314 = OpAccessChain %313 %71 %74
OpStore %314 %292
%315 = OpAccessChain %313 %71 %78
OpStore %315 %293
%316 = OpAccessChain %313 %71 %82
OpStore %316 %294
%317 = OpAccessChain %313 %71 %86
OpStore %317 %295
OpReturn
OpFunctionEnd
#endif
