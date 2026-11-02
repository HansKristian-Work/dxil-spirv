#version 460
#extension GL_KHR_shader_subgroup_basic : require

layout(set = 0, binding = 1, r32ui) uniform uimageBuffer _8;
layout(set = 0, binding = 2, r32ui) uniform uimageBuffer _9;

layout(location = 0) flat in uvec2 I;
layout(location = 0) out float SV_Target;

void main()
{
    uint _27 = imageAtomicAdd(_8, int(0u), 1u);
    subgroupMemoryBarrierBuffer();
    subgroupMemoryBarrierImage();
    uint _31 = _27 << 1u;
    imageStore(_9, int(_31), uvec4(I.x));
    subgroupMemoryBarrierBuffer();
    subgroupMemoryBarrierImage();
    imageStore(_9, int(_31 | 1u), uvec4(I.y));
    uint _39 = imageAtomicExchange(_9, int(_31 + 4294967295u), 0u);
    subgroupMemoryBarrierBuffer();
    subgroupMemoryBarrierImage();
    float _50;
    if (_39 == 10u)
    {
        uint _45 = imageAtomicExchange(_9, int(18u), 0u);
        _50 = float(_45);
    }
    else
    {
        _50 = 0.0;
    }
    SV_Target = _50;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 56
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %9 %12 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "I"
OpName %15 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 1
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 2
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %15 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpVariable %7 UniformConstant
%10 = OpTypeVector %5 2
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypeFloat 32
%14 = OpTypePointer Output %13
%15 = OpVariable %14 Output
%18 = OpTypePointer Input %5
%20 = OpConstant %5 0
%23 = OpConstant %5 1
%25 = OpTypePointer Image %5
%28 = OpConstant %5 5
%29 = OpConstant %5 3
%30 = OpConstant %5 2120
%32 = OpTypeVector %5 4
%37 = OpConstant %5 4294967295
%40 = OpTypeBool
%42 = OpConstant %5 10
%43 = OpConstant %5 18
%48 = OpConstant %13 0
%49 = OpTypePointer Function %13
%3 = OpFunction %1 None %2
%4 = OpLabel
%50 = OpVariable %49 Function
OpBranch %51
%51 = OpLabel
%16 = OpLoad %6 %9
%17 = OpLoad %6 %8
%19 = OpAccessChain %18 %12 %20
%21 = OpLoad %5 %19
%22 = OpAccessChain %18 %12 %23
%24 = OpLoad %5 %22
%26 = OpImageTexelPointer %25 %8 %20 %20
%27 = OpAtomicIAdd %5 %26 %28 %20 %23
OpMemoryBarrier %29 %30
%31 = OpShiftLeftLogical %5 %27 %23
%33 = OpCompositeConstruct %32 %21 %21 %21 %21
OpImageWrite %16 %31 %33 MakeTexelAvailable|NonPrivateTexel %28
OpMemoryBarrier %29 %30
%34 = OpBitwiseOr %5 %31 %23
%35 = OpCompositeConstruct %32 %24 %24 %24 %24
OpImageWrite %16 %34 %35 MakeTexelAvailable|NonPrivateTexel %28
%36 = OpIAdd %5 %31 %37
%38 = OpImageTexelPointer %25 %9 %36 %20
%39 = OpAtomicExchange %5 %38 %28 %20 %20
OpMemoryBarrier %29 %30
%41 = OpIEqual %40 %39 %42
OpSelectionMerge %54 None
OpBranchConditional %41 %53 %52
%52 = OpLabel
OpStore %50 %48
OpBranch %54
%53 = OpLabel
%44 = OpImageTexelPointer %25 %9 %43 %20
%45 = OpAtomicExchange %5 %44 %28 %20 %20
%46 = OpConvertUToF %13 %45
OpStore %50 %46
OpBranch %54
%54 = OpLabel
OpBranch %55
%55 = OpLabel
%47 = OpLoad %13 %50
OpStore %15 %47
OpReturn
OpFunctionEnd
#endif
