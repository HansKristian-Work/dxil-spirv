#version 460

layout(set = 0, binding = 1, r32ui) uniform uimageBuffer _8;
layout(set = 0, binding = 2, r32ui) uniform uimageBuffer _9;

layout(location = 0) flat in uvec2 I;
layout(location = 0) out float SV_Target;

void main()
{
    uint _27 = imageAtomicAdd(_8, int(0u), 1u);
    memoryBarrierBuffer();
    memoryBarrierImage();
    uint _30 = _27 << 1u;
    imageStore(_9, int(_30), uvec4(I.x));
    memoryBarrierBuffer();
    memoryBarrierImage();
    imageStore(_9, int(_30 | 1u), uvec4(I.y));
    uint _38 = imageAtomicExchange(_9, int(_30 + 4294967295u), 0u);
    memoryBarrierBuffer();
    memoryBarrierImage();
    float _46;
    if (_38 == 10u)
    {
        uint _44 = imageAtomicExchange(_9, int(18u), 0u);
        _46 = float(_44);
    }
    else
    {
        _46 = 0.0;
    }
    SV_Target = _46;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 55
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
%29 = OpConstant %5 2120
%31 = OpTypeVector %5 4
%36 = OpConstant %5 4294967295
%39 = OpTypeBool
%41 = OpConstant %5 10
%42 = OpConstant %5 18
%47 = OpConstant %13 0
%48 = OpTypePointer Function %13
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %50
%50 = OpLabel
%16 = OpLoad %6 %9
%17 = OpLoad %6 %8
%19 = OpAccessChain %18 %12 %20
%21 = OpLoad %5 %19
%22 = OpAccessChain %18 %12 %23
%24 = OpLoad %5 %22
%26 = OpImageTexelPointer %25 %8 %20 %20
%27 = OpAtomicIAdd %5 %26 %28 %20 %23
OpMemoryBarrier %28 %29
%30 = OpShiftLeftLogical %5 %27 %23
%32 = OpCompositeConstruct %31 %21 %21 %21 %21
OpImageWrite %16 %30 %32 MakeTexelAvailable|NonPrivateTexel %28
OpMemoryBarrier %28 %29
%33 = OpBitwiseOr %5 %30 %23
%34 = OpCompositeConstruct %31 %24 %24 %24 %24
OpImageWrite %16 %33 %34 MakeTexelAvailable|NonPrivateTexel %28
%35 = OpIAdd %5 %30 %36
%37 = OpImageTexelPointer %25 %9 %35 %20
%38 = OpAtomicExchange %5 %37 %28 %20 %20
OpMemoryBarrier %28 %29
%40 = OpIEqual %39 %38 %41
OpSelectionMerge %53 None
OpBranchConditional %40 %52 %51
%51 = OpLabel
OpBranch %53
%52 = OpLabel
%43 = OpImageTexelPointer %25 %9 %42 %20
%44 = OpAtomicExchange %5 %43 %28 %20 %20
%45 = OpConvertUToF %13 %44
OpBranch %53
%53 = OpLabel
%46 = OpPhi %13 %45 %52 %47 %51
OpBranch %54
%54 = OpLabel
OpStore %15 %46
OpReturn
OpFunctionEnd
#endif
