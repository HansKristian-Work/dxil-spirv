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

layout(set = 4, binding = 0, r32ui) uniform coherent uimageBuffer _12[];

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
    uvec4 _50 = imageLoad(_12[registers._m4], int(_46 + 1u));
    uvec4 _53 = imageLoad(_12[registers._m4], int(_46 + 2u));
    uvec4 _57 = imageLoad(_12[registers._m4], int(_46 + 3u));
    uvec4 _61 = uvec4(_48.x, _50.x, _53.x, _57.x);
    uint _71 = ByteAddressMask(_35 * 4u, 4u);
    imageStore(_12[registers._m4], int(_71), uvec4(_61.x + 1u));
    imageStore(_12[registers._m4], int(_71 + 1u), uvec4(_61.y + 2u));
    imageStore(_12[registers._m4], int(_71 + 2u), uvec4(_61.z + 3u));
    imageStore(_12[registers._m4], int(_71 + 3u), uvec4(_61.w + 4u));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 80
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_EXT_fragment_shader_interlock"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
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
OpDecorate %12 Coherent
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
%55 = OpConstant %5 2
%59 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %79
%79 = OpLabel
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
%48 = OpImageRead %47 %23 %46
%49 = OpCompositeExtract %5 %48 0
%51 = OpIAdd %5 %46 %29
%50 = OpImageRead %47 %23 %51
%52 = OpCompositeExtract %5 %50 0
%54 = OpIAdd %5 %46 %55
%53 = OpImageRead %47 %23 %54
%56 = OpCompositeExtract %5 %53 0
%58 = OpIAdd %5 %46 %59
%57 = OpImageRead %47 %23 %58
%60 = OpCompositeExtract %5 %57 0
%61 = OpCompositeConstruct %47 %49 %52 %56 %60
%62 = OpCompositeExtract %5 %61 0
%63 = OpCompositeExtract %5 %61 1
%64 = OpCompositeExtract %5 %61 2
%65 = OpCompositeExtract %5 %61 3
%66 = OpIAdd %5 %62 %29
%67 = OpIAdd %5 %63 %55
%68 = OpIAdd %5 %64 %59
%69 = OpIAdd %5 %65 %21
%70 = OpIMul %5 %35 %21
%71 = OpFunctionCall %5 %41 %70 %21
%72 = OpCompositeConstruct %47 %66 %66 %66 %66
OpImageWrite %23 %71 %72
%73 = OpCompositeConstruct %47 %67 %67 %67 %67
%74 = OpIAdd %5 %71 %29
OpImageWrite %23 %74 %73
%75 = OpCompositeConstruct %47 %68 %68 %68 %68
%76 = OpIAdd %5 %71 %55
OpImageWrite %23 %76 %75
%77 = OpCompositeConstruct %47 %69 %69 %69 %69
%78 = OpIAdd %5 %71 %59
OpImageWrite %23 %78 %77
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
