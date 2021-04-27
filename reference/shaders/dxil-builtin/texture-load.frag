#version 460
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 1) uniform texture1D _8;
layout(set = 0, binding = 2) uniform texture1DArray _11;
layout(set = 0, binding = 3) uniform texture2D _14;
layout(set = 0, binding = 4) uniform texture2DArray _17;
layout(set = 0, binding = 5) uniform texture3D _20;
layout(set = 0, binding = 6) uniform texture2DMS _23;
layout(set = 0, binding = 7) uniform texture2DMSArray _26;
layout(set = 0, binding = 1, r32f) uniform readonly image1D _29;
layout(set = 0, binding = 2, r32f) uniform readonly image1DArray _32;
layout(set = 0, binding = 3, r32f) uniform readonly image2D _35;
layout(set = 0, binding = 4, r32f) uniform readonly image2DArray _38;
layout(set = 0, binding = 5, r32f) uniform readonly image3D _41;

layout(location = 0) flat in uvec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    vec4 _75 = texelFetch(_8, int(TEXCOORD.x), int(TEXCOORD.y));
    vec4 _78 = texelFetch(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z));
    vec4 _85 = texelFetch(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z));
    vec4 _91 = texelFetch(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w));
    vec4 _98 = texelFetch(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w));
    vec4 _104 = texelFetch(_23, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), TEXCOORD.z);
    vec4 _110 = texelFetch(_26, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), TEXCOORD.w);
    vec4 _116 = imageLoad(_29, int(TEXCOORD.x));
    vec4 _121 = imageLoad(_32, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)));
    vec4 _127 = imageLoad(_35, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)));
    vec4 _133 = imageLoad(_38, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)));
    vec4 _139 = imageLoad(_41, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)));
    SV_Target.x = ((((((((((_78.x + _75.x) + _85.x) + _91.x) + _98.x) + _104.x) + _110.x) + _116.x) + _121.x) + _127.x) + _133.x) + _139.x;
    SV_Target.y = ((((((((((_78.y + _75.y) + _85.y) + _91.y) + _98.y) + _104.y) + _110.y) + _116.y) + _121.y) + _127.y) + _133.y) + _139.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 150
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpCapability Image1D
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %45 %48
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %45 "TEXCOORD"
OpName %48 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 1
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 2
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 3
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 4
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 5
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 6
OpDecorate %26 DescriptorSet 0
OpDecorate %26 Binding 7
OpDecorate %29 DescriptorSet 0
OpDecorate %29 Binding 1
OpDecorate %29 NonWritable
OpDecorate %32 DescriptorSet 0
OpDecorate %32 Binding 2
OpDecorate %32 NonWritable
OpDecorate %35 DescriptorSet 0
OpDecorate %35 Binding 3
OpDecorate %35 NonWritable
OpDecorate %38 DescriptorSet 0
OpDecorate %38 Binding 4
OpDecorate %38 NonWritable
OpDecorate %41 DescriptorSet 0
OpDecorate %41 Binding 5
OpDecorate %41 NonWritable
OpDecorate %45 Flat
OpDecorate %45 Location 0
OpDecorate %48 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 1D 0 1 0 1 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeImage %5 2D 0 0 0 1 Unknown
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeImage %5 2D 0 1 0 1 Unknown
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeImage %5 3D 0 0 0 1 Unknown
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeImage %5 2D 0 0 1 1 Unknown
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeImage %5 2D 0 1 1 1 Unknown
%25 = OpTypePointer UniformConstant %24
%26 = OpVariable %25 UniformConstant
%27 = OpTypeImage %5 1D 0 0 0 2 R32f
%28 = OpTypePointer UniformConstant %27
%29 = OpVariable %28 UniformConstant
%30 = OpTypeImage %5 1D 0 1 0 2 R32f
%31 = OpTypePointer UniformConstant %30
%32 = OpVariable %31 UniformConstant
%33 = OpTypeImage %5 2D 0 0 0 2 R32f
%34 = OpTypePointer UniformConstant %33
%35 = OpVariable %34 UniformConstant
%36 = OpTypeImage %5 2D 0 1 0 2 R32f
%37 = OpTypePointer UniformConstant %36
%38 = OpVariable %37 UniformConstant
%39 = OpTypeImage %5 3D 0 0 0 2 R32f
%40 = OpTypePointer UniformConstant %39
%41 = OpVariable %40 UniformConstant
%42 = OpTypeInt 32 0
%43 = OpTypeVector %42 4
%44 = OpTypePointer Input %43
%45 = OpVariable %44 Input
%46 = OpTypeVector %5 2
%47 = OpTypePointer Output %46
%48 = OpVariable %47 Output
%61 = OpTypePointer Input %42
%63 = OpConstant %42 0
%66 = OpConstant %42 1
%69 = OpConstant %42 2
%72 = OpConstant %42 3
%74 = OpTypeVector %5 4
%79 = OpTypeVector %42 2
%92 = OpTypeVector %42 3
%145 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %148
%148 = OpLabel
%49 = OpLoad %39 %41
%50 = OpLoad %36 %38
%51 = OpLoad %33 %35
%52 = OpLoad %30 %32
%53 = OpLoad %27 %29
%54 = OpLoad %24 %26
%55 = OpLoad %21 %23
%56 = OpLoad %18 %20
%57 = OpLoad %15 %17
%58 = OpLoad %12 %14
%59 = OpLoad %9 %11
%60 = OpLoad %6 %8
%62 = OpAccessChain %61 %45 %63
%64 = OpLoad %42 %62
%65 = OpAccessChain %61 %45 %66
%67 = OpLoad %42 %65
%68 = OpAccessChain %61 %45 %69
%70 = OpLoad %42 %68
%71 = OpAccessChain %61 %45 %72
%73 = OpLoad %42 %71
%75 = OpImageFetch %74 %60 %64 Lod %67
%76 = OpCompositeExtract %5 %75 0
%77 = OpCompositeExtract %5 %75 1
%80 = OpCompositeConstruct %79 %64 %67
%78 = OpImageFetch %74 %59 %80 Lod %70
%81 = OpCompositeExtract %5 %78 0
%82 = OpCompositeExtract %5 %78 1
%83 = OpFAdd %5 %81 %76
%84 = OpFAdd %5 %82 %77
%86 = OpCompositeConstruct %79 %64 %67
%85 = OpImageFetch %74 %58 %86 Lod %70
%87 = OpCompositeExtract %5 %85 0
%88 = OpCompositeExtract %5 %85 1
%89 = OpFAdd %5 %83 %87
%90 = OpFAdd %5 %84 %88
%93 = OpCompositeConstruct %92 %64 %67 %70
%91 = OpImageFetch %74 %57 %93 Lod %73
%94 = OpCompositeExtract %5 %91 0
%95 = OpCompositeExtract %5 %91 1
%96 = OpFAdd %5 %89 %94
%97 = OpFAdd %5 %90 %95
%99 = OpCompositeConstruct %92 %64 %67 %70
%98 = OpImageFetch %74 %56 %99 Lod %73
%100 = OpCompositeExtract %5 %98 0
%101 = OpCompositeExtract %5 %98 1
%102 = OpFAdd %5 %96 %100
%103 = OpFAdd %5 %97 %101
%105 = OpCompositeConstruct %79 %64 %67
%104 = OpImageFetch %74 %55 %105 Sample %70
%106 = OpCompositeExtract %5 %104 0
%107 = OpCompositeExtract %5 %104 1
%108 = OpFAdd %5 %102 %106
%109 = OpFAdd %5 %103 %107
%111 = OpCompositeConstruct %92 %64 %67 %70
%110 = OpImageFetch %74 %54 %111 Sample %73
%112 = OpCompositeExtract %5 %110 0
%113 = OpCompositeExtract %5 %110 1
%114 = OpFAdd %5 %108 %112
%115 = OpFAdd %5 %109 %113
%116 = OpImageRead %74 %53 %64 None
%117 = OpCompositeExtract %5 %116 0
%118 = OpCompositeExtract %5 %116 1
%119 = OpFAdd %5 %114 %117
%120 = OpFAdd %5 %115 %118
%122 = OpCompositeConstruct %79 %64 %67
%121 = OpImageRead %74 %52 %122 None
%123 = OpCompositeExtract %5 %121 0
%124 = OpCompositeExtract %5 %121 1
%125 = OpFAdd %5 %119 %123
%126 = OpFAdd %5 %120 %124
%128 = OpCompositeConstruct %79 %64 %67
%127 = OpImageRead %74 %51 %128 None
%129 = OpCompositeExtract %5 %127 0
%130 = OpCompositeExtract %5 %127 1
%131 = OpFAdd %5 %125 %129
%132 = OpFAdd %5 %126 %130
%134 = OpCompositeConstruct %92 %64 %67 %70
%133 = OpImageRead %74 %50 %134 None
%135 = OpCompositeExtract %5 %133 0
%136 = OpCompositeExtract %5 %133 1
%137 = OpFAdd %5 %131 %135
%138 = OpFAdd %5 %132 %136
%140 = OpCompositeConstruct %92 %64 %67 %70
%139 = OpImageRead %74 %49 %140 None
%141 = OpCompositeExtract %5 %139 0
%142 = OpCompositeExtract %5 %139 1
%143 = OpFAdd %5 %137 %141
%144 = OpFAdd %5 %138 %142
%146 = OpAccessChain %145 %48 %63
OpStore %146 %143
%147 = OpAccessChain %145 %48 %66
OpStore %147 %144
OpReturn
OpFunctionEnd
#endif
