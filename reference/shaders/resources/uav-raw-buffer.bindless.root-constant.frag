#version 460
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require

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

layout(set = 4, binding = 0, r32ui) uniform readonly uimageBuffer _12[];

layout(location = 1) flat in uint INDEX;
layout(location = 0) out uvec2 SV_Target;

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    uint _28 = registers._m4 + 3u;
    uint _36 = uint(int(gl_FragCoord.x));
    uint _48 = ByteAddressMask(_36 * 2u, 4u);
    uvec2 _56 = uvec2(imageLoad(_12[_28], int(_48)).x, imageLoad(_12[_28], int(_48 + 1u)).x);
    uint _76 = registers._m4 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u);
    uint _79 = ByteAddressMask(_36 * 2u, 4u);
    uvec2 _85 = uvec2(imageLoad(_12[_76], int(_79)).x, imageLoad(_12[_76], int(_79 + 1u)).x);
    uint _95 = registers._m4 + (INDEX + 100u);
    uint _98 = ByteAddressMask(_36 * 2u, 4u);
    uvec2 _104 = uvec2(imageLoad(_12[nonuniformEXT(_95)], int(_98)).x, imageLoad(_12[nonuniformEXT(_95)], int(_98 + 1u)).x);
    SV_Target.x = (_85.x + _56.x) + _104.x;
    SV_Target.y = (_85.y + _56.y) + _104.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 113
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability RuntimeDescriptorArray
OpCapability StorageTexelBufferArrayDynamicIndexing
OpCapability StorageTexelBufferArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 Vulkan
OpEntryPoint Fragment %3 "main" %8 %12 %16 %18 %21
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %16 "SV_Position"
OpName %18 "INDEX"
OpName %21 "SV_Target"
OpName %43 "ByteAddressMask"
OpName %41 "index"
OpName %42 "stride"
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
OpDecorate %12 DescriptorSet 4
OpDecorate %12 Binding 0
OpDecorate %12 NonWritable
OpDecorate %16 BuiltIn FragCoord
OpDecorate %18 Flat
OpDecorate %18 Location 1
OpDecorate %21 Location 0
OpDecorate %95 NonUniform
OpDecorate %96 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%10 = OpTypeRuntimeArray %9
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpTypeFloat 32
%14 = OpTypeVector %13 4
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpTypePointer Input %5
%18 = OpVariable %17 Input
%19 = OpTypeVector %5 2
%20 = OpTypePointer Output %19
%21 = OpVariable %20 Output
%22 = OpTypePointer UniformConstant %9
%24 = OpTypePointer PushConstant %5
%26 = OpConstant %5 4
%29 = OpConstant %5 3
%32 = OpTypePointer Input %13
%34 = OpConstant %5 0
%39 = OpConstant %5 2
%40 = OpTypeFunction %5 %5 %5
%46 = OpConstant %5 4294967295
%49 = OpTypeVector %5 4
%54 = OpConstant %5 1
%62 = OpConstant %5 5
%65 = OpConstant %5 6
%68 = OpConstant %5 7
%91 = OpConstant %5 100
%109 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %112
%112 = OpLabel
%25 = OpAccessChain %24 %8 %26
%27 = OpLoad %5 %25
%28 = OpIAdd %5 %27 %29
%23 = OpAccessChain %22 %12 %28
%30 = OpLoad %9 %23
%31 = OpLoad %5 %18
%33 = OpAccessChain %32 %16 %34
%35 = OpLoad %13 %33
%36 = OpConvertFToS %5 %35
%37 = OpShiftLeftLogical %5 %36 %29
%38 = OpIMul %5 %36 %39
%48 = OpFunctionCall %5 %43 %38 %26
%50 = OpImageRead %49 %30 %48 NonPrivateTexel
%51 = OpCompositeExtract %5 %50 0
%53 = OpIAdd %5 %48 %54
%52 = OpImageRead %49 %30 %53 NonPrivateTexel
%55 = OpCompositeExtract %5 %52 0
%56 = OpCompositeConstruct %19 %51 %55
%57 = OpCompositeExtract %5 %56 0
%58 = OpCompositeExtract %5 %56 1
%59 = OpAccessChain %24 %8 %26
%60 = OpLoad %5 %59
%61 = OpAccessChain %24 %8 %62
%63 = OpLoad %5 %61
%64 = OpAccessChain %24 %8 %65
%66 = OpLoad %5 %64
%67 = OpAccessChain %24 %8 %68
%69 = OpLoad %5 %67
%70 = OpCompositeConstruct %49 %60 %63 %66 %69
%71 = OpCompositeExtract %5 %70 0
%72 = OpIAdd %5 %71 %26
%74 = OpAccessChain %24 %8 %26
%75 = OpLoad %5 %74
%76 = OpIAdd %5 %75 %72
%73 = OpAccessChain %22 %12 %76
%77 = OpLoad %9 %73
%78 = OpIMul %5 %36 %39
%79 = OpFunctionCall %5 %43 %78 %26
%80 = OpImageRead %49 %77 %79 NonPrivateTexel
%81 = OpCompositeExtract %5 %80 0
%83 = OpIAdd %5 %79 %54
%82 = OpImageRead %49 %77 %83 NonPrivateTexel
%84 = OpCompositeExtract %5 %82 0
%85 = OpCompositeConstruct %19 %81 %84
%86 = OpCompositeExtract %5 %85 0
%87 = OpCompositeExtract %5 %85 1
%88 = OpIAdd %5 %86 %57
%89 = OpIAdd %5 %87 %58
%90 = OpIAdd %5 %31 %91
%93 = OpAccessChain %24 %8 %26
%94 = OpLoad %5 %93
%95 = OpIAdd %5 %94 %90
%92 = OpAccessChain %22 %12 %95
%96 = OpLoad %9 %92
%97 = OpIMul %5 %36 %39
%98 = OpFunctionCall %5 %43 %97 %26
%99 = OpImageRead %49 %96 %98 NonPrivateTexel
%100 = OpCompositeExtract %5 %99 0
%102 = OpIAdd %5 %98 %54
%101 = OpImageRead %49 %96 %102 NonPrivateTexel
%103 = OpCompositeExtract %5 %101 0
%104 = OpCompositeConstruct %19 %100 %103
%105 = OpCompositeExtract %5 %104 0
%106 = OpCompositeExtract %5 %104 1
%107 = OpIAdd %5 %88 %105
%108 = OpIAdd %5 %89 %106
%110 = OpAccessChain %109 %21 %34
OpStore %110 %107
%111 = OpAccessChain %109 %21 %54
OpStore %111 %108
OpReturn
OpFunctionEnd
%43 = OpFunction %5 None %40
%41 = OpFunctionParameter %5
%42 = OpFunctionParameter %5
%44 = OpLabel
%45 = OpUDiv %5 %46 %42
%47 = OpBitwiseAnd %5 %41 %45
OpReturnValue %47
OpFunctionEnd
#endif
