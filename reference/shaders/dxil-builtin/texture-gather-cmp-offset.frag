#version 460

layout(set = 0, binding = 3) uniform texture2D _8;
layout(set = 0, binding = 4) uniform texture2DArray _11;
layout(set = 0, binding = 1) uniform samplerShadow _14;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec2 _40 = vec2(TEXCOORD.x, TEXCOORD.y);
    vec4 _44 = textureGatherOffset(sampler2DShadow(_8, _14), _40, TEXCOORD.z, ivec2(-3, -4));
    vec3 _54 = vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z);
    vec4 _56 = textureGatherOffset(sampler2DArrayShadow(_11, _14), _54, TEXCOORD.w, ivec2(-4, -5));
    SV_Target.x = _56.x + _44.x;
    SV_Target.y = _56.y + _44.y;
    SV_Target.z = _56.z + _44.z;
    SV_Target.w = _56.w + _44.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 73
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
%37 = OpTypeSampledImage %6
%39 = OpTypeVector %5 2
%41 = OpTypeInt 32 1
%42 = OpConstant %41 -3
%43 = OpConstant %41 -4
%45 = OpTypeVector %41 2
%46 = OpConstantComposite %45 %42 %43
%51 = OpTypeSampledImage %9
%53 = OpTypeVector %5 3
%55 = OpConstant %41 -5
%57 = OpConstantComposite %45 %43 %55
%66 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %71
%71 = OpLabel
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
%38 = OpSampledImage %37 %21 %22
%40 = OpCompositeConstruct %39 %27 %30
%44 = OpImageDrefGather %15 %38 %40 %33 ConstOffset %46
%47 = OpCompositeExtract %5 %44 0
%48 = OpCompositeExtract %5 %44 1
%49 = OpCompositeExtract %5 %44 2
%50 = OpCompositeExtract %5 %44 3
%52 = OpSampledImage %51 %20 %22
%54 = OpCompositeConstruct %53 %27 %30 %33
%56 = OpImageDrefGather %15 %52 %54 %36 ConstOffset %57
%58 = OpCompositeExtract %5 %56 0
%59 = OpCompositeExtract %5 %56 1
%60 = OpCompositeExtract %5 %56 2
%61 = OpCompositeExtract %5 %56 3
%62 = OpFAdd %5 %58 %47
%63 = OpFAdd %5 %59 %48
%64 = OpFAdd %5 %60 %49
%65 = OpFAdd %5 %61 %50
%67 = OpAccessChain %66 %19 %26
OpStore %67 %62
%68 = OpAccessChain %66 %19 %29
OpStore %68 %63
%69 = OpAccessChain %66 %19 %32
OpStore %69 %64
%70 = OpAccessChain %66 %19 %35
OpStore %70 %65
OpReturn
OpFunctionEnd
#endif
