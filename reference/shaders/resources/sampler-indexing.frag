#version 460

layout(set = 0, binding = 0) uniform texture2D _8;
layout(set = 0, binding = 5) uniform sampler _14[3];

layout(location = 0) flat in uint V;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _30 = texture(sampler2D(_8, _14[0u]), vec2(0.5));
    vec4 _41 = texture(sampler2D(_8, _14[2u]), vec2(0.5));
    vec4 _56 = texture(sampler2D(_8, _14[V]), vec2(0.5));
    SV_Target.x = (_41.x + _30.x) + _56.x;
    SV_Target.y = (_41.y + _30.y) + _56.y;
    SV_Target.z = (_41.z + _30.z) + _56.z;
    SV_Target.w = (_41.w + _30.w) + _56.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 74
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %16 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %16 "V"
OpName %19 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 5
OpDecorate %16 Flat
OpDecorate %16 Location 0
OpDecorate %19 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeSampler
%10 = OpTypeInt 32 0
%11 = OpConstant %10 3
%12 = OpTypeArray %9 %11
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypePointer Input %10
%16 = OpVariable %15 Input
%17 = OpTypeVector %5 4
%18 = OpTypePointer Output %17
%19 = OpVariable %18 Output
%22 = OpTypePointer UniformConstant %9
%24 = OpConstant %10 0
%26 = OpTypeSampledImage %6
%28 = OpConstant %5 0.5
%29 = OpConstant %5 0
%31 = OpTypeVector %5 2
%38 = OpConstant %10 2
%52 = OpConstant %10 5
%66 = OpTypePointer Output %5
%69 = OpConstant %10 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %72
%72 = OpLabel
%20 = OpLoad %6 %8
%21 = OpLoad %10 %16
%23 = OpAccessChain %22 %14 %24
%25 = OpLoad %9 %23
%27 = OpSampledImage %26 %20 %25
%32 = OpCompositeConstruct %31 %28 %28
%30 = OpImageSampleImplicitLod %17 %27 %32 None
%33 = OpCompositeExtract %5 %30 0
%34 = OpCompositeExtract %5 %30 1
%35 = OpCompositeExtract %5 %30 2
%36 = OpCompositeExtract %5 %30 3
%37 = OpAccessChain %22 %14 %38
%39 = OpLoad %9 %37
%40 = OpSampledImage %26 %20 %39
%42 = OpCompositeConstruct %31 %28 %28
%41 = OpImageSampleImplicitLod %17 %40 %42 None
%43 = OpCompositeExtract %5 %41 0
%44 = OpCompositeExtract %5 %41 1
%45 = OpCompositeExtract %5 %41 2
%46 = OpCompositeExtract %5 %41 3
%47 = OpFAdd %5 %43 %33
%48 = OpFAdd %5 %44 %34
%49 = OpFAdd %5 %45 %35
%50 = OpFAdd %5 %46 %36
%51 = OpIAdd %10 %21 %52
%53 = OpAccessChain %22 %14 %21
%54 = OpLoad %9 %53
%55 = OpSampledImage %26 %20 %54
%57 = OpCompositeConstruct %31 %28 %28
%56 = OpImageSampleImplicitLod %17 %55 %57 None
%58 = OpCompositeExtract %5 %56 0
%59 = OpCompositeExtract %5 %56 1
%60 = OpCompositeExtract %5 %56 2
%61 = OpCompositeExtract %5 %56 3
%62 = OpFAdd %5 %47 %58
%63 = OpFAdd %5 %48 %59
%64 = OpFAdd %5 %49 %60
%65 = OpFAdd %5 %50 %61
%67 = OpAccessChain %66 %19 %24
OpStore %67 %62
%68 = OpAccessChain %66 %19 %69
OpStore %68 %63
%70 = OpAccessChain %66 %19 %38
OpStore %70 %64
%71 = OpAccessChain %66 %19 %11
OpStore %71 %65
OpReturn
OpFunctionEnd
#endif
