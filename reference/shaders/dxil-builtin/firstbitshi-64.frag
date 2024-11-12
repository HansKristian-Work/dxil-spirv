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
    uvec2 _28 = uvec2(findMSB(_22 ^ uvec2(ivec2(_22) >> ivec2(31))));
    uint _33 = uint(max(int(_28.x), int(_28.y | 32u)));
    uint _39 = (_33 == 4294967295u) ? 4294967295u : (63u - _33);
    uvec2 _42 = unpackUint2x32(_19);
    uvec2 _45 = uvec2(findMSB(_42 ^ uvec2(ivec2(_42) >> ivec2(31))));
    SV_Target = int(uint(max(int(_45.x), int(_45.y | 32u))));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 53
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
%23 = OpTypeVector %9 2
%25 = OpConstant %9 31
%26 = OpConstantComposite %23 %25 %25
%32 = OpConstant %5 32
%34 = OpTypeBool
%36 = OpConstant %5 4294967295
%38 = OpConstant %5 63
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %51
%51 = OpLabel
%12 = OpLoad %5 %8
%13 = OpLoad %5 %7
%15 = OpUConvert %14 %12
%16 = OpShiftLeftLogical %14 %15 %17
%18 = OpUConvert %14 %13
%19 = OpBitwiseOr %14 %16 %18
%22 = OpBitcast %21 %19
%24 = OpShiftRightArithmetic %23 %22 %26
%27 = OpBitwiseXor %21 %22 %24
%28 = OpExtInst %21 %20 FindUMsb %27
%29 = OpCompositeExtract %5 %28 0
%30 = OpCompositeExtract %5 %28 1
%31 = OpBitwiseOr %5 %30 %32
%33 = OpExtInst %5 %20 SMax %29 %31
%35 = OpIEqual %34 %33 %36
%37 = OpISub %5 %38 %33
%39 = OpSelect %5 %35 %36 %37
%40 = OpISub %5 %38 %39
%41 = OpIEqual %34 %39 %36
%42 = OpBitcast %21 %19
%43 = OpShiftRightArithmetic %23 %42 %26
%44 = OpBitwiseXor %21 %42 %43
%45 = OpExtInst %21 %20 FindUMsb %44
%46 = OpCompositeExtract %5 %45 0
%47 = OpCompositeExtract %5 %45 1
%48 = OpBitwiseOr %5 %47 %32
%49 = OpExtInst %5 %20 SMax %46 %48
%50 = OpBitcast %9 %49
OpStore %11 %50
OpReturn
OpFunctionEnd
#endif
