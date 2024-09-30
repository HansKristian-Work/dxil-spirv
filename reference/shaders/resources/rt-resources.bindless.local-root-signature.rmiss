#version 460
#extension GL_EXT_ray_tracing : require
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_EXT_samplerless_texture_functions : require
#extension GL_EXT_buffer_reference_uvec2 : require

struct _37
{
    vec4 _m0;
    uint _m1;
};

vec4 _372;
float _378;

layout(buffer_reference) buffer PhysicalPointerFloat4NonWriteCBVArray;
layout(buffer_reference) buffer PhysicalPointerFloat4NonWriteArray;
layout(buffer_reference) buffer PhysicalPointerUintNonWriteArray;
layout(buffer_reference) buffer PhysicalPointerUint2NonWriteArray;
layout(buffer_reference) buffer PhysicalPointerUint3NonWriteArray;
layout(buffer_reference) buffer PhysicalPointerUint4NonWriteArray;
layout(buffer_reference) buffer PhysicalPointerFloatArray;
layout(buffer_reference) buffer PhysicalPointerUintArray;
layout(buffer_reference, buffer_reference_align = 16, std430) readonly buffer PhysicalPointerFloat4NonWriteCBVArray
{
    vec4 value[4096];
};

layout(buffer_reference, buffer_reference_align = 4, std430) readonly buffer PhysicalPointerFloat4NonWriteArray
{
    vec4 value[];
};

layout(buffer_reference, buffer_reference_align = 4, std430) readonly buffer PhysicalPointerUintNonWriteArray
{
    uint value[];
};

layout(buffer_reference, buffer_reference_align = 4, std430) readonly buffer PhysicalPointerUint2NonWriteArray
{
    uvec2 value[];
};

layout(buffer_reference, buffer_reference_align = 4, scalar) readonly buffer PhysicalPointerUint3NonWriteArray
{
    uvec3 value[];
};

layout(buffer_reference, buffer_reference_align = 4, std430) readonly buffer PhysicalPointerUint4NonWriteArray
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
    PhysicalPointerFloat4NonWriteCBVArray _194 = PhysicalPointerFloat4NonWriteCBVArray(SBT._m6);
    vec4 _223 = textureLod(nonuniformEXT(sampler2D(_21[registers._m0 + _59], _36[(SBT._m10.x >> 5u) + 13u])), vec2(0.5), 0.0);
    vec4 _249 = textureLod(nonuniformEXT(sampler2D(_21[registers._m0 + _58], _36[((SBT._m10.x >> 5u) + 14u) + (_58 ^ 1u)])), vec2(0.5), 0.0);
    PhysicalPointerFloat4NonWriteArray _264 = PhysicalPointerFloat4NonWriteArray(SBT._m2);
    float _285 = uintBitsToFloat(PhysicalPointerUintNonWriteArray(SBT._m4).value[_58]);
    PhysicalPointerUint2NonWriteArray _294 = PhysicalPointerUint2NonWriteArray(SBT._m4);
    float _300 = uintBitsToFloat(_294.value[_58].x);
    float _301 = uintBitsToFloat(_294.value[_58].y);
    PhysicalPointerUint3NonWriteArray _311 = PhysicalPointerUint3NonWriteArray(SBT._m4);
    float _320 = uintBitsToFloat(_311.value[_58].z);
    PhysicalPointerUint4NonWriteArray _329 = PhysicalPointerUint4NonWriteArray(SBT._m4);
    PhysicalPointerFloatArray _350 = PhysicalPointerFloatArray(SBT._m3);
    float _366 = uintBitsToFloat(PhysicalPointerUintArray(SBT._m5).value[_58]);
    float _367 = ((((((((((((((((_67.x + _80.x) + _99.x) + _119.x) + _32[nonuniformEXT(_53)]._m0[0u].x) + _32[nonuniformEXT(_146)]._m0[0u].x) + _169.x) + _182.x) + _194.value[1u].x) + _223.x) + _249.x) + _264.value[_58].x) + _285) + _300) + uintBitsToFloat(_311.value[_58].x)) + uintBitsToFloat(_329.value[_58].x)) + _350.value[_58]) + _366;
    float _368 = ((((((((((((((((_67.y + _80.y) + _99.y) + _119.y) + _32[nonuniformEXT(_53)]._m0[0u].y) + _32[nonuniformEXT(_146)]._m0[0u].y) + _169.y) + _182.y) + _194.value[1u].y) + _223.y) + _249.y) + _264.value[_58].y) + _285) + _301) + uintBitsToFloat(_311.value[_58].y)) + uintBitsToFloat(_329.value[_58].y)) + _350.value[_58]) + _366;
    vec4 _371;
    _371.x = _367;
    _371.y = _368;
    _371.z = ((((((((((((((((_67.z + _80.z) + _99.z) + _119.z) + _32[nonuniformEXT(_53)]._m0[0u].z) + _32[nonuniformEXT(_146)]._m0[0u].z) + _169.z) + _182.z) + _194.value[1u].z) + _223.z) + _249.z) + _264.value[_58].z) + _285) + _300) + _320) + uintBitsToFloat(_329.value[_58].z)) + _350.value[_58]) + _366;
    _371.w = ((((((((((((((((_67.w + _80.w) + _99.w) + _119.w) + _32[nonuniformEXT(_53)]._m0[0u].w) + _32[nonuniformEXT(_146)]._m0[0u].w) + _169.w) + _182.w) + _194.value[1u].w) + _223.w) + _249.w) + _264.value[_58].w) + _285) + _301) + _320) + uintBitsToFloat(_329.value[_58].w)) + _350.value[_58]) + _366;
    payload._m0 = _371;
    PhysicalPointerFloatArray(SBT._m3).value[_58] = _367;
    PhysicalPointerFloatArray(SBT._m5).value[_58] = _368;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.4
; Generator: Unknown(30017); 21022
; Bound: 385
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
OpName %279 "PhysicalPointerUintNonWriteArray"
OpMemberName %279 0 "value"
OpName %292 "PhysicalPointerUint2NonWriteArray"
OpMemberName %292 0 "value"
OpName %309 "PhysicalPointerUint3NonWriteArray"
OpMemberName %309 0 "value"
OpName %327 "PhysicalPointerUint4NonWriteArray"
OpMemberName %327 0 "value"
OpName %348 "PhysicalPointerFloatArray"
OpMemberName %348 0 "value"
OpName %361 "PhysicalPointerUintArray"
OpMemberName %361 0 "value"
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
OpDecorate %278 ArrayStride 4
OpMemberDecorate %279 0 Offset 0
OpDecorate %279 Block
OpMemberDecorate %279 0 NonWritable
OpDecorate %291 ArrayStride 8
OpMemberDecorate %292 0 Offset 0
OpDecorate %292 Block
OpMemberDecorate %292 0 NonWritable
OpDecorate %308 ArrayStride 12
OpMemberDecorate %309 0 Offset 0
OpDecorate %309 Block
OpMemberDecorate %309 0 NonWritable
OpDecorate %326 ArrayStride 16
OpMemberDecorate %327 0 Offset 0
OpDecorate %327 Block
OpMemberDecorate %327 0 NonWritable
OpDecorate %347 ArrayStride 4
OpMemberDecorate %348 0 Offset 0
OpDecorate %348 Block
OpDecorate %360 ArrayStride 4
OpMemberDecorate %361 0 Offset 0
OpDecorate %361 Block
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
%278 = OpTypeRuntimeArray %5
%279 = OpTypeStruct %278
%280 = OpTypePointer PhysicalStorageBuffer %279
%282 = OpTypePointer PhysicalStorageBuffer %5
%291 = OpTypeRuntimeArray %13
%292 = OpTypeStruct %291
%293 = OpTypePointer PhysicalStorageBuffer %292
%295 = OpTypePointer PhysicalStorageBuffer %13
%307 = OpTypeVector %5 3
%308 = OpTypeRuntimeArray %307
%309 = OpTypeStruct %308
%310 = OpTypePointer PhysicalStorageBuffer %309
%312 = OpTypePointer PhysicalStorageBuffer %307
%326 = OpTypeRuntimeArray %167
%327 = OpTypeStruct %326
%328 = OpTypePointer PhysicalStorageBuffer %327
%330 = OpTypePointer PhysicalStorageBuffer %167
%347 = OpTypeRuntimeArray %17
%348 = OpTypeStruct %347
%349 = OpTypePointer PhysicalStorageBuffer %348
%351 = OpTypePointer PhysicalStorageBuffer %17
%360 = OpTypeRuntimeArray %5
%361 = OpTypeStruct %360
%362 = OpTypePointer PhysicalStorageBuffer %361
%3 = OpFunction %1 None %2
%4 = OpLabel
%372 = OpUndef %26
%378 = OpUndef %17
OpBranch %383
%383 = OpLabel
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
%86 = OpFAdd %17 %69 %82
%87 = OpFAdd %17 %70 %83
%88 = OpFAdd %17 %71 %84
%89 = OpFAdd %17 %72 %85
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
%105 = OpFAdd %17 %86 %101
%106 = OpFAdd %17 %87 %102
%107 = OpFAdd %17 %88 %103
%108 = OpFAdd %17 %89 %104
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
%125 = OpFAdd %17 %105 %121
%126 = OpFAdd %17 %106 %122
%127 = OpFAdd %17 %107 %123
%128 = OpFAdd %17 %108 %124
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
%153 = OpFAdd %17 %136 %149
%154 = OpFAdd %17 %137 %150
%155 = OpFAdd %17 %138 %151
%156 = OpFAdd %17 %139 %152
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
%230 = OpFAdd %17 %202 %226
%231 = OpFAdd %17 %203 %227
%232 = OpFAdd %17 %204 %228
%233 = OpFAdd %17 %205 %229
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
%255 = OpFAdd %17 %230 %251
%256 = OpFAdd %17 %231 %252
%257 = OpFAdd %17 %232 %253
%258 = OpFAdd %17 %233 %254
%259 = OpAccessChain %40 %16 %162
%260 = OpLoad %13 %259
%264 = OpBitcast %263 %260
%265 = OpInBoundsAccessChain %195 %264 %45 %58
%266 = OpLoad %26 %265 Aligned 4
%267 = OpCompositeExtract %17 %266 0
%268 = OpCompositeExtract %17 %266 1
%269 = OpCompositeExtract %17 %266 2
%270 = OpCompositeExtract %17 %266 3
%271 = OpFAdd %17 %255 %267
%272 = OpFAdd %17 %256 %268
%273 = OpFAdd %17 %257 %269
%274 = OpFAdd %17 %258 %270
%275 = OpShiftLeftLogical %5 %58 %162
%276 = OpAccessChain %40 %16 %179
%277 = OpLoad %13 %276
%281 = OpBitcast %280 %277
%283 = OpInBoundsAccessChain %282 %281 %45 %58
%284 = OpLoad %5 %283 Aligned 4
%285 = OpBitcast %17 %284
%286 = OpFAdd %17 %271 %285
%287 = OpFAdd %17 %272 %285
%288 = OpFAdd %17 %273 %285
%289 = OpFAdd %17 %274 %285
%290 = OpShiftLeftLogical %5 %58 %165
%294 = OpBitcast %293 %277
%296 = OpInBoundsAccessChain %295 %294 %45 %58
%297 = OpLoad %13 %296 Aligned 4
%298 = OpCompositeExtract %5 %297 0
%299 = OpCompositeExtract %5 %297 1
%300 = OpBitcast %17 %298
%301 = OpBitcast %17 %299
%302 = OpFAdd %17 %286 %300
%303 = OpFAdd %17 %287 %301
%304 = OpFAdd %17 %288 %300
%305 = OpFAdd %17 %289 %301
%306 = OpIMul %5 %58 %54
%311 = OpBitcast %310 %277
%313 = OpInBoundsAccessChain %312 %311 %45 %58
%314 = OpLoad %307 %313 Aligned 4
%315 = OpCompositeExtract %5 %314 0
%316 = OpCompositeExtract %5 %314 1
%317 = OpCompositeExtract %5 %314 2
%318 = OpBitcast %17 %315
%319 = OpBitcast %17 %316
%320 = OpBitcast %17 %317
%321 = OpFAdd %17 %302 %318
%322 = OpFAdd %17 %303 %319
%323 = OpFAdd %17 %304 %320
%324 = OpFAdd %17 %305 %320
%325 = OpShiftLeftLogical %5 %58 %179
%329 = OpBitcast %328 %277
%331 = OpInBoundsAccessChain %330 %329 %45 %58
%332 = OpLoad %167 %331 Aligned 4
%333 = OpCompositeExtract %5 %332 0
%334 = OpCompositeExtract %5 %332 1
%335 = OpCompositeExtract %5 %332 2
%336 = OpCompositeExtract %5 %332 3
%337 = OpBitcast %17 %333
%338 = OpBitcast %17 %334
%339 = OpBitcast %17 %335
%340 = OpBitcast %17 %336
%341 = OpFAdd %17 %321 %337
%342 = OpFAdd %17 %322 %338
%343 = OpFAdd %17 %323 %339
%344 = OpFAdd %17 %324 %340
%345 = OpAccessChain %40 %16 %165
%346 = OpLoad %13 %345
%350 = OpBitcast %349 %346
%352 = OpInBoundsAccessChain %351 %350 %45 %58
%353 = OpLoad %17 %352 Aligned 4
%354 = OpFAdd %17 %341 %353
%355 = OpFAdd %17 %342 %353
%356 = OpFAdd %17 %343 %353
%357 = OpFAdd %17 %344 %353
%358 = OpAccessChain %40 %16 %9
%359 = OpLoad %13 %358
%363 = OpBitcast %362 %359
%364 = OpInBoundsAccessChain %282 %363 %45 %58
%365 = OpLoad %5 %364 Aligned 4
%366 = OpBitcast %17 %365
%367 = OpFAdd %17 %354 %366
%368 = OpFAdd %17 %355 %366
%369 = OpFAdd %17 %356 %366
%370 = OpFAdd %17 %357 %366
%371 = OpCompositeInsert %26 %367 %372 0
%373 = OpCompositeInsert %26 %368 %371 1
%374 = OpCompositeInsert %26 %369 %373 2
%375 = OpCompositeInsert %26 %370 %374 3
OpStore %74 %375
%376 = OpBitcast %349 %346
%377 = OpInBoundsAccessChain %351 %376 %45 %58
OpStore %377 %367 Aligned 4
%379 = OpAccessChain %40 %16 %9
%380 = OpLoad %13 %379
%381 = OpBitcast %349 %380
%382 = OpInBoundsAccessChain %351 %381 %45 %58
OpStore %382 %368 Aligned 4
OpReturn
OpFunctionEnd
#endif
