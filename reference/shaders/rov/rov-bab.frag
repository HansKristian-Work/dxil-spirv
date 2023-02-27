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

layout(set = 0, binding = 0, r32ui) uniform coherent uimageBuffer _8;

void main()
{
    uint _25 = (uint(gl_FragCoord.y) * 1000u) + uint(gl_FragCoord.x);
    uint _28 = _25 * 4u;
    SPIRV_Cross_beginInvocationInterlock();
    uvec4 _30 = imageLoad(_8, int(_28));
    uvec4 _32 = imageLoad(_8, int(_28 + 1u));
    uvec4 _35 = imageLoad(_8, int(_28 + 2u));
    uvec4 _39 = imageLoad(_8, int(_28 + 3u));
    uvec4 _43 = uvec4(_30.x, _32.x, _35.x, _39.x);
    uint _52 = _25 * 4u;
    imageStore(_8, int(_52), uvec4(_43.x + 1u));
    imageStore(_8, int(_52 + 1u), uvec4(_43.y + 2u));
    imageStore(_8, int(_52 + 2u), uvec4(_43.z + 3u));
    imageStore(_8, int(_52 + 3u), uvec4(_43.w + 4u));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 62
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_fragment_shader_interlock"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %12
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %12 "SV_Position"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 Coherent
OpDecorate %12 BuiltIn FragCoord
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeFloat 32
%10 = OpTypeVector %9 4
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%14 = OpTypePointer Input %9
%16 = OpConstant %5 0
%19 = OpConstant %5 1
%24 = OpConstant %5 1000
%27 = OpConstant %5 4
%29 = OpTypeVector %5 4
%37 = OpConstant %5 2
%41 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %60
%60 = OpLabel
%13 = OpLoad %6 %8
%15 = OpAccessChain %14 %12 %16
%17 = OpLoad %9 %15
%18 = OpAccessChain %14 %12 %19
%20 = OpLoad %9 %18
%21 = OpConvertFToU %5 %17
%22 = OpConvertFToU %5 %20
%23 = OpIMul %5 %22 %24
%25 = OpIAdd %5 %23 %21
%26 = OpShiftLeftLogical %5 %25 %27
%28 = OpIMul %5 %25 %27
OpBeginInvocationInterlockEXT
%30 = OpImageRead %29 %13 %28
%31 = OpCompositeExtract %5 %30 0
%33 = OpIAdd %5 %28 %19
%32 = OpImageRead %29 %13 %33
%34 = OpCompositeExtract %5 %32 0
%36 = OpIAdd %5 %28 %37
%35 = OpImageRead %29 %13 %36
%38 = OpCompositeExtract %5 %35 0
%40 = OpIAdd %5 %28 %41
%39 = OpImageRead %29 %13 %40
%42 = OpCompositeExtract %5 %39 0
%43 = OpCompositeConstruct %29 %31 %34 %38 %42
%44 = OpCompositeExtract %5 %43 0
%45 = OpCompositeExtract %5 %43 1
%46 = OpCompositeExtract %5 %43 2
%47 = OpCompositeExtract %5 %43 3
%48 = OpIAdd %5 %44 %19
%49 = OpIAdd %5 %45 %37
%50 = OpIAdd %5 %46 %41
%51 = OpIAdd %5 %47 %27
%52 = OpIMul %5 %25 %27
%53 = OpCompositeConstruct %29 %48 %48 %48 %48
OpImageWrite %13 %52 %53
%54 = OpCompositeConstruct %29 %49 %49 %49 %49
%55 = OpIAdd %5 %52 %19
OpImageWrite %13 %55 %54
%56 = OpCompositeConstruct %29 %50 %50 %50 %50
%57 = OpIAdd %5 %52 %37
OpImageWrite %13 %57 %56
%58 = OpCompositeConstruct %29 %51 %51 %51 %51
%59 = OpIAdd %5 %52 %41
OpImageWrite %13 %59 %58
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
