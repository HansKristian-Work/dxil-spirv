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

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _10[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _12_15
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
    uint _m0[];
} _31[];

layout(set = 0, binding = 0, std430) readonly buffer _33_36
{
    uint16_t _m0[];
} _36[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _38_41
{
    uint _m0[];
} _41[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _43_46
{
    uint16_t _m0[];
} _46[];

layout(set = 0, binding = 0, std430) buffer _48_51
{
    uint _m0[];
} _51[];

layout(set = 0, binding = 0, std430) buffer _53_56
{
    uint16_t _m0[];
} _56[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _87 = INDEX + 1u;
    uint _96 = INDEX + 5u;
    uint _102 = INDEX + 8u;
    uint _108 = INDEX + 9u;
    uint _118 = uint(UV.y) * 2u;
    f16vec2 _129 = uint16BitsToFloat16(u16vec2(_21[_87]._m0[_118], _21[_87]._m0[_118 + 1u]));
    uint _135 = _26[INDEX + 4u]._m0[uint(UV.z)];
    uint _138 = uint(UV.w) * 2u;
    uint16_t _140 = _36[_96]._m0[_138];
    uint16_t _143 = _36[_96]._m0[_138 + 1u];
    f16vec2 _145 = uint16BitsToFloat16(u16vec2(_140, _143));
    f16vec4 _165 = uint16BitsToFloat16(u16vec4(_46[_102]._m0[4u], _46[_102]._m0[4u + 1u], _46[_102]._m0[4u + 2u], _46[_102]._m0[4u + 3u]));
    vec4 _191 = uintBitsToFloat(uvec4(_41[_102]._m0[4u], _41[_102]._m0[4u + 1u], _41[_102]._m0[4u + 2u], _41[_102]._m0[4u + 3u]));
    uint16_t _201 = _56[_108]._m0[4u];
    uint16_t _204 = _56[_108]._m0[4u + 1u];
    uint16_t _207 = _56[_108]._m0[4u + 2u];
    uint16_t _210 = _56[_108]._m0[4u + 3u];
    f16vec4 _212 = uint16BitsToFloat16(u16vec4(_201, _204, _207, _210));
    float _221 = (((float(_145.y) + uintBitsToFloat(_10[INDEX]._m0[uint(UV.x)])) + float(_165.x)) + _191.x) + float(_212.x);
    float _222 = ((float(_165.y) + float(_129.x)) + _191.y) + float(_212.y);
    float _223 = (((float(_129.y) + uintBitsToFloat(_135)) + float(_165.z)) + _191.z) + float(_212.z);
    float _224 = ((float(_165.w) + float(_145.x)) + _191.w) + float(_212.w);
    _51[_108]._m0[4u] = floatBitsToUint(_221);
    _51[_108]._m0[4u + 1u] = floatBitsToUint(_222);
    _51[_108]._m0[4u + 2u] = floatBitsToUint(_223);
    _51[_108]._m0[4u + 3u] = floatBitsToUint(_224);
    SV_Target.x = _221;
    SV_Target.y = _222;
    SV_Target.z = _223;
    SV_Target.w = _224;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 243
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %58 %62 %66
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %12 "SSBO"
OpName %18 "SSBO"
OpName %23 "SSBO"
OpName %28 "SSBO"
OpName %33 "SSBO"
OpName %38 "SSBO"
OpName %43 "SSBO"
OpName %48 "SSBO"
OpName %53 "SSBO"
OpName %58 "INDEX"
OpName %62 "UV"
OpName %66 "SV_Target"
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
OpDecorate %27 ArrayStride 4
OpMemberDecorate %28 0 Offset 0
OpDecorate %28 Block
OpDecorate %31 DescriptorSet 0
OpDecorate %31 Binding 0
OpDecorate %31 NonWritable
OpDecorate %31 Aliased
OpDecorate %32 ArrayStride 2
OpMemberDecorate %33 0 Offset 0
OpDecorate %33 Block
OpDecorate %36 DescriptorSet 0
OpDecorate %36 Binding 0
OpDecorate %36 NonWritable
OpDecorate %36 Aliased
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
OpDecorate %46 NonWritable
OpDecorate %46 Restrict
OpDecorate %47 ArrayStride 4
OpMemberDecorate %48 0 Offset 0
OpDecorate %48 Block
OpDecorate %51 DescriptorSet 0
OpDecorate %51 Binding 0
OpDecorate %51 Aliased
OpDecorate %52 ArrayStride 2
OpMemberDecorate %53 0 Offset 0
OpDecorate %53 Block
OpDecorate %56 DescriptorSet 0
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
%27 = OpTypeRuntimeArray %5
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
%52 = OpTypeRuntimeArray %16
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
%85 = OpTypePointer StorageBuffer %7
%88 = OpTypePointer StorageBuffer %18
%90 = OpTypePointer StorageBuffer %12
%93 = OpConstant %5 4
%94 = OpTypePointer StorageBuffer %23
%97 = OpConstant %5 5
%98 = OpTypePointer StorageBuffer %33
%100 = OpTypePointer StorageBuffer %28
%103 = OpConstant %5 8
%104 = OpTypePointer StorageBuffer %43
%106 = OpTypePointer StorageBuffer %38
%109 = OpConstant %5 9
%110 = OpTypePointer StorageBuffer %53
%112 = OpTypePointer StorageBuffer %48
%114 = OpTypePointer StorageBuffer %5
%119 = OpTypePointer StorageBuffer %16
%125 = OpTypeVector %16 2
%127 = OpTypeFloat 16
%128 = OpTypeVector %127 2
%162 = OpTypeVector %16 4
%164 = OpTypeVector %127 4
%189 = OpTypeVector %5 4
%236 = OpTypePointer Output %63
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %241
%241 = OpLabel
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
%84 = OpLoad %5 %58
%86 = OpAccessChain %85 %10 %84
%87 = OpIAdd %5 %84 %73
%89 = OpAccessChain %88 %21 %87
%91 = OpAccessChain %90 %15 %87
%92 = OpIAdd %5 %84 %93
%95 = OpAccessChain %94 %26 %92
%96 = OpIAdd %5 %84 %97
%99 = OpAccessChain %98 %36 %96
%101 = OpAccessChain %100 %31 %96
%102 = OpIAdd %5 %84 %103
%105 = OpAccessChain %104 %46 %102
%107 = OpAccessChain %106 %41 %102
%108 = OpIAdd %5 %84 %109
%111 = OpAccessChain %110 %56 %108
%113 = OpAccessChain %112 %51 %108
%115 = OpAccessChain %114 %86 %69 %71
%116 = OpLoad %5 %115
%117 = OpBitcast %63 %116
%118 = OpIMul %5 %75 %77
%120 = OpAccessChain %119 %89 %69 %118
%121 = OpLoad %16 %120
%123 = OpIAdd %5 %118 %73
%122 = OpAccessChain %119 %89 %69 %123
%124 = OpLoad %16 %122
%126 = OpCompositeConstruct %125 %121 %124
%129 = OpBitcast %128 %126
%130 = OpCompositeExtract %127 %129 0
%131 = OpCompositeExtract %127 %129 1
%132 = OpFConvert %63 %130
%133 = OpFConvert %63 %131
%134 = OpAccessChain %114 %95 %69 %79
%135 = OpLoad %5 %134
%136 = OpBitcast %63 %135
%137 = OpFAdd %63 %133 %136
%138 = OpIMul %5 %83 %77
%139 = OpAccessChain %119 %99 %69 %138
%140 = OpLoad %16 %139
%142 = OpIAdd %5 %138 %73
%141 = OpAccessChain %119 %99 %69 %142
%143 = OpLoad %16 %141
%144 = OpCompositeConstruct %125 %140 %143
%145 = OpBitcast %128 %144
%146 = OpCompositeExtract %127 %145 0
%147 = OpCompositeExtract %127 %145 1
%148 = OpFConvert %63 %146
%149 = OpFConvert %63 %147
%150 = OpFAdd %63 %149 %117
%151 = OpAccessChain %119 %105 %69 %93
%152 = OpLoad %16 %151
%154 = OpIAdd %5 %93 %73
%153 = OpAccessChain %119 %105 %69 %154
%155 = OpLoad %16 %153
%157 = OpIAdd %5 %93 %77
%156 = OpAccessChain %119 %105 %69 %157
%158 = OpLoad %16 %156
%160 = OpIAdd %5 %93 %81
%159 = OpAccessChain %119 %105 %69 %160
%161 = OpLoad %16 %159
%163 = OpCompositeConstruct %162 %152 %155 %158 %161
%165 = OpBitcast %164 %163
%166 = OpCompositeExtract %127 %165 0
%167 = OpCompositeExtract %127 %165 1
%168 = OpCompositeExtract %127 %165 2
%169 = OpCompositeExtract %127 %165 3
%170 = OpFConvert %63 %166
%171 = OpFConvert %63 %167
%172 = OpFConvert %63 %168
%173 = OpFConvert %63 %169
%174 = OpFAdd %63 %150 %170
%175 = OpFAdd %63 %171 %132
%176 = OpFAdd %63 %137 %172
%177 = OpFAdd %63 %173 %148
%178 = OpAccessChain %114 %107 %69 %93
%179 = OpLoad %5 %178
%181 = OpIAdd %5 %93 %73
%180 = OpAccessChain %114 %107 %69 %181
%182 = OpLoad %5 %180
%184 = OpIAdd %5 %93 %77
%183 = OpAccessChain %114 %107 %69 %184
%185 = OpLoad %5 %183
%187 = OpIAdd %5 %93 %81
%186 = OpAccessChain %114 %107 %69 %187
%188 = OpLoad %5 %186
%190 = OpCompositeConstruct %189 %179 %182 %185 %188
%191 = OpBitcast %64 %190
%192 = OpCompositeExtract %63 %191 0
%193 = OpCompositeExtract %63 %191 1
%194 = OpCompositeExtract %63 %191 2
%195 = OpCompositeExtract %63 %191 3
%196 = OpFAdd %63 %174 %192
%197 = OpFAdd %63 %175 %193
%198 = OpFAdd %63 %176 %194
%199 = OpFAdd %63 %177 %195
%200 = OpAccessChain %119 %111 %69 %93
%201 = OpLoad %16 %200
%203 = OpIAdd %5 %93 %73
%202 = OpAccessChain %119 %111 %69 %203
%204 = OpLoad %16 %202
%206 = OpIAdd %5 %93 %77
%205 = OpAccessChain %119 %111 %69 %206
%207 = OpLoad %16 %205
%209 = OpIAdd %5 %93 %81
%208 = OpAccessChain %119 %111 %69 %209
%210 = OpLoad %16 %208
%211 = OpCompositeConstruct %162 %201 %204 %207 %210
%212 = OpBitcast %164 %211
%213 = OpCompositeExtract %127 %212 0
%214 = OpCompositeExtract %127 %212 1
%215 = OpCompositeExtract %127 %212 2
%216 = OpCompositeExtract %127 %212 3
%217 = OpFConvert %63 %213
%218 = OpFConvert %63 %214
%219 = OpFConvert %63 %215
%220 = OpFConvert %63 %216
%221 = OpFAdd %63 %196 %217
%222 = OpFAdd %63 %197 %218
%223 = OpFAdd %63 %198 %219
%224 = OpFAdd %63 %199 %220
%225 = OpBitcast %5 %221
%226 = OpBitcast %5 %222
%227 = OpBitcast %5 %223
%228 = OpBitcast %5 %224
%229 = OpAccessChain %114 %113 %69 %93
OpStore %229 %225
%231 = OpIAdd %5 %93 %73
%230 = OpAccessChain %114 %113 %69 %231
OpStore %230 %226
%233 = OpIAdd %5 %93 %77
%232 = OpAccessChain %114 %113 %69 %233
OpStore %232 %227
%235 = OpIAdd %5 %93 %81
%234 = OpAccessChain %114 %113 %69 %235
OpStore %234 %228
%237 = OpAccessChain %236 %66 %69
OpStore %237 %221
%238 = OpAccessChain %236 %66 %73
OpStore %238 %222
%239 = OpAccessChain %236 %66 %77
OpStore %239 %223
%240 = OpAccessChain %236 %66 %81
OpStore %240 %224
OpReturn
OpFunctionEnd
#endif
