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
    uint _36 = _35 * 4u;
    SPIRV_Cross_beginInvocationInterlock();
    uvec4 _38 = imageLoad(_12[registers._m4], int(_36));
    uvec4 _40 = imageLoad(_12[registers._m4], int(_36 + 1u));
    uvec4 _43 = imageLoad(_12[registers._m4], int(_36 + 2u));
    uvec4 _47 = imageLoad(_12[registers._m4], int(_36 + 3u));
    vec4 _52 = uintBitsToFloat(uvec4(_38.x, _40.x, _43.x, _47.x));
    uint _65 = _35 * 4u;
    imageStore(_12[registers._m4], int(_65), uvec4(floatBitsToUint(_52.x + 1.0)));
    imageStore(_12[registers._m4], int(_65 + 1u), uvec4(floatBitsToUint(_52.y + 2.0)));
    imageStore(_12[registers._m4], int(_65 + 2u), uvec4(floatBitsToUint(_52.z + 3.0)));
    imageStore(_12[registers._m4], int(_65 + 3u), uvec4(floatBitsToUint(_52.w + 4.0)));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 79
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
%37 = OpTypeVector %5 4
%45 = OpConstant %5 2
%49 = OpConstant %5 3
%58 = OpConstant %13 1
%60 = OpConstant %13 2
%62 = OpConstant %13 3
%64 = OpConstant %13 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %77
%77 = OpLabel
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
%38 = OpImageRead %37 %23 %36
%39 = OpCompositeExtract %5 %38 0
%41 = OpIAdd %5 %36 %29
%40 = OpImageRead %37 %23 %41
%42 = OpCompositeExtract %5 %40 0
%44 = OpIAdd %5 %36 %45
%43 = OpImageRead %37 %23 %44
%46 = OpCompositeExtract %5 %43 0
%48 = OpIAdd %5 %36 %49
%47 = OpImageRead %37 %23 %48
%50 = OpCompositeExtract %5 %47 0
%51 = OpCompositeConstruct %37 %39 %42 %46 %50
%52 = OpBitcast %14 %51
%53 = OpCompositeExtract %13 %52 0
%54 = OpCompositeExtract %13 %52 1
%55 = OpCompositeExtract %13 %52 2
%56 = OpCompositeExtract %13 %52 3
%57 = OpFAdd %13 %53 %58
%59 = OpFAdd %13 %54 %60
%61 = OpFAdd %13 %55 %62
%63 = OpFAdd %13 %56 %64
%65 = OpIMul %5 %35 %21
%66 = OpBitcast %5 %57
%67 = OpBitcast %5 %59
%68 = OpBitcast %5 %61
%69 = OpBitcast %5 %63
%70 = OpCompositeConstruct %37 %66 %66 %66 %66
OpImageWrite %23 %65 %70
%71 = OpCompositeConstruct %37 %67 %67 %67 %67
%72 = OpIAdd %5 %65 %29
OpImageWrite %23 %72 %71
%73 = OpCompositeConstruct %37 %68 %68 %68 %68
%74 = OpIAdd %5 %65 %45
OpImageWrite %23 %74 %73
%75 = OpCompositeConstruct %37 %69 %69 %69 %69
%76 = OpIAdd %5 %65 %49
OpImageWrite %23 %76 %75
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
