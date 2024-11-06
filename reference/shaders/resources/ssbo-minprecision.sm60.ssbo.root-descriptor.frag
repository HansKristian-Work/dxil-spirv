#version 460
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#extension GL_EXT_shader_16bit_storage : require
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_buffer_reference_uvec2 : require

float _47;

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
    uint16_t _24 = uint16_t(A);
    uint _25 = uint(int16_t(_24));
    float _34 = PhysicalPointerFloatNonWriteArray(registers._m1).value[_25];
    mediump float mp_copy_34 = _34;
    float _40 = PhysicalPointerFloatNonWriteArray(registers._m1).value[uint(int16_t(_24 + 1us))];
    mediump float mp_copy_40 = _40;
    PhysicalPointerFloatArray(registers._m2).value[_25] = mp_copy_40 + mp_copy_34;
    SV_Target = int(10u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 52
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
OpName %43 "PhysicalPointerFloatArray"
OpMemberName %43 0 "value"
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
OpDecorate %41 RelaxedPrecision
OpDecorate %42 ArrayStride 4
OpMemberDecorate %43 0 Offset 0
OpDecorate %43 Block
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
%36 = OpConstant %23 1
%42 = OpTypeRuntimeArray %26
%43 = OpTypeStruct %42
%44 = OpTypePointer PhysicalStorageBuffer %43
%48 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
%47 = OpUndef %26
OpBranch %50
%50 = OpLabel
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
%35 = OpIAdd %23 %24 %36
%37 = OpSConvert %5 %35
%38 = OpBitcast %29 %21
%39 = OpInBoundsAccessChain %31 %38 %33 %37
%40 = OpLoad %26 %39 Aligned 4
%41 = OpFAdd %26 %40 %34
%45 = OpBitcast %44 %18
%46 = OpInBoundsAccessChain %31 %45 %33 %25
OpStore %46 %41 Aligned 4
%49 = OpBitcast %10 %48
OpStore %14 %49
OpReturn
OpFunctionEnd
#endif
