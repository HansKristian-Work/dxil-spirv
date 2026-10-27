#version 460
#extension GL_EXT_demote_to_helper_invocation : require
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_KHR_shader_subgroup_arithmetic : require

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;
layout(set = 0, binding = 1, r32ui) uniform writeonly uimageBuffer _9;
layout(set = 0, binding = 2, r32ui) uniform writeonly uimageBuffer _10;

layout(location = 0) flat in uint INDEX;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    if (INDEX == 40u)
    {
        demote;
    }
    bool _25 = helperInvocationEXT();
    imageStore(_8, int(ByteAddressMask(INDEX * 2u, 4u)), uvec4(subgroupBallotExclusiveBitCount(subgroupBallot((INDEX < 100u) && (!_25)))));
    bool _44 = helperInvocationEXT();
    imageStore(_8, int(ByteAddressMask(INDEX * 2u, 4u)), uvec4(subgroupExclusiveAdd(_44 ? 0u : INDEX)));
    bool _51 = helperInvocationEXT();
    imageStore(_8, int(ByteAddressMask((INDEX * 2u) + 1u, 4u)), uvec4(subgroupExclusiveMul(_51 ? 1u : INDEX)));
    bool _60 = helperInvocationEXT();
    imageStore(_9, int(ByteAddressMask(INDEX * 2u, 4u)), uvec4(subgroupExclusiveAdd(_60 ? 0u : INDEX)));
    bool _66 = helperInvocationEXT();
    imageStore(_9, int(ByteAddressMask((INDEX * 2u) + 1u, 4u)), uvec4(subgroupExclusiveMul(_66 ? 1u : INDEX)));
    float _73 = float(INDEX);
    bool _75 = helperInvocationEXT();
    imageStore(_10, int(ByteAddressMask(INDEX * 2u, 4u)), uvec4(uint(subgroupExclusiveAdd(_75 ? 0.0 : _73))));
    bool _83 = helperInvocationEXT();
    imageStore(_10, int(ByteAddressMask((INDEX * 2u) + 1u, 4u)), uvec4(uint(subgroupExclusiveMul(_83 ? 1.0 : _73))));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 95
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformArithmetic
OpCapability GroupNonUniformBallot
OpCapability VulkanMemoryModel
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %9 %10 %12
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "INDEX"
OpName %35 "ByteAddressMask"
OpName %33 "index"
OpName %34 "stride"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 1
OpDecorate %9 NonReadable
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 2
OpDecorate %10 NonReadable
OpDecorate %12 Flat
OpDecorate %12 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpVariable %7 UniformConstant
%10 = OpVariable %7 UniformConstant
%11 = OpTypePointer Input %5
%12 = OpVariable %11 Input
%17 = OpTypeBool
%19 = OpConstant %5 40
%21 = OpConstant %5 100
%22 = OpTypeVector %5 4
%24 = OpConstant %5 3
%31 = OpConstant %5 2
%32 = OpTypeFunction %5 %5 %5
%38 = OpConstant %5 4294967295
%41 = OpConstant %5 4
%45 = OpConstant %5 0
%52 = OpConstant %5 1
%72 = OpTypeFloat 32
%76 = OpConstant %72 0
%84 = OpConstant %72 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %91
%91 = OpLabel
%13 = OpLoad %6 %10
%14 = OpLoad %6 %9
%15 = OpLoad %6 %8
%16 = OpLoad %5 %12
%18 = OpIEqual %17 %16 %19
OpSelectionMerge %93 None
OpBranchConditional %18 %92 %93
%92 = OpLabel
OpDemoteToHelperInvocation
OpBranch %93
%93 = OpLabel
OpBranch %94
%94 = OpLabel
%20 = OpULessThan %17 %16 %21
%25 = OpIsHelperInvocationEXT %17
%26 = OpLogicalNot %17 %25
%27 = OpLogicalAnd %17 %20 %26
%23 = OpGroupNonUniformBallot %22 %24 %27
%28 = OpGroupNonUniformBallotBitCount %5 %24 ExclusiveScan %23
%29 = OpShiftLeftLogical %5 %16 %24
%30 = OpIMul %5 %16 %31
%40 = OpFunctionCall %5 %35 %30 %41
%42 = OpCompositeConstruct %22 %28 %28 %28 %28
OpImageWrite %15 %40 %42 NonPrivateTexel
%44 = OpIsHelperInvocationEXT %17
%46 = OpSelect %5 %44 %45 %16
%43 = OpGroupNonUniformIAdd %5 %24 ExclusiveScan %46
%47 = OpIMul %5 %16 %31
%48 = OpFunctionCall %5 %35 %47 %41
%49 = OpCompositeConstruct %22 %43 %43 %43 %43
OpImageWrite %15 %48 %49 NonPrivateTexel
%51 = OpIsHelperInvocationEXT %17
%53 = OpSelect %5 %51 %52 %16
%50 = OpGroupNonUniformIMul %5 %24 ExclusiveScan %53
%54 = OpBitwiseOr %5 %29 %41
%55 = OpIMul %5 %16 %31
%56 = OpIAdd %5 %55 %52
%57 = OpFunctionCall %5 %35 %56 %41
%58 = OpCompositeConstruct %22 %50 %50 %50 %50
OpImageWrite %15 %57 %58 NonPrivateTexel
%60 = OpIsHelperInvocationEXT %17
%61 = OpSelect %5 %60 %45 %16
%59 = OpGroupNonUniformIAdd %5 %24 ExclusiveScan %61
%62 = OpIMul %5 %16 %31
%63 = OpFunctionCall %5 %35 %62 %41
%64 = OpCompositeConstruct %22 %59 %59 %59 %59
OpImageWrite %14 %63 %64 NonPrivateTexel
%66 = OpIsHelperInvocationEXT %17
%67 = OpSelect %5 %66 %52 %16
%65 = OpGroupNonUniformIMul %5 %24 ExclusiveScan %67
%68 = OpIMul %5 %16 %31
%69 = OpIAdd %5 %68 %52
%70 = OpFunctionCall %5 %35 %69 %41
%71 = OpCompositeConstruct %22 %65 %65 %65 %65
OpImageWrite %14 %70 %71 NonPrivateTexel
%73 = OpConvertUToF %72 %16
%75 = OpIsHelperInvocationEXT %17
%77 = OpSelect %72 %75 %76 %73
%74 = OpGroupNonUniformFAdd %72 %24 ExclusiveScan %77
%78 = OpConvertFToU %5 %74
%79 = OpIMul %5 %16 %31
%80 = OpFunctionCall %5 %35 %79 %41
%81 = OpCompositeConstruct %22 %78 %78 %78 %78
OpImageWrite %13 %80 %81 NonPrivateTexel
%83 = OpIsHelperInvocationEXT %17
%85 = OpSelect %72 %83 %84 %73
%82 = OpGroupNonUniformFMul %72 %24 ExclusiveScan %85
%86 = OpConvertFToU %5 %82
%87 = OpIMul %5 %16 %31
%88 = OpIAdd %5 %87 %52
%89 = OpFunctionCall %5 %35 %88 %41
%90 = OpCompositeConstruct %22 %86 %86 %86 %86
OpImageWrite %13 %89 %90 NonPrivateTexel
OpReturn
OpFunctionEnd
%35 = OpFunction %5 None %32
%33 = OpFunctionParameter %5
%34 = OpFunctionParameter %5
%36 = OpLabel
%37 = OpUDiv %5 %38 %34
%39 = OpBitwiseAnd %5 %33 %37
OpReturnValue %39
OpFunctionEnd
#endif
