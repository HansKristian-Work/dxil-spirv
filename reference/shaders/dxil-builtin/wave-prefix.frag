#version 460
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_KHR_shader_subgroup_arithmetic : require

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;
layout(set = 0, binding = 1, r32ui) uniform writeonly uimageBuffer _9;
layout(set = 0, binding = 2, r32ui) uniform writeonly uimageBuffer _10;

layout(location = 0) flat in uint INDEX;
bool discard_state;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void discard_exit()
{
    if (discard_state)
    {
        discard;
    }
}

void main()
{
    discard_state = false;
    if (INDEX == 40u)
    {
        discard_state = true;
    }
    imageStore(_8, int(ByteAddressMask(INDEX * 2u, 4u)), uvec4(subgroupBallotExclusiveBitCount(subgroupBallot((INDEX < 100u) && (!(gl_HelperInvocation || discard_state))))));
    imageStore(_8, int(ByteAddressMask(INDEX * 2u, 4u)), uvec4(subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 2u) + 1u, 4u)), uvec4(subgroupExclusiveMul((gl_HelperInvocation || discard_state) ? 1u : INDEX)));
    imageStore(_9, int(ByteAddressMask(INDEX * 2u, 4u)), uvec4(subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_9, int(ByteAddressMask((INDEX * 2u) + 1u, 4u)), uvec4(subgroupExclusiveMul((gl_HelperInvocation || discard_state) ? 1u : INDEX)));
    float _77 = float(INDEX);
    imageStore(_10, int(ByteAddressMask(INDEX * 2u, 4u)), uvec4(uint(subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? 0.0 : _77))));
    imageStore(_10, int(ByteAddressMask((INDEX * 2u) + 1u, 4u)), uvec4(uint(subgroupExclusiveMul((gl_HelperInvocation || discard_state) ? 1.0 : _77))));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 125
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformArithmetic
OpCapability GroupNonUniformBallot
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %9 %10 %12 %21 %102
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "INDEX"
OpName %21 "discard_state"
OpName %38 "ByteAddressMask"
OpName %36 "index"
OpName %37 "stride"
OpName %117 "discard_exit"
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
OpDecorate %102 BuiltIn HelperInvocation
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
%20 = OpTypePointer Private %17
%21 = OpVariable %20 Private
%22 = OpConstantFalse %17
%24 = OpConstant %5 100
%25 = OpTypeVector %5 4
%27 = OpConstant %5 3
%34 = OpConstant %5 2
%35 = OpTypeFunction %5 %5 %5
%41 = OpConstant %5 4294967295
%45 = OpConstant %5 4
%49 = OpConstant %5 0
%56 = OpConstant %5 1
%76 = OpTypeFloat 32
%80 = OpConstant %76 0
%88 = OpConstant %76 1
%100 = OpConstantTrue %17
%101 = OpTypePointer Input %17
%102 = OpVariable %101 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %21 %22
OpBranch %95
%95 = OpLabel
%13 = OpLoad %6 %10
%14 = OpLoad %6 %9
%15 = OpLoad %6 %8
%16 = OpLoad %5 %12
%18 = OpIEqual %17 %16 %19
OpSelectionMerge %97 None
OpBranchConditional %18 %96 %97
%96 = OpLabel
OpStore %21 %100
OpBranch %97
%97 = OpLabel
OpBranch %98
%98 = OpLabel
OpBranch %99
%99 = OpLabel
%23 = OpULessThan %17 %16 %24
%103 = OpLoad %17 %102
%104 = OpLoad %17 %21
%28 = OpLogicalOr %17 %103 %104
%29 = OpLogicalNot %17 %28
%30 = OpLogicalAnd %17 %23 %29
%26 = OpGroupNonUniformBallot %25 %27 %30
%31 = OpGroupNonUniformBallotBitCount %5 %27 ExclusiveScan %26
%32 = OpShiftLeftLogical %5 %16 %27
%33 = OpIMul %5 %16 %34
%44 = OpFunctionCall %5 %38 %33 %45
%46 = OpCompositeConstruct %25 %31 %31 %31 %31
OpImageWrite %15 %44 %46
%105 = OpLoad %17 %102
%106 = OpLoad %17 %21
%48 = OpLogicalOr %17 %105 %106
%50 = OpSelect %5 %48 %49 %16
%47 = OpGroupNonUniformIAdd %5 %27 ExclusiveScan %50
%51 = OpIMul %5 %16 %34
%52 = OpFunctionCall %5 %38 %51 %45
%53 = OpCompositeConstruct %25 %47 %47 %47 %47
OpImageWrite %15 %52 %53
%107 = OpLoad %17 %102
%108 = OpLoad %17 %21
%55 = OpLogicalOr %17 %107 %108
%57 = OpSelect %5 %55 %56 %16
%54 = OpGroupNonUniformIMul %5 %27 ExclusiveScan %57
%58 = OpBitwiseOr %5 %32 %45
%59 = OpIMul %5 %16 %34
%60 = OpIAdd %5 %59 %56
%61 = OpFunctionCall %5 %38 %60 %45
%62 = OpCompositeConstruct %25 %54 %54 %54 %54
OpImageWrite %15 %61 %62
%109 = OpLoad %17 %102
%110 = OpLoad %17 %21
%64 = OpLogicalOr %17 %109 %110
%65 = OpSelect %5 %64 %49 %16
%63 = OpGroupNonUniformIAdd %5 %27 ExclusiveScan %65
%66 = OpIMul %5 %16 %34
%67 = OpFunctionCall %5 %38 %66 %45
%68 = OpCompositeConstruct %25 %63 %63 %63 %63
OpImageWrite %14 %67 %68
%111 = OpLoad %17 %102
%112 = OpLoad %17 %21
%70 = OpLogicalOr %17 %111 %112
%71 = OpSelect %5 %70 %56 %16
%69 = OpGroupNonUniformIMul %5 %27 ExclusiveScan %71
%72 = OpIMul %5 %16 %34
%73 = OpIAdd %5 %72 %56
%74 = OpFunctionCall %5 %38 %73 %45
%75 = OpCompositeConstruct %25 %69 %69 %69 %69
OpImageWrite %14 %74 %75
%77 = OpConvertUToF %76 %16
%113 = OpLoad %17 %102
%114 = OpLoad %17 %21
%79 = OpLogicalOr %17 %113 %114
%81 = OpSelect %76 %79 %80 %77
%78 = OpGroupNonUniformFAdd %76 %27 ExclusiveScan %81
%82 = OpConvertFToU %5 %78
%83 = OpIMul %5 %16 %34
%84 = OpFunctionCall %5 %38 %83 %45
%85 = OpCompositeConstruct %25 %82 %82 %82 %82
OpImageWrite %13 %84 %85
%115 = OpLoad %17 %102
%116 = OpLoad %17 %21
%87 = OpLogicalOr %17 %115 %116
%89 = OpSelect %76 %87 %88 %77
%86 = OpGroupNonUniformFMul %76 %27 ExclusiveScan %89
%90 = OpConvertFToU %5 %86
%91 = OpIMul %5 %16 %34
%92 = OpIAdd %5 %91 %56
%93 = OpFunctionCall %5 %38 %92 %45
%94 = OpCompositeConstruct %25 %90 %90 %90 %90
OpImageWrite %13 %93 %94
%123 = OpFunctionCall %1 %117
OpReturn
OpFunctionEnd
%38 = OpFunction %5 None %35
%36 = OpFunctionParameter %5
%37 = OpFunctionParameter %5
%39 = OpLabel
%40 = OpUDiv %5 %41 %37
%42 = OpBitwiseAnd %5 %36 %40
OpReturnValue %42
OpFunctionEnd
%117 = OpFunction %1 None %2
%118 = OpLabel
%121 = OpLoad %17 %21
OpSelectionMerge %120 None
OpBranchConditional %121 %119 %120
%119 = OpLabel
OpKill
%120 = OpLabel
OpReturn
OpFunctionEnd
#endif
