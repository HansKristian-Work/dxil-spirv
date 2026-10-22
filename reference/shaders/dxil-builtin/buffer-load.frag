#version 460
#extension GL_EXT_samplerless_texture_functions : require

uint _115;
uint _132;

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

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    vec4 _38 = texelFetch(_8, int(TEXCOORD));
    vec4 _41 = imageLoad(_17, int(TEXCOORD));
    uint _58 = ByteAddressMask(TEXCOORD * 2u, 4u);
    uvec2 _68 = uvec2(texelFetch(_12, int(_58)).x, texelFetch(_12, int(_58 + 1u)).x);
    uint _76 = ByteAddressMask(TEXCOORD * 2u, 4u);
    uvec2 _82 = uvec2(imageLoad(_20, int(_76)).x, imageLoad(_20, int(_76 + 1u)).x);
    uint _89 = TEXCOORD * 2u;
    vec2 _96 = uintBitsToFloat(uvec2(texelFetch(_13, int(_89)).x, texelFetch(_13, int(_89 + 1u)).x));
    uint _101 = TEXCOORD * 2u;
    vec2 _108 = uintBitsToFloat(uvec2(imageLoad(_21, int(_101)).x, imageLoad(_21, int(_101 + 1u)).x));
    uint _113 = TEXCOORD * 6u;
    vec3 _125 = uintBitsToFloat(uvec3(_115, texelFetch(_14, int(_113 + 1u)).x, texelFetch(_14, int(_113 + 2u)).x));
    uint _131 = (TEXCOORD * 6u) + 3u;
    vec3 _140 = uintBitsToFloat(uvec3(_132, imageLoad(_22, int(_131 + 1u)).x, imageLoad(_22, int(_131 + 2u)).x));
    SV_Target.x = ((((((_41.x + _38.x) + uintBitsToFloat(_68.x)) + uintBitsToFloat(_82.x)) + _96.x) + _108.x) + _125.y) + _140.y;
    SV_Target.y = ((((((_41.y + _38.y) + uintBitsToFloat(_68.y)) + uintBitsToFloat(_82.y)) + _96.y) + _108.y) + _125.z) + _140.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 150
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %12 %13 %14 %17 %20 %21 %22 %24 %27
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %24 "TEXCOORD"
OpName %27 "SV_Target"
OpName %53 "ByteAddressMask"
OpName %51 "index"
OpName %52 "stride"
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
%50 = OpTypeFunction %9 %9 %9
%56 = OpConstant %9 4294967295
%59 = OpConstant %9 4
%60 = OpTypeVector %9 4
%65 = OpConstant %9 1
%67 = OpTypeVector %9 2
%114 = OpConstant %9 6
%122 = OpTypeVector %9 3
%124 = OpTypeVector %5 3
%145 = OpTypePointer Output %5
%147 = OpConstant %9 0
%3 = OpFunction %1 None %2
%4 = OpLabel
%115 = OpUndef %9
%132 = OpUndef %9
OpBranch %149
%149 = OpLabel
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
%58 = OpFunctionCall %9 %53 %48 %59
%61 = OpImageFetch %60 %34 %58
%62 = OpCompositeExtract %9 %61 0
%64 = OpIAdd %9 %58 %65
%63 = OpImageFetch %60 %34 %64
%66 = OpCompositeExtract %9 %63 0
%68 = OpCompositeConstruct %67 %62 %66
%69 = OpCompositeExtract %9 %68 0
%70 = OpCompositeExtract %9 %68 1
%71 = OpBitcast %5 %69
%72 = OpBitcast %5 %70
%73 = OpFAdd %5 %44 %71
%74 = OpFAdd %5 %45 %72
%75 = OpIMul %9 %36 %49
%76 = OpFunctionCall %9 %53 %75 %59
%77 = OpImageRead %60 %30 %76
%78 = OpCompositeExtract %9 %77 0
%80 = OpIAdd %9 %76 %65
%79 = OpImageRead %60 %30 %80
%81 = OpCompositeExtract %9 %79 0
%82 = OpCompositeConstruct %67 %78 %81
%83 = OpCompositeExtract %9 %82 0
%84 = OpCompositeExtract %9 %82 1
%85 = OpBitcast %5 %83
%86 = OpBitcast %5 %84
%87 = OpFAdd %5 %73 %85
%88 = OpFAdd %5 %74 %86
%89 = OpIMul %9 %36 %49
%90 = OpImageFetch %60 %33 %89
%91 = OpCompositeExtract %9 %90 0
%93 = OpIAdd %9 %89 %65
%92 = OpImageFetch %60 %33 %93
%94 = OpCompositeExtract %9 %92 0
%95 = OpCompositeConstruct %67 %91 %94
%96 = OpBitcast %25 %95
%97 = OpCompositeExtract %5 %96 0
%98 = OpCompositeExtract %5 %96 1
%99 = OpFAdd %5 %87 %97
%100 = OpFAdd %5 %88 %98
%101 = OpIMul %9 %36 %49
%102 = OpImageRead %60 %29 %101
%103 = OpCompositeExtract %9 %102 0
%105 = OpIAdd %9 %101 %65
%104 = OpImageRead %60 %29 %105
%106 = OpCompositeExtract %9 %104 0
%107 = OpCompositeConstruct %67 %103 %106
%108 = OpBitcast %25 %107
%109 = OpCompositeExtract %5 %108 0
%110 = OpCompositeExtract %5 %108 1
%111 = OpFAdd %5 %99 %109
%112 = OpFAdd %5 %100 %110
%113 = OpIMul %9 %36 %114
%117 = OpIAdd %9 %113 %65
%116 = OpImageFetch %60 %32 %117
%118 = OpCompositeExtract %9 %116 0
%120 = OpIAdd %9 %113 %49
%119 = OpImageFetch %60 %32 %120
%121 = OpCompositeExtract %9 %119 0
%123 = OpCompositeConstruct %122 %115 %118 %121
%125 = OpBitcast %124 %123
%126 = OpCompositeExtract %5 %125 1
%127 = OpCompositeExtract %5 %125 2
%128 = OpFAdd %5 %111 %126
%129 = OpFAdd %5 %112 %127
%130 = OpIMul %9 %36 %114
%131 = OpIAdd %9 %130 %47
%134 = OpIAdd %9 %131 %65
%133 = OpImageRead %60 %28 %134
%135 = OpCompositeExtract %9 %133 0
%137 = OpIAdd %9 %131 %49
%136 = OpImageRead %60 %28 %137
%138 = OpCompositeExtract %9 %136 0
%139 = OpCompositeConstruct %122 %132 %135 %138
%140 = OpBitcast %124 %139
%141 = OpCompositeExtract %5 %140 1
%142 = OpCompositeExtract %5 %140 2
%143 = OpFAdd %5 %128 %141
%144 = OpFAdd %5 %129 %142
%146 = OpAccessChain %145 %27 %147
OpStore %146 %143
%148 = OpAccessChain %145 %27 %65
OpStore %148 %144
OpReturn
OpFunctionEnd
%53 = OpFunction %9 None %50
%51 = OpFunctionParameter %9
%52 = OpFunctionParameter %9
%54 = OpLabel
%55 = OpUDiv %9 %56 %52
%57 = OpBitwiseAnd %9 %51 %55
OpReturnValue %57
OpFunctionEnd
#endif
