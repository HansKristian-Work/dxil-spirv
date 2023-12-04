#version 460
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, std430) buffer SSBO
{
    uvec4 _m0[];
} _18[];

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

layout(set = 7, binding = 0, r32ui) uniform uimageBuffer _12[];

layout(location = 0) flat in uint I;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _33 = imageAtomicAdd(_12[14u], int(0u), 1u);
    vec4 _38 = uintBitsToFloat(_18[14u]._m0[_33]);
    SV_Target.x = _38.x;
    SV_Target.y = _38.y;
    SV_Target.z = _38.z;
    SV_Target.w = _38.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 52
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %20 %24
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %15 "SSBO"
OpName %20 "I"
OpName %24 "SV_Target"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %12 DescriptorSet 7
OpDecorate %12 Binding 0
OpDecorate %14 ArrayStride 16
OpMemberDecorate %15 0 Offset 0
OpDecorate %15 Block
OpDecorate %18 DescriptorSet 0
OpDecorate %18 Binding 0
OpDecorate %20 Flat
OpDecorate %20 Location 0
OpDecorate %24 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%10 = OpTypeRuntimeArray %9
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpTypeVector %5 4
%14 = OpTypeRuntimeArray %13
%15 = OpTypeStruct %14
%16 = OpTypeRuntimeArray %15
%17 = OpTypePointer StorageBuffer %16
%18 = OpVariable %17 StorageBuffer
%19 = OpTypePointer Input %5
%20 = OpVariable %19 Input
%21 = OpTypeFloat 32
%22 = OpTypeVector %21 4
%23 = OpTypePointer Output %22
%24 = OpVariable %23 Output
%25 = OpTypePointer StorageBuffer %15
%27 = OpConstant %5 14
%28 = OpTypePointer UniformConstant %9
%30 = OpTypePointer Image %5
%32 = OpConstant %5 0
%34 = OpConstant %5 1
%35 = OpTypePointer StorageBuffer %13
%43 = OpTypePointer Output %21
%47 = OpConstant %5 2
%49 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %50
%50 = OpLabel
%26 = OpAccessChain %25 %18 %27
%29 = OpAccessChain %28 %12 %27
%31 = OpImageTexelPointer %30 %29 %32 %32
%33 = OpAtomicIAdd %5 %31 %34 %32 %34
%36 = OpAccessChain %35 %26 %32 %33
%37 = OpLoad %13 %36
%38 = OpBitcast %22 %37
%39 = OpCompositeExtract %21 %38 0
%40 = OpCompositeExtract %21 %38 1
%41 = OpCompositeExtract %21 %38 2
%42 = OpCompositeExtract %21 %38 3
%44 = OpAccessChain %43 %24 %32
OpStore %44 %39
%45 = OpAccessChain %43 %24 %34
OpStore %45 %40
%46 = OpAccessChain %43 %24 %47
OpStore %46 %41
%48 = OpAccessChain %43 %24 %49
OpStore %48 %42
OpReturn
OpFunctionEnd
#endif
