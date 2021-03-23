#version 460

layout(constant_id = 0) const uint _10 = 1u;

layout(location = 0) out vec4 SV_Target;

void main()
{
    float _11 = float(_10);
    SV_Target.x = _11;
    SV_Target.y = _11;
    SV_Target.z = _11;
    SV_Target.w = _11;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 22
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %10 SpecId 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpTypeInt 32 0
%10 = OpSpecConstant %9 1
%12 = OpTypePointer Output %5
%14 = OpConstant %9 0
%16 = OpConstant %9 1
%18 = OpConstant %9 2
%20 = OpConstant %9 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %21
%21 = OpLabel
%11 = OpConvertUToF %5 %10
%13 = OpAccessChain %12 %8 %14
OpStore %13 %11
%15 = OpAccessChain %12 %8 %16
OpStore %15 %11
%17 = OpAccessChain %12 %8 %18
OpStore %17 %11
%19 = OpAccessChain %12 %8 %20
OpStore %19 %11
OpReturn
OpFunctionEnd
#endif
