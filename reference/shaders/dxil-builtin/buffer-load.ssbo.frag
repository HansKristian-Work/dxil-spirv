#version 460
#extension GL_EXT_scalar_block_layout : require

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

void main()
{
    vec4 _48 = texelFetch(_8, int(TEXCOORD));
    vec4 _51 = imageLoad(_26, int(TEXCOORD));
    vec2 _78 = uintBitsToFloat(_18._m0[TEXCOORD]);
    vec2 _85 = uintBitsToFloat(_34._m0[TEXCOORD]);
    vec3 _96 = uintBitsToFloat(_23._m0[TEXCOORD * 2u]);
    vec3 _106 = uintBitsToFloat(_38._m0[(TEXCOORD * 2u) + 1u]);
    SV_Target.x = ((((((_51.x + _48.x) + uintBitsToFloat(_14._m0[TEXCOORD].x)) + uintBitsToFloat(_30._m0[TEXCOORD].x)) + _78.x) + _85.x) + _96.y) + _106.y;
    SV_Target.y = ((((((_51.y + _48.y) + uintBitsToFloat(_14._m0[TEXCOORD].y)) + uintBitsToFloat(_30._m0[TEXCOORD].y)) + _78.y) + _85.y) + _96.z) + _106.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 116
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %40 %43
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
%58 = OpTypePointer StorageBuffer %10
%60 = OpConstant %9 0
%91 = OpConstant %9 2
%92 = OpTypePointer StorageBuffer %19
%95 = OpTypeVector %5 3
%102 = OpConstant %9 1
%111 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %114
%114 = OpLabel
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
%59 = OpAccessChain %58 %14 %60 %46
%61 = OpLoad %10 %59
%62 = OpCompositeExtract %9 %61 0
%63 = OpCompositeExtract %9 %61 1
%64 = OpBitcast %5 %62
%65 = OpBitcast %5 %63
%66 = OpFAdd %5 %54 %64
%67 = OpFAdd %5 %55 %65
%68 = OpAccessChain %58 %30 %60 %46
%69 = OpLoad %10 %68
%70 = OpCompositeExtract %9 %69 0
%71 = OpCompositeExtract %9 %69 1
%72 = OpBitcast %5 %70
%73 = OpBitcast %5 %71
%74 = OpFAdd %5 %66 %72
%75 = OpFAdd %5 %67 %73
%76 = OpAccessChain %58 %18 %60 %46
%77 = OpLoad %10 %76
%78 = OpBitcast %41 %77
%79 = OpCompositeExtract %5 %78 0
%80 = OpCompositeExtract %5 %78 1
%81 = OpFAdd %5 %74 %79
%82 = OpFAdd %5 %75 %80
%83 = OpAccessChain %58 %34 %60 %46
%84 = OpLoad %10 %83
%85 = OpBitcast %41 %84
%86 = OpCompositeExtract %5 %85 0
%87 = OpCompositeExtract %5 %85 1
%88 = OpFAdd %5 %81 %86
%89 = OpFAdd %5 %82 %87
%90 = OpIMul %9 %46 %91
%93 = OpAccessChain %92 %23 %60 %90
%94 = OpLoad %19 %93
%96 = OpBitcast %95 %94
%97 = OpCompositeExtract %5 %96 1
%98 = OpCompositeExtract %5 %96 2
%99 = OpFAdd %5 %88 %97
%100 = OpFAdd %5 %89 %98
%101 = OpIMul %9 %46 %91
%103 = OpIAdd %9 %101 %102
%104 = OpAccessChain %92 %38 %60 %103
%105 = OpLoad %19 %104
%106 = OpBitcast %95 %105
%107 = OpCompositeExtract %5 %106 1
%108 = OpCompositeExtract %5 %106 2
%109 = OpFAdd %5 %99 %107
%110 = OpFAdd %5 %100 %108
%112 = OpAccessChain %111 %43 %60
OpStore %112 %109
%113 = OpAccessChain %111 %43 %102
OpStore %113 %110
OpReturn
OpFunctionEnd
#endif
