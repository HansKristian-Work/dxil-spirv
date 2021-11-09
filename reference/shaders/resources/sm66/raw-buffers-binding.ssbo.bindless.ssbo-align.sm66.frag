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

layout(set = 1, binding = 0, std430) restrict readonly buffer _22_25
{
    u16vec2 _m0[];
} _25[];

layout(set = 1, binding = 0, std430) restrict readonly buffer _28_31
{
    u16vec4 _m0[];
} _31[];

layout(set = 1, binding = 0, std430) restrict readonly buffer _34_37
{
    uvec4 _m0[];
} _37[];

layout(set = 4, binding = 0, std430) readonly buffer _39_42
{
    uint _m0[];
} _42[];

layout(set = 4, binding = 0, std430) readonly buffer _44_47
{
    u16vec2 _m0[];
} _47[];

layout(set = 4, binding = 0, std430) buffer _49_52
{
    u16vec4 _m0[];
} _52[];

layout(set = 4, binding = 0, std430) buffer _54_57
{
    uvec4 _m0[];
} _57[];

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
    uint _72 = uint(UV.x);
    uint _76 = uint(UV.y);
    uint _80 = uint(UV.z);
    uint _84 = uint(UV.w);
    uvec2 _94 = _13._m0[subgroupBroadcastFirst(registers._m1)] >> uvec2(2u);
    uint _111 = registers._m1 + 1u;
    uvec2 _115 = _13._m0[subgroupBroadcastFirst(_111)] >> uvec2(2u);
    f16vec2 _127 = uint16BitsToFloat16(_25[_111]._m0[(_76 < _115.y) ? (_76 + _115.x) : 1073741823u]);
    uint _137 = registers._m4 + 2u;
    uvec2 _141 = _13._m0[subgroupBroadcastFirst(_137)] >> uvec2(2u);
    uint _148 = _42[_137]._m0[(_80 < _141.y) ? (_80 + _141.x) : 1073741820u];
    uint _155 = registers._m4 + 3u;
    uvec2 _159 = _13._m0[subgroupBroadcastFirst(_155)] >> uvec2(2u);
    u16vec2 _166 = _47[_155]._m0[(_84 < _159.y) ? (_84 + _159.x) : 1073741823u];
    f16vec2 _167 = uint16BitsToFloat16(_166);
    uint _182 = registers._m1 + 4u;
    uint _183 = subgroupBroadcastFirst(_182);
    uvec2 _186 = _13._m0[_183] >> uvec2(3u);
    f16vec4 _198 = uint16BitsToFloat16(_31[registers._m1 + 4u]._m0[(1u < _186.y) ? (1u + _186.x) : 536870911u]);
    uvec2 _211 = _13._m0[_183] >> uvec2(4u);
    vec4 _222 = uintBitsToFloat(_37[_182]._m0[(1u < _211.y) ? (1u + _211.x) : 268435455u]);
    uint _241 = registers._m4 + 5u;
    uint _242 = subgroupBroadcastFirst(_241);
    uvec2 _245 = _13._m0[_242] >> uvec2(3u);
    u16vec4 _252 = _52[registers._m4 + 5u]._m0[(1u < _245.y) ? (1u + _245.x) : 536870911u];
    f16vec4 _253 = uint16BitsToFloat16(_252);
    float _262 = (((float(_167.y) + uintBitsToFloat(_18[registers._m1]._m0[(_72 < _94.y) ? (_72 + _94.x) : 1073741820u])) + float(_198.x)) + _222.x) + float(_253.x);
    float _263 = ((float(_198.y) + float(_127.x)) + _222.y) + float(_253.y);
    float _264 = (((uintBitsToFloat(_148) + float(_127.y)) + float(_198.z)) + _222.z) + float(_253.z);
    float _265 = ((float(_198.w) + float(_167.x)) + _222.w) + float(_253.w);
    uvec2 _266 = _13._m0[_242] >> uvec2(4u);
    _57[_241]._m0[(1u < _266.y) ? (1u + _266.x) : 268435455u] = uvec4(floatBitsToUint(_262), floatBitsToUint(_263), floatBitsToUint(_264), floatBitsToUint(_265));
    SV_Target.x = _262;
    SV_Target.y = _263;
    SV_Target.z = _264;
    SV_Target.w = _265;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 285
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
OpEntryPoint Fragment %3 "main" %59 %63 %67
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %11 "SSBO_Offsets"
OpName %15 "SSBO"
OpName %22 "SSBO"
OpName %28 "SSBO"
OpName %34 "SSBO"
OpName %39 "SSBO"
OpName %44 "SSBO"
OpName %49 "SSBO"
OpName %54 "SSBO"
OpName %59 "INDEX"
OpName %63 "UV"
OpName %67 "SV_Target"
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
OpDecorate %21 ArrayStride 4
OpMemberDecorate %22 0 Offset 0
OpDecorate %22 Block
OpDecorate %25 DescriptorSet 1
OpDecorate %25 Binding 0
OpDecorate %25 NonWritable
OpDecorate %25 Restrict
OpDecorate %27 ArrayStride 8
OpMemberDecorate %28 0 Offset 0
OpDecorate %28 Block
OpDecorate %31 DescriptorSet 1
OpDecorate %31 Binding 0
OpDecorate %31 NonWritable
OpDecorate %31 Restrict
OpDecorate %33 ArrayStride 16
OpMemberDecorate %34 0 Offset 0
OpDecorate %34 Block
OpDecorate %37 DescriptorSet 1
OpDecorate %37 Binding 0
OpDecorate %37 NonWritable
OpDecorate %37 Restrict
OpDecorate %38 ArrayStride 4
OpMemberDecorate %39 0 Offset 0
OpDecorate %39 Block
OpDecorate %42 DescriptorSet 4
OpDecorate %42 Binding 0
OpDecorate %42 NonWritable
OpDecorate %43 ArrayStride 4
OpMemberDecorate %44 0 Offset 0
OpDecorate %44 Block
OpDecorate %47 DescriptorSet 4
OpDecorate %47 Binding 0
OpDecorate %47 NonWritable
OpDecorate %48 ArrayStride 8
OpMemberDecorate %49 0 Offset 0
OpDecorate %49 Block
OpDecorate %52 DescriptorSet 4
OpDecorate %52 Binding 0
OpDecorate %52 Aliased
OpDecorate %53 ArrayStride 16
OpMemberDecorate %54 0 Offset 0
OpDecorate %54 Block
OpDecorate %57 DescriptorSet 4
OpDecorate %57 Binding 0
OpDecorate %57 Aliased
OpDecorate %59 Flat
OpDecorate %59 Location 0
OpDecorate %63 Flat
OpDecorate %63 Location 1
OpDecorate %67 Location 0
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
%20 = OpTypeVector %19 2
%21 = OpTypeRuntimeArray %20
%22 = OpTypeStruct %21
%23 = OpTypeRuntimeArray %22
%24 = OpTypePointer StorageBuffer %23
%25 = OpVariable %24 StorageBuffer
%26 = OpTypeVector %19 4
%27 = OpTypeRuntimeArray %26
%28 = OpTypeStruct %27
%29 = OpTypeRuntimeArray %28
%30 = OpTypePointer StorageBuffer %29
%31 = OpVariable %30 StorageBuffer
%32 = OpTypeVector %5 4
%33 = OpTypeRuntimeArray %32
%34 = OpTypeStruct %33
%35 = OpTypeRuntimeArray %34
%36 = OpTypePointer StorageBuffer %35
%37 = OpVariable %36 StorageBuffer
%38 = OpTypeRuntimeArray %5
%39 = OpTypeStruct %38
%40 = OpTypeRuntimeArray %39
%41 = OpTypePointer StorageBuffer %40
%42 = OpVariable %41 StorageBuffer
%43 = OpTypeRuntimeArray %20
%44 = OpTypeStruct %43
%45 = OpTypeRuntimeArray %44
%46 = OpTypePointer StorageBuffer %45
%47 = OpVariable %46 StorageBuffer
%48 = OpTypeRuntimeArray %26
%49 = OpTypeStruct %48
%50 = OpTypeRuntimeArray %49
%51 = OpTypePointer StorageBuffer %50
%52 = OpVariable %51 StorageBuffer
%53 = OpTypeRuntimeArray %32
%54 = OpTypeStruct %53
%55 = OpTypeRuntimeArray %54
%56 = OpTypePointer StorageBuffer %55
%57 = OpVariable %56 StorageBuffer
%58 = OpTypePointer Input %5
%59 = OpVariable %58 Input
%60 = OpTypeInt 32 1
%61 = OpTypeVector %60 4
%62 = OpTypePointer Input %61
%63 = OpVariable %62 Input
%64 = OpTypeFloat 32
%65 = OpTypeVector %64 4
%66 = OpTypePointer Output %65
%67 = OpVariable %66 Output
%68 = OpTypePointer Input %60
%70 = OpConstant %5 0
%74 = OpConstant %5 1
%78 = OpConstant %5 2
%82 = OpConstant %5 3
%85 = OpTypePointer StorageBuffer %15
%87 = OpTypePointer PushConstant %5
%91 = OpTypePointer StorageBuffer %9
%95 = OpConstantComposite %9 %78 %78
%99 = OpTypeBool
%102 = OpConstant %5 1073741820
%103 = OpTypePointer StorageBuffer %5
%107 = OpTypePointer StorageBuffer %22
%121 = OpConstant %5 1073741823
%122 = OpTypePointer StorageBuffer %20
%125 = OpTypeFloat 16
%126 = OpTypeVector %125 2
%132 = OpTypePointer StorageBuffer %39
%135 = OpConstant %5 4
%151 = OpTypePointer StorageBuffer %44
%173 = OpTypePointer StorageBuffer %28
%178 = OpTypePointer StorageBuffer %34
%187 = OpConstantComposite %9 %82 %82
%193 = OpConstant %5 536870911
%194 = OpTypePointer StorageBuffer %26
%197 = OpTypeVector %125 4
%212 = OpConstantComposite %9 %135 %135
%218 = OpConstant %5 268435455
%219 = OpTypePointer StorageBuffer %32
%231 = OpTypePointer StorageBuffer %49
%236 = OpConstant %5 5
%237 = OpTypePointer StorageBuffer %54
%278 = OpTypePointer Output %64
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %283
%283 = OpLabel
%69 = OpAccessChain %68 %63 %70
%71 = OpLoad %60 %69
%72 = OpBitcast %5 %71
%73 = OpAccessChain %68 %63 %74
%75 = OpLoad %60 %73
%76 = OpBitcast %5 %75
%77 = OpAccessChain %68 %63 %78
%79 = OpLoad %60 %77
%80 = OpBitcast %5 %79
%81 = OpAccessChain %68 %63 %82
%83 = OpLoad %60 %81
%84 = OpBitcast %5 %83
%88 = OpAccessChain %87 %8 %74
%89 = OpLoad %5 %88
%86 = OpAccessChain %85 %18 %89
%90 = OpGroupNonUniformBroadcastFirst %5 %82 %89
%92 = OpAccessChain %91 %13 %70 %90
%93 = OpLoad %9 %92
%94 = OpShiftRightLogical %9 %93 %95
%96 = OpCompositeExtract %5 %94 0
%97 = OpCompositeExtract %5 %94 1
%98 = OpIAdd %5 %72 %96
%100 = OpULessThan %99 %72 %97
%101 = OpSelect %5 %100 %98 %102
%104 = OpAccessChain %103 %86 %70 %101
%105 = OpLoad %5 %104
%106 = OpBitcast %64 %105
%109 = OpAccessChain %87 %8 %74
%110 = OpLoad %5 %109
%111 = OpIAdd %5 %110 %74
%108 = OpAccessChain %107 %25 %111
%112 = OpGroupNonUniformBroadcastFirst %5 %82 %111
%113 = OpAccessChain %91 %13 %70 %112
%114 = OpLoad %9 %113
%115 = OpShiftRightLogical %9 %114 %95
%116 = OpCompositeExtract %5 %115 0
%117 = OpCompositeExtract %5 %115 1
%118 = OpIAdd %5 %76 %116
%119 = OpULessThan %99 %76 %117
%120 = OpSelect %5 %119 %118 %121
%123 = OpAccessChain %122 %108 %70 %120
%124 = OpLoad %20 %123
%127 = OpBitcast %126 %124
%128 = OpCompositeExtract %125 %127 0
%129 = OpCompositeExtract %125 %127 1
%130 = OpFConvert %64 %128
%131 = OpFConvert %64 %129
%134 = OpAccessChain %87 %8 %135
%136 = OpLoad %5 %134
%137 = OpIAdd %5 %136 %78
%133 = OpAccessChain %132 %42 %137
%138 = OpGroupNonUniformBroadcastFirst %5 %82 %137
%139 = OpAccessChain %91 %13 %70 %138
%140 = OpLoad %9 %139
%141 = OpShiftRightLogical %9 %140 %95
%142 = OpCompositeExtract %5 %141 0
%143 = OpCompositeExtract %5 %141 1
%144 = OpIAdd %5 %80 %142
%145 = OpULessThan %99 %80 %143
%146 = OpSelect %5 %145 %144 %102
%147 = OpAccessChain %103 %133 %70 %146
%148 = OpLoad %5 %147
%149 = OpBitcast %64 %148
%150 = OpFAdd %64 %149 %131
%153 = OpAccessChain %87 %8 %135
%154 = OpLoad %5 %153
%155 = OpIAdd %5 %154 %82
%152 = OpAccessChain %151 %47 %155
%156 = OpGroupNonUniformBroadcastFirst %5 %82 %155
%157 = OpAccessChain %91 %13 %70 %156
%158 = OpLoad %9 %157
%159 = OpShiftRightLogical %9 %158 %95
%160 = OpCompositeExtract %5 %159 0
%161 = OpCompositeExtract %5 %159 1
%162 = OpIAdd %5 %84 %160
%163 = OpULessThan %99 %84 %161
%164 = OpSelect %5 %163 %162 %121
%165 = OpAccessChain %122 %152 %70 %164
%166 = OpLoad %20 %165
%167 = OpBitcast %126 %166
%168 = OpCompositeExtract %125 %167 0
%169 = OpCompositeExtract %125 %167 1
%170 = OpFConvert %64 %168
%171 = OpFConvert %64 %169
%172 = OpFAdd %64 %171 %106
%175 = OpAccessChain %87 %8 %74
%176 = OpLoad %5 %175
%177 = OpIAdd %5 %176 %135
%174 = OpAccessChain %173 %31 %177
%180 = OpAccessChain %87 %8 %74
%181 = OpLoad %5 %180
%182 = OpIAdd %5 %181 %135
%179 = OpAccessChain %178 %37 %182
%183 = OpGroupNonUniformBroadcastFirst %5 %82 %182
%184 = OpAccessChain %91 %13 %70 %183
%185 = OpLoad %9 %184
%186 = OpShiftRightLogical %9 %185 %187
%188 = OpCompositeExtract %5 %186 0
%189 = OpCompositeExtract %5 %186 1
%190 = OpIAdd %5 %74 %188
%191 = OpULessThan %99 %74 %189
%192 = OpSelect %5 %191 %190 %193
%195 = OpAccessChain %194 %174 %70 %192
%196 = OpLoad %26 %195
%198 = OpBitcast %197 %196
%199 = OpCompositeExtract %125 %198 0
%200 = OpCompositeExtract %125 %198 1
%201 = OpCompositeExtract %125 %198 2
%202 = OpCompositeExtract %125 %198 3
%203 = OpFConvert %64 %199
%204 = OpFConvert %64 %200
%205 = OpFConvert %64 %201
%206 = OpFConvert %64 %202
%207 = OpFAdd %64 %172 %203
%208 = OpFAdd %64 %204 %130
%209 = OpFAdd %64 %150 %205
%210 = OpFAdd %64 %206 %170
%211 = OpShiftRightLogical %9 %185 %212
%213 = OpCompositeExtract %5 %211 0
%214 = OpCompositeExtract %5 %211 1
%215 = OpIAdd %5 %74 %213
%216 = OpULessThan %99 %74 %214
%217 = OpSelect %5 %216 %215 %218
%220 = OpAccessChain %219 %179 %70 %217
%221 = OpLoad %32 %220
%222 = OpBitcast %65 %221
%223 = OpCompositeExtract %64 %222 0
%224 = OpCompositeExtract %64 %222 1
%225 = OpCompositeExtract %64 %222 2
%226 = OpCompositeExtract %64 %222 3
%227 = OpFAdd %64 %207 %223
%228 = OpFAdd %64 %208 %224
%229 = OpFAdd %64 %209 %225
%230 = OpFAdd %64 %210 %226
%233 = OpAccessChain %87 %8 %135
%234 = OpLoad %5 %233
%235 = OpIAdd %5 %234 %236
%232 = OpAccessChain %231 %52 %235
%239 = OpAccessChain %87 %8 %135
%240 = OpLoad %5 %239
%241 = OpIAdd %5 %240 %236
%238 = OpAccessChain %237 %57 %241
%242 = OpGroupNonUniformBroadcastFirst %5 %82 %241
%243 = OpAccessChain %91 %13 %70 %242
%244 = OpLoad %9 %243
%245 = OpShiftRightLogical %9 %244 %187
%246 = OpCompositeExtract %5 %245 0
%247 = OpCompositeExtract %5 %245 1
%248 = OpIAdd %5 %74 %246
%249 = OpULessThan %99 %74 %247
%250 = OpSelect %5 %249 %248 %193
%251 = OpAccessChain %194 %232 %70 %250
%252 = OpLoad %26 %251
%253 = OpBitcast %197 %252
%254 = OpCompositeExtract %125 %253 0
%255 = OpCompositeExtract %125 %253 1
%256 = OpCompositeExtract %125 %253 2
%257 = OpCompositeExtract %125 %253 3
%258 = OpFConvert %64 %254
%259 = OpFConvert %64 %255
%260 = OpFConvert %64 %256
%261 = OpFConvert %64 %257
%262 = OpFAdd %64 %227 %258
%263 = OpFAdd %64 %228 %259
%264 = OpFAdd %64 %229 %260
%265 = OpFAdd %64 %230 %261
%266 = OpShiftRightLogical %9 %244 %212
%267 = OpCompositeExtract %5 %266 0
%268 = OpCompositeExtract %5 %266 1
%269 = OpIAdd %5 %74 %267
%270 = OpULessThan %99 %74 %268
%271 = OpSelect %5 %270 %269 %218
%272 = OpBitcast %5 %262
%273 = OpBitcast %5 %263
%274 = OpBitcast %5 %264
%275 = OpBitcast %5 %265
%276 = OpCompositeConstruct %32 %272 %273 %274 %275
%277 = OpAccessChain %219 %238 %70 %271
OpStore %277 %276
%279 = OpAccessChain %278 %67 %70
OpStore %279 %262
%280 = OpAccessChain %278 %67 %74
OpStore %280 %263
%281 = OpAccessChain %278 %67 %78
OpStore %281 %264
%282 = OpAccessChain %278 %67 %82
OpStore %282 %265
OpReturn
OpFunctionEnd
#endif
