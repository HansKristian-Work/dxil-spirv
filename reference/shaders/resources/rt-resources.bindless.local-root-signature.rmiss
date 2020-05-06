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
layout(set = 2, binding = 0) uniform sampler _37[];
layout(location = 0) rayPayloadInNV _38 payload;

vec4 _265;

void main()
{
    uint _55 = (SBT._m7.x >> 6u) + 12u;
    vec4 _71 = texelFetch(_22[nonuniformEXT(registers._m0 + (payload._m1 & 1u))], ivec2(uvec2(0u)), int(0u));
    vec4 _84 = texelFetch(_22[nonuniformEXT(registers._m0 + payload._m1)], ivec2(uvec2(0u)), int(0u));
    vec4 _102 = texelFetch(_22[nonuniformEXT(((SBT._m5.x >> 6u) + 17u) + payload._m1)], ivec2(uvec2(0u)), int(0u));
    vec4 _121 = imageLoad(_26[nonuniformEXT(((SBT._m6.x >> 6u) + 18u) + payload._m1)], ivec2(uvec2(0u)));
    uint _148 = ((SBT._m7.x >> 6u) + 13u) + payload._m1;
    vec4 _171 = uintBitsToFloat(uvec4(SBT._m0[0u], SBT._m0[1u], SBT._m0[2u], SBT._m0[3u]));
    vec4 _183 = uintBitsToFloat(uvec4(SBT._m0[4u], 0u, 0u, 0u));
    vec4Pointer _197 = vec4Pointer(SBT._m4 + uint64_t(1u * 16u));
    vec4 _226 = textureLodOffset(sampler2D(_22[nonuniformEXT(registers._m0 + (payload._m1 & 1u))], _37[nonuniformEXT((SBT._m8.x >> 5u) + 13u)]), vec2(0.5), 0.0, ivec2(0));
    vec4 _254 = textureLodOffset(sampler2D(_22[nonuniformEXT(registers._m0 + payload._m1)], _37[nonuniformEXT(((SBT._m8.x >> 5u) + 14u) + (payload._m1 ^ 1u))]), vec2(0.5), 0.0, ivec2(0));
    vec4 _264 = _265;
    _264.x = (((((((((_71.x + _84.x) + _102.x) + _121.x) + _33[nonuniformEXT(_55)]._m0[0u].x) + _33[nonuniformEXT(_148)]._m0[0u].x) + _171.x) + _183.x) + _197.value.x) + _226.x) + _254.x;
    vec4 _266 = _264;
    _266.y = (((((((((_71.y + _84.y) + _102.y) + _121.y) + _33[nonuniformEXT(_55)]._m0[0u].y) + _33[nonuniformEXT(_148)]._m0[0u].y) + _171.y) + _183.y) + _197.value.y) + _226.y) + _254.y;
    vec4 _267 = _266;
    _267.z = (((((((((_71.z + _84.z) + _102.z) + _121.z) + _33[nonuniformEXT(_55)]._m0[0u].z) + _33[nonuniformEXT(_148)]._m0[0u].z) + _171.z) + _183.z) + _197.value.z) + _226.z) + _254.z;
    vec4 _268 = _267;
    _268.w = (((((((((_71.w + _84.w) + _102.w) + _121.w) + _33[nonuniformEXT(_55)]._m0[0u].w) + _33[nonuniformEXT(_148)]._m0[0u].w) + _171.w) + _183.w) + _197.value.w) + _226.w) + _254.w;
    payload._m0 = _268;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 271
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
OpDecorate %37 DescriptorSet 2
OpDecorate %37 Binding 0
OpDecorate %40 Location 0
OpDecorate %49 NonUniform
OpDecorate %61 NonUniform
OpDecorate %68 NonUniform
OpDecorate %60 NonUniform
OpDecorate %83 NonUniform
OpDecorate %60 NonUniform
OpDecorate %101 NonUniform
OpDecorate %60 NonUniform
OpDecorate %120 NonUniform
OpDecorate %132 NonUniform
OpDecorate %142 NonUniform
OpDecorate %149 NonUniform
OpDecorate %208 NonUniform
OpDecorate %213 NonUniform
OpDecorate %221 NonUniform
OpDecorate %223 NonUniform
OpDecorate %207 NonUniform
OpDecorate %244 NonUniform
OpDecorate %239 NonUniform
OpDecorate %252 NonUniform
OpDecorate %253 NonUniform
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
%34 = OpTypeSampler
%35 = OpTypeRuntimeArray %34
%36 = OpTypePointer UniformConstant %35
%37 = OpVariable %36 UniformConstant
%38 = OpTypeStruct %27 %5
%39 = OpTypePointer IncomingRayPayloadNV %38
%40 = OpVariable %39 IncomingRayPayloadNV
%41 = OpTypePointer ShaderRecordBufferNV %13
%43 = OpConstant %5 4
%45 = OpTypePointer ShaderRecordBufferNV %10
%47 = OpConstant %5 0
%48 = OpTypePointer Uniform %30
%50 = OpTypePointer ShaderRecordBufferNV %5
%52 = OpConstant %5 7
%56 = OpConstant %5 12
%57 = OpTypePointer IncomingRayPayloadNV %5
%59 = OpConstant %5 1
%62 = OpTypePointer UniformConstant %19
%64 = OpTypePointer PushConstant %5
%69 = OpTypeInt 32 1
%70 = OpConstant %69 0
%77 = OpTypePointer IncomingRayPayloadNV %27
%99 = OpConstant %5 17
%112 = OpTypePointer UniformConstant %23
%118 = OpConstant %5 18
%131 = OpTypePointer Uniform %27
%147 = OpConstant %5 13
%164 = OpConstant %5 2
%167 = OpConstant %5 3
%169 = OpTypeVector %5 4
%193 = OpConstant %5 16
%196 = OpTypePointer PhysicalStorageBuffer %27
%214 = OpTypePointer UniformConstant %34
%217 = OpConstant %5 8
%222 = OpTypeSampledImage %19
%224 = OpConstant %18 0.5
%225 = OpConstant %18 0
%227 = OpTypeVector %18 2
%229 = OpTypeVector %69 2
%230 = OpConstantComposite %229 %70 %70
%250 = OpConstant %5 14
%3 = OpFunction %1 None %2
%4 = OpLabel
%265 = OpUndef %27
OpBranch %269
%269 = OpLabel
%42 = OpAccessChain %41 %17 %43
%44 = OpLoad %13 %42
%46 = OpAccessChain %45 %17 %47
%51 = OpAccessChain %50 %17 %52 %47
%53 = OpLoad %5 %51
%54 = OpShiftRightLogical %5 %53 %11
%55 = OpIAdd %5 %54 %56
%49 = OpAccessChain %48 %33 %55
%58 = OpInBoundsAccessChain %57 %40 %59
%60 = OpLoad %5 %58
%61 = OpBitwiseAnd %5 %60 %59
%65 = OpAccessChain %64 %8 %47
%66 = OpLoad %5 %65
%67 = OpIAdd %5 %66 %61
%63 = OpAccessChain %62 %22 %67
%68 = OpLoad %19 %63
%72 = OpCompositeConstruct %14 %47 %47
%71 = OpImageFetch %27 %68 %72 Lod %47
%73 = OpCompositeExtract %18 %71 0
%74 = OpCompositeExtract %18 %71 1
%75 = OpCompositeExtract %18 %71 2
%76 = OpCompositeExtract %18 %71 3
%78 = OpInBoundsAccessChain %77 %40 %47
%80 = OpAccessChain %64 %8 %47
%81 = OpLoad %5 %80
%82 = OpIAdd %5 %81 %60
%79 = OpAccessChain %62 %22 %82
%83 = OpLoad %19 %79
%85 = OpCompositeConstruct %14 %47 %47
%84 = OpImageFetch %27 %83 %85 Lod %47
%86 = OpCompositeExtract %18 %84 0
%87 = OpCompositeExtract %18 %84 1
%88 = OpCompositeExtract %18 %84 2
%89 = OpCompositeExtract %18 %84 3
%90 = OpFAdd %18 %73 %86
%91 = OpFAdd %18 %74 %87
%92 = OpFAdd %18 %75 %88
%93 = OpFAdd %18 %76 %89
%95 = OpAccessChain %50 %17 %9 %47
%96 = OpLoad %5 %95
%97 = OpShiftRightLogical %5 %96 %11
%98 = OpIAdd %5 %97 %99
%100 = OpIAdd %5 %98 %60
%94 = OpAccessChain %62 %22 %100
%101 = OpLoad %19 %94
%103 = OpCompositeConstruct %14 %47 %47
%102 = OpImageFetch %27 %101 %103 Lod %47
%104 = OpCompositeExtract %18 %102 0
%105 = OpCompositeExtract %18 %102 1
%106 = OpCompositeExtract %18 %102 2
%107 = OpCompositeExtract %18 %102 3
%108 = OpFAdd %18 %90 %104
%109 = OpFAdd %18 %91 %105
%110 = OpFAdd %18 %92 %106
%111 = OpFAdd %18 %93 %107
%114 = OpAccessChain %50 %17 %11 %47
%115 = OpLoad %5 %114
%116 = OpShiftRightLogical %5 %115 %11
%117 = OpIAdd %5 %116 %118
%119 = OpIAdd %5 %117 %60
%113 = OpAccessChain %112 %26 %119
%120 = OpLoad %23 %113
%122 = OpCompositeConstruct %14 %47 %47
%121 = OpImageRead %27 %120 %122 None
%123 = OpCompositeExtract %18 %121 0
%124 = OpCompositeExtract %18 %121 1
%125 = OpCompositeExtract %18 %121 2
%126 = OpCompositeExtract %18 %121 3
%127 = OpFAdd %18 %108 %123
%128 = OpFAdd %18 %109 %124
%129 = OpFAdd %18 %110 %125
%130 = OpFAdd %18 %111 %126
%132 = OpAccessChain %131 %49 %47 %47
%133 = OpLoad %27 %132
%134 = OpCompositeExtract %18 %133 0
%135 = OpCompositeExtract %18 %133 1
%136 = OpCompositeExtract %18 %133 2
%137 = OpCompositeExtract %18 %133 3
%138 = OpFAdd %18 %127 %134
%139 = OpFAdd %18 %128 %135
%140 = OpFAdd %18 %129 %136
%141 = OpFAdd %18 %130 %137
%143 = OpAccessChain %50 %17 %52 %47
%144 = OpLoad %5 %143
%145 = OpShiftRightLogical %5 %144 %11
%146 = OpIAdd %5 %145 %147
%148 = OpIAdd %5 %146 %60
%142 = OpAccessChain %48 %33 %148
%149 = OpAccessChain %131 %142 %47 %47
%150 = OpLoad %27 %149
%151 = OpCompositeExtract %18 %150 0
%152 = OpCompositeExtract %18 %150 1
%153 = OpCompositeExtract %18 %150 2
%154 = OpCompositeExtract %18 %150 3
%155 = OpFAdd %18 %138 %151
%156 = OpFAdd %18 %139 %152
%157 = OpFAdd %18 %140 %153
%158 = OpFAdd %18 %141 %154
%159 = OpAccessChain %50 %46 %47
%160 = OpLoad %5 %159
%161 = OpAccessChain %50 %46 %59
%162 = OpLoad %5 %161
%163 = OpAccessChain %50 %46 %164
%165 = OpLoad %5 %163
%166 = OpAccessChain %50 %46 %167
%168 = OpLoad %5 %166
%170 = OpCompositeConstruct %169 %160 %162 %165 %168
%171 = OpBitcast %27 %170
%172 = OpCompositeExtract %18 %171 0
%173 = OpCompositeExtract %18 %171 1
%174 = OpCompositeExtract %18 %171 2
%175 = OpCompositeExtract %18 %171 3
%176 = OpFAdd %18 %155 %172
%177 = OpFAdd %18 %156 %173
%178 = OpFAdd %18 %157 %174
%179 = OpFAdd %18 %158 %175
%180 = OpAccessChain %50 %46 %43
%181 = OpLoad %5 %180
%182 = OpCompositeConstruct %169 %181 %47 %47 %47
%183 = OpBitcast %27 %182
%184 = OpCompositeExtract %18 %183 0
%185 = OpCompositeExtract %18 %183 1
%186 = OpCompositeExtract %18 %183 2
%187 = OpCompositeExtract %18 %183 3
%188 = OpFAdd %18 %176 %184
%189 = OpFAdd %18 %177 %185
%190 = OpFAdd %18 %178 %186
%191 = OpFAdd %18 %179 %187
%192 = OpIMul %5 %59 %193
%194 = OpUConvert %13 %192
%195 = OpIAdd %13 %44 %194
%197 = OpBitcast %196 %195
%198 = OpLoad %27 %197 Aligned 16
%199 = OpCompositeExtract %18 %198 0
%200 = OpCompositeExtract %18 %198 1
%201 = OpCompositeExtract %18 %198 2
%202 = OpCompositeExtract %18 %198 3
%203 = OpFAdd %18 %188 %199
%204 = OpFAdd %18 %189 %200
%205 = OpFAdd %18 %190 %201
%206 = OpFAdd %18 %191 %202
%207 = OpLoad %5 %58
%208 = OpBitwiseAnd %5 %207 %59
%210 = OpAccessChain %64 %8 %47
%211 = OpLoad %5 %210
%212 = OpIAdd %5 %211 %208
%209 = OpAccessChain %62 %22 %212
%213 = OpLoad %19 %209
%216 = OpAccessChain %50 %17 %217 %47
%218 = OpLoad %5 %216
%219 = OpShiftRightLogical %5 %218 %9
%220 = OpIAdd %5 %219 %147
%215 = OpAccessChain %214 %37 %220
%221 = OpLoad %34 %215
%223 = OpSampledImage %222 %213 %221
%228 = OpCompositeConstruct %227 %224 %224
%226 = OpImageSampleExplicitLod %27 %223 %228 Lod|ConstOffset %225 %230
%231 = OpCompositeExtract %18 %226 0
%232 = OpCompositeExtract %18 %226 1
%233 = OpCompositeExtract %18 %226 2
%234 = OpCompositeExtract %18 %226 3
%235 = OpFAdd %18 %203 %231
%236 = OpFAdd %18 %204 %232
%237 = OpFAdd %18 %205 %233
%238 = OpFAdd %18 %206 %234
%239 = OpBitwiseXor %5 %207 %59
%241 = OpAccessChain %64 %8 %47
%242 = OpLoad %5 %241
%243 = OpIAdd %5 %242 %207
%240 = OpAccessChain %62 %22 %243
%244 = OpLoad %19 %240
%246 = OpAccessChain %50 %17 %217 %47
%247 = OpLoad %5 %246
%248 = OpShiftRightLogical %5 %247 %9
%249 = OpIAdd %5 %248 %250
%251 = OpIAdd %5 %249 %239
%245 = OpAccessChain %214 %37 %251
%252 = OpLoad %34 %245
%253 = OpSampledImage %222 %244 %252
%255 = OpCompositeConstruct %227 %224 %224
%254 = OpImageSampleExplicitLod %27 %253 %255 Lod|ConstOffset %225 %230
%256 = OpCompositeExtract %18 %254 0
%257 = OpCompositeExtract %18 %254 1
%258 = OpCompositeExtract %18 %254 2
%259 = OpCompositeExtract %18 %254 3
%260 = OpFAdd %18 %235 %256
%261 = OpFAdd %18 %236 %257
%262 = OpFAdd %18 %237 %258
%263 = OpFAdd %18 %238 %259
%264 = OpCompositeInsert %27 %260 %265 0
%266 = OpCompositeInsert %27 %261 %264 1
%267 = OpCompositeInsert %27 %262 %266 2
%268 = OpCompositeInsert %27 %263 %267 3
OpStore %78 %268
OpReturn
OpFunctionEnd
#endif
