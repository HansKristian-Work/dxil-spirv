#version 460

layout(location = 0) in vec4 A;
layout(location = 0) out float SV_Target;

void main()
{
    bool _32 = false;
    float _30;
    if (isnan(A.x))
    {
        if (isnan(A.y))
        {
            _30 = A.z;
        }
        else
        {
            _32 = true;
        }
    }
    else
    {
        _32 = true;
    }
    if (_32)
    {
        _30 = A.w;
    }
    SV_Target = _30;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 46
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "A"
OpName %10 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %5
%10 = OpVariable %9 Output
%11 = OpTypePointer Input %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%17 = OpConstant %13 3
%19 = OpTypeBool
%22 = OpConstant %13 2
%25 = OpConstant %13 1
%29 = OpTypePointer Function %5
%31 = OpTypePointer Function %19
%33 = OpConstantFalse %19
%35 = OpConstantTrue %19
%3 = OpFunction %1 None %2
%4 = OpLabel
%30 = OpVariable %29 Function
%32 = OpVariable %31 Function
OpBranch %36
%36 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%16 = OpAccessChain %11 %8 %17
%18 = OpLoad %5 %16
%20 = OpIsNan %19 %15
OpStore %32 %33
OpSelectionMerge %42 None
OpBranchConditional %20 %38 %37
%37 = OpLabel
OpStore %32 %35
OpBranch %42
%38 = OpLabel
%21 = OpAccessChain %11 %8 %22
%23 = OpLoad %5 %21
%24 = OpAccessChain %11 %8 %25
%26 = OpLoad %5 %24
%27 = OpIsNan %19 %26
OpSelectionMerge %41 None
OpBranchConditional %27 %40 %39
%39 = OpLabel
OpStore %32 %35
OpBranch %41
%40 = OpLabel
OpStore %30 %23
OpBranch %41
%41 = OpLabel
OpBranch %42
%42 = OpLabel
%34 = OpLoad %19 %32
OpSelectionMerge %44 None
OpBranchConditional %34 %43 %44
%43 = OpLabel
OpStore %30 %18
OpBranch %44
%44 = OpLabel
OpBranch %45
%45 = OpLabel
%28 = OpLoad %5 %30
OpStore %10 %28
OpReturn
OpFunctionEnd
#endif
