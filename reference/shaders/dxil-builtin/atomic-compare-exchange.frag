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

void main()
{
    uint _60 = imageAtomicCompSwap(_8, int(TEXCOORD.x), 20u, 30u);
    uint _66 = imageAtomicCompSwap(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 20u, 30u);
    uint _70 = imageAtomicCompSwap(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 20u, 30u);
    uint _74 = imageAtomicCompSwap(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 20u, 30u);
    uint _78 = imageAtomicCompSwap(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 20u, 30u);
    uint _81 = imageAtomicCompSwap(_23, int(TEXCOORD.x), 20u, 30u);
    uint _84 = imageAtomicCompSwap(_23, int(TEXCOORD.x), 20u, 30u);
    int _88 = imageAtomicCompSwap(_27, int(TEXCOORD.x), int(20u), int(30u));
    int _95 = imageAtomicCompSwap(_30, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(20u), int(30u));
    uint _105 = imageAtomicCompSwap(_31, int((TEXCOORD.x * 4u) + 2u), 20u, 30u);
    uint _109 = imageAtomicCompSwap(_32, int(TEXCOORD.x), 20u, 30u);
    SV_Target = (((((((((_66 + _60) + _70) + _74) + _78) + _81) + _84) + uint(_88)) + uint(_95)) + _105) + _109;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 112
; Schema: 0
OpCapability Shader
OpCapability Image1D
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %35 %37
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %35 "TEXCOORD"
OpName %37 "SV_Target"
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
%63 = OpTypeVector %5 2
%86 = OpTypePointer Image %24
%100 = OpConstant %5 8
%102 = OpConstant %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %111
%111 = OpLabel
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
%60 = OpAtomicCompareExchange %5 %59 %53 %50 %50 %62 %61
%64 = OpCompositeConstruct %63 %51 %54
%65 = OpImageTexelPointer %58 %11 %64 %50
%66 = OpAtomicCompareExchange %5 %65 %53 %50 %50 %62 %61
%67 = OpIAdd %5 %66 %60
%68 = OpCompositeConstruct %63 %51 %54
%69 = OpImageTexelPointer %58 %14 %68 %50
%70 = OpAtomicCompareExchange %5 %69 %53 %50 %50 %62 %61
%71 = OpIAdd %5 %67 %70
%72 = OpCompositeConstruct %33 %51 %54 %57
%73 = OpImageTexelPointer %58 %17 %72 %50
%74 = OpAtomicCompareExchange %5 %73 %53 %50 %50 %62 %61
%75 = OpIAdd %5 %71 %74
%76 = OpCompositeConstruct %33 %51 %54 %57
%77 = OpImageTexelPointer %58 %20 %76 %50
%78 = OpAtomicCompareExchange %5 %77 %53 %50 %50 %62 %61
%79 = OpIAdd %5 %75 %78
%80 = OpImageTexelPointer %58 %23 %51 %50
%81 = OpAtomicCompareExchange %5 %80 %53 %50 %50 %62 %61
%82 = OpIAdd %5 %79 %81
%83 = OpImageTexelPointer %58 %23 %51 %50
%84 = OpAtomicCompareExchange %5 %83 %53 %50 %50 %62 %61
%85 = OpIAdd %5 %82 %84
%87 = OpImageTexelPointer %86 %27 %51 %50
%89 = OpBitcast %24 %61
%90 = OpBitcast %24 %62
%88 = OpAtomicCompareExchange %24 %87 %53 %50 %50 %90 %89
%91 = OpBitcast %5 %88
%92 = OpIAdd %5 %85 %91
%93 = OpCompositeConstruct %63 %51 %54
%94 = OpImageTexelPointer %86 %30 %93 %50
%96 = OpBitcast %24 %61
%97 = OpBitcast %24 %62
%95 = OpAtomicCompareExchange %24 %94 %53 %50 %50 %97 %96
%98 = OpBitcast %5 %95
%99 = OpIAdd %5 %92 %98
%101 = OpIMul %5 %51 %102
%103 = OpIAdd %5 %101 %56
%104 = OpImageTexelPointer %58 %31 %103 %50
%105 = OpAtomicCompareExchange %5 %104 %53 %50 %50 %62 %61
%106 = OpIAdd %5 %99 %105
%107 = OpShiftLeftLogical %5 %51 %56
%108 = OpImageTexelPointer %58 %32 %51 %50
%109 = OpAtomicCompareExchange %5 %108 %53 %50 %50 %62 %61
%110 = OpIAdd %5 %106 %109
OpStore %37 %110
OpReturn
OpFunctionEnd
#endif
