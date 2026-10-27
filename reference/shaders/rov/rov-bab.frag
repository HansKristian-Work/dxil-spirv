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

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    uint _25 = (uint(gl_FragCoord.y) * 1000u) + uint(gl_FragCoord.x);
    uint _37 = ByteAddressMask(_25 * 4u, 4u);
    SPIRV_Cross_beginInvocationInterlock();
    uvec4 _39 = imageLoad(_8, int(_37));
    uvec4 _42 = imageLoad(_8, int(_37 + 1u));
    uvec4 _45 = imageLoad(_8, int(_37 + 2u));
    uvec4 _49 = imageLoad(_8, int(_37 + 3u));
    uvec4 _53 = uvec4(_39.x, _42.x, _45.x, _49.x);
    uint _63 = ByteAddressMask(_25 * 4u, 4u);
    imageStore(_8, int(_63), uvec4(_53.x + 1u));
    imageStore(_8, int(_63 + 1u), uvec4(_53.y + 2u));
    imageStore(_8, int(_63 + 2u), uvec4(_53.z + 3u));
    imageStore(_8, int(_63 + 3u), uvec4(_53.w + 4u));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 72
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
OpName %32 "ByteAddressMask"
OpName %30 "index"
OpName %31 "stride"
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
%29 = OpTypeFunction %5 %5 %5
%35 = OpConstant %5 4294967295
%38 = OpTypeVector %5 4
%40 = OpConstant %5 5
%47 = OpConstant %5 2
%51 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %71
%71 = OpLabel
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
%37 = OpFunctionCall %5 %32 %28 %27
OpBeginInvocationInterlockEXT
%39 = OpImageRead %38 %13 %37 MakeTexelVisible|NonPrivateTexel %40
%41 = OpCompositeExtract %5 %39 0
%43 = OpIAdd %5 %37 %19
%42 = OpImageRead %38 %13 %43 MakeTexelVisible|NonPrivateTexel %40
%44 = OpCompositeExtract %5 %42 0
%46 = OpIAdd %5 %37 %47
%45 = OpImageRead %38 %13 %46 MakeTexelVisible|NonPrivateTexel %40
%48 = OpCompositeExtract %5 %45 0
%50 = OpIAdd %5 %37 %51
%49 = OpImageRead %38 %13 %50 MakeTexelVisible|NonPrivateTexel %40
%52 = OpCompositeExtract %5 %49 0
%53 = OpCompositeConstruct %38 %41 %44 %48 %52
%54 = OpCompositeExtract %5 %53 0
%55 = OpCompositeExtract %5 %53 1
%56 = OpCompositeExtract %5 %53 2
%57 = OpCompositeExtract %5 %53 3
%58 = OpIAdd %5 %54 %19
%59 = OpIAdd %5 %55 %47
%60 = OpIAdd %5 %56 %51
%61 = OpIAdd %5 %57 %27
%62 = OpIMul %5 %25 %27
%63 = OpFunctionCall %5 %32 %62 %27
%64 = OpCompositeConstruct %38 %58 %58 %58 %58
OpImageWrite %13 %63 %64 MakeTexelAvailable|NonPrivateTexel %40
%65 = OpCompositeConstruct %38 %59 %59 %59 %59
%66 = OpIAdd %5 %63 %19
OpImageWrite %13 %66 %65 MakeTexelAvailable|NonPrivateTexel %40
%67 = OpCompositeConstruct %38 %60 %60 %60 %60
%68 = OpIAdd %5 %63 %47
OpImageWrite %13 %68 %67 MakeTexelAvailable|NonPrivateTexel %40
%69 = OpCompositeConstruct %38 %61 %61 %61 %61
%70 = OpIAdd %5 %63 %51
OpImageWrite %13 %70 %69 MakeTexelAvailable|NonPrivateTexel %40
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
%32 = OpFunction %5 None %29
%30 = OpFunctionParameter %5
%31 = OpFunctionParameter %5
%33 = OpLabel
%34 = OpUDiv %5 %35 %31
%36 = OpBitwiseAnd %5 %30 %34
OpReturnValue %36
OpFunctionEnd
#endif
