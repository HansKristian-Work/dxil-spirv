#version 460
#extension GL_EXT_buffer_reference2 : require
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
    vec4 _51 = texture(sampler2D(_13[registers._m0], _17[registers._m2 + 3u]), vec2(UV.x, UV.y));
    vec4 _64 = texture(sampler2D(_13[registers._m0], _17[registers._m2 + 5u]), vec2(UV.x, UV.y));
    vec4 _95 = texture(sampler2D(_13[registers._m0], _17[registers._m2 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u)]), vec2(UV.x, UV.y));
    vec4 _113 = texture(nonuniformEXT(sampler2D(_13[registers._m0], _17[registers._m2 + (INDEX + 100u)])), vec2(UV.x, UV.y));
    SV_Target.x = ((_64.x + _51.x) + _95.x) + _113.x;
    SV_Target.y = ((_64.y + _51.y) + _95.y) + _113.y;
    SV_Target.z = ((_64.z + _51.z) + _95.z) + _113.z;
    SV_Target.w = ((_64.w + _51.w) + _95.w) + _113.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 130
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
OpDecorate %110 NonUniform
OpDecorate %111 NonUniform
OpDecorate %112 NonUniform
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
%50 = OpConstant %9 0
%61 = OpConstant %5 5
%75 = OpConstant %5 4
%80 = OpConstant %5 6
%83 = OpConstant %5 7
%85 = OpTypeVector %5 4
%106 = OpConstant %5 100
%123 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %128
%128 = OpLabel
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
%52 = OpCompositeConstruct %18 %44 %47
%51 = OpImageSampleImplicitLod %23 %49 %52 None
%53 = OpCompositeExtract %9 %51 0
%54 = OpCompositeExtract %9 %51 1
%55 = OpCompositeExtract %9 %51 2
%56 = OpCompositeExtract %9 %51 3
%58 = OpAccessChain %28 %8 %36
%59 = OpLoad %5 %58
%60 = OpIAdd %5 %59 %61
%57 = OpAccessChain %33 %17 %60
%62 = OpLoad %14 %57
%63 = OpSampledImage %48 %32 %62
%65 = OpCompositeConstruct %18 %44 %47
%64 = OpImageSampleImplicitLod %23 %63 %65 None
%66 = OpCompositeExtract %9 %64 0
%67 = OpCompositeExtract %9 %64 1
%68 = OpCompositeExtract %9 %64 2
%69 = OpCompositeExtract %9 %64 3
%70 = OpFAdd %9 %66 %53
%71 = OpFAdd %9 %67 %54
%72 = OpFAdd %9 %68 %55
%73 = OpFAdd %9 %69 %56
%74 = OpAccessChain %28 %8 %75
%76 = OpLoad %5 %74
%77 = OpAccessChain %28 %8 %61
%78 = OpLoad %5 %77
%79 = OpAccessChain %28 %8 %80
%81 = OpLoad %5 %79
%82 = OpAccessChain %28 %8 %83
%84 = OpLoad %5 %82
%86 = OpCompositeConstruct %85 %76 %78 %81 %84
%87 = OpCompositeExtract %5 %86 0
%88 = OpIAdd %5 %87 %75
%90 = OpAccessChain %28 %8 %36
%91 = OpLoad %5 %90
%92 = OpIAdd %5 %91 %88
%89 = OpAccessChain %33 %17 %92
%93 = OpLoad %14 %89
%94 = OpSampledImage %48 %32 %93
%96 = OpCompositeConstruct %18 %44 %47
%95 = OpImageSampleImplicitLod %23 %94 %96 None
%97 = OpCompositeExtract %9 %95 0
%98 = OpCompositeExtract %9 %95 1
%99 = OpCompositeExtract %9 %95 2
%100 = OpCompositeExtract %9 %95 3
%101 = OpFAdd %9 %70 %97
%102 = OpFAdd %9 %71 %98
%103 = OpFAdd %9 %72 %99
%104 = OpFAdd %9 %73 %100
%105 = OpIAdd %5 %41 %106
%108 = OpAccessChain %28 %8 %36
%109 = OpLoad %5 %108
%110 = OpIAdd %5 %109 %105
%107 = OpAccessChain %33 %17 %110
%111 = OpLoad %14 %107
%112 = OpSampledImage %48 %32 %111
%114 = OpCompositeConstruct %18 %44 %47
%113 = OpImageSampleImplicitLod %23 %112 %114 None
%115 = OpCompositeExtract %9 %113 0
%116 = OpCompositeExtract %9 %113 1
%117 = OpCompositeExtract %9 %113 2
%118 = OpCompositeExtract %9 %113 3
%119 = OpFAdd %9 %101 %115
%120 = OpFAdd %9 %102 %116
%121 = OpFAdd %9 %103 %117
%122 = OpFAdd %9 %104 %118
%124 = OpAccessChain %123 %25 %30
OpStore %124 %119
%125 = OpAccessChain %123 %25 %46
OpStore %125 %120
%126 = OpAccessChain %123 %25 %36
OpStore %126 %121
%127 = OpAccessChain %123 %25 %39
OpStore %127 %122
OpReturn
OpFunctionEnd
#endif
