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

vec4 _186;

void main()
{
    uint _47 = (SBT._m7.x >> 6u) + 12u;
    vec4 _63 = texelFetch(_22[nonuniformEXT(registers._m0 + (payload._m1 & 1u))], ivec2(uvec2(0u)), int(0u));
    vec4 _76 = texelFetch(_22[nonuniformEXT(registers._m0 + payload._m1)], ivec2(uvec2(0u)), int(0u));
    vec4 _94 = texelFetch(_22[nonuniformEXT(((SBT._m5.x >> 6u) + 17u) + payload._m1)], ivec2(uvec2(0u)), int(0u));
    vec4 _113 = imageLoad(_26[nonuniformEXT(((SBT._m6.x >> 6u) + 18u) + payload._m1)], ivec2(uvec2(0u)));
    uint _140 = ((SBT._m7.x >> 6u) + 13u) + payload._m1;
    vec4 _163 = uintBitsToFloat(uvec4(SBT._m0[0u], SBT._m0[1u], SBT._m0[2u], SBT._m0[3u]));
    vec4 _176 = uintBitsToFloat(uvec4(SBT._m0[4u], 0u, 0u, 0u));
    vec4 _185 = _186;
    _185.x = ((((((_63.x + _76.x) + _94.x) + _113.x) + _33[nonuniformEXT(_47)]._m0[0u].x) + _33[nonuniformEXT(_140)]._m0[0u].x) + _163.x) + _176.x;
    vec4 _187 = _185;
    _187.y = ((((((_63.y + _76.y) + _94.y) + _113.y) + _33[nonuniformEXT(_47)]._m0[0u].y) + _33[nonuniformEXT(_140)]._m0[0u].y) + _163.y) + _176.y;
    vec4 _188 = _187;
    _188.z = ((((((_63.z + _76.z) + _94.z) + _113.z) + _33[nonuniformEXT(_47)]._m0[0u].z) + _33[nonuniformEXT(_140)]._m0[0u].z) + _163.z) + _176.z;
    vec4 _189 = _188;
    _189.w = ((((((_63.w + _76.w) + _94.w) + _113.w) + _33[nonuniformEXT(_47)]._m0[0u].w) + _33[nonuniformEXT(_140)]._m0[0u].w) + _163.w) + _176.w;
    payload._m0 = _189;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 192
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
OpDecorate %41 NonUniform
OpDecorate %53 NonUniform
OpDecorate %60 NonUniform
OpDecorate %52 NonUniform
OpDecorate %75 NonUniform
OpDecorate %52 NonUniform
OpDecorate %93 NonUniform
OpDecorate %52 NonUniform
OpDecorate %112 NonUniform
OpDecorate %124 NonUniform
OpDecorate %134 NonUniform
OpDecorate %141 NonUniform
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
%37 = OpTypePointer ShaderRecordBufferNV %10
%39 = OpConstant %5 0
%40 = OpTypePointer Uniform %30
%42 = OpTypePointer ShaderRecordBufferNV %5
%44 = OpConstant %5 7
%48 = OpConstant %5 12
%49 = OpTypePointer IncomingRayPayloadNV %5
%51 = OpConstant %5 1
%54 = OpTypePointer UniformConstant %19
%56 = OpTypePointer PushConstant %5
%61 = OpTypeInt 32 1
%62 = OpConstant %61 0
%69 = OpTypePointer IncomingRayPayloadNV %27
%91 = OpConstant %5 17
%104 = OpTypePointer UniformConstant %23
%110 = OpConstant %5 18
%123 = OpTypePointer Uniform %27
%139 = OpConstant %5 13
%156 = OpConstant %5 2
%159 = OpConstant %5 3
%161 = OpTypeVector %5 4
%173 = OpConstant %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
%186 = OpUndef %27
OpBranch %190
%190 = OpLabel
%38 = OpAccessChain %37 %17 %39
%43 = OpAccessChain %42 %17 %44 %39
%45 = OpLoad %5 %43
%46 = OpShiftRightLogical %5 %45 %11
%47 = OpIAdd %5 %46 %48
%41 = OpAccessChain %40 %33 %47
%50 = OpInBoundsAccessChain %49 %36 %51
%52 = OpLoad %5 %50
%53 = OpBitwiseAnd %5 %52 %51
%57 = OpAccessChain %56 %8 %39
%58 = OpLoad %5 %57
%59 = OpIAdd %5 %58 %53
%55 = OpAccessChain %54 %22 %59
%60 = OpLoad %19 %55
%64 = OpCompositeConstruct %14 %39 %39
%63 = OpImageFetch %27 %60 %64 Lod %39
%65 = OpCompositeExtract %18 %63 0
%66 = OpCompositeExtract %18 %63 1
%67 = OpCompositeExtract %18 %63 2
%68 = OpCompositeExtract %18 %63 3
%70 = OpInBoundsAccessChain %69 %36 %39
%72 = OpAccessChain %56 %8 %39
%73 = OpLoad %5 %72
%74 = OpIAdd %5 %73 %52
%71 = OpAccessChain %54 %22 %74
%75 = OpLoad %19 %71
%77 = OpCompositeConstruct %14 %39 %39
%76 = OpImageFetch %27 %75 %77 Lod %39
%78 = OpCompositeExtract %18 %76 0
%79 = OpCompositeExtract %18 %76 1
%80 = OpCompositeExtract %18 %76 2
%81 = OpCompositeExtract %18 %76 3
%82 = OpFAdd %18 %65 %78
%83 = OpFAdd %18 %66 %79
%84 = OpFAdd %18 %67 %80
%85 = OpFAdd %18 %68 %81
%87 = OpAccessChain %42 %17 %9 %39
%88 = OpLoad %5 %87
%89 = OpShiftRightLogical %5 %88 %11
%90 = OpIAdd %5 %89 %91
%92 = OpIAdd %5 %90 %52
%86 = OpAccessChain %54 %22 %92
%93 = OpLoad %19 %86
%95 = OpCompositeConstruct %14 %39 %39
%94 = OpImageFetch %27 %93 %95 Lod %39
%96 = OpCompositeExtract %18 %94 0
%97 = OpCompositeExtract %18 %94 1
%98 = OpCompositeExtract %18 %94 2
%99 = OpCompositeExtract %18 %94 3
%100 = OpFAdd %18 %82 %96
%101 = OpFAdd %18 %83 %97
%102 = OpFAdd %18 %84 %98
%103 = OpFAdd %18 %85 %99
%106 = OpAccessChain %42 %17 %11 %39
%107 = OpLoad %5 %106
%108 = OpShiftRightLogical %5 %107 %11
%109 = OpIAdd %5 %108 %110
%111 = OpIAdd %5 %109 %52
%105 = OpAccessChain %104 %26 %111
%112 = OpLoad %23 %105
%114 = OpCompositeConstruct %14 %39 %39
%113 = OpImageRead %27 %112 %114 None
%115 = OpCompositeExtract %18 %113 0
%116 = OpCompositeExtract %18 %113 1
%117 = OpCompositeExtract %18 %113 2
%118 = OpCompositeExtract %18 %113 3
%119 = OpFAdd %18 %100 %115
%120 = OpFAdd %18 %101 %116
%121 = OpFAdd %18 %102 %117
%122 = OpFAdd %18 %103 %118
%124 = OpAccessChain %123 %41 %39 %39
%125 = OpLoad %27 %124
%126 = OpCompositeExtract %18 %125 0
%127 = OpCompositeExtract %18 %125 1
%128 = OpCompositeExtract %18 %125 2
%129 = OpCompositeExtract %18 %125 3
%130 = OpFAdd %18 %119 %126
%131 = OpFAdd %18 %120 %127
%132 = OpFAdd %18 %121 %128
%133 = OpFAdd %18 %122 %129
%135 = OpAccessChain %42 %17 %44 %39
%136 = OpLoad %5 %135
%137 = OpShiftRightLogical %5 %136 %11
%138 = OpIAdd %5 %137 %139
%140 = OpIAdd %5 %138 %52
%134 = OpAccessChain %40 %33 %140
%141 = OpAccessChain %123 %134 %39 %39
%142 = OpLoad %27 %141
%143 = OpCompositeExtract %18 %142 0
%144 = OpCompositeExtract %18 %142 1
%145 = OpCompositeExtract %18 %142 2
%146 = OpCompositeExtract %18 %142 3
%147 = OpFAdd %18 %130 %143
%148 = OpFAdd %18 %131 %144
%149 = OpFAdd %18 %132 %145
%150 = OpFAdd %18 %133 %146
%151 = OpAccessChain %42 %38 %39
%152 = OpLoad %5 %151
%153 = OpAccessChain %42 %38 %51
%154 = OpLoad %5 %153
%155 = OpAccessChain %42 %38 %156
%157 = OpLoad %5 %155
%158 = OpAccessChain %42 %38 %159
%160 = OpLoad %5 %158
%162 = OpCompositeConstruct %161 %152 %154 %157 %160
%163 = OpBitcast %27 %162
%164 = OpCompositeExtract %18 %163 0
%165 = OpCompositeExtract %18 %163 1
%166 = OpCompositeExtract %18 %163 2
%167 = OpCompositeExtract %18 %163 3
%168 = OpFAdd %18 %147 %164
%169 = OpFAdd %18 %148 %165
%170 = OpFAdd %18 %149 %166
%171 = OpFAdd %18 %150 %167
%172 = OpAccessChain %42 %38 %173
%174 = OpLoad %5 %172
%175 = OpCompositeConstruct %161 %174 %39 %39 %39
%176 = OpBitcast %27 %175
%177 = OpCompositeExtract %18 %176 0
%178 = OpCompositeExtract %18 %176 1
%179 = OpCompositeExtract %18 %176 2
%180 = OpCompositeExtract %18 %176 3
%181 = OpFAdd %18 %168 %177
%182 = OpFAdd %18 %169 %178
%183 = OpFAdd %18 %170 %179
%184 = OpFAdd %18 %171 %180
%185 = OpCompositeInsert %27 %181 %186 0
%187 = OpCompositeInsert %27 %182 %185 1
%188 = OpCompositeInsert %27 %183 %187 2
%189 = OpCompositeInsert %27 %184 %188 3
OpStore %70 %189
OpReturn
OpFunctionEnd
#endif
