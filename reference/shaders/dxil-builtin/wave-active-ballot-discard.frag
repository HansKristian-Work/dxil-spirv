#version 460
#extension GL_KHR_shader_subgroup_ballot : require

layout(location = 0) flat in uint INDEX;
layout(location = 0) out uvec4 SV_Target;
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
    uvec4 _23 = subgroupBallot((INDEX < 100u) && (!(gl_HelperInvocation || discard_state)));
    SV_Target.x = _23.x;
    SV_Target.y = _23.y;
    SV_Target.z = _23.z;
    SV_Target.w = _23.w;
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 53
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformBallot
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %10 %42
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "INDEX"
OpName %10 "SV_Target"
OpName %16 "discard_state"
OpName %45 "discard_exit"
OpDecorate %7 Flat
OpDecorate %7 Location 0
OpDecorate %10 Location 0
OpDecorate %42 BuiltIn HelperInvocation
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeVector %5 4
%9 = OpTypePointer Output %8
%10 = OpVariable %9 Output
%12 = OpTypeBool
%14 = OpConstant %5 40
%15 = OpTypePointer Private %12
%16 = OpVariable %15 Private
%17 = OpConstantFalse %12
%19 = OpConstant %5 100
%24 = OpConstant %5 3
%29 = OpTypePointer Output %5
%31 = OpConstant %5 0
%33 = OpConstant %5 1
%35 = OpConstant %5 2
%40 = OpConstantTrue %12
%41 = OpTypePointer Input %12
%42 = OpVariable %41 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %16 %17
OpBranch %37
%37 = OpLabel
%11 = OpLoad %5 %7
%13 = OpIEqual %12 %11 %14
OpSelectionMerge %39 None
OpBranchConditional %13 %38 %39
%38 = OpLabel
OpStore %16 %40
OpBranch %39
%39 = OpLabel
%18 = OpULessThan %12 %11 %19
%43 = OpLoad %12 %42
%44 = OpLoad %12 %16
%20 = OpLogicalOr %12 %43 %44
%21 = OpLogicalNot %12 %20
%22 = OpLogicalAnd %12 %18 %21
%23 = OpGroupNonUniformBallot %8 %24 %22
%25 = OpCompositeExtract %5 %23 0
%26 = OpCompositeExtract %5 %23 1
%27 = OpCompositeExtract %5 %23 2
%28 = OpCompositeExtract %5 %23 3
%30 = OpAccessChain %29 %10 %31
OpStore %30 %25
%32 = OpAccessChain %29 %10 %33
OpStore %32 %26
%34 = OpAccessChain %29 %10 %35
OpStore %34 %27
%36 = OpAccessChain %29 %10 %24
OpStore %36 %28
%51 = OpFunctionCall %1 %45
OpReturn
OpFunctionEnd
%45 = OpFunction %1 None %2
%46 = OpLabel
%49 = OpLoad %12 %16
OpSelectionMerge %48 None
OpBranchConditional %49 %47 %48
%47 = OpLabel
OpKill
%48 = OpLabel
OpReturn
OpFunctionEnd
#endif
