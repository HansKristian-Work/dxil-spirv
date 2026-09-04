#version 460
#extension GL_EXT_buffer_reference2 : require
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

layout(set = 1, binding = 0) uniform usamplerBuffer _12[];

layout(location = 1) flat in uint INDEX;
layout(location = 0) out uvec2 SV_Target;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    uint _28 = registers._m1 + 3u;
    uint _36 = uint(int(gl_FragCoord.x));
    uint _49 = ByteAddressMask(_36 * 2u, 4u);
    uvec2 _57 = uvec2(texelFetch(_12[_28], int(_49)).x, texelFetch(_12[_28], int(_49 + 1u)).x);
    uint _77 = registers._m1 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u);
    uint _80 = ByteAddressMask(_36 * 2u, 4u);
    uvec2 _86 = uvec2(texelFetch(_12[_77], int(_80)).x, texelFetch(_12[_77], int(_80 + 1u)).x);
    uint _96 = registers._m1 + (INDEX + 100u);
    uint _99 = ByteAddressMask(_36 * 2u, 4u);
    uvec2 _105 = uvec2(texelFetch(_12[nonuniformEXT(_96)], int(_99)).x, texelFetch(_12[nonuniformEXT(_96)], int(_99 + 1u)).x);
    SV_Target.x = (_86.x + _57.x) + _105.x;
    SV_Target.y = (_86.y + _57.y) + _105.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 115
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
OpName %43 "ByteAddressMask"
OpName %41 "index"
OpName %42 "stride"
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
OpDecorate %96 NonUniform
OpDecorate %97 NonUniform
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
%40 = OpTypeFunction %5 %5 %5
%46 = OpConstant %5 4294967295
%50 = OpConstant %5 4
%51 = OpTypeVector %5 4
%63 = OpConstant %5 5
%66 = OpConstant %5 6
%69 = OpConstant %5 7
%92 = OpConstant %5 100
%110 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %113
%113 = OpLabel
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
%49 = OpFunctionCall %5 %43 %38 %50
%52 = OpImageFetch %51 %30 %49
%53 = OpCompositeExtract %5 %52 0
%55 = OpIAdd %5 %49 %26
%54 = OpImageFetch %51 %30 %55
%56 = OpCompositeExtract %5 %54 0
%57 = OpCompositeConstruct %19 %53 %56
%58 = OpCompositeExtract %5 %57 0
%59 = OpCompositeExtract %5 %57 1
%60 = OpAccessChain %24 %8 %50
%61 = OpLoad %5 %60
%62 = OpAccessChain %24 %8 %63
%64 = OpLoad %5 %62
%65 = OpAccessChain %24 %8 %66
%67 = OpLoad %5 %65
%68 = OpAccessChain %24 %8 %69
%70 = OpLoad %5 %68
%71 = OpCompositeConstruct %51 %61 %64 %67 %70
%72 = OpCompositeExtract %5 %71 0
%73 = OpIAdd %5 %72 %50
%75 = OpAccessChain %24 %8 %26
%76 = OpLoad %5 %75
%77 = OpIAdd %5 %76 %73
%74 = OpAccessChain %22 %12 %77
%78 = OpLoad %9 %74
%79 = OpIMul %5 %36 %39
%80 = OpFunctionCall %5 %43 %79 %50
%81 = OpImageFetch %51 %78 %80
%82 = OpCompositeExtract %5 %81 0
%84 = OpIAdd %5 %80 %26
%83 = OpImageFetch %51 %78 %84
%85 = OpCompositeExtract %5 %83 0
%86 = OpCompositeConstruct %19 %82 %85
%87 = OpCompositeExtract %5 %86 0
%88 = OpCompositeExtract %5 %86 1
%89 = OpIAdd %5 %87 %58
%90 = OpIAdd %5 %88 %59
%91 = OpIAdd %5 %31 %92
%94 = OpAccessChain %24 %8 %26
%95 = OpLoad %5 %94
%96 = OpIAdd %5 %95 %91
%93 = OpAccessChain %22 %12 %96
%97 = OpLoad %9 %93
%98 = OpIMul %5 %36 %39
%99 = OpFunctionCall %5 %43 %98 %50
%100 = OpImageFetch %51 %97 %99
%101 = OpCompositeExtract %5 %100 0
%103 = OpIAdd %5 %99 %26
%102 = OpImageFetch %51 %97 %103
%104 = OpCompositeExtract %5 %102 0
%105 = OpCompositeConstruct %19 %101 %104
%106 = OpCompositeExtract %5 %105 0
%107 = OpCompositeExtract %5 %105 1
%108 = OpIAdd %5 %89 %106
%109 = OpIAdd %5 %90 %107
%111 = OpAccessChain %110 %21 %34
OpStore %111 %108
%112 = OpAccessChain %110 %21 %26
OpStore %112 %109
OpReturn
OpFunctionEnd
%43 = OpFunction %5 None %40
%41 = OpFunctionParameter %5
%42 = OpFunctionParameter %5
%44 = OpLabel
%45 = OpUDiv %5 %46 %42
%47 = OpBitwiseAnd %5 %41 %45
OpReturnValue %47
OpFunctionEnd
#endif
