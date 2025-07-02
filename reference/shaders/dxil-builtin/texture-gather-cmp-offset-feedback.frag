#version 460
#extension GL_ARB_sparse_texture2 : require

struct SparseTexel
{
    uint _m0;
    vec4 _m1;
};

struct _55
{
    float _m0;
    float _m1;
    float _m2;
    float _m3;
    uint _m4;
};

layout(set = 0, binding = 3) uniform texture2D _8;
layout(set = 0, binding = 4) uniform texture2DArray _11;
layout(set = 0, binding = 1) uniform samplerShadow _14;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec2 _41 = vec2(TEXCOORD.x, TEXCOORD.y);
    uint _105;
    vec4 _106;
    _105 = sparseTextureGatherOffsetARB(sampler2DShadow(_8, _14), _41, TEXCOORD.z, ivec2(-3, -4), _106);
    SparseTexel _46 = SparseTexel(_105, _106);
    vec4 _50 = _46._m1;
    _55 _56 = _55(_50.x, _50.y, _50.z, _50.w, _46._m0);
    vec3 _71 = vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z);
    uint _107;
    vec4 _108;
    _107 = sparseTextureGatherOffsetARB(sampler2DArrayShadow(_11, _14), _71, TEXCOORD.w, ivec2(-4, -5), _108);
    SparseTexel _73 = SparseTexel(_107, _108);
    vec4 _76 = _73._m1;
    _55 _81 = _55(_76.x, _76.y, _76.z, _76.w, _73._m0);
    float _89 = float(sparseTexelsResidentARB(int(_81._m4))) + float(sparseTexelsResidentARB(int(_56._m4)));
    SV_Target.x = (_81._m0 + _56._m0) + _89;
    SV_Target.y = (_81._m1 + _56._m1) + _89;
    SV_Target.z = (_81._m2 + _56._m2) + _89;
    SV_Target.w = (_81._m3 + _56._m3) + _89;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 105
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %17 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %17 "TEXCOORD"
OpName %19 "SV_Target"
OpName %45 "SparseTexel"
OpName %55 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 3
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 4
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 1
OpDecorate %17 Location 0
OpDecorate %19 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 2D 0 1 0 1 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeSampler
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeVector %5 4
%16 = OpTypePointer Input %15
%17 = OpVariable %16 Input
%18 = OpTypePointer Output %15
%19 = OpVariable %18 Output
%23 = OpTypePointer Input %5
%25 = OpTypeInt 32 0
%26 = OpConstant %25 0
%29 = OpConstant %25 1
%32 = OpConstant %25 2
%35 = OpConstant %25 3
%37 = OpTypeImage %5 2D 1 0 0 1 Unknown
%38 = OpTypeSampledImage %37
%40 = OpTypeVector %5 2
%42 = OpTypeInt 32 1
%43 = OpConstant %42 -3
%44 = OpConstant %42 -4
%45 = OpTypeStruct %25 %15
%47 = OpTypeVector %42 2
%48 = OpConstantComposite %47 %43 %44
%55 = OpTypeStruct %5 %5 %5 %5 %25
%62 = OpTypeBool
%65 = OpConstant %5 1
%66 = OpConstant %5 0
%67 = OpTypeImage %5 2D 1 1 0 1 Unknown
%68 = OpTypeSampledImage %67
%70 = OpTypeVector %5 3
%72 = OpConstant %42 -5
%74 = OpConstantComposite %47 %44 %72
%98 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %103
%103 = OpLabel
%20 = OpLoad %9 %11
%21 = OpLoad %6 %8
%22 = OpLoad %12 %14
%24 = OpAccessChain %23 %17 %26
%27 = OpLoad %5 %24
%28 = OpAccessChain %23 %17 %29
%30 = OpLoad %5 %28
%31 = OpAccessChain %23 %17 %32
%33 = OpLoad %5 %31
%34 = OpAccessChain %23 %17 %35
%36 = OpLoad %5 %34
%39 = OpSampledImage %38 %21 %22
%41 = OpCompositeConstruct %40 %27 %30
%46 = OpImageSparseDrefGather %45 %39 %41 %33 ConstOffset %48
%49 = OpCompositeExtract %25 %46 0
%50 = OpCompositeExtract %15 %46 1
%51 = OpCompositeExtract %5 %50 0
%52 = OpCompositeExtract %5 %50 1
%53 = OpCompositeExtract %5 %50 2
%54 = OpCompositeExtract %5 %50 3
%56 = OpCompositeConstruct %55 %51 %52 %53 %54 %49
%57 = OpCompositeExtract %5 %56 0
%58 = OpCompositeExtract %5 %56 1
%59 = OpCompositeExtract %5 %56 2
%60 = OpCompositeExtract %5 %56 3
%61 = OpCompositeExtract %25 %56 4
%63 = OpImageSparseTexelsResident %62 %61
%64 = OpSelect %5 %63 %65 %66
%69 = OpSampledImage %68 %20 %22
%71 = OpCompositeConstruct %70 %27 %30 %33
%73 = OpImageSparseDrefGather %45 %69 %71 %36 ConstOffset %74
%75 = OpCompositeExtract %25 %73 0
%76 = OpCompositeExtract %15 %73 1
%77 = OpCompositeExtract %5 %76 0
%78 = OpCompositeExtract %5 %76 1
%79 = OpCompositeExtract %5 %76 2
%80 = OpCompositeExtract %5 %76 3
%81 = OpCompositeConstruct %55 %77 %78 %79 %80 %75
%82 = OpCompositeExtract %5 %81 0
%83 = OpCompositeExtract %5 %81 1
%84 = OpCompositeExtract %5 %81 2
%85 = OpCompositeExtract %5 %81 3
%86 = OpCompositeExtract %25 %81 4
%87 = OpImageSparseTexelsResident %62 %86
%88 = OpSelect %5 %87 %65 %66
%89 = OpFAdd %5 %88 %64
%90 = OpFAdd %5 %82 %57
%91 = OpFAdd %5 %90 %89
%92 = OpFAdd %5 %83 %58
%93 = OpFAdd %5 %92 %89
%94 = OpFAdd %5 %84 %59
%95 = OpFAdd %5 %94 %89
%96 = OpFAdd %5 %85 %60
%97 = OpFAdd %5 %96 %89
%99 = OpAccessChain %98 %19 %26
OpStore %99 %91
%100 = OpAccessChain %98 %19 %29
OpStore %100 %93
%101 = OpAccessChain %98 %19 %32
OpStore %101 %95
%102 = OpAccessChain %98 %19 %35
OpStore %102 %97
OpReturn
OpFunctionEnd
#endif
