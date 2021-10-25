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

layout(set = 1, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _13[];

layout(set = 1, binding = 0, std430) restrict readonly buffer _16_19
{
    uint16_t _m0[];
} _19[];

layout(set = 1, binding = 0, std430) restrict readonly buffer _21_24
{
    uint _m0[];
} _24[];

layout(set = 4, binding = 0, std430) buffer _26_29
{
    uint _m0[];
} _29[];

layout(set = 4, binding = 0, std430) buffer _31_34
{
    uint16_t _m0[];
} _34[];

layout(set = 4, binding = 0, std430) writeonly readonly buffer _36_39
{
    uint _m0[];
} _39[];

layout(set = 4, binding = 0, std430) writeonly readonly buffer _41_44
{
    uint _m0[];
} _44[];

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

uint _150;

void main()
{
    uint _91 = uint(UV.y) * 2u;
    f16vec2 _102 = uint16BitsToFloat16(u16vec2(_19[registers._m1]._m0[_91], _19[registers._m1]._m0[_91 + 1u]));
    uint _119 = _29[registers._m4 + 2u]._m0[uint(UV.z)];
    uint _125 = registers._m4 + 2u;
    uint _130 = uint(UV.w) * 2u;
    uint16_t _132 = _34[_125]._m0[_130];
    uint16_t _135 = _34[_125]._m0[_130 + 1u];
    f16vec2 _137 = uint16BitsToFloat16(u16vec2(_132, _135));
    uint _153 = (8u * 2u) + (_150 >> 1u);
    f16vec4 _168 = uint16BitsToFloat16(u16vec4(_19[registers._m1]._m0[_153], _19[registers._m1]._m0[_153 + 1u], _19[registers._m1]._m0[_153 + 2u], _19[registers._m1]._m0[_153 + 3u]));
    uint _183 = 16u + (_150 >> 2u);
    vec4 _197 = uintBitsToFloat(uvec4(_13[registers._m1]._m0[_183], _13[registers._m1]._m0[_183 + 1u], _13[registers._m1]._m0[_183 + 2u], _13[registers._m1]._m0[_183 + 3u]));
    uint _209 = registers._m4 + 2u;
    uint _213 = registers._m4 + 2u;
    uint _216 = (8u * 2u) + (_150 >> 1u);
    uint16_t _218 = _34[_209]._m0[_216];
    uint16_t _221 = _34[_209]._m0[_216 + 1u];
    uint16_t _224 = _34[_209]._m0[_216 + 2u];
    uint16_t _227 = _34[_209]._m0[_216 + 3u];
    f16vec4 _229 = uint16BitsToFloat16(u16vec4(_218, _221, _224, _227));
    float _238 = (((float(_137.y) + uintBitsToFloat(_13[registers._m1]._m0[uint(UV.x)])) + float(_168.x)) + _197.x) + float(_229.x);
    float _239 = ((float(_168.y) + float(_102.x)) + _197.y) + float(_229.y);
    float _240 = (((uintBitsToFloat(_119) + float(_102.y)) + float(_168.z)) + _197.z) + float(_229.z);
    float _241 = ((float(_168.w) + float(_137.x)) + _197.w) + float(_229.w);
    uint _243 = 16u + (_150 >> 2u);
    _29[_213]._m0[_243] = floatBitsToUint(_238);
    _29[_213]._m0[_243 + 1u] = floatBitsToUint(_239);
    _29[_213]._m0[_243 + 2u] = floatBitsToUint(_240);
    _29[_213]._m0[_243 + 3u] = floatBitsToUint(_241);
    SV_Target.x = _238;
    SV_Target.y = _239;
    SV_Target.z = _240;
    SV_Target.w = _241;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 262
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %46 %50 %54
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %10 "SSBO"
OpName %16 "SSBO"
OpName %21 "SSBO"
OpName %26 "SSBO"
OpName %31 "SSBO"
OpName %36 "SSBO"
OpName %41 "SSBO"
OpName %46 "INDEX"
OpName %50 "UV"
OpName %54 "SV_Target"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %9 ArrayStride 4
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %13 DescriptorSet 1
OpDecorate %13 Binding 0
OpDecorate %13 NonWritable
OpDecorate %13 Restrict
OpDecorate %15 ArrayStride 2
OpMemberDecorate %16 0 Offset 0
OpDecorate %16 Block
OpDecorate %19 DescriptorSet 1
OpDecorate %19 Binding 0
OpDecorate %19 NonWritable
OpDecorate %19 Restrict
OpDecorate %20 ArrayStride 4
OpMemberDecorate %21 0 Offset 0
OpDecorate %21 Block
OpDecorate %24 DescriptorSet 1
OpDecorate %24 Binding 0
OpDecorate %24 NonWritable
OpDecorate %24 Restrict
OpDecorate %25 ArrayStride 4
OpMemberDecorate %26 0 Offset 0
OpDecorate %26 Block
OpDecorate %29 DescriptorSet 4
OpDecorate %29 Binding 0
OpDecorate %29 Aliased
OpDecorate %30 ArrayStride 2
OpMemberDecorate %31 0 Offset 0
OpDecorate %31 Block
OpDecorate %34 DescriptorSet 4
OpDecorate %34 Binding 0
OpDecorate %34 Aliased
OpDecorate %35 ArrayStride 4
OpMemberDecorate %36 0 Offset 0
OpDecorate %36 Block
OpDecorate %39 DescriptorSet 4
OpDecorate %39 Binding 0
OpDecorate %39 NonReadable
OpDecorate %39 NonWritable
OpDecorate %40 ArrayStride 4
OpMemberDecorate %41 0 Offset 0
OpDecorate %41 Block
OpDecorate %44 DescriptorSet 4
OpDecorate %44 Binding 0
OpDecorate %44 NonReadable
OpDecorate %44 NonWritable
OpDecorate %46 Flat
OpDecorate %46 Location 0
OpDecorate %50 Flat
OpDecorate %50 Location 1
OpDecorate %54 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeRuntimeArray %5
%10 = OpTypeStruct %9
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer StorageBuffer %11
%13 = OpVariable %12 StorageBuffer
%14 = OpTypeInt 16 0
%15 = OpTypeRuntimeArray %14
%16 = OpTypeStruct %15
%17 = OpTypeRuntimeArray %16
%18 = OpTypePointer StorageBuffer %17
%19 = OpVariable %18 StorageBuffer
%20 = OpTypeRuntimeArray %5
%21 = OpTypeStruct %20
%22 = OpTypeRuntimeArray %21
%23 = OpTypePointer StorageBuffer %22
%24 = OpVariable %23 StorageBuffer
%25 = OpTypeRuntimeArray %5
%26 = OpTypeStruct %25
%27 = OpTypeRuntimeArray %26
%28 = OpTypePointer StorageBuffer %27
%29 = OpVariable %28 StorageBuffer
%30 = OpTypeRuntimeArray %14
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
%45 = OpTypePointer Input %5
%46 = OpVariable %45 Input
%47 = OpTypeInt 32 1
%48 = OpTypeVector %47 4
%49 = OpTypePointer Input %48
%50 = OpVariable %49 Input
%51 = OpTypeFloat 32
%52 = OpTypeVector %51 4
%53 = OpTypePointer Output %52
%54 = OpVariable %53 Output
%55 = OpTypePointer Input %47
%57 = OpConstant %5 0
%61 = OpConstant %5 1
%65 = OpConstant %5 2
%69 = OpConstant %5 3
%72 = OpTypePointer StorageBuffer %16
%74 = OpTypePointer PushConstant %5
%77 = OpTypePointer StorageBuffer %10
%81 = OpTypePointer StorageBuffer %5
%92 = OpTypePointer StorageBuffer %14
%98 = OpTypeVector %14 2
%100 = OpTypeFloat 16
%101 = OpTypeVector %100 2
%107 = OpTypePointer StorageBuffer %31
%110 = OpConstant %5 4
%113 = OpTypePointer StorageBuffer %26
%149 = OpConstant %5 8
%165 = OpTypeVector %14 4
%167 = OpTypeVector %100 4
%181 = OpConstant %5 16
%195 = OpTypeVector %5 4
%255 = OpTypePointer Output %51
%3 = OpFunction %1 None %2
%4 = OpLabel
%150 = OpUndef %5
OpBranch %260
%260 = OpLabel
%56 = OpAccessChain %55 %50 %57
%58 = OpLoad %47 %56
%59 = OpBitcast %5 %58
%60 = OpAccessChain %55 %50 %61
%62 = OpLoad %47 %60
%63 = OpBitcast %5 %62
%64 = OpAccessChain %55 %50 %65
%66 = OpLoad %47 %64
%67 = OpBitcast %5 %66
%68 = OpAccessChain %55 %50 %69
%70 = OpLoad %47 %68
%71 = OpBitcast %5 %70
%75 = OpAccessChain %74 %8 %61
%76 = OpLoad %5 %75
%73 = OpAccessChain %72 %19 %76
%79 = OpAccessChain %74 %8 %61
%80 = OpLoad %5 %79
%78 = OpAccessChain %77 %13 %80
%82 = OpAccessChain %81 %78 %57 %59
%83 = OpLoad %5 %82
%84 = OpBitcast %51 %83
%86 = OpAccessChain %74 %8 %61
%87 = OpLoad %5 %86
%85 = OpAccessChain %72 %19 %87
%89 = OpAccessChain %74 %8 %61
%90 = OpLoad %5 %89
%88 = OpAccessChain %77 %13 %90
%91 = OpIMul %5 %63 %65
%93 = OpAccessChain %92 %85 %57 %91
%94 = OpLoad %14 %93
%96 = OpIAdd %5 %91 %61
%95 = OpAccessChain %92 %85 %57 %96
%97 = OpLoad %14 %95
%99 = OpCompositeConstruct %98 %94 %97
%102 = OpBitcast %101 %99
%103 = OpCompositeExtract %100 %102 0
%104 = OpCompositeExtract %100 %102 1
%105 = OpFConvert %51 %103
%106 = OpFConvert %51 %104
%109 = OpAccessChain %74 %8 %110
%111 = OpLoad %5 %109
%112 = OpIAdd %5 %111 %65
%108 = OpAccessChain %107 %34 %112
%115 = OpAccessChain %74 %8 %110
%116 = OpLoad %5 %115
%117 = OpIAdd %5 %116 %65
%114 = OpAccessChain %113 %29 %117
%118 = OpAccessChain %81 %114 %57 %67
%119 = OpLoad %5 %118
%120 = OpBitcast %51 %119
%121 = OpFAdd %51 %120 %106
%123 = OpAccessChain %74 %8 %110
%124 = OpLoad %5 %123
%125 = OpIAdd %5 %124 %65
%122 = OpAccessChain %107 %34 %125
%127 = OpAccessChain %74 %8 %110
%128 = OpLoad %5 %127
%129 = OpIAdd %5 %128 %65
%126 = OpAccessChain %113 %29 %129
%130 = OpIMul %5 %71 %65
%131 = OpAccessChain %92 %122 %57 %130
%132 = OpLoad %14 %131
%134 = OpIAdd %5 %130 %61
%133 = OpAccessChain %92 %122 %57 %134
%135 = OpLoad %14 %133
%136 = OpCompositeConstruct %98 %132 %135
%137 = OpBitcast %101 %136
%138 = OpCompositeExtract %100 %137 0
%139 = OpCompositeExtract %100 %137 1
%140 = OpFConvert %51 %138
%141 = OpFConvert %51 %139
%142 = OpFAdd %51 %141 %84
%144 = OpAccessChain %74 %8 %61
%145 = OpLoad %5 %144
%143 = OpAccessChain %72 %19 %145
%147 = OpAccessChain %74 %8 %61
%148 = OpLoad %5 %147
%146 = OpAccessChain %77 %13 %148
%151 = OpIMul %5 %149 %65
%152 = OpShiftRightLogical %5 %150 %61
%153 = OpIAdd %5 %151 %152
%154 = OpAccessChain %92 %143 %57 %153
%155 = OpLoad %14 %154
%157 = OpIAdd %5 %153 %61
%156 = OpAccessChain %92 %143 %57 %157
%158 = OpLoad %14 %156
%160 = OpIAdd %5 %153 %65
%159 = OpAccessChain %92 %143 %57 %160
%161 = OpLoad %14 %159
%163 = OpIAdd %5 %153 %69
%162 = OpAccessChain %92 %143 %57 %163
%164 = OpLoad %14 %162
%166 = OpCompositeConstruct %165 %155 %158 %161 %164
%168 = OpBitcast %167 %166
%169 = OpCompositeExtract %100 %168 0
%170 = OpCompositeExtract %100 %168 1
%171 = OpCompositeExtract %100 %168 2
%172 = OpCompositeExtract %100 %168 3
%173 = OpFConvert %51 %169
%174 = OpFConvert %51 %170
%175 = OpFConvert %51 %171
%176 = OpFConvert %51 %172
%177 = OpFAdd %51 %142 %173
%178 = OpFAdd %51 %174 %105
%179 = OpFAdd %51 %121 %175
%180 = OpFAdd %51 %176 %140
%182 = OpShiftRightLogical %5 %150 %65
%183 = OpIAdd %5 %181 %182
%184 = OpAccessChain %81 %146 %57 %183
%185 = OpLoad %5 %184
%187 = OpIAdd %5 %183 %61
%186 = OpAccessChain %81 %146 %57 %187
%188 = OpLoad %5 %186
%190 = OpIAdd %5 %183 %65
%189 = OpAccessChain %81 %146 %57 %190
%191 = OpLoad %5 %189
%193 = OpIAdd %5 %183 %69
%192 = OpAccessChain %81 %146 %57 %193
%194 = OpLoad %5 %192
%196 = OpCompositeConstruct %195 %185 %188 %191 %194
%197 = OpBitcast %52 %196
%198 = OpCompositeExtract %51 %197 0
%199 = OpCompositeExtract %51 %197 1
%200 = OpCompositeExtract %51 %197 2
%201 = OpCompositeExtract %51 %197 3
%202 = OpFAdd %51 %177 %198
%203 = OpFAdd %51 %178 %199
%204 = OpFAdd %51 %179 %200
%205 = OpFAdd %51 %180 %201
%207 = OpAccessChain %74 %8 %110
%208 = OpLoad %5 %207
%209 = OpIAdd %5 %208 %65
%206 = OpAccessChain %107 %34 %209
%211 = OpAccessChain %74 %8 %110
%212 = OpLoad %5 %211
%213 = OpIAdd %5 %212 %65
%210 = OpAccessChain %113 %29 %213
%214 = OpIMul %5 %149 %65
%215 = OpShiftRightLogical %5 %150 %61
%216 = OpIAdd %5 %214 %215
%217 = OpAccessChain %92 %206 %57 %216
%218 = OpLoad %14 %217
%220 = OpIAdd %5 %216 %61
%219 = OpAccessChain %92 %206 %57 %220
%221 = OpLoad %14 %219
%223 = OpIAdd %5 %216 %65
%222 = OpAccessChain %92 %206 %57 %223
%224 = OpLoad %14 %222
%226 = OpIAdd %5 %216 %69
%225 = OpAccessChain %92 %206 %57 %226
%227 = OpLoad %14 %225
%228 = OpCompositeConstruct %165 %218 %221 %224 %227
%229 = OpBitcast %167 %228
%230 = OpCompositeExtract %100 %229 0
%231 = OpCompositeExtract %100 %229 1
%232 = OpCompositeExtract %100 %229 2
%233 = OpCompositeExtract %100 %229 3
%234 = OpFConvert %51 %230
%235 = OpFConvert %51 %231
%236 = OpFConvert %51 %232
%237 = OpFConvert %51 %233
%238 = OpFAdd %51 %202 %234
%239 = OpFAdd %51 %203 %235
%240 = OpFAdd %51 %204 %236
%241 = OpFAdd %51 %205 %237
%242 = OpShiftRightLogical %5 %150 %65
%243 = OpIAdd %5 %181 %242
%244 = OpBitcast %5 %238
%245 = OpBitcast %5 %239
%246 = OpBitcast %5 %240
%247 = OpBitcast %5 %241
%248 = OpAccessChain %81 %210 %57 %243
OpStore %248 %244
%250 = OpIAdd %5 %243 %61
%249 = OpAccessChain %81 %210 %57 %250
OpStore %249 %245
%252 = OpIAdd %5 %243 %65
%251 = OpAccessChain %81 %210 %57 %252
OpStore %251 %246
%254 = OpIAdd %5 %243 %69
%253 = OpAccessChain %81 %210 %57 %254
OpStore %253 %247
%256 = OpAccessChain %255 %54 %57
OpStore %256 %238
%257 = OpAccessChain %255 %54 %61
OpStore %257 %239
%258 = OpAccessChain %255 %54 %65
OpStore %258 %240
%259 = OpAccessChain %255 %54 %69
OpStore %259 %241
OpReturn
OpFunctionEnd
#endif
