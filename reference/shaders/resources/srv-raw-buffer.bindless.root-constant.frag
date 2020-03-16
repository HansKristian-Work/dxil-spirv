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
    uint _31 = registers._m1 + 3u;
    uint _40 = uint(int(gl_FragCoord.x)) << 3u;
    uint _41 = _40 >> 2u;
    uvec4 _55 = uvec4(texelFetch(_12[_31], int(_41)).x, texelFetch(_12[_31], int(_41 + 1u)).x, texelFetch(_12[_31], int(_41 + 2u)).x, texelFetch(_12[_31], int(_41 + 3u)).x);
    uint _76 = registers._m1 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u);
    uint _78 = _40 >> 2u;
    uvec4 _90 = uvec4(texelFetch(_12[_76], int(_78)).x, texelFetch(_12[_76], int(_78 + 1u)).x, texelFetch(_12[_76], int(_78 + 2u)).x, texelFetch(_12[_76], int(_78 + 3u)).x);
    uint _100 = registers._m1 + (INDEX + 100u);
    uint _102 = _40 >> 2u;
    uvec4 _114 = uvec4(texelFetch(_12[nonuniformEXT(_100)], int(_102)).x, texelFetch(_12[nonuniformEXT(_100)], int(_102 + 1u)).x, texelFetch(_12[nonuniformEXT(_100)], int(_102 + 2u)).x, texelFetch(_12[nonuniformEXT(_100)], int(_102 + 3u)).x);
    SV_Target.x = (_90.x + _55.x) + _114.x;
    SV_Target.y = (_90.y + _55.y) + _114.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 124
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability RuntimeDescriptorArray
OpCapability UniformTexelBufferArrayDynamicIndexing
OpCapability UniformTexelBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %19 %21 %24
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %19 "SV_Position"
OpName %21 "INDEX"
OpName %24 "SV_Target"
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
OpDecorate %19 BuiltIn FragCoord
OpDecorate %21 Flat
OpDecorate %21 Location 1
OpDecorate %24 Location 0
OpDecorate %95 NonUniform
OpDecorate %101 NonUniform
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
%15 = OpTypeRuntimeArray %9
%16 = OpTypeFloat 32
%17 = OpTypeVector %16 4
%18 = OpTypePointer Input %17
%19 = OpVariable %18 Input
%20 = OpTypePointer Input %5
%21 = OpVariable %20 Input
%22 = OpTypeVector %5 2
%23 = OpTypePointer Output %22
%24 = OpVariable %23 Output
%25 = OpTypePointer UniformConstant %9
%27 = OpTypePointer PushConstant %5
%29 = OpConstant %5 1
%32 = OpConstant %5 3
%35 = OpTypePointer Input %16
%37 = OpConstant %5 0
%42 = OpConstant %5 2
%43 = OpTypeVector %5 4
%59 = OpConstant %5 4
%62 = OpConstant %5 5
%65 = OpConstant %5 6
%68 = OpConstant %5 7
%96 = OpConstant %5 100
%119 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %122
%122 = OpLabel
%28 = OpAccessChain %27 %8 %29
%30 = OpLoad %5 %28
%31 = OpIAdd %5 %30 %32
%26 = OpAccessChain %25 %12 %31
%33 = OpLoad %9 %26
%34 = OpLoad %5 %21
%36 = OpAccessChain %35 %19 %37
%38 = OpLoad %16 %36
%39 = OpConvertFToS %5 %38
%40 = OpShiftLeftLogical %5 %39 %32
%41 = OpShiftRightLogical %5 %40 %42
%44 = OpImageFetch %43 %33 %41
%45 = OpCompositeExtract %5 %44 0
%47 = OpIAdd %5 %41 %29
%46 = OpImageFetch %43 %33 %47
%48 = OpCompositeExtract %5 %46 0
%50 = OpIAdd %5 %41 %42
%49 = OpImageFetch %43 %33 %50
%51 = OpCompositeExtract %5 %49 0
%53 = OpIAdd %5 %41 %32
%52 = OpImageFetch %43 %33 %53
%54 = OpCompositeExtract %5 %52 0
%55 = OpCompositeConstruct %43 %45 %48 %51 %54
%56 = OpCompositeExtract %5 %55 0
%57 = OpCompositeExtract %5 %55 1
%58 = OpAccessChain %27 %8 %59
%60 = OpLoad %5 %58
%61 = OpAccessChain %27 %8 %62
%63 = OpLoad %5 %61
%64 = OpAccessChain %27 %8 %65
%66 = OpLoad %5 %64
%67 = OpAccessChain %27 %8 %68
%69 = OpLoad %5 %67
%70 = OpCompositeConstruct %43 %60 %63 %66 %69
%71 = OpCompositeExtract %5 %70 0
%72 = OpIAdd %5 %71 %59
%74 = OpAccessChain %27 %8 %29
%75 = OpLoad %5 %74
%76 = OpIAdd %5 %75 %72
%73 = OpAccessChain %25 %12 %76
%77 = OpLoad %9 %73
%78 = OpShiftRightLogical %5 %40 %42
%79 = OpImageFetch %43 %77 %78
%80 = OpCompositeExtract %5 %79 0
%82 = OpIAdd %5 %78 %29
%81 = OpImageFetch %43 %77 %82
%83 = OpCompositeExtract %5 %81 0
%85 = OpIAdd %5 %78 %42
%84 = OpImageFetch %43 %77 %85
%86 = OpCompositeExtract %5 %84 0
%88 = OpIAdd %5 %78 %32
%87 = OpImageFetch %43 %77 %88
%89 = OpCompositeExtract %5 %87 0
%90 = OpCompositeConstruct %43 %80 %83 %86 %89
%91 = OpCompositeExtract %5 %90 0
%92 = OpCompositeExtract %5 %90 1
%93 = OpIAdd %5 %91 %56
%94 = OpIAdd %5 %92 %57
%95 = OpIAdd %5 %34 %96
%98 = OpAccessChain %27 %8 %29
%99 = OpLoad %5 %98
%100 = OpIAdd %5 %99 %95
%97 = OpAccessChain %25 %12 %100
%101 = OpLoad %9 %97
%102 = OpShiftRightLogical %5 %40 %42
%103 = OpImageFetch %43 %101 %102
%104 = OpCompositeExtract %5 %103 0
%106 = OpIAdd %5 %102 %29
%105 = OpImageFetch %43 %101 %106
%107 = OpCompositeExtract %5 %105 0
%109 = OpIAdd %5 %102 %42
%108 = OpImageFetch %43 %101 %109
%110 = OpCompositeExtract %5 %108 0
%112 = OpIAdd %5 %102 %32
%111 = OpImageFetch %43 %101 %112
%113 = OpCompositeExtract %5 %111 0
%114 = OpCompositeConstruct %43 %104 %107 %110 %113
%115 = OpCompositeExtract %5 %114 0
%116 = OpCompositeExtract %5 %114 1
%117 = OpIAdd %5 %93 %115
%118 = OpIAdd %5 %94 %116
%120 = OpAccessChain %119 %24 %37
OpStore %120 %117
%121 = OpAccessChain %119 %24 %29
OpStore %121 %118
OpReturn
OpFunctionEnd
#endif
