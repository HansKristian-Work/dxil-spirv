#version 460
#if defined(GL_ARB_gpu_shader_int64)
#extension GL_ARB_gpu_shader_int64 : require
#else
#error No extension available for 64-bit integers.
#endif

layout(location = 0) flat in uint A;
layout(location = 0, component = 1) flat in uint B;
layout(location = 0) out uint SV_Target;

void main()
{
    uvec2 _22 = uvec2(findLSB(unpackUint2x32(uint64_t(A) | (uint64_t(B) << 32ul))));
    SV_Target = min(_22.x, (_22.y | 32u));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 30
; Schema: 0
OpCapability Shader
OpCapability Int64
%19 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "A"
OpName %8 "B"
OpName %10 "SV_Target"
OpDecorate %7 Flat
OpDecorate %7 Location 0
OpDecorate %8 Flat
OpDecorate %8 Location 0
OpDecorate %8 Component 1
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpVariable %6 Input
%9 = OpTypePointer Output %5
%10 = OpVariable %9 Output
%13 = OpTypeInt 64 0
%17 = OpConstant %13 32
%20 = OpTypeVector %5 2
%26 = OpConstant %5 32
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %28
%28 = OpLabel
%11 = OpLoad %5 %8
%12 = OpLoad %5 %7
%14 = OpUConvert %13 %12
%15 = OpUConvert %13 %11
%16 = OpShiftLeftLogical %13 %15 %17
%18 = OpBitwiseOr %13 %14 %16
%21 = OpBitcast %20 %18
%22 = OpExtInst %20 %19 FindILsb %21
%23 = OpCompositeExtract %5 %22 0
%24 = OpCompositeExtract %5 %22 1
%25 = OpBitwiseOr %5 %24 %26
%27 = OpExtInst %5 %19 UMin %23 %25
OpStore %10 %27
OpReturn
OpFunctionEnd
#endif
