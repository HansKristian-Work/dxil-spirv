#version 460
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0) uniform usamplerBuffer _8;

layout(location = 0) out vec3 SV_Target;

void main()
{
    uvec4 _16 = texelFetch(_8, int(0u));
    uvec4 _24 = texelFetch(_8, int(1u));
    SV_Target.x = uintBitsToFloat(_24.x) + uintBitsToFloat(_16.y);
    SV_Target.y = uintBitsToFloat(_24.y) + uintBitsToFloat(_16.z);
    SV_Target.z = uintBitsToFloat(_24.z) + uintBitsToFloat(_16.w);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 40
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %12
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %12 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeFloat 32
%10 = OpTypeVector %9 3
%11 = OpTypePointer Output %10
%12 = OpVariable %11 Output
%14 = OpConstant %5 0
%15 = OpTypeVector %5 4
%23 = OpConstant %5 1
%34 = OpTypePointer Output %9
%38 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %39
%39 = OpLabel
%13 = OpLoad %6 %8
%16 = OpImageFetch %15 %13 %14
%17 = OpCompositeExtract %5 %16 1
%18 = OpBitcast %9 %17
%19 = OpCompositeExtract %5 %16 2
%20 = OpBitcast %9 %19
%21 = OpCompositeExtract %5 %16 3
%22 = OpBitcast %9 %21
%24 = OpImageFetch %15 %13 %23
%25 = OpCompositeExtract %5 %24 0
%26 = OpBitcast %9 %25
%27 = OpCompositeExtract %5 %24 1
%28 = OpBitcast %9 %27
%29 = OpCompositeExtract %5 %24 2
%30 = OpBitcast %9 %29
%31 = OpFAdd %9 %26 %18
%32 = OpFAdd %9 %28 %20
%33 = OpFAdd %9 %30 %22
%35 = OpAccessChain %34 %12 %14
OpStore %35 %31
%36 = OpAccessChain %34 %12 %23
OpStore %36 %32
%37 = OpAccessChain %34 %12 %38
OpStore %37 %33
OpReturn
OpFunctionEnd
#endif
