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
    uint _46 = ByteAddressMask(_36, 8u);
    uint _72 = registers._m1 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u);
    uint _73 = ByteAddressMask(_36, 8u);
    uint _85 = registers._m1 + (INDEX + 100u);
    uint _86 = ByteAddressMask(_36, 8u);
    SV_Target.x = (_14[_72]._m0[_73].x + _14[_29]._m0[_46].x) + _14[nonuniformEXT(_85)]._m0[_86].x;
    SV_Target.y = (_14[_72]._m0[_73].y + _14[_29]._m0[_46].y) + _14[nonuniformEXT(_85)]._m0[_86].y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 97
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 Vulkan
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
OpDecorate %85 NonUniform
OpDecorate %82 NonUniform
OpDecorate %87 NonUniform
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
%47 = OpConstant %5 8
%48 = OpTypePointer StorageBuffer %9
%54 = OpConstant %5 4
%57 = OpConstant %5 5
%60 = OpConstant %5 6
%63 = OpConstant %5 7
%65 = OpTypeVector %5 4
%81 = OpConstant %5 100
%93 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %96
%96 = OpLabel
%26 = OpAccessChain %25 %8 %27
%28 = OpLoad %5 %26
%29 = OpIAdd %5 %28 %30
%24 = OpAccessChain %23 %14 %29
%31 = OpLoad %5 %20
%33 = OpAccessChain %32 %18 %34
%35 = OpLoad %15 %33
%36 = OpConvertFToS %5 %35
%37 = OpShiftLeftLogical %5 %36 %30
%46 = OpFunctionCall %5 %41 %36 %47
%49 = OpAccessChain %48 %24 %34 %46
%50 = OpLoad %9 %49
%51 = OpCompositeExtract %5 %50 0
%52 = OpCompositeExtract %5 %50 1
%53 = OpAccessChain %25 %8 %54
%55 = OpLoad %5 %53
%56 = OpAccessChain %25 %8 %57
%58 = OpLoad %5 %56
%59 = OpAccessChain %25 %8 %60
%61 = OpLoad %5 %59
%62 = OpAccessChain %25 %8 %63
%64 = OpLoad %5 %62
%66 = OpCompositeConstruct %65 %55 %58 %61 %64
%67 = OpCompositeExtract %5 %66 0
%68 = OpIAdd %5 %67 %54
%70 = OpAccessChain %25 %8 %27
%71 = OpLoad %5 %70
%72 = OpIAdd %5 %71 %68
%69 = OpAccessChain %23 %14 %72
%73 = OpFunctionCall %5 %41 %36 %47
%74 = OpAccessChain %48 %69 %34 %73
%75 = OpLoad %9 %74
%76 = OpCompositeExtract %5 %75 0
%77 = OpCompositeExtract %5 %75 1
%78 = OpIAdd %5 %76 %51
%79 = OpIAdd %5 %77 %52
%80 = OpIAdd %5 %31 %81
%83 = OpAccessChain %25 %8 %27
%84 = OpLoad %5 %83
%85 = OpIAdd %5 %84 %80
%82 = OpAccessChain %23 %14 %85
%86 = OpFunctionCall %5 %41 %36 %47
%87 = OpAccessChain %48 %82 %34 %86
%88 = OpLoad %9 %87
%89 = OpCompositeExtract %5 %88 0
%90 = OpCompositeExtract %5 %88 1
%91 = OpIAdd %5 %78 %89
%92 = OpIAdd %5 %79 %90
%94 = OpAccessChain %93 %22 %34
OpStore %94 %91
%95 = OpAccessChain %93 %22 %27
OpStore %95 %92
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
