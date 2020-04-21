#version 460
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require

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

layout(set = 3, binding = 0, r32ui) uniform uimage2D _12[];

layout(location = 0) flat in uint INDEX;
layout(location = 0, component = 1) flat in uvec3 TEXCOORD;
layout(location = 0) out uint SV_Target;

void main()
{
    uint _41 = imageAtomicAdd(_12[nonuniformEXT(registers._m3 + (INDEX + 2u))], ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 3u);
    SV_Target = _41;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 44
; Schema: 0
OpCapability Shader
OpCapability StorageImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageImageArrayNonUniformIndexing
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %14 %17 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %14 "INDEX"
OpName %17 "TEXCOORD"
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
OpDecorate %12 DescriptorSet 3
OpDecorate %12 Binding 0
OpDecorate %14 Flat
OpDecorate %14 Location 0
OpDecorate %17 Flat
OpDecorate %17 Location 0
OpDecorate %17 Component 1
OpDecorate %19 Location 0
OpDecorate %27 NonUniform
OpDecorate %36 NonUniform
OpDecorate %40 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeImage %5 2D 0 0 0 2 R32ui
%10 = OpTypeRuntimeArray %9
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpTypePointer Input %5
%14 = OpVariable %13 Input
%15 = OpTypeVector %5 3
%16 = OpTypePointer Input %15
%17 = OpVariable %16 Input
%18 = OpTypePointer Output %5
%19 = OpVariable %18 Output
%21 = OpConstant %5 0
%24 = OpConstant %5 1
%28 = OpConstant %5 2
%29 = OpTypePointer UniformConstant %9
%31 = OpTypePointer PushConstant %5
%33 = OpConstant %5 3
%37 = OpTypeVector %5 2
%39 = OpTypePointer Image %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %42
%42 = OpLabel
%20 = OpAccessChain %13 %17 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %13 %17 %24
%25 = OpLoad %5 %23
%26 = OpLoad %5 %14
%27 = OpIAdd %5 %26 %28
%32 = OpAccessChain %31 %8 %33
%34 = OpLoad %5 %32
%35 = OpIAdd %5 %34 %27
%30 = OpAccessChain %29 %12 %35
%36 = OpLoad %9 %30
%38 = OpCompositeConstruct %37 %22 %25
%40 = OpImageTexelPointer %39 %30 %38 %21
%41 = OpAtomicIAdd %5 %40 %24 %21 %33
OpStore %19 %41
OpReturn
OpFunctionEnd
#endif
