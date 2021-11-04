#version 460
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 1, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _13[];

layout(set = 1, binding = 0, std430) restrict readonly buffer _16_19
{
    uvec2 _m0[];
} _19[];

layout(set = 1, binding = 0, scalar) restrict readonly buffer _22_25
{
    uvec3 _m0[];
} _25[];

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
    uint _48 = uint(int(gl_FragCoord.x));
    float _52 = uintBitsToFloat(_13[registers._m1 + 3u]._m0[_48]);
    vec2 _78 = uintBitsToFloat(_19[registers._m1 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u)]._m0[_48]);
    float _81 = _78.x + _52;
    vec3 _93 = uintBitsToFloat(_25[nonuniformEXT(registers._m1 + (INDEX + 100u))]._m0[_48]);
    SV_Target.x = _81 + _93.x;
    SV_Target.y = (_78.y + _52) + _93.y;
    SV_Target.z = _81 + _93.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 107
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %29 %31 %34
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %10 "SSBO"
OpName %16 "SSBO"
OpName %22 "SSBO"
OpName %29 "SV_Position"
OpName %31 "INDEX"
OpName %34 "SV_Target"
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
OpDecorate %15 ArrayStride 8
OpMemberDecorate %16 0 Offset 0
OpDecorate %16 Block
OpDecorate %19 DescriptorSet 1
OpDecorate %19 Binding 0
OpDecorate %19 NonWritable
OpDecorate %19 Restrict
OpDecorate %21 ArrayStride 12
OpMemberDecorate %22 0 Offset 0
OpDecorate %22 Block
OpDecorate %25 DescriptorSet 1
OpDecorate %25 Binding 0
OpDecorate %25 NonWritable
OpDecorate %25 Restrict
OpDecorate %29 BuiltIn FragCoord
OpDecorate %31 Flat
OpDecorate %31 Location 1
OpDecorate %34 Location 0
OpDecorate %89 NonUniform
OpDecorate %86 NonUniform
OpDecorate %91 NonUniform
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
%14 = OpTypeVector %5 2
%15 = OpTypeRuntimeArray %14
%16 = OpTypeStruct %15
%17 = OpTypeRuntimeArray %16
%18 = OpTypePointer StorageBuffer %17
%19 = OpVariable %18 StorageBuffer
%20 = OpTypeVector %5 3
%21 = OpTypeRuntimeArray %20
%22 = OpTypeStruct %21
%23 = OpTypeRuntimeArray %22
%24 = OpTypePointer StorageBuffer %23
%25 = OpVariable %24 StorageBuffer
%26 = OpTypeFloat 32
%27 = OpTypeVector %26 4
%28 = OpTypePointer Input %27
%29 = OpVariable %28 Input
%30 = OpTypePointer Input %5
%31 = OpVariable %30 Input
%32 = OpTypeVector %26 3
%33 = OpTypePointer Output %32
%34 = OpVariable %33 Output
%35 = OpTypePointer StorageBuffer %10
%37 = OpTypePointer PushConstant %5
%39 = OpConstant %5 1
%42 = OpConstant %5 3
%44 = OpTypePointer Input %26
%46 = OpConstant %5 0
%49 = OpTypePointer StorageBuffer %5
%54 = OpConstant %5 4
%57 = OpConstant %5 5
%60 = OpConstant %5 6
%63 = OpConstant %5 7
%65 = OpTypeVector %5 4
%69 = OpTypePointer StorageBuffer %16
%74 = OpTypePointer StorageBuffer %14
%77 = OpTypeVector %26 2
%84 = OpConstant %5 100
%85 = OpTypePointer StorageBuffer %22
%90 = OpTypePointer StorageBuffer %20
%100 = OpTypePointer Output %26
%104 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %105
%105 = OpLabel
%38 = OpAccessChain %37 %8 %39
%40 = OpLoad %5 %38
%41 = OpIAdd %5 %40 %42
%36 = OpAccessChain %35 %13 %41
%43 = OpLoad %5 %31
%45 = OpAccessChain %44 %29 %46
%47 = OpLoad %26 %45
%48 = OpConvertFToS %5 %47
%50 = OpAccessChain %49 %36 %46 %48
%51 = OpLoad %5 %50
%52 = OpBitcast %26 %51
%53 = OpAccessChain %37 %8 %54
%55 = OpLoad %5 %53
%56 = OpAccessChain %37 %8 %57
%58 = OpLoad %5 %56
%59 = OpAccessChain %37 %8 %60
%61 = OpLoad %5 %59
%62 = OpAccessChain %37 %8 %63
%64 = OpLoad %5 %62
%66 = OpCompositeConstruct %65 %55 %58 %61 %64
%67 = OpCompositeExtract %5 %66 0
%68 = OpIAdd %5 %67 %54
%71 = OpAccessChain %37 %8 %39
%72 = OpLoad %5 %71
%73 = OpIAdd %5 %72 %68
%70 = OpAccessChain %69 %19 %73
%75 = OpAccessChain %74 %70 %46 %48
%76 = OpLoad %14 %75
%78 = OpBitcast %77 %76
%79 = OpCompositeExtract %26 %78 0
%80 = OpCompositeExtract %26 %78 1
%81 = OpFAdd %26 %79 %52
%82 = OpFAdd %26 %80 %52
%83 = OpIAdd %5 %43 %84
%87 = OpAccessChain %37 %8 %39
%88 = OpLoad %5 %87
%89 = OpIAdd %5 %88 %83
%86 = OpAccessChain %85 %25 %89
%91 = OpAccessChain %90 %86 %46 %48
%92 = OpLoad %20 %91
%93 = OpBitcast %32 %92
%94 = OpCompositeExtract %26 %93 0
%95 = OpCompositeExtract %26 %93 1
%96 = OpCompositeExtract %26 %93 2
%97 = OpFAdd %26 %81 %94
%98 = OpFAdd %26 %82 %95
%99 = OpFAdd %26 %81 %96
%101 = OpAccessChain %100 %34 %46
OpStore %101 %97
%102 = OpAccessChain %100 %34 %39
OpStore %102 %98
%103 = OpAccessChain %100 %34 %104
OpStore %103 %99
OpReturn
OpFunctionEnd
#endif
