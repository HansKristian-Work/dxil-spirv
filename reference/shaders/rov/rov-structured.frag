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
    uint _26 = _25 * 4u;
    SPIRV_Cross_beginInvocationInterlock();
    uvec4 _29 = imageLoad(_8, int(_26));
    uvec4 _31 = imageLoad(_8, int(_26 + 1u));
    uvec4 _34 = imageLoad(_8, int(_26 + 2u));
    uvec4 _38 = imageLoad(_8, int(_26 + 3u));
    vec4 _43 = uintBitsToFloat(uvec4(_29.x, _31.x, _34.x, _38.x));
    uint _56 = _25 * 4u;
    imageStore(_8, int(_56), uvec4(floatBitsToUint(_43.x + 1.0)));
    imageStore(_8, int(_56 + 1u), uvec4(floatBitsToUint(_43.y + 2.0)));
    imageStore(_8, int(_56 + 2u), uvec4(floatBitsToUint(_43.z + 3.0)));
    imageStore(_8, int(_56 + 3u), uvec4(floatBitsToUint(_43.w + 4.0)));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 70
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
%28 = OpTypeVector %5 4
%36 = OpConstant %5 2
%40 = OpConstant %5 3
%49 = OpConstant %9 1
%51 = OpConstant %9 2
%53 = OpConstant %9 3
%55 = OpConstant %9 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %68
%68 = OpLabel
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
%29 = OpImageRead %28 %13 %26
%30 = OpCompositeExtract %5 %29 0
%32 = OpIAdd %5 %26 %19
%31 = OpImageRead %28 %13 %32
%33 = OpCompositeExtract %5 %31 0
%35 = OpIAdd %5 %26 %36
%34 = OpImageRead %28 %13 %35
%37 = OpCompositeExtract %5 %34 0
%39 = OpIAdd %5 %26 %40
%38 = OpImageRead %28 %13 %39
%41 = OpCompositeExtract %5 %38 0
%42 = OpCompositeConstruct %28 %30 %33 %37 %41
%43 = OpBitcast %10 %42
%44 = OpCompositeExtract %9 %43 0
%45 = OpCompositeExtract %9 %43 1
%46 = OpCompositeExtract %9 %43 2
%47 = OpCompositeExtract %9 %43 3
%48 = OpFAdd %9 %44 %49
%50 = OpFAdd %9 %45 %51
%52 = OpFAdd %9 %46 %53
%54 = OpFAdd %9 %47 %55
%56 = OpIMul %5 %25 %27
%57 = OpBitcast %5 %48
%58 = OpBitcast %5 %50
%59 = OpBitcast %5 %52
%60 = OpBitcast %5 %54
%61 = OpCompositeConstruct %28 %57 %57 %57 %57
OpImageWrite %13 %56 %61
%62 = OpCompositeConstruct %28 %58 %58 %58 %58
%63 = OpIAdd %5 %56 %19
OpImageWrite %13 %63 %62
%64 = OpCompositeConstruct %28 %59 %59 %59 %59
%65 = OpIAdd %5 %56 %36
OpImageWrite %13 %65 %64
%66 = OpCompositeConstruct %28 %60 %60 %60 %60
%67 = OpIAdd %5 %56 %40
OpImageWrite %13 %67 %66
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
