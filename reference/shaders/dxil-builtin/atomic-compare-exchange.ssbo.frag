#version 460

layout(set = 0, binding = 6, std430) buffer SSBO
{
    uint _m0[];
} _34;

layout(set = 0, binding = 7, std430) buffer _36_38
{
    uint _m0[];
} _38;

layout(set = 0, binding = 0, r32ui) uniform uimage1D _8;
layout(set = 0, binding = 1, r32ui) uniform uimage1DArray _11;
layout(set = 0, binding = 2, r32ui) uniform uimage2D _14;
layout(set = 0, binding = 3, r32ui) uniform uimage2DArray _17;
layout(set = 0, binding = 4, r32ui) uniform uimage3D _20;
layout(set = 0, binding = 5, r32ui) uniform uimageBuffer _23;
layout(set = 1, binding = 0, r32i) uniform iimage1D _27;
layout(set = 1, binding = 2, r32i) uniform iimage2D _30;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out uint SV_Target;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    uint _64 = imageAtomicCompSwap(_8, int(TEXCOORD.x), 20u, 30u);
    uint _71 = imageAtomicCompSwap(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 20u, 30u);
    uint _75 = imageAtomicCompSwap(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 20u, 30u);
    uint _79 = imageAtomicCompSwap(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 20u, 30u);
    uint _83 = imageAtomicCompSwap(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 20u, 30u);
    uint _86 = imageAtomicCompSwap(_23, int(TEXCOORD.x), 20u, 30u);
    uint _89 = imageAtomicCompSwap(_23, int(TEXCOORD.x), 20u, 30u);
    int _93 = imageAtomicCompSwap(_27, int(TEXCOORD.x), int(20u), int(30u));
    int _100 = imageAtomicCompSwap(_30, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(20u), int(30u));
    uint _110 = atomicCompSwap(_34._m0[(TEXCOORD.x * 4u) + 2u], 20u, 30u);
    uint _123 = atomicCompSwap(_38._m0[ByteAddressMask(TEXCOORD.x, 4u)], 20u, 30u);
    SV_Target = (((((((((_71 + _64) + _75) + _79) + _83) + _86) + _89) + uint(_93)) + uint(_100)) + _110) + _123;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 126
; Schema: 0
OpCapability Shader
OpCapability Image1D
OpCapability ImageBuffer
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %17 %20 %23 %27 %30 %34 %38 %41 %43
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %32 "SSBO"
OpName %36 "SSBO"
OpName %41 "TEXCOORD"
OpName %43 "SV_Target"
OpName %116 "ByteAddressMask"
OpName %114 "index"
OpName %115 "stride"
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
OpDecorate %31 ArrayStride 4
OpMemberDecorate %32 0 Offset 0
OpDecorate %32 Block
OpDecorate %34 DescriptorSet 0
OpDecorate %34 Binding 6
OpDecorate %35 ArrayStride 4
OpMemberDecorate %36 0 Offset 0
OpDecorate %36 Block
OpDecorate %38 DescriptorSet 0
OpDecorate %38 Binding 7
OpDecorate %41 Flat
OpDecorate %41 Location 0
OpDecorate %43 Location 0
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
%31 = OpTypeRuntimeArray %5
%32 = OpTypeStruct %31
%33 = OpTypePointer StorageBuffer %32
%34 = OpVariable %33 StorageBuffer
%35 = OpTypeRuntimeArray %5
%36 = OpTypeStruct %35
%37 = OpTypePointer StorageBuffer %36
%38 = OpVariable %37 StorageBuffer
%39 = OpTypeVector %5 3
%40 = OpTypePointer Input %39
%41 = OpVariable %40 Input
%42 = OpTypePointer Output %5
%43 = OpVariable %42 Output
%52 = OpTypePointer Input %5
%54 = OpConstant %5 0
%57 = OpConstant %5 1
%60 = OpConstant %5 2
%62 = OpTypePointer Image %5
%65 = OpConstant %5 20
%66 = OpConstant %5 30
%67 = OpConstant %5 5
%68 = OpTypeVector %5 2
%91 = OpTypePointer Image %24
%106 = OpConstant %5 4
%108 = OpTypePointer StorageBuffer %5
%113 = OpTypeFunction %5 %5 %5
%119 = OpConstant %5 4294967295
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %125
%125 = OpLabel
%44 = OpLoad %28 %30
%45 = OpLoad %25 %27
%46 = OpLoad %21 %23
%47 = OpLoad %18 %20
%48 = OpLoad %15 %17
%49 = OpLoad %12 %14
%50 = OpLoad %9 %11
%51 = OpLoad %6 %8
%53 = OpAccessChain %52 %41 %54
%55 = OpLoad %5 %53
%56 = OpAccessChain %52 %41 %57
%58 = OpLoad %5 %56
%59 = OpAccessChain %52 %41 %60
%61 = OpLoad %5 %59
%63 = OpImageTexelPointer %62 %8 %55 %54
%64 = OpAtomicCompareExchange %5 %63 %67 %54 %54 %66 %65
%69 = OpCompositeConstruct %68 %55 %58
%70 = OpImageTexelPointer %62 %11 %69 %54
%71 = OpAtomicCompareExchange %5 %70 %67 %54 %54 %66 %65
%72 = OpIAdd %5 %71 %64
%73 = OpCompositeConstruct %68 %55 %58
%74 = OpImageTexelPointer %62 %14 %73 %54
%75 = OpAtomicCompareExchange %5 %74 %67 %54 %54 %66 %65
%76 = OpIAdd %5 %72 %75
%77 = OpCompositeConstruct %39 %55 %58 %61
%78 = OpImageTexelPointer %62 %17 %77 %54
%79 = OpAtomicCompareExchange %5 %78 %67 %54 %54 %66 %65
%80 = OpIAdd %5 %76 %79
%81 = OpCompositeConstruct %39 %55 %58 %61
%82 = OpImageTexelPointer %62 %20 %81 %54
%83 = OpAtomicCompareExchange %5 %82 %67 %54 %54 %66 %65
%84 = OpIAdd %5 %80 %83
%85 = OpImageTexelPointer %62 %23 %55 %54
%86 = OpAtomicCompareExchange %5 %85 %67 %54 %54 %66 %65
%87 = OpIAdd %5 %84 %86
%88 = OpImageTexelPointer %62 %23 %55 %54
%89 = OpAtomicCompareExchange %5 %88 %67 %54 %54 %66 %65
%90 = OpIAdd %5 %87 %89
%92 = OpImageTexelPointer %91 %27 %55 %54
%94 = OpBitcast %24 %65
%95 = OpBitcast %24 %66
%93 = OpAtomicCompareExchange %24 %92 %67 %54 %54 %95 %94
%96 = OpBitcast %5 %93
%97 = OpIAdd %5 %90 %96
%98 = OpCompositeConstruct %68 %55 %58
%99 = OpImageTexelPointer %91 %30 %98 %54
%101 = OpBitcast %24 %65
%102 = OpBitcast %24 %66
%100 = OpAtomicCompareExchange %24 %99 %67 %54 %54 %102 %101
%103 = OpBitcast %5 %100
%104 = OpIAdd %5 %97 %103
%105 = OpIMul %5 %55 %106
%107 = OpIAdd %5 %105 %60
%109 = OpAccessChain %108 %34 %54 %107
%110 = OpAtomicCompareExchange %5 %109 %67 %54 %54 %66 %65
%111 = OpIAdd %5 %104 %110
%112 = OpShiftLeftLogical %5 %55 %60
%121 = OpFunctionCall %5 %116 %55 %106
%122 = OpAccessChain %108 %38 %54 %121
%123 = OpAtomicCompareExchange %5 %122 %67 %54 %54 %66 %65
%124 = OpIAdd %5 %111 %123
OpStore %43 %124
OpReturn
OpFunctionEnd
%116 = OpFunction %5 None %113
%114 = OpFunctionParameter %5
%115 = OpFunctionParameter %5
%117 = OpLabel
%118 = OpUDiv %5 %119 %115
%120 = OpBitwiseAnd %5 %114 %118
OpReturnValue %120
OpFunctionEnd
#endif
