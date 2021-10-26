#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 4) uniform texture2D _9[];
layout(set = 1, binding = 5) uniform samplerBuffer _15[1000];
layout(set = 2, binding = 6) uniform texture1D _18;

layout(location = 0) flat in uint INDEX;
layout(location = 1) in vec2 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _35 = uint(int(UV.x));
    uint _36 = uint(int(UV.y));
    vec4 _42 = texelFetch(_9[nonuniformEXT(INDEX + 4u)], ivec2(uvec2(_35, _36)), int(0u));
    vec4 _55 = texelFetch(_15[nonuniformEXT((INDEX + 1u) + 5u)], int(_35));
    vec4 _65 = texelFetch(_18, int(_35), int(_36));
    SV_Target.x = (_55.x + _42.x) + _65.x;
    SV_Target.y = (_55.y + _42.y) + _65.y;
    SV_Target.z = (_55.z + _42.z) + _65.z;
    SV_Target.w = (_55.w + _42.w) + _65.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 83
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability Sampled1D
OpCapability SampledBuffer
OpCapability RuntimeDescriptorArray
OpCapability UniformTexelBufferArrayDynamicIndexing
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
OpDecorate %9 Binding 4
OpDecorate %15 DescriptorSet 1
OpDecorate %15 Binding 5
OpDecorate %18 DescriptorSet 2
OpDecorate %18 Binding 6
OpDecorate %20 Flat
OpDecorate %20 Location 0
OpDecorate %23 Location 1
OpDecorate %26 Location 0
OpDecorate %37 NonUniform
OpDecorate %41 NonUniform
OpDecorate %50 NonUniform
OpDecorate %54 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%11 = OpTypeInt 32 0
%12 = OpConstant %11 1000
%13 = OpTypeArray %10 %12
%14 = OpTypePointer UniformConstant %13
%15 = OpVariable %14 UniformConstant
%16 = OpTypeImage %5 1D 0 0 0 1 Unknown
%17 = OpTypePointer UniformConstant %16
%18 = OpVariable %17 UniformConstant
%19 = OpTypePointer Input %11
%20 = OpVariable %19 Input
%21 = OpTypeVector %5 2
%22 = OpTypePointer Input %21
%23 = OpVariable %22 Input
%24 = OpTypeVector %5 4
%25 = OpTypePointer Output %24
%26 = OpVariable %25 Output
%27 = OpTypePointer Input %5
%29 = OpConstant %11 0
%32 = OpConstant %11 1
%38 = OpConstant %11 4
%39 = OpTypePointer UniformConstant %6
%43 = OpTypeVector %11 2
%51 = OpConstant %11 5
%52 = OpTypePointer UniformConstant %10
%74 = OpTypePointer Output %5
%78 = OpConstant %11 2
%80 = OpConstant %11 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %81
%81 = OpLabel
%28 = OpAccessChain %27 %23 %29
%30 = OpLoad %5 %28
%31 = OpAccessChain %27 %23 %32
%33 = OpLoad %5 %31
%34 = OpLoad %11 %20
%35 = OpConvertFToS %11 %30
%36 = OpConvertFToS %11 %33
%37 = OpIAdd %11 %34 %38
%40 = OpAccessChain %39 %9 %37
%41 = OpLoad %6 %40
%44 = OpCompositeConstruct %43 %35 %36
%42 = OpImageFetch %24 %41 %44 Lod %29
%45 = OpCompositeExtract %5 %42 0
%46 = OpCompositeExtract %5 %42 1
%47 = OpCompositeExtract %5 %42 2
%48 = OpCompositeExtract %5 %42 3
%49 = OpIAdd %11 %34 %32
%50 = OpIAdd %11 %49 %51
%53 = OpAccessChain %52 %15 %50
%54 = OpLoad %10 %53
%55 = OpImageFetch %24 %54 %35
%56 = OpCompositeExtract %5 %55 0
%57 = OpCompositeExtract %5 %55 1
%58 = OpCompositeExtract %5 %55 2
%59 = OpCompositeExtract %5 %55 3
%60 = OpFAdd %5 %56 %45
%61 = OpFAdd %5 %57 %46
%62 = OpFAdd %5 %58 %47
%63 = OpFAdd %5 %59 %48
%64 = OpLoad %16 %18
%65 = OpImageFetch %24 %64 %35 Lod %36
%66 = OpCompositeExtract %5 %65 0
%67 = OpCompositeExtract %5 %65 1
%68 = OpCompositeExtract %5 %65 2
%69 = OpCompositeExtract %5 %65 3
%70 = OpFAdd %5 %60 %66
%71 = OpFAdd %5 %61 %67
%72 = OpFAdd %5 %62 %68
%73 = OpFAdd %5 %63 %69
%75 = OpAccessChain %74 %26 %29
OpStore %75 %70
%76 = OpAccessChain %74 %26 %32
OpStore %76 %71
%77 = OpAccessChain %74 %26 %78
OpStore %77 %72
%79 = OpAccessChain %74 %26 %80
OpStore %79 %73
OpReturn
OpFunctionEnd
#endif
