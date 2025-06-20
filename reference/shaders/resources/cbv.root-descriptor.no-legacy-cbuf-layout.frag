#version 460
#if defined(GL_ARB_gpu_shader_int64)
#extension GL_ARB_gpu_shader_int64 : require
#else
#error No extension available for 64-bit integers.
#endif
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_buffer_reference_uvec2 : require

layout(buffer_reference) buffer PhysicalPointerFloat4NonWriteCBVArray;
layout(buffer_reference) buffer PhysicalPointerUint642NonWriteCBVArray;

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
    PhysicalPointerUint642NonWriteCBVArray _36 = PhysicalPointerUint642NonWriteCBVArray(registers._m0);
    PhysicalPointerUint642NonWriteCBVArray _43 = PhysicalPointerUint642NonWriteCBVArray(registers._m0);
    PhysicalPointerFloat4NonWriteCBVArray _58 = PhysicalPointerFloat4NonWriteCBVArray(registers._m0);
    f16vec2 _66 = unpackFloat2x16(floatBitsToUint(_58.value[1u].x));
    f16vec2 _69 = unpackFloat2x16(floatBitsToUint(_58.value[1u].y));
    f16vec2 _72 = unpackFloat2x16(floatBitsToUint(_58.value[1u].z));
    f16vec2 _75 = unpackFloat2x16(floatBitsToUint(_58.value[1u].w));
    CBVComposite16x8 _79 = CBVComposite16x8(_66.x, _66.y, _69.x, _69.y, _72.x, _72.y, _75.x, _75.y);
    SV_Target.x = (float(int64_t(_36.value[2u].x)) + _22.value[0u].x) + float(_79._m0);
    SV_Target.y = (float(int64_t(_36.value[2u].y)) + _22.value[0u].y) + float(_79._m1);
    SV_Target.z = (float(int64_t(_43.value[3u].x)) + _22.value[0u].z) + float(_79._m2);
    SV_Target.w = (float(int64_t(_43.value[3u].y)) + _22.value[0u].w) + float(_79._m3);
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
OpCapability DenormPreserve
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_KHR_float_controls"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %13
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %7 "RootConstants"
OpName %9 "registers"
OpName %13 "SV_Target"
OpName %20 "PhysicalPointerFloat4NonWriteCBVArray"
OpMemberName %20 0 "value"
OpName %34 "PhysicalPointerUint642NonWriteCBVArray"
OpMemberName %34 0 "value"
OpName %78 "CBVComposite16x8"
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
OpDecorate %33 ArrayStride 16
OpMemberDecorate %34 0 Offset 0
OpDecorate %34 Block
OpMemberDecorate %34 0 NonWritable
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
%30 = OpTypeInt 64 0
%31 = OpConstant %5 2
%32 = OpTypeVector %30 2
%33 = OpTypeArray %32 %18
%34 = OpTypeStruct %33
%35 = OpTypePointer PhysicalStorageBuffer %34
%37 = OpTypePointer PhysicalStorageBuffer %32
%42 = OpConstant %5 3
%56 = OpTypeFloat 16
%57 = OpConstant %5 1
%61 = OpTypeVector %56 2
%78 = OpTypeStruct %56 %56 %56 %56 %56 %56 %56 %56
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
%36 = OpBitcast %35 %17
%38 = OpInBoundsAccessChain %37 %36 %16 %31
%39 = OpLoad %32 %38 Aligned 16
%40 = OpCompositeExtract %30 %39 0
%41 = OpCompositeExtract %30 %39 1
%43 = OpBitcast %35 %17
%44 = OpInBoundsAccessChain %37 %43 %16 %42
%45 = OpLoad %32 %44 Aligned 16
%46 = OpCompositeExtract %30 %45 0
%47 = OpCompositeExtract %30 %45 1
%48 = OpConvertSToF %10 %40
%49 = OpConvertSToF %10 %41
%50 = OpConvertSToF %10 %46
%51 = OpConvertSToF %10 %47
%52 = OpFAdd %10 %48 %26
%53 = OpFAdd %10 %49 %27
%54 = OpFAdd %10 %50 %28
%55 = OpFAdd %10 %51 %29
%58 = OpBitcast %21 %17
%59 = OpInBoundsAccessChain %23 %58 %16 %57
%60 = OpLoad %11 %59 Aligned 16
%62 = OpCompositeExtract %10 %60 0
%63 = OpCompositeExtract %10 %60 1
%64 = OpCompositeExtract %10 %60 2
%65 = OpCompositeExtract %10 %60 3
%66 = OpBitcast %61 %62
%67 = OpCompositeExtract %56 %66 0
%68 = OpCompositeExtract %56 %66 1
%69 = OpBitcast %61 %63
%70 = OpCompositeExtract %56 %69 0
%71 = OpCompositeExtract %56 %69 1
%72 = OpBitcast %61 %64
%73 = OpCompositeExtract %56 %72 0
%74 = OpCompositeExtract %56 %72 1
%75 = OpBitcast %61 %65
%76 = OpCompositeExtract %56 %75 0
%77 = OpCompositeExtract %56 %75 1
%79 = OpCompositeConstruct %78 %67 %68 %70 %71 %73 %74 %76 %77
%80 = OpCompositeExtract %56 %79 0
%81 = OpCompositeExtract %56 %79 1
%82 = OpCompositeExtract %56 %79 2
%83 = OpCompositeExtract %56 %79 3
%84 = OpFConvert %10 %80
%85 = OpFConvert %10 %81
%86 = OpFConvert %10 %82
%87 = OpFConvert %10 %83
%88 = OpFAdd %10 %52 %84
%89 = OpFAdd %10 %53 %85
%90 = OpFAdd %10 %54 %86
%91 = OpFAdd %10 %55 %87
%93 = OpAccessChain %92 %13 %16
OpStore %93 %88
%94 = OpAccessChain %92 %13 %57
OpStore %94 %89
%95 = OpAccessChain %92 %13 %31
OpStore %95 %90
%96 = OpAccessChain %92 %13 %42
OpStore %96 %91
OpReturn
OpFunctionEnd
#endif
