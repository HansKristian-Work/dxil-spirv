#version 460

layout(location = 0) in vec4 V;
layout(location = 0) out vec4 SV_Target;

void main()
{
    float _47;
    if (V.x > 0.0)
    {
        _47 = 20.0;
    }
    else
    {
        _47 = 10.0;
    }
    float _44;
    float _45;
    if (V.y > 0.0)
    {
        float _46;
        if (V.x > 1.0)
        {
            _46 = 10.0;
        }
        else
        {
            _46 = 20.0;
        }
        if (V.z > 0.0)
        {
            _44 = _46;
            _45 = 30.0;
        }
        else
        {
            _44 = _46;
            _45 = 10.0;
        }
    }
    else
    {
        _44 = 0.0;
        _45 = 10.0;
    }
    SV_Target.x = _47;
    SV_Target.y = _44 + 10.0;
    SV_Target.z = 10.0;
    SV_Target.w = _45;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 69
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "V"
OpName %10 "SV_Target"
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
%43 = OpTypePointer Function %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%44 = OpVariable %43 Function
%45 = OpVariable %43 Function
%46 = OpVariable %43 Function
%47 = OpVariable %43 Function
OpBranch %48
%48 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%16 = OpAccessChain %11 %8 %17
%18 = OpLoad %5 %16
%19 = OpAccessChain %11 %8 %20
%21 = OpLoad %5 %19
%23 = OpFOrdGreaterThan %22 %15 %24
OpSelectionMerge %51 None
OpBranchConditional %23 %50 %49
%50 = OpLabel
OpStore %47 %26
OpBranch %51
%49 = OpLabel
OpStore %47 %27
OpBranch %51
%51 = OpLabel
OpBranch %52
%52 = OpLabel
OpBranch %53
%53 = OpLabel
%25 = OpLoad %5 %47
%28 = OpFOrdGreaterThan %22 %18 %24
OpSelectionMerge %65 None
OpBranchConditional %28 %55 %54
%55 = OpLabel
%29 = OpFOrdGreaterThan %22 %15 %30
OpSelectionMerge %58 None
OpBranchConditional %29 %57 %56
%57 = OpLabel
OpStore %46 %27
OpBranch %58
%56 = OpLabel
OpStore %46 %26
OpBranch %58
%58 = OpLabel
OpBranch %59
%59 = OpLabel
OpBranch %60
%60 = OpLabel
%32 = OpLoad %5 %46
%42 = OpFOrdGreaterThan %22 %21 %24
OpSelectionMerge %63 None
OpBranchConditional %42 %62 %61
%62 = OpLabel
OpStore %44 %32
OpStore %45 %34
OpBranch %63
%61 = OpLabel
OpStore %44 %32
OpStore %45 %27
OpBranch %63
%63 = OpLabel
OpBranch %64
%64 = OpLabel
OpBranch %65
%54 = OpLabel
OpStore %44 %24
OpStore %45 %27
OpBranch %65
%65 = OpLabel
OpBranch %66
%66 = OpLabel
OpBranch %67
%67 = OpLabel
%33 = OpLoad %5 %45
%31 = OpLoad %5 %44
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
