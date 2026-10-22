#version 460
#extension GL_EXT_scalar_block_layout : require
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 1, std430) restrict readonly buffer SSBO
{
    uvec2 _m0[];
} _14;

layout(set = 0, binding = 2, std430) restrict readonly buffer _16_18
{
    uvec2 _m0[];
} _18;

layout(set = 0, binding = 3, scalar) restrict readonly buffer _21_23
{
    uvec3 _m0[];
} _23;

layout(set = 0, binding = 1, std430) readonly buffer _28_30
{
    uvec2 _m0[];
} _30;

layout(set = 0, binding = 2, std430) readonly buffer _32_34
{
    uvec2 _m0[];
} _34;

layout(set = 0, binding = 3, scalar) readonly buffer _36_38
{
    uvec3 _m0[];
} _38;

layout(set = 0, binding = 0) uniform samplerBuffer _8;
layout(set = 0, binding = 0, r32f) uniform readonly imageBuffer _26;

layout(location = 0) flat in uint TEXCOORD;
layout(location = 0) out vec2 SV_Target;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    vec4 _48 = texelFetch(_8, int(TEXCOORD));
    vec4 _51 = imageLoad(_26, int(TEXCOORD));
    uint _66 = ByteAddressMask(TEXCOORD, 8u);
    uint _78 = ByteAddressMask(TEXCOORD, 8u);
    vec2 _89 = uintBitsToFloat(_18._m0[TEXCOORD]);
    vec2 _96 = uintBitsToFloat(_34._m0[TEXCOORD]);
    vec3 _107 = uintBitsToFloat(_23._m0[TEXCOORD * 2u]);
    vec3 _117 = uintBitsToFloat(_38._m0[(TEXCOORD * 2u) + 1u]);
    SV_Target.x = ((((((_51.x + _48.x) + uintBitsToFloat(_14._m0[_66].x)) + uintBitsToFloat(_30._m0[_78].x)) + _89.x) + _96.x) + _107.y) + _117.y;
    SV_Target.y = ((((((_51.y + _48.y) + uintBitsToFloat(_14._m0[_66].y)) + uintBitsToFloat(_30._m0[_78].y)) + _89.y) + _96.y) + _107.z) + _117.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 126
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %14 %18 %23 %26 %30 %34 %38 %40 %43
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "SSBO"
OpName %16 "SSBO"
OpName %21 "SSBO"
OpName %28 "SSBO"
OpName %32 "SSBO"
OpName %36 "SSBO"
OpName %40 "TEXCOORD"
OpName %43 "SV_Target"
OpName %61 "ByteAddressMask"
OpName %59 "index"
OpName %60 "stride"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 ArrayStride 8
OpMemberDecorate %12 0 Offset 0
OpDecorate %12 Block
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 1
OpDecorate %14 NonWritable
OpDecorate %14 Restrict
OpDecorate %15 ArrayStride 8
OpMemberDecorate %16 0 Offset 0
OpDecorate %16 Block
OpDecorate %18 DescriptorSet 0
OpDecorate %18 Binding 2
OpDecorate %18 NonWritable
OpDecorate %18 Restrict
OpDecorate %20 ArrayStride 12
OpMemberDecorate %21 0 Offset 0
OpDecorate %21 Block
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 3
OpDecorate %23 NonWritable
OpDecorate %23 Restrict
OpDecorate %26 DescriptorSet 0
OpDecorate %26 Binding 0
OpDecorate %26 NonWritable
OpDecorate %27 ArrayStride 8
OpMemberDecorate %28 0 Offset 0
OpDecorate %28 Block
OpDecorate %30 DescriptorSet 0
OpDecorate %30 Binding 1
OpDecorate %30 NonWritable
OpDecorate %31 ArrayStride 8
OpMemberDecorate %32 0 Offset 0
OpDecorate %32 Block
OpDecorate %34 DescriptorSet 0
OpDecorate %34 Binding 2
OpDecorate %34 NonWritable
OpDecorate %35 ArrayStride 12
OpMemberDecorate %36 0 Offset 0
OpDecorate %36 Block
OpDecorate %38 DescriptorSet 0
OpDecorate %38 Binding 3
OpDecorate %38 NonWritable
OpDecorate %40 Flat
OpDecorate %40 Location 0
OpDecorate %43 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeVector %9 2
%11 = OpTypeRuntimeArray %10
%12 = OpTypeStruct %11
%13 = OpTypePointer StorageBuffer %12
%14 = OpVariable %13 StorageBuffer
%15 = OpTypeRuntimeArray %10
%16 = OpTypeStruct %15
%17 = OpTypePointer StorageBuffer %16
%18 = OpVariable %17 StorageBuffer
%19 = OpTypeVector %9 3
%20 = OpTypeRuntimeArray %19
%21 = OpTypeStruct %20
%22 = OpTypePointer StorageBuffer %21
%23 = OpVariable %22 StorageBuffer
%24 = OpTypeImage %5 Buffer 0 0 0 2 R32f
%25 = OpTypePointer UniformConstant %24
%26 = OpVariable %25 UniformConstant
%27 = OpTypeRuntimeArray %10
%28 = OpTypeStruct %27
%29 = OpTypePointer StorageBuffer %28
%30 = OpVariable %29 StorageBuffer
%31 = OpTypeRuntimeArray %10
%32 = OpTypeStruct %31
%33 = OpTypePointer StorageBuffer %32
%34 = OpVariable %33 StorageBuffer
%35 = OpTypeRuntimeArray %19
%36 = OpTypeStruct %35
%37 = OpTypePointer StorageBuffer %36
%38 = OpVariable %37 StorageBuffer
%39 = OpTypePointer Input %9
%40 = OpVariable %39 Input
%41 = OpTypeVector %5 2
%42 = OpTypePointer Output %41
%43 = OpVariable %42 Output
%47 = OpTypeVector %5 4
%57 = OpConstant %9 3
%58 = OpTypeFunction %9 %9 %9
%64 = OpConstant %9 4294967295
%67 = OpConstant %9 8
%68 = OpTypePointer StorageBuffer %10
%70 = OpConstant %9 0
%102 = OpConstant %9 2
%103 = OpTypePointer StorageBuffer %19
%106 = OpTypeVector %5 3
%113 = OpConstant %9 1
%122 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %125
%125 = OpLabel
%44 = OpLoad %24 %26
%45 = OpLoad %6 %8
%46 = OpLoad %9 %40
%48 = OpImageFetch %47 %45 %46
%49 = OpCompositeExtract %5 %48 0
%50 = OpCompositeExtract %5 %48 1
%51 = OpImageRead %47 %44 %46
%52 = OpCompositeExtract %5 %51 0
%53 = OpCompositeExtract %5 %51 1
%54 = OpFAdd %5 %52 %49
%55 = OpFAdd %5 %53 %50
%56 = OpShiftLeftLogical %9 %46 %57
%66 = OpFunctionCall %9 %61 %46 %67
%69 = OpAccessChain %68 %14 %70 %66
%71 = OpLoad %10 %69
%72 = OpCompositeExtract %9 %71 0
%73 = OpCompositeExtract %9 %71 1
%74 = OpBitcast %5 %72
%75 = OpBitcast %5 %73
%76 = OpFAdd %5 %54 %74
%77 = OpFAdd %5 %55 %75
%78 = OpFunctionCall %9 %61 %46 %67
%79 = OpAccessChain %68 %30 %70 %78
%80 = OpLoad %10 %79
%81 = OpCompositeExtract %9 %80 0
%82 = OpCompositeExtract %9 %80 1
%83 = OpBitcast %5 %81
%84 = OpBitcast %5 %82
%85 = OpFAdd %5 %76 %83
%86 = OpFAdd %5 %77 %84
%87 = OpAccessChain %68 %18 %70 %46
%88 = OpLoad %10 %87
%89 = OpBitcast %41 %88
%90 = OpCompositeExtract %5 %89 0
%91 = OpCompositeExtract %5 %89 1
%92 = OpFAdd %5 %85 %90
%93 = OpFAdd %5 %86 %91
%94 = OpAccessChain %68 %34 %70 %46
%95 = OpLoad %10 %94
%96 = OpBitcast %41 %95
%97 = OpCompositeExtract %5 %96 0
%98 = OpCompositeExtract %5 %96 1
%99 = OpFAdd %5 %92 %97
%100 = OpFAdd %5 %93 %98
%101 = OpIMul %9 %46 %102
%104 = OpAccessChain %103 %23 %70 %101
%105 = OpLoad %19 %104
%107 = OpBitcast %106 %105
%108 = OpCompositeExtract %5 %107 1
%109 = OpCompositeExtract %5 %107 2
%110 = OpFAdd %5 %99 %108
%111 = OpFAdd %5 %100 %109
%112 = OpIMul %9 %46 %102
%114 = OpIAdd %9 %112 %113
%115 = OpAccessChain %103 %38 %70 %114
%116 = OpLoad %19 %115
%117 = OpBitcast %106 %116
%118 = OpCompositeExtract %5 %117 1
%119 = OpCompositeExtract %5 %117 2
%120 = OpFAdd %5 %110 %118
%121 = OpFAdd %5 %111 %119
%123 = OpAccessChain %122 %43 %70
OpStore %123 %120
%124 = OpAccessChain %122 %43 %113
OpStore %124 %121
OpReturn
OpFunctionEnd
%61 = OpFunction %9 None %58
%59 = OpFunctionParameter %9
%60 = OpFunctionParameter %9
%62 = OpLabel
%63 = OpUDiv %9 %64 %60
%65 = OpBitwiseAnd %9 %59 %63
OpReturnValue %65
OpFunctionEnd
#endif
