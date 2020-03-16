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
layout(location = 0) out vec3 SV_Target;

uint _43;

void main()
{
    uint _39 = uint(int(gl_FragCoord.x));
    vec2 _47 = uintBitsToFloat(uvec2(texelFetch(_12[registers._m1 + 3u], int(_39)).x, _43));
    float _48 = _47.x;
    uint _67 = registers._m1 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u);
    uint _69 = _39 * 2u;
    vec2 _77 = uintBitsToFloat(uvec2(texelFetch(_12[_67], int(_69)).x, texelFetch(_12[_67], int(_69 + 1u)).x));
    float _80 = _77.x + _48;
    uint _87 = registers._m1 + (INDEX + 100u);
    uint _89 = _39 * 3u;
    vec3 _100 = uintBitsToFloat(uvec3(texelFetch(_12[nonuniformEXT(_87)], int(_89)).x, texelFetch(_12[nonuniformEXT(_87)], int(_89 + 1u)).x, texelFetch(_12[nonuniformEXT(_87)], int(_89 + 2u)).x));
    SV_Target.x = _80 + _100.x;
    SV_Target.y = (_77.y + _48) + _100.y;
    SV_Target.z = _80 + _100.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 113
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
OpDecorate %88 NonUniform
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
%22 = OpTypeVector %16 3
%23 = OpTypePointer Output %22
%24 = OpVariable %23 Output
%25 = OpTypePointer UniformConstant %9
%27 = OpTypePointer PushConstant %5
%29 = OpConstant %5 1
%32 = OpConstant %5 3
%35 = OpTypePointer Input %16
%37 = OpConstant %5 0
%40 = OpTypeVector %5 4
%44 = OpTypeVector %5 2
%46 = OpTypeVector %16 2
%50 = OpConstant %5 4
%53 = OpConstant %5 5
%56 = OpConstant %5 6
%59 = OpConstant %5 7
%70 = OpConstant %5 2
%83 = OpConstant %5 100
%98 = OpTypeVector %5 3
%107 = OpTypePointer Output %16
%3 = OpFunction %1 None %2
%4 = OpLabel
%43 = OpUndef %5
OpBranch %111
%111 = OpLabel
%28 = OpAccessChain %27 %8 %29
%30 = OpLoad %5 %28
%31 = OpIAdd %5 %30 %32
%26 = OpAccessChain %25 %12 %31
%33 = OpLoad %9 %26
%34 = OpLoad %5 %21
%36 = OpAccessChain %35 %19 %37
%38 = OpLoad %16 %36
%39 = OpConvertFToS %5 %38
%41 = OpImageFetch %40 %33 %39
%42 = OpCompositeExtract %5 %41 0
%45 = OpCompositeConstruct %44 %42 %43
%47 = OpBitcast %46 %45
%48 = OpCompositeExtract %16 %47 0
%49 = OpAccessChain %27 %8 %50
%51 = OpLoad %5 %49
%52 = OpAccessChain %27 %8 %53
%54 = OpLoad %5 %52
%55 = OpAccessChain %27 %8 %56
%57 = OpLoad %5 %55
%58 = OpAccessChain %27 %8 %59
%60 = OpLoad %5 %58
%61 = OpCompositeConstruct %40 %51 %54 %57 %60
%62 = OpCompositeExtract %5 %61 0
%63 = OpIAdd %5 %62 %50
%65 = OpAccessChain %27 %8 %29
%66 = OpLoad %5 %65
%67 = OpIAdd %5 %66 %63
%64 = OpAccessChain %25 %12 %67
%68 = OpLoad %9 %64
%69 = OpIMul %5 %39 %70
%71 = OpImageFetch %40 %68 %69
%72 = OpCompositeExtract %5 %71 0
%74 = OpIAdd %5 %69 %29
%73 = OpImageFetch %40 %68 %74
%75 = OpCompositeExtract %5 %73 0
%76 = OpCompositeConstruct %44 %72 %75
%77 = OpBitcast %46 %76
%78 = OpCompositeExtract %16 %77 0
%79 = OpCompositeExtract %16 %77 1
%80 = OpFAdd %16 %78 %48
%81 = OpFAdd %16 %79 %48
%82 = OpIAdd %5 %34 %83
%85 = OpAccessChain %27 %8 %29
%86 = OpLoad %5 %85
%87 = OpIAdd %5 %86 %82
%84 = OpAccessChain %25 %12 %87
%88 = OpLoad %9 %84
%89 = OpIMul %5 %39 %32
%90 = OpImageFetch %40 %88 %89
%91 = OpCompositeExtract %5 %90 0
%93 = OpIAdd %5 %89 %29
%92 = OpImageFetch %40 %88 %93
%94 = OpCompositeExtract %5 %92 0
%96 = OpIAdd %5 %89 %70
%95 = OpImageFetch %40 %88 %96
%97 = OpCompositeExtract %5 %95 0
%99 = OpCompositeConstruct %98 %91 %94 %97
%100 = OpBitcast %22 %99
%101 = OpCompositeExtract %16 %100 0
%102 = OpCompositeExtract %16 %100 1
%103 = OpCompositeExtract %16 %100 2
%104 = OpFAdd %16 %80 %101
%105 = OpFAdd %16 %81 %102
%106 = OpFAdd %16 %80 %103
%108 = OpAccessChain %107 %24 %37
OpStore %108 %104
%109 = OpAccessChain %107 %24 %29
OpStore %109 %105
%110 = OpAccessChain %107 %24 %70
OpStore %110 %106
OpReturn
OpFunctionEnd
#endif
