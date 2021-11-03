#version 460

layout(set = 0, binding = 1, std430) restrict readonly buffer SSBO
{
    uvec2 _m0[];
} _14;

layout(set = 0, binding = 2, std430) restrict readonly buffer _16_18
{
    uint _m0[];
} _18;

layout(set = 0, binding = 3, std430) restrict readonly buffer _20_22
{
    uint _m0[];
} _22;

layout(set = 0, binding = 1, std430) readonly buffer _27_29
{
    uvec2 _m0[];
} _29;

layout(set = 0, binding = 2, std430) readonly buffer _31_33
{
    uint _m0[];
} _33;

layout(set = 0, binding = 3, std430) readonly buffer _35_37
{
    uint _m0[];
} _37;

layout(set = 0, binding = 0) uniform samplerBuffer _8;
layout(set = 0, binding = 0, r32f) uniform readonly imageBuffer _25;

layout(location = 0) flat in uint TEXCOORD;
layout(location = 0) out vec2 SV_Target;

uint _104;
uint _122;

void main()
{
    vec4 _47 = texelFetch(_8, int(TEXCOORD));
    vec4 _50 = imageLoad(_25, int(TEXCOORD));
    uint _75 = TEXCOORD * 2u;
    vec2 _85 = uintBitsToFloat(uvec2(_18._m0[_75], _18._m0[_75 + 1u]));
    uint _90 = TEXCOORD * 2u;
    vec2 _97 = uintBitsToFloat(uvec2(_33._m0[_90], _33._m0[_90 + 1u]));
    uint _102 = TEXCOORD * 6u;
    vec3 _114 = uintBitsToFloat(uvec3(_104, _22._m0[_102 + 1u], _22._m0[_102 + 2u]));
    uint _121 = (TEXCOORD * 6u) + 3u;
    vec3 _130 = uintBitsToFloat(uvec3(_122, _37._m0[_121 + 1u], _37._m0[_121 + 2u]));
    SV_Target.x = ((((((_50.x + _47.x) + uintBitsToFloat(_14._m0[TEXCOORD].x)) + uintBitsToFloat(_29._m0[TEXCOORD].x)) + _85.x) + _97.x) + _114.y) + _130.y;
    SV_Target.y = ((((((_50.y + _47.y) + uintBitsToFloat(_14._m0[TEXCOORD].y)) + uintBitsToFloat(_29._m0[TEXCOORD].y)) + _85.y) + _97.y) + _114.z) + _130.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 140
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %39 %42
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "SSBO"
OpName %16 "SSBO"
OpName %20 "SSBO"
OpName %27 "SSBO"
OpName %31 "SSBO"
OpName %35 "SSBO"
OpName %39 "TEXCOORD"
OpName %42 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 ArrayStride 8
OpMemberDecorate %12 0 Offset 0
OpDecorate %12 Block
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 1
OpDecorate %14 NonWritable
OpDecorate %14 Restrict
OpDecorate %15 ArrayStride 4
OpMemberDecorate %16 0 Offset 0
OpDecorate %16 Block
OpDecorate %18 DescriptorSet 0
OpDecorate %18 Binding 2
OpDecorate %18 NonWritable
OpDecorate %18 Restrict
OpDecorate %19 ArrayStride 4
OpMemberDecorate %20 0 Offset 0
OpDecorate %20 Block
OpDecorate %22 DescriptorSet 0
OpDecorate %22 Binding 3
OpDecorate %22 NonWritable
OpDecorate %22 Restrict
OpDecorate %25 DescriptorSet 0
OpDecorate %25 Binding 0
OpDecorate %25 NonWritable
OpDecorate %26 ArrayStride 8
OpMemberDecorate %27 0 Offset 0
OpDecorate %27 Block
OpDecorate %29 DescriptorSet 0
OpDecorate %29 Binding 1
OpDecorate %29 NonWritable
OpDecorate %30 ArrayStride 4
OpMemberDecorate %31 0 Offset 0
OpDecorate %31 Block
OpDecorate %33 DescriptorSet 0
OpDecorate %33 Binding 2
OpDecorate %33 NonWritable
OpDecorate %34 ArrayStride 4
OpMemberDecorate %35 0 Offset 0
OpDecorate %35 Block
OpDecorate %37 DescriptorSet 0
OpDecorate %37 Binding 3
OpDecorate %37 NonWritable
OpDecorate %39 Flat
OpDecorate %39 Location 0
OpDecorate %42 Location 0
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
%15 = OpTypeRuntimeArray %9
%16 = OpTypeStruct %15
%17 = OpTypePointer StorageBuffer %16
%18 = OpVariable %17 StorageBuffer
%19 = OpTypeRuntimeArray %9
%20 = OpTypeStruct %19
%21 = OpTypePointer StorageBuffer %20
%22 = OpVariable %21 StorageBuffer
%23 = OpTypeImage %5 Buffer 0 0 0 2 R32f
%24 = OpTypePointer UniformConstant %23
%25 = OpVariable %24 UniformConstant
%26 = OpTypeRuntimeArray %10
%27 = OpTypeStruct %26
%28 = OpTypePointer StorageBuffer %27
%29 = OpVariable %28 StorageBuffer
%30 = OpTypeRuntimeArray %9
%31 = OpTypeStruct %30
%32 = OpTypePointer StorageBuffer %31
%33 = OpVariable %32 StorageBuffer
%34 = OpTypeRuntimeArray %9
%35 = OpTypeStruct %34
%36 = OpTypePointer StorageBuffer %35
%37 = OpVariable %36 StorageBuffer
%38 = OpTypePointer Input %9
%39 = OpVariable %38 Input
%40 = OpTypeVector %5 2
%41 = OpTypePointer Output %40
%42 = OpVariable %41 Output
%46 = OpTypeVector %5 4
%56 = OpConstant %9 3
%57 = OpTypePointer StorageBuffer %10
%59 = OpConstant %9 0
%76 = OpConstant %9 2
%77 = OpTypePointer StorageBuffer %9
%82 = OpConstant %9 1
%103 = OpConstant %9 6
%111 = OpTypeVector %9 3
%113 = OpTypeVector %5 3
%119 = OpConstant %9 12
%135 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%104 = OpUndef %9
%122 = OpUndef %9
OpBranch %138
%138 = OpLabel
%43 = OpLoad %23 %25
%44 = OpLoad %6 %8
%45 = OpLoad %9 %39
%47 = OpImageFetch %46 %44 %45
%48 = OpCompositeExtract %5 %47 0
%49 = OpCompositeExtract %5 %47 1
%50 = OpImageRead %46 %43 %45
%51 = OpCompositeExtract %5 %50 0
%52 = OpCompositeExtract %5 %50 1
%53 = OpFAdd %5 %51 %48
%54 = OpFAdd %5 %52 %49
%55 = OpShiftLeftLogical %9 %45 %56
%58 = OpAccessChain %57 %14 %59 %45
%60 = OpLoad %10 %58
%61 = OpCompositeExtract %9 %60 0
%62 = OpCompositeExtract %9 %60 1
%63 = OpBitcast %5 %61
%64 = OpBitcast %5 %62
%65 = OpFAdd %5 %53 %63
%66 = OpFAdd %5 %54 %64
%67 = OpAccessChain %57 %29 %59 %45
%68 = OpLoad %10 %67
%69 = OpCompositeExtract %9 %68 0
%70 = OpCompositeExtract %9 %68 1
%71 = OpBitcast %5 %69
%72 = OpBitcast %5 %70
%73 = OpFAdd %5 %65 %71
%74 = OpFAdd %5 %66 %72
%75 = OpIMul %9 %45 %76
%78 = OpAccessChain %77 %18 %59 %75
%79 = OpLoad %9 %78
%81 = OpIAdd %9 %75 %82
%80 = OpAccessChain %77 %18 %59 %81
%83 = OpLoad %9 %80
%84 = OpCompositeConstruct %10 %79 %83
%85 = OpBitcast %40 %84
%86 = OpCompositeExtract %5 %85 0
%87 = OpCompositeExtract %5 %85 1
%88 = OpFAdd %5 %73 %86
%89 = OpFAdd %5 %74 %87
%90 = OpIMul %9 %45 %76
%91 = OpAccessChain %77 %33 %59 %90
%92 = OpLoad %9 %91
%94 = OpIAdd %9 %90 %82
%93 = OpAccessChain %77 %33 %59 %94
%95 = OpLoad %9 %93
%96 = OpCompositeConstruct %10 %92 %95
%97 = OpBitcast %40 %96
%98 = OpCompositeExtract %5 %97 0
%99 = OpCompositeExtract %5 %97 1
%100 = OpFAdd %5 %88 %98
%101 = OpFAdd %5 %89 %99
%102 = OpIMul %9 %45 %103
%106 = OpIAdd %9 %102 %82
%105 = OpAccessChain %77 %22 %59 %106
%107 = OpLoad %9 %105
%109 = OpIAdd %9 %102 %76
%108 = OpAccessChain %77 %22 %59 %109
%110 = OpLoad %9 %108
%112 = OpCompositeConstruct %111 %104 %107 %110
%114 = OpBitcast %113 %112
%115 = OpCompositeExtract %5 %114 1
%116 = OpCompositeExtract %5 %114 2
%117 = OpFAdd %5 %100 %115
%118 = OpFAdd %5 %101 %116
%120 = OpIMul %9 %45 %103
%121 = OpIAdd %9 %120 %56
%124 = OpIAdd %9 %121 %82
%123 = OpAccessChain %77 %37 %59 %124
%125 = OpLoad %9 %123
%127 = OpIAdd %9 %121 %76
%126 = OpAccessChain %77 %37 %59 %127
%128 = OpLoad %9 %126
%129 = OpCompositeConstruct %111 %122 %125 %128
%130 = OpBitcast %113 %129
%131 = OpCompositeExtract %5 %130 1
%132 = OpCompositeExtract %5 %130 2
%133 = OpFAdd %5 %117 %131
%134 = OpFAdd %5 %118 %132
%136 = OpAccessChain %135 %42 %59
OpStore %136 %133
%137 = OpAccessChain %135 %42 %82
OpStore %137 %134
OpReturn
OpFunctionEnd
#endif
