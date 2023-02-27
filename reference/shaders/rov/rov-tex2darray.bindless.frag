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

layout(set = 3, binding = 0, r32f) uniform coherent image2DArray _13[];

void main()
{
    uint _34 = uint(gl_FragCoord.x);
    uint _35 = uint(gl_FragCoord.y);
    uint _36 = uint(gl_FragCoord.z);
    SPIRV_Cross_beginInvocationInterlock();
    vec4 _37 = imageLoad(_13[registers._m3], ivec3(uvec3(_34, _35, _36)));
    imageStore(_13[registers._m3], ivec3(uvec3(_34, _35, _36)), vec4(_37.x + 1.0, _37.y + 2.0, _37.z + 3.0, _37.w + 4.0));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 56
; Schema: 0
OpCapability Shader
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
%10 = OpTypeImage %9 2D 0 1 0 2 R32f
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
%32 = OpConstant %5 2
%38 = OpTypeVector %5 3
%45 = OpConstant %9 1
%47 = OpConstant %9 2
%49 = OpConstant %9 3
%51 = OpConstant %9 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %54
%54 = OpLabel
%20 = OpAccessChain %19 %8 %21
%22 = OpLoad %5 %20
%18 = OpAccessChain %17 %13 %22
%23 = OpLoad %10 %18
%25 = OpAccessChain %24 %16 %26
%27 = OpLoad %9 %25
%28 = OpAccessChain %24 %16 %29
%30 = OpLoad %9 %28
%31 = OpAccessChain %24 %16 %32
%33 = OpLoad %9 %31
%34 = OpConvertFToU %5 %27
%35 = OpConvertFToU %5 %30
%36 = OpConvertFToU %5 %33
%39 = OpCompositeConstruct %38 %34 %35 %36
OpBeginInvocationInterlockEXT
%37 = OpImageRead %14 %23 %39 None
%40 = OpCompositeExtract %9 %37 0
%41 = OpCompositeExtract %9 %37 1
%42 = OpCompositeExtract %9 %37 2
%43 = OpCompositeExtract %9 %37 3
%44 = OpFAdd %9 %40 %45
%46 = OpFAdd %9 %41 %47
%48 = OpFAdd %9 %42 %49
%50 = OpFAdd %9 %43 %51
%52 = OpCompositeConstruct %38 %34 %35 %36
%53 = OpCompositeConstruct %14 %44 %46 %48 %50
OpImageWrite %23 %52 %53
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
