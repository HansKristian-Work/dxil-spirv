#version 460
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

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

uint _61;

void main()
{
    uint _54 = registers._m0 + (INDEX + 0u);
    uvec4 _60 = uvec4(uvec2(textureSize(_13[nonuniformEXT(_54)], int(LEVEL))), _61, uint(textureQueryLevels(_13[nonuniformEXT(_54)])));
    uint _73 = uint(textureSize(_17[nonuniformEXT(registers._m1 + (INDEX + 0u))]));
    uvec2 _83 = uvec2(imageSize(_28[nonuniformEXT(registers._m3 + (INDEX + 0u))]));
    uint _94 = uint(imageSize(_32[nonuniformEXT(registers._m4 + (INDEX + 0u))]));
    uint _104 = uint(textureSize(_21[nonuniformEXT(registers._m1 + (INDEX + 0u))])) / 4u;
    uint _114 = uint(imageSize(_36[nonuniformEXT(registers._m4 + (INDEX + 0u))])) / 4u;
    uint _123 = uint(textureSize(_24[nonuniformEXT(registers._m1 + (INDEX + 0u))])) * 4u;
    uint _132 = uint(imageSize(_39[nonuniformEXT(registers._m4 + (INDEX + 0u))])) * 4u;
    SV_Target = ((((((((((_60.y + 32u) + _60.x) + _60.w) + (_73 * _73)) + _83.y) + _83.x) + (_94 * _94)) + (_104 * _104)) + (_114 * _114)) + (_123 * _123)) + (_132 * _132);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 147
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
OpDecorate %71 NonUniform
OpDecorate %72 NonUniform
OpDecorate %81 NonUniform
OpDecorate %82 NonUniform
OpDecorate %92 NonUniform
OpDecorate %93 NonUniform
OpDecorate %101 NonUniform
OpDecorate %102 NonUniform
OpDecorate %111 NonUniform
OpDecorate %112 NonUniform
OpDecorate %120 NonUniform
OpDecorate %121 NonUniform
OpDecorate %129 NonUniform
OpDecorate %130 NonUniform
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
%59 = OpTypeVector %5 4
%66 = OpTypePointer UniformConstant %14
%69 = OpConstant %5 1
%76 = OpTypePointer UniformConstant %25
%79 = OpConstant %5 3
%87 = OpTypePointer UniformConstant %29
%90 = OpConstant %5 4
%97 = OpTypePointer UniformConstant %18
%107 = OpTypePointer UniformConstant %33
%135 = OpConstant %5 32
%3 = OpFunction %1 None %2
%4 = OpLabel
%61 = OpUndef %5
OpBranch %146
%146 = OpLabel
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
%60 = OpCompositeConstruct %59 %57 %61 %58
%62 = OpCompositeExtract %5 %60 0
%63 = OpCompositeExtract %5 %60 1
%64 = OpCompositeExtract %5 %60 3
%65 = OpIAdd %5 %45 %48
%68 = OpAccessChain %51 %8 %69
%70 = OpLoad %5 %68
%71 = OpIAdd %5 %70 %65
%67 = OpAccessChain %66 %17 %71
%72 = OpLoad %14 %67
%73 = OpImageQuerySize %5 %72
%74 = OpIMul %5 %73 %73
%75 = OpIAdd %5 %45 %48
%78 = OpAccessChain %51 %8 %79
%80 = OpLoad %5 %78
%81 = OpIAdd %5 %80 %75
%77 = OpAccessChain %76 %28 %81
%82 = OpLoad %25 %77
%83 = OpImageQuerySize %56 %82
%84 = OpCompositeExtract %5 %83 0
%85 = OpCompositeExtract %5 %83 1
%86 = OpIAdd %5 %45 %48
%89 = OpAccessChain %51 %8 %90
%91 = OpLoad %5 %89
%92 = OpIAdd %5 %91 %86
%88 = OpAccessChain %87 %32 %92
%93 = OpLoad %29 %88
%94 = OpImageQuerySize %5 %93
%95 = OpIMul %5 %94 %94
%96 = OpIAdd %5 %45 %48
%99 = OpAccessChain %51 %8 %69
%100 = OpLoad %5 %99
%101 = OpIAdd %5 %100 %96
%98 = OpAccessChain %97 %21 %101
%102 = OpLoad %18 %98
%103 = OpImageQuerySize %5 %102
%104 = OpUDiv %5 %103 %90
%105 = OpIMul %5 %104 %104
%106 = OpIAdd %5 %45 %48
%109 = OpAccessChain %51 %8 %90
%110 = OpLoad %5 %109
%111 = OpIAdd %5 %110 %106
%108 = OpAccessChain %107 %36 %111
%112 = OpLoad %33 %108
%113 = OpImageQuerySize %5 %112
%114 = OpUDiv %5 %113 %90
%115 = OpIMul %5 %114 %114
%116 = OpIAdd %5 %45 %48
%118 = OpAccessChain %51 %8 %69
%119 = OpLoad %5 %118
%120 = OpIAdd %5 %119 %116
%117 = OpAccessChain %97 %24 %120
%121 = OpLoad %18 %117
%122 = OpImageQuerySize %5 %121
%123 = OpIMul %5 %122 %90
%124 = OpIMul %5 %123 %123
%125 = OpIAdd %5 %45 %48
%127 = OpAccessChain %51 %8 %90
%128 = OpLoad %5 %127
%129 = OpIAdd %5 %128 %125
%126 = OpAccessChain %107 %39 %129
%130 = OpLoad %33 %126
%131 = OpImageQuerySize %5 %130
%132 = OpIMul %5 %131 %90
%133 = OpIMul %5 %132 %132
%134 = OpIAdd %5 %63 %135
%136 = OpIAdd %5 %134 %62
%137 = OpIAdd %5 %136 %64
%138 = OpIAdd %5 %137 %74
%139 = OpIAdd %5 %138 %85
%140 = OpIAdd %5 %139 %84
%141 = OpIAdd %5 %140 %95
%142 = OpIAdd %5 %141 %105
%143 = OpIAdd %5 %142 %115
%144 = OpIAdd %5 %143 %124
%145 = OpIAdd %5 %144 %133
OpStore %44 %145
OpReturn
OpFunctionEnd
#endif
