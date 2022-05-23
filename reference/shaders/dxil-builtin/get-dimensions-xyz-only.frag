#version 460
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0) uniform texture1D _8;
layout(set = 0, binding = 1) uniform texture1DArray _11;
layout(set = 0, binding = 2) uniform texture2D _14;
layout(set = 0, binding = 3) uniform texture2DArray _17;
layout(set = 0, binding = 4) uniform texture2DMS _20;
layout(set = 0, binding = 5) uniform texture2DMSArray _23;
layout(set = 0, binding = 6) uniform texture3D _26;
layout(set = 0, binding = 7) uniform textureCube _29;
layout(set = 0, binding = 8) uniform textureCubeArray _32;
layout(set = 0, binding = 9) uniform samplerBuffer _35;
layout(set = 0, binding = 10) uniform usamplerBuffer _39;
layout(set = 0, binding = 11) uniform usamplerBuffer _40;
layout(set = 0, binding = 0) uniform readonly writeonly image1D _43;
layout(set = 0, binding = 1) uniform readonly writeonly image1DArray _46;
layout(set = 0, binding = 2) uniform readonly writeonly image2D _49;
layout(set = 0, binding = 3) uniform readonly writeonly image2DArray _52;
layout(set = 0, binding = 6) uniform readonly writeonly image3D _55;
layout(set = 0, binding = 9) uniform readonly writeonly imageBuffer _58;
layout(set = 0, binding = 10, r32ui) uniform readonly writeonly uimageBuffer _61;
layout(set = 0, binding = 11, r32ui) uniform readonly writeonly uimageBuffer _62;

layout(location = 0) flat in uint LEVEL;
layout(location = 0) out uint SV_Target;

void main()
{
    uvec2 _90 = uvec2(textureSize(_11, int(LEVEL)));
    uvec2 _93 = uvec2(textureSize(_14, int(LEVEL)));
    uvec3 _97 = uvec3(textureSize(_17, int(LEVEL)));
    uvec2 _101 = uvec2(textureSize(_20));
    uvec3 _104 = uvec3(textureSize(_23));
    uvec3 _108 = uvec3(textureSize(_26, int(LEVEL)));
    uvec2 _112 = uvec2(textureSize(_29, int(LEVEL)));
    uvec3 _115 = uvec3(textureSize(_32, int(LEVEL)));
    uint _119 = uint(textureSize(_35));
    uint _121 = uint(imageSize(_43));
    uvec2 _123 = uvec2(imageSize(_46));
    uvec2 _126 = uvec2(imageSize(_49));
    uvec3 _129 = uvec3(imageSize(_52));
    uvec3 _133 = uvec3(imageSize(_55));
    uint _137 = uint(imageSize(_58));
    uint _140 = uint(textureSize(_39)) / 4u;
    uint _144 = uint(imageSize(_61)) / 4u;
    uint _147 = uint(textureSize(_40)) * 4u;
    uint _150 = uint(imageSize(_62)) * 4u;
    uint _180 = (((((((((((((((((((((((((((uint(textureSize(_8, int(LEVEL))) + 32u) + _90.y) + _90.x) + _93.y) + _93.x) + _97.y) + _97.x) + _97.z) + _101.y) + _101.x) + _104.y) + _104.x) + _104.z) + _108.y) + _108.x) + _108.z) + _112.y) + _112.x) + _115.y) + _115.x) + _115.z) + (_119 * _119)) + (_121 * _121)) + _123.y) + _123.x) + _126.y) + _126.x) + _129.y;
    SV_Target = (((((((((_180 + _129.x) + _129.z) + _133.y) + _133.x) + _133.z) + (_137 * _137)) + (_140 * _140)) + (_144 * _144)) + (_147 * _147)) + (_150 * _150);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 193
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpCapability Image1D
OpCapability SampledCubeArray
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability ImageQuery
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %64 %66
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %64 "LEVEL"
OpName %66 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 1
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 2
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 3
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 4
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 5
OpDecorate %26 DescriptorSet 0
OpDecorate %26 Binding 6
OpDecorate %29 DescriptorSet 0
OpDecorate %29 Binding 7
OpDecorate %32 DescriptorSet 0
OpDecorate %32 Binding 8
OpDecorate %35 DescriptorSet 0
OpDecorate %35 Binding 9
OpDecorate %39 DescriptorSet 0
OpDecorate %39 Binding 10
OpDecorate %40 DescriptorSet 0
OpDecorate %40 Binding 11
OpDecorate %43 DescriptorSet 0
OpDecorate %43 Binding 0
OpDecorate %43 NonReadable
OpDecorate %43 NonWritable
OpDecorate %46 DescriptorSet 0
OpDecorate %46 Binding 1
OpDecorate %46 NonReadable
OpDecorate %46 NonWritable
OpDecorate %49 DescriptorSet 0
OpDecorate %49 Binding 2
OpDecorate %49 NonReadable
OpDecorate %49 NonWritable
OpDecorate %52 DescriptorSet 0
OpDecorate %52 Binding 3
OpDecorate %52 NonReadable
OpDecorate %52 NonWritable
OpDecorate %55 DescriptorSet 0
OpDecorate %55 Binding 6
OpDecorate %55 NonReadable
OpDecorate %55 NonWritable
OpDecorate %58 DescriptorSet 0
OpDecorate %58 Binding 9
OpDecorate %58 NonReadable
OpDecorate %58 NonWritable
OpDecorate %61 DescriptorSet 0
OpDecorate %61 Binding 10
OpDecorate %61 NonReadable
OpDecorate %61 NonWritable
OpDecorate %62 DescriptorSet 0
OpDecorate %62 Binding 11
OpDecorate %62 NonReadable
OpDecorate %62 NonWritable
OpDecorate %64 Flat
OpDecorate %64 Location 0
OpDecorate %66 Location 0
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
%18 = OpTypeImage %5 2D 0 0 1 1 Unknown
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeImage %5 2D 0 1 1 1 Unknown
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeImage %5 3D 0 0 0 1 Unknown
%25 = OpTypePointer UniformConstant %24
%26 = OpVariable %25 UniformConstant
%27 = OpTypeImage %5 Cube 0 0 0 1 Unknown
%28 = OpTypePointer UniformConstant %27
%29 = OpVariable %28 UniformConstant
%30 = OpTypeImage %5 Cube 0 1 0 1 Unknown
%31 = OpTypePointer UniformConstant %30
%32 = OpVariable %31 UniformConstant
%33 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%34 = OpTypePointer UniformConstant %33
%35 = OpVariable %34 UniformConstant
%36 = OpTypeInt 32 0
%37 = OpTypeImage %36 Buffer 0 0 0 1 Unknown
%38 = OpTypePointer UniformConstant %37
%39 = OpVariable %38 UniformConstant
%40 = OpVariable %38 UniformConstant
%41 = OpTypeImage %5 1D 0 0 0 2 Unknown
%42 = OpTypePointer UniformConstant %41
%43 = OpVariable %42 UniformConstant
%44 = OpTypeImage %5 1D 0 1 0 2 Unknown
%45 = OpTypePointer UniformConstant %44
%46 = OpVariable %45 UniformConstant
%47 = OpTypeImage %5 2D 0 0 0 2 Unknown
%48 = OpTypePointer UniformConstant %47
%49 = OpVariable %48 UniformConstant
%50 = OpTypeImage %5 2D 0 1 0 2 Unknown
%51 = OpTypePointer UniformConstant %50
%52 = OpVariable %51 UniformConstant
%53 = OpTypeImage %5 3D 0 0 0 2 Unknown
%54 = OpTypePointer UniformConstant %53
%55 = OpVariable %54 UniformConstant
%56 = OpTypeImage %5 Buffer 0 0 0 2 Unknown
%57 = OpTypePointer UniformConstant %56
%58 = OpVariable %57 UniformConstant
%59 = OpTypeImage %36 Buffer 0 0 0 2 R32ui
%60 = OpTypePointer UniformConstant %59
%61 = OpVariable %60 UniformConstant
%62 = OpVariable %60 UniformConstant
%63 = OpTypePointer Input %36
%64 = OpVariable %63 Input
%65 = OpTypePointer Output %36
%66 = OpVariable %65 Output
%89 = OpTypeVector %36 2
%96 = OpTypeVector %36 3
%141 = OpConstant %36 4
%153 = OpConstant %36 32
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %191
%191 = OpLabel
%67 = OpLoad %59 %62
%68 = OpLoad %59 %61
%69 = OpLoad %56 %58
%70 = OpLoad %53 %55
%71 = OpLoad %50 %52
%72 = OpLoad %47 %49
%73 = OpLoad %44 %46
%74 = OpLoad %41 %43
%75 = OpLoad %37 %40
%76 = OpLoad %37 %39
%77 = OpLoad %33 %35
%78 = OpLoad %30 %32
%79 = OpLoad %27 %29
%80 = OpLoad %24 %26
%81 = OpLoad %21 %23
%82 = OpLoad %18 %20
%83 = OpLoad %15 %17
%84 = OpLoad %12 %14
%85 = OpLoad %9 %11
%86 = OpLoad %6 %8
%87 = OpLoad %36 %64
%88 = OpImageQuerySizeLod %36 %86 %87
%90 = OpImageQuerySizeLod %89 %85 %87
%91 = OpCompositeExtract %36 %90 0
%92 = OpCompositeExtract %36 %90 1
%93 = OpImageQuerySizeLod %89 %84 %87
%94 = OpCompositeExtract %36 %93 0
%95 = OpCompositeExtract %36 %93 1
%97 = OpImageQuerySizeLod %96 %83 %87
%98 = OpCompositeExtract %36 %97 0
%99 = OpCompositeExtract %36 %97 1
%100 = OpCompositeExtract %36 %97 2
%101 = OpImageQuerySize %89 %82
%102 = OpCompositeExtract %36 %101 0
%103 = OpCompositeExtract %36 %101 1
%104 = OpImageQuerySize %96 %81
%105 = OpCompositeExtract %36 %104 0
%106 = OpCompositeExtract %36 %104 1
%107 = OpCompositeExtract %36 %104 2
%108 = OpImageQuerySizeLod %96 %80 %87
%109 = OpCompositeExtract %36 %108 0
%110 = OpCompositeExtract %36 %108 1
%111 = OpCompositeExtract %36 %108 2
%112 = OpImageQuerySizeLod %89 %79 %87
%113 = OpCompositeExtract %36 %112 0
%114 = OpCompositeExtract %36 %112 1
%115 = OpImageQuerySizeLod %96 %78 %87
%116 = OpCompositeExtract %36 %115 0
%117 = OpCompositeExtract %36 %115 1
%118 = OpCompositeExtract %36 %115 2
%119 = OpImageQuerySize %36 %77
%120 = OpIMul %36 %119 %119
%121 = OpImageQuerySize %36 %74
%122 = OpIMul %36 %121 %121
%123 = OpImageQuerySize %89 %73
%124 = OpCompositeExtract %36 %123 0
%125 = OpCompositeExtract %36 %123 1
%126 = OpImageQuerySize %89 %72
%127 = OpCompositeExtract %36 %126 0
%128 = OpCompositeExtract %36 %126 1
%129 = OpImageQuerySize %96 %71
%130 = OpCompositeExtract %36 %129 0
%131 = OpCompositeExtract %36 %129 1
%132 = OpCompositeExtract %36 %129 2
%133 = OpImageQuerySize %96 %70
%134 = OpCompositeExtract %36 %133 0
%135 = OpCompositeExtract %36 %133 1
%136 = OpCompositeExtract %36 %133 2
%137 = OpImageQuerySize %36 %69
%138 = OpIMul %36 %137 %137
%139 = OpImageQuerySize %36 %76
%140 = OpUDiv %36 %139 %141
%142 = OpIMul %36 %140 %140
%143 = OpImageQuerySize %36 %68
%144 = OpUDiv %36 %143 %141
%145 = OpIMul %36 %144 %144
%146 = OpImageQuerySize %36 %75
%147 = OpIMul %36 %146 %141
%148 = OpIMul %36 %147 %147
%149 = OpImageQuerySize %36 %67
%150 = OpIMul %36 %149 %141
%151 = OpIMul %36 %150 %150
%152 = OpIAdd %36 %88 %153
%154 = OpIAdd %36 %152 %92
%155 = OpIAdd %36 %154 %91
%156 = OpIAdd %36 %155 %95
%157 = OpIAdd %36 %156 %94
%158 = OpIAdd %36 %157 %99
%159 = OpIAdd %36 %158 %98
%160 = OpIAdd %36 %159 %100
%161 = OpIAdd %36 %160 %103
%162 = OpIAdd %36 %161 %102
%163 = OpIAdd %36 %162 %106
%164 = OpIAdd %36 %163 %105
%165 = OpIAdd %36 %164 %107
%166 = OpIAdd %36 %165 %110
%167 = OpIAdd %36 %166 %109
%168 = OpIAdd %36 %167 %111
%169 = OpIAdd %36 %168 %114
%170 = OpIAdd %36 %169 %113
%171 = OpIAdd %36 %170 %117
%172 = OpIAdd %36 %171 %116
%173 = OpIAdd %36 %172 %118
%174 = OpIAdd %36 %173 %120
%175 = OpIAdd %36 %174 %122
%176 = OpIAdd %36 %175 %125
%177 = OpIAdd %36 %176 %124
%178 = OpIAdd %36 %177 %128
%179 = OpIAdd %36 %178 %127
%180 = OpIAdd %36 %179 %131
%181 = OpIAdd %36 %180 %130
%182 = OpIAdd %36 %181 %132
%183 = OpIAdd %36 %182 %135
%184 = OpIAdd %36 %183 %134
%185 = OpIAdd %36 %184 %136
%186 = OpIAdd %36 %185 %138
%187 = OpIAdd %36 %186 %142
%188 = OpIAdd %36 %187 %145
%189 = OpIAdd %36 %188 %148
%190 = OpIAdd %36 %189 %151
OpStore %66 %190
OpReturn
OpFunctionEnd
#endif
