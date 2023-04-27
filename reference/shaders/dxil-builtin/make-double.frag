#version 460

layout(location = 0) flat in uvec2 VALUE;
layout(location = 0) out float SV_Target;

void main()
{
    SV_Target = float(packDouble2x32(uvec2(VALUE.x, VALUE.y)));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 26
; Schema: 0
OpCapability Shader
OpCapability Float64
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
%19 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 64
OpName %3 "main"
OpName %8 "VALUE"
OpName %11 "SV_Target"
OpDecorate %8 Flat
OpDecorate %8 Location 0
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeFloat 32
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%12 = OpTypePointer Input %5
%14 = OpConstant %5 0
%17 = OpConstant %5 1
%20 = OpTypeFloat 64
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %24
%24 = OpLabel
%13 = OpAccessChain %12 %8 %14
%15 = OpLoad %5 %13
%16 = OpAccessChain %12 %8 %17
%18 = OpLoad %5 %16
%22 = OpCompositeConstruct %6 %15 %18
%21 = OpExtInst %20 %19 PackDouble2x32 %22
%23 = OpFConvert %9 %21
OpStore %11 %23
OpReturn
OpFunctionEnd
#endif
