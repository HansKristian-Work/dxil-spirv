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

layout(set = 3, binding = 0, r32f) uniform coherent image1D _13[];

void main()
{
    uint _35 = (uint(gl_FragCoord.y) * 1000u) + uint(gl_FragCoord.x);
    SPIRV_Cross_beginInvocationInterlock();
    vec4 _36 = imageLoad(_13[registers._m3], int(_35));
    imageStore(_13[registers._m3], int(_35), vec4(_36.x + 1.0, _36.y + 2.0, _36.z + 3.0, _36.w + 4.0));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 52
; Schema: 0
OpCapability Shader
OpCapability Image1D
OpCapability StorageImageWriteWithoutFormat
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
OpDecorate %13 DescriptorSet 3
OpDecorate %13 Binding 0
OpDecorate %13 Coherent
OpDecorate %16 BuiltIn FragCoord
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeFloat 32
%10 = OpTypeImage %9 1D 0 0 0 2 R32f
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer UniformConstant %11
%13 = OpVariable %12 UniformConstant
%14 = OpTypeVector %9 4
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpTypePointer UniformConstant %10
%19 = OpTypePointer PushConstant %5
%21 = OpConstant %5 3
%24 = OpTypePointer Input %9
%26 = OpConstant %5 0
%29 = OpConstant %5 1
%34 = OpConstant %5 1000
%42 = OpConstant %9 1
%44 = OpConstant %9 2
%46 = OpConstant %9 3
%48 = OpConstant %9 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %50
%50 = OpLabel
%20 = OpAccessChain %19 %8 %21
%22 = OpLoad %5 %20
%18 = OpAccessChain %17 %13 %22
%23 = OpLoad %10 %18
%25 = OpAccessChain %24 %16 %26
%27 = OpLoad %9 %25
%28 = OpAccessChain %24 %16 %29
%30 = OpLoad %9 %28
%31 = OpConvertFToU %5 %27
%32 = OpConvertFToU %5 %30
%33 = OpIMul %5 %32 %34
%35 = OpIAdd %5 %33 %31
OpBeginInvocationInterlockEXT
%36 = OpImageRead %14 %23 %35 None
%37 = OpCompositeExtract %9 %36 0
%38 = OpCompositeExtract %9 %36 1
%39 = OpCompositeExtract %9 %36 2
%40 = OpCompositeExtract %9 %36 3
%41 = OpFAdd %9 %37 %42
%43 = OpFAdd %9 %38 %44
%45 = OpFAdd %9 %39 %46
%47 = OpFAdd %9 %40 %48
%49 = OpCompositeConstruct %14 %41 %43 %45 %47
OpImageWrite %23 %35 %49
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
