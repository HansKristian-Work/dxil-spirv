#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, r32ui) uniform readonly uimageBuffer _9[];

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    uint _19 = INDEX + 0u;
    uint _33 = ByteAddressMask(INDEX * 4u, 4u);
    uvec4 _49 = uvec4(imageLoad(_9[_19], int(_33)).x, imageLoad(_9[_19], int(_33 + 1u)).x, imageLoad(_9[_19], int(_33 + 2u)).x, imageLoad(_9[_19], int(_33 + 3u)).x);
    SV_Target.x = uintBitsToFloat(_49.x);
    SV_Target.y = uintBitsToFloat(_49.y);
    SV_Target.z = uintBitsToFloat(_49.z);
    SV_Target.w = uintBitsToFloat(_49.w);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 64
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability RuntimeDescriptorArray
OpCapability StorageTexelBufferArrayDynamicIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %11 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "INDEX"
OpName %15 "SV_Target"
OpName %28 "ByteAddressMask"
OpName %26 "index"
OpName %27 "stride"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonWritable
OpDecorate %11 Flat
OpDecorate %11 Location 0
OpDecorate %15 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
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
%25 = OpTypeFunction %5 %5 %5
%31 = OpConstant %5 4294967295
%34 = OpTypeVector %5 4
%39 = OpConstant %5 1
%43 = OpConstant %5 2
%47 = OpConstant %5 3
%58 = OpTypePointer Output %12
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %63
%63 = OpLabel
%16 = OpLoad %5 %11
%17 = OpShiftLeftLogical %5 %16 %18
%19 = OpIAdd %5 %16 %20
%22 = OpAccessChain %21 %9 %19
%23 = OpLoad %6 %22
%24 = OpIMul %5 %16 %18
%33 = OpFunctionCall %5 %28 %24 %18
%35 = OpImageRead %34 %23 %33 NonPrivateTexel
%36 = OpCompositeExtract %5 %35 0
%38 = OpIAdd %5 %33 %39
%37 = OpImageRead %34 %23 %38 NonPrivateTexel
%40 = OpCompositeExtract %5 %37 0
%42 = OpIAdd %5 %33 %43
%41 = OpImageRead %34 %23 %42 NonPrivateTexel
%44 = OpCompositeExtract %5 %41 0
%46 = OpIAdd %5 %33 %47
%45 = OpImageRead %34 %23 %46 NonPrivateTexel
%48 = OpCompositeExtract %5 %45 0
%49 = OpCompositeConstruct %34 %36 %40 %44 %48
%50 = OpCompositeExtract %5 %49 0
%51 = OpCompositeExtract %5 %49 1
%52 = OpCompositeExtract %5 %49 2
%53 = OpCompositeExtract %5 %49 3
%54 = OpBitcast %12 %50
%55 = OpBitcast %12 %51
%56 = OpBitcast %12 %52
%57 = OpBitcast %12 %53
%59 = OpAccessChain %58 %15 %20
OpStore %59 %54
%60 = OpAccessChain %58 %15 %39
OpStore %60 %55
%61 = OpAccessChain %58 %15 %43
OpStore %61 %56
%62 = OpAccessChain %58 %15 %47
OpStore %62 %57
OpReturn
OpFunctionEnd
%28 = OpFunction %5 None %25
%26 = OpFunctionParameter %5
%27 = OpFunctionParameter %5
%29 = OpLabel
%30 = OpUDiv %5 %31 %27
%32 = OpBitwiseAnd %5 %26 %30
OpReturnValue %32
OpFunctionEnd
#endif
