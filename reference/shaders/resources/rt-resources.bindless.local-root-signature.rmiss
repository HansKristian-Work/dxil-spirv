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

vec4 _429;
float _444;

void main()
{
    uint _53 = (SBT._m9.x >> 6u) + 12u;
    uint _58 = payload._m1;
    vec4 _67 = texelFetch(_21[registers._m0 + (_58 & 1u)], ivec2(uvec2(0u)), int(0u));
    vec4 _80 = texelFetch(_21[registers._m0 + _58], ivec2(uvec2(0u)), int(0u));
    vec4 _99 = texelFetch(_21[((SBT._m7.x >> 6u) + 17u) + _58], ivec2(uvec2(0u)), int(0u));
    vec4 _119 = imageLoad(_25[((SBT._m8.x >> 6u) + 18u) + _58], ivec2(uvec2(0u)));
    uint _146 = ((SBT._m9.x >> 6u) + 13u) + _58;
    vec4 _169 = uintBitsToFloat(uvec4(SBT._m0[0u], SBT._m0[1u], SBT._m0[2u], SBT._m0[3u]));
    vec4 _182 = uintBitsToFloat(uvec4(SBT._m0[4u], 0u, 0u, 0u));
    AddCarry _196;
    _196._m0 = uaddCarry(SBT._m6.x, 1u * 16u, _196._m1);
    PhysicalPointerFloat4NonWrite _203 = PhysicalPointerFloat4NonWrite(uvec2(_196._m0, SBT._m6.y + _196._m1));
    vec4 _234 = textureLod(nonuniformEXT(sampler2D(_21[registers._m0 + (payload._m1 & 1u)], _36[(SBT._m10.x >> 5u) + 13u])), vec2(0.5), 0.0);
    vec4 _260 = textureLod(sampler2D(_21[registers._m0 + payload._m1], _36[((SBT._m10.x >> 5u) + 14u) + (payload._m1 ^ 1u)]), vec2(0.5), 0.0);
    AddCarry _276;
    _276._m0 = uaddCarry(SBT._m2.x, (payload._m1 * 16u) + 0u, _276._m1);
    PhysicalPointerFloat4NonWrite _281 = PhysicalPointerFloat4NonWrite(uvec2(_276._m0, SBT._m2.y + _276._m1));
    AddCarry _299;
    _299._m0 = uaddCarry(SBT._m4.x, payload._m1 << 2u, _299._m1);
    float _308 = uintBitsToFloat(PhysicalPointerUintNonWrite(uvec2(_299._m0, SBT._m4.y + _299._m1)).value);
    AddCarry _318;
    _318._m0 = uaddCarry(SBT._m4.x, payload._m1 << 3u, _318._m1);
    PhysicalPointerUint2NonWrite _323 = PhysicalPointerUint2NonWrite(uvec2(_318._m0, SBT._m4.y + _318._m1));
    float _329 = uintBitsToFloat(_323.value.x);
    float _330 = uintBitsToFloat(_323.value.y);
    AddCarry _341;
    _341._m0 = uaddCarry(SBT._m4.x, payload._m1 * 12u, _341._m1);
    PhysicalPointerUint3NonWrite _346 = PhysicalPointerUint3NonWrite(uvec2(_341._m0, SBT._m4.y + _341._m1));
    float _355 = uintBitsToFloat(_346.value.z);
    uint _360 = payload._m1;
    AddCarry _366;
    _366._m0 = uaddCarry(SBT._m4.x, _360 << 4u, _366._m1);
    PhysicalPointerUint4NonWrite _371 = PhysicalPointerUint4NonWrite(uvec2(_366._m0, SBT._m4.y + _366._m1));
    AddCarry _395;
    _395._m0 = uaddCarry(SBT._m3.x, (_360 * 4u) + 0u, _395._m1);
    PhysicalPointerFloat _400 = PhysicalPointerFloat(uvec2(_395._m0, SBT._m3.y + _395._m1));
    uint _408 = _360 << 2u;
    AddCarry _415;
    _415._m0 = uaddCarry(SBT._m5.x, _408, _415._m1);
    float _423 = uintBitsToFloat(PhysicalPointerUint(uvec2(_415._m0, SBT._m5.y + _415._m1)).value);
    float _424 = ((((((((((((((((_67.x + _80.x) + _99.x) + _119.x) + _32[nonuniformEXT(_53)]._m0[0u].x) + _32[nonuniformEXT(_146)]._m0[0u].x) + _169.x) + _182.x) + _203.value.x) + _234.x) + _260.x) + _281.value.x) + _308) + _329) + uintBitsToFloat(_346.value.x)) + uintBitsToFloat(_371.value.x)) + _400.value) + _423;
    float _425 = ((((((((((((((((_67.y + _80.y) + _99.y) + _119.y) + _32[nonuniformEXT(_53)]._m0[0u].y) + _32[nonuniformEXT(_146)]._m0[0u].y) + _169.y) + _182.y) + _203.value.y) + _234.y) + _260.y) + _281.value.y) + _308) + _330) + uintBitsToFloat(_346.value.y)) + uintBitsToFloat(_371.value.y)) + _400.value) + _423;
    vec4 _428 = _429;
    _428.x = _424;
    vec4 _430 = _428;
    _430.y = _425;
    vec4 _431 = _430;
    _431.z = ((((((((((((((((_67.z + _80.z) + _99.z) + _119.z) + _32[nonuniformEXT(_53)]._m0[0u].z) + _32[nonuniformEXT(_146)]._m0[0u].z) + _169.z) + _182.z) + _203.value.z) + _234.z) + _260.z) + _281.value.z) + _308) + _329) + _355) + uintBitsToFloat(_371.value.z)) + _400.value) + _423;
    vec4 _432 = _431;
    _432.w = ((((((((((((((((_67.w + _80.w) + _99.w) + _119.w) + _32[nonuniformEXT(_53)]._m0[0u].w) + _32[nonuniformEXT(_146)]._m0[0u].w) + _169.w) + _182.w) + _203.value.w) + _234.w) + _260.w) + _281.value.w) + _308) + _330) + _355) + uintBitsToFloat(_371.value.w)) + _400.value) + _423;
    payload._m0 = _432;
    AddCarry _437;
    _437._m0 = uaddCarry(SBT._m3.x, (_360 * 4u) + 0u, _437._m1);
    PhysicalPointerFloat(uvec2(_437._m0, SBT._m3.y + _437._m1)).value = _424;
    AddCarry _449;
    _449._m0 = uaddCarry(SBT._m5.x, _408, _449._m1);
    PhysicalPointerFloat(uvec2(_449._m0, SBT._m5.y + _449._m1)).value = _425;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.4
; Generator: Unknown(30017); 21022
; Bound: 458
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
OpName %295 "PhysicalPointerUintNonWrite"
OpMemberName %295 0 "value"
OpName %314 "PhysicalPointerUint2NonWrite"
OpMemberName %314 0 "value"
OpName %337 "PhysicalPointerUint3NonWrite"
OpMemberName %337 0 "value"
OpName %362 "PhysicalPointerUint4NonWrite"
OpMemberName %362 0 "value"
OpName %389 "PhysicalPointerFloat"
OpMemberName %389 0 "value"
OpName %411 "PhysicalPointerUint"
OpMemberName %411 0 "value"
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
OpDecorate %130 NonUniform
OpDecorate %140 NonUniform
OpDecorate %147 NonUniform
OpMemberDecorate %201 0 Offset 0
OpDecorate %201 Block
OpMemberDecorate %201 0 NonWritable
OpDecorate %229 NonUniform
OpDecorate %231 NonUniform
OpMemberDecorate %295 0 Offset 0
OpDecorate %295 Block
OpMemberDecorate %295 0 NonWritable
OpMemberDecorate %314 0 Offset 0
OpDecorate %314 Block
OpMemberDecorate %314 0 NonWritable
OpMemberDecorate %337 0 Offset 0
OpDecorate %337 Block
OpMemberDecorate %337 0 NonWritable
OpMemberDecorate %362 0 Offset 0
OpDecorate %362 Block
OpMemberDecorate %362 0 NonWritable
OpMemberDecorate %389 0 Offset 0
OpDecorate %389 Block
OpMemberDecorate %411 0 Offset 0
OpDecorate %411 Block
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
%222 = OpTypePointer UniformConstant %33
%225 = OpConstant %5 10
%230 = OpTypeSampledImage %18
%232 = OpConstant %17 0.5
%233 = OpConstant %17 0
%235 = OpTypeVector %17 2
%256 = OpConstant %5 14
%295 = OpTypeStruct %5
%296 = OpTypePointer PhysicalStorageBuffer %295
%305 = OpTypePointer PhysicalStorageBuffer %5
%314 = OpTypeStruct %13
%315 = OpTypePointer PhysicalStorageBuffer %314
%324 = OpTypePointer PhysicalStorageBuffer %13
%336 = OpTypeVector %5 3
%337 = OpTypeStruct %336
%338 = OpTypePointer PhysicalStorageBuffer %337
%347 = OpTypePointer PhysicalStorageBuffer %336
%362 = OpTypeStruct %167
%363 = OpTypePointer PhysicalStorageBuffer %362
%372 = OpTypePointer PhysicalStorageBuffer %167
%389 = OpTypeStruct %17
%390 = OpTypePointer PhysicalStorageBuffer %389
%401 = OpTypePointer PhysicalStorageBuffer %17
%411 = OpTypeStruct %5
%412 = OpTypePointer PhysicalStorageBuffer %411
%3 = OpFunction %1 None %2
%4 = OpLabel
%429 = OpUndef %26
%444 = OpUndef %17
OpBranch %456
%456 = OpLabel
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
%215 = OpLoad %5 %56
%216 = OpBitwiseAnd %5 %215 %57
%218 = OpAccessChain %62 %8 %45
%219 = OpLoad %5 %218
%220 = OpIAdd %5 %219 %216
%217 = OpAccessChain %60 %21 %220
%221 = OpLoad %18 %217
%224 = OpAccessChain %48 %16 %225 %45
%226 = OpLoad %5 %224
%227 = OpShiftRightLogical %5 %226 %9
%228 = OpIAdd %5 %227 %145
%223 = OpAccessChain %222 %36 %228
%229 = OpLoad %33 %223
%231 = OpSampledImage %230 %221 %229
%236 = OpCompositeConstruct %235 %232 %232
%234 = OpImageSampleExplicitLod %26 %231 %236 Lod %233
%237 = OpCompositeExtract %17 %234 0
%238 = OpCompositeExtract %17 %234 1
%239 = OpCompositeExtract %17 %234 2
%240 = OpCompositeExtract %17 %234 3
%241 = OpFAdd %17 %211 %237
%242 = OpFAdd %17 %212 %238
%243 = OpFAdd %17 %213 %239
%244 = OpFAdd %17 %214 %240
%245 = OpBitwiseXor %5 %215 %57
%247 = OpAccessChain %62 %8 %45
%248 = OpLoad %5 %247
%249 = OpIAdd %5 %248 %215
%246 = OpAccessChain %60 %21 %249
%250 = OpLoad %18 %246
%252 = OpAccessChain %48 %16 %225 %45
%253 = OpLoad %5 %252
%254 = OpShiftRightLogical %5 %253 %9
%255 = OpIAdd %5 %254 %256
%257 = OpIAdd %5 %255 %245
%251 = OpAccessChain %222 %36 %257
%258 = OpLoad %33 %251
%259 = OpSampledImage %230 %250 %258
%261 = OpCompositeConstruct %235 %232 %232
%260 = OpImageSampleExplicitLod %26 %259 %261 Lod %233
%262 = OpCompositeExtract %17 %260 0
%263 = OpCompositeExtract %17 %260 1
%264 = OpCompositeExtract %17 %260 2
%265 = OpCompositeExtract %17 %260 3
%266 = OpFAdd %17 %241 %262
%267 = OpFAdd %17 %242 %263
%268 = OpFAdd %17 %243 %264
%269 = OpFAdd %17 %244 %265
%270 = OpAccessChain %40 %16 %162
%271 = OpLoad %13 %270
%272 = OpIMul %5 %215 %192
%273 = OpIAdd %5 %272 %45
%274 = OpCompositeExtract %5 %271 0
%275 = OpCompositeExtract %5 %271 1
%276 = OpIAddCarry %195 %274 %273
%277 = OpCompositeExtract %5 %276 0
%278 = OpCompositeExtract %5 %276 1
%279 = OpIAdd %5 %275 %278
%280 = OpCompositeConstruct %13 %277 %279
%281 = OpBitcast %202 %280
%282 = OpAccessChain %204 %281 %45
%283 = OpLoad %26 %282 Aligned 4
%284 = OpCompositeExtract %17 %283 0
%285 = OpCompositeExtract %17 %283 1
%286 = OpCompositeExtract %17 %283 2
%287 = OpCompositeExtract %17 %283 3
%288 = OpFAdd %17 %266 %284
%289 = OpFAdd %17 %267 %285
%290 = OpFAdd %17 %268 %286
%291 = OpFAdd %17 %269 %287
%292 = OpShiftLeftLogical %5 %215 %162
%293 = OpAccessChain %40 %16 %179
%294 = OpLoad %13 %293
%297 = OpCompositeExtract %5 %294 0
%298 = OpCompositeExtract %5 %294 1
%299 = OpIAddCarry %195 %297 %292
%300 = OpCompositeExtract %5 %299 0
%301 = OpCompositeExtract %5 %299 1
%302 = OpIAdd %5 %298 %301
%303 = OpCompositeConstruct %13 %300 %302
%304 = OpBitcast %296 %303
%306 = OpAccessChain %305 %304 %45
%307 = OpLoad %5 %306 Aligned 4
%308 = OpBitcast %17 %307
%309 = OpFAdd %17 %288 %308
%310 = OpFAdd %17 %289 %308
%311 = OpFAdd %17 %290 %308
%312 = OpFAdd %17 %291 %308
%313 = OpShiftLeftLogical %5 %215 %165
%316 = OpCompositeExtract %5 %294 0
%317 = OpCompositeExtract %5 %294 1
%318 = OpIAddCarry %195 %316 %313
%319 = OpCompositeExtract %5 %318 0
%320 = OpCompositeExtract %5 %318 1
%321 = OpIAdd %5 %317 %320
%322 = OpCompositeConstruct %13 %319 %321
%323 = OpBitcast %315 %322
%325 = OpAccessChain %324 %323 %45
%326 = OpLoad %13 %325 Aligned 4
%327 = OpCompositeExtract %5 %326 0
%328 = OpCompositeExtract %5 %326 1
%329 = OpBitcast %17 %327
%330 = OpBitcast %17 %328
%331 = OpFAdd %17 %309 %329
%332 = OpFAdd %17 %310 %330
%333 = OpFAdd %17 %311 %329
%334 = OpFAdd %17 %312 %330
%335 = OpIMul %5 %215 %54
%339 = OpCompositeExtract %5 %294 0
%340 = OpCompositeExtract %5 %294 1
%341 = OpIAddCarry %195 %339 %335
%342 = OpCompositeExtract %5 %341 0
%343 = OpCompositeExtract %5 %341 1
%344 = OpIAdd %5 %340 %343
%345 = OpCompositeConstruct %13 %342 %344
%346 = OpBitcast %338 %345
%348 = OpAccessChain %347 %346 %45
%349 = OpLoad %336 %348 Aligned 4
%350 = OpCompositeExtract %5 %349 0
%351 = OpCompositeExtract %5 %349 1
%352 = OpCompositeExtract %5 %349 2
%353 = OpBitcast %17 %350
%354 = OpBitcast %17 %351
%355 = OpBitcast %17 %352
%356 = OpFAdd %17 %331 %353
%357 = OpFAdd %17 %332 %354
%358 = OpFAdd %17 %333 %355
%359 = OpFAdd %17 %334 %355
%360 = OpLoad %5 %56
%361 = OpShiftLeftLogical %5 %360 %179
%364 = OpCompositeExtract %5 %294 0
%365 = OpCompositeExtract %5 %294 1
%366 = OpIAddCarry %195 %364 %361
%367 = OpCompositeExtract %5 %366 0
%368 = OpCompositeExtract %5 %366 1
%369 = OpIAdd %5 %365 %368
%370 = OpCompositeConstruct %13 %367 %369
%371 = OpBitcast %363 %370
%373 = OpAccessChain %372 %371 %45
%374 = OpLoad %167 %373 Aligned 4
%375 = OpCompositeExtract %5 %374 0
%376 = OpCompositeExtract %5 %374 1
%377 = OpCompositeExtract %5 %374 2
%378 = OpCompositeExtract %5 %374 3
%379 = OpBitcast %17 %375
%380 = OpBitcast %17 %376
%381 = OpBitcast %17 %377
%382 = OpBitcast %17 %378
%383 = OpFAdd %17 %356 %379
%384 = OpFAdd %17 %357 %380
%385 = OpFAdd %17 %358 %381
%386 = OpFAdd %17 %359 %382
%387 = OpAccessChain %40 %16 %165
%388 = OpLoad %13 %387
%391 = OpIMul %5 %360 %179
%392 = OpIAdd %5 %391 %45
%393 = OpCompositeExtract %5 %388 0
%394 = OpCompositeExtract %5 %388 1
%395 = OpIAddCarry %195 %393 %392
%396 = OpCompositeExtract %5 %395 0
%397 = OpCompositeExtract %5 %395 1
%398 = OpIAdd %5 %394 %397
%399 = OpCompositeConstruct %13 %396 %398
%400 = OpBitcast %390 %399
%402 = OpAccessChain %401 %400 %45
%403 = OpLoad %17 %402 Aligned 4
%404 = OpFAdd %17 %383 %403
%405 = OpFAdd %17 %384 %403
%406 = OpFAdd %17 %385 %403
%407 = OpFAdd %17 %386 %403
%408 = OpShiftLeftLogical %5 %360 %162
%409 = OpAccessChain %40 %16 %9
%410 = OpLoad %13 %409
%413 = OpCompositeExtract %5 %410 0
%414 = OpCompositeExtract %5 %410 1
%415 = OpIAddCarry %195 %413 %408
%416 = OpCompositeExtract %5 %415 0
%417 = OpCompositeExtract %5 %415 1
%418 = OpIAdd %5 %414 %417
%419 = OpCompositeConstruct %13 %416 %418
%420 = OpBitcast %412 %419
%421 = OpAccessChain %305 %420 %45
%422 = OpLoad %5 %421 Aligned 4
%423 = OpBitcast %17 %422
%424 = OpFAdd %17 %404 %423
%425 = OpFAdd %17 %405 %423
%426 = OpFAdd %17 %406 %423
%427 = OpFAdd %17 %407 %423
%428 = OpCompositeInsert %26 %424 %429 0
%430 = OpCompositeInsert %26 %425 %428 1
%431 = OpCompositeInsert %26 %426 %430 2
%432 = OpCompositeInsert %26 %427 %431 3
OpStore %74 %432
%433 = OpIMul %5 %360 %179
%434 = OpIAdd %5 %433 %45
%435 = OpCompositeExtract %5 %388 0
%436 = OpCompositeExtract %5 %388 1
%437 = OpIAddCarry %195 %435 %434
%438 = OpCompositeExtract %5 %437 0
%439 = OpCompositeExtract %5 %437 1
%440 = OpIAdd %5 %436 %439
%441 = OpCompositeConstruct %13 %438 %440
%442 = OpBitcast %390 %441
%443 = OpAccessChain %401 %442 %45
OpStore %443 %424 Aligned 4
%445 = OpAccessChain %40 %16 %9
%446 = OpLoad %13 %445
%447 = OpCompositeExtract %5 %446 0
%448 = OpCompositeExtract %5 %446 1
%449 = OpIAddCarry %195 %447 %408
%450 = OpCompositeExtract %5 %449 0
%451 = OpCompositeExtract %5 %449 1
%452 = OpIAdd %5 %448 %451
%453 = OpCompositeConstruct %13 %450 %452
%454 = OpBitcast %390 %453
%455 = OpAccessChain %401 %454 %45
OpStore %455 %425 Aligned 4
OpReturn
OpFunctionEnd
#endif
