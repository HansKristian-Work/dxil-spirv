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

void main()
{
    uint _64 = imageAtomicCompSwap(_8, int(TEXCOORD.x), 20u, 30u);
    uint _70 = imageAtomicCompSwap(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 20u, 30u);
    uint _74 = imageAtomicCompSwap(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 20u, 30u);
    uint _78 = imageAtomicCompSwap(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 20u, 30u);
    uint _82 = imageAtomicCompSwap(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 20u, 30u);
    uint _85 = imageAtomicCompSwap(_23, int(TEXCOORD.x), 20u, 30u);
    uint _88 = imageAtomicCompSwap(_23, int(TEXCOORD.x), 20u, 30u);
    int _92 = imageAtomicCompSwap(_27, int(TEXCOORD.x), int(20u), int(30u));
    int _99 = imageAtomicCompSwap(_30, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(20u), int(30u));
    uint _110 = atomicCompSwap(_34._m0[(TEXCOORD.x * 4u) + 2u], 20u, 30u);
    uint _115 = atomicCompSwap(_38._m0[(TEXCOORD.x << 2u) >> 2u], 20u, 30u);
    SV_Target = (((((((((_70 + _64) + _74) + _78) + _82) + _85) + _88) + uint(_92)) + uint(_99)) + _110) + _115;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 119
; Schema: 0
OpCapability Shader
OpCapability Image1D
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %41 %43
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %32 "SSBO"
OpName %36 "SSBO"
OpName %41 "TEXCOORD"
OpName %43 "SV_Target"
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
%67 = OpTypeVector %5 2
%90 = OpTypePointer Image %24
%104 = OpConstant %5 8
%106 = OpConstant %5 4
%108 = OpTypePointer StorageBuffer %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %117
%117 = OpLabel
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
%64 = OpAtomicCompareExchange %5 %63 %57 %54 %54 %66 %65
%68 = OpCompositeConstruct %67 %55 %58
%69 = OpImageTexelPointer %62 %11 %68 %54
%70 = OpAtomicCompareExchange %5 %69 %57 %54 %54 %66 %65
%71 = OpIAdd %5 %70 %64
%72 = OpCompositeConstruct %67 %55 %58
%73 = OpImageTexelPointer %62 %14 %72 %54
%74 = OpAtomicCompareExchange %5 %73 %57 %54 %54 %66 %65
%75 = OpIAdd %5 %71 %74
%76 = OpCompositeConstruct %39 %55 %58 %61
%77 = OpImageTexelPointer %62 %17 %76 %54
%78 = OpAtomicCompareExchange %5 %77 %57 %54 %54 %66 %65
%79 = OpIAdd %5 %75 %78
%80 = OpCompositeConstruct %39 %55 %58 %61
%81 = OpImageTexelPointer %62 %20 %80 %54
%82 = OpAtomicCompareExchange %5 %81 %57 %54 %54 %66 %65
%83 = OpIAdd %5 %79 %82
%84 = OpImageTexelPointer %62 %23 %55 %54
%85 = OpAtomicCompareExchange %5 %84 %57 %54 %54 %66 %65
%86 = OpIAdd %5 %83 %85
%87 = OpImageTexelPointer %62 %23 %55 %54
%88 = OpAtomicCompareExchange %5 %87 %57 %54 %54 %66 %65
%89 = OpIAdd %5 %86 %88
%91 = OpImageTexelPointer %90 %27 %55 %54
%93 = OpBitcast %24 %65
%94 = OpBitcast %24 %66
%92 = OpAtomicCompareExchange %24 %91 %57 %54 %54 %94 %93
%95 = OpBitcast %5 %92
%96 = OpIAdd %5 %89 %95
%97 = OpCompositeConstruct %67 %55 %58
%98 = OpImageTexelPointer %90 %30 %97 %54
%100 = OpBitcast %24 %65
%101 = OpBitcast %24 %66
%99 = OpAtomicCompareExchange %24 %98 %57 %54 %54 %101 %100
%102 = OpBitcast %5 %99
%103 = OpIAdd %5 %96 %102
%105 = OpIMul %5 %55 %106
%107 = OpIAdd %5 %105 %60
%109 = OpAccessChain %108 %34 %54 %107
%110 = OpAtomicCompareExchange %5 %109 %57 %54 %54 %66 %65
%111 = OpIAdd %5 %103 %110
%112 = OpShiftLeftLogical %5 %55 %60
%113 = OpShiftRightLogical %5 %112 %60
%114 = OpAccessChain %108 %38 %54 %113
%115 = OpAtomicCompareExchange %5 %114 %57 %54 %54 %66 %65
%116 = OpIAdd %5 %111 %115
OpStore %43 %116
OpReturn
OpFunctionEnd
#endif
