#version 460

layout(set = 0, binding = 5, std140) uniform _10_14
{
    vec4 _m0[1];
} _14[3];

layout(location = 0) flat in uint V;
layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = (_14[2u]._m0[0u].x + _14[0u]._m0[0u].x) + _14[nonuniformEXT(V)]._m0[0u].x;
    SV_Target.y = (_14[2u]._m0[0u].y + _14[0u]._m0[0u].y) + _14[nonuniformEXT(V)]._m0[0u].y;
    SV_Target.z = (_14[2u]._m0[0u].z + _14[0u]._m0[0u].z) + _14[nonuniformEXT(V)]._m0[0u].z;
    SV_Target.w = (_14[2u]._m0[0u].w + _14[0u]._m0[0u].w) + _14[nonuniformEXT(V)]._m0[0u].w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 62
; Schema: 0
OpCapability Shader
OpCapability UniformBufferArrayDynamicIndexing
OpCapability UniformBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %16 %18
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %16 "V"
OpName %18 "SV_Target"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 5
OpDecorate %16 Flat
OpDecorate %16 Location 0
OpDecorate %18 Location 0
OpDecorate %44 NonUniform
OpDecorate %45 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 1
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpConstant %5 3
%12 = OpTypeArray %10 %11
%13 = OpTypePointer Uniform %12
%14 = OpVariable %13 Uniform
%15 = OpTypePointer Input %5
%16 = OpVariable %15 Input
%17 = OpTypePointer Output %8
%18 = OpVariable %17 Output
%19 = OpTypePointer Uniform %10
%21 = OpConstant %5 2
%23 = OpConstant %5 0
%25 = OpTypePointer Uniform %8
%43 = OpConstant %5 5
%55 = OpTypePointer Output %7
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %60
%60 = OpLabel
%20 = OpAccessChain %19 %14 %21
%22 = OpAccessChain %19 %14 %23
%24 = OpLoad %5 %16
%26 = OpAccessChain %25 %22 %23 %23
%27 = OpLoad %8 %26
%28 = OpCompositeExtract %7 %27 0
%29 = OpCompositeExtract %7 %27 1
%30 = OpCompositeExtract %7 %27 2
%31 = OpCompositeExtract %7 %27 3
%32 = OpAccessChain %25 %20 %23 %23
%33 = OpLoad %8 %32
%34 = OpCompositeExtract %7 %33 0
%35 = OpCompositeExtract %7 %33 1
%36 = OpCompositeExtract %7 %33 2
%37 = OpCompositeExtract %7 %33 3
%38 = OpFAdd %7 %34 %28
%39 = OpFAdd %7 %35 %29
%40 = OpFAdd %7 %36 %30
%41 = OpFAdd %7 %37 %31
%42 = OpIAdd %5 %24 %43
%44 = OpAccessChain %19 %14 %24
%45 = OpAccessChain %25 %44 %23 %23
%46 = OpLoad %8 %45
%47 = OpCompositeExtract %7 %46 0
%48 = OpCompositeExtract %7 %46 1
%49 = OpCompositeExtract %7 %46 2
%50 = OpCompositeExtract %7 %46 3
%51 = OpFAdd %7 %38 %47
%52 = OpFAdd %7 %39 %48
%53 = OpFAdd %7 %40 %49
%54 = OpFAdd %7 %41 %50
%56 = OpAccessChain %55 %18 %23
OpStore %56 %51
%57 = OpAccessChain %55 %18 %6
OpStore %57 %52
%58 = OpAccessChain %55 %18 %21
OpStore %58 %53
%59 = OpAccessChain %55 %18 %11
OpStore %59 %54
OpReturn
OpFunctionEnd
#endif
