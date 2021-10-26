#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0) uniform mediump texture2D _9[];
layout(set = 0, binding = 0) uniform samplerBuffer _13[];
layout(set = 0, binding = 0) uniform texture1D _17[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) in vec2 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _47 = uint(int(UV.x));
    uint _48 = uint(int(UV.y));
    f16vec4 _54 = f16vec4(texelFetch(_9[nonuniformEXT(INDEX)], ivec2(uvec2(_47, _48)), int(0u)));
    vec4 _63 = texelFetch(_13[nonuniformEXT(INDEX + 1u)], int(_47));
    vec4 _72 = texelFetch(_17[nonuniformEXT(INDEX + 2u)], int(_48), int(_48));
    SV_Target.x = (float(_54.x) + _63.x) + _72.x;
    SV_Target.y = (float(_54.y) + _63.y) + _72.y;
    SV_Target.z = (float(_54.z) + _63.z) + _72.z;
    SV_Target.w = (float(_54.w) + _63.w) + _72.w;
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
OpCapability Sampled1D
OpCapability SampledBuffer
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpCapability UniformTexelBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %20 %23 %26
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %20 "INDEX"
OpName %23 "UV"
OpName %26 "SV_Target"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 RelaxedPrecision
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %20 Flat
OpDecorate %20 Location 0
OpDecorate %23 Location 1
OpDecorate %26 Location 0
OpDecorate %34 NonUniform
OpDecorate %37 NonUniform
OpDecorate %38 NonUniform
OpDecorate %41 NonUniform
OpDecorate %42 NonUniform
OpDecorate %46 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer UniformConstant %11
%13 = OpVariable %12 UniformConstant
%14 = OpTypeImage %5 1D 0 0 0 1 Unknown
%15 = OpTypeRuntimeArray %14
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeInt 32 0
%19 = OpTypePointer Input %18
%20 = OpVariable %19 Input
%21 = OpTypeVector %5 2
%22 = OpTypePointer Input %21
%23 = OpVariable %22 Input
%24 = OpTypeVector %5 4
%25 = OpTypePointer Output %24
%26 = OpVariable %25 Output
%27 = OpTypePointer Input %5
%29 = OpConstant %18 0
%32 = OpConstant %18 1
%35 = OpTypePointer UniformConstant %6
%39 = OpTypePointer UniformConstant %10
%43 = OpConstant %18 2
%44 = OpTypePointer UniformConstant %14
%50 = OpTypeVector %18 2
%52 = OpTypeFloat 16
%53 = OpTypeVector %52 4
%81 = OpTypePointer Output %5
%86 = OpConstant %18 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %87
%87 = OpLabel
%28 = OpAccessChain %27 %23 %29
%30 = OpLoad %5 %28
%31 = OpAccessChain %27 %23 %32
%33 = OpLoad %5 %31
%34 = OpLoad %18 %20
%36 = OpAccessChain %35 %9 %34
%37 = OpLoad %6 %36
%38 = OpIAdd %18 %34 %32
%40 = OpAccessChain %39 %13 %38
%41 = OpLoad %10 %40
%42 = OpIAdd %18 %34 %43
%45 = OpAccessChain %44 %17 %42
%46 = OpLoad %14 %45
%47 = OpConvertFToS %18 %30
%48 = OpConvertFToS %18 %33
%51 = OpCompositeConstruct %50 %47 %48
%49 = OpImageFetch %24 %37 %51 Lod %29
%54 = OpFConvert %53 %49
%55 = OpCompositeExtract %52 %54 0
%56 = OpCompositeExtract %52 %54 1
%57 = OpCompositeExtract %52 %54 2
%58 = OpCompositeExtract %52 %54 3
%59 = OpFConvert %5 %55
%60 = OpFConvert %5 %56
%61 = OpFConvert %5 %57
%62 = OpFConvert %5 %58
%63 = OpImageFetch %24 %41 %47
%64 = OpCompositeExtract %5 %63 0
%65 = OpCompositeExtract %5 %63 1
%66 = OpCompositeExtract %5 %63 2
%67 = OpCompositeExtract %5 %63 3
%68 = OpFAdd %5 %59 %64
%69 = OpFAdd %5 %60 %65
%70 = OpFAdd %5 %61 %66
%71 = OpFAdd %5 %62 %67
%72 = OpImageFetch %24 %46 %48 Lod %48
%73 = OpCompositeExtract %5 %72 0
%74 = OpCompositeExtract %5 %72 1
%75 = OpCompositeExtract %5 %72 2
%76 = OpCompositeExtract %5 %72 3
%77 = OpFAdd %5 %68 %73
%78 = OpFAdd %5 %69 %74
%79 = OpFAdd %5 %70 %75
%80 = OpFAdd %5 %71 %76
%82 = OpAccessChain %81 %26 %29
OpStore %82 %77
%83 = OpAccessChain %81 %26 %32
OpStore %83 %78
%84 = OpAccessChain %81 %26 %43
OpStore %84 %79
%85 = OpAccessChain %81 %26 %86
OpStore %85 %80
OpReturn
OpFunctionEnd
#endif
