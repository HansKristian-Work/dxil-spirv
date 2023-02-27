#version 460
#extension GL_EXT_buffer_reference : require
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

void main()
{
    uint _35 = (uint(gl_FragCoord.y) * 1000u) + uint(gl_FragCoord.x);
    uint _37 = _35 * 4u;
    SPIRV_Cross_beginInvocationInterlock();
    uvec4 _39 = imageLoad(_12[registers._m4], int(_37));
    uvec4 _41 = imageLoad(_12[registers._m4], int(_37 + 1u));
    uvec4 _44 = imageLoad(_12[registers._m4], int(_37 + 2u));
    uvec4 _48 = imageLoad(_12[registers._m4], int(_37 + 3u));
    uvec4 _52 = uvec4(_39.x, _41.x, _44.x, _48.x);
    uint _61 = _35 * 4u;
    imageStore(_12[registers._m4], int(_61), uvec4(_52.x + 1u));
    imageStore(_12[registers._m4], int(_61 + 1u), uvec4(_52.y + 2u));
    imageStore(_12[registers._m4], int(_61 + 2u), uvec4(_52.z + 3u));
    imageStore(_12[registers._m4], int(_61 + 3u), uvec4(_52.w + 4u));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 71
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
OpEntryPoint Fragment %3 "main" %16
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
%38 = OpTypeVector %5 4
%46 = OpConstant %5 2
%50 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %69
%69 = OpLabel
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
OpBeginInvocationInterlockEXT
%39 = OpImageRead %38 %23 %37
%40 = OpCompositeExtract %5 %39 0
%42 = OpIAdd %5 %37 %29
%41 = OpImageRead %38 %23 %42
%43 = OpCompositeExtract %5 %41 0
%45 = OpIAdd %5 %37 %46
%44 = OpImageRead %38 %23 %45
%47 = OpCompositeExtract %5 %44 0
%49 = OpIAdd %5 %37 %50
%48 = OpImageRead %38 %23 %49
%51 = OpCompositeExtract %5 %48 0
%52 = OpCompositeConstruct %38 %40 %43 %47 %51
%53 = OpCompositeExtract %5 %52 0
%54 = OpCompositeExtract %5 %52 1
%55 = OpCompositeExtract %5 %52 2
%56 = OpCompositeExtract %5 %52 3
%57 = OpIAdd %5 %53 %29
%58 = OpIAdd %5 %54 %46
%59 = OpIAdd %5 %55 %50
%60 = OpIAdd %5 %56 %21
%61 = OpIMul %5 %35 %21
%62 = OpCompositeConstruct %38 %57 %57 %57 %57
OpImageWrite %23 %61 %62
%63 = OpCompositeConstruct %38 %58 %58 %58 %58
%64 = OpIAdd %5 %61 %29
OpImageWrite %23 %64 %63
%65 = OpCompositeConstruct %38 %59 %59 %59 %59
%66 = OpIAdd %5 %61 %46
OpImageWrite %23 %66 %65
%67 = OpCompositeConstruct %38 %60 %60 %60 %60
%68 = OpIAdd %5 %61 %50
OpImageWrite %23 %68 %67
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
