#version 460
#extension GL_NV_ray_tracing : require
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

struct _15
{
    vec4 _m0;
    uint _m1;
};

struct _19
{
    uint _m0;
};

struct _20
{
    vec4 _m0;
    _19 _m1;
};

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

layout(set = 0, binding = 0) uniform texture2D _13[];
layout(location = 0) rayPayloadInNV _15 payload;

_20 _23[2];

vec4 _79;

void main()
{
    vec4 _39 = texelFetch(_13[nonuniformEXT(registers._m0 + (payload._m1 & 1u))], ivec2(uvec2(0u)), int(0u));
    vec4 _53 = texelFetch(_13[nonuniformEXT(registers._m0 + payload._m1)], ivec2(uvec2(0u)), int(0u));
    vec4 _68 = texelFetch(_13[nonuniformEXT(registers._m0 + payload._m1)], ivec2(uvec2(0u)), int(0u));
    vec4 _78 = _79;
    _78.x = (_39.x + _53.x) + _68.x;
    vec4 _80 = _78;
    _80.y = (_39.y + _53.y) + _68.y;
    vec4 _81 = _80;
    _81.z = (_39.z + _53.z) + _68.z;
    vec4 _82 = _81;
    _82.w = (_39.w + _53.w) + _68.w;
    payload._m0 = _82;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 85
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
OpName %15 ""
OpName %17 "payload"
OpName %19 ""
OpName %20 ""
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %17 Location 0
OpDecorate %28 NonUniform
OpDecorate %36 NonUniform
OpDecorate %27 NonUniform
OpDecorate %52 NonUniform
OpDecorate %27 NonUniform
OpDecorate %67 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeFloat 32
%10 = OpTypeImage %9 2D 0 0 0 1 Unknown
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer UniformConstant %11
%13 = OpVariable %12 UniformConstant
%14 = OpTypeVector %9 4
%15 = OpTypeStruct %14 %5
%16 = OpTypePointer IncomingRayPayloadNV %15
%17 = OpVariable %16 IncomingRayPayloadNV
%18 = OpConstant %5 2
%19 = OpTypeStruct %5
%20 = OpTypeStruct %14 %19
%21 = OpTypeArray %20 %18
%22 = OpTypePointer Private %21
%23 = OpVariable %22 Private
%24 = OpTypePointer IncomingRayPayloadNV %5
%26 = OpConstant %5 1
%29 = OpTypePointer UniformConstant %10
%31 = OpTypePointer PushConstant %5
%33 = OpConstant %5 0
%37 = OpTypeInt 32 1
%38 = OpConstant %37 0
%40 = OpTypeVector %5 2
%46 = OpTypePointer IncomingRayPayloadNV %14
%3 = OpFunction %1 None %2
%4 = OpLabel
%79 = OpUndef %14
OpBranch %83
%83 = OpLabel
%25 = OpInBoundsAccessChain %24 %17 %26
%27 = OpLoad %5 %25
%28 = OpBitwiseAnd %5 %27 %26
%32 = OpAccessChain %31 %8 %33
%34 = OpLoad %5 %32
%35 = OpIAdd %5 %34 %28
%30 = OpAccessChain %29 %13 %35
%36 = OpLoad %10 %30
%41 = OpCompositeConstruct %40 %33 %33
%39 = OpImageFetch %14 %36 %41 Lod %33
%42 = OpCompositeExtract %9 %39 0
%43 = OpCompositeExtract %9 %39 1
%44 = OpCompositeExtract %9 %39 2
%45 = OpCompositeExtract %9 %39 3
%47 = OpInBoundsAccessChain %46 %17 %33
%49 = OpAccessChain %31 %8 %33
%50 = OpLoad %5 %49
%51 = OpIAdd %5 %50 %27
%48 = OpAccessChain %29 %13 %51
%52 = OpLoad %10 %48
%54 = OpCompositeConstruct %40 %33 %33
%53 = OpImageFetch %14 %52 %54 Lod %33
%55 = OpCompositeExtract %9 %53 0
%56 = OpCompositeExtract %9 %53 1
%57 = OpCompositeExtract %9 %53 2
%58 = OpCompositeExtract %9 %53 3
%59 = OpFAdd %9 %42 %55
%60 = OpFAdd %9 %43 %56
%61 = OpFAdd %9 %44 %57
%62 = OpFAdd %9 %45 %58
%64 = OpAccessChain %31 %8 %33
%65 = OpLoad %5 %64
%66 = OpIAdd %5 %65 %27
%63 = OpAccessChain %29 %13 %66
%67 = OpLoad %10 %63
%69 = OpCompositeConstruct %40 %33 %33
%68 = OpImageFetch %14 %67 %69 Lod %33
%70 = OpCompositeExtract %9 %68 0
%71 = OpCompositeExtract %9 %68 1
%72 = OpCompositeExtract %9 %68 2
%73 = OpCompositeExtract %9 %68 3
%74 = OpFAdd %9 %59 %70
%75 = OpFAdd %9 %60 %71
%76 = OpFAdd %9 %61 %72
%77 = OpFAdd %9 %62 %73
%78 = OpCompositeInsert %14 %74 %79 0
%80 = OpCompositeInsert %14 %75 %78 1
%81 = OpCompositeInsert %14 %76 %80 2
%82 = OpCompositeInsert %14 %77 %81 3
OpStore %47 %82
OpReturn
OpFunctionEnd
#endif
