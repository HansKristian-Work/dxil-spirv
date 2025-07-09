#version 460

layout(set = 0, binding = 0) uniform texture2D _8;
layout(set = 0, binding = 5) uniform sampler _14[3];

layout(location = 0) flat in uint V;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _30 = texture(sampler2D(_8, _14[0u]), vec2(0.5));
    vec4 _42 = texture(sampler2D(_8, _14[2u]), vec2(0.5));
    vec4 _58 = texture(sampler2D(_8, _14[V]), vec2(0.5));
    SV_Target.x = (_42.x + _30.x) + _58.x;
    SV_Target.y = (_42.y + _30.y) + _58.y;
    SV_Target.z = (_42.z + _30.z) + _58.z;
    SV_Target.w = (_42.w + _30.w) + _58.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 76
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
%39 = OpConstant %10 2
%54 = OpConstant %10 5
%68 = OpTypePointer Output %5
%71 = OpConstant %10 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %74
%74 = OpLabel
%20 = OpLoad %10 %16
%21 = OpLoad %6 %8
%23 = OpAccessChain %22 %14 %24
%25 = OpLoad %9 %23
%27 = OpSampledImage %26 %21 %25
%32 = OpCompositeConstruct %31 %28 %28
%30 = OpImageSampleImplicitLod %17 %27 %32 None
%33 = OpCompositeExtract %5 %30 0
%34 = OpCompositeExtract %5 %30 1
%35 = OpCompositeExtract %5 %30 2
%36 = OpCompositeExtract %5 %30 3
%37 = OpLoad %6 %8
%38 = OpAccessChain %22 %14 %39
%40 = OpLoad %9 %38
%41 = OpSampledImage %26 %37 %40
%43 = OpCompositeConstruct %31 %28 %28
%42 = OpImageSampleImplicitLod %17 %41 %43 None
%44 = OpCompositeExtract %5 %42 0
%45 = OpCompositeExtract %5 %42 1
%46 = OpCompositeExtract %5 %42 2
%47 = OpCompositeExtract %5 %42 3
%48 = OpFAdd %5 %44 %33
%49 = OpFAdd %5 %45 %34
%50 = OpFAdd %5 %46 %35
%51 = OpFAdd %5 %47 %36
%52 = OpLoad %6 %8
%53 = OpIAdd %10 %20 %54
%55 = OpAccessChain %22 %14 %20
%56 = OpLoad %9 %55
%57 = OpSampledImage %26 %52 %56
%59 = OpCompositeConstruct %31 %28 %28
%58 = OpImageSampleImplicitLod %17 %57 %59 None
%60 = OpCompositeExtract %5 %58 0
%61 = OpCompositeExtract %5 %58 1
%62 = OpCompositeExtract %5 %58 2
%63 = OpCompositeExtract %5 %58 3
%64 = OpFAdd %5 %48 %60
%65 = OpFAdd %5 %49 %61
%66 = OpFAdd %5 %50 %62
%67 = OpFAdd %5 %51 %63
%69 = OpAccessChain %68 %19 %24
OpStore %69 %64
%70 = OpAccessChain %68 %19 %71
OpStore %70 %65
%72 = OpAccessChain %68 %19 %39
OpStore %72 %66
%73 = OpAccessChain %68 %19 %11
OpStore %73 %67
OpReturn
OpFunctionEnd
#endif
