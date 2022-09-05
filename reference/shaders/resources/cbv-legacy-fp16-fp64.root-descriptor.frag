#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#if defined(GL_ARB_gpu_shader_int64)
#extension GL_ARB_gpu_shader_int64 : require
#else
#error No extension available for 64-bit integers.
#endif
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_buffer_reference_uvec2 : require

struct CBVComposite16x8
{
    float16_t _m0;
    float16_t _m1;
    float16_t _m2;
    float16_t _m3;
    float16_t _m4;
    float16_t _m5;
    float16_t _m6;
    float16_t _m7;
};

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
    PhysicalPointerFloat4NonWriteCBVArray _32 = PhysicalPointerFloat4NonWriteCBVArray(registers._m0);
    f16vec2 _40 = unpackFloat2x16(floatBitsToUint(_32.value[1u].x));
    f16vec2 _43 = unpackFloat2x16(floatBitsToUint(_32.value[1u].y));
    f16vec2 _46 = unpackFloat2x16(floatBitsToUint(_32.value[1u].z));
    f16vec2 _49 = unpackFloat2x16(floatBitsToUint(_32.value[1u].w));
    CBVComposite16x8 _53 = CBVComposite16x8(_40.x, _40.y, _43.x, _43.y, _46.x, _46.y, _49.x, _49.y);
    PhysicalPointerUint642NonWriteCBVArray _84 = PhysicalPointerUint642NonWriteCBVArray(registers._m0);
    PhysicalPointerUint642NonWriteCBVArray _91 = PhysicalPointerUint642NonWriteCBVArray(registers._m0);
    SV_Target.x = ((float(_53._m0) + _22.value[0u].x) + float(_53._m4)) + float(int64_t(_84.value[2u].x));
    SV_Target.y = ((float(_53._m1) + _22.value[0u].y) + float(_53._m5)) + float(int64_t(_84.value[2u].y));
    SV_Target.z = ((float(_53._m2) + _22.value[0u].z) + float(_53._m6)) + float(int64_t(_91.value[3u].x));
    SV_Target.w = ((float(_53._m3) + _22.value[0u].w) + float(_53._m7)) + float(int64_t(_91.value[3u].y));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 111
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
OpName %52 "CBVComposite16x8"
OpName %82 "PhysicalPointerUint642NonWriteCBVArray"
OpMemberName %82 0 "value"
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
OpDecorate %81 ArrayStride 16
OpMemberDecorate %82 0 Offset 0
OpDecorate %82 Block
OpMemberDecorate %82 0 NonWritable
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
%30 = OpTypeFloat 16
%31 = OpConstant %5 1
%35 = OpTypeVector %30 2
%52 = OpTypeStruct %30 %30 %30 %30 %30 %30 %30 %30
%78 = OpTypeInt 64 0
%79 = OpConstant %5 2
%80 = OpTypeVector %78 2
%81 = OpTypeArray %80 %18
%82 = OpTypeStruct %81
%83 = OpTypePointer PhysicalStorageBuffer %82
%85 = OpTypePointer PhysicalStorageBuffer %80
%90 = OpConstant %5 3
%104 = OpTypePointer Output %10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %109
%109 = OpLabel
%15 = OpAccessChain %14 %9 %16
%17 = OpLoad %6 %15
%22 = OpBitcast %21 %17
%24 = OpInBoundsAccessChain %23 %22 %16 %16
%25 = OpLoad %11 %24 Aligned 16
%26 = OpCompositeExtract %10 %25 0
%27 = OpCompositeExtract %10 %25 1
%28 = OpCompositeExtract %10 %25 2
%29 = OpCompositeExtract %10 %25 3
%32 = OpBitcast %21 %17
%33 = OpInBoundsAccessChain %23 %32 %16 %31
%34 = OpLoad %11 %33 Aligned 16
%36 = OpCompositeExtract %10 %34 0
%37 = OpCompositeExtract %10 %34 1
%38 = OpCompositeExtract %10 %34 2
%39 = OpCompositeExtract %10 %34 3
%40 = OpBitcast %35 %36
%41 = OpCompositeExtract %30 %40 0
%42 = OpCompositeExtract %30 %40 1
%43 = OpBitcast %35 %37
%44 = OpCompositeExtract %30 %43 0
%45 = OpCompositeExtract %30 %43 1
%46 = OpBitcast %35 %38
%47 = OpCompositeExtract %30 %46 0
%48 = OpCompositeExtract %30 %46 1
%49 = OpBitcast %35 %39
%50 = OpCompositeExtract %30 %49 0
%51 = OpCompositeExtract %30 %49 1
%53 = OpCompositeConstruct %52 %41 %42 %44 %45 %47 %48 %50 %51
%54 = OpCompositeExtract %30 %53 0
%55 = OpCompositeExtract %30 %53 1
%56 = OpCompositeExtract %30 %53 2
%57 = OpCompositeExtract %30 %53 3
%58 = OpFConvert %10 %54
%59 = OpFConvert %10 %55
%60 = OpFConvert %10 %56
%61 = OpFConvert %10 %57
%62 = OpFAdd %10 %58 %26
%63 = OpFAdd %10 %59 %27
%64 = OpFAdd %10 %60 %28
%65 = OpFAdd %10 %61 %29
%66 = OpCompositeExtract %30 %53 4
%67 = OpCompositeExtract %30 %53 5
%68 = OpCompositeExtract %30 %53 6
%69 = OpCompositeExtract %30 %53 7
%70 = OpFConvert %10 %66
%71 = OpFConvert %10 %67
%72 = OpFConvert %10 %68
%73 = OpFConvert %10 %69
%74 = OpFAdd %10 %62 %70
%75 = OpFAdd %10 %63 %71
%76 = OpFAdd %10 %64 %72
%77 = OpFAdd %10 %65 %73
%84 = OpBitcast %83 %17
%86 = OpInBoundsAccessChain %85 %84 %16 %79
%87 = OpLoad %80 %86 Aligned 16
%88 = OpCompositeExtract %78 %87 0
%89 = OpCompositeExtract %78 %87 1
%91 = OpBitcast %83 %17
%92 = OpInBoundsAccessChain %85 %91 %16 %90
%93 = OpLoad %80 %92 Aligned 16
%94 = OpCompositeExtract %78 %93 0
%95 = OpCompositeExtract %78 %93 1
%96 = OpConvertSToF %10 %88
%97 = OpConvertSToF %10 %89
%98 = OpConvertSToF %10 %94
%99 = OpConvertSToF %10 %95
%100 = OpFAdd %10 %74 %96
%101 = OpFAdd %10 %75 %97
%102 = OpFAdd %10 %76 %98
%103 = OpFAdd %10 %77 %99
%105 = OpAccessChain %104 %13 %16
OpStore %105 %100
%106 = OpAccessChain %104 %13 %31
OpStore %106 %101
%107 = OpAccessChain %104 %13 %79
OpStore %107 %102
%108 = OpAccessChain %104 %13 %90
OpStore %108 %103
OpReturn
OpFunctionEnd
#endif
