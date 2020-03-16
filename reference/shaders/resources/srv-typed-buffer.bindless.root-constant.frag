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

layout(set = 1, binding = 0) uniform samplerBuffer _13[];
layout(set = 1, binding = 0) uniform usamplerBuffer _19[];
layout(set = 1, binding = 0) uniform isamplerBuffer _25[];

layout(location = 1) flat in uint INDEX;
layout(location = 0) out vec3 SV_Target;

void main()
{
    uint _48 = uint(int(gl_FragCoord.x));
    vec4 _49 = texelFetch(_13[registers._m1 + 3u], int(_48));
    uvec4 _75 = texelFetch(_19[registers._m1 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u)], int(_48));
    uvec4 _95 = uvec4(texelFetch(_25[nonuniformEXT(registers._m1 + (INDEX + 100u))], int(_48)));
    SV_Target.x = (float(_75.x) + _49.x) + float(int(_95.x));
    SV_Target.y = (float(_75.y) + _49.y) + float(int(_95.y));
    SV_Target.z = (float(_75.z) + _49.z) + float(int(_95.z));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 112
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability RuntimeDescriptorArray
OpCapability UniformTexelBufferArrayDynamicIndexing
OpCapability UniformTexelBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %28 %30 %33
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %28 "SV_Position"
OpName %30 "INDEX"
OpName %33 "SV_Target"
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
OpDecorate %13 DescriptorSet 1
OpDecorate %13 Binding 0
OpDecorate %19 DescriptorSet 1
OpDecorate %19 Binding 0
OpDecorate %25 DescriptorSet 1
OpDecorate %25 Binding 0
OpDecorate %28 BuiltIn FragCoord
OpDecorate %30 Flat
OpDecorate %30 Location 1
OpDecorate %33 Location 0
OpDecorate %85 NonUniform
OpDecorate %92 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeFloat 32
%10 = OpTypeImage %9 Buffer 0 0 0 1 Unknown
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer UniformConstant %11
%13 = OpVariable %12 UniformConstant
%14 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%15 = OpConstant %5 64
%16 = OpTypeArray %14 %15
%17 = OpTypeRuntimeArray %14
%18 = OpTypePointer UniformConstant %17
%19 = OpVariable %18 UniformConstant
%20 = OpTypeInt 32 1
%21 = OpTypeImage %20 Buffer 0 0 0 1 Unknown
%22 = OpTypeRuntimeArray %21
%23 = OpTypeRuntimeArray %21
%24 = OpTypePointer UniformConstant %23
%25 = OpVariable %24 UniformConstant
%26 = OpTypeVector %9 4
%27 = OpTypePointer Input %26
%28 = OpVariable %27 Input
%29 = OpTypePointer Input %5
%30 = OpVariable %29 Input
%31 = OpTypeVector %9 3
%32 = OpTypePointer Output %31
%33 = OpVariable %32 Output
%34 = OpTypePointer UniformConstant %10
%36 = OpTypePointer PushConstant %5
%38 = OpConstant %5 1
%41 = OpConstant %5 3
%44 = OpTypePointer Input %9
%46 = OpConstant %5 0
%54 = OpConstant %5 4
%57 = OpConstant %5 5
%60 = OpConstant %5 6
%63 = OpConstant %5 7
%65 = OpTypeVector %5 4
%69 = OpTypePointer UniformConstant %14
%86 = OpConstant %5 100
%87 = OpTypePointer UniformConstant %21
%93 = OpTypeVector %20 4
%105 = OpTypePointer Output %9
%109 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %110
%110 = OpLabel
%37 = OpAccessChain %36 %8 %38
%39 = OpLoad %5 %37
%40 = OpIAdd %5 %39 %41
%35 = OpAccessChain %34 %13 %40
%42 = OpLoad %10 %35
%43 = OpLoad %5 %30
%45 = OpAccessChain %44 %28 %46
%47 = OpLoad %9 %45
%48 = OpConvertFToS %5 %47
%49 = OpImageFetch %26 %42 %48
%50 = OpCompositeExtract %9 %49 0
%51 = OpCompositeExtract %9 %49 1
%52 = OpCompositeExtract %9 %49 2
%53 = OpAccessChain %36 %8 %54
%55 = OpLoad %5 %53
%56 = OpAccessChain %36 %8 %57
%58 = OpLoad %5 %56
%59 = OpAccessChain %36 %8 %60
%61 = OpLoad %5 %59
%62 = OpAccessChain %36 %8 %63
%64 = OpLoad %5 %62
%66 = OpCompositeConstruct %65 %55 %58 %61 %64
%67 = OpCompositeExtract %5 %66 0
%68 = OpIAdd %5 %67 %54
%71 = OpAccessChain %36 %8 %38
%72 = OpLoad %5 %71
%73 = OpIAdd %5 %72 %68
%70 = OpAccessChain %69 %19 %73
%74 = OpLoad %14 %70
%75 = OpImageFetch %65 %74 %48
%76 = OpCompositeExtract %5 %75 0
%77 = OpCompositeExtract %5 %75 1
%78 = OpCompositeExtract %5 %75 2
%79 = OpConvertUToF %9 %76
%80 = OpConvertUToF %9 %77
%81 = OpConvertUToF %9 %78
%82 = OpFAdd %9 %79 %50
%83 = OpFAdd %9 %80 %51
%84 = OpFAdd %9 %81 %52
%85 = OpIAdd %5 %43 %86
%89 = OpAccessChain %36 %8 %38
%90 = OpLoad %5 %89
%91 = OpIAdd %5 %90 %85
%88 = OpAccessChain %87 %25 %91
%92 = OpLoad %21 %88
%94 = OpImageFetch %93 %92 %48
%95 = OpBitcast %65 %94
%96 = OpCompositeExtract %5 %95 0
%97 = OpCompositeExtract %5 %95 1
%98 = OpCompositeExtract %5 %95 2
%99 = OpConvertSToF %9 %96
%100 = OpConvertSToF %9 %97
%101 = OpConvertSToF %9 %98
%102 = OpFAdd %9 %82 %99
%103 = OpFAdd %9 %83 %100
%104 = OpFAdd %9 %84 %101
%106 = OpAccessChain %105 %33 %46
OpStore %106 %102
%107 = OpAccessChain %105 %33 %38
OpStore %107 %103
%108 = OpAccessChain %105 %33 %109
OpStore %108 %104
OpReturn
OpFunctionEnd
#endif
