#version 460

layout(set = 0, binding = 0) uniform samplerBuffer _8;
layout(set = 0, binding = 1) uniform usamplerBuffer _12;
layout(set = 0, binding = 2) uniform usamplerBuffer _13;
layout(set = 0, binding = 3) uniform usamplerBuffer _14;
layout(set = 0, binding = 0, r32f) uniform readonly imageBuffer _17;
layout(set = 0, binding = 1, r32ui) uniform readonly uimageBuffer _20;
layout(set = 0, binding = 2, r32ui) uniform readonly uimageBuffer _21;
layout(set = 0, binding = 3, r32ui) uniform readonly uimageBuffer _22;

layout(location = 0) flat in uint TEXCOORD;
layout(location = 0) out vec2 SV_Target;

uint _105;
uint _123;

void main()
{
    vec4 _38 = texelFetch(_8, int(TEXCOORD));
    vec4 _41 = imageLoad(_17, int(TEXCOORD));
    uint _48 = TEXCOORD * 2u;
    uvec2 _58 = uvec2(texelFetch(_12, int(_48)).x, texelFetch(_12, int(_48 + 1u)).x);
    uint _65 = TEXCOORD * 2u;
    uvec2 _71 = uvec2(imageLoad(_20, int(_65)).x, imageLoad(_20, int(_65 + 1u)).x);
    uint _79 = TEXCOORD * 2u;
    vec2 _86 = uintBitsToFloat(uvec2(texelFetch(_13, int(_79)).x, texelFetch(_13, int(_79 + 1u)).x));
    uint _91 = TEXCOORD * 2u;
    vec2 _98 = uintBitsToFloat(uvec2(imageLoad(_21, int(_91)).x, imageLoad(_21, int(_91 + 1u)).x));
    uint _103 = TEXCOORD * 6u;
    vec3 _115 = uintBitsToFloat(uvec3(_105, texelFetch(_14, int(_103 + 1u)).x, texelFetch(_14, int(_103 + 2u)).x));
    uint _122 = (TEXCOORD * 6u) + 3u;
    vec3 _131 = uintBitsToFloat(uvec3(_123, imageLoad(_22, int(_122 + 1u)).x, imageLoad(_22, int(_122 + 2u)).x));
    SV_Target.x = ((((((_41.x + _38.x) + uintBitsToFloat(_58.x)) + uintBitsToFloat(_71.x)) + _86.x) + _98.x) + _115.y) + _131.y;
    SV_Target.y = ((((((_41.y + _38.y) + uintBitsToFloat(_58.y)) + uintBitsToFloat(_71.y)) + _86.y) + _98.y) + _115.z) + _131.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 141
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %24 %27
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %24 "TEXCOORD"
OpName %27 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 1
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 2
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 3
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %17 NonWritable
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 1
OpDecorate %20 NonWritable
OpDecorate %21 DescriptorSet 0
OpDecorate %21 Binding 2
OpDecorate %21 NonWritable
OpDecorate %22 DescriptorSet 0
OpDecorate %22 Binding 3
OpDecorate %22 NonWritable
OpDecorate %24 Flat
OpDecorate %24 Location 0
OpDecorate %27 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeImage %9 Buffer 0 0 0 1 Unknown
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpVariable %11 UniformConstant
%14 = OpVariable %11 UniformConstant
%15 = OpTypeImage %5 Buffer 0 0 0 2 R32f
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeImage %9 Buffer 0 0 0 2 R32ui
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpVariable %19 UniformConstant
%22 = OpVariable %19 UniformConstant
%23 = OpTypePointer Input %9
%24 = OpVariable %23 Input
%25 = OpTypeVector %5 2
%26 = OpTypePointer Output %25
%27 = OpVariable %26 Output
%37 = OpTypeVector %5 4
%47 = OpConstant %9 3
%49 = OpConstant %9 2
%50 = OpTypeVector %9 4
%55 = OpConstant %9 1
%57 = OpTypeVector %9 2
%78 = OpConstant %9 0
%104 = OpConstant %9 6
%112 = OpTypeVector %9 3
%114 = OpTypeVector %5 3
%120 = OpConstant %9 12
%136 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%105 = OpUndef %9
%123 = OpUndef %9
OpBranch %139
%139 = OpLabel
%28 = OpLoad %18 %22
%29 = OpLoad %18 %21
%30 = OpLoad %18 %20
%31 = OpLoad %15 %17
%32 = OpLoad %10 %14
%33 = OpLoad %10 %13
%34 = OpLoad %10 %12
%35 = OpLoad %6 %8
%36 = OpLoad %9 %24
%38 = OpImageFetch %37 %35 %36
%39 = OpCompositeExtract %5 %38 0
%40 = OpCompositeExtract %5 %38 1
%41 = OpImageRead %37 %31 %36
%42 = OpCompositeExtract %5 %41 0
%43 = OpCompositeExtract %5 %41 1
%44 = OpFAdd %5 %42 %39
%45 = OpFAdd %5 %43 %40
%46 = OpShiftLeftLogical %9 %36 %47
%48 = OpIMul %9 %36 %49
%51 = OpImageFetch %50 %34 %48
%52 = OpCompositeExtract %9 %51 0
%54 = OpIAdd %9 %48 %55
%53 = OpImageFetch %50 %34 %54
%56 = OpCompositeExtract %9 %53 0
%58 = OpCompositeConstruct %57 %52 %56
%59 = OpCompositeExtract %9 %58 0
%60 = OpCompositeExtract %9 %58 1
%61 = OpBitcast %5 %59
%62 = OpBitcast %5 %60
%63 = OpFAdd %5 %44 %61
%64 = OpFAdd %5 %45 %62
%65 = OpIMul %9 %36 %49
%66 = OpImageRead %50 %30 %65
%67 = OpCompositeExtract %9 %66 0
%69 = OpIAdd %9 %65 %55
%68 = OpImageRead %50 %30 %69
%70 = OpCompositeExtract %9 %68 0
%71 = OpCompositeConstruct %57 %67 %70
%72 = OpCompositeExtract %9 %71 0
%73 = OpCompositeExtract %9 %71 1
%74 = OpBitcast %5 %72
%75 = OpBitcast %5 %73
%76 = OpFAdd %5 %63 %74
%77 = OpFAdd %5 %64 %75
%79 = OpIMul %9 %36 %49
%80 = OpImageFetch %50 %33 %79
%81 = OpCompositeExtract %9 %80 0
%83 = OpIAdd %9 %79 %55
%82 = OpImageFetch %50 %33 %83
%84 = OpCompositeExtract %9 %82 0
%85 = OpCompositeConstruct %57 %81 %84
%86 = OpBitcast %25 %85
%87 = OpCompositeExtract %5 %86 0
%88 = OpCompositeExtract %5 %86 1
%89 = OpFAdd %5 %76 %87
%90 = OpFAdd %5 %77 %88
%91 = OpIMul %9 %36 %49
%92 = OpImageRead %50 %29 %91
%93 = OpCompositeExtract %9 %92 0
%95 = OpIAdd %9 %91 %55
%94 = OpImageRead %50 %29 %95
%96 = OpCompositeExtract %9 %94 0
%97 = OpCompositeConstruct %57 %93 %96
%98 = OpBitcast %25 %97
%99 = OpCompositeExtract %5 %98 0
%100 = OpCompositeExtract %5 %98 1
%101 = OpFAdd %5 %89 %99
%102 = OpFAdd %5 %90 %100
%103 = OpIMul %9 %36 %104
%107 = OpIAdd %9 %103 %55
%106 = OpImageFetch %50 %32 %107
%108 = OpCompositeExtract %9 %106 0
%110 = OpIAdd %9 %103 %49
%109 = OpImageFetch %50 %32 %110
%111 = OpCompositeExtract %9 %109 0
%113 = OpCompositeConstruct %112 %105 %108 %111
%115 = OpBitcast %114 %113
%116 = OpCompositeExtract %5 %115 1
%117 = OpCompositeExtract %5 %115 2
%118 = OpFAdd %5 %101 %116
%119 = OpFAdd %5 %102 %117
%121 = OpIMul %9 %36 %104
%122 = OpIAdd %9 %121 %47
%125 = OpIAdd %9 %122 %55
%124 = OpImageRead %50 %28 %125
%126 = OpCompositeExtract %9 %124 0
%128 = OpIAdd %9 %122 %49
%127 = OpImageRead %50 %28 %128
%129 = OpCompositeExtract %9 %127 0
%130 = OpCompositeConstruct %112 %123 %126 %129
%131 = OpBitcast %114 %130
%132 = OpCompositeExtract %5 %131 1
%133 = OpCompositeExtract %5 %131 2
%134 = OpFAdd %5 %118 %132
%135 = OpFAdd %5 %119 %133
%137 = OpAccessChain %136 %27 %78
OpStore %137 %134
%138 = OpAccessChain %136 %27 %55
OpStore %138 %135
OpReturn
OpFunctionEnd
#endif
