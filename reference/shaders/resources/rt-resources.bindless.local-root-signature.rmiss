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

vec4 _150;

void main()
{
    uint _45 = (SBT._m7.x >> 6u) + 12u;
    vec4 _61 = texelFetch(_22[nonuniformEXT(registers._m0 + (payload._m1 & 1u))], ivec2(uvec2(0u)), int(0u));
    vec4 _74 = texelFetch(_22[nonuniformEXT(registers._m0 + payload._m1)], ivec2(uvec2(0u)), int(0u));
    vec4 _92 = texelFetch(_22[nonuniformEXT(((SBT._m5.x >> 6u) + 17u) + payload._m1)], ivec2(uvec2(0u)), int(0u));
    vec4 _111 = imageLoad(_26[nonuniformEXT(((SBT._m6.x >> 6u) + 18u) + payload._m1)], ivec2(uvec2(0u)));
    uint _138 = ((SBT._m7.x >> 6u) + 13u) + payload._m1;
    vec4 _149 = _150;
    _149.x = ((((_61.x + _74.x) + _92.x) + _111.x) + _33[nonuniformEXT(_45)]._m0[0u].x) + _33[nonuniformEXT(_138)]._m0[0u].x;
    vec4 _151 = _149;
    _151.y = ((((_61.y + _74.y) + _92.y) + _111.y) + _33[nonuniformEXT(_45)]._m0[0u].y) + _33[nonuniformEXT(_138)]._m0[0u].y;
    vec4 _152 = _151;
    _152.z = ((((_61.z + _74.z) + _92.z) + _111.z) + _33[nonuniformEXT(_45)]._m0[0u].z) + _33[nonuniformEXT(_138)]._m0[0u].z;
    vec4 _153 = _152;
    _153.w = ((((_61.w + _74.w) + _92.w) + _111.w) + _33[nonuniformEXT(_45)]._m0[0u].w) + _33[nonuniformEXT(_138)]._m0[0u].w;
    payload._m0 = _153;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 156
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
OpDecorate %38 NonUniform
OpDecorate %51 NonUniform
OpDecorate %58 NonUniform
OpDecorate %50 NonUniform
OpDecorate %73 NonUniform
OpDecorate %50 NonUniform
OpDecorate %91 NonUniform
OpDecorate %50 NonUniform
OpDecorate %110 NonUniform
OpDecorate %122 NonUniform
OpDecorate %132 NonUniform
OpDecorate %139 NonUniform
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
%37 = OpTypePointer Uniform %30
%39 = OpTypePointer ShaderRecordBufferNV %5
%41 = OpConstant %5 7
%42 = OpConstant %5 0
%46 = OpConstant %5 12
%47 = OpTypePointer IncomingRayPayloadNV %5
%49 = OpConstant %5 1
%52 = OpTypePointer UniformConstant %19
%54 = OpTypePointer PushConstant %5
%59 = OpTypeInt 32 1
%60 = OpConstant %59 0
%67 = OpTypePointer IncomingRayPayloadNV %27
%89 = OpConstant %5 17
%102 = OpTypePointer UniformConstant %23
%108 = OpConstant %5 18
%121 = OpTypePointer Uniform %27
%137 = OpConstant %5 13
%3 = OpFunction %1 None %2
%4 = OpLabel
%150 = OpUndef %27
OpBranch %154
%154 = OpLabel
%40 = OpAccessChain %39 %17 %41 %42
%43 = OpLoad %5 %40
%44 = OpShiftRightLogical %5 %43 %11
%45 = OpIAdd %5 %44 %46
%38 = OpAccessChain %37 %33 %45
%48 = OpInBoundsAccessChain %47 %36 %49
%50 = OpLoad %5 %48
%51 = OpBitwiseAnd %5 %50 %49
%55 = OpAccessChain %54 %8 %42
%56 = OpLoad %5 %55
%57 = OpIAdd %5 %56 %51
%53 = OpAccessChain %52 %22 %57
%58 = OpLoad %19 %53
%62 = OpCompositeConstruct %14 %42 %42
%61 = OpImageFetch %27 %58 %62 Lod %42
%63 = OpCompositeExtract %18 %61 0
%64 = OpCompositeExtract %18 %61 1
%65 = OpCompositeExtract %18 %61 2
%66 = OpCompositeExtract %18 %61 3
%68 = OpInBoundsAccessChain %67 %36 %42
%70 = OpAccessChain %54 %8 %42
%71 = OpLoad %5 %70
%72 = OpIAdd %5 %71 %50
%69 = OpAccessChain %52 %22 %72
%73 = OpLoad %19 %69
%75 = OpCompositeConstruct %14 %42 %42
%74 = OpImageFetch %27 %73 %75 Lod %42
%76 = OpCompositeExtract %18 %74 0
%77 = OpCompositeExtract %18 %74 1
%78 = OpCompositeExtract %18 %74 2
%79 = OpCompositeExtract %18 %74 3
%80 = OpFAdd %18 %63 %76
%81 = OpFAdd %18 %64 %77
%82 = OpFAdd %18 %65 %78
%83 = OpFAdd %18 %66 %79
%85 = OpAccessChain %39 %17 %9 %42
%86 = OpLoad %5 %85
%87 = OpShiftRightLogical %5 %86 %11
%88 = OpIAdd %5 %87 %89
%90 = OpIAdd %5 %88 %50
%84 = OpAccessChain %52 %22 %90
%91 = OpLoad %19 %84
%93 = OpCompositeConstruct %14 %42 %42
%92 = OpImageFetch %27 %91 %93 Lod %42
%94 = OpCompositeExtract %18 %92 0
%95 = OpCompositeExtract %18 %92 1
%96 = OpCompositeExtract %18 %92 2
%97 = OpCompositeExtract %18 %92 3
%98 = OpFAdd %18 %80 %94
%99 = OpFAdd %18 %81 %95
%100 = OpFAdd %18 %82 %96
%101 = OpFAdd %18 %83 %97
%104 = OpAccessChain %39 %17 %11 %42
%105 = OpLoad %5 %104
%106 = OpShiftRightLogical %5 %105 %11
%107 = OpIAdd %5 %106 %108
%109 = OpIAdd %5 %107 %50
%103 = OpAccessChain %102 %26 %109
%110 = OpLoad %23 %103
%112 = OpCompositeConstruct %14 %42 %42
%111 = OpImageRead %27 %110 %112 None
%113 = OpCompositeExtract %18 %111 0
%114 = OpCompositeExtract %18 %111 1
%115 = OpCompositeExtract %18 %111 2
%116 = OpCompositeExtract %18 %111 3
%117 = OpFAdd %18 %98 %113
%118 = OpFAdd %18 %99 %114
%119 = OpFAdd %18 %100 %115
%120 = OpFAdd %18 %101 %116
%122 = OpAccessChain %121 %38 %42 %42
%123 = OpLoad %27 %122
%124 = OpCompositeExtract %18 %123 0
%125 = OpCompositeExtract %18 %123 1
%126 = OpCompositeExtract %18 %123 2
%127 = OpCompositeExtract %18 %123 3
%128 = OpFAdd %18 %117 %124
%129 = OpFAdd %18 %118 %125
%130 = OpFAdd %18 %119 %126
%131 = OpFAdd %18 %120 %127
%133 = OpAccessChain %39 %17 %41 %42
%134 = OpLoad %5 %133
%135 = OpShiftRightLogical %5 %134 %11
%136 = OpIAdd %5 %135 %137
%138 = OpIAdd %5 %136 %50
%132 = OpAccessChain %37 %33 %138
%139 = OpAccessChain %121 %132 %42 %42
%140 = OpLoad %27 %139
%141 = OpCompositeExtract %18 %140 0
%142 = OpCompositeExtract %18 %140 1
%143 = OpCompositeExtract %18 %140 2
%144 = OpCompositeExtract %18 %140 3
%145 = OpFAdd %18 %128 %141
%146 = OpFAdd %18 %129 %142
%147 = OpFAdd %18 %130 %143
%148 = OpFAdd %18 %131 %144
%149 = OpCompositeInsert %27 %145 %150 0
%151 = OpCompositeInsert %27 %146 %149 1
%152 = OpCompositeInsert %27 %147 %151 2
%153 = OpCompositeInsert %27 %148 %152 3
OpStore %68 %153
OpReturn
OpFunctionEnd
#endif
