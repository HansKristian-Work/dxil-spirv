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

layout(set = 1, binding = 0, std430) restrict readonly buffer _31_34
{
    uint16_t _m0[];
} _34[];

layout(set = 4, binding = 0, std430) readonly buffer _36_39
{
    uint _m0[];
} _39[];

layout(set = 4, binding = 0, std430) readonly buffer _41_44
{
    uint _m0[];
} _44[];

layout(set = 4, binding = 0, std430) readonly buffer _46_49
{
    uint16_t _m0[];
} _49[];

layout(set = 4, binding = 0, std430) buffer _51_54
{
    uint _m0[];
} _54[];

layout(set = 4, binding = 0, std430) buffer _56_59
{
    uint16_t _m0[];
} _59[];

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

void main()
{
    uint _74 = uint(UV.x);
    uint _82 = uint(UV.z);
    uvec2 _96 = _13._m0[subgroupBroadcastFirst(registers._m1)] >> uvec2(2u);
    uint _113 = registers._m1 + 1u;
    uint _121 = uint(UV.y) * 2u;
    uvec2 _122 = _13._m0[subgroupBroadcastFirst(registers._m1 + 1u)] >> uvec2(1u);
    uint _128 = (_121 < _122.y) ? (_121 + _122.x) : 2147483644u;
    f16vec2 _140 = uint16BitsToFloat16(u16vec2(_24[_113]._m0[_128], _24[_113]._m0[_128 + 1u]));
    uint _150 = registers._m4 + 2u;
    uvec2 _154 = _13._m0[subgroupBroadcastFirst(_150)] >> uvec2(2u);
    uint _161 = _39[_150]._m0[(_82 < _154.y) ? (_82 + _154.x) : 1073741820u];
    uint _168 = registers._m4 + 3u;
    uint _177 = uint(UV.w) * 2u;
    uvec2 _178 = _13._m0[subgroupBroadcastFirst(registers._m4 + 3u)] >> uvec2(1u);
    uint _183 = (_177 < _178.y) ? (_177 + _178.x) : 2147483644u;
    uint16_t _185 = _49[_168]._m0[_183];
    uint16_t _188 = _49[_168]._m0[_183 + 1u];
    f16vec2 _190 = uint16BitsToFloat16(u16vec2(_185, _188));
    uint _200 = registers._m1 + 4u;
    uint _205 = registers._m1 + 4u;
    uint _206 = subgroupBroadcastFirst(_205);
    uvec2 _209 = _13._m0[_206] >> uvec2(1u);
    uint _214 = (4u < _209.y) ? (4u + _209.x) : 2147483644u;
    f16vec4 _229 = uint16BitsToFloat16(u16vec4(_34[_200]._m0[_214], _34[_200]._m0[_214 + 1u], _34[_200]._m0[_214 + 2u], _34[_200]._m0[_214 + 3u]));
    uvec2 _242 = _13._m0[_206] >> uvec2(2u);
    uint _247 = (4u < _242.y) ? (4u + _242.x) : 1073741820u;
    vec4 _261 = uintBitsToFloat(uvec4(_29[_205]._m0[_247], _29[_205]._m0[_247 + 1u], _29[_205]._m0[_247 + 2u], _29[_205]._m0[_247 + 3u]));
    uint _274 = registers._m4 + 5u;
    uint _280 = registers._m4 + 5u;
    uint _281 = subgroupBroadcastFirst(_280);
    uvec2 _284 = _13._m0[_281] >> uvec2(1u);
    uint _289 = (4u < _284.y) ? (4u + _284.x) : 2147483644u;
    uint16_t _291 = _59[_274]._m0[_289];
    uint16_t _294 = _59[_274]._m0[_289 + 1u];
    uint16_t _297 = _59[_274]._m0[_289 + 2u];
    uint16_t _300 = _59[_274]._m0[_289 + 3u];
    f16vec4 _302 = uint16BitsToFloat16(u16vec4(_291, _294, _297, _300));
    float _311 = (((float(_190.y) + uintBitsToFloat(_18[registers._m1]._m0[(_74 < _96.y) ? (_74 + _96.x) : 1073741820u])) + float(_229.x)) + _261.x) + float(_302.x);
    float _312 = ((float(_229.y) + float(_140.x)) + _261.y) + float(_302.y);
    float _313 = (((uintBitsToFloat(_161) + float(_140.y)) + float(_229.z)) + _261.z) + float(_302.z);
    float _314 = ((float(_229.w) + float(_190.x)) + _261.w) + float(_302.w);
    uvec2 _315 = _13._m0[_281] >> uvec2(2u);
    uint _320 = (4u < _315.y) ? (4u + _315.x) : 1073741820u;
    _54[_280]._m0[_320] = floatBitsToUint(_311);
    _54[_280]._m0[_320 + 1u] = floatBitsToUint(_312);
    _54[_280]._m0[_320 + 2u] = floatBitsToUint(_313);
    _54[_280]._m0[_320 + 3u] = floatBitsToUint(_314);
    SV_Target.x = _311;
    SV_Target.y = _312;
    SV_Target.z = _313;
    SV_Target.w = _314;
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
OpEntryPoint Fragment %3 "main" %61 %65 %69
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
OpName %51 "SSBO"
OpName %56 "SSBO"
OpName %61 "INDEX"
OpName %65 "UV"
OpName %69 "SV_Target"
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
OpDecorate %30 ArrayStride 2
OpMemberDecorate %31 0 Offset 0
OpDecorate %31 Block
OpDecorate %34 DescriptorSet 1
OpDecorate %34 Binding 0
OpDecorate %34 NonWritable
OpDecorate %34 Restrict
OpDecorate %35 ArrayStride 4
OpMemberDecorate %36 0 Offset 0
OpDecorate %36 Block
OpDecorate %39 DescriptorSet 4
OpDecorate %39 Binding 0
OpDecorate %39 NonWritable
OpDecorate %40 ArrayStride 4
OpMemberDecorate %41 0 Offset 0
OpDecorate %41 Block
OpDecorate %44 DescriptorSet 4
OpDecorate %44 Binding 0
OpDecorate %44 NonWritable
OpDecorate %44 Aliased
OpDecorate %45 ArrayStride 2
OpMemberDecorate %46 0 Offset 0
OpDecorate %46 Block
OpDecorate %49 DescriptorSet 4
OpDecorate %49 Binding 0
OpDecorate %49 NonWritable
OpDecorate %49 Aliased
OpDecorate %50 ArrayStride 4
OpMemberDecorate %51 0 Offset 0
OpDecorate %51 Block
OpDecorate %54 DescriptorSet 4
OpDecorate %54 Binding 0
OpDecorate %54 Aliased
OpDecorate %55 ArrayStride 2
OpMemberDecorate %56 0 Offset 0
OpDecorate %56 Block
OpDecorate %59 DescriptorSet 4
OpDecorate %59 Binding 0
OpDecorate %59 Aliased
OpDecorate %61 Flat
OpDecorate %61 Location 0
OpDecorate %65 Flat
OpDecorate %65 Location 1
OpDecorate %69 Location 0
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
%30 = OpTypeRuntimeArray %19
%31 = OpTypeStruct %30
%32 = OpTypeRuntimeArray %31
%33 = OpTypePointer StorageBuffer %32
%34 = OpVariable %33 StorageBuffer
%35 = OpTypeRuntimeArray %5
%36 = OpTypeStruct %35
%37 = OpTypeRuntimeArray %36
%38 = OpTypePointer StorageBuffer %37
%39 = OpVariable %38 StorageBuffer
%40 = OpTypeRuntimeArray %5
%41 = OpTypeStruct %40
%42 = OpTypeRuntimeArray %41
%43 = OpTypePointer StorageBuffer %42
%44 = OpVariable %43 StorageBuffer
%45 = OpTypeRuntimeArray %19
%46 = OpTypeStruct %45
%47 = OpTypeRuntimeArray %46
%48 = OpTypePointer StorageBuffer %47
%49 = OpVariable %48 StorageBuffer
%50 = OpTypeRuntimeArray %5
%51 = OpTypeStruct %50
%52 = OpTypeRuntimeArray %51
%53 = OpTypePointer StorageBuffer %52
%54 = OpVariable %53 StorageBuffer
%55 = OpTypeRuntimeArray %19
%56 = OpTypeStruct %55
%57 = OpTypeRuntimeArray %56
%58 = OpTypePointer StorageBuffer %57
%59 = OpVariable %58 StorageBuffer
%60 = OpTypePointer Input %5
%61 = OpVariable %60 Input
%62 = OpTypeInt 32 1
%63 = OpTypeVector %62 4
%64 = OpTypePointer Input %63
%65 = OpVariable %64 Input
%66 = OpTypeFloat 32
%67 = OpTypeVector %66 4
%68 = OpTypePointer Output %67
%69 = OpVariable %68 Output
%70 = OpTypePointer Input %62
%72 = OpConstant %5 0
%76 = OpConstant %5 1
%80 = OpConstant %5 2
%84 = OpConstant %5 3
%87 = OpTypePointer StorageBuffer %15
%89 = OpTypePointer PushConstant %5
%93 = OpTypePointer StorageBuffer %9
%97 = OpConstantComposite %9 %80 %80
%101 = OpTypeBool
%104 = OpConstant %5 1073741820
%105 = OpTypePointer StorageBuffer %5
%109 = OpTypePointer StorageBuffer %21
%123 = OpConstantComposite %9 %76 %76
%129 = OpConstant %5 2147483644
%130 = OpTypePointer StorageBuffer %19
%136 = OpTypeVector %19 2
%138 = OpTypeFloat 16
%139 = OpTypeVector %138 2
%145 = OpTypePointer StorageBuffer %36
%148 = OpConstant %5 4
%164 = OpTypePointer StorageBuffer %46
%169 = OpTypePointer StorageBuffer %41
%196 = OpTypePointer StorageBuffer %31
%201 = OpTypePointer StorageBuffer %26
%226 = OpTypeVector %19 4
%228 = OpTypeVector %138 4
%259 = OpTypeVector %5 4
%270 = OpTypePointer StorageBuffer %56
%275 = OpConstant %5 5
%276 = OpTypePointer StorageBuffer %51
%332 = OpTypePointer Output %66
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %337
%337 = OpLabel
%71 = OpAccessChain %70 %65 %72
%73 = OpLoad %62 %71
%74 = OpBitcast %5 %73
%75 = OpAccessChain %70 %65 %76
%77 = OpLoad %62 %75
%78 = OpBitcast %5 %77
%79 = OpAccessChain %70 %65 %80
%81 = OpLoad %62 %79
%82 = OpBitcast %5 %81
%83 = OpAccessChain %70 %65 %84
%85 = OpLoad %62 %83
%86 = OpBitcast %5 %85
%90 = OpAccessChain %89 %8 %76
%91 = OpLoad %5 %90
%88 = OpAccessChain %87 %18 %91
%92 = OpGroupNonUniformBroadcastFirst %5 %84 %91
%94 = OpAccessChain %93 %13 %72 %92
%95 = OpLoad %9 %94
%96 = OpShiftRightLogical %9 %95 %97
%98 = OpCompositeExtract %5 %96 0
%99 = OpCompositeExtract %5 %96 1
%100 = OpIAdd %5 %74 %98
%102 = OpULessThan %101 %74 %99
%103 = OpSelect %5 %102 %100 %104
%106 = OpAccessChain %105 %88 %72 %103
%107 = OpLoad %5 %106
%108 = OpBitcast %66 %107
%111 = OpAccessChain %89 %8 %76
%112 = OpLoad %5 %111
%113 = OpIAdd %5 %112 %76
%110 = OpAccessChain %109 %24 %113
%115 = OpAccessChain %89 %8 %76
%116 = OpLoad %5 %115
%117 = OpIAdd %5 %116 %76
%114 = OpAccessChain %87 %18 %117
%118 = OpGroupNonUniformBroadcastFirst %5 %84 %117
%119 = OpAccessChain %93 %13 %72 %118
%120 = OpLoad %9 %119
%121 = OpIMul %5 %78 %80
%122 = OpShiftRightLogical %9 %120 %123
%124 = OpCompositeExtract %5 %122 0
%125 = OpCompositeExtract %5 %122 1
%126 = OpIAdd %5 %121 %124
%127 = OpULessThan %101 %121 %125
%128 = OpSelect %5 %127 %126 %129
%131 = OpAccessChain %130 %110 %72 %128
%132 = OpLoad %19 %131
%134 = OpIAdd %5 %128 %76
%133 = OpAccessChain %130 %110 %72 %134
%135 = OpLoad %19 %133
%137 = OpCompositeConstruct %136 %132 %135
%140 = OpBitcast %139 %137
%141 = OpCompositeExtract %138 %140 0
%142 = OpCompositeExtract %138 %140 1
%143 = OpFConvert %66 %141
%144 = OpFConvert %66 %142
%147 = OpAccessChain %89 %8 %148
%149 = OpLoad %5 %147
%150 = OpIAdd %5 %149 %80
%146 = OpAccessChain %145 %39 %150
%151 = OpGroupNonUniformBroadcastFirst %5 %84 %150
%152 = OpAccessChain %93 %13 %72 %151
%153 = OpLoad %9 %152
%154 = OpShiftRightLogical %9 %153 %97
%155 = OpCompositeExtract %5 %154 0
%156 = OpCompositeExtract %5 %154 1
%157 = OpIAdd %5 %82 %155
%158 = OpULessThan %101 %82 %156
%159 = OpSelect %5 %158 %157 %104
%160 = OpAccessChain %105 %146 %72 %159
%161 = OpLoad %5 %160
%162 = OpBitcast %66 %161
%163 = OpFAdd %66 %162 %144
%166 = OpAccessChain %89 %8 %148
%167 = OpLoad %5 %166
%168 = OpIAdd %5 %167 %84
%165 = OpAccessChain %164 %49 %168
%171 = OpAccessChain %89 %8 %148
%172 = OpLoad %5 %171
%173 = OpIAdd %5 %172 %84
%170 = OpAccessChain %169 %44 %173
%174 = OpGroupNonUniformBroadcastFirst %5 %84 %173
%175 = OpAccessChain %93 %13 %72 %174
%176 = OpLoad %9 %175
%177 = OpIMul %5 %86 %80
%178 = OpShiftRightLogical %9 %176 %123
%179 = OpCompositeExtract %5 %178 0
%180 = OpCompositeExtract %5 %178 1
%181 = OpIAdd %5 %177 %179
%182 = OpULessThan %101 %177 %180
%183 = OpSelect %5 %182 %181 %129
%184 = OpAccessChain %130 %165 %72 %183
%185 = OpLoad %19 %184
%187 = OpIAdd %5 %183 %76
%186 = OpAccessChain %130 %165 %72 %187
%188 = OpLoad %19 %186
%189 = OpCompositeConstruct %136 %185 %188
%190 = OpBitcast %139 %189
%191 = OpCompositeExtract %138 %190 0
%192 = OpCompositeExtract %138 %190 1
%193 = OpFConvert %66 %191
%194 = OpFConvert %66 %192
%195 = OpFAdd %66 %194 %108
%198 = OpAccessChain %89 %8 %76
%199 = OpLoad %5 %198
%200 = OpIAdd %5 %199 %148
%197 = OpAccessChain %196 %34 %200
%203 = OpAccessChain %89 %8 %76
%204 = OpLoad %5 %203
%205 = OpIAdd %5 %204 %148
%202 = OpAccessChain %201 %29 %205
%206 = OpGroupNonUniformBroadcastFirst %5 %84 %205
%207 = OpAccessChain %93 %13 %72 %206
%208 = OpLoad %9 %207
%209 = OpShiftRightLogical %9 %208 %123
%210 = OpCompositeExtract %5 %209 0
%211 = OpCompositeExtract %5 %209 1
%212 = OpIAdd %5 %148 %210
%213 = OpULessThan %101 %148 %211
%214 = OpSelect %5 %213 %212 %129
%215 = OpAccessChain %130 %197 %72 %214
%216 = OpLoad %19 %215
%218 = OpIAdd %5 %214 %76
%217 = OpAccessChain %130 %197 %72 %218
%219 = OpLoad %19 %217
%221 = OpIAdd %5 %214 %80
%220 = OpAccessChain %130 %197 %72 %221
%222 = OpLoad %19 %220
%224 = OpIAdd %5 %214 %84
%223 = OpAccessChain %130 %197 %72 %224
%225 = OpLoad %19 %223
%227 = OpCompositeConstruct %226 %216 %219 %222 %225
%229 = OpBitcast %228 %227
%230 = OpCompositeExtract %138 %229 0
%231 = OpCompositeExtract %138 %229 1
%232 = OpCompositeExtract %138 %229 2
%233 = OpCompositeExtract %138 %229 3
%234 = OpFConvert %66 %230
%235 = OpFConvert %66 %231
%236 = OpFConvert %66 %232
%237 = OpFConvert %66 %233
%238 = OpFAdd %66 %195 %234
%239 = OpFAdd %66 %235 %143
%240 = OpFAdd %66 %163 %236
%241 = OpFAdd %66 %237 %193
%242 = OpShiftRightLogical %9 %208 %97
%243 = OpCompositeExtract %5 %242 0
%244 = OpCompositeExtract %5 %242 1
%245 = OpIAdd %5 %148 %243
%246 = OpULessThan %101 %148 %244
%247 = OpSelect %5 %246 %245 %104
%248 = OpAccessChain %105 %202 %72 %247
%249 = OpLoad %5 %248
%251 = OpIAdd %5 %247 %76
%250 = OpAccessChain %105 %202 %72 %251
%252 = OpLoad %5 %250
%254 = OpIAdd %5 %247 %80
%253 = OpAccessChain %105 %202 %72 %254
%255 = OpLoad %5 %253
%257 = OpIAdd %5 %247 %84
%256 = OpAccessChain %105 %202 %72 %257
%258 = OpLoad %5 %256
%260 = OpCompositeConstruct %259 %249 %252 %255 %258
%261 = OpBitcast %67 %260
%262 = OpCompositeExtract %66 %261 0
%263 = OpCompositeExtract %66 %261 1
%264 = OpCompositeExtract %66 %261 2
%265 = OpCompositeExtract %66 %261 3
%266 = OpFAdd %66 %238 %262
%267 = OpFAdd %66 %239 %263
%268 = OpFAdd %66 %240 %264
%269 = OpFAdd %66 %241 %265
%272 = OpAccessChain %89 %8 %148
%273 = OpLoad %5 %272
%274 = OpIAdd %5 %273 %275
%271 = OpAccessChain %270 %59 %274
%278 = OpAccessChain %89 %8 %148
%279 = OpLoad %5 %278
%280 = OpIAdd %5 %279 %275
%277 = OpAccessChain %276 %54 %280
%281 = OpGroupNonUniformBroadcastFirst %5 %84 %280
%282 = OpAccessChain %93 %13 %72 %281
%283 = OpLoad %9 %282
%284 = OpShiftRightLogical %9 %283 %123
%285 = OpCompositeExtract %5 %284 0
%286 = OpCompositeExtract %5 %284 1
%287 = OpIAdd %5 %148 %285
%288 = OpULessThan %101 %148 %286
%289 = OpSelect %5 %288 %287 %129
%290 = OpAccessChain %130 %271 %72 %289
%291 = OpLoad %19 %290
%293 = OpIAdd %5 %289 %76
%292 = OpAccessChain %130 %271 %72 %293
%294 = OpLoad %19 %292
%296 = OpIAdd %5 %289 %80
%295 = OpAccessChain %130 %271 %72 %296
%297 = OpLoad %19 %295
%299 = OpIAdd %5 %289 %84
%298 = OpAccessChain %130 %271 %72 %299
%300 = OpLoad %19 %298
%301 = OpCompositeConstruct %226 %291 %294 %297 %300
%302 = OpBitcast %228 %301
%303 = OpCompositeExtract %138 %302 0
%304 = OpCompositeExtract %138 %302 1
%305 = OpCompositeExtract %138 %302 2
%306 = OpCompositeExtract %138 %302 3
%307 = OpFConvert %66 %303
%308 = OpFConvert %66 %304
%309 = OpFConvert %66 %305
%310 = OpFConvert %66 %306
%311 = OpFAdd %66 %266 %307
%312 = OpFAdd %66 %267 %308
%313 = OpFAdd %66 %268 %309
%314 = OpFAdd %66 %269 %310
%315 = OpShiftRightLogical %9 %283 %97
%316 = OpCompositeExtract %5 %315 0
%317 = OpCompositeExtract %5 %315 1
%318 = OpIAdd %5 %148 %316
%319 = OpULessThan %101 %148 %317
%320 = OpSelect %5 %319 %318 %104
%321 = OpBitcast %5 %311
%322 = OpBitcast %5 %312
%323 = OpBitcast %5 %313
%324 = OpBitcast %5 %314
%325 = OpAccessChain %105 %277 %72 %320
OpStore %325 %321
%327 = OpIAdd %5 %320 %76
%326 = OpAccessChain %105 %277 %72 %327
OpStore %326 %322
%329 = OpIAdd %5 %320 %80
%328 = OpAccessChain %105 %277 %72 %329
OpStore %328 %323
%331 = OpIAdd %5 %320 %84
%330 = OpAccessChain %105 %277 %72 %331
OpStore %330 %324
%333 = OpAccessChain %332 %69 %72
OpStore %333 %311
%334 = OpAccessChain %332 %69 %76
OpStore %334 %312
%335 = OpAccessChain %332 %69 %80
OpStore %335 %313
%336 = OpAccessChain %332 %69 %84
OpStore %336 %314
OpReturn
OpFunctionEnd
#endif
