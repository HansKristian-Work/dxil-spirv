#version 460
#extension GL_EXT_ray_tracing : require
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require

struct _17
{
    vec4 _m0;
    uvec4 _m1;
};

vec4 _62;
uvec4 _99;

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
    uvec4 _56 = uvec4(SBT._m0[4u], 0u, 0u, 0u);
    uint _59 = _56.z;
    vec4 _61;
    _61.x = uintBitsToFloat(uvec4(SBT._m0[min((_28.x + 0u), 4u)], SBT._m0[min((_28.x + 1u), 4u)], SBT._m0[min((_28.x + 2u), 4u)], SBT._m0[min((_28.x + 3u), 4u)])).x;
    _61.y = float(_56.y);
    _61.z = float(int(_59));
    _61.w = 1.0;
    payload._m0 = _61;
    vec4 _87 = uintBitsToFloat(uvec4(SBT._m1[min((_28.y + 0u), 5u)], SBT._m1[min((_28.y + 1u), 5u)], SBT._m1[min((_28.y + 2u), 5u)], SBT._m1[min((_28.y + 3u), 5u)]));
    uvec4 _98;
    _98.x = uint(int(_87.x));
    _98.y = uint(int(_87.y));
    _98.z = uvec4(SBT._m1[4u], SBT._m1[5u], 0u, 0u).z;
    _98.w = _59;
    payload._m1 = _98;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.4
; Generator: Unknown(30017); 21022
; Bound: 105
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
%33 = OpExtInstImport "GLSL.std.450"
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
%30 = OpTypePointer ShaderRecordBufferKHR %5
%35 = OpConstant %5 4
%43 = OpConstant %5 2
%48 = OpConstant %5 3
%66 = OpConstant %14 1
%67 = OpTypePointer IncomingRayPayloadKHR %15
%3 = OpFunction %1 None %2
%4 = OpLabel
%62 = OpUndef %15
%99 = OpUndef %16
OpBranch %103
%103 = OpLabel
%21 = OpAccessChain %20 %13 %22
%24 = OpAccessChain %23 %13 %25
%27 = OpInBoundsAccessChain %26 %19 %22
%28 = OpLoad %16 %27
%29 = OpCompositeExtract %5 %28 0
%32 = OpIAdd %5 %29 %25
%34 = OpExtInst %5 %33 UMin %32 %35
%31 = OpAccessChain %30 %24 %34
%36 = OpLoad %5 %31
%38 = OpIAdd %5 %29 %22
%39 = OpExtInst %5 %33 UMin %38 %35
%37 = OpAccessChain %30 %24 %39
%40 = OpLoad %5 %37
%42 = OpIAdd %5 %29 %43
%44 = OpExtInst %5 %33 UMin %42 %35
%41 = OpAccessChain %30 %24 %44
%45 = OpLoad %5 %41
%47 = OpIAdd %5 %29 %48
%49 = OpExtInst %5 %33 UMin %47 %35
%46 = OpAccessChain %30 %24 %49
%50 = OpLoad %5 %46
%51 = OpCompositeConstruct %16 %36 %40 %45 %50
%52 = OpBitcast %15 %51
%53 = OpCompositeExtract %14 %52 0
%54 = OpAccessChain %30 %24 %35
%55 = OpLoad %5 %54
%56 = OpCompositeConstruct %16 %55 %25 %25 %25
%57 = OpCompositeExtract %5 %56 1
%58 = OpConvertUToF %14 %57
%59 = OpCompositeExtract %5 %56 2
%60 = OpConvertSToF %14 %59
%61 = OpCompositeInsert %15 %53 %62 0
%63 = OpCompositeInsert %15 %58 %61 1
%64 = OpCompositeInsert %15 %60 %63 2
%65 = OpCompositeInsert %15 %66 %64 3
%68 = OpInBoundsAccessChain %67 %19 %25
OpStore %68 %65
%69 = OpCompositeExtract %5 %28 1
%71 = OpIAdd %5 %69 %25
%72 = OpExtInst %5 %33 UMin %71 %6
%70 = OpAccessChain %30 %21 %72
%73 = OpLoad %5 %70
%75 = OpIAdd %5 %69 %22
%76 = OpExtInst %5 %33 UMin %75 %6
%74 = OpAccessChain %30 %21 %76
%77 = OpLoad %5 %74
%79 = OpIAdd %5 %69 %43
%80 = OpExtInst %5 %33 UMin %79 %6
%78 = OpAccessChain %30 %21 %80
%81 = OpLoad %5 %78
%83 = OpIAdd %5 %69 %48
%84 = OpExtInst %5 %33 UMin %83 %6
%82 = OpAccessChain %30 %21 %84
%85 = OpLoad %5 %82
%86 = OpCompositeConstruct %16 %73 %77 %81 %85
%87 = OpBitcast %15 %86
%88 = OpCompositeExtract %14 %87 0
%89 = OpCompositeExtract %14 %87 1
%90 = OpAccessChain %30 %21 %35
%91 = OpLoad %5 %90
%92 = OpAccessChain %30 %21 %6
%93 = OpLoad %5 %92
%94 = OpCompositeConstruct %16 %91 %93 %25 %25
%95 = OpCompositeExtract %5 %94 2
%96 = OpConvertFToS %5 %88
%97 = OpConvertFToS %5 %89
%98 = OpCompositeInsert %16 %96 %99 0
%100 = OpCompositeInsert %16 %97 %98 1
%101 = OpCompositeInsert %16 %95 %100 2
%102 = OpCompositeInsert %16 %59 %101 3
OpStore %27 %102
OpReturn
OpFunctionEnd
#endif
