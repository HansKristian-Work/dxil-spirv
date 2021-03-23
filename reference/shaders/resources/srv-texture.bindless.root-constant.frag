#version 460
#extension GL_EXT_buffer_reference : require
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
    uint _37 = uint(int(gl_FragCoord.x));
    uint _38 = uint(int(gl_FragCoord.y));
    vec4 _41 = texelFetch(_13[registers._m0 + 3u], ivec2(uvec2(_37, _38)), int(0u));
    vec4 _69 = texelFetch(_13[registers._m0 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u)], ivec2(uvec2(_37, _38)), int(0u));
    vec4 _86 = texelFetch(_13[nonuniformEXT(registers._m0 + (INDEX + 100u))], ivec2(uvec2(_37, _38)), int(0u));
    vec4 _102 = texelFetch(_13[registers._m0 + 101u], ivec2(uvec2(_37, _38)), int(0u));
    SV_Target.x = ((_69.x + _41.x) + _86.x) + _102.x;
    SV_Target.y = ((_69.y + _41.y) + _86.y) + _102.y;
    SV_Target.z = ((_69.z + _41.z) + _86.z) + _102.z;
    SV_Target.w = ((_69.w + _41.w) + _86.w) + _102.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 119
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %16 %18 %20
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %16 "SV_Position"
OpName %18 "INDEX"
OpName %20 "SV_Target"
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
OpDecorate %16 BuiltIn FragCoord
OpDecorate %18 Flat
OpDecorate %18 Location 1
OpDecorate %20 Location 0
OpDecorate %84 NonUniform
OpDecorate %85 NonUniform
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
%14 = OpTypeVector %9 4
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpTypePointer Input %5
%18 = OpVariable %17 Input
%19 = OpTypePointer Output %14
%20 = OpVariable %19 Output
%21 = OpTypePointer UniformConstant %10
%23 = OpTypePointer PushConstant %5
%25 = OpConstant %5 0
%28 = OpConstant %5 3
%31 = OpTypePointer Input %9
%35 = OpConstant %5 1
%39 = OpTypeInt 32 1
%40 = OpConstant %39 0
%42 = OpTypeVector %5 2
%49 = OpConstant %5 4
%52 = OpConstant %5 5
%55 = OpConstant %5 6
%58 = OpConstant %5 7
%60 = OpTypeVector %5 4
%80 = OpConstant %5 100
%100 = OpConstant %5 101
%112 = OpTypePointer Output %9
%116 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %118
%118 = OpLabel
%24 = OpAccessChain %23 %8 %25
%26 = OpLoad %5 %24
%27 = OpIAdd %5 %26 %28
%22 = OpAccessChain %21 %13 %27
%29 = OpLoad %10 %22
%30 = OpLoad %5 %18
%32 = OpAccessChain %31 %16 %25
%33 = OpLoad %9 %32
%34 = OpAccessChain %31 %16 %35
%36 = OpLoad %9 %34
%37 = OpConvertFToS %5 %33
%38 = OpConvertFToS %5 %36
%43 = OpCompositeConstruct %42 %37 %38
%41 = OpImageFetch %14 %29 %43 Lod %25
%44 = OpCompositeExtract %9 %41 0
%45 = OpCompositeExtract %9 %41 1
%46 = OpCompositeExtract %9 %41 2
%47 = OpCompositeExtract %9 %41 3
%48 = OpAccessChain %23 %8 %49
%50 = OpLoad %5 %48
%51 = OpAccessChain %23 %8 %52
%53 = OpLoad %5 %51
%54 = OpAccessChain %23 %8 %55
%56 = OpLoad %5 %54
%57 = OpAccessChain %23 %8 %58
%59 = OpLoad %5 %57
%61 = OpCompositeConstruct %60 %50 %53 %56 %59
%62 = OpCompositeExtract %5 %61 0
%63 = OpIAdd %5 %62 %49
%65 = OpAccessChain %23 %8 %25
%66 = OpLoad %5 %65
%67 = OpIAdd %5 %66 %63
%64 = OpAccessChain %21 %13 %67
%68 = OpLoad %10 %64
%70 = OpCompositeConstruct %42 %37 %38
%69 = OpImageFetch %14 %68 %70 Lod %25
%71 = OpCompositeExtract %9 %69 0
%72 = OpCompositeExtract %9 %69 1
%73 = OpCompositeExtract %9 %69 2
%74 = OpCompositeExtract %9 %69 3
%75 = OpFAdd %9 %71 %44
%76 = OpFAdd %9 %72 %45
%77 = OpFAdd %9 %73 %46
%78 = OpFAdd %9 %74 %47
%79 = OpIAdd %5 %30 %80
%82 = OpAccessChain %23 %8 %25
%83 = OpLoad %5 %82
%84 = OpIAdd %5 %83 %79
%81 = OpAccessChain %21 %13 %84
%85 = OpLoad %10 %81
%87 = OpCompositeConstruct %42 %37 %38
%86 = OpImageFetch %14 %85 %87 Lod %25
%88 = OpCompositeExtract %9 %86 0
%89 = OpCompositeExtract %9 %86 1
%90 = OpCompositeExtract %9 %86 2
%91 = OpCompositeExtract %9 %86 3
%92 = OpFAdd %9 %75 %88
%93 = OpFAdd %9 %76 %89
%94 = OpFAdd %9 %77 %90
%95 = OpFAdd %9 %78 %91
%97 = OpAccessChain %23 %8 %25
%98 = OpLoad %5 %97
%99 = OpIAdd %5 %98 %100
%96 = OpAccessChain %21 %13 %99
%101 = OpLoad %10 %96
%103 = OpCompositeConstruct %42 %37 %38
%102 = OpImageFetch %14 %101 %103 Lod %25
%104 = OpCompositeExtract %9 %102 0
%105 = OpCompositeExtract %9 %102 1
%106 = OpCompositeExtract %9 %102 2
%107 = OpCompositeExtract %9 %102 3
%108 = OpFAdd %9 %92 %104
%109 = OpFAdd %9 %93 %105
%110 = OpFAdd %9 %94 %106
%111 = OpFAdd %9 %95 %107
%113 = OpAccessChain %112 %20 %25
OpStore %113 %108
%114 = OpAccessChain %112 %20 %35
OpStore %114 %109
%115 = OpAccessChain %112 %20 %116
OpStore %115 %110
%117 = OpAccessChain %112 %20 %28
OpStore %117 %111
OpReturn
OpFunctionEnd
#endif
