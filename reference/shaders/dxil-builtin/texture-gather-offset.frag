#version 460

layout(set = 0, binding = 3) uniform texture2D _8;
layout(set = 0, binding = 4) uniform texture2DArray _11;
layout(set = 0, binding = 1) uniform sampler _14;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _41 = textureGatherOffset(sampler2D(_8, _14), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(1, 2));
    vec4 _54 = textureGatherOffset(sampler2DArray(_11, _14), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(-2, -3), 1u);
    SV_Target.x = _54.x + _41.x;
    SV_Target.y = _54.y + _41.y;
    SV_Target.z = _54.z + _41.z;
    SV_Target.w = _54.w + _41.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 71
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
%34 = OpTypeSampledImage %6
%36 = OpTypeVector %5 2
%38 = OpTypeInt 32 1
%39 = OpConstant %38 1
%40 = OpConstant %38 2
%42 = OpTypeVector %38 2
%43 = OpConstantComposite %42 %39 %40
%48 = OpTypeSampledImage %9
%50 = OpTypeVector %5 3
%52 = OpConstant %38 -2
%53 = OpConstant %38 -3
%55 = OpConstantComposite %42 %52 %53
%64 = OpTypePointer Output %5
%69 = OpConstant %25 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %70
%70 = OpLabel
%20 = OpLoad %9 %11
%21 = OpLoad %6 %8
%22 = OpLoad %12 %14
%24 = OpAccessChain %23 %17 %26
%27 = OpLoad %5 %24
%28 = OpAccessChain %23 %17 %29
%30 = OpLoad %5 %28
%31 = OpAccessChain %23 %17 %32
%33 = OpLoad %5 %31
%35 = OpSampledImage %34 %21 %22
%37 = OpCompositeConstruct %36 %27 %30
%41 = OpImageGather %15 %35 %37 %26 ConstOffset %43
%44 = OpCompositeExtract %5 %41 0
%45 = OpCompositeExtract %5 %41 1
%46 = OpCompositeExtract %5 %41 2
%47 = OpCompositeExtract %5 %41 3
%49 = OpSampledImage %48 %20 %22
%51 = OpCompositeConstruct %50 %27 %30 %33
%54 = OpImageGather %15 %49 %51 %29 ConstOffset %55
%56 = OpCompositeExtract %5 %54 0
%57 = OpCompositeExtract %5 %54 1
%58 = OpCompositeExtract %5 %54 2
%59 = OpCompositeExtract %5 %54 3
%60 = OpFAdd %5 %56 %44
%61 = OpFAdd %5 %57 %45
%62 = OpFAdd %5 %58 %46
%63 = OpFAdd %5 %59 %47
%65 = OpAccessChain %64 %19 %26
OpStore %65 %60
%66 = OpAccessChain %64 %19 %29
OpStore %66 %61
%67 = OpAccessChain %64 %19 %32
OpStore %67 %62
%68 = OpAccessChain %64 %19 %69
OpStore %68 %63
OpReturn
OpFunctionEnd
#endif
