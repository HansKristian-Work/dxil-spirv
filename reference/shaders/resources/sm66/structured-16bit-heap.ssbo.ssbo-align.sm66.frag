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

layout(set = 0, binding = 0, std430) restrict readonly buffer _19_22
{
    u16vec2 _m0[];
} _22[];

layout(set = 0, binding = 0, std430) readonly buffer _24_27
{
    uint _m0[];
} _27[];

layout(set = 0, binding = 0, std430) readonly buffer _29_32
{
    u16vec2 _m0[];
} _32[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _35_38
{
    u16vec4 _m0[];
} _38[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _41_44
{
    uvec4 _m0[];
} _44[];

layout(set = 0, binding = 0, std430) buffer _46_49
{
    u16vec4 _m0[];
} _49[];

layout(set = 0, binding = 0, std430) buffer _51_54
{
    uvec4 _m0[];
} _54[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _69 = uint(UV.x);
    uint _73 = uint(UV.y);
    uint _77 = uint(UV.z);
    uint _81 = uint(UV.w);
    uvec2 _89 = _10._m0[subgroupBroadcastFirst(INDEX)] >> uvec2(2u);
    uint _91 = INDEX + 1u;
    uvec2 _97 = _10._m0[subgroupBroadcastFirst(_91)] >> uvec2(2u);
    uint _98 = INDEX + 4u;
    uvec2 _105 = _10._m0[subgroupBroadcastFirst(_98)] >> uvec2(2u);
    uint _106 = INDEX + 5u;
    uvec2 _113 = _10._m0[subgroupBroadcastFirst(_106)] >> uvec2(2u);
    uint _114 = INDEX + 8u;
    uint _120 = subgroupBroadcastFirst(_114);
    uint _123 = INDEX + 9u;
    uint _129 = subgroupBroadcastFirst(_123);
    f16vec2 _154 = uint16BitsToFloat16(_22[_91]._m0[(_73 < _97.y) ? (_73 + _97.x) : 1073741823u]);
    uint _165 = _27[_98]._m0[(_77 < _105.y) ? (_77 + _105.x) : 1073741820u];
    u16vec2 _174 = _32[_106]._m0[(_81 < _113.y) ? (_81 + _113.x) : 1073741823u];
    f16vec2 _175 = uint16BitsToFloat16(_174);
    uvec2 _181 = _10._m0[_120] >> uvec2(3u);
    f16vec4 _193 = uint16BitsToFloat16(_38[_114]._m0[(1u < _181.y) ? (1u + _181.x) : 536870911u]);
    uvec2 _206 = _10._m0[_120] >> uvec2(4u);
    vec4 _217 = uintBitsToFloat(_44[_114]._m0[(1u < _206.y) ? (1u + _206.x) : 268435455u]);
    uvec2 _226 = _10._m0[_129] >> uvec2(3u);
    u16vec4 _233 = _49[_123]._m0[(1u < _226.y) ? (1u + _226.x) : 536870911u];
    f16vec4 _234 = uint16BitsToFloat16(_233);
    float _243 = (((float(_175.y) + uintBitsToFloat(_15[INDEX]._m0[(_69 < _89.y) ? (_69 + _89.x) : 1073741820u])) + float(_193.x)) + _217.x) + float(_234.x);
    float _244 = ((float(_193.y) + float(_154.x)) + _217.y) + float(_234.y);
    float _245 = (((float(_154.y) + uintBitsToFloat(_165)) + float(_193.z)) + _217.z) + float(_234.z);
    float _246 = ((float(_193.w) + float(_175.x)) + _217.w) + float(_234.w);
    uvec2 _247 = _10._m0[_129] >> uvec2(4u);
    _54[_123]._m0[(1u < _247.y) ? (1u + _247.x) : 268435455u] = uvec4(floatBitsToUint(_243), floatBitsToUint(_244), floatBitsToUint(_245), floatBitsToUint(_246));
    SV_Target.x = _243;
    SV_Target.y = _244;
    SV_Target.z = _245;
    SV_Target.w = _246;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 266
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability GroupNonUniformBallot
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %56 %60 %64
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SSBO_Offsets"
OpName %12 "SSBO"
OpName %19 "SSBO"
OpName %24 "SSBO"
OpName %29 "SSBO"
OpName %35 "SSBO"
OpName %41 "SSBO"
OpName %46 "SSBO"
OpName %51 "SSBO"
OpName %56 "INDEX"
OpName %60 "UV"
OpName %64 "SV_Target"
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
OpDecorate %18 ArrayStride 4
OpMemberDecorate %19 0 Offset 0
OpDecorate %19 Block
OpDecorate %22 DescriptorSet 0
OpDecorate %22 Binding 0
OpDecorate %22 NonWritable
OpDecorate %22 Restrict
OpDecorate %23 ArrayStride 4
OpMemberDecorate %24 0 Offset 0
OpDecorate %24 Block
OpDecorate %27 DescriptorSet 0
OpDecorate %27 Binding 0
OpDecorate %27 NonWritable
OpDecorate %28 ArrayStride 4
OpMemberDecorate %29 0 Offset 0
OpDecorate %29 Block
OpDecorate %32 DescriptorSet 0
OpDecorate %32 Binding 0
OpDecorate %32 NonWritable
OpDecorate %34 ArrayStride 8
OpMemberDecorate %35 0 Offset 0
OpDecorate %35 Block
OpDecorate %38 DescriptorSet 0
OpDecorate %38 Binding 0
OpDecorate %38 NonWritable
OpDecorate %38 Restrict
OpDecorate %40 ArrayStride 16
OpMemberDecorate %41 0 Offset 0
OpDecorate %41 Block
OpDecorate %44 DescriptorSet 0
OpDecorate %44 Binding 0
OpDecorate %44 NonWritable
OpDecorate %44 Restrict
OpDecorate %45 ArrayStride 8
OpMemberDecorate %46 0 Offset 0
OpDecorate %46 Block
OpDecorate %49 DescriptorSet 0
OpDecorate %49 Binding 0
OpDecorate %49 Aliased
OpDecorate %50 ArrayStride 16
OpMemberDecorate %51 0 Offset 0
OpDecorate %51 Block
OpDecorate %54 DescriptorSet 0
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
%17 = OpTypeVector %16 2
%18 = OpTypeRuntimeArray %17
%19 = OpTypeStruct %18
%20 = OpTypeRuntimeArray %19
%21 = OpTypePointer StorageBuffer %20
%22 = OpVariable %21 StorageBuffer
%23 = OpTypeRuntimeArray %5
%24 = OpTypeStruct %23
%25 = OpTypeRuntimeArray %24
%26 = OpTypePointer StorageBuffer %25
%27 = OpVariable %26 StorageBuffer
%28 = OpTypeRuntimeArray %17
%29 = OpTypeStruct %28
%30 = OpTypeRuntimeArray %29
%31 = OpTypePointer StorageBuffer %30
%32 = OpVariable %31 StorageBuffer
%33 = OpTypeVector %16 4
%34 = OpTypeRuntimeArray %33
%35 = OpTypeStruct %34
%36 = OpTypeRuntimeArray %35
%37 = OpTypePointer StorageBuffer %36
%38 = OpVariable %37 StorageBuffer
%39 = OpTypeVector %5 4
%40 = OpTypeRuntimeArray %39
%41 = OpTypeStruct %40
%42 = OpTypeRuntimeArray %41
%43 = OpTypePointer StorageBuffer %42
%44 = OpVariable %43 StorageBuffer
%45 = OpTypeRuntimeArray %33
%46 = OpTypeStruct %45
%47 = OpTypeRuntimeArray %46
%48 = OpTypePointer StorageBuffer %47
%49 = OpVariable %48 StorageBuffer
%50 = OpTypeRuntimeArray %39
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
%83 = OpTypePointer StorageBuffer %12
%86 = OpTypePointer StorageBuffer %6
%90 = OpConstantComposite %6 %75 %75
%92 = OpTypePointer StorageBuffer %19
%99 = OpConstant %5 4
%100 = OpTypePointer StorageBuffer %24
%107 = OpConstant %5 5
%108 = OpTypePointer StorageBuffer %29
%115 = OpConstant %5 8
%116 = OpTypePointer StorageBuffer %35
%118 = OpTypePointer StorageBuffer %41
%124 = OpConstant %5 9
%125 = OpTypePointer StorageBuffer %46
%127 = OpTypePointer StorageBuffer %51
%135 = OpTypeBool
%138 = OpConstant %5 1073741820
%139 = OpTypePointer StorageBuffer %5
%148 = OpConstant %5 1073741823
%149 = OpTypePointer StorageBuffer %17
%152 = OpTypeFloat 16
%153 = OpTypeVector %152 2
%182 = OpConstantComposite %6 %79 %79
%188 = OpConstant %5 536870911
%189 = OpTypePointer StorageBuffer %33
%192 = OpTypeVector %152 4
%207 = OpConstantComposite %6 %99 %99
%213 = OpConstant %5 268435455
%214 = OpTypePointer StorageBuffer %39
%259 = OpTypePointer Output %61
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %264
%264 = OpLabel
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
%82 = OpLoad %5 %56
%84 = OpAccessChain %83 %15 %82
%85 = OpGroupNonUniformBroadcastFirst %5 %79 %82
%87 = OpAccessChain %86 %10 %67 %85
%88 = OpLoad %6 %87
%89 = OpShiftRightLogical %6 %88 %90
%91 = OpIAdd %5 %82 %71
%93 = OpAccessChain %92 %22 %91
%94 = OpGroupNonUniformBroadcastFirst %5 %79 %91
%95 = OpAccessChain %86 %10 %67 %94
%96 = OpLoad %6 %95
%97 = OpShiftRightLogical %6 %96 %90
%98 = OpIAdd %5 %82 %99
%101 = OpAccessChain %100 %27 %98
%102 = OpGroupNonUniformBroadcastFirst %5 %79 %98
%103 = OpAccessChain %86 %10 %67 %102
%104 = OpLoad %6 %103
%105 = OpShiftRightLogical %6 %104 %90
%106 = OpIAdd %5 %82 %107
%109 = OpAccessChain %108 %32 %106
%110 = OpGroupNonUniformBroadcastFirst %5 %79 %106
%111 = OpAccessChain %86 %10 %67 %110
%112 = OpLoad %6 %111
%113 = OpShiftRightLogical %6 %112 %90
%114 = OpIAdd %5 %82 %115
%117 = OpAccessChain %116 %38 %114
%119 = OpAccessChain %118 %44 %114
%120 = OpGroupNonUniformBroadcastFirst %5 %79 %114
%121 = OpAccessChain %86 %10 %67 %120
%122 = OpLoad %6 %121
%123 = OpIAdd %5 %82 %124
%126 = OpAccessChain %125 %49 %123
%128 = OpAccessChain %127 %54 %123
%129 = OpGroupNonUniformBroadcastFirst %5 %79 %123
%130 = OpAccessChain %86 %10 %67 %129
%131 = OpLoad %6 %130
%132 = OpCompositeExtract %5 %89 0
%133 = OpCompositeExtract %5 %89 1
%134 = OpIAdd %5 %69 %132
%136 = OpULessThan %135 %69 %133
%137 = OpSelect %5 %136 %134 %138
%140 = OpAccessChain %139 %84 %67 %137
%141 = OpLoad %5 %140
%142 = OpBitcast %61 %141
%143 = OpCompositeExtract %5 %97 0
%144 = OpCompositeExtract %5 %97 1
%145 = OpIAdd %5 %73 %143
%146 = OpULessThan %135 %73 %144
%147 = OpSelect %5 %146 %145 %148
%150 = OpAccessChain %149 %93 %67 %147
%151 = OpLoad %17 %150
%154 = OpBitcast %153 %151
%155 = OpCompositeExtract %152 %154 0
%156 = OpCompositeExtract %152 %154 1
%157 = OpFConvert %61 %155
%158 = OpFConvert %61 %156
%159 = OpCompositeExtract %5 %105 0
%160 = OpCompositeExtract %5 %105 1
%161 = OpIAdd %5 %77 %159
%162 = OpULessThan %135 %77 %160
%163 = OpSelect %5 %162 %161 %138
%164 = OpAccessChain %139 %101 %67 %163
%165 = OpLoad %5 %164
%166 = OpBitcast %61 %165
%167 = OpFAdd %61 %158 %166
%168 = OpCompositeExtract %5 %113 0
%169 = OpCompositeExtract %5 %113 1
%170 = OpIAdd %5 %81 %168
%171 = OpULessThan %135 %81 %169
%172 = OpSelect %5 %171 %170 %148
%173 = OpAccessChain %149 %109 %67 %172
%174 = OpLoad %17 %173
%175 = OpBitcast %153 %174
%176 = OpCompositeExtract %152 %175 0
%177 = OpCompositeExtract %152 %175 1
%178 = OpFConvert %61 %176
%179 = OpFConvert %61 %177
%180 = OpFAdd %61 %179 %142
%181 = OpShiftRightLogical %6 %122 %182
%183 = OpCompositeExtract %5 %181 0
%184 = OpCompositeExtract %5 %181 1
%185 = OpIAdd %5 %71 %183
%186 = OpULessThan %135 %71 %184
%187 = OpSelect %5 %186 %185 %188
%190 = OpAccessChain %189 %117 %67 %187
%191 = OpLoad %33 %190
%193 = OpBitcast %192 %191
%194 = OpCompositeExtract %152 %193 0
%195 = OpCompositeExtract %152 %193 1
%196 = OpCompositeExtract %152 %193 2
%197 = OpCompositeExtract %152 %193 3
%198 = OpFConvert %61 %194
%199 = OpFConvert %61 %195
%200 = OpFConvert %61 %196
%201 = OpFConvert %61 %197
%202 = OpFAdd %61 %180 %198
%203 = OpFAdd %61 %199 %157
%204 = OpFAdd %61 %167 %200
%205 = OpFAdd %61 %201 %178
%206 = OpShiftRightLogical %6 %122 %207
%208 = OpCompositeExtract %5 %206 0
%209 = OpCompositeExtract %5 %206 1
%210 = OpIAdd %5 %71 %208
%211 = OpULessThan %135 %71 %209
%212 = OpSelect %5 %211 %210 %213
%215 = OpAccessChain %214 %119 %67 %212
%216 = OpLoad %39 %215
%217 = OpBitcast %62 %216
%218 = OpCompositeExtract %61 %217 0
%219 = OpCompositeExtract %61 %217 1
%220 = OpCompositeExtract %61 %217 2
%221 = OpCompositeExtract %61 %217 3
%222 = OpFAdd %61 %202 %218
%223 = OpFAdd %61 %203 %219
%224 = OpFAdd %61 %204 %220
%225 = OpFAdd %61 %205 %221
%226 = OpShiftRightLogical %6 %131 %182
%227 = OpCompositeExtract %5 %226 0
%228 = OpCompositeExtract %5 %226 1
%229 = OpIAdd %5 %71 %227
%230 = OpULessThan %135 %71 %228
%231 = OpSelect %5 %230 %229 %188
%232 = OpAccessChain %189 %126 %67 %231
%233 = OpLoad %33 %232
%234 = OpBitcast %192 %233
%235 = OpCompositeExtract %152 %234 0
%236 = OpCompositeExtract %152 %234 1
%237 = OpCompositeExtract %152 %234 2
%238 = OpCompositeExtract %152 %234 3
%239 = OpFConvert %61 %235
%240 = OpFConvert %61 %236
%241 = OpFConvert %61 %237
%242 = OpFConvert %61 %238
%243 = OpFAdd %61 %222 %239
%244 = OpFAdd %61 %223 %240
%245 = OpFAdd %61 %224 %241
%246 = OpFAdd %61 %225 %242
%247 = OpShiftRightLogical %6 %131 %207
%248 = OpCompositeExtract %5 %247 0
%249 = OpCompositeExtract %5 %247 1
%250 = OpIAdd %5 %71 %248
%251 = OpULessThan %135 %71 %249
%252 = OpSelect %5 %251 %250 %213
%253 = OpBitcast %5 %243
%254 = OpBitcast %5 %244
%255 = OpBitcast %5 %245
%256 = OpBitcast %5 %246
%257 = OpCompositeConstruct %39 %253 %254 %255 %256
%258 = OpAccessChain %214 %128 %67 %252
OpStore %258 %257
%260 = OpAccessChain %259 %64 %67
OpStore %260 %243
%261 = OpAccessChain %259 %64 %71
OpStore %261 %244
%262 = OpAccessChain %259 %64 %75
OpStore %262 %245
%263 = OpAccessChain %259 %64 %79
OpStore %263 %246
OpReturn
OpFunctionEnd
#endif
