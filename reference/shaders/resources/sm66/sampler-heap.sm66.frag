#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform texture3D _9[];
layout(set = 0, binding = 0) uniform sampler _13[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) in vec3 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _45 = texture(sampler3D(_9[INDEX + 1u], _13[INDEX + 2u]), vec3(UV.x, UV.y, UV.z));
    SV_Target.x = _45.x;
    SV_Target.y = _45.y;
    SV_Target.z = _45.z;
    SV_Target.w = _45.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 59
; Schema: 0
OpCapability Shader
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
OpDecorate %9 Binding 0
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
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
%39 = OpTypePointer UniformConstant %10
%42 = OpTypeSampledImage %6
%44 = OpConstant %5 0
%51 = OpTypePointer Output %5
%56 = OpConstant %14 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %57
%57 = OpLabel
%24 = OpAccessChain %23 %19 %25
%26 = OpLoad %5 %24
%27 = OpAccessChain %23 %19 %28
%29 = OpLoad %5 %27
%30 = OpAccessChain %23 %19 %31
%32 = OpLoad %5 %30
%33 = OpLoad %14 %16
%34 = OpIAdd %14 %33 %28
%36 = OpAccessChain %35 %9 %34
%37 = OpLoad %6 %36
%38 = OpIAdd %14 %33 %31
%40 = OpAccessChain %39 %13 %38
%41 = OpLoad %10 %40
%43 = OpSampledImage %42 %37 %41
%46 = OpCompositeConstruct %17 %26 %29 %32
%45 = OpImageSampleImplicitLod %20 %43 %46 None
%47 = OpCompositeExtract %5 %45 0
%48 = OpCompositeExtract %5 %45 1
%49 = OpCompositeExtract %5 %45 2
%50 = OpCompositeExtract %5 %45 3
%52 = OpAccessChain %51 %22 %25
OpStore %52 %47
%53 = OpAccessChain %51 %22 %28
OpStore %53 %48
%54 = OpAccessChain %51 %22 %31
OpStore %54 %49
%55 = OpAccessChain %51 %22 %56
OpStore %55 %50
OpReturn
OpFunctionEnd
#endif
