#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, std430) readonly buffer SSBO
{
    uvec4 _m0[];
} _11[];

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _26 = uintBitsToFloat(_11[nonuniformEXT(INDEX + 0u)]._m0[INDEX]);
    SV_Target.x = _26.x;
    SV_Target.y = _26.y;
    SV_Target.z = _26.z;
    SV_Target.w = _26.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 41
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %13 %17
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SSBO"
OpName %13 "INDEX"
OpName %17 "SV_Target"
OpDecorate %7 ArrayStride 16
OpMemberDecorate %8 0 Offset 0
OpDecorate %8 Block
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %11 NonWritable
OpDecorate %13 Flat
OpDecorate %13 Location 0
OpDecorate %17 Location 0
OpDecorate %19 NonUniform
OpDecorate %22 NonUniform
OpDecorate %24 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 4
%7 = OpTypeRuntimeArray %6
%8 = OpTypeStruct %7
%9 = OpTypeRuntimeArray %8
%10 = OpTypePointer StorageBuffer %9
%11 = OpVariable %10 StorageBuffer
%12 = OpTypePointer Input %5
%13 = OpVariable %12 Input
%14 = OpTypeFloat 32
%15 = OpTypeVector %14 4
%16 = OpTypePointer Output %15
%17 = OpVariable %16 Output
%20 = OpConstant %5 0
%21 = OpTypePointer StorageBuffer %8
%23 = OpTypePointer StorageBuffer %6
%31 = OpTypePointer Output %14
%34 = OpConstant %5 1
%36 = OpConstant %5 2
%38 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %39
%39 = OpLabel
%18 = OpLoad %5 %13
%19 = OpIAdd %5 %18 %20
%22 = OpAccessChain %21 %11 %19
%24 = OpAccessChain %23 %22 %20 %18
%25 = OpLoad %6 %24
%26 = OpBitcast %15 %25
%27 = OpCompositeExtract %14 %26 0
%28 = OpCompositeExtract %14 %26 1
%29 = OpCompositeExtract %14 %26 2
%30 = OpCompositeExtract %14 %26 3
%32 = OpAccessChain %31 %17 %20
OpStore %32 %27
%33 = OpAccessChain %31 %17 %34
OpStore %33 %28
%35 = OpAccessChain %31 %17 %36
OpStore %35 %29
%37 = OpAccessChain %31 %17 %38
OpStore %37 %30
OpReturn
OpFunctionEnd
#endif
