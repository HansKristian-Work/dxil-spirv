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
    uvec4 _29 = subgroupBallot(INDEX < 100u);
    SV_Target.x = _29.x;
    SV_Target.y = _29.y;
    SV_Target.z = _29.z;
    SV_Target.w = _29.w;
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
OpEntryPoint Fragment %3 "main" %7 %10 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "INDEX"
OpName %10 "SV_Target"
OpName %25 "discard_state"
OpName %45 "discard_exit"
OpDecorate %7 Flat
OpDecorate %7 Location 0
OpDecorate %10 Location 0
OpDecorate %14 BuiltIn SampleMask
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeVector %5 4
%9 = OpTypePointer Output %8
%10 = OpVariable %9 Output
%11 = OpConstant %5 1
%12 = OpTypeArray %5 %11
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%16 = OpConstant %5 0
%18 = OpTypeBool
%23 = OpConstant %5 40
%24 = OpTypePointer Private %18
%25 = OpVariable %24 Private
%26 = OpConstantFalse %18
%28 = OpConstant %5 100
%30 = OpConstant %5 3
%35 = OpTypePointer Output %5
%39 = OpConstant %5 2
%44 = OpConstantTrue %18
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %25 %26
OpBranch %41
%41 = OpLabel
%15 = OpAccessChain %6 %14 %16
%17 = OpLoad %5 %15
%19 = OpIEqual %18 %16 %17
%20 = OpSelect %5 %19 %11 %16
%21 = OpLoad %5 %7
%22 = OpIEqual %18 %21 %23
OpSelectionMerge %43 None
OpBranchConditional %22 %42 %43
%42 = OpLabel
OpStore %25 %44
OpBranch %43
%43 = OpLabel
%27 = OpULessThan %18 %21 %28
%29 = OpGroupNonUniformBallot %8 %30 %27
%31 = OpCompositeExtract %5 %29 0
%32 = OpCompositeExtract %5 %29 1
%33 = OpCompositeExtract %5 %29 2
%34 = OpCompositeExtract %5 %29 3
%36 = OpAccessChain %35 %10 %16
OpStore %36 %31
%37 = OpAccessChain %35 %10 %11
OpStore %37 %32
%38 = OpAccessChain %35 %10 %39
OpStore %38 %33
%40 = OpAccessChain %35 %10 %30
OpStore %40 %34
%51 = OpFunctionCall %1 %45
OpReturn
OpFunctionEnd
%45 = OpFunction %1 None %2
%46 = OpLabel
%49 = OpLoad %18 %25
OpSelectionMerge %48 None
OpBranchConditional %49 %47 %48
%47 = OpLabel
OpKill
%48 = OpLabel
OpReturn
OpFunctionEnd
#endif
