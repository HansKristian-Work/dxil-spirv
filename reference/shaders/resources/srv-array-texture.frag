#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform texture2D _9[];
layout(set = 1, binding = 0) uniform texture2D _14[100];
layout(set = 0, binding = 0) uniform sampler _17;

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _35 = textureOffset(sampler2D(_9[INDEX + 0u], _17), vec2(0.5), ivec2(0));
    vec4 _50 = textureOffset(sampler2D(_14[(INDEX ^ 1u) + 0u], _17), vec2(0.5), ivec2(0));
    SV_Target.x = _50.x + _35.x;
    SV_Target.y = _50.y + _35.y;
    SV_Target.z = _50.z + _35.z;
    SV_Target.w = _50.w + _35.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 69
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %19 %22
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %19 "INDEX"
OpName %22 "SV_Target"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 0
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %19 Flat
OpDecorate %19 Location 0
OpDecorate %22 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeInt 32 0
%11 = OpConstant %10 100
%12 = OpTypeArray %6 %11
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeSampler
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypePointer Input %10
%19 = OpVariable %18 Input
%20 = OpTypeVector %5 4
%21 = OpTypePointer Output %20
%22 = OpVariable %21 Output
%26 = OpConstant %10 0
%27 = OpTypePointer UniformConstant %6
%30 = OpTypeSampledImage %6
%32 = OpConstant %5 0.5
%33 = OpTypeInt 32 1
%34 = OpConstant %33 0
%36 = OpTypeVector %5 2
%38 = OpTypeVector %33 2
%39 = OpConstantComposite %38 %34 %34
%45 = OpConstant %10 1
%60 = OpTypePointer Output %5
%64 = OpConstant %10 2
%66 = OpConstant %10 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %67
%67 = OpLabel
%23 = OpLoad %15 %17
%24 = OpLoad %10 %19
%25 = OpIAdd %10 %24 %26
%28 = OpAccessChain %27 %9 %25
%29 = OpLoad %6 %28
%31 = OpSampledImage %30 %29 %23
%37 = OpCompositeConstruct %36 %32 %32
%35 = OpImageSampleImplicitLod %20 %31 %37 ConstOffset %39
%40 = OpCompositeExtract %5 %35 0
%41 = OpCompositeExtract %5 %35 1
%42 = OpCompositeExtract %5 %35 2
%43 = OpCompositeExtract %5 %35 3
%44 = OpBitwiseXor %10 %24 %45
%46 = OpIAdd %10 %44 %26
%47 = OpAccessChain %27 %14 %46
%48 = OpLoad %6 %47
%49 = OpSampledImage %30 %48 %23
%51 = OpCompositeConstruct %36 %32 %32
%50 = OpImageSampleImplicitLod %20 %49 %51 ConstOffset %39
%52 = OpCompositeExtract %5 %50 0
%53 = OpCompositeExtract %5 %50 1
%54 = OpCompositeExtract %5 %50 2
%55 = OpCompositeExtract %5 %50 3
%56 = OpFAdd %5 %52 %40
%57 = OpFAdd %5 %53 %41
%58 = OpFAdd %5 %54 %42
%59 = OpFAdd %5 %55 %43
%61 = OpAccessChain %60 %22 %26
OpStore %61 %56
%62 = OpAccessChain %60 %22 %45
OpStore %62 %57
%63 = OpAccessChain %60 %22 %64
OpStore %63 %58
%65 = OpAccessChain %60 %22 %66
OpStore %65 %59
OpReturn
OpFunctionEnd
#endif
