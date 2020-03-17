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

uint _92;
uint _93;
uint _100;
uint _107;
uint _122;
uint _143;
uint _156;
uint _161;
uint _180;
uint _187;
uint _193;
uint _199;
uint _205;

void main()
{
    uvec4 _91 = uvec4(uint(textureSize(_8, int(LEVEL))), _92, _93, uint(textureQueryLevels(_8)));
    uvec4 _99 = uvec4(uvec2(textureSize(_11, int(LEVEL))), _100, uint(textureQueryLevels(_11)));
    uvec4 _106 = uvec4(uvec2(textureSize(_14, int(LEVEL))), _107, uint(textureQueryLevels(_14)));
    uvec4 _114 = uvec4(uvec3(textureSize(_17, int(LEVEL))), uint(textureQueryLevels(_17)));
    uvec4 _121 = uvec4(uvec2(textureSize(_20)), _122, uint(textureSamples(_20)));
    uvec4 _128 = uvec4(uvec3(textureSize(_23)), uint(textureSamples(_23)));
    uvec4 _135 = uvec4(uvec3(textureSize(_26, int(LEVEL))), uint(textureQueryLevels(_26)));
    uvec4 _142 = uvec4(uvec2(textureSize(_29, int(LEVEL))), _143, uint(textureQueryLevels(_29)));
    uvec4 _149 = uvec4(uvec3(textureSize(_32, int(LEVEL))), uint(textureQueryLevels(_32)));
    uvec2 _155 = uvec2(uint(textureSize(_35)), _156);
    uint _157 = _155.x;
    uvec2 _160 = uvec2(uint(imageSize(_43)), _161);
    uint _162 = _160.x;
    uvec2 _164 = uvec2(imageSize(_46));
    uvec2 _167 = uvec2(imageSize(_49));
    uvec3 _170 = uvec3(imageSize(_52));
    uvec3 _174 = uvec3(imageSize(_55));
    uvec2 _179 = uvec2(uint(imageSize(_58)), _180);
    uint _181 = _179.x;
    uvec2 _186 = uvec2(uint(textureSize(_39)) / 4u, _187);
    uint _188 = _186.x;
    uvec2 _192 = uvec2(uint(imageSize(_61)) / 4u, _193);
    uint _194 = _192.x;
    uvec2 _198 = uvec2(uint(textureSize(_40)) * 4u, _199);
    uint _200 = _198.x;
    uvec2 _204 = uvec2(uint(imageSize(_62)) * 4u, _205);
    uint _206 = _204.x;
    SV_Target = ((((((((((((((((((((((((((((((((((((((((((((((_91.w + 32u) + _91.x) + _99.y) + _99.x) + _99.w) + _106.y) + _106.x) + _106.w) + _114.y) + _114.x) + _114.z) + _114.w) + _121.y) + _121.x) + _121.w) + _128.y) + _128.x) + _128.z) + _128.w) + _135.y) + _135.x) + _135.z) + _135.w) + _142.y) + _142.x) + _142.w) + _149.y) + _149.x) + _149.z) + _149.w) + (_157 * _157)) + (_162 * _162)) + _164.y) + _164.x) + _167.y) + _167.x) + _170.y) + _170.x) + _170.z) + _174.y) + _174.x) + _174.z) + (_181 * _181)) + (_188 * _188)) + (_194 * _194)) + (_200 * _200)) + (_206 * _206);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 258
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
%90 = OpTypeVector %36 4
%96 = OpTypeVector %36 2
%111 = OpTypeVector %36 3
%185 = OpConstant %36 4
%209 = OpConstant %36 32
%3 = OpFunction %1 None %2
%4 = OpLabel
%92 = OpUndef %36
%93 = OpUndef %36
%100 = OpUndef %36
%107 = OpUndef %36
%122 = OpUndef %36
%143 = OpUndef %36
%156 = OpUndef %36
%161 = OpUndef %36
%180 = OpUndef %36
%187 = OpUndef %36
%193 = OpUndef %36
%199 = OpUndef %36
%205 = OpUndef %36
OpBranch %256
%256 = OpLabel
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
%91 = OpCompositeConstruct %90 %88 %92 %93 %89
%94 = OpCompositeExtract %36 %91 0
%95 = OpCompositeExtract %36 %91 3
%97 = OpImageQuerySizeLod %96 %85 %87
%98 = OpImageQueryLevels %36 %85
%99 = OpCompositeConstruct %90 %97 %100 %98
%101 = OpCompositeExtract %36 %99 0
%102 = OpCompositeExtract %36 %99 1
%103 = OpCompositeExtract %36 %99 3
%104 = OpImageQuerySizeLod %96 %84 %87
%105 = OpImageQueryLevels %36 %84
%106 = OpCompositeConstruct %90 %104 %107 %105
%108 = OpCompositeExtract %36 %106 0
%109 = OpCompositeExtract %36 %106 1
%110 = OpCompositeExtract %36 %106 3
%112 = OpImageQuerySizeLod %111 %83 %87
%113 = OpImageQueryLevels %36 %83
%114 = OpCompositeConstruct %90 %112 %113
%115 = OpCompositeExtract %36 %114 0
%116 = OpCompositeExtract %36 %114 1
%117 = OpCompositeExtract %36 %114 2
%118 = OpCompositeExtract %36 %114 3
%119 = OpImageQuerySize %96 %82
%120 = OpImageQuerySamples %36 %82
%121 = OpCompositeConstruct %90 %119 %122 %120
%123 = OpCompositeExtract %36 %121 0
%124 = OpCompositeExtract %36 %121 1
%125 = OpCompositeExtract %36 %121 3
%126 = OpImageQuerySize %111 %81
%127 = OpImageQuerySamples %36 %81
%128 = OpCompositeConstruct %90 %126 %127
%129 = OpCompositeExtract %36 %128 0
%130 = OpCompositeExtract %36 %128 1
%131 = OpCompositeExtract %36 %128 2
%132 = OpCompositeExtract %36 %128 3
%133 = OpImageQuerySizeLod %111 %80 %87
%134 = OpImageQueryLevels %36 %80
%135 = OpCompositeConstruct %90 %133 %134
%136 = OpCompositeExtract %36 %135 0
%137 = OpCompositeExtract %36 %135 1
%138 = OpCompositeExtract %36 %135 2
%139 = OpCompositeExtract %36 %135 3
%140 = OpImageQuerySizeLod %96 %79 %87
%141 = OpImageQueryLevels %36 %79
%142 = OpCompositeConstruct %90 %140 %143 %141
%144 = OpCompositeExtract %36 %142 0
%145 = OpCompositeExtract %36 %142 1
%146 = OpCompositeExtract %36 %142 3
%147 = OpImageQuerySizeLod %111 %78 %87
%148 = OpImageQueryLevels %36 %78
%149 = OpCompositeConstruct %90 %147 %148
%150 = OpCompositeExtract %36 %149 0
%151 = OpCompositeExtract %36 %149 1
%152 = OpCompositeExtract %36 %149 2
%153 = OpCompositeExtract %36 %149 3
%154 = OpImageQuerySize %36 %77
%155 = OpCompositeConstruct %96 %154 %156
%157 = OpCompositeExtract %36 %155 0
%158 = OpIMul %36 %157 %157
%159 = OpImageQuerySize %36 %74
%160 = OpCompositeConstruct %96 %159 %161
%162 = OpCompositeExtract %36 %160 0
%163 = OpIMul %36 %162 %162
%164 = OpImageQuerySize %96 %73
%165 = OpCompositeExtract %36 %164 0
%166 = OpCompositeExtract %36 %164 1
%167 = OpImageQuerySize %96 %72
%168 = OpCompositeExtract %36 %167 0
%169 = OpCompositeExtract %36 %167 1
%170 = OpImageQuerySize %111 %71
%171 = OpCompositeExtract %36 %170 0
%172 = OpCompositeExtract %36 %170 1
%173 = OpCompositeExtract %36 %170 2
%174 = OpImageQuerySize %111 %70
%175 = OpCompositeExtract %36 %174 0
%176 = OpCompositeExtract %36 %174 1
%177 = OpCompositeExtract %36 %174 2
%178 = OpImageQuerySize %36 %69
%179 = OpCompositeConstruct %96 %178 %180
%181 = OpCompositeExtract %36 %179 0
%182 = OpIMul %36 %181 %181
%183 = OpImageQuerySize %36 %76
%184 = OpUDiv %36 %183 %185
%186 = OpCompositeConstruct %96 %184 %187
%188 = OpCompositeExtract %36 %186 0
%189 = OpIMul %36 %188 %188
%190 = OpImageQuerySize %36 %68
%191 = OpUDiv %36 %190 %185
%192 = OpCompositeConstruct %96 %191 %193
%194 = OpCompositeExtract %36 %192 0
%195 = OpIMul %36 %194 %194
%196 = OpImageQuerySize %36 %75
%197 = OpIMul %36 %196 %185
%198 = OpCompositeConstruct %96 %197 %199
%200 = OpCompositeExtract %36 %198 0
%201 = OpIMul %36 %200 %200
%202 = OpImageQuerySize %36 %67
%203 = OpIMul %36 %202 %185
%204 = OpCompositeConstruct %96 %203 %205
%206 = OpCompositeExtract %36 %204 0
%207 = OpIMul %36 %206 %206
%208 = OpIAdd %36 %95 %209
%210 = OpIAdd %36 %208 %94
%211 = OpIAdd %36 %210 %102
%212 = OpIAdd %36 %211 %101
%213 = OpIAdd %36 %212 %103
%214 = OpIAdd %36 %213 %109
%215 = OpIAdd %36 %214 %108
%216 = OpIAdd %36 %215 %110
%217 = OpIAdd %36 %216 %116
%218 = OpIAdd %36 %217 %115
%219 = OpIAdd %36 %218 %117
%220 = OpIAdd %36 %219 %118
%221 = OpIAdd %36 %220 %124
%222 = OpIAdd %36 %221 %123
%223 = OpIAdd %36 %222 %125
%224 = OpIAdd %36 %223 %130
%225 = OpIAdd %36 %224 %129
%226 = OpIAdd %36 %225 %131
%227 = OpIAdd %36 %226 %132
%228 = OpIAdd %36 %227 %137
%229 = OpIAdd %36 %228 %136
%230 = OpIAdd %36 %229 %138
%231 = OpIAdd %36 %230 %139
%232 = OpIAdd %36 %231 %145
%233 = OpIAdd %36 %232 %144
%234 = OpIAdd %36 %233 %146
%235 = OpIAdd %36 %234 %151
%236 = OpIAdd %36 %235 %150
%237 = OpIAdd %36 %236 %152
%238 = OpIAdd %36 %237 %153
%239 = OpIAdd %36 %238 %158
%240 = OpIAdd %36 %239 %163
%241 = OpIAdd %36 %240 %166
%242 = OpIAdd %36 %241 %165
%243 = OpIAdd %36 %242 %169
%244 = OpIAdd %36 %243 %168
%245 = OpIAdd %36 %244 %172
%246 = OpIAdd %36 %245 %171
%247 = OpIAdd %36 %246 %173
%248 = OpIAdd %36 %247 %176
%249 = OpIAdd %36 %248 %175
%250 = OpIAdd %36 %249 %177
%251 = OpIAdd %36 %250 %182
%252 = OpIAdd %36 %251 %189
%253 = OpIAdd %36 %252 %195
%254 = OpIAdd %36 %253 %201
%255 = OpIAdd %36 %254 %207
OpStore %66 %255
OpReturn
OpFunctionEnd
#endif
