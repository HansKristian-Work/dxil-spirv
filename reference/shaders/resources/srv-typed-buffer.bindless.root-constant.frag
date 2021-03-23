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

layout(set = 1, binding = 0) uniform samplerBuffer _13[];
layout(set = 1, binding = 0) uniform usamplerBuffer _17[];
layout(set = 1, binding = 0) uniform isamplerBuffer _22[];

layout(location = 1) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _44 = uint(int(gl_FragCoord.x));
    vec4 _45 = texelFetch(_13[registers._m1 + 3u], int(_44));
    uvec4 _72 = texelFetch(_17[registers._m1 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u)], int(_44));
    uvec4 _95 = uvec4(texelFetch(_22[nonuniformEXT(registers._m1 + (INDEX + 100u))], int(_44)));
    SV_Target.x = (float(_72.x) + _45.x) + float(int(_95.x));
    SV_Target.y = (float(_72.y) + _45.y) + float(int(_95.y));
    SV_Target.z = (float(_72.z) + _45.z) + float(int(_95.z));
    SV_Target.w = (float(_72.w) + _45.w) + float(int(_95.w));
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
OpDecorate %13 DescriptorSet 1
OpDecorate %13 Binding 0
OpDecorate %17 DescriptorSet 1
OpDecorate %17 Binding 0
OpDecorate %22 DescriptorSet 1
OpDecorate %22 Binding 0
OpDecorate %25 BuiltIn FragCoord
OpDecorate %27 Flat
OpDecorate %27 Location 1
OpDecorate %29 Location 0
OpDecorate %91 NonUniform
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
%15 = OpTypeRuntimeArray %14
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeInt 32 1
%19 = OpTypeImage %18 Buffer 0 0 0 1 Unknown
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
%34 = OpConstant %5 1
%37 = OpConstant %5 3
%40 = OpTypePointer Input %9
%42 = OpConstant %5 0
%51 = OpConstant %5 4
%54 = OpConstant %5 5
%57 = OpConstant %5 6
%60 = OpConstant %5 7
%62 = OpTypeVector %5 4
%66 = OpTypePointer UniformConstant %14
%86 = OpConstant %5 100
%87 = OpTypePointer UniformConstant %19
%93 = OpTypeVector %18 4
%108 = OpTypePointer Output %9
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
%45 = OpImageFetch %23 %38 %44
%46 = OpCompositeExtract %9 %45 0
%47 = OpCompositeExtract %9 %45 1
%48 = OpCompositeExtract %9 %45 2
%49 = OpCompositeExtract %9 %45 3
%50 = OpAccessChain %32 %8 %51
%52 = OpLoad %5 %50
%53 = OpAccessChain %32 %8 %54
%55 = OpLoad %5 %53
%56 = OpAccessChain %32 %8 %57
%58 = OpLoad %5 %56
%59 = OpAccessChain %32 %8 %60
%61 = OpLoad %5 %59
%63 = OpCompositeConstruct %62 %52 %55 %58 %61
%64 = OpCompositeExtract %5 %63 0
%65 = OpIAdd %5 %64 %51
%68 = OpAccessChain %32 %8 %34
%69 = OpLoad %5 %68
%70 = OpIAdd %5 %69 %65
%67 = OpAccessChain %66 %17 %70
%71 = OpLoad %14 %67
%72 = OpImageFetch %62 %71 %44
%73 = OpCompositeExtract %5 %72 0
%74 = OpCompositeExtract %5 %72 1
%75 = OpCompositeExtract %5 %72 2
%76 = OpCompositeExtract %5 %72 3
%77 = OpConvertUToF %9 %73
%78 = OpConvertUToF %9 %74
%79 = OpConvertUToF %9 %75
%80 = OpConvertUToF %9 %76
%81 = OpFAdd %9 %77 %46
%82 = OpFAdd %9 %78 %47
%83 = OpFAdd %9 %79 %48
%84 = OpFAdd %9 %80 %49
%85 = OpIAdd %5 %39 %86
%89 = OpAccessChain %32 %8 %34
%90 = OpLoad %5 %89
%91 = OpIAdd %5 %90 %85
%88 = OpAccessChain %87 %22 %91
%92 = OpLoad %19 %88
%94 = OpImageFetch %93 %92 %44
%95 = OpBitcast %62 %94
%96 = OpCompositeExtract %5 %95 0
%97 = OpCompositeExtract %5 %95 1
%98 = OpCompositeExtract %5 %95 2
%99 = OpCompositeExtract %5 %95 3
%100 = OpConvertSToF %9 %96
%101 = OpConvertSToF %9 %97
%102 = OpConvertSToF %9 %98
%103 = OpConvertSToF %9 %99
%104 = OpFAdd %9 %81 %100
%105 = OpFAdd %9 %82 %101
%106 = OpFAdd %9 %83 %102
%107 = OpFAdd %9 %84 %103
%109 = OpAccessChain %108 %29 %42
OpStore %109 %104
%110 = OpAccessChain %108 %29 %34
OpStore %110 %105
%111 = OpAccessChain %108 %29 %112
OpStore %111 %106
%113 = OpAccessChain %108 %29 %37
OpStore %113 %107
OpReturn
OpFunctionEnd
#endif
