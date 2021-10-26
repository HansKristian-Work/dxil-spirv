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

layout(set = 1, binding = 0, std430) restrict readonly buffer _26_29
{
    uint16_t _m0[];
} _29[];

layout(set = 4, binding = 0, std430) readonly buffer _31_34
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
    uint _m0[];
} _49[];

layout(set = 4, binding = 0, std430) buffer _51_54
{
    uint16_t _m0[];
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
    uint _95 = registers._m1 + 1u;
    uint _100 = uint(UV.y) * 2u;
    f16vec2 _111 = uint16BitsToFloat16(u16vec2(_19[_95]._m0[_100], _19[_95]._m0[_100 + 1u]));
    uint _123 = _34[registers._m4 + 2u]._m0[uint(UV.z)];
    uint _130 = registers._m4 + 3u;
    uint _136 = uint(UV.w) * 2u;
    uint16_t _138 = _44[_130]._m0[_136];
    uint16_t _141 = _44[_130]._m0[_136 + 1u];
    f16vec2 _143 = uint16BitsToFloat16(u16vec2(_138, _141));
    uint _153 = registers._m1 + 4u;
    uint _158 = registers._m1 + 4u;
    f16vec4 _173 = uint16BitsToFloat16(u16vec4(_29[_153]._m0[4u], _29[_153]._m0[4u + 1u], _29[_153]._m0[4u + 2u], _29[_153]._m0[4u + 3u]));
    vec4 _199 = uintBitsToFloat(uvec4(_24[_158]._m0[4u], _24[_158]._m0[4u + 1u], _24[_158]._m0[4u + 2u], _24[_158]._m0[4u + 3u]));
    uint _212 = registers._m4 + 5u;
    uint _218 = registers._m4 + 5u;
    uint16_t _220 = _54[_212]._m0[4u];
    uint16_t _223 = _54[_212]._m0[4u + 1u];
    uint16_t _226 = _54[_212]._m0[4u + 2u];
    uint16_t _229 = _54[_212]._m0[4u + 3u];
    f16vec4 _231 = uint16BitsToFloat16(u16vec4(_220, _223, _226, _229));
    float _240 = (((float(_143.y) + uintBitsToFloat(_13[registers._m1]._m0[uint(UV.x)])) + float(_173.x)) + _199.x) + float(_231.x);
    float _241 = ((float(_173.y) + float(_111.x)) + _199.y) + float(_231.y);
    float _242 = (((uintBitsToFloat(_123) + float(_111.y)) + float(_173.z)) + _199.z) + float(_231.z);
    float _243 = ((float(_173.w) + float(_143.x)) + _199.w) + float(_231.w);
    _49[_218]._m0[4u] = floatBitsToUint(_240);
    _49[_218]._m0[4u + 1u] = floatBitsToUint(_241);
    _49[_218]._m0[4u + 2u] = floatBitsToUint(_242);
    _49[_218]._m0[4u + 3u] = floatBitsToUint(_243);
    SV_Target.x = _240;
    SV_Target.y = _241;
    SV_Target.z = _242;
    SV_Target.w = _243;
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
OpEntryPoint Fragment %3 "main" %56 %60 %64
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
OpDecorate %34 DescriptorSet 4
OpDecorate %34 Binding 0
OpDecorate %34 NonWritable
OpDecorate %35 ArrayStride 4
OpMemberDecorate %36 0 Offset 0
OpDecorate %36 Block
OpDecorate %39 DescriptorSet 4
OpDecorate %39 Binding 0
OpDecorate %39 NonWritable
OpDecorate %39 Aliased
OpDecorate %40 ArrayStride 2
OpMemberDecorate %41 0 Offset 0
OpDecorate %41 Block
OpDecorate %44 DescriptorSet 4
OpDecorate %44 Binding 0
OpDecorate %44 NonWritable
OpDecorate %44 Aliased
OpDecorate %45 ArrayStride 4
OpMemberDecorate %46 0 Offset 0
OpDecorate %46 Block
OpDecorate %49 DescriptorSet 4
OpDecorate %49 Binding 0
OpDecorate %49 Aliased
OpDecorate %50 ArrayStride 2
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
%25 = OpTypeRuntimeArray %14
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
%50 = OpTypeRuntimeArray %14
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
%82 = OpTypePointer StorageBuffer %10
%84 = OpTypePointer PushConstant %5
%87 = OpTypePointer StorageBuffer %5
%91 = OpTypePointer StorageBuffer %16
%101 = OpTypePointer StorageBuffer %14
%107 = OpTypeVector %14 2
%109 = OpTypeFloat 16
%110 = OpTypeVector %109 2
%116 = OpTypePointer StorageBuffer %31
%119 = OpConstant %5 4
%126 = OpTypePointer StorageBuffer %41
%131 = OpTypePointer StorageBuffer %36
%149 = OpTypePointer StorageBuffer %26
%154 = OpTypePointer StorageBuffer %21
%170 = OpTypeVector %14 4
%172 = OpTypeVector %109 4
%197 = OpTypeVector %5 4
%208 = OpTypePointer StorageBuffer %51
%213 = OpConstant %5 5
%214 = OpTypePointer StorageBuffer %46
%255 = OpTypePointer Output %61
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %260
%260 = OpLabel
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
%83 = OpAccessChain %82 %13 %86
%88 = OpAccessChain %87 %83 %67 %69
%89 = OpLoad %5 %88
%90 = OpBitcast %61 %89
%93 = OpAccessChain %84 %8 %71
%94 = OpLoad %5 %93
%95 = OpIAdd %5 %94 %71
%92 = OpAccessChain %91 %19 %95
%97 = OpAccessChain %84 %8 %71
%98 = OpLoad %5 %97
%99 = OpIAdd %5 %98 %71
%96 = OpAccessChain %82 %13 %99
%100 = OpIMul %5 %73 %75
%102 = OpAccessChain %101 %92 %67 %100
%103 = OpLoad %14 %102
%105 = OpIAdd %5 %100 %71
%104 = OpAccessChain %101 %92 %67 %105
%106 = OpLoad %14 %104
%108 = OpCompositeConstruct %107 %103 %106
%111 = OpBitcast %110 %108
%112 = OpCompositeExtract %109 %111 0
%113 = OpCompositeExtract %109 %111 1
%114 = OpFConvert %61 %112
%115 = OpFConvert %61 %113
%118 = OpAccessChain %84 %8 %119
%120 = OpLoad %5 %118
%121 = OpIAdd %5 %120 %75
%117 = OpAccessChain %116 %34 %121
%122 = OpAccessChain %87 %117 %67 %77
%123 = OpLoad %5 %122
%124 = OpBitcast %61 %123
%125 = OpFAdd %61 %124 %115
%128 = OpAccessChain %84 %8 %119
%129 = OpLoad %5 %128
%130 = OpIAdd %5 %129 %79
%127 = OpAccessChain %126 %44 %130
%133 = OpAccessChain %84 %8 %119
%134 = OpLoad %5 %133
%135 = OpIAdd %5 %134 %79
%132 = OpAccessChain %131 %39 %135
%136 = OpIMul %5 %81 %75
%137 = OpAccessChain %101 %127 %67 %136
%138 = OpLoad %14 %137
%140 = OpIAdd %5 %136 %71
%139 = OpAccessChain %101 %127 %67 %140
%141 = OpLoad %14 %139
%142 = OpCompositeConstruct %107 %138 %141
%143 = OpBitcast %110 %142
%144 = OpCompositeExtract %109 %143 0
%145 = OpCompositeExtract %109 %143 1
%146 = OpFConvert %61 %144
%147 = OpFConvert %61 %145
%148 = OpFAdd %61 %147 %90
%151 = OpAccessChain %84 %8 %71
%152 = OpLoad %5 %151
%153 = OpIAdd %5 %152 %119
%150 = OpAccessChain %149 %29 %153
%156 = OpAccessChain %84 %8 %71
%157 = OpLoad %5 %156
%158 = OpIAdd %5 %157 %119
%155 = OpAccessChain %154 %24 %158
%159 = OpAccessChain %101 %150 %67 %119
%160 = OpLoad %14 %159
%162 = OpIAdd %5 %119 %71
%161 = OpAccessChain %101 %150 %67 %162
%163 = OpLoad %14 %161
%165 = OpIAdd %5 %119 %75
%164 = OpAccessChain %101 %150 %67 %165
%166 = OpLoad %14 %164
%168 = OpIAdd %5 %119 %79
%167 = OpAccessChain %101 %150 %67 %168
%169 = OpLoad %14 %167
%171 = OpCompositeConstruct %170 %160 %163 %166 %169
%173 = OpBitcast %172 %171
%174 = OpCompositeExtract %109 %173 0
%175 = OpCompositeExtract %109 %173 1
%176 = OpCompositeExtract %109 %173 2
%177 = OpCompositeExtract %109 %173 3
%178 = OpFConvert %61 %174
%179 = OpFConvert %61 %175
%180 = OpFConvert %61 %176
%181 = OpFConvert %61 %177
%182 = OpFAdd %61 %148 %178
%183 = OpFAdd %61 %179 %114
%184 = OpFAdd %61 %125 %180
%185 = OpFAdd %61 %181 %146
%186 = OpAccessChain %87 %155 %67 %119
%187 = OpLoad %5 %186
%189 = OpIAdd %5 %119 %71
%188 = OpAccessChain %87 %155 %67 %189
%190 = OpLoad %5 %188
%192 = OpIAdd %5 %119 %75
%191 = OpAccessChain %87 %155 %67 %192
%193 = OpLoad %5 %191
%195 = OpIAdd %5 %119 %79
%194 = OpAccessChain %87 %155 %67 %195
%196 = OpLoad %5 %194
%198 = OpCompositeConstruct %197 %187 %190 %193 %196
%199 = OpBitcast %62 %198
%200 = OpCompositeExtract %61 %199 0
%201 = OpCompositeExtract %61 %199 1
%202 = OpCompositeExtract %61 %199 2
%203 = OpCompositeExtract %61 %199 3
%204 = OpFAdd %61 %182 %200
%205 = OpFAdd %61 %183 %201
%206 = OpFAdd %61 %184 %202
%207 = OpFAdd %61 %185 %203
%210 = OpAccessChain %84 %8 %119
%211 = OpLoad %5 %210
%212 = OpIAdd %5 %211 %213
%209 = OpAccessChain %208 %54 %212
%216 = OpAccessChain %84 %8 %119
%217 = OpLoad %5 %216
%218 = OpIAdd %5 %217 %213
%215 = OpAccessChain %214 %49 %218
%219 = OpAccessChain %101 %209 %67 %119
%220 = OpLoad %14 %219
%222 = OpIAdd %5 %119 %71
%221 = OpAccessChain %101 %209 %67 %222
%223 = OpLoad %14 %221
%225 = OpIAdd %5 %119 %75
%224 = OpAccessChain %101 %209 %67 %225
%226 = OpLoad %14 %224
%228 = OpIAdd %5 %119 %79
%227 = OpAccessChain %101 %209 %67 %228
%229 = OpLoad %14 %227
%230 = OpCompositeConstruct %170 %220 %223 %226 %229
%231 = OpBitcast %172 %230
%232 = OpCompositeExtract %109 %231 0
%233 = OpCompositeExtract %109 %231 1
%234 = OpCompositeExtract %109 %231 2
%235 = OpCompositeExtract %109 %231 3
%236 = OpFConvert %61 %232
%237 = OpFConvert %61 %233
%238 = OpFConvert %61 %234
%239 = OpFConvert %61 %235
%240 = OpFAdd %61 %204 %236
%241 = OpFAdd %61 %205 %237
%242 = OpFAdd %61 %206 %238
%243 = OpFAdd %61 %207 %239
%244 = OpBitcast %5 %240
%245 = OpBitcast %5 %241
%246 = OpBitcast %5 %242
%247 = OpBitcast %5 %243
%248 = OpAccessChain %87 %215 %67 %119
OpStore %248 %244
%250 = OpIAdd %5 %119 %71
%249 = OpAccessChain %87 %215 %67 %250
OpStore %249 %245
%252 = OpIAdd %5 %119 %75
%251 = OpAccessChain %87 %215 %67 %252
OpStore %251 %246
%254 = OpIAdd %5 %119 %79
%253 = OpAccessChain %87 %215 %67 %254
OpStore %253 %247
%256 = OpAccessChain %255 %64 %67
OpStore %256 %240
%257 = OpAccessChain %255 %64 %71
OpStore %257 %241
%258 = OpAccessChain %255 %64 %75
OpStore %258 %242
%259 = OpAccessChain %255 %64 %79
OpStore %259 %243
OpReturn
OpFunctionEnd
#endif
