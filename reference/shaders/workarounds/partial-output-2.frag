#version 460

layout(location = 0) in vec2 V;
layout(location = 4) out vec4 SV_Target_4;
const vec4 _11_init = vec4(0.0);

void main()
{
    SV_Target_4 = _11_init;
    if (V.x == 10.0)
    {
        SV_Target_4.x = 40.0;
        SV_Target_4.y = 40.0;
        SV_Target_4.z = 40.0;
        SV_Target_4.w = 40.0;
    }
    else
    {
        if (V.x == 20.0)
        {
            SV_Target_4.x = 50.0;
            SV_Target_4.y = 50.0;
            SV_Target_4.z = 50.0;
            SV_Target_4.w = 50.0;
        }
    }
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 44
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "V"
OpName %11 "SV_Target_4"
OpDecorate %8 Location 0
OpDecorate %11 Location 4
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeVector %5 4
%10 = OpTypePointer Output %9
%36 = OpConstantNull %9
%11 = OpVariable %10 Output %36
%12 = OpTypePointer Input %5
%14 = OpTypeInt 32 0
%15 = OpConstant %14 0
%17 = OpTypeBool
%19 = OpConstant %5 10
%21 = OpConstant %5 20
%22 = OpTypePointer Output %5
%24 = OpConstant %5 50
%26 = OpConstant %14 1
%28 = OpConstant %14 2
%30 = OpConstant %14 3
%32 = OpConstant %5 40
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %37
%37 = OpLabel
%13 = OpAccessChain %12 %8 %15
%16 = OpLoad %5 %13
%18 = OpFOrdEqual %17 %16 %19
OpSelectionMerge %42 None
OpBranchConditional %18 %41 %38
%38 = OpLabel
%20 = OpFOrdEqual %17 %16 %21
OpSelectionMerge %40 None
OpBranchConditional %20 %39 %40
%39 = OpLabel
%23 = OpAccessChain %22 %11 %15
OpStore %23 %24
%25 = OpAccessChain %22 %11 %26
OpStore %25 %24
%27 = OpAccessChain %22 %11 %28
OpStore %27 %24
%29 = OpAccessChain %22 %11 %30
OpStore %29 %24
OpBranch %40
%40 = OpLabel
OpBranch %42
%41 = OpLabel
%31 = OpAccessChain %22 %11 %15
OpStore %31 %32
%33 = OpAccessChain %22 %11 %26
OpStore %33 %32
%34 = OpAccessChain %22 %11 %28
OpStore %34 %32
%35 = OpAccessChain %22 %11 %30
OpStore %35 %32
OpBranch %42
%42 = OpLabel
OpBranch %43
%43 = OpLabel
OpReturn
OpFunctionEnd
#endif
