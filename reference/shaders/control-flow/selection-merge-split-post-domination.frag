#version 460

layout(location = 0) in vec4 V;
layout(location = 0) out vec4 SV_Target;

void main()
{
    float _25;
    if (V.x > 0.0)
    {
        _25 = 20.0;
    }
    else
    {
        _25 = 10.0;
    }
    float _31;
    float _33;
    if (V.y > 0.0)
    {
        float _32;
        if (V.x > 1.0)
        {
            _32 = 10.0;
        }
        else
        {
            _32 = 20.0;
        }
        float frontier_phi_4_6_ladder;
        float frontier_phi_4_6_ladder_1;
        if (V.z > 0.0)
        {
            frontier_phi_4_6_ladder = _32;
            frontier_phi_4_6_ladder_1 = 30.0;
        }
        else
        {
            frontier_phi_4_6_ladder = _32;
            frontier_phi_4_6_ladder_1 = 10.0;
        }
        _31 = frontier_phi_4_6_ladder;
        _33 = frontier_phi_4_6_ladder_1;
    }
    else
    {
        _31 = 0.0;
        _33 = 10.0;
    }
    SV_Target.x = _25;
    SV_Target.y = _31 + 10.0;
    SV_Target.z = 10.0;
    SV_Target.w = _33;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 55
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "V"
OpName %10 "SV_Target"
OpName %43 "frontier_phi_4.6.ladder"
OpName %44 "frontier_phi_4.6.ladder"
OpDecorate %8 Location 0
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %6
%10 = OpVariable %9 Output
%11 = OpTypePointer Input %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%17 = OpConstant %13 1
%20 = OpConstant %13 2
%22 = OpTypeBool
%24 = OpConstant %5 0
%26 = OpConstant %5 20
%27 = OpConstant %5 10
%30 = OpConstant %5 1
%34 = OpConstant %5 30
%36 = OpTypePointer Output %5
%41 = OpConstant %13 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %45
%45 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%16 = OpAccessChain %11 %8 %17
%18 = OpLoad %5 %16
%19 = OpAccessChain %11 %8 %20
%21 = OpLoad %5 %19
%23 = OpFOrdGreaterThan %22 %15 %24
OpSelectionMerge %47 None
OpBranchConditional %23 %46 %47
%46 = OpLabel
OpBranch %47
%47 = OpLabel
%25 = OpPhi %5 %27 %45 %26 %46
%28 = OpFOrdGreaterThan %22 %18 %24
OpSelectionMerge %53 None
OpBranchConditional %28 %48 %53
%48 = OpLabel
%29 = OpFOrdGreaterThan %22 %15 %30
OpSelectionMerge %50 None
OpBranchConditional %29 %49 %50
%49 = OpLabel
OpBranch %50
%50 = OpLabel
%32 = OpPhi %5 %26 %48 %27 %49
%42 = OpFOrdGreaterThan %22 %21 %24
OpSelectionMerge %52 None
OpBranchConditional %42 %51 %52
%51 = OpLabel
OpBranch %52
%52 = OpLabel
%43 = OpPhi %5 %32 %51 %32 %50
%44 = OpPhi %5 %34 %51 %27 %50
OpBranch %53
%53 = OpLabel
%31 = OpPhi %5 %24 %47 %43 %52
%33 = OpPhi %5 %27 %47 %44 %52
%35 = OpFAdd %5 %31 %27
%37 = OpAccessChain %36 %10 %14
OpStore %37 %25
%38 = OpAccessChain %36 %10 %17
OpStore %38 %35
%39 = OpAccessChain %36 %10 %20
OpStore %39 %27
%40 = OpAccessChain %36 %10 %41
OpStore %40 %33
OpReturn
OpFunctionEnd
#endif
