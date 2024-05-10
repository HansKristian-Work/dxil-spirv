#version 460
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

uint _67;

layout(set = 1, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _22[];

layout(set = 1, binding = 0, std430) restrict readonly buffer _24_27
{
    uint _m0[];
} _27[];

layout(set = 4, binding = 0, std430) writeonly readonly buffer _37_40
{
    uint _m0[];
} _40[];

layout(set = 4, binding = 0, std430) writeonly readonly buffer _42_45
{
    uint _m0[];
} _45[];

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
layout(set = 3, binding = 0) uniform readonly writeonly image2D _31[];
layout(set = 4, binding = 0) uniform readonly writeonly imageBuffer _35[];

layout(location = 0) flat in uint LEVEL;
layout(location = 0, component = 1) flat in uint INDEX;
layout(location = 0) out uint SV_Target;

void main()
{
    uint _60 = registers._m0 + (INDEX + 0u);
    uvec4 _66 = uvec4(uvec2(textureSize(_13[nonuniformEXT(_60)], int(LEVEL))), _67, uint(textureQueryLevels(_13[nonuniformEXT(_60)])));
    uint _79 = uint(textureSize(_17[nonuniformEXT(registers._m1 + (INDEX + 0u))]));
    uvec2 _89 = uvec2(imageSize(_31[nonuniformEXT(registers._m3 + (INDEX + 0u))]));
    uint _100 = uint(imageSize(_35[nonuniformEXT(registers._m4 + (INDEX + 0u))]));
    uint _109 = uint(_22[nonuniformEXT(registers._m1 + (INDEX + 0u))]._m0.length()) / 4u;
    uint _118 = uint(_40[nonuniformEXT(registers._m4 + (INDEX + 0u))]._m0.length()) / 4u;
    uint _127 = uint(_27[nonuniformEXT(registers._m1 + (INDEX + 0u))]._m0.length()) * 4u;
    uint _136 = uint(_45[nonuniformEXT(registers._m4 + (INDEX + 0u))]._m0.length()) * 4u;
    SV_Target = ((((((((((_66.y + 32u) + _66.x) + _66.w) + (_79 * _79)) + _89.y) + _89.x) + (_100 * _100)) + (_109 * _109)) + (_118 * _118)) + (_127 * _127)) + (_136 * _136);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 152
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability StorageBufferArrayDynamicIndexing
OpCapability StorageImageArrayDynamicIndexing
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability ImageQuery
OpCapability RuntimeDescriptorArray
OpCapability UniformTexelBufferArrayDynamicIndexing
OpCapability StorageTexelBufferArrayDynamicIndexing
OpCapability SampledImageArrayNonUniformIndexing
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability StorageImageArrayNonUniformIndexing
OpCapability UniformTexelBufferArrayNonUniformIndexing
OpCapability StorageTexelBufferArrayNonUniformIndexing
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %47 %48 %50
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %19 "SSBO"
OpName %24 "SSBO"
OpName %37 "SSBO"
OpName %42 "SSBO"
OpName %47 "LEVEL"
OpName %48 "INDEX"
OpName %50 "SV_Target"
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
OpDecorate %18 ArrayStride 4
OpMemberDecorate %19 0 Offset 0
OpDecorate %19 Block
OpDecorate %22 DescriptorSet 1
OpDecorate %22 Binding 0
OpDecorate %22 NonWritable
OpDecorate %22 Restrict
OpDecorate %23 ArrayStride 4
OpMemberDecorate %24 0 Offset 0
OpDecorate %24 Block
OpDecorate %27 DescriptorSet 1
OpDecorate %27 Binding 0
OpDecorate %27 NonWritable
OpDecorate %27 Restrict
OpDecorate %31 DescriptorSet 3
OpDecorate %31 Binding 0
OpDecorate %31 NonReadable
OpDecorate %31 NonWritable
OpDecorate %35 DescriptorSet 4
OpDecorate %35 Binding 0
OpDecorate %35 NonReadable
OpDecorate %35 NonWritable
OpDecorate %36 ArrayStride 4
OpMemberDecorate %37 0 Offset 0
OpDecorate %37 Block
OpDecorate %40 DescriptorSet 4
OpDecorate %40 Binding 0
OpDecorate %40 NonReadable
OpDecorate %40 NonWritable
OpDecorate %41 ArrayStride 4
OpMemberDecorate %42 0 Offset 0
OpDecorate %42 Block
OpDecorate %45 DescriptorSet 4
OpDecorate %45 Binding 0
OpDecorate %45 NonReadable
OpDecorate %45 NonWritable
OpDecorate %47 Flat
OpDecorate %47 Location 0
OpDecorate %48 Flat
OpDecorate %48 Location 0
OpDecorate %48 Component 1
OpDecorate %50 Location 0
OpDecorate %60 NonUniform
OpDecorate %61 NonUniform
OpDecorate %77 NonUniform
OpDecorate %78 NonUniform
OpDecorate %87 NonUniform
OpDecorate %88 NonUniform
OpDecorate %98 NonUniform
OpDecorate %99 NonUniform
OpDecorate %107 NonUniform
OpDecorate %104 NonUniform
OpDecorate %116 NonUniform
OpDecorate %113 NonUniform
OpDecorate %125 NonUniform
OpDecorate %122 NonUniform
OpDecorate %134 NonUniform
OpDecorate %131 NonUniform
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
%18 = OpTypeRuntimeArray %5
%19 = OpTypeStruct %18
%20 = OpTypeRuntimeArray %19
%21 = OpTypePointer StorageBuffer %20
%22 = OpVariable %21 StorageBuffer
%23 = OpTypeRuntimeArray %5
%24 = OpTypeStruct %23
%25 = OpTypeRuntimeArray %24
%26 = OpTypePointer StorageBuffer %25
%27 = OpVariable %26 StorageBuffer
%28 = OpTypeImage %9 2D 0 0 0 2 Unknown
%29 = OpTypeRuntimeArray %28
%30 = OpTypePointer UniformConstant %29
%31 = OpVariable %30 UniformConstant
%32 = OpTypeImage %9 Buffer 0 0 0 2 Unknown
%33 = OpTypeRuntimeArray %32
%34 = OpTypePointer UniformConstant %33
%35 = OpVariable %34 UniformConstant
%36 = OpTypeRuntimeArray %5
%37 = OpTypeStruct %36
%38 = OpTypeRuntimeArray %37
%39 = OpTypePointer StorageBuffer %38
%40 = OpVariable %39 StorageBuffer
%41 = OpTypeRuntimeArray %5
%42 = OpTypeStruct %41
%43 = OpTypeRuntimeArray %42
%44 = OpTypePointer StorageBuffer %43
%45 = OpVariable %44 StorageBuffer
%46 = OpTypePointer Input %5
%47 = OpVariable %46 Input
%48 = OpVariable %46 Input
%49 = OpTypePointer Output %5
%50 = OpVariable %49 Output
%54 = OpConstant %5 0
%55 = OpTypePointer UniformConstant %10
%57 = OpTypePointer PushConstant %5
%62 = OpTypeVector %5 2
%65 = OpTypeVector %5 4
%72 = OpTypePointer UniformConstant %14
%75 = OpConstant %5 1
%82 = OpTypePointer UniformConstant %28
%85 = OpConstant %5 3
%93 = OpTypePointer UniformConstant %32
%96 = OpConstant %5 4
%103 = OpTypePointer StorageBuffer %19
%112 = OpTypePointer StorageBuffer %37
%121 = OpTypePointer StorageBuffer %24
%130 = OpTypePointer StorageBuffer %42
%139 = OpConstant %5 32
%3 = OpFunction %1 None %2
%4 = OpLabel
%67 = OpUndef %5
OpBranch %150
%150 = OpLabel
%51 = OpLoad %5 %48
%52 = OpLoad %5 %47
%53 = OpIAdd %5 %51 %54
%58 = OpAccessChain %57 %8 %54
%59 = OpLoad %5 %58
%60 = OpIAdd %5 %59 %53
%56 = OpAccessChain %55 %13 %60
%61 = OpLoad %10 %56
%63 = OpImageQuerySizeLod %62 %61 %52
%64 = OpImageQueryLevels %5 %61
%66 = OpCompositeConstruct %65 %63 %67 %64
%68 = OpCompositeExtract %5 %66 0
%69 = OpCompositeExtract %5 %66 1
%70 = OpCompositeExtract %5 %66 3
%71 = OpIAdd %5 %51 %54
%74 = OpAccessChain %57 %8 %75
%76 = OpLoad %5 %74
%77 = OpIAdd %5 %76 %71
%73 = OpAccessChain %72 %17 %77
%78 = OpLoad %14 %73
%79 = OpImageQuerySize %5 %78
%80 = OpIMul %5 %79 %79
%81 = OpIAdd %5 %51 %54
%84 = OpAccessChain %57 %8 %85
%86 = OpLoad %5 %84
%87 = OpIAdd %5 %86 %81
%83 = OpAccessChain %82 %31 %87
%88 = OpLoad %28 %83
%89 = OpImageQuerySize %62 %88
%90 = OpCompositeExtract %5 %89 0
%91 = OpCompositeExtract %5 %89 1
%92 = OpIAdd %5 %51 %54
%95 = OpAccessChain %57 %8 %96
%97 = OpLoad %5 %95
%98 = OpIAdd %5 %97 %92
%94 = OpAccessChain %93 %35 %98
%99 = OpLoad %32 %94
%100 = OpImageQuerySize %5 %99
%101 = OpIMul %5 %100 %100
%102 = OpIAdd %5 %51 %54
%105 = OpAccessChain %57 %8 %75
%106 = OpLoad %5 %105
%107 = OpIAdd %5 %106 %102
%104 = OpAccessChain %103 %22 %107
%108 = OpArrayLength %5 %104 0
%109 = OpUDiv %5 %108 %96
%110 = OpIMul %5 %109 %109
%111 = OpIAdd %5 %51 %54
%114 = OpAccessChain %57 %8 %96
%115 = OpLoad %5 %114
%116 = OpIAdd %5 %115 %111
%113 = OpAccessChain %112 %40 %116
%117 = OpArrayLength %5 %113 0
%118 = OpUDiv %5 %117 %96
%119 = OpIMul %5 %118 %118
%120 = OpIAdd %5 %51 %54
%123 = OpAccessChain %57 %8 %75
%124 = OpLoad %5 %123
%125 = OpIAdd %5 %124 %120
%122 = OpAccessChain %121 %27 %125
%126 = OpArrayLength %5 %122 0
%127 = OpIMul %5 %126 %96
%128 = OpIMul %5 %127 %127
%129 = OpIAdd %5 %51 %54
%132 = OpAccessChain %57 %8 %96
%133 = OpLoad %5 %132
%134 = OpIAdd %5 %133 %129
%131 = OpAccessChain %130 %45 %134
%135 = OpArrayLength %5 %131 0
%136 = OpIMul %5 %135 %96
%137 = OpIMul %5 %136 %136
%138 = OpIAdd %5 %69 %139
%140 = OpIAdd %5 %138 %68
%141 = OpIAdd %5 %140 %70
%142 = OpIAdd %5 %141 %80
%143 = OpIAdd %5 %142 %91
%144 = OpIAdd %5 %143 %90
%145 = OpIAdd %5 %144 %101
%146 = OpIAdd %5 %145 %110
%147 = OpIAdd %5 %146 %119
%148 = OpIAdd %5 %147 %128
%149 = OpIAdd %5 %148 %137
OpStore %50 %149
OpReturn
OpFunctionEnd
#endif
