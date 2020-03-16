#version 460
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

layout(set = 0, binding = 0) uniform texture2D _13[];

layout(location = 1) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _40 = uint(int(gl_FragCoord.x));
    uint _41 = uint(int(gl_FragCoord.y));
    vec4 _44 = texelFetch(_13[registers._m0 + 3u], ivec2(uvec2(_40, _41)), int(0u));
    vec4 _72 = texelFetch(_13[registers._m0 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u)], ivec2(uvec2(_40, _41)), int(0u));
    vec4 _89 = texelFetch(_13[nonuniformEXT(registers._m0 + (INDEX + 100u))], ivec2(uvec2(_40, _41)), int(0u));
    SV_Target.x = (_72.x + _44.x) + _89.x;
    SV_Target.y = (_72.y + _44.y) + _89.y;
    SV_Target.z = (_72.z + _44.z) + _89.z;
    SV_Target.w = (_72.w + _44.w) + _89.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 107
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %19 %21 %23
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %19 "SV_Position"
OpName %21 "INDEX"
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
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %19 BuiltIn FragCoord
OpDecorate %21 Flat
OpDecorate %21 Location 1
OpDecorate %23 Location 0
OpDecorate %88 NonUniform
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
%14 = OpConstant %5 64
%15 = OpTypeArray %10 %14
%16 = OpTypeRuntimeArray %10
%17 = OpTypeVector %9 4
%18 = OpTypePointer Input %17
%19 = OpVariable %18 Input
%20 = OpTypePointer Input %5
%21 = OpVariable %20 Input
%22 = OpTypePointer Output %17
%23 = OpVariable %22 Output
%24 = OpTypePointer UniformConstant %10
%26 = OpTypePointer PushConstant %5
%28 = OpConstant %5 0
%31 = OpConstant %5 3
%34 = OpTypePointer Input %9
%38 = OpConstant %5 1
%42 = OpTypeInt 32 1
%43 = OpConstant %42 0
%45 = OpTypeVector %5 2
%52 = OpConstant %5 4
%55 = OpConstant %5 5
%58 = OpConstant %5 6
%61 = OpConstant %5 7
%63 = OpTypeVector %5 4
%83 = OpConstant %5 100
%99 = OpTypePointer Output %9
%103 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %105
%105 = OpLabel
%27 = OpAccessChain %26 %8 %28
%29 = OpLoad %5 %27
%30 = OpIAdd %5 %29 %31
%25 = OpAccessChain %24 %13 %30
%32 = OpLoad %10 %25
%33 = OpLoad %5 %21
%35 = OpAccessChain %34 %19 %28
%36 = OpLoad %9 %35
%37 = OpAccessChain %34 %19 %38
%39 = OpLoad %9 %37
%40 = OpConvertFToS %5 %36
%41 = OpConvertFToS %5 %39
%46 = OpCompositeConstruct %45 %40 %41
%44 = OpImageFetch %17 %32 %46 Lod %28
%47 = OpCompositeExtract %9 %44 0
%48 = OpCompositeExtract %9 %44 1
%49 = OpCompositeExtract %9 %44 2
%50 = OpCompositeExtract %9 %44 3
%51 = OpAccessChain %26 %8 %52
%53 = OpLoad %5 %51
%54 = OpAccessChain %26 %8 %55
%56 = OpLoad %5 %54
%57 = OpAccessChain %26 %8 %58
%59 = OpLoad %5 %57
%60 = OpAccessChain %26 %8 %61
%62 = OpLoad %5 %60
%64 = OpCompositeConstruct %63 %53 %56 %59 %62
%65 = OpCompositeExtract %5 %64 0
%66 = OpIAdd %5 %65 %52
%68 = OpAccessChain %26 %8 %28
%69 = OpLoad %5 %68
%70 = OpIAdd %5 %69 %66
%67 = OpAccessChain %24 %13 %70
%71 = OpLoad %10 %67
%73 = OpCompositeConstruct %45 %40 %41
%72 = OpImageFetch %17 %71 %73 Lod %28
%74 = OpCompositeExtract %9 %72 0
%75 = OpCompositeExtract %9 %72 1
%76 = OpCompositeExtract %9 %72 2
%77 = OpCompositeExtract %9 %72 3
%78 = OpFAdd %9 %74 %47
%79 = OpFAdd %9 %75 %48
%80 = OpFAdd %9 %76 %49
%81 = OpFAdd %9 %77 %50
%82 = OpIAdd %5 %33 %83
%85 = OpAccessChain %26 %8 %28
%86 = OpLoad %5 %85
%87 = OpIAdd %5 %86 %82
%84 = OpAccessChain %24 %13 %87
%88 = OpLoad %10 %84
%90 = OpCompositeConstruct %45 %40 %41
%89 = OpImageFetch %17 %88 %90 Lod %28
%91 = OpCompositeExtract %9 %89 0
%92 = OpCompositeExtract %9 %89 1
%93 = OpCompositeExtract %9 %89 2
%94 = OpCompositeExtract %9 %89 3
%95 = OpFAdd %9 %78 %91
%96 = OpFAdd %9 %79 %92
%97 = OpFAdd %9 %80 %93
%98 = OpFAdd %9 %81 %94
%100 = OpAccessChain %99 %23 %28
OpStore %100 %95
%101 = OpAccessChain %99 %23 %38
OpStore %101 %96
%102 = OpAccessChain %99 %23 %103
OpStore %102 %97
%104 = OpAccessChain %99 %23 %31
OpStore %104 %98
OpReturn
OpFunctionEnd
#endif
