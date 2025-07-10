#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 1) uniform texture3D _9[];
layout(set = 0, binding = 4) uniform sampler _13[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) in vec3 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _46 = texture(sampler3D(_9[INDEX], _13[INDEX]), vec3(UV.x, UV.y, UV.z));
    SV_Target.x = _46.x;
    SV_Target.y = _46.y;
    SV_Target.z = _46.z;
    SV_Target.w = _46.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 60
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %16 %19 %22
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %16 "INDEX"
OpName %19 "UV"
OpName %22 "SV_Target"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 1
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 4
OpDecorate %16 Flat
OpDecorate %16 Location 0
OpDecorate %19 Location 1
OpDecorate %22 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 3D 0 0 0 1 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeSampler
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer UniformConstant %11
%13 = OpVariable %12 UniformConstant
%14 = OpTypeInt 32 0
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpTypeVector %5 3
%18 = OpTypePointer Input %17
%19 = OpVariable %18 Input
%20 = OpTypeVector %5 4
%21 = OpTypePointer Output %20
%22 = OpVariable %21 Output
%23 = OpTypePointer Input %5
%25 = OpConstant %14 0
%28 = OpConstant %14 1
%31 = OpConstant %14 2
%35 = OpTypePointer UniformConstant %6
%39 = OpConstant %14 4
%40 = OpTypePointer UniformConstant %10
%43 = OpTypeSampledImage %6
%45 = OpConstant %5 0
%52 = OpTypePointer Output %5
%57 = OpConstant %14 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %58
%58 = OpLabel
%24 = OpAccessChain %23 %19 %25
%26 = OpLoad %5 %24
%27 = OpAccessChain %23 %19 %28
%29 = OpLoad %5 %27
%30 = OpAccessChain %23 %19 %31
%32 = OpLoad %5 %30
%33 = OpLoad %14 %16
%34 = OpIAdd %14 %33 %28
%36 = OpAccessChain %35 %9 %33
%37 = OpLoad %6 %36
%38 = OpIAdd %14 %33 %39
%41 = OpAccessChain %40 %13 %33
%42 = OpLoad %10 %41
%44 = OpSampledImage %43 %37 %42
%47 = OpCompositeConstruct %17 %26 %29 %32
%46 = OpImageSampleImplicitLod %20 %44 %47 None
%48 = OpCompositeExtract %5 %46 0
%49 = OpCompositeExtract %5 %46 1
%50 = OpCompositeExtract %5 %46 2
%51 = OpCompositeExtract %5 %46 3
%53 = OpAccessChain %52 %22 %25
OpStore %53 %48
%54 = OpAccessChain %52 %22 %28
OpStore %54 %49
%55 = OpAccessChain %52 %22 %31
OpStore %55 %50
%56 = OpAccessChain %52 %22 %57
OpStore %56 %51
OpReturn
OpFunctionEnd
#endif
