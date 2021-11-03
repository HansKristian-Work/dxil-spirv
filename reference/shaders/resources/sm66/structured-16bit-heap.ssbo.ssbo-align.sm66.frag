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

layout(set = 0, binding = 0, std430) restrict readonly buffer _34_37
{
    u16vec4 _m0[];
} _37[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _40_43
{
    uvec4 _m0[];
} _43[];

layout(set = 0, binding = 0, std430) buffer _45_48
{
    u16vec4 _m0[];
} _48[];

layout(set = 0, binding = 0, std430) buffer _50_53
{
    uvec4 _m0[];
} _53[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _68 = uint(UV.x);
    uint _76 = uint(UV.z);
    uvec2 _88 = _10._m0[subgroupBroadcastFirst(INDEX)] >> uvec2(2u);
    uint _90 = INDEX + 1u;
    uvec2 _96 = _10._m0[subgroupBroadcastFirst(_90)] >> uvec2(1u);
    uint _98 = INDEX + 4u;
    uvec2 _105 = _10._m0[subgroupBroadcastFirst(_98)] >> uvec2(2u);
    uint _106 = INDEX + 5u;
    uvec2 _113 = _10._m0[subgroupBroadcastFirst(_106)] >> uvec2(1u);
    uint _114 = INDEX + 8u;
    uint _120 = subgroupBroadcastFirst(_114);
    uint _123 = INDEX + 9u;
    uint _129 = subgroupBroadcastFirst(_123);
    uint _143 = uint(UV.y) * 2u;
    uint _148 = (_143 < _96.y) ? (_143 + _96.x) : 2147483644u;
    f16vec2 _160 = uint16BitsToFloat16(u16vec2(_21[_90]._m0[_148], _21[_90]._m0[_148 + 1u]));
    uint _171 = _26[_98]._m0[(_76 < _105.y) ? (_76 + _105.x) : 1073741820u];
    uint _174 = uint(UV.w) * 2u;
    uint _179 = (_174 < _113.y) ? (_174 + _113.x) : 2147483644u;
    uint16_t _181 = _31[_106]._m0[_179];
    uint16_t _184 = _31[_106]._m0[_179 + 1u];
    f16vec2 _186 = uint16BitsToFloat16(u16vec2(_181, _184));
    uvec2 _192 = _10._m0[_120] >> uvec2(1u);
    f16vec4 _202 = uint16BitsToFloat16(_37[_114]._m0[(1u < _192.y) ? (1u + _192.x) : 2147483644u]);
    uvec2 _215 = _10._m0[_120] >> uvec2(2u);
    vec4 _224 = uintBitsToFloat(_43[_114]._m0[(1u < _215.y) ? (1u + _215.x) : 1073741820u]);
    uvec2 _233 = _10._m0[_129] >> uvec2(1u);
    u16vec4 _240 = _48[_123]._m0[(1u < _233.y) ? (1u + _233.x) : 2147483644u];
    f16vec4 _241 = uint16BitsToFloat16(_240);
    float _250 = (((float(_186.y) + uintBitsToFloat(_15[INDEX]._m0[(_68 < _88.y) ? (_68 + _88.x) : 1073741820u])) + float(_202.x)) + _224.x) + float(_241.x);
    float _251 = ((float(_202.y) + float(_160.x)) + _224.y) + float(_241.y);
    float _252 = (((float(_160.y) + uintBitsToFloat(_171)) + float(_202.z)) + _224.z) + float(_241.z);
    float _253 = ((float(_202.w) + float(_186.x)) + _224.w) + float(_241.w);
    uvec2 _254 = _10._m0[_129] >> uvec2(2u);
    _53[_123]._m0[(1u < _254.y) ? (1u + _254.x) : 1073741820u] = uvec4(floatBitsToUint(_250), floatBitsToUint(_251), floatBitsToUint(_252), floatBitsToUint(_253));
    SV_Target.x = _250;
    SV_Target.y = _251;
    SV_Target.z = _252;
    SV_Target.w = _253;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 273
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability GroupNonUniformBallot
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %55 %59 %63
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SSBO_Offsets"
OpName %12 "SSBO"
OpName %18 "SSBO"
OpName %23 "SSBO"
OpName %28 "SSBO"
OpName %34 "SSBO"
OpName %40 "SSBO"
OpName %45 "SSBO"
OpName %50 "SSBO"
OpName %55 "INDEX"
OpName %59 "UV"
OpName %63 "SV_Target"
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
OpDecorate %33 ArrayStride 8
OpMemberDecorate %34 0 Offset 0
OpDecorate %34 Block
OpDecorate %37 DescriptorSet 0
OpDecorate %37 Binding 0
OpDecorate %37 NonWritable
OpDecorate %37 Restrict
OpDecorate %39 ArrayStride 16
OpMemberDecorate %40 0 Offset 0
OpDecorate %40 Block
OpDecorate %43 DescriptorSet 0
OpDecorate %43 Binding 0
OpDecorate %43 NonWritable
OpDecorate %43 Restrict
OpDecorate %44 ArrayStride 8
OpMemberDecorate %45 0 Offset 0
OpDecorate %45 Block
OpDecorate %48 DescriptorSet 0
OpDecorate %48 Binding 0
OpDecorate %48 Aliased
OpDecorate %49 ArrayStride 16
OpMemberDecorate %50 0 Offset 0
OpDecorate %50 Block
OpDecorate %53 DescriptorSet 0
OpDecorate %53 Binding 0
OpDecorate %53 Aliased
OpDecorate %55 Flat
OpDecorate %55 Location 0
OpDecorate %59 Flat
OpDecorate %59 Location 1
OpDecorate %63 Location 0
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
%32 = OpTypeVector %16 4
%33 = OpTypeRuntimeArray %32
%34 = OpTypeStruct %33
%35 = OpTypeRuntimeArray %34
%36 = OpTypePointer StorageBuffer %35
%37 = OpVariable %36 StorageBuffer
%38 = OpTypeVector %5 4
%39 = OpTypeRuntimeArray %38
%40 = OpTypeStruct %39
%41 = OpTypeRuntimeArray %40
%42 = OpTypePointer StorageBuffer %41
%43 = OpVariable %42 StorageBuffer
%44 = OpTypeRuntimeArray %32
%45 = OpTypeStruct %44
%46 = OpTypeRuntimeArray %45
%47 = OpTypePointer StorageBuffer %46
%48 = OpVariable %47 StorageBuffer
%49 = OpTypeRuntimeArray %38
%50 = OpTypeStruct %49
%51 = OpTypeRuntimeArray %50
%52 = OpTypePointer StorageBuffer %51
%53 = OpVariable %52 StorageBuffer
%54 = OpTypePointer Input %5
%55 = OpVariable %54 Input
%56 = OpTypeInt 32 1
%57 = OpTypeVector %56 4
%58 = OpTypePointer Input %57
%59 = OpVariable %58 Input
%60 = OpTypeFloat 32
%61 = OpTypeVector %60 4
%62 = OpTypePointer Output %61
%63 = OpVariable %62 Output
%64 = OpTypePointer Input %56
%66 = OpConstant %5 0
%70 = OpConstant %5 1
%74 = OpConstant %5 2
%78 = OpConstant %5 3
%82 = OpTypePointer StorageBuffer %12
%85 = OpTypePointer StorageBuffer %6
%89 = OpConstantComposite %6 %74 %74
%91 = OpTypePointer StorageBuffer %18
%97 = OpConstantComposite %6 %70 %70
%99 = OpConstant %5 4
%100 = OpTypePointer StorageBuffer %23
%107 = OpConstant %5 5
%108 = OpTypePointer StorageBuffer %28
%115 = OpConstant %5 8
%116 = OpTypePointer StorageBuffer %34
%118 = OpTypePointer StorageBuffer %40
%124 = OpConstant %5 9
%125 = OpTypePointer StorageBuffer %45
%127 = OpTypePointer StorageBuffer %50
%135 = OpTypeBool
%138 = OpConstant %5 1073741820
%139 = OpTypePointer StorageBuffer %5
%149 = OpConstant %5 2147483644
%150 = OpTypePointer StorageBuffer %16
%156 = OpTypeVector %16 2
%158 = OpTypeFloat 16
%159 = OpTypeVector %158 2
%198 = OpTypePointer StorageBuffer %32
%201 = OpTypeVector %158 4
%221 = OpTypePointer StorageBuffer %38
%266 = OpTypePointer Output %60
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %271
%271 = OpLabel
%65 = OpAccessChain %64 %59 %66
%67 = OpLoad %56 %65
%68 = OpBitcast %5 %67
%69 = OpAccessChain %64 %59 %70
%71 = OpLoad %56 %69
%72 = OpBitcast %5 %71
%73 = OpAccessChain %64 %59 %74
%75 = OpLoad %56 %73
%76 = OpBitcast %5 %75
%77 = OpAccessChain %64 %59 %78
%79 = OpLoad %56 %77
%80 = OpBitcast %5 %79
%81 = OpLoad %5 %55
%83 = OpAccessChain %82 %15 %81
%84 = OpGroupNonUniformBroadcastFirst %5 %78 %81
%86 = OpAccessChain %85 %10 %66 %84
%87 = OpLoad %6 %86
%88 = OpShiftRightLogical %6 %87 %89
%90 = OpIAdd %5 %81 %70
%92 = OpAccessChain %91 %21 %90
%93 = OpGroupNonUniformBroadcastFirst %5 %78 %90
%94 = OpAccessChain %85 %10 %66 %93
%95 = OpLoad %6 %94
%96 = OpShiftRightLogical %6 %95 %97
%98 = OpIAdd %5 %81 %99
%101 = OpAccessChain %100 %26 %98
%102 = OpGroupNonUniformBroadcastFirst %5 %78 %98
%103 = OpAccessChain %85 %10 %66 %102
%104 = OpLoad %6 %103
%105 = OpShiftRightLogical %6 %104 %89
%106 = OpIAdd %5 %81 %107
%109 = OpAccessChain %108 %31 %106
%110 = OpGroupNonUniformBroadcastFirst %5 %78 %106
%111 = OpAccessChain %85 %10 %66 %110
%112 = OpLoad %6 %111
%113 = OpShiftRightLogical %6 %112 %97
%114 = OpIAdd %5 %81 %115
%117 = OpAccessChain %116 %37 %114
%119 = OpAccessChain %118 %43 %114
%120 = OpGroupNonUniformBroadcastFirst %5 %78 %114
%121 = OpAccessChain %85 %10 %66 %120
%122 = OpLoad %6 %121
%123 = OpIAdd %5 %81 %124
%126 = OpAccessChain %125 %48 %123
%128 = OpAccessChain %127 %53 %123
%129 = OpGroupNonUniformBroadcastFirst %5 %78 %123
%130 = OpAccessChain %85 %10 %66 %129
%131 = OpLoad %6 %130
%132 = OpCompositeExtract %5 %88 0
%133 = OpCompositeExtract %5 %88 1
%134 = OpIAdd %5 %68 %132
%136 = OpULessThan %135 %68 %133
%137 = OpSelect %5 %136 %134 %138
%140 = OpAccessChain %139 %83 %66 %137
%141 = OpLoad %5 %140
%142 = OpBitcast %60 %141
%143 = OpIMul %5 %72 %74
%144 = OpCompositeExtract %5 %96 0
%145 = OpCompositeExtract %5 %96 1
%146 = OpIAdd %5 %143 %144
%147 = OpULessThan %135 %143 %145
%148 = OpSelect %5 %147 %146 %149
%151 = OpAccessChain %150 %92 %66 %148
%152 = OpLoad %16 %151
%154 = OpIAdd %5 %148 %70
%153 = OpAccessChain %150 %92 %66 %154
%155 = OpLoad %16 %153
%157 = OpCompositeConstruct %156 %152 %155
%160 = OpBitcast %159 %157
%161 = OpCompositeExtract %158 %160 0
%162 = OpCompositeExtract %158 %160 1
%163 = OpFConvert %60 %161
%164 = OpFConvert %60 %162
%165 = OpCompositeExtract %5 %105 0
%166 = OpCompositeExtract %5 %105 1
%167 = OpIAdd %5 %76 %165
%168 = OpULessThan %135 %76 %166
%169 = OpSelect %5 %168 %167 %138
%170 = OpAccessChain %139 %101 %66 %169
%171 = OpLoad %5 %170
%172 = OpBitcast %60 %171
%173 = OpFAdd %60 %164 %172
%174 = OpIMul %5 %80 %74
%175 = OpCompositeExtract %5 %113 0
%176 = OpCompositeExtract %5 %113 1
%177 = OpIAdd %5 %174 %175
%178 = OpULessThan %135 %174 %176
%179 = OpSelect %5 %178 %177 %149
%180 = OpAccessChain %150 %109 %66 %179
%181 = OpLoad %16 %180
%183 = OpIAdd %5 %179 %70
%182 = OpAccessChain %150 %109 %66 %183
%184 = OpLoad %16 %182
%185 = OpCompositeConstruct %156 %181 %184
%186 = OpBitcast %159 %185
%187 = OpCompositeExtract %158 %186 0
%188 = OpCompositeExtract %158 %186 1
%189 = OpFConvert %60 %187
%190 = OpFConvert %60 %188
%191 = OpFAdd %60 %190 %142
%192 = OpShiftRightLogical %6 %122 %97
%193 = OpCompositeExtract %5 %192 0
%194 = OpCompositeExtract %5 %192 1
%195 = OpIAdd %5 %70 %193
%196 = OpULessThan %135 %70 %194
%197 = OpSelect %5 %196 %195 %149
%199 = OpAccessChain %198 %117 %66 %197
%200 = OpLoad %32 %199
%202 = OpBitcast %201 %200
%203 = OpCompositeExtract %158 %202 0
%204 = OpCompositeExtract %158 %202 1
%205 = OpCompositeExtract %158 %202 2
%206 = OpCompositeExtract %158 %202 3
%207 = OpFConvert %60 %203
%208 = OpFConvert %60 %204
%209 = OpFConvert %60 %205
%210 = OpFConvert %60 %206
%211 = OpFAdd %60 %191 %207
%212 = OpFAdd %60 %208 %163
%213 = OpFAdd %60 %173 %209
%214 = OpFAdd %60 %210 %189
%215 = OpShiftRightLogical %6 %122 %89
%216 = OpCompositeExtract %5 %215 0
%217 = OpCompositeExtract %5 %215 1
%218 = OpIAdd %5 %70 %216
%219 = OpULessThan %135 %70 %217
%220 = OpSelect %5 %219 %218 %138
%222 = OpAccessChain %221 %119 %66 %220
%223 = OpLoad %38 %222
%224 = OpBitcast %61 %223
%225 = OpCompositeExtract %60 %224 0
%226 = OpCompositeExtract %60 %224 1
%227 = OpCompositeExtract %60 %224 2
%228 = OpCompositeExtract %60 %224 3
%229 = OpFAdd %60 %211 %225
%230 = OpFAdd %60 %212 %226
%231 = OpFAdd %60 %213 %227
%232 = OpFAdd %60 %214 %228
%233 = OpShiftRightLogical %6 %131 %97
%234 = OpCompositeExtract %5 %233 0
%235 = OpCompositeExtract %5 %233 1
%236 = OpIAdd %5 %70 %234
%237 = OpULessThan %135 %70 %235
%238 = OpSelect %5 %237 %236 %149
%239 = OpAccessChain %198 %126 %66 %238
%240 = OpLoad %32 %239
%241 = OpBitcast %201 %240
%242 = OpCompositeExtract %158 %241 0
%243 = OpCompositeExtract %158 %241 1
%244 = OpCompositeExtract %158 %241 2
%245 = OpCompositeExtract %158 %241 3
%246 = OpFConvert %60 %242
%247 = OpFConvert %60 %243
%248 = OpFConvert %60 %244
%249 = OpFConvert %60 %245
%250 = OpFAdd %60 %229 %246
%251 = OpFAdd %60 %230 %247
%252 = OpFAdd %60 %231 %248
%253 = OpFAdd %60 %232 %249
%254 = OpShiftRightLogical %6 %131 %89
%255 = OpCompositeExtract %5 %254 0
%256 = OpCompositeExtract %5 %254 1
%257 = OpIAdd %5 %70 %255
%258 = OpULessThan %135 %70 %256
%259 = OpSelect %5 %258 %257 %138
%260 = OpBitcast %5 %250
%261 = OpBitcast %5 %251
%262 = OpBitcast %5 %252
%263 = OpBitcast %5 %253
%264 = OpCompositeConstruct %38 %260 %261 %262 %263
%265 = OpAccessChain %221 %128 %66 %259
OpStore %265 %264
%267 = OpAccessChain %266 %63 %66
OpStore %267 %250
%268 = OpAccessChain %266 %63 %70
OpStore %268 %251
%269 = OpAccessChain %266 %63 %74
OpStore %269 %252
%270 = OpAccessChain %266 %63 %78
OpStore %270 %253
OpReturn
OpFunctionEnd
#endif
