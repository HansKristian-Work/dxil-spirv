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
    uint _60 = imageAtomicAdd(_8, int(TEXCOORD.x), 1u);
    uint _64 = imageAtomicAnd(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 2u);
    uint _68 = imageAtomicExchange(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 3u);
    uint _73 = imageAtomicMax(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 4u);
    uint _78 = imageAtomicMin(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 5u);
    uint _82 = imageAtomicOr(_23, int(TEXCOORD.x), 6u);
    uint _86 = imageAtomicXor(_23, int(TEXCOORD.x), 7u);
    int _91 = imageAtomicMin(_27, int(TEXCOORD.x), int(8u));
    int _98 = imageAtomicMax(_30, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(9u));
    uint _106 = imageAtomicAdd(_31, int((TEXCOORD.x * 4u) + 2u), 10u);
    uint _111 = imageAtomicMax(_32, int(TEXCOORD.x), 12u);
    SV_Target = (((((((((_64 + _60) + _68) + _73) + _78) + _82) + _86) + uint(_91)) + uint(_98)) + _106) + _111;
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
%61 = OpTypeVector %5 2
%69 = OpConstant %5 3
%74 = OpConstant %5 4
%79 = OpConstant %5 5
%83 = OpConstant %5 6
%87 = OpConstant %5 7
%89 = OpTypePointer Image %24
%92 = OpConstant %5 8
%99 = OpConstant %5 9
%107 = OpConstant %5 10
%112 = OpConstant %5 12
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %114
%114 = OpLabel
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
%60 = OpAtomicIAdd %5 %59 %53 %50 %53
%62 = OpCompositeConstruct %61 %51 %54
%63 = OpImageTexelPointer %58 %11 %62 %50
%64 = OpAtomicAnd %5 %63 %53 %50 %56
%65 = OpIAdd %5 %64 %60
%66 = OpCompositeConstruct %61 %51 %54
%67 = OpImageTexelPointer %58 %14 %66 %50
%68 = OpAtomicExchange %5 %67 %53 %50 %69
%70 = OpIAdd %5 %65 %68
%71 = OpCompositeConstruct %33 %51 %54 %57
%72 = OpImageTexelPointer %58 %17 %71 %50
%73 = OpAtomicUMax %5 %72 %53 %50 %74
%75 = OpIAdd %5 %70 %73
%76 = OpCompositeConstruct %33 %51 %54 %57
%77 = OpImageTexelPointer %58 %20 %76 %50
%78 = OpAtomicUMin %5 %77 %53 %50 %79
%80 = OpIAdd %5 %75 %78
%81 = OpImageTexelPointer %58 %23 %51 %50
%82 = OpAtomicOr %5 %81 %53 %50 %83
%84 = OpIAdd %5 %80 %82
%85 = OpImageTexelPointer %58 %23 %51 %50
%86 = OpAtomicXor %5 %85 %53 %50 %87
%88 = OpIAdd %5 %84 %86
%90 = OpImageTexelPointer %89 %27 %51 %50
%93 = OpBitcast %24 %92
%91 = OpAtomicSMin %24 %90 %53 %50 %93
%94 = OpBitcast %5 %91
%95 = OpIAdd %5 %88 %94
%96 = OpCompositeConstruct %61 %51 %54
%97 = OpImageTexelPointer %89 %30 %96 %50
%100 = OpBitcast %24 %99
%98 = OpAtomicSMax %24 %97 %53 %50 %100
%101 = OpBitcast %5 %98
%102 = OpIAdd %5 %95 %101
%103 = OpIMul %5 %51 %74
%104 = OpIAdd %5 %103 %56
%105 = OpImageTexelPointer %58 %31 %104 %50
%106 = OpAtomicIAdd %5 %105 %53 %50 %107
%108 = OpIAdd %5 %102 %106
%109 = OpShiftLeftLogical %5 %51 %56
%110 = OpImageTexelPointer %58 %32 %51 %50
%111 = OpAtomicUMax %5 %110 %53 %50 %112
%113 = OpIAdd %5 %108 %111
OpStore %37 %113
OpReturn
OpFunctionEnd
#endif
