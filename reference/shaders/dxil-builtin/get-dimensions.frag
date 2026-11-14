#version 460
#extension GL_EXT_samplerless_texture_functions : require

uint _96;

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
    uint _89 = uint(textureQueryLevels(_8));
    uvec4 _95 = uvec4((LEVEL < _89) ? uint(textureSize(_8, int(LEVEL))) : 0u, _96, _96, _89);
    uint _101 = uint(textureQueryLevels(_11));
    uvec4 _107 = uvec4(mix(uvec2(0u), uvec2(textureSize(_11, int(LEVEL))), bvec2(LEVEL < _101)), _96, _101);
    uint _112 = uint(textureQueryLevels(_14));
    uvec4 _117 = uvec4(mix(uvec2(0u), uvec2(textureSize(_14, int(LEVEL))), bvec2(LEVEL < _112)), _96, _112);
    uint _123 = uint(textureQueryLevels(_17));
    uvec4 _129 = uvec4(mix(uvec3(0u), uvec3(textureSize(_17, int(LEVEL))), bvec3(LEVEL < _123)), _123);
    uvec4 _136 = uvec4(uvec2(textureSize(_20)), _96, uint(textureSamples(_20)));
    uvec4 _142 = uvec4(uvec3(textureSize(_23)), uint(textureSamples(_23)));
    uint _148 = uint(textureQueryLevels(_26));
    uvec4 _153 = uvec4(mix(uvec3(0u), uvec3(textureSize(_26, int(LEVEL))), bvec3(LEVEL < _148)), _148);
    uint _159 = uint(textureQueryLevels(_29));
    uvec4 _164 = uvec4(mix(uvec2(0u), uvec2(textureSize(_29, int(LEVEL))), bvec2(LEVEL < _159)), _96, _159);
    uint _169 = uint(textureQueryLevels(_32));
    uvec4 _174 = uvec4(mix(uvec3(0u), uvec3(textureSize(_32, int(LEVEL))), bvec3(LEVEL < _169)), _169);
    uint _179 = uint(textureSize(_35));
    uint _181 = uint(imageSize(_43));
    uvec2 _183 = uvec2(imageSize(_46));
    uvec2 _186 = uvec2(imageSize(_49));
    uvec3 _189 = uvec3(imageSize(_52));
    uvec3 _193 = uvec3(imageSize(_55));
    uint _197 = uint(imageSize(_58));
    uint _200 = uint(textureSize(_39)) / 4u;
    uint _204 = uint(imageSize(_61)) / 4u;
    uint _207 = uint(textureSize(_40)) * 4u;
    uint _210 = uint(imageSize(_62)) * 4u;
    uint _241 = ((((((((((((((((((((((((((((_95.w + 32u) + _95.x) + _107.y) + _107.x) + _107.w) + _117.y) + _117.x) + _117.w) + _129.y) + _129.x) + _129.z) + _129.w) + _136.y) + _136.x) + _136.w) + _142.y) + _142.x) + _142.z) + _142.w) + _153.y) + _153.x) + _153.z) + _153.w) + _164.y) + _164.x) + _164.w) + _174.y) + _174.x) + _174.z;
    SV_Target = (((((((((((((((((_241 + _174.w) + (_179 * _179)) + (_181 * _181)) + _183.y) + _183.x) + _186.y) + _186.x) + _189.y) + _189.x) + _189.z) + _193.y) + _193.x) + _193.z) + (_197 * _197)) + (_200 * _200)) + (_204 * _204)) + (_207 * _207)) + (_210 * _210);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 261
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpCapability Image1D
OpCapability SampledCubeArray
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability ImageQuery
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %17 %20 %23 %26 %29 %32 %35 %39 %40 %43 %46 %49 %52 %55 %58 %61 %62 %64 %66
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
%94 = OpTypeVector %36 4
%96 = OpUndef %36
%99 = OpTypeVector %36 2
%103 = OpTypeVector %90 2
%106 = OpConstantNull %99
%116 = OpConstantNull %99
%121 = OpTypeVector %36 3
%125 = OpTypeVector %90 3
%128 = OpConstantNull %121
%152 = OpConstantNull %121
%163 = OpConstantNull %99
%173 = OpConstantNull %121
%201 = OpConstant %36 4
%213 = OpConstant %36 32
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %260
%260 = OpLabel
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
%95 = OpCompositeConstruct %94 %92 %96 %96 %89
%97 = OpCompositeExtract %36 %95 0
%98 = OpCompositeExtract %36 %95 3
%100 = OpImageQuerySizeLod %99 %85 %87
%101 = OpImageQueryLevels %36 %85
%102 = OpULessThan %90 %87 %101
%104 = OpCompositeConstruct %103 %102 %102
%105 = OpSelect %99 %104 %100 %106
%107 = OpCompositeConstruct %94 %105 %96 %101
%108 = OpCompositeExtract %36 %107 0
%109 = OpCompositeExtract %36 %107 1
%110 = OpCompositeExtract %36 %107 3
%111 = OpImageQuerySizeLod %99 %84 %87
%112 = OpImageQueryLevels %36 %84
%113 = OpULessThan %90 %87 %112
%114 = OpCompositeConstruct %103 %113 %113
%115 = OpSelect %99 %114 %111 %116
%117 = OpCompositeConstruct %94 %115 %96 %112
%118 = OpCompositeExtract %36 %117 0
%119 = OpCompositeExtract %36 %117 1
%120 = OpCompositeExtract %36 %117 3
%122 = OpImageQuerySizeLod %121 %83 %87
%123 = OpImageQueryLevels %36 %83
%124 = OpULessThan %90 %87 %123
%126 = OpCompositeConstruct %125 %124 %124 %124
%127 = OpSelect %121 %126 %122 %128
%129 = OpCompositeConstruct %94 %127 %123
%130 = OpCompositeExtract %36 %129 0
%131 = OpCompositeExtract %36 %129 1
%132 = OpCompositeExtract %36 %129 2
%133 = OpCompositeExtract %36 %129 3
%134 = OpImageQuerySize %99 %82
%135 = OpImageQuerySamples %36 %82
%136 = OpCompositeConstruct %94 %134 %96 %135
%137 = OpCompositeExtract %36 %136 0
%138 = OpCompositeExtract %36 %136 1
%139 = OpCompositeExtract %36 %136 3
%140 = OpImageQuerySize %121 %81
%141 = OpImageQuerySamples %36 %81
%142 = OpCompositeConstruct %94 %140 %141
%143 = OpCompositeExtract %36 %142 0
%144 = OpCompositeExtract %36 %142 1
%145 = OpCompositeExtract %36 %142 2
%146 = OpCompositeExtract %36 %142 3
%147 = OpImageQuerySizeLod %121 %80 %87
%148 = OpImageQueryLevels %36 %80
%149 = OpULessThan %90 %87 %148
%150 = OpCompositeConstruct %125 %149 %149 %149
%151 = OpSelect %121 %150 %147 %152
%153 = OpCompositeConstruct %94 %151 %148
%154 = OpCompositeExtract %36 %153 0
%155 = OpCompositeExtract %36 %153 1
%156 = OpCompositeExtract %36 %153 2
%157 = OpCompositeExtract %36 %153 3
%158 = OpImageQuerySizeLod %99 %79 %87
%159 = OpImageQueryLevels %36 %79
%160 = OpULessThan %90 %87 %159
%161 = OpCompositeConstruct %103 %160 %160
%162 = OpSelect %99 %161 %158 %163
%164 = OpCompositeConstruct %94 %162 %96 %159
%165 = OpCompositeExtract %36 %164 0
%166 = OpCompositeExtract %36 %164 1
%167 = OpCompositeExtract %36 %164 3
%168 = OpImageQuerySizeLod %121 %78 %87
%169 = OpImageQueryLevels %36 %78
%170 = OpULessThan %90 %87 %169
%171 = OpCompositeConstruct %125 %170 %170 %170
%172 = OpSelect %121 %171 %168 %173
%174 = OpCompositeConstruct %94 %172 %169
%175 = OpCompositeExtract %36 %174 0
%176 = OpCompositeExtract %36 %174 1
%177 = OpCompositeExtract %36 %174 2
%178 = OpCompositeExtract %36 %174 3
%179 = OpImageQuerySize %36 %77
%180 = OpIMul %36 %179 %179
%181 = OpImageQuerySize %36 %74
%182 = OpIMul %36 %181 %181
%183 = OpImageQuerySize %99 %73
%184 = OpCompositeExtract %36 %183 0
%185 = OpCompositeExtract %36 %183 1
%186 = OpImageQuerySize %99 %72
%187 = OpCompositeExtract %36 %186 0
%188 = OpCompositeExtract %36 %186 1
%189 = OpImageQuerySize %121 %71
%190 = OpCompositeExtract %36 %189 0
%191 = OpCompositeExtract %36 %189 1
%192 = OpCompositeExtract %36 %189 2
%193 = OpImageQuerySize %121 %70
%194 = OpCompositeExtract %36 %193 0
%195 = OpCompositeExtract %36 %193 1
%196 = OpCompositeExtract %36 %193 2
%197 = OpImageQuerySize %36 %69
%198 = OpIMul %36 %197 %197
%199 = OpImageQuerySize %36 %76
%200 = OpUDiv %36 %199 %201
%202 = OpIMul %36 %200 %200
%203 = OpImageQuerySize %36 %68
%204 = OpUDiv %36 %203 %201
%205 = OpIMul %36 %204 %204
%206 = OpImageQuerySize %36 %75
%207 = OpIMul %36 %206 %201
%208 = OpIMul %36 %207 %207
%209 = OpImageQuerySize %36 %67
%210 = OpIMul %36 %209 %201
%211 = OpIMul %36 %210 %210
%212 = OpIAdd %36 %98 %213
%214 = OpIAdd %36 %212 %97
%215 = OpIAdd %36 %214 %109
%216 = OpIAdd %36 %215 %108
%217 = OpIAdd %36 %216 %110
%218 = OpIAdd %36 %217 %119
%219 = OpIAdd %36 %218 %118
%220 = OpIAdd %36 %219 %120
%221 = OpIAdd %36 %220 %131
%222 = OpIAdd %36 %221 %130
%223 = OpIAdd %36 %222 %132
%224 = OpIAdd %36 %223 %133
%225 = OpIAdd %36 %224 %138
%226 = OpIAdd %36 %225 %137
%227 = OpIAdd %36 %226 %139
%228 = OpIAdd %36 %227 %144
%229 = OpIAdd %36 %228 %143
%230 = OpIAdd %36 %229 %145
%231 = OpIAdd %36 %230 %146
%232 = OpIAdd %36 %231 %155
%233 = OpIAdd %36 %232 %154
%234 = OpIAdd %36 %233 %156
%235 = OpIAdd %36 %234 %157
%236 = OpIAdd %36 %235 %166
%237 = OpIAdd %36 %236 %165
%238 = OpIAdd %36 %237 %167
%239 = OpIAdd %36 %238 %176
%240 = OpIAdd %36 %239 %175
%241 = OpIAdd %36 %240 %177
%242 = OpIAdd %36 %241 %178
%243 = OpIAdd %36 %242 %180
%244 = OpIAdd %36 %243 %182
%245 = OpIAdd %36 %244 %185
%246 = OpIAdd %36 %245 %184
%247 = OpIAdd %36 %246 %188
%248 = OpIAdd %36 %247 %187
%249 = OpIAdd %36 %248 %191
%250 = OpIAdd %36 %249 %190
%251 = OpIAdd %36 %250 %192
%252 = OpIAdd %36 %251 %195
%253 = OpIAdd %36 %252 %194
%254 = OpIAdd %36 %253 %196
%255 = OpIAdd %36 %254 %198
%256 = OpIAdd %36 %255 %202
%257 = OpIAdd %36 %256 %205
%258 = OpIAdd %36 %257 %208
%259 = OpIAdd %36 %258 %211
OpStore %66 %259
OpReturn
OpFunctionEnd
#endif
