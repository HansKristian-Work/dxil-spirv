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
    uint _64 = imageAtomicAdd(_8, int(TEXCOORD.x), 1u);
    uint _69 = imageAtomicAnd(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 2u);
    uint _73 = imageAtomicExchange(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 3u);
    uint _78 = imageAtomicMax(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 4u);
    uint _83 = imageAtomicMin(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 5u);
    uint _86 = imageAtomicOr(_23, int(TEXCOORD.x), 6u);
    uint _90 = imageAtomicXor(_23, int(TEXCOORD.x), 7u);
    int _95 = imageAtomicMin(_27, int(TEXCOORD.x), int(8u));
    int _102 = imageAtomicMax(_30, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(9u));
    uint _111 = atomicAdd(_34._m0[(TEXCOORD.x * 4u) + 2u], 10u);
    uint _125 = atomicMax(_38._m0[ByteAddressMask(TEXCOORD.x, 4u)], 12u);
    SV_Target = (((((((((_69 + _64) + _73) + _78) + _83) + _86) + _90) + uint(_95)) + uint(_102)) + _111) + _125;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 129
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
OpName %118 "ByteAddressMask"
OpName %116 "index"
OpName %117 "stride"
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
%65 = OpConstant %5 5
%66 = OpTypeVector %5 2
%74 = OpConstant %5 3
%79 = OpConstant %5 4
%87 = OpConstant %5 6
%91 = OpConstant %5 7
%93 = OpTypePointer Image %24
%96 = OpConstant %5 8
%103 = OpConstant %5 9
%109 = OpTypePointer StorageBuffer %5
%112 = OpConstant %5 10
%115 = OpTypeFunction %5 %5 %5
%121 = OpConstant %5 4294967295
%126 = OpConstant %5 12
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %128
%128 = OpLabel
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
%64 = OpAtomicIAdd %5 %63 %65 %54 %57
%67 = OpCompositeConstruct %66 %55 %58
%68 = OpImageTexelPointer %62 %11 %67 %54
%69 = OpAtomicAnd %5 %68 %65 %54 %60
%70 = OpIAdd %5 %69 %64
%71 = OpCompositeConstruct %66 %55 %58
%72 = OpImageTexelPointer %62 %14 %71 %54
%73 = OpAtomicExchange %5 %72 %65 %54 %74
%75 = OpIAdd %5 %70 %73
%76 = OpCompositeConstruct %39 %55 %58 %61
%77 = OpImageTexelPointer %62 %17 %76 %54
%78 = OpAtomicUMax %5 %77 %65 %54 %79
%80 = OpIAdd %5 %75 %78
%81 = OpCompositeConstruct %39 %55 %58 %61
%82 = OpImageTexelPointer %62 %20 %81 %54
%83 = OpAtomicUMin %5 %82 %65 %54 %65
%84 = OpIAdd %5 %80 %83
%85 = OpImageTexelPointer %62 %23 %55 %54
%86 = OpAtomicOr %5 %85 %65 %54 %87
%88 = OpIAdd %5 %84 %86
%89 = OpImageTexelPointer %62 %23 %55 %54
%90 = OpAtomicXor %5 %89 %65 %54 %91
%92 = OpIAdd %5 %88 %90
%94 = OpImageTexelPointer %93 %27 %55 %54
%97 = OpBitcast %24 %96
%95 = OpAtomicSMin %24 %94 %65 %54 %97
%98 = OpBitcast %5 %95
%99 = OpIAdd %5 %92 %98
%100 = OpCompositeConstruct %66 %55 %58
%101 = OpImageTexelPointer %93 %30 %100 %54
%104 = OpBitcast %24 %103
%102 = OpAtomicSMax %24 %101 %65 %54 %104
%105 = OpBitcast %5 %102
%106 = OpIAdd %5 %99 %105
%107 = OpIMul %5 %55 %79
%108 = OpIAdd %5 %107 %60
%110 = OpAccessChain %109 %34 %54 %108
%111 = OpAtomicIAdd %5 %110 %65 %54 %112
%113 = OpIAdd %5 %106 %111
%114 = OpShiftLeftLogical %5 %55 %60
%123 = OpFunctionCall %5 %118 %55 %79
%124 = OpAccessChain %109 %38 %54 %123
%125 = OpAtomicUMax %5 %124 %65 %54 %126
%127 = OpIAdd %5 %113 %125
OpStore %43 %127
OpReturn
OpFunctionEnd
%118 = OpFunction %5 None %115
%116 = OpFunctionParameter %5
%117 = OpFunctionParameter %5
%119 = OpLabel
%120 = OpUDiv %5 %121 %117
%122 = OpBitwiseAnd %5 %116 %120
OpReturnValue %122
OpFunctionEnd
#endif
