#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 3, std430) readonly buffer SSBO
{
    uvec2 _m0[];
} _10;

layout(set = 0, binding = 4, std430) readonly buffer _12_16
{
    uvec2 _m0[];
} _16[64];

layout(set = 0, binding = 100, std430) readonly buffer _18_21
{
    uvec2 _m0[];
} _21[];

layout(set = 0, binding = 0, std140) uniform _26_28
{
    vec4 _m0[1];
} _28;

layout(location = 1) flat in uint INDEX;
layout(location = 0) out uvec2 SV_Target;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    uint _40 = uint(int(gl_FragCoord.x));
    uint _52 = ByteAddressMask(_40, 8u);
    uvec4 _63 = floatBitsToUint(_28._m0[0u]);
    uint _64 = _63.x;
    uint _69 = ByteAddressMask(_40, 8u);
    uint _80 = ByteAddressMask(_40, 8u);
    SV_Target.x = (_16[_64]._m0[_69].x + _10._m0[_52].x) + _21[nonuniformEXT(INDEX)]._m0[_80].x;
    SV_Target.y = (_16[_64]._m0[_69].y + _10._m0[_52].y) + _21[nonuniformEXT(INDEX)]._m0[_80].y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 92
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %16 %21 %28 %30 %32 %34
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SSBO"
OpName %12 "SSBO"
OpName %18 "SSBO"
OpName %26 ""
OpName %30 "SV_Position"
OpName %32 "INDEX"
OpName %34 "SV_Target"
OpName %46 "ByteAddressMask"
OpName %44 "index"
OpName %45 "stride"
OpDecorate %7 ArrayStride 8
OpMemberDecorate %8 0 Offset 0
OpDecorate %8 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 3
OpDecorate %10 NonWritable
OpDecorate %11 ArrayStride 8
OpMemberDecorate %12 0 Offset 0
OpDecorate %12 Block
OpDecorate %16 DescriptorSet 0
OpDecorate %16 Binding 4
OpDecorate %16 NonWritable
OpDecorate %17 ArrayStride 8
OpMemberDecorate %18 0 Offset 0
OpDecorate %18 Block
OpDecorate %21 DescriptorSet 0
OpDecorate %21 Binding 100
OpDecorate %21 NonWritable
OpDecorate %25 ArrayStride 16
OpMemberDecorate %26 0 Offset 0
OpDecorate %26 Block
OpDecorate %28 DescriptorSet 0
OpDecorate %28 Binding 0
OpDecorate %30 BuiltIn FragCoord
OpDecorate %32 Flat
OpDecorate %32 Location 1
OpDecorate %34 Location 0
OpDecorate %35 NonUniform
OpDecorate %79 NonUniform
OpDecorate %81 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypeRuntimeArray %6
%8 = OpTypeStruct %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypeRuntimeArray %6
%12 = OpTypeStruct %11
%13 = OpConstant %5 64
%14 = OpTypeArray %12 %13
%15 = OpTypePointer StorageBuffer %14
%16 = OpVariable %15 StorageBuffer
%17 = OpTypeRuntimeArray %6
%18 = OpTypeStruct %17
%19 = OpTypeRuntimeArray %18
%20 = OpTypePointer StorageBuffer %19
%21 = OpVariable %20 StorageBuffer
%22 = OpConstant %5 1
%23 = OpTypeFloat 32
%24 = OpTypeVector %23 4
%25 = OpTypeArray %24 %22
%26 = OpTypeStruct %25
%27 = OpTypePointer Uniform %26
%28 = OpVariable %27 Uniform
%29 = OpTypePointer Input %24
%30 = OpVariable %29 Input
%31 = OpTypePointer Input %5
%32 = OpVariable %31 Input
%33 = OpTypePointer Output %6
%34 = OpVariable %33 Output
%36 = OpTypePointer Input %23
%38 = OpConstant %5 0
%42 = OpConstant %5 3
%43 = OpTypeFunction %5 %5 %5
%49 = OpConstant %5 4294967295
%53 = OpConstant %5 8
%54 = OpTypePointer StorageBuffer %6
%59 = OpTypePointer Uniform %24
%62 = OpTypeVector %5 4
%66 = OpConstant %5 4
%67 = OpTypePointer StorageBuffer %12
%77 = OpConstant %5 100
%78 = OpTypePointer StorageBuffer %18
%87 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %90
%90 = OpLabel
%35 = OpLoad %5 %32
%37 = OpAccessChain %36 %30 %38
%39 = OpLoad %23 %37
%40 = OpConvertFToS %5 %39
%41 = OpShiftLeftLogical %5 %40 %42
%52 = OpFunctionCall %5 %46 %40 %53
%55 = OpAccessChain %54 %10 %38 %52
%56 = OpLoad %6 %55
%57 = OpCompositeExtract %5 %56 0
%58 = OpCompositeExtract %5 %56 1
%60 = OpAccessChain %59 %28 %38 %38
%61 = OpLoad %24 %60
%63 = OpBitcast %62 %61
%64 = OpCompositeExtract %5 %63 0
%65 = OpIAdd %5 %64 %66
%68 = OpAccessChain %67 %16 %64
%69 = OpFunctionCall %5 %46 %40 %53
%70 = OpAccessChain %54 %68 %38 %69
%71 = OpLoad %6 %70
%72 = OpCompositeExtract %5 %71 0
%73 = OpCompositeExtract %5 %71 1
%74 = OpIAdd %5 %72 %57
%75 = OpIAdd %5 %73 %58
%76 = OpIAdd %5 %35 %77
%79 = OpAccessChain %78 %21 %35
%80 = OpFunctionCall %5 %46 %40 %53
%81 = OpAccessChain %54 %79 %38 %80
%82 = OpLoad %6 %81
%83 = OpCompositeExtract %5 %82 0
%84 = OpCompositeExtract %5 %82 1
%85 = OpIAdd %5 %74 %83
%86 = OpIAdd %5 %75 %84
%88 = OpAccessChain %87 %34 %38
OpStore %88 %85
%89 = OpAccessChain %87 %34 %22
OpStore %89 %86
OpReturn
OpFunctionEnd
%46 = OpFunction %5 None %43
%44 = OpFunctionParameter %5
%45 = OpFunctionParameter %5
%47 = OpLabel
%48 = OpUDiv %5 %49 %45
%50 = OpBitwiseAnd %5 %44 %48
OpReturnValue %50
OpFunctionEnd
#endif
