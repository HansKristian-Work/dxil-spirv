#version 460
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_buffer_reference_uvec2 : require

float _43;

layout(buffer_reference) buffer PhysicalPointerFloatNonWriteArray;
layout(buffer_reference) buffer PhysicalPointerFloatArray;
layout(buffer_reference, buffer_reference_align = 4, std430) readonly buffer PhysicalPointerFloatNonWriteArray
{
    float value[];
};

layout(buffer_reference, buffer_reference_align = 4, std430) buffer PhysicalPointerFloatArray
{
    float value[];
};

layout(push_constant, std430) uniform RootConstants
{
    uvec2 _m0;
    uvec2 _m1;
    uvec2 _m2;
    uvec2 _m3;
} registers;

layout(location = 0) flat in mediump int A;
layout(location = 0) out int SV_Target;

void main()
{
    uint _23 = uint(A);
    float _32 = PhysicalPointerFloatNonWriteArray(registers._m1).value[_23];
    mediump float mp_copy_32 = _32;
    float _36 = PhysicalPointerFloatNonWriteArray(registers._m1).value[_23 + 1u];
    mediump float mp_copy_36 = _36;
    PhysicalPointerFloatArray(registers._m2).value[_23] = mp_copy_36 + mp_copy_32;
    SV_Target = int(10u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 48
; Schema: 0
OpCapability Shader
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %12 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "RootConstants"
OpName %9 "registers"
OpName %12 "A"
OpName %14 "SV_Target"
OpName %26 "PhysicalPointerFloatNonWriteArray"
OpMemberName %26 0 "value"
OpName %39 "PhysicalPointerFloatArray"
OpMemberName %39 0 "value"
OpDecorate %7 Block
OpMemberDecorate %7 0 Offset 0
OpMemberDecorate %7 1 Offset 8
OpMemberDecorate %7 2 Offset 16
OpMemberDecorate %7 3 Offset 24
OpDecorate %12 RelaxedPrecision
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %14 Location 0
OpDecorate %25 ArrayStride 4
OpMemberDecorate %26 0 Offset 0
OpDecorate %26 Block
OpMemberDecorate %26 0 NonWritable
OpDecorate %37 RelaxedPrecision
OpDecorate %38 ArrayStride 4
OpMemberDecorate %39 0 Offset 0
OpDecorate %39 Block
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypeStruct %6 %6 %6 %6
%8 = OpTypePointer PushConstant %7
%9 = OpVariable %8 PushConstant
%10 = OpTypeInt 32 1
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypePointer Output %10
%14 = OpVariable %13 Output
%15 = OpTypePointer PushConstant %6
%17 = OpConstant %5 2
%20 = OpConstant %5 1
%24 = OpTypeFloat 32
%25 = OpTypeRuntimeArray %24
%26 = OpTypeStruct %25
%27 = OpTypePointer PhysicalStorageBuffer %26
%29 = OpTypePointer PhysicalStorageBuffer %24
%31 = OpConstant %5 0
%38 = OpTypeRuntimeArray %24
%39 = OpTypeStruct %38
%40 = OpTypePointer PhysicalStorageBuffer %39
%44 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
%43 = OpUndef %24
OpBranch %46
%46 = OpLabel
%16 = OpAccessChain %15 %9 %17
%18 = OpLoad %6 %16
%19 = OpAccessChain %15 %9 %20
%21 = OpLoad %6 %19
%22 = OpLoad %10 %12
%23 = OpBitcast %5 %22
%28 = OpBitcast %27 %21
%30 = OpInBoundsAccessChain %29 %28 %31 %23
%32 = OpLoad %24 %30 Aligned 4
%33 = OpIAdd %5 %23 %20
%34 = OpBitcast %27 %21
%35 = OpInBoundsAccessChain %29 %34 %31 %33
%36 = OpLoad %24 %35 Aligned 4
%37 = OpFAdd %24 %36 %32
%41 = OpBitcast %40 %18
%42 = OpInBoundsAccessChain %29 %41 %31 %23
OpStore %42 %37 Aligned 4
%45 = OpBitcast %10 %44
OpStore %14 %45
OpReturn
OpFunctionEnd
#endif
