#version 460
#extension GL_EXT_ray_tracing : require
#extension GL_EXT_nonuniform_qualifier : require

struct _17
{
    vec4 _m0;
    uvec4 _m1;
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

layout(location = 0) rayPayloadInEXT _17 payload;

vec4 _38;
uvec4 _54;

void main()
{
    vec4 _37;
    _37.x = uintBitsToFloat(SBT._m0[0u]);
    _37.y = float(SBT._m0[1u]);
    _37.z = float(int(SBT._m0[2u]));
    _37.w = 1.0;
    uvec4 _53;
    _53.x = uint(int(uintBitsToFloat(SBT._m1[0u])));
    _53.y = uint(int(uintBitsToFloat(SBT._m1[1u])));
    _53.z = SBT._m1[2u];
    _53.w = SBT._m0[2u];
    payload._m0 = _37;
    payload._m1 = _53;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.4
; Generator: Unknown(30017); 21022
; Bound: 64
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
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_ray_tracing"
OpMemoryModel Logical GLSL450
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
%34 = OpConstant %5 2
%42 = OpConstant %14 1
%58 = OpTypePointer IncomingRayPayloadNV %15
%60 = OpTypePointer IncomingRayPayloadNV %16
%3 = OpFunction %1 None %2
%4 = OpLabel
%38 = OpUndef %15
%54 = OpUndef %16
OpBranch %62
%62 = OpLabel
%21 = OpAccessChain %20 %13 %22
%24 = OpAccessChain %23 %13 %25
%27 = OpAccessChain %26 %24 %25
%28 = OpLoad %5 %27
%29 = OpBitcast %14 %28
%30 = OpAccessChain %26 %24 %22
%31 = OpLoad %5 %30
%32 = OpConvertUToF %14 %31
%33 = OpAccessChain %26 %24 %34
%35 = OpLoad %5 %33
%36 = OpConvertSToF %14 %35
%37 = OpCompositeInsert %15 %29 %38 0
%39 = OpCompositeInsert %15 %32 %37 1
%40 = OpCompositeInsert %15 %36 %39 2
%41 = OpCompositeInsert %15 %42 %40 3
%43 = OpAccessChain %26 %21 %25
%44 = OpLoad %5 %43
%45 = OpBitcast %14 %44
%46 = OpAccessChain %26 %21 %22
%47 = OpLoad %5 %46
%48 = OpBitcast %14 %47
%49 = OpAccessChain %26 %21 %34
%50 = OpLoad %5 %49
%51 = OpConvertFToS %5 %45
%52 = OpConvertFToS %5 %48
%53 = OpCompositeInsert %16 %51 %54 0
%55 = OpCompositeInsert %16 %52 %53 1
%56 = OpCompositeInsert %16 %50 %55 2
%57 = OpCompositeInsert %16 %35 %56 3
%59 = OpInBoundsAccessChain %58 %19 %25
OpStore %59 %41
%61 = OpInBoundsAccessChain %60 %19 %22
OpStore %61 %57
OpReturn
OpFunctionEnd
#endif
