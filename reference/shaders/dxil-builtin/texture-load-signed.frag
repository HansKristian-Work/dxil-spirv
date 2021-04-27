#version 460
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 1) uniform itexture1D _8;
layout(set = 0, binding = 2) uniform itexture1DArray _11;
layout(set = 0, binding = 3) uniform itexture2D _14;
layout(set = 0, binding = 4) uniform itexture2DArray _17;
layout(set = 0, binding = 5) uniform itexture3D _20;
layout(set = 0, binding = 6) uniform itexture2DMS _23;
layout(set = 0, binding = 7) uniform itexture2DMSArray _26;
layout(set = 0, binding = 1, r32i) uniform readonly iimage1D _29;
layout(set = 0, binding = 2, r32i) uniform readonly iimage1DArray _32;
layout(set = 0, binding = 3, r32i) uniform readonly iimage2D _35;
layout(set = 0, binding = 4, r32i) uniform readonly iimage2DArray _38;
layout(set = 0, binding = 5, r32i) uniform readonly iimage3D _41;

layout(location = 0) flat in uvec4 TEXCOORD;
layout(location = 0) out ivec2 SV_Target;

void main()
{
    uvec4 _76 = uvec4(texelFetch(_8, int(TEXCOORD.x), int(TEXCOORD.y)));
    uvec4 _82 = uvec4(texelFetch(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z)));
    uvec4 _89 = uvec4(texelFetch(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z)));
    uvec4 _97 = uvec4(texelFetch(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w)));
    uvec4 _104 = uvec4(texelFetch(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w)));
    uvec4 _111 = uvec4(texelFetch(_23, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), TEXCOORD.z));
    uvec4 _118 = uvec4(texelFetch(_26, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), TEXCOORD.w));
    uvec4 _124 = uvec4(imageLoad(_29, int(TEXCOORD.x)));
    uvec4 _131 = uvec4(imageLoad(_32, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y))));
    uvec4 _138 = uvec4(imageLoad(_35, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y))));
    uvec4 _145 = uvec4(imageLoad(_38, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z))));
    uvec4 _152 = uvec4(imageLoad(_41, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z))));
    SV_Target.x = int(((((((((((_82.x + _76.x) + _89.x) + _97.x) + _104.x) + _111.x) + _118.x) + _124.x) + _131.x) + _138.x) + _145.x) + _152.x);
    SV_Target.y = int(((((((((((_82.y + _76.y) + _89.y) + _97.y) + _104.y) + _111.y) + _118.y) + _124.y) + _131.y) + _138.y) + _145.y) + _152.y);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 164
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
%27 = OpTypeImage %5 1D 0 0 0 2 R32i
%28 = OpTypePointer UniformConstant %27
%29 = OpVariable %28 UniformConstant
%30 = OpTypeImage %5 1D 0 1 0 2 R32i
%31 = OpTypePointer UniformConstant %30
%32 = OpVariable %31 UniformConstant
%33 = OpTypeImage %5 2D 0 0 0 2 R32i
%34 = OpTypePointer UniformConstant %33
%35 = OpVariable %34 UniformConstant
%36 = OpTypeImage %5 2D 0 1 0 2 R32i
%37 = OpTypePointer UniformConstant %36
%38 = OpVariable %37 UniformConstant
%39 = OpTypeImage %5 3D 0 0 0 2 R32i
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
%80 = OpTypeVector %42 2
%95 = OpTypeVector %42 3
%157 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %162
%162 = OpLabel
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
%76 = OpBitcast %43 %75
%77 = OpCompositeExtract %42 %76 0
%78 = OpCompositeExtract %42 %76 1
%81 = OpCompositeConstruct %80 %64 %67
%79 = OpImageFetch %74 %59 %81 Lod %70
%82 = OpBitcast %43 %79
%83 = OpCompositeExtract %42 %82 0
%84 = OpCompositeExtract %42 %82 1
%85 = OpIAdd %42 %83 %77
%86 = OpIAdd %42 %84 %78
%88 = OpCompositeConstruct %80 %64 %67
%87 = OpImageFetch %74 %58 %88 Lod %70
%89 = OpBitcast %43 %87
%90 = OpCompositeExtract %42 %89 0
%91 = OpCompositeExtract %42 %89 1
%92 = OpIAdd %42 %85 %90
%93 = OpIAdd %42 %86 %91
%96 = OpCompositeConstruct %95 %64 %67 %70
%94 = OpImageFetch %74 %57 %96 Lod %73
%97 = OpBitcast %43 %94
%98 = OpCompositeExtract %42 %97 0
%99 = OpCompositeExtract %42 %97 1
%100 = OpIAdd %42 %92 %98
%101 = OpIAdd %42 %93 %99
%103 = OpCompositeConstruct %95 %64 %67 %70
%102 = OpImageFetch %74 %56 %103 Lod %73
%104 = OpBitcast %43 %102
%105 = OpCompositeExtract %42 %104 0
%106 = OpCompositeExtract %42 %104 1
%107 = OpIAdd %42 %100 %105
%108 = OpIAdd %42 %101 %106
%110 = OpCompositeConstruct %80 %64 %67
%109 = OpImageFetch %74 %55 %110 Sample %70
%111 = OpBitcast %43 %109
%112 = OpCompositeExtract %42 %111 0
%113 = OpCompositeExtract %42 %111 1
%114 = OpIAdd %42 %107 %112
%115 = OpIAdd %42 %108 %113
%117 = OpCompositeConstruct %95 %64 %67 %70
%116 = OpImageFetch %74 %54 %117 Sample %73
%118 = OpBitcast %43 %116
%119 = OpCompositeExtract %42 %118 0
%120 = OpCompositeExtract %42 %118 1
%121 = OpIAdd %42 %114 %119
%122 = OpIAdd %42 %115 %120
%123 = OpImageRead %74 %53 %64 None
%124 = OpBitcast %43 %123
%125 = OpCompositeExtract %42 %124 0
%126 = OpCompositeExtract %42 %124 1
%127 = OpIAdd %42 %121 %125
%128 = OpIAdd %42 %122 %126
%130 = OpCompositeConstruct %80 %64 %67
%129 = OpImageRead %74 %52 %130 None
%131 = OpBitcast %43 %129
%132 = OpCompositeExtract %42 %131 0
%133 = OpCompositeExtract %42 %131 1
%134 = OpIAdd %42 %127 %132
%135 = OpIAdd %42 %128 %133
%137 = OpCompositeConstruct %80 %64 %67
%136 = OpImageRead %74 %51 %137 None
%138 = OpBitcast %43 %136
%139 = OpCompositeExtract %42 %138 0
%140 = OpCompositeExtract %42 %138 1
%141 = OpIAdd %42 %134 %139
%142 = OpIAdd %42 %135 %140
%144 = OpCompositeConstruct %95 %64 %67 %70
%143 = OpImageRead %74 %50 %144 None
%145 = OpBitcast %43 %143
%146 = OpCompositeExtract %42 %145 0
%147 = OpCompositeExtract %42 %145 1
%148 = OpIAdd %42 %141 %146
%149 = OpIAdd %42 %142 %147
%151 = OpCompositeConstruct %95 %64 %67 %70
%150 = OpImageRead %74 %49 %151 None
%152 = OpBitcast %43 %150
%153 = OpCompositeExtract %42 %152 0
%154 = OpCompositeExtract %42 %152 1
%155 = OpIAdd %42 %148 %153
%156 = OpIAdd %42 %149 %154
%158 = OpAccessChain %157 %48 %63
%159 = OpBitcast %5 %155
OpStore %158 %159
%160 = OpAccessChain %157 %48 %66
%161 = OpBitcast %5 %156
OpStore %160 %161
OpReturn
OpFunctionEnd
#endif
