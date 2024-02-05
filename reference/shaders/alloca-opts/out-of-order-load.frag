#version 460
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _9_11
{
    float _m0[24];
} _11;

layout(set = 0, binding = 0, std140) uniform _15_17
{
    vec4 _m0[6];
} _17;

layout(location = 0) flat in uint A;
layout(location = 1) in vec4 P;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _58 = A % 6u;
    SV_Target.x = _11._m0[_58 * 4u] * P.x;
    SV_Target.y = _11._m0[(_58 * 4u) + 1u] * P.y;
    SV_Target.z = _11._m0[(_58 * 4u) + 2u] * P.z;
    SV_Target.w = _11._m0[(_58 * 4u) + 3u] * P.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 87
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %19 %21 %23
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %9 ""
OpName %15 ""
OpName %19 "A"
OpName %21 "P"
OpName %23 "SV_Target"
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
OpDecorate %19 Flat
OpDecorate %19 Location 0
OpDecorate %21 Location 1
OpDecorate %23 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 24
%7 = OpTypeFloat 32
%8 = OpTypeArray %7 %6
%9 = OpTypeStruct %8
%10 = OpTypePointer Uniform %9
%11 = OpVariable %10 Uniform
%12 = OpConstant %5 6
%13 = OpTypeVector %7 4
%14 = OpTypeArray %13 %12
%15 = OpTypeStruct %14
%16 = OpTypePointer Uniform %15
%17 = OpVariable %16 Uniform
%18 = OpTypePointer Input %5
%19 = OpVariable %18 Input
%20 = OpTypePointer Input %13
%21 = OpVariable %20 Input
%22 = OpTypePointer Output %13
%23 = OpVariable %22 Output
%24 = OpTypePointer Input %7
%26 = OpConstant %5 0
%29 = OpConstant %5 1
%32 = OpConstant %5 2
%35 = OpConstant %5 3
%38 = OpTypePointer Uniform %13
%45 = OpConstant %5 5
%60 = OpConstant %5 4
%61 = OpTypePointer Uniform %7
%80 = OpTypePointer Output %7
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %85
%85 = OpLabel
%25 = OpAccessChain %24 %21 %26
%27 = OpLoad %7 %25
%28 = OpAccessChain %24 %21 %29
%30 = OpLoad %7 %28
%31 = OpAccessChain %24 %21 %32
%33 = OpLoad %7 %31
%34 = OpAccessChain %24 %21 %35
%36 = OpLoad %7 %34
%37 = OpLoad %5 %19
%39 = OpAccessChain %38 %17 %26 %26
%40 = OpLoad %13 %39
%41 = OpCompositeExtract %7 %40 0
%42 = OpCompositeExtract %7 %40 1
%43 = OpCompositeExtract %7 %40 2
%44 = OpCompositeExtract %7 %40 3
%46 = OpAccessChain %38 %17 %26 %45
%47 = OpLoad %13 %46
%48 = OpCompositeExtract %7 %47 0
%49 = OpCompositeExtract %7 %47 1
%50 = OpCompositeExtract %7 %47 2
%51 = OpCompositeExtract %7 %47 3
%52 = OpAccessChain %38 %17 %26 %35
%53 = OpLoad %13 %52
%54 = OpCompositeExtract %7 %53 0
%55 = OpCompositeExtract %7 %53 1
%56 = OpCompositeExtract %7 %53 2
%57 = OpCompositeExtract %7 %53 3
%58 = OpUMod %5 %37 %12
%59 = OpIMul %5 %58 %60
%62 = OpAccessChain %61 %11 %26 %59
%63 = OpIMul %5 %58 %60
%64 = OpIAdd %5 %63 %29
%65 = OpAccessChain %61 %11 %26 %64
%66 = OpIMul %5 %58 %60
%67 = OpIAdd %5 %66 %32
%68 = OpAccessChain %61 %11 %26 %67
%69 = OpIMul %5 %58 %60
%70 = OpIAdd %5 %69 %35
%71 = OpAccessChain %61 %11 %26 %70
%72 = OpLoad %7 %62
%73 = OpLoad %7 %65
%74 = OpLoad %7 %68
%75 = OpLoad %7 %71
%76 = OpFMul %7 %72 %27
%77 = OpFMul %7 %73 %30
%78 = OpFMul %7 %74 %33
%79 = OpFMul %7 %75 %36
%81 = OpAccessChain %80 %23 %26
OpStore %81 %76
%82 = OpAccessChain %80 %23 %29
OpStore %82 %77
%83 = OpAccessChain %80 %23 %32
OpStore %83 %78
%84 = OpAccessChain %80 %23 %35
OpStore %84 %79
OpReturn
OpFunctionEnd
#endif
