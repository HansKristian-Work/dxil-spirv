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
    uint _64 = imageAtomicAdd(_8, int(TEXCOORD.x), 1u);
    uint _68 = imageAtomicAnd(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 2u);
    uint _72 = imageAtomicExchange(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 3u);
    uint _77 = imageAtomicMax(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 4u);
    uint _82 = imageAtomicMin(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 5u);
    uint _86 = imageAtomicOr(_23, int(TEXCOORD.x), 6u);
    uint _90 = imageAtomicXor(_23, int(TEXCOORD.x), 7u);
    int _95 = imageAtomicMin(_27, int(TEXCOORD.x), int(8u));
    int _102 = imageAtomicMax(_30, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(9u));
    uint _111 = atomicAdd(_34._m0[(TEXCOORD.x * 4u) + 2u], 10u);
    uint _116 = atomicMax(_38._m0[TEXCOORD.x], 12u);
    SV_Target = (((((((((_68 + _64) + _72) + _77) + _82) + _86) + _90) + uint(_95)) + uint(_102)) + _111) + _116;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 121
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
%65 = OpTypeVector %5 2
%73 = OpConstant %5 3
%78 = OpConstant %5 4
%83 = OpConstant %5 5
%87 = OpConstant %5 6
%91 = OpConstant %5 7
%93 = OpTypePointer Image %24
%96 = OpConstant %5 8
%103 = OpConstant %5 9
%109 = OpTypePointer StorageBuffer %5
%112 = OpConstant %5 10
%117 = OpConstant %5 12
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %119
%119 = OpLabel
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
%64 = OpAtomicIAdd %5 %63 %57 %54 %57
%66 = OpCompositeConstruct %65 %55 %58
%67 = OpImageTexelPointer %62 %11 %66 %54
%68 = OpAtomicAnd %5 %67 %57 %54 %60
%69 = OpIAdd %5 %68 %64
%70 = OpCompositeConstruct %65 %55 %58
%71 = OpImageTexelPointer %62 %14 %70 %54
%72 = OpAtomicExchange %5 %71 %57 %54 %73
%74 = OpIAdd %5 %69 %72
%75 = OpCompositeConstruct %39 %55 %58 %61
%76 = OpImageTexelPointer %62 %17 %75 %54
%77 = OpAtomicUMax %5 %76 %57 %54 %78
%79 = OpIAdd %5 %74 %77
%80 = OpCompositeConstruct %39 %55 %58 %61
%81 = OpImageTexelPointer %62 %20 %80 %54
%82 = OpAtomicUMin %5 %81 %57 %54 %83
%84 = OpIAdd %5 %79 %82
%85 = OpImageTexelPointer %62 %23 %55 %54
%86 = OpAtomicOr %5 %85 %57 %54 %87
%88 = OpIAdd %5 %84 %86
%89 = OpImageTexelPointer %62 %23 %55 %54
%90 = OpAtomicXor %5 %89 %57 %54 %91
%92 = OpIAdd %5 %88 %90
%94 = OpImageTexelPointer %93 %27 %55 %54
%97 = OpBitcast %24 %96
%95 = OpAtomicSMin %24 %94 %57 %54 %97
%98 = OpBitcast %5 %95
%99 = OpIAdd %5 %92 %98
%100 = OpCompositeConstruct %65 %55 %58
%101 = OpImageTexelPointer %93 %30 %100 %54
%104 = OpBitcast %24 %103
%102 = OpAtomicSMax %24 %101 %57 %54 %104
%105 = OpBitcast %5 %102
%106 = OpIAdd %5 %99 %105
%107 = OpIMul %5 %55 %78
%108 = OpIAdd %5 %107 %60
%110 = OpAccessChain %109 %34 %54 %108
%111 = OpAtomicIAdd %5 %110 %57 %54 %112
%113 = OpIAdd %5 %106 %111
%114 = OpShiftLeftLogical %5 %55 %60
%115 = OpAccessChain %109 %38 %54 %55
%116 = OpAtomicUMax %5 %115 %57 %54 %117
%118 = OpIAdd %5 %113 %116
OpStore %43 %118
OpReturn
OpFunctionEnd
#endif
