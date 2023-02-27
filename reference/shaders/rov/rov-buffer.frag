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

layout(set = 0, binding = 0, r32f) uniform coherent imageBuffer _8;

void main()
{
    uint _25 = (uint(gl_FragCoord.y) * 1000u) + uint(gl_FragCoord.x);
    SPIRV_Cross_beginInvocationInterlock();
    vec4 _26 = imageLoad(_8, int(_25));
    imageStore(_8, int(_25), vec4(_26.x + 1.0, _26.y + 2.0, _26.z + 3.0, _26.w + 4.0));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 42
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_fragment_shader_interlock"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %11
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %11 "SV_Position"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 Coherent
OpDecorate %11 BuiltIn FragCoord
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32f
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeVector %5 4
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%13 = OpTypePointer Input %5
%15 = OpTypeInt 32 0
%16 = OpConstant %15 0
%19 = OpConstant %15 1
%24 = OpConstant %15 1000
%32 = OpConstant %5 1
%34 = OpConstant %5 2
%36 = OpConstant %5 3
%38 = OpConstant %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %40
%40 = OpLabel
%12 = OpLoad %6 %8
%14 = OpAccessChain %13 %11 %16
%17 = OpLoad %5 %14
%18 = OpAccessChain %13 %11 %19
%20 = OpLoad %5 %18
%21 = OpConvertFToU %15 %17
%22 = OpConvertFToU %15 %20
%23 = OpIMul %15 %22 %24
%25 = OpIAdd %15 %23 %21
OpBeginInvocationInterlockEXT
%26 = OpImageRead %9 %12 %25
%27 = OpCompositeExtract %5 %26 0
%28 = OpCompositeExtract %5 %26 1
%29 = OpCompositeExtract %5 %26 2
%30 = OpCompositeExtract %5 %26 3
%31 = OpFAdd %5 %27 %32
%33 = OpFAdd %5 %28 %34
%35 = OpFAdd %5 %29 %36
%37 = OpFAdd %5 %30 %38
%39 = OpCompositeConstruct %9 %31 %33 %35 %37
OpImageWrite %12 %25 %39
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
