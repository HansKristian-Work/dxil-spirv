#version 460
#ifdef GL_ARB_fragment_shader_interlock
#extension GL_ARB_fragment_shader_interlock : enable
#define SPIRV_Cross_beginInvocationInterlock() beginInvocationInterlockARB()
#define SPIRV_Cross_endInvocationInterlock() endInvocationInterlockARB()
#elif defined(GL_INTEL_fragment_shader_ordering)
#extension GL_INTEL_fragment_shader_ordering : enable
#define SPIRV_Cross_beginInvocationInterlock() beginFragmentShaderOrderingINTEL()
#define SPIRV_Cross_endInvocationInterlock()
#endif
#if defined(GL_ARB_fragment_shader_interlock)
layout(pixel_interlock_ordered) in;
#elif !defined(GL_INTEL_fragment_shader_ordering)
#error Fragment Shader Interlock/Ordering extension missing!
#endif
layout(early_fragment_tests) in;

layout(set = 0, binding = 0, r32f) uniform image3D _8;

void main()
{
    uint _24 = uint(gl_FragCoord.x);
    uint _25 = uint(gl_FragCoord.y);
    uint _26 = uint(gl_FragCoord.z);
    SPIRV_Cross_beginInvocationInterlock();
    vec4 _27 = imageLoad(_8, ivec3(uvec3(_24, _25, _26)));
    imageStore(_8, ivec3(uvec3(_24, _25, _26)), vec4(_27.x + 1.0, _27.y + 2.0, _27.z + 3.0, _27.w + 4.0));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 46
; Schema: 0
OpCapability Shader
OpCapability StorageImageWriteWithoutFormat
OpCapability VulkanMemoryModel
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_fragment_shader_interlock"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %11 "SV_Position"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 BuiltIn FragCoord
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 3D 0 0 0 2 R32f
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeVector %5 4
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%13 = OpTypePointer Input %5
%15 = OpTypeInt 32 0
%16 = OpConstant %15 0
%19 = OpConstant %15 1
%22 = OpConstant %15 2
%28 = OpTypeVector %15 3
%30 = OpConstant %15 5
%36 = OpConstant %5 1
%38 = OpConstant %5 2
%40 = OpConstant %5 3
%42 = OpConstant %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %45
%45 = OpLabel
%12 = OpLoad %6 %8
%14 = OpAccessChain %13 %11 %16
%17 = OpLoad %5 %14
%18 = OpAccessChain %13 %11 %19
%20 = OpLoad %5 %18
%21 = OpAccessChain %13 %11 %22
%23 = OpLoad %5 %21
%24 = OpConvertFToU %15 %17
%25 = OpConvertFToU %15 %20
%26 = OpConvertFToU %15 %23
%29 = OpCompositeConstruct %28 %24 %25 %26
OpBeginInvocationInterlockEXT
%27 = OpImageRead %9 %12 %29 MakeTexelVisible|NonPrivateTexel %30
%31 = OpCompositeExtract %5 %27 0
%32 = OpCompositeExtract %5 %27 1
%33 = OpCompositeExtract %5 %27 2
%34 = OpCompositeExtract %5 %27 3
%35 = OpFAdd %5 %31 %36
%37 = OpFAdd %5 %32 %38
%39 = OpFAdd %5 %33 %40
%41 = OpFAdd %5 %34 %42
%43 = OpCompositeConstruct %28 %24 %25 %26
%44 = OpCompositeConstruct %9 %35 %37 %39 %41
OpImageWrite %12 %43 %44 MakeTexelAvailable|NonPrivateTexel %30
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
