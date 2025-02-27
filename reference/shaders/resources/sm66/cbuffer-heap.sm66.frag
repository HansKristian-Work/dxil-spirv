#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0, std140) uniform BindlessCBV
{
    vec4 _m0[4096];
} _17[];

layout(set = 0, binding = 0) uniform texture3D _9[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) in vec3 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uvec4 _40 = floatBitsToUint(_17[nonuniformEXT(INDEX + 2u)]._m0[0u]);
    vec4 _45 = texelFetch(_9[INDEX + 1u], ivec3(uvec3(_40.xyz)), int(_40.w));
    SV_Target.x = _45.x;
    SV_Target.y = _45.y;
    SV_Target.z = _45.z;
    SV_Target.w = _45.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 60
; Schema: 0
OpCapability Shader
OpCapability RuntimeDescriptorArray
OpCapability UniformBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %19 %22 %24
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "BindlessCBV"
OpName %19 "INDEX"
OpName %22 "UV"
OpName %24 "SV_Target"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %13 ArrayStride 16
OpDecorate %14 Block
OpMemberDecorate %14 0 Offset 0
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %19 Flat
OpDecorate %19 Location 0
OpDecorate %22 Location 1
OpDecorate %24 Location 0
OpDecorate %34 NonUniform
OpDecorate %37 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 3D 0 0 0 1 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeVector %5 4
%11 = OpTypeInt 32 0
%12 = OpConstant %11 4096
%13 = OpTypeArray %10 %12
%14 = OpTypeStruct %13
%15 = OpTypeRuntimeArray %14
%16 = OpTypePointer Uniform %15
%17 = OpVariable %16 Uniform
%18 = OpTypePointer Input %11
%19 = OpVariable %18 Input
%20 = OpTypeVector %5 3
%21 = OpTypePointer Input %20
%22 = OpVariable %21 Input
%23 = OpTypePointer Output %10
%24 = OpVariable %23 Output
%27 = OpConstant %11 1
%28 = OpTypePointer UniformConstant %6
%32 = OpConstant %11 2
%33 = OpTypePointer Uniform %14
%35 = OpConstant %11 0
%36 = OpTypePointer Uniform %10
%39 = OpTypeVector %11 4
%46 = OpTypeVector %11 3
%52 = OpTypePointer Output %5
%57 = OpConstant %11 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %58
%58 = OpLabel
%25 = OpLoad %11 %19
%26 = OpIAdd %11 %25 %27
%29 = OpAccessChain %28 %9 %26
%30 = OpLoad %6 %29
%31 = OpIAdd %11 %25 %32
%34 = OpAccessChain %33 %17 %31
%37 = OpAccessChain %36 %34 %35 %35
%38 = OpLoad %10 %37
%40 = OpBitcast %39 %38
%41 = OpCompositeExtract %11 %40 0
%42 = OpCompositeExtract %11 %40 1
%43 = OpCompositeExtract %11 %40 2
%44 = OpCompositeExtract %11 %40 3
%47 = OpCompositeConstruct %46 %41 %42 %43
%45 = OpImageFetch %10 %30 %47 Lod %44
%48 = OpCompositeExtract %5 %45 0
%49 = OpCompositeExtract %5 %45 1
%50 = OpCompositeExtract %5 %45 2
%51 = OpCompositeExtract %5 %45 3
%53 = OpAccessChain %52 %24 %35
OpStore %53 %48
%54 = OpAccessChain %52 %24 %27
OpStore %54 %49
%55 = OpAccessChain %52 %24 %32
OpStore %55 %50
%56 = OpAccessChain %52 %24 %57
OpStore %56 %51
OpReturn
OpFunctionEnd
#endif
