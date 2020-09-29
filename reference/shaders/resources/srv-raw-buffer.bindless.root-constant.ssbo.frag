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
layout(location = 0) out uvec2 SV_Target;

void main()
{
    uint _29 = registers._m1 + 3u;
    uint _36 = uint(int(gl_FragCoord.x));
    uint _38 = _36 * 2u;
    uvec2 _46 = uvec2(_13[_29]._m0[_38], _13[_29]._m0[_38 + 1u]);
    uint _68 = registers._m1 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u);
    uint _69 = _36 * 2u;
    uvec2 _75 = uvec2(_13[_68]._m0[_69], _13[_68]._m0[_69 + 1u]);
    uint _85 = registers._m1 + (INDEX + 100u);
    uint _86 = _36 * 2u;
    uvec2 _92 = uvec2(_13[nonuniformEXT(_85)]._m0[_86], _13[nonuniformEXT(_85)]._m0[_86 + 1u]);
    SV_Target.x = (_75.x + _46.x) + _92.x;
    SV_Target.y = (_75.y + _46.y) + _92.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 102
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
OpDecorate %85 NonUniform
OpDecorate %82 NonUniform
OpDecorate %87 NonUniform
OpDecorate %89 NonUniform
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
%20 = OpTypeVector %5 2
%21 = OpTypePointer Output %20
%22 = OpVariable %21 Output
%23 = OpTypePointer StorageBuffer %10
%25 = OpTypePointer PushConstant %5
%27 = OpConstant %5 1
%30 = OpConstant %5 3
%32 = OpTypePointer Input %14
%34 = OpConstant %5 0
%39 = OpConstant %5 2
%40 = OpTypePointer StorageBuffer %5
%50 = OpConstant %5 4
%53 = OpConstant %5 5
%56 = OpConstant %5 6
%59 = OpConstant %5 7
%61 = OpTypeVector %5 4
%81 = OpConstant %5 100
%97 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %100
%100 = OpLabel
%26 = OpAccessChain %25 %8 %27
%28 = OpLoad %5 %26
%29 = OpIAdd %5 %28 %30
%24 = OpAccessChain %23 %13 %29
%31 = OpLoad %5 %19
%33 = OpAccessChain %32 %17 %34
%35 = OpLoad %14 %33
%36 = OpConvertFToS %5 %35
%37 = OpShiftLeftLogical %5 %36 %30
%38 = OpIMul %5 %36 %39
%41 = OpAccessChain %40 %24 %34 %38
%42 = OpLoad %5 %41
%44 = OpIAdd %5 %38 %27
%43 = OpAccessChain %40 %24 %34 %44
%45 = OpLoad %5 %43
%46 = OpCompositeConstruct %20 %42 %45
%47 = OpCompositeExtract %5 %46 0
%48 = OpCompositeExtract %5 %46 1
%49 = OpAccessChain %25 %8 %50
%51 = OpLoad %5 %49
%52 = OpAccessChain %25 %8 %53
%54 = OpLoad %5 %52
%55 = OpAccessChain %25 %8 %56
%57 = OpLoad %5 %55
%58 = OpAccessChain %25 %8 %59
%60 = OpLoad %5 %58
%62 = OpCompositeConstruct %61 %51 %54 %57 %60
%63 = OpCompositeExtract %5 %62 0
%64 = OpIAdd %5 %63 %50
%66 = OpAccessChain %25 %8 %27
%67 = OpLoad %5 %66
%68 = OpIAdd %5 %67 %64
%65 = OpAccessChain %23 %13 %68
%69 = OpIMul %5 %36 %39
%70 = OpAccessChain %40 %65 %34 %69
%71 = OpLoad %5 %70
%73 = OpIAdd %5 %69 %27
%72 = OpAccessChain %40 %65 %34 %73
%74 = OpLoad %5 %72
%75 = OpCompositeConstruct %20 %71 %74
%76 = OpCompositeExtract %5 %75 0
%77 = OpCompositeExtract %5 %75 1
%78 = OpIAdd %5 %76 %47
%79 = OpIAdd %5 %77 %48
%80 = OpIAdd %5 %31 %81
%83 = OpAccessChain %25 %8 %27
%84 = OpLoad %5 %83
%85 = OpIAdd %5 %84 %80
%82 = OpAccessChain %23 %13 %85
%86 = OpIMul %5 %36 %39
%87 = OpAccessChain %40 %82 %34 %86
%88 = OpLoad %5 %87
%90 = OpIAdd %5 %86 %27
%89 = OpAccessChain %40 %82 %34 %90
%91 = OpLoad %5 %89
%92 = OpCompositeConstruct %20 %88 %91
%93 = OpCompositeExtract %5 %92 0
%94 = OpCompositeExtract %5 %92 1
%95 = OpIAdd %5 %78 %93
%96 = OpIAdd %5 %79 %94
%98 = OpAccessChain %97 %22 %34
OpStore %98 %95
%99 = OpAccessChain %97 %22 %27
OpStore %99 %96
OpReturn
OpFunctionEnd
#endif
