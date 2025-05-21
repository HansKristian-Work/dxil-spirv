#version 460
#extension GL_EXT_samplerless_texture_functions : require

uint _96;
uint _97;
uint _109;
uint _120;
uint _140;
uint _169;

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
    uvec4 _95 = uvec4((LEVEL < _89) ? uint(textureSize(_8, int(LEVEL))) : 0u, _96, _97, _89);
    uint _102 = uint(textureQueryLevels(_11));
    uvec4 _108 = uvec4(mix(uvec2(0u), uvec2(textureSize(_11, int(LEVEL))), bvec2(LEVEL < _102)), _109, _102);
    uint _114 = uint(textureQueryLevels(_14));
    uvec4 _119 = uvec4(mix(uvec2(0u), uvec2(textureSize(_14, int(LEVEL))), bvec2(LEVEL < _114)), _120, _114);
    uint _126 = uint(textureQueryLevels(_17));
    uvec4 _132 = uvec4(mix(uvec3(0u), uvec3(textureSize(_17, int(LEVEL))), bvec3(LEVEL < _126)), _126);
    uvec4 _139 = uvec4(uvec2(textureSize(_20)), _140, uint(textureSamples(_20)));
    uvec4 _146 = uvec4(uvec3(textureSize(_23)), uint(textureSamples(_23)));
    uint _152 = uint(textureQueryLevels(_26));
    uvec4 _157 = uvec4(mix(uvec3(0u), uvec3(textureSize(_26, int(LEVEL))), bvec3(LEVEL < _152)), _152);
    uint _163 = uint(textureQueryLevels(_29));
    uvec4 _168 = uvec4(mix(uvec2(0u), uvec2(textureSize(_29, int(LEVEL))), bvec2(LEVEL < _163)), _169, _163);
    uint _174 = uint(textureQueryLevels(_32));
    uvec4 _179 = uvec4(mix(uvec3(0u), uvec3(textureSize(_32, int(LEVEL))), bvec3(LEVEL < _174)), _174);
    uint _184 = uint(textureSize(_35));
    uint _186 = uint(imageSize(_43));
    uvec2 _188 = uvec2(imageSize(_46));
    uvec2 _191 = uvec2(imageSize(_49));
    uvec3 _194 = uvec3(imageSize(_52));
    uvec3 _198 = uvec3(imageSize(_55));
    uint _202 = uint(imageSize(_58));
    uint _205 = uint(textureSize(_39)) / 4u;
    uint _209 = uint(imageSize(_61)) / 4u;
    uint _212 = uint(textureSize(_40)) * 4u;
    uint _215 = uint(imageSize(_62)) * 4u;
    uint _246 = ((((((((((((((((((((((((((((_95.w + 32u) + _95.x) + _108.y) + _108.x) + _108.w) + _119.y) + _119.x) + _119.w) + _132.y) + _132.x) + _132.z) + _132.w) + _139.y) + _139.x) + _139.w) + _146.y) + _146.x) + _146.z) + _146.w) + _157.y) + _157.x) + _157.z) + _157.w) + _168.y) + _168.x) + _168.w) + _179.y) + _179.x) + _179.z;
    SV_Target = (((((((((((((((((_246 + _179.w) + (_184 * _184)) + (_186 * _186)) + _188.y) + _188.x) + _191.y) + _191.x) + _194.y) + _194.x) + _194.z) + _198.y) + _198.x) + _198.z) + (_202 * _202)) + (_205 * _205)) + (_209 * _209)) + (_212 * _212)) + (_215 * _215);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 267
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
%94 = OpTypeVector %36 4
%100 = OpTypeVector %36 2
%104 = OpTypeVector %90 2
%107 = OpConstantNull %100
%118 = OpConstantNull %100
%124 = OpTypeVector %36 3
%128 = OpTypeVector %90 3
%131 = OpConstantNull %124
%156 = OpConstantNull %124
%167 = OpConstantNull %100
%178 = OpConstantNull %124
%206 = OpConstant %36 4
%218 = OpConstant %36 32
%3 = OpFunction %1 None %2
%4 = OpLabel
%96 = OpUndef %36
%97 = OpUndef %36
%109 = OpUndef %36
%120 = OpUndef %36
%140 = OpUndef %36
%169 = OpUndef %36
OpBranch %265
%265 = OpLabel
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
%95 = OpCompositeConstruct %94 %92 %96 %97 %89
%98 = OpCompositeExtract %36 %95 0
%99 = OpCompositeExtract %36 %95 3
%101 = OpImageQuerySizeLod %100 %85 %87
%102 = OpImageQueryLevels %36 %85
%103 = OpULessThan %90 %87 %102
%105 = OpCompositeConstruct %104 %103 %103
%106 = OpSelect %100 %105 %101 %107
%108 = OpCompositeConstruct %94 %106 %109 %102
%110 = OpCompositeExtract %36 %108 0
%111 = OpCompositeExtract %36 %108 1
%112 = OpCompositeExtract %36 %108 3
%113 = OpImageQuerySizeLod %100 %84 %87
%114 = OpImageQueryLevels %36 %84
%115 = OpULessThan %90 %87 %114
%116 = OpCompositeConstruct %104 %115 %115
%117 = OpSelect %100 %116 %113 %118
%119 = OpCompositeConstruct %94 %117 %120 %114
%121 = OpCompositeExtract %36 %119 0
%122 = OpCompositeExtract %36 %119 1
%123 = OpCompositeExtract %36 %119 3
%125 = OpImageQuerySizeLod %124 %83 %87
%126 = OpImageQueryLevels %36 %83
%127 = OpULessThan %90 %87 %126
%129 = OpCompositeConstruct %128 %127 %127 %127
%130 = OpSelect %124 %129 %125 %131
%132 = OpCompositeConstruct %94 %130 %126
%133 = OpCompositeExtract %36 %132 0
%134 = OpCompositeExtract %36 %132 1
%135 = OpCompositeExtract %36 %132 2
%136 = OpCompositeExtract %36 %132 3
%137 = OpImageQuerySize %100 %82
%138 = OpImageQuerySamples %36 %82
%139 = OpCompositeConstruct %94 %137 %140 %138
%141 = OpCompositeExtract %36 %139 0
%142 = OpCompositeExtract %36 %139 1
%143 = OpCompositeExtract %36 %139 3
%144 = OpImageQuerySize %124 %81
%145 = OpImageQuerySamples %36 %81
%146 = OpCompositeConstruct %94 %144 %145
%147 = OpCompositeExtract %36 %146 0
%148 = OpCompositeExtract %36 %146 1
%149 = OpCompositeExtract %36 %146 2
%150 = OpCompositeExtract %36 %146 3
%151 = OpImageQuerySizeLod %124 %80 %87
%152 = OpImageQueryLevels %36 %80
%153 = OpULessThan %90 %87 %152
%154 = OpCompositeConstruct %128 %153 %153 %153
%155 = OpSelect %124 %154 %151 %156
%157 = OpCompositeConstruct %94 %155 %152
%158 = OpCompositeExtract %36 %157 0
%159 = OpCompositeExtract %36 %157 1
%160 = OpCompositeExtract %36 %157 2
%161 = OpCompositeExtract %36 %157 3
%162 = OpImageQuerySizeLod %100 %79 %87
%163 = OpImageQueryLevels %36 %79
%164 = OpULessThan %90 %87 %163
%165 = OpCompositeConstruct %104 %164 %164
%166 = OpSelect %100 %165 %162 %167
%168 = OpCompositeConstruct %94 %166 %169 %163
%170 = OpCompositeExtract %36 %168 0
%171 = OpCompositeExtract %36 %168 1
%172 = OpCompositeExtract %36 %168 3
%173 = OpImageQuerySizeLod %124 %78 %87
%174 = OpImageQueryLevels %36 %78
%175 = OpULessThan %90 %87 %174
%176 = OpCompositeConstruct %128 %175 %175 %175
%177 = OpSelect %124 %176 %173 %178
%179 = OpCompositeConstruct %94 %177 %174
%180 = OpCompositeExtract %36 %179 0
%181 = OpCompositeExtract %36 %179 1
%182 = OpCompositeExtract %36 %179 2
%183 = OpCompositeExtract %36 %179 3
%184 = OpImageQuerySize %36 %77
%185 = OpIMul %36 %184 %184
%186 = OpImageQuerySize %36 %74
%187 = OpIMul %36 %186 %186
%188 = OpImageQuerySize %100 %73
%189 = OpCompositeExtract %36 %188 0
%190 = OpCompositeExtract %36 %188 1
%191 = OpImageQuerySize %100 %72
%192 = OpCompositeExtract %36 %191 0
%193 = OpCompositeExtract %36 %191 1
%194 = OpImageQuerySize %124 %71
%195 = OpCompositeExtract %36 %194 0
%196 = OpCompositeExtract %36 %194 1
%197 = OpCompositeExtract %36 %194 2
%198 = OpImageQuerySize %124 %70
%199 = OpCompositeExtract %36 %198 0
%200 = OpCompositeExtract %36 %198 1
%201 = OpCompositeExtract %36 %198 2
%202 = OpImageQuerySize %36 %69
%203 = OpIMul %36 %202 %202
%204 = OpImageQuerySize %36 %76
%205 = OpUDiv %36 %204 %206
%207 = OpIMul %36 %205 %205
%208 = OpImageQuerySize %36 %68
%209 = OpUDiv %36 %208 %206
%210 = OpIMul %36 %209 %209
%211 = OpImageQuerySize %36 %75
%212 = OpIMul %36 %211 %206
%213 = OpIMul %36 %212 %212
%214 = OpImageQuerySize %36 %67
%215 = OpIMul %36 %214 %206
%216 = OpIMul %36 %215 %215
%217 = OpIAdd %36 %99 %218
%219 = OpIAdd %36 %217 %98
%220 = OpIAdd %36 %219 %111
%221 = OpIAdd %36 %220 %110
%222 = OpIAdd %36 %221 %112
%223 = OpIAdd %36 %222 %122
%224 = OpIAdd %36 %223 %121
%225 = OpIAdd %36 %224 %123
%226 = OpIAdd %36 %225 %134
%227 = OpIAdd %36 %226 %133
%228 = OpIAdd %36 %227 %135
%229 = OpIAdd %36 %228 %136
%230 = OpIAdd %36 %229 %142
%231 = OpIAdd %36 %230 %141
%232 = OpIAdd %36 %231 %143
%233 = OpIAdd %36 %232 %148
%234 = OpIAdd %36 %233 %147
%235 = OpIAdd %36 %234 %149
%236 = OpIAdd %36 %235 %150
%237 = OpIAdd %36 %236 %159
%238 = OpIAdd %36 %237 %158
%239 = OpIAdd %36 %238 %160
%240 = OpIAdd %36 %239 %161
%241 = OpIAdd %36 %240 %171
%242 = OpIAdd %36 %241 %170
%243 = OpIAdd %36 %242 %172
%244 = OpIAdd %36 %243 %181
%245 = OpIAdd %36 %244 %180
%246 = OpIAdd %36 %245 %182
%247 = OpIAdd %36 %246 %183
%248 = OpIAdd %36 %247 %185
%249 = OpIAdd %36 %248 %187
%250 = OpIAdd %36 %249 %190
%251 = OpIAdd %36 %250 %189
%252 = OpIAdd %36 %251 %193
%253 = OpIAdd %36 %252 %192
%254 = OpIAdd %36 %253 %196
%255 = OpIAdd %36 %254 %195
%256 = OpIAdd %36 %255 %197
%257 = OpIAdd %36 %256 %200
%258 = OpIAdd %36 %257 %199
%259 = OpIAdd %36 %258 %201
%260 = OpIAdd %36 %259 %203
%261 = OpIAdd %36 %260 %207
%262 = OpIAdd %36 %261 %210
%263 = OpIAdd %36 %262 %213
%264 = OpIAdd %36 %263 %216
OpStore %66 %264
OpReturn
OpFunctionEnd
#endif
