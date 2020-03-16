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
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _47 = uint(int(gl_FragCoord.x));
    vec4 _48 = texelFetch(_13[registers._m1 + 3u], int(_47));
    uvec4 _75 = texelFetch(_19[registers._m1 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u)], int(_47));
    uvec4 _98 = uvec4(texelFetch(_25[nonuniformEXT(registers._m1 + (INDEX + 100u))], int(_47)));
    SV_Target.x = (float(_75.x) + _48.x) + float(int(_98.x));
    SV_Target.y = (float(_75.y) + _48.y) + float(int(_98.y));
    SV_Target.z = (float(_75.z) + _48.z) + float(int(_98.z));
    SV_Target.w = (float(_75.w) + _48.w) + float(int(_98.w));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 119
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability RuntimeDescriptorArray
OpCapability UniformTexelBufferArrayDynamicIndexing
OpCapability UniformTexelBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %28 %30 %32
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %28 "SV_Position"
OpName %30 "INDEX"
OpName %32 "SV_Target"
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
OpDecorate %32 Location 0
OpDecorate %88 NonUniform
OpDecorate %95 NonUniform
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
%31 = OpTypePointer Output %26
%32 = OpVariable %31 Output
%33 = OpTypePointer UniformConstant %10
%35 = OpTypePointer PushConstant %5
%37 = OpConstant %5 1
%40 = OpConstant %5 3
%43 = OpTypePointer Input %9
%45 = OpConstant %5 0
%54 = OpConstant %5 4
%57 = OpConstant %5 5
%60 = OpConstant %5 6
%63 = OpConstant %5 7
%65 = OpTypeVector %5 4
%69 = OpTypePointer UniformConstant %14
%89 = OpConstant %5 100
%90 = OpTypePointer UniformConstant %21
%96 = OpTypeVector %20 4
%111 = OpTypePointer Output %9
%115 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %117
%117 = OpLabel
%36 = OpAccessChain %35 %8 %37
%38 = OpLoad %5 %36
%39 = OpIAdd %5 %38 %40
%34 = OpAccessChain %33 %13 %39
%41 = OpLoad %10 %34
%42 = OpLoad %5 %30
%44 = OpAccessChain %43 %28 %45
%46 = OpLoad %9 %44
%47 = OpConvertFToS %5 %46
%48 = OpImageFetch %26 %41 %47
%49 = OpCompositeExtract %9 %48 0
%50 = OpCompositeExtract %9 %48 1
%51 = OpCompositeExtract %9 %48 2
%52 = OpCompositeExtract %9 %48 3
%53 = OpAccessChain %35 %8 %54
%55 = OpLoad %5 %53
%56 = OpAccessChain %35 %8 %57
%58 = OpLoad %5 %56
%59 = OpAccessChain %35 %8 %60
%61 = OpLoad %5 %59
%62 = OpAccessChain %35 %8 %63
%64 = OpLoad %5 %62
%66 = OpCompositeConstruct %65 %55 %58 %61 %64
%67 = OpCompositeExtract %5 %66 0
%68 = OpIAdd %5 %67 %54
%71 = OpAccessChain %35 %8 %37
%72 = OpLoad %5 %71
%73 = OpIAdd %5 %72 %68
%70 = OpAccessChain %69 %19 %73
%74 = OpLoad %14 %70
%75 = OpImageFetch %65 %74 %47
%76 = OpCompositeExtract %5 %75 0
%77 = OpCompositeExtract %5 %75 1
%78 = OpCompositeExtract %5 %75 2
%79 = OpCompositeExtract %5 %75 3
%80 = OpConvertUToF %9 %76
%81 = OpConvertUToF %9 %77
%82 = OpConvertUToF %9 %78
%83 = OpConvertUToF %9 %79
%84 = OpFAdd %9 %80 %49
%85 = OpFAdd %9 %81 %50
%86 = OpFAdd %9 %82 %51
%87 = OpFAdd %9 %83 %52
%88 = OpIAdd %5 %42 %89
%92 = OpAccessChain %35 %8 %37
%93 = OpLoad %5 %92
%94 = OpIAdd %5 %93 %88
%91 = OpAccessChain %90 %25 %94
%95 = OpLoad %21 %91
%97 = OpImageFetch %96 %95 %47
%98 = OpBitcast %65 %97
%99 = OpCompositeExtract %5 %98 0
%100 = OpCompositeExtract %5 %98 1
%101 = OpCompositeExtract %5 %98 2
%102 = OpCompositeExtract %5 %98 3
%103 = OpConvertSToF %9 %99
%104 = OpConvertSToF %9 %100
%105 = OpConvertSToF %9 %101
%106 = OpConvertSToF %9 %102
%107 = OpFAdd %9 %84 %103
%108 = OpFAdd %9 %85 %104
%109 = OpFAdd %9 %86 %105
%110 = OpFAdd %9 %87 %106
%112 = OpAccessChain %111 %32 %45
OpStore %112 %107
%113 = OpAccessChain %111 %32 %37
OpStore %113 %108
%114 = OpAccessChain %111 %32 %115
OpStore %114 %109
%116 = OpAccessChain %111 %32 %40
OpStore %116 %110
OpReturn
OpFunctionEnd
#endif
