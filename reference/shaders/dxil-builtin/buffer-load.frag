#version 460
#extension GL_EXT_samplerless_texture_functions : require

uint _116;
uint _133;

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
    uint _59 = ByteAddressMask(TEXCOORD * 2u, 4u);
    uvec2 _69 = uvec2(texelFetch(_12, int(_59)).x, texelFetch(_12, int(_59 + 1u)).x);
    uint _77 = ByteAddressMask(TEXCOORD * 2u, 4u);
    uvec2 _83 = uvec2(imageLoad(_20, int(_77)).x, imageLoad(_20, int(_77 + 1u)).x);
    uint _90 = TEXCOORD * 2u;
    vec2 _97 = uintBitsToFloat(uvec2(texelFetch(_13, int(_90)).x, texelFetch(_13, int(_90 + 1u)).x));
    uint _102 = TEXCOORD * 2u;
    vec2 _109 = uintBitsToFloat(uvec2(imageLoad(_21, int(_102)).x, imageLoad(_21, int(_102 + 1u)).x));
    uint _114 = TEXCOORD * 6u;
    vec3 _126 = uintBitsToFloat(uvec3(_116, texelFetch(_14, int(_114 + 1u)).x, texelFetch(_14, int(_114 + 2u)).x));
    uint _132 = (TEXCOORD * 6u) + 3u;
    vec3 _141 = uintBitsToFloat(uvec3(_133, imageLoad(_22, int(_132 + 1u)).x, imageLoad(_22, int(_132 + 2u)).x));
    SV_Target.x = ((((((_41.x + _38.x) + uintBitsToFloat(_69.x)) + uintBitsToFloat(_83.x)) + _97.x) + _109.x) + _126.y) + _141.y;
    SV_Target.y = ((((((_41.y + _38.y) + uintBitsToFloat(_69.y)) + uintBitsToFloat(_83.y)) + _97.y) + _109.y) + _126.z) + _141.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 152
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
%60 = OpConstant %9 4
%61 = OpTypeVector %9 4
%66 = OpConstant %9 1
%68 = OpTypeVector %9 2
%115 = OpConstant %9 6
%123 = OpTypeVector %9 3
%125 = OpTypeVector %5 3
%146 = OpTypePointer Output %5
%148 = OpConstant %9 0
%3 = OpFunction %1 None %2
%4 = OpLabel
%116 = OpUndef %9
%133 = OpUndef %9
OpBranch %150
%150 = OpLabel
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
%59 = OpFunctionCall %9 %53 %48 %60
%62 = OpImageFetch %61 %34 %59
%63 = OpCompositeExtract %9 %62 0
%65 = OpIAdd %9 %59 %66
%64 = OpImageFetch %61 %34 %65
%67 = OpCompositeExtract %9 %64 0
%69 = OpCompositeConstruct %68 %63 %67
%70 = OpCompositeExtract %9 %69 0
%71 = OpCompositeExtract %9 %69 1
%72 = OpBitcast %5 %70
%73 = OpBitcast %5 %71
%74 = OpFAdd %5 %44 %72
%75 = OpFAdd %5 %45 %73
%76 = OpIMul %9 %36 %49
%77 = OpFunctionCall %9 %53 %76 %60
%78 = OpImageRead %61 %30 %77
%79 = OpCompositeExtract %9 %78 0
%81 = OpIAdd %9 %77 %66
%80 = OpImageRead %61 %30 %81
%82 = OpCompositeExtract %9 %80 0
%83 = OpCompositeConstruct %68 %79 %82
%84 = OpCompositeExtract %9 %83 0
%85 = OpCompositeExtract %9 %83 1
%86 = OpBitcast %5 %84
%87 = OpBitcast %5 %85
%88 = OpFAdd %5 %74 %86
%89 = OpFAdd %5 %75 %87
%90 = OpIMul %9 %36 %49
%91 = OpImageFetch %61 %33 %90
%92 = OpCompositeExtract %9 %91 0
%94 = OpIAdd %9 %90 %66
%93 = OpImageFetch %61 %33 %94
%95 = OpCompositeExtract %9 %93 0
%96 = OpCompositeConstruct %68 %92 %95
%97 = OpBitcast %25 %96
%98 = OpCompositeExtract %5 %97 0
%99 = OpCompositeExtract %5 %97 1
%100 = OpFAdd %5 %88 %98
%101 = OpFAdd %5 %89 %99
%102 = OpIMul %9 %36 %49
%103 = OpImageRead %61 %29 %102
%104 = OpCompositeExtract %9 %103 0
%106 = OpIAdd %9 %102 %66
%105 = OpImageRead %61 %29 %106
%107 = OpCompositeExtract %9 %105 0
%108 = OpCompositeConstruct %68 %104 %107
%109 = OpBitcast %25 %108
%110 = OpCompositeExtract %5 %109 0
%111 = OpCompositeExtract %5 %109 1
%112 = OpFAdd %5 %100 %110
%113 = OpFAdd %5 %101 %111
%114 = OpIMul %9 %36 %115
%118 = OpIAdd %9 %114 %66
%117 = OpImageFetch %61 %32 %118
%119 = OpCompositeExtract %9 %117 0
%121 = OpIAdd %9 %114 %49
%120 = OpImageFetch %61 %32 %121
%122 = OpCompositeExtract %9 %120 0
%124 = OpCompositeConstruct %123 %116 %119 %122
%126 = OpBitcast %125 %124
%127 = OpCompositeExtract %5 %126 1
%128 = OpCompositeExtract %5 %126 2
%129 = OpFAdd %5 %112 %127
%130 = OpFAdd %5 %113 %128
%131 = OpIMul %9 %36 %115
%132 = OpIAdd %9 %131 %47
%135 = OpIAdd %9 %132 %66
%134 = OpImageRead %61 %28 %135
%136 = OpCompositeExtract %9 %134 0
%138 = OpIAdd %9 %132 %49
%137 = OpImageRead %61 %28 %138
%139 = OpCompositeExtract %9 %137 0
%140 = OpCompositeConstruct %123 %133 %136 %139
%141 = OpBitcast %125 %140
%142 = OpCompositeExtract %5 %141 1
%143 = OpCompositeExtract %5 %141 2
%144 = OpFAdd %5 %129 %142
%145 = OpFAdd %5 %130 %143
%147 = OpAccessChain %146 %27 %148
OpStore %147 %144
%149 = OpAccessChain %146 %27 %66
OpStore %149 %145
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
