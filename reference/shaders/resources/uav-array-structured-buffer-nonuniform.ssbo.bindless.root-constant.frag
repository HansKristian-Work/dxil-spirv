#version 460
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 4, binding = 0, std430) readonly buffer SSBO
{
    uint _m0[];
} _13[];

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
    uint _m8;
    uint _m9;
    uint _m10;
    uint _m11;
    uint _m12;
    uint _m13;
    uint _m14;
    uint _m15;
} registers;

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _29 = registers._m4 + (INDEX + 0u);
    uint _30 = INDEX * 4u;
    vec4 _48 = uintBitsToFloat(uvec4(_13[nonuniformEXT(_29)]._m0[_30], _13[nonuniformEXT(_29)]._m0[_30 + 1u], _13[nonuniformEXT(_29)]._m0[_30 + 2u], _13[nonuniformEXT(_29)]._m0[_30 + 3u]));
    SV_Target.x = _48.x;
    SV_Target.y = _48.y;
    SV_Target.z = _48.z;
    SV_Target.w = _48.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 59
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %15 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %10 "SSBO"
OpName %15 "INDEX"
OpName %19 "SV_Target"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpMemberDecorate %6 8 Offset 32
OpMemberDecorate %6 9 Offset 36
OpMemberDecorate %6 10 Offset 40
OpMemberDecorate %6 11 Offset 44
OpMemberDecorate %6 12 Offset 48
OpMemberDecorate %6 13 Offset 52
OpMemberDecorate %6 14 Offset 56
OpMemberDecorate %6 15 Offset 60
OpDecorate %9 ArrayStride 4
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %13 DescriptorSet 4
OpDecorate %13 Binding 0
OpDecorate %13 NonWritable
OpDecorate %15 Flat
OpDecorate %15 Location 0
OpDecorate %19 Location 0
OpDecorate %29 NonUniform
OpDecorate %24 NonUniform
OpDecorate %32 NonUniform
OpDecorate %34 NonUniform
OpDecorate %38 NonUniform
OpDecorate %42 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeRuntimeArray %5
%10 = OpTypeStruct %9
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer StorageBuffer %11
%13 = OpVariable %12 StorageBuffer
%14 = OpTypePointer Input %5
%15 = OpVariable %14 Input
%16 = OpTypeFloat 32
%17 = OpTypeVector %16 4
%18 = OpTypePointer Output %17
%19 = OpVariable %18 Output
%22 = OpConstant %5 0
%23 = OpTypePointer StorageBuffer %10
%25 = OpTypePointer PushConstant %5
%27 = OpConstant %5 4
%31 = OpTypePointer StorageBuffer %5
%36 = OpConstant %5 1
%40 = OpConstant %5 2
%44 = OpConstant %5 3
%46 = OpTypeVector %5 4
%53 = OpTypePointer Output %16
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %58
%58 = OpLabel
%20 = OpLoad %5 %15
%21 = OpIAdd %5 %20 %22
%26 = OpAccessChain %25 %8 %27
%28 = OpLoad %5 %26
%29 = OpIAdd %5 %28 %21
%24 = OpAccessChain %23 %13 %29
%30 = OpIMul %5 %20 %27
%32 = OpAccessChain %31 %24 %22 %30
%33 = OpLoad %5 %32
%35 = OpIAdd %5 %30 %36
%34 = OpAccessChain %31 %24 %22 %35
%37 = OpLoad %5 %34
%39 = OpIAdd %5 %30 %40
%38 = OpAccessChain %31 %24 %22 %39
%41 = OpLoad %5 %38
%43 = OpIAdd %5 %30 %44
%42 = OpAccessChain %31 %24 %22 %43
%45 = OpLoad %5 %42
%47 = OpCompositeConstruct %46 %33 %37 %41 %45
%48 = OpBitcast %17 %47
%49 = OpCompositeExtract %16 %48 0
%50 = OpCompositeExtract %16 %48 1
%51 = OpCompositeExtract %16 %48 2
%52 = OpCompositeExtract %16 %48 3
%54 = OpAccessChain %53 %19 %22
OpStore %54 %49
%55 = OpAccessChain %53 %19 %36
OpStore %55 %50
%56 = OpAccessChain %53 %19 %40
OpStore %56 %51
%57 = OpAccessChain %53 %19 %44
OpStore %57 %52
OpReturn
OpFunctionEnd
#endif
