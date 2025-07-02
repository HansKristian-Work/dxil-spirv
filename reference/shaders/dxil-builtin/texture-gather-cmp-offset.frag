#version 460

layout(set = 0, binding = 3) uniform texture2D _8;
layout(set = 0, binding = 4) uniform texture2DArray _11;
layout(set = 0, binding = 1) uniform samplerShadow _14;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec2 _41 = vec2(TEXCOORD.x, TEXCOORD.y);
    vec4 _45 = textureGatherOffset(sampler2DShadow(_8, _14), _41, TEXCOORD.z, ivec2(-3, -4));
    vec3 _56 = vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z);
    vec4 _58 = textureGatherOffset(sampler2DArrayShadow(_11, _14), _56, TEXCOORD.w, ivec2(-4, -5));
    SV_Target.x = _58.x + _45.x;
    SV_Target.y = _58.y + _45.y;
    SV_Target.z = _58.z + _45.z;
    SV_Target.w = _58.w + _45.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 75
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
%35 = OpConstant %25 3
%37 = OpTypeImage %5 2D 1 0 0 1 Unknown
%38 = OpTypeSampledImage %37
%40 = OpTypeVector %5 2
%42 = OpTypeInt 32 1
%43 = OpConstant %42 -3
%44 = OpConstant %42 -4
%46 = OpTypeVector %42 2
%47 = OpConstantComposite %46 %43 %44
%52 = OpTypeImage %5 2D 1 1 0 1 Unknown
%53 = OpTypeSampledImage %52
%55 = OpTypeVector %5 3
%57 = OpConstant %42 -5
%59 = OpConstantComposite %46 %44 %57
%68 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %73
%73 = OpLabel
%20 = OpLoad %9 %11
%21 = OpLoad %6 %8
%22 = OpLoad %12 %14
%24 = OpAccessChain %23 %17 %26
%27 = OpLoad %5 %24
%28 = OpAccessChain %23 %17 %29
%30 = OpLoad %5 %28
%31 = OpAccessChain %23 %17 %32
%33 = OpLoad %5 %31
%34 = OpAccessChain %23 %17 %35
%36 = OpLoad %5 %34
%39 = OpSampledImage %38 %21 %22
%41 = OpCompositeConstruct %40 %27 %30
%45 = OpImageDrefGather %15 %39 %41 %33 ConstOffset %47
%48 = OpCompositeExtract %5 %45 0
%49 = OpCompositeExtract %5 %45 1
%50 = OpCompositeExtract %5 %45 2
%51 = OpCompositeExtract %5 %45 3
%54 = OpSampledImage %53 %20 %22
%56 = OpCompositeConstruct %55 %27 %30 %33
%58 = OpImageDrefGather %15 %54 %56 %36 ConstOffset %59
%60 = OpCompositeExtract %5 %58 0
%61 = OpCompositeExtract %5 %58 1
%62 = OpCompositeExtract %5 %58 2
%63 = OpCompositeExtract %5 %58 3
%64 = OpFAdd %5 %60 %48
%65 = OpFAdd %5 %61 %49
%66 = OpFAdd %5 %62 %50
%67 = OpFAdd %5 %63 %51
%69 = OpAccessChain %68 %19 %26
OpStore %69 %64
%70 = OpAccessChain %68 %19 %29
OpStore %70 %65
%71 = OpAccessChain %68 %19 %32
OpStore %71 %66
%72 = OpAccessChain %68 %19 %35
OpStore %72 %67
OpReturn
OpFunctionEnd
#endif
