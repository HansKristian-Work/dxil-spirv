#version 460

layout(set = 0, binding = 0) uniform writeonly iimageBuffer _8;

layout(location = 0) flat in uint INDEX;
layout(location = 0, component = 1) flat in ivec2 DATA;

void main()
{
    uint _20 = uint(DATA.x);
    imageStore(_8, int(INDEX), ivec4(uvec4(_20, uint(DATA.y), _20, _20)));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 32
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %11 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "INDEX"
OpName %14 "DATA"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %11 Flat
OpDecorate %11 Location 0
OpDecorate %14 Flat
OpDecorate %14 Location 0
OpDecorate %14 Component 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
%6 = OpTypeImage %5 Buffer 0 0 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypeVector %5 2
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%16 = OpTypePointer Input %5
%18 = OpConstant %9 0
%22 = OpConstant %9 1
%26 = OpTypeVector %9 4
%28 = OpTypeVector %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %30
%30 = OpLabel
%15 = OpLoad %6 %8
%17 = OpAccessChain %16 %14 %18
%19 = OpLoad %5 %17
%20 = OpBitcast %9 %19
%21 = OpAccessChain %16 %14 %22
%23 = OpLoad %5 %21
%24 = OpBitcast %9 %23
%25 = OpLoad %9 %11
%27 = OpCompositeConstruct %26 %20 %24 %20 %20
%29 = OpBitcast %28 %27
OpImageWrite %15 %25 %29
OpReturn
OpFunctionEnd
#endif
