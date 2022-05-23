#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#extension GL_ARB_gpu_shader_int64 : require
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_buffer_reference_uvec2 : require

layout(buffer_reference) buffer PhysicalPointerFloat4NonWriteCBVArray;
layout(buffer_reference) buffer PhysicalPointerUint642NonWriteCBVArray;
layout(buffer_reference, buffer_reference_align = 16, std430) readonly buffer PhysicalPointerFloat4NonWriteCBVArray
{
    vec4 value[4096];
};

layout(buffer_reference, buffer_reference_align = 16, std430) readonly buffer PhysicalPointerUint642NonWriteCBVArray
{
    u64vec2 value[4096];
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
    PhysicalPointerFloat4NonWriteCBVArray _22 = PhysicalPointerFloat4NonWriteCBVArray(registers._m0);
    f16vec4 _36 = f16vec4(PhysicalPointerFloat4NonWriteCBVArray(registers._m0).value[1u]);
    f16vec4 _53 = f16vec4(PhysicalPointerFloat4NonWriteCBVArray(registers._m0).value[2u]);
    PhysicalPointerUint642NonWriteCBVArray _72 = PhysicalPointerUint642NonWriteCBVArray(registers._m0);
    PhysicalPointerUint642NonWriteCBVArray _79 = PhysicalPointerUint642NonWriteCBVArray(registers._m0);
    SV_Target.x = ((float(_36.x) + _22.value[0u].x) + float(_53.x)) + float(int64_t(_72.value[3u].x));
    SV_Target.y = ((float(_36.y) + _22.value[0u].y) + float(_53.y)) + float(int64_t(_72.value[3u].y));
    SV_Target.z = ((float(_36.z) + _22.value[0u].z) + float(_53.z)) + float(int64_t(_79.value[4u].x));
    SV_Target.w = ((float(_36.w) + _22.value[0u].w) + float(_53.w)) + float(int64_t(_79.value[4u].y));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 99
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
OpName %20 "PhysicalPointerFloat4NonWriteCBVArray"
OpMemberName %20 0 "value"
OpName %70 "PhysicalPointerUint642NonWriteCBVArray"
OpMemberName %70 0 "value"
OpDecorate %7 Block
OpMemberDecorate %7 0 Offset 0
OpMemberDecorate %7 1 Offset 8
OpMemberDecorate %7 2 Offset 16
OpMemberDecorate %7 3 Offset 24
OpDecorate %13 Location 0
OpDecorate %19 ArrayStride 16
OpMemberDecorate %20 0 Offset 0
OpDecorate %20 Block
OpMemberDecorate %20 0 NonWritable
OpDecorate %69 ArrayStride 16
OpMemberDecorate %70 0 Offset 0
OpDecorate %70 Block
OpMemberDecorate %70 0 NonWritable
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
%18 = OpConstant %5 4096
%19 = OpTypeArray %11 %18
%20 = OpTypeStruct %19
%21 = OpTypePointer PhysicalStorageBuffer %20
%23 = OpTypePointer PhysicalStorageBuffer %11
%30 = OpConstant %5 1
%34 = OpTypeFloat 16
%35 = OpTypeVector %34 4
%49 = OpConstant %5 2
%66 = OpTypeInt 64 0
%67 = OpConstant %5 3
%68 = OpTypeVector %66 2
%69 = OpTypeArray %68 %18
%70 = OpTypeStruct %69
%71 = OpTypePointer PhysicalStorageBuffer %70
%73 = OpTypePointer PhysicalStorageBuffer %68
%78 = OpConstant %5 4
%92 = OpTypePointer Output %10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %97
%97 = OpLabel
%15 = OpAccessChain %14 %9 %16
%17 = OpLoad %6 %15
%22 = OpBitcast %21 %17
%24 = OpInBoundsAccessChain %23 %22 %16 %16
%25 = OpLoad %11 %24 Aligned 16
%26 = OpCompositeExtract %10 %25 0
%27 = OpCompositeExtract %10 %25 1
%28 = OpCompositeExtract %10 %25 2
%29 = OpCompositeExtract %10 %25 3
%31 = OpBitcast %21 %17
%32 = OpInBoundsAccessChain %23 %31 %16 %30
%33 = OpLoad %11 %32 Aligned 16
%36 = OpFConvert %35 %33
%37 = OpCompositeExtract %34 %36 0
%38 = OpCompositeExtract %34 %36 1
%39 = OpCompositeExtract %34 %36 2
%40 = OpCompositeExtract %34 %36 3
%41 = OpFConvert %10 %37
%42 = OpFConvert %10 %38
%43 = OpFConvert %10 %39
%44 = OpFConvert %10 %40
%45 = OpFAdd %10 %41 %26
%46 = OpFAdd %10 %42 %27
%47 = OpFAdd %10 %43 %28
%48 = OpFAdd %10 %44 %29
%50 = OpBitcast %21 %17
%51 = OpInBoundsAccessChain %23 %50 %16 %49
%52 = OpLoad %11 %51 Aligned 16
%53 = OpFConvert %35 %52
%54 = OpCompositeExtract %34 %53 0
%55 = OpCompositeExtract %34 %53 1
%56 = OpCompositeExtract %34 %53 2
%57 = OpCompositeExtract %34 %53 3
%58 = OpFConvert %10 %54
%59 = OpFConvert %10 %55
%60 = OpFConvert %10 %56
%61 = OpFConvert %10 %57
%62 = OpFAdd %10 %45 %58
%63 = OpFAdd %10 %46 %59
%64 = OpFAdd %10 %47 %60
%65 = OpFAdd %10 %48 %61
%72 = OpBitcast %71 %17
%74 = OpInBoundsAccessChain %73 %72 %16 %67
%75 = OpLoad %68 %74 Aligned 16
%76 = OpCompositeExtract %66 %75 0
%77 = OpCompositeExtract %66 %75 1
%79 = OpBitcast %71 %17
%80 = OpInBoundsAccessChain %73 %79 %16 %78
%81 = OpLoad %68 %80 Aligned 16
%82 = OpCompositeExtract %66 %81 0
%83 = OpCompositeExtract %66 %81 1
%84 = OpConvertSToF %10 %76
%85 = OpConvertSToF %10 %77
%86 = OpConvertSToF %10 %82
%87 = OpConvertSToF %10 %83
%88 = OpFAdd %10 %62 %84
%89 = OpFAdd %10 %63 %85
%90 = OpFAdd %10 %64 %86
%91 = OpFAdd %10 %65 %87
%93 = OpAccessChain %92 %13 %16
OpStore %93 %88
%94 = OpAccessChain %92 %13 %30
OpStore %94 %89
%95 = OpAccessChain %92 %13 %49
OpStore %95 %90
%96 = OpAccessChain %92 %13 %67
OpStore %96 %91
OpReturn
OpFunctionEnd
#endif
