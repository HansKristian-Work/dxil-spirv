#version 460
#extension GL_EXT_buffer_reference2 : require
#ifdef GL_ARB_fragment_shader_interlock
#extension GL_ARB_fragment_shader_interlock : enable
#define SPIRV_Cross_beginInvocationInterlock() beginInvocationInterlockARB()
#define SPIRV_Cross_endInvocationInterlock() endInvocationInterlockARB()
#elif defined(GL_INTEL_fragment_shader_ordering)
#extension GL_INTEL_fragment_shader_ordering : enable
#define SPIRV_Cross_beginInvocationInterlock() beginFragmentShaderOrderingINTEL()
#define SPIRV_Cross_endInvocationInterlock()
#endif
#extension GL_EXT_buffer_reference_uvec2 : require
#if defined(GL_ARB_fragment_shader_interlock)
layout(pixel_interlock_ordered) in;
#elif !defined(GL_INTEL_fragment_shader_ordering)
#error Fragment Shader Interlock/Ordering extension missing!
#endif
layout(early_fragment_tests) in;

layout(buffer_reference) buffer PhysicalPointerUint4CoherentArray;

layout(buffer_reference, buffer_reference_align = 4, std430) buffer PhysicalPointerUint4CoherentArray
{
    uvec4 value[];
};

layout(push_constant, std430) uniform RootConstants
{
    uvec2 _m0;
    uvec2 _m1;
    uvec2 _m2;
    uvec2 _m3;
} registers;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    uint _29 = (uint(gl_FragCoord.y) * 1000u) + uint(gl_FragCoord.x);
    SPIRV_Cross_beginInvocationInterlock();
    uvec4 _49 = PhysicalPointerUint4CoherentArray(registers._m2).value[ByteAddressMask(_29, 16u)];
    PhysicalPointerUint4CoherentArray(registers._m2).value[ByteAddressMask(_29, 16u)] = uvec4(_49.x + 1u, _49.y + 2u, _49.z + 3u, _49.w + 4u);
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 65
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpCapability PhysicalStorageBufferAddresses
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_fragment_shader_interlock"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 Vulkan
OpEntryPoint Fragment %3 "main" %9 %13
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %7 "RootConstants"
OpName %9 "registers"
OpName %13 "SV_Position"
OpName %35 "ByteAddressMask"
OpName %33 "index"
OpName %34 "stride"
OpName %44 "PhysicalPointerUint4CoherentArray"
OpMemberName %44 0 "value"
OpDecorate %7 Block
OpMemberDecorate %7 0 Offset 0
OpMemberDecorate %7 1 Offset 8
OpMemberDecorate %7 2 Offset 16
OpMemberDecorate %7 3 Offset 24
OpDecorate %13 BuiltIn FragCoord
OpDecorate %43 ArrayStride 16
OpMemberDecorate %44 0 Offset 0
OpDecorate %44 Block
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypeStruct %6 %6 %6 %6
%8 = OpTypePointer PushConstant %7
%9 = OpVariable %8 PushConstant
%10 = OpTypeFloat 32
%11 = OpTypeVector %10 4
%12 = OpTypePointer Input %11
%13 = OpVariable %12 Input
%14 = OpTypePointer PushConstant %6
%16 = OpConstant %5 2
%18 = OpTypePointer Input %10
%20 = OpConstant %5 0
%23 = OpConstant %5 1
%28 = OpConstant %5 1000
%31 = OpConstant %5 4
%32 = OpTypeFunction %5 %5 %5
%38 = OpConstant %5 4294967295
%41 = OpConstant %5 16
%42 = OpTypeVector %5 4
%43 = OpTypeRuntimeArray %42
%44 = OpTypeStruct %43
%45 = OpTypePointer PhysicalStorageBuffer %44
%47 = OpTypePointer PhysicalStorageBuffer %42
%50 = OpConstant %5 5
%58 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %64
%64 = OpLabel
%15 = OpAccessChain %14 %9 %16
%17 = OpLoad %6 %15
%19 = OpAccessChain %18 %13 %20
%21 = OpLoad %10 %19
%22 = OpAccessChain %18 %13 %23
%24 = OpLoad %10 %22
%25 = OpConvertFToU %5 %21
%26 = OpConvertFToU %5 %24
%27 = OpIMul %5 %26 %28
%29 = OpIAdd %5 %27 %25
%30 = OpShiftLeftLogical %5 %29 %31
%40 = OpFunctionCall %5 %35 %29 %41
%46 = OpBitcast %45 %17
%48 = OpInBoundsAccessChain %47 %46 %20 %40
OpBeginInvocationInterlockEXT
%49 = OpLoad %42 %48 Aligned|MakePointerVisible|NonPrivatePointer 4 %50
%51 = OpCompositeExtract %5 %49 0
%52 = OpCompositeExtract %5 %49 1
%53 = OpCompositeExtract %5 %49 2
%54 = OpCompositeExtract %5 %49 3
%55 = OpIAdd %5 %51 %23
%56 = OpIAdd %5 %52 %16
%57 = OpIAdd %5 %53 %58
%59 = OpIAdd %5 %54 %31
%60 = OpFunctionCall %5 %35 %29 %41
%61 = OpBitcast %45 %17
%62 = OpInBoundsAccessChain %47 %61 %20 %60
%63 = OpCompositeConstruct %42 %55 %56 %57 %59
OpStore %62 %63 Aligned|MakePointerAvailable|NonPrivatePointer 4 %50
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
%35 = OpFunction %5 None %32
%33 = OpFunctionParameter %5
%34 = OpFunctionParameter %5
%36 = OpLabel
%37 = OpUDiv %5 %38 %34
%39 = OpBitwiseAnd %5 %33 %37
OpReturnValue %39
OpFunctionEnd
#endif
