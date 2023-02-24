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

layout(set = 0, binding = 0, std430) coherent buffer SSBO
{
    uvec4 _m0[];
} _10;

void main()
{
    uint _26 = (uint(gl_FragCoord.y) * 1000u) + uint(gl_FragCoord.x);
    SPIRV_Cross_beginInvocationInterlock();
    _10._m0[_26] = uvec4(_10._m0[_26].x + 1u, _10._m0[_26].y + 2u, _10._m0[_26].z + 3u, _10._m0[_26].w + 4u);
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 46
; Schema: 0
OpCapability Shader
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_fragment_shader_interlock"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %8 "SSBO"
OpName %14 "SV_Position"
OpDecorate %7 ArrayStride 16
OpMemberDecorate %8 0 Offset 0
OpDecorate %8 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 Coherent
OpDecorate %14 BuiltIn FragCoord
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 4
%7 = OpTypeRuntimeArray %6
%8 = OpTypeStruct %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypeFloat 32
%12 = OpTypeVector %11 4
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%15 = OpTypePointer Input %11
%17 = OpConstant %5 0
%20 = OpConstant %5 1
%25 = OpConstant %5 1000
%28 = OpConstant %5 4
%29 = OpTypePointer StorageBuffer %6
%38 = OpConstant %5 2
%40 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %44
%44 = OpLabel
%16 = OpAccessChain %15 %14 %17
%18 = OpLoad %11 %16
%19 = OpAccessChain %15 %14 %20
%21 = OpLoad %11 %19
%22 = OpConvertFToU %5 %18
%23 = OpConvertFToU %5 %21
%24 = OpIMul %5 %23 %25
%26 = OpIAdd %5 %24 %22
%27 = OpShiftLeftLogical %5 %26 %28
%30 = OpAccessChain %29 %10 %17 %26
OpBeginInvocationInterlockEXT
%31 = OpLoad %6 %30
%32 = OpCompositeExtract %5 %31 0
%33 = OpCompositeExtract %5 %31 1
%34 = OpCompositeExtract %5 %31 2
%35 = OpCompositeExtract %5 %31 3
%36 = OpIAdd %5 %32 %20
%37 = OpIAdd %5 %33 %38
%39 = OpIAdd %5 %34 %40
%41 = OpIAdd %5 %35 %28
%42 = OpCompositeConstruct %6 %36 %37 %39 %41
%43 = OpAccessChain %29 %10 %17 %26
OpStore %43 %42
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
