#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 3, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(set = 0, binding = 4, std430) restrict readonly buffer _12_16
{
    uvec2 _m0[];
} _16[64];

layout(set = 0, binding = 100, scalar) restrict readonly buffer _19_22
{
    uvec3 _m0[];
} _22[];

layout(set = 0, binding = 0, std140) uniform _27_29
{
    vec4 _m0[1];
} _29;

layout(location = 1) flat in uint INDEX;
layout(location = 0) out vec3 SV_Target;

void main()
{
    uint _42 = uint(int(gl_FragCoord.x));
    float _46 = uintBitsToFloat(_9._m0[_42]);
    vec2 _61 = uintBitsToFloat(_16[floatBitsToUint(_29._m0[0u]).x + 4u]._m0[_42]);
    float _64 = _61.x + _46;
    vec3 _73 = uintBitsToFloat(_22[nonuniformEXT(INDEX + 100u)]._m0[_42]);
    SV_Target.x = _64 + _73.x;
    SV_Target.y = (_61.y + _46) + _73.y;
    SV_Target.z = _64 + _73.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 87
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %31 %33 %36
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %12 "SSBO"
OpName %19 "SSBO"
OpName %27 ""
OpName %31 "SV_Position"
OpName %33 "INDEX"
OpName %36 "SV_Target"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 3
OpDecorate %9 NonWritable
OpDecorate %9 Restrict
OpDecorate %11 ArrayStride 8
OpMemberDecorate %12 0 Offset 0
OpDecorate %12 Block
OpDecorate %16 DescriptorSet 0
OpDecorate %16 Binding 4
OpDecorate %16 NonWritable
OpDecorate %16 Restrict
OpDecorate %18 ArrayStride 12
OpMemberDecorate %19 0 Offset 0
OpDecorate %19 Block
OpDecorate %22 DescriptorSet 0
OpDecorate %22 Binding 100
OpDecorate %22 NonWritable
OpDecorate %22 Restrict
OpDecorate %26 ArrayStride 16
OpMemberDecorate %27 0 Offset 0
OpDecorate %27 Block
OpDecorate %29 DescriptorSet 0
OpDecorate %29 Binding 0
OpDecorate %31 BuiltIn FragCoord
OpDecorate %33 Flat
OpDecorate %33 Location 1
OpDecorate %36 Location 0
OpDecorate %66 NonUniform
OpDecorate %69 NonUniform
OpDecorate %71 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypePointer StorageBuffer %7
%9 = OpVariable %8 StorageBuffer
%10 = OpTypeVector %5 2
%11 = OpTypeRuntimeArray %10
%12 = OpTypeStruct %11
%13 = OpConstant %5 64
%14 = OpTypeArray %12 %13
%15 = OpTypePointer StorageBuffer %14
%16 = OpVariable %15 StorageBuffer
%17 = OpTypeVector %5 3
%18 = OpTypeRuntimeArray %17
%19 = OpTypeStruct %18
%20 = OpTypeRuntimeArray %19
%21 = OpTypePointer StorageBuffer %20
%22 = OpVariable %21 StorageBuffer
%23 = OpConstant %5 1
%24 = OpTypeFloat 32
%25 = OpTypeVector %24 4
%26 = OpTypeArray %25 %23
%27 = OpTypeStruct %26
%28 = OpTypePointer Uniform %27
%29 = OpVariable %28 Uniform
%30 = OpTypePointer Input %25
%31 = OpVariable %30 Input
%32 = OpTypePointer Input %5
%33 = OpVariable %32 Input
%34 = OpTypeVector %24 3
%35 = OpTypePointer Output %34
%36 = OpVariable %35 Output
%38 = OpTypePointer Input %24
%40 = OpConstant %5 0
%43 = OpTypePointer StorageBuffer %5
%47 = OpTypePointer Uniform %25
%50 = OpTypeVector %5 4
%54 = OpConstant %5 4
%55 = OpTypePointer StorageBuffer %12
%57 = OpTypePointer StorageBuffer %10
%60 = OpTypeVector %24 2
%67 = OpConstant %5 100
%68 = OpTypePointer StorageBuffer %19
%70 = OpTypePointer StorageBuffer %17
%80 = OpTypePointer Output %24
%84 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %85
%85 = OpLabel
%37 = OpLoad %5 %33
%39 = OpAccessChain %38 %31 %40
%41 = OpLoad %24 %39
%42 = OpConvertFToS %5 %41
%44 = OpAccessChain %43 %9 %40 %42
%45 = OpLoad %5 %44
%46 = OpBitcast %24 %45
%48 = OpAccessChain %47 %29 %40 %40
%49 = OpLoad %25 %48
%51 = OpBitcast %50 %49
%52 = OpCompositeExtract %5 %51 0
%53 = OpIAdd %5 %52 %54
%56 = OpAccessChain %55 %16 %53
%58 = OpAccessChain %57 %56 %40 %42
%59 = OpLoad %10 %58
%61 = OpBitcast %60 %59
%62 = OpCompositeExtract %24 %61 0
%63 = OpCompositeExtract %24 %61 1
%64 = OpFAdd %24 %62 %46
%65 = OpFAdd %24 %63 %46
%66 = OpIAdd %5 %37 %67
%69 = OpAccessChain %68 %22 %66
%71 = OpAccessChain %70 %69 %40 %42
%72 = OpLoad %17 %71
%73 = OpBitcast %34 %72
%74 = OpCompositeExtract %24 %73 0
%75 = OpCompositeExtract %24 %73 1
%76 = OpCompositeExtract %24 %73 2
%77 = OpFAdd %24 %64 %74
%78 = OpFAdd %24 %65 %75
%79 = OpFAdd %24 %64 %76
%81 = OpAccessChain %80 %36 %40
OpStore %81 %77
%82 = OpAccessChain %80 %36 %23
OpStore %82 %78
%83 = OpAccessChain %80 %36 %84
OpStore %83 %79
OpReturn
OpFunctionEnd
#endif
