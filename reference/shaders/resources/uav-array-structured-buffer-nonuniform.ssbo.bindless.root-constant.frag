#version 460
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 4, binding = 0, std430) readonly buffer SSBO
{
    uvec4 _m0[];
} _14[];

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
    vec4 _34 = uintBitsToFloat(_14[nonuniformEXT(registers._m4 + (INDEX + 0u))]._m0[INDEX]);
    SV_Target.x = _34.x;
    SV_Target.y = _34.y;
    SV_Target.z = _34.z;
    SV_Target.w = _34.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 49
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %16 %20
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %11 "SSBO"
OpName %16 "INDEX"
OpName %20 "SV_Target"
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
OpDecorate %10 ArrayStride 16
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %14 DescriptorSet 4
OpDecorate %14 Binding 0
OpDecorate %14 NonWritable
OpDecorate %16 Flat
OpDecorate %16 Location 0
OpDecorate %20 Location 0
OpDecorate %30 NonUniform
OpDecorate %25 NonUniform
OpDecorate %32 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeVector %5 4
%10 = OpTypeRuntimeArray %9
%11 = OpTypeStruct %10
%12 = OpTypeRuntimeArray %11
%13 = OpTypePointer StorageBuffer %12
%14 = OpVariable %13 StorageBuffer
%15 = OpTypePointer Input %5
%16 = OpVariable %15 Input
%17 = OpTypeFloat 32
%18 = OpTypeVector %17 4
%19 = OpTypePointer Output %18
%20 = OpVariable %19 Output
%23 = OpConstant %5 0
%24 = OpTypePointer StorageBuffer %11
%26 = OpTypePointer PushConstant %5
%28 = OpConstant %5 4
%31 = OpTypePointer StorageBuffer %9
%39 = OpTypePointer Output %17
%42 = OpConstant %5 1
%44 = OpConstant %5 2
%46 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %47
%47 = OpLabel
%21 = OpLoad %5 %16
%22 = OpIAdd %5 %21 %23
%27 = OpAccessChain %26 %8 %28
%29 = OpLoad %5 %27
%30 = OpIAdd %5 %29 %22
%25 = OpAccessChain %24 %14 %30
%32 = OpAccessChain %31 %25 %23 %21
%33 = OpLoad %9 %32
%34 = OpBitcast %18 %33
%35 = OpCompositeExtract %17 %34 0
%36 = OpCompositeExtract %17 %34 1
%37 = OpCompositeExtract %17 %34 2
%38 = OpCompositeExtract %17 %34 3
%40 = OpAccessChain %39 %20 %23
OpStore %40 %35
%41 = OpAccessChain %39 %20 %42
OpStore %41 %36
%43 = OpAccessChain %39 %20 %44
OpStore %43 %37
%45 = OpAccessChain %39 %20 %46
OpStore %45 %38
OpReturn
OpFunctionEnd
#endif
