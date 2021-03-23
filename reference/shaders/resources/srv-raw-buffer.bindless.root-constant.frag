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

layout(set = 1, binding = 0) uniform usamplerBuffer _12[];

layout(location = 1) flat in uint INDEX;
layout(location = 0) out uvec2 SV_Target;

void main()
{
    uint _28 = registers._m1 + 3u;
    uint _36 = uint(int(gl_FragCoord.x));
    uint _38 = _36 * 2u;
    uvec2 _46 = uvec2(texelFetch(_12[_28], int(_38)).x, texelFetch(_12[_28], int(_38 + 1u)).x);
    uint _67 = registers._m1 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u);
    uint _69 = _36 * 2u;
    uvec2 _75 = uvec2(texelFetch(_12[_67], int(_69)).x, texelFetch(_12[_67], int(_69 + 1u)).x);
    uint _85 = registers._m1 + (INDEX + 100u);
    uint _87 = _36 * 2u;
    uvec2 _93 = uvec2(texelFetch(_12[nonuniformEXT(_85)], int(_87)).x, texelFetch(_12[nonuniformEXT(_85)], int(_87 + 1u)).x);
    SV_Target.x = (_75.x + _46.x) + _93.x;
    SV_Target.y = (_75.y + _46.y) + _93.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 102
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability RuntimeDescriptorArray
OpCapability UniformTexelBufferArrayDynamicIndexing
OpCapability UniformTexelBufferArrayNonUniformIndexing
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
OpDecorate %12 DescriptorSet 1
OpDecorate %12 Binding 0
OpDecorate %16 BuiltIn FragCoord
OpDecorate %18 Flat
OpDecorate %18 Location 1
OpDecorate %21 Location 0
OpDecorate %85 NonUniform
OpDecorate %86 NonUniform
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
%26 = OpConstant %5 1
%29 = OpConstant %5 3
%32 = OpTypePointer Input %13
%34 = OpConstant %5 0
%39 = OpConstant %5 2
%40 = OpTypeVector %5 4
%50 = OpConstant %5 4
%53 = OpConstant %5 5
%56 = OpConstant %5 6
%59 = OpConstant %5 7
%81 = OpConstant %5 100
%98 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %101
%101 = OpLabel
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
%38 = OpIMul %5 %36 %39
%41 = OpImageFetch %40 %30 %38
%42 = OpCompositeExtract %5 %41 0
%44 = OpIAdd %5 %38 %26
%43 = OpImageFetch %40 %30 %44
%45 = OpCompositeExtract %5 %43 0
%46 = OpCompositeConstruct %19 %42 %45
%47 = OpCompositeExtract %5 %46 0
%48 = OpCompositeExtract %5 %46 1
%49 = OpAccessChain %24 %8 %50
%51 = OpLoad %5 %49
%52 = OpAccessChain %24 %8 %53
%54 = OpLoad %5 %52
%55 = OpAccessChain %24 %8 %56
%57 = OpLoad %5 %55
%58 = OpAccessChain %24 %8 %59
%60 = OpLoad %5 %58
%61 = OpCompositeConstruct %40 %51 %54 %57 %60
%62 = OpCompositeExtract %5 %61 0
%63 = OpIAdd %5 %62 %50
%65 = OpAccessChain %24 %8 %26
%66 = OpLoad %5 %65
%67 = OpIAdd %5 %66 %63
%64 = OpAccessChain %22 %12 %67
%68 = OpLoad %9 %64
%69 = OpIMul %5 %36 %39
%70 = OpImageFetch %40 %68 %69
%71 = OpCompositeExtract %5 %70 0
%73 = OpIAdd %5 %69 %26
%72 = OpImageFetch %40 %68 %73
%74 = OpCompositeExtract %5 %72 0
%75 = OpCompositeConstruct %19 %71 %74
%76 = OpCompositeExtract %5 %75 0
%77 = OpCompositeExtract %5 %75 1
%78 = OpIAdd %5 %76 %47
%79 = OpIAdd %5 %77 %48
%80 = OpIAdd %5 %31 %81
%83 = OpAccessChain %24 %8 %26
%84 = OpLoad %5 %83
%85 = OpIAdd %5 %84 %80
%82 = OpAccessChain %22 %12 %85
%86 = OpLoad %9 %82
%87 = OpIMul %5 %36 %39
%88 = OpImageFetch %40 %86 %87
%89 = OpCompositeExtract %5 %88 0
%91 = OpIAdd %5 %87 %26
%90 = OpImageFetch %40 %86 %91
%92 = OpCompositeExtract %5 %90 0
%93 = OpCompositeConstruct %19 %89 %92
%94 = OpCompositeExtract %5 %93 0
%95 = OpCompositeExtract %5 %93 1
%96 = OpIAdd %5 %78 %94
%97 = OpIAdd %5 %79 %95
%99 = OpAccessChain %98 %21 %34
OpStore %99 %96
%100 = OpAccessChain %98 %21 %26
OpStore %100 %97
OpReturn
OpFunctionEnd
#endif
