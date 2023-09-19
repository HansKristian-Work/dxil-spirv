#version 460

uint _104;
uint _121;

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

void main()
{
    vec4 _38 = texelFetch(_8, int(TEXCOORD));
    vec4 _41 = imageLoad(_17, int(TEXCOORD));
    uint _48 = TEXCOORD * 2u;
    uvec2 _58 = uvec2(texelFetch(_12, int(_48)).x, texelFetch(_12, int(_48 + 1u)).x);
    uint _65 = TEXCOORD * 2u;
    uvec2 _71 = uvec2(imageLoad(_20, int(_65)).x, imageLoad(_20, int(_65 + 1u)).x);
    uint _78 = TEXCOORD * 2u;
    vec2 _85 = uintBitsToFloat(uvec2(texelFetch(_13, int(_78)).x, texelFetch(_13, int(_78 + 1u)).x));
    uint _90 = TEXCOORD * 2u;
    vec2 _97 = uintBitsToFloat(uvec2(imageLoad(_21, int(_90)).x, imageLoad(_21, int(_90 + 1u)).x));
    uint _102 = TEXCOORD * 6u;
    vec3 _114 = uintBitsToFloat(uvec3(_104, texelFetch(_14, int(_102 + 1u)).x, texelFetch(_14, int(_102 + 2u)).x));
    uint _120 = (TEXCOORD * 6u) + 3u;
    vec3 _129 = uintBitsToFloat(uvec3(_121, imageLoad(_22, int(_120 + 1u)).x, imageLoad(_22, int(_120 + 2u)).x));
    SV_Target.x = ((((((_41.x + _38.x) + uintBitsToFloat(_58.x)) + uintBitsToFloat(_71.x)) + _85.x) + _97.x) + _114.y) + _129.y;
    SV_Target.y = ((((((_41.y + _38.y) + uintBitsToFloat(_58.y)) + uintBitsToFloat(_71.y)) + _85.y) + _97.y) + _114.z) + _129.z;
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
%103 = OpConstant %9 6
%111 = OpTypeVector %9 3
%113 = OpTypeVector %5 3
%134 = OpTypePointer Output %5
%136 = OpConstant %9 0
%3 = OpFunction %1 None %2
%4 = OpLabel
%104 = OpUndef %9
%121 = OpUndef %9
OpBranch %138
%138 = OpLabel
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
%78 = OpIMul %9 %36 %49
%79 = OpImageFetch %50 %33 %78
%80 = OpCompositeExtract %9 %79 0
%82 = OpIAdd %9 %78 %55
%81 = OpImageFetch %50 %33 %82
%83 = OpCompositeExtract %9 %81 0
%84 = OpCompositeConstruct %57 %80 %83
%85 = OpBitcast %25 %84
%86 = OpCompositeExtract %5 %85 0
%87 = OpCompositeExtract %5 %85 1
%88 = OpFAdd %5 %76 %86
%89 = OpFAdd %5 %77 %87
%90 = OpIMul %9 %36 %49
%91 = OpImageRead %50 %29 %90
%92 = OpCompositeExtract %9 %91 0
%94 = OpIAdd %9 %90 %55
%93 = OpImageRead %50 %29 %94
%95 = OpCompositeExtract %9 %93 0
%96 = OpCompositeConstruct %57 %92 %95
%97 = OpBitcast %25 %96
%98 = OpCompositeExtract %5 %97 0
%99 = OpCompositeExtract %5 %97 1
%100 = OpFAdd %5 %88 %98
%101 = OpFAdd %5 %89 %99
%102 = OpIMul %9 %36 %103
%106 = OpIAdd %9 %102 %55
%105 = OpImageFetch %50 %32 %106
%107 = OpCompositeExtract %9 %105 0
%109 = OpIAdd %9 %102 %49
%108 = OpImageFetch %50 %32 %109
%110 = OpCompositeExtract %9 %108 0
%112 = OpCompositeConstruct %111 %104 %107 %110
%114 = OpBitcast %113 %112
%115 = OpCompositeExtract %5 %114 1
%116 = OpCompositeExtract %5 %114 2
%117 = OpFAdd %5 %100 %115
%118 = OpFAdd %5 %101 %116
%119 = OpIMul %9 %36 %103
%120 = OpIAdd %9 %119 %47
%123 = OpIAdd %9 %120 %55
%122 = OpImageRead %50 %28 %123
%124 = OpCompositeExtract %9 %122 0
%126 = OpIAdd %9 %120 %49
%125 = OpImageRead %50 %28 %126
%127 = OpCompositeExtract %9 %125 0
%128 = OpCompositeConstruct %111 %121 %124 %127
%129 = OpBitcast %113 %128
%130 = OpCompositeExtract %5 %129 1
%131 = OpCompositeExtract %5 %129 2
%132 = OpFAdd %5 %117 %130
%133 = OpFAdd %5 %118 %131
%135 = OpAccessChain %134 %27 %136
OpStore %135 %132
%137 = OpAccessChain %134 %27 %55
OpStore %137 %133
OpReturn
OpFunctionEnd
#endif
