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

layout(set = 0, binding = 0, std140) uniform _10_12
{
    u64vec2 _m0[5];
} _12;

layout(set = 0, binding = 0, std140) uniform _16_18
{
    vec4 _m0[5];
} _18;

layout(location = 0) out vec4 SV_Target;

void main()
{
    f16vec4 _34 = f16vec4(_18._m0[1u]);
    f16vec4 _50 = f16vec4(_18._m0[2u]);
    SV_Target.x = ((float(_34.x) + _18._m0[0u].x) + float(_50.x)) + float(int64_t(_12._m0[3u].x));
    SV_Target.y = ((float(_34.y) + _18._m0[0u].y) + float(_50.y)) + float(int64_t(_12._m0[3u].y));
    SV_Target.z = ((float(_34.z) + _18._m0[0u].z) + float(_50.z)) + float(int64_t(_12._m0[4u].x));
    SV_Target.w = ((float(_34.w) + _18._m0[0u].w) + float(_50.w)) + float(int64_t(_12._m0[4u].y));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 89
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int64
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %20
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %10 ""
OpName %16 ""
OpName %20 "SV_Target"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %15 ArrayStride 16
OpMemberDecorate %16 0 Offset 0
OpDecorate %16 Block
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %18 DescriptorSet 0
OpDecorate %18 Binding 0
OpDecorate %20 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 5
%7 = OpTypeInt 64 0
%8 = OpTypeVector %7 2
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypeFloat 32
%14 = OpTypeVector %13 4
%15 = OpTypeArray %14 %6
%16 = OpTypeStruct %15
%17 = OpTypePointer Uniform %16
%18 = OpVariable %17 Uniform
%19 = OpTypePointer Output %14
%20 = OpVariable %19 Output
%21 = OpConstant %5 0
%22 = OpTypePointer Uniform %14
%29 = OpConstant %5 1
%32 = OpTypeFloat 16
%33 = OpTypeVector %32 4
%47 = OpConstant %5 2
%63 = OpConstant %5 3
%64 = OpTypePointer Uniform %8
%69 = OpConstant %5 4
%82 = OpTypePointer Output %13
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %87
%87 = OpLabel
%23 = OpAccessChain %22 %18 %21 %21
%24 = OpLoad %14 %23
%25 = OpCompositeExtract %13 %24 0
%26 = OpCompositeExtract %13 %24 1
%27 = OpCompositeExtract %13 %24 2
%28 = OpCompositeExtract %13 %24 3
%30 = OpAccessChain %22 %18 %21 %29
%31 = OpLoad %14 %30
%34 = OpFConvert %33 %31
%35 = OpCompositeExtract %32 %34 0
%36 = OpCompositeExtract %32 %34 1
%37 = OpCompositeExtract %32 %34 2
%38 = OpCompositeExtract %32 %34 3
%39 = OpFConvert %13 %35
%40 = OpFConvert %13 %36
%41 = OpFConvert %13 %37
%42 = OpFConvert %13 %38
%43 = OpFAdd %13 %39 %25
%44 = OpFAdd %13 %40 %26
%45 = OpFAdd %13 %41 %27
%46 = OpFAdd %13 %42 %28
%48 = OpAccessChain %22 %18 %21 %47
%49 = OpLoad %14 %48
%50 = OpFConvert %33 %49
%51 = OpCompositeExtract %32 %50 0
%52 = OpCompositeExtract %32 %50 1
%53 = OpCompositeExtract %32 %50 2
%54 = OpCompositeExtract %32 %50 3
%55 = OpFConvert %13 %51
%56 = OpFConvert %13 %52
%57 = OpFConvert %13 %53
%58 = OpFConvert %13 %54
%59 = OpFAdd %13 %43 %55
%60 = OpFAdd %13 %44 %56
%61 = OpFAdd %13 %45 %57
%62 = OpFAdd %13 %46 %58
%65 = OpAccessChain %64 %12 %21 %63
%66 = OpLoad %8 %65
%67 = OpCompositeExtract %7 %66 0
%68 = OpCompositeExtract %7 %66 1
%70 = OpAccessChain %64 %12 %21 %69
%71 = OpLoad %8 %70
%72 = OpCompositeExtract %7 %71 0
%73 = OpCompositeExtract %7 %71 1
%74 = OpConvertSToF %13 %67
%75 = OpConvertSToF %13 %68
%76 = OpConvertSToF %13 %72
%77 = OpConvertSToF %13 %73
%78 = OpFAdd %13 %59 %74
%79 = OpFAdd %13 %60 %75
%80 = OpFAdd %13 %61 %76
%81 = OpFAdd %13 %62 %77
%83 = OpAccessChain %82 %20 %21
OpStore %83 %78
%84 = OpAccessChain %82 %20 %29
OpStore %84 %79
%85 = OpAccessChain %82 %20 %47
OpStore %85 %80
%86 = OpAccessChain %82 %20 %63
OpStore %86 %81
OpReturn
OpFunctionEnd
#endif
