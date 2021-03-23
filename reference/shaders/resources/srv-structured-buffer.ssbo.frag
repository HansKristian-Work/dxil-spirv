#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 3, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(set = 0, binding = 4, std430) restrict readonly buffer _11_15
{
    uint _m0[];
} _15[64];

layout(set = 0, binding = 100, std430) restrict readonly buffer _17_20
{
    uint _m0[];
} _20[];

layout(set = 0, binding = 0, std140) uniform _25_27
{
    vec4 _m0[1];
} _27;

layout(location = 1) flat in uint INDEX;
layout(location = 0) out vec3 SV_Target;

void main()
{
    uint _40 = uint(int(gl_FragCoord.x));
    float _44 = uintBitsToFloat(_9._m0[_40]);
    uint _51 = floatBitsToUint(_27._m0[0u]).x + 4u;
    uint _55 = _40 * 2u;
    vec2 _65 = uintBitsToFloat(uvec2(_15[_51]._m0[_55], _15[_51]._m0[_55 + 1u]));
    float _68 = _65.x + _44;
    uint _70 = INDEX + 100u;
    uint _74 = _40 * 3u;
    vec3 _86 = uintBitsToFloat(uvec3(_20[nonuniformEXT(_70)]._m0[_74], _20[nonuniformEXT(_70)]._m0[_74 + 1u], _20[nonuniformEXT(_70)]._m0[_74 + 2u]));
    SV_Target.x = _68 + _86.x;
    SV_Target.y = (_65.y + _44) + _86.y;
    SV_Target.z = _68 + _86.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 98
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
OpDecorate %9 Restrict
OpDecorate %10 ArrayStride 4
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 4
OpDecorate %15 NonWritable
OpDecorate %15 Restrict
OpDecorate %16 ArrayStride 4
OpMemberDecorate %17 0 Offset 0
OpDecorate %17 Block
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 100
OpDecorate %20 NonWritable
OpDecorate %20 Restrict
OpDecorate %24 ArrayStride 16
OpMemberDecorate %25 0 Offset 0
OpDecorate %25 Block
OpDecorate %27 DescriptorSet 0
OpDecorate %27 Binding 0
OpDecorate %29 BuiltIn FragCoord
OpDecorate %31 Flat
OpDecorate %31 Location 1
OpDecorate %34 Location 0
OpDecorate %70 NonUniform
OpDecorate %73 NonUniform
OpDecorate %76 NonUniform
OpDecorate %78 NonUniform
OpDecorate %81 NonUniform
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
%32 = OpTypeVector %22 3
%33 = OpTypePointer Output %32
%34 = OpVariable %33 Output
%36 = OpTypePointer Input %22
%38 = OpConstant %5 0
%41 = OpTypePointer StorageBuffer %5
%45 = OpTypePointer Uniform %23
%48 = OpTypeVector %5 4
%52 = OpConstant %5 4
%53 = OpTypePointer StorageBuffer %11
%56 = OpConstant %5 2
%62 = OpTypeVector %5 2
%64 = OpTypeVector %22 2
%71 = OpConstant %5 100
%72 = OpTypePointer StorageBuffer %17
%75 = OpConstant %5 3
%84 = OpTypeVector %5 3
%93 = OpTypePointer Output %22
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %97
%97 = OpLabel
%35 = OpLoad %5 %31
%37 = OpAccessChain %36 %29 %38
%39 = OpLoad %22 %37
%40 = OpConvertFToS %5 %39
%42 = OpAccessChain %41 %9 %38 %40
%43 = OpLoad %5 %42
%44 = OpBitcast %22 %43
%46 = OpAccessChain %45 %27 %38 %38
%47 = OpLoad %23 %46
%49 = OpBitcast %48 %47
%50 = OpCompositeExtract %5 %49 0
%51 = OpIAdd %5 %50 %52
%54 = OpAccessChain %53 %15 %51
%55 = OpIMul %5 %40 %56
%57 = OpAccessChain %41 %54 %38 %55
%58 = OpLoad %5 %57
%60 = OpIAdd %5 %55 %21
%59 = OpAccessChain %41 %54 %38 %60
%61 = OpLoad %5 %59
%63 = OpCompositeConstruct %62 %58 %61
%65 = OpBitcast %64 %63
%66 = OpCompositeExtract %22 %65 0
%67 = OpCompositeExtract %22 %65 1
%68 = OpFAdd %22 %66 %44
%69 = OpFAdd %22 %67 %44
%70 = OpIAdd %5 %35 %71
%73 = OpAccessChain %72 %20 %70
%74 = OpIMul %5 %40 %75
%76 = OpAccessChain %41 %73 %38 %74
%77 = OpLoad %5 %76
%79 = OpIAdd %5 %74 %21
%78 = OpAccessChain %41 %73 %38 %79
%80 = OpLoad %5 %78
%82 = OpIAdd %5 %74 %56
%81 = OpAccessChain %41 %73 %38 %82
%83 = OpLoad %5 %81
%85 = OpCompositeConstruct %84 %77 %80 %83
%86 = OpBitcast %32 %85
%87 = OpCompositeExtract %22 %86 0
%88 = OpCompositeExtract %22 %86 1
%89 = OpCompositeExtract %22 %86 2
%90 = OpFAdd %22 %68 %87
%91 = OpFAdd %22 %69 %88
%92 = OpFAdd %22 %68 %89
%94 = OpAccessChain %93 %34 %38
OpStore %94 %90
%95 = OpAccessChain %93 %34 %21
OpStore %95 %91
%96 = OpAccessChain %93 %34 %56
OpStore %96 %92
OpReturn
OpFunctionEnd
#endif
