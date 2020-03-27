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

layout(set = 4, binding = 0, r32f) uniform readonly imageBuffer _13[];
layout(set = 4, binding = 0, r32ui) uniform readonly uimageBuffer _17[];
layout(set = 4, binding = 0, r32i) uniform readonly iimageBuffer _22[];

layout(location = 1) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _44 = uint(int(gl_FragCoord.x));
    vec4 _45 = imageLoad(_13[registers._m4 + 3u], int(_44));
    uvec4 _71 = imageLoad(_17[registers._m4 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u)], int(_44));
    uvec4 _94 = uvec4(imageLoad(_22[nonuniformEXT(registers._m4 + (INDEX + 100u))], int(_44)));
    SV_Target.x = (float(_71.x) + _45.x) + float(int(_94.x));
    SV_Target.y = (float(_71.y) + _45.y) + float(int(_94.y));
    SV_Target.z = (float(_71.z) + _45.z) + float(int(_94.z));
    SV_Target.w = (float(_71.w) + _45.w) + float(int(_94.w));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 116
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability RuntimeDescriptorArray
OpCapability StorageTexelBufferArrayDynamicIndexing
OpCapability StorageTexelBufferArrayNonUniformIndexing
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %25 %27 %29
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %25 "SV_Position"
OpName %27 "INDEX"
OpName %29 "SV_Target"
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
OpDecorate %13 DescriptorSet 4
OpDecorate %13 Binding 0
OpDecorate %13 NonWritable
OpDecorate %17 DescriptorSet 4
OpDecorate %17 Binding 0
OpDecorate %17 NonWritable
OpDecorate %22 DescriptorSet 4
OpDecorate %22 Binding 0
OpDecorate %22 NonWritable
OpDecorate %25 BuiltIn FragCoord
OpDecorate %27 Flat
OpDecorate %27 Location 1
OpDecorate %29 Location 0
OpDecorate %84 NonUniform
OpDecorate %91 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeFloat 32
%10 = OpTypeImage %9 Buffer 0 0 0 2 R32f
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer UniformConstant %11
%13 = OpVariable %12 UniformConstant
%14 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%15 = OpTypeRuntimeArray %14
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeInt 32 1
%19 = OpTypeImage %18 Buffer 0 0 0 2 R32i
%20 = OpTypeRuntimeArray %19
%21 = OpTypePointer UniformConstant %20
%22 = OpVariable %21 UniformConstant
%23 = OpTypeVector %9 4
%24 = OpTypePointer Input %23
%25 = OpVariable %24 Input
%26 = OpTypePointer Input %5
%27 = OpVariable %26 Input
%28 = OpTypePointer Output %23
%29 = OpVariable %28 Output
%30 = OpTypePointer UniformConstant %10
%32 = OpTypePointer PushConstant %5
%34 = OpConstant %5 4
%37 = OpConstant %5 3
%40 = OpTypePointer Input %9
%42 = OpConstant %5 0
%53 = OpConstant %5 5
%56 = OpConstant %5 6
%59 = OpConstant %5 7
%61 = OpTypeVector %5 4
%65 = OpTypePointer UniformConstant %14
%85 = OpConstant %5 100
%86 = OpTypePointer UniformConstant %19
%92 = OpTypeVector %18 4
%107 = OpTypePointer Output %9
%110 = OpConstant %5 1
%112 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %114
%114 = OpLabel
%33 = OpAccessChain %32 %8 %34
%35 = OpLoad %5 %33
%36 = OpIAdd %5 %35 %37
%31 = OpAccessChain %30 %13 %36
%38 = OpLoad %10 %31
%39 = OpLoad %5 %27
%41 = OpAccessChain %40 %25 %42
%43 = OpLoad %9 %41
%44 = OpConvertFToS %5 %43
%45 = OpImageRead %23 %38 %44
%46 = OpCompositeExtract %9 %45 0
%47 = OpCompositeExtract %9 %45 1
%48 = OpCompositeExtract %9 %45 2
%49 = OpCompositeExtract %9 %45 3
%50 = OpAccessChain %32 %8 %34
%51 = OpLoad %5 %50
%52 = OpAccessChain %32 %8 %53
%54 = OpLoad %5 %52
%55 = OpAccessChain %32 %8 %56
%57 = OpLoad %5 %55
%58 = OpAccessChain %32 %8 %59
%60 = OpLoad %5 %58
%62 = OpCompositeConstruct %61 %51 %54 %57 %60
%63 = OpCompositeExtract %5 %62 0
%64 = OpIAdd %5 %63 %34
%67 = OpAccessChain %32 %8 %34
%68 = OpLoad %5 %67
%69 = OpIAdd %5 %68 %64
%66 = OpAccessChain %65 %17 %69
%70 = OpLoad %14 %66
%71 = OpImageRead %61 %70 %44
%72 = OpCompositeExtract %5 %71 0
%73 = OpCompositeExtract %5 %71 1
%74 = OpCompositeExtract %5 %71 2
%75 = OpCompositeExtract %5 %71 3
%76 = OpConvertUToF %9 %72
%77 = OpConvertUToF %9 %73
%78 = OpConvertUToF %9 %74
%79 = OpConvertUToF %9 %75
%80 = OpFAdd %9 %76 %46
%81 = OpFAdd %9 %77 %47
%82 = OpFAdd %9 %78 %48
%83 = OpFAdd %9 %79 %49
%84 = OpIAdd %5 %39 %85
%88 = OpAccessChain %32 %8 %34
%89 = OpLoad %5 %88
%90 = OpIAdd %5 %89 %84
%87 = OpAccessChain %86 %22 %90
%91 = OpLoad %19 %87
%93 = OpImageRead %92 %91 %44
%94 = OpBitcast %61 %93
%95 = OpCompositeExtract %5 %94 0
%96 = OpCompositeExtract %5 %94 1
%97 = OpCompositeExtract %5 %94 2
%98 = OpCompositeExtract %5 %94 3
%99 = OpConvertSToF %9 %95
%100 = OpConvertSToF %9 %96
%101 = OpConvertSToF %9 %97
%102 = OpConvertSToF %9 %98
%103 = OpFAdd %9 %80 %99
%104 = OpFAdd %9 %81 %100
%105 = OpFAdd %9 %82 %101
%106 = OpFAdd %9 %83 %102
%108 = OpAccessChain %107 %29 %42
OpStore %108 %103
%109 = OpAccessChain %107 %29 %110
OpStore %109 %104
%111 = OpAccessChain %107 %29 %112
OpStore %111 %105
%113 = OpAccessChain %107 %29 %37
OpStore %113 %106
OpReturn
OpFunctionEnd
#endif
