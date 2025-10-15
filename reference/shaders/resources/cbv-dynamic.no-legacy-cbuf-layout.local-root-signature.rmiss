#version 460
#extension GL_EXT_ray_tracing : require
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require

struct _17
{
    vec4 _m0;
    uvec4 _m1;
};

vec4 _63;
uvec4 _101;

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
    uvec4 _28 = payload._m1;
    uint _30 = 4u * _28.x;
    uvec4 _57 = uvec4(SBT._m0[4u], 0u, 0u, 0u);
    uint _60 = _57.z;
    vec4 _62;
    _62.x = uintBitsToFloat(uvec4(SBT._m0[min((_30 + 0u), 4u)], SBT._m0[min((_30 + 1u), 4u)], SBT._m0[min((_30 + 2u), 4u)], SBT._m0[min((_30 + 3u), 4u)])).x;
    _62.y = float(_57.y);
    _62.z = float(int(_60));
    _62.w = 1.0;
    payload._m0 = _62;
    uint _71 = 4u * _28.y;
    vec4 _89 = uintBitsToFloat(uvec4(SBT._m1[min((_71 + 0u), 5u)], SBT._m1[min((_71 + 1u), 5u)], SBT._m1[min((_71 + 2u), 5u)], SBT._m1[min((_71 + 3u), 5u)]));
    uvec4 _100;
    _100.x = uint(int(_89.x));
    _100.y = uint(int(_89.y));
    _100.z = uvec4(SBT._m1[4u], SBT._m1[5u], 0u, 0u).z;
    _100.w = _60;
    payload._m1 = _100;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.4
; Generator: Unknown(30017); 21022
; Bound: 107
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
%35 = OpExtInstImport "GLSL.std.450"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint MissKHR %3 "main" %13 %19
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
%12 = OpTypePointer ShaderRecordBufferKHR %11
%13 = OpVariable %12 ShaderRecordBufferKHR
%14 = OpTypeFloat 32
%15 = OpTypeVector %14 4
%16 = OpTypeVector %5 4
%17 = OpTypeStruct %15 %16
%18 = OpTypePointer IncomingRayPayloadKHR %17
%19 = OpVariable %18 IncomingRayPayloadKHR
%20 = OpTypePointer ShaderRecordBufferKHR %9
%22 = OpConstant %5 1
%23 = OpTypePointer ShaderRecordBufferKHR %7
%25 = OpConstant %5 0
%26 = OpTypePointer IncomingRayPayloadKHR %16
%31 = OpConstant %5 4
%32 = OpTypePointer ShaderRecordBufferKHR %5
%44 = OpConstant %5 2
%49 = OpConstant %5 3
%67 = OpConstant %14 1
%68 = OpTypePointer IncomingRayPayloadKHR %15
%3 = OpFunction %1 None %2
%4 = OpLabel
%63 = OpUndef %15
%101 = OpUndef %16
OpBranch %105
%105 = OpLabel
%21 = OpAccessChain %20 %13 %22
%24 = OpAccessChain %23 %13 %25
%27 = OpInBoundsAccessChain %26 %19 %22
%28 = OpLoad %16 %27
%29 = OpCompositeExtract %5 %28 0
%30 = OpIMul %5 %31 %29
%34 = OpIAdd %5 %30 %25
%36 = OpExtInst %5 %35 UMin %34 %31
%33 = OpAccessChain %32 %24 %36
%37 = OpLoad %5 %33
%39 = OpIAdd %5 %30 %22
%40 = OpExtInst %5 %35 UMin %39 %31
%38 = OpAccessChain %32 %24 %40
%41 = OpLoad %5 %38
%43 = OpIAdd %5 %30 %44
%45 = OpExtInst %5 %35 UMin %43 %31
%42 = OpAccessChain %32 %24 %45
%46 = OpLoad %5 %42
%48 = OpIAdd %5 %30 %49
%50 = OpExtInst %5 %35 UMin %48 %31
%47 = OpAccessChain %32 %24 %50
%51 = OpLoad %5 %47
%52 = OpCompositeConstruct %16 %37 %41 %46 %51
%53 = OpBitcast %15 %52
%54 = OpCompositeExtract %14 %53 0
%55 = OpAccessChain %32 %24 %31
%56 = OpLoad %5 %55
%57 = OpCompositeConstruct %16 %56 %25 %25 %25
%58 = OpCompositeExtract %5 %57 1
%59 = OpConvertUToF %14 %58
%60 = OpCompositeExtract %5 %57 2
%61 = OpConvertSToF %14 %60
%62 = OpCompositeInsert %15 %54 %63 0
%64 = OpCompositeInsert %15 %59 %62 1
%65 = OpCompositeInsert %15 %61 %64 2
%66 = OpCompositeInsert %15 %67 %65 3
%69 = OpInBoundsAccessChain %68 %19 %25
OpStore %69 %66
%70 = OpCompositeExtract %5 %28 1
%71 = OpIMul %5 %31 %70
%73 = OpIAdd %5 %71 %25
%74 = OpExtInst %5 %35 UMin %73 %6
%72 = OpAccessChain %32 %21 %74
%75 = OpLoad %5 %72
%77 = OpIAdd %5 %71 %22
%78 = OpExtInst %5 %35 UMin %77 %6
%76 = OpAccessChain %32 %21 %78
%79 = OpLoad %5 %76
%81 = OpIAdd %5 %71 %44
%82 = OpExtInst %5 %35 UMin %81 %6
%80 = OpAccessChain %32 %21 %82
%83 = OpLoad %5 %80
%85 = OpIAdd %5 %71 %49
%86 = OpExtInst %5 %35 UMin %85 %6
%84 = OpAccessChain %32 %21 %86
%87 = OpLoad %5 %84
%88 = OpCompositeConstruct %16 %75 %79 %83 %87
%89 = OpBitcast %15 %88
%90 = OpCompositeExtract %14 %89 0
%91 = OpCompositeExtract %14 %89 1
%92 = OpAccessChain %32 %21 %31
%93 = OpLoad %5 %92
%94 = OpAccessChain %32 %21 %6
%95 = OpLoad %5 %94
%96 = OpCompositeConstruct %16 %93 %95 %25 %25
%97 = OpCompositeExtract %5 %96 2
%98 = OpConvertFToS %5 %90
%99 = OpConvertFToS %5 %91
%100 = OpCompositeInsert %16 %98 %101 0
%102 = OpCompositeInsert %16 %99 %100 1
%103 = OpCompositeInsert %16 %97 %102 2
%104 = OpCompositeInsert %16 %60 %103 3
OpStore %27 %104
OpReturn
OpFunctionEnd
#endif
