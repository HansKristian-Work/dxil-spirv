#version 460
#extension GL_KHR_shader_subgroup_ballot : require

layout(set = 0, binding = 0, r32ui) uniform writeonly uimageBuffer _8;

layout(location = 0) flat in uvec3 INDEX;
bool discard_state;

uint _38;

uint WaveReadFirstLane(uint _31, bool _32)
{
    uint _41;
    if (_32)
    {
        _41 = _38;
    }
    else
    {
        _41 = subgroupBroadcastFirst(_31);
    }
    return _41;
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
    if (INDEX.x == 40u)
    {
        discard_state = true;
    }
    uint _50 = INDEX.x * 3u;
    imageStore(_8, int(_50), uvec4(WaveReadFirstLane(INDEX.x, gl_HelperInvocation || discard_state)));
    imageStore(_8, int(_50 + 1u), uvec4(WaveReadFirstLane(INDEX.y, gl_HelperInvocation || discard_state)));
    imageStore(_8, int(_50 + 2u), uvec4(WaveReadFirstLane(INDEX.z, gl_HelperInvocation || discard_state)));
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 77
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability GroupNonUniformBallot
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %11 %62
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "INDEX"
OpName %27 "discard_state"
OpName %33 "WaveReadFirstLane"
OpName %69 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %11 Flat
OpDecorate %11 Location 0
OpDecorate %62 BuiltIn HelperInvocation
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeVector %5 3
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%13 = OpTypePointer Input %5
%15 = OpConstant %5 0
%18 = OpConstant %5 1
%21 = OpConstant %5 2
%23 = OpTypeBool
%25 = OpConstant %5 40
%26 = OpTypePointer Private %23
%27 = OpVariable %26 Private
%28 = OpConstantFalse %23
%30 = OpTypeFunction %5 %5 %23
%40 = OpConstant %5 3
%49 = OpConstant %5 12
%51 = OpTypeVector %5 4
%60 = OpConstantTrue %23
%61 = OpTypePointer Input %23
%62 = OpVariable %61 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %27 %28
OpBranch %57
%57 = OpLabel
%12 = OpLoad %6 %8
%14 = OpAccessChain %13 %11 %15
%16 = OpLoad %5 %14
%17 = OpAccessChain %13 %11 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %13 %11 %21
%22 = OpLoad %5 %20
%24 = OpIEqual %23 %16 %25
OpSelectionMerge %59 None
OpBranchConditional %24 %58 %59
%58 = OpLabel
OpStore %27 %60
OpBranch %59
%59 = OpLabel
%63 = OpLoad %23 %62
%64 = OpLoad %23 %27
%29 = OpLogicalOr %23 %63 %64
%43 = OpFunctionCall %5 %33 %16 %29
%65 = OpLoad %23 %62
%66 = OpLoad %23 %27
%44 = OpLogicalOr %23 %65 %66
%45 = OpFunctionCall %5 %33 %19 %44
%67 = OpLoad %23 %62
%68 = OpLoad %23 %27
%46 = OpLogicalOr %23 %67 %68
%47 = OpFunctionCall %5 %33 %22 %46
%48 = OpIMul %5 %16 %49
%50 = OpIMul %5 %16 %40
%52 = OpCompositeConstruct %51 %43 %43 %43 %43
OpImageWrite %12 %50 %52
%53 = OpCompositeConstruct %51 %45 %45 %45 %45
%54 = OpIAdd %5 %50 %18
OpImageWrite %12 %54 %53
%55 = OpCompositeConstruct %51 %47 %47 %47 %47
%56 = OpIAdd %5 %50 %21
OpImageWrite %12 %56 %55
%75 = OpFunctionCall %1 %69
OpReturn
OpFunctionEnd
%33 = OpFunction %5 None %30
%31 = OpFunctionParameter %5
%32 = OpFunctionParameter %23
%34 = OpLabel
OpSelectionMerge %37 None
OpBranchConditional %32 %35 %36
%35 = OpLabel
%38 = OpUndef %5
OpBranch %37
%36 = OpLabel
%39 = OpGroupNonUniformBroadcastFirst %5 %40 %31
OpBranch %37
%37 = OpLabel
%41 = OpPhi %5 %39 %36 %38 %35
OpReturnValue %41
OpFunctionEnd
%69 = OpFunction %1 None %2
%70 = OpLabel
%73 = OpLoad %23 %27
OpSelectionMerge %72 None
OpBranchConditional %73 %71 %72
%71 = OpLabel
OpKill
%72 = OpLabel
OpReturn
OpFunctionEnd
#endif
