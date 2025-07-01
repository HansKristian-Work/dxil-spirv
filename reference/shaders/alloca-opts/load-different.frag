#version 460
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _9_11
{
    float _m0[4];
} _11;

layout(set = 0, binding = 0, std140) uniform _15_17
{
    vec4 _m0[1];
} _17;

layout(set = 0, binding = 1, std140) uniform _19_21
{
    vec4 _m0[1];
} _21;

layout(location = 0) flat in uint A;
layout(location = 1) in vec4 P;
layout(location = 0) out vec4 SV_Target;

void main()
{
    float _42[4];
    _42[0u] = _17._m0[0u].x;
    _42[1u] = _17._m0[0u].y;
    _42[2u] = _21._m0[0u].z;
    _42[3u] = _21._m0[0u].w;
    uint _59 = A & 3u;
    float _65 = _42[_59] * _11._m0[_59];
    SV_Target.x = _65 * P.x;
    SV_Target.y = _65 * P.y;
    SV_Target.z = _65 * P.z;
    SV_Target.w = _65 * P.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 77
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %23 %25 %27
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %9 ""
OpName %15 ""
OpName %19 ""
OpName %23 "A"
OpName %25 "P"
OpName %27 "SV_Target"
OpDecorate %8 ArrayStride 4
OpMemberDecorate %9 0 Offset 0
OpDecorate %9 Block
OpDecorate %14 ArrayStride 16
OpMemberDecorate %15 0 Offset 0
OpDecorate %15 Block
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %18 ArrayStride 16
OpMemberDecorate %19 0 Offset 0
OpDecorate %19 Block
OpDecorate %21 DescriptorSet 0
OpDecorate %21 Binding 1
OpDecorate %23 Flat
OpDecorate %23 Location 0
OpDecorate %25 Location 1
OpDecorate %27 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 4
%7 = OpTypeFloat 32
%8 = OpTypeArray %7 %6
%9 = OpTypeStruct %8
%10 = OpTypePointer Uniform %9
%11 = OpVariable %10 Uniform
%12 = OpConstant %5 1
%13 = OpTypeVector %7 4
%14 = OpTypeArray %13 %12
%15 = OpTypeStruct %14
%16 = OpTypePointer Uniform %15
%17 = OpVariable %16 Uniform
%18 = OpTypeArray %13 %12
%19 = OpTypeStruct %18
%20 = OpTypePointer Uniform %19
%21 = OpVariable %20 Uniform
%22 = OpTypePointer Input %5
%23 = OpVariable %22 Input
%24 = OpTypePointer Input %13
%25 = OpVariable %24 Input
%26 = OpTypePointer Output %13
%27 = OpVariable %26 Output
%28 = OpTypePointer Input %7
%30 = OpConstant %5 0
%35 = OpConstant %5 2
%38 = OpConstant %5 3
%41 = OpTypePointer Function %8
%43 = OpTypePointer Uniform %13
%50 = OpTypePointer Function %7
%60 = OpTypePointer Uniform %7
%70 = OpTypePointer Output %7
%3 = OpFunction %1 None %2
%4 = OpLabel
%42 = OpVariable %41 Function
OpBranch %75
%75 = OpLabel
%29 = OpAccessChain %28 %25 %30
%31 = OpLoad %7 %29
%32 = OpAccessChain %28 %25 %12
%33 = OpLoad %7 %32
%34 = OpAccessChain %28 %25 %35
%36 = OpLoad %7 %34
%37 = OpAccessChain %28 %25 %38
%39 = OpLoad %7 %37
%40 = OpLoad %5 %23
%44 = OpAccessChain %43 %17 %30 %30
%45 = OpLoad %13 %44
%46 = OpCompositeExtract %7 %45 0
%47 = OpCompositeExtract %7 %45 1
%48 = OpCompositeExtract %7 %45 2
%49 = OpCompositeExtract %7 %45 3
%51 = OpInBoundsAccessChain %50 %42 %30
OpStore %51 %46
%52 = OpInBoundsAccessChain %50 %42 %12
OpStore %52 %47
%53 = OpAccessChain %43 %21 %30 %30
%54 = OpLoad %13 %53
%55 = OpCompositeExtract %7 %54 2
%56 = OpInBoundsAccessChain %50 %42 %35
OpStore %56 %55
%57 = OpCompositeExtract %7 %54 3
%58 = OpInBoundsAccessChain %50 %42 %38
OpStore %58 %57
%59 = OpBitwiseAnd %5 %40 %38
%61 = OpAccessChain %60 %11 %30 %59
%62 = OpLoad %7 %61
%63 = OpInBoundsAccessChain %50 %42 %59
%64 = OpLoad %7 %63
%65 = OpFMul %7 %64 %62
%66 = OpFMul %7 %65 %31
%67 = OpFMul %7 %65 %33
%68 = OpFMul %7 %65 %36
%69 = OpFMul %7 %65 %39
%71 = OpAccessChain %70 %27 %30
OpStore %71 %66
%72 = OpAccessChain %70 %27 %12
OpStore %72 %67
%73 = OpAccessChain %70 %27 %35
OpStore %73 %68
%74 = OpAccessChain %70 %27 %38
OpStore %74 %69
OpReturn
OpFunctionEnd
#endif
