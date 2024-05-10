#version 460
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#extension GL_EXT_shader_16bit_storage : require
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_buffer_reference_uvec2 : require

float16_t _57;
uint16_t _73;

layout(buffer_reference) buffer PhysicalPointerFloatNonWriteArray;
layout(buffer_reference) buffer PhysicalPointerFloatArray;
layout(buffer_reference) buffer PhysicalPointerUintArray;
layout(buffer_reference, buffer_reference_align = 4, std430) readonly buffer PhysicalPointerFloatNonWriteArray
{
    float value[];
};

layout(buffer_reference, buffer_reference_align = 4, std430) buffer PhysicalPointerFloatArray
{
    float value[];
};

layout(buffer_reference, buffer_reference_align = 4, std430) buffer PhysicalPointerUintArray
{
    uint value[];
};

layout(set = 0, binding = 1, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _13;

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
    uint16_t _31 = uint16_t(A);
    uint _32 = uint(int16_t(_31));
    uint _46 = uint(int16_t(_31 + 1us));
    PhysicalPointerFloatArray(registers._m2).value[_32] = float(float16_t(PhysicalPointerFloatNonWriteArray(registers._m1).value[_46]) + float16_t(PhysicalPointerFloatNonWriteArray(registers._m1).value[_32]));
    PhysicalPointerUintArray(registers._m3).value[_32] = uint(uint16_t(_13._m0[_46]) + uint16_t(_13._m0[_32]));
    SV_Target = int(10u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 79
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability DenormPreserve
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_KHR_float_controls"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %16 %18
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %7 "RootConstants"
OpName %9 "registers"
OpName %11 "SSBO"
OpName %16 "A"
OpName %18 "SV_Target"
OpName %35 "PhysicalPointerFloatNonWriteArray"
OpMemberName %35 0 "value"
OpName %53 "PhysicalPointerFloatArray"
OpMemberName %53 0 "value"
OpName %68 "PhysicalPointerUintArray"
OpMemberName %68 0 "value"
OpDecorate %7 Block
OpMemberDecorate %7 0 Offset 0
OpMemberDecorate %7 1 Offset 8
OpMemberDecorate %7 2 Offset 16
OpMemberDecorate %7 3 Offset 24
OpDecorate %10 ArrayStride 4
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 1
OpDecorate %13 NonWritable
OpDecorate %13 Restrict
OpDecorate %16 RelaxedPrecision
OpDecorate %16 Flat
OpDecorate %16 Location 0
OpDecorate %18 Location 0
OpDecorate %34 ArrayStride 4
OpMemberDecorate %35 0 Offset 0
OpDecorate %35 Block
OpMemberDecorate %35 0 NonWritable
OpDecorate %52 ArrayStride 4
OpMemberDecorate %53 0 Offset 0
OpDecorate %53 Block
OpDecorate %67 ArrayStride 4
OpMemberDecorate %68 0 Offset 0
OpDecorate %68 Block
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypeStruct %6 %6 %6 %6
%8 = OpTypePointer PushConstant %7
%9 = OpVariable %8 PushConstant
%10 = OpTypeRuntimeArray %5
%11 = OpTypeStruct %10
%12 = OpTypePointer StorageBuffer %11
%13 = OpVariable %12 StorageBuffer
%14 = OpTypeInt 32 1
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpTypePointer Output %14
%18 = OpVariable %17 Output
%19 = OpTypePointer PushConstant %6
%21 = OpConstant %5 3
%24 = OpConstant %5 2
%27 = OpConstant %5 1
%30 = OpTypeInt 16 0
%33 = OpTypeFloat 32
%34 = OpTypeRuntimeArray %33
%35 = OpTypeStruct %34
%36 = OpTypePointer PhysicalStorageBuffer %35
%38 = OpTypePointer PhysicalStorageBuffer %33
%40 = OpConstant %5 0
%42 = OpTypeFloat 16
%45 = OpConstant %30 1
%52 = OpTypeRuntimeArray %33
%53 = OpTypeStruct %52
%54 = OpTypePointer PhysicalStorageBuffer %53
%59 = OpTypePointer StorageBuffer %5
%67 = OpTypeRuntimeArray %5
%68 = OpTypeStruct %67
%69 = OpTypePointer PhysicalStorageBuffer %68
%71 = OpTypePointer PhysicalStorageBuffer %5
%75 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
%57 = OpUndef %42
%73 = OpUndef %30
OpBranch %77
%77 = OpLabel
%20 = OpAccessChain %19 %9 %21
%22 = OpLoad %6 %20
%23 = OpAccessChain %19 %9 %24
%25 = OpLoad %6 %23
%26 = OpAccessChain %19 %9 %27
%28 = OpLoad %6 %26
%29 = OpLoad %14 %16
%31 = OpSConvert %30 %29
%32 = OpSConvert %5 %31
%37 = OpBitcast %36 %28
%39 = OpInBoundsAccessChain %38 %37 %40 %32
%41 = OpLoad %33 %39 Aligned 4
%43 = OpFConvert %42 %41
%44 = OpIAdd %30 %31 %45
%46 = OpSConvert %5 %44
%47 = OpBitcast %36 %28
%48 = OpInBoundsAccessChain %38 %47 %40 %46
%49 = OpLoad %33 %48 Aligned 4
%50 = OpFConvert %42 %49
%51 = OpFAdd %42 %50 %43
%55 = OpBitcast %54 %25
%56 = OpInBoundsAccessChain %38 %55 %40 %32
%58 = OpFConvert %33 %51
OpStore %56 %58 Aligned 4
%60 = OpAccessChain %59 %13 %40 %32
%61 = OpLoad %5 %60
%62 = OpUConvert %30 %61
%63 = OpAccessChain %59 %13 %40 %46
%64 = OpLoad %5 %63
%65 = OpUConvert %30 %64
%66 = OpIAdd %30 %65 %62
%70 = OpBitcast %69 %22
%72 = OpInBoundsAccessChain %71 %70 %40 %32
%74 = OpUConvert %5 %66
OpStore %72 %74 Aligned 4
%76 = OpBitcast %14 %75
OpStore %18 %76
OpReturn
OpFunctionEnd
#endif
