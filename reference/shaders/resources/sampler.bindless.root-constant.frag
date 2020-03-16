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
    vec4 _55 = textureOffset(sampler2D(_13[nonuniformEXT(registers._m0)], _17[registers._m2 + 3u]), vec2(UV.x, UV.y), ivec2(0));
    vec4 _70 = textureOffset(sampler2D(_13[nonuniformEXT(registers._m0)], _17[registers._m2 + 5u]), vec2(UV.x, UV.y), ivec2(0));
    vec4 _101 = textureOffset(sampler2D(_13[nonuniformEXT(registers._m0)], _17[registers._m2 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u)]), vec2(UV.x, UV.y), ivec2(0));
    vec4 _119 = textureOffset(sampler2D(_13[nonuniformEXT(registers._m0)], _17[nonuniformEXT(registers._m2 + (INDEX + 100u))]), vec2(UV.x, UV.y), ivec2(0));
    SV_Target.x = ((_70.x + _55.x) + _101.x) + _119.x;
    SV_Target.y = ((_70.y + _55.y) + _101.y) + _119.y;
    SV_Target.z = ((_70.z + _55.z) + _101.z) + _119.z;
    SV_Target.w = ((_70.w + _55.w) + _101.w) + _119.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 136
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
OpDecorate %111 NonUniform
OpDecorate %117 NonUniform
OpDecorate %118 NonUniform
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
%51 = OpTypeSampledImage %10
%53 = OpTypeInt 32 1
%54 = OpConstant %53 0
%57 = OpTypeVector %53 2
%58 = OpConstantComposite %57 %54 %54
%67 = OpConstant %5 5
%81 = OpConstant %5 4
%86 = OpConstant %5 6
%89 = OpConstant %5 7
%91 = OpTypeVector %5 4
%112 = OpConstant %5 100
%129 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %134
%134 = OpLabel
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
%52 = OpSampledImage %51 %35 %43
%56 = OpCompositeConstruct %21 %47 %50
%55 = OpImageSampleImplicitLod %26 %52 %56 ConstOffset %58
%59 = OpCompositeExtract %9 %55 0
%60 = OpCompositeExtract %9 %55 1
%61 = OpCompositeExtract %9 %55 2
%62 = OpCompositeExtract %9 %55 3
%64 = OpAccessChain %31 %8 %39
%65 = OpLoad %5 %64
%66 = OpIAdd %5 %65 %67
%63 = OpAccessChain %36 %17 %66
%68 = OpLoad %14 %63
%69 = OpSampledImage %51 %35 %68
%71 = OpCompositeConstruct %21 %47 %50
%70 = OpImageSampleImplicitLod %26 %69 %71 ConstOffset %58
%72 = OpCompositeExtract %9 %70 0
%73 = OpCompositeExtract %9 %70 1
%74 = OpCompositeExtract %9 %70 2
%75 = OpCompositeExtract %9 %70 3
%76 = OpFAdd %9 %72 %59
%77 = OpFAdd %9 %73 %60
%78 = OpFAdd %9 %74 %61
%79 = OpFAdd %9 %75 %62
%80 = OpAccessChain %31 %8 %81
%82 = OpLoad %5 %80
%83 = OpAccessChain %31 %8 %67
%84 = OpLoad %5 %83
%85 = OpAccessChain %31 %8 %86
%87 = OpLoad %5 %85
%88 = OpAccessChain %31 %8 %89
%90 = OpLoad %5 %88
%92 = OpCompositeConstruct %91 %82 %84 %87 %90
%93 = OpCompositeExtract %5 %92 0
%94 = OpIAdd %5 %93 %81
%96 = OpAccessChain %31 %8 %39
%97 = OpLoad %5 %96
%98 = OpIAdd %5 %97 %94
%95 = OpAccessChain %36 %17 %98
%99 = OpLoad %14 %95
%100 = OpSampledImage %51 %35 %99
%102 = OpCompositeConstruct %21 %47 %50
%101 = OpImageSampleImplicitLod %26 %100 %102 ConstOffset %58
%103 = OpCompositeExtract %9 %101 0
%104 = OpCompositeExtract %9 %101 1
%105 = OpCompositeExtract %9 %101 2
%106 = OpCompositeExtract %9 %101 3
%107 = OpFAdd %9 %76 %103
%108 = OpFAdd %9 %77 %104
%109 = OpFAdd %9 %78 %105
%110 = OpFAdd %9 %79 %106
%111 = OpIAdd %5 %44 %112
%114 = OpAccessChain %31 %8 %39
%115 = OpLoad %5 %114
%116 = OpIAdd %5 %115 %111
%113 = OpAccessChain %36 %17 %116
%117 = OpLoad %14 %113
%118 = OpSampledImage %51 %35 %117
%120 = OpCompositeConstruct %21 %47 %50
%119 = OpImageSampleImplicitLod %26 %118 %120 ConstOffset %58
%121 = OpCompositeExtract %9 %119 0
%122 = OpCompositeExtract %9 %119 1
%123 = OpCompositeExtract %9 %119 2
%124 = OpCompositeExtract %9 %119 3
%125 = OpFAdd %9 %107 %121
%126 = OpFAdd %9 %108 %122
%127 = OpFAdd %9 %109 %123
%128 = OpFAdd %9 %110 %124
%130 = OpAccessChain %129 %28 %33
OpStore %130 %125
%131 = OpAccessChain %129 %28 %49
OpStore %131 %126
%132 = OpAccessChain %129 %28 %39
OpStore %132 %127
%133 = OpAccessChain %129 %28 %42
OpStore %133 %128
OpReturn
OpFunctionEnd
#endif
