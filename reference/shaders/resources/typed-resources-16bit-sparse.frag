#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#extension GL_ARB_sparse_texture2 : require
#extension GL_ARB_sparse_texture_clamp : require
#extension GL_EXT_samplerless_texture_functions : require

struct SparseTexel
{
    uint _m0;
    vec4 _m1;
};

struct _74
{
    float16_t _m0;
    float16_t _m1;
    float16_t _m2;
    float16_t _m3;
    uint _m4;
};

struct SparseTexel_1
{
    uint _m0;
    ivec4 _m1;
};

struct _98
{
    uint16_t _m0;
    uint16_t _m1;
    uint16_t _m2;
    uint16_t _m3;
    uint _m4;
};

struct SparseTexel_2
{
    uint _m0;
    uvec4 _m1;
};

struct SparseTexel_3
{
    uint _m0;
    float _m1;
};

struct _204
{
    float _m0;
    float _m1;
    float _m2;
    float _m3;
    uint _m4;
};

layout(set = 0, binding = 0) uniform mediump texture2D _8;
layout(set = 0, binding = 1) uniform mediump itexture2D _12;
layout(set = 0, binding = 2) uniform mediump utexture2D _16;
layout(set = 0, binding = 3) uniform mediump samplerBuffer _19;
layout(set = 0, binding = 4) uniform mediump isamplerBuffer _22;
layout(set = 0, binding = 5) uniform mediump usamplerBuffer _25;
layout(set = 0, binding = 0) uniform sampler _28;
layout(set = 0, binding = 1) uniform samplerShadow _29;

layout(location = 0) in vec2 UV;
layout(location = 0) out mediump vec4 SV_Target;
layout(location = 1) out mediump ivec4 SV_Target_1;
layout(location = 2) out mediump uvec4 SV_Target_2;
layout(location = 3) out uint SV_Target_3;

void main()
{
    uint _422;
    vec4 _423;
    _422 = sparseTextureClampARB(sampler2D(_8, _28), vec2(UV.x, UV.y), 0.0, _423);
    SparseTexel _63 = SparseTexel(_422, _423);
    f16vec4 _69 = f16vec4(_63._m1);
    _74 _75 = _74(_69.x, _69.y, _69.z, _69.w, _63._m0);
    uint _424;
    ivec4 _425;
    _424 = sparseTexelFetchARB(_12, ivec2(uvec2(1u, 2u)), int(3u), _425);
    SparseTexel_1 _86 = SparseTexel_1(_424, _425);
    u16vec4 _93 = u16vec4(_86._m1);
    _98 _99 = _98(_93.x, _93.y, _93.z, _93.w, _86._m0);
    uint _426;
    uvec4 _427;
    _426 = sparseTexelFetchARB(_16, ivec2(uvec2(4u, 5u)), int(6u), _427);
    SparseTexel_2 _111 = SparseTexel_2(_426, _427);
    u16vec4 _115 = u16vec4(_111._m1);
    _98 _120 = _98(_115.x, _115.y, _115.z, _115.w, _111._m0);
    uint _428;
    vec4 _429;
    _428 = sparseTextureGatherARB(sampler2D(_8, _28), vec2(UV.x, UV.y), _429);
    SparseTexel _129 = SparseTexel(_428, _429);
    f16vec4 _132 = f16vec4(_129._m1);
    _74 _137 = _74(_132.x, _132.y, _132.z, _132.w, _129._m0);
    uint _430;
    ivec4 _431;
    _430 = sparseTextureGatherARB(isampler2D(_12, _28), vec2(UV.x, UV.y), _431, int(1u));
    SparseTexel_1 _152 = SparseTexel_1(_430, _431);
    u16vec4 _155 = u16vec4(_152._m1);
    _98 _160 = _98(_155.x, _155.y, _155.z, _155.w, _152._m0);
    uint _432;
    uvec4 _433;
    _432 = sparseTextureGatherARB(usampler2D(_16, _28), vec2(UV.x, UV.y), _433, int(2u));
    SparseTexel_2 _175 = SparseTexel_2(_432, _433);
    u16vec4 _178 = u16vec4(_175._m1);
    _98 _183 = _98(_178.x, _178.y, _178.z, _178.w, _175._m0);
    uint _434;
    float _435;
    _434 = sparseTextureClampARB(sampler2DShadow(_8, _29), vec3(vec2(UV.x, UV.y), 0.5), 0.0, _435);
    SparseTexel_3 _200 = SparseTexel_3(_434, _435);
    mediump float _203 = _200._m1;
    _204 _205 = _204(_203, _203, _203, _203, _200._m0);
    mediump float _206 = _205._m0;
    uint _436;
    float _437;
    _436 = sparseTextureLodARB(sampler2DShadow(_8, _29), vec3(vec2(UV.x, UV.y), 0.5), 0.0, _437);
    SparseTexel_3 _222 = SparseTexel_3(_436, _437);
    mediump float _225 = _222._m1;
    _204 _226 = _204(_225, _225, _225, _225, _222._m0);
    mediump float _227 = _226._m0;
    vec2 _243 = vec2(UV.x, UV.y);
    uint _438;
    vec4 _439;
    _438 = sparseTextureGatherARB(sampler2DShadow(_8, _29), _243, 0.5, _439);
    SparseTexel _244 = SparseTexel(_438, _439);
    f16vec4 _247 = f16vec4(_244._m1);
    _74 _252 = _74(_247.x, _247.y, _247.z, _247.w, _244._m0);
    uint _440;
    vec4 _441;
    _440 = sparseTextureLodARB(sampler2D(_8, _28), vec2(UV.x, UV.y), 0.0, _441);
    SparseTexel _264 = SparseTexel(_440, _441);
    f16vec4 _268 = f16vec4(_264._m1);
    _74 _273 = _74(_268.x, _268.y, _268.z, _268.w, _264._m0);
    uint _442;
    vec4 _443;
    _442 = sparseTextureGradClampARB(sampler2D(_8, _28), vec2(UV.x, UV.y), vec2(0.20000000298023223876953125, 0.300000011920928955078125), vec2(0.4000000059604644775390625, 0.5), 0.0, _443);
    SparseTexel _288 = SparseTexel(_442, _443);
    f16vec4 _294 = f16vec4(_288._m1);
    _74 _299 = _74(_294.x, _294.y, _294.z, _294.w, _288._m0);
    uint _444;
    vec4 _445;
    _444 = sparseTextureClampARB(sampler2D(_8, _28), vec2(UV.x, UV.y), 0.0, _445, 0.5);
    SparseTexel _311 = SparseTexel(_444, _445);
    f16vec4 _315 = f16vec4(_311._m1);
    _74 _320 = _74(_315.x, _315.y, _315.z, _315.w, _311._m0);
    uint _332 = uint(int(UV.x));
    uint _446;
    vec4 _447;
    _446 = sparseTexelFetchARB(_19, int(_332), _447);
    SparseTexel _333 = SparseTexel(_446, _447);
    f16vec4 _336 = f16vec4(_333._m1);
    _74 _341 = _74(_336.x, _336.y, _336.z, _336.w, _333._m0);
    uint _448;
    ivec4 _449;
    _448 = sparseTexelFetchARB(_22, int(_332), _449);
    SparseTexel_1 _353 = SparseTexel_1(_448, _449);
    u16vec4 _356 = u16vec4(_353._m1);
    _98 _361 = _98(_356.x, _356.y, _356.z, _356.w, _353._m0);
    uint _450;
    uvec4 _451;
    _450 = sparseTexelFetchARB(_25, int(_332), _451);
    SparseTexel_2 _373 = SparseTexel_2(_450, _451);
    u16vec4 _376 = u16vec4(_373._m1);
    _98 _381 = _98(_376.x, _376.y, _376.z, _376.w, _373._m0);
    SV_Target.x = float(((((_252._m0 + float16_t(_227 + float(float16_t(_206 + float(_137._m0 + _75._m0))))) + _273._m0) + _299._m0) + _320._m0) + _341._m0);
    SV_Target.y = float(((((_252._m1 + float16_t(_227 + float(float16_t(_206 + float(_137._m1 + _75._m1))))) + _273._m1) + _299._m1) + _320._m1) + _341._m1);
    SV_Target.z = float(((((_252._m2 + float16_t(_227 + float(float16_t(_206 + float(_137._m2 + _75._m2))))) + _273._m2) + _299._m2) + _320._m2) + _341._m2);
    SV_Target.w = float(((((_252._m3 + float16_t(_227 + float(float16_t(_206 + float(_137._m3 + _75._m3))))) + _273._m3) + _299._m3) + _320._m3) + _341._m3);
    SV_Target_1.x = int(int16_t((_160._m0 + _99._m0) + _361._m0));
    SV_Target_1.y = int(int16_t((_160._m1 + _99._m1) + _361._m1));
    SV_Target_1.z = int(int16_t((_160._m2 + _99._m2) + _361._m2));
    SV_Target_1.w = int(int16_t((_160._m3 + _99._m3) + _361._m3));
    SV_Target_2.x = uint((_183._m0 + _120._m0) + _381._m0);
    SV_Target_2.y = uint((_183._m1 + _120._m1) + _381._m1);
    SV_Target_2.z = uint((_183._m2 + _120._m2) + _381._m2);
    SV_Target_2.w = uint((_183._m3 + _120._m3) + _381._m3);
    SV_Target_3 = uint((((((((((((((sparseTexelsResidentARB(int(_75._m4)) || sparseTexelsResidentARB(int(_99._m4))) || sparseTexelsResidentARB(int(_120._m4))) || sparseTexelsResidentARB(int(_137._m4))) || sparseTexelsResidentARB(int(_160._m4))) || sparseTexelsResidentARB(int(_183._m4))) || sparseTexelsResidentARB(int(_205._m4))) || sparseTexelsResidentARB(int(_226._m4))) || sparseTexelsResidentARB(int(_252._m4))) || sparseTexelsResidentARB(int(_273._m4))) || sparseTexelsResidentARB(int(_299._m4))) || sparseTexelsResidentARB(int(_320._m4))) || sparseTexelsResidentARB(int(_341._m4))) || sparseTexelsResidentARB(int(_361._m4))) || sparseTexelsResidentARB(int(_381._m4)));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 422
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability SparseResidency
OpCapability MinLod
OpCapability SampledBuffer
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %32 %35 %38 %41 %43
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %32 "UV"
OpName %35 "SV_Target"
OpName %38 "SV_Target_1"
OpName %41 "SV_Target_2"
OpName %43 "SV_Target_3"
OpName %62 "SparseTexel"
OpName %74 ""
OpName %85 "SparseTexel"
OpName %98 ""
OpName %110 "SparseTexel"
OpName %199 "SparseTexel"
OpName %204 ""
OpDecorate %8 RelaxedPrecision
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %12 RelaxedPrecision
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 1
OpDecorate %16 RelaxedPrecision
OpDecorate %16 DescriptorSet 0
OpDecorate %16 Binding 2
OpDecorate %19 RelaxedPrecision
OpDecorate %19 DescriptorSet 0
OpDecorate %19 Binding 3
OpDecorate %22 RelaxedPrecision
OpDecorate %22 DescriptorSet 0
OpDecorate %22 Binding 4
OpDecorate %25 RelaxedPrecision
OpDecorate %25 DescriptorSet 0
OpDecorate %25 Binding 5
OpDecorate %28 DescriptorSet 0
OpDecorate %28 Binding 0
OpDecorate %29 DescriptorSet 0
OpDecorate %29 Binding 1
OpDecorate %32 Location 0
OpDecorate %35 RelaxedPrecision
OpDecorate %35 Location 0
OpDecorate %38 RelaxedPrecision
OpDecorate %38 Location 1
OpDecorate %41 RelaxedPrecision
OpDecorate %41 Location 2
OpDecorate %43 Location 3
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 1
%10 = OpTypeImage %9 2D 0 0 0 1 Unknown
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpTypeInt 32 0
%14 = OpTypeImage %13 2D 0 0 0 1 Unknown
%15 = OpTypePointer UniformConstant %14
%16 = OpVariable %15 UniformConstant
%17 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%18 = OpTypePointer UniformConstant %17
%19 = OpVariable %18 UniformConstant
%20 = OpTypeImage %9 Buffer 0 0 0 1 Unknown
%21 = OpTypePointer UniformConstant %20
%22 = OpVariable %21 UniformConstant
%23 = OpTypeImage %13 Buffer 0 0 0 1 Unknown
%24 = OpTypePointer UniformConstant %23
%25 = OpVariable %24 UniformConstant
%26 = OpTypeSampler
%27 = OpTypePointer UniformConstant %26
%28 = OpVariable %27 UniformConstant
%29 = OpVariable %27 UniformConstant
%30 = OpTypeVector %5 2
%31 = OpTypePointer Input %30
%32 = OpVariable %31 Input
%33 = OpTypeVector %5 4
%34 = OpTypePointer Output %33
%35 = OpVariable %34 Output
%36 = OpTypeVector %9 4
%37 = OpTypePointer Output %36
%38 = OpVariable %37 Output
%39 = OpTypeVector %13 4
%40 = OpTypePointer Output %39
%41 = OpVariable %40 Output
%42 = OpTypePointer Output %13
%43 = OpVariable %42 Output
%52 = OpTypePointer Input %5
%54 = OpConstant %13 0
%57 = OpConstant %13 1
%59 = OpTypeSampledImage %6
%61 = OpConstant %5 0
%62 = OpTypeStruct %13 %33
%67 = OpTypeFloat 16
%68 = OpTypeVector %67 4
%74 = OpTypeStruct %67 %67 %67 %67 %13
%81 = OpTypeBool
%83 = OpConstant %13 3
%84 = OpConstant %13 2
%85 = OpTypeStruct %13 %36
%87 = OpTypeVector %13 2
%91 = OpTypeInt 16 0
%92 = OpTypeVector %91 4
%98 = OpTypeStruct %91 %91 %91 %91 %13
%107 = OpConstant %13 6
%108 = OpConstant %13 4
%109 = OpConstant %13 5
%110 = OpTypeStruct %13 %39
%149 = OpTypeSampledImage %10
%172 = OpTypeSampledImage %14
%195 = OpTypeImage %5 2D 1 0 0 1 Unknown
%196 = OpTypeSampledImage %195
%198 = OpConstant %5 0.5
%199 = OpTypeStruct %13 %5
%204 = OpTypeStruct %5 %5 %5 %5 %13
%285 = OpConstant %5 0.200000003
%286 = OpConstant %5 0.300000012
%287 = OpConstant %5 0.400000006
%394 = OpTypePointer Output %5
%403 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %420
%420 = OpLabel
%44 = OpLoad %23 %25
%45 = OpLoad %20 %22
%46 = OpLoad %17 %19
%47 = OpLoad %14 %16
%48 = OpLoad %10 %12
%49 = OpLoad %6 %8
%50 = OpLoad %26 %29
%51 = OpLoad %26 %28
%53 = OpAccessChain %52 %32 %54
%55 = OpLoad %5 %53
%56 = OpAccessChain %52 %32 %57
%58 = OpLoad %5 %56
%60 = OpSampledImage %59 %49 %51
%64 = OpCompositeConstruct %30 %55 %58
%63 = OpImageSparseSampleImplicitLod %62 %60 %64 MinLod %61
%65 = OpCompositeExtract %13 %63 0
%66 = OpCompositeExtract %33 %63 1
%69 = OpFConvert %68 %66
%70 = OpCompositeExtract %67 %69 0
%71 = OpCompositeExtract %67 %69 1
%72 = OpCompositeExtract %67 %69 2
%73 = OpCompositeExtract %67 %69 3
%75 = OpCompositeConstruct %74 %70 %71 %72 %73 %65
%76 = OpCompositeExtract %67 %75 0
%77 = OpCompositeExtract %67 %75 1
%78 = OpCompositeExtract %67 %75 2
%79 = OpCompositeExtract %67 %75 3
%80 = OpCompositeExtract %13 %75 4
%82 = OpImageSparseTexelsResident %81 %80
%88 = OpCompositeConstruct %87 %57 %84
%86 = OpImageSparseFetch %85 %48 %88 Lod %83
%89 = OpCompositeExtract %13 %86 0
%90 = OpCompositeExtract %36 %86 1
%93 = OpSConvert %92 %90
%94 = OpCompositeExtract %91 %93 0
%95 = OpCompositeExtract %91 %93 1
%96 = OpCompositeExtract %91 %93 2
%97 = OpCompositeExtract %91 %93 3
%99 = OpCompositeConstruct %98 %94 %95 %96 %97 %89
%100 = OpCompositeExtract %91 %99 0
%101 = OpCompositeExtract %91 %99 1
%102 = OpCompositeExtract %91 %99 2
%103 = OpCompositeExtract %91 %99 3
%104 = OpCompositeExtract %13 %99 4
%105 = OpImageSparseTexelsResident %81 %104
%106 = OpLogicalOr %81 %82 %105
%112 = OpCompositeConstruct %87 %108 %109
%111 = OpImageSparseFetch %110 %47 %112 Lod %107
%113 = OpCompositeExtract %13 %111 0
%114 = OpCompositeExtract %39 %111 1
%115 = OpUConvert %92 %114
%116 = OpCompositeExtract %91 %115 0
%117 = OpCompositeExtract %91 %115 1
%118 = OpCompositeExtract %91 %115 2
%119 = OpCompositeExtract %91 %115 3
%120 = OpCompositeConstruct %98 %116 %117 %118 %119 %113
%121 = OpCompositeExtract %91 %120 0
%122 = OpCompositeExtract %91 %120 1
%123 = OpCompositeExtract %91 %120 2
%124 = OpCompositeExtract %91 %120 3
%125 = OpCompositeExtract %13 %120 4
%126 = OpImageSparseTexelsResident %81 %125
%127 = OpLogicalOr %81 %106 %126
%128 = OpCompositeConstruct %30 %55 %58
%129 = OpImageSparseGather %62 %60 %128 %54
%130 = OpCompositeExtract %13 %129 0
%131 = OpCompositeExtract %33 %129 1
%132 = OpFConvert %68 %131
%133 = OpCompositeExtract %67 %132 0
%134 = OpCompositeExtract %67 %132 1
%135 = OpCompositeExtract %67 %132 2
%136 = OpCompositeExtract %67 %132 3
%137 = OpCompositeConstruct %74 %133 %134 %135 %136 %130
%138 = OpCompositeExtract %67 %137 0
%139 = OpCompositeExtract %67 %137 1
%140 = OpCompositeExtract %67 %137 2
%141 = OpCompositeExtract %67 %137 3
%142 = OpCompositeExtract %13 %137 4
%143 = OpImageSparseTexelsResident %81 %142
%144 = OpFAdd %67 %138 %76
%145 = OpFAdd %67 %139 %77
%146 = OpFAdd %67 %140 %78
%147 = OpFAdd %67 %141 %79
%148 = OpLogicalOr %81 %127 %143
%150 = OpSampledImage %149 %48 %51
%151 = OpCompositeConstruct %30 %55 %58
%152 = OpImageSparseGather %85 %150 %151 %57
%153 = OpCompositeExtract %13 %152 0
%154 = OpCompositeExtract %36 %152 1
%155 = OpSConvert %92 %154
%156 = OpCompositeExtract %91 %155 0
%157 = OpCompositeExtract %91 %155 1
%158 = OpCompositeExtract %91 %155 2
%159 = OpCompositeExtract %91 %155 3
%160 = OpCompositeConstruct %98 %156 %157 %158 %159 %153
%161 = OpCompositeExtract %91 %160 0
%162 = OpCompositeExtract %91 %160 1
%163 = OpCompositeExtract %91 %160 2
%164 = OpCompositeExtract %91 %160 3
%165 = OpCompositeExtract %13 %160 4
%166 = OpImageSparseTexelsResident %81 %165
%167 = OpIAdd %91 %161 %100
%168 = OpIAdd %91 %162 %101
%169 = OpIAdd %91 %163 %102
%170 = OpIAdd %91 %164 %103
%171 = OpLogicalOr %81 %148 %166
%173 = OpSampledImage %172 %47 %51
%174 = OpCompositeConstruct %30 %55 %58
%175 = OpImageSparseGather %110 %173 %174 %84
%176 = OpCompositeExtract %13 %175 0
%177 = OpCompositeExtract %39 %175 1
%178 = OpUConvert %92 %177
%179 = OpCompositeExtract %91 %178 0
%180 = OpCompositeExtract %91 %178 1
%181 = OpCompositeExtract %91 %178 2
%182 = OpCompositeExtract %91 %178 3
%183 = OpCompositeConstruct %98 %179 %180 %181 %182 %176
%184 = OpCompositeExtract %91 %183 0
%185 = OpCompositeExtract %91 %183 1
%186 = OpCompositeExtract %91 %183 2
%187 = OpCompositeExtract %91 %183 3
%188 = OpCompositeExtract %13 %183 4
%189 = OpImageSparseTexelsResident %81 %188
%190 = OpIAdd %91 %184 %121
%191 = OpIAdd %91 %185 %122
%192 = OpIAdd %91 %186 %123
%193 = OpIAdd %91 %187 %124
%194 = OpLogicalOr %81 %171 %189
%197 = OpSampledImage %196 %49 %50
%201 = OpCompositeConstruct %30 %55 %58
%200 = OpImageSparseSampleDrefImplicitLod %199 %197 %201 %198 MinLod %61
%202 = OpCompositeExtract %13 %200 0
%203 = OpCompositeExtract %5 %200 1
%205 = OpCompositeConstruct %204 %203 %203 %203 %203 %202
%206 = OpCompositeExtract %5 %205 0
%207 = OpCompositeExtract %13 %205 4
%208 = OpImageSparseTexelsResident %81 %207
%209 = OpFConvert %5 %144
%210 = OpFConvert %5 %145
%211 = OpFConvert %5 %146
%212 = OpFConvert %5 %147
%213 = OpFAdd %5 %206 %209
%214 = OpFAdd %5 %206 %210
%215 = OpFAdd %5 %206 %211
%216 = OpFAdd %5 %206 %212
%217 = OpFConvert %67 %213
%218 = OpFConvert %67 %214
%219 = OpFConvert %67 %215
%220 = OpFConvert %67 %216
%221 = OpLogicalOr %81 %194 %208
%223 = OpCompositeConstruct %30 %55 %58
%222 = OpImageSparseSampleDrefExplicitLod %199 %197 %223 %198 Lod %61
%224 = OpCompositeExtract %13 %222 0
%225 = OpCompositeExtract %5 %222 1
%226 = OpCompositeConstruct %204 %225 %225 %225 %225 %224
%227 = OpCompositeExtract %5 %226 0
%228 = OpCompositeExtract %13 %226 4
%229 = OpImageSparseTexelsResident %81 %228
%230 = OpFConvert %5 %217
%231 = OpFConvert %5 %218
%232 = OpFConvert %5 %219
%233 = OpFConvert %5 %220
%234 = OpFAdd %5 %227 %230
%235 = OpFAdd %5 %227 %231
%236 = OpFAdd %5 %227 %232
%237 = OpFAdd %5 %227 %233
%238 = OpFConvert %67 %234
%239 = OpFConvert %67 %235
%240 = OpFConvert %67 %236
%241 = OpFConvert %67 %237
%242 = OpLogicalOr %81 %221 %229
%243 = OpCompositeConstruct %30 %55 %58
%244 = OpImageSparseDrefGather %62 %197 %243 %198
%245 = OpCompositeExtract %13 %244 0
%246 = OpCompositeExtract %33 %244 1
%247 = OpFConvert %68 %246
%248 = OpCompositeExtract %67 %247 0
%249 = OpCompositeExtract %67 %247 1
%250 = OpCompositeExtract %67 %247 2
%251 = OpCompositeExtract %67 %247 3
%252 = OpCompositeConstruct %74 %248 %249 %250 %251 %245
%253 = OpCompositeExtract %67 %252 0
%254 = OpCompositeExtract %67 %252 1
%255 = OpCompositeExtract %67 %252 2
%256 = OpCompositeExtract %67 %252 3
%257 = OpCompositeExtract %13 %252 4
%258 = OpImageSparseTexelsResident %81 %257
%259 = OpFAdd %67 %253 %238
%260 = OpFAdd %67 %254 %239
%261 = OpFAdd %67 %255 %240
%262 = OpFAdd %67 %256 %241
%263 = OpLogicalOr %81 %242 %258
%265 = OpCompositeConstruct %30 %55 %58
%264 = OpImageSparseSampleExplicitLod %62 %60 %265 Lod %61
%266 = OpCompositeExtract %13 %264 0
%267 = OpCompositeExtract %33 %264 1
%268 = OpFConvert %68 %267
%269 = OpCompositeExtract %67 %268 0
%270 = OpCompositeExtract %67 %268 1
%271 = OpCompositeExtract %67 %268 2
%272 = OpCompositeExtract %67 %268 3
%273 = OpCompositeConstruct %74 %269 %270 %271 %272 %266
%274 = OpCompositeExtract %67 %273 0
%275 = OpCompositeExtract %67 %273 1
%276 = OpCompositeExtract %67 %273 2
%277 = OpCompositeExtract %67 %273 3
%278 = OpCompositeExtract %13 %273 4
%279 = OpImageSparseTexelsResident %81 %278
%280 = OpFAdd %67 %259 %274
%281 = OpFAdd %67 %260 %275
%282 = OpFAdd %67 %261 %276
%283 = OpFAdd %67 %262 %277
%284 = OpLogicalOr %81 %263 %279
%289 = OpCompositeConstruct %30 %55 %58
%290 = OpCompositeConstruct %30 %285 %286
%291 = OpCompositeConstruct %30 %287 %198
%288 = OpImageSparseSampleExplicitLod %62 %60 %289 Grad|MinLod %290 %291 %61
%292 = OpCompositeExtract %13 %288 0
%293 = OpCompositeExtract %33 %288 1
%294 = OpFConvert %68 %293
%295 = OpCompositeExtract %67 %294 0
%296 = OpCompositeExtract %67 %294 1
%297 = OpCompositeExtract %67 %294 2
%298 = OpCompositeExtract %67 %294 3
%299 = OpCompositeConstruct %74 %295 %296 %297 %298 %292
%300 = OpCompositeExtract %67 %299 0
%301 = OpCompositeExtract %67 %299 1
%302 = OpCompositeExtract %67 %299 2
%303 = OpCompositeExtract %67 %299 3
%304 = OpCompositeExtract %13 %299 4
%305 = OpImageSparseTexelsResident %81 %304
%306 = OpFAdd %67 %280 %300
%307 = OpFAdd %67 %281 %301
%308 = OpFAdd %67 %282 %302
%309 = OpFAdd %67 %283 %303
%310 = OpLogicalOr %81 %284 %305
%312 = OpCompositeConstruct %30 %55 %58
%311 = OpImageSparseSampleImplicitLod %62 %60 %312 Bias|MinLod %198 %61
%313 = OpCompositeExtract %13 %311 0
%314 = OpCompositeExtract %33 %311 1
%315 = OpFConvert %68 %314
%316 = OpCompositeExtract %67 %315 0
%317 = OpCompositeExtract %67 %315 1
%318 = OpCompositeExtract %67 %315 2
%319 = OpCompositeExtract %67 %315 3
%320 = OpCompositeConstruct %74 %316 %317 %318 %319 %313
%321 = OpCompositeExtract %67 %320 0
%322 = OpCompositeExtract %67 %320 1
%323 = OpCompositeExtract %67 %320 2
%324 = OpCompositeExtract %67 %320 3
%325 = OpCompositeExtract %13 %320 4
%326 = OpImageSparseTexelsResident %81 %325
%327 = OpFAdd %67 %306 %321
%328 = OpFAdd %67 %307 %322
%329 = OpFAdd %67 %308 %323
%330 = OpFAdd %67 %309 %324
%331 = OpLogicalOr %81 %310 %326
%332 = OpConvertFToS %13 %55
%333 = OpImageSparseFetch %62 %46 %332
%334 = OpCompositeExtract %13 %333 0
%335 = OpCompositeExtract %33 %333 1
%336 = OpFConvert %68 %335
%337 = OpCompositeExtract %67 %336 0
%338 = OpCompositeExtract %67 %336 1
%339 = OpCompositeExtract %67 %336 2
%340 = OpCompositeExtract %67 %336 3
%341 = OpCompositeConstruct %74 %337 %338 %339 %340 %334
%342 = OpCompositeExtract %67 %341 0
%343 = OpCompositeExtract %67 %341 1
%344 = OpCompositeExtract %67 %341 2
%345 = OpCompositeExtract %67 %341 3
%346 = OpCompositeExtract %13 %341 4
%347 = OpImageSparseTexelsResident %81 %346
%348 = OpFAdd %67 %327 %342
%349 = OpFAdd %67 %328 %343
%350 = OpFAdd %67 %329 %344
%351 = OpFAdd %67 %330 %345
%352 = OpLogicalOr %81 %331 %347
%353 = OpImageSparseFetch %85 %45 %332
%354 = OpCompositeExtract %13 %353 0
%355 = OpCompositeExtract %36 %353 1
%356 = OpSConvert %92 %355
%357 = OpCompositeExtract %91 %356 0
%358 = OpCompositeExtract %91 %356 1
%359 = OpCompositeExtract %91 %356 2
%360 = OpCompositeExtract %91 %356 3
%361 = OpCompositeConstruct %98 %357 %358 %359 %360 %354
%362 = OpCompositeExtract %91 %361 0
%363 = OpCompositeExtract %91 %361 1
%364 = OpCompositeExtract %91 %361 2
%365 = OpCompositeExtract %91 %361 3
%366 = OpCompositeExtract %13 %361 4
%367 = OpImageSparseTexelsResident %81 %366
%368 = OpIAdd %91 %167 %362
%369 = OpIAdd %91 %168 %363
%370 = OpIAdd %91 %169 %364
%371 = OpIAdd %91 %170 %365
%372 = OpLogicalOr %81 %352 %367
%373 = OpImageSparseFetch %110 %44 %332
%374 = OpCompositeExtract %13 %373 0
%375 = OpCompositeExtract %39 %373 1
%376 = OpUConvert %92 %375
%377 = OpCompositeExtract %91 %376 0
%378 = OpCompositeExtract %91 %376 1
%379 = OpCompositeExtract %91 %376 2
%380 = OpCompositeExtract %91 %376 3
%381 = OpCompositeConstruct %98 %377 %378 %379 %380 %374
%382 = OpCompositeExtract %91 %381 0
%383 = OpCompositeExtract %91 %381 1
%384 = OpCompositeExtract %91 %381 2
%385 = OpCompositeExtract %91 %381 3
%386 = OpCompositeExtract %13 %381 4
%387 = OpImageSparseTexelsResident %81 %386
%388 = OpIAdd %91 %190 %382
%389 = OpIAdd %91 %191 %383
%390 = OpIAdd %91 %192 %384
%391 = OpIAdd %91 %193 %385
%392 = OpLogicalOr %81 %372 %387
%393 = OpSelect %13 %392 %57 %54
%395 = OpAccessChain %394 %35 %54
%396 = OpFConvert %5 %348
OpStore %395 %396
%397 = OpAccessChain %394 %35 %57
%398 = OpFConvert %5 %349
OpStore %397 %398
%399 = OpAccessChain %394 %35 %84
%400 = OpFConvert %5 %350
OpStore %399 %400
%401 = OpAccessChain %394 %35 %83
%402 = OpFConvert %5 %351
OpStore %401 %402
%404 = OpAccessChain %403 %38 %54
%405 = OpSConvert %9 %368
OpStore %404 %405
%406 = OpAccessChain %403 %38 %57
%407 = OpSConvert %9 %369
OpStore %406 %407
%408 = OpAccessChain %403 %38 %84
%409 = OpSConvert %9 %370
OpStore %408 %409
%410 = OpAccessChain %403 %38 %83
%411 = OpSConvert %9 %371
OpStore %410 %411
%412 = OpAccessChain %42 %41 %54
%413 = OpUConvert %13 %388
OpStore %412 %413
%414 = OpAccessChain %42 %41 %57
%415 = OpUConvert %13 %389
OpStore %414 %415
%416 = OpAccessChain %42 %41 %84
%417 = OpUConvert %13 %390
OpStore %416 %417
%418 = OpAccessChain %42 %41 %83
%419 = OpUConvert %13 %391
OpStore %418 %419
OpStore %43 %393
OpReturn
OpFunctionEnd
#endif
