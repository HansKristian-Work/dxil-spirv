#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 3, std430) readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(set = 0, binding = 4, std430) readonly buffer _11_15
{
    uint _m0[];
} _15[64];

layout(set = 0, binding = 100, std430) readonly buffer _17_20
{
    uint _m0[];
} _20[];

layout(set = 0, binding = 0, std140) uniform _25_27
{
    vec4 _m0[1];
} _27;

layout(location = 1) flat in uint INDEX;
layout(location = 0) out uvec2 SV_Target;

void main()
{
    uint _40 = uint(int(gl_FragCoord.x));
    uint _43 = _40 * 2u;
    uvec2 _51 = uvec2(_9._m0[_43], _9._m0[_43 + 1u]);
    uint _60 = floatBitsToUint(_27._m0[0u]).x + 4u;
    uint _64 = _40 * 2u;
    uvec2 _70 = uvec2(_15[_60]._m0[_64], _15[_60]._m0[_64 + 1u]);
    uint _75 = INDEX + 100u;
    uint _79 = _40 * 2u;
    uvec2 _85 = uvec2(_20[nonuniformEXT(_75)]._m0[_79], _20[nonuniformEXT(_75)]._m0[_79 + 1u]);
    SV_Target.x = (_70.x + _51.x) + _85.x;
    SV_Target.y = (_70.y + _51.y) + _85.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 95
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %29 %31 %34
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %11 "SSBO"
OpName %17 "SSBO"
OpName %25 ""
OpName %29 "SV_Position"
OpName %31 "INDEX"
OpName %34 "SV_Target"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 3
OpDecorate %9 NonWritable
OpDecorate %10 ArrayStride 4
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 4
OpDecorate %15 NonWritable
OpDecorate %16 ArrayStride 4
OpMemberDecorate %17 0 Offset 0
OpDecorate %17 Block
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 100
OpDecorate %20 NonWritable
OpDecorate %24 ArrayStride 16
OpMemberDecorate %25 0 Offset 0
OpDecorate %25 Block
OpDecorate %27 DescriptorSet 0
OpDecorate %27 Binding 0
OpDecorate %29 BuiltIn FragCoord
OpDecorate %31 Flat
OpDecorate %31 Location 1
OpDecorate %34 Location 0
OpDecorate %75 NonUniform
OpDecorate %78 NonUniform
OpDecorate %80 NonUniform
OpDecorate %82 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypePointer StorageBuffer %7
%9 = OpVariable %8 StorageBuffer
%10 = OpTypeRuntimeArray %5
%11 = OpTypeStruct %10
%12 = OpConstant %5 64
%13 = OpTypeArray %11 %12
%14 = OpTypePointer StorageBuffer %13
%15 = OpVariable %14 StorageBuffer
%16 = OpTypeRuntimeArray %5
%17 = OpTypeStruct %16
%18 = OpTypeRuntimeArray %17
%19 = OpTypePointer StorageBuffer %18
%20 = OpVariable %19 StorageBuffer
%21 = OpConstant %5 1
%22 = OpTypeFloat 32
%23 = OpTypeVector %22 4
%24 = OpTypeArray %23 %21
%25 = OpTypeStruct %24
%26 = OpTypePointer Uniform %25
%27 = OpVariable %26 Uniform
%28 = OpTypePointer Input %23
%29 = OpVariable %28 Input
%30 = OpTypePointer Input %5
%31 = OpVariable %30 Input
%32 = OpTypeVector %5 2
%33 = OpTypePointer Output %32
%34 = OpVariable %33 Output
%36 = OpTypePointer Input %22
%38 = OpConstant %5 0
%42 = OpConstant %5 3
%44 = OpConstant %5 2
%45 = OpTypePointer StorageBuffer %5
%54 = OpTypePointer Uniform %23
%57 = OpTypeVector %5 4
%61 = OpConstant %5 4
%62 = OpTypePointer StorageBuffer %11
%76 = OpConstant %5 100
%77 = OpTypePointer StorageBuffer %17
%90 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %93
%93 = OpLabel
%35 = OpLoad %5 %31
%37 = OpAccessChain %36 %29 %38
%39 = OpLoad %22 %37
%40 = OpConvertFToS %5 %39
%41 = OpShiftLeftLogical %5 %40 %42
%43 = OpIMul %5 %40 %44
%46 = OpAccessChain %45 %9 %38 %43
%47 = OpLoad %5 %46
%49 = OpIAdd %5 %43 %21
%48 = OpAccessChain %45 %9 %38 %49
%50 = OpLoad %5 %48
%51 = OpCompositeConstruct %32 %47 %50
%52 = OpCompositeExtract %5 %51 0
%53 = OpCompositeExtract %5 %51 1
%55 = OpAccessChain %54 %27 %38 %38
%56 = OpLoad %23 %55
%58 = OpBitcast %57 %56
%59 = OpCompositeExtract %5 %58 0
%60 = OpIAdd %5 %59 %61
%63 = OpAccessChain %62 %15 %60
%64 = OpIMul %5 %40 %44
%65 = OpAccessChain %45 %63 %38 %64
%66 = OpLoad %5 %65
%68 = OpIAdd %5 %64 %21
%67 = OpAccessChain %45 %63 %38 %68
%69 = OpLoad %5 %67
%70 = OpCompositeConstruct %32 %66 %69
%71 = OpCompositeExtract %5 %70 0
%72 = OpCompositeExtract %5 %70 1
%73 = OpIAdd %5 %71 %52
%74 = OpIAdd %5 %72 %53
%75 = OpIAdd %5 %35 %76
%78 = OpAccessChain %77 %20 %75
%79 = OpIMul %5 %40 %44
%80 = OpAccessChain %45 %78 %38 %79
%81 = OpLoad %5 %80
%83 = OpIAdd %5 %79 %21
%82 = OpAccessChain %45 %78 %38 %83
%84 = OpLoad %5 %82
%85 = OpCompositeConstruct %32 %81 %84
%86 = OpCompositeExtract %5 %85 0
%87 = OpCompositeExtract %5 %85 1
%88 = OpIAdd %5 %73 %86
%89 = OpIAdd %5 %74 %87
%91 = OpAccessChain %90 %34 %38
OpStore %91 %88
%92 = OpAccessChain %90 %34 %21
OpStore %92 %89
OpReturn
OpFunctionEnd
#endif
