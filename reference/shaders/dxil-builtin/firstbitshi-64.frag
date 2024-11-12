#version 460
#if defined(GL_ARB_gpu_shader_int64)
#extension GL_ARB_gpu_shader_int64 : require
#else
#error No extension available for 64-bit integers.
#endif

layout(location = 0) flat in uint A;
layout(location = 0, component = 1) flat in uint B;
layout(location = 0) out int SV_Target;

void main()
{
    uint64_t _19 = (uint64_t(B) << 32ul) | uint64_t(A);
    uvec2 _22 = unpackUint2x32(_19);
    uvec2 _29 = uvec2(findMSB(_22 ^ uvec2(ivec2(int(_22.y) >> 31))));
    uint _34 = uint(max(int(_29.x), int(_29.y | 32u)));
    uint _40 = (_34 == 4294967295u) ? 4294967295u : (63u - _34);
    uvec2 _43 = unpackUint2x32(_19);
    uvec2 _48 = uvec2(findMSB(_43 ^ uvec2(ivec2(int(_43.y) >> 31))));
    SV_Target = int(uint(max(int(_48.x), int(_48.y | 32u))));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 56
; Schema: 0
OpCapability Shader
OpCapability Int64
%20 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %8 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "A"
OpName %8 "B"
OpName %11 "SV_Target"
OpDecorate %7 Flat
OpDecorate %7 Location 0
OpDecorate %8 Flat
OpDecorate %8 Location 0
OpDecorate %8 Component 1
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpVariable %6 Input
%9 = OpTypeInt 32 1
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%14 = OpTypeInt 64 0
%17 = OpConstant %14 32
%21 = OpTypeVector %5 2
%25 = OpConstant %9 31
%27 = OpTypeVector %9 2
%33 = OpConstant %5 32
%35 = OpTypeBool
%37 = OpConstant %5 4294967295
%39 = OpConstant %5 63
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %54
%54 = OpLabel
%12 = OpLoad %5 %8
%13 = OpLoad %5 %7
%15 = OpUConvert %14 %12
%16 = OpShiftLeftLogical %14 %15 %17
%18 = OpUConvert %14 %13
%19 = OpBitwiseOr %14 %16 %18
%22 = OpBitcast %21 %19
%23 = OpCompositeExtract %5 %22 1
%24 = OpShiftRightArithmetic %9 %23 %25
%28 = OpCompositeConstruct %27 %24 %24
%26 = OpBitwiseXor %21 %22 %28
%29 = OpExtInst %21 %20 FindUMsb %26
%30 = OpCompositeExtract %5 %29 0
%31 = OpCompositeExtract %5 %29 1
%32 = OpBitwiseOr %5 %31 %33
%34 = OpExtInst %5 %20 SMax %30 %32
%36 = OpIEqual %35 %34 %37
%38 = OpISub %5 %39 %34
%40 = OpSelect %5 %36 %37 %38
%41 = OpISub %5 %39 %40
%42 = OpIEqual %35 %40 %37
%43 = OpBitcast %21 %19
%44 = OpCompositeExtract %5 %43 1
%45 = OpShiftRightArithmetic %9 %44 %25
%47 = OpCompositeConstruct %27 %45 %45
%46 = OpBitwiseXor %21 %43 %47
%48 = OpExtInst %21 %20 FindUMsb %46
%49 = OpCompositeExtract %5 %48 0
%50 = OpCompositeExtract %5 %48 1
%51 = OpBitwiseOr %5 %50 %33
%52 = OpExtInst %5 %20 SMax %49 %51
%53 = OpBitcast %9 %52
OpStore %11 %53
OpReturn
OpFunctionEnd
#endif
