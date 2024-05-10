#version 460
#extension GL_EXT_buffer_reference2 : require
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

void main()
{
    uint _36 = uint(int(gl_FragCoord.x));
    float _40 = uintBitsToFloat(texelFetch(_12[registers._m1 + 3u], int(_36)).x);
    uint _59 = registers._m1 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u);
    uint _61 = _36 * 2u;
    vec2 _71 = uintBitsToFloat(uvec2(texelFetch(_12[_59], int(_61)).x, texelFetch(_12[_59], int(_61 + 1u)).x));
    float _74 = _71.x + _40;
    uint _81 = registers._m1 + (INDEX + 100u);
    uint _83 = _36 * 3u;
    vec3 _94 = uintBitsToFloat(uvec3(texelFetch(_12[nonuniformEXT(_81)], int(_83)).x, texelFetch(_12[nonuniformEXT(_81)], int(_83 + 1u)).x, texelFetch(_12[nonuniformEXT(_81)], int(_83 + 2u)).x));
    SV_Target.x = _74 + _94.x;
    SV_Target.y = (_71.y + _40) + _94.y;
    SV_Target.z = _74 + _94.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 107
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
OpDecorate %81 NonUniform
OpDecorate %82 NonUniform
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
%19 = OpTypeVector %13 3
%20 = OpTypePointer Output %19
%21 = OpVariable %20 Output
%22 = OpTypePointer UniformConstant %9
%24 = OpTypePointer PushConstant %5
%26 = OpConstant %5 1
%29 = OpConstant %5 3
%32 = OpTypePointer Input %13
%34 = OpConstant %5 0
%37 = OpTypeVector %5 4
%42 = OpConstant %5 4
%45 = OpConstant %5 5
%48 = OpConstant %5 6
%51 = OpConstant %5 7
%62 = OpConstant %5 2
%68 = OpTypeVector %5 2
%70 = OpTypeVector %13 2
%77 = OpConstant %5 100
%92 = OpTypeVector %5 3
%101 = OpTypePointer Output %13
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %105
%105 = OpLabel
%25 = OpAccessChain %24 %8 %26
%27 = OpLoad %5 %25
%28 = OpIAdd %5 %27 %29
%23 = OpAccessChain %22 %12 %28
%30 = OpLoad %9 %23
%31 = OpLoad %5 %18
%33 = OpAccessChain %32 %16 %34
%35 = OpLoad %13 %33
%36 = OpConvertFToS %5 %35
%38 = OpImageFetch %37 %30 %36
%39 = OpCompositeExtract %5 %38 0
%40 = OpBitcast %13 %39
%41 = OpAccessChain %24 %8 %42
%43 = OpLoad %5 %41
%44 = OpAccessChain %24 %8 %45
%46 = OpLoad %5 %44
%47 = OpAccessChain %24 %8 %48
%49 = OpLoad %5 %47
%50 = OpAccessChain %24 %8 %51
%52 = OpLoad %5 %50
%53 = OpCompositeConstruct %37 %43 %46 %49 %52
%54 = OpCompositeExtract %5 %53 0
%55 = OpIAdd %5 %54 %42
%57 = OpAccessChain %24 %8 %26
%58 = OpLoad %5 %57
%59 = OpIAdd %5 %58 %55
%56 = OpAccessChain %22 %12 %59
%60 = OpLoad %9 %56
%61 = OpIMul %5 %36 %62
%63 = OpImageFetch %37 %60 %61
%64 = OpCompositeExtract %5 %63 0
%66 = OpIAdd %5 %61 %26
%65 = OpImageFetch %37 %60 %66
%67 = OpCompositeExtract %5 %65 0
%69 = OpCompositeConstruct %68 %64 %67
%71 = OpBitcast %70 %69
%72 = OpCompositeExtract %13 %71 0
%73 = OpCompositeExtract %13 %71 1
%74 = OpFAdd %13 %72 %40
%75 = OpFAdd %13 %73 %40
%76 = OpIAdd %5 %31 %77
%79 = OpAccessChain %24 %8 %26
%80 = OpLoad %5 %79
%81 = OpIAdd %5 %80 %76
%78 = OpAccessChain %22 %12 %81
%82 = OpLoad %9 %78
%83 = OpIMul %5 %36 %29
%84 = OpImageFetch %37 %82 %83
%85 = OpCompositeExtract %5 %84 0
%87 = OpIAdd %5 %83 %26
%86 = OpImageFetch %37 %82 %87
%88 = OpCompositeExtract %5 %86 0
%90 = OpIAdd %5 %83 %62
%89 = OpImageFetch %37 %82 %90
%91 = OpCompositeExtract %5 %89 0
%93 = OpCompositeConstruct %92 %85 %88 %91
%94 = OpBitcast %19 %93
%95 = OpCompositeExtract %13 %94 0
%96 = OpCompositeExtract %13 %94 1
%97 = OpCompositeExtract %13 %94 2
%98 = OpFAdd %13 %74 %95
%99 = OpFAdd %13 %75 %96
%100 = OpFAdd %13 %74 %97
%102 = OpAccessChain %101 %21 %34
OpStore %102 %98
%103 = OpAccessChain %101 %21 %26
OpStore %103 %99
%104 = OpAccessChain %101 %21 %62
OpStore %104 %100
OpReturn
OpFunctionEnd
#endif
