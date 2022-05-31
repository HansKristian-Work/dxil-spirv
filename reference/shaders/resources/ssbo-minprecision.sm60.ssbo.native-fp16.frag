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

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(set = 0, binding = 1, std430) restrict readonly buffer _11_13
{
    uint _m0[];
} _13;

layout(set = 0, binding = 0, std430) writeonly buffer _15_17
{
    uint _m0[];
} _17;

layout(set = 0, binding = 1, std430) writeonly buffer _19_21
{
    uint _m0[];
} _21;

layout(location = 0) flat in mediump int A;
layout(location = 0) out int SV_Target;

void main()
{
    uint16_t _29 = uint16_t(A);
    uint _30 = uint(int16_t(_29));
    uint _41 = uint(int16_t(_29 + 1us));
    _17._m0[_30] = floatBitsToUint(float(float16_t(uintBitsToFloat(_9._m0[_41])) + float16_t(uintBitsToFloat(_9._m0[_30]))));
    _21._m0[_30] = uint(uint16_t(_13._m0[_41]) + uint16_t(_13._m0[_30]));
    SV_Target = int(10u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 63
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %24 %26
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %11 "SSBO"
OpName %15 "SSBO"
OpName %19 "SSBO"
OpName %24 "A"
OpName %26 "SV_Target"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonWritable
OpDecorate %9 Restrict
OpDecorate %10 ArrayStride 4
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 1
OpDecorate %13 NonWritable
OpDecorate %13 Restrict
OpDecorate %14 ArrayStride 4
OpMemberDecorate %15 0 Offset 0
OpDecorate %15 Block
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %17 NonReadable
OpDecorate %18 ArrayStride 4
OpMemberDecorate %19 0 Offset 0
OpDecorate %19 Block
OpDecorate %21 DescriptorSet 0
OpDecorate %21 Binding 1
OpDecorate %21 NonReadable
OpDecorate %24 RelaxedPrecision
OpDecorate %24 Flat
OpDecorate %24 Location 0
OpDecorate %26 Location 0
OpDecorate %46 RelaxedPrecision
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypePointer StorageBuffer %7
%9 = OpVariable %8 StorageBuffer
%10 = OpTypeRuntimeArray %5
%11 = OpTypeStruct %10
%12 = OpTypePointer StorageBuffer %11
%13 = OpVariable %12 StorageBuffer
%14 = OpTypeRuntimeArray %5
%15 = OpTypeStruct %14
%16 = OpTypePointer StorageBuffer %15
%17 = OpVariable %16 StorageBuffer
%18 = OpTypeRuntimeArray %5
%19 = OpTypeStruct %18
%20 = OpTypePointer StorageBuffer %19
%21 = OpVariable %20 StorageBuffer
%22 = OpTypeInt 32 1
%23 = OpTypePointer Input %22
%24 = OpVariable %23 Input
%25 = OpTypePointer Output %22
%26 = OpVariable %25 Output
%28 = OpTypeInt 16 0
%31 = OpTypePointer StorageBuffer %5
%33 = OpConstant %5 0
%35 = OpTypeFloat 32
%37 = OpTypeFloat 16
%40 = OpConstant %28 1
%59 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %61
%61 = OpLabel
%27 = OpLoad %22 %24
%29 = OpSConvert %28 %27
%30 = OpSConvert %5 %29
%32 = OpAccessChain %31 %9 %33 %30
%34 = OpLoad %5 %32
%36 = OpBitcast %35 %34
%38 = OpFConvert %37 %36
%39 = OpIAdd %28 %29 %40
%41 = OpSConvert %5 %39
%42 = OpAccessChain %31 %9 %33 %41
%43 = OpLoad %5 %42
%44 = OpBitcast %35 %43
%45 = OpFConvert %37 %44
%46 = OpFAdd %37 %45 %38
%47 = OpFConvert %35 %46
%48 = OpBitcast %5 %47
%49 = OpAccessChain %31 %17 %33 %30
OpStore %49 %48
%50 = OpAccessChain %31 %13 %33 %30
%51 = OpLoad %5 %50
%52 = OpUConvert %28 %51
%53 = OpAccessChain %31 %13 %33 %41
%54 = OpLoad %5 %53
%55 = OpUConvert %28 %54
%56 = OpIAdd %28 %55 %52
%57 = OpUConvert %5 %56
%58 = OpAccessChain %31 %21 %33 %30
OpStore %58 %57
%60 = OpBitcast %22 %59
OpStore %26 %60
OpReturn
OpFunctionEnd
#endif
