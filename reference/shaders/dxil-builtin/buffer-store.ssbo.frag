#version 460

layout(set = 0, binding = 1, std430) writeonly buffer SSBO
{
    uvec2 _m0[];
} _14;

layout(set = 0, binding = 2, std430) writeonly buffer _16_18
{
    uvec2 _m0[];
} _18;

layout(set = 0, binding = 3, std430) writeonly buffer _20_22
{
    uint _m0[];
} _22;

layout(set = 0, binding = 0) uniform writeonly imageBuffer _8;

layout(location = 0) flat in uint INDEX;
layout(location = 0, component = 1) flat in vec2 DATA;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    imageStore(_8, int(INDEX), vec4(DATA.x, DATA.y, DATA.x, DATA.x));
    _14._m0[ByteAddressMask(INDEX, 8u)] = uvec2(floatBitsToUint(DATA.x), floatBitsToUint(DATA.y));
    _18._m0[INDEX] = uvec2(floatBitsToUint(DATA.x), floatBitsToUint(DATA.y));
    uint _63 = (INDEX * 5u) + 3u;
    _22._m0[_63] = floatBitsToUint(DATA.x);
    _22._m0[_63 + 1u] = floatBitsToUint(DATA.y);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 72
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %14 %18 %22 %24 %27
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "SSBO"
OpName %16 "SSBO"
OpName %20 "SSBO"
OpName %24 "INDEX"
OpName %27 "DATA"
OpName %46 "ByteAddressMask"
OpName %44 "index"
OpName %45 "stride"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %11 ArrayStride 8
OpMemberDecorate %12 0 Offset 0
OpDecorate %12 Block
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 1
OpDecorate %14 NonReadable
OpDecorate %15 ArrayStride 8
OpMemberDecorate %16 0 Offset 0
OpDecorate %16 Block
OpDecorate %18 DescriptorSet 0
OpDecorate %18 Binding 2
OpDecorate %18 NonReadable
OpDecorate %19 ArrayStride 4
OpMemberDecorate %20 0 Offset 0
OpDecorate %20 Block
OpDecorate %22 DescriptorSet 0
OpDecorate %22 Binding 3
OpDecorate %22 NonReadable
OpDecorate %24 Flat
OpDecorate %24 Location 0
OpDecorate %27 Flat
OpDecorate %27 Location 0
OpDecorate %27 Component 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Buffer 0 0 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeVector %9 2
%11 = OpTypeRuntimeArray %10
%12 = OpTypeStruct %11
%13 = OpTypePointer StorageBuffer %12
%14 = OpVariable %13 StorageBuffer
%15 = OpTypeRuntimeArray %10
%16 = OpTypeStruct %15
%17 = OpTypePointer StorageBuffer %16
%18 = OpVariable %17 StorageBuffer
%19 = OpTypeRuntimeArray %9
%20 = OpTypeStruct %19
%21 = OpTypePointer StorageBuffer %20
%22 = OpVariable %21 StorageBuffer
%23 = OpTypePointer Input %9
%24 = OpVariable %23 Input
%25 = OpTypeVector %5 2
%26 = OpTypePointer Input %25
%27 = OpVariable %26 Input
%29 = OpTypePointer Input %5
%31 = OpConstant %9 0
%34 = OpConstant %9 1
%37 = OpTypeVector %5 4
%42 = OpConstant %9 3
%43 = OpTypeFunction %9 %9 %9
%49 = OpConstant %9 4294967295
%53 = OpConstant %9 8
%55 = OpTypePointer StorageBuffer %10
%62 = OpConstant %9 5
%66 = OpTypePointer StorageBuffer %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %70
%70 = OpLabel
%28 = OpLoad %6 %8
%30 = OpAccessChain %29 %27 %31
%32 = OpLoad %5 %30
%33 = OpAccessChain %29 %27 %34
%35 = OpLoad %5 %33
%36 = OpLoad %9 %24
%38 = OpCompositeConstruct %37 %32 %35 %32 %32
OpImageWrite %28 %36 %38
%39 = OpBitcast %9 %32
%40 = OpBitcast %9 %35
%41 = OpShiftLeftLogical %9 %36 %42
%52 = OpFunctionCall %9 %46 %36 %53
%54 = OpCompositeConstruct %10 %39 %40
%56 = OpAccessChain %55 %14 %31 %52
OpStore %56 %54
%57 = OpBitcast %9 %32
%58 = OpBitcast %9 %35
%59 = OpCompositeConstruct %10 %57 %58
%60 = OpAccessChain %55 %18 %31 %36
OpStore %60 %59
%61 = OpIMul %9 %36 %62
%63 = OpIAdd %9 %61 %42
%64 = OpBitcast %9 %32
%65 = OpBitcast %9 %35
%67 = OpAccessChain %66 %22 %31 %63
OpStore %67 %64
%69 = OpIAdd %9 %63 %34
%68 = OpAccessChain %66 %22 %31 %69
OpStore %68 %65
OpReturn
OpFunctionEnd
%46 = OpFunction %9 None %43
%44 = OpFunctionParameter %9
%45 = OpFunctionParameter %9
%47 = OpLabel
%48 = OpUDiv %9 %49 %45
%50 = OpBitwiseAnd %9 %44 %48
OpReturnValue %50
OpFunctionEnd
#endif
