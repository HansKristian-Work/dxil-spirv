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

layout(set = 1, binding = 0) uniform usamplerBuffer _12[];

layout(location = 1) flat in uint INDEX;
layout(location = 0) out uvec2 SV_Target;

void main()
{
    uint _30 = registers._m1 + 3u;
    uint _39 = uint(int(gl_FragCoord.x)) << 3u;
    uint _40 = _39 >> 2u;
    uvec4 _54 = uvec4(texelFetch(_12[_30], int(_40)).x, texelFetch(_12[_30], int(_40 + 1u)).x, texelFetch(_12[_30], int(_40 + 2u)).x, texelFetch(_12[_30], int(_40 + 3u)).x);
    uint _75 = registers._m1 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u);
    uint _77 = _39 >> 2u;
    uvec4 _89 = uvec4(texelFetch(_12[_75], int(_77)).x, texelFetch(_12[_75], int(_77 + 1u)).x, texelFetch(_12[_75], int(_77 + 2u)).x, texelFetch(_12[_75], int(_77 + 3u)).x);
    uint _98 = registers._m1 + (INDEX + 4u);
    uint _100 = _39 >> 2u;
    uvec4 _112 = uvec4(texelFetch(_12[nonuniformEXT(_98)], int(_100)).x, texelFetch(_12[nonuniformEXT(_98)], int(_100 + 1u)).x, texelFetch(_12[nonuniformEXT(_98)], int(_100 + 2u)).x, texelFetch(_12[nonuniformEXT(_98)], int(_100 + 3u)).x);
    SV_Target.x = (_89.x + _54.x) + _112.x;
    SV_Target.y = (_89.y + _54.y) + _112.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 122
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability RuntimeDescriptorArray
OpCapability UniformTexelBufferArrayDynamicIndexing
OpCapability UniformTexelBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %18 %20 %23
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %18 "SV_Position"
OpName %20 "INDEX"
OpName %23 "SV_Target"
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
OpDecorate %12 DescriptorSet 1
OpDecorate %12 Binding 0
OpDecorate %18 BuiltIn FragCoord
OpDecorate %20 Flat
OpDecorate %20 Location 1
OpDecorate %23 Location 0
OpDecorate %99 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%10 = OpTypeRuntimeArray %9
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpConstant %5 64
%14 = OpTypeArray %9 %13
%15 = OpTypeFloat 32
%16 = OpTypeVector %15 4
%17 = OpTypePointer Input %16
%18 = OpVariable %17 Input
%19 = OpTypePointer Input %5
%20 = OpVariable %19 Input
%21 = OpTypeVector %5 2
%22 = OpTypePointer Output %21
%23 = OpVariable %22 Output
%24 = OpTypePointer UniformConstant %9
%26 = OpTypePointer PushConstant %5
%28 = OpConstant %5 1
%31 = OpConstant %5 3
%34 = OpTypePointer Input %15
%36 = OpConstant %5 0
%41 = OpConstant %5 2
%42 = OpTypeVector %5 4
%58 = OpConstant %5 4
%61 = OpConstant %5 5
%64 = OpConstant %5 6
%67 = OpConstant %5 7
%117 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %120
%120 = OpLabel
%27 = OpAccessChain %26 %8 %28
%29 = OpLoad %5 %27
%30 = OpIAdd %5 %29 %31
%25 = OpAccessChain %24 %12 %30
%32 = OpLoad %9 %25
%33 = OpLoad %5 %20
%35 = OpAccessChain %34 %18 %36
%37 = OpLoad %15 %35
%38 = OpConvertFToS %5 %37
%39 = OpShiftLeftLogical %5 %38 %31
%40 = OpShiftRightLogical %5 %39 %41
%43 = OpImageFetch %42 %32 %40
%44 = OpCompositeExtract %5 %43 0
%46 = OpIAdd %5 %40 %28
%45 = OpImageFetch %42 %32 %46
%47 = OpCompositeExtract %5 %45 0
%49 = OpIAdd %5 %40 %41
%48 = OpImageFetch %42 %32 %49
%50 = OpCompositeExtract %5 %48 0
%52 = OpIAdd %5 %40 %31
%51 = OpImageFetch %42 %32 %52
%53 = OpCompositeExtract %5 %51 0
%54 = OpCompositeConstruct %42 %44 %47 %50 %53
%55 = OpCompositeExtract %5 %54 0
%56 = OpCompositeExtract %5 %54 1
%57 = OpAccessChain %26 %8 %58
%59 = OpLoad %5 %57
%60 = OpAccessChain %26 %8 %61
%62 = OpLoad %5 %60
%63 = OpAccessChain %26 %8 %64
%65 = OpLoad %5 %63
%66 = OpAccessChain %26 %8 %67
%68 = OpLoad %5 %66
%69 = OpCompositeConstruct %42 %59 %62 %65 %68
%70 = OpCompositeExtract %5 %69 0
%71 = OpIAdd %5 %70 %58
%73 = OpAccessChain %26 %8 %28
%74 = OpLoad %5 %73
%75 = OpIAdd %5 %74 %71
%72 = OpAccessChain %24 %12 %75
%76 = OpLoad %9 %72
%77 = OpShiftRightLogical %5 %39 %41
%78 = OpImageFetch %42 %76 %77
%79 = OpCompositeExtract %5 %78 0
%81 = OpIAdd %5 %77 %28
%80 = OpImageFetch %42 %76 %81
%82 = OpCompositeExtract %5 %80 0
%84 = OpIAdd %5 %77 %41
%83 = OpImageFetch %42 %76 %84
%85 = OpCompositeExtract %5 %83 0
%87 = OpIAdd %5 %77 %31
%86 = OpImageFetch %42 %76 %87
%88 = OpCompositeExtract %5 %86 0
%89 = OpCompositeConstruct %42 %79 %82 %85 %88
%90 = OpCompositeExtract %5 %89 0
%91 = OpCompositeExtract %5 %89 1
%92 = OpIAdd %5 %90 %55
%93 = OpIAdd %5 %91 %56
%94 = OpIAdd %5 %33 %58
%96 = OpAccessChain %26 %8 %28
%97 = OpLoad %5 %96
%98 = OpIAdd %5 %97 %94
%95 = OpAccessChain %24 %12 %98
%99 = OpLoad %9 %95
%100 = OpShiftRightLogical %5 %39 %41
%101 = OpImageFetch %42 %99 %100
%102 = OpCompositeExtract %5 %101 0
%104 = OpIAdd %5 %100 %28
%103 = OpImageFetch %42 %99 %104
%105 = OpCompositeExtract %5 %103 0
%107 = OpIAdd %5 %100 %41
%106 = OpImageFetch %42 %99 %107
%108 = OpCompositeExtract %5 %106 0
%110 = OpIAdd %5 %100 %31
%109 = OpImageFetch %42 %99 %110
%111 = OpCompositeExtract %5 %109 0
%112 = OpCompositeConstruct %42 %102 %105 %108 %111
%113 = OpCompositeExtract %5 %112 0
%114 = OpCompositeExtract %5 %112 1
%115 = OpIAdd %5 %92 %113
%116 = OpIAdd %5 %93 %114
%118 = OpAccessChain %117 %23 %36
OpStore %118 %115
%119 = OpAccessChain %117 %23 %28
OpStore %119 %116
OpReturn
OpFunctionEnd
#endif
