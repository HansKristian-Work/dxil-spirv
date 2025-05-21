#version 460
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

uint _67;

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
layout(set = 1, binding = 0) uniform samplerBuffer _17[];
layout(set = 1, binding = 0) uniform usamplerBuffer _21[];
layout(set = 1, binding = 0) uniform usamplerBuffer _24[];
layout(set = 3, binding = 0) uniform readonly writeonly image2D _28[];
layout(set = 4, binding = 0) uniform readonly writeonly imageBuffer _32[];
layout(set = 4, binding = 0, r32ui) uniform readonly writeonly uimageBuffer _36[];
layout(set = 4, binding = 0, r32ui) uniform readonly writeonly uimageBuffer _39[];

layout(location = 0) flat in uint LEVEL;
layout(location = 0, component = 1) flat in uint INDEX;
layout(location = 0) out uint SV_Target;

void main()
{
    uint _54 = registers._m0 + (INDEX + 0u);
    uint _58 = uint(textureQueryLevels(_13[nonuniformEXT(_54)]));
    uvec4 _66 = uvec4(mix(uvec2(0u), uvec2(textureSize(_13[nonuniformEXT(_54)], int(LEVEL))), bvec2(LEVEL < _58)), _67, _58);
    uint _79 = uint(textureSize(_17[nonuniformEXT(registers._m1 + (INDEX + 0u))]));
    uvec2 _89 = uvec2(imageSize(_28[nonuniformEXT(registers._m3 + (INDEX + 0u))]));
    uint _100 = uint(imageSize(_32[nonuniformEXT(registers._m4 + (INDEX + 0u))]));
    uint _110 = uint(textureSize(_21[nonuniformEXT(registers._m1 + (INDEX + 0u))])) / 4u;
    uint _120 = uint(imageSize(_36[nonuniformEXT(registers._m4 + (INDEX + 0u))])) / 4u;
    uint _129 = uint(textureSize(_24[nonuniformEXT(registers._m1 + (INDEX + 0u))])) * 4u;
    uint _138 = uint(imageSize(_39[nonuniformEXT(registers._m4 + (INDEX + 0u))])) * 4u;
    SV_Target = ((((((((((_66.y + 32u) + _66.x) + _66.w) + (_79 * _79)) + _89.y) + _89.x) + (_100 * _100)) + (_110 * _110)) + (_120 * _120)) + (_129 * _129)) + (_138 * _138);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 154
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability StorageImageArrayDynamicIndexing
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability ImageQuery
OpCapability RuntimeDescriptorArray
OpCapability UniformTexelBufferArrayDynamicIndexing
OpCapability StorageTexelBufferArrayDynamicIndexing
OpCapability SampledImageArrayNonUniformIndexing
OpCapability StorageImageArrayNonUniformIndexing
OpCapability UniformTexelBufferArrayNonUniformIndexing
OpCapability StorageTexelBufferArrayNonUniformIndexing
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %41 %42 %44
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %41 "LEVEL"
OpName %42 "INDEX"
OpName %44 "SV_Target"
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
OpDecorate %17 DescriptorSet 1
OpDecorate %17 Binding 0
OpDecorate %21 DescriptorSet 1
OpDecorate %21 Binding 0
OpDecorate %24 DescriptorSet 1
OpDecorate %24 Binding 0
OpDecorate %28 DescriptorSet 3
OpDecorate %28 Binding 0
OpDecorate %28 NonReadable
OpDecorate %28 NonWritable
OpDecorate %32 DescriptorSet 4
OpDecorate %32 Binding 0
OpDecorate %32 NonReadable
OpDecorate %32 NonWritable
OpDecorate %36 DescriptorSet 4
OpDecorate %36 Binding 0
OpDecorate %36 NonReadable
OpDecorate %36 NonWritable
OpDecorate %39 DescriptorSet 4
OpDecorate %39 Binding 0
OpDecorate %39 NonReadable
OpDecorate %39 NonWritable
OpDecorate %41 Flat
OpDecorate %41 Location 0
OpDecorate %42 Flat
OpDecorate %42 Location 0
OpDecorate %42 Component 1
OpDecorate %44 Location 0
OpDecorate %54 NonUniform
OpDecorate %55 NonUniform
OpDecorate %77 NonUniform
OpDecorate %78 NonUniform
OpDecorate %87 NonUniform
OpDecorate %88 NonUniform
OpDecorate %98 NonUniform
OpDecorate %99 NonUniform
OpDecorate %107 NonUniform
OpDecorate %108 NonUniform
OpDecorate %117 NonUniform
OpDecorate %118 NonUniform
OpDecorate %126 NonUniform
OpDecorate %127 NonUniform
OpDecorate %135 NonUniform
OpDecorate %136 NonUniform
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
%14 = OpTypeImage %9 Buffer 0 0 0 1 Unknown
%15 = OpTypeRuntimeArray %14
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%19 = OpTypeRuntimeArray %18
%20 = OpTypePointer UniformConstant %19
%21 = OpVariable %20 UniformConstant
%22 = OpTypeRuntimeArray %18
%23 = OpTypePointer UniformConstant %22
%24 = OpVariable %23 UniformConstant
%25 = OpTypeImage %9 2D 0 0 0 2 Unknown
%26 = OpTypeRuntimeArray %25
%27 = OpTypePointer UniformConstant %26
%28 = OpVariable %27 UniformConstant
%29 = OpTypeImage %9 Buffer 0 0 0 2 Unknown
%30 = OpTypeRuntimeArray %29
%31 = OpTypePointer UniformConstant %30
%32 = OpVariable %31 UniformConstant
%33 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%34 = OpTypeRuntimeArray %33
%35 = OpTypePointer UniformConstant %34
%36 = OpVariable %35 UniformConstant
%37 = OpTypeRuntimeArray %33
%38 = OpTypePointer UniformConstant %37
%39 = OpVariable %38 UniformConstant
%40 = OpTypePointer Input %5
%41 = OpVariable %40 Input
%42 = OpVariable %40 Input
%43 = OpTypePointer Output %5
%44 = OpVariable %43 Output
%48 = OpConstant %5 0
%49 = OpTypePointer UniformConstant %10
%51 = OpTypePointer PushConstant %5
%56 = OpTypeVector %5 2
%59 = OpTypeBool
%61 = OpTypeVector %59 2
%64 = OpConstantNull %56
%65 = OpTypeVector %5 4
%72 = OpTypePointer UniformConstant %14
%75 = OpConstant %5 1
%82 = OpTypePointer UniformConstant %25
%85 = OpConstant %5 3
%93 = OpTypePointer UniformConstant %29
%96 = OpConstant %5 4
%103 = OpTypePointer UniformConstant %18
%113 = OpTypePointer UniformConstant %33
%141 = OpConstant %5 32
%3 = OpFunction %1 None %2
%4 = OpLabel
%67 = OpUndef %5
OpBranch %152
%152 = OpLabel
%45 = OpLoad %5 %42
%46 = OpLoad %5 %41
%47 = OpIAdd %5 %45 %48
%52 = OpAccessChain %51 %8 %48
%53 = OpLoad %5 %52
%54 = OpIAdd %5 %53 %47
%50 = OpAccessChain %49 %13 %54
%55 = OpLoad %10 %50
%57 = OpImageQuerySizeLod %56 %55 %46
%58 = OpImageQueryLevels %5 %55
%60 = OpULessThan %59 %46 %58
%62 = OpCompositeConstruct %61 %60 %60
%63 = OpSelect %56 %62 %57 %64
%66 = OpCompositeConstruct %65 %63 %67 %58
%68 = OpCompositeExtract %5 %66 0
%69 = OpCompositeExtract %5 %66 1
%70 = OpCompositeExtract %5 %66 3
%71 = OpIAdd %5 %45 %48
%74 = OpAccessChain %51 %8 %75
%76 = OpLoad %5 %74
%77 = OpIAdd %5 %76 %71
%73 = OpAccessChain %72 %17 %77
%78 = OpLoad %14 %73
%79 = OpImageQuerySize %5 %78
%80 = OpIMul %5 %79 %79
%81 = OpIAdd %5 %45 %48
%84 = OpAccessChain %51 %8 %85
%86 = OpLoad %5 %84
%87 = OpIAdd %5 %86 %81
%83 = OpAccessChain %82 %28 %87
%88 = OpLoad %25 %83
%89 = OpImageQuerySize %56 %88
%90 = OpCompositeExtract %5 %89 0
%91 = OpCompositeExtract %5 %89 1
%92 = OpIAdd %5 %45 %48
%95 = OpAccessChain %51 %8 %96
%97 = OpLoad %5 %95
%98 = OpIAdd %5 %97 %92
%94 = OpAccessChain %93 %32 %98
%99 = OpLoad %29 %94
%100 = OpImageQuerySize %5 %99
%101 = OpIMul %5 %100 %100
%102 = OpIAdd %5 %45 %48
%105 = OpAccessChain %51 %8 %75
%106 = OpLoad %5 %105
%107 = OpIAdd %5 %106 %102
%104 = OpAccessChain %103 %21 %107
%108 = OpLoad %18 %104
%109 = OpImageQuerySize %5 %108
%110 = OpUDiv %5 %109 %96
%111 = OpIMul %5 %110 %110
%112 = OpIAdd %5 %45 %48
%115 = OpAccessChain %51 %8 %96
%116 = OpLoad %5 %115
%117 = OpIAdd %5 %116 %112
%114 = OpAccessChain %113 %36 %117
%118 = OpLoad %33 %114
%119 = OpImageQuerySize %5 %118
%120 = OpUDiv %5 %119 %96
%121 = OpIMul %5 %120 %120
%122 = OpIAdd %5 %45 %48
%124 = OpAccessChain %51 %8 %75
%125 = OpLoad %5 %124
%126 = OpIAdd %5 %125 %122
%123 = OpAccessChain %103 %24 %126
%127 = OpLoad %18 %123
%128 = OpImageQuerySize %5 %127
%129 = OpIMul %5 %128 %96
%130 = OpIMul %5 %129 %129
%131 = OpIAdd %5 %45 %48
%133 = OpAccessChain %51 %8 %96
%134 = OpLoad %5 %133
%135 = OpIAdd %5 %134 %131
%132 = OpAccessChain %113 %39 %135
%136 = OpLoad %33 %132
%137 = OpImageQuerySize %5 %136
%138 = OpIMul %5 %137 %96
%139 = OpIMul %5 %138 %138
%140 = OpIAdd %5 %69 %141
%142 = OpIAdd %5 %140 %68
%143 = OpIAdd %5 %142 %70
%144 = OpIAdd %5 %143 %80
%145 = OpIAdd %5 %144 %91
%146 = OpIAdd %5 %145 %90
%147 = OpIAdd %5 %146 %101
%148 = OpIAdd %5 %147 %111
%149 = OpIAdd %5 %148 %121
%150 = OpIAdd %5 %149 %130
%151 = OpIAdd %5 %150 %139
OpStore %44 %151
OpReturn
OpFunctionEnd
#endif
