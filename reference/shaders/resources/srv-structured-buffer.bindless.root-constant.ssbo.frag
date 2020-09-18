#version 460
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 1, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _13[];

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

layout(location = 1) flat in uint INDEX;
layout(location = 0) out vec3 SV_Target;

void main()
{
    uint _36 = uint(int(gl_FragCoord.x));
    float _40 = uintBitsToFloat(_13[registers._m1 + 3u]._m0[_36]);
    uint _60 = registers._m1 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u);
    uint _61 = _36 * 2u;
    vec2 _71 = uintBitsToFloat(uvec2(_13[_60]._m0[_61], _13[_60]._m0[_61 + 1u]));
    float _74 = _71.x + _40;
    uint _81 = registers._m1 + (INDEX + 100u);
    uint _82 = _36 * 3u;
    vec3 _93 = uintBitsToFloat(uvec3(_13[nonuniformEXT(_81)]._m0[_82], _13[nonuniformEXT(_81)]._m0[_82 + 1u], _13[nonuniformEXT(_81)]._m0[_82 + 2u]));
    SV_Target.x = _74 + _93.x;
    SV_Target.y = (_71.y + _40) + _93.y;
    SV_Target.z = _74 + _93.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 106
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %17 %19 %22
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %10 "SSBO"
OpName %17 "SV_Position"
OpName %19 "INDEX"
OpName %22 "SV_Target"
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
OpDecorate %9 ArrayStride 4
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %13 DescriptorSet 1
OpDecorate %13 Binding 0
OpDecorate %13 NonWritable
OpDecorate %13 Restrict
OpDecorate %17 BuiltIn FragCoord
OpDecorate %19 Flat
OpDecorate %19 Location 1
OpDecorate %22 Location 0
OpDecorate %81 NonUniform
OpDecorate %78 NonUniform
OpDecorate %83 NonUniform
OpDecorate %85 NonUniform
OpDecorate %88 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeRuntimeArray %5
%10 = OpTypeStruct %9
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer StorageBuffer %11
%13 = OpVariable %12 StorageBuffer
%14 = OpTypeFloat 32
%15 = OpTypeVector %14 4
%16 = OpTypePointer Input %15
%17 = OpVariable %16 Input
%18 = OpTypePointer Input %5
%19 = OpVariable %18 Input
%20 = OpTypeVector %14 3
%21 = OpTypePointer Output %20
%22 = OpVariable %21 Output
%23 = OpTypePointer StorageBuffer %10
%25 = OpTypePointer PushConstant %5
%27 = OpConstant %5 1
%30 = OpConstant %5 3
%32 = OpTypePointer Input %14
%34 = OpConstant %5 0
%37 = OpTypePointer StorageBuffer %5
%42 = OpConstant %5 4
%45 = OpConstant %5 5
%48 = OpConstant %5 6
%51 = OpConstant %5 7
%53 = OpTypeVector %5 4
%62 = OpConstant %5 2
%68 = OpTypeVector %5 2
%70 = OpTypeVector %14 2
%77 = OpConstant %5 100
%91 = OpTypeVector %5 3
%100 = OpTypePointer Output %14
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %104
%104 = OpLabel
%26 = OpAccessChain %25 %8 %27
%28 = OpLoad %5 %26
%29 = OpIAdd %5 %28 %30
%24 = OpAccessChain %23 %13 %29
%31 = OpLoad %5 %19
%33 = OpAccessChain %32 %17 %34
%35 = OpLoad %14 %33
%36 = OpConvertFToS %5 %35
%38 = OpAccessChain %37 %24 %34 %36
%39 = OpLoad %5 %38
%40 = OpBitcast %14 %39
%41 = OpAccessChain %25 %8 %42
%43 = OpLoad %5 %41
%44 = OpAccessChain %25 %8 %45
%46 = OpLoad %5 %44
%47 = OpAccessChain %25 %8 %48
%49 = OpLoad %5 %47
%50 = OpAccessChain %25 %8 %51
%52 = OpLoad %5 %50
%54 = OpCompositeConstruct %53 %43 %46 %49 %52
%55 = OpCompositeExtract %5 %54 0
%56 = OpIAdd %5 %55 %42
%58 = OpAccessChain %25 %8 %27
%59 = OpLoad %5 %58
%60 = OpIAdd %5 %59 %56
%57 = OpAccessChain %23 %13 %60
%61 = OpIMul %5 %36 %62
%63 = OpAccessChain %37 %57 %34 %61
%64 = OpLoad %5 %63
%66 = OpIAdd %5 %61 %27
%65 = OpAccessChain %37 %57 %34 %66
%67 = OpLoad %5 %65
%69 = OpCompositeConstruct %68 %64 %67
%71 = OpBitcast %70 %69
%72 = OpCompositeExtract %14 %71 0
%73 = OpCompositeExtract %14 %71 1
%74 = OpFAdd %14 %72 %40
%75 = OpFAdd %14 %73 %40
%76 = OpIAdd %5 %31 %77
%79 = OpAccessChain %25 %8 %27
%80 = OpLoad %5 %79
%81 = OpIAdd %5 %80 %76
%78 = OpAccessChain %23 %13 %81
%82 = OpIMul %5 %36 %30
%83 = OpAccessChain %37 %78 %34 %82
%84 = OpLoad %5 %83
%86 = OpIAdd %5 %82 %27
%85 = OpAccessChain %37 %78 %34 %86
%87 = OpLoad %5 %85
%89 = OpIAdd %5 %82 %62
%88 = OpAccessChain %37 %78 %34 %89
%90 = OpLoad %5 %88
%92 = OpCompositeConstruct %91 %84 %87 %90
%93 = OpBitcast %20 %92
%94 = OpCompositeExtract %14 %93 0
%95 = OpCompositeExtract %14 %93 1
%96 = OpCompositeExtract %14 %93 2
%97 = OpFAdd %14 %74 %94
%98 = OpFAdd %14 %75 %95
%99 = OpFAdd %14 %74 %96
%101 = OpAccessChain %100 %22 %34
OpStore %101 %97
%102 = OpAccessChain %100 %22 %27
OpStore %102 %98
%103 = OpAccessChain %100 %22 %62
OpStore %103 %99
OpReturn
OpFunctionEnd
#endif
