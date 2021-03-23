#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, std140) uniform _10_13
{
    vec4 _m0[4];
} _13[];

layout(set = 1, binding = 0, std140) uniform _15_19
{
    vec4 _m0[4];
} _19[100];

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _25 = INDEX & 3u;
    uint _27 = INDEX + 0u;
    uint _38 = INDEX & 1u;
    uint _41 = (INDEX ^ 1u) + 0u;
    SV_Target.x = _19[_41]._m0[_38].x + _13[_27]._m0[_25].x;
    SV_Target.y = _19[_41]._m0[_38].y + _13[_27]._m0[_25].y;
    SV_Target.z = _19[_41]._m0[_38].z + _13[_27]._m0[_25].z;
    SV_Target.w = _19[_41]._m0[_38].w + _13[_27]._m0[_25].w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 61
; Schema: 0
OpCapability Shader
OpCapability UniformBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %21 %23
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %15 ""
OpName %21 "INDEX"
OpName %23 "SV_Target"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %14 ArrayStride 16
OpMemberDecorate %15 0 Offset 0
OpDecorate %15 Block
OpDecorate %19 DescriptorSet 1
OpDecorate %19 Binding 0
OpDecorate %21 Flat
OpDecorate %21 Location 0
OpDecorate %23 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 4
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer Uniform %11
%13 = OpVariable %12 Uniform
%14 = OpTypeArray %8 %6
%15 = OpTypeStruct %14
%16 = OpConstant %5 100
%17 = OpTypeArray %15 %16
%18 = OpTypePointer Uniform %17
%19 = OpVariable %18 Uniform
%20 = OpTypePointer Input %5
%21 = OpVariable %20 Input
%22 = OpTypePointer Output %8
%23 = OpVariable %22 Output
%26 = OpConstant %5 3
%28 = OpConstant %5 0
%29 = OpTypePointer Uniform %10
%31 = OpTypePointer Uniform %8
%39 = OpConstant %5 1
%42 = OpTypePointer Uniform %15
%54 = OpTypePointer Output %7
%58 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %60
%60 = OpLabel
%24 = OpLoad %5 %21
%25 = OpBitwiseAnd %5 %24 %26
%27 = OpIAdd %5 %24 %28
%30 = OpAccessChain %29 %13 %27
%32 = OpAccessChain %31 %30 %28 %25
%33 = OpLoad %8 %32
%34 = OpCompositeExtract %7 %33 0
%35 = OpCompositeExtract %7 %33 1
%36 = OpCompositeExtract %7 %33 2
%37 = OpCompositeExtract %7 %33 3
%38 = OpBitwiseAnd %5 %24 %39
%40 = OpBitwiseXor %5 %24 %39
%41 = OpIAdd %5 %40 %28
%43 = OpAccessChain %42 %19 %41
%44 = OpAccessChain %31 %43 %28 %38
%45 = OpLoad %8 %44
%46 = OpCompositeExtract %7 %45 0
%47 = OpCompositeExtract %7 %45 1
%48 = OpCompositeExtract %7 %45 2
%49 = OpCompositeExtract %7 %45 3
%50 = OpFAdd %7 %46 %34
%51 = OpFAdd %7 %47 %35
%52 = OpFAdd %7 %48 %36
%53 = OpFAdd %7 %49 %37
%55 = OpAccessChain %54 %23 %28
OpStore %55 %50
%56 = OpAccessChain %54 %23 %39
OpStore %56 %51
%57 = OpAccessChain %54 %23 %58
OpStore %57 %52
%59 = OpAccessChain %54 %23 %26
OpStore %59 %53
OpReturn
OpFunctionEnd
#endif
