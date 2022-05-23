#version 460
#extension GL_EXT_ray_tracing : require
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

layout(buffer_reference) buffer PhysicalPointerFloat4NonWriteCBVArray;
layout(buffer_reference) buffer PhysicalPointerFloat4NonWrite;
layout(buffer_reference) buffer PhysicalPointerUintNonWrite;
layout(buffer_reference) buffer PhysicalPointerUint2NonWrite;
layout(buffer_reference) buffer PhysicalPointerUint3NonWrite;
layout(buffer_reference) buffer PhysicalPointerUint4NonWrite;
layout(buffer_reference) buffer PhysicalPointerFloat;
layout(buffer_reference) buffer PhysicalPointerUint;
layout(buffer_reference, std430) readonly buffer PhysicalPointerFloat4NonWriteCBVArray
{
    vec4 value[4096];
};

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

vec4 _420;
float _435;

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
    AddCarry _269;
    _269._m0 = uaddCarry(SBT._m2.x, (_58 * 16u) + 0u, _269._m1);
    PhysicalPointerFloat4NonWrite _274 = PhysicalPointerFloat4NonWrite(uvec2(_269._m0, SBT._m2.y + _269._m1));
    uint _285 = _58 << 2u;
    AddCarry _292;
    _292._m0 = uaddCarry(SBT._m4.x, _285, _292._m1);
    float _301 = uintBitsToFloat(PhysicalPointerUintNonWrite(uvec2(_292._m0, SBT._m4.y + _292._m1)).value);
    AddCarry _311;
    _311._m0 = uaddCarry(SBT._m4.x, _58 << 3u, _311._m1);
    PhysicalPointerUint2NonWrite _316 = PhysicalPointerUint2NonWrite(uvec2(_311._m0, SBT._m4.y + _311._m1));
    float _322 = uintBitsToFloat(_316.value.x);
    float _323 = uintBitsToFloat(_316.value.y);
    AddCarry _334;
    _334._m0 = uaddCarry(SBT._m4.x, _58 * 12u, _334._m1);
    PhysicalPointerUint3NonWrite _339 = PhysicalPointerUint3NonWrite(uvec2(_334._m0, SBT._m4.y + _334._m1));
    float _348 = uintBitsToFloat(_339.value.z);
    AddCarry _358;
    _358._m0 = uaddCarry(SBT._m4.x, _58 << 4u, _358._m1);
    PhysicalPointerUint4NonWrite _363 = PhysicalPointerUint4NonWrite(uvec2(_358._m0, SBT._m4.y + _358._m1));
    AddCarry _387;
    _387._m0 = uaddCarry(SBT._m3.x, (_58 * 4u) + 0u, _387._m1);
    PhysicalPointerFloat _392 = PhysicalPointerFloat(uvec2(_387._m0, SBT._m3.y + _387._m1));
    AddCarry _406;
    _406._m0 = uaddCarry(SBT._m5.x, _285, _406._m1);
    float _414 = uintBitsToFloat(PhysicalPointerUint(uvec2(_406._m0, SBT._m5.y + _406._m1)).value);
    float _415 = ((((((((((((((((_67.x + _80.x) + _99.x) + _119.x) + _32[nonuniformEXT(_53)]._m0[0u].x) + _32[nonuniformEXT(_146)]._m0[0u].x) + _169.x) + _182.x) + _194.value[1u].x) + _223.x) + _249.x) + _274.value.x) + _301) + _322) + uintBitsToFloat(_339.value.x)) + uintBitsToFloat(_363.value.x)) + _392.value) + _414;
    float _416 = ((((((((((((((((_67.y + _80.y) + _99.y) + _119.y) + _32[nonuniformEXT(_53)]._m0[0u].y) + _32[nonuniformEXT(_146)]._m0[0u].y) + _169.y) + _182.y) + _194.value[1u].y) + _223.y) + _249.y) + _274.value.y) + _301) + _323) + uintBitsToFloat(_339.value.y)) + uintBitsToFloat(_363.value.y)) + _392.value) + _414;
    vec4 _419 = _420;
    _419.x = _415;
    vec4 _421 = _419;
    _421.y = _416;
    vec4 _422 = _421;
    _422.z = ((((((((((((((((_67.z + _80.z) + _99.z) + _119.z) + _32[nonuniformEXT(_53)]._m0[0u].z) + _32[nonuniformEXT(_146)]._m0[0u].z) + _169.z) + _182.z) + _194.value[1u].z) + _223.z) + _249.z) + _274.value.z) + _301) + _322) + _348) + uintBitsToFloat(_363.value.z)) + _392.value) + _414;
    vec4 _423 = _422;
    _423.w = ((((((((((((((((_67.w + _80.w) + _99.w) + _119.w) + _32[nonuniformEXT(_53)]._m0[0u].w) + _32[nonuniformEXT(_146)]._m0[0u].w) + _169.w) + _182.w) + _194.value[1u].w) + _223.w) + _249.w) + _274.value.w) + _301) + _323) + _348) + uintBitsToFloat(_363.value.w)) + _392.value) + _414;
    payload._m0 = _423;
    AddCarry _428;
    _428._m0 = uaddCarry(SBT._m3.x, (_58 * 4u) + 0u, _428._m1);
    PhysicalPointerFloat(uvec2(_428._m0, SBT._m3.y + _428._m1)).value = _415;
    AddCarry _440;
    _440._m0 = uaddCarry(SBT._m5.x, _285, _440._m1);
    PhysicalPointerFloat(uvec2(_440._m0, SBT._m5.y + _440._m1)).value = _416;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.4
; Generator: Unknown(30017); 21022
; Bound: 449
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
OpEntryPoint MissNV %3 "main" %8 %16 %21 %25 %32 %36 %39
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
OpName %261 "PhysicalPointerFloat4NonWrite"
OpMemberName %261 0 "value"
OpName %268 "AddCarry"
OpName %288 "PhysicalPointerUintNonWrite"
OpMemberName %288 0 "value"
OpName %307 "PhysicalPointerUint2NonWrite"
OpMemberName %307 0 "value"
OpName %330 "PhysicalPointerUint3NonWrite"
OpMemberName %330 0 "value"
OpName %354 "PhysicalPointerUint4NonWrite"
OpMemberName %354 0 "value"
OpName %381 "PhysicalPointerFloat"
OpMemberName %381 0 "value"
OpName %402 "PhysicalPointerUint"
OpMemberName %402 0 "value"
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
OpMemberDecorate %261 0 Offset 0
OpDecorate %261 Block
OpMemberDecorate %261 0 NonWritable
OpMemberDecorate %288 0 Offset 0
OpDecorate %288 Block
OpMemberDecorate %288 0 NonWritable
OpMemberDecorate %307 0 Offset 0
OpDecorate %307 Block
OpMemberDecorate %307 0 NonWritable
OpMemberDecorate %330 0 Offset 0
OpDecorate %330 Block
OpMemberDecorate %330 0 NonWritable
OpMemberDecorate %354 0 Offset 0
OpDecorate %354 Block
OpMemberDecorate %354 0 NonWritable
OpMemberDecorate %381 0 Offset 0
OpDecorate %381 Block
OpMemberDecorate %402 0 Offset 0
OpDecorate %402 Block
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
%73 = OpTypePointer IncomingRayPayloadNV %26
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
%261 = OpTypeStruct %26
%262 = OpTypePointer PhysicalStorageBuffer %261
%264 = OpConstant %5 16
%268 = OpTypeStruct %5 %5
%288 = OpTypeStruct %5
%289 = OpTypePointer PhysicalStorageBuffer %288
%298 = OpTypePointer PhysicalStorageBuffer %5
%307 = OpTypeStruct %13
%308 = OpTypePointer PhysicalStorageBuffer %307
%317 = OpTypePointer PhysicalStorageBuffer %13
%329 = OpTypeVector %5 3
%330 = OpTypeStruct %329
%331 = OpTypePointer PhysicalStorageBuffer %330
%340 = OpTypePointer PhysicalStorageBuffer %329
%354 = OpTypeStruct %167
%355 = OpTypePointer PhysicalStorageBuffer %354
%364 = OpTypePointer PhysicalStorageBuffer %167
%381 = OpTypeStruct %17
%382 = OpTypePointer PhysicalStorageBuffer %381
%393 = OpTypePointer PhysicalStorageBuffer %17
%402 = OpTypeStruct %5
%403 = OpTypePointer PhysicalStorageBuffer %402
%3 = OpFunction %1 None %2
%4 = OpLabel
%420 = OpUndef %26
%435 = OpUndef %17
OpBranch %447
%447 = OpLabel
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
%263 = OpIMul %5 %58 %264
%265 = OpIAdd %5 %263 %45
%266 = OpCompositeExtract %5 %260 0
%267 = OpCompositeExtract %5 %260 1
%269 = OpIAddCarry %268 %266 %265
%270 = OpCompositeExtract %5 %269 0
%271 = OpCompositeExtract %5 %269 1
%272 = OpIAdd %5 %267 %271
%273 = OpCompositeConstruct %13 %270 %272
%274 = OpBitcast %262 %273
%275 = OpAccessChain %195 %274 %45
%276 = OpLoad %26 %275 Aligned 4
%277 = OpCompositeExtract %17 %276 0
%278 = OpCompositeExtract %17 %276 1
%279 = OpCompositeExtract %17 %276 2
%280 = OpCompositeExtract %17 %276 3
%281 = OpFAdd %17 %255 %277
%282 = OpFAdd %17 %256 %278
%283 = OpFAdd %17 %257 %279
%284 = OpFAdd %17 %258 %280
%285 = OpShiftLeftLogical %5 %58 %162
%286 = OpAccessChain %40 %16 %179
%287 = OpLoad %13 %286
%290 = OpCompositeExtract %5 %287 0
%291 = OpCompositeExtract %5 %287 1
%292 = OpIAddCarry %268 %290 %285
%293 = OpCompositeExtract %5 %292 0
%294 = OpCompositeExtract %5 %292 1
%295 = OpIAdd %5 %291 %294
%296 = OpCompositeConstruct %13 %293 %295
%297 = OpBitcast %289 %296
%299 = OpAccessChain %298 %297 %45
%300 = OpLoad %5 %299 Aligned 4
%301 = OpBitcast %17 %300
%302 = OpFAdd %17 %281 %301
%303 = OpFAdd %17 %282 %301
%304 = OpFAdd %17 %283 %301
%305 = OpFAdd %17 %284 %301
%306 = OpShiftLeftLogical %5 %58 %165
%309 = OpCompositeExtract %5 %287 0
%310 = OpCompositeExtract %5 %287 1
%311 = OpIAddCarry %268 %309 %306
%312 = OpCompositeExtract %5 %311 0
%313 = OpCompositeExtract %5 %311 1
%314 = OpIAdd %5 %310 %313
%315 = OpCompositeConstruct %13 %312 %314
%316 = OpBitcast %308 %315
%318 = OpAccessChain %317 %316 %45
%319 = OpLoad %13 %318 Aligned 4
%320 = OpCompositeExtract %5 %319 0
%321 = OpCompositeExtract %5 %319 1
%322 = OpBitcast %17 %320
%323 = OpBitcast %17 %321
%324 = OpFAdd %17 %302 %322
%325 = OpFAdd %17 %303 %323
%326 = OpFAdd %17 %304 %322
%327 = OpFAdd %17 %305 %323
%328 = OpIMul %5 %58 %54
%332 = OpCompositeExtract %5 %287 0
%333 = OpCompositeExtract %5 %287 1
%334 = OpIAddCarry %268 %332 %328
%335 = OpCompositeExtract %5 %334 0
%336 = OpCompositeExtract %5 %334 1
%337 = OpIAdd %5 %333 %336
%338 = OpCompositeConstruct %13 %335 %337
%339 = OpBitcast %331 %338
%341 = OpAccessChain %340 %339 %45
%342 = OpLoad %329 %341 Aligned 4
%343 = OpCompositeExtract %5 %342 0
%344 = OpCompositeExtract %5 %342 1
%345 = OpCompositeExtract %5 %342 2
%346 = OpBitcast %17 %343
%347 = OpBitcast %17 %344
%348 = OpBitcast %17 %345
%349 = OpFAdd %17 %324 %346
%350 = OpFAdd %17 %325 %347
%351 = OpFAdd %17 %326 %348
%352 = OpFAdd %17 %327 %348
%353 = OpShiftLeftLogical %5 %58 %179
%356 = OpCompositeExtract %5 %287 0
%357 = OpCompositeExtract %5 %287 1
%358 = OpIAddCarry %268 %356 %353
%359 = OpCompositeExtract %5 %358 0
%360 = OpCompositeExtract %5 %358 1
%361 = OpIAdd %5 %357 %360
%362 = OpCompositeConstruct %13 %359 %361
%363 = OpBitcast %355 %362
%365 = OpAccessChain %364 %363 %45
%366 = OpLoad %167 %365 Aligned 4
%367 = OpCompositeExtract %5 %366 0
%368 = OpCompositeExtract %5 %366 1
%369 = OpCompositeExtract %5 %366 2
%370 = OpCompositeExtract %5 %366 3
%371 = OpBitcast %17 %367
%372 = OpBitcast %17 %368
%373 = OpBitcast %17 %369
%374 = OpBitcast %17 %370
%375 = OpFAdd %17 %349 %371
%376 = OpFAdd %17 %350 %372
%377 = OpFAdd %17 %351 %373
%378 = OpFAdd %17 %352 %374
%379 = OpAccessChain %40 %16 %165
%380 = OpLoad %13 %379
%383 = OpIMul %5 %58 %179
%384 = OpIAdd %5 %383 %45
%385 = OpCompositeExtract %5 %380 0
%386 = OpCompositeExtract %5 %380 1
%387 = OpIAddCarry %268 %385 %384
%388 = OpCompositeExtract %5 %387 0
%389 = OpCompositeExtract %5 %387 1
%390 = OpIAdd %5 %386 %389
%391 = OpCompositeConstruct %13 %388 %390
%392 = OpBitcast %382 %391
%394 = OpAccessChain %393 %392 %45
%395 = OpLoad %17 %394 Aligned 4
%396 = OpFAdd %17 %375 %395
%397 = OpFAdd %17 %376 %395
%398 = OpFAdd %17 %377 %395
%399 = OpFAdd %17 %378 %395
%400 = OpAccessChain %40 %16 %9
%401 = OpLoad %13 %400
%404 = OpCompositeExtract %5 %401 0
%405 = OpCompositeExtract %5 %401 1
%406 = OpIAddCarry %268 %404 %285
%407 = OpCompositeExtract %5 %406 0
%408 = OpCompositeExtract %5 %406 1
%409 = OpIAdd %5 %405 %408
%410 = OpCompositeConstruct %13 %407 %409
%411 = OpBitcast %403 %410
%412 = OpAccessChain %298 %411 %45
%413 = OpLoad %5 %412 Aligned 4
%414 = OpBitcast %17 %413
%415 = OpFAdd %17 %396 %414
%416 = OpFAdd %17 %397 %414
%417 = OpFAdd %17 %398 %414
%418 = OpFAdd %17 %399 %414
%419 = OpCompositeInsert %26 %415 %420 0
%421 = OpCompositeInsert %26 %416 %419 1
%422 = OpCompositeInsert %26 %417 %421 2
%423 = OpCompositeInsert %26 %418 %422 3
OpStore %74 %423
%424 = OpIMul %5 %58 %179
%425 = OpIAdd %5 %424 %45
%426 = OpCompositeExtract %5 %380 0
%427 = OpCompositeExtract %5 %380 1
%428 = OpIAddCarry %268 %426 %425
%429 = OpCompositeExtract %5 %428 0
%430 = OpCompositeExtract %5 %428 1
%431 = OpIAdd %5 %427 %430
%432 = OpCompositeConstruct %13 %429 %431
%433 = OpBitcast %382 %432
%434 = OpAccessChain %393 %433 %45
OpStore %434 %415 Aligned 4
%436 = OpAccessChain %40 %16 %9
%437 = OpLoad %13 %436
%438 = OpCompositeExtract %5 %437 0
%439 = OpCompositeExtract %5 %437 1
%440 = OpIAddCarry %268 %438 %285
%441 = OpCompositeExtract %5 %440 0
%442 = OpCompositeExtract %5 %440 1
%443 = OpIAdd %5 %439 %442
%444 = OpCompositeConstruct %13 %441 %443
%445 = OpBitcast %382 %444
%446 = OpAccessChain %393 %445 %45
OpStore %446 %416 Aligned 4
OpReturn
OpFunctionEnd
#endif
