#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform usamplerBuffer _9[];

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _19 = INDEX + 0u;
    uint _24 = INDEX * 4u;
    uvec4 _40 = uvec4(texelFetch(_9[nonuniformEXT(_19)], int(_24)).x, texelFetch(_9[nonuniformEXT(_19)], int(_24 + 1u)).x, texelFetch(_9[nonuniformEXT(_19)], int(_24 + 2u)).x, texelFetch(_9[nonuniformEXT(_19)], int(_24 + 3u)).x);
    SV_Target.x = uintBitsToFloat(_40.x);
    SV_Target.y = uintBitsToFloat(_40.y);
    SV_Target.z = uintBitsToFloat(_40.z);
    SV_Target.w = uintBitsToFloat(_40.w);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 55
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
OpDecorate %19 NonUniform
OpDecorate %23 NonUniform
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
%18 = OpConstant %5 4
%20 = OpConstant %5 0
%21 = OpTypePointer UniformConstant %6
%25 = OpTypeVector %5 4
%30 = OpConstant %5 1
%34 = OpConstant %5 2
%38 = OpConstant %5 3
%49 = OpTypePointer Output %12
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %54
%54 = OpLabel
%16 = OpLoad %5 %11
%17 = OpShiftLeftLogical %5 %16 %18
%19 = OpIAdd %5 %16 %20
%22 = OpAccessChain %21 %9 %19
%23 = OpLoad %6 %22
%24 = OpIMul %5 %16 %18
%26 = OpImageFetch %25 %23 %24
%27 = OpCompositeExtract %5 %26 0
%29 = OpIAdd %5 %24 %30
%28 = OpImageFetch %25 %23 %29
%31 = OpCompositeExtract %5 %28 0
%33 = OpIAdd %5 %24 %34
%32 = OpImageFetch %25 %23 %33
%35 = OpCompositeExtract %5 %32 0
%37 = OpIAdd %5 %24 %38
%36 = OpImageFetch %25 %23 %37
%39 = OpCompositeExtract %5 %36 0
%40 = OpCompositeConstruct %25 %27 %31 %35 %39
%41 = OpCompositeExtract %5 %40 0
%42 = OpCompositeExtract %5 %40 1
%43 = OpCompositeExtract %5 %40 2
%44 = OpCompositeExtract %5 %40 3
%45 = OpBitcast %12 %41
%46 = OpBitcast %12 %42
%47 = OpBitcast %12 %43
%48 = OpBitcast %12 %44
%50 = OpAccessChain %49 %15 %20
OpStore %50 %45
%51 = OpAccessChain %49 %15 %30
OpStore %51 %46
%52 = OpAccessChain %49 %15 %34
OpStore %52 %47
%53 = OpAccessChain %49 %15 %38
OpStore %53 %48
OpReturn
OpFunctionEnd
#endif
