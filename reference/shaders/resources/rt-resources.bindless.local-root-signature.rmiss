#version 460
#extension GL_ARB_gpu_shader_int64 : require
#extension GL_NV_ray_tracing : require
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

struct _38
{
    vec4 _m0;
    uint _m1;
};

layout(buffer_reference) buffer PhysicalPointerFloat4NonWrite;
layout(buffer_reference) buffer PhysicalPointerUintNonWrite;
layout(buffer_reference) buffer PhysicalPointerUint2NonWrite;
layout(buffer_reference) buffer PhysicalPointerUint3NonWrite;
layout(buffer_reference) buffer PhysicalPointerUint4NonWrite;
layout(buffer_reference) buffer PhysicalPointerFloat;
layout(buffer_reference) buffer PhysicalPointerUint;
layout(buffer_reference, std430) buffer PhysicalPointerFloat4NonWrite
{
    vec4 value;
};

layout(buffer_reference, std430) buffer PhysicalPointerUintNonWrite
{
    uint value;
};

layout(buffer_reference, std430) buffer PhysicalPointerUint2NonWrite
{
    uvec2 value;
};

layout(buffer_reference, std430) buffer PhysicalPointerUint3NonWrite
{
    uvec3 value;
};

layout(buffer_reference, std430) buffer PhysicalPointerUint4NonWrite
{
    uvec4 value;
};

layout(buffer_reference, std430) buffer PhysicalPointerFloat
{
    float value;
};

layout(buffer_reference, std430) buffer PhysicalPointerUint
{
    uint value;
};

layout(shaderRecordNV, std430) buffer SBTBlock
{
    uint _m0[5];
    uint _m1[6];
    uint64_t _m2;
    uint64_t _m3;
    uint64_t _m4;
    uint64_t _m5;
    uint64_t _m6;
    uvec2 _m7;
    uvec2 _m8;
    uvec2 _m9;
    uvec2 _m10;
} SBT;

layout(set = 5, binding = 0, std140) uniform BindlessCBV
{
    vec4 _m0[4096];
} _33[];

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

layout(set = 0, binding = 0) uniform texture2D _22[];
layout(set = 3, binding = 0, r32f) uniform readonly image2D _26[];
layout(set = 2, binding = 0) uniform sampler _37[];
layout(location = 0) rayPayloadInNV _38 payload;

vec4 _393;
float _403;

void main()
{
    uint _54 = (SBT._m9.x >> 6u) + 12u;
    uint _59 = payload._m1;
    vec4 _70 = texelFetch(_22[nonuniformEXT(registers._m0 + (_59 & 1u))], ivec2(uvec2(0u)), int(0u));
    vec4 _83 = texelFetch(_22[nonuniformEXT(registers._m0 + _59)], ivec2(uvec2(0u)), int(0u));
    vec4 _102 = texelFetch(_22[nonuniformEXT(((SBT._m7.x >> 6u) + 17u) + _59)], ivec2(uvec2(0u)), int(0u));
    vec4 _122 = imageLoad(_26[nonuniformEXT(((SBT._m8.x >> 6u) + 18u) + _59)], ivec2(uvec2(0u)));
    uint _149 = ((SBT._m9.x >> 6u) + 13u) + _59;
    vec4 _172 = uintBitsToFloat(uvec4(SBT._m0[0u], SBT._m0[1u], SBT._m0[2u], SBT._m0[3u]));
    vec4 _185 = uintBitsToFloat(uvec4(SBT._m0[4u], 0u, 0u, 0u));
    PhysicalPointerFloat4NonWrite _200 = PhysicalPointerFloat4NonWrite(SBT._m6 + uint64_t(1u * 16u));
    uint _212 = payload._m1;
    vec4 _231 = textureLodOffset(sampler2D(_22[nonuniformEXT(registers._m0 + (_212 & 1u))], _37[nonuniformEXT((SBT._m10.x >> 5u) + 13u)]), vec2(0.5), 0.0, ivec2(0));
    vec4 _259 = textureLodOffset(sampler2D(_22[nonuniformEXT(registers._m0 + _212)], _37[nonuniformEXT(((SBT._m10.x >> 5u) + 14u) + (_212 ^ 1u))]), vec2(0.5), 0.0, ivec2(0));
    PhysicalPointerFloat4NonWrite _275 = PhysicalPointerFloat4NonWrite(SBT._m2 + uint64_t((_212 * 16u) + 0u));
    float _297 = uintBitsToFloat(PhysicalPointerUintNonWrite(SBT._m4 + uint64_t(_212 << 2u)).value);
    PhysicalPointerUint2NonWrite _307 = PhysicalPointerUint2NonWrite(SBT._m4 + uint64_t(_212 << 3u));
    float _313 = uintBitsToFloat(_307.value.x);
    float _314 = uintBitsToFloat(_307.value.y);
    PhysicalPointerUint3NonWrite _325 = PhysicalPointerUint3NonWrite(SBT._m4 + uint64_t(_212 * 12u));
    float _334 = uintBitsToFloat(_325.value.z);
    uint _339 = payload._m1;
    PhysicalPointerUint4NonWrite _345 = PhysicalPointerUint4NonWrite(SBT._m4 + uint64_t(_339 << 4u));
    PhysicalPointerFloat _369 = PhysicalPointerFloat(SBT._m3 + uint64_t((_339 * 4u) + 0u));
    uint _377 = _339 << 2u;
    float _387 = uintBitsToFloat(PhysicalPointerUint(SBT._m5 + uint64_t(_377)).value);
    float _388 = ((((((((((((((((_70.x + _83.x) + _102.x) + _122.x) + _33[nonuniformEXT(_54)]._m0[0u].x) + _33[nonuniformEXT(_149)]._m0[0u].x) + _172.x) + _185.x) + _200.value.x) + _231.x) + _259.x) + _275.value.x) + _297) + _313) + uintBitsToFloat(_325.value.x)) + uintBitsToFloat(_345.value.x)) + _369.value) + _387;
    float _389 = ((((((((((((((((_70.y + _83.y) + _102.y) + _122.y) + _33[nonuniformEXT(_54)]._m0[0u].y) + _33[nonuniformEXT(_149)]._m0[0u].y) + _172.y) + _185.y) + _200.value.y) + _231.y) + _259.y) + _275.value.y) + _297) + _314) + uintBitsToFloat(_325.value.y)) + uintBitsToFloat(_345.value.y)) + _369.value) + _387;
    vec4 _392 = _393;
    _392.x = _388;
    vec4 _394 = _392;
    _394.y = _389;
    vec4 _395 = _394;
    _395.z = ((((((((((((((((_70.z + _83.z) + _102.z) + _122.z) + _33[nonuniformEXT(_54)]._m0[0u].z) + _33[nonuniformEXT(_149)]._m0[0u].z) + _172.z) + _185.z) + _200.value.z) + _231.z) + _259.z) + _275.value.z) + _297) + _313) + _334) + uintBitsToFloat(_345.value.z)) + _369.value) + _387;
    vec4 _396 = _395;
    _396.w = ((((((((((((((((_70.w + _83.w) + _102.w) + _122.w) + _33[nonuniformEXT(_54)]._m0[0u].w) + _33[nonuniformEXT(_149)]._m0[0u].w) + _172.w) + _185.w) + _200.value.w) + _231.w) + _259.w) + _275.value.w) + _297) + _314) + _334) + uintBitsToFloat(_345.value.w)) + _369.value) + _387;
    payload._m0 = _396;
    PhysicalPointerFloat(SBT._m3 + uint64_t((_339 * 4u) + 0u)).value = _388;
    PhysicalPointerFloat(SBT._m5 + uint64_t(_377)).value = _389;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 412
; Schema: 0
OpCapability Shader
OpCapability Int64
OpCapability UniformBufferArrayDynamicIndexing
OpCapability SampledImageArrayDynamicIndexing
OpCapability StorageBufferArrayDynamicIndexing
OpCapability StorageImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability UniformBufferArrayNonUniformIndexing
OpCapability SampledImageArrayNonUniformIndexing
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability StorageImageArrayNonUniformIndexing
OpCapability PhysicalStorageBufferAddresses
OpCapability RayTracingProvisionalKHR
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpExtension "SPV_KHR_ray_tracing"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint MissNV %3 "main"
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %15 "SBTBlock"
OpName %17 "SBT"
OpName %30 "BindlessCBV"
OpName %38 ""
OpName %40 "payload"
OpName %198 "PhysicalPointerFloat4NonWrite"
OpMemberName %198 0 "value"
OpName %289 "PhysicalPointerUintNonWrite"
OpMemberName %289 0 "value"
OpName %303 "PhysicalPointerUint2NonWrite"
OpMemberName %303 0 "value"
OpName %321 "PhysicalPointerUint3NonWrite"
OpMemberName %321 0 "value"
OpName %341 "PhysicalPointerUint4NonWrite"
OpMemberName %341 0 "value"
OpName %363 "PhysicalPointerFloat"
OpMemberName %363 0 "value"
OpName %380 "PhysicalPointerUint"
OpMemberName %380 0 "value"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %10 ArrayStride 4
OpDecorate %12 ArrayStride 4
OpDecorate %15 Block
OpMemberDecorate %15 0 Offset 0
OpMemberDecorate %15 1 Offset 20
OpMemberDecorate %15 2 Offset 48
OpMemberDecorate %15 3 Offset 56
OpMemberDecorate %15 4 Offset 64
OpMemberDecorate %15 5 Offset 72
OpMemberDecorate %15 6 Offset 80
OpMemberDecorate %15 7 Offset 88
OpMemberDecorate %15 8 Offset 96
OpMemberDecorate %15 9 Offset 104
OpMemberDecorate %15 10 Offset 112
OpDecorate %22 DescriptorSet 0
OpDecorate %22 Binding 0
OpDecorate %26 DescriptorSet 3
OpDecorate %26 Binding 0
OpDecorate %26 NonWritable
OpDecorate %29 ArrayStride 16
OpDecorate %30 Block
OpMemberDecorate %30 0 Offset 0
OpDecorate %33 DescriptorSet 5
OpDecorate %33 Binding 0
OpDecorate %37 DescriptorSet 2
OpDecorate %37 Binding 0
OpDecorate %40 Location 0
OpDecorate %48 NonUniform
OpDecorate %66 NonUniform
OpDecorate %67 NonUniform
OpDecorate %81 NonUniform
OpDecorate %82 NonUniform
OpDecorate %100 NonUniform
OpDecorate %101 NonUniform
OpDecorate %120 NonUniform
OpDecorate %121 NonUniform
OpDecorate %133 NonUniform
OpDecorate %143 NonUniform
OpDecorate %150 NonUniform
OpMemberDecorate %198 0 Offset 0
OpDecorate %198 Block
OpMemberDecorate %198 0 NonWritable
OpDecorate %217 NonUniform
OpDecorate %218 NonUniform
OpDecorate %226 NonUniform
OpDecorate %228 NonUniform
OpDecorate %248 NonUniform
OpDecorate %249 NonUniform
OpDecorate %256 NonUniform
OpDecorate %257 NonUniform
OpDecorate %258 NonUniform
OpMemberDecorate %289 0 Offset 0
OpDecorate %289 Block
OpMemberDecorate %289 0 NonWritable
OpMemberDecorate %303 0 Offset 0
OpDecorate %303 Block
OpMemberDecorate %303 0 NonWritable
OpMemberDecorate %321 0 Offset 0
OpDecorate %321 Block
OpMemberDecorate %321 0 NonWritable
OpMemberDecorate %341 0 Offset 0
OpDecorate %341 Block
OpMemberDecorate %341 0 NonWritable
OpMemberDecorate %363 0 Offset 0
OpDecorate %363 Block
OpMemberDecorate %380 0 Offset 0
OpDecorate %380 Block
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpConstant %5 5
%10 = OpTypeArray %5 %9
%11 = OpConstant %5 6
%12 = OpTypeArray %5 %11
%13 = OpTypeInt 64 0
%14 = OpTypeVector %5 2
%15 = OpTypeStruct %10 %12 %13 %13 %13 %13 %13 %14 %14 %14 %14
%16 = OpTypePointer ShaderRecordBufferNV %15
%17 = OpVariable %16 ShaderRecordBufferNV
%18 = OpTypeFloat 32
%19 = OpTypeImage %18 2D 0 0 0 1 Unknown
%20 = OpTypeRuntimeArray %19
%21 = OpTypePointer UniformConstant %20
%22 = OpVariable %21 UniformConstant
%23 = OpTypeImage %18 2D 0 0 0 2 R32f
%24 = OpTypeRuntimeArray %23
%25 = OpTypePointer UniformConstant %24
%26 = OpVariable %25 UniformConstant
%27 = OpTypeVector %18 4
%28 = OpConstant %5 4096
%29 = OpTypeArray %27 %28
%30 = OpTypeStruct %29
%31 = OpTypeRuntimeArray %30
%32 = OpTypePointer Uniform %31
%33 = OpVariable %32 Uniform
%34 = OpTypeSampler
%35 = OpTypeRuntimeArray %34
%36 = OpTypePointer UniformConstant %35
%37 = OpVariable %36 UniformConstant
%38 = OpTypeStruct %27 %5
%39 = OpTypePointer IncomingRayPayloadNV %38
%40 = OpVariable %39 IncomingRayPayloadNV
%41 = OpTypePointer ShaderRecordBufferNV %13
%44 = OpTypePointer ShaderRecordBufferNV %10
%46 = OpConstant %5 0
%47 = OpTypePointer Uniform %30
%49 = OpTypePointer ShaderRecordBufferNV %5
%51 = OpConstant %5 9
%55 = OpConstant %5 12
%56 = OpTypePointer IncomingRayPayloadNV %5
%58 = OpConstant %5 1
%61 = OpTypePointer UniformConstant %19
%63 = OpTypePointer PushConstant %5
%68 = OpTypeInt 32 1
%69 = OpConstant %68 0
%76 = OpTypePointer IncomingRayPayloadNV %27
%95 = OpConstant %5 7
%99 = OpConstant %5 17
%112 = OpTypePointer UniformConstant %23
%115 = OpConstant %5 8
%119 = OpConstant %5 18
%132 = OpTypePointer Uniform %27
%148 = OpConstant %5 13
%165 = OpConstant %5 2
%168 = OpConstant %5 3
%170 = OpTypeVector %5 4
%182 = OpConstant %5 4
%195 = OpConstant %5 16
%198 = OpTypeStruct %27
%199 = OpTypePointer PhysicalStorageBuffer %198
%201 = OpTypePointer PhysicalStorageBuffer %27
%219 = OpTypePointer UniformConstant %34
%222 = OpConstant %5 10
%227 = OpTypeSampledImage %19
%229 = OpConstant %18 0.5
%230 = OpConstant %18 0
%232 = OpTypeVector %18 2
%234 = OpTypeVector %68 2
%235 = OpConstantComposite %234 %69 %69
%255 = OpConstant %5 14
%289 = OpTypeStruct %5
%290 = OpTypePointer PhysicalStorageBuffer %289
%294 = OpTypePointer PhysicalStorageBuffer %5
%303 = OpTypeStruct %14
%304 = OpTypePointer PhysicalStorageBuffer %303
%308 = OpTypePointer PhysicalStorageBuffer %14
%320 = OpTypeVector %5 3
%321 = OpTypeStruct %320
%322 = OpTypePointer PhysicalStorageBuffer %321
%326 = OpTypePointer PhysicalStorageBuffer %320
%341 = OpTypeStruct %170
%342 = OpTypePointer PhysicalStorageBuffer %341
%346 = OpTypePointer PhysicalStorageBuffer %170
%363 = OpTypeStruct %18
%364 = OpTypePointer PhysicalStorageBuffer %363
%370 = OpTypePointer PhysicalStorageBuffer %18
%380 = OpTypeStruct %5
%381 = OpTypePointer PhysicalStorageBuffer %380
%3 = OpFunction %1 None %2
%4 = OpLabel
%393 = OpUndef %27
%403 = OpUndef %18
OpBranch %410
%410 = OpLabel
%42 = OpAccessChain %41 %17 %11
%43 = OpLoad %13 %42
%45 = OpAccessChain %44 %17 %46
%50 = OpAccessChain %49 %17 %51 %46
%52 = OpLoad %5 %50
%53 = OpShiftRightLogical %5 %52 %11
%54 = OpIAdd %5 %53 %55
%48 = OpAccessChain %47 %33 %54
%57 = OpInBoundsAccessChain %56 %40 %58
%59 = OpLoad %5 %57
%60 = OpBitwiseAnd %5 %59 %58
%64 = OpAccessChain %63 %8 %46
%65 = OpLoad %5 %64
%66 = OpIAdd %5 %65 %60
%62 = OpAccessChain %61 %22 %66
%67 = OpLoad %19 %62
%71 = OpCompositeConstruct %14 %46 %46
%70 = OpImageFetch %27 %67 %71 Lod %46
%72 = OpCompositeExtract %18 %70 0
%73 = OpCompositeExtract %18 %70 1
%74 = OpCompositeExtract %18 %70 2
%75 = OpCompositeExtract %18 %70 3
%77 = OpInBoundsAccessChain %76 %40 %46
%79 = OpAccessChain %63 %8 %46
%80 = OpLoad %5 %79
%81 = OpIAdd %5 %80 %59
%78 = OpAccessChain %61 %22 %81
%82 = OpLoad %19 %78
%84 = OpCompositeConstruct %14 %46 %46
%83 = OpImageFetch %27 %82 %84 Lod %46
%85 = OpCompositeExtract %18 %83 0
%86 = OpCompositeExtract %18 %83 1
%87 = OpCompositeExtract %18 %83 2
%88 = OpCompositeExtract %18 %83 3
%89 = OpFAdd %18 %72 %85
%90 = OpFAdd %18 %73 %86
%91 = OpFAdd %18 %74 %87
%92 = OpFAdd %18 %75 %88
%94 = OpAccessChain %49 %17 %95 %46
%96 = OpLoad %5 %94
%97 = OpShiftRightLogical %5 %96 %11
%98 = OpIAdd %5 %97 %99
%100 = OpIAdd %5 %98 %59
%93 = OpAccessChain %61 %22 %100
%101 = OpLoad %19 %93
%103 = OpCompositeConstruct %14 %46 %46
%102 = OpImageFetch %27 %101 %103 Lod %46
%104 = OpCompositeExtract %18 %102 0
%105 = OpCompositeExtract %18 %102 1
%106 = OpCompositeExtract %18 %102 2
%107 = OpCompositeExtract %18 %102 3
%108 = OpFAdd %18 %89 %104
%109 = OpFAdd %18 %90 %105
%110 = OpFAdd %18 %91 %106
%111 = OpFAdd %18 %92 %107
%114 = OpAccessChain %49 %17 %115 %46
%116 = OpLoad %5 %114
%117 = OpShiftRightLogical %5 %116 %11
%118 = OpIAdd %5 %117 %119
%120 = OpIAdd %5 %118 %59
%113 = OpAccessChain %112 %26 %120
%121 = OpLoad %23 %113
%123 = OpCompositeConstruct %14 %46 %46
%122 = OpImageRead %27 %121 %123 None
%124 = OpCompositeExtract %18 %122 0
%125 = OpCompositeExtract %18 %122 1
%126 = OpCompositeExtract %18 %122 2
%127 = OpCompositeExtract %18 %122 3
%128 = OpFAdd %18 %108 %124
%129 = OpFAdd %18 %109 %125
%130 = OpFAdd %18 %110 %126
%131 = OpFAdd %18 %111 %127
%133 = OpAccessChain %132 %48 %46 %46
%134 = OpLoad %27 %133
%135 = OpCompositeExtract %18 %134 0
%136 = OpCompositeExtract %18 %134 1
%137 = OpCompositeExtract %18 %134 2
%138 = OpCompositeExtract %18 %134 3
%139 = OpFAdd %18 %128 %135
%140 = OpFAdd %18 %129 %136
%141 = OpFAdd %18 %130 %137
%142 = OpFAdd %18 %131 %138
%144 = OpAccessChain %49 %17 %51 %46
%145 = OpLoad %5 %144
%146 = OpShiftRightLogical %5 %145 %11
%147 = OpIAdd %5 %146 %148
%149 = OpIAdd %5 %147 %59
%143 = OpAccessChain %47 %33 %149
%150 = OpAccessChain %132 %143 %46 %46
%151 = OpLoad %27 %150
%152 = OpCompositeExtract %18 %151 0
%153 = OpCompositeExtract %18 %151 1
%154 = OpCompositeExtract %18 %151 2
%155 = OpCompositeExtract %18 %151 3
%156 = OpFAdd %18 %139 %152
%157 = OpFAdd %18 %140 %153
%158 = OpFAdd %18 %141 %154
%159 = OpFAdd %18 %142 %155
%160 = OpAccessChain %49 %45 %46
%161 = OpLoad %5 %160
%162 = OpAccessChain %49 %45 %58
%163 = OpLoad %5 %162
%164 = OpAccessChain %49 %45 %165
%166 = OpLoad %5 %164
%167 = OpAccessChain %49 %45 %168
%169 = OpLoad %5 %167
%171 = OpCompositeConstruct %170 %161 %163 %166 %169
%172 = OpBitcast %27 %171
%173 = OpCompositeExtract %18 %172 0
%174 = OpCompositeExtract %18 %172 1
%175 = OpCompositeExtract %18 %172 2
%176 = OpCompositeExtract %18 %172 3
%177 = OpFAdd %18 %156 %173
%178 = OpFAdd %18 %157 %174
%179 = OpFAdd %18 %158 %175
%180 = OpFAdd %18 %159 %176
%181 = OpAccessChain %49 %45 %182
%183 = OpLoad %5 %181
%184 = OpCompositeConstruct %170 %183 %46 %46 %46
%185 = OpBitcast %27 %184
%186 = OpCompositeExtract %18 %185 0
%187 = OpCompositeExtract %18 %185 1
%188 = OpCompositeExtract %18 %185 2
%189 = OpCompositeExtract %18 %185 3
%190 = OpFAdd %18 %177 %186
%191 = OpFAdd %18 %178 %187
%192 = OpFAdd %18 %179 %188
%193 = OpFAdd %18 %180 %189
%194 = OpIMul %5 %58 %195
%196 = OpUConvert %13 %194
%197 = OpIAdd %13 %43 %196
%200 = OpBitcast %199 %197
%202 = OpAccessChain %201 %200 %46
%203 = OpLoad %27 %202 Aligned 16
%204 = OpCompositeExtract %18 %203 0
%205 = OpCompositeExtract %18 %203 1
%206 = OpCompositeExtract %18 %203 2
%207 = OpCompositeExtract %18 %203 3
%208 = OpFAdd %18 %190 %204
%209 = OpFAdd %18 %191 %205
%210 = OpFAdd %18 %192 %206
%211 = OpFAdd %18 %193 %207
%212 = OpLoad %5 %57
%213 = OpBitwiseAnd %5 %212 %58
%215 = OpAccessChain %63 %8 %46
%216 = OpLoad %5 %215
%217 = OpIAdd %5 %216 %213
%214 = OpAccessChain %61 %22 %217
%218 = OpLoad %19 %214
%221 = OpAccessChain %49 %17 %222 %46
%223 = OpLoad %5 %221
%224 = OpShiftRightLogical %5 %223 %9
%225 = OpIAdd %5 %224 %148
%220 = OpAccessChain %219 %37 %225
%226 = OpLoad %34 %220
%228 = OpSampledImage %227 %218 %226
%233 = OpCompositeConstruct %232 %229 %229
%231 = OpImageSampleExplicitLod %27 %228 %233 Lod|ConstOffset %230 %235
%236 = OpCompositeExtract %18 %231 0
%237 = OpCompositeExtract %18 %231 1
%238 = OpCompositeExtract %18 %231 2
%239 = OpCompositeExtract %18 %231 3
%240 = OpFAdd %18 %208 %236
%241 = OpFAdd %18 %209 %237
%242 = OpFAdd %18 %210 %238
%243 = OpFAdd %18 %211 %239
%244 = OpBitwiseXor %5 %212 %58
%246 = OpAccessChain %63 %8 %46
%247 = OpLoad %5 %246
%248 = OpIAdd %5 %247 %212
%245 = OpAccessChain %61 %22 %248
%249 = OpLoad %19 %245
%251 = OpAccessChain %49 %17 %222 %46
%252 = OpLoad %5 %251
%253 = OpShiftRightLogical %5 %252 %9
%254 = OpIAdd %5 %253 %255
%256 = OpIAdd %5 %254 %244
%250 = OpAccessChain %219 %37 %256
%257 = OpLoad %34 %250
%258 = OpSampledImage %227 %249 %257
%260 = OpCompositeConstruct %232 %229 %229
%259 = OpImageSampleExplicitLod %27 %258 %260 Lod|ConstOffset %230 %235
%261 = OpCompositeExtract %18 %259 0
%262 = OpCompositeExtract %18 %259 1
%263 = OpCompositeExtract %18 %259 2
%264 = OpCompositeExtract %18 %259 3
%265 = OpFAdd %18 %240 %261
%266 = OpFAdd %18 %241 %262
%267 = OpFAdd %18 %242 %263
%268 = OpFAdd %18 %243 %264
%269 = OpAccessChain %41 %17 %165
%270 = OpLoad %13 %269
%271 = OpIMul %5 %212 %195
%272 = OpIAdd %5 %271 %46
%273 = OpUConvert %13 %272
%274 = OpIAdd %13 %270 %273
%275 = OpBitcast %199 %274
%276 = OpAccessChain %201 %275 %46
%277 = OpLoad %27 %276 Aligned 4
%278 = OpCompositeExtract %18 %277 0
%279 = OpCompositeExtract %18 %277 1
%280 = OpCompositeExtract %18 %277 2
%281 = OpCompositeExtract %18 %277 3
%282 = OpFAdd %18 %265 %278
%283 = OpFAdd %18 %266 %279
%284 = OpFAdd %18 %267 %280
%285 = OpFAdd %18 %268 %281
%286 = OpShiftLeftLogical %5 %212 %165
%287 = OpAccessChain %41 %17 %182
%288 = OpLoad %13 %287
%291 = OpUConvert %13 %286
%292 = OpIAdd %13 %288 %291
%293 = OpBitcast %290 %292
%295 = OpAccessChain %294 %293 %46
%296 = OpLoad %5 %295 Aligned 4
%297 = OpBitcast %18 %296
%298 = OpFAdd %18 %282 %297
%299 = OpFAdd %18 %283 %297
%300 = OpFAdd %18 %284 %297
%301 = OpFAdd %18 %285 %297
%302 = OpShiftLeftLogical %5 %212 %168
%305 = OpUConvert %13 %302
%306 = OpIAdd %13 %288 %305
%307 = OpBitcast %304 %306
%309 = OpAccessChain %308 %307 %46
%310 = OpLoad %14 %309 Aligned 4
%311 = OpCompositeExtract %5 %310 0
%312 = OpCompositeExtract %5 %310 1
%313 = OpBitcast %18 %311
%314 = OpBitcast %18 %312
%315 = OpFAdd %18 %298 %313
%316 = OpFAdd %18 %299 %314
%317 = OpFAdd %18 %300 %313
%318 = OpFAdd %18 %301 %314
%319 = OpIMul %5 %212 %55
%323 = OpUConvert %13 %319
%324 = OpIAdd %13 %288 %323
%325 = OpBitcast %322 %324
%327 = OpAccessChain %326 %325 %46
%328 = OpLoad %320 %327 Aligned 4
%329 = OpCompositeExtract %5 %328 0
%330 = OpCompositeExtract %5 %328 1
%331 = OpCompositeExtract %5 %328 2
%332 = OpBitcast %18 %329
%333 = OpBitcast %18 %330
%334 = OpBitcast %18 %331
%335 = OpFAdd %18 %315 %332
%336 = OpFAdd %18 %316 %333
%337 = OpFAdd %18 %317 %334
%338 = OpFAdd %18 %318 %334
%339 = OpLoad %5 %57
%340 = OpShiftLeftLogical %5 %339 %182
%343 = OpUConvert %13 %340
%344 = OpIAdd %13 %288 %343
%345 = OpBitcast %342 %344
%347 = OpAccessChain %346 %345 %46
%348 = OpLoad %170 %347 Aligned 4
%349 = OpCompositeExtract %5 %348 0
%350 = OpCompositeExtract %5 %348 1
%351 = OpCompositeExtract %5 %348 2
%352 = OpCompositeExtract %5 %348 3
%353 = OpBitcast %18 %349
%354 = OpBitcast %18 %350
%355 = OpBitcast %18 %351
%356 = OpBitcast %18 %352
%357 = OpFAdd %18 %335 %353
%358 = OpFAdd %18 %336 %354
%359 = OpFAdd %18 %337 %355
%360 = OpFAdd %18 %338 %356
%361 = OpAccessChain %41 %17 %168
%362 = OpLoad %13 %361
%365 = OpIMul %5 %339 %182
%366 = OpIAdd %5 %365 %46
%367 = OpUConvert %13 %366
%368 = OpIAdd %13 %362 %367
%369 = OpBitcast %364 %368
%371 = OpAccessChain %370 %369 %46
%372 = OpLoad %18 %371 Aligned 4
%373 = OpFAdd %18 %357 %372
%374 = OpFAdd %18 %358 %372
%375 = OpFAdd %18 %359 %372
%376 = OpFAdd %18 %360 %372
%377 = OpShiftLeftLogical %5 %339 %165
%378 = OpAccessChain %41 %17 %9
%379 = OpLoad %13 %378
%382 = OpUConvert %13 %377
%383 = OpIAdd %13 %379 %382
%384 = OpBitcast %381 %383
%385 = OpAccessChain %294 %384 %46
%386 = OpLoad %5 %385 Aligned 4
%387 = OpBitcast %18 %386
%388 = OpFAdd %18 %373 %387
%389 = OpFAdd %18 %374 %387
%390 = OpFAdd %18 %375 %387
%391 = OpFAdd %18 %376 %387
%392 = OpCompositeInsert %27 %388 %393 0
%394 = OpCompositeInsert %27 %389 %392 1
%395 = OpCompositeInsert %27 %390 %394 2
%396 = OpCompositeInsert %27 %391 %395 3
OpStore %77 %396
%397 = OpIMul %5 %339 %182
%398 = OpIAdd %5 %397 %46
%399 = OpUConvert %13 %398
%400 = OpIAdd %13 %362 %399
%401 = OpBitcast %364 %400
%402 = OpAccessChain %370 %401 %46
OpStore %402 %388 Aligned 4
%404 = OpAccessChain %41 %17 %9
%405 = OpLoad %13 %404
%406 = OpUConvert %13 %377
%407 = OpIAdd %13 %405 %406
%408 = OpBitcast %364 %407
%409 = OpAccessChain %370 %408 %46
OpStore %409 %389 Aligned 4
OpReturn
OpFunctionEnd
#endif
