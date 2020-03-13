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
    uint _62 = imageAtomicAdd(_8, int(TEXCOORD.x), 1u);
    uint _66 = imageAtomicAnd(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 2u);
    uint _70 = imageAtomicExchange(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 3u);
    uint _75 = imageAtomicMax(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 4u);
    uint _80 = imageAtomicMin(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 5u);
    uint _84 = imageAtomicOr(_23, int(TEXCOORD.x), 6u);
    uint _88 = imageAtomicXor(_23, int(TEXCOORD.x), 7u);
    int _93 = imageAtomicMin(_27, int(TEXCOORD.x), int(8u));
    int _100 = imageAtomicMax(_30, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(9u));
    uint _108 = imageAtomicAdd(_33, int((TEXCOORD.x * 4u) + 2u), 10u);
    uint _114 = imageAtomicMax(_34, int((TEXCOORD.x << 2u) >> 2u), 12u);
    SV_Target = (((((((((_66 + _62) + _70) + _75) + _80) + _84) + _88) + uint(_93)) + uint(_100)) + _108) + _114;
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
%63 = OpTypeVector %5 2
%71 = OpConstant %5 3
%76 = OpConstant %5 4
%81 = OpConstant %5 5
%85 = OpConstant %5 6
%89 = OpConstant %5 7
%91 = OpTypePointer Image %24
%94 = OpConstant %5 8
%101 = OpConstant %5 9
%109 = OpConstant %5 10
%115 = OpConstant %5 12
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %117
%117 = OpLabel
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
%62 = OpAtomicIAdd %5 %61 %55 %52 %55
%64 = OpCompositeConstruct %63 %53 %56
%65 = OpImageTexelPointer %60 %11 %64 %52
%66 = OpAtomicAnd %5 %65 %55 %52 %58
%67 = OpIAdd %5 %66 %62
%68 = OpCompositeConstruct %63 %53 %56
%69 = OpImageTexelPointer %60 %14 %68 %52
%70 = OpAtomicExchange %5 %69 %55 %52 %71
%72 = OpIAdd %5 %67 %70
%73 = OpCompositeConstruct %35 %53 %56 %59
%74 = OpImageTexelPointer %60 %17 %73 %52
%75 = OpAtomicUMax %5 %74 %55 %52 %76
%77 = OpIAdd %5 %72 %75
%78 = OpCompositeConstruct %35 %53 %56 %59
%79 = OpImageTexelPointer %60 %20 %78 %52
%80 = OpAtomicUMin %5 %79 %55 %52 %81
%82 = OpIAdd %5 %77 %80
%83 = OpImageTexelPointer %60 %23 %53 %52
%84 = OpAtomicOr %5 %83 %55 %52 %85
%86 = OpIAdd %5 %82 %84
%87 = OpImageTexelPointer %60 %23 %53 %52
%88 = OpAtomicXor %5 %87 %55 %52 %89
%90 = OpIAdd %5 %86 %88
%92 = OpImageTexelPointer %91 %27 %53 %52
%95 = OpBitcast %24 %94
%93 = OpAtomicSMin %24 %92 %55 %52 %95
%96 = OpBitcast %5 %93
%97 = OpIAdd %5 %90 %96
%98 = OpCompositeConstruct %63 %53 %56
%99 = OpImageTexelPointer %91 %30 %98 %52
%102 = OpBitcast %24 %101
%100 = OpAtomicSMax %24 %99 %55 %52 %102
%103 = OpBitcast %5 %100
%104 = OpIAdd %5 %97 %103
%105 = OpIMul %5 %53 %76
%106 = OpIAdd %5 %105 %58
%107 = OpImageTexelPointer %60 %33 %106 %52
%108 = OpAtomicIAdd %5 %107 %55 %52 %109
%110 = OpIAdd %5 %104 %108
%111 = OpShiftLeftLogical %5 %53 %58
%112 = OpShiftRightLogical %5 %111 %58
%113 = OpImageTexelPointer %60 %34 %112 %52
%114 = OpAtomicUMax %5 %113 %55 %52 %115
%116 = OpIAdd %5 %110 %114
OpStore %39 %116
OpReturn
OpFunctionEnd
#endif
