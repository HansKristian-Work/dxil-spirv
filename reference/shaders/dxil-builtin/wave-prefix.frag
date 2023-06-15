#version 460
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_KHR_shader_subgroup_arithmetic : require

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;
layout(set = 0, binding = 1, r32ui) uniform writeonly uimageBuffer _9;
layout(set = 0, binding = 2, r32ui) uniform writeonly uimageBuffer _10;

layout(location = 0) flat in uint INDEX;
bool discard_state;

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
    imageStore(_8, int(INDEX * 2u), uvec4(subgroupBallotExclusiveBitCount(subgroupBallot((INDEX < 100u) && (!(gl_HelperInvocation || discard_state))))));
    imageStore(_8, int(INDEX * 2u), uvec4(subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_8, int((INDEX * 2u) + 1u), uvec4(subgroupExclusiveMul((gl_HelperInvocation || discard_state) ? 1u : INDEX)));
    imageStore(_9, int(INDEX * 2u), uvec4(subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? 0u : INDEX)));
    imageStore(_9, int((INDEX * 2u) + 1u), uvec4(subgroupExclusiveMul((gl_HelperInvocation || discard_state) ? 1u : INDEX)));
    float _63 = float(INDEX);
    imageStore(_10, int(INDEX * 2u), uvec4(uint(subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? 0.0 : _63))));
    imageStore(_10, int((INDEX * 2u) + 1u), uvec4(uint(subgroupExclusiveMul((gl_HelperInvocation || discard_state) ? 1.0 : _63))));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 107
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformArithmetic
OpCapability GroupNonUniformBallot
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %12 %84
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "INDEX"
OpName %21 "discard_state"
OpName %99 "discard_exit"
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
OpDecorate %84 BuiltIn HelperInvocation
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
%38 = OpConstant %5 0
%44 = OpConstant %5 1
%47 = OpConstant %5 4
%62 = OpTypeFloat 32
%66 = OpConstant %62 0
%73 = OpConstant %62 1
%82 = OpConstantTrue %17
%83 = OpTypePointer Input %17
%84 = OpVariable %83 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %21 %22
OpBranch %79
%79 = OpLabel
%13 = OpLoad %6 %10
%14 = OpLoad %6 %9
%15 = OpLoad %6 %8
%16 = OpLoad %5 %12
%18 = OpIEqual %17 %16 %19
OpSelectionMerge %81 None
OpBranchConditional %18 %80 %81
%80 = OpLabel
OpStore %21 %82
OpBranch %81
%81 = OpLabel
%23 = OpULessThan %17 %16 %24
%85 = OpLoad %17 %84
%86 = OpLoad %17 %21
%28 = OpLogicalOr %17 %85 %86
%29 = OpLogicalNot %17 %28
%30 = OpLogicalAnd %17 %23 %29
%26 = OpGroupNonUniformBallot %25 %27 %30
%31 = OpGroupNonUniformBallotBitCount %5 %27 ExclusiveScan %26
%32 = OpShiftLeftLogical %5 %16 %27
%33 = OpIMul %5 %16 %34
%35 = OpCompositeConstruct %25 %31 %31 %31 %31
OpImageWrite %15 %33 %35
%87 = OpLoad %17 %84
%88 = OpLoad %17 %21
%37 = OpLogicalOr %17 %87 %88
%39 = OpSelect %5 %37 %38 %16
%36 = OpGroupNonUniformIAdd %5 %27 ExclusiveScan %39
%40 = OpIMul %5 %16 %34
%41 = OpCompositeConstruct %25 %36 %36 %36 %36
OpImageWrite %15 %40 %41
%89 = OpLoad %17 %84
%90 = OpLoad %17 %21
%43 = OpLogicalOr %17 %89 %90
%45 = OpSelect %5 %43 %44 %16
%42 = OpGroupNonUniformIMul %5 %27 ExclusiveScan %45
%46 = OpBitwiseOr %5 %32 %47
%48 = OpIMul %5 %16 %34
%49 = OpIAdd %5 %48 %44
%50 = OpCompositeConstruct %25 %42 %42 %42 %42
OpImageWrite %15 %49 %50
%91 = OpLoad %17 %84
%92 = OpLoad %17 %21
%52 = OpLogicalOr %17 %91 %92
%53 = OpSelect %5 %52 %38 %16
%51 = OpGroupNonUniformIAdd %5 %27 ExclusiveScan %53
%54 = OpIMul %5 %16 %34
%55 = OpCompositeConstruct %25 %51 %51 %51 %51
OpImageWrite %14 %54 %55
%93 = OpLoad %17 %84
%94 = OpLoad %17 %21
%57 = OpLogicalOr %17 %93 %94
%58 = OpSelect %5 %57 %44 %16
%56 = OpGroupNonUniformIMul %5 %27 ExclusiveScan %58
%59 = OpIMul %5 %16 %34
%60 = OpIAdd %5 %59 %44
%61 = OpCompositeConstruct %25 %56 %56 %56 %56
OpImageWrite %14 %60 %61
%63 = OpConvertUToF %62 %16
%95 = OpLoad %17 %84
%96 = OpLoad %17 %21
%65 = OpLogicalOr %17 %95 %96
%67 = OpSelect %62 %65 %66 %63
%64 = OpGroupNonUniformFAdd %62 %27 ExclusiveScan %67
%68 = OpConvertFToU %5 %64
%69 = OpIMul %5 %16 %34
%70 = OpCompositeConstruct %25 %68 %68 %68 %68
OpImageWrite %13 %69 %70
%97 = OpLoad %17 %84
%98 = OpLoad %17 %21
%72 = OpLogicalOr %17 %97 %98
%74 = OpSelect %62 %72 %73 %63
%71 = OpGroupNonUniformFMul %62 %27 ExclusiveScan %74
%75 = OpConvertFToU %5 %71
%76 = OpIMul %5 %16 %34
%77 = OpIAdd %5 %76 %44
%78 = OpCompositeConstruct %25 %75 %75 %75 %75
OpImageWrite %13 %77 %78
%105 = OpFunctionCall %1 %99
OpReturn
OpFunctionEnd
%99 = OpFunction %1 None %2
%100 = OpLabel
%103 = OpLoad %17 %21
OpSelectionMerge %102 None
OpBranchConditional %103 %101 %102
%101 = OpLabel
OpKill
%102 = OpLabel
OpReturn
OpFunctionEnd
#endif
