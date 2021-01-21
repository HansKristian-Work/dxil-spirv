#version 460
#extension GL_EXT_ray_tracing : require
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

struct _15
{
    vec4 _m0;
    uint _m1;
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
rayPayloadInEXT _15 payload;

vec4 _75;

void main()
{
    vec4 _33 = texelFetch(_13[registers._m0 + (payload._m1 & 1u)], ivec2(uvec2(0u)), int(0u));
    vec4 _47 = texelFetch(_13[registers._m0 + payload._m1], ivec2(uvec2(0u)), int(0u));
    vec4 _64 = texelFetch(_13[(registers._m0 + 10u) + payload._m1], ivec2(uvec2(0u)), int(0u));
    vec4 _74 = _75;
    _74.x = (_33.x + _47.x) + _64.x;
    vec4 _76 = _74;
    _76.y = (_33.y + _47.y) + _64.y;
    vec4 _77 = _76;
    _77.z = (_33.z + _47.z) + _64.z;
    vec4 _78 = _77;
    _78.w = (_33.w + _47.w) + _64.w;
    payload._m0 = _78;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.4
; Generator: Unknown(30017); 21022
; Bound: 81
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
OpEntryPoint MissNV %3 "main" %8 %13 %17
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %15 ""
OpName %17 "payload"
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
%18 = OpTypePointer IncomingRayPayloadNV %5
%20 = OpConstant %5 1
%23 = OpTypePointer UniformConstant %10
%25 = OpTypePointer PushConstant %5
%27 = OpConstant %5 0
%31 = OpTypeInt 32 1
%32 = OpConstant %31 0
%34 = OpTypeVector %5 2
%40 = OpTypePointer IncomingRayPayloadNV %14
%61 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
%75 = OpUndef %14
OpBranch %79
%79 = OpLabel
%19 = OpInBoundsAccessChain %18 %17 %20
%21 = OpLoad %5 %19
%22 = OpBitwiseAnd %5 %21 %20
%26 = OpAccessChain %25 %8 %27
%28 = OpLoad %5 %26
%29 = OpIAdd %5 %28 %22
%24 = OpAccessChain %23 %13 %29
%30 = OpLoad %10 %24
%35 = OpCompositeConstruct %34 %27 %27
%33 = OpImageFetch %14 %30 %35 Lod %27
%36 = OpCompositeExtract %9 %33 0
%37 = OpCompositeExtract %9 %33 1
%38 = OpCompositeExtract %9 %33 2
%39 = OpCompositeExtract %9 %33 3
%41 = OpInBoundsAccessChain %40 %17 %27
%43 = OpAccessChain %25 %8 %27
%44 = OpLoad %5 %43
%45 = OpIAdd %5 %44 %21
%42 = OpAccessChain %23 %13 %45
%46 = OpLoad %10 %42
%48 = OpCompositeConstruct %34 %27 %27
%47 = OpImageFetch %14 %46 %48 Lod %27
%49 = OpCompositeExtract %9 %47 0
%50 = OpCompositeExtract %9 %47 1
%51 = OpCompositeExtract %9 %47 2
%52 = OpCompositeExtract %9 %47 3
%53 = OpFAdd %9 %36 %49
%54 = OpFAdd %9 %37 %50
%55 = OpFAdd %9 %38 %51
%56 = OpFAdd %9 %39 %52
%58 = OpAccessChain %25 %8 %27
%59 = OpLoad %5 %58
%60 = OpIAdd %5 %59 %61
%62 = OpIAdd %5 %60 %21
%57 = OpAccessChain %23 %13 %62
%63 = OpLoad %10 %57
%65 = OpCompositeConstruct %34 %27 %27
%64 = OpImageFetch %14 %63 %65 Lod %27
%66 = OpCompositeExtract %9 %64 0
%67 = OpCompositeExtract %9 %64 1
%68 = OpCompositeExtract %9 %64 2
%69 = OpCompositeExtract %9 %64 3
%70 = OpFAdd %9 %53 %66
%71 = OpFAdd %9 %54 %67
%72 = OpFAdd %9 %55 %68
%73 = OpFAdd %9 %56 %69
%74 = OpCompositeInsert %14 %70 %75 0
%76 = OpCompositeInsert %14 %71 %74 1
%77 = OpCompositeInsert %14 %72 %76 2
%78 = OpCompositeInsert %14 %73 %77 3
OpStore %41 %78
OpReturn
OpFunctionEnd
#endif
