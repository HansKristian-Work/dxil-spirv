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

void main()
{
    vec4 _38 = texelFetch(_8, int(TEXCOORD));
    vec4 _41 = imageLoad(_17, int(TEXCOORD));
    uint _46 = TEXCOORD << 3u;
    uint _48 = _46 >> 2u;
    uvec4 _63 = uvec4(texelFetch(_12, int(_48)).x, texelFetch(_12, int(_48 + 1u)).x, texelFetch(_12, int(_48 + 2u)).x, texelFetch(_12, int(_48 + 3u)).x);
    uint _70 = _46 >> 2u;
    uvec4 _82 = uvec4(imageLoad(_20, int(_70)).x, imageLoad(_20, int(_70 + 1u)).x, imageLoad(_20, int(_70 + 2u)).x, imageLoad(_20, int(_70 + 3u)).x);
    uint _90 = TEXCOORD * 2u;
    vec2 _98 = uintBitsToFloat(uvec2(texelFetch(_13, int(_90)).x, texelFetch(_13, int(_90 + 1u)).x));
    uint _103 = TEXCOORD * 2u;
    vec2 _110 = uintBitsToFloat(uvec2(imageLoad(_21, int(_103)).x, imageLoad(_21, int(_103 + 1u)).x));
    uint _115 = TEXCOORD * 6u;
    vec4 _129 = uintBitsToFloat(uvec4(texelFetch(_14, int(_115)).x, texelFetch(_14, int(_115 + 1u)).x, texelFetch(_14, int(_115 + 2u)).x, texelFetch(_14, int(_115 + 3u)).x));
    uint _136 = (TEXCOORD * 6u) + 3u;
    vec3 _148 = uintBitsToFloat(uvec3(imageLoad(_22, int(_136)).x, imageLoad(_22, int(_136 + 1u)).x, imageLoad(_22, int(_136 + 2u)).x));
    SV_Target.x = ((((((_41.x + _38.x) + uintBitsToFloat(_63.x)) + uintBitsToFloat(_82.x)) + _98.x) + _110.x) + _129.y) + _148.y;
    SV_Target.y = ((((((_41.y + _38.y) + uintBitsToFloat(_63.y)) + uintBitsToFloat(_82.y)) + _98.y) + _110.y) + _129.z) + _148.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 158
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
%89 = OpConstant %9 0
%96 = OpTypeVector %9 2
%116 = OpConstant %9 6
%134 = OpConstant %9 12
%145 = OpTypeVector %9 3
%147 = OpTypeVector %5 3
%153 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %156
%156 = OpLabel
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
%48 = OpShiftRightLogical %9 %46 %49
%51 = OpImageFetch %50 %34 %48
%52 = OpCompositeExtract %9 %51 0
%54 = OpIAdd %9 %48 %55
%53 = OpImageFetch %50 %34 %54
%56 = OpCompositeExtract %9 %53 0
%58 = OpIAdd %9 %48 %49
%57 = OpImageFetch %50 %34 %58
%59 = OpCompositeExtract %9 %57 0
%61 = OpIAdd %9 %48 %47
%60 = OpImageFetch %50 %34 %61
%62 = OpCompositeExtract %9 %60 0
%63 = OpCompositeConstruct %50 %52 %56 %59 %62
%64 = OpCompositeExtract %9 %63 0
%65 = OpCompositeExtract %9 %63 1
%66 = OpBitcast %5 %64
%67 = OpBitcast %5 %65
%68 = OpFAdd %5 %44 %66
%69 = OpFAdd %5 %45 %67
%70 = OpShiftRightLogical %9 %46 %49
%71 = OpImageRead %50 %30 %70
%72 = OpCompositeExtract %9 %71 0
%74 = OpIAdd %9 %70 %55
%73 = OpImageRead %50 %30 %74
%75 = OpCompositeExtract %9 %73 0
%77 = OpIAdd %9 %70 %49
%76 = OpImageRead %50 %30 %77
%78 = OpCompositeExtract %9 %76 0
%80 = OpIAdd %9 %70 %47
%79 = OpImageRead %50 %30 %80
%81 = OpCompositeExtract %9 %79 0
%82 = OpCompositeConstruct %50 %72 %75 %78 %81
%83 = OpCompositeExtract %9 %82 0
%84 = OpCompositeExtract %9 %82 1
%85 = OpBitcast %5 %83
%86 = OpBitcast %5 %84
%87 = OpFAdd %5 %68 %85
%88 = OpFAdd %5 %69 %86
%90 = OpIMul %9 %36 %49
%91 = OpImageFetch %50 %33 %90
%92 = OpCompositeExtract %9 %91 0
%94 = OpIAdd %9 %90 %55
%93 = OpImageFetch %50 %33 %94
%95 = OpCompositeExtract %9 %93 0
%97 = OpCompositeConstruct %96 %92 %95
%98 = OpBitcast %25 %97
%99 = OpCompositeExtract %5 %98 0
%100 = OpCompositeExtract %5 %98 1
%101 = OpFAdd %5 %87 %99
%102 = OpFAdd %5 %88 %100
%103 = OpIMul %9 %36 %49
%104 = OpImageRead %50 %29 %103
%105 = OpCompositeExtract %9 %104 0
%107 = OpIAdd %9 %103 %55
%106 = OpImageRead %50 %29 %107
%108 = OpCompositeExtract %9 %106 0
%109 = OpCompositeConstruct %96 %105 %108
%110 = OpBitcast %25 %109
%111 = OpCompositeExtract %5 %110 0
%112 = OpCompositeExtract %5 %110 1
%113 = OpFAdd %5 %101 %111
%114 = OpFAdd %5 %102 %112
%115 = OpIMul %9 %36 %116
%117 = OpImageFetch %50 %32 %115
%118 = OpCompositeExtract %9 %117 0
%120 = OpIAdd %9 %115 %55
%119 = OpImageFetch %50 %32 %120
%121 = OpCompositeExtract %9 %119 0
%123 = OpIAdd %9 %115 %49
%122 = OpImageFetch %50 %32 %123
%124 = OpCompositeExtract %9 %122 0
%126 = OpIAdd %9 %115 %47
%125 = OpImageFetch %50 %32 %126
%127 = OpCompositeExtract %9 %125 0
%128 = OpCompositeConstruct %50 %118 %121 %124 %127
%129 = OpBitcast %37 %128
%130 = OpCompositeExtract %5 %129 1
%131 = OpCompositeExtract %5 %129 2
%132 = OpFAdd %5 %113 %130
%133 = OpFAdd %5 %114 %131
%135 = OpIMul %9 %36 %116
%136 = OpIAdd %9 %135 %47
%137 = OpImageRead %50 %28 %136
%138 = OpCompositeExtract %9 %137 0
%140 = OpIAdd %9 %136 %55
%139 = OpImageRead %50 %28 %140
%141 = OpCompositeExtract %9 %139 0
%143 = OpIAdd %9 %136 %49
%142 = OpImageRead %50 %28 %143
%144 = OpCompositeExtract %9 %142 0
%146 = OpCompositeConstruct %145 %138 %141 %144
%148 = OpBitcast %147 %146
%149 = OpCompositeExtract %5 %148 1
%150 = OpCompositeExtract %5 %148 2
%151 = OpFAdd %5 %132 %149
%152 = OpFAdd %5 %133 %150
%154 = OpAccessChain %153 %27 %89
OpStore %154 %151
%155 = OpAccessChain %153 %27 %55
OpStore %155 %152
OpReturn
OpFunctionEnd
#endif
