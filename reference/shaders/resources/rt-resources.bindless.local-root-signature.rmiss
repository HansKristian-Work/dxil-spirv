#version 460
#extension GL_ARB_gpu_shader_int64 : require
#extension GL_NV_ray_tracing : require
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

struct _34
{
    vec4 _m0;
    uint _m1;
};

layout(buffer_reference) buffer vec4Pointer
{
    vec4 value;
};

layout(shaderRecordNV, std430) buffer SBTBlock
{
    uint _m0[5];
    uint _m1[6];
    uint64_t _m2;
    uint64_t _m3;
    uint64_t _m4;
    uvec2 _m5;
    uvec2 _m6;
    uvec2 _m7;
    uvec2 _m8;
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
layout(location = 0) rayPayloadInNV _34 payload;

vec4 _204;

void main()
{
    uint _51 = (SBT._m7.x >> 6u) + 12u;
    vec4 _67 = texelFetch(_22[nonuniformEXT(registers._m0 + (payload._m1 & 1u))], ivec2(uvec2(0u)), int(0u));
    vec4 _80 = texelFetch(_22[nonuniformEXT(registers._m0 + payload._m1)], ivec2(uvec2(0u)), int(0u));
    vec4 _98 = texelFetch(_22[nonuniformEXT(((SBT._m5.x >> 6u) + 17u) + payload._m1)], ivec2(uvec2(0u)), int(0u));
    vec4 _117 = imageLoad(_26[nonuniformEXT(((SBT._m6.x >> 6u) + 18u) + payload._m1)], ivec2(uvec2(0u)));
    uint _144 = ((SBT._m7.x >> 6u) + 13u) + payload._m1;
    vec4 _167 = uintBitsToFloat(uvec4(SBT._m0[0u], SBT._m0[1u], SBT._m0[2u], SBT._m0[3u]));
    vec4 _179 = uintBitsToFloat(uvec4(SBT._m0[4u], 0u, 0u, 0u));
    vec4Pointer _193 = vec4Pointer(SBT._m4 + uint64_t(1u * 16u));
    vec4 _203 = _204;
    _203.x = (((((((_67.x + _80.x) + _98.x) + _117.x) + _33[nonuniformEXT(_51)]._m0[0u].x) + _33[nonuniformEXT(_144)]._m0[0u].x) + _167.x) + _179.x) + _193.value.x;
    vec4 _205 = _203;
    _205.y = (((((((_67.y + _80.y) + _98.y) + _117.y) + _33[nonuniformEXT(_51)]._m0[0u].y) + _33[nonuniformEXT(_144)]._m0[0u].y) + _167.y) + _179.y) + _193.value.y;
    vec4 _206 = _205;
    _206.z = (((((((_67.z + _80.z) + _98.z) + _117.z) + _33[nonuniformEXT(_51)]._m0[0u].z) + _33[nonuniformEXT(_144)]._m0[0u].z) + _167.z) + _179.z) + _193.value.z;
    vec4 _207 = _206;
    _207.w = (((((((_67.w + _80.w) + _98.w) + _117.w) + _33[nonuniformEXT(_51)]._m0[0u].w) + _33[nonuniformEXT(_144)]._m0[0u].w) + _167.w) + _179.w) + _193.value.w;
    payload._m0 = _207;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 210
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
OpName %34 ""
OpName %36 "payload"
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
OpDecorate %36 Location 0
OpDecorate %45 NonUniform
OpDecorate %57 NonUniform
OpDecorate %64 NonUniform
OpDecorate %56 NonUniform
OpDecorate %79 NonUniform
OpDecorate %56 NonUniform
OpDecorate %97 NonUniform
OpDecorate %56 NonUniform
OpDecorate %116 NonUniform
OpDecorate %128 NonUniform
OpDecorate %138 NonUniform
OpDecorate %145 NonUniform
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
%15 = OpTypeStruct %10 %12 %13 %13 %13 %14 %14 %14 %14
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
%34 = OpTypeStruct %27 %5
%35 = OpTypePointer IncomingRayPayloadNV %34
%36 = OpVariable %35 IncomingRayPayloadNV
%37 = OpTypePointer ShaderRecordBufferNV %13
%39 = OpConstant %5 4
%41 = OpTypePointer ShaderRecordBufferNV %10
%43 = OpConstant %5 0
%44 = OpTypePointer Uniform %30
%46 = OpTypePointer ShaderRecordBufferNV %5
%48 = OpConstant %5 7
%52 = OpConstant %5 12
%53 = OpTypePointer IncomingRayPayloadNV %5
%55 = OpConstant %5 1
%58 = OpTypePointer UniformConstant %19
%60 = OpTypePointer PushConstant %5
%65 = OpTypeInt 32 1
%66 = OpConstant %65 0
%73 = OpTypePointer IncomingRayPayloadNV %27
%95 = OpConstant %5 17
%108 = OpTypePointer UniformConstant %23
%114 = OpConstant %5 18
%127 = OpTypePointer Uniform %27
%143 = OpConstant %5 13
%160 = OpConstant %5 2
%163 = OpConstant %5 3
%165 = OpTypeVector %5 4
%189 = OpConstant %5 16
%192 = OpTypePointer PhysicalStorageBuffer %27
%3 = OpFunction %1 None %2
%4 = OpLabel
%204 = OpUndef %27
OpBranch %208
%208 = OpLabel
%38 = OpAccessChain %37 %17 %39
%40 = OpLoad %13 %38
%42 = OpAccessChain %41 %17 %43
%47 = OpAccessChain %46 %17 %48 %43
%49 = OpLoad %5 %47
%50 = OpShiftRightLogical %5 %49 %11
%51 = OpIAdd %5 %50 %52
%45 = OpAccessChain %44 %33 %51
%54 = OpInBoundsAccessChain %53 %36 %55
%56 = OpLoad %5 %54
%57 = OpBitwiseAnd %5 %56 %55
%61 = OpAccessChain %60 %8 %43
%62 = OpLoad %5 %61
%63 = OpIAdd %5 %62 %57
%59 = OpAccessChain %58 %22 %63
%64 = OpLoad %19 %59
%68 = OpCompositeConstruct %14 %43 %43
%67 = OpImageFetch %27 %64 %68 Lod %43
%69 = OpCompositeExtract %18 %67 0
%70 = OpCompositeExtract %18 %67 1
%71 = OpCompositeExtract %18 %67 2
%72 = OpCompositeExtract %18 %67 3
%74 = OpInBoundsAccessChain %73 %36 %43
%76 = OpAccessChain %60 %8 %43
%77 = OpLoad %5 %76
%78 = OpIAdd %5 %77 %56
%75 = OpAccessChain %58 %22 %78
%79 = OpLoad %19 %75
%81 = OpCompositeConstruct %14 %43 %43
%80 = OpImageFetch %27 %79 %81 Lod %43
%82 = OpCompositeExtract %18 %80 0
%83 = OpCompositeExtract %18 %80 1
%84 = OpCompositeExtract %18 %80 2
%85 = OpCompositeExtract %18 %80 3
%86 = OpFAdd %18 %69 %82
%87 = OpFAdd %18 %70 %83
%88 = OpFAdd %18 %71 %84
%89 = OpFAdd %18 %72 %85
%91 = OpAccessChain %46 %17 %9 %43
%92 = OpLoad %5 %91
%93 = OpShiftRightLogical %5 %92 %11
%94 = OpIAdd %5 %93 %95
%96 = OpIAdd %5 %94 %56
%90 = OpAccessChain %58 %22 %96
%97 = OpLoad %19 %90
%99 = OpCompositeConstruct %14 %43 %43
%98 = OpImageFetch %27 %97 %99 Lod %43
%100 = OpCompositeExtract %18 %98 0
%101 = OpCompositeExtract %18 %98 1
%102 = OpCompositeExtract %18 %98 2
%103 = OpCompositeExtract %18 %98 3
%104 = OpFAdd %18 %86 %100
%105 = OpFAdd %18 %87 %101
%106 = OpFAdd %18 %88 %102
%107 = OpFAdd %18 %89 %103
%110 = OpAccessChain %46 %17 %11 %43
%111 = OpLoad %5 %110
%112 = OpShiftRightLogical %5 %111 %11
%113 = OpIAdd %5 %112 %114
%115 = OpIAdd %5 %113 %56
%109 = OpAccessChain %108 %26 %115
%116 = OpLoad %23 %109
%118 = OpCompositeConstruct %14 %43 %43
%117 = OpImageRead %27 %116 %118 None
%119 = OpCompositeExtract %18 %117 0
%120 = OpCompositeExtract %18 %117 1
%121 = OpCompositeExtract %18 %117 2
%122 = OpCompositeExtract %18 %117 3
%123 = OpFAdd %18 %104 %119
%124 = OpFAdd %18 %105 %120
%125 = OpFAdd %18 %106 %121
%126 = OpFAdd %18 %107 %122
%128 = OpAccessChain %127 %45 %43 %43
%129 = OpLoad %27 %128
%130 = OpCompositeExtract %18 %129 0
%131 = OpCompositeExtract %18 %129 1
%132 = OpCompositeExtract %18 %129 2
%133 = OpCompositeExtract %18 %129 3
%134 = OpFAdd %18 %123 %130
%135 = OpFAdd %18 %124 %131
%136 = OpFAdd %18 %125 %132
%137 = OpFAdd %18 %126 %133
%139 = OpAccessChain %46 %17 %48 %43
%140 = OpLoad %5 %139
%141 = OpShiftRightLogical %5 %140 %11
%142 = OpIAdd %5 %141 %143
%144 = OpIAdd %5 %142 %56
%138 = OpAccessChain %44 %33 %144
%145 = OpAccessChain %127 %138 %43 %43
%146 = OpLoad %27 %145
%147 = OpCompositeExtract %18 %146 0
%148 = OpCompositeExtract %18 %146 1
%149 = OpCompositeExtract %18 %146 2
%150 = OpCompositeExtract %18 %146 3
%151 = OpFAdd %18 %134 %147
%152 = OpFAdd %18 %135 %148
%153 = OpFAdd %18 %136 %149
%154 = OpFAdd %18 %137 %150
%155 = OpAccessChain %46 %42 %43
%156 = OpLoad %5 %155
%157 = OpAccessChain %46 %42 %55
%158 = OpLoad %5 %157
%159 = OpAccessChain %46 %42 %160
%161 = OpLoad %5 %159
%162 = OpAccessChain %46 %42 %163
%164 = OpLoad %5 %162
%166 = OpCompositeConstruct %165 %156 %158 %161 %164
%167 = OpBitcast %27 %166
%168 = OpCompositeExtract %18 %167 0
%169 = OpCompositeExtract %18 %167 1
%170 = OpCompositeExtract %18 %167 2
%171 = OpCompositeExtract %18 %167 3
%172 = OpFAdd %18 %151 %168
%173 = OpFAdd %18 %152 %169
%174 = OpFAdd %18 %153 %170
%175 = OpFAdd %18 %154 %171
%176 = OpAccessChain %46 %42 %39
%177 = OpLoad %5 %176
%178 = OpCompositeConstruct %165 %177 %43 %43 %43
%179 = OpBitcast %27 %178
%180 = OpCompositeExtract %18 %179 0
%181 = OpCompositeExtract %18 %179 1
%182 = OpCompositeExtract %18 %179 2
%183 = OpCompositeExtract %18 %179 3
%184 = OpFAdd %18 %172 %180
%185 = OpFAdd %18 %173 %181
%186 = OpFAdd %18 %174 %182
%187 = OpFAdd %18 %175 %183
%188 = OpIMul %5 %55 %189
%190 = OpUConvert %13 %188
%191 = OpIAdd %13 %40 %190
%193 = OpBitcast %192 %191
%194 = OpLoad %27 %193 Aligned 16
%195 = OpCompositeExtract %18 %194 0
%196 = OpCompositeExtract %18 %194 1
%197 = OpCompositeExtract %18 %194 2
%198 = OpCompositeExtract %18 %194 3
%199 = OpFAdd %18 %184 %195
%200 = OpFAdd %18 %185 %196
%201 = OpFAdd %18 %186 %197
%202 = OpFAdd %18 %187 %198
%203 = OpCompositeInsert %27 %199 %204 0
%205 = OpCompositeInsert %27 %200 %203 1
%206 = OpCompositeInsert %27 %201 %205 2
%207 = OpCompositeInsert %27 %202 %206 3
OpStore %74 %207
OpReturn
OpFunctionEnd
#endif
