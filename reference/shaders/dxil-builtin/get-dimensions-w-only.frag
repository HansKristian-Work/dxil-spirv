#version 460
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0) uniform texture1D _8;
layout(set = 0, binding = 1) uniform texture1DArray _11;
layout(set = 0, binding = 2) uniform texture2D _14;
layout(set = 0, binding = 3) uniform texture2DArray _17;
layout(set = 0, binding = 4) uniform texture2DMS _20;
layout(set = 0, binding = 5) uniform texture2DMSArray _23;
layout(set = 0, binding = 6) uniform texture3D _26;
layout(set = 0, binding = 7) uniform textureCube _29;
layout(set = 0, binding = 8) uniform textureCubeArray _32;

layout(location = 0) flat in uint LEVEL;
layout(location = 0) out uint SV_Target;

void main()
{
    SV_Target = (((((((uint(textureQueryLevels(_11)) + uint(textureQueryLevels(_8))) + uint(textureQueryLevels(_14))) + uint(textureQueryLevels(_17))) + uint(textureSamples(_20))) + uint(textureSamples(_23))) + uint(textureQueryLevels(_26))) + uint(textureQueryLevels(_29))) + uint(textureQueryLevels(_32));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 69
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpCapability SampledCubeArray
OpCapability ImageQuery
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %35 %37
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %35 "LEVEL"
OpName %37 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 1
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 2
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 3
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 4
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 5
OpDecorate %26 DescriptorSet 0
OpDecorate %26 Binding 6
OpDecorate %29 DescriptorSet 0
OpDecorate %29 Binding 7
OpDecorate %32 DescriptorSet 0
OpDecorate %32 Binding 8
OpDecorate %35 Flat
OpDecorate %35 Location 0
OpDecorate %37 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 1D 0 1 0 1 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeImage %5 2D 0 0 0 1 Unknown
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeImage %5 2D 0 1 0 1 Unknown
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeImage %5 2D 0 0 1 1 Unknown
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeImage %5 2D 0 1 1 1 Unknown
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeImage %5 3D 0 0 0 1 Unknown
%25 = OpTypePointer UniformConstant %24
%26 = OpVariable %25 UniformConstant
%27 = OpTypeImage %5 Cube 0 0 0 1 Unknown
%28 = OpTypePointer UniformConstant %27
%29 = OpVariable %28 UniformConstant
%30 = OpTypeImage %5 Cube 0 1 0 1 Unknown
%31 = OpTypePointer UniformConstant %30
%32 = OpVariable %31 UniformConstant
%33 = OpTypeInt 32 0
%34 = OpTypePointer Input %33
%35 = OpVariable %34 Input
%36 = OpTypePointer Output %33
%37 = OpVariable %36 Output
%49 = OpTypeVector %33 2
%54 = OpTypeVector %33 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %67
%67 = OpLabel
%38 = OpLoad %30 %32
%39 = OpLoad %27 %29
%40 = OpLoad %24 %26
%41 = OpLoad %21 %23
%42 = OpLoad %18 %20
%43 = OpLoad %15 %17
%44 = OpLoad %12 %14
%45 = OpLoad %9 %11
%46 = OpLoad %6 %8
%47 = OpLoad %33 %35
%48 = OpImageQueryLevels %33 %46
%50 = OpImageQueryLevels %33 %45
%51 = OpIAdd %33 %50 %48
%52 = OpImageQueryLevels %33 %44
%53 = OpIAdd %33 %51 %52
%55 = OpImageQueryLevels %33 %43
%56 = OpIAdd %33 %53 %55
%57 = OpImageQuerySamples %33 %42
%58 = OpIAdd %33 %56 %57
%59 = OpImageQuerySamples %33 %41
%60 = OpIAdd %33 %58 %59
%61 = OpImageQueryLevels %33 %40
%62 = OpIAdd %33 %60 %61
%63 = OpImageQueryLevels %33 %39
%64 = OpIAdd %33 %62 %63
%65 = OpImageQueryLevels %33 %38
%66 = OpIAdd %33 %64 %65
OpStore %37 %66
OpReturn
OpFunctionEnd
#endif
