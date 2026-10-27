#version 460

layout(set = 0, binding = 0, r32ui) uniform uimage1D _8;
layout(set = 0, binding = 1, r32ui) uniform uimage1DArray _11;
layout(set = 0, binding = 2, r32ui) uniform uimage2D _14;
layout(set = 0, binding = 3, r32ui) uniform uimage2DArray _17;
layout(set = 0, binding = 4, r32ui) uniform uimage3D _20;
layout(set = 0, binding = 5, r32ui) uniform uimageBuffer _23;
layout(set = 1, binding = 0, r32i) uniform iimage1D _27;
layout(set = 1, binding = 2, r32i) uniform iimage2D _30;
layout(set = 0, binding = 6, r32ui) uniform uimageBuffer _31;
layout(set = 0, binding = 7, r32ui) uniform uimageBuffer _32;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out uint SV_Target;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    uint _60 = imageAtomicCompSwap(_8, int(TEXCOORD.x), 20u, 30u);
    uint _67 = imageAtomicCompSwap(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 20u, 30u);
    uint _71 = imageAtomicCompSwap(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 20u, 30u);
    uint _75 = imageAtomicCompSwap(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 20u, 30u);
    uint _79 = imageAtomicCompSwap(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 20u, 30u);
    uint _82 = imageAtomicCompSwap(_23, int(TEXCOORD.x), 20u, 30u);
    uint _85 = imageAtomicCompSwap(_23, int(TEXCOORD.x), 20u, 30u);
    int _89 = imageAtomicCompSwap(_27, int(TEXCOORD.x), int(20u), int(30u));
    int _96 = imageAtomicCompSwap(_30, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(20u), int(30u));
    uint _105 = imageAtomicCompSwap(_31, int((TEXCOORD.x * 4u) + 2u), 20u, 30u);
    uint _118 = imageAtomicCompSwap(_32, int(ByteAddressMask(TEXCOORD.x, 4u)), 20u, 30u);
    SV_Target = (((((((((_67 + _60) + _71) + _75) + _79) + _82) + _85) + uint(_89)) + uint(_96)) + _105) + _118;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 121
; Schema: 0
OpCapability Shader
OpCapability Image1D
OpCapability ImageBuffer
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %17 %20 %23 %27 %30 %31 %32 %35 %37
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %35 "TEXCOORD"
OpName %37 "SV_Target"
OpName %111 "ByteAddressMask"
OpName %109 "index"
OpName %110 "stride"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 1
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 2
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 3
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 4
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 5
OpDecorate %27 DescriptorSet 1
OpDecorate %27 Binding 0
OpDecorate %30 DescriptorSet 1
OpDecorate %30 Binding 2
OpDecorate %31 DescriptorSet 0
OpDecorate %31 Binding 6
OpDecorate %32 DescriptorSet 0
OpDecorate %32 Binding 7
OpDecorate %35 Flat
OpDecorate %35 Location 0
OpDecorate %37 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 1D 0 0 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 1D 0 1 0 2 R32ui
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeImage %5 2D 0 0 0 2 R32ui
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeImage %5 2D 0 1 0 2 R32ui
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeImage %5 3D 0 0 0 2 R32ui
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeInt 32 1
%25 = OpTypeImage %24 1D 0 0 0 2 R32i
%26 = OpTypePointer UniformConstant %25
%27 = OpVariable %26 UniformConstant
%28 = OpTypeImage %24 2D 0 0 0 2 R32i
%29 = OpTypePointer UniformConstant %28
%30 = OpVariable %29 UniformConstant
%31 = OpVariable %22 UniformConstant
%32 = OpVariable %22 UniformConstant
%33 = OpTypeVector %5 3
%34 = OpTypePointer Input %33
%35 = OpVariable %34 Input
%36 = OpTypePointer Output %5
%37 = OpVariable %36 Output
%48 = OpTypePointer Input %5
%50 = OpConstant %5 0
%53 = OpConstant %5 1
%56 = OpConstant %5 2
%58 = OpTypePointer Image %5
%61 = OpConstant %5 20
%62 = OpConstant %5 30
%63 = OpConstant %5 5
%64 = OpTypeVector %5 2
%87 = OpTypePointer Image %24
%102 = OpConstant %5 4
%108 = OpTypeFunction %5 %5 %5
%114 = OpConstant %5 4294967295
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %120
%120 = OpLabel
%38 = OpLoad %21 %32
%39 = OpLoad %21 %31
%40 = OpLoad %28 %30
%41 = OpLoad %25 %27
%42 = OpLoad %21 %23
%43 = OpLoad %18 %20
%44 = OpLoad %15 %17
%45 = OpLoad %12 %14
%46 = OpLoad %9 %11
%47 = OpLoad %6 %8
%49 = OpAccessChain %48 %35 %50
%51 = OpLoad %5 %49
%52 = OpAccessChain %48 %35 %53
%54 = OpLoad %5 %52
%55 = OpAccessChain %48 %35 %56
%57 = OpLoad %5 %55
%59 = OpImageTexelPointer %58 %8 %51 %50
%60 = OpAtomicCompareExchange %5 %59 %63 %50 %50 %62 %61
%65 = OpCompositeConstruct %64 %51 %54
%66 = OpImageTexelPointer %58 %11 %65 %50
%67 = OpAtomicCompareExchange %5 %66 %63 %50 %50 %62 %61
%68 = OpIAdd %5 %67 %60
%69 = OpCompositeConstruct %64 %51 %54
%70 = OpImageTexelPointer %58 %14 %69 %50
%71 = OpAtomicCompareExchange %5 %70 %63 %50 %50 %62 %61
%72 = OpIAdd %5 %68 %71
%73 = OpCompositeConstruct %33 %51 %54 %57
%74 = OpImageTexelPointer %58 %17 %73 %50
%75 = OpAtomicCompareExchange %5 %74 %63 %50 %50 %62 %61
%76 = OpIAdd %5 %72 %75
%77 = OpCompositeConstruct %33 %51 %54 %57
%78 = OpImageTexelPointer %58 %20 %77 %50
%79 = OpAtomicCompareExchange %5 %78 %63 %50 %50 %62 %61
%80 = OpIAdd %5 %76 %79
%81 = OpImageTexelPointer %58 %23 %51 %50
%82 = OpAtomicCompareExchange %5 %81 %63 %50 %50 %62 %61
%83 = OpIAdd %5 %80 %82
%84 = OpImageTexelPointer %58 %23 %51 %50
%85 = OpAtomicCompareExchange %5 %84 %63 %50 %50 %62 %61
%86 = OpIAdd %5 %83 %85
%88 = OpImageTexelPointer %87 %27 %51 %50
%90 = OpBitcast %24 %61
%91 = OpBitcast %24 %62
%89 = OpAtomicCompareExchange %24 %88 %63 %50 %50 %91 %90
%92 = OpBitcast %5 %89
%93 = OpIAdd %5 %86 %92
%94 = OpCompositeConstruct %64 %51 %54
%95 = OpImageTexelPointer %87 %30 %94 %50
%97 = OpBitcast %24 %61
%98 = OpBitcast %24 %62
%96 = OpAtomicCompareExchange %24 %95 %63 %50 %50 %98 %97
%99 = OpBitcast %5 %96
%100 = OpIAdd %5 %93 %99
%101 = OpIMul %5 %51 %102
%103 = OpIAdd %5 %101 %56
%104 = OpImageTexelPointer %58 %31 %103 %50
%105 = OpAtomicCompareExchange %5 %104 %63 %50 %50 %62 %61
%106 = OpIAdd %5 %100 %105
%107 = OpShiftLeftLogical %5 %51 %56
%116 = OpFunctionCall %5 %111 %51 %102
%117 = OpImageTexelPointer %58 %32 %116 %50
%118 = OpAtomicCompareExchange %5 %117 %63 %50 %50 %62 %61
%119 = OpIAdd %5 %106 %118
OpStore %37 %119
OpReturn
OpFunctionEnd
%111 = OpFunction %5 None %108
%109 = OpFunctionParameter %5
%110 = OpFunctionParameter %5
%112 = OpLabel
%113 = OpUDiv %5 %114 %110
%115 = OpBitwiseAnd %5 %109 %113
OpReturnValue %115
OpFunctionEnd
#endif
