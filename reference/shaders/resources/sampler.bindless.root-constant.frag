#version 460
#extension GL_EXT_buffer_reference : require
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
    vec4 _53 = textureOffset(sampler2D(_13[registers._m0], _17[registers._m2 + 3u]), vec2(UV.x, UV.y), ivec2(0));
    vec4 _68 = textureOffset(sampler2D(_13[registers._m0], _17[registers._m2 + 5u]), vec2(UV.x, UV.y), ivec2(0));
    vec4 _99 = textureOffset(sampler2D(_13[registers._m0], _17[registers._m2 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u)]), vec2(UV.x, UV.y), ivec2(0));
    vec4 _117 = textureOffset(nonuniformEXT(sampler2D(_13[registers._m0], _17[registers._m2 + (INDEX + 100u)])), vec2(UV.x, UV.y), ivec2(0));
    SV_Target.x = ((_68.x + _53.x) + _99.x) + _117.x;
    SV_Target.y = ((_68.y + _53.y) + _99.y) + _117.y;
    SV_Target.z = ((_68.z + _53.z) + _99.z) + _117.z;
    SV_Target.w = ((_68.w + _53.w) + _99.w) + _117.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 134
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
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
OpDecorate %114 NonUniform
OpDecorate %115 NonUniform
OpDecorate %116 NonUniform
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
%52 = OpConstant %9 0
%55 = OpTypeVector %50 2
%56 = OpConstantComposite %55 %51 %51
%65 = OpConstant %5 5
%79 = OpConstant %5 4
%84 = OpConstant %5 6
%87 = OpConstant %5 7
%89 = OpTypeVector %5 4
%110 = OpConstant %5 100
%127 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %132
%132 = OpLabel
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
%54 = OpCompositeConstruct %18 %44 %47
%53 = OpImageSampleImplicitLod %23 %49 %54 ConstOffset %56
%57 = OpCompositeExtract %9 %53 0
%58 = OpCompositeExtract %9 %53 1
%59 = OpCompositeExtract %9 %53 2
%60 = OpCompositeExtract %9 %53 3
%62 = OpAccessChain %28 %8 %36
%63 = OpLoad %5 %62
%64 = OpIAdd %5 %63 %65
%61 = OpAccessChain %33 %17 %64
%66 = OpLoad %14 %61
%67 = OpSampledImage %48 %32 %66
%69 = OpCompositeConstruct %18 %44 %47
%68 = OpImageSampleImplicitLod %23 %67 %69 ConstOffset %56
%70 = OpCompositeExtract %9 %68 0
%71 = OpCompositeExtract %9 %68 1
%72 = OpCompositeExtract %9 %68 2
%73 = OpCompositeExtract %9 %68 3
%74 = OpFAdd %9 %70 %57
%75 = OpFAdd %9 %71 %58
%76 = OpFAdd %9 %72 %59
%77 = OpFAdd %9 %73 %60
%78 = OpAccessChain %28 %8 %79
%80 = OpLoad %5 %78
%81 = OpAccessChain %28 %8 %65
%82 = OpLoad %5 %81
%83 = OpAccessChain %28 %8 %84
%85 = OpLoad %5 %83
%86 = OpAccessChain %28 %8 %87
%88 = OpLoad %5 %86
%90 = OpCompositeConstruct %89 %80 %82 %85 %88
%91 = OpCompositeExtract %5 %90 0
%92 = OpIAdd %5 %91 %79
%94 = OpAccessChain %28 %8 %36
%95 = OpLoad %5 %94
%96 = OpIAdd %5 %95 %92
%93 = OpAccessChain %33 %17 %96
%97 = OpLoad %14 %93
%98 = OpSampledImage %48 %32 %97
%100 = OpCompositeConstruct %18 %44 %47
%99 = OpImageSampleImplicitLod %23 %98 %100 ConstOffset %56
%101 = OpCompositeExtract %9 %99 0
%102 = OpCompositeExtract %9 %99 1
%103 = OpCompositeExtract %9 %99 2
%104 = OpCompositeExtract %9 %99 3
%105 = OpFAdd %9 %74 %101
%106 = OpFAdd %9 %75 %102
%107 = OpFAdd %9 %76 %103
%108 = OpFAdd %9 %77 %104
%109 = OpIAdd %5 %41 %110
%112 = OpAccessChain %28 %8 %36
%113 = OpLoad %5 %112
%114 = OpIAdd %5 %113 %109
%111 = OpAccessChain %33 %17 %114
%115 = OpLoad %14 %111
%116 = OpSampledImage %48 %32 %115
%118 = OpCompositeConstruct %18 %44 %47
%117 = OpImageSampleImplicitLod %23 %116 %118 ConstOffset %56
%119 = OpCompositeExtract %9 %117 0
%120 = OpCompositeExtract %9 %117 1
%121 = OpCompositeExtract %9 %117 2
%122 = OpCompositeExtract %9 %117 3
%123 = OpFAdd %9 %105 %119
%124 = OpFAdd %9 %106 %120
%125 = OpFAdd %9 %107 %121
%126 = OpFAdd %9 %108 %122
%128 = OpAccessChain %127 %25 %30
OpStore %128 %123
%129 = OpAccessChain %127 %25 %46
OpStore %129 %124
%130 = OpAccessChain %127 %25 %36
OpStore %130 %125
%131 = OpAccessChain %127 %25 %39
OpStore %131 %126
OpReturn
OpFunctionEnd
#endif
