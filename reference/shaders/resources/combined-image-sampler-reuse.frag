#version 460

layout(set = 0, binding = 0) uniform texture2D _8;
layout(set = 1, binding = 0) uniform sampler _11;

layout(location = 0) in vec2 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _32 = textureOffset(sampler2D(_8, _11), vec2(UV.x, UV.y), ivec2(0));
    vec4 _43 = textureOffset(sampler2D(_8, _11), vec2(UV.x + 0.100000001490116119384765625, UV.y + 0.100000001490116119384765625), ivec2(0));
    SV_Target.x = _43.x + _32.x;
    SV_Target.y = _43.y + _32.y;
    SV_Target.z = _43.z + _32.z;
    SV_Target.w = _43.w + _32.w;
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
%34 = OpTypeVector %30 2
%35 = OpConstantComposite %34 %31 %31
%41 = OpConstant %5 0.100000001
%53 = OpTypePointer Output %5
%57 = OpConstant %22 2
%59 = OpConstant %22 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %60
%60 = OpLabel
%18 = OpLoad %6 %8
%19 = OpLoad %9 %11
%21 = OpAccessChain %20 %14 %23
%24 = OpLoad %5 %21
%25 = OpAccessChain %20 %14 %26
%27 = OpLoad %5 %25
%29 = OpSampledImage %28 %18 %19
%33 = OpCompositeConstruct %12 %24 %27
%32 = OpImageSampleImplicitLod %15 %29 %33 ConstOffset %35
%36 = OpCompositeExtract %5 %32 0
%37 = OpCompositeExtract %5 %32 1
%38 = OpCompositeExtract %5 %32 2
%39 = OpCompositeExtract %5 %32 3
%40 = OpFAdd %5 %24 %41
%42 = OpFAdd %5 %27 %41
%44 = OpCompositeConstruct %12 %40 %42
%43 = OpImageSampleImplicitLod %15 %29 %44 ConstOffset %35
%45 = OpCompositeExtract %5 %43 0
%46 = OpCompositeExtract %5 %43 1
%47 = OpCompositeExtract %5 %43 2
%48 = OpCompositeExtract %5 %43 3
%49 = OpFAdd %5 %45 %36
%50 = OpFAdd %5 %46 %37
%51 = OpFAdd %5 %47 %38
%52 = OpFAdd %5 %48 %39
%54 = OpAccessChain %53 %17 %23
OpStore %54 %49
%55 = OpAccessChain %53 %17 %26
OpStore %55 %50
%56 = OpAccessChain %53 %17 %57
OpStore %56 %51
%58 = OpAccessChain %53 %17 %59
OpStore %58 %52
OpReturn
OpFunctionEnd
#endif
