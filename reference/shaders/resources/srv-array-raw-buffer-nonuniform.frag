#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0) uniform usamplerBuffer _9[];

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    uint _19 = INDEX + 0u;
    uint _34 = ByteAddressMask(INDEX * 4u, 4u);
    uvec4 _50 = uvec4(texelFetch(_9[nonuniformEXT(_19)], int(_34)).x, texelFetch(_9[nonuniformEXT(_19)], int(_34 + 1u)).x, texelFetch(_9[nonuniformEXT(_19)], int(_34 + 2u)).x, texelFetch(_9[nonuniformEXT(_19)], int(_34 + 3u)).x);
    SV_Target.x = uintBitsToFloat(_50.x);
    SV_Target.y = uintBitsToFloat(_50.y);
    SV_Target.z = uintBitsToFloat(_50.z);
    SV_Target.w = uintBitsToFloat(_50.w);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 66
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability RuntimeDescriptorArray
OpCapability UniformTexelBufferArrayDynamicIndexing
OpCapability UniformTexelBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %11 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "INDEX"
OpName %15 "SV_Target"
OpName %28 "ByteAddressMask"
OpName %26 "index"
OpName %27 "stride"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %11 Flat
OpDecorate %11 Location 0
OpDecorate %15 Location 0
OpDecorate %19 NonUniform
OpDecorate %23 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypePointer Input %5
%11 = OpVariable %10 Input
%12 = OpTypeFloat 32
%13 = OpTypeVector %12 4
%14 = OpTypePointer Output %13
%15 = OpVariable %14 Output
%18 = OpConstant %5 4
%20 = OpConstant %5 0
%21 = OpTypePointer UniformConstant %6
%25 = OpTypeFunction %5 %5 %5
%31 = OpConstant %5 4294967295
%35 = OpTypeVector %5 4
%40 = OpConstant %5 1
%44 = OpConstant %5 2
%48 = OpConstant %5 3
%59 = OpTypePointer Output %12
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %64
%64 = OpLabel
%16 = OpLoad %5 %11
%17 = OpShiftLeftLogical %5 %16 %18
%19 = OpIAdd %5 %16 %20
%22 = OpAccessChain %21 %9 %19
%23 = OpLoad %6 %22
%24 = OpIMul %5 %16 %18
%34 = OpFunctionCall %5 %28 %24 %18
%36 = OpImageFetch %35 %23 %34
%37 = OpCompositeExtract %5 %36 0
%39 = OpIAdd %5 %34 %40
%38 = OpImageFetch %35 %23 %39
%41 = OpCompositeExtract %5 %38 0
%43 = OpIAdd %5 %34 %44
%42 = OpImageFetch %35 %23 %43
%45 = OpCompositeExtract %5 %42 0
%47 = OpIAdd %5 %34 %48
%46 = OpImageFetch %35 %23 %47
%49 = OpCompositeExtract %5 %46 0
%50 = OpCompositeConstruct %35 %37 %41 %45 %49
%51 = OpCompositeExtract %5 %50 0
%52 = OpCompositeExtract %5 %50 1
%53 = OpCompositeExtract %5 %50 2
%54 = OpCompositeExtract %5 %50 3
%55 = OpBitcast %12 %51
%56 = OpBitcast %12 %52
%57 = OpBitcast %12 %53
%58 = OpBitcast %12 %54
%60 = OpAccessChain %59 %15 %20
OpStore %60 %55
%61 = OpAccessChain %59 %15 %40
OpStore %61 %56
%62 = OpAccessChain %59 %15 %44
OpStore %62 %57
%63 = OpAccessChain %59 %15 %48
OpStore %63 %58
OpReturn
OpFunctionEnd
%28 = OpFunction %5 None %25
%26 = OpFunctionParameter %5
%27 = OpFunctionParameter %5
%29 = OpLabel
%30 = OpUDiv %5 %31 %27
%32 = OpBitwiseAnd %5 %26 %30
OpReturnValue %32
OpFunctionEnd
#endif
