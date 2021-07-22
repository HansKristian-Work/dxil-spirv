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

layout(set = 0, binding = 0) uniform usamplerBuffer _8;
layout(set = 0, binding = 1) uniform usamplerBuffer _9;
layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _12;
layout(set = 0, binding = 1, r32ui) uniform writeonly uimageBuffer _13;

layout(location = 0) flat in mediump int A;
layout(location = 0) out int SV_Target;

void main()
{
    uint16_t _25 = uint16_t(A);
    uint _26 = uint(int16_t(_25));
    uint _37 = uint(int16_t(_25 + 1us));
    imageStore(_12, int(_26), uvec4(floatBitsToUint(float(float16_t(uintBitsToFloat(texelFetch(_8, int(_37)).x)) + float16_t(uintBitsToFloat(texelFetch(_8, int(_26)).x))))));
    imageStore(_13, int(_26), uvec4(uint(uint16_t(texelFetch(_9, int(_37)).x) + uint16_t(texelFetch(_9, int(_26)).x))));
    SV_Target = int(10u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 59
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability SampledBuffer
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %16 %18
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %16 "A"
OpName %18 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 1
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %12 NonReadable
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 1
OpDecorate %13 NonReadable
OpDecorate %16 RelaxedPrecision
OpDecorate %16 Flat
OpDecorate %16 Location 0
OpDecorate %18 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpVariable %7 UniformConstant
%10 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpVariable %11 UniformConstant
%14 = OpTypeInt 32 1
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpTypePointer Output %14
%18 = OpVariable %17 Output
%24 = OpTypeInt 16 0
%27 = OpConstant %5 0
%28 = OpTypeVector %5 4
%31 = OpTypeFloat 32
%33 = OpTypeFloat 16
%36 = OpConstant %24 1
%55 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %57
%57 = OpLabel
%19 = OpLoad %10 %13
%20 = OpLoad %10 %12
%21 = OpLoad %6 %9
%22 = OpLoad %6 %8
%23 = OpLoad %14 %16
%25 = OpSConvert %24 %23
%26 = OpSConvert %5 %25
%29 = OpImageFetch %28 %22 %26
%30 = OpCompositeExtract %5 %29 0
%32 = OpBitcast %31 %30
%34 = OpFConvert %33 %32
%35 = OpIAdd %24 %25 %36
%37 = OpSConvert %5 %35
%38 = OpImageFetch %28 %22 %37
%39 = OpCompositeExtract %5 %38 0
%40 = OpBitcast %31 %39
%41 = OpFConvert %33 %40
%42 = OpFAdd %33 %41 %34
%43 = OpFConvert %31 %42
%44 = OpBitcast %5 %43
%45 = OpCompositeConstruct %28 %44 %44 %44 %44
OpImageWrite %20 %26 %45
%46 = OpImageFetch %28 %21 %26
%47 = OpCompositeExtract %5 %46 0
%48 = OpUConvert %24 %47
%49 = OpImageFetch %28 %21 %37
%50 = OpCompositeExtract %5 %49 0
%51 = OpUConvert %24 %50
%52 = OpIAdd %24 %51 %48
%53 = OpUConvert %5 %52
%54 = OpCompositeConstruct %28 %53 %53 %53 %53
OpImageWrite %19 %26 %54
%56 = OpBitcast %14 %55
OpStore %18 %56
OpReturn
OpFunctionEnd
#endif
