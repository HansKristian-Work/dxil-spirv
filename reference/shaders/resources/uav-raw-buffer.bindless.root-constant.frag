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

layout(set = 4, binding = 0, r32ui) uniform readonly uimageBuffer _12[];

layout(location = 1) flat in uint INDEX;
layout(location = 0) out uvec2 SV_Target;

void main()
{
    uint _28 = registers._m4 + 3u;
    uint _37 = uint(int(gl_FragCoord.x)) << 3u;
    uint _38 = _37 >> 2u;
    uvec4 _53 = uvec4(imageLoad(_12[_28], int(_38)).x, imageLoad(_12[_28], int(_38 + 1u)).x, imageLoad(_12[_28], int(_38 + 2u)).x, imageLoad(_12[_28], int(_38 + 3u)).x);
    uint _73 = registers._m4 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u);
    uint _75 = _37 >> 2u;
    uvec4 _87 = uvec4(imageLoad(_12[_73], int(_75)).x, imageLoad(_12[_73], int(_75 + 1u)).x, imageLoad(_12[_73], int(_75 + 2u)).x, imageLoad(_12[_73], int(_75 + 3u)).x);
    uint _97 = registers._m4 + (INDEX + 100u);
    uint _99 = _37 >> 2u;
    uvec4 _111 = uvec4(imageLoad(_12[nonuniformEXT(_97)], int(_99)).x, imageLoad(_12[nonuniformEXT(_97)], int(_99 + 1u)).x, imageLoad(_12[nonuniformEXT(_97)], int(_99 + 2u)).x, imageLoad(_12[nonuniformEXT(_97)], int(_99 + 3u)).x);
    SV_Target.x = (_87.x + _53.x) + _111.x;
    SV_Target.y = (_87.y + _53.y) + _111.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 121
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
OpEntryPoint Fragment %3 "main" %16 %18 %21
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %16 "SV_Position"
OpName %18 "INDEX"
OpName %21 "SV_Target"
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
OpDecorate %12 DescriptorSet 4
OpDecorate %12 Binding 0
OpDecorate %12 NonWritable
OpDecorate %16 BuiltIn FragCoord
OpDecorate %18 Flat
OpDecorate %18 Location 1
OpDecorate %21 Location 0
OpDecorate %97 NonUniform
OpDecorate %98 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%10 = OpTypeRuntimeArray %9
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpTypeFloat 32
%14 = OpTypeVector %13 4
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpTypePointer Input %5
%18 = OpVariable %17 Input
%19 = OpTypeVector %5 2
%20 = OpTypePointer Output %19
%21 = OpVariable %20 Output
%22 = OpTypePointer UniformConstant %9
%24 = OpTypePointer PushConstant %5
%26 = OpConstant %5 4
%29 = OpConstant %5 3
%32 = OpTypePointer Input %13
%34 = OpConstant %5 0
%39 = OpConstant %5 2
%40 = OpTypeVector %5 4
%45 = OpConstant %5 1
%59 = OpConstant %5 5
%62 = OpConstant %5 6
%65 = OpConstant %5 7
%93 = OpConstant %5 100
%116 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %119
%119 = OpLabel
%25 = OpAccessChain %24 %8 %26
%27 = OpLoad %5 %25
%28 = OpIAdd %5 %27 %29
%23 = OpAccessChain %22 %12 %28
%30 = OpLoad %9 %23
%31 = OpLoad %5 %18
%33 = OpAccessChain %32 %16 %34
%35 = OpLoad %13 %33
%36 = OpConvertFToS %5 %35
%37 = OpShiftLeftLogical %5 %36 %29
%38 = OpShiftRightLogical %5 %37 %39
%41 = OpImageRead %40 %30 %38
%42 = OpCompositeExtract %5 %41 0
%44 = OpIAdd %5 %38 %45
%43 = OpImageRead %40 %30 %44
%46 = OpCompositeExtract %5 %43 0
%48 = OpIAdd %5 %38 %39
%47 = OpImageRead %40 %30 %48
%49 = OpCompositeExtract %5 %47 0
%51 = OpIAdd %5 %38 %29
%50 = OpImageRead %40 %30 %51
%52 = OpCompositeExtract %5 %50 0
%53 = OpCompositeConstruct %40 %42 %46 %49 %52
%54 = OpCompositeExtract %5 %53 0
%55 = OpCompositeExtract %5 %53 1
%56 = OpAccessChain %24 %8 %26
%57 = OpLoad %5 %56
%58 = OpAccessChain %24 %8 %59
%60 = OpLoad %5 %58
%61 = OpAccessChain %24 %8 %62
%63 = OpLoad %5 %61
%64 = OpAccessChain %24 %8 %65
%66 = OpLoad %5 %64
%67 = OpCompositeConstruct %40 %57 %60 %63 %66
%68 = OpCompositeExtract %5 %67 0
%69 = OpIAdd %5 %68 %26
%71 = OpAccessChain %24 %8 %26
%72 = OpLoad %5 %71
%73 = OpIAdd %5 %72 %69
%70 = OpAccessChain %22 %12 %73
%74 = OpLoad %9 %70
%75 = OpShiftRightLogical %5 %37 %39
%76 = OpImageRead %40 %74 %75
%77 = OpCompositeExtract %5 %76 0
%79 = OpIAdd %5 %75 %45
%78 = OpImageRead %40 %74 %79
%80 = OpCompositeExtract %5 %78 0
%82 = OpIAdd %5 %75 %39
%81 = OpImageRead %40 %74 %82
%83 = OpCompositeExtract %5 %81 0
%85 = OpIAdd %5 %75 %29
%84 = OpImageRead %40 %74 %85
%86 = OpCompositeExtract %5 %84 0
%87 = OpCompositeConstruct %40 %77 %80 %83 %86
%88 = OpCompositeExtract %5 %87 0
%89 = OpCompositeExtract %5 %87 1
%90 = OpIAdd %5 %88 %54
%91 = OpIAdd %5 %89 %55
%92 = OpIAdd %5 %31 %93
%95 = OpAccessChain %24 %8 %26
%96 = OpLoad %5 %95
%97 = OpIAdd %5 %96 %92
%94 = OpAccessChain %22 %12 %97
%98 = OpLoad %9 %94
%99 = OpShiftRightLogical %5 %37 %39
%100 = OpImageRead %40 %98 %99
%101 = OpCompositeExtract %5 %100 0
%103 = OpIAdd %5 %99 %45
%102 = OpImageRead %40 %98 %103
%104 = OpCompositeExtract %5 %102 0
%106 = OpIAdd %5 %99 %39
%105 = OpImageRead %40 %98 %106
%107 = OpCompositeExtract %5 %105 0
%109 = OpIAdd %5 %99 %29
%108 = OpImageRead %40 %98 %109
%110 = OpCompositeExtract %5 %108 0
%111 = OpCompositeConstruct %40 %101 %104 %107 %110
%112 = OpCompositeExtract %5 %111 0
%113 = OpCompositeExtract %5 %111 1
%114 = OpIAdd %5 %90 %112
%115 = OpIAdd %5 %91 %113
%117 = OpAccessChain %116 %21 %34
OpStore %117 %114
%118 = OpAccessChain %116 %21 %45
OpStore %118 %115
OpReturn
OpFunctionEnd
#endif
