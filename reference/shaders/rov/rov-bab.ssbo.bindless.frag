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

layout(set = 4, binding = 0, std430) coherent buffer SSBO
{
    uvec4 _m0[];
} _14[];

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

void main()
{
    uint _36 = (uint(gl_FragCoord.y) * 1000u) + uint(gl_FragCoord.x);
    SPIRV_Cross_beginInvocationInterlock();
    _14[registers._m4]._m0[_36] = uvec4(_14[registers._m4]._m0[_36].x + 1u, _14[registers._m4]._m0[_36].y + 2u, _14[registers._m4]._m0[_36].z + 3u, _14[registers._m4]._m0[_36].w + 4u);
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 55
; Schema: 0
OpCapability Shader
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_EXT_fragment_shader_interlock"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %18
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %11 "SSBO"
OpName %18 "SV_Position"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %10 ArrayStride 16
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %14 DescriptorSet 4
OpDecorate %14 Binding 0
OpDecorate %14 Coherent
OpDecorate %18 BuiltIn FragCoord
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeVector %5 4
%10 = OpTypeRuntimeArray %9
%11 = OpTypeStruct %10
%12 = OpTypeRuntimeArray %11
%13 = OpTypePointer StorageBuffer %12
%14 = OpVariable %13 StorageBuffer
%15 = OpTypeFloat 32
%16 = OpTypeVector %15 4
%17 = OpTypePointer Input %16
%18 = OpVariable %17 Input
%19 = OpTypePointer StorageBuffer %11
%21 = OpTypePointer PushConstant %5
%23 = OpConstant %5 4
%25 = OpTypePointer Input %15
%27 = OpConstant %5 0
%30 = OpConstant %5 1
%35 = OpConstant %5 1000
%38 = OpTypePointer StorageBuffer %9
%47 = OpConstant %5 2
%49 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %53
%53 = OpLabel
%22 = OpAccessChain %21 %8 %23
%24 = OpLoad %5 %22
%20 = OpAccessChain %19 %14 %24
%26 = OpAccessChain %25 %18 %27
%28 = OpLoad %15 %26
%29 = OpAccessChain %25 %18 %30
%31 = OpLoad %15 %29
%32 = OpConvertFToU %5 %28
%33 = OpConvertFToU %5 %31
%34 = OpIMul %5 %33 %35
%36 = OpIAdd %5 %34 %32
%37 = OpShiftLeftLogical %5 %36 %23
%39 = OpAccessChain %38 %20 %27 %36
OpBeginInvocationInterlockEXT
%40 = OpLoad %9 %39
%41 = OpCompositeExtract %5 %40 0
%42 = OpCompositeExtract %5 %40 1
%43 = OpCompositeExtract %5 %40 2
%44 = OpCompositeExtract %5 %40 3
%45 = OpIAdd %5 %41 %30
%46 = OpIAdd %5 %42 %47
%48 = OpIAdd %5 %43 %49
%50 = OpIAdd %5 %44 %23
%51 = OpCompositeConstruct %9 %45 %46 %48 %50
%52 = OpAccessChain %38 %20 %27 %36
OpStore %52 %51
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
