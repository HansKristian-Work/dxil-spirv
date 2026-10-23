#version 460
#extension GL_EXT_maximal_reconvergence : require
#extension GL_EXT_demote_to_helper_invocation : require
#extension GL_KHR_shader_subgroup_arithmetic : require

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;
layout(set = 0, binding = 1, r32ui) uniform writeonly uimageBuffer _9;
layout(set = 0, binding = 2, r32ui) uniform writeonly uimageBuffer _10;

layout(location = 0) flat in uint INDEX;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

[[maximally_reconverges]]
void main()
{
    if (INDEX == 40u)
    {
        demote;
    }
    uint _19 = INDEX * 28u;
    imageStore(_8, int(ByteAddressMask(INDEX * 7u, 4u)), uvec4(subgroupAdd(INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 1u, 4u)), uvec4(subgroupMul(INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 2u, 4u)), uvec4(subgroupAnd(INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 3u, 4u)), uvec4(subgroupOr(INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 4u, 4u)), uvec4(subgroupXor(INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 5u, 4u)), uvec4(subgroupMin(INDEX)));
    imageStore(_8, int(ByteAddressMask((INDEX * 7u) + 6u, 4u)), uvec4(subgroupMax(INDEX)));
    imageStore(_9, int(ByteAddressMask(INDEX * 7u, 4u)), uvec4(subgroupAdd(INDEX)));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 1u, 4u)), uvec4(subgroupMul(INDEX)));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 2u, 4u)), uvec4(subgroupAnd(INDEX)));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 3u, 4u)), uvec4(subgroupOr(INDEX)));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 4u, 4u)), uvec4(subgroupXor(INDEX)));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 5u, 4u)), uvec4(uint(subgroupMin(int(INDEX)))));
    imageStore(_9, int(ByteAddressMask((INDEX * 7u) + 6u, 4u)), uvec4(uint(subgroupMax(int(INDEX)))));
    float _129 = float(INDEX);
    imageStore(_10, int(ByteAddressMask(INDEX * 7u, 4u)), uvec4(uint(subgroupAdd(_129))));
    imageStore(_10, int(ByteAddressMask((INDEX * 7u) + 1u, 4u)), uvec4(uint(subgroupMul(_129))));
    imageStore(_10, int(ByteAddressMask((INDEX * 7u) + 5u, 4u)), uvec4(uint(subgroupMin(_129))));
    imageStore(_10, int(ByteAddressMask((INDEX * 7u) + 6u, 4u)), uvec4(uint(subgroupMax(_129))));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 161
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformArithmetic
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpExtension "SPV_KHR_maximal_reconvergence"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %9 %10 %12
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 MaximallyReconvergesKHR
OpName %3 "main"
OpName %12 "INDEX"
OpName %27 "ByteAddressMask"
OpName %25 "index"
OpName %26 "stride"
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
%14 = OpTypeBool
%16 = OpConstant %5 40
%18 = OpConstant %5 3
%20 = OpConstant %5 28
%23 = OpConstant %5 7
%24 = OpTypeFunction %5 %5 %5
%30 = OpConstant %5 4294967295
%33 = OpConstant %5 4
%34 = OpTypeVector %5 4
%41 = OpConstant %5 1
%46 = OpConstant %5 8
%50 = OpConstant %5 2
%55 = OpConstant %5 12
%63 = OpConstant %5 16
%71 = OpConstant %5 20
%75 = OpConstant %5 5
%80 = OpConstant %5 24
%84 = OpConstant %5 6
%128 = OpTypeFloat 32
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %157
%157 = OpLabel
%13 = OpLoad %5 %12
%15 = OpIEqual %14 %13 %16
OpSelectionMerge %159 None
OpBranchConditional %15 %158 %159
%158 = OpLabel
OpDemoteToHelperInvocation
OpBranch %159
%159 = OpLabel
OpBranch %160
%160 = OpLabel
%17 = OpGroupNonUniformIAdd %5 %18 Reduce %13
%19 = OpIMul %5 %13 %20
%21 = OpLoad %6 %8
%22 = OpIMul %5 %13 %23
%32 = OpFunctionCall %5 %27 %22 %33
%35 = OpCompositeConstruct %34 %17 %17 %17 %17
OpImageWrite %21 %32 %35
%36 = OpGroupNonUniformIMul %5 %18 Reduce %13
%37 = OpIAdd %5 %19 %33
%38 = OpLoad %6 %8
%39 = OpIMul %5 %13 %23
%40 = OpIAdd %5 %39 %41
%42 = OpFunctionCall %5 %27 %40 %33
%43 = OpCompositeConstruct %34 %36 %36 %36 %36
OpImageWrite %38 %42 %43
%44 = OpGroupNonUniformBitwiseAnd %5 %18 Reduce %13
%45 = OpIAdd %5 %19 %46
%47 = OpLoad %6 %8
%48 = OpIMul %5 %13 %23
%49 = OpIAdd %5 %48 %50
%51 = OpFunctionCall %5 %27 %49 %33
%52 = OpCompositeConstruct %34 %44 %44 %44 %44
OpImageWrite %47 %51 %52
%53 = OpGroupNonUniformBitwiseOr %5 %18 Reduce %13
%54 = OpIAdd %5 %19 %55
%56 = OpLoad %6 %8
%57 = OpIMul %5 %13 %23
%58 = OpIAdd %5 %57 %18
%59 = OpFunctionCall %5 %27 %58 %33
%60 = OpCompositeConstruct %34 %53 %53 %53 %53
OpImageWrite %56 %59 %60
%61 = OpGroupNonUniformBitwiseXor %5 %18 Reduce %13
%62 = OpIAdd %5 %19 %63
%64 = OpLoad %6 %8
%65 = OpIMul %5 %13 %23
%66 = OpIAdd %5 %65 %33
%67 = OpFunctionCall %5 %27 %66 %33
%68 = OpCompositeConstruct %34 %61 %61 %61 %61
OpImageWrite %64 %67 %68
%69 = OpGroupNonUniformUMin %5 %18 Reduce %13
%70 = OpIAdd %5 %19 %71
%72 = OpLoad %6 %8
%73 = OpIMul %5 %13 %23
%74 = OpIAdd %5 %73 %75
%76 = OpFunctionCall %5 %27 %74 %33
%77 = OpCompositeConstruct %34 %69 %69 %69 %69
OpImageWrite %72 %76 %77
%78 = OpGroupNonUniformUMax %5 %18 Reduce %13
%79 = OpIAdd %5 %19 %80
%81 = OpLoad %6 %8
%82 = OpIMul %5 %13 %23
%83 = OpIAdd %5 %82 %84
%85 = OpFunctionCall %5 %27 %83 %33
%86 = OpCompositeConstruct %34 %78 %78 %78 %78
OpImageWrite %81 %85 %86
%87 = OpGroupNonUniformIAdd %5 %18 Reduce %13
%88 = OpLoad %6 %9
%89 = OpIMul %5 %13 %23
%90 = OpFunctionCall %5 %27 %89 %33
%91 = OpCompositeConstruct %34 %87 %87 %87 %87
OpImageWrite %88 %90 %91
%92 = OpGroupNonUniformIMul %5 %18 Reduce %13
%93 = OpLoad %6 %9
%94 = OpIMul %5 %13 %23
%95 = OpIAdd %5 %94 %41
%96 = OpFunctionCall %5 %27 %95 %33
%97 = OpCompositeConstruct %34 %92 %92 %92 %92
OpImageWrite %93 %96 %97
%98 = OpGroupNonUniformBitwiseAnd %5 %18 Reduce %13
%99 = OpLoad %6 %9
%100 = OpIMul %5 %13 %23
%101 = OpIAdd %5 %100 %50
%102 = OpFunctionCall %5 %27 %101 %33
%103 = OpCompositeConstruct %34 %98 %98 %98 %98
OpImageWrite %99 %102 %103
%104 = OpGroupNonUniformBitwiseOr %5 %18 Reduce %13
%105 = OpLoad %6 %9
%106 = OpIMul %5 %13 %23
%107 = OpIAdd %5 %106 %18
%108 = OpFunctionCall %5 %27 %107 %33
%109 = OpCompositeConstruct %34 %104 %104 %104 %104
OpImageWrite %105 %108 %109
%110 = OpGroupNonUniformBitwiseXor %5 %18 Reduce %13
%111 = OpLoad %6 %9
%112 = OpIMul %5 %13 %23
%113 = OpIAdd %5 %112 %33
%114 = OpFunctionCall %5 %27 %113 %33
%115 = OpCompositeConstruct %34 %110 %110 %110 %110
OpImageWrite %111 %114 %115
%116 = OpGroupNonUniformSMin %5 %18 Reduce %13
%117 = OpLoad %6 %9
%118 = OpIMul %5 %13 %23
%119 = OpIAdd %5 %118 %75
%120 = OpFunctionCall %5 %27 %119 %33
%121 = OpCompositeConstruct %34 %116 %116 %116 %116
OpImageWrite %117 %120 %121
%122 = OpGroupNonUniformSMax %5 %18 Reduce %13
%123 = OpLoad %6 %9
%124 = OpIMul %5 %13 %23
%125 = OpIAdd %5 %124 %84
%126 = OpFunctionCall %5 %27 %125 %33
%127 = OpCompositeConstruct %34 %122 %122 %122 %122
OpImageWrite %123 %126 %127
%129 = OpConvertUToF %128 %13
%130 = OpGroupNonUniformFAdd %128 %18 Reduce %129
%131 = OpConvertFToU %5 %130
%132 = OpLoad %6 %10
%133 = OpIMul %5 %13 %23
%134 = OpFunctionCall %5 %27 %133 %33
%135 = OpCompositeConstruct %34 %131 %131 %131 %131
OpImageWrite %132 %134 %135
%136 = OpGroupNonUniformFMul %128 %18 Reduce %129
%137 = OpConvertFToU %5 %136
%138 = OpLoad %6 %10
%139 = OpIMul %5 %13 %23
%140 = OpIAdd %5 %139 %41
%141 = OpFunctionCall %5 %27 %140 %33
%142 = OpCompositeConstruct %34 %137 %137 %137 %137
OpImageWrite %138 %141 %142
%143 = OpGroupNonUniformFMin %128 %18 Reduce %129
%144 = OpConvertFToU %5 %143
%145 = OpLoad %6 %10
%146 = OpIMul %5 %13 %23
%147 = OpIAdd %5 %146 %75
%148 = OpFunctionCall %5 %27 %147 %33
%149 = OpCompositeConstruct %34 %144 %144 %144 %144
OpImageWrite %145 %148 %149
%150 = OpGroupNonUniformFMax %128 %18 Reduce %129
%151 = OpConvertFToU %5 %150
%152 = OpLoad %6 %10
%153 = OpIMul %5 %13 %23
%154 = OpIAdd %5 %153 %84
%155 = OpFunctionCall %5 %27 %154 %33
%156 = OpCompositeConstruct %34 %151 %151 %151 %151
OpImageWrite %152 %155 %156
OpReturn
OpFunctionEnd
%27 = OpFunction %5 None %24
%25 = OpFunctionParameter %5
%26 = OpFunctionParameter %5
%28 = OpLabel
%29 = OpUDiv %5 %30 %26
%31 = OpBitwiseAnd %5 %25 %29
OpReturnValue %31
OpFunctionEnd
#endif
