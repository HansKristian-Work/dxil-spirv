#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform usamplerBuffer _9[];

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _17 = INDEX + 0u;
    uint _22 = INDEX * 4u;
    vec4 _40 = uintBitsToFloat(uvec4(texelFetch(_9[nonuniformEXT(_17)], int(_22)).x, texelFetch(_9[nonuniformEXT(_17)], int(_22 + 1u)).x, texelFetch(_9[nonuniformEXT(_17)], int(_22 + 2u)).x, texelFetch(_9[nonuniformEXT(_17)], int(_22 + 3u)).x));
    SV_Target.x = _40.x;
    SV_Target.y = _40.y;
    SV_Target.z = _40.z;
    SV_Target.w = _40.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 51
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability RuntimeDescriptorArray
OpCapability UniformTexelBufferArrayDynamicIndexing
OpCapability UniformTexelBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %11 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "INDEX"
OpName %15 "SV_Target"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %11 Flat
OpDecorate %11 Location 0
OpDecorate %15 Location 0
OpDecorate %17 NonUniform
OpDecorate %21 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypePointer Input %5
%11 = OpVariable %10 Input
%12 = OpTypeFloat 32
%13 = OpTypeVector %12 4
%14 = OpTypePointer Output %13
%15 = OpVariable %14 Output
%18 = OpConstant %5 0
%19 = OpTypePointer UniformConstant %6
%23 = OpConstant %5 4
%24 = OpTypeVector %5 4
%29 = OpConstant %5 1
%33 = OpConstant %5 2
%37 = OpConstant %5 3
%45 = OpTypePointer Output %12
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %50
%50 = OpLabel
%16 = OpLoad %5 %11
%17 = OpIAdd %5 %16 %18
%20 = OpAccessChain %19 %9 %17
%21 = OpLoad %6 %20
%22 = OpIMul %5 %16 %23
%25 = OpImageFetch %24 %21 %22
%26 = OpCompositeExtract %5 %25 0
%28 = OpIAdd %5 %22 %29
%27 = OpImageFetch %24 %21 %28
%30 = OpCompositeExtract %5 %27 0
%32 = OpIAdd %5 %22 %33
%31 = OpImageFetch %24 %21 %32
%34 = OpCompositeExtract %5 %31 0
%36 = OpIAdd %5 %22 %37
%35 = OpImageFetch %24 %21 %36
%38 = OpCompositeExtract %5 %35 0
%39 = OpCompositeConstruct %24 %26 %30 %34 %38
%40 = OpBitcast %13 %39
%41 = OpCompositeExtract %12 %40 0
%42 = OpCompositeExtract %12 %40 1
%43 = OpCompositeExtract %12 %40 2
%44 = OpCompositeExtract %12 %40 3
%46 = OpAccessChain %45 %15 %18
OpStore %46 %41
%47 = OpAccessChain %45 %15 %29
OpStore %47 %42
%48 = OpAccessChain %45 %15 %33
OpStore %48 %43
%49 = OpAccessChain %45 %15 %37
OpStore %49 %44
OpReturn
OpFunctionEnd
#endif
