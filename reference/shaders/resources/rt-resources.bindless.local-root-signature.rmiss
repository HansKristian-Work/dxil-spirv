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

vec4 _425;
float _440;

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
    AddCarry _196;
    _196._m0 = uaddCarry(SBT._m6.x, 1u * 16u, _196._m1);
    PhysicalPointerFloat4NonWrite _203 = PhysicalPointerFloat4NonWrite(uvec2(_196._m0, SBT._m6.y + _196._m1));
    vec4 _232 = textureLod(nonuniformEXT(sampler2D(_21[registers._m0 + _59], _36[(SBT._m10.x >> 5u) + 13u])), vec2(0.5), 0.0);
    vec4 _258 = textureLod(nonuniformEXT(sampler2D(_21[registers._m0 + _58], _36[((SBT._m10.x >> 5u) + 14u) + (_58 ^ 1u)])), vec2(0.5), 0.0);
    AddCarry _274;
    _274._m0 = uaddCarry(SBT._m2.x, (_58 * 16u) + 0u, _274._m1);
    PhysicalPointerFloat4NonWrite _279 = PhysicalPointerFloat4NonWrite(uvec2(_274._m0, SBT._m2.y + _274._m1));
    uint _290 = _58 << 2u;
    AddCarry _297;
    _297._m0 = uaddCarry(SBT._m4.x, _290, _297._m1);
    float _306 = uintBitsToFloat(PhysicalPointerUintNonWrite(uvec2(_297._m0, SBT._m4.y + _297._m1)).value);
    AddCarry _316;
    _316._m0 = uaddCarry(SBT._m4.x, _58 << 3u, _316._m1);
    PhysicalPointerUint2NonWrite _321 = PhysicalPointerUint2NonWrite(uvec2(_316._m0, SBT._m4.y + _316._m1));
    float _327 = uintBitsToFloat(_321.value.x);
    float _328 = uintBitsToFloat(_321.value.y);
    AddCarry _339;
    _339._m0 = uaddCarry(SBT._m4.x, _58 * 12u, _339._m1);
    PhysicalPointerUint3NonWrite _344 = PhysicalPointerUint3NonWrite(uvec2(_339._m0, SBT._m4.y + _339._m1));
    float _353 = uintBitsToFloat(_344.value.z);
    AddCarry _363;
    _363._m0 = uaddCarry(SBT._m4.x, _58 << 4u, _363._m1);
    PhysicalPointerUint4NonWrite _368 = PhysicalPointerUint4NonWrite(uvec2(_363._m0, SBT._m4.y + _363._m1));
    AddCarry _392;
    _392._m0 = uaddCarry(SBT._m3.x, (_58 * 4u) + 0u, _392._m1);
    PhysicalPointerFloat _397 = PhysicalPointerFloat(uvec2(_392._m0, SBT._m3.y + _392._m1));
    AddCarry _411;
    _411._m0 = uaddCarry(SBT._m5.x, _290, _411._m1);
    float _419 = uintBitsToFloat(PhysicalPointerUint(uvec2(_411._m0, SBT._m5.y + _411._m1)).value);
    float _420 = ((((((((((((((((_67.x + _80.x) + _99.x) + _119.x) + _32[nonuniformEXT(_53)]._m0[0u].x) + _32[nonuniformEXT(_146)]._m0[0u].x) + _169.x) + _182.x) + _203.value.x) + _232.x) + _258.x) + _279.value.x) + _306) + _327) + uintBitsToFloat(_344.value.x)) + uintBitsToFloat(_368.value.x)) + _397.value) + _419;
    float _421 = ((((((((((((((((_67.y + _80.y) + _99.y) + _119.y) + _32[nonuniformEXT(_53)]._m0[0u].y) + _32[nonuniformEXT(_146)]._m0[0u].y) + _169.y) + _182.y) + _203.value.y) + _232.y) + _258.y) + _279.value.y) + _306) + _328) + uintBitsToFloat(_344.value.y)) + uintBitsToFloat(_368.value.y)) + _397.value) + _419;
    vec4 _424 = _425;
    _424.x = _420;
    vec4 _426 = _424;
    _426.y = _421;
    vec4 _427 = _426;
    _427.z = ((((((((((((((((_67.z + _80.z) + _99.z) + _119.z) + _32[nonuniformEXT(_53)]._m0[0u].z) + _32[nonuniformEXT(_146)]._m0[0u].z) + _169.z) + _182.z) + _203.value.z) + _232.z) + _258.z) + _279.value.z) + _306) + _327) + _353) + uintBitsToFloat(_368.value.z)) + _397.value) + _419;
    vec4 _428 = _427;
    _428.w = ((((((((((((((((_67.w + _80.w) + _99.w) + _119.w) + _32[nonuniformEXT(_53)]._m0[0u].w) + _32[nonuniformEXT(_146)]._m0[0u].w) + _169.w) + _182.w) + _203.value.w) + _232.w) + _258.w) + _279.value.w) + _306) + _328) + _353) + uintBitsToFloat(_368.value.w)) + _397.value) + _419;
    payload._m0 = _428;
    AddCarry _433;
    _433._m0 = uaddCarry(SBT._m3.x, (_58 * 4u) + 0u, _433._m1);
    PhysicalPointerFloat(uvec2(_433._m0, SBT._m3.y + _433._m1)).value = _420;
    AddCarry _445;
    _445._m0 = uaddCarry(SBT._m5.x, _290, _445._m1);
    PhysicalPointerFloat(uvec2(_445._m0, SBT._m5.y + _445._m1)).value = _421;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.4
; Generator: Unknown(30017); 21022
; Bound: 454
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
OpName %195 "AddCarry"
OpName %201 "PhysicalPointerFloat4NonWrite"
OpMemberName %201 0 "value"
OpName %293 "PhysicalPointerUintNonWrite"
OpMemberName %293 0 "value"
OpName %312 "PhysicalPointerUint2NonWrite"
OpMemberName %312 0 "value"
OpName %335 "PhysicalPointerUint3NonWrite"
OpMemberName %335 0 "value"
OpName %359 "PhysicalPointerUint4NonWrite"
OpMemberName %359 0 "value"
OpName %386 "PhysicalPointerFloat"
OpMemberName %386 0 "value"
OpName %407 "PhysicalPointerUint"
OpMemberName %407 0 "value"
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
OpDecorate %140 NonUniform
OpDecorate %147 NonUniform
OpMemberDecorate %201 0 Offset 0
OpDecorate %201 Block
OpMemberDecorate %201 0 NonWritable
OpDecorate %227 NonUniform
OpDecorate %229 NonUniform
OpDecorate %255 NonUniform
OpDecorate %256 NonUniform
OpDecorate %257 NonUniform
OpMemberDecorate %293 0 Offset 0
OpDecorate %293 Block
OpMemberDecorate %293 0 NonWritable
OpMemberDecorate %312 0 Offset 0
OpDecorate %312 Block
OpMemberDecorate %312 0 NonWritable
OpMemberDecorate %335 0 Offset 0
OpDecorate %335 Block
OpMemberDecorate %335 0 NonWritable
OpMemberDecorate %359 0 Offset 0
OpDecorate %359 Block
OpMemberDecorate %359 0 NonWritable
OpMemberDecorate %386 0 Offset 0
OpDecorate %386 Block
OpMemberDecorate %407 0 Offset 0
OpDecorate %407 Block
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
%192 = OpConstant %5 16
%195 = OpTypeStruct %5 %5
%201 = OpTypeStruct %26
%202 = OpTypePointer PhysicalStorageBuffer %201
%204 = OpTypePointer PhysicalStorageBuffer %26
%220 = OpTypePointer UniformConstant %33
%223 = OpConstant %5 10
%228 = OpTypeSampledImage %18
%230 = OpConstant %17 0.5
%231 = OpConstant %17 0
%233 = OpTypeVector %17 2
%254 = OpConstant %5 14
%293 = OpTypeStruct %5
%294 = OpTypePointer PhysicalStorageBuffer %293
%303 = OpTypePointer PhysicalStorageBuffer %5
%312 = OpTypeStruct %13
%313 = OpTypePointer PhysicalStorageBuffer %312
%322 = OpTypePointer PhysicalStorageBuffer %13
%334 = OpTypeVector %5 3
%335 = OpTypeStruct %334
%336 = OpTypePointer PhysicalStorageBuffer %335
%345 = OpTypePointer PhysicalStorageBuffer %334
%359 = OpTypeStruct %167
%360 = OpTypePointer PhysicalStorageBuffer %359
%369 = OpTypePointer PhysicalStorageBuffer %167
%386 = OpTypeStruct %17
%387 = OpTypePointer PhysicalStorageBuffer %386
%398 = OpTypePointer PhysicalStorageBuffer %17
%407 = OpTypeStruct %5
%408 = OpTypePointer PhysicalStorageBuffer %407
%3 = OpFunction %1 None %2
%4 = OpLabel
%425 = OpUndef %26
%440 = OpUndef %17
OpBranch %452
%452 = OpLabel
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
%191 = OpIMul %5 %57 %192
%193 = OpCompositeExtract %5 %42 0
%194 = OpCompositeExtract %5 %42 1
%196 = OpIAddCarry %195 %193 %191
%197 = OpCompositeExtract %5 %196 0
%198 = OpCompositeExtract %5 %196 1
%199 = OpIAdd %5 %194 %198
%200 = OpCompositeConstruct %13 %197 %199
%203 = OpBitcast %202 %200
%205 = OpAccessChain %204 %203 %45
%206 = OpLoad %26 %205 Aligned 16
%207 = OpCompositeExtract %17 %206 0
%208 = OpCompositeExtract %17 %206 1
%209 = OpCompositeExtract %17 %206 2
%210 = OpCompositeExtract %17 %206 3
%211 = OpFAdd %17 %187 %207
%212 = OpFAdd %17 %188 %208
%213 = OpFAdd %17 %189 %209
%214 = OpFAdd %17 %190 %210
%216 = OpAccessChain %62 %8 %45
%217 = OpLoad %5 %216
%218 = OpIAdd %5 %217 %59
%215 = OpAccessChain %60 %21 %218
%219 = OpLoad %18 %215
%222 = OpAccessChain %48 %16 %223 %45
%224 = OpLoad %5 %222
%225 = OpShiftRightLogical %5 %224 %9
%226 = OpIAdd %5 %225 %145
%221 = OpAccessChain %220 %36 %226
%227 = OpLoad %33 %221
%229 = OpSampledImage %228 %219 %227
%234 = OpCompositeConstruct %233 %230 %230
%232 = OpImageSampleExplicitLod %26 %229 %234 Lod %231
%235 = OpCompositeExtract %17 %232 0
%236 = OpCompositeExtract %17 %232 1
%237 = OpCompositeExtract %17 %232 2
%238 = OpCompositeExtract %17 %232 3
%239 = OpFAdd %17 %211 %235
%240 = OpFAdd %17 %212 %236
%241 = OpFAdd %17 %213 %237
%242 = OpFAdd %17 %214 %238
%243 = OpBitwiseXor %5 %58 %57
%245 = OpAccessChain %62 %8 %45
%246 = OpLoad %5 %245
%247 = OpIAdd %5 %246 %58
%244 = OpAccessChain %60 %21 %247
%248 = OpLoad %18 %244
%250 = OpAccessChain %48 %16 %223 %45
%251 = OpLoad %5 %250
%252 = OpShiftRightLogical %5 %251 %9
%253 = OpIAdd %5 %252 %254
%255 = OpIAdd %5 %253 %243
%249 = OpAccessChain %220 %36 %255
%256 = OpLoad %33 %249
%257 = OpSampledImage %228 %248 %256
%259 = OpCompositeConstruct %233 %230 %230
%258 = OpImageSampleExplicitLod %26 %257 %259 Lod %231
%260 = OpCompositeExtract %17 %258 0
%261 = OpCompositeExtract %17 %258 1
%262 = OpCompositeExtract %17 %258 2
%263 = OpCompositeExtract %17 %258 3
%264 = OpFAdd %17 %239 %260
%265 = OpFAdd %17 %240 %261
%266 = OpFAdd %17 %241 %262
%267 = OpFAdd %17 %242 %263
%268 = OpAccessChain %40 %16 %162
%269 = OpLoad %13 %268
%270 = OpIMul %5 %58 %192
%271 = OpIAdd %5 %270 %45
%272 = OpCompositeExtract %5 %269 0
%273 = OpCompositeExtract %5 %269 1
%274 = OpIAddCarry %195 %272 %271
%275 = OpCompositeExtract %5 %274 0
%276 = OpCompositeExtract %5 %274 1
%277 = OpIAdd %5 %273 %276
%278 = OpCompositeConstruct %13 %275 %277
%279 = OpBitcast %202 %278
%280 = OpAccessChain %204 %279 %45
%281 = OpLoad %26 %280 Aligned 4
%282 = OpCompositeExtract %17 %281 0
%283 = OpCompositeExtract %17 %281 1
%284 = OpCompositeExtract %17 %281 2
%285 = OpCompositeExtract %17 %281 3
%286 = OpFAdd %17 %264 %282
%287 = OpFAdd %17 %265 %283
%288 = OpFAdd %17 %266 %284
%289 = OpFAdd %17 %267 %285
%290 = OpShiftLeftLogical %5 %58 %162
%291 = OpAccessChain %40 %16 %179
%292 = OpLoad %13 %291
%295 = OpCompositeExtract %5 %292 0
%296 = OpCompositeExtract %5 %292 1
%297 = OpIAddCarry %195 %295 %290
%298 = OpCompositeExtract %5 %297 0
%299 = OpCompositeExtract %5 %297 1
%300 = OpIAdd %5 %296 %299
%301 = OpCompositeConstruct %13 %298 %300
%302 = OpBitcast %294 %301
%304 = OpAccessChain %303 %302 %45
%305 = OpLoad %5 %304 Aligned 4
%306 = OpBitcast %17 %305
%307 = OpFAdd %17 %286 %306
%308 = OpFAdd %17 %287 %306
%309 = OpFAdd %17 %288 %306
%310 = OpFAdd %17 %289 %306
%311 = OpShiftLeftLogical %5 %58 %165
%314 = OpCompositeExtract %5 %292 0
%315 = OpCompositeExtract %5 %292 1
%316 = OpIAddCarry %195 %314 %311
%317 = OpCompositeExtract %5 %316 0
%318 = OpCompositeExtract %5 %316 1
%319 = OpIAdd %5 %315 %318
%320 = OpCompositeConstruct %13 %317 %319
%321 = OpBitcast %313 %320
%323 = OpAccessChain %322 %321 %45
%324 = OpLoad %13 %323 Aligned 4
%325 = OpCompositeExtract %5 %324 0
%326 = OpCompositeExtract %5 %324 1
%327 = OpBitcast %17 %325
%328 = OpBitcast %17 %326
%329 = OpFAdd %17 %307 %327
%330 = OpFAdd %17 %308 %328
%331 = OpFAdd %17 %309 %327
%332 = OpFAdd %17 %310 %328
%333 = OpIMul %5 %58 %54
%337 = OpCompositeExtract %5 %292 0
%338 = OpCompositeExtract %5 %292 1
%339 = OpIAddCarry %195 %337 %333
%340 = OpCompositeExtract %5 %339 0
%341 = OpCompositeExtract %5 %339 1
%342 = OpIAdd %5 %338 %341
%343 = OpCompositeConstruct %13 %340 %342
%344 = OpBitcast %336 %343
%346 = OpAccessChain %345 %344 %45
%347 = OpLoad %334 %346 Aligned 4
%348 = OpCompositeExtract %5 %347 0
%349 = OpCompositeExtract %5 %347 1
%350 = OpCompositeExtract %5 %347 2
%351 = OpBitcast %17 %348
%352 = OpBitcast %17 %349
%353 = OpBitcast %17 %350
%354 = OpFAdd %17 %329 %351
%355 = OpFAdd %17 %330 %352
%356 = OpFAdd %17 %331 %353
%357 = OpFAdd %17 %332 %353
%358 = OpShiftLeftLogical %5 %58 %179
%361 = OpCompositeExtract %5 %292 0
%362 = OpCompositeExtract %5 %292 1
%363 = OpIAddCarry %195 %361 %358
%364 = OpCompositeExtract %5 %363 0
%365 = OpCompositeExtract %5 %363 1
%366 = OpIAdd %5 %362 %365
%367 = OpCompositeConstruct %13 %364 %366
%368 = OpBitcast %360 %367
%370 = OpAccessChain %369 %368 %45
%371 = OpLoad %167 %370 Aligned 4
%372 = OpCompositeExtract %5 %371 0
%373 = OpCompositeExtract %5 %371 1
%374 = OpCompositeExtract %5 %371 2
%375 = OpCompositeExtract %5 %371 3
%376 = OpBitcast %17 %372
%377 = OpBitcast %17 %373
%378 = OpBitcast %17 %374
%379 = OpBitcast %17 %375
%380 = OpFAdd %17 %354 %376
%381 = OpFAdd %17 %355 %377
%382 = OpFAdd %17 %356 %378
%383 = OpFAdd %17 %357 %379
%384 = OpAccessChain %40 %16 %165
%385 = OpLoad %13 %384
%388 = OpIMul %5 %58 %179
%389 = OpIAdd %5 %388 %45
%390 = OpCompositeExtract %5 %385 0
%391 = OpCompositeExtract %5 %385 1
%392 = OpIAddCarry %195 %390 %389
%393 = OpCompositeExtract %5 %392 0
%394 = OpCompositeExtract %5 %392 1
%395 = OpIAdd %5 %391 %394
%396 = OpCompositeConstruct %13 %393 %395
%397 = OpBitcast %387 %396
%399 = OpAccessChain %398 %397 %45
%400 = OpLoad %17 %399 Aligned 4
%401 = OpFAdd %17 %380 %400
%402 = OpFAdd %17 %381 %400
%403 = OpFAdd %17 %382 %400
%404 = OpFAdd %17 %383 %400
%405 = OpAccessChain %40 %16 %9
%406 = OpLoad %13 %405
%409 = OpCompositeExtract %5 %406 0
%410 = OpCompositeExtract %5 %406 1
%411 = OpIAddCarry %195 %409 %290
%412 = OpCompositeExtract %5 %411 0
%413 = OpCompositeExtract %5 %411 1
%414 = OpIAdd %5 %410 %413
%415 = OpCompositeConstruct %13 %412 %414
%416 = OpBitcast %408 %415
%417 = OpAccessChain %303 %416 %45
%418 = OpLoad %5 %417 Aligned 4
%419 = OpBitcast %17 %418
%420 = OpFAdd %17 %401 %419
%421 = OpFAdd %17 %402 %419
%422 = OpFAdd %17 %403 %419
%423 = OpFAdd %17 %404 %419
%424 = OpCompositeInsert %26 %420 %425 0
%426 = OpCompositeInsert %26 %421 %424 1
%427 = OpCompositeInsert %26 %422 %426 2
%428 = OpCompositeInsert %26 %423 %427 3
OpStore %74 %428
%429 = OpIMul %5 %58 %179
%430 = OpIAdd %5 %429 %45
%431 = OpCompositeExtract %5 %385 0
%432 = OpCompositeExtract %5 %385 1
%433 = OpIAddCarry %195 %431 %430
%434 = OpCompositeExtract %5 %433 0
%435 = OpCompositeExtract %5 %433 1
%436 = OpIAdd %5 %432 %435
%437 = OpCompositeConstruct %13 %434 %436
%438 = OpBitcast %387 %437
%439 = OpAccessChain %398 %438 %45
OpStore %439 %420 Aligned 4
%441 = OpAccessChain %40 %16 %9
%442 = OpLoad %13 %441
%443 = OpCompositeExtract %5 %442 0
%444 = OpCompositeExtract %5 %442 1
%445 = OpIAddCarry %195 %443 %290
%446 = OpCompositeExtract %5 %445 0
%447 = OpCompositeExtract %5 %445 1
%448 = OpIAdd %5 %444 %447
%449 = OpCompositeConstruct %13 %446 %448
%450 = OpBitcast %387 %449
%451 = OpAccessChain %398 %450 %45
OpStore %451 %421 Aligned 4
OpReturn
OpFunctionEnd
#endif
