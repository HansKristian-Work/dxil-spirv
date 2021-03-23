#version 460

layout(location = 0) in float A;
layout(location = 0) out uvec2 SV_Target;

void main()
{
    uvec2 _16 = unpackDouble2x32(double(A));
    SV_Target.x = _16.x;
    SV_Target.y = _16.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 25
; Schema: 0
OpCapability Shader
OpCapability Float64
%15 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "A"
OpName %11 "SV_Target"
OpDecorate %7 Location 0
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeInt 32 0
%9 = OpTypeVector %8 2
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%13 = OpTypeFloat 64
%19 = OpTypePointer Output %8
%21 = OpConstant %8 0
%23 = OpConstant %8 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %24
%24 = OpLabel
%12 = OpLoad %5 %7
%14 = OpFConvert %13 %12
%16 = OpExtInst %9 %15 UnpackDouble2x32 %14
%17 = OpCompositeExtract %8 %16 0
%18 = OpCompositeExtract %8 %16 1
%20 = OpAccessChain %19 %11 %21
OpStore %20 %17
%22 = OpAccessChain %19 %11 %23
OpStore %22 %18
OpReturn
OpFunctionEnd
#endif
