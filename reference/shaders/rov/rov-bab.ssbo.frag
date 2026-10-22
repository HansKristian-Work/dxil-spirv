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

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    uint _26 = (uint(gl_FragCoord.y) * 1000u) + uint(gl_FragCoord.x);
    uint _37 = ByteAddressMask(_26, 16u);
    SPIRV_Cross_beginInvocationInterlock();
    _10._m0[ByteAddressMask(_26, 16u)] = uvec4(_10._m0[_37].x + 1u, _10._m0[_37].y + 2u, _10._m0[_37].z + 3u, _10._m0[_37].w + 4u);
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 56
; Schema: 0
OpCapability Shader
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_fragment_shader_interlock"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %14
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %8 "SSBO"
OpName %14 "SV_Position"
OpName %32 "ByteAddressMask"
OpName %30 "index"
OpName %31 "stride"
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
%29 = OpTypeFunction %5 %5 %5
%35 = OpConstant %5 4294967295
%38 = OpConstant %5 16
%39 = OpTypePointer StorageBuffer %6
%48 = OpConstant %5 2
%50 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %55
%55 = OpLabel
%16 = OpAccessChain %15 %14 %17
%18 = OpLoad %11 %16
%19 = OpAccessChain %15 %14 %20
%21 = OpLoad %11 %19
%22 = OpConvertFToU %5 %18
%23 = OpConvertFToU %5 %21
%24 = OpIMul %5 %23 %25
%26 = OpIAdd %5 %24 %22
%27 = OpShiftLeftLogical %5 %26 %28
%37 = OpFunctionCall %5 %32 %26 %38
%40 = OpAccessChain %39 %10 %17 %37
OpBeginInvocationInterlockEXT
%41 = OpLoad %6 %40
%42 = OpCompositeExtract %5 %41 0
%43 = OpCompositeExtract %5 %41 1
%44 = OpCompositeExtract %5 %41 2
%45 = OpCompositeExtract %5 %41 3
%46 = OpIAdd %5 %42 %20
%47 = OpIAdd %5 %43 %48
%49 = OpIAdd %5 %44 %50
%51 = OpIAdd %5 %45 %28
%52 = OpFunctionCall %5 %32 %26 %38
%53 = OpCompositeConstruct %6 %46 %47 %49 %51
%54 = OpAccessChain %39 %10 %17 %52
OpStore %54 %53
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
