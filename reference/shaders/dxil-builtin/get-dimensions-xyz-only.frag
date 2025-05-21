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
    uvec2 _100 = mix(uvec2(0u), uvec2(textureSize(_11, int(LEVEL))), bvec2(LEVEL < uint(textureQueryLevels(_11))));
    uvec2 _108 = mix(uvec2(0u), uvec2(textureSize(_14, int(LEVEL))), bvec2(LEVEL < uint(textureQueryLevels(_14))));
    uvec3 _118 = mix(uvec3(0u), uvec3(textureSize(_17, int(LEVEL))), bvec3(LEVEL < uint(textureQueryLevels(_17))));
    uvec2 _123 = uvec2(textureSize(_20));
    uvec3 _126 = uvec3(textureSize(_23));
    uvec3 _134 = mix(uvec3(0u), uvec3(textureSize(_26, int(LEVEL))), bvec3(LEVEL < uint(textureQueryLevels(_26))));
    uvec2 _143 = mix(uvec2(0u), uvec2(textureSize(_29, int(LEVEL))), bvec2(LEVEL < uint(textureQueryLevels(_29))));
    uvec3 _151 = mix(uvec3(0u), uvec3(textureSize(_32, int(LEVEL))), bvec3(LEVEL < uint(textureQueryLevels(_32))));
    uint _156 = uint(textureSize(_35));
    uint _158 = uint(imageSize(_43));
    uvec2 _160 = uvec2(imageSize(_46));
    uvec2 _163 = uvec2(imageSize(_49));
    uvec3 _166 = uvec3(imageSize(_52));
    uvec3 _170 = uvec3(imageSize(_55));
    uint _174 = uint(imageSize(_58));
    uint _177 = uint(textureSize(_39)) / 4u;
    uint _181 = uint(imageSize(_61)) / 4u;
    uint _184 = uint(textureSize(_40)) * 4u;
    uint _187 = uint(imageSize(_62)) * 4u;
    uint _215 = (((((((((((((((((((((((((((LEVEL < uint(textureQueryLevels(_8))) ? uint(textureSize(_8, int(LEVEL))) : 0u) + 32u) + _100.y) + _100.x) + _108.y) + _108.x) + _118.y) + _118.x) + _118.z) + _123.y) + _123.x) + _126.y) + _126.x) + _126.z) + _134.y) + _134.x) + _134.z) + _143.y) + _143.x) + _151.y) + _151.x) + _151.z) + (_156 * _156)) + (_158 * _158)) + _160.y) + _160.x) + _163.y;
    SV_Target = (((((((((((_215 + _163.x) + _166.y) + _166.x) + _166.z) + _170.y) + _170.x) + _170.z) + (_174 * _174)) + (_177 * _177)) + (_181 * _181)) + (_184 * _184)) + (_187 * _187);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 230
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
%90 = OpTypeBool
%93 = OpConstantNull %36
%94 = OpTypeVector %36 2
%98 = OpTypeVector %90 2
%101 = OpConstantNull %94
%109 = OpConstantNull %94
%112 = OpTypeVector %36 3
%116 = OpTypeVector %90 3
%119 = OpConstantNull %112
%135 = OpConstantNull %112
%144 = OpConstantNull %94
%152 = OpConstantNull %112
%178 = OpConstant %36 4
%190 = OpConstant %36 32
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %228
%228 = OpLabel
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
%89 = OpImageQueryLevels %36 %86
%91 = OpULessThan %90 %87 %89
%92 = OpSelect %36 %91 %88 %93
%95 = OpImageQuerySizeLod %94 %85 %87
%96 = OpImageQueryLevels %36 %85
%97 = OpULessThan %90 %87 %96
%99 = OpCompositeConstruct %98 %97 %97
%100 = OpSelect %94 %99 %95 %101
%102 = OpCompositeExtract %36 %100 0
%103 = OpCompositeExtract %36 %100 1
%104 = OpImageQuerySizeLod %94 %84 %87
%105 = OpImageQueryLevels %36 %84
%106 = OpULessThan %90 %87 %105
%107 = OpCompositeConstruct %98 %106 %106
%108 = OpSelect %94 %107 %104 %109
%110 = OpCompositeExtract %36 %108 0
%111 = OpCompositeExtract %36 %108 1
%113 = OpImageQuerySizeLod %112 %83 %87
%114 = OpImageQueryLevels %36 %83
%115 = OpULessThan %90 %87 %114
%117 = OpCompositeConstruct %116 %115 %115 %115
%118 = OpSelect %112 %117 %113 %119
%120 = OpCompositeExtract %36 %118 0
%121 = OpCompositeExtract %36 %118 1
%122 = OpCompositeExtract %36 %118 2
%123 = OpImageQuerySize %94 %82
%124 = OpCompositeExtract %36 %123 0
%125 = OpCompositeExtract %36 %123 1
%126 = OpImageQuerySize %112 %81
%127 = OpCompositeExtract %36 %126 0
%128 = OpCompositeExtract %36 %126 1
%129 = OpCompositeExtract %36 %126 2
%130 = OpImageQuerySizeLod %112 %80 %87
%131 = OpImageQueryLevels %36 %80
%132 = OpULessThan %90 %87 %131
%133 = OpCompositeConstruct %116 %132 %132 %132
%134 = OpSelect %112 %133 %130 %135
%136 = OpCompositeExtract %36 %134 0
%137 = OpCompositeExtract %36 %134 1
%138 = OpCompositeExtract %36 %134 2
%139 = OpImageQuerySizeLod %94 %79 %87
%140 = OpImageQueryLevels %36 %79
%141 = OpULessThan %90 %87 %140
%142 = OpCompositeConstruct %98 %141 %141
%143 = OpSelect %94 %142 %139 %144
%145 = OpCompositeExtract %36 %143 0
%146 = OpCompositeExtract %36 %143 1
%147 = OpImageQuerySizeLod %112 %78 %87
%148 = OpImageQueryLevels %36 %78
%149 = OpULessThan %90 %87 %148
%150 = OpCompositeConstruct %116 %149 %149 %149
%151 = OpSelect %112 %150 %147 %152
%153 = OpCompositeExtract %36 %151 0
%154 = OpCompositeExtract %36 %151 1
%155 = OpCompositeExtract %36 %151 2
%156 = OpImageQuerySize %36 %77
%157 = OpIMul %36 %156 %156
%158 = OpImageQuerySize %36 %74
%159 = OpIMul %36 %158 %158
%160 = OpImageQuerySize %94 %73
%161 = OpCompositeExtract %36 %160 0
%162 = OpCompositeExtract %36 %160 1
%163 = OpImageQuerySize %94 %72
%164 = OpCompositeExtract %36 %163 0
%165 = OpCompositeExtract %36 %163 1
%166 = OpImageQuerySize %112 %71
%167 = OpCompositeExtract %36 %166 0
%168 = OpCompositeExtract %36 %166 1
%169 = OpCompositeExtract %36 %166 2
%170 = OpImageQuerySize %112 %70
%171 = OpCompositeExtract %36 %170 0
%172 = OpCompositeExtract %36 %170 1
%173 = OpCompositeExtract %36 %170 2
%174 = OpImageQuerySize %36 %69
%175 = OpIMul %36 %174 %174
%176 = OpImageQuerySize %36 %76
%177 = OpUDiv %36 %176 %178
%179 = OpIMul %36 %177 %177
%180 = OpImageQuerySize %36 %68
%181 = OpUDiv %36 %180 %178
%182 = OpIMul %36 %181 %181
%183 = OpImageQuerySize %36 %75
%184 = OpIMul %36 %183 %178
%185 = OpIMul %36 %184 %184
%186 = OpImageQuerySize %36 %67
%187 = OpIMul %36 %186 %178
%188 = OpIMul %36 %187 %187
%189 = OpIAdd %36 %92 %190
%191 = OpIAdd %36 %189 %103
%192 = OpIAdd %36 %191 %102
%193 = OpIAdd %36 %192 %111
%194 = OpIAdd %36 %193 %110
%195 = OpIAdd %36 %194 %121
%196 = OpIAdd %36 %195 %120
%197 = OpIAdd %36 %196 %122
%198 = OpIAdd %36 %197 %125
%199 = OpIAdd %36 %198 %124
%200 = OpIAdd %36 %199 %128
%201 = OpIAdd %36 %200 %127
%202 = OpIAdd %36 %201 %129
%203 = OpIAdd %36 %202 %137
%204 = OpIAdd %36 %203 %136
%205 = OpIAdd %36 %204 %138
%206 = OpIAdd %36 %205 %146
%207 = OpIAdd %36 %206 %145
%208 = OpIAdd %36 %207 %154
%209 = OpIAdd %36 %208 %153
%210 = OpIAdd %36 %209 %155
%211 = OpIAdd %36 %210 %157
%212 = OpIAdd %36 %211 %159
%213 = OpIAdd %36 %212 %162
%214 = OpIAdd %36 %213 %161
%215 = OpIAdd %36 %214 %165
%216 = OpIAdd %36 %215 %164
%217 = OpIAdd %36 %216 %168
%218 = OpIAdd %36 %217 %167
%219 = OpIAdd %36 %218 %169
%220 = OpIAdd %36 %219 %172
%221 = OpIAdd %36 %220 %171
%222 = OpIAdd %36 %221 %173
%223 = OpIAdd %36 %222 %175
%224 = OpIAdd %36 %223 %179
%225 = OpIAdd %36 %224 %182
%226 = OpIAdd %36 %225 %185
%227 = OpIAdd %36 %226 %188
OpStore %66 %227
OpReturn
OpFunctionEnd
#endif
