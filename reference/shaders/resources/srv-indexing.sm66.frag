#version 460
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 5) uniform texture2D _11[3];

layout(location = 0) flat in uint V;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _22 = texelFetch(_11[0u], ivec2(uvec2(0u)), int(0u));
    vec4 _32 = texelFetch(_11[2u], ivec2(uvec2(0u)), int(0u));
    vec4 _46 = texelFetch(_11[V], ivec2(uvec2(0u)), int(0u));
    SV_Target.x = (_32.x + _22.x) + _46.x;
    SV_Target.y = (_32.y + _22.y) + _46.y;
    SV_Target.z = (_32.z + _22.z) + _46.z;
    SV_Target.w = (_32.w + _22.w) + _46.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 64
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %13 %16
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 "V"
OpName %16 "SV_Target"
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 5
OpDecorate %13 Flat
OpDecorate %13 Location 0
OpDecorate %16 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypeInt 32 0
%8 = OpConstant %7 3
%9 = OpTypeArray %6 %8
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypePointer Input %7
%13 = OpVariable %12 Input
%14 = OpTypeVector %5 4
%15 = OpTypePointer Output %14
%16 = OpVariable %15 Output
%18 = OpTypePointer UniformConstant %6
%20 = OpConstant %7 0
%23 = OpTypeVector %7 2
%30 = OpConstant %7 2
%43 = OpConstant %7 5
%56 = OpTypePointer Output %5
%59 = OpConstant %7 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %62
%62 = OpLabel
%17 = OpLoad %7 %13
%19 = OpAccessChain %18 %11 %20
%21 = OpLoad %6 %19
%24 = OpCompositeConstruct %23 %20 %20
%22 = OpImageFetch %14 %21 %24 Lod %20
%25 = OpCompositeExtract %5 %22 0
%26 = OpCompositeExtract %5 %22 1
%27 = OpCompositeExtract %5 %22 2
%28 = OpCompositeExtract %5 %22 3
%29 = OpAccessChain %18 %11 %30
%31 = OpLoad %6 %29
%33 = OpCompositeConstruct %23 %20 %20
%32 = OpImageFetch %14 %31 %33 Lod %20
%34 = OpCompositeExtract %5 %32 0
%35 = OpCompositeExtract %5 %32 1
%36 = OpCompositeExtract %5 %32 2
%37 = OpCompositeExtract %5 %32 3
%38 = OpFAdd %5 %34 %25
%39 = OpFAdd %5 %35 %26
%40 = OpFAdd %5 %36 %27
%41 = OpFAdd %5 %37 %28
%42 = OpIAdd %7 %17 %43
%44 = OpAccessChain %18 %11 %17
%45 = OpLoad %6 %44
%47 = OpCompositeConstruct %23 %20 %20
%46 = OpImageFetch %14 %45 %47 Lod %20
%48 = OpCompositeExtract %5 %46 0
%49 = OpCompositeExtract %5 %46 1
%50 = OpCompositeExtract %5 %46 2
%51 = OpCompositeExtract %5 %46 3
%52 = OpFAdd %5 %38 %48
%53 = OpFAdd %5 %39 %49
%54 = OpFAdd %5 %40 %50
%55 = OpFAdd %5 %41 %51
%57 = OpAccessChain %56 %16 %20
OpStore %57 %52
%58 = OpAccessChain %56 %16 %59
OpStore %58 %53
%60 = OpAccessChain %56 %16 %30
OpStore %60 %54
%61 = OpAccessChain %56 %16 %8
OpStore %61 %55
OpReturn
OpFunctionEnd
#endif
