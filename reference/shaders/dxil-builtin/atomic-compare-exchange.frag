#version 460

layout(set = 0, binding = 0) uniform uimage1D _8;
layout(set = 0, binding = 1) uniform uimage1DArray _11;
layout(set = 0, binding = 2) uniform uimage2D _14;
layout(set = 0, binding = 3) uniform uimage2DArray _17;
layout(set = 0, binding = 4) uniform uimage3D _20;
layout(set = 0, binding = 5) uniform uimageBuffer _23;
layout(set = 1, binding = 0) uniform iimage1D _27;
layout(set = 1, binding = 2) uniform iimage2D _30;
layout(set = 0, binding = 6, r32ui) uniform uimageBuffer _33;
layout(set = 0, binding = 7, r32ui) uniform uimageBuffer _34;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out uint SV_Target;

void main()
{
    uint _62 = imageAtomicCompSwap(_8, int(TEXCOORD.x), 20u, 30u);
    uint _68 = imageAtomicCompSwap(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 20u, 30u);
    uint _72 = imageAtomicCompSwap(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 20u, 30u);
    uint _76 = imageAtomicCompSwap(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 20u, 30u);
    uint _80 = imageAtomicCompSwap(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 20u, 30u);
    uint _83 = imageAtomicCompSwap(_23, int(TEXCOORD.x), 20u, 30u);
    uint _86 = imageAtomicCompSwap(_23, int(TEXCOORD.x), 20u, 30u);
    int _90 = imageAtomicCompSwap(_27, int(TEXCOORD.x), int(20u), int(30u));
    int _97 = imageAtomicCompSwap(_30, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(20u), int(30u));
    uint _107 = imageAtomicCompSwap(_33, int((TEXCOORD.x * 4u) + 2u), 20u, 30u);
    uint _112 = imageAtomicCompSwap(_34, int((TEXCOORD.x << 2u) >> 2u), 20u, 30u);
    SV_Target = (((((((((_68 + _62) + _72) + _76) + _80) + _83) + _86) + uint(_90)) + uint(_97)) + _107) + _112;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 116
; Schema: 0
OpCapability Shader
OpCapability Image1D
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %37 %39
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %37 "TEXCOORD"
OpName %39 "SV_Target"
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
OpDecorate %33 DescriptorSet 0
OpDecorate %33 Binding 6
OpDecorate %34 DescriptorSet 0
OpDecorate %34 Binding 7
OpDecorate %37 Flat
OpDecorate %37 Location 0
OpDecorate %39 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 1D 0 0 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 1D 0 1 0 2 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeImage %5 2D 0 0 0 2 Unknown
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeImage %5 2D 0 1 0 2 Unknown
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeImage %5 3D 0 0 0 2 Unknown
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeImage %5 Buffer 0 0 0 2 Unknown
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeInt 32 1
%25 = OpTypeImage %24 1D 0 0 0 2 Unknown
%26 = OpTypePointer UniformConstant %25
%27 = OpVariable %26 UniformConstant
%28 = OpTypeImage %24 2D 0 0 0 2 Unknown
%29 = OpTypePointer UniformConstant %28
%30 = OpVariable %29 UniformConstant
%31 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%32 = OpTypePointer UniformConstant %31
%33 = OpVariable %32 UniformConstant
%34 = OpVariable %32 UniformConstant
%35 = OpTypeVector %5 3
%36 = OpTypePointer Input %35
%37 = OpVariable %36 Input
%38 = OpTypePointer Output %5
%39 = OpVariable %38 Output
%50 = OpTypePointer Input %5
%52 = OpConstant %5 0
%55 = OpConstant %5 1
%58 = OpConstant %5 2
%60 = OpTypePointer Image %5
%63 = OpConstant %5 20
%64 = OpConstant %5 30
%65 = OpTypeVector %5 2
%88 = OpTypePointer Image %24
%102 = OpConstant %5 8
%104 = OpConstant %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %114
%114 = OpLabel
%40 = OpLoad %31 %34
%41 = OpLoad %31 %33
%42 = OpLoad %28 %30
%43 = OpLoad %25 %27
%44 = OpLoad %21 %23
%45 = OpLoad %18 %20
%46 = OpLoad %15 %17
%47 = OpLoad %12 %14
%48 = OpLoad %9 %11
%49 = OpLoad %6 %8
%51 = OpAccessChain %50 %37 %52
%53 = OpLoad %5 %51
%54 = OpAccessChain %50 %37 %55
%56 = OpLoad %5 %54
%57 = OpAccessChain %50 %37 %58
%59 = OpLoad %5 %57
%61 = OpImageTexelPointer %60 %8 %53 %52
%62 = OpAtomicCompareExchange %5 %61 %55 %52 %52 %64 %63
%66 = OpCompositeConstruct %65 %53 %56
%67 = OpImageTexelPointer %60 %11 %66 %52
%68 = OpAtomicCompareExchange %5 %67 %55 %52 %52 %64 %63
%69 = OpIAdd %5 %68 %62
%70 = OpCompositeConstruct %65 %53 %56
%71 = OpImageTexelPointer %60 %14 %70 %52
%72 = OpAtomicCompareExchange %5 %71 %55 %52 %52 %64 %63
%73 = OpIAdd %5 %69 %72
%74 = OpCompositeConstruct %35 %53 %56 %59
%75 = OpImageTexelPointer %60 %17 %74 %52
%76 = OpAtomicCompareExchange %5 %75 %55 %52 %52 %64 %63
%77 = OpIAdd %5 %73 %76
%78 = OpCompositeConstruct %35 %53 %56 %59
%79 = OpImageTexelPointer %60 %20 %78 %52
%80 = OpAtomicCompareExchange %5 %79 %55 %52 %52 %64 %63
%81 = OpIAdd %5 %77 %80
%82 = OpImageTexelPointer %60 %23 %53 %52
%83 = OpAtomicCompareExchange %5 %82 %55 %52 %52 %64 %63
%84 = OpIAdd %5 %81 %83
%85 = OpImageTexelPointer %60 %23 %53 %52
%86 = OpAtomicCompareExchange %5 %85 %55 %52 %52 %64 %63
%87 = OpIAdd %5 %84 %86
%89 = OpImageTexelPointer %88 %27 %53 %52
%91 = OpBitcast %24 %63
%92 = OpBitcast %24 %64
%90 = OpAtomicCompareExchange %24 %89 %55 %52 %52 %92 %91
%93 = OpBitcast %5 %90
%94 = OpIAdd %5 %87 %93
%95 = OpCompositeConstruct %65 %53 %56
%96 = OpImageTexelPointer %88 %30 %95 %52
%98 = OpBitcast %24 %63
%99 = OpBitcast %24 %64
%97 = OpAtomicCompareExchange %24 %96 %55 %52 %52 %99 %98
%100 = OpBitcast %5 %97
%101 = OpIAdd %5 %94 %100
%103 = OpIMul %5 %53 %104
%105 = OpIAdd %5 %103 %58
%106 = OpImageTexelPointer %60 %33 %105 %52
%107 = OpAtomicCompareExchange %5 %106 %55 %52 %52 %64 %63
%108 = OpIAdd %5 %101 %107
%109 = OpShiftLeftLogical %5 %53 %58
%110 = OpShiftRightLogical %5 %109 %58
%111 = OpImageTexelPointer %60 %34 %110 %52
%112 = OpAtomicCompareExchange %5 %111 %55 %52 %52 %64 %63
%113 = OpIAdd %5 %108 %112
OpStore %39 %113
OpReturn
OpFunctionEnd
#endif
