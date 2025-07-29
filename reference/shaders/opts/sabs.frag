#version 460

layout(location = 0) flat in ivec4 A;
layout(location = 0) out ivec4 SV_Target;

void main()
{
    uint _16 = uint(A.x);
    uint _20 = uint(A.y);
    uint _24 = uint(A.z);
    uint _28 = uint(A.w);
    SV_Target.x = int(uint(abs(int(_16))));
    SV_Target.y = int(uint(abs(int(_20))));
    SV_Target.z = int(uint(abs(int(_24))));
    SV_Target.w = int(uint(abs(int(_28))));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 49
; Schema: 0
OpCapability Shader
%33 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "A"
OpName %10 "SV_Target"
OpDecorate %8 Flat
OpDecorate %8 Location 0
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %6
%10 = OpVariable %9 Output
%11 = OpTypePointer Input %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%18 = OpConstant %13 1
%22 = OpConstant %13 2
%26 = OpConstant %13 3
%38 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %47
%47 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%16 = OpBitcast %13 %15
%17 = OpAccessChain %11 %8 %18
%19 = OpLoad %5 %17
%20 = OpBitcast %13 %19
%21 = OpAccessChain %11 %8 %22
%23 = OpLoad %5 %21
%24 = OpBitcast %13 %23
%25 = OpAccessChain %11 %8 %26
%27 = OpLoad %5 %25
%28 = OpBitcast %13 %27
%29 = OpSNegate %13 %16
%30 = OpSNegate %13 %20
%31 = OpSNegate %13 %24
%32 = OpSNegate %13 %28
%34 = OpExtInst %13 %33 SAbs %16
%35 = OpExtInst %13 %33 SAbs %20
%36 = OpExtInst %13 %33 SAbs %24
%37 = OpExtInst %13 %33 SAbs %28
%39 = OpAccessChain %38 %10 %14
%40 = OpBitcast %5 %34
OpStore %39 %40
%41 = OpAccessChain %38 %10 %18
%42 = OpBitcast %5 %35
OpStore %41 %42
%43 = OpAccessChain %38 %10 %22
%44 = OpBitcast %5 %36
OpStore %43 %44
%45 = OpAccessChain %38 %10 %26
%46 = OpBitcast %5 %37
OpStore %45 %46
OpReturn
OpFunctionEnd
#endif
