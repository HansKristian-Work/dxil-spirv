#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, std430) readonly buffer SSBO
{
    uint _m0[];
} _10[];

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _18 = INDEX + 0u;
    uint _22 = INDEX * 4u;
    vec4 _41 = uintBitsToFloat(uvec4(_10[nonuniformEXT(_18)]._m0[_22], _10[nonuniformEXT(_18)]._m0[_22 + 1u], _10[nonuniformEXT(_18)]._m0[_22 + 2u], _10[nonuniformEXT(_18)]._m0[_22 + 3u]));
    SV_Target.x = _41.x;
    SV_Target.y = _41.y;
    SV_Target.z = _41.z;
    SV_Target.w = _41.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 53
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %12 %16
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %12 "INDEX"
OpName %16 "SV_Target"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonWritable
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %16 Location 0
OpDecorate %18 NonUniform
OpDecorate %21 NonUniform
OpDecorate %25 NonUniform
OpDecorate %27 NonUniform
OpDecorate %31 NonUniform
OpDecorate %35 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypeRuntimeArray %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypePointer Input %5
%12 = OpVariable %11 Input
%13 = OpTypeFloat 32
%14 = OpTypeVector %13 4
%15 = OpTypePointer Output %14
%16 = OpVariable %15 Output
%19 = OpConstant %5 0
%20 = OpTypePointer StorageBuffer %7
%23 = OpConstant %5 4
%24 = OpTypePointer StorageBuffer %5
%29 = OpConstant %5 1
%33 = OpConstant %5 2
%37 = OpConstant %5 3
%39 = OpTypeVector %5 4
%46 = OpTypePointer Output %13
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %51
%51 = OpLabel
%17 = OpLoad %5 %12
%18 = OpIAdd %5 %17 %19
%21 = OpAccessChain %20 %10 %18
%22 = OpIMul %5 %17 %23
%25 = OpAccessChain %24 %21 %19 %22
%26 = OpLoad %5 %25
%28 = OpIAdd %5 %22 %29
%27 = OpAccessChain %24 %21 %19 %28
%30 = OpLoad %5 %27
%32 = OpIAdd %5 %22 %33
%31 = OpAccessChain %24 %21 %19 %32
%34 = OpLoad %5 %31
%36 = OpIAdd %5 %22 %37
%35 = OpAccessChain %24 %21 %19 %36
%38 = OpLoad %5 %35
%40 = OpCompositeConstruct %39 %26 %30 %34 %38
%41 = OpBitcast %14 %40
%42 = OpCompositeExtract %13 %41 0
%43 = OpCompositeExtract %13 %41 1
%44 = OpCompositeExtract %13 %41 2
%45 = OpCompositeExtract %13 %41 3
%47 = OpAccessChain %46 %16 %19
OpStore %47 %42
%48 = OpAccessChain %46 %16 %29
OpStore %48 %43
%49 = OpAccessChain %46 %16 %33
OpStore %49 %44
%50 = OpAccessChain %46 %16 %37
OpStore %50 %45
OpReturn
OpFunctionEnd
#endif
