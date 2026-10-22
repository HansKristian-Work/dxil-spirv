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
    uvec4 _41 = imageLoad(_8, int(_37 + 1u));
    uvec4 _44 = imageLoad(_8, int(_37 + 2u));
    uvec4 _48 = imageLoad(_8, int(_37 + 3u));
    uvec4 _52 = uvec4(_39.x, _41.x, _44.x, _48.x);
    uint _62 = ByteAddressMask(_25 * 4u, 4u);
    imageStore(_8, int(_62), uvec4(_52.x + 1u));
    imageStore(_8, int(_62 + 1u), uvec4(_52.y + 2u));
    imageStore(_8, int(_62 + 2u), uvec4(_52.z + 3u));
    imageStore(_8, int(_62 + 3u), uvec4(_52.w + 4u));
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
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_fragment_shader_interlock"
OpMemoryModel Logical GLSL450
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
%29 = OpTypeFunction %5 %5 %5
%35 = OpConstant %5 4294967295
%38 = OpTypeVector %5 4
%46 = OpConstant %5 2
%50 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %70
%70 = OpLabel
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
%39 = OpImageRead %38 %13 %37
%40 = OpCompositeExtract %5 %39 0
%42 = OpIAdd %5 %37 %19
%41 = OpImageRead %38 %13 %42
%43 = OpCompositeExtract %5 %41 0
%45 = OpIAdd %5 %37 %46
%44 = OpImageRead %38 %13 %45
%47 = OpCompositeExtract %5 %44 0
%49 = OpIAdd %5 %37 %50
%48 = OpImageRead %38 %13 %49
%51 = OpCompositeExtract %5 %48 0
%52 = OpCompositeConstruct %38 %40 %43 %47 %51
%53 = OpCompositeExtract %5 %52 0
%54 = OpCompositeExtract %5 %52 1
%55 = OpCompositeExtract %5 %52 2
%56 = OpCompositeExtract %5 %52 3
%57 = OpIAdd %5 %53 %19
%58 = OpIAdd %5 %54 %46
%59 = OpIAdd %5 %55 %50
%60 = OpIAdd %5 %56 %27
%61 = OpIMul %5 %25 %27
%62 = OpFunctionCall %5 %32 %61 %27
%63 = OpCompositeConstruct %38 %57 %57 %57 %57
OpImageWrite %13 %62 %63
%64 = OpCompositeConstruct %38 %58 %58 %58 %58
%65 = OpIAdd %5 %62 %19
OpImageWrite %13 %65 %64
%66 = OpCompositeConstruct %38 %59 %59 %59 %59
%67 = OpIAdd %5 %62 %46
OpImageWrite %13 %67 %66
%68 = OpCompositeConstruct %38 %60 %60 %60 %60
%69 = OpIAdd %5 %62 %50
OpImageWrite %13 %69 %68
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
