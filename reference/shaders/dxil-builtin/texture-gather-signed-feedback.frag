#version 460
#extension GL_ARB_sparse_texture2 : require

struct SparseTexel
{
    uint _m0;
    ivec4 _m1;
};

struct _65
{
    uint _m0;
    uint _m1;
    uint _m2;
    uint _m3;
    uint _m4;
};

layout(set = 0, binding = 3) uniform itexture2D _8;
layout(set = 0, binding = 4) uniform itexture2DArray _11;
layout(set = 0, binding = 6) uniform itextureCube _14;
layout(set = 0, binding = 7) uniform itextureCubeArray _17;
layout(set = 0, binding = 1) uniform sampler _20;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out ivec4 SV_Target;

void main()
{
    uint _172;
    ivec4 _173;
    _172 = sparseTextureGatherOffsetARB(isampler2D(_8, _20), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(0, 1), _173);
    SparseTexel _54 = SparseTexel(_172, _173);
    uvec4 _60 = uvec4(_54._m1);
    _65 _66 = _65(_60.x, _60.y, _60.z, _60.w, _54._m0);
    uint _74 = uint(sparseTexelsResidentARB(int(_66._m4)));
    uint _174;
    ivec4 _175;
    _174 = sparseTextureGatherOffsetARB(isampler2DArray(_11, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(0, 1), _175, 1u);
    SparseTexel _83 = SparseTexel(_174, _175);
    uvec4 _86 = uvec4(_83._m1);
    _65 _91 = _65(_86.x, _86.y, _86.z, _86.w, _83._m0);
    uint _102 = uint(sparseTexelsResidentARB(int(_91._m4)));
    uint _176;
    ivec4 _177;
    _176 = sparseTextureGatherARB(isamplerCube(_14, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), _177, 2u);
    SparseTexel _110 = SparseTexel(_176, _177);
    uvec4 _113 = uvec4(_110._m1);
    _65 _118 = _65(_113.x, _113.y, _113.z, _113.w, _110._m0);
    uint _129 = uint(sparseTexelsResidentARB(int(_118._m4)));
    uint _178;
    ivec4 _179;
    _178 = sparseTextureGatherARB(isamplerCubeArray(_17, _20), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), _179, 3u);
    SparseTexel _137 = SparseTexel(_178, _179);
    uvec4 _140 = uvec4(_137._m1);
    _65 _145 = _65(_140.x, _140.y, _140.z, _140.w, _137._m0);
    uint _156 = uint(sparseTexelsResidentARB(int(_145._m4)));
    SV_Target.x = int(((((((_74 + _66._m0) + _91._m0) + _102) + _118._m0) + _129) + _145._m0) + _156);
    SV_Target.y = int(((((((_74 + _66._m1) + _91._m1) + _102) + _118._m1) + _129) + _145._m1) + _156);
    SV_Target.z = int(((((((_74 + _66._m2) + _91._m2) + _102) + _118._m2) + _129) + _145._m2) + _156);
    SV_Target.w = int(((((((_74 + _66._m3) + _91._m3) + _102) + _118._m3) + _129) + _145._m3) + _156);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 172
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpCapability SampledCubeArray
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %24 %27
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %24 "TEXCOORD"
OpName %27 "SV_Target"
OpName %53 "SparseTexel"
OpName %65 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 3
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 4
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 6
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 7
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 1
OpDecorate %24 Location 0
OpDecorate %27 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 2D 0 1 0 1 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeImage %5 Cube 0 0 0 1 Unknown
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeImage %5 Cube 0 1 0 1 Unknown
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeSampler
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeFloat 32
%22 = OpTypeVector %21 4
%23 = OpTypePointer Input %22
%24 = OpVariable %23 Input
%25 = OpTypeVector %5 4
%26 = OpTypePointer Output %25
%27 = OpVariable %26 Output
%33 = OpTypePointer Input %21
%35 = OpTypeInt 32 0
%36 = OpConstant %35 0
%39 = OpConstant %35 1
%42 = OpConstant %35 2
%45 = OpConstant %35 3
%47 = OpTypeSampledImage %6
%49 = OpTypeVector %21 2
%51 = OpConstant %5 0
%52 = OpConstant %5 1
%53 = OpTypeStruct %35 %25
%55 = OpTypeVector %5 2
%56 = OpConstantComposite %55 %51 %52
%59 = OpTypeVector %35 4
%65 = OpTypeStruct %35 %35 %35 %35 %35
%72 = OpTypeBool
%79 = OpTypeSampledImage %9
%81 = OpTypeVector %21 3
%107 = OpTypeSampledImage %12
%134 = OpTypeSampledImage %15
%161 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %170
%170 = OpLabel
%28 = OpLoad %15 %17
%29 = OpLoad %12 %14
%30 = OpLoad %9 %11
%31 = OpLoad %6 %8
%32 = OpLoad %18 %20
%34 = OpAccessChain %33 %24 %36
%37 = OpLoad %21 %34
%38 = OpAccessChain %33 %24 %39
%40 = OpLoad %21 %38
%41 = OpAccessChain %33 %24 %42
%43 = OpLoad %21 %41
%44 = OpAccessChain %33 %24 %45
%46 = OpLoad %21 %44
%48 = OpSampledImage %47 %31 %32
%50 = OpCompositeConstruct %49 %37 %40
%54 = OpImageSparseGather %53 %48 %50 %36 ConstOffset %56
%57 = OpCompositeExtract %35 %54 0
%58 = OpCompositeExtract %25 %54 1
%60 = OpBitcast %59 %58
%61 = OpCompositeExtract %35 %60 0
%62 = OpCompositeExtract %35 %60 1
%63 = OpCompositeExtract %35 %60 2
%64 = OpCompositeExtract %35 %60 3
%66 = OpCompositeConstruct %65 %61 %62 %63 %64 %57
%67 = OpCompositeExtract %35 %66 0
%68 = OpCompositeExtract %35 %66 1
%69 = OpCompositeExtract %35 %66 2
%70 = OpCompositeExtract %35 %66 3
%71 = OpCompositeExtract %35 %66 4
%73 = OpImageSparseTexelsResident %72 %71
%74 = OpSelect %35 %73 %39 %36
%75 = OpIAdd %35 %74 %67
%76 = OpIAdd %35 %74 %68
%77 = OpIAdd %35 %74 %69
%78 = OpIAdd %35 %74 %70
%80 = OpSampledImage %79 %30 %32
%82 = OpCompositeConstruct %81 %37 %40 %43
%83 = OpImageSparseGather %53 %80 %82 %39 ConstOffset %56
%84 = OpCompositeExtract %35 %83 0
%85 = OpCompositeExtract %25 %83 1
%86 = OpBitcast %59 %85
%87 = OpCompositeExtract %35 %86 0
%88 = OpCompositeExtract %35 %86 1
%89 = OpCompositeExtract %35 %86 2
%90 = OpCompositeExtract %35 %86 3
%91 = OpCompositeConstruct %65 %87 %88 %89 %90 %84
%92 = OpCompositeExtract %35 %91 0
%93 = OpCompositeExtract %35 %91 1
%94 = OpCompositeExtract %35 %91 2
%95 = OpCompositeExtract %35 %91 3
%96 = OpCompositeExtract %35 %91 4
%97 = OpImageSparseTexelsResident %72 %96
%98 = OpIAdd %35 %75 %92
%99 = OpIAdd %35 %76 %93
%100 = OpIAdd %35 %77 %94
%101 = OpIAdd %35 %78 %95
%102 = OpSelect %35 %97 %39 %36
%103 = OpIAdd %35 %98 %102
%104 = OpIAdd %35 %99 %102
%105 = OpIAdd %35 %100 %102
%106 = OpIAdd %35 %101 %102
%108 = OpSampledImage %107 %29 %32
%109 = OpCompositeConstruct %81 %37 %40 %43
%110 = OpImageSparseGather %53 %108 %109 %42
%111 = OpCompositeExtract %35 %110 0
%112 = OpCompositeExtract %25 %110 1
%113 = OpBitcast %59 %112
%114 = OpCompositeExtract %35 %113 0
%115 = OpCompositeExtract %35 %113 1
%116 = OpCompositeExtract %35 %113 2
%117 = OpCompositeExtract %35 %113 3
%118 = OpCompositeConstruct %65 %114 %115 %116 %117 %111
%119 = OpCompositeExtract %35 %118 0
%120 = OpCompositeExtract %35 %118 1
%121 = OpCompositeExtract %35 %118 2
%122 = OpCompositeExtract %35 %118 3
%123 = OpCompositeExtract %35 %118 4
%124 = OpImageSparseTexelsResident %72 %123
%125 = OpIAdd %35 %103 %119
%126 = OpIAdd %35 %104 %120
%127 = OpIAdd %35 %105 %121
%128 = OpIAdd %35 %106 %122
%129 = OpSelect %35 %124 %39 %36
%130 = OpIAdd %35 %125 %129
%131 = OpIAdd %35 %126 %129
%132 = OpIAdd %35 %127 %129
%133 = OpIAdd %35 %128 %129
%135 = OpSampledImage %134 %28 %32
%136 = OpCompositeConstruct %22 %37 %40 %43 %46
%137 = OpImageSparseGather %53 %135 %136 %45
%138 = OpCompositeExtract %35 %137 0
%139 = OpCompositeExtract %25 %137 1
%140 = OpBitcast %59 %139
%141 = OpCompositeExtract %35 %140 0
%142 = OpCompositeExtract %35 %140 1
%143 = OpCompositeExtract %35 %140 2
%144 = OpCompositeExtract %35 %140 3
%145 = OpCompositeConstruct %65 %141 %142 %143 %144 %138
%146 = OpCompositeExtract %35 %145 0
%147 = OpCompositeExtract %35 %145 1
%148 = OpCompositeExtract %35 %145 2
%149 = OpCompositeExtract %35 %145 3
%150 = OpCompositeExtract %35 %145 4
%151 = OpImageSparseTexelsResident %72 %150
%152 = OpIAdd %35 %130 %146
%153 = OpIAdd %35 %131 %147
%154 = OpIAdd %35 %132 %148
%155 = OpIAdd %35 %133 %149
%156 = OpSelect %35 %151 %39 %36
%157 = OpIAdd %35 %152 %156
%158 = OpIAdd %35 %153 %156
%159 = OpIAdd %35 %154 %156
%160 = OpIAdd %35 %155 %156
%162 = OpAccessChain %161 %27 %36
%163 = OpBitcast %5 %157
OpStore %162 %163
%164 = OpAccessChain %161 %27 %39
%165 = OpBitcast %5 %158
OpStore %164 %165
%166 = OpAccessChain %161 %27 %42
%167 = OpBitcast %5 %159
OpStore %166 %167
%168 = OpAccessChain %161 %27 %45
%169 = OpBitcast %5 %160
OpStore %168 %169
OpReturn
OpFunctionEnd
#endif
