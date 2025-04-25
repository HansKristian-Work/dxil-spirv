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

layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _8;

void main()
{
    uint _25 = (uint(gl_FragCoord.y) * 1000u) + uint(gl_FragCoord.x);
    uint _26 = _25 * 4u;
    SPIRV_Cross_beginInvocationInterlock();
    uvec4 _29 = imageLoad(_8, int(_26));
    uvec4 _32 = imageLoad(_8, int(_26 + 1u));
    uvec4 _35 = imageLoad(_8, int(_26 + 2u));
    uvec4 _39 = imageLoad(_8, int(_26 + 3u));
    vec4 _44 = uintBitsToFloat(uvec4(_29.x, _32.x, _35.x, _39.x));
    uint _57 = _25 * 4u;
    imageStore(_8, int(_57), uvec4(floatBitsToUint(_44.x + 1.0)));
    imageStore(_8, int(_57 + 1u), uvec4(floatBitsToUint(_44.y + 2.0)));
    imageStore(_8, int(_57 + 2u), uvec4(floatBitsToUint(_44.z + 3.0)));
    imageStore(_8, int(_57 + 3u), uvec4(floatBitsToUint(_44.w + 4.0)));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 71
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability VulkanMemoryModel
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_fragment_shader_interlock"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %12
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %12 "SV_Position"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
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
%28 = OpTypeVector %5 4
%30 = OpConstant %5 5
%37 = OpConstant %5 2
%41 = OpConstant %5 3
%50 = OpConstant %9 1
%52 = OpConstant %9 2
%54 = OpConstant %9 3
%56 = OpConstant %9 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %69
%69 = OpLabel
%13 = OpLoad %6 %8
%15 = OpAccessChain %14 %12 %16
%17 = OpLoad %9 %15
%18 = OpAccessChain %14 %12 %19
%20 = OpLoad %9 %18
%21 = OpConvertFToU %5 %17
%22 = OpConvertFToU %5 %20
%23 = OpIMul %5 %22 %24
%25 = OpIAdd %5 %23 %21
%26 = OpIMul %5 %25 %27
OpBeginInvocationInterlockEXT
%29 = OpImageRead %28 %13 %26 MakeTexelVisible|NonPrivateTexel %30
%31 = OpCompositeExtract %5 %29 0
%33 = OpIAdd %5 %26 %19
%32 = OpImageRead %28 %13 %33 MakeTexelVisible|NonPrivateTexel %30
%34 = OpCompositeExtract %5 %32 0
%36 = OpIAdd %5 %26 %37
%35 = OpImageRead %28 %13 %36 MakeTexelVisible|NonPrivateTexel %30
%38 = OpCompositeExtract %5 %35 0
%40 = OpIAdd %5 %26 %41
%39 = OpImageRead %28 %13 %40 MakeTexelVisible|NonPrivateTexel %30
%42 = OpCompositeExtract %5 %39 0
%43 = OpCompositeConstruct %28 %31 %34 %38 %42
%44 = OpBitcast %10 %43
%45 = OpCompositeExtract %9 %44 0
%46 = OpCompositeExtract %9 %44 1
%47 = OpCompositeExtract %9 %44 2
%48 = OpCompositeExtract %9 %44 3
%49 = OpFAdd %9 %45 %50
%51 = OpFAdd %9 %46 %52
%53 = OpFAdd %9 %47 %54
%55 = OpFAdd %9 %48 %56
%57 = OpIMul %5 %25 %27
%58 = OpBitcast %5 %49
%59 = OpBitcast %5 %51
%60 = OpBitcast %5 %53
%61 = OpBitcast %5 %55
%62 = OpCompositeConstruct %28 %58 %58 %58 %58
OpImageWrite %13 %57 %62 MakeTexelAvailable|NonPrivateTexel %30
%63 = OpCompositeConstruct %28 %59 %59 %59 %59
%64 = OpIAdd %5 %57 %19
OpImageWrite %13 %64 %63 MakeTexelAvailable|NonPrivateTexel %30
%65 = OpCompositeConstruct %28 %60 %60 %60 %60
%66 = OpIAdd %5 %57 %37
OpImageWrite %13 %66 %65 MakeTexelAvailable|NonPrivateTexel %30
%67 = OpCompositeConstruct %28 %61 %61 %61 %61
%68 = OpIAdd %5 %57 %41
OpImageWrite %13 %68 %67 MakeTexelAvailable|NonPrivateTexel %30
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
