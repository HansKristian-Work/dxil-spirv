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
    uint16_t _m0[];
} _24[];

layout(set = 1, binding = 0, std430) restrict readonly buffer _26_29
{
    uint _m0[];
} _29[];

layout(set = 4, binding = 0, std430) readonly buffer _31_34
{
    uint _m0[];
} _34[];

layout(set = 4, binding = 0, std430) readonly buffer _36_39
{
    uint16_t _m0[];
} _39[];

layout(set = 4, binding = 0, std430) buffer _41_44
{
    uint16_t _m0[];
} _44[];

layout(set = 4, binding = 0, std430) buffer _46_49
{
    uint _m0[];
} _49[];

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
    uint _90 = registers._m1 + 1u;
    uint _91 = uint(UV.y) * 2u;
    f16vec2 _102 = uint16BitsToFloat16(u16vec2(_19[_90]._m0[_91], _19[_90]._m0[_91 + 1u]));
    uint _114 = _34[registers._m4 + 2u]._m0[uint(UV.z)];
    uint _121 = registers._m4 + 3u;
    uint _122 = uint(UV.w) * 2u;
    uint16_t _124 = _39[_121]._m0[_122];
    uint16_t _127 = _39[_121]._m0[_122 + 1u];
    f16vec2 _129 = uint16BitsToFloat16(u16vec2(_124, _127));
    uint _139 = registers._m1 + 4u;
    uint _144 = registers._m1 + 4u;
    f16vec4 _159 = uint16BitsToFloat16(u16vec4(_24[_139]._m0[4u], _24[_139]._m0[4u + 1u], _24[_139]._m0[4u + 2u], _24[_139]._m0[4u + 3u]));
    vec4 _185 = uintBitsToFloat(uvec4(_29[_144]._m0[4u], _29[_144]._m0[4u + 1u], _29[_144]._m0[4u + 2u], _29[_144]._m0[4u + 3u]));
    uint _198 = registers._m4 + 5u;
    uint _204 = registers._m4 + 5u;
    uint16_t _206 = _44[_198]._m0[4u];
    uint16_t _209 = _44[_198]._m0[4u + 1u];
    uint16_t _212 = _44[_198]._m0[4u + 2u];
    uint16_t _215 = _44[_198]._m0[4u + 3u];
    f16vec4 _217 = uint16BitsToFloat16(u16vec4(_206, _209, _212, _215));
    float _226 = (((float(_129.y) + uintBitsToFloat(_13[registers._m1]._m0[uint(UV.x)])) + float(_159.x)) + _185.x) + float(_217.x);
    float _227 = ((float(_159.y) + float(_102.x)) + _185.y) + float(_217.y);
    float _228 = (((uintBitsToFloat(_114) + float(_102.y)) + float(_159.z)) + _185.z) + float(_217.z);
    float _229 = ((float(_159.w) + float(_129.x)) + _185.w) + float(_217.w);
    _49[_204]._m0[4u] = floatBitsToUint(_226);
    _49[_204]._m0[4u + 1u] = floatBitsToUint(_227);
    _49[_204]._m0[4u + 2u] = floatBitsToUint(_228);
    _49[_204]._m0[4u + 3u] = floatBitsToUint(_229);
    SV_Target.x = _226;
    SV_Target.y = _227;
    SV_Target.z = _228;
    SV_Target.w = _229;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 248
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %51 %55 %59
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
OpName %46 "SSBO"
OpName %51 "INDEX"
OpName %55 "UV"
OpName %59 "SV_Target"
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
OpDecorate %20 ArrayStride 2
OpMemberDecorate %21 0 Offset 0
OpDecorate %21 Block
OpDecorate %24 DescriptorSet 1
OpDecorate %24 Binding 0
OpDecorate %24 NonWritable
OpDecorate %24 Restrict
OpDecorate %25 ArrayStride 4
OpMemberDecorate %26 0 Offset 0
OpDecorate %26 Block
OpDecorate %29 DescriptorSet 1
OpDecorate %29 Binding 0
OpDecorate %29 NonWritable
OpDecorate %29 Restrict
OpDecorate %30 ArrayStride 4
OpMemberDecorate %31 0 Offset 0
OpDecorate %31 Block
OpDecorate %34 DescriptorSet 4
OpDecorate %34 Binding 0
OpDecorate %34 NonWritable
OpDecorate %35 ArrayStride 2
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
OpDecorate %44 Aliased
OpDecorate %45 ArrayStride 4
OpMemberDecorate %46 0 Offset 0
OpDecorate %46 Block
OpDecorate %49 DescriptorSet 4
OpDecorate %49 Binding 0
OpDecorate %49 Aliased
OpDecorate %51 Flat
OpDecorate %51 Location 0
OpDecorate %55 Flat
OpDecorate %55 Location 1
OpDecorate %59 Location 0
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
%20 = OpTypeRuntimeArray %14
%21 = OpTypeStruct %20
%22 = OpTypeRuntimeArray %21
%23 = OpTypePointer StorageBuffer %22
%24 = OpVariable %23 StorageBuffer
%25 = OpTypeRuntimeArray %5
%26 = OpTypeStruct %25
%27 = OpTypeRuntimeArray %26
%28 = OpTypePointer StorageBuffer %27
%29 = OpVariable %28 StorageBuffer
%30 = OpTypeRuntimeArray %5
%31 = OpTypeStruct %30
%32 = OpTypeRuntimeArray %31
%33 = OpTypePointer StorageBuffer %32
%34 = OpVariable %33 StorageBuffer
%35 = OpTypeRuntimeArray %14
%36 = OpTypeStruct %35
%37 = OpTypeRuntimeArray %36
%38 = OpTypePointer StorageBuffer %37
%39 = OpVariable %38 StorageBuffer
%40 = OpTypeRuntimeArray %14
%41 = OpTypeStruct %40
%42 = OpTypeRuntimeArray %41
%43 = OpTypePointer StorageBuffer %42
%44 = OpVariable %43 StorageBuffer
%45 = OpTypeRuntimeArray %5
%46 = OpTypeStruct %45
%47 = OpTypeRuntimeArray %46
%48 = OpTypePointer StorageBuffer %47
%49 = OpVariable %48 StorageBuffer
%50 = OpTypePointer Input %5
%51 = OpVariable %50 Input
%52 = OpTypeInt 32 1
%53 = OpTypeVector %52 4
%54 = OpTypePointer Input %53
%55 = OpVariable %54 Input
%56 = OpTypeFloat 32
%57 = OpTypeVector %56 4
%58 = OpTypePointer Output %57
%59 = OpVariable %58 Output
%60 = OpTypePointer Input %52
%62 = OpConstant %5 0
%66 = OpConstant %5 1
%70 = OpConstant %5 2
%74 = OpConstant %5 3
%77 = OpTypePointer StorageBuffer %10
%79 = OpTypePointer PushConstant %5
%82 = OpTypePointer StorageBuffer %5
%86 = OpTypePointer StorageBuffer %16
%92 = OpTypePointer StorageBuffer %14
%98 = OpTypeVector %14 2
%100 = OpTypeFloat 16
%101 = OpTypeVector %100 2
%107 = OpTypePointer StorageBuffer %31
%110 = OpConstant %5 4
%117 = OpTypePointer StorageBuffer %36
%135 = OpTypePointer StorageBuffer %21
%140 = OpTypePointer StorageBuffer %26
%156 = OpTypeVector %14 4
%158 = OpTypeVector %100 4
%183 = OpTypeVector %5 4
%194 = OpTypePointer StorageBuffer %41
%199 = OpConstant %5 5
%200 = OpTypePointer StorageBuffer %46
%241 = OpTypePointer Output %56
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %246
%246 = OpLabel
%61 = OpAccessChain %60 %55 %62
%63 = OpLoad %52 %61
%64 = OpBitcast %5 %63
%65 = OpAccessChain %60 %55 %66
%67 = OpLoad %52 %65
%68 = OpBitcast %5 %67
%69 = OpAccessChain %60 %55 %70
%71 = OpLoad %52 %69
%72 = OpBitcast %5 %71
%73 = OpAccessChain %60 %55 %74
%75 = OpLoad %52 %73
%76 = OpBitcast %5 %75
%80 = OpAccessChain %79 %8 %66
%81 = OpLoad %5 %80
%78 = OpAccessChain %77 %13 %81
%83 = OpAccessChain %82 %78 %62 %64
%84 = OpLoad %5 %83
%85 = OpBitcast %56 %84
%88 = OpAccessChain %79 %8 %66
%89 = OpLoad %5 %88
%90 = OpIAdd %5 %89 %66
%87 = OpAccessChain %86 %19 %90
%91 = OpIMul %5 %68 %70
%93 = OpAccessChain %92 %87 %62 %91
%94 = OpLoad %14 %93
%96 = OpIAdd %5 %91 %66
%95 = OpAccessChain %92 %87 %62 %96
%97 = OpLoad %14 %95
%99 = OpCompositeConstruct %98 %94 %97
%102 = OpBitcast %101 %99
%103 = OpCompositeExtract %100 %102 0
%104 = OpCompositeExtract %100 %102 1
%105 = OpFConvert %56 %103
%106 = OpFConvert %56 %104
%109 = OpAccessChain %79 %8 %110
%111 = OpLoad %5 %109
%112 = OpIAdd %5 %111 %70
%108 = OpAccessChain %107 %34 %112
%113 = OpAccessChain %82 %108 %62 %72
%114 = OpLoad %5 %113
%115 = OpBitcast %56 %114
%116 = OpFAdd %56 %115 %106
%119 = OpAccessChain %79 %8 %110
%120 = OpLoad %5 %119
%121 = OpIAdd %5 %120 %74
%118 = OpAccessChain %117 %39 %121
%122 = OpIMul %5 %76 %70
%123 = OpAccessChain %92 %118 %62 %122
%124 = OpLoad %14 %123
%126 = OpIAdd %5 %122 %66
%125 = OpAccessChain %92 %118 %62 %126
%127 = OpLoad %14 %125
%128 = OpCompositeConstruct %98 %124 %127
%129 = OpBitcast %101 %128
%130 = OpCompositeExtract %100 %129 0
%131 = OpCompositeExtract %100 %129 1
%132 = OpFConvert %56 %130
%133 = OpFConvert %56 %131
%134 = OpFAdd %56 %133 %85
%137 = OpAccessChain %79 %8 %66
%138 = OpLoad %5 %137
%139 = OpIAdd %5 %138 %110
%136 = OpAccessChain %135 %24 %139
%142 = OpAccessChain %79 %8 %66
%143 = OpLoad %5 %142
%144 = OpIAdd %5 %143 %110
%141 = OpAccessChain %140 %29 %144
%145 = OpAccessChain %92 %136 %62 %110
%146 = OpLoad %14 %145
%148 = OpIAdd %5 %110 %66
%147 = OpAccessChain %92 %136 %62 %148
%149 = OpLoad %14 %147
%151 = OpIAdd %5 %110 %70
%150 = OpAccessChain %92 %136 %62 %151
%152 = OpLoad %14 %150
%154 = OpIAdd %5 %110 %74
%153 = OpAccessChain %92 %136 %62 %154
%155 = OpLoad %14 %153
%157 = OpCompositeConstruct %156 %146 %149 %152 %155
%159 = OpBitcast %158 %157
%160 = OpCompositeExtract %100 %159 0
%161 = OpCompositeExtract %100 %159 1
%162 = OpCompositeExtract %100 %159 2
%163 = OpCompositeExtract %100 %159 3
%164 = OpFConvert %56 %160
%165 = OpFConvert %56 %161
%166 = OpFConvert %56 %162
%167 = OpFConvert %56 %163
%168 = OpFAdd %56 %134 %164
%169 = OpFAdd %56 %165 %105
%170 = OpFAdd %56 %116 %166
%171 = OpFAdd %56 %167 %132
%172 = OpAccessChain %82 %141 %62 %110
%173 = OpLoad %5 %172
%175 = OpIAdd %5 %110 %66
%174 = OpAccessChain %82 %141 %62 %175
%176 = OpLoad %5 %174
%178 = OpIAdd %5 %110 %70
%177 = OpAccessChain %82 %141 %62 %178
%179 = OpLoad %5 %177
%181 = OpIAdd %5 %110 %74
%180 = OpAccessChain %82 %141 %62 %181
%182 = OpLoad %5 %180
%184 = OpCompositeConstruct %183 %173 %176 %179 %182
%185 = OpBitcast %57 %184
%186 = OpCompositeExtract %56 %185 0
%187 = OpCompositeExtract %56 %185 1
%188 = OpCompositeExtract %56 %185 2
%189 = OpCompositeExtract %56 %185 3
%190 = OpFAdd %56 %168 %186
%191 = OpFAdd %56 %169 %187
%192 = OpFAdd %56 %170 %188
%193 = OpFAdd %56 %171 %189
%196 = OpAccessChain %79 %8 %110
%197 = OpLoad %5 %196
%198 = OpIAdd %5 %197 %199
%195 = OpAccessChain %194 %44 %198
%202 = OpAccessChain %79 %8 %110
%203 = OpLoad %5 %202
%204 = OpIAdd %5 %203 %199
%201 = OpAccessChain %200 %49 %204
%205 = OpAccessChain %92 %195 %62 %110
%206 = OpLoad %14 %205
%208 = OpIAdd %5 %110 %66
%207 = OpAccessChain %92 %195 %62 %208
%209 = OpLoad %14 %207
%211 = OpIAdd %5 %110 %70
%210 = OpAccessChain %92 %195 %62 %211
%212 = OpLoad %14 %210
%214 = OpIAdd %5 %110 %74
%213 = OpAccessChain %92 %195 %62 %214
%215 = OpLoad %14 %213
%216 = OpCompositeConstruct %156 %206 %209 %212 %215
%217 = OpBitcast %158 %216
%218 = OpCompositeExtract %100 %217 0
%219 = OpCompositeExtract %100 %217 1
%220 = OpCompositeExtract %100 %217 2
%221 = OpCompositeExtract %100 %217 3
%222 = OpFConvert %56 %218
%223 = OpFConvert %56 %219
%224 = OpFConvert %56 %220
%225 = OpFConvert %56 %221
%226 = OpFAdd %56 %190 %222
%227 = OpFAdd %56 %191 %223
%228 = OpFAdd %56 %192 %224
%229 = OpFAdd %56 %193 %225
%230 = OpBitcast %5 %226
%231 = OpBitcast %5 %227
%232 = OpBitcast %5 %228
%233 = OpBitcast %5 %229
%234 = OpAccessChain %82 %201 %62 %110
OpStore %234 %230
%236 = OpIAdd %5 %110 %66
%235 = OpAccessChain %82 %201 %62 %236
OpStore %235 %231
%238 = OpIAdd %5 %110 %70
%237 = OpAccessChain %82 %201 %62 %238
OpStore %237 %232
%240 = OpIAdd %5 %110 %74
%239 = OpAccessChain %82 %201 %62 %240
OpStore %239 %233
%242 = OpAccessChain %241 %59 %62
OpStore %242 %226
%243 = OpAccessChain %241 %59 %66
OpStore %243 %227
%244 = OpAccessChain %241 %59 %70
OpStore %244 %228
%245 = OpAccessChain %241 %59 %74
OpStore %245 %229
OpReturn
OpFunctionEnd
#endif
