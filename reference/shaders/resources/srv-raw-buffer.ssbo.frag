#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 3, std430) restrict readonly buffer SSBO
{
    uvec2 _m0[];
} _10;

layout(set = 0, binding = 4, std430) restrict readonly buffer _12_16
{
    uvec2 _m0[];
} _16[64];

layout(set = 0, binding = 100, std430) restrict readonly buffer _18_21
{
    uvec2 _m0[];
} _21[];

layout(set = 0, binding = 0, std140) uniform _26_28
{
    vec4 _m0[1];
} _28;

layout(location = 1) flat in uint INDEX;
layout(location = 0) out uvec2 SV_Target;

void main()
{
    uint _40 = uint(int(gl_FragCoord.x));
    uvec4 _52 = floatBitsToUint(_28._m0[0u]);
    uint _53 = _52.x;
    SV_Target.x = (_16[_53]._m0[_40].x + _10._m0[_40].x) + _21[nonuniformEXT(INDEX)]._m0[_40].x;
    SV_Target.y = (_16[_53]._m0[_40].y + _10._m0[_40].y) + _21[nonuniformEXT(INDEX)]._m0[_40].y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 79
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %30 %32 %34
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SSBO"
OpName %12 "SSBO"
OpName %18 "SSBO"
OpName %26 ""
OpName %30 "SV_Position"
OpName %32 "INDEX"
OpName %34 "SV_Target"
OpDecorate %7 ArrayStride 8
OpMemberDecorate %8 0 Offset 0
OpDecorate %8 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 3
OpDecorate %10 NonWritable
OpDecorate %10 Restrict
OpDecorate %11 ArrayStride 8
OpMemberDecorate %12 0 Offset 0
OpDecorate %12 Block
OpDecorate %16 DescriptorSet 0
OpDecorate %16 Binding 4
OpDecorate %16 NonWritable
OpDecorate %16 Restrict
OpDecorate %17 ArrayStride 8
OpMemberDecorate %18 0 Offset 0
OpDecorate %18 Block
OpDecorate %21 DescriptorSet 0
OpDecorate %21 Binding 100
OpDecorate %21 NonWritable
OpDecorate %21 Restrict
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
OpDecorate %67 NonUniform
OpDecorate %68 NonUniform
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
%43 = OpTypePointer StorageBuffer %6
%48 = OpTypePointer Uniform %24
%51 = OpTypeVector %5 4
%55 = OpConstant %5 4
%56 = OpTypePointer StorageBuffer %12
%65 = OpConstant %5 100
%66 = OpTypePointer StorageBuffer %18
%74 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %77
%77 = OpLabel
%35 = OpLoad %5 %32
%37 = OpAccessChain %36 %30 %38
%39 = OpLoad %23 %37
%40 = OpConvertFToS %5 %39
%41 = OpShiftLeftLogical %5 %40 %42
%44 = OpAccessChain %43 %10 %38 %40
%45 = OpLoad %6 %44
%46 = OpCompositeExtract %5 %45 0
%47 = OpCompositeExtract %5 %45 1
%49 = OpAccessChain %48 %28 %38 %38
%50 = OpLoad %24 %49
%52 = OpBitcast %51 %50
%53 = OpCompositeExtract %5 %52 0
%54 = OpIAdd %5 %53 %55
%57 = OpAccessChain %56 %16 %53
%58 = OpAccessChain %43 %57 %38 %40
%59 = OpLoad %6 %58
%60 = OpCompositeExtract %5 %59 0
%61 = OpCompositeExtract %5 %59 1
%62 = OpIAdd %5 %60 %46
%63 = OpIAdd %5 %61 %47
%64 = OpIAdd %5 %35 %65
%67 = OpAccessChain %66 %21 %35
%68 = OpAccessChain %43 %67 %38 %40
%69 = OpLoad %6 %68
%70 = OpCompositeExtract %5 %69 0
%71 = OpCompositeExtract %5 %69 1
%72 = OpIAdd %5 %62 %70
%73 = OpIAdd %5 %63 %71
%75 = OpAccessChain %74 %34 %38
OpStore %75 %72
%76 = OpAccessChain %74 %34 %22
OpStore %76 %73
OpReturn
OpFunctionEnd
#endif
