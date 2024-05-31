#version 460
#extension GL_EXT_ray_tracing : require
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require

struct _17
{
    vec4 _m0;
    uvec4 _m1;
};

vec4 _54;
uvec4 _84;

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

layout(location = 0) rayPayloadInEXT _17 payload;

void main()
{
    uvec4 _48 = uvec4(SBT._m0[0u], SBT._m0[1u], SBT._m0[2u], SBT._m0[3u]);
    uint _51 = _48.z;
    vec4 _53;
    _53.x = uintBitsToFloat(uvec4(SBT._m0[0u], SBT._m0[1u], SBT._m0[2u], SBT._m0[3u])).x;
    _53.y = float(_48.y);
    _53.z = float(int(_51));
    _53.w = 1.0;
    vec4 _68 = uintBitsToFloat(uvec4(SBT._m1[0u], SBT._m1[1u], SBT._m1[2u], SBT._m1[3u]));
    uvec4 _83;
    _83.x = uint(int(_68.x));
    _83.y = uint(int(_68.y));
    _83.z = uvec4(SBT._m1[0u], SBT._m1[1u], SBT._m1[2u], SBT._m1[3u]).z;
    _83.w = _51;
    payload._m0 = _53;
    payload._m1 = _83;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.4
; Generator: Unknown(30017); 21022
; Bound: 94
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
OpEntryPoint MissNV %3 "main" %13 %19
OpName %3 "main"
OpName %11 "SBTBlock"
OpName %13 "SBT"
OpName %17 ""
OpName %19 "payload"
OpDecorate %7 ArrayStride 4
OpDecorate %9 ArrayStride 4
OpDecorate %11 Block
OpMemberDecorate %11 0 Offset 0
OpMemberDecorate %11 1 Offset 20
OpMemberDecorate %11 2 Offset 48
OpMemberDecorate %11 3 Offset 56
OpMemberDecorate %11 4 Offset 64
OpMemberDecorate %11 5 Offset 72
OpMemberDecorate %11 6 Offset 80
OpMemberDecorate %11 7 Offset 88
OpMemberDecorate %11 8 Offset 96
OpMemberDecorate %11 9 Offset 104
OpMemberDecorate %11 10 Offset 112
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 5
%7 = OpTypeArray %5 %6
%8 = OpConstant %5 6
%9 = OpTypeArray %5 %8
%10 = OpTypeVector %5 2
%11 = OpTypeStruct %7 %9 %10 %10 %10 %10 %10 %10 %10 %10 %10
%12 = OpTypePointer ShaderRecordBufferNV %11
%13 = OpVariable %12 ShaderRecordBufferNV
%14 = OpTypeFloat 32
%15 = OpTypeVector %14 4
%16 = OpTypeVector %5 4
%17 = OpTypeStruct %15 %16
%18 = OpTypePointer IncomingRayPayloadNV %17
%19 = OpVariable %18 IncomingRayPayloadNV
%20 = OpTypePointer ShaderRecordBufferNV %9
%22 = OpConstant %5 1
%23 = OpTypePointer ShaderRecordBufferNV %7
%25 = OpConstant %5 0
%26 = OpTypePointer ShaderRecordBufferNV %5
%32 = OpConstant %5 2
%35 = OpConstant %5 3
%58 = OpConstant %14 1
%88 = OpTypePointer IncomingRayPayloadNV %15
%90 = OpTypePointer IncomingRayPayloadNV %16
%3 = OpFunction %1 None %2
%4 = OpLabel
%54 = OpUndef %15
%84 = OpUndef %16
OpBranch %92
%92 = OpLabel
%21 = OpAccessChain %20 %13 %22
%24 = OpAccessChain %23 %13 %25
%27 = OpAccessChain %26 %24 %25
%28 = OpLoad %5 %27
%29 = OpAccessChain %26 %24 %22
%30 = OpLoad %5 %29
%31 = OpAccessChain %26 %24 %32
%33 = OpLoad %5 %31
%34 = OpAccessChain %26 %24 %35
%36 = OpLoad %5 %34
%37 = OpCompositeConstruct %16 %28 %30 %33 %36
%38 = OpBitcast %15 %37
%39 = OpCompositeExtract %14 %38 0
%40 = OpAccessChain %26 %24 %25
%41 = OpLoad %5 %40
%42 = OpAccessChain %26 %24 %22
%43 = OpLoad %5 %42
%44 = OpAccessChain %26 %24 %32
%45 = OpLoad %5 %44
%46 = OpAccessChain %26 %24 %35
%47 = OpLoad %5 %46
%48 = OpCompositeConstruct %16 %41 %43 %45 %47
%49 = OpCompositeExtract %5 %48 1
%50 = OpConvertUToF %14 %49
%51 = OpCompositeExtract %5 %48 2
%52 = OpConvertSToF %14 %51
%53 = OpCompositeInsert %15 %39 %54 0
%55 = OpCompositeInsert %15 %50 %53 1
%56 = OpCompositeInsert %15 %52 %55 2
%57 = OpCompositeInsert %15 %58 %56 3
%59 = OpAccessChain %26 %21 %25
%60 = OpLoad %5 %59
%61 = OpAccessChain %26 %21 %22
%62 = OpLoad %5 %61
%63 = OpAccessChain %26 %21 %32
%64 = OpLoad %5 %63
%65 = OpAccessChain %26 %21 %35
%66 = OpLoad %5 %65
%67 = OpCompositeConstruct %16 %60 %62 %64 %66
%68 = OpBitcast %15 %67
%69 = OpCompositeExtract %14 %68 0
%70 = OpCompositeExtract %14 %68 1
%71 = OpAccessChain %26 %21 %25
%72 = OpLoad %5 %71
%73 = OpAccessChain %26 %21 %22
%74 = OpLoad %5 %73
%75 = OpAccessChain %26 %21 %32
%76 = OpLoad %5 %75
%77 = OpAccessChain %26 %21 %35
%78 = OpLoad %5 %77
%79 = OpCompositeConstruct %16 %72 %74 %76 %78
%80 = OpCompositeExtract %5 %79 2
%81 = OpConvertFToS %5 %69
%82 = OpConvertFToS %5 %70
%83 = OpCompositeInsert %16 %81 %84 0
%85 = OpCompositeInsert %16 %82 %83 1
%86 = OpCompositeInsert %16 %80 %85 2
%87 = OpCompositeInsert %16 %51 %86 3
%89 = OpInBoundsAccessChain %88 %19 %25
OpStore %89 %57
%91 = OpInBoundsAccessChain %90 %19 %22
OpStore %91 %87
OpReturn
OpFunctionEnd
#endif
