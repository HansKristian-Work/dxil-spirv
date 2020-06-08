#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform texture2D _9[];
layout(set = 1, binding = 0) uniform texture2D _14[100];
layout(set = 0, binding = 0) uniform sampler _17;

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _36 = textureOffset(sampler2D(_9[INDEX + 0u], _17), vec2(0.5), ivec2(0));
    vec4 _51 = textureOffset(sampler2D(_14[(INDEX ^ 1u) + 0u], _17), vec2(0.5), ivec2(0));
    SV_Target.x = _51.x + _36.x;
    SV_Target.y = _51.y + _36.y;
    SV_Target.z = _51.z + _36.z;
    SV_Target.w = _51.w + _36.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 70
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
%35 = OpConstant %5 0
%37 = OpTypeVector %5 2
%39 = OpTypeVector %33 2
%40 = OpConstantComposite %39 %34 %34
%46 = OpConstant %10 1
%61 = OpTypePointer Output %5
%65 = OpConstant %10 2
%67 = OpConstant %10 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %68
%68 = OpLabel
%23 = OpLoad %15 %17
%24 = OpLoad %10 %19
%25 = OpIAdd %10 %24 %26
%28 = OpAccessChain %27 %9 %25
%29 = OpLoad %6 %28
%31 = OpSampledImage %30 %29 %23
%38 = OpCompositeConstruct %37 %32 %32
%36 = OpImageSampleImplicitLod %20 %31 %38 ConstOffset %40
%41 = OpCompositeExtract %5 %36 0
%42 = OpCompositeExtract %5 %36 1
%43 = OpCompositeExtract %5 %36 2
%44 = OpCompositeExtract %5 %36 3
%45 = OpBitwiseXor %10 %24 %46
%47 = OpIAdd %10 %45 %26
%48 = OpAccessChain %27 %14 %47
%49 = OpLoad %6 %48
%50 = OpSampledImage %30 %49 %23
%52 = OpCompositeConstruct %37 %32 %32
%51 = OpImageSampleImplicitLod %20 %50 %52 ConstOffset %40
%53 = OpCompositeExtract %5 %51 0
%54 = OpCompositeExtract %5 %51 1
%55 = OpCompositeExtract %5 %51 2
%56 = OpCompositeExtract %5 %51 3
%57 = OpFAdd %5 %53 %41
%58 = OpFAdd %5 %54 %42
%59 = OpFAdd %5 %55 %43
%60 = OpFAdd %5 %56 %44
%62 = OpAccessChain %61 %22 %26
OpStore %62 %57
%63 = OpAccessChain %61 %22 %46
OpStore %63 %58
%64 = OpAccessChain %61 %22 %65
OpStore %64 %59
%66 = OpAccessChain %61 %22 %67
OpStore %66 %60
OpReturn
OpFunctionEnd
#endif
