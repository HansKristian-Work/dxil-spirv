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

layout(set = 0, binding = 0, std430) restrict readonly buffer _18_21
{
    uint16_t _m0[];
} _21[];

layout(set = 0, binding = 0, std430) readonly buffer _23_26
{
    uint _m0[];
} _26[];

layout(set = 0, binding = 0, std430) readonly buffer _28_31
{
    uint16_t _m0[];
} _31[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _33_36
{
    uint16_t _m0[];
} _36[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _38_41
{
    uint _m0[];
} _41[];

layout(set = 0, binding = 0, std430) buffer _43_46
{
    uint16_t _m0[];
} _46[];

layout(set = 0, binding = 0, std430) buffer _48_51
{
    uint _m0[];
} _51[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _66 = uint(UV.x);
    uint _74 = uint(UV.z);
    uvec2 _86 = _10._m0[subgroupBroadcastFirst(INDEX)] >> uvec2(2u);
    uint _88 = INDEX + 1u;
    uvec2 _94 = _10._m0[subgroupBroadcastFirst(_88)] >> uvec2(1u);
    uint _96 = INDEX + 4u;
    uvec2 _103 = _10._m0[subgroupBroadcastFirst(_96)] >> uvec2(2u);
    uint _104 = INDEX + 5u;
    uvec2 _111 = _10._m0[subgroupBroadcastFirst(_104)] >> uvec2(1u);
    uint _112 = INDEX + 8u;
    uint _118 = subgroupBroadcastFirst(_112);
    uint _121 = INDEX + 9u;
    uint _127 = subgroupBroadcastFirst(_121);
    uint _141 = uint(UV.y) * 2u;
    uint _146 = (_141 < _94.y) ? (_141 + _94.x) : 2147483644u;
    f16vec2 _158 = uint16BitsToFloat16(u16vec2(_21[_88]._m0[_146], _21[_88]._m0[_146 + 1u]));
    uint _169 = _26[_96]._m0[(_74 < _103.y) ? (_74 + _103.x) : 1073741820u];
    uint _172 = uint(UV.w) * 2u;
    uint _177 = (_172 < _111.y) ? (_172 + _111.x) : 2147483644u;
    uint16_t _179 = _31[_104]._m0[_177];
    uint16_t _182 = _31[_104]._m0[_177 + 1u];
    f16vec2 _184 = uint16BitsToFloat16(u16vec2(_179, _182));
    uvec2 _190 = _10._m0[_118] >> uvec2(1u);
    uint _195 = (4u < _190.y) ? (4u + _190.x) : 2147483644u;
    f16vec4 _210 = uint16BitsToFloat16(u16vec4(_36[_112]._m0[_195], _36[_112]._m0[_195 + 1u], _36[_112]._m0[_195 + 2u], _36[_112]._m0[_195 + 3u]));
    uvec2 _223 = _10._m0[_118] >> uvec2(2u);
    uint _228 = (4u < _223.y) ? (4u + _223.x) : 1073741820u;
    vec4 _242 = uintBitsToFloat(uvec4(_41[_112]._m0[_228], _41[_112]._m0[_228 + 1u], _41[_112]._m0[_228 + 2u], _41[_112]._m0[_228 + 3u]));
    uvec2 _251 = _10._m0[_127] >> uvec2(1u);
    uint _256 = (4u < _251.y) ? (4u + _251.x) : 2147483644u;
    uint16_t _258 = _46[_121]._m0[_256];
    uint16_t _261 = _46[_121]._m0[_256 + 1u];
    uint16_t _264 = _46[_121]._m0[_256 + 2u];
    uint16_t _267 = _46[_121]._m0[_256 + 3u];
    f16vec4 _269 = uint16BitsToFloat16(u16vec4(_258, _261, _264, _267));
    float _278 = (((float(_184.y) + uintBitsToFloat(_15[INDEX]._m0[(_66 < _86.y) ? (_66 + _86.x) : 1073741820u])) + float(_210.x)) + _242.x) + float(_269.x);
    float _279 = ((float(_210.y) + float(_158.x)) + _242.y) + float(_269.y);
    float _280 = (((float(_158.y) + uintBitsToFloat(_169)) + float(_210.z)) + _242.z) + float(_269.z);
    float _281 = ((float(_210.w) + float(_184.x)) + _242.w) + float(_269.w);
    uvec2 _282 = _10._m0[_127] >> uvec2(2u);
    uint _287 = (4u < _282.y) ? (4u + _282.x) : 1073741820u;
    _51[_121]._m0[_287] = floatBitsToUint(_278);
    _51[_121]._m0[_287 + 1u] = floatBitsToUint(_279);
    _51[_121]._m0[_287 + 2u] = floatBitsToUint(_280);
    _51[_121]._m0[_287 + 3u] = floatBitsToUint(_281);
    SV_Target.x = _278;
    SV_Target.y = _279;
    SV_Target.z = _280;
    SV_Target.w = _281;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 306
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability GroupNonUniformBallot
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %53 %57 %61
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SSBO_Offsets"
OpName %12 "SSBO"
OpName %18 "SSBO"
OpName %23 "SSBO"
OpName %28 "SSBO"
OpName %33 "SSBO"
OpName %38 "SSBO"
OpName %43 "SSBO"
OpName %48 "SSBO"
OpName %53 "INDEX"
OpName %57 "UV"
OpName %61 "SV_Target"
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
OpDecorate %17 ArrayStride 2
OpMemberDecorate %18 0 Offset 0
OpDecorate %18 Block
OpDecorate %21 DescriptorSet 0
OpDecorate %21 Binding 0
OpDecorate %21 NonWritable
OpDecorate %21 Restrict
OpDecorate %22 ArrayStride 4
OpMemberDecorate %23 0 Offset 0
OpDecorate %23 Block
OpDecorate %26 DescriptorSet 0
OpDecorate %26 Binding 0
OpDecorate %26 NonWritable
OpDecorate %27 ArrayStride 2
OpMemberDecorate %28 0 Offset 0
OpDecorate %28 Block
OpDecorate %31 DescriptorSet 0
OpDecorate %31 Binding 0
OpDecorate %31 NonWritable
OpDecorate %32 ArrayStride 2
OpMemberDecorate %33 0 Offset 0
OpDecorate %33 Block
OpDecorate %36 DescriptorSet 0
OpDecorate %36 Binding 0
OpDecorate %36 NonWritable
OpDecorate %36 Restrict
OpDecorate %37 ArrayStride 4
OpMemberDecorate %38 0 Offset 0
OpDecorate %38 Block
OpDecorate %41 DescriptorSet 0
OpDecorate %41 Binding 0
OpDecorate %41 NonWritable
OpDecorate %41 Restrict
OpDecorate %42 ArrayStride 2
OpMemberDecorate %43 0 Offset 0
OpDecorate %43 Block
OpDecorate %46 DescriptorSet 0
OpDecorate %46 Binding 0
OpDecorate %46 Aliased
OpDecorate %47 ArrayStride 4
OpMemberDecorate %48 0 Offset 0
OpDecorate %48 Block
OpDecorate %51 DescriptorSet 0
OpDecorate %51 Binding 0
OpDecorate %51 Aliased
OpDecorate %53 Flat
OpDecorate %53 Location 0
OpDecorate %57 Flat
OpDecorate %57 Location 1
OpDecorate %61 Location 0
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
%16 = OpTypeInt 16 0
%17 = OpTypeRuntimeArray %16
%18 = OpTypeStruct %17
%19 = OpTypeRuntimeArray %18
%20 = OpTypePointer StorageBuffer %19
%21 = OpVariable %20 StorageBuffer
%22 = OpTypeRuntimeArray %5
%23 = OpTypeStruct %22
%24 = OpTypeRuntimeArray %23
%25 = OpTypePointer StorageBuffer %24
%26 = OpVariable %25 StorageBuffer
%27 = OpTypeRuntimeArray %16
%28 = OpTypeStruct %27
%29 = OpTypeRuntimeArray %28
%30 = OpTypePointer StorageBuffer %29
%31 = OpVariable %30 StorageBuffer
%32 = OpTypeRuntimeArray %16
%33 = OpTypeStruct %32
%34 = OpTypeRuntimeArray %33
%35 = OpTypePointer StorageBuffer %34
%36 = OpVariable %35 StorageBuffer
%37 = OpTypeRuntimeArray %5
%38 = OpTypeStruct %37
%39 = OpTypeRuntimeArray %38
%40 = OpTypePointer StorageBuffer %39
%41 = OpVariable %40 StorageBuffer
%42 = OpTypeRuntimeArray %16
%43 = OpTypeStruct %42
%44 = OpTypeRuntimeArray %43
%45 = OpTypePointer StorageBuffer %44
%46 = OpVariable %45 StorageBuffer
%47 = OpTypeRuntimeArray %5
%48 = OpTypeStruct %47
%49 = OpTypeRuntimeArray %48
%50 = OpTypePointer StorageBuffer %49
%51 = OpVariable %50 StorageBuffer
%52 = OpTypePointer Input %5
%53 = OpVariable %52 Input
%54 = OpTypeInt 32 1
%55 = OpTypeVector %54 4
%56 = OpTypePointer Input %55
%57 = OpVariable %56 Input
%58 = OpTypeFloat 32
%59 = OpTypeVector %58 4
%60 = OpTypePointer Output %59
%61 = OpVariable %60 Output
%62 = OpTypePointer Input %54
%64 = OpConstant %5 0
%68 = OpConstant %5 1
%72 = OpConstant %5 2
%76 = OpConstant %5 3
%80 = OpTypePointer StorageBuffer %12
%83 = OpTypePointer StorageBuffer %6
%87 = OpConstantComposite %6 %72 %72
%89 = OpTypePointer StorageBuffer %18
%95 = OpConstantComposite %6 %68 %68
%97 = OpConstant %5 4
%98 = OpTypePointer StorageBuffer %23
%105 = OpConstant %5 5
%106 = OpTypePointer StorageBuffer %28
%113 = OpConstant %5 8
%114 = OpTypePointer StorageBuffer %33
%116 = OpTypePointer StorageBuffer %38
%122 = OpConstant %5 9
%123 = OpTypePointer StorageBuffer %43
%125 = OpTypePointer StorageBuffer %48
%133 = OpTypeBool
%136 = OpConstant %5 1073741820
%137 = OpTypePointer StorageBuffer %5
%147 = OpConstant %5 2147483644
%148 = OpTypePointer StorageBuffer %16
%154 = OpTypeVector %16 2
%156 = OpTypeFloat 16
%157 = OpTypeVector %156 2
%207 = OpTypeVector %16 4
%209 = OpTypeVector %156 4
%240 = OpTypeVector %5 4
%299 = OpTypePointer Output %58
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %304
%304 = OpLabel
%63 = OpAccessChain %62 %57 %64
%65 = OpLoad %54 %63
%66 = OpBitcast %5 %65
%67 = OpAccessChain %62 %57 %68
%69 = OpLoad %54 %67
%70 = OpBitcast %5 %69
%71 = OpAccessChain %62 %57 %72
%73 = OpLoad %54 %71
%74 = OpBitcast %5 %73
%75 = OpAccessChain %62 %57 %76
%77 = OpLoad %54 %75
%78 = OpBitcast %5 %77
%79 = OpLoad %5 %53
%81 = OpAccessChain %80 %15 %79
%82 = OpGroupNonUniformBroadcastFirst %5 %76 %79
%84 = OpAccessChain %83 %10 %64 %82
%85 = OpLoad %6 %84
%86 = OpShiftRightLogical %6 %85 %87
%88 = OpIAdd %5 %79 %68
%90 = OpAccessChain %89 %21 %88
%91 = OpGroupNonUniformBroadcastFirst %5 %76 %88
%92 = OpAccessChain %83 %10 %64 %91
%93 = OpLoad %6 %92
%94 = OpShiftRightLogical %6 %93 %95
%96 = OpIAdd %5 %79 %97
%99 = OpAccessChain %98 %26 %96
%100 = OpGroupNonUniformBroadcastFirst %5 %76 %96
%101 = OpAccessChain %83 %10 %64 %100
%102 = OpLoad %6 %101
%103 = OpShiftRightLogical %6 %102 %87
%104 = OpIAdd %5 %79 %105
%107 = OpAccessChain %106 %31 %104
%108 = OpGroupNonUniformBroadcastFirst %5 %76 %104
%109 = OpAccessChain %83 %10 %64 %108
%110 = OpLoad %6 %109
%111 = OpShiftRightLogical %6 %110 %95
%112 = OpIAdd %5 %79 %113
%115 = OpAccessChain %114 %36 %112
%117 = OpAccessChain %116 %41 %112
%118 = OpGroupNonUniformBroadcastFirst %5 %76 %112
%119 = OpAccessChain %83 %10 %64 %118
%120 = OpLoad %6 %119
%121 = OpIAdd %5 %79 %122
%124 = OpAccessChain %123 %46 %121
%126 = OpAccessChain %125 %51 %121
%127 = OpGroupNonUniformBroadcastFirst %5 %76 %121
%128 = OpAccessChain %83 %10 %64 %127
%129 = OpLoad %6 %128
%130 = OpCompositeExtract %5 %86 0
%131 = OpCompositeExtract %5 %86 1
%132 = OpIAdd %5 %66 %130
%134 = OpULessThan %133 %66 %131
%135 = OpSelect %5 %134 %132 %136
%138 = OpAccessChain %137 %81 %64 %135
%139 = OpLoad %5 %138
%140 = OpBitcast %58 %139
%141 = OpIMul %5 %70 %72
%142 = OpCompositeExtract %5 %94 0
%143 = OpCompositeExtract %5 %94 1
%144 = OpIAdd %5 %141 %142
%145 = OpULessThan %133 %141 %143
%146 = OpSelect %5 %145 %144 %147
%149 = OpAccessChain %148 %90 %64 %146
%150 = OpLoad %16 %149
%152 = OpIAdd %5 %146 %68
%151 = OpAccessChain %148 %90 %64 %152
%153 = OpLoad %16 %151
%155 = OpCompositeConstruct %154 %150 %153
%158 = OpBitcast %157 %155
%159 = OpCompositeExtract %156 %158 0
%160 = OpCompositeExtract %156 %158 1
%161 = OpFConvert %58 %159
%162 = OpFConvert %58 %160
%163 = OpCompositeExtract %5 %103 0
%164 = OpCompositeExtract %5 %103 1
%165 = OpIAdd %5 %74 %163
%166 = OpULessThan %133 %74 %164
%167 = OpSelect %5 %166 %165 %136
%168 = OpAccessChain %137 %99 %64 %167
%169 = OpLoad %5 %168
%170 = OpBitcast %58 %169
%171 = OpFAdd %58 %162 %170
%172 = OpIMul %5 %78 %72
%173 = OpCompositeExtract %5 %111 0
%174 = OpCompositeExtract %5 %111 1
%175 = OpIAdd %5 %172 %173
%176 = OpULessThan %133 %172 %174
%177 = OpSelect %5 %176 %175 %147
%178 = OpAccessChain %148 %107 %64 %177
%179 = OpLoad %16 %178
%181 = OpIAdd %5 %177 %68
%180 = OpAccessChain %148 %107 %64 %181
%182 = OpLoad %16 %180
%183 = OpCompositeConstruct %154 %179 %182
%184 = OpBitcast %157 %183
%185 = OpCompositeExtract %156 %184 0
%186 = OpCompositeExtract %156 %184 1
%187 = OpFConvert %58 %185
%188 = OpFConvert %58 %186
%189 = OpFAdd %58 %188 %140
%190 = OpShiftRightLogical %6 %120 %95
%191 = OpCompositeExtract %5 %190 0
%192 = OpCompositeExtract %5 %190 1
%193 = OpIAdd %5 %97 %191
%194 = OpULessThan %133 %97 %192
%195 = OpSelect %5 %194 %193 %147
%196 = OpAccessChain %148 %115 %64 %195
%197 = OpLoad %16 %196
%199 = OpIAdd %5 %195 %68
%198 = OpAccessChain %148 %115 %64 %199
%200 = OpLoad %16 %198
%202 = OpIAdd %5 %195 %72
%201 = OpAccessChain %148 %115 %64 %202
%203 = OpLoad %16 %201
%205 = OpIAdd %5 %195 %76
%204 = OpAccessChain %148 %115 %64 %205
%206 = OpLoad %16 %204
%208 = OpCompositeConstruct %207 %197 %200 %203 %206
%210 = OpBitcast %209 %208
%211 = OpCompositeExtract %156 %210 0
%212 = OpCompositeExtract %156 %210 1
%213 = OpCompositeExtract %156 %210 2
%214 = OpCompositeExtract %156 %210 3
%215 = OpFConvert %58 %211
%216 = OpFConvert %58 %212
%217 = OpFConvert %58 %213
%218 = OpFConvert %58 %214
%219 = OpFAdd %58 %189 %215
%220 = OpFAdd %58 %216 %161
%221 = OpFAdd %58 %171 %217
%222 = OpFAdd %58 %218 %187
%223 = OpShiftRightLogical %6 %120 %87
%224 = OpCompositeExtract %5 %223 0
%225 = OpCompositeExtract %5 %223 1
%226 = OpIAdd %5 %97 %224
%227 = OpULessThan %133 %97 %225
%228 = OpSelect %5 %227 %226 %136
%229 = OpAccessChain %137 %117 %64 %228
%230 = OpLoad %5 %229
%232 = OpIAdd %5 %228 %68
%231 = OpAccessChain %137 %117 %64 %232
%233 = OpLoad %5 %231
%235 = OpIAdd %5 %228 %72
%234 = OpAccessChain %137 %117 %64 %235
%236 = OpLoad %5 %234
%238 = OpIAdd %5 %228 %76
%237 = OpAccessChain %137 %117 %64 %238
%239 = OpLoad %5 %237
%241 = OpCompositeConstruct %240 %230 %233 %236 %239
%242 = OpBitcast %59 %241
%243 = OpCompositeExtract %58 %242 0
%244 = OpCompositeExtract %58 %242 1
%245 = OpCompositeExtract %58 %242 2
%246 = OpCompositeExtract %58 %242 3
%247 = OpFAdd %58 %219 %243
%248 = OpFAdd %58 %220 %244
%249 = OpFAdd %58 %221 %245
%250 = OpFAdd %58 %222 %246
%251 = OpShiftRightLogical %6 %129 %95
%252 = OpCompositeExtract %5 %251 0
%253 = OpCompositeExtract %5 %251 1
%254 = OpIAdd %5 %97 %252
%255 = OpULessThan %133 %97 %253
%256 = OpSelect %5 %255 %254 %147
%257 = OpAccessChain %148 %124 %64 %256
%258 = OpLoad %16 %257
%260 = OpIAdd %5 %256 %68
%259 = OpAccessChain %148 %124 %64 %260
%261 = OpLoad %16 %259
%263 = OpIAdd %5 %256 %72
%262 = OpAccessChain %148 %124 %64 %263
%264 = OpLoad %16 %262
%266 = OpIAdd %5 %256 %76
%265 = OpAccessChain %148 %124 %64 %266
%267 = OpLoad %16 %265
%268 = OpCompositeConstruct %207 %258 %261 %264 %267
%269 = OpBitcast %209 %268
%270 = OpCompositeExtract %156 %269 0
%271 = OpCompositeExtract %156 %269 1
%272 = OpCompositeExtract %156 %269 2
%273 = OpCompositeExtract %156 %269 3
%274 = OpFConvert %58 %270
%275 = OpFConvert %58 %271
%276 = OpFConvert %58 %272
%277 = OpFConvert %58 %273
%278 = OpFAdd %58 %247 %274
%279 = OpFAdd %58 %248 %275
%280 = OpFAdd %58 %249 %276
%281 = OpFAdd %58 %250 %277
%282 = OpShiftRightLogical %6 %129 %87
%283 = OpCompositeExtract %5 %282 0
%284 = OpCompositeExtract %5 %282 1
%285 = OpIAdd %5 %97 %283
%286 = OpULessThan %133 %97 %284
%287 = OpSelect %5 %286 %285 %136
%288 = OpBitcast %5 %278
%289 = OpBitcast %5 %279
%290 = OpBitcast %5 %280
%291 = OpBitcast %5 %281
%292 = OpAccessChain %137 %126 %64 %287
OpStore %292 %288
%294 = OpIAdd %5 %287 %68
%293 = OpAccessChain %137 %126 %64 %294
OpStore %293 %289
%296 = OpIAdd %5 %287 %72
%295 = OpAccessChain %137 %126 %64 %296
OpStore %295 %290
%298 = OpIAdd %5 %287 %76
%297 = OpAccessChain %137 %126 %64 %298
OpStore %297 %291
%300 = OpAccessChain %299 %61 %64
OpStore %300 %278
%301 = OpAccessChain %299 %61 %68
OpStore %301 %279
%302 = OpAccessChain %299 %61 %72
OpStore %302 %280
%303 = OpAccessChain %299 %61 %76
OpStore %303 %281
OpReturn
OpFunctionEnd
#endif
