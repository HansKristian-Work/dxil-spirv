#version 460

layout(location = 0) in vec4 A;
layout(location = 0) out float SV_Target;

void main()
{
    float _21;
    if (isnan(A.x))
    {
        _21 = A.z;
    }
    else
    {
        _21 = isnan(A.y) ? A.z : A.w;
    }
    SV_Target = _21;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 34
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
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
%17 = OpConstant %13 2
%19 = OpTypeBool
%24 = OpConstant %13 3
%27 = OpConstant %13 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %30
%30 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%16 = OpAccessChain %11 %8 %17
%18 = OpLoad %5 %16
%20 = OpIsNan %19 %15
OpSelectionMerge %32 None
OpBranchConditional %20 %32 %31
%31 = OpLabel
%23 = OpAccessChain %11 %8 %24
%25 = OpLoad %5 %23
%26 = OpAccessChain %11 %8 %27
%28 = OpLoad %5 %26
%29 = OpIsNan %19 %28
%22 = OpSelect %5 %29 %18 %25
OpBranch %32
%32 = OpLabel
%21 = OpPhi %5 %18 %30 %22 %31
OpStore %10 %21
OpReturn
OpFunctionEnd
#endif
