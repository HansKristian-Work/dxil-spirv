#version 460

layout(set = 0, binding = 3) uniform texture2D _8;
layout(set = 0, binding = 4) uniform texture2DArray _11;
layout(set = 0, binding = 1) uniform sampler _14;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _42 = textureGatherOffset(sampler2D(_8, _14), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(1, 2), 0u);
    vec4 _56 = textureGatherOffset(sampler2DArray(_11, _14), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(-2, -3), 1u);
    SV_Target.x = _56.x + _42.x;
    SV_Target.y = _56.y + _42.y;
    SV_Target.z = _56.z + _42.z;
    SV_Target.w = _56.w + _42.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 74
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %17 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %17 "TEXCOORD"
OpName %19 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 3
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 4
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 1
OpDecorate %17 Location 0
OpDecorate %19 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 2D 0 1 0 1 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeSampler
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeVector %5 4
%16 = OpTypePointer Input %15
%17 = OpVariable %16 Input
%18 = OpTypePointer Output %15
%19 = OpVariable %18 Output
%23 = OpTypePointer Input %5
%25 = OpTypeInt 32 0
%26 = OpConstant %25 0
%29 = OpConstant %25 1
%32 = OpConstant %25 2
%34 = OpTypeImage %5 2D 0 0 0 2 Unknown
%35 = OpTypeSampledImage %34
%37 = OpTypeVector %5 2
%39 = OpTypeInt 32 1
%40 = OpConstant %39 1
%41 = OpConstant %39 2
%43 = OpTypeVector %39 2
%44 = OpConstantComposite %43 %40 %41
%49 = OpTypeImage %5 2D 0 1 0 2 Unknown
%50 = OpTypeSampledImage %49
%52 = OpTypeVector %5 3
%54 = OpConstant %39 -2
%55 = OpConstant %39 -3
%57 = OpConstantComposite %43 %54 %55
%66 = OpTypePointer Output %5
%71 = OpConstant %25 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %72
%72 = OpLabel
%20 = OpLoad %9 %11
%21 = OpLoad %6 %8
%22 = OpLoad %12 %14
%24 = OpAccessChain %23 %17 %26
%27 = OpLoad %5 %24
%28 = OpAccessChain %23 %17 %29
%30 = OpLoad %5 %28
%31 = OpAccessChain %23 %17 %32
%33 = OpLoad %5 %31
%36 = OpSampledImage %35 %21 %22
%38 = OpCompositeConstruct %37 %27 %30
%42 = OpImageGather %15 %36 %38 %26 ConstOffset %44
%45 = OpCompositeExtract %5 %42 0
%46 = OpCompositeExtract %5 %42 1
%47 = OpCompositeExtract %5 %42 2
%48 = OpCompositeExtract %5 %42 3
%51 = OpSampledImage %50 %20 %22
%53 = OpCompositeConstruct %52 %27 %30 %33
%56 = OpImageGather %15 %51 %53 %29 ConstOffset %57
%58 = OpCompositeExtract %5 %56 0
%59 = OpCompositeExtract %5 %56 1
%60 = OpCompositeExtract %5 %56 2
%61 = OpCompositeExtract %5 %56 3
%62 = OpFAdd %5 %58 %45
%63 = OpFAdd %5 %59 %46
%64 = OpFAdd %5 %60 %47
%65 = OpFAdd %5 %61 %48
%67 = OpAccessChain %66 %19 %26
OpStore %67 %62
%68 = OpAccessChain %66 %19 %29
OpStore %68 %63
%69 = OpAccessChain %66 %19 %32
OpStore %69 %64
%70 = OpAccessChain %66 %19 %71
OpStore %70 %65
OpReturn
OpFunctionEnd
#endif
