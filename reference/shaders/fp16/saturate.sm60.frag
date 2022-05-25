#version 460

layout(location = 0) in mediump vec4 V;
layout(location = 0) out mediump vec4 SV_Target;

void main()
{
    mediump float _15 = V.x;
    float hp_copy_15 = _15;
    mediump float _18 = V.y;
    float hp_copy_18 = _18;
    mediump float _21 = V.z;
    float hp_copy_21 = _21;
    mediump float _24 = V.w;
    float hp_copy_24 = _24;
    float _40 = isnan(0.0) ? hp_copy_15 : (isnan(hp_copy_15) ? 0.0 : max(hp_copy_15, 0.0));
    float _52 = isnan(0.0) ? hp_copy_18 : (isnan(hp_copy_18) ? 0.0 : max(hp_copy_18, 0.0));
    float _64 = isnan(0.0) ? hp_copy_21 : (isnan(hp_copy_21) ? 0.0 : max(hp_copy_21, 0.0));
    float _76 = isnan(0.0) ? hp_copy_24 : (isnan(hp_copy_24) ? 0.0 : max(hp_copy_24, 0.0));
    SV_Target.x = isnan(1.0) ? _40 : (isnan(_40) ? 1.0 : min(_40, 1.0));
    SV_Target.y = isnan(1.0) ? _52 : (isnan(_52) ? 1.0 : min(_52, 1.0));
    SV_Target.z = isnan(1.0) ? _64 : (isnan(_64) ? 1.0 : min(_64, 1.0));
    SV_Target.w = isnan(1.0) ? _76 : (isnan(_76) ? 1.0 : min(_76, 1.0));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 39
; Schema: 0
OpCapability Shader
%25 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "V"
OpName %10 "SV_Target"
OpDecorate %8 RelaxedPrecision
OpDecorate %8 Location 0
OpDecorate %10 RelaxedPrecision
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
%23 = OpConstant %13 3
%26 = OpConstant %5 0
%27 = OpConstant %5 1
%32 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %37
%37 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%16 = OpAccessChain %11 %8 %17
%18 = OpLoad %5 %16
%19 = OpAccessChain %11 %8 %20
%21 = OpLoad %5 %19
%22 = OpAccessChain %11 %8 %23
%24 = OpLoad %5 %22
%28 = OpExtInst %5 %25 NClamp %15 %26 %27
%29 = OpExtInst %5 %25 NClamp %18 %26 %27
%30 = OpExtInst %5 %25 NClamp %21 %26 %27
%31 = OpExtInst %5 %25 NClamp %24 %26 %27
%33 = OpAccessChain %32 %10 %14
OpStore %33 %28
%34 = OpAccessChain %32 %10 %17
OpStore %34 %29
%35 = OpAccessChain %32 %10 %20
OpStore %35 %30
%36 = OpAccessChain %32 %10 %23
OpStore %36 %31
OpReturn
OpFunctionEnd
#endif
