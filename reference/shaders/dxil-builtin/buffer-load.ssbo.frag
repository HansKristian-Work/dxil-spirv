#version 460

layout(set = 0, binding = 1, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _13;

layout(set = 0, binding = 2, std430) restrict readonly buffer _15_17
{
    uint _m0[];
} _17;

layout(set = 0, binding = 3, std430) restrict readonly buffer _19_21
{
    uint _m0[];
} _21;

layout(set = 0, binding = 1, std430) readonly buffer _26_28
{
    uint _m0[];
} _28;

layout(set = 0, binding = 2, std430) readonly buffer _30_32
{
    uint _m0[];
} _32;

layout(set = 0, binding = 3, std430) readonly buffer _34_36
{
    uint _m0[];
} _36;

layout(set = 0, binding = 0) uniform samplerBuffer _8;
layout(set = 0, binding = 0, r32f) uniform readonly imageBuffer _24;

layout(location = 0) flat in uint TEXCOORD;
layout(location = 0) out vec2 SV_Target;

uint _113;
uint _131;

void main()
{
    vec4 _46 = texelFetch(_8, int(TEXCOORD));
    vec4 _49 = imageLoad(_24, int(TEXCOORD));
    uint _56 = TEXCOORD * 2u;
    uvec2 _67 = uvec2(_13._m0[_56], _13._m0[_56 + 1u]);
    uint _74 = TEXCOORD * 2u;
    uvec2 _80 = uvec2(_28._m0[_74], _28._m0[_74 + 1u]);
    uint _87 = TEXCOORD * 2u;
    vec2 _94 = uintBitsToFloat(uvec2(_17._m0[_87], _17._m0[_87 + 1u]));
    uint _99 = TEXCOORD * 2u;
    vec2 _106 = uintBitsToFloat(uvec2(_32._m0[_99], _32._m0[_99 + 1u]));
    uint _111 = TEXCOORD * 6u;
    vec3 _123 = uintBitsToFloat(uvec3(_113, _21._m0[_111 + 1u], _21._m0[_111 + 2u]));
    uint _130 = (TEXCOORD * 6u) + 3u;
    vec3 _139 = uintBitsToFloat(uvec3(_131, _36._m0[_130 + 1u], _36._m0[_130 + 2u]));
    SV_Target.x = ((((((_49.x + _46.x) + uintBitsToFloat(_67.x)) + uintBitsToFloat(_80.x)) + _94.x) + _106.x) + _123.y) + _139.y;
    SV_Target.y = ((((((_49.y + _46.y) + uintBitsToFloat(_67.y)) + uintBitsToFloat(_80.y)) + _94.y) + _106.y) + _123.z) + _139.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 148
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %38 %41
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "SSBO"
OpName %15 "SSBO"
OpName %19 "SSBO"
OpName %26 "SSBO"
OpName %30 "SSBO"
OpName %34 "SSBO"
OpName %38 "TEXCOORD"
OpName %41 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %10 ArrayStride 4
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 1
OpDecorate %13 NonWritable
OpDecorate %13 Restrict
OpDecorate %14 ArrayStride 4
OpMemberDecorate %15 0 Offset 0
OpDecorate %15 Block
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 2
OpDecorate %17 NonWritable
OpDecorate %17 Restrict
OpDecorate %18 ArrayStride 4
OpMemberDecorate %19 0 Offset 0
OpDecorate %19 Block
OpDecorate %21 DescriptorSet 0
OpDecorate %21 Binding 3
OpDecorate %21 NonWritable
OpDecorate %21 Restrict
OpDecorate %24 DescriptorSet 0
OpDecorate %24 Binding 0
OpDecorate %24 NonWritable
OpDecorate %25 ArrayStride 4
OpMemberDecorate %26 0 Offset 0
OpDecorate %26 Block
OpDecorate %28 DescriptorSet 0
OpDecorate %28 Binding 1
OpDecorate %28 NonWritable
OpDecorate %29 ArrayStride 4
OpMemberDecorate %30 0 Offset 0
OpDecorate %30 Block
OpDecorate %32 DescriptorSet 0
OpDecorate %32 Binding 2
OpDecorate %32 NonWritable
OpDecorate %33 ArrayStride 4
OpMemberDecorate %34 0 Offset 0
OpDecorate %34 Block
OpDecorate %36 DescriptorSet 0
OpDecorate %36 Binding 3
OpDecorate %36 NonWritable
OpDecorate %38 Flat
OpDecorate %38 Location 0
OpDecorate %41 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeRuntimeArray %9
%11 = OpTypeStruct %10
%12 = OpTypePointer StorageBuffer %11
%13 = OpVariable %12 StorageBuffer
%14 = OpTypeRuntimeArray %9
%15 = OpTypeStruct %14
%16 = OpTypePointer StorageBuffer %15
%17 = OpVariable %16 StorageBuffer
%18 = OpTypeRuntimeArray %9
%19 = OpTypeStruct %18
%20 = OpTypePointer StorageBuffer %19
%21 = OpVariable %20 StorageBuffer
%22 = OpTypeImage %5 Buffer 0 0 0 2 R32f
%23 = OpTypePointer UniformConstant %22
%24 = OpVariable %23 UniformConstant
%25 = OpTypeRuntimeArray %9
%26 = OpTypeStruct %25
%27 = OpTypePointer StorageBuffer %26
%28 = OpVariable %27 StorageBuffer
%29 = OpTypeRuntimeArray %9
%30 = OpTypeStruct %29
%31 = OpTypePointer StorageBuffer %30
%32 = OpVariable %31 StorageBuffer
%33 = OpTypeRuntimeArray %9
%34 = OpTypeStruct %33
%35 = OpTypePointer StorageBuffer %34
%36 = OpVariable %35 StorageBuffer
%37 = OpTypePointer Input %9
%38 = OpVariable %37 Input
%39 = OpTypeVector %5 2
%40 = OpTypePointer Output %39
%41 = OpVariable %40 Output
%45 = OpTypeVector %5 4
%55 = OpConstant %9 3
%57 = OpConstant %9 2
%58 = OpTypePointer StorageBuffer %9
%60 = OpConstant %9 0
%64 = OpConstant %9 1
%66 = OpTypeVector %9 2
%112 = OpConstant %9 6
%120 = OpTypeVector %9 3
%122 = OpTypeVector %5 3
%128 = OpConstant %9 12
%144 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%113 = OpUndef %9
%131 = OpUndef %9
OpBranch %147
%147 = OpLabel
%42 = OpLoad %22 %24
%43 = OpLoad %6 %8
%44 = OpLoad %9 %38
%46 = OpImageFetch %45 %43 %44
%47 = OpCompositeExtract %5 %46 0
%48 = OpCompositeExtract %5 %46 1
%49 = OpImageRead %45 %42 %44
%50 = OpCompositeExtract %5 %49 0
%51 = OpCompositeExtract %5 %49 1
%52 = OpFAdd %5 %50 %47
%53 = OpFAdd %5 %51 %48
%54 = OpShiftLeftLogical %9 %44 %55
%56 = OpIMul %9 %44 %57
%59 = OpAccessChain %58 %13 %60 %56
%61 = OpLoad %9 %59
%63 = OpIAdd %9 %56 %64
%62 = OpAccessChain %58 %13 %60 %63
%65 = OpLoad %9 %62
%67 = OpCompositeConstruct %66 %61 %65
%68 = OpCompositeExtract %9 %67 0
%69 = OpCompositeExtract %9 %67 1
%70 = OpBitcast %5 %68
%71 = OpBitcast %5 %69
%72 = OpFAdd %5 %52 %70
%73 = OpFAdd %5 %53 %71
%74 = OpIMul %9 %44 %57
%75 = OpAccessChain %58 %28 %60 %74
%76 = OpLoad %9 %75
%78 = OpIAdd %9 %74 %64
%77 = OpAccessChain %58 %28 %60 %78
%79 = OpLoad %9 %77
%80 = OpCompositeConstruct %66 %76 %79
%81 = OpCompositeExtract %9 %80 0
%82 = OpCompositeExtract %9 %80 1
%83 = OpBitcast %5 %81
%84 = OpBitcast %5 %82
%85 = OpFAdd %5 %72 %83
%86 = OpFAdd %5 %73 %84
%87 = OpIMul %9 %44 %57
%88 = OpAccessChain %58 %17 %60 %87
%89 = OpLoad %9 %88
%91 = OpIAdd %9 %87 %64
%90 = OpAccessChain %58 %17 %60 %91
%92 = OpLoad %9 %90
%93 = OpCompositeConstruct %66 %89 %92
%94 = OpBitcast %39 %93
%95 = OpCompositeExtract %5 %94 0
%96 = OpCompositeExtract %5 %94 1
%97 = OpFAdd %5 %85 %95
%98 = OpFAdd %5 %86 %96
%99 = OpIMul %9 %44 %57
%100 = OpAccessChain %58 %32 %60 %99
%101 = OpLoad %9 %100
%103 = OpIAdd %9 %99 %64
%102 = OpAccessChain %58 %32 %60 %103
%104 = OpLoad %9 %102
%105 = OpCompositeConstruct %66 %101 %104
%106 = OpBitcast %39 %105
%107 = OpCompositeExtract %5 %106 0
%108 = OpCompositeExtract %5 %106 1
%109 = OpFAdd %5 %97 %107
%110 = OpFAdd %5 %98 %108
%111 = OpIMul %9 %44 %112
%115 = OpIAdd %9 %111 %64
%114 = OpAccessChain %58 %21 %60 %115
%116 = OpLoad %9 %114
%118 = OpIAdd %9 %111 %57
%117 = OpAccessChain %58 %21 %60 %118
%119 = OpLoad %9 %117
%121 = OpCompositeConstruct %120 %113 %116 %119
%123 = OpBitcast %122 %121
%124 = OpCompositeExtract %5 %123 1
%125 = OpCompositeExtract %5 %123 2
%126 = OpFAdd %5 %109 %124
%127 = OpFAdd %5 %110 %125
%129 = OpIMul %9 %44 %112
%130 = OpIAdd %9 %129 %55
%133 = OpIAdd %9 %130 %64
%132 = OpAccessChain %58 %36 %60 %133
%134 = OpLoad %9 %132
%136 = OpIAdd %9 %130 %57
%135 = OpAccessChain %58 %36 %60 %136
%137 = OpLoad %9 %135
%138 = OpCompositeConstruct %120 %131 %134 %137
%139 = OpBitcast %122 %138
%140 = OpCompositeExtract %5 %139 1
%141 = OpCompositeExtract %5 %139 2
%142 = OpFAdd %5 %126 %140
%143 = OpFAdd %5 %127 %141
%145 = OpAccessChain %144 %41 %60
OpStore %145 %142
%146 = OpAccessChain %144 %41 %64
OpStore %146 %143
OpReturn
OpFunctionEnd
#endif
