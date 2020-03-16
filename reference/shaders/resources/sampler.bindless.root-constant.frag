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
    vec4 _52 = textureOffset(sampler2D(_13[nonuniformEXT(registers._m0)], _17[registers._m2 + 3u]), vec2(UV.x, UV.y), ivec2(0));
    vec4 _67 = textureOffset(sampler2D(_13[nonuniformEXT(registers._m0)], _17[registers._m2 + 5u]), vec2(UV.x, UV.y), ivec2(0));
    vec4 _98 = textureOffset(sampler2D(_13[nonuniformEXT(registers._m0)], _17[registers._m2 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u)]), vec2(UV.x, UV.y), ivec2(0));
    vec4 _116 = textureOffset(sampler2D(_13[nonuniformEXT(registers._m0)], _17[nonuniformEXT(registers._m2 + (INDEX + 100u))]), vec2(UV.x, UV.y), ivec2(0));
    SV_Target.x = ((_67.x + _52.x) + _98.x) + _116.x;
    SV_Target.y = ((_67.y + _52.y) + _98.y) + _116.y;
    SV_Target.z = ((_67.z + _52.z) + _98.z) + _116.z;
    SV_Target.w = ((_67.w + _52.w) + _98.w) + _116.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 133
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %20 %22 %25
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %20 "UV"
OpName %22 "INDEX"
OpName %25 "SV_Target"
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
OpDecorate %20 Location 0
OpDecorate %22 Flat
OpDecorate %22 Location 1
OpDecorate %25 Location 0
OpDecorate %108 NonUniform
OpDecorate %114 NonUniform
OpDecorate %115 NonUniform
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
%18 = OpTypeVector %9 2
%19 = OpTypePointer Input %18
%20 = OpVariable %19 Input
%21 = OpTypePointer Input %5
%22 = OpVariable %21 Input
%23 = OpTypeVector %9 4
%24 = OpTypePointer Output %23
%25 = OpVariable %24 Output
%26 = OpTypePointer UniformConstant %10
%28 = OpTypePointer PushConstant %5
%30 = OpConstant %5 0
%33 = OpTypePointer UniformConstant %14
%36 = OpConstant %5 2
%39 = OpConstant %5 3
%42 = OpTypePointer Input %9
%46 = OpConstant %5 1
%48 = OpTypeSampledImage %10
%50 = OpTypeInt 32 1
%51 = OpConstant %50 0
%54 = OpTypeVector %50 2
%55 = OpConstantComposite %54 %51 %51
%64 = OpConstant %5 5
%78 = OpConstant %5 4
%83 = OpConstant %5 6
%86 = OpConstant %5 7
%88 = OpTypeVector %5 4
%109 = OpConstant %5 100
%126 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %131
%131 = OpLabel
%29 = OpAccessChain %28 %8 %30
%31 = OpLoad %5 %29
%27 = OpAccessChain %26 %13 %31
%32 = OpLoad %10 %27
%35 = OpAccessChain %28 %8 %36
%37 = OpLoad %5 %35
%38 = OpIAdd %5 %37 %39
%34 = OpAccessChain %33 %17 %38
%40 = OpLoad %14 %34
%41 = OpLoad %5 %22
%43 = OpAccessChain %42 %20 %30
%44 = OpLoad %9 %43
%45 = OpAccessChain %42 %20 %46
%47 = OpLoad %9 %45
%49 = OpSampledImage %48 %32 %40
%53 = OpCompositeConstruct %18 %44 %47
%52 = OpImageSampleImplicitLod %23 %49 %53 ConstOffset %55
%56 = OpCompositeExtract %9 %52 0
%57 = OpCompositeExtract %9 %52 1
%58 = OpCompositeExtract %9 %52 2
%59 = OpCompositeExtract %9 %52 3
%61 = OpAccessChain %28 %8 %36
%62 = OpLoad %5 %61
%63 = OpIAdd %5 %62 %64
%60 = OpAccessChain %33 %17 %63
%65 = OpLoad %14 %60
%66 = OpSampledImage %48 %32 %65
%68 = OpCompositeConstruct %18 %44 %47
%67 = OpImageSampleImplicitLod %23 %66 %68 ConstOffset %55
%69 = OpCompositeExtract %9 %67 0
%70 = OpCompositeExtract %9 %67 1
%71 = OpCompositeExtract %9 %67 2
%72 = OpCompositeExtract %9 %67 3
%73 = OpFAdd %9 %69 %56
%74 = OpFAdd %9 %70 %57
%75 = OpFAdd %9 %71 %58
%76 = OpFAdd %9 %72 %59
%77 = OpAccessChain %28 %8 %78
%79 = OpLoad %5 %77
%80 = OpAccessChain %28 %8 %64
%81 = OpLoad %5 %80
%82 = OpAccessChain %28 %8 %83
%84 = OpLoad %5 %82
%85 = OpAccessChain %28 %8 %86
%87 = OpLoad %5 %85
%89 = OpCompositeConstruct %88 %79 %81 %84 %87
%90 = OpCompositeExtract %5 %89 0
%91 = OpIAdd %5 %90 %78
%93 = OpAccessChain %28 %8 %36
%94 = OpLoad %5 %93
%95 = OpIAdd %5 %94 %91
%92 = OpAccessChain %33 %17 %95
%96 = OpLoad %14 %92
%97 = OpSampledImage %48 %32 %96
%99 = OpCompositeConstruct %18 %44 %47
%98 = OpImageSampleImplicitLod %23 %97 %99 ConstOffset %55
%100 = OpCompositeExtract %9 %98 0
%101 = OpCompositeExtract %9 %98 1
%102 = OpCompositeExtract %9 %98 2
%103 = OpCompositeExtract %9 %98 3
%104 = OpFAdd %9 %73 %100
%105 = OpFAdd %9 %74 %101
%106 = OpFAdd %9 %75 %102
%107 = OpFAdd %9 %76 %103
%108 = OpIAdd %5 %41 %109
%111 = OpAccessChain %28 %8 %36
%112 = OpLoad %5 %111
%113 = OpIAdd %5 %112 %108
%110 = OpAccessChain %33 %17 %113
%114 = OpLoad %14 %110
%115 = OpSampledImage %48 %32 %114
%117 = OpCompositeConstruct %18 %44 %47
%116 = OpImageSampleImplicitLod %23 %115 %117 ConstOffset %55
%118 = OpCompositeExtract %9 %116 0
%119 = OpCompositeExtract %9 %116 1
%120 = OpCompositeExtract %9 %116 2
%121 = OpCompositeExtract %9 %116 3
%122 = OpFAdd %9 %104 %118
%123 = OpFAdd %9 %105 %119
%124 = OpFAdd %9 %106 %120
%125 = OpFAdd %9 %107 %121
%127 = OpAccessChain %126 %25 %30
OpStore %127 %122
%128 = OpAccessChain %126 %25 %46
OpStore %128 %123
%129 = OpAccessChain %126 %25 %36
OpStore %129 %124
%130 = OpAccessChain %126 %25 %39
OpStore %130 %125
OpReturn
OpFunctionEnd
#endif
