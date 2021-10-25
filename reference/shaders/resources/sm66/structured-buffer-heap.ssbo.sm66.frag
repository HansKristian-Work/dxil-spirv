#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _10[];

layout(set = 0, binding = 0, std430) readonly buffer _12_15
{
    uint _m0[];
} _15[];

layout(set = 0, binding = 0, std430) buffer _17_20
{
    uint _m0[];
} _20[];

layout(set = 0, binding = 0, std430) coherent readonly buffer _22_25
{
    uint _m0[];
} _25[];

layout(set = 0, binding = 0, std430) coherent buffer _27_30
{
    uint _m0[];
} _30[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _45 = uint(UV.x);
    uint _49 = uint(UV.y);
    uint _53 = uint(UV.z);
    uint _57 = uint(UV.w);
    uint _61 = INDEX + 1u;
    uint _63 = INDEX + 2u;
    uint _65 = INDEX + 3u;
    uint _71 = INDEX + 5u;
    uint _75 = INDEX + 6u;
    uint _78 = INDEX + 7u;
    uint _85 = INDEX + 9u;
    uint _88 = INDEX + 10u;
    uint _92 = INDEX + 11u;
    uint _99 = _49 * 2u;
    vec2 _108 = uintBitsToFloat(uvec2(_10[_61]._m0[_99], _10[_61]._m0[_99 + 1u]));
    uint _112 = _53 * 3u;
    vec3 _124 = uintBitsToFloat(uvec3(_10[_63]._m0[_112], _10[_63]._m0[_112 + 1u], _10[_63]._m0[_112 + 2u]));
    uint _130 = _57 * 4u;
    vec4 _144 = uintBitsToFloat(uvec4(_10[_65]._m0[_130], _10[_65]._m0[_130 + 1u], _10[_65]._m0[_130 + 2u], _10[_65]._m0[_130 + 3u]));
    uint _153 = _15[INDEX + 4u]._m0[_45];
    uint _156 = _49 * 2u;
    uint _158 = _20[_71]._m0[_156];
    uint _161 = _20[_71]._m0[_156 + 1u];
    vec2 _163 = uintBitsToFloat(uvec2(_158, _161));
    uint _168 = _53 * 3u;
    uint _170 = _15[_75]._m0[_168];
    uint _173 = _15[_75]._m0[_168 + 1u];
    uint _176 = _15[_75]._m0[_168 + 2u];
    vec3 _178 = uintBitsToFloat(uvec3(_170, _173, _176));
    uint _185 = _57 * 4u;
    uint _187 = _15[_78]._m0[_185];
    uint _190 = _15[_78]._m0[_185 + 1u];
    uint _193 = _15[_78]._m0[_185 + 2u];
    uint _196 = _15[_78]._m0[_185 + 3u];
    vec4 _198 = uintBitsToFloat(uvec4(_187, _190, _193, _196));
    uint _208 = _25[INDEX + 8u]._m0[_45];
    uint _211 = _49 * 2u;
    uint _213 = _25[_85]._m0[_211];
    uint _216 = _25[_85]._m0[_211 + 1u];
    vec2 _218 = uintBitsToFloat(uvec2(_213, _216));
    uint _223 = _53 * 3u;
    uint _225 = _30[_88]._m0[_223];
    uint _228 = _30[_88]._m0[_223 + 1u];
    uint _231 = _30[_88]._m0[_223 + 2u];
    vec3 _233 = uintBitsToFloat(uvec3(_225, _228, _231));
    uint _240 = _57 * 4u;
    uint _242 = _25[_92]._m0[_240];
    uint _245 = _25[_92]._m0[_240 + 1u];
    uint _248 = _25[_92]._m0[_240 + 2u];
    uint _251 = _25[_92]._m0[_240 + 3u];
    vec4 _253 = uintBitsToFloat(uvec4(_242, _245, _248, _251));
    uint _262 = _45 * 2u;
    _20[_71]._m0[_262] = floatBitsToUint(20.0);
    _20[_71]._m0[_262 + 1u] = floatBitsToUint(20.0);
    uint _269 = _49 * 3u;
    _30[_88]._m0[_269] = floatBitsToUint(30.0);
    _30[_88]._m0[_269 + 1u] = floatBitsToUint(30.0);
    _30[_88]._m0[_269 + 2u] = floatBitsToUint(30.0);
    SV_Target.x = ((((((((((_108.x + uintBitsToFloat(_10[INDEX]._m0[_45])) + _124.x) + _144.x) + uintBitsToFloat(_153)) + _163.x) + _178.x) + _198.x) + uintBitsToFloat(_208)) + _218.x) + _233.x) + _253.x;
    SV_Target.y = (((((((_124.y + _108.y) + _144.y) + _163.y) + _178.y) + _198.y) + _218.y) + _233.y) + _253.y;
    SV_Target.z = ((((_144.z + _124.z) + _178.z) + _198.z) + _233.z) + _253.z;
    SV_Target.w = (_198.w + _144.w) + _253.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 286
; Schema: 0
OpCapability Shader
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %32 %36 %40
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %12 "SSBO"
OpName %17 "SSBO"
OpName %22 "SSBO"
OpName %27 "SSBO"
OpName %32 "INDEX"
OpName %36 "UV"
OpName %40 "SV_Target"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonWritable
OpDecorate %10 Restrict
OpDecorate %11 ArrayStride 4
OpMemberDecorate %12 0 Offset 0
OpDecorate %12 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 0
OpDecorate %15 NonWritable
OpDecorate %16 ArrayStride 4
OpMemberDecorate %17 0 Offset 0
OpDecorate %17 Block
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 0
OpDecorate %21 ArrayStride 4
OpMemberDecorate %22 0 Offset 0
OpDecorate %22 Block
OpDecorate %25 DescriptorSet 0
OpDecorate %25 Binding 0
OpDecorate %25 NonWritable
OpDecorate %25 Coherent
OpDecorate %26 ArrayStride 4
OpMemberDecorate %27 0 Offset 0
OpDecorate %27 Block
OpDecorate %30 DescriptorSet 0
OpDecorate %30 Binding 0
OpDecorate %30 Coherent
OpDecorate %32 Flat
OpDecorate %32 Location 0
OpDecorate %36 Flat
OpDecorate %36 Location 1
OpDecorate %40 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypeRuntimeArray %7
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
%21 = OpTypeRuntimeArray %5
%22 = OpTypeStruct %21
%23 = OpTypeRuntimeArray %22
%24 = OpTypePointer StorageBuffer %23
%25 = OpVariable %24 StorageBuffer
%26 = OpTypeRuntimeArray %5
%27 = OpTypeStruct %26
%28 = OpTypeRuntimeArray %27
%29 = OpTypePointer StorageBuffer %28
%30 = OpVariable %29 StorageBuffer
%31 = OpTypePointer Input %5
%32 = OpVariable %31 Input
%33 = OpTypeInt 32 1
%34 = OpTypeVector %33 4
%35 = OpTypePointer Input %34
%36 = OpVariable %35 Input
%37 = OpTypeFloat 32
%38 = OpTypeVector %37 4
%39 = OpTypePointer Output %38
%40 = OpVariable %39 Output
%41 = OpTypePointer Input %33
%43 = OpConstant %5 0
%47 = OpConstant %5 1
%51 = OpConstant %5 2
%55 = OpConstant %5 3
%59 = OpTypePointer StorageBuffer %7
%68 = OpConstant %5 4
%69 = OpTypePointer StorageBuffer %12
%72 = OpConstant %5 5
%73 = OpTypePointer StorageBuffer %17
%76 = OpConstant %5 6
%79 = OpConstant %5 7
%82 = OpConstant %5 8
%83 = OpTypePointer StorageBuffer %22
%86 = OpConstant %5 9
%89 = OpConstant %5 10
%90 = OpTypePointer StorageBuffer %27
%93 = OpConstant %5 11
%95 = OpTypePointer StorageBuffer %5
%105 = OpTypeVector %5 2
%107 = OpTypeVector %37 2
%121 = OpTypeVector %5 3
%123 = OpTypeVector %37 3
%142 = OpTypeVector %5 4
%263 = OpConstant %37 20
%270 = OpConstant %37 30
%279 = OpTypePointer Output %37
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %284
%284 = OpLabel
%42 = OpAccessChain %41 %36 %43
%44 = OpLoad %33 %42
%45 = OpBitcast %5 %44
%46 = OpAccessChain %41 %36 %47
%48 = OpLoad %33 %46
%49 = OpBitcast %5 %48
%50 = OpAccessChain %41 %36 %51
%52 = OpLoad %33 %50
%53 = OpBitcast %5 %52
%54 = OpAccessChain %41 %36 %55
%56 = OpLoad %33 %54
%57 = OpBitcast %5 %56
%58 = OpLoad %5 %32
%60 = OpAccessChain %59 %10 %58
%61 = OpIAdd %5 %58 %47
%62 = OpAccessChain %59 %10 %61
%63 = OpIAdd %5 %58 %51
%64 = OpAccessChain %59 %10 %63
%65 = OpIAdd %5 %58 %55
%66 = OpAccessChain %59 %10 %65
%67 = OpIAdd %5 %58 %68
%70 = OpAccessChain %69 %15 %67
%71 = OpIAdd %5 %58 %72
%74 = OpAccessChain %73 %20 %71
%75 = OpIAdd %5 %58 %76
%77 = OpAccessChain %69 %15 %75
%78 = OpIAdd %5 %58 %79
%80 = OpAccessChain %69 %15 %78
%81 = OpIAdd %5 %58 %82
%84 = OpAccessChain %83 %25 %81
%85 = OpIAdd %5 %58 %86
%87 = OpAccessChain %83 %25 %85
%88 = OpIAdd %5 %58 %89
%91 = OpAccessChain %90 %30 %88
%92 = OpIAdd %5 %58 %93
%94 = OpAccessChain %83 %25 %92
%96 = OpAccessChain %95 %60 %43 %45
%97 = OpLoad %5 %96
%98 = OpBitcast %37 %97
%99 = OpIMul %5 %49 %51
%100 = OpAccessChain %95 %62 %43 %99
%101 = OpLoad %5 %100
%103 = OpIAdd %5 %99 %47
%102 = OpAccessChain %95 %62 %43 %103
%104 = OpLoad %5 %102
%106 = OpCompositeConstruct %105 %101 %104
%108 = OpBitcast %107 %106
%109 = OpCompositeExtract %37 %108 0
%110 = OpCompositeExtract %37 %108 1
%111 = OpFAdd %37 %109 %98
%112 = OpIMul %5 %53 %55
%113 = OpAccessChain %95 %64 %43 %112
%114 = OpLoad %5 %113
%116 = OpIAdd %5 %112 %47
%115 = OpAccessChain %95 %64 %43 %116
%117 = OpLoad %5 %115
%119 = OpIAdd %5 %112 %51
%118 = OpAccessChain %95 %64 %43 %119
%120 = OpLoad %5 %118
%122 = OpCompositeConstruct %121 %114 %117 %120
%124 = OpBitcast %123 %122
%125 = OpCompositeExtract %37 %124 0
%126 = OpCompositeExtract %37 %124 1
%127 = OpCompositeExtract %37 %124 2
%128 = OpFAdd %37 %111 %125
%129 = OpFAdd %37 %126 %110
%130 = OpIMul %5 %57 %68
%131 = OpAccessChain %95 %66 %43 %130
%132 = OpLoad %5 %131
%134 = OpIAdd %5 %130 %47
%133 = OpAccessChain %95 %66 %43 %134
%135 = OpLoad %5 %133
%137 = OpIAdd %5 %130 %51
%136 = OpAccessChain %95 %66 %43 %137
%138 = OpLoad %5 %136
%140 = OpIAdd %5 %130 %55
%139 = OpAccessChain %95 %66 %43 %140
%141 = OpLoad %5 %139
%143 = OpCompositeConstruct %142 %132 %135 %138 %141
%144 = OpBitcast %38 %143
%145 = OpCompositeExtract %37 %144 0
%146 = OpCompositeExtract %37 %144 1
%147 = OpCompositeExtract %37 %144 2
%148 = OpCompositeExtract %37 %144 3
%149 = OpFAdd %37 %128 %145
%150 = OpFAdd %37 %129 %146
%151 = OpFAdd %37 %147 %127
%152 = OpAccessChain %95 %70 %43 %45
%153 = OpLoad %5 %152
%154 = OpBitcast %37 %153
%155 = OpFAdd %37 %149 %154
%156 = OpIMul %5 %49 %51
%157 = OpAccessChain %95 %74 %43 %156
%158 = OpLoad %5 %157
%160 = OpIAdd %5 %156 %47
%159 = OpAccessChain %95 %74 %43 %160
%161 = OpLoad %5 %159
%162 = OpCompositeConstruct %105 %158 %161
%163 = OpBitcast %107 %162
%164 = OpCompositeExtract %37 %163 0
%165 = OpCompositeExtract %37 %163 1
%166 = OpFAdd %37 %155 %164
%167 = OpFAdd %37 %150 %165
%168 = OpIMul %5 %53 %55
%169 = OpAccessChain %95 %77 %43 %168
%170 = OpLoad %5 %169
%172 = OpIAdd %5 %168 %47
%171 = OpAccessChain %95 %77 %43 %172
%173 = OpLoad %5 %171
%175 = OpIAdd %5 %168 %51
%174 = OpAccessChain %95 %77 %43 %175
%176 = OpLoad %5 %174
%177 = OpCompositeConstruct %121 %170 %173 %176
%178 = OpBitcast %123 %177
%179 = OpCompositeExtract %37 %178 0
%180 = OpCompositeExtract %37 %178 1
%181 = OpCompositeExtract %37 %178 2
%182 = OpFAdd %37 %166 %179
%183 = OpFAdd %37 %167 %180
%184 = OpFAdd %37 %151 %181
%185 = OpIMul %5 %57 %68
%186 = OpAccessChain %95 %80 %43 %185
%187 = OpLoad %5 %186
%189 = OpIAdd %5 %185 %47
%188 = OpAccessChain %95 %80 %43 %189
%190 = OpLoad %5 %188
%192 = OpIAdd %5 %185 %51
%191 = OpAccessChain %95 %80 %43 %192
%193 = OpLoad %5 %191
%195 = OpIAdd %5 %185 %55
%194 = OpAccessChain %95 %80 %43 %195
%196 = OpLoad %5 %194
%197 = OpCompositeConstruct %142 %187 %190 %193 %196
%198 = OpBitcast %38 %197
%199 = OpCompositeExtract %37 %198 0
%200 = OpCompositeExtract %37 %198 1
%201 = OpCompositeExtract %37 %198 2
%202 = OpCompositeExtract %37 %198 3
%203 = OpFAdd %37 %182 %199
%204 = OpFAdd %37 %183 %200
%205 = OpFAdd %37 %184 %201
%206 = OpFAdd %37 %202 %148
%207 = OpAccessChain %95 %84 %43 %45
%208 = OpLoad %5 %207
%209 = OpBitcast %37 %208
%210 = OpFAdd %37 %203 %209
%211 = OpIMul %5 %49 %51
%212 = OpAccessChain %95 %87 %43 %211
%213 = OpLoad %5 %212
%215 = OpIAdd %5 %211 %47
%214 = OpAccessChain %95 %87 %43 %215
%216 = OpLoad %5 %214
%217 = OpCompositeConstruct %105 %213 %216
%218 = OpBitcast %107 %217
%219 = OpCompositeExtract %37 %218 0
%220 = OpCompositeExtract %37 %218 1
%221 = OpFAdd %37 %210 %219
%222 = OpFAdd %37 %204 %220
%223 = OpIMul %5 %53 %55
%224 = OpAccessChain %95 %91 %43 %223
%225 = OpLoad %5 %224
%227 = OpIAdd %5 %223 %47
%226 = OpAccessChain %95 %91 %43 %227
%228 = OpLoad %5 %226
%230 = OpIAdd %5 %223 %51
%229 = OpAccessChain %95 %91 %43 %230
%231 = OpLoad %5 %229
%232 = OpCompositeConstruct %121 %225 %228 %231
%233 = OpBitcast %123 %232
%234 = OpCompositeExtract %37 %233 0
%235 = OpCompositeExtract %37 %233 1
%236 = OpCompositeExtract %37 %233 2
%237 = OpFAdd %37 %221 %234
%238 = OpFAdd %37 %222 %235
%239 = OpFAdd %37 %205 %236
%240 = OpIMul %5 %57 %68
%241 = OpAccessChain %95 %94 %43 %240
%242 = OpLoad %5 %241
%244 = OpIAdd %5 %240 %47
%243 = OpAccessChain %95 %94 %43 %244
%245 = OpLoad %5 %243
%247 = OpIAdd %5 %240 %51
%246 = OpAccessChain %95 %94 %43 %247
%248 = OpLoad %5 %246
%250 = OpIAdd %5 %240 %55
%249 = OpAccessChain %95 %94 %43 %250
%251 = OpLoad %5 %249
%252 = OpCompositeConstruct %142 %242 %245 %248 %251
%253 = OpBitcast %38 %252
%254 = OpCompositeExtract %37 %253 0
%255 = OpCompositeExtract %37 %253 1
%256 = OpCompositeExtract %37 %253 2
%257 = OpCompositeExtract %37 %253 3
%258 = OpFAdd %37 %237 %254
%259 = OpFAdd %37 %238 %255
%260 = OpFAdd %37 %239 %256
%261 = OpFAdd %37 %206 %257
%262 = OpIMul %5 %45 %51
%264 = OpBitcast %5 %263
%265 = OpBitcast %5 %263
%266 = OpAccessChain %95 %74 %43 %262
OpStore %266 %264
%268 = OpIAdd %5 %262 %47
%267 = OpAccessChain %95 %74 %43 %268
OpStore %267 %265
%269 = OpIMul %5 %49 %55
%271 = OpBitcast %5 %270
%272 = OpBitcast %5 %270
%273 = OpBitcast %5 %270
%274 = OpAccessChain %95 %91 %43 %269
OpStore %274 %271
%276 = OpIAdd %5 %269 %47
%275 = OpAccessChain %95 %91 %43 %276
OpStore %275 %272
%278 = OpIAdd %5 %269 %51
%277 = OpAccessChain %95 %91 %43 %278
OpStore %277 %273
%280 = OpAccessChain %279 %40 %43
OpStore %280 %258
%281 = OpAccessChain %279 %40 %47
OpStore %281 %259
%282 = OpAccessChain %279 %40 %51
OpStore %282 %260
%283 = OpAccessChain %279 %40 %55
OpStore %283 %261
OpReturn
OpFunctionEnd
#endif
