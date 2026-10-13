#version 460

layout(set = 0, binding = 0) uniform writeonly imageBuffer _8;
layout(set = 0, binding = 1, r32ui) uniform writeonly uimageBuffer _12;
layout(set = 0, binding = 2, r32ui) uniform writeonly uimageBuffer _13;
layout(set = 0, binding = 3, r32ui) uniform writeonly uimageBuffer _14;

layout(location = 0) flat in uint INDEX;
layout(location = 0, component = 1) flat in vec2 DATA;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    imageStore(_8, int(INDEX), vec4(DATA.x, DATA.y, DATA.x, DATA.x));
    uint _49 = ByteAddressMask(INDEX * 2u, 4u);
    imageStore(_12, int(_49), uvec4(floatBitsToUint(DATA.x)));
    imageStore(_12, int(_49 + 1u), uvec4(floatBitsToUint(DATA.y)));
    uint _55 = INDEX * 2u;
    imageStore(_13, int(_55), uvec4(floatBitsToUint(DATA.x)));
    imageStore(_13, int(_55 + 1u), uvec4(floatBitsToUint(DATA.y)));
    uint _63 = (INDEX * 5u) + 3u;
    imageStore(_14, int(_63), uvec4(floatBitsToUint(DATA.x)));
    imageStore(_14, int(_63 + 1u), uvec4(floatBitsToUint(DATA.y)));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 71
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %12 %13 %14 %16 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %16 "INDEX"
OpName %19 "DATA"
OpName %43 "ByteAddressMask"
OpName %41 "index"
OpName %42 "stride"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 1
OpDecorate %12 NonReadable
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 2
OpDecorate %13 NonReadable
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 3
OpDecorate %14 NonReadable
OpDecorate %16 Flat
OpDecorate %16 Location 0
OpDecorate %19 Flat
OpDecorate %19 Location 0
OpDecorate %19 Component 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Buffer 0 0 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeImage %9 Buffer 0 0 0 2 R32ui
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpVariable %11 UniformConstant
%14 = OpVariable %11 UniformConstant
%15 = OpTypePointer Input %9
%16 = OpVariable %15 Input
%17 = OpTypeVector %5 2
%18 = OpTypePointer Input %17
%19 = OpVariable %18 Input
%24 = OpTypePointer Input %5
%26 = OpConstant %9 0
%29 = OpConstant %9 1
%32 = OpTypeVector %5 4
%37 = OpConstant %9 3
%39 = OpConstant %9 2
%40 = OpTypeFunction %9 %9 %9
%46 = OpConstant %9 4294967295
%50 = OpConstant %9 4
%51 = OpTypeVector %9 4
%62 = OpConstant %9 5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %69
%69 = OpLabel
%20 = OpLoad %10 %14
%21 = OpLoad %10 %13
%22 = OpLoad %10 %12
%23 = OpLoad %6 %8
%25 = OpAccessChain %24 %19 %26
%27 = OpLoad %5 %25
%28 = OpAccessChain %24 %19 %29
%30 = OpLoad %5 %28
%31 = OpLoad %9 %16
%33 = OpCompositeConstruct %32 %27 %30 %27 %27
OpImageWrite %23 %31 %33
%34 = OpBitcast %9 %27
%35 = OpBitcast %9 %30
%36 = OpShiftLeftLogical %9 %31 %37
%38 = OpIMul %9 %31 %39
%49 = OpFunctionCall %9 %43 %38 %50
%52 = OpCompositeConstruct %51 %34 %34 %34 %34
OpImageWrite %22 %49 %52
%53 = OpCompositeConstruct %51 %35 %35 %35 %35
%54 = OpIAdd %9 %49 %29
OpImageWrite %22 %54 %53
%55 = OpIMul %9 %31 %39
%56 = OpBitcast %9 %27
%57 = OpBitcast %9 %30
%58 = OpCompositeConstruct %51 %56 %56 %56 %56
OpImageWrite %21 %55 %58
%59 = OpCompositeConstruct %51 %57 %57 %57 %57
%60 = OpIAdd %9 %55 %29
OpImageWrite %21 %60 %59
%61 = OpIMul %9 %31 %62
%63 = OpIAdd %9 %61 %37
%64 = OpBitcast %9 %27
%65 = OpBitcast %9 %30
%66 = OpCompositeConstruct %51 %64 %64 %64 %64
OpImageWrite %20 %63 %66
%67 = OpCompositeConstruct %51 %65 %65 %65 %65
%68 = OpIAdd %9 %63 %29
OpImageWrite %20 %68 %67
OpReturn
OpFunctionEnd
%43 = OpFunction %9 None %40
%41 = OpFunctionParameter %9
%42 = OpFunctionParameter %9
%44 = OpLabel
%45 = OpUDiv %9 %46 %42
%47 = OpBitwiseAnd %9 %41 %45
OpReturnValue %47
OpFunctionEnd
#endif
