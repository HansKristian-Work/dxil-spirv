#version 460

float _37;

layout(location = 0) in vec4 A;
layout(location = 0) out float SV_Target;

void main()
{
    bool _34;
    float _38;
    if (isnan(A.x))
    {
        float _36;
        bool _39;
        if (isnan(A.y))
        {
            _36 = A.z;
            _39 = false;
        }
        else
        {
            _36 = _37;
            _39 = true;
        }
        _38 = _36;
        _34 = _39;
    }
    else
    {
        _38 = _37;
        _34 = true;
    }
    float _28;
    if (_34)
    {
        _28 = A.w;
    }
    else
    {
        _28 = _38;
    }
    SV_Target = _28;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 51
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
%37 = OpUndef %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %40
%40 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%16 = OpAccessChain %11 %8 %17
%18 = OpLoad %5 %16
%20 = OpIsNan %19 %15
OpSelectionMerge %46 None
OpBranchConditional %20 %42 %41
%41 = OpLabel
OpBranch %46
%42 = OpLabel
%21 = OpAccessChain %11 %8 %22
%23 = OpLoad %5 %21
%24 = OpAccessChain %11 %8 %25
%26 = OpLoad %5 %24
%27 = OpIsNan %19 %26
OpSelectionMerge %45 None
OpBranchConditional %27 %44 %43
%43 = OpLabel
OpBranch %45
%44 = OpLabel
OpBranch %45
%45 = OpLabel
%36 = OpPhi %5 %23 %44 %37 %43
%39 = OpPhi %19 %33 %44 %35 %43
OpBranch %46
%46 = OpLabel
%38 = OpPhi %5 %36 %45 %37 %41
%34 = OpPhi %19 %39 %45 %35 %41
OpBranch %47
%47 = OpLabel
OpSelectionMerge %49 None
OpBranchConditional %34 %48 %49
%48 = OpLabel
OpBranch %49
%49 = OpLabel
%28 = OpPhi %5 %38 %47 %18 %48
OpBranch %50
%50 = OpLabel
OpStore %10 %28
OpReturn
OpFunctionEnd
#endif
