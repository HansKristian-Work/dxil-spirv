#version 460
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 1) uniform itexture1D _8;
layout(set = 0, binding = 2) uniform itexture1DArray _11;
layout(set = 0, binding = 3) uniform itexture2D _14;
layout(set = 0, binding = 4) uniform itexture2DArray _17;
layout(set = 0, binding = 5) uniform itexture3D _20;
layout(set = 0, binding = 6) uniform itexture2DMS _23;
layout(set = 0, binding = 7) uniform itexture2DMSArray _26;
layout(set = 0, binding = 1) uniform readonly iimage1D _29;
layout(set = 0, binding = 2) uniform readonly iimage1DArray _32;
layout(set = 0, binding = 3) uniform readonly iimage2D _35;
layout(set = 0, binding = 4) uniform readonly iimage2DArray _38;
layout(set = 0, binding = 5) uniform readonly iimage3D _41;

layout(location = 0) flat in uvec4 TEXCOORD;
layout(location = 0) out ivec2 SV_Target;

void main()
{
    uvec4 _77 = uvec4(texelFetch(_8, int(TEXCOORD.x), int(TEXCOORD.y)));
    uvec4 _83 = uvec4(texelFetch(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z)));
    uvec4 _90 = uvec4(texelFetch(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z)));
    uvec4 _98 = uvec4(texelFetch(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w)));
    uvec4 _105 = uvec4(texelFetch(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w)));
    uvec4 _112 = uvec4(texelFetch(_23, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), TEXCOORD.z));
    uvec4 _119 = uvec4(texelFetch(_26, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), TEXCOORD.w));
    uvec4 _125 = uvec4(imageLoad(_29, int(TEXCOORD.x)));
    uvec4 _132 = uvec4(imageLoad(_32, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y))));
    uvec4 _139 = uvec4(imageLoad(_35, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y))));
    uvec4 _146 = uvec4(imageLoad(_38, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z))));
    uvec4 _153 = uvec4(imageLoad(_41, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z))));
    SV_Target.x = int(((((((((((_83.x + _77.x) + _90.x) + _98.x) + _105.x) + _112.x) + _119.x) + _125.x) + _132.x) + _139.x) + _146.x) + _153.x);
    SV_Target.y = int(((((((((((_83.y + _77.y) + _90.y) + _98.y) + _105.y) + _112.y) + _119.y) + _125.y) + _132.y) + _139.y) + _146.y) + _153.y);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 165
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpCapability Image1D
OpCapability StorageImageReadWithoutFormat
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
OpDecorate %32 DescriptorSet 0
OpDecorate %32 Binding 2
OpDecorate %35 DescriptorSet 0
OpDecorate %35 Binding 3
OpDecorate %38 DescriptorSet 0
OpDecorate %38 Binding 4
OpDecorate %41 DescriptorSet 0
OpDecorate %41 Binding 5
OpDecorate %45 Flat
OpDecorate %45 Location 0
OpDecorate %48 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
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
%27 = OpTypeImage %5 1D 0 0 0 2 Unknown
%28 = OpTypePointer UniformConstant %27
%29 = OpVariable %28 UniformConstant
%30 = OpTypeImage %5 1D 0 1 0 2 Unknown
%31 = OpTypePointer UniformConstant %30
%32 = OpVariable %31 UniformConstant
%33 = OpTypeImage %5 2D 0 0 0 2 Unknown
%34 = OpTypePointer UniformConstant %33
%35 = OpVariable %34 UniformConstant
%36 = OpTypeImage %5 2D 0 1 0 2 Unknown
%37 = OpTypePointer UniformConstant %36
%38 = OpVariable %37 UniformConstant
%39 = OpTypeImage %5 3D 0 0 0 2 Unknown
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
%74 = OpConstant %5 0
%75 = OpTypeVector %5 4
%81 = OpTypeVector %42 2
%96 = OpTypeVector %42 3
%158 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %163
%163 = OpLabel
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
%76 = OpImageFetch %75 %60 %64 Lod %67
%77 = OpBitcast %43 %76
%78 = OpCompositeExtract %42 %77 0
%79 = OpCompositeExtract %42 %77 1
%82 = OpCompositeConstruct %81 %64 %67
%80 = OpImageFetch %75 %59 %82 Lod %70
%83 = OpBitcast %43 %80
%84 = OpCompositeExtract %42 %83 0
%85 = OpCompositeExtract %42 %83 1
%86 = OpIAdd %42 %84 %78
%87 = OpIAdd %42 %85 %79
%89 = OpCompositeConstruct %81 %64 %67
%88 = OpImageFetch %75 %58 %89 Lod %70
%90 = OpBitcast %43 %88
%91 = OpCompositeExtract %42 %90 0
%92 = OpCompositeExtract %42 %90 1
%93 = OpIAdd %42 %86 %91
%94 = OpIAdd %42 %87 %92
%97 = OpCompositeConstruct %96 %64 %67 %70
%95 = OpImageFetch %75 %57 %97 Lod %73
%98 = OpBitcast %43 %95
%99 = OpCompositeExtract %42 %98 0
%100 = OpCompositeExtract %42 %98 1
%101 = OpIAdd %42 %93 %99
%102 = OpIAdd %42 %94 %100
%104 = OpCompositeConstruct %96 %64 %67 %70
%103 = OpImageFetch %75 %56 %104 Lod %73
%105 = OpBitcast %43 %103
%106 = OpCompositeExtract %42 %105 0
%107 = OpCompositeExtract %42 %105 1
%108 = OpIAdd %42 %101 %106
%109 = OpIAdd %42 %102 %107
%111 = OpCompositeConstruct %81 %64 %67
%110 = OpImageFetch %75 %55 %111 Sample %70
%112 = OpBitcast %43 %110
%113 = OpCompositeExtract %42 %112 0
%114 = OpCompositeExtract %42 %112 1
%115 = OpIAdd %42 %108 %113
%116 = OpIAdd %42 %109 %114
%118 = OpCompositeConstruct %96 %64 %67 %70
%117 = OpImageFetch %75 %54 %118 Sample %73
%119 = OpBitcast %43 %117
%120 = OpCompositeExtract %42 %119 0
%121 = OpCompositeExtract %42 %119 1
%122 = OpIAdd %42 %115 %120
%123 = OpIAdd %42 %116 %121
%124 = OpImageRead %75 %53 %64 None
%125 = OpBitcast %43 %124
%126 = OpCompositeExtract %42 %125 0
%127 = OpCompositeExtract %42 %125 1
%128 = OpIAdd %42 %122 %126
%129 = OpIAdd %42 %123 %127
%131 = OpCompositeConstruct %81 %64 %67
%130 = OpImageRead %75 %52 %131 None
%132 = OpBitcast %43 %130
%133 = OpCompositeExtract %42 %132 0
%134 = OpCompositeExtract %42 %132 1
%135 = OpIAdd %42 %128 %133
%136 = OpIAdd %42 %129 %134
%138 = OpCompositeConstruct %81 %64 %67
%137 = OpImageRead %75 %51 %138 None
%139 = OpBitcast %43 %137
%140 = OpCompositeExtract %42 %139 0
%141 = OpCompositeExtract %42 %139 1
%142 = OpIAdd %42 %135 %140
%143 = OpIAdd %42 %136 %141
%145 = OpCompositeConstruct %96 %64 %67 %70
%144 = OpImageRead %75 %50 %145 None
%146 = OpBitcast %43 %144
%147 = OpCompositeExtract %42 %146 0
%148 = OpCompositeExtract %42 %146 1
%149 = OpIAdd %42 %142 %147
%150 = OpIAdd %42 %143 %148
%152 = OpCompositeConstruct %96 %64 %67 %70
%151 = OpImageRead %75 %49 %152 None
%153 = OpBitcast %43 %151
%154 = OpCompositeExtract %42 %153 0
%155 = OpCompositeExtract %42 %153 1
%156 = OpIAdd %42 %149 %154
%157 = OpIAdd %42 %150 %155
%159 = OpAccessChain %158 %48 %63
%160 = OpBitcast %5 %156
OpStore %159 %160
%161 = OpAccessChain %158 %48 %66
%162 = OpBitcast %5 %157
OpStore %161 %162
OpReturn
OpFunctionEnd
#endif
