#version 460
#extension GL_KHR_shader_subgroup_vote : require

vec2 _25;

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;

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
    vec2 _24;
    _24.x = float(INDEX);
    _24.y = float(INDEX + 1u);
    if (notEqual(uvec2(bvec2(subgroupAllEqual(_24.x), subgroupAllEqual(_24.y))), uvec2(0u)).x)
    {
        imageStore(_8, int(ByteAddressMask(INDEX, 4u)), uvec4(1u));
    }
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 72
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformVote
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10 %16
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "INDEX"
OpName %16 "discard_state"
OpName %48 "ByteAddressMask"
OpName %46 "index"
OpName %47 "stride"
OpName %64 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %10 Flat
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypePointer Input %5
%10 = OpVariable %9 Input
%12 = OpTypeBool
%14 = OpConstant %5 40
%15 = OpTypePointer Private %12
%16 = OpVariable %15 Private
%17 = OpConstantFalse %12
%18 = OpTypeFloat 32
%21 = OpConstant %5 1
%23 = OpTypeVector %18 2
%27 = OpTypeVector %12 2
%31 = OpConstant %5 3
%34 = OpConstant %5 0
%35 = OpTypeVector %5 2
%36 = OpConstantComposite %35 %34 %34
%37 = OpConstantComposite %35 %21 %21
%40 = OpConstantNull %35
%43 = OpConstant %5 2
%45 = OpTypeFunction %5 %5 %5
%51 = OpConstant %5 4294967295
%55 = OpConstant %5 4
%56 = OpTypeVector %5 4
%63 = OpConstantTrue %12
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %16 %17
%25 = OpUndef %23
OpBranch %58
%58 = OpLabel
%11 = OpLoad %5 %10
%13 = OpIEqual %12 %11 %14
OpSelectionMerge %60 None
OpBranchConditional %13 %59 %60
%59 = OpLabel
OpStore %16 %63
OpBranch %60
%60 = OpLabel
%19 = OpConvertUToF %18 %11
%20 = OpIAdd %5 %11 %21
%22 = OpConvertUToF %18 %20
%24 = OpCompositeInsert %23 %19 %25 0
%26 = OpCompositeInsert %23 %22 %24 1
%29 = OpCompositeExtract %18 %26 0
%30 = OpGroupNonUniformAllEqual %12 %31 %29
%32 = OpCompositeExtract %18 %26 1
%33 = OpGroupNonUniformAllEqual %12 %31 %32
%28 = OpCompositeConstruct %27 %30 %33
%38 = OpSelect %35 %28 %37 %36
%39 = OpINotEqual %27 %38 %40
%41 = OpCompositeExtract %12 %39 0
OpSelectionMerge %62 None
OpBranchConditional %41 %61 %62
%61 = OpLabel
%42 = OpShiftLeftLogical %5 %11 %43
%44 = OpLoad %6 %8
%54 = OpFunctionCall %5 %48 %11 %55
%57 = OpCompositeConstruct %56 %21 %21 %21 %21
OpImageWrite %44 %54 %57
OpBranch %62
%62 = OpLabel
%70 = OpFunctionCall %1 %64
OpReturn
OpFunctionEnd
%48 = OpFunction %5 None %45
%46 = OpFunctionParameter %5
%47 = OpFunctionParameter %5
%49 = OpLabel
%50 = OpUDiv %5 %51 %47
%52 = OpBitwiseAnd %5 %46 %50
OpReturnValue %52
OpFunctionEnd
%64 = OpFunction %1 None %2
%65 = OpLabel
%68 = OpLoad %12 %16
OpSelectionMerge %67 None
OpBranchConditional %68 %66 %67
%66 = OpLabel
OpKill
%67 = OpLabel
OpReturn
OpFunctionEnd
#endif
