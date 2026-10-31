#version 460
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0) uniform usamplerBuffer _8;

layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _19 = 0u + 1u;
    uint _23 = 0u + 2u;
    uint _27 = 0u + 3u;
    uvec4 _30 = uvec4(texelFetch(_8, int(0u)).x, texelFetch(_8, int(_19)).x, texelFetch(_8, int(_23)).x, texelFetch(_8, int(_27)).x);
    SV_Target.x = uintBitsToFloat(_30.x);
    SV_Target.y = uintBitsToFloat(_30.y);
    SV_Target.z = uintBitsToFloat(_30.z);
    SV_Target.w = uintBitsToFloat(_30.w);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 45
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
%10 = OpTypeVector %9 4
%11 = OpTypePointer Output %10
%12 = OpVariable %11 Output
%14 = OpConstant %5 0
%15 = OpTypeVector %5 4
%20 = OpConstant %5 1
%24 = OpConstant %5 2
%28 = OpConstant %5 3
%39 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %44
%44 = OpLabel
%13 = OpLoad %6 %8
%16 = OpImageFetch %15 %13 %14
%17 = OpCompositeExtract %5 %16 0
%19 = OpIAdd %5 %14 %20
%18 = OpImageFetch %15 %13 %19
%21 = OpCompositeExtract %5 %18 0
%23 = OpIAdd %5 %14 %24
%22 = OpImageFetch %15 %13 %23
%25 = OpCompositeExtract %5 %22 0
%27 = OpIAdd %5 %14 %28
%26 = OpImageFetch %15 %13 %27
%29 = OpCompositeExtract %5 %26 0
%30 = OpCompositeConstruct %15 %17 %21 %25 %29
%31 = OpCompositeExtract %5 %30 0
%32 = OpBitcast %9 %31
%33 = OpCompositeExtract %5 %30 1
%34 = OpBitcast %9 %33
%35 = OpCompositeExtract %5 %30 2
%36 = OpBitcast %9 %35
%37 = OpCompositeExtract %5 %30 3
%38 = OpBitcast %9 %37
%40 = OpAccessChain %39 %12 %14
OpStore %40 %32
%41 = OpAccessChain %39 %12 %20
OpStore %41 %34
%42 = OpAccessChain %39 %12 %24
OpStore %42 %36
%43 = OpAccessChain %39 %12 %28
OpStore %43 %38
OpReturn
OpFunctionEnd
#endif
