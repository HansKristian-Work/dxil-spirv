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
    uint _166;
    ivec4 _167;
    _166 = sparseTextureGatherOffsetARB(isampler2D(_8, _20), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(0, 1), _167);
    SparseTexel _54 = SparseTexel(_166, _167);
    uvec4 _60 = uvec4(_54._m1);
    _65 _66 = _65(_60.x, _60.y, _60.z, _60.w, _54._m0);
    uint _168;
    ivec4 _169;
    _168 = sparseTextureGatherOffsetARB(isampler2DArray(_11, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(0, 1), _169, int(1u));
    SparseTexel _79 = SparseTexel(_168, _169);
    uvec4 _82 = uvec4(_79._m1);
    _65 _87 = _65(_82.x, _82.y, _82.z, _82.w, _79._m0);
    uint _170;
    ivec4 _171;
    _170 = sparseTextureGatherARB(isamplerCube(_14, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), _171, int(2u));
    SparseTexel _98 = SparseTexel(_170, _171);
    uvec4 _101 = uvec4(_98._m1);
    _65 _106 = _65(_101.x, _101.y, _101.z, _101.w, _98._m0);
    uint _172;
    ivec4 _173;
    _172 = sparseTextureGatherARB(isamplerCubeArray(_17, _20), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), _173, int(3u));
    SparseTexel _117 = SparseTexel(_172, _173);
    uvec4 _120 = uvec4(_117._m1);
    _65 _125 = _65(_120.x, _120.y, _120.z, _120.w, _117._m0);
    uint _132 = uint(sparseTexelsResidentARB(int(_125._m4)));
    uint _134 = uint(sparseTexelsResidentARB(int(_106._m4))) + (uint(sparseTexelsResidentARB(int(_87._m4))) + uint(sparseTexelsResidentARB(int(_66._m4))));
    SV_Target.x = int(((((_134 + _66._m0) + _87._m0) + _106._m0) + _125._m0) + _132);
    SV_Target.y = int(((((_134 + _66._m1) + _87._m1) + _106._m1) + _125._m1) + _132);
    SV_Target.z = int(((((_134 + _66._m2) + _87._m2) + _106._m2) + _125._m2) + _132);
    SV_Target.w = int(((((_134 + _66._m3) + _87._m3) + _106._m3) + _125._m3) + _132);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 166
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
%75 = OpTypeSampledImage %9
%77 = OpTypeVector %21 3
%95 = OpTypeSampledImage %12
%114 = OpTypeSampledImage %15
%155 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %164
%164 = OpLabel
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
%76 = OpSampledImage %75 %30 %32
%78 = OpCompositeConstruct %77 %37 %40 %43
%79 = OpImageSparseGather %53 %76 %78 %39 ConstOffset %56
%80 = OpCompositeExtract %35 %79 0
%81 = OpCompositeExtract %25 %79 1
%82 = OpBitcast %59 %81
%83 = OpCompositeExtract %35 %82 0
%84 = OpCompositeExtract %35 %82 1
%85 = OpCompositeExtract %35 %82 2
%86 = OpCompositeExtract %35 %82 3
%87 = OpCompositeConstruct %65 %83 %84 %85 %86 %80
%88 = OpCompositeExtract %35 %87 0
%89 = OpCompositeExtract %35 %87 1
%90 = OpCompositeExtract %35 %87 2
%91 = OpCompositeExtract %35 %87 3
%92 = OpCompositeExtract %35 %87 4
%93 = OpImageSparseTexelsResident %72 %92
%94 = OpSelect %35 %93 %39 %36
%96 = OpSampledImage %95 %29 %32
%97 = OpCompositeConstruct %77 %37 %40 %43
%98 = OpImageSparseGather %53 %96 %97 %42
%99 = OpCompositeExtract %35 %98 0
%100 = OpCompositeExtract %25 %98 1
%101 = OpBitcast %59 %100
%102 = OpCompositeExtract %35 %101 0
%103 = OpCompositeExtract %35 %101 1
%104 = OpCompositeExtract %35 %101 2
%105 = OpCompositeExtract %35 %101 3
%106 = OpCompositeConstruct %65 %102 %103 %104 %105 %99
%107 = OpCompositeExtract %35 %106 0
%108 = OpCompositeExtract %35 %106 1
%109 = OpCompositeExtract %35 %106 2
%110 = OpCompositeExtract %35 %106 3
%111 = OpCompositeExtract %35 %106 4
%112 = OpImageSparseTexelsResident %72 %111
%113 = OpSelect %35 %112 %39 %36
%115 = OpSampledImage %114 %28 %32
%116 = OpCompositeConstruct %22 %37 %40 %43 %46
%117 = OpImageSparseGather %53 %115 %116 %45
%118 = OpCompositeExtract %35 %117 0
%119 = OpCompositeExtract %25 %117 1
%120 = OpBitcast %59 %119
%121 = OpCompositeExtract %35 %120 0
%122 = OpCompositeExtract %35 %120 1
%123 = OpCompositeExtract %35 %120 2
%124 = OpCompositeExtract %35 %120 3
%125 = OpCompositeConstruct %65 %121 %122 %123 %124 %118
%126 = OpCompositeExtract %35 %125 0
%127 = OpCompositeExtract %35 %125 1
%128 = OpCompositeExtract %35 %125 2
%129 = OpCompositeExtract %35 %125 3
%130 = OpCompositeExtract %35 %125 4
%131 = OpImageSparseTexelsResident %72 %130
%132 = OpSelect %35 %131 %39 %36
%133 = OpIAdd %35 %94 %74
%134 = OpIAdd %35 %113 %133
%135 = OpIAdd %35 %134 %67
%136 = OpIAdd %35 %135 %88
%137 = OpIAdd %35 %136 %107
%138 = OpIAdd %35 %137 %126
%139 = OpIAdd %35 %138 %132
%140 = OpIAdd %35 %134 %68
%141 = OpIAdd %35 %140 %89
%142 = OpIAdd %35 %141 %108
%143 = OpIAdd %35 %142 %127
%144 = OpIAdd %35 %143 %132
%145 = OpIAdd %35 %134 %69
%146 = OpIAdd %35 %145 %90
%147 = OpIAdd %35 %146 %109
%148 = OpIAdd %35 %147 %128
%149 = OpIAdd %35 %148 %132
%150 = OpIAdd %35 %134 %70
%151 = OpIAdd %35 %150 %91
%152 = OpIAdd %35 %151 %110
%153 = OpIAdd %35 %152 %129
%154 = OpIAdd %35 %153 %132
%156 = OpAccessChain %155 %27 %36
%157 = OpBitcast %5 %139
OpStore %156 %157
%158 = OpAccessChain %155 %27 %39
%159 = OpBitcast %5 %144
OpStore %158 %159
%160 = OpAccessChain %155 %27 %42
%161 = OpBitcast %5 %149
OpStore %160 %161
%162 = OpAccessChain %155 %27 %45
%163 = OpBitcast %5 %154
OpStore %162 %163
OpReturn
OpFunctionEnd
#endif
