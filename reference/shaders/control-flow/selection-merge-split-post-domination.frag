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
    float _33;
    float _34;
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
        float _48;
        float _49;
        if (V.z > 0.0)
        {
            _48 = _46;
            _49 = 30.0;
        }
        else
        {
            _48 = _46;
            _49 = 10.0;
        }
        _33 = _48;
        _34 = _49;
    }
    else
    {
        _33 = 0.0;
        _34 = 10.0;
    }
    SV_Target.x = _25;
    SV_Target.y = _33 + 10.0;
    SV_Target.z = 10.0;
    SV_Target.w = _34;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 64
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
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
%35 = OpConstant %5 30
%37 = OpTypePointer Output %5
%42 = OpConstant %13 3
%43 = OpTypePointer Function %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%46 = OpVariable %43 Function
OpBranch %50
%50 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%16 = OpAccessChain %11 %8 %17
%18 = OpLoad %5 %16
%19 = OpAccessChain %11 %8 %20
%21 = OpLoad %5 %19
%23 = OpFOrdGreaterThan %22 %15 %24
OpSelectionMerge %53 None
OpBranchConditional %23 %52 %51
%51 = OpLabel
OpBranch %53
%52 = OpLabel
OpBranch %53
%53 = OpLabel
%25 = OpPhi %5 %26 %52 %27 %51
%28 = OpFOrdGreaterThan %22 %18 %24
OpSelectionMerge %62 None
OpBranchConditional %28 %55 %54
%54 = OpLabel
OpBranch %62
%55 = OpLabel
%29 = OpFOrdGreaterThan %22 %15 %30
OpSelectionMerge %58 None
OpBranchConditional %29 %57 %56
%56 = OpLabel
OpStore %46 %26
OpBranch %58
%57 = OpLabel
OpStore %46 %27
OpBranch %58
%58 = OpLabel
%31 = OpLoad %5 %46
%32 = OpFOrdGreaterThan %22 %21 %24
OpSelectionMerge %61 None
OpBranchConditional %32 %60 %59
%59 = OpLabel
OpBranch %61
%60 = OpLabel
OpBranch %61
%61 = OpLabel
%48 = OpPhi %5 %31 %60 %31 %59
%49 = OpPhi %5 %35 %60 %27 %59
OpBranch %62
%62 = OpLabel
%33 = OpPhi %5 %48 %61 %24 %54
%34 = OpPhi %5 %49 %61 %27 %54
OpBranch %63
%63 = OpLabel
%36 = OpFAdd %5 %33 %27
%38 = OpAccessChain %37 %10 %14
OpStore %38 %25
%39 = OpAccessChain %37 %10 %17
OpStore %39 %36
%40 = OpAccessChain %37 %10 %20
OpStore %40 %27
%41 = OpAccessChain %37 %10 %42
OpStore %41 %34
OpReturn
OpFunctionEnd
#endif
