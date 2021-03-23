#version 460

layout(set = 0, binding = 0) uniform texture2D _8;
layout(set = 1, binding = 0) uniform sampler _11;

layout(location = 0) in vec2 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _33 = textureOffset(sampler2D(_8, _11), vec2(UV.x, UV.y), ivec2(0));
    vec4 _44 = textureOffset(sampler2D(_8, _11), vec2(UV.x + 0.100000001490116119384765625, UV.y + 0.100000001490116119384765625), ivec2(0));
    SV_Target.x = _44.x + _33.x;
    SV_Target.y = _44.y + _33.y;
    SV_Target.z = _44.z + _33.z;
    SV_Target.w = _44.w + _33.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 62
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14 %17
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "UV"
OpName %17 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 1
OpDecorate %11 Binding 0
OpDecorate %14 Location 0
OpDecorate %17 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeSampler
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeVector %5 2
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%15 = OpTypeVector %5 4
%16 = OpTypePointer Output %15
%17 = OpVariable %16 Output
%20 = OpTypePointer Input %5
%22 = OpTypeInt 32 0
%23 = OpConstant %22 0
%26 = OpConstant %22 1
%28 = OpTypeSampledImage %6
%30 = OpTypeInt 32 1
%31 = OpConstant %30 0
%32 = OpConstant %5 0
%35 = OpTypeVector %30 2
%36 = OpConstantComposite %35 %31 %31
%42 = OpConstant %5 0.100000001
%54 = OpTypePointer Output %5
%58 = OpConstant %22 2
%60 = OpConstant %22 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %61
%61 = OpLabel
%18 = OpLoad %6 %8
%19 = OpLoad %9 %11
%21 = OpAccessChain %20 %14 %23
%24 = OpLoad %5 %21
%25 = OpAccessChain %20 %14 %26
%27 = OpLoad %5 %25
%29 = OpSampledImage %28 %18 %19
%34 = OpCompositeConstruct %12 %24 %27
%33 = OpImageSampleImplicitLod %15 %29 %34 ConstOffset %36
%37 = OpCompositeExtract %5 %33 0
%38 = OpCompositeExtract %5 %33 1
%39 = OpCompositeExtract %5 %33 2
%40 = OpCompositeExtract %5 %33 3
%41 = OpFAdd %5 %24 %42
%43 = OpFAdd %5 %27 %42
%45 = OpCompositeConstruct %12 %41 %43
%44 = OpImageSampleImplicitLod %15 %29 %45 ConstOffset %36
%46 = OpCompositeExtract %5 %44 0
%47 = OpCompositeExtract %5 %44 1
%48 = OpCompositeExtract %5 %44 2
%49 = OpCompositeExtract %5 %44 3
%50 = OpFAdd %5 %46 %37
%51 = OpFAdd %5 %47 %38
%52 = OpFAdd %5 %48 %39
%53 = OpFAdd %5 %49 %40
%55 = OpAccessChain %54 %17 %23
OpStore %55 %50
%56 = OpAccessChain %54 %17 %26
OpStore %56 %51
%57 = OpAccessChain %54 %17 %58
OpStore %57 %52
%59 = OpAccessChain %54 %17 %60
OpStore %59 %53
OpReturn
OpFunctionEnd
#endif
