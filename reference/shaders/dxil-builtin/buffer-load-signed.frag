#version 460

layout(set = 0, binding = 0) uniform isamplerBuffer _8;
layout(set = 0, binding = 0, r32i) uniform readonly iimageBuffer _11;

layout(location = 0) flat in uint TEXCOORD;
layout(location = 0) out ivec2 SV_Target;

void main()
{
    uvec4 _24 = uvec4(texelFetch(_8, int(TEXCOORD)));
    uvec4 _28 = uvec4(imageLoad(_11, int(TEXCOORD)));
    SV_Target.x = int(_28.x + _24.x);
    SV_Target.y = int(_28.y + _24.y);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 42
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14 %17
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "TEXCOORD"
OpName %17 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %11 NonWritable
OpDecorate %14 Flat
OpDecorate %14 Location 0
OpDecorate %17 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 Buffer 0 0 0 2 R32i
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeInt 32 0
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%15 = OpTypeVector %5 2
%16 = OpTypePointer Output %15
%17 = OpVariable %16 Output
%21 = OpTypeVector %5 4
%23 = OpTypeVector %12 4
%33 = OpTypePointer Output %5
%35 = OpConstant %12 0
%38 = OpConstant %12 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %40
%40 = OpLabel
%18 = OpLoad %9 %11
%19 = OpLoad %6 %8
%20 = OpLoad %12 %14
%22 = OpImageFetch %21 %19 %20
%24 = OpBitcast %23 %22
%25 = OpCompositeExtract %12 %24 0
%26 = OpCompositeExtract %12 %24 1
%27 = OpImageRead %21 %18 %20
%28 = OpBitcast %23 %27
%29 = OpCompositeExtract %12 %28 0
%30 = OpCompositeExtract %12 %28 1
%31 = OpIAdd %12 %29 %25
%32 = OpIAdd %12 %30 %26
%34 = OpAccessChain %33 %17 %35
%36 = OpBitcast %5 %31
OpStore %34 %36
%37 = OpAccessChain %33 %17 %38
%39 = OpBitcast %5 %32
OpStore %37 %39
OpReturn
OpFunctionEnd
#endif
