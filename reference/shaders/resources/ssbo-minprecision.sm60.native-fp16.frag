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
    uint _36 = uint(int16_t(_25 + 1us));
    imageStore(_12, int(_26), uvec4(floatBitsToUint(float(float16_t(uintBitsToFloat(texelFetch(_8, int(_36)).x)) + float16_t(uintBitsToFloat(texelFetch(_8, int(_26)).x))))));
    imageStore(_13, int(_26), uvec4(uint(uint16_t(texelFetch(_9, int(_36)).x) + uint16_t(texelFetch(_9, int(_26)).x))));
    SV_Target = int(10u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 58
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
OpDecorate %41 RelaxedPrecision
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
%27 = OpTypeVector %5 4
%30 = OpTypeFloat 32
%32 = OpTypeFloat 16
%35 = OpConstant %24 1
%54 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %56
%56 = OpLabel
%19 = OpLoad %10 %13
%20 = OpLoad %10 %12
%21 = OpLoad %6 %9
%22 = OpLoad %6 %8
%23 = OpLoad %14 %16
%25 = OpSConvert %24 %23
%26 = OpSConvert %5 %25
%28 = OpImageFetch %27 %22 %26
%29 = OpCompositeExtract %5 %28 0
%31 = OpBitcast %30 %29
%33 = OpFConvert %32 %31
%34 = OpIAdd %24 %25 %35
%36 = OpSConvert %5 %34
%37 = OpImageFetch %27 %22 %36
%38 = OpCompositeExtract %5 %37 0
%39 = OpBitcast %30 %38
%40 = OpFConvert %32 %39
%41 = OpFAdd %32 %40 %33
%42 = OpFConvert %30 %41
%43 = OpBitcast %5 %42
%44 = OpCompositeConstruct %27 %43 %43 %43 %43
OpImageWrite %20 %26 %44
%45 = OpImageFetch %27 %21 %26
%46 = OpCompositeExtract %5 %45 0
%47 = OpUConvert %24 %46
%48 = OpImageFetch %27 %21 %36
%49 = OpCompositeExtract %5 %48 0
%50 = OpUConvert %24 %49
%51 = OpIAdd %24 %50 %47
%52 = OpUConvert %5 %51
%53 = OpCompositeConstruct %27 %52 %52 %52 %52
OpImageWrite %19 %26 %53
%55 = OpBitcast %14 %54
OpStore %18 %55
OpReturn
OpFunctionEnd
#endif
