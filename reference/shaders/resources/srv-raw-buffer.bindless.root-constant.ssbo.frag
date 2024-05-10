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

void main()
{
    uint _29 = registers._m1 + 3u;
    uint _36 = uint(int(gl_FragCoord.x));
    uint _62 = registers._m1 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u);
    uint _74 = registers._m1 + (INDEX + 100u);
    SV_Target.x = (_14[_62]._m0[_36].x + _14[_29]._m0[_36].x) + _14[nonuniformEXT(_74)]._m0[_36].x;
    SV_Target.y = (_14[_62]._m0[_36].y + _14[_29]._m0[_36].y) + _14[nonuniformEXT(_74)]._m0[_36].y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 86
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %18 %20 %22
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %11 "SSBO"
OpName %18 "SV_Position"
OpName %20 "INDEX"
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
OpDecorate %74 NonUniform
OpDecorate %71 NonUniform
OpDecorate %75 NonUniform
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
%38 = OpTypePointer StorageBuffer %9
%44 = OpConstant %5 4
%47 = OpConstant %5 5
%50 = OpConstant %5 6
%53 = OpConstant %5 7
%55 = OpTypeVector %5 4
%70 = OpConstant %5 100
%81 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %84
%84 = OpLabel
%26 = OpAccessChain %25 %8 %27
%28 = OpLoad %5 %26
%29 = OpIAdd %5 %28 %30
%24 = OpAccessChain %23 %14 %29
%31 = OpLoad %5 %20
%33 = OpAccessChain %32 %18 %34
%35 = OpLoad %15 %33
%36 = OpConvertFToS %5 %35
%37 = OpShiftLeftLogical %5 %36 %30
%39 = OpAccessChain %38 %24 %34 %36
%40 = OpLoad %9 %39
%41 = OpCompositeExtract %5 %40 0
%42 = OpCompositeExtract %5 %40 1
%43 = OpAccessChain %25 %8 %44
%45 = OpLoad %5 %43
%46 = OpAccessChain %25 %8 %47
%48 = OpLoad %5 %46
%49 = OpAccessChain %25 %8 %50
%51 = OpLoad %5 %49
%52 = OpAccessChain %25 %8 %53
%54 = OpLoad %5 %52
%56 = OpCompositeConstruct %55 %45 %48 %51 %54
%57 = OpCompositeExtract %5 %56 0
%58 = OpIAdd %5 %57 %44
%60 = OpAccessChain %25 %8 %27
%61 = OpLoad %5 %60
%62 = OpIAdd %5 %61 %58
%59 = OpAccessChain %23 %14 %62
%63 = OpAccessChain %38 %59 %34 %36
%64 = OpLoad %9 %63
%65 = OpCompositeExtract %5 %64 0
%66 = OpCompositeExtract %5 %64 1
%67 = OpIAdd %5 %65 %41
%68 = OpIAdd %5 %66 %42
%69 = OpIAdd %5 %31 %70
%72 = OpAccessChain %25 %8 %27
%73 = OpLoad %5 %72
%74 = OpIAdd %5 %73 %69
%71 = OpAccessChain %23 %14 %74
%75 = OpAccessChain %38 %71 %34 %36
%76 = OpLoad %9 %75
%77 = OpCompositeExtract %5 %76 0
%78 = OpCompositeExtract %5 %76 1
%79 = OpIAdd %5 %67 %77
%80 = OpIAdd %5 %68 %78
%82 = OpAccessChain %81 %22 %34
OpStore %82 %79
%83 = OpAccessChain %81 %22 %27
OpStore %83 %80
OpReturn
OpFunctionEnd
#endif
