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

void main()
{
    uint _35 = (uint(gl_FragCoord.y) * 1000u) + uint(gl_FragCoord.x);
    uint _36 = _35 * 4u;
    SPIRV_Cross_beginInvocationInterlock();
    uvec4 _38 = imageLoad(_12[registers._m4], int(_36));
    uvec4 _41 = imageLoad(_12[registers._m4], int(_36 + 1u));
    uvec4 _44 = imageLoad(_12[registers._m4], int(_36 + 2u));
    uvec4 _48 = imageLoad(_12[registers._m4], int(_36 + 3u));
    vec4 _53 = uintBitsToFloat(uvec4(_38.x, _41.x, _44.x, _48.x));
    uint _66 = _35 * 4u;
    imageStore(_12[registers._m4], int(_66), uvec4(floatBitsToUint(_53.x + 1.0)));
    imageStore(_12[registers._m4], int(_66 + 1u), uvec4(floatBitsToUint(_53.y + 2.0)));
    imageStore(_12[registers._m4], int(_66 + 2u), uvec4(floatBitsToUint(_53.z + 3.0)));
    imageStore(_12[registers._m4], int(_66 + 3u), uvec4(floatBitsToUint(_53.w + 4.0)));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 79
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
%37 = OpTypeVector %5 4
%39 = OpConstant %5 5
%46 = OpConstant %5 2
%50 = OpConstant %5 3
%59 = OpConstant %13 1
%61 = OpConstant %13 2
%63 = OpConstant %13 3
%65 = OpConstant %13 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %78
%78 = OpLabel
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
%36 = OpIMul %5 %35 %21
OpBeginInvocationInterlockEXT
%38 = OpImageRead %37 %23 %36 MakeTexelVisible|NonPrivateTexel %39
%40 = OpCompositeExtract %5 %38 0
%42 = OpIAdd %5 %36 %29
%41 = OpImageRead %37 %23 %42 MakeTexelVisible|NonPrivateTexel %39
%43 = OpCompositeExtract %5 %41 0
%45 = OpIAdd %5 %36 %46
%44 = OpImageRead %37 %23 %45 MakeTexelVisible|NonPrivateTexel %39
%47 = OpCompositeExtract %5 %44 0
%49 = OpIAdd %5 %36 %50
%48 = OpImageRead %37 %23 %49 MakeTexelVisible|NonPrivateTexel %39
%51 = OpCompositeExtract %5 %48 0
%52 = OpCompositeConstruct %37 %40 %43 %47 %51
%53 = OpBitcast %14 %52
%54 = OpCompositeExtract %13 %53 0
%55 = OpCompositeExtract %13 %53 1
%56 = OpCompositeExtract %13 %53 2
%57 = OpCompositeExtract %13 %53 3
%58 = OpFAdd %13 %54 %59
%60 = OpFAdd %13 %55 %61
%62 = OpFAdd %13 %56 %63
%64 = OpFAdd %13 %57 %65
%66 = OpIMul %5 %35 %21
%67 = OpBitcast %5 %58
%68 = OpBitcast %5 %60
%69 = OpBitcast %5 %62
%70 = OpBitcast %5 %64
%71 = OpCompositeConstruct %37 %67 %67 %67 %67
OpImageWrite %23 %66 %71 MakeTexelAvailable|NonPrivateTexel %39
%72 = OpCompositeConstruct %37 %68 %68 %68 %68
%73 = OpIAdd %5 %66 %29
OpImageWrite %23 %73 %72 MakeTexelAvailable|NonPrivateTexel %39
%74 = OpCompositeConstruct %37 %69 %69 %69 %69
%75 = OpIAdd %5 %66 %46
OpImageWrite %23 %75 %74 MakeTexelAvailable|NonPrivateTexel %39
%76 = OpCompositeConstruct %37 %70 %70 %70 %70
%77 = OpIAdd %5 %66 %50
OpImageWrite %23 %77 %76 MakeTexelAvailable|NonPrivateTexel %39
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
