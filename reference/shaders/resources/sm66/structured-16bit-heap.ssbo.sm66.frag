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

layout(set = 0, binding = 0, std430) restrict readonly buffer _13_16
{
    uint16_t _m0[];
} _16[];

layout(set = 0, binding = 0, std430) readonly buffer _18_21
{
    uint _m0[];
} _21[];

layout(set = 0, binding = 0, std430) readonly buffer _23_26
{
    uint16_t _m0[];
} _26[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _28_31
{
    uint16_t _m0[];
} _31[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _33_36
{
    uint _m0[];
} _36[];

layout(set = 0, binding = 0, std430) buffer _38_41
{
    uint16_t _m0[];
} _41[];

layout(set = 0, binding = 0, std430) buffer _43_46
{
    uint _m0[];
} _46[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _77 = INDEX + 1u;
    uint _84 = INDEX + 5u;
    uint _88 = INDEX + 8u;
    uint _94 = INDEX + 9u;
    uint _104 = uint(UV.y) * 2u;
    f16vec2 _115 = uint16BitsToFloat16(u16vec2(_16[_77]._m0[_104], _16[_77]._m0[_104 + 1u]));
    uint _121 = _21[INDEX + 4u]._m0[uint(UV.z)];
    uint _124 = uint(UV.w) * 2u;
    uint16_t _126 = _26[_84]._m0[_124];
    uint16_t _129 = _26[_84]._m0[_124 + 1u];
    f16vec2 _131 = uint16BitsToFloat16(u16vec2(_126, _129));
    f16vec4 _151 = uint16BitsToFloat16(u16vec4(_31[_88]._m0[4u], _31[_88]._m0[4u + 1u], _31[_88]._m0[4u + 2u], _31[_88]._m0[4u + 3u]));
    vec4 _177 = uintBitsToFloat(uvec4(_36[_88]._m0[4u], _36[_88]._m0[4u + 1u], _36[_88]._m0[4u + 2u], _36[_88]._m0[4u + 3u]));
    uint16_t _187 = _41[_94]._m0[4u];
    uint16_t _190 = _41[_94]._m0[4u + 1u];
    uint16_t _193 = _41[_94]._m0[4u + 2u];
    uint16_t _196 = _41[_94]._m0[4u + 3u];
    f16vec4 _198 = uint16BitsToFloat16(u16vec4(_187, _190, _193, _196));
    float _207 = (((float(_131.y) + uintBitsToFloat(_10[INDEX]._m0[uint(UV.x)])) + float(_151.x)) + _177.x) + float(_198.x);
    float _208 = ((float(_151.y) + float(_115.x)) + _177.y) + float(_198.y);
    float _209 = (((float(_115.y) + uintBitsToFloat(_121)) + float(_151.z)) + _177.z) + float(_198.z);
    float _210 = ((float(_151.w) + float(_131.x)) + _177.w) + float(_198.w);
    _46[_94]._m0[4u] = floatBitsToUint(_207);
    _46[_94]._m0[4u + 1u] = floatBitsToUint(_208);
    _46[_94]._m0[4u + 2u] = floatBitsToUint(_209);
    _46[_94]._m0[4u + 3u] = floatBitsToUint(_210);
    SV_Target.x = _207;
    SV_Target.y = _208;
    SV_Target.z = _209;
    SV_Target.w = _210;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 229
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %48 %52 %56
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %13 "SSBO"
OpName %18 "SSBO"
OpName %23 "SSBO"
OpName %28 "SSBO"
OpName %33 "SSBO"
OpName %38 "SSBO"
OpName %43 "SSBO"
OpName %48 "INDEX"
OpName %52 "UV"
OpName %56 "SV_Target"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonWritable
OpDecorate %10 Restrict
OpDecorate %12 ArrayStride 2
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %16 DescriptorSet 0
OpDecorate %16 Binding 0
OpDecorate %16 NonWritable
OpDecorate %16 Restrict
OpDecorate %17 ArrayStride 4
OpMemberDecorate %18 0 Offset 0
OpDecorate %18 Block
OpDecorate %21 DescriptorSet 0
OpDecorate %21 Binding 0
OpDecorate %21 NonWritable
OpDecorate %22 ArrayStride 2
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
OpDecorate %31 Restrict
OpDecorate %32 ArrayStride 4
OpMemberDecorate %33 0 Offset 0
OpDecorate %33 Block
OpDecorate %36 DescriptorSet 0
OpDecorate %36 Binding 0
OpDecorate %36 NonWritable
OpDecorate %36 Restrict
OpDecorate %37 ArrayStride 2
OpMemberDecorate %38 0 Offset 0
OpDecorate %38 Block
OpDecorate %41 DescriptorSet 0
OpDecorate %41 Binding 0
OpDecorate %41 Aliased
OpDecorate %42 ArrayStride 4
OpMemberDecorate %43 0 Offset 0
OpDecorate %43 Block
OpDecorate %46 DescriptorSet 0
OpDecorate %46 Binding 0
OpDecorate %46 Aliased
OpDecorate %48 Flat
OpDecorate %48 Location 0
OpDecorate %52 Flat
OpDecorate %52 Location 1
OpDecorate %56 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypeRuntimeArray %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypeInt 16 0
%12 = OpTypeRuntimeArray %11
%13 = OpTypeStruct %12
%14 = OpTypeRuntimeArray %13
%15 = OpTypePointer StorageBuffer %14
%16 = OpVariable %15 StorageBuffer
%17 = OpTypeRuntimeArray %5
%18 = OpTypeStruct %17
%19 = OpTypeRuntimeArray %18
%20 = OpTypePointer StorageBuffer %19
%21 = OpVariable %20 StorageBuffer
%22 = OpTypeRuntimeArray %11
%23 = OpTypeStruct %22
%24 = OpTypeRuntimeArray %23
%25 = OpTypePointer StorageBuffer %24
%26 = OpVariable %25 StorageBuffer
%27 = OpTypeRuntimeArray %11
%28 = OpTypeStruct %27
%29 = OpTypeRuntimeArray %28
%30 = OpTypePointer StorageBuffer %29
%31 = OpVariable %30 StorageBuffer
%32 = OpTypeRuntimeArray %5
%33 = OpTypeStruct %32
%34 = OpTypeRuntimeArray %33
%35 = OpTypePointer StorageBuffer %34
%36 = OpVariable %35 StorageBuffer
%37 = OpTypeRuntimeArray %11
%38 = OpTypeStruct %37
%39 = OpTypeRuntimeArray %38
%40 = OpTypePointer StorageBuffer %39
%41 = OpVariable %40 StorageBuffer
%42 = OpTypeRuntimeArray %5
%43 = OpTypeStruct %42
%44 = OpTypeRuntimeArray %43
%45 = OpTypePointer StorageBuffer %44
%46 = OpVariable %45 StorageBuffer
%47 = OpTypePointer Input %5
%48 = OpVariable %47 Input
%49 = OpTypeInt 32 1
%50 = OpTypeVector %49 4
%51 = OpTypePointer Input %50
%52 = OpVariable %51 Input
%53 = OpTypeFloat 32
%54 = OpTypeVector %53 4
%55 = OpTypePointer Output %54
%56 = OpVariable %55 Output
%57 = OpTypePointer Input %49
%59 = OpConstant %5 0
%63 = OpConstant %5 1
%67 = OpConstant %5 2
%71 = OpConstant %5 3
%75 = OpTypePointer StorageBuffer %7
%78 = OpTypePointer StorageBuffer %13
%81 = OpConstant %5 4
%82 = OpTypePointer StorageBuffer %18
%85 = OpConstant %5 5
%86 = OpTypePointer StorageBuffer %23
%89 = OpConstant %5 8
%90 = OpTypePointer StorageBuffer %28
%92 = OpTypePointer StorageBuffer %33
%95 = OpConstant %5 9
%96 = OpTypePointer StorageBuffer %38
%98 = OpTypePointer StorageBuffer %43
%100 = OpTypePointer StorageBuffer %5
%105 = OpTypePointer StorageBuffer %11
%111 = OpTypeVector %11 2
%113 = OpTypeFloat 16
%114 = OpTypeVector %113 2
%148 = OpTypeVector %11 4
%150 = OpTypeVector %113 4
%175 = OpTypeVector %5 4
%222 = OpTypePointer Output %53
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %227
%227 = OpLabel
%58 = OpAccessChain %57 %52 %59
%60 = OpLoad %49 %58
%61 = OpBitcast %5 %60
%62 = OpAccessChain %57 %52 %63
%64 = OpLoad %49 %62
%65 = OpBitcast %5 %64
%66 = OpAccessChain %57 %52 %67
%68 = OpLoad %49 %66
%69 = OpBitcast %5 %68
%70 = OpAccessChain %57 %52 %71
%72 = OpLoad %49 %70
%73 = OpBitcast %5 %72
%74 = OpLoad %5 %48
%76 = OpAccessChain %75 %10 %74
%77 = OpIAdd %5 %74 %63
%79 = OpAccessChain %78 %16 %77
%80 = OpIAdd %5 %74 %81
%83 = OpAccessChain %82 %21 %80
%84 = OpIAdd %5 %74 %85
%87 = OpAccessChain %86 %26 %84
%88 = OpIAdd %5 %74 %89
%91 = OpAccessChain %90 %31 %88
%93 = OpAccessChain %92 %36 %88
%94 = OpIAdd %5 %74 %95
%97 = OpAccessChain %96 %41 %94
%99 = OpAccessChain %98 %46 %94
%101 = OpAccessChain %100 %76 %59 %61
%102 = OpLoad %5 %101
%103 = OpBitcast %53 %102
%104 = OpIMul %5 %65 %67
%106 = OpAccessChain %105 %79 %59 %104
%107 = OpLoad %11 %106
%109 = OpIAdd %5 %104 %63
%108 = OpAccessChain %105 %79 %59 %109
%110 = OpLoad %11 %108
%112 = OpCompositeConstruct %111 %107 %110
%115 = OpBitcast %114 %112
%116 = OpCompositeExtract %113 %115 0
%117 = OpCompositeExtract %113 %115 1
%118 = OpFConvert %53 %116
%119 = OpFConvert %53 %117
%120 = OpAccessChain %100 %83 %59 %69
%121 = OpLoad %5 %120
%122 = OpBitcast %53 %121
%123 = OpFAdd %53 %119 %122
%124 = OpIMul %5 %73 %67
%125 = OpAccessChain %105 %87 %59 %124
%126 = OpLoad %11 %125
%128 = OpIAdd %5 %124 %63
%127 = OpAccessChain %105 %87 %59 %128
%129 = OpLoad %11 %127
%130 = OpCompositeConstruct %111 %126 %129
%131 = OpBitcast %114 %130
%132 = OpCompositeExtract %113 %131 0
%133 = OpCompositeExtract %113 %131 1
%134 = OpFConvert %53 %132
%135 = OpFConvert %53 %133
%136 = OpFAdd %53 %135 %103
%137 = OpAccessChain %105 %91 %59 %81
%138 = OpLoad %11 %137
%140 = OpIAdd %5 %81 %63
%139 = OpAccessChain %105 %91 %59 %140
%141 = OpLoad %11 %139
%143 = OpIAdd %5 %81 %67
%142 = OpAccessChain %105 %91 %59 %143
%144 = OpLoad %11 %142
%146 = OpIAdd %5 %81 %71
%145 = OpAccessChain %105 %91 %59 %146
%147 = OpLoad %11 %145
%149 = OpCompositeConstruct %148 %138 %141 %144 %147
%151 = OpBitcast %150 %149
%152 = OpCompositeExtract %113 %151 0
%153 = OpCompositeExtract %113 %151 1
%154 = OpCompositeExtract %113 %151 2
%155 = OpCompositeExtract %113 %151 3
%156 = OpFConvert %53 %152
%157 = OpFConvert %53 %153
%158 = OpFConvert %53 %154
%159 = OpFConvert %53 %155
%160 = OpFAdd %53 %136 %156
%161 = OpFAdd %53 %157 %118
%162 = OpFAdd %53 %123 %158
%163 = OpFAdd %53 %159 %134
%164 = OpAccessChain %100 %93 %59 %81
%165 = OpLoad %5 %164
%167 = OpIAdd %5 %81 %63
%166 = OpAccessChain %100 %93 %59 %167
%168 = OpLoad %5 %166
%170 = OpIAdd %5 %81 %67
%169 = OpAccessChain %100 %93 %59 %170
%171 = OpLoad %5 %169
%173 = OpIAdd %5 %81 %71
%172 = OpAccessChain %100 %93 %59 %173
%174 = OpLoad %5 %172
%176 = OpCompositeConstruct %175 %165 %168 %171 %174
%177 = OpBitcast %54 %176
%178 = OpCompositeExtract %53 %177 0
%179 = OpCompositeExtract %53 %177 1
%180 = OpCompositeExtract %53 %177 2
%181 = OpCompositeExtract %53 %177 3
%182 = OpFAdd %53 %160 %178
%183 = OpFAdd %53 %161 %179
%184 = OpFAdd %53 %162 %180
%185 = OpFAdd %53 %163 %181
%186 = OpAccessChain %105 %97 %59 %81
%187 = OpLoad %11 %186
%189 = OpIAdd %5 %81 %63
%188 = OpAccessChain %105 %97 %59 %189
%190 = OpLoad %11 %188
%192 = OpIAdd %5 %81 %67
%191 = OpAccessChain %105 %97 %59 %192
%193 = OpLoad %11 %191
%195 = OpIAdd %5 %81 %71
%194 = OpAccessChain %105 %97 %59 %195
%196 = OpLoad %11 %194
%197 = OpCompositeConstruct %148 %187 %190 %193 %196
%198 = OpBitcast %150 %197
%199 = OpCompositeExtract %113 %198 0
%200 = OpCompositeExtract %113 %198 1
%201 = OpCompositeExtract %113 %198 2
%202 = OpCompositeExtract %113 %198 3
%203 = OpFConvert %53 %199
%204 = OpFConvert %53 %200
%205 = OpFConvert %53 %201
%206 = OpFConvert %53 %202
%207 = OpFAdd %53 %182 %203
%208 = OpFAdd %53 %183 %204
%209 = OpFAdd %53 %184 %205
%210 = OpFAdd %53 %185 %206
%211 = OpBitcast %5 %207
%212 = OpBitcast %5 %208
%213 = OpBitcast %5 %209
%214 = OpBitcast %5 %210
%215 = OpAccessChain %100 %99 %59 %81
OpStore %215 %211
%217 = OpIAdd %5 %81 %63
%216 = OpAccessChain %100 %99 %59 %217
OpStore %216 %212
%219 = OpIAdd %5 %81 %67
%218 = OpAccessChain %100 %99 %59 %219
OpStore %218 %213
%221 = OpIAdd %5 %81 %71
%220 = OpAccessChain %100 %99 %59 %221
OpStore %220 %214
%223 = OpAccessChain %222 %56 %59
OpStore %223 %207
%224 = OpAccessChain %222 %56 %63
OpStore %224 %208
%225 = OpAccessChain %222 %56 %67
OpStore %225 %209
%226 = OpAccessChain %222 %56 %71
OpStore %226 %210
OpReturn
OpFunctionEnd
#endif
