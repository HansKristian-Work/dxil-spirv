#version 460

layout(set = 0, binding = 0) uniform texture2D _8;
layout(set = 1, binding = 0) uniform sampler _11;

layout(location = 0) in vec2 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _31 = texture(sampler2D(_8, _11), vec2(UV.x, UV.y));
    vec4 _40 = texture(sampler2D(_8, _11), vec2(UV.x + 0.100000001490116119384765625, UV.y + 0.100000001490116119384765625));
    SV_Target.x = _40.x + _31.x;
    SV_Target.y = _40.y + _31.y;
    SV_Target.z = _40.z + _31.z;
    SV_Target.w = _40.w + _31.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 59
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
%30 = OpConstant %5 0
%38 = OpConstant %5 0.100000001
%50 = OpTypePointer Output %5
%54 = OpConstant %22 2
%56 = OpConstant %22 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %57
%57 = OpLabel
%18 = OpLoad %6 %8
%19 = OpLoad %9 %11
%21 = OpAccessChain %20 %14 %23
%24 = OpLoad %5 %21
%25 = OpAccessChain %20 %14 %26
%27 = OpLoad %5 %25
%29 = OpSampledImage %28 %18 %19
%32 = OpCompositeConstruct %12 %24 %27
%31 = OpImageSampleImplicitLod %15 %29 %32 None
%33 = OpCompositeExtract %5 %31 0
%34 = OpCompositeExtract %5 %31 1
%35 = OpCompositeExtract %5 %31 2
%36 = OpCompositeExtract %5 %31 3
%37 = OpFAdd %5 %24 %38
%39 = OpFAdd %5 %27 %38
%41 = OpCompositeConstruct %12 %37 %39
%40 = OpImageSampleImplicitLod %15 %29 %41 None
%42 = OpCompositeExtract %5 %40 0
%43 = OpCompositeExtract %5 %40 1
%44 = OpCompositeExtract %5 %40 2
%45 = OpCompositeExtract %5 %40 3
%46 = OpFAdd %5 %42 %33
%47 = OpFAdd %5 %43 %34
%48 = OpFAdd %5 %44 %35
%49 = OpFAdd %5 %45 %36
%51 = OpAccessChain %50 %17 %23
OpStore %51 %46
%52 = OpAccessChain %50 %17 %26
OpStore %52 %47
%53 = OpAccessChain %50 %17 %54
OpStore %53 %48
%55 = OpAccessChain %50 %17 %56
OpStore %55 %49
OpReturn
OpFunctionEnd
#endif
