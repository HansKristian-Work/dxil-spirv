#version 460
#extension GL_NV_ray_tracing : require
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

struct _37
{
    vec4 _m0;
    uint _m1;
};

struct AddCarry
{
    uint _m0;
    uint _m1;
};

layout(buffer_reference) buffer PhysicalPointerFloat4NonWrite;
layout(buffer_reference) buffer PhysicalPointerUintNonWrite;
layout(buffer_reference) buffer PhysicalPointerUint2NonWrite;
layout(buffer_reference) buffer PhysicalPointerUint3NonWrite;
layout(buffer_reference) buffer PhysicalPointerUint4NonWrite;
layout(buffer_reference) buffer PhysicalPointerFloat;
layout(buffer_reference) buffer PhysicalPointerUint;
layout(buffer_reference, std430) readonly buffer PhysicalPointerFloat4NonWrite
{
    vec4 value;
};

layout(buffer_reference, std430) readonly buffer PhysicalPointerUintNonWrite
{
    uint value;
};

layout(buffer_reference, std430) readonly buffer PhysicalPointerUint2NonWrite
{
    uvec2 value;
};

layout(buffer_reference, std430) readonly buffer PhysicalPointerUint3NonWrite
{
    uvec3 value;
};

layout(buffer_reference, std430) readonly buffer PhysicalPointerUint4NonWrite
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
    uvec2 _m2;
    uvec2 _m3;
    uvec2 _m4;
    uvec2 _m5;
    uvec2 _m6;
    uvec2 _m7;
    uvec2 _m8;
    uvec2 _m9;
    uvec2 _m10;
} SBT;

layout(set = 5, binding = 0, std140) uniform BindlessCBV
{
    vec4 _m0[4096];
} _32[];

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

layout(set = 0, binding = 0) uniform texture2D _21[];
layout(set = 3, binding = 0, r32f) uniform readonly image2D _25[];
layout(set = 2, binding = 0) uniform sampler _36[];
layout(location = 0) rayPayloadInNV _37 payload;

vec4 _433;
float _448;

void main()
{
    uint _53 = (SBT._m9.x >> 6u) + 12u;
    uint _58 = payload._m1;
    vec4 _69 = texelFetch(_21[nonuniformEXT(registers._m0 + (_58 & 1u))], ivec2(uvec2(0u)), int(0u));
    vec4 _82 = texelFetch(_21[nonuniformEXT(registers._m0 + _58)], ivec2(uvec2(0u)), int(0u));
    vec4 _101 = texelFetch(_21[nonuniformEXT(((SBT._m7.x >> 6u) + 17u) + _58)], ivec2(uvec2(0u)), int(0u));
    vec4 _121 = imageLoad(_25[nonuniformEXT(((SBT._m8.x >> 6u) + 18u) + _58)], ivec2(uvec2(0u)));
    uint _148 = ((SBT._m9.x >> 6u) + 13u) + _58;
    vec4 _171 = uintBitsToFloat(uvec4(SBT._m0[0u], SBT._m0[1u], SBT._m0[2u], SBT._m0[3u]));
    vec4 _184 = uintBitsToFloat(uvec4(SBT._m0[4u], 0u, 0u, 0u));
    AddCarry _198;
    _198._m0 = uaddCarry(SBT._m6.x, 1u * 16u, _198._m1);
    PhysicalPointerFloat4NonWrite _205 = PhysicalPointerFloat4NonWrite(uvec2(_198._m0, SBT._m6.y + _198._m1));
    vec4 _236 = textureLodOffset(nonuniformEXT(sampler2D(_21[nonuniformEXT(registers._m0 + (payload._m1 & 1u))], _36[nonuniformEXT((SBT._m10.x >> 5u) + 13u)])), vec2(0.5), 0.0, ivec2(0));
    vec4 _264 = textureLodOffset(nonuniformEXT(sampler2D(_21[nonuniformEXT(registers._m0 + payload._m1)], _36[nonuniformEXT(((SBT._m10.x >> 5u) + 14u) + (payload._m1 ^ 1u))])), vec2(0.5), 0.0, ivec2(0));
    AddCarry _280;
    _280._m0 = uaddCarry(SBT._m2.x, (payload._m1 * 16u) + 0u, _280._m1);
    PhysicalPointerFloat4NonWrite _285 = PhysicalPointerFloat4NonWrite(uvec2(_280._m0, SBT._m2.y + _280._m1));
    AddCarry _303;
    _303._m0 = uaddCarry(SBT._m4.x, payload._m1 << 2u, _303._m1);
    float _312 = uintBitsToFloat(PhysicalPointerUintNonWrite(uvec2(_303._m0, SBT._m4.y + _303._m1)).value);
    AddCarry _322;
    _322._m0 = uaddCarry(SBT._m4.x, payload._m1 << 3u, _322._m1);
    PhysicalPointerUint2NonWrite _327 = PhysicalPointerUint2NonWrite(uvec2(_322._m0, SBT._m4.y + _322._m1));
    float _333 = uintBitsToFloat(_327.value.x);
    float _334 = uintBitsToFloat(_327.value.y);
    AddCarry _345;
    _345._m0 = uaddCarry(SBT._m4.x, payload._m1 * 12u, _345._m1);
    PhysicalPointerUint3NonWrite _350 = PhysicalPointerUint3NonWrite(uvec2(_345._m0, SBT._m4.y + _345._m1));
    float _359 = uintBitsToFloat(_350.value.z);
    uint _364 = payload._m1;
    AddCarry _370;
    _370._m0 = uaddCarry(SBT._m4.x, _364 << 4u, _370._m1);
    PhysicalPointerUint4NonWrite _375 = PhysicalPointerUint4NonWrite(uvec2(_370._m0, SBT._m4.y + _370._m1));
    AddCarry _399;
    _399._m0 = uaddCarry(SBT._m3.x, (_364 * 4u) + 0u, _399._m1);
    PhysicalPointerFloat _404 = PhysicalPointerFloat(uvec2(_399._m0, SBT._m3.y + _399._m1));
    uint _412 = _364 << 2u;
    AddCarry _419;
    _419._m0 = uaddCarry(SBT._m5.x, _412, _419._m1);
    float _427 = uintBitsToFloat(PhysicalPointerUint(uvec2(_419._m0, SBT._m5.y + _419._m1)).value);
    float _428 = ((((((((((((((((_69.x + _82.x) + _101.x) + _121.x) + _32[nonuniformEXT(_53)]._m0[0u].x) + _32[nonuniformEXT(_148)]._m0[0u].x) + _171.x) + _184.x) + _205.value.x) + _236.x) + _264.x) + _285.value.x) + _312) + _333) + uintBitsToFloat(_350.value.x)) + uintBitsToFloat(_375.value.x)) + _404.value) + _427;
    float _429 = ((((((((((((((((_69.y + _82.y) + _101.y) + _121.y) + _32[nonuniformEXT(_53)]._m0[0u].y) + _32[nonuniformEXT(_148)]._m0[0u].y) + _171.y) + _184.y) + _205.value.y) + _236.y) + _264.y) + _285.value.y) + _312) + _334) + uintBitsToFloat(_350.value.y)) + uintBitsToFloat(_375.value.y)) + _404.value) + _427;
    vec4 _432 = _433;
    _432.x = _428;
    vec4 _434 = _432;
    _434.y = _429;
    vec4 _435 = _434;
    _435.z = ((((((((((((((((_69.z + _82.z) + _101.z) + _121.z) + _32[nonuniformEXT(_53)]._m0[0u].z) + _32[nonuniformEXT(_148)]._m0[0u].z) + _171.z) + _184.z) + _205.value.z) + _236.z) + _264.z) + _285.value.z) + _312) + _333) + _359) + uintBitsToFloat(_375.value.z)) + _404.value) + _427;
    vec4 _436 = _435;
    _436.w = ((((((((((((((((_69.w + _82.w) + _101.w) + _121.w) + _32[nonuniformEXT(_53)]._m0[0u].w) + _32[nonuniformEXT(_148)]._m0[0u].w) + _171.w) + _184.w) + _205.value.w) + _236.w) + _264.w) + _285.value.w) + _312) + _334) + _359) + uintBitsToFloat(_375.value.w)) + _404.value) + _427;
    payload._m0 = _436;
    AddCarry _441;
    _441._m0 = uaddCarry(SBT._m3.x, (_364 * 4u) + 0u, _441._m1);
    PhysicalPointerFloat(uvec2(_441._m0, SBT._m3.y + _441._m1)).value = _428;
    AddCarry _453;
    _453._m0 = uaddCarry(SBT._m5.x, _412, _453._m1);
    PhysicalPointerFloat(uvec2(_453._m0, SBT._m5.y + _453._m1)).value = _429;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 462
; Schema: 0
OpCapability Shader
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
OpName %14 "SBTBlock"
OpName %16 "SBT"
OpName %29 "BindlessCBV"
OpName %37 ""
OpName %39 "payload"
OpName %197 "AddCarry"
OpName %203 "PhysicalPointerFloat4NonWrite"
OpMemberName %203 0 "value"
OpName %299 "PhysicalPointerUintNonWrite"
OpMemberName %299 0 "value"
OpName %318 "PhysicalPointerUint2NonWrite"
OpMemberName %318 0 "value"
OpName %341 "PhysicalPointerUint3NonWrite"
OpMemberName %341 0 "value"
OpName %366 "PhysicalPointerUint4NonWrite"
OpMemberName %366 0 "value"
OpName %393 "PhysicalPointerFloat"
OpMemberName %393 0 "value"
OpName %415 "PhysicalPointerUint"
OpMemberName %415 0 "value"
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
OpDecorate %14 Block
OpMemberDecorate %14 0 Offset 0
OpMemberDecorate %14 1 Offset 20
OpMemberDecorate %14 2 Offset 48
OpMemberDecorate %14 3 Offset 56
OpMemberDecorate %14 4 Offset 64
OpMemberDecorate %14 5 Offset 72
OpMemberDecorate %14 6 Offset 80
OpMemberDecorate %14 7 Offset 88
OpMemberDecorate %14 8 Offset 96
OpMemberDecorate %14 9 Offset 104
OpMemberDecorate %14 10 Offset 112
OpDecorate %21 DescriptorSet 0
OpDecorate %21 Binding 0
OpDecorate %25 DescriptorSet 3
OpDecorate %25 Binding 0
OpDecorate %25 NonWritable
OpDecorate %28 ArrayStride 16
OpDecorate %29 Block
OpMemberDecorate %29 0 Offset 0
OpDecorate %32 DescriptorSet 5
OpDecorate %32 Binding 0
OpDecorate %36 DescriptorSet 2
OpDecorate %36 Binding 0
OpDecorate %39 Location 0
OpDecorate %47 NonUniform
OpDecorate %65 NonUniform
OpDecorate %66 NonUniform
OpDecorate %80 NonUniform
OpDecorate %81 NonUniform
OpDecorate %99 NonUniform
OpDecorate %100 NonUniform
OpDecorate %119 NonUniform
OpDecorate %120 NonUniform
OpDecorate %132 NonUniform
OpDecorate %142 NonUniform
OpDecorate %149 NonUniform
OpMemberDecorate %203 0 Offset 0
OpDecorate %203 Block
OpMemberDecorate %203 0 NonWritable
OpDecorate %222 NonUniform
OpDecorate %223 NonUniform
OpDecorate %231 NonUniform
OpDecorate %233 NonUniform
OpDecorate %253 NonUniform
OpDecorate %254 NonUniform
OpDecorate %261 NonUniform
OpDecorate %262 NonUniform
OpDecorate %263 NonUniform
OpMemberDecorate %299 0 Offset 0
OpDecorate %299 Block
OpMemberDecorate %299 0 NonWritable
OpMemberDecorate %318 0 Offset 0
OpDecorate %318 Block
OpMemberDecorate %318 0 NonWritable
OpMemberDecorate %341 0 Offset 0
OpDecorate %341 Block
OpMemberDecorate %341 0 NonWritable
OpMemberDecorate %366 0 Offset 0
OpDecorate %366 Block
OpMemberDecorate %366 0 NonWritable
OpMemberDecorate %393 0 Offset 0
OpDecorate %393 Block
OpMemberDecorate %415 0 Offset 0
OpDecorate %415 Block
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
%13 = OpTypeVector %5 2
%14 = OpTypeStruct %10 %12 %13 %13 %13 %13 %13 %13 %13 %13 %13
%15 = OpTypePointer ShaderRecordBufferNV %14
%16 = OpVariable %15 ShaderRecordBufferNV
%17 = OpTypeFloat 32
%18 = OpTypeImage %17 2D 0 0 0 1 Unknown
%19 = OpTypeRuntimeArray %18
%20 = OpTypePointer UniformConstant %19
%21 = OpVariable %20 UniformConstant
%22 = OpTypeImage %17 2D 0 0 0 2 R32f
%23 = OpTypeRuntimeArray %22
%24 = OpTypePointer UniformConstant %23
%25 = OpVariable %24 UniformConstant
%26 = OpTypeVector %17 4
%27 = OpConstant %5 4096
%28 = OpTypeArray %26 %27
%29 = OpTypeStruct %28
%30 = OpTypeRuntimeArray %29
%31 = OpTypePointer Uniform %30
%32 = OpVariable %31 Uniform
%33 = OpTypeSampler
%34 = OpTypeRuntimeArray %33
%35 = OpTypePointer UniformConstant %34
%36 = OpVariable %35 UniformConstant
%37 = OpTypeStruct %26 %5
%38 = OpTypePointer IncomingRayPayloadNV %37
%39 = OpVariable %38 IncomingRayPayloadNV
%40 = OpTypePointer ShaderRecordBufferNV %13
%43 = OpTypePointer ShaderRecordBufferNV %10
%45 = OpConstant %5 0
%46 = OpTypePointer Uniform %29
%48 = OpTypePointer ShaderRecordBufferNV %5
%50 = OpConstant %5 9
%54 = OpConstant %5 12
%55 = OpTypePointer IncomingRayPayloadNV %5
%57 = OpConstant %5 1
%60 = OpTypePointer UniformConstant %18
%62 = OpTypePointer PushConstant %5
%67 = OpTypeInt 32 1
%68 = OpConstant %67 0
%75 = OpTypePointer IncomingRayPayloadNV %26
%94 = OpConstant %5 7
%98 = OpConstant %5 17
%111 = OpTypePointer UniformConstant %22
%114 = OpConstant %5 8
%118 = OpConstant %5 18
%131 = OpTypePointer Uniform %26
%147 = OpConstant %5 13
%164 = OpConstant %5 2
%167 = OpConstant %5 3
%169 = OpTypeVector %5 4
%181 = OpConstant %5 4
%194 = OpConstant %5 16
%197 = OpTypeStruct %5 %5
%203 = OpTypeStruct %26
%204 = OpTypePointer PhysicalStorageBuffer %203
%206 = OpTypePointer PhysicalStorageBuffer %26
%224 = OpTypePointer UniformConstant %33
%227 = OpConstant %5 10
%232 = OpTypeSampledImage %18
%234 = OpConstant %17 0.5
%235 = OpConstant %17 0
%237 = OpTypeVector %17 2
%239 = OpTypeVector %67 2
%240 = OpConstantComposite %239 %68 %68
%260 = OpConstant %5 14
%299 = OpTypeStruct %5
%300 = OpTypePointer PhysicalStorageBuffer %299
%309 = OpTypePointer PhysicalStorageBuffer %5
%318 = OpTypeStruct %13
%319 = OpTypePointer PhysicalStorageBuffer %318
%328 = OpTypePointer PhysicalStorageBuffer %13
%340 = OpTypeVector %5 3
%341 = OpTypeStruct %340
%342 = OpTypePointer PhysicalStorageBuffer %341
%351 = OpTypePointer PhysicalStorageBuffer %340
%366 = OpTypeStruct %169
%367 = OpTypePointer PhysicalStorageBuffer %366
%376 = OpTypePointer PhysicalStorageBuffer %169
%393 = OpTypeStruct %17
%394 = OpTypePointer PhysicalStorageBuffer %393
%405 = OpTypePointer PhysicalStorageBuffer %17
%415 = OpTypeStruct %5
%416 = OpTypePointer PhysicalStorageBuffer %415
%3 = OpFunction %1 None %2
%4 = OpLabel
%433 = OpUndef %26
%448 = OpUndef %17
OpBranch %460
%460 = OpLabel
%41 = OpAccessChain %40 %16 %11
%42 = OpLoad %13 %41
%44 = OpAccessChain %43 %16 %45
%49 = OpAccessChain %48 %16 %50 %45
%51 = OpLoad %5 %49
%52 = OpShiftRightLogical %5 %51 %11
%53 = OpIAdd %5 %52 %54
%47 = OpAccessChain %46 %32 %53
%56 = OpInBoundsAccessChain %55 %39 %57
%58 = OpLoad %5 %56
%59 = OpBitwiseAnd %5 %58 %57
%63 = OpAccessChain %62 %8 %45
%64 = OpLoad %5 %63
%65 = OpIAdd %5 %64 %59
%61 = OpAccessChain %60 %21 %65
%66 = OpLoad %18 %61
%70 = OpCompositeConstruct %13 %45 %45
%69 = OpImageFetch %26 %66 %70 Lod %45
%71 = OpCompositeExtract %17 %69 0
%72 = OpCompositeExtract %17 %69 1
%73 = OpCompositeExtract %17 %69 2
%74 = OpCompositeExtract %17 %69 3
%76 = OpInBoundsAccessChain %75 %39 %45
%78 = OpAccessChain %62 %8 %45
%79 = OpLoad %5 %78
%80 = OpIAdd %5 %79 %58
%77 = OpAccessChain %60 %21 %80
%81 = OpLoad %18 %77
%83 = OpCompositeConstruct %13 %45 %45
%82 = OpImageFetch %26 %81 %83 Lod %45
%84 = OpCompositeExtract %17 %82 0
%85 = OpCompositeExtract %17 %82 1
%86 = OpCompositeExtract %17 %82 2
%87 = OpCompositeExtract %17 %82 3
%88 = OpFAdd %17 %71 %84
%89 = OpFAdd %17 %72 %85
%90 = OpFAdd %17 %73 %86
%91 = OpFAdd %17 %74 %87
%93 = OpAccessChain %48 %16 %94 %45
%95 = OpLoad %5 %93
%96 = OpShiftRightLogical %5 %95 %11
%97 = OpIAdd %5 %96 %98
%99 = OpIAdd %5 %97 %58
%92 = OpAccessChain %60 %21 %99
%100 = OpLoad %18 %92
%102 = OpCompositeConstruct %13 %45 %45
%101 = OpImageFetch %26 %100 %102 Lod %45
%103 = OpCompositeExtract %17 %101 0
%104 = OpCompositeExtract %17 %101 1
%105 = OpCompositeExtract %17 %101 2
%106 = OpCompositeExtract %17 %101 3
%107 = OpFAdd %17 %88 %103
%108 = OpFAdd %17 %89 %104
%109 = OpFAdd %17 %90 %105
%110 = OpFAdd %17 %91 %106
%113 = OpAccessChain %48 %16 %114 %45
%115 = OpLoad %5 %113
%116 = OpShiftRightLogical %5 %115 %11
%117 = OpIAdd %5 %116 %118
%119 = OpIAdd %5 %117 %58
%112 = OpAccessChain %111 %25 %119
%120 = OpLoad %22 %112
%122 = OpCompositeConstruct %13 %45 %45
%121 = OpImageRead %26 %120 %122 None
%123 = OpCompositeExtract %17 %121 0
%124 = OpCompositeExtract %17 %121 1
%125 = OpCompositeExtract %17 %121 2
%126 = OpCompositeExtract %17 %121 3
%127 = OpFAdd %17 %107 %123
%128 = OpFAdd %17 %108 %124
%129 = OpFAdd %17 %109 %125
%130 = OpFAdd %17 %110 %126
%132 = OpAccessChain %131 %47 %45 %45
%133 = OpLoad %26 %132
%134 = OpCompositeExtract %17 %133 0
%135 = OpCompositeExtract %17 %133 1
%136 = OpCompositeExtract %17 %133 2
%137 = OpCompositeExtract %17 %133 3
%138 = OpFAdd %17 %127 %134
%139 = OpFAdd %17 %128 %135
%140 = OpFAdd %17 %129 %136
%141 = OpFAdd %17 %130 %137
%143 = OpAccessChain %48 %16 %50 %45
%144 = OpLoad %5 %143
%145 = OpShiftRightLogical %5 %144 %11
%146 = OpIAdd %5 %145 %147
%148 = OpIAdd %5 %146 %58
%142 = OpAccessChain %46 %32 %148
%149 = OpAccessChain %131 %142 %45 %45
%150 = OpLoad %26 %149
%151 = OpCompositeExtract %17 %150 0
%152 = OpCompositeExtract %17 %150 1
%153 = OpCompositeExtract %17 %150 2
%154 = OpCompositeExtract %17 %150 3
%155 = OpFAdd %17 %138 %151
%156 = OpFAdd %17 %139 %152
%157 = OpFAdd %17 %140 %153
%158 = OpFAdd %17 %141 %154
%159 = OpAccessChain %48 %44 %45
%160 = OpLoad %5 %159
%161 = OpAccessChain %48 %44 %57
%162 = OpLoad %5 %161
%163 = OpAccessChain %48 %44 %164
%165 = OpLoad %5 %163
%166 = OpAccessChain %48 %44 %167
%168 = OpLoad %5 %166
%170 = OpCompositeConstruct %169 %160 %162 %165 %168
%171 = OpBitcast %26 %170
%172 = OpCompositeExtract %17 %171 0
%173 = OpCompositeExtract %17 %171 1
%174 = OpCompositeExtract %17 %171 2
%175 = OpCompositeExtract %17 %171 3
%176 = OpFAdd %17 %155 %172
%177 = OpFAdd %17 %156 %173
%178 = OpFAdd %17 %157 %174
%179 = OpFAdd %17 %158 %175
%180 = OpAccessChain %48 %44 %181
%182 = OpLoad %5 %180
%183 = OpCompositeConstruct %169 %182 %45 %45 %45
%184 = OpBitcast %26 %183
%185 = OpCompositeExtract %17 %184 0
%186 = OpCompositeExtract %17 %184 1
%187 = OpCompositeExtract %17 %184 2
%188 = OpCompositeExtract %17 %184 3
%189 = OpFAdd %17 %176 %185
%190 = OpFAdd %17 %177 %186
%191 = OpFAdd %17 %178 %187
%192 = OpFAdd %17 %179 %188
%193 = OpIMul %5 %57 %194
%195 = OpCompositeExtract %5 %42 0
%196 = OpCompositeExtract %5 %42 1
%198 = OpIAddCarry %197 %195 %193
%199 = OpCompositeExtract %5 %198 0
%200 = OpCompositeExtract %5 %198 1
%201 = OpIAdd %5 %196 %200
%202 = OpCompositeConstruct %13 %199 %201
%205 = OpBitcast %204 %202
%207 = OpAccessChain %206 %205 %45
%208 = OpLoad %26 %207 Aligned 16
%209 = OpCompositeExtract %17 %208 0
%210 = OpCompositeExtract %17 %208 1
%211 = OpCompositeExtract %17 %208 2
%212 = OpCompositeExtract %17 %208 3
%213 = OpFAdd %17 %189 %209
%214 = OpFAdd %17 %190 %210
%215 = OpFAdd %17 %191 %211
%216 = OpFAdd %17 %192 %212
%217 = OpLoad %5 %56
%218 = OpBitwiseAnd %5 %217 %57
%220 = OpAccessChain %62 %8 %45
%221 = OpLoad %5 %220
%222 = OpIAdd %5 %221 %218
%219 = OpAccessChain %60 %21 %222
%223 = OpLoad %18 %219
%226 = OpAccessChain %48 %16 %227 %45
%228 = OpLoad %5 %226
%229 = OpShiftRightLogical %5 %228 %9
%230 = OpIAdd %5 %229 %147
%225 = OpAccessChain %224 %36 %230
%231 = OpLoad %33 %225
%233 = OpSampledImage %232 %223 %231
%238 = OpCompositeConstruct %237 %234 %234
%236 = OpImageSampleExplicitLod %26 %233 %238 Lod|ConstOffset %235 %240
%241 = OpCompositeExtract %17 %236 0
%242 = OpCompositeExtract %17 %236 1
%243 = OpCompositeExtract %17 %236 2
%244 = OpCompositeExtract %17 %236 3
%245 = OpFAdd %17 %213 %241
%246 = OpFAdd %17 %214 %242
%247 = OpFAdd %17 %215 %243
%248 = OpFAdd %17 %216 %244
%249 = OpBitwiseXor %5 %217 %57
%251 = OpAccessChain %62 %8 %45
%252 = OpLoad %5 %251
%253 = OpIAdd %5 %252 %217
%250 = OpAccessChain %60 %21 %253
%254 = OpLoad %18 %250
%256 = OpAccessChain %48 %16 %227 %45
%257 = OpLoad %5 %256
%258 = OpShiftRightLogical %5 %257 %9
%259 = OpIAdd %5 %258 %260
%261 = OpIAdd %5 %259 %249
%255 = OpAccessChain %224 %36 %261
%262 = OpLoad %33 %255
%263 = OpSampledImage %232 %254 %262
%265 = OpCompositeConstruct %237 %234 %234
%264 = OpImageSampleExplicitLod %26 %263 %265 Lod|ConstOffset %235 %240
%266 = OpCompositeExtract %17 %264 0
%267 = OpCompositeExtract %17 %264 1
%268 = OpCompositeExtract %17 %264 2
%269 = OpCompositeExtract %17 %264 3
%270 = OpFAdd %17 %245 %266
%271 = OpFAdd %17 %246 %267
%272 = OpFAdd %17 %247 %268
%273 = OpFAdd %17 %248 %269
%274 = OpAccessChain %40 %16 %164
%275 = OpLoad %13 %274
%276 = OpIMul %5 %217 %194
%277 = OpIAdd %5 %276 %45
%278 = OpCompositeExtract %5 %275 0
%279 = OpCompositeExtract %5 %275 1
%280 = OpIAddCarry %197 %278 %277
%281 = OpCompositeExtract %5 %280 0
%282 = OpCompositeExtract %5 %280 1
%283 = OpIAdd %5 %279 %282
%284 = OpCompositeConstruct %13 %281 %283
%285 = OpBitcast %204 %284
%286 = OpAccessChain %206 %285 %45
%287 = OpLoad %26 %286 Aligned 4
%288 = OpCompositeExtract %17 %287 0
%289 = OpCompositeExtract %17 %287 1
%290 = OpCompositeExtract %17 %287 2
%291 = OpCompositeExtract %17 %287 3
%292 = OpFAdd %17 %270 %288
%293 = OpFAdd %17 %271 %289
%294 = OpFAdd %17 %272 %290
%295 = OpFAdd %17 %273 %291
%296 = OpShiftLeftLogical %5 %217 %164
%297 = OpAccessChain %40 %16 %181
%298 = OpLoad %13 %297
%301 = OpCompositeExtract %5 %298 0
%302 = OpCompositeExtract %5 %298 1
%303 = OpIAddCarry %197 %301 %296
%304 = OpCompositeExtract %5 %303 0
%305 = OpCompositeExtract %5 %303 1
%306 = OpIAdd %5 %302 %305
%307 = OpCompositeConstruct %13 %304 %306
%308 = OpBitcast %300 %307
%310 = OpAccessChain %309 %308 %45
%311 = OpLoad %5 %310 Aligned 4
%312 = OpBitcast %17 %311
%313 = OpFAdd %17 %292 %312
%314 = OpFAdd %17 %293 %312
%315 = OpFAdd %17 %294 %312
%316 = OpFAdd %17 %295 %312
%317 = OpShiftLeftLogical %5 %217 %167
%320 = OpCompositeExtract %5 %298 0
%321 = OpCompositeExtract %5 %298 1
%322 = OpIAddCarry %197 %320 %317
%323 = OpCompositeExtract %5 %322 0
%324 = OpCompositeExtract %5 %322 1
%325 = OpIAdd %5 %321 %324
%326 = OpCompositeConstruct %13 %323 %325
%327 = OpBitcast %319 %326
%329 = OpAccessChain %328 %327 %45
%330 = OpLoad %13 %329 Aligned 4
%331 = OpCompositeExtract %5 %330 0
%332 = OpCompositeExtract %5 %330 1
%333 = OpBitcast %17 %331
%334 = OpBitcast %17 %332
%335 = OpFAdd %17 %313 %333
%336 = OpFAdd %17 %314 %334
%337 = OpFAdd %17 %315 %333
%338 = OpFAdd %17 %316 %334
%339 = OpIMul %5 %217 %54
%343 = OpCompositeExtract %5 %298 0
%344 = OpCompositeExtract %5 %298 1
%345 = OpIAddCarry %197 %343 %339
%346 = OpCompositeExtract %5 %345 0
%347 = OpCompositeExtract %5 %345 1
%348 = OpIAdd %5 %344 %347
%349 = OpCompositeConstruct %13 %346 %348
%350 = OpBitcast %342 %349
%352 = OpAccessChain %351 %350 %45
%353 = OpLoad %340 %352 Aligned 4
%354 = OpCompositeExtract %5 %353 0
%355 = OpCompositeExtract %5 %353 1
%356 = OpCompositeExtract %5 %353 2
%357 = OpBitcast %17 %354
%358 = OpBitcast %17 %355
%359 = OpBitcast %17 %356
%360 = OpFAdd %17 %335 %357
%361 = OpFAdd %17 %336 %358
%362 = OpFAdd %17 %337 %359
%363 = OpFAdd %17 %338 %359
%364 = OpLoad %5 %56
%365 = OpShiftLeftLogical %5 %364 %181
%368 = OpCompositeExtract %5 %298 0
%369 = OpCompositeExtract %5 %298 1
%370 = OpIAddCarry %197 %368 %365
%371 = OpCompositeExtract %5 %370 0
%372 = OpCompositeExtract %5 %370 1
%373 = OpIAdd %5 %369 %372
%374 = OpCompositeConstruct %13 %371 %373
%375 = OpBitcast %367 %374
%377 = OpAccessChain %376 %375 %45
%378 = OpLoad %169 %377 Aligned 4
%379 = OpCompositeExtract %5 %378 0
%380 = OpCompositeExtract %5 %378 1
%381 = OpCompositeExtract %5 %378 2
%382 = OpCompositeExtract %5 %378 3
%383 = OpBitcast %17 %379
%384 = OpBitcast %17 %380
%385 = OpBitcast %17 %381
%386 = OpBitcast %17 %382
%387 = OpFAdd %17 %360 %383
%388 = OpFAdd %17 %361 %384
%389 = OpFAdd %17 %362 %385
%390 = OpFAdd %17 %363 %386
%391 = OpAccessChain %40 %16 %167
%392 = OpLoad %13 %391
%395 = OpIMul %5 %364 %181
%396 = OpIAdd %5 %395 %45
%397 = OpCompositeExtract %5 %392 0
%398 = OpCompositeExtract %5 %392 1
%399 = OpIAddCarry %197 %397 %396
%400 = OpCompositeExtract %5 %399 0
%401 = OpCompositeExtract %5 %399 1
%402 = OpIAdd %5 %398 %401
%403 = OpCompositeConstruct %13 %400 %402
%404 = OpBitcast %394 %403
%406 = OpAccessChain %405 %404 %45
%407 = OpLoad %17 %406 Aligned 4
%408 = OpFAdd %17 %387 %407
%409 = OpFAdd %17 %388 %407
%410 = OpFAdd %17 %389 %407
%411 = OpFAdd %17 %390 %407
%412 = OpShiftLeftLogical %5 %364 %164
%413 = OpAccessChain %40 %16 %9
%414 = OpLoad %13 %413
%417 = OpCompositeExtract %5 %414 0
%418 = OpCompositeExtract %5 %414 1
%419 = OpIAddCarry %197 %417 %412
%420 = OpCompositeExtract %5 %419 0
%421 = OpCompositeExtract %5 %419 1
%422 = OpIAdd %5 %418 %421
%423 = OpCompositeConstruct %13 %420 %422
%424 = OpBitcast %416 %423
%425 = OpAccessChain %309 %424 %45
%426 = OpLoad %5 %425 Aligned 4
%427 = OpBitcast %17 %426
%428 = OpFAdd %17 %408 %427
%429 = OpFAdd %17 %409 %427
%430 = OpFAdd %17 %410 %427
%431 = OpFAdd %17 %411 %427
%432 = OpCompositeInsert %26 %428 %433 0
%434 = OpCompositeInsert %26 %429 %432 1
%435 = OpCompositeInsert %26 %430 %434 2
%436 = OpCompositeInsert %26 %431 %435 3
OpStore %76 %436
%437 = OpIMul %5 %364 %181
%438 = OpIAdd %5 %437 %45
%439 = OpCompositeExtract %5 %392 0
%440 = OpCompositeExtract %5 %392 1
%441 = OpIAddCarry %197 %439 %438
%442 = OpCompositeExtract %5 %441 0
%443 = OpCompositeExtract %5 %441 1
%444 = OpIAdd %5 %440 %443
%445 = OpCompositeConstruct %13 %442 %444
%446 = OpBitcast %394 %445
%447 = OpAccessChain %405 %446 %45
OpStore %447 %428 Aligned 4
%449 = OpAccessChain %40 %16 %9
%450 = OpLoad %13 %449
%451 = OpCompositeExtract %5 %450 0
%452 = OpCompositeExtract %5 %450 1
%453 = OpIAddCarry %197 %451 %412
%454 = OpCompositeExtract %5 %453 0
%455 = OpCompositeExtract %5 %453 1
%456 = OpIAdd %5 %452 %455
%457 = OpCompositeConstruct %13 %454 %456
%458 = OpBitcast %394 %457
%459 = OpAccessChain %405 %458 %45
OpStore %459 %429 Aligned 4
OpReturn
OpFunctionEnd
#endif
