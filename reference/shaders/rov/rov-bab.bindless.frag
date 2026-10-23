#version 460
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require
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

layout(push_constant, std430) uniform RootConstants
{
    uint _m0;
    uint _m1;
    uint _m2;
    uint _m3;
    uint _m4;
    uint _m5;
    uint _m6;
    uint _m7;
} registers;

layout(set = 4, binding = 0, r32ui) uniform uimageBuffer _12[];

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    uint _35 = (uint(gl_FragCoord.y) * 1000u) + uint(gl_FragCoord.x);
    uint _46 = ByteAddressMask(_35 * 4u, 4u);
    SPIRV_Cross_beginInvocationInterlock();
    uvec4 _48 = imageLoad(_12[registers._m4], int(_46));
    uvec4 _51 = imageLoad(_12[registers._m4], int(_46 + 1u));
    uvec4 _54 = imageLoad(_12[registers._m4], int(_46 + 2u));
    uvec4 _58 = imageLoad(_12[registers._m4], int(_46 + 3u));
    uvec4 _62 = uvec4(_48.x, _51.x, _54.x, _58.x);
    uint _72 = ByteAddressMask(_35 * 4u, 4u);
    imageStore(_12[registers._m4], int(_72), uvec4(_62.x + 1u));
    imageStore(_12[registers._m4], int(_72 + 1u), uvec4(_62.y + 2u));
    imageStore(_12[registers._m4], int(_72 + 2u), uvec4(_62.z + 3u));
    imageStore(_12[registers._m4], int(_72 + 3u), uvec4(_62.w + 4u));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 81
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability RuntimeDescriptorArray
OpCapability VulkanMemoryModel
OpCapability PhysicalStorageBufferAddresses
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_EXT_fragment_shader_interlock"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 Vulkan
OpEntryPoint Fragment %3 "main" %8 %12 %16
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %16 "SV_Position"
OpName %41 "ByteAddressMask"
OpName %39 "index"
OpName %40 "stride"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %12 DescriptorSet 4
OpDecorate %12 Binding 0
OpDecorate %16 BuiltIn FragCoord
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%10 = OpTypeRuntimeArray %9
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpTypeFloat 32
%14 = OpTypeVector %13 4
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpTypePointer UniformConstant %9
%19 = OpTypePointer PushConstant %5
%21 = OpConstant %5 4
%24 = OpTypePointer Input %13
%26 = OpConstant %5 0
%29 = OpConstant %5 1
%34 = OpConstant %5 1000
%38 = OpTypeFunction %5 %5 %5
%44 = OpConstant %5 4294967295
%47 = OpTypeVector %5 4
%49 = OpConstant %5 5
%56 = OpConstant %5 2
%60 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %80
%80 = OpLabel
%20 = OpAccessChain %19 %8 %21
%22 = OpLoad %5 %20
%18 = OpAccessChain %17 %12 %22
%23 = OpLoad %9 %18
%25 = OpAccessChain %24 %16 %26
%27 = OpLoad %13 %25
%28 = OpAccessChain %24 %16 %29
%30 = OpLoad %13 %28
%31 = OpConvertFToU %5 %27
%32 = OpConvertFToU %5 %30
%33 = OpIMul %5 %32 %34
%35 = OpIAdd %5 %33 %31
%36 = OpShiftLeftLogical %5 %35 %21
%37 = OpIMul %5 %35 %21
%46 = OpFunctionCall %5 %41 %37 %21
OpBeginInvocationInterlockEXT
%48 = OpImageRead %47 %23 %46 MakeTexelVisible|NonPrivateTexel %49
%50 = OpCompositeExtract %5 %48 0
%52 = OpIAdd %5 %46 %29
%51 = OpImageRead %47 %23 %52 MakeTexelVisible|NonPrivateTexel %49
%53 = OpCompositeExtract %5 %51 0
%55 = OpIAdd %5 %46 %56
%54 = OpImageRead %47 %23 %55 MakeTexelVisible|NonPrivateTexel %49
%57 = OpCompositeExtract %5 %54 0
%59 = OpIAdd %5 %46 %60
%58 = OpImageRead %47 %23 %59 MakeTexelVisible|NonPrivateTexel %49
%61 = OpCompositeExtract %5 %58 0
%62 = OpCompositeConstruct %47 %50 %53 %57 %61
%63 = OpCompositeExtract %5 %62 0
%64 = OpCompositeExtract %5 %62 1
%65 = OpCompositeExtract %5 %62 2
%66 = OpCompositeExtract %5 %62 3
%67 = OpIAdd %5 %63 %29
%68 = OpIAdd %5 %64 %56
%69 = OpIAdd %5 %65 %60
%70 = OpIAdd %5 %66 %21
%71 = OpIMul %5 %35 %21
%72 = OpFunctionCall %5 %41 %71 %21
%73 = OpCompositeConstruct %47 %67 %67 %67 %67
OpImageWrite %23 %72 %73 MakeTexelAvailable|NonPrivateTexel %49
%74 = OpCompositeConstruct %47 %68 %68 %68 %68
%75 = OpIAdd %5 %72 %29
OpImageWrite %23 %75 %74 MakeTexelAvailable|NonPrivateTexel %49
%76 = OpCompositeConstruct %47 %69 %69 %69 %69
%77 = OpIAdd %5 %72 %56
OpImageWrite %23 %77 %76 MakeTexelAvailable|NonPrivateTexel %49
%78 = OpCompositeConstruct %47 %70 %70 %70 %70
%79 = OpIAdd %5 %72 %60
OpImageWrite %23 %79 %78 MakeTexelAvailable|NonPrivateTexel %49
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
%41 = OpFunction %5 None %38
%39 = OpFunctionParameter %5
%40 = OpFunctionParameter %5
%42 = OpLabel
%43 = OpUDiv %5 %44 %40
%45 = OpBitwiseAnd %5 %39 %43
OpReturnValue %45
OpFunctionEnd
#endif
