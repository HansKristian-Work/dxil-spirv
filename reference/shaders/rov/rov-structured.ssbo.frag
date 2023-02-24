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
    vec4 _30 = uintBitsToFloat(_10._m0[_26]);
    _10._m0[_26] = uvec4(floatBitsToUint(_30.x + 1.0), floatBitsToUint(_30.y + 2.0), floatBitsToUint(_30.z + 3.0), floatBitsToUint(_30.w + 4.0));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 51
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
%27 = OpTypePointer StorageBuffer %6
%36 = OpConstant %11 1
%38 = OpConstant %11 2
%40 = OpConstant %11 3
%42 = OpConstant %11 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %49
%49 = OpLabel
%16 = OpAccessChain %15 %14 %17
%18 = OpLoad %11 %16
%19 = OpAccessChain %15 %14 %20
%21 = OpLoad %11 %19
%22 = OpConvertFToU %5 %18
%23 = OpConvertFToU %5 %21
%24 = OpIMul %5 %23 %25
%26 = OpIAdd %5 %24 %22
%28 = OpAccessChain %27 %10 %17 %26
OpBeginInvocationInterlockEXT
%29 = OpLoad %6 %28
%30 = OpBitcast %12 %29
%31 = OpCompositeExtract %11 %30 0
%32 = OpCompositeExtract %11 %30 1
%33 = OpCompositeExtract %11 %30 2
%34 = OpCompositeExtract %11 %30 3
%35 = OpFAdd %11 %31 %36
%37 = OpFAdd %11 %32 %38
%39 = OpFAdd %11 %33 %40
%41 = OpFAdd %11 %34 %42
%43 = OpBitcast %5 %35
%44 = OpBitcast %5 %37
%45 = OpBitcast %5 %39
%46 = OpBitcast %5 %41
%47 = OpCompositeConstruct %6 %43 %44 %45 %46
%48 = OpAccessChain %27 %10 %17 %26
OpStore %48 %47
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
