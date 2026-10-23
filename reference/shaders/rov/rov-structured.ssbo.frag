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

layout(set = 0, binding = 0, std430) buffer SSBO
{
    uvec4 _m0[];
} _10;

void main()
{
    uint _26 = (uint(gl_FragCoord.y) * 1000u) + uint(gl_FragCoord.x);
    SPIRV_Cross_beginInvocationInterlock();
    vec4 _31 = uintBitsToFloat(_10._m0[_26]);
    _10._m0[_26] = uvec4(floatBitsToUint(_31.x + 1.0), floatBitsToUint(_31.y + 2.0), floatBitsToUint(_31.z + 3.0), floatBitsToUint(_31.w + 4.0));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 51
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_fragment_shader_interlock"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %10 %14
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
%30 = OpConstant %5 5
%37 = OpConstant %11 1
%39 = OpConstant %11 2
%41 = OpConstant %11 3
%43 = OpConstant %11 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %50
%50 = OpLabel
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
%29 = OpLoad %6 %28 MakePointerVisible|NonPrivatePointer %30
%31 = OpBitcast %12 %29
%32 = OpCompositeExtract %11 %31 0
%33 = OpCompositeExtract %11 %31 1
%34 = OpCompositeExtract %11 %31 2
%35 = OpCompositeExtract %11 %31 3
%36 = OpFAdd %11 %32 %37
%38 = OpFAdd %11 %33 %39
%40 = OpFAdd %11 %34 %41
%42 = OpFAdd %11 %35 %43
%44 = OpBitcast %5 %36
%45 = OpBitcast %5 %38
%46 = OpBitcast %5 %40
%47 = OpBitcast %5 %42
%48 = OpCompositeConstruct %6 %44 %45 %46 %47
%49 = OpAccessChain %27 %10 %17 %26
OpStore %49 %48 MakePointerAvailable|NonPrivatePointer %30
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
