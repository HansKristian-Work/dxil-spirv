#version 460
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 1, binding = 0, std430) restrict readonly buffer SSBO
{
    uvec2 _m0[];
} _14[];

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

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    uint _29 = registers._m1 + 3u;
    uint _36 = uint(int(gl_FragCoord.x));
    uint _47 = ByteAddressMask(_36, 8u);
    uint _73 = registers._m1 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u);
    uint _74 = ByteAddressMask(_36, 8u);
    uint _86 = registers._m1 + (INDEX + 100u);
    uint _87 = ByteAddressMask(_36, 8u);
    SV_Target.x = (_14[_73]._m0[_74].x + _14[_29]._m0[_47].x) + _14[nonuniformEXT(_86)]._m0[_87].x;
    SV_Target.y = (_14[_73]._m0[_74].y + _14[_29]._m0[_47].y) + _14[nonuniformEXT(_86)]._m0[_87].y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 99
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %8 %14 %18 %20 %22
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %11 "SSBO"
OpName %18 "SV_Position"
OpName %20 "INDEX"
OpName %22 "SV_Target"
OpName %41 "ByteAddressMask"
OpName %39 "index"
OpName %40 "stride"
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
OpDecorate %10 ArrayStride 8
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 0
OpDecorate %14 NonWritable
OpDecorate %14 Restrict
OpDecorate %18 BuiltIn FragCoord
OpDecorate %20 Flat
OpDecorate %20 Location 1
OpDecorate %22 Location 0
OpDecorate %86 NonUniform
OpDecorate %83 NonUniform
OpDecorate %88 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeVector %5 2
%10 = OpTypeRuntimeArray %9
%11 = OpTypeStruct %10
%12 = OpTypeRuntimeArray %11
%13 = OpTypePointer StorageBuffer %12
%14 = OpVariable %13 StorageBuffer
%15 = OpTypeFloat 32
%16 = OpTypeVector %15 4
%17 = OpTypePointer Input %16
%18 = OpVariable %17 Input
%19 = OpTypePointer Input %5
%20 = OpVariable %19 Input
%21 = OpTypePointer Output %9
%22 = OpVariable %21 Output
%23 = OpTypePointer StorageBuffer %11
%25 = OpTypePointer PushConstant %5
%27 = OpConstant %5 1
%30 = OpConstant %5 3
%32 = OpTypePointer Input %15
%34 = OpConstant %5 0
%38 = OpTypeFunction %5 %5 %5
%44 = OpConstant %5 4294967295
%48 = OpConstant %5 8
%49 = OpTypePointer StorageBuffer %9
%55 = OpConstant %5 4
%58 = OpConstant %5 5
%61 = OpConstant %5 6
%64 = OpConstant %5 7
%66 = OpTypeVector %5 4
%82 = OpConstant %5 100
%94 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %97
%97 = OpLabel
%26 = OpAccessChain %25 %8 %27
%28 = OpLoad %5 %26
%29 = OpIAdd %5 %28 %30
%24 = OpAccessChain %23 %14 %29
%31 = OpLoad %5 %20
%33 = OpAccessChain %32 %18 %34
%35 = OpLoad %15 %33
%36 = OpConvertFToS %5 %35
%37 = OpShiftLeftLogical %5 %36 %30
%47 = OpFunctionCall %5 %41 %36 %48
%50 = OpAccessChain %49 %24 %34 %47
%51 = OpLoad %9 %50
%52 = OpCompositeExtract %5 %51 0
%53 = OpCompositeExtract %5 %51 1
%54 = OpAccessChain %25 %8 %55
%56 = OpLoad %5 %54
%57 = OpAccessChain %25 %8 %58
%59 = OpLoad %5 %57
%60 = OpAccessChain %25 %8 %61
%62 = OpLoad %5 %60
%63 = OpAccessChain %25 %8 %64
%65 = OpLoad %5 %63
%67 = OpCompositeConstruct %66 %56 %59 %62 %65
%68 = OpCompositeExtract %5 %67 0
%69 = OpIAdd %5 %68 %55
%71 = OpAccessChain %25 %8 %27
%72 = OpLoad %5 %71
%73 = OpIAdd %5 %72 %69
%70 = OpAccessChain %23 %14 %73
%74 = OpFunctionCall %5 %41 %36 %48
%75 = OpAccessChain %49 %70 %34 %74
%76 = OpLoad %9 %75
%77 = OpCompositeExtract %5 %76 0
%78 = OpCompositeExtract %5 %76 1
%79 = OpIAdd %5 %77 %52
%80 = OpIAdd %5 %78 %53
%81 = OpIAdd %5 %31 %82
%84 = OpAccessChain %25 %8 %27
%85 = OpLoad %5 %84
%86 = OpIAdd %5 %85 %81
%83 = OpAccessChain %23 %14 %86
%87 = OpFunctionCall %5 %41 %36 %48
%88 = OpAccessChain %49 %83 %34 %87
%89 = OpLoad %9 %88
%90 = OpCompositeExtract %5 %89 0
%91 = OpCompositeExtract %5 %89 1
%92 = OpIAdd %5 %79 %90
%93 = OpIAdd %5 %80 %91
%95 = OpAccessChain %94 %22 %34
OpStore %95 %92
%96 = OpAccessChain %94 %22 %27
OpStore %96 %93
OpReturn
OpFunctionEnd
%41 = OpFunction %5 None %38
%39 = OpFunctionParameter %5
%40 = OpFunctionParameter %5
%42 = OpLabel
%43 = OpUDiv %5 %44 %40
%45 = OpBitwiseAnd %5 %39 %43
OpReturnValue %45
OpFunctionEnd
#endif
