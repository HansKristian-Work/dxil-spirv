#version 460
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#extension GL_EXT_shader_16bit_storage : require
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_buffer_reference_uvec2 : require

layout(buffer_reference) buffer PhysicalPointerFloatNonWriteArray;
layout(buffer_reference) buffer PhysicalPointerFloatArray;

float _49;

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
    uint16_t _24 = uint16_t(A);
    uint _25 = uint(int16_t(_24));
    mediump float _35 = PhysicalPointerFloatNonWriteArray(registers._m1).value[_25];
    mediump float _42 = PhysicalPointerFloatNonWriteArray(registers._m1).value[uint(int16_t(_24 + 1us))];
    PhysicalPointerFloatArray(registers._m2).value[_25] = _42 + _35;
    SV_Target = int(10u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 54
; Schema: 0
OpCapability Shader
OpCapability Int16
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
OpName %28 "PhysicalPointerFloatNonWriteArray"
OpMemberName %28 0 "value"
OpName %45 "PhysicalPointerFloatArray"
OpMemberName %45 0 "value"
OpDecorate %7 Block
OpMemberDecorate %7 0 Offset 0
OpMemberDecorate %7 1 Offset 8
OpMemberDecorate %7 2 Offset 16
OpMemberDecorate %7 3 Offset 24
OpDecorate %12 RelaxedPrecision
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %14 Location 0
OpDecorate %27 ArrayStride 4
OpMemberDecorate %28 0 Offset 0
OpDecorate %28 Block
OpMemberDecorate %28 0 NonWritable
OpDecorate %35 RelaxedPrecision
OpDecorate %42 RelaxedPrecision
OpDecorate %43 RelaxedPrecision
OpDecorate %44 ArrayStride 4
OpMemberDecorate %45 0 Offset 0
OpDecorate %45 Block
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
%23 = OpTypeInt 16 0
%26 = OpTypeFloat 32
%27 = OpTypeRuntimeArray %26
%28 = OpTypeStruct %27
%29 = OpTypePointer PhysicalStorageBuffer %28
%31 = OpTypePointer PhysicalStorageBuffer %26
%33 = OpConstant %5 0
%37 = OpConstant %23 1
%44 = OpTypeRuntimeArray %26
%45 = OpTypeStruct %44
%46 = OpTypePointer PhysicalStorageBuffer %45
%50 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
%49 = OpUndef %26
OpBranch %52
%52 = OpLabel
%16 = OpAccessChain %15 %9 %17
%18 = OpLoad %6 %16
%19 = OpAccessChain %15 %9 %20
%21 = OpLoad %6 %19
%22 = OpLoad %10 %12
%24 = OpSConvert %23 %22
%25 = OpSConvert %5 %24
%30 = OpBitcast %29 %21
%32 = OpInBoundsAccessChain %31 %30 %33 %25
%34 = OpLoad %26 %32 Aligned 4
%35 = OpCopyObject %26 %34
%36 = OpIAdd %23 %24 %37
%38 = OpSConvert %5 %36
%39 = OpBitcast %29 %21
%40 = OpInBoundsAccessChain %31 %39 %33 %38
%41 = OpLoad %26 %40 Aligned 4
%42 = OpCopyObject %26 %41
%43 = OpFAdd %26 %42 %35
%47 = OpBitcast %46 %18
%48 = OpInBoundsAccessChain %31 %47 %33 %25
OpStore %48 %43 Aligned 4
%51 = OpBitcast %10 %50
OpStore %14 %51
OpReturn
OpFunctionEnd
#endif
