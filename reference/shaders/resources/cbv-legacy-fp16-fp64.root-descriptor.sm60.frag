#version 460
#if defined(GL_ARB_gpu_shader_int64)
#extension GL_ARB_gpu_shader_int64 : require
#else
#error No extension available for 64-bit integers.
#endif
#extension GL_EXT_buffer_reference2 : require
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
    PhysicalPointerFloat4NonWriteCBVArray _31 = PhysicalPointerFloat4NonWriteCBVArray(registers._m0);
    PhysicalPointerFloat4NonWriteCBVArray _43 = PhysicalPointerFloat4NonWriteCBVArray(registers._m0);
    PhysicalPointerUint642NonWriteCBVArray _60 = PhysicalPointerUint642NonWriteCBVArray(registers._m0);
    PhysicalPointerUint642NonWriteCBVArray _67 = PhysicalPointerUint642NonWriteCBVArray(registers._m0);
    SV_Target.x = ((_31.value[1u].x + _22.value[0u].x) + _43.value[2u].x) + float(int64_t(_60.value[3u].x));
    SV_Target.y = ((_31.value[1u].y + _22.value[0u].y) + _43.value[2u].y) + float(int64_t(_60.value[3u].y));
    SV_Target.z = ((_31.value[1u].z + _22.value[0u].z) + _43.value[2u].z) + float(int64_t(_67.value[4u].x));
    SV_Target.w = ((_31.value[1u].w + _22.value[0u].w) + _43.value[2u].w) + float(int64_t(_67.value[4u].y));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 87
; Schema: 0
OpCapability Shader
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
OpName %58 "PhysicalPointerUint642NonWriteCBVArray"
OpMemberName %58 0 "value"
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
OpDecorate %34 RelaxedPrecision
OpDecorate %35 RelaxedPrecision
OpDecorate %36 RelaxedPrecision
OpDecorate %37 RelaxedPrecision
OpDecorate %46 RelaxedPrecision
OpDecorate %47 RelaxedPrecision
OpDecorate %48 RelaxedPrecision
OpDecorate %49 RelaxedPrecision
OpDecorate %57 ArrayStride 16
OpMemberDecorate %58 0 Offset 0
OpDecorate %58 Block
OpMemberDecorate %58 0 NonWritable
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
%42 = OpConstant %5 2
%54 = OpTypeInt 64 0
%55 = OpConstant %5 3
%56 = OpTypeVector %54 2
%57 = OpTypeArray %56 %18
%58 = OpTypeStruct %57
%59 = OpTypePointer PhysicalStorageBuffer %58
%61 = OpTypePointer PhysicalStorageBuffer %56
%66 = OpConstant %5 4
%80 = OpTypePointer Output %10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %85
%85 = OpLabel
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
%34 = OpCompositeExtract %10 %33 0
%35 = OpCompositeExtract %10 %33 1
%36 = OpCompositeExtract %10 %33 2
%37 = OpCompositeExtract %10 %33 3
%38 = OpFAdd %10 %34 %26
%39 = OpFAdd %10 %35 %27
%40 = OpFAdd %10 %36 %28
%41 = OpFAdd %10 %37 %29
%43 = OpBitcast %21 %17
%44 = OpInBoundsAccessChain %23 %43 %16 %42
%45 = OpLoad %11 %44 Aligned 16
%46 = OpCompositeExtract %10 %45 0
%47 = OpCompositeExtract %10 %45 1
%48 = OpCompositeExtract %10 %45 2
%49 = OpCompositeExtract %10 %45 3
%50 = OpFAdd %10 %38 %46
%51 = OpFAdd %10 %39 %47
%52 = OpFAdd %10 %40 %48
%53 = OpFAdd %10 %41 %49
%60 = OpBitcast %59 %17
%62 = OpInBoundsAccessChain %61 %60 %16 %55
%63 = OpLoad %56 %62 Aligned 16
%64 = OpCompositeExtract %54 %63 0
%65 = OpCompositeExtract %54 %63 1
%67 = OpBitcast %59 %17
%68 = OpInBoundsAccessChain %61 %67 %16 %66
%69 = OpLoad %56 %68 Aligned 16
%70 = OpCompositeExtract %54 %69 0
%71 = OpCompositeExtract %54 %69 1
%72 = OpConvertSToF %10 %64
%73 = OpConvertSToF %10 %65
%74 = OpConvertSToF %10 %70
%75 = OpConvertSToF %10 %71
%76 = OpFAdd %10 %50 %72
%77 = OpFAdd %10 %51 %73
%78 = OpFAdd %10 %52 %74
%79 = OpFAdd %10 %53 %75
%81 = OpAccessChain %80 %13 %16
OpStore %81 %76
%82 = OpAccessChain %80 %13 %30
OpStore %82 %77
%83 = OpAccessChain %80 %13 %42
OpStore %83 %78
%84 = OpAccessChain %80 %13 %55
OpStore %84 %79
OpReturn
OpFunctionEnd
#endif
