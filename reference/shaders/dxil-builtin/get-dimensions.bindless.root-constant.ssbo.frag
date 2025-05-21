#version 460
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

uint _73;

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
    uint _64 = uint(textureQueryLevels(_13[nonuniformEXT(_60)]));
    uvec4 _72 = uvec4(mix(uvec2(0u), uvec2(textureSize(_13[nonuniformEXT(_60)], int(LEVEL))), bvec2(LEVEL < _64)), _73, _64);
    uint _85 = uint(textureSize(_17[nonuniformEXT(registers._m1 + (INDEX + 0u))]));
    uvec2 _95 = uvec2(imageSize(_31[nonuniformEXT(registers._m3 + (INDEX + 0u))]));
    uint _106 = uint(imageSize(_35[nonuniformEXT(registers._m4 + (INDEX + 0u))]));
    uint _115 = uint(_22[nonuniformEXT(registers._m1 + (INDEX + 0u))]._m0.length()) / 4u;
    uint _124 = uint(_40[nonuniformEXT(registers._m4 + (INDEX + 0u))]._m0.length()) / 4u;
    uint _133 = uint(_27[nonuniformEXT(registers._m1 + (INDEX + 0u))]._m0.length()) * 4u;
    uint _142 = uint(_45[nonuniformEXT(registers._m4 + (INDEX + 0u))]._m0.length()) * 4u;
    SV_Target = ((((((((((_72.y + 32u) + _72.x) + _72.w) + (_85 * _85)) + _95.y) + _95.x) + (_106 * _106)) + (_115 * _115)) + (_124 * _124)) + (_133 * _133)) + (_142 * _142);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 158
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
OpDecorate %83 NonUniform
OpDecorate %84 NonUniform
OpDecorate %93 NonUniform
OpDecorate %94 NonUniform
OpDecorate %104 NonUniform
OpDecorate %105 NonUniform
OpDecorate %113 NonUniform
OpDecorate %110 NonUniform
OpDecorate %122 NonUniform
OpDecorate %119 NonUniform
OpDecorate %131 NonUniform
OpDecorate %128 NonUniform
OpDecorate %140 NonUniform
OpDecorate %137 NonUniform
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
%65 = OpTypeBool
%67 = OpTypeVector %65 2
%70 = OpConstantNull %62
%71 = OpTypeVector %5 4
%78 = OpTypePointer UniformConstant %14
%81 = OpConstant %5 1
%88 = OpTypePointer UniformConstant %28
%91 = OpConstant %5 3
%99 = OpTypePointer UniformConstant %32
%102 = OpConstant %5 4
%109 = OpTypePointer StorageBuffer %19
%118 = OpTypePointer StorageBuffer %37
%127 = OpTypePointer StorageBuffer %24
%136 = OpTypePointer StorageBuffer %42
%145 = OpConstant %5 32
%3 = OpFunction %1 None %2
%4 = OpLabel
%73 = OpUndef %5
OpBranch %156
%156 = OpLabel
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
%66 = OpULessThan %65 %52 %64
%68 = OpCompositeConstruct %67 %66 %66
%69 = OpSelect %62 %68 %63 %70
%72 = OpCompositeConstruct %71 %69 %73 %64
%74 = OpCompositeExtract %5 %72 0
%75 = OpCompositeExtract %5 %72 1
%76 = OpCompositeExtract %5 %72 3
%77 = OpIAdd %5 %51 %54
%80 = OpAccessChain %57 %8 %81
%82 = OpLoad %5 %80
%83 = OpIAdd %5 %82 %77
%79 = OpAccessChain %78 %17 %83
%84 = OpLoad %14 %79
%85 = OpImageQuerySize %5 %84
%86 = OpIMul %5 %85 %85
%87 = OpIAdd %5 %51 %54
%90 = OpAccessChain %57 %8 %91
%92 = OpLoad %5 %90
%93 = OpIAdd %5 %92 %87
%89 = OpAccessChain %88 %31 %93
%94 = OpLoad %28 %89
%95 = OpImageQuerySize %62 %94
%96 = OpCompositeExtract %5 %95 0
%97 = OpCompositeExtract %5 %95 1
%98 = OpIAdd %5 %51 %54
%101 = OpAccessChain %57 %8 %102
%103 = OpLoad %5 %101
%104 = OpIAdd %5 %103 %98
%100 = OpAccessChain %99 %35 %104
%105 = OpLoad %32 %100
%106 = OpImageQuerySize %5 %105
%107 = OpIMul %5 %106 %106
%108 = OpIAdd %5 %51 %54
%111 = OpAccessChain %57 %8 %81
%112 = OpLoad %5 %111
%113 = OpIAdd %5 %112 %108
%110 = OpAccessChain %109 %22 %113
%114 = OpArrayLength %5 %110 0
%115 = OpUDiv %5 %114 %102
%116 = OpIMul %5 %115 %115
%117 = OpIAdd %5 %51 %54
%120 = OpAccessChain %57 %8 %102
%121 = OpLoad %5 %120
%122 = OpIAdd %5 %121 %117
%119 = OpAccessChain %118 %40 %122
%123 = OpArrayLength %5 %119 0
%124 = OpUDiv %5 %123 %102
%125 = OpIMul %5 %124 %124
%126 = OpIAdd %5 %51 %54
%129 = OpAccessChain %57 %8 %81
%130 = OpLoad %5 %129
%131 = OpIAdd %5 %130 %126
%128 = OpAccessChain %127 %27 %131
%132 = OpArrayLength %5 %128 0
%133 = OpIMul %5 %132 %102
%134 = OpIMul %5 %133 %133
%135 = OpIAdd %5 %51 %54
%138 = OpAccessChain %57 %8 %102
%139 = OpLoad %5 %138
%140 = OpIAdd %5 %139 %135
%137 = OpAccessChain %136 %45 %140
%141 = OpArrayLength %5 %137 0
%142 = OpIMul %5 %141 %102
%143 = OpIMul %5 %142 %142
%144 = OpIAdd %5 %75 %145
%146 = OpIAdd %5 %144 %74
%147 = OpIAdd %5 %146 %76
%148 = OpIAdd %5 %147 %86
%149 = OpIAdd %5 %148 %97
%150 = OpIAdd %5 %149 %96
%151 = OpIAdd %5 %150 %107
%152 = OpIAdd %5 %151 %116
%153 = OpIAdd %5 %152 %125
%154 = OpIAdd %5 %153 %134
%155 = OpIAdd %5 %154 %143
OpStore %50 %155
OpReturn
OpFunctionEnd
#endif
