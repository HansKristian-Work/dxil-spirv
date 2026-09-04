#version 460
#extension GL_EXT_ray_tracing : require
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require
#extension GL_EXT_buffer_reference_uvec2 : require

layout(buffer_reference) buffer PhysicalPointerFloat4NonWriteCBVArray;
layout(buffer_reference) buffer PhysicalPointerFloat4NonWriteArray;
layout(buffer_reference) buffer PhysicalPointerUintNonWriteArray;
layout(buffer_reference) buffer PhysicalPointerUint2NonWriteArray;
layout(buffer_reference) buffer PhysicalPointerUint3NonWrite;
layout(buffer_reference) buffer PhysicalPointerUint4NonWriteArray;
layout(buffer_reference) buffer PhysicalPointerFloatArray;
layout(buffer_reference) buffer PhysicalPointerUintArray;

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

vec4 _393;
float _399;

layout(buffer_reference, buffer_reference_align = 16, std430) readonly buffer PhysicalPointerFloat4NonWriteCBVArray
{
    vec4 value[4096];
};

layout(buffer_reference, buffer_reference_align = 16, std430) readonly buffer PhysicalPointerFloat4NonWriteArray
{
    vec4 value[];
};

layout(buffer_reference, buffer_reference_align = 4, std430) readonly buffer PhysicalPointerUintNonWriteArray
{
    uint value[];
};

layout(buffer_reference, buffer_reference_align = 8, std430) readonly buffer PhysicalPointerUint2NonWriteArray
{
    uvec2 value[];
};

layout(buffer_reference, buffer_reference_align = 4, std430) readonly buffer PhysicalPointerUint3NonWrite
{
    uvec3 value;
};

layout(buffer_reference, buffer_reference_align = 16, std430) readonly buffer PhysicalPointerUint4NonWriteArray
{
    uvec4 value[];
};

layout(buffer_reference, buffer_reference_align = 4, std430) buffer PhysicalPointerFloatArray
{
    float value[];
};

layout(buffer_reference, buffer_reference_align = 4, std430) buffer PhysicalPointerUintArray
{
    uint value[];
};

layout(shaderRecordEXT, std430) buffer SBTBlock
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
layout(location = 0) rayPayloadInEXT _37 payload;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    uint _53 = (SBT._m9.x >> 6u) + 12u;
    uint _58 = payload._m1;
    uint _59 = _58 & 1u;
    vec4 _67 = texelFetch(_21[registers._m0 + _59], ivec2(uvec2(0u)), int(0u));
    vec4 _80 = texelFetch(_21[registers._m0 + _58], ivec2(uvec2(0u)), int(0u));
    vec4 _99 = texelFetch(_21[nonuniformEXT(((SBT._m7.x >> 6u) + 17u) + _58)], ivec2(uvec2(0u)), int(0u));
    vec4 _119 = imageLoad(_25[nonuniformEXT(((SBT._m8.x >> 6u) + 18u) + _58)], ivec2(uvec2(0u)));
    uint _146 = ((SBT._m9.x >> 6u) + 13u) + _58;
    vec4 _169 = uintBitsToFloat(uvec4(SBT._m0[0u], SBT._m0[1u], SBT._m0[2u], SBT._m0[3u]));
    vec4 _182 = uintBitsToFloat(uvec4(SBT._m0[4u], 0u, 0u, 0u));
    vec4 _197 = PhysicalPointerFloat4NonWriteCBVArray(SBT._m6).value[1u];
    vec4 _223 = textureLod(nonuniformEXT(sampler2D(_21[registers._m0 + _59], _36[(SBT._m10.x >> 5u) + 13u])), vec2(0.5), 0.0);
    vec4 _249 = textureLod(nonuniformEXT(sampler2D(_21[registers._m0 + _58], _36[((SBT._m10.x >> 5u) + 14u) + (_58 ^ 1u)])), vec2(0.5), 0.0);
    vec4 _266 = PhysicalPointerFloat4NonWriteArray(SBT._m2).value[_58];
    uint _294 = PhysicalPointerUintNonWriteArray(SBT._m4).value[ByteAddressMask(_58, 4u)];
    float _295 = uintBitsToFloat(_294);
    uvec2 _308 = PhysicalPointerUint2NonWriteArray(SBT._m4).value[ByteAddressMask(_58, 8u)];
    float _311 = uintBitsToFloat(_308.x);
    float _312 = uintBitsToFloat(_308.y);
    AddCarry _324;
    _324._m0 = uaddCarry(SBT._m4.x, _58 * 12u, _324._m1);
    uvec3 _332 = PhysicalPointerUint3NonWrite(uvec2(_324._m0, SBT._m4.y + _324._m1)).value;
    float _338 = uintBitsToFloat(_332.z);
    uvec4 _352 = PhysicalPointerUint4NonWriteArray(SBT._m4).value[ByteAddressMask(_58, 16u)];
    float _373 = PhysicalPointerFloatArray(SBT._m3).value[_58];
    uint _386 = PhysicalPointerUintArray(SBT._m5).value[ByteAddressMask(_58, 4u)];
    float _387 = uintBitsToFloat(_386);
    float _388 = _387 + (_373 + ((((_295 + (_266.x + (_249.x + (_223.x + ((((_32[nonuniformEXT(_146)]._m0[0u].x + ((_119.x + (_99.x + (_80.x + _67.x))) + _32[nonuniformEXT(_53)]._m0[0u].x)) + _169.x) + _182.x) + _197.x))))) + _311) + uintBitsToFloat(_332.x)) + uintBitsToFloat(_352.x)));
    float _389 = _387 + (_373 + ((((_295 + (_266.y + (_249.y + (_223.y + ((((_32[nonuniformEXT(_146)]._m0[0u].y + ((_119.y + (_99.y + (_80.y + _67.y))) + _32[nonuniformEXT(_53)]._m0[0u].y)) + _169.y) + _182.y) + _197.y))))) + _312) + uintBitsToFloat(_332.y)) + uintBitsToFloat(_352.y)));
    vec4 _392;
    _392.x = _388;
    _392.y = _389;
    _392.z = _387 + (_373 + ((((_295 + (_266.z + (_249.z + (_223.z + ((((_32[nonuniformEXT(_146)]._m0[0u].z + ((_119.z + (_99.z + (_80.z + _67.z))) + _32[nonuniformEXT(_53)]._m0[0u].z)) + _169.z) + _182.z) + _197.z))))) + _311) + _338) + uintBitsToFloat(_352.z)));
    _392.w = _387 + (_373 + ((((_295 + (_266.w + (_249.w + (_223.w + ((((_32[nonuniformEXT(_146)]._m0[0u].w + ((_119.w + (_99.w + (_80.w + _67.w))) + _32[nonuniformEXT(_53)]._m0[0u].w)) + _169.w) + _182.w) + _197.w))))) + _312) + _338) + uintBitsToFloat(_352.w)));
    payload._m0 = _392;
    PhysicalPointerFloatArray(SBT._m3).value[_58] = _388;
    PhysicalPointerFloatArray(SBT._m5).value[ByteAddressMask(_58, 4u)] = _389;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.4
; Generator: Unknown(30017); 21022
; Bound: 407
; Schema: 0
OpCapability Shader
OpCapability UniformBufferArrayDynamicIndexing
OpCapability SampledImageArrayDynamicIndexing
OpCapability StorageBufferArrayDynamicIndexing
OpCapability StorageImageArrayDynamicIndexing
OpCapability RayTracingKHR
OpCapability RuntimeDescriptorArray
OpCapability UniformBufferArrayNonUniformIndexing
OpCapability SampledImageArrayNonUniformIndexing
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability StorageImageArrayNonUniformIndexing
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpExtension "SPV_KHR_ray_tracing"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint MissKHR %3 "main" %8 %16 %21 %25 %32 %36 %39
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %14 "SBTBlock"
OpName %16 "SBT"
OpName %29 "BindlessCBV"
OpName %37 ""
OpName %39 "payload"
OpName %192 "PhysicalPointerFloat4NonWriteCBVArray"
OpMemberName %192 0 "value"
OpName %262 "PhysicalPointerFloat4NonWriteArray"
OpMemberName %262 0 "value"
OpName %281 "ByteAddressMask"
OpName %279 "index"
OpName %280 "stride"
OpName %289 "PhysicalPointerUintNonWriteArray"
OpMemberName %289 0 "value"
OpName %303 "PhysicalPointerUint2NonWriteArray"
OpMemberName %303 0 "value"
OpName %319 "PhysicalPointerUint3NonWrite"
OpMemberName %319 0 "value"
OpName %323 "AddCarry"
OpName %347 "PhysicalPointerUint4NonWriteArray"
OpMemberName %347 0 "value"
OpName %368 "PhysicalPointerFloatArray"
OpMemberName %368 0 "value"
OpName %382 "PhysicalPointerUintArray"
OpMemberName %382 0 "value"
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
OpDecorate %47 NonUniform
OpDecorate %97 NonUniform
OpDecorate %98 NonUniform
OpDecorate %117 NonUniform
OpDecorate %118 NonUniform
OpDecorate %130 NonUniform
OpDecorate %146 NonUniform
OpDecorate %140 NonUniform
OpDecorate %147 NonUniform
OpDecorate %191 ArrayStride 16
OpMemberDecorate %192 0 Offset 0
OpDecorate %192 Block
OpMemberDecorate %192 0 NonWritable
OpDecorate %218 NonUniform
OpDecorate %220 NonUniform
OpDecorate %246 NonUniform
OpDecorate %247 NonUniform
OpDecorate %248 NonUniform
OpDecorate %261 ArrayStride 16
OpMemberDecorate %262 0 Offset 0
OpDecorate %262 Block
OpMemberDecorate %262 0 NonWritable
OpDecorate %288 ArrayStride 4
OpMemberDecorate %289 0 Offset 0
OpDecorate %289 Block
OpMemberDecorate %289 0 NonWritable
OpDecorate %302 ArrayStride 8
OpMemberDecorate %303 0 Offset 0
OpDecorate %303 Block
OpMemberDecorate %303 0 NonWritable
OpMemberDecorate %319 0 Offset 0
OpDecorate %319 Block
OpMemberDecorate %319 0 NonWritable
OpDecorate %346 ArrayStride 16
OpMemberDecorate %347 0 Offset 0
OpDecorate %347 Block
OpMemberDecorate %347 0 NonWritable
OpDecorate %367 ArrayStride 4
OpMemberDecorate %368 0 Offset 0
OpDecorate %368 Block
OpDecorate %381 ArrayStride 4
OpMemberDecorate %382 0 Offset 0
OpDecorate %382 Block
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
%15 = OpTypePointer ShaderRecordBufferKHR %14
%16 = OpVariable %15 ShaderRecordBufferKHR
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
%38 = OpTypePointer IncomingRayPayloadKHR %37
%39 = OpVariable %38 IncomingRayPayloadKHR
%40 = OpTypePointer ShaderRecordBufferKHR %13
%43 = OpTypePointer ShaderRecordBufferKHR %10
%45 = OpConstant %5 0
%46 = OpTypePointer Uniform %29
%48 = OpTypePointer ShaderRecordBufferKHR %5
%50 = OpConstant %5 9
%54 = OpConstant %5 12
%55 = OpTypePointer IncomingRayPayloadKHR %5
%57 = OpConstant %5 1
%60 = OpTypePointer UniformConstant %18
%62 = OpTypePointer PushConstant %5
%73 = OpTypePointer IncomingRayPayloadKHR %26
%92 = OpConstant %5 7
%96 = OpConstant %5 17
%109 = OpTypePointer UniformConstant %22
%112 = OpConstant %5 8
%116 = OpConstant %5 18
%129 = OpTypePointer Uniform %26
%145 = OpConstant %5 13
%162 = OpConstant %5 2
%165 = OpConstant %5 3
%167 = OpTypeVector %5 4
%179 = OpConstant %5 4
%191 = OpTypeArray %26 %27
%192 = OpTypeStruct %191
%193 = OpTypePointer PhysicalStorageBuffer %192
%195 = OpTypePointer PhysicalStorageBuffer %26
%211 = OpTypePointer UniformConstant %33
%214 = OpConstant %5 10
%219 = OpTypeSampledImage %18
%221 = OpConstant %17 0.5
%222 = OpConstant %17 0
%224 = OpTypeVector %17 2
%245 = OpConstant %5 14
%261 = OpTypeRuntimeArray %26
%262 = OpTypeStruct %261
%263 = OpTypePointer PhysicalStorageBuffer %262
%278 = OpTypeFunction %5 %5 %5
%284 = OpConstant %5 4294967295
%288 = OpTypeRuntimeArray %5
%289 = OpTypeStruct %288
%290 = OpTypePointer PhysicalStorageBuffer %289
%292 = OpTypePointer PhysicalStorageBuffer %5
%302 = OpTypeRuntimeArray %13
%303 = OpTypeStruct %302
%304 = OpTypePointer PhysicalStorageBuffer %303
%306 = OpTypePointer PhysicalStorageBuffer %13
%318 = OpTypeVector %5 3
%319 = OpTypeStruct %318
%320 = OpTypePointer PhysicalStorageBuffer %319
%323 = OpTypeStruct %5 %5
%330 = OpTypePointer PhysicalStorageBuffer %318
%345 = OpConstant %5 16
%346 = OpTypeRuntimeArray %167
%347 = OpTypeStruct %346
%348 = OpTypePointer PhysicalStorageBuffer %347
%350 = OpTypePointer PhysicalStorageBuffer %167
%367 = OpTypeRuntimeArray %17
%368 = OpTypeStruct %367
%369 = OpTypePointer PhysicalStorageBuffer %368
%371 = OpTypePointer PhysicalStorageBuffer %17
%381 = OpTypeRuntimeArray %5
%382 = OpTypeStruct %381
%383 = OpTypePointer PhysicalStorageBuffer %382
%3 = OpFunction %1 None %2
%4 = OpLabel
%393 = OpUndef %26
%399 = OpUndef %17
OpBranch %405
%405 = OpLabel
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
%68 = OpCompositeConstruct %13 %45 %45
%67 = OpImageFetch %26 %66 %68 Lod %45
%69 = OpCompositeExtract %17 %67 0
%70 = OpCompositeExtract %17 %67 1
%71 = OpCompositeExtract %17 %67 2
%72 = OpCompositeExtract %17 %67 3
%74 = OpInBoundsAccessChain %73 %39 %45
%76 = OpAccessChain %62 %8 %45
%77 = OpLoad %5 %76
%78 = OpIAdd %5 %77 %58
%75 = OpAccessChain %60 %21 %78
%79 = OpLoad %18 %75
%81 = OpCompositeConstruct %13 %45 %45
%80 = OpImageFetch %26 %79 %81 Lod %45
%82 = OpCompositeExtract %17 %80 0
%83 = OpCompositeExtract %17 %80 1
%84 = OpCompositeExtract %17 %80 2
%85 = OpCompositeExtract %17 %80 3
%86 = OpFAdd %17 %82 %69
%87 = OpFAdd %17 %83 %70
%88 = OpFAdd %17 %84 %71
%89 = OpFAdd %17 %85 %72
%91 = OpAccessChain %48 %16 %92 %45
%93 = OpLoad %5 %91
%94 = OpShiftRightLogical %5 %93 %11
%95 = OpIAdd %5 %94 %96
%97 = OpIAdd %5 %95 %58
%90 = OpAccessChain %60 %21 %97
%98 = OpLoad %18 %90
%100 = OpCompositeConstruct %13 %45 %45
%99 = OpImageFetch %26 %98 %100 Lod %45
%101 = OpCompositeExtract %17 %99 0
%102 = OpCompositeExtract %17 %99 1
%103 = OpCompositeExtract %17 %99 2
%104 = OpCompositeExtract %17 %99 3
%105 = OpFAdd %17 %101 %86
%106 = OpFAdd %17 %102 %87
%107 = OpFAdd %17 %103 %88
%108 = OpFAdd %17 %104 %89
%111 = OpAccessChain %48 %16 %112 %45
%113 = OpLoad %5 %111
%114 = OpShiftRightLogical %5 %113 %11
%115 = OpIAdd %5 %114 %116
%117 = OpIAdd %5 %115 %58
%110 = OpAccessChain %109 %25 %117
%118 = OpLoad %22 %110
%120 = OpCompositeConstruct %13 %45 %45
%119 = OpImageRead %26 %118 %120 None
%121 = OpCompositeExtract %17 %119 0
%122 = OpCompositeExtract %17 %119 1
%123 = OpCompositeExtract %17 %119 2
%124 = OpCompositeExtract %17 %119 3
%125 = OpFAdd %17 %121 %105
%126 = OpFAdd %17 %122 %106
%127 = OpFAdd %17 %123 %107
%128 = OpFAdd %17 %124 %108
%130 = OpAccessChain %129 %47 %45 %45
%131 = OpLoad %26 %130
%132 = OpCompositeExtract %17 %131 0
%133 = OpCompositeExtract %17 %131 1
%134 = OpCompositeExtract %17 %131 2
%135 = OpCompositeExtract %17 %131 3
%136 = OpFAdd %17 %125 %132
%137 = OpFAdd %17 %126 %133
%138 = OpFAdd %17 %127 %134
%139 = OpFAdd %17 %128 %135
%141 = OpAccessChain %48 %16 %50 %45
%142 = OpLoad %5 %141
%143 = OpShiftRightLogical %5 %142 %11
%144 = OpIAdd %5 %143 %145
%146 = OpIAdd %5 %144 %58
%140 = OpAccessChain %46 %32 %146
%147 = OpAccessChain %129 %140 %45 %45
%148 = OpLoad %26 %147
%149 = OpCompositeExtract %17 %148 0
%150 = OpCompositeExtract %17 %148 1
%151 = OpCompositeExtract %17 %148 2
%152 = OpCompositeExtract %17 %148 3
%153 = OpFAdd %17 %149 %136
%154 = OpFAdd %17 %150 %137
%155 = OpFAdd %17 %151 %138
%156 = OpFAdd %17 %152 %139
%157 = OpAccessChain %48 %44 %45
%158 = OpLoad %5 %157
%159 = OpAccessChain %48 %44 %57
%160 = OpLoad %5 %159
%161 = OpAccessChain %48 %44 %162
%163 = OpLoad %5 %161
%164 = OpAccessChain %48 %44 %165
%166 = OpLoad %5 %164
%168 = OpCompositeConstruct %167 %158 %160 %163 %166
%169 = OpBitcast %26 %168
%170 = OpCompositeExtract %17 %169 0
%171 = OpCompositeExtract %17 %169 1
%172 = OpCompositeExtract %17 %169 2
%173 = OpCompositeExtract %17 %169 3
%174 = OpFAdd %17 %153 %170
%175 = OpFAdd %17 %154 %171
%176 = OpFAdd %17 %155 %172
%177 = OpFAdd %17 %156 %173
%178 = OpAccessChain %48 %44 %179
%180 = OpLoad %5 %178
%181 = OpCompositeConstruct %167 %180 %45 %45 %45
%182 = OpBitcast %26 %181
%183 = OpCompositeExtract %17 %182 0
%184 = OpCompositeExtract %17 %182 1
%185 = OpCompositeExtract %17 %182 2
%186 = OpCompositeExtract %17 %182 3
%187 = OpFAdd %17 %174 %183
%188 = OpFAdd %17 %175 %184
%189 = OpFAdd %17 %176 %185
%190 = OpFAdd %17 %177 %186
%194 = OpBitcast %193 %42
%196 = OpInBoundsAccessChain %195 %194 %45 %57
%197 = OpLoad %26 %196 Aligned 16
%198 = OpCompositeExtract %17 %197 0
%199 = OpCompositeExtract %17 %197 1
%200 = OpCompositeExtract %17 %197 2
%201 = OpCompositeExtract %17 %197 3
%202 = OpFAdd %17 %187 %198
%203 = OpFAdd %17 %188 %199
%204 = OpFAdd %17 %189 %200
%205 = OpFAdd %17 %190 %201
%207 = OpAccessChain %62 %8 %45
%208 = OpLoad %5 %207
%209 = OpIAdd %5 %208 %59
%206 = OpAccessChain %60 %21 %209
%210 = OpLoad %18 %206
%213 = OpAccessChain %48 %16 %214 %45
%215 = OpLoad %5 %213
%216 = OpShiftRightLogical %5 %215 %9
%217 = OpIAdd %5 %216 %145
%212 = OpAccessChain %211 %36 %217
%218 = OpLoad %33 %212
%220 = OpSampledImage %219 %210 %218
%225 = OpCompositeConstruct %224 %221 %221
%223 = OpImageSampleExplicitLod %26 %220 %225 Lod %222
%226 = OpCompositeExtract %17 %223 0
%227 = OpCompositeExtract %17 %223 1
%228 = OpCompositeExtract %17 %223 2
%229 = OpCompositeExtract %17 %223 3
%230 = OpFAdd %17 %226 %202
%231 = OpFAdd %17 %227 %203
%232 = OpFAdd %17 %228 %204
%233 = OpFAdd %17 %229 %205
%234 = OpBitwiseXor %5 %58 %57
%236 = OpAccessChain %62 %8 %45
%237 = OpLoad %5 %236
%238 = OpIAdd %5 %237 %58
%235 = OpAccessChain %60 %21 %238
%239 = OpLoad %18 %235
%241 = OpAccessChain %48 %16 %214 %45
%242 = OpLoad %5 %241
%243 = OpShiftRightLogical %5 %242 %9
%244 = OpIAdd %5 %243 %245
%246 = OpIAdd %5 %244 %234
%240 = OpAccessChain %211 %36 %246
%247 = OpLoad %33 %240
%248 = OpSampledImage %219 %239 %247
%250 = OpCompositeConstruct %224 %221 %221
%249 = OpImageSampleExplicitLod %26 %248 %250 Lod %222
%251 = OpCompositeExtract %17 %249 0
%252 = OpCompositeExtract %17 %249 1
%253 = OpCompositeExtract %17 %249 2
%254 = OpCompositeExtract %17 %249 3
%255 = OpFAdd %17 %251 %230
%256 = OpFAdd %17 %252 %231
%257 = OpFAdd %17 %253 %232
%258 = OpFAdd %17 %254 %233
%259 = OpAccessChain %40 %16 %162
%260 = OpLoad %13 %259
%264 = OpBitcast %263 %260
%265 = OpInBoundsAccessChain %195 %264 %45 %58
%266 = OpLoad %26 %265 Aligned 16
%267 = OpCompositeExtract %17 %266 0
%268 = OpCompositeExtract %17 %266 1
%269 = OpCompositeExtract %17 %266 2
%270 = OpCompositeExtract %17 %266 3
%271 = OpFAdd %17 %267 %255
%272 = OpFAdd %17 %268 %256
%273 = OpFAdd %17 %269 %257
%274 = OpFAdd %17 %270 %258
%275 = OpShiftLeftLogical %5 %58 %162
%276 = OpAccessChain %40 %16 %179
%277 = OpLoad %13 %276
%287 = OpFunctionCall %5 %281 %58 %179
%291 = OpBitcast %290 %277
%293 = OpInBoundsAccessChain %292 %291 %45 %287
%294 = OpLoad %5 %293 Aligned 4
%295 = OpBitcast %17 %294
%296 = OpFAdd %17 %295 %271
%297 = OpFAdd %17 %295 %272
%298 = OpFAdd %17 %295 %273
%299 = OpFAdd %17 %295 %274
%300 = OpShiftLeftLogical %5 %58 %165
%301 = OpFunctionCall %5 %281 %58 %112
%305 = OpBitcast %304 %277
%307 = OpInBoundsAccessChain %306 %305 %45 %301
%308 = OpLoad %13 %307 Aligned 8
%309 = OpCompositeExtract %5 %308 0
%310 = OpCompositeExtract %5 %308 1
%311 = OpBitcast %17 %309
%312 = OpBitcast %17 %310
%313 = OpFAdd %17 %296 %311
%314 = OpFAdd %17 %297 %312
%315 = OpFAdd %17 %298 %311
%316 = OpFAdd %17 %299 %312
%317 = OpIMul %5 %58 %54
%321 = OpCompositeExtract %5 %277 0
%322 = OpCompositeExtract %5 %277 1
%324 = OpIAddCarry %323 %321 %317
%325 = OpCompositeExtract %5 %324 0
%326 = OpCompositeExtract %5 %324 1
%327 = OpIAdd %5 %322 %326
%328 = OpCompositeConstruct %13 %325 %327
%329 = OpBitcast %320 %328
%331 = OpInBoundsAccessChain %330 %329 %45
%332 = OpLoad %318 %331 Aligned 4
%333 = OpCompositeExtract %5 %332 0
%334 = OpCompositeExtract %5 %332 1
%335 = OpCompositeExtract %5 %332 2
%336 = OpBitcast %17 %333
%337 = OpBitcast %17 %334
%338 = OpBitcast %17 %335
%339 = OpFAdd %17 %313 %336
%340 = OpFAdd %17 %314 %337
%341 = OpFAdd %17 %315 %338
%342 = OpFAdd %17 %316 %338
%343 = OpShiftLeftLogical %5 %58 %179
%344 = OpFunctionCall %5 %281 %58 %345
%349 = OpBitcast %348 %277
%351 = OpInBoundsAccessChain %350 %349 %45 %344
%352 = OpLoad %167 %351 Aligned 16
%353 = OpCompositeExtract %5 %352 0
%354 = OpCompositeExtract %5 %352 1
%355 = OpCompositeExtract %5 %352 2
%356 = OpCompositeExtract %5 %352 3
%357 = OpBitcast %17 %353
%358 = OpBitcast %17 %354
%359 = OpBitcast %17 %355
%360 = OpBitcast %17 %356
%361 = OpFAdd %17 %339 %357
%362 = OpFAdd %17 %340 %358
%363 = OpFAdd %17 %341 %359
%364 = OpFAdd %17 %342 %360
%365 = OpAccessChain %40 %16 %165
%366 = OpLoad %13 %365
%370 = OpBitcast %369 %366
%372 = OpInBoundsAccessChain %371 %370 %45 %58
%373 = OpLoad %17 %372 Aligned 4
%374 = OpFAdd %17 %373 %361
%375 = OpFAdd %17 %373 %362
%376 = OpFAdd %17 %373 %363
%377 = OpFAdd %17 %373 %364
%378 = OpAccessChain %40 %16 %9
%379 = OpLoad %13 %378
%380 = OpFunctionCall %5 %281 %58 %179
%384 = OpBitcast %383 %379
%385 = OpInBoundsAccessChain %292 %384 %45 %380
%386 = OpLoad %5 %385 Aligned 4
%387 = OpBitcast %17 %386
%388 = OpFAdd %17 %387 %374
%389 = OpFAdd %17 %387 %375
%390 = OpFAdd %17 %387 %376
%391 = OpFAdd %17 %387 %377
%392 = OpCompositeInsert %26 %388 %393 0
%394 = OpCompositeInsert %26 %389 %392 1
%395 = OpCompositeInsert %26 %390 %394 2
%396 = OpCompositeInsert %26 %391 %395 3
OpStore %74 %396
%397 = OpBitcast %369 %366
%398 = OpInBoundsAccessChain %371 %397 %45 %58
OpStore %398 %388 Aligned 4
%400 = OpAccessChain %40 %16 %9
%401 = OpLoad %13 %400
%402 = OpFunctionCall %5 %281 %58 %179
%403 = OpBitcast %369 %401
%404 = OpInBoundsAccessChain %371 %403 %45 %402
OpStore %404 %389 Aligned 4
OpReturn
OpFunctionEnd
%281 = OpFunction %5 None %278
%279 = OpFunctionParameter %5
%280 = OpFunctionParameter %5
%282 = OpLabel
%283 = OpUDiv %5 %284 %280
%285 = OpBitwiseAnd %5 %279 %283
OpReturnValue %285
OpFunctionEnd
#endif
