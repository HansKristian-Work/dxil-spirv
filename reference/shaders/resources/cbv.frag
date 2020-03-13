#version 460

layout(set = 2, binding = 1, std140) uniform _10_12
{
    vec4 _m0[1];
} _12;

layout(set = 2, binding = 2, std140) uniform _14_16
{
    vec4 _m0[1];
} _16;

layout(location = 0) out float SV_Target;

void main()
{
    uvec4 _31 = floatBitsToUint(_12._m0[0u]);
    uvec4 _35 = floatBitsToUint(_16._m0[0u]);
    SV_Target = ((_16._m0[0u].x + _12._m0[0u].x) + float(_35.y + _31.y)) + float(int(_35.z + _31.z));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 47
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %18
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %14 ""
OpName %18 "SV_Target"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %12 DescriptorSet 2
OpDecorate %12 Binding 1
OpDecorate %13 ArrayStride 16
OpMemberDecorate %14 0 Offset 0
OpDecorate %14 Block
OpDecorate %16 DescriptorSet 2
OpDecorate %16 Binding 2
OpDecorate %18 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 1
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypeArray %8 %6
%14 = OpTypeStruct %13
%15 = OpTypePointer Uniform %14
%16 = OpVariable %15 Uniform
%17 = OpTypePointer Output %7
%18 = OpVariable %17 Output
%19 = OpConstant %5 0
%20 = OpTypePointer Uniform %8
%30 = OpTypeVector %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %45
%45 = OpLabel
%21 = OpAccessChain %20 %12 %19 %19
%22 = OpLoad %8 %21
%23 = OpCompositeExtract %7 %22 0
%24 = OpAccessChain %20 %16 %19 %19
%25 = OpLoad %8 %24
%26 = OpCompositeExtract %7 %25 0
%27 = OpFAdd %7 %26 %23
%28 = OpAccessChain %20 %12 %19 %19
%29 = OpLoad %8 %28
%31 = OpBitcast %30 %29
%32 = OpCompositeExtract %5 %31 1
%33 = OpAccessChain %20 %16 %19 %19
%34 = OpLoad %8 %33
%35 = OpBitcast %30 %34
%36 = OpCompositeExtract %5 %35 1
%37 = OpIAdd %5 %36 %32
%38 = OpConvertUToF %7 %37
%39 = OpFAdd %7 %27 %38
%40 = OpCompositeExtract %5 %31 2
%41 = OpCompositeExtract %5 %35 2
%42 = OpIAdd %5 %41 %40
%43 = OpConvertSToF %7 %42
%44 = OpFAdd %7 %39 %43
OpStore %18 %44
OpReturn
OpFunctionEnd
#endif
