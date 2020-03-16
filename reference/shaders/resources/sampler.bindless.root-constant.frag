#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(push_constant, std430) uniform RootConstants
{
    uint _m0;
    uint _m1;
    uint _m2;
    uint _m3;
    uint _m4;
    uint _m5;
    uint _m6;
    uint _m7;
    uint _m8;
    uint _m9;
    uint _m10;
    uint _m11;
    uint _m12;
    uint _m13;
    uint _m14;
    uint _m15;
} registers;

layout(set = 0, binding = 0) uniform texture2D _13[];
layout(set = 2, binding = 0) uniform sampler _17[];

layout(location = 0) in vec2 UV;
layout(location = 1) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _56 = textureOffset(sampler2D(_13[nonuniformEXT(registers._m0)], _17[registers._m2 + 3u]), vec2(UV.x, UV.y), ivec2(0));
    vec4 _71 = textureOffset(sampler2D(_13[nonuniformEXT(registers._m0)], _17[registers._m2 + 5u]), vec2(UV.x, UV.y), ivec2(0));
    vec4 _102 = textureOffset(sampler2D(_13[nonuniformEXT(registers._m0)], _17[registers._m2 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u)]), vec2(UV.x, UV.y), ivec2(0));
    vec4 _120 = textureOffset(sampler2D(_13[nonuniformEXT(registers._m0)], _17[nonuniformEXT(registers._m2 + (INDEX + 100u))]), vec2(UV.x, UV.y), ivec2(0));
    SV_Target.x = ((_71.x + _56.x) + _102.x) + _120.x;
    SV_Target.y = ((_71.y + _56.y) + _102.y) + _120.y;
    SV_Target.z = ((_71.z + _56.z) + _102.z) + _120.z;
    SV_Target.w = ((_71.w + _56.w) + _102.w) + _120.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 137
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %23 %25 %28
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %23 "UV"
OpName %25 "INDEX"
OpName %28 "SV_Target"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpMemberDecorate %6 8 Offset 32
OpMemberDecorate %6 9 Offset 36
OpMemberDecorate %6 10 Offset 40
OpMemberDecorate %6 11 Offset 44
OpMemberDecorate %6 12 Offset 48
OpMemberDecorate %6 13 Offset 52
OpMemberDecorate %6 14 Offset 56
OpMemberDecorate %6 15 Offset 60
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %17 DescriptorSet 2
OpDecorate %17 Binding 0
OpDecorate %23 Location 0
OpDecorate %25 Flat
OpDecorate %25 Location 1
OpDecorate %28 Location 0
OpDecorate %112 NonUniform
OpDecorate %118 NonUniform
OpDecorate %119 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeFloat 32
%10 = OpTypeImage %9 2D 0 0 0 1 Unknown
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer UniformConstant %11
%13 = OpVariable %12 UniformConstant
%14 = OpTypeSampler
%15 = OpTypeRuntimeArray %14
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpConstant %5 64
%19 = OpTypeArray %14 %18
%20 = OpTypeRuntimeArray %14
%21 = OpTypeVector %9 2
%22 = OpTypePointer Input %21
%23 = OpVariable %22 Input
%24 = OpTypePointer Input %5
%25 = OpVariable %24 Input
%26 = OpTypeVector %9 4
%27 = OpTypePointer Output %26
%28 = OpVariable %27 Output
%29 = OpTypePointer UniformConstant %10
%31 = OpTypePointer PushConstant %5
%33 = OpConstant %5 0
%36 = OpTypePointer UniformConstant %14
%39 = OpConstant %5 2
%42 = OpConstant %5 3
%45 = OpTypePointer Input %9
%49 = OpConstant %5 1
%51 = OpTypeImage %9 2D 0 0 0 2 Unknown
%52 = OpTypeSampledImage %51
%54 = OpTypeInt 32 1
%55 = OpConstant %54 0
%58 = OpTypeVector %54 2
%59 = OpConstantComposite %58 %55 %55
%68 = OpConstant %5 5
%82 = OpConstant %5 4
%87 = OpConstant %5 6
%90 = OpConstant %5 7
%92 = OpTypeVector %5 4
%113 = OpConstant %5 100
%130 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %135
%135 = OpLabel
%32 = OpAccessChain %31 %8 %33
%34 = OpLoad %5 %32
%30 = OpAccessChain %29 %13 %34
%35 = OpLoad %10 %30
%38 = OpAccessChain %31 %8 %39
%40 = OpLoad %5 %38
%41 = OpIAdd %5 %40 %42
%37 = OpAccessChain %36 %17 %41
%43 = OpLoad %14 %37
%44 = OpLoad %5 %25
%46 = OpAccessChain %45 %23 %33
%47 = OpLoad %9 %46
%48 = OpAccessChain %45 %23 %49
%50 = OpLoad %9 %48
%53 = OpSampledImage %52 %35 %43
%57 = OpCompositeConstruct %21 %47 %50
%56 = OpImageSampleImplicitLod %26 %53 %57 ConstOffset %59
%60 = OpCompositeExtract %9 %56 0
%61 = OpCompositeExtract %9 %56 1
%62 = OpCompositeExtract %9 %56 2
%63 = OpCompositeExtract %9 %56 3
%65 = OpAccessChain %31 %8 %39
%66 = OpLoad %5 %65
%67 = OpIAdd %5 %66 %68
%64 = OpAccessChain %36 %17 %67
%69 = OpLoad %14 %64
%70 = OpSampledImage %52 %35 %69
%72 = OpCompositeConstruct %21 %47 %50
%71 = OpImageSampleImplicitLod %26 %70 %72 ConstOffset %59
%73 = OpCompositeExtract %9 %71 0
%74 = OpCompositeExtract %9 %71 1
%75 = OpCompositeExtract %9 %71 2
%76 = OpCompositeExtract %9 %71 3
%77 = OpFAdd %9 %73 %60
%78 = OpFAdd %9 %74 %61
%79 = OpFAdd %9 %75 %62
%80 = OpFAdd %9 %76 %63
%81 = OpAccessChain %31 %8 %82
%83 = OpLoad %5 %81
%84 = OpAccessChain %31 %8 %68
%85 = OpLoad %5 %84
%86 = OpAccessChain %31 %8 %87
%88 = OpLoad %5 %86
%89 = OpAccessChain %31 %8 %90
%91 = OpLoad %5 %89
%93 = OpCompositeConstruct %92 %83 %85 %88 %91
%94 = OpCompositeExtract %5 %93 0
%95 = OpIAdd %5 %94 %82
%97 = OpAccessChain %31 %8 %39
%98 = OpLoad %5 %97
%99 = OpIAdd %5 %98 %95
%96 = OpAccessChain %36 %17 %99
%100 = OpLoad %14 %96
%101 = OpSampledImage %52 %35 %100
%103 = OpCompositeConstruct %21 %47 %50
%102 = OpImageSampleImplicitLod %26 %101 %103 ConstOffset %59
%104 = OpCompositeExtract %9 %102 0
%105 = OpCompositeExtract %9 %102 1
%106 = OpCompositeExtract %9 %102 2
%107 = OpCompositeExtract %9 %102 3
%108 = OpFAdd %9 %77 %104
%109 = OpFAdd %9 %78 %105
%110 = OpFAdd %9 %79 %106
%111 = OpFAdd %9 %80 %107
%112 = OpIAdd %5 %44 %113
%115 = OpAccessChain %31 %8 %39
%116 = OpLoad %5 %115
%117 = OpIAdd %5 %116 %112
%114 = OpAccessChain %36 %17 %117
%118 = OpLoad %14 %114
%119 = OpSampledImage %52 %35 %118
%121 = OpCompositeConstruct %21 %47 %50
%120 = OpImageSampleImplicitLod %26 %119 %121 ConstOffset %59
%122 = OpCompositeExtract %9 %120 0
%123 = OpCompositeExtract %9 %120 1
%124 = OpCompositeExtract %9 %120 2
%125 = OpCompositeExtract %9 %120 3
%126 = OpFAdd %9 %108 %122
%127 = OpFAdd %9 %109 %123
%128 = OpFAdd %9 %110 %124
%129 = OpFAdd %9 %111 %125
%131 = OpAccessChain %130 %28 %33
OpStore %131 %126
%132 = OpAccessChain %130 %28 %49
OpStore %132 %127
%133 = OpAccessChain %130 %28 %39
OpStore %133 %128
%134 = OpAccessChain %130 %28 %42
OpStore %134 %129
OpReturn
OpFunctionEnd
#endif
