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

layout(set = 1, binding = 0, std430) restrict readonly buffer _27_30
{
    u16vec4 _m0[];
} _30[];

layout(set = 1, binding = 0, std430) restrict readonly buffer _33_36
{
    uvec4 _m0[];
} _36[];

layout(set = 4, binding = 0, std430) readonly buffer _38_41
{
    uint _m0[];
} _41[];

layout(set = 4, binding = 0, std430) readonly buffer _43_46
{
    uint16_t _m0[];
} _46[];

layout(set = 4, binding = 0, std430) buffer _48_51
{
    u16vec4 _m0[];
} _51[];

layout(set = 4, binding = 0, std430) buffer _53_56
{
    uvec4 _m0[];
} _56[];

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
    uint _71 = uint(UV.x);
    uint _79 = uint(UV.z);
    uvec2 _93 = _13._m0[subgroupBroadcastFirst(registers._m1)] >> uvec2(2u);
    uint _110 = registers._m1 + 1u;
    uvec2 _114 = _13._m0[subgroupBroadcastFirst(_110)] >> uvec2(1u);
    uint _116 = uint(UV.y) * 2u;
    uint _121 = (_116 < _114.y) ? (_116 + _114.x) : 2147483644u;
    f16vec2 _133 = uint16BitsToFloat16(u16vec2(_24[_110]._m0[_121], _24[_110]._m0[_121 + 1u]));
    uint _143 = registers._m4 + 2u;
    uvec2 _147 = _13._m0[subgroupBroadcastFirst(_143)] >> uvec2(2u);
    uint _154 = _41[_143]._m0[(_79 < _147.y) ? (_79 + _147.x) : 1073741820u];
    uint _161 = registers._m4 + 3u;
    uvec2 _165 = _13._m0[subgroupBroadcastFirst(_161)] >> uvec2(1u);
    uint _166 = uint(UV.w) * 2u;
    uint _171 = (_166 < _165.y) ? (_166 + _165.x) : 2147483644u;
    uint16_t _173 = _46[_161]._m0[_171];
    uint16_t _176 = _46[_161]._m0[_171 + 1u];
    f16vec2 _178 = uint16BitsToFloat16(u16vec2(_173, _176));
    uint _193 = registers._m1 + 4u;
    uint _194 = subgroupBroadcastFirst(_193);
    uvec2 _197 = _13._m0[_194] >> uvec2(1u);
    f16vec4 _207 = uint16BitsToFloat16(_30[registers._m1 + 4u]._m0[(1u < _197.y) ? (1u + _197.x) : 2147483644u]);
    uvec2 _220 = _13._m0[_194] >> uvec2(2u);
    vec4 _229 = uintBitsToFloat(_36[_193]._m0[(1u < _220.y) ? (1u + _220.x) : 1073741820u]);
    uint _248 = registers._m4 + 5u;
    uint _249 = subgroupBroadcastFirst(_248);
    uvec2 _252 = _13._m0[_249] >> uvec2(1u);
    u16vec4 _259 = _51[registers._m4 + 5u]._m0[(1u < _252.y) ? (1u + _252.x) : 2147483644u];
    f16vec4 _260 = uint16BitsToFloat16(_259);
    float _269 = (((float(_178.y) + uintBitsToFloat(_18[registers._m1]._m0[(_71 < _93.y) ? (_71 + _93.x) : 1073741820u])) + float(_207.x)) + _229.x) + float(_260.x);
    float _270 = ((float(_207.y) + float(_133.x)) + _229.y) + float(_260.y);
    float _271 = (((uintBitsToFloat(_154) + float(_133.y)) + float(_207.z)) + _229.z) + float(_260.z);
    float _272 = ((float(_207.w) + float(_178.x)) + _229.w) + float(_260.w);
    uvec2 _273 = _13._m0[_249] >> uvec2(2u);
    _56[_248]._m0[(1u < _273.y) ? (1u + _273.x) : 1073741820u] = uvec4(floatBitsToUint(_269), floatBitsToUint(_270), floatBitsToUint(_271), floatBitsToUint(_272));
    SV_Target.x = _269;
    SV_Target.y = _270;
    SV_Target.z = _271;
    SV_Target.w = _272;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 292
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
OpEntryPoint Fragment %3 "main" %58 %62 %66
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %11 "SSBO_Offsets"
OpName %15 "SSBO"
OpName %21 "SSBO"
OpName %27 "SSBO"
OpName %33 "SSBO"
OpName %38 "SSBO"
OpName %43 "SSBO"
OpName %48 "SSBO"
OpName %53 "SSBO"
OpName %58 "INDEX"
OpName %62 "UV"
OpName %66 "SV_Target"
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
OpDecorate %26 ArrayStride 8
OpMemberDecorate %27 0 Offset 0
OpDecorate %27 Block
OpDecorate %30 DescriptorSet 1
OpDecorate %30 Binding 0
OpDecorate %30 NonWritable
OpDecorate %30 Restrict
OpDecorate %32 ArrayStride 16
OpMemberDecorate %33 0 Offset 0
OpDecorate %33 Block
OpDecorate %36 DescriptorSet 1
OpDecorate %36 Binding 0
OpDecorate %36 NonWritable
OpDecorate %36 Restrict
OpDecorate %37 ArrayStride 4
OpMemberDecorate %38 0 Offset 0
OpDecorate %38 Block
OpDecorate %41 DescriptorSet 4
OpDecorate %41 Binding 0
OpDecorate %41 NonWritable
OpDecorate %42 ArrayStride 2
OpMemberDecorate %43 0 Offset 0
OpDecorate %43 Block
OpDecorate %46 DescriptorSet 4
OpDecorate %46 Binding 0
OpDecorate %46 NonWritable
OpDecorate %47 ArrayStride 8
OpMemberDecorate %48 0 Offset 0
OpDecorate %48 Block
OpDecorate %51 DescriptorSet 4
OpDecorate %51 Binding 0
OpDecorate %51 Aliased
OpDecorate %52 ArrayStride 16
OpMemberDecorate %53 0 Offset 0
OpDecorate %53 Block
OpDecorate %56 DescriptorSet 4
OpDecorate %56 Binding 0
OpDecorate %56 Aliased
OpDecorate %58 Flat
OpDecorate %58 Location 0
OpDecorate %62 Flat
OpDecorate %62 Location 1
OpDecorate %66 Location 0
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
%25 = OpTypeVector %19 4
%26 = OpTypeRuntimeArray %25
%27 = OpTypeStruct %26
%28 = OpTypeRuntimeArray %27
%29 = OpTypePointer StorageBuffer %28
%30 = OpVariable %29 StorageBuffer
%31 = OpTypeVector %5 4
%32 = OpTypeRuntimeArray %31
%33 = OpTypeStruct %32
%34 = OpTypeRuntimeArray %33
%35 = OpTypePointer StorageBuffer %34
%36 = OpVariable %35 StorageBuffer
%37 = OpTypeRuntimeArray %5
%38 = OpTypeStruct %37
%39 = OpTypeRuntimeArray %38
%40 = OpTypePointer StorageBuffer %39
%41 = OpVariable %40 StorageBuffer
%42 = OpTypeRuntimeArray %19
%43 = OpTypeStruct %42
%44 = OpTypeRuntimeArray %43
%45 = OpTypePointer StorageBuffer %44
%46 = OpVariable %45 StorageBuffer
%47 = OpTypeRuntimeArray %25
%48 = OpTypeStruct %47
%49 = OpTypeRuntimeArray %48
%50 = OpTypePointer StorageBuffer %49
%51 = OpVariable %50 StorageBuffer
%52 = OpTypeRuntimeArray %31
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
%84 = OpTypePointer StorageBuffer %15
%86 = OpTypePointer PushConstant %5
%90 = OpTypePointer StorageBuffer %9
%94 = OpConstantComposite %9 %77 %77
%98 = OpTypeBool
%101 = OpConstant %5 1073741820
%102 = OpTypePointer StorageBuffer %5
%106 = OpTypePointer StorageBuffer %21
%115 = OpConstantComposite %9 %73 %73
%122 = OpConstant %5 2147483644
%123 = OpTypePointer StorageBuffer %19
%129 = OpTypeVector %19 2
%131 = OpTypeFloat 16
%132 = OpTypeVector %131 2
%138 = OpTypePointer StorageBuffer %38
%141 = OpConstant %5 4
%157 = OpTypePointer StorageBuffer %43
%184 = OpTypePointer StorageBuffer %27
%189 = OpTypePointer StorageBuffer %33
%203 = OpTypePointer StorageBuffer %25
%206 = OpTypeVector %131 4
%226 = OpTypePointer StorageBuffer %31
%238 = OpTypePointer StorageBuffer %48
%243 = OpConstant %5 5
%244 = OpTypePointer StorageBuffer %53
%285 = OpTypePointer Output %63
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %290
%290 = OpLabel
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
%87 = OpAccessChain %86 %8 %73
%88 = OpLoad %5 %87
%85 = OpAccessChain %84 %18 %88
%89 = OpGroupNonUniformBroadcastFirst %5 %81 %88
%91 = OpAccessChain %90 %13 %69 %89
%92 = OpLoad %9 %91
%93 = OpShiftRightLogical %9 %92 %94
%95 = OpCompositeExtract %5 %93 0
%96 = OpCompositeExtract %5 %93 1
%97 = OpIAdd %5 %71 %95
%99 = OpULessThan %98 %71 %96
%100 = OpSelect %5 %99 %97 %101
%103 = OpAccessChain %102 %85 %69 %100
%104 = OpLoad %5 %103
%105 = OpBitcast %63 %104
%108 = OpAccessChain %86 %8 %73
%109 = OpLoad %5 %108
%110 = OpIAdd %5 %109 %73
%107 = OpAccessChain %106 %24 %110
%111 = OpGroupNonUniformBroadcastFirst %5 %81 %110
%112 = OpAccessChain %90 %13 %69 %111
%113 = OpLoad %9 %112
%114 = OpShiftRightLogical %9 %113 %115
%116 = OpIMul %5 %75 %77
%117 = OpCompositeExtract %5 %114 0
%118 = OpCompositeExtract %5 %114 1
%119 = OpIAdd %5 %116 %117
%120 = OpULessThan %98 %116 %118
%121 = OpSelect %5 %120 %119 %122
%124 = OpAccessChain %123 %107 %69 %121
%125 = OpLoad %19 %124
%127 = OpIAdd %5 %121 %73
%126 = OpAccessChain %123 %107 %69 %127
%128 = OpLoad %19 %126
%130 = OpCompositeConstruct %129 %125 %128
%133 = OpBitcast %132 %130
%134 = OpCompositeExtract %131 %133 0
%135 = OpCompositeExtract %131 %133 1
%136 = OpFConvert %63 %134
%137 = OpFConvert %63 %135
%140 = OpAccessChain %86 %8 %141
%142 = OpLoad %5 %140
%143 = OpIAdd %5 %142 %77
%139 = OpAccessChain %138 %41 %143
%144 = OpGroupNonUniformBroadcastFirst %5 %81 %143
%145 = OpAccessChain %90 %13 %69 %144
%146 = OpLoad %9 %145
%147 = OpShiftRightLogical %9 %146 %94
%148 = OpCompositeExtract %5 %147 0
%149 = OpCompositeExtract %5 %147 1
%150 = OpIAdd %5 %79 %148
%151 = OpULessThan %98 %79 %149
%152 = OpSelect %5 %151 %150 %101
%153 = OpAccessChain %102 %139 %69 %152
%154 = OpLoad %5 %153
%155 = OpBitcast %63 %154
%156 = OpFAdd %63 %155 %137
%159 = OpAccessChain %86 %8 %141
%160 = OpLoad %5 %159
%161 = OpIAdd %5 %160 %81
%158 = OpAccessChain %157 %46 %161
%162 = OpGroupNonUniformBroadcastFirst %5 %81 %161
%163 = OpAccessChain %90 %13 %69 %162
%164 = OpLoad %9 %163
%165 = OpShiftRightLogical %9 %164 %115
%166 = OpIMul %5 %83 %77
%167 = OpCompositeExtract %5 %165 0
%168 = OpCompositeExtract %5 %165 1
%169 = OpIAdd %5 %166 %167
%170 = OpULessThan %98 %166 %168
%171 = OpSelect %5 %170 %169 %122
%172 = OpAccessChain %123 %158 %69 %171
%173 = OpLoad %19 %172
%175 = OpIAdd %5 %171 %73
%174 = OpAccessChain %123 %158 %69 %175
%176 = OpLoad %19 %174
%177 = OpCompositeConstruct %129 %173 %176
%178 = OpBitcast %132 %177
%179 = OpCompositeExtract %131 %178 0
%180 = OpCompositeExtract %131 %178 1
%181 = OpFConvert %63 %179
%182 = OpFConvert %63 %180
%183 = OpFAdd %63 %182 %105
%186 = OpAccessChain %86 %8 %73
%187 = OpLoad %5 %186
%188 = OpIAdd %5 %187 %141
%185 = OpAccessChain %184 %30 %188
%191 = OpAccessChain %86 %8 %73
%192 = OpLoad %5 %191
%193 = OpIAdd %5 %192 %141
%190 = OpAccessChain %189 %36 %193
%194 = OpGroupNonUniformBroadcastFirst %5 %81 %193
%195 = OpAccessChain %90 %13 %69 %194
%196 = OpLoad %9 %195
%197 = OpShiftRightLogical %9 %196 %115
%198 = OpCompositeExtract %5 %197 0
%199 = OpCompositeExtract %5 %197 1
%200 = OpIAdd %5 %73 %198
%201 = OpULessThan %98 %73 %199
%202 = OpSelect %5 %201 %200 %122
%204 = OpAccessChain %203 %185 %69 %202
%205 = OpLoad %25 %204
%207 = OpBitcast %206 %205
%208 = OpCompositeExtract %131 %207 0
%209 = OpCompositeExtract %131 %207 1
%210 = OpCompositeExtract %131 %207 2
%211 = OpCompositeExtract %131 %207 3
%212 = OpFConvert %63 %208
%213 = OpFConvert %63 %209
%214 = OpFConvert %63 %210
%215 = OpFConvert %63 %211
%216 = OpFAdd %63 %183 %212
%217 = OpFAdd %63 %213 %136
%218 = OpFAdd %63 %156 %214
%219 = OpFAdd %63 %215 %181
%220 = OpShiftRightLogical %9 %196 %94
%221 = OpCompositeExtract %5 %220 0
%222 = OpCompositeExtract %5 %220 1
%223 = OpIAdd %5 %73 %221
%224 = OpULessThan %98 %73 %222
%225 = OpSelect %5 %224 %223 %101
%227 = OpAccessChain %226 %190 %69 %225
%228 = OpLoad %31 %227
%229 = OpBitcast %64 %228
%230 = OpCompositeExtract %63 %229 0
%231 = OpCompositeExtract %63 %229 1
%232 = OpCompositeExtract %63 %229 2
%233 = OpCompositeExtract %63 %229 3
%234 = OpFAdd %63 %216 %230
%235 = OpFAdd %63 %217 %231
%236 = OpFAdd %63 %218 %232
%237 = OpFAdd %63 %219 %233
%240 = OpAccessChain %86 %8 %141
%241 = OpLoad %5 %240
%242 = OpIAdd %5 %241 %243
%239 = OpAccessChain %238 %51 %242
%246 = OpAccessChain %86 %8 %141
%247 = OpLoad %5 %246
%248 = OpIAdd %5 %247 %243
%245 = OpAccessChain %244 %56 %248
%249 = OpGroupNonUniformBroadcastFirst %5 %81 %248
%250 = OpAccessChain %90 %13 %69 %249
%251 = OpLoad %9 %250
%252 = OpShiftRightLogical %9 %251 %115
%253 = OpCompositeExtract %5 %252 0
%254 = OpCompositeExtract %5 %252 1
%255 = OpIAdd %5 %73 %253
%256 = OpULessThan %98 %73 %254
%257 = OpSelect %5 %256 %255 %122
%258 = OpAccessChain %203 %239 %69 %257
%259 = OpLoad %25 %258
%260 = OpBitcast %206 %259
%261 = OpCompositeExtract %131 %260 0
%262 = OpCompositeExtract %131 %260 1
%263 = OpCompositeExtract %131 %260 2
%264 = OpCompositeExtract %131 %260 3
%265 = OpFConvert %63 %261
%266 = OpFConvert %63 %262
%267 = OpFConvert %63 %263
%268 = OpFConvert %63 %264
%269 = OpFAdd %63 %234 %265
%270 = OpFAdd %63 %235 %266
%271 = OpFAdd %63 %236 %267
%272 = OpFAdd %63 %237 %268
%273 = OpShiftRightLogical %9 %251 %94
%274 = OpCompositeExtract %5 %273 0
%275 = OpCompositeExtract %5 %273 1
%276 = OpIAdd %5 %73 %274
%277 = OpULessThan %98 %73 %275
%278 = OpSelect %5 %277 %276 %101
%279 = OpBitcast %5 %269
%280 = OpBitcast %5 %270
%281 = OpBitcast %5 %271
%282 = OpBitcast %5 %272
%283 = OpCompositeConstruct %31 %279 %280 %281 %282
%284 = OpAccessChain %226 %245 %69 %278
OpStore %284 %283
%286 = OpAccessChain %285 %66 %69
OpStore %286 %269
%287 = OpAccessChain %285 %66 %73
OpStore %287 %270
%288 = OpAccessChain %285 %66 %77
OpStore %288 %271
%289 = OpAccessChain %285 %66 %81
OpStore %289 %272
OpReturn
OpFunctionEnd
#endif
