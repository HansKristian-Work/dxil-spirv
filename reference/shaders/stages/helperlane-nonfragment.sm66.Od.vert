#version 460

const uint _12[1] = uint[](0u);

void main()
{
    float _17 = float(false);
    gl_Position.x = _17;
    gl_Position.y = _17;
    gl_Position.z = _17;
    gl_Position.w = _17;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 32
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Vertex %3 "main" %8 %14
OpName %3 "main"
OpName %8 "SV_Position"
OpDecorate %8 BuiltIn Position
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpTypeInt 32 0
%10 = OpConstant %9 1
%11 = OpTypeArray %9 %10
%12 = OpConstantNull %11
%13 = OpTypePointer Private %11
%14 = OpVariable %13 Private %12
%15 = OpTypeBool
%16 = OpConstantFalse %15
%18 = OpConstant %5 1
%19 = OpConstant %5 0
%20 = OpTypePointer Private %9
%22 = OpConstant %9 0
%24 = OpTypePointer Output %5
%28 = OpConstant %9 2
%30 = OpConstant %9 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %31
%31 = OpLabel
%17 = OpSelect %5 %16 %18 %19
%21 = OpAccessChain %20 %14 %22
%23 = OpLoad %9 %21
%25 = OpAccessChain %24 %8 %22
OpStore %25 %17
%26 = OpAccessChain %24 %8 %10
OpStore %26 %17
%27 = OpAccessChain %24 %8 %28
OpStore %27 %17
%29 = OpAccessChain %24 %8 %30
OpStore %29 %17
OpReturn
OpFunctionEnd
#endif
