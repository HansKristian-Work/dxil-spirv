#version 460
#extension GL_ARB_gpu_shader_int64 : require
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_buffer_reference_uvec2 : require

layout(buffer_reference) buffer PhysicalPointerFloatNonWriteCBVArray;
layout(buffer_reference) buffer PhysicalPointerUint64NonWriteCBVArray;
layout(buffer_reference) buffer PhysicalPointerHalfNonWriteCBVArray;
layout(buffer_reference, buffer_reference_align = 4, std430) readonly buffer PhysicalPointerFloatNonWriteCBVArray
{
    float value[16384];
};

layout(buffer_reference, buffer_reference_align = 8, std430) readonly buffer PhysicalPointerUint64NonWriteCBVArray
{
    uint64_t value[8192];
};

layout(buffer_reference, buffer_reference_align = 2, std430) readonly buffer PhysicalPointerHalfNonWriteCBVArray
{
    float16_t value[32768];
};

layout(push_constant, std430) uniform RootConstants
{
    uvec2 _m0;
    uvec2 _m1;
    uvec2 _m2;
    uvec2 _m3;
} registers;

layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = (float(int64_t(PhysicalPointerUint64NonWriteCBVArray(registers._m0).value[4u])) + PhysicalPointerFloatNonWriteCBVArray(registers._m0).value[0u]) + float(PhysicalPointerHalfNonWriteCBVArray(registers._m0).value[8u]);
    SV_Target.y = (float(int64_t(PhysicalPointerUint64NonWriteCBVArray(registers._m0).value[5u])) + PhysicalPointerFloatNonWriteCBVArray(registers._m0).value[1u]) + float(PhysicalPointerHalfNonWriteCBVArray(registers._m0).value[10u]);
    SV_Target.z = (float(int64_t(PhysicalPointerUint64NonWriteCBVArray(registers._m0).value[6u])) + PhysicalPointerFloatNonWriteCBVArray(registers._m0).value[2u]) + float(PhysicalPointerHalfNonWriteCBVArray(registers._m0).value[12u]);
    SV_Target.w = (float(int64_t(PhysicalPointerUint64NonWriteCBVArray(registers._m0).value[7u])) + PhysicalPointerFloatNonWriteCBVArray(registers._m0).value[3u]) + float(PhysicalPointerHalfNonWriteCBVArray(registers._m0).value[14u]);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 105
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int64
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "RootConstants"
OpName %9 "registers"
OpName %13 "SV_Target"
OpName %20 "PhysicalPointerFloatNonWriteCBVArray"
OpMemberName %20 0 "value"
OpName %42 "PhysicalPointerUint64NonWriteCBVArray"
OpMemberName %42 0 "value"
OpName %72 "PhysicalPointerHalfNonWriteCBVArray"
OpMemberName %72 0 "value"
OpDecorate %7 Block
OpMemberDecorate %7 0 Offset 0
OpMemberDecorate %7 1 Offset 8
OpMemberDecorate %7 2 Offset 16
OpMemberDecorate %7 3 Offset 24
OpDecorate %13 Location 0
OpDecorate %19 ArrayStride 4
OpMemberDecorate %20 0 Offset 0
OpDecorate %20 Block
OpMemberDecorate %20 0 NonWritable
OpDecorate %41 ArrayStride 8
OpMemberDecorate %42 0 Offset 0
OpDecorate %42 Block
OpMemberDecorate %42 0 NonWritable
OpDecorate %71 ArrayStride 2
OpMemberDecorate %72 0 Offset 0
OpDecorate %72 Block
OpMemberDecorate %72 0 NonWritable
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypeStruct %6 %6 %6 %6
%8 = OpTypePointer PushConstant %7
%9 = OpVariable %8 PushConstant
%10 = OpTypeFloat 32
%11 = OpTypeVector %10 4
%12 = OpTypePointer Output %11
%13 = OpVariable %12 Output
%14 = OpTypePointer PushConstant %6
%16 = OpConstant %5 0
%18 = OpConstant %5 16384
%19 = OpTypeArray %10 %18
%20 = OpTypeStruct %19
%21 = OpTypePointer PhysicalStorageBuffer %20
%23 = OpTypePointer PhysicalStorageBuffer %10
%26 = OpConstant %5 1
%30 = OpConstant %5 2
%34 = OpConstant %5 3
%38 = OpTypeInt 64 0
%39 = OpConstant %5 4
%40 = OpConstant %5 8192
%41 = OpTypeArray %38 %40
%42 = OpTypeStruct %41
%43 = OpTypePointer PhysicalStorageBuffer %42
%45 = OpTypePointer PhysicalStorageBuffer %38
%48 = OpConstant %5 5
%52 = OpConstant %5 6
%56 = OpConstant %5 7
%68 = OpTypeFloat 16
%69 = OpConstant %5 8
%70 = OpConstant %5 32768
%71 = OpTypeArray %68 %70
%72 = OpTypeStruct %71
%73 = OpTypePointer PhysicalStorageBuffer %72
%75 = OpTypePointer PhysicalStorageBuffer %68
%78 = OpConstant %5 10
%82 = OpConstant %5 12
%86 = OpConstant %5 14
%98 = OpTypePointer Output %10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %103
%103 = OpLabel
%15 = OpAccessChain %14 %9 %16
%17 = OpLoad %6 %15
%22 = OpBitcast %21 %17
%24 = OpInBoundsAccessChain %23 %22 %16 %16
%25 = OpLoad %10 %24 Aligned 4
%27 = OpBitcast %21 %17
%28 = OpInBoundsAccessChain %23 %27 %16 %26
%29 = OpLoad %10 %28 Aligned 4
%31 = OpBitcast %21 %17
%32 = OpInBoundsAccessChain %23 %31 %16 %30
%33 = OpLoad %10 %32 Aligned 4
%35 = OpBitcast %21 %17
%36 = OpInBoundsAccessChain %23 %35 %16 %34
%37 = OpLoad %10 %36 Aligned 4
%44 = OpBitcast %43 %17
%46 = OpInBoundsAccessChain %45 %44 %16 %39
%47 = OpLoad %38 %46 Aligned 8
%49 = OpBitcast %43 %17
%50 = OpInBoundsAccessChain %45 %49 %16 %48
%51 = OpLoad %38 %50 Aligned 8
%53 = OpBitcast %43 %17
%54 = OpInBoundsAccessChain %45 %53 %16 %52
%55 = OpLoad %38 %54 Aligned 8
%57 = OpBitcast %43 %17
%58 = OpInBoundsAccessChain %45 %57 %16 %56
%59 = OpLoad %38 %58 Aligned 8
%60 = OpConvertSToF %10 %47
%61 = OpConvertSToF %10 %51
%62 = OpConvertSToF %10 %55
%63 = OpConvertSToF %10 %59
%64 = OpFAdd %10 %60 %25
%65 = OpFAdd %10 %61 %29
%66 = OpFAdd %10 %62 %33
%67 = OpFAdd %10 %63 %37
%74 = OpBitcast %73 %17
%76 = OpInBoundsAccessChain %75 %74 %16 %69
%77 = OpLoad %68 %76 Aligned 2
%79 = OpBitcast %73 %17
%80 = OpInBoundsAccessChain %75 %79 %16 %78
%81 = OpLoad %68 %80 Aligned 2
%83 = OpBitcast %73 %17
%84 = OpInBoundsAccessChain %75 %83 %16 %82
%85 = OpLoad %68 %84 Aligned 2
%87 = OpBitcast %73 %17
%88 = OpInBoundsAccessChain %75 %87 %16 %86
%89 = OpLoad %68 %88 Aligned 2
%90 = OpFConvert %10 %77
%91 = OpFConvert %10 %81
%92 = OpFConvert %10 %85
%93 = OpFConvert %10 %89
%94 = OpFAdd %10 %64 %90
%95 = OpFAdd %10 %65 %91
%96 = OpFAdd %10 %66 %92
%97 = OpFAdd %10 %67 %93
%99 = OpAccessChain %98 %13 %16
OpStore %99 %94
%100 = OpAccessChain %98 %13 %26
OpStore %100 %95
%101 = OpAccessChain %98 %13 %30
OpStore %101 %96
%102 = OpAccessChain %98 %13 %34
OpStore %102 %97
OpReturn
OpFunctionEnd
#endif
