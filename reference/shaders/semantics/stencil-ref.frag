#version 460
#extension GL_ARB_shader_stencil_export : require

layout(location = 0) in float V;
layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = V;
    SV_Target.y = V;
    SV_Target.z = V;
    SV_Target.w = V;
    gl_FragStencilRefARB = int(uint(V));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 27
; Schema: 0
OpCapability Shader
OpCapability StencilExportEXT
OpExtension "SPV_EXT_shader_stencil_export"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %10 %13
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 StencilRefReplacingEXT
OpName %3 "main"
OpName %7 "V"
OpName %10 "SV_Target"
OpName %13 "SV_StencilRef"
OpDecorate %7 Location 0
OpDecorate %10 Location 0
OpDecorate %13 BuiltIn FragStencilRefEXT
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeVector %5 4
%9 = OpTypePointer Output %8
%10 = OpVariable %9 Output
%11 = OpTypeInt 32 0
%12 = OpTypePointer Output %11
%13 = OpVariable %12 Output
%16 = OpTypePointer Output %5
%18 = OpConstant %11 0
%20 = OpConstant %11 1
%22 = OpConstant %11 2
%24 = OpConstant %11 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %25
%25 = OpLabel
%14 = OpLoad %5 %7
%15 = OpConvertFToU %11 %14
%17 = OpAccessChain %16 %10 %18
OpStore %17 %14
%19 = OpAccessChain %16 %10 %20
OpStore %19 %14
%21 = OpAccessChain %16 %10 %22
OpStore %21 %14
%23 = OpAccessChain %16 %10 %24
OpStore %23 %14
OpStore %13 %15
OpReturn
OpFunctionEnd
#endif
