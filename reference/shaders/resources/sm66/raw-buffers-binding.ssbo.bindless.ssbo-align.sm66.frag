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
    uint16_t _m0[];
} _29[];

layout(set = 1, binding = 0, std430) restrict readonly buffer _31_34
{
    uint _m0[];
} _34[];

layout(set = 4, binding = 0, std430) readonly buffer _36_39
{
    uint _m0[];
} _39[];

layout(set = 4, binding = 0, std430) readonly buffer _41_44
{
    uint16_t _m0[];
} _44[];

layout(set = 4, binding = 0, std430) buffer _46_49
{
    uint16_t _m0[];
} _49[];

layout(set = 4, binding = 0, std430) buffer _51_54
{
    uint _m0[];
} _54[];

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
    uint _69 = uint(UV.x);
    uint _77 = uint(UV.z);
    uvec2 _91 = _13._m0[subgroupBroadcastFirst(registers._m1)] >> uvec2(2u);
    uint _108 = registers._m1 + 1u;
    uvec2 _112 = _13._m0[subgroupBroadcastFirst(_108)] >> uvec2(1u);
    uint _114 = uint(UV.y) * 2u;
    uint _119 = (_114 < _112.y) ? (_114 + _112.x) : 2147483644u;
    f16vec2 _131 = uint16BitsToFloat16(u16vec2(_24[_108]._m0[_119], _24[_108]._m0[_119 + 1u]));
    uint _141 = registers._m4 + 2u;
    uvec2 _145 = _13._m0[subgroupBroadcastFirst(_141)] >> uvec2(2u);
    uint _152 = _39[_141]._m0[(_77 < _145.y) ? (_77 + _145.x) : 1073741820u];
    uint _159 = registers._m4 + 3u;
    uvec2 _163 = _13._m0[subgroupBroadcastFirst(_159)] >> uvec2(1u);
    uint _164 = uint(UV.w) * 2u;
    uint _169 = (_164 < _163.y) ? (_164 + _163.x) : 2147483644u;
    uint16_t _171 = _44[_159]._m0[_169];
    uint16_t _174 = _44[_159]._m0[_169 + 1u];
    f16vec2 _176 = uint16BitsToFloat16(u16vec2(_171, _174));
    uint _186 = registers._m1 + 4u;
    uint _191 = registers._m1 + 4u;
    uint _192 = subgroupBroadcastFirst(_191);
    uvec2 _195 = _13._m0[_192] >> uvec2(1u);
    uint _200 = (4u < _195.y) ? (4u + _195.x) : 2147483644u;
    f16vec4 _215 = uint16BitsToFloat16(u16vec4(_29[_186]._m0[_200], _29[_186]._m0[_200 + 1u], _29[_186]._m0[_200 + 2u], _29[_186]._m0[_200 + 3u]));
    uvec2 _228 = _13._m0[_192] >> uvec2(2u);
    uint _233 = (4u < _228.y) ? (4u + _228.x) : 1073741820u;
    vec4 _247 = uintBitsToFloat(uvec4(_34[_191]._m0[_233], _34[_191]._m0[_233 + 1u], _34[_191]._m0[_233 + 2u], _34[_191]._m0[_233 + 3u]));
    uint _260 = registers._m4 + 5u;
    uint _266 = registers._m4 + 5u;
    uint _267 = subgroupBroadcastFirst(_266);
    uvec2 _270 = _13._m0[_267] >> uvec2(1u);
    uint _275 = (4u < _270.y) ? (4u + _270.x) : 2147483644u;
    uint16_t _277 = _49[_260]._m0[_275];
    uint16_t _280 = _49[_260]._m0[_275 + 1u];
    uint16_t _283 = _49[_260]._m0[_275 + 2u];
    uint16_t _286 = _49[_260]._m0[_275 + 3u];
    f16vec4 _288 = uint16BitsToFloat16(u16vec4(_277, _280, _283, _286));
    float _297 = (((float(_176.y) + uintBitsToFloat(_18[registers._m1]._m0[(_69 < _91.y) ? (_69 + _91.x) : 1073741820u])) + float(_215.x)) + _247.x) + float(_288.x);
    float _298 = ((float(_215.y) + float(_131.x)) + _247.y) + float(_288.y);
    float _299 = (((uintBitsToFloat(_152) + float(_131.y)) + float(_215.z)) + _247.z) + float(_288.z);
    float _300 = ((float(_215.w) + float(_176.x)) + _247.w) + float(_288.w);
    uvec2 _301 = _13._m0[_267] >> uvec2(2u);
    uint _306 = (4u < _301.y) ? (4u + _301.x) : 1073741820u;
    _54[_266]._m0[_306] = floatBitsToUint(_297);
    _54[_266]._m0[_306 + 1u] = floatBitsToUint(_298);
    _54[_266]._m0[_306 + 2u] = floatBitsToUint(_299);
    _54[_266]._m0[_306 + 3u] = floatBitsToUint(_300);
    SV_Target.x = _297;
    SV_Target.y = _298;
    SV_Target.z = _299;
    SV_Target.w = _300;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 325
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
OpEntryPoint Fragment %3 "main" %56 %60 %64
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
OpName %56 "INDEX"
OpName %60 "UV"
OpName %64 "SV_Target"
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
OpDecorate %25 ArrayStride 2
OpMemberDecorate %26 0 Offset 0
OpDecorate %26 Block
OpDecorate %29 DescriptorSet 1
OpDecorate %29 Binding 0
OpDecorate %29 NonWritable
OpDecorate %29 Restrict
OpDecorate %30 ArrayStride 4
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
OpDecorate %40 ArrayStride 2
OpMemberDecorate %41 0 Offset 0
OpDecorate %41 Block
OpDecorate %44 DescriptorSet 4
OpDecorate %44 Binding 0
OpDecorate %44 NonWritable
OpDecorate %45 ArrayStride 2
OpMemberDecorate %46 0 Offset 0
OpDecorate %46 Block
OpDecorate %49 DescriptorSet 4
OpDecorate %49 Binding 0
OpDecorate %49 Aliased
OpDecorate %50 ArrayStride 4
OpMemberDecorate %51 0 Offset 0
OpDecorate %51 Block
OpDecorate %54 DescriptorSet 4
OpDecorate %54 Binding 0
OpDecorate %54 Aliased
OpDecorate %56 Flat
OpDecorate %56 Location 0
OpDecorate %60 Flat
OpDecorate %60 Location 1
OpDecorate %64 Location 0
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
%25 = OpTypeRuntimeArray %19
%26 = OpTypeStruct %25
%27 = OpTypeRuntimeArray %26
%28 = OpTypePointer StorageBuffer %27
%29 = OpVariable %28 StorageBuffer
%30 = OpTypeRuntimeArray %5
%31 = OpTypeStruct %30
%32 = OpTypeRuntimeArray %31
%33 = OpTypePointer StorageBuffer %32
%34 = OpVariable %33 StorageBuffer
%35 = OpTypeRuntimeArray %5
%36 = OpTypeStruct %35
%37 = OpTypeRuntimeArray %36
%38 = OpTypePointer StorageBuffer %37
%39 = OpVariable %38 StorageBuffer
%40 = OpTypeRuntimeArray %19
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
%55 = OpTypePointer Input %5
%56 = OpVariable %55 Input
%57 = OpTypeInt 32 1
%58 = OpTypeVector %57 4
%59 = OpTypePointer Input %58
%60 = OpVariable %59 Input
%61 = OpTypeFloat 32
%62 = OpTypeVector %61 4
%63 = OpTypePointer Output %62
%64 = OpVariable %63 Output
%65 = OpTypePointer Input %57
%67 = OpConstant %5 0
%71 = OpConstant %5 1
%75 = OpConstant %5 2
%79 = OpConstant %5 3
%82 = OpTypePointer StorageBuffer %15
%84 = OpTypePointer PushConstant %5
%88 = OpTypePointer StorageBuffer %9
%92 = OpConstantComposite %9 %75 %75
%96 = OpTypeBool
%99 = OpConstant %5 1073741820
%100 = OpTypePointer StorageBuffer %5
%104 = OpTypePointer StorageBuffer %21
%113 = OpConstantComposite %9 %71 %71
%120 = OpConstant %5 2147483644
%121 = OpTypePointer StorageBuffer %19
%127 = OpTypeVector %19 2
%129 = OpTypeFloat 16
%130 = OpTypeVector %129 2
%136 = OpTypePointer StorageBuffer %36
%139 = OpConstant %5 4
%155 = OpTypePointer StorageBuffer %41
%182 = OpTypePointer StorageBuffer %26
%187 = OpTypePointer StorageBuffer %31
%212 = OpTypeVector %19 4
%214 = OpTypeVector %129 4
%245 = OpTypeVector %5 4
%256 = OpTypePointer StorageBuffer %46
%261 = OpConstant %5 5
%262 = OpTypePointer StorageBuffer %51
%318 = OpTypePointer Output %61
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %323
%323 = OpLabel
%66 = OpAccessChain %65 %60 %67
%68 = OpLoad %57 %66
%69 = OpBitcast %5 %68
%70 = OpAccessChain %65 %60 %71
%72 = OpLoad %57 %70
%73 = OpBitcast %5 %72
%74 = OpAccessChain %65 %60 %75
%76 = OpLoad %57 %74
%77 = OpBitcast %5 %76
%78 = OpAccessChain %65 %60 %79
%80 = OpLoad %57 %78
%81 = OpBitcast %5 %80
%85 = OpAccessChain %84 %8 %71
%86 = OpLoad %5 %85
%83 = OpAccessChain %82 %18 %86
%87 = OpGroupNonUniformBroadcastFirst %5 %79 %86
%89 = OpAccessChain %88 %13 %67 %87
%90 = OpLoad %9 %89
%91 = OpShiftRightLogical %9 %90 %92
%93 = OpCompositeExtract %5 %91 0
%94 = OpCompositeExtract %5 %91 1
%95 = OpIAdd %5 %69 %93
%97 = OpULessThan %96 %69 %94
%98 = OpSelect %5 %97 %95 %99
%101 = OpAccessChain %100 %83 %67 %98
%102 = OpLoad %5 %101
%103 = OpBitcast %61 %102
%106 = OpAccessChain %84 %8 %71
%107 = OpLoad %5 %106
%108 = OpIAdd %5 %107 %71
%105 = OpAccessChain %104 %24 %108
%109 = OpGroupNonUniformBroadcastFirst %5 %79 %108
%110 = OpAccessChain %88 %13 %67 %109
%111 = OpLoad %9 %110
%112 = OpShiftRightLogical %9 %111 %113
%114 = OpIMul %5 %73 %75
%115 = OpCompositeExtract %5 %112 0
%116 = OpCompositeExtract %5 %112 1
%117 = OpIAdd %5 %114 %115
%118 = OpULessThan %96 %114 %116
%119 = OpSelect %5 %118 %117 %120
%122 = OpAccessChain %121 %105 %67 %119
%123 = OpLoad %19 %122
%125 = OpIAdd %5 %119 %71
%124 = OpAccessChain %121 %105 %67 %125
%126 = OpLoad %19 %124
%128 = OpCompositeConstruct %127 %123 %126
%131 = OpBitcast %130 %128
%132 = OpCompositeExtract %129 %131 0
%133 = OpCompositeExtract %129 %131 1
%134 = OpFConvert %61 %132
%135 = OpFConvert %61 %133
%138 = OpAccessChain %84 %8 %139
%140 = OpLoad %5 %138
%141 = OpIAdd %5 %140 %75
%137 = OpAccessChain %136 %39 %141
%142 = OpGroupNonUniformBroadcastFirst %5 %79 %141
%143 = OpAccessChain %88 %13 %67 %142
%144 = OpLoad %9 %143
%145 = OpShiftRightLogical %9 %144 %92
%146 = OpCompositeExtract %5 %145 0
%147 = OpCompositeExtract %5 %145 1
%148 = OpIAdd %5 %77 %146
%149 = OpULessThan %96 %77 %147
%150 = OpSelect %5 %149 %148 %99
%151 = OpAccessChain %100 %137 %67 %150
%152 = OpLoad %5 %151
%153 = OpBitcast %61 %152
%154 = OpFAdd %61 %153 %135
%157 = OpAccessChain %84 %8 %139
%158 = OpLoad %5 %157
%159 = OpIAdd %5 %158 %79
%156 = OpAccessChain %155 %44 %159
%160 = OpGroupNonUniformBroadcastFirst %5 %79 %159
%161 = OpAccessChain %88 %13 %67 %160
%162 = OpLoad %9 %161
%163 = OpShiftRightLogical %9 %162 %113
%164 = OpIMul %5 %81 %75
%165 = OpCompositeExtract %5 %163 0
%166 = OpCompositeExtract %5 %163 1
%167 = OpIAdd %5 %164 %165
%168 = OpULessThan %96 %164 %166
%169 = OpSelect %5 %168 %167 %120
%170 = OpAccessChain %121 %156 %67 %169
%171 = OpLoad %19 %170
%173 = OpIAdd %5 %169 %71
%172 = OpAccessChain %121 %156 %67 %173
%174 = OpLoad %19 %172
%175 = OpCompositeConstruct %127 %171 %174
%176 = OpBitcast %130 %175
%177 = OpCompositeExtract %129 %176 0
%178 = OpCompositeExtract %129 %176 1
%179 = OpFConvert %61 %177
%180 = OpFConvert %61 %178
%181 = OpFAdd %61 %180 %103
%184 = OpAccessChain %84 %8 %71
%185 = OpLoad %5 %184
%186 = OpIAdd %5 %185 %139
%183 = OpAccessChain %182 %29 %186
%189 = OpAccessChain %84 %8 %71
%190 = OpLoad %5 %189
%191 = OpIAdd %5 %190 %139
%188 = OpAccessChain %187 %34 %191
%192 = OpGroupNonUniformBroadcastFirst %5 %79 %191
%193 = OpAccessChain %88 %13 %67 %192
%194 = OpLoad %9 %193
%195 = OpShiftRightLogical %9 %194 %113
%196 = OpCompositeExtract %5 %195 0
%197 = OpCompositeExtract %5 %195 1
%198 = OpIAdd %5 %139 %196
%199 = OpULessThan %96 %139 %197
%200 = OpSelect %5 %199 %198 %120
%201 = OpAccessChain %121 %183 %67 %200
%202 = OpLoad %19 %201
%204 = OpIAdd %5 %200 %71
%203 = OpAccessChain %121 %183 %67 %204
%205 = OpLoad %19 %203
%207 = OpIAdd %5 %200 %75
%206 = OpAccessChain %121 %183 %67 %207
%208 = OpLoad %19 %206
%210 = OpIAdd %5 %200 %79
%209 = OpAccessChain %121 %183 %67 %210
%211 = OpLoad %19 %209
%213 = OpCompositeConstruct %212 %202 %205 %208 %211
%215 = OpBitcast %214 %213
%216 = OpCompositeExtract %129 %215 0
%217 = OpCompositeExtract %129 %215 1
%218 = OpCompositeExtract %129 %215 2
%219 = OpCompositeExtract %129 %215 3
%220 = OpFConvert %61 %216
%221 = OpFConvert %61 %217
%222 = OpFConvert %61 %218
%223 = OpFConvert %61 %219
%224 = OpFAdd %61 %181 %220
%225 = OpFAdd %61 %221 %134
%226 = OpFAdd %61 %154 %222
%227 = OpFAdd %61 %223 %179
%228 = OpShiftRightLogical %9 %194 %92
%229 = OpCompositeExtract %5 %228 0
%230 = OpCompositeExtract %5 %228 1
%231 = OpIAdd %5 %139 %229
%232 = OpULessThan %96 %139 %230
%233 = OpSelect %5 %232 %231 %99
%234 = OpAccessChain %100 %188 %67 %233
%235 = OpLoad %5 %234
%237 = OpIAdd %5 %233 %71
%236 = OpAccessChain %100 %188 %67 %237
%238 = OpLoad %5 %236
%240 = OpIAdd %5 %233 %75
%239 = OpAccessChain %100 %188 %67 %240
%241 = OpLoad %5 %239
%243 = OpIAdd %5 %233 %79
%242 = OpAccessChain %100 %188 %67 %243
%244 = OpLoad %5 %242
%246 = OpCompositeConstruct %245 %235 %238 %241 %244
%247 = OpBitcast %62 %246
%248 = OpCompositeExtract %61 %247 0
%249 = OpCompositeExtract %61 %247 1
%250 = OpCompositeExtract %61 %247 2
%251 = OpCompositeExtract %61 %247 3
%252 = OpFAdd %61 %224 %248
%253 = OpFAdd %61 %225 %249
%254 = OpFAdd %61 %226 %250
%255 = OpFAdd %61 %227 %251
%258 = OpAccessChain %84 %8 %139
%259 = OpLoad %5 %258
%260 = OpIAdd %5 %259 %261
%257 = OpAccessChain %256 %49 %260
%264 = OpAccessChain %84 %8 %139
%265 = OpLoad %5 %264
%266 = OpIAdd %5 %265 %261
%263 = OpAccessChain %262 %54 %266
%267 = OpGroupNonUniformBroadcastFirst %5 %79 %266
%268 = OpAccessChain %88 %13 %67 %267
%269 = OpLoad %9 %268
%270 = OpShiftRightLogical %9 %269 %113
%271 = OpCompositeExtract %5 %270 0
%272 = OpCompositeExtract %5 %270 1
%273 = OpIAdd %5 %139 %271
%274 = OpULessThan %96 %139 %272
%275 = OpSelect %5 %274 %273 %120
%276 = OpAccessChain %121 %257 %67 %275
%277 = OpLoad %19 %276
%279 = OpIAdd %5 %275 %71
%278 = OpAccessChain %121 %257 %67 %279
%280 = OpLoad %19 %278
%282 = OpIAdd %5 %275 %75
%281 = OpAccessChain %121 %257 %67 %282
%283 = OpLoad %19 %281
%285 = OpIAdd %5 %275 %79
%284 = OpAccessChain %121 %257 %67 %285
%286 = OpLoad %19 %284
%287 = OpCompositeConstruct %212 %277 %280 %283 %286
%288 = OpBitcast %214 %287
%289 = OpCompositeExtract %129 %288 0
%290 = OpCompositeExtract %129 %288 1
%291 = OpCompositeExtract %129 %288 2
%292 = OpCompositeExtract %129 %288 3
%293 = OpFConvert %61 %289
%294 = OpFConvert %61 %290
%295 = OpFConvert %61 %291
%296 = OpFConvert %61 %292
%297 = OpFAdd %61 %252 %293
%298 = OpFAdd %61 %253 %294
%299 = OpFAdd %61 %254 %295
%300 = OpFAdd %61 %255 %296
%301 = OpShiftRightLogical %9 %269 %92
%302 = OpCompositeExtract %5 %301 0
%303 = OpCompositeExtract %5 %301 1
%304 = OpIAdd %5 %139 %302
%305 = OpULessThan %96 %139 %303
%306 = OpSelect %5 %305 %304 %99
%307 = OpBitcast %5 %297
%308 = OpBitcast %5 %298
%309 = OpBitcast %5 %299
%310 = OpBitcast %5 %300
%311 = OpAccessChain %100 %263 %67 %306
OpStore %311 %307
%313 = OpIAdd %5 %306 %71
%312 = OpAccessChain %100 %263 %67 %313
OpStore %312 %308
%315 = OpIAdd %5 %306 %75
%314 = OpAccessChain %100 %263 %67 %315
OpStore %314 %309
%317 = OpIAdd %5 %306 %79
%316 = OpAccessChain %100 %263 %67 %317
OpStore %316 %310
%319 = OpAccessChain %318 %64 %67
OpStore %319 %297
%320 = OpAccessChain %318 %64 %71
OpStore %320 %298
%321 = OpAccessChain %318 %64 %75
OpStore %321 %299
%322 = OpAccessChain %318 %64 %79
OpStore %322 %300
OpReturn
OpFunctionEnd
#endif
