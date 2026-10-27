#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, r32f) uniform readonly image2D _9[];
layout(set = 0, binding = 0) uniform writeonly uimageBuffer _14[];
layout(set = 0, binding = 0, r32i) uniform iimage2D _19[];
layout(set = 0, binding = 0, r32ui) uniform uimage1D _23[];

layout(location = 0) flat in uint INDEX;
layout(location = 0, component = 1) flat in ivec3 UV;
layout(location = 0) out vec3 SV_Target;

void main()
{
    uint _36 = uint(UV.x);
    uint _40 = uint(UV.y);
    uint _44 = uint(UV.z);
    uint _53 = INDEX + 2u;
    vec4 _63 = imageLoad(_9[INDEX], ivec2(uvec2(_36, _40)));
    imageStore(_14[INDEX + 1u], int(_36), uvec4(_40));
    ivec4 _70 = imageLoad(_19[_53], ivec2(uvec2(_40, _44)));
    imageStore(_19[_53], ivec2(uvec2(_40, _44)), ivec4(uvec4(_36)));
    uint _81 = imageAtomicAdd(_23[INDEX + 3u], int(_36), _40);
    SV_Target.x = _63.x;
    SV_Target.y = float(int(uvec4(_70).x));
    SV_Target.z = float(_81);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 88
; Schema: 0
OpCapability Shader
OpCapability Image1D
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpCapability RuntimeDescriptorArray
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %14 %19 %23 %25 %28 %31
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %25 "INDEX"
OpName %28 "UV"
OpName %31 "SV_Target"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonWritable
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 0
OpDecorate %14 NonReadable
OpDecorate %19 DescriptorSet 0
OpDecorate %19 Binding 0
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 0
OpDecorate %25 Flat
OpDecorate %25 Location 0
OpDecorate %28 Flat
OpDecorate %28 Location 0
OpDecorate %28 Component 1
OpDecorate %31 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 2 R32f
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeInt 32 0
%11 = OpTypeImage %10 Buffer 0 0 0 2 Unknown
%12 = OpTypeRuntimeArray %11
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeInt 32 1
%16 = OpTypeImage %15 2D 0 0 0 2 R32i
%17 = OpTypeRuntimeArray %16
%18 = OpTypePointer UniformConstant %17
%19 = OpVariable %18 UniformConstant
%20 = OpTypeImage %10 1D 0 0 0 2 R32ui
%21 = OpTypeRuntimeArray %20
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypePointer Input %10
%25 = OpVariable %24 Input
%26 = OpTypeVector %15 3
%27 = OpTypePointer Input %26
%28 = OpVariable %27 Input
%29 = OpTypeVector %5 3
%30 = OpTypePointer Output %29
%31 = OpVariable %30 Output
%32 = OpTypePointer Input %15
%34 = OpConstant %10 0
%38 = OpConstant %10 1
%42 = OpConstant %10 2
%46 = OpTypePointer UniformConstant %6
%50 = OpTypePointer UniformConstant %11
%54 = OpTypePointer UniformConstant %16
%58 = OpConstant %10 3
%59 = OpTypePointer UniformConstant %20
%62 = OpTypeVector %5 4
%64 = OpTypeVector %10 2
%67 = OpTypeVector %10 4
%69 = OpTypeVector %15 4
%72 = OpConstant %10 5
%79 = OpTypePointer Image %10
%83 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %87
%87 = OpLabel
%33 = OpAccessChain %32 %28 %34
%35 = OpLoad %15 %33
%36 = OpBitcast %10 %35
%37 = OpAccessChain %32 %28 %38
%39 = OpLoad %15 %37
%40 = OpBitcast %10 %39
%41 = OpAccessChain %32 %28 %42
%43 = OpLoad %15 %41
%44 = OpBitcast %10 %43
%45 = OpLoad %10 %25
%47 = OpAccessChain %46 %9 %45
%48 = OpLoad %6 %47
%49 = OpIAdd %10 %45 %38
%51 = OpAccessChain %50 %14 %49
%52 = OpLoad %11 %51
%53 = OpIAdd %10 %45 %42
%55 = OpAccessChain %54 %19 %53
%56 = OpLoad %16 %55
%57 = OpIAdd %10 %45 %58
%60 = OpAccessChain %59 %23 %57
%61 = OpLoad %20 %60
%65 = OpCompositeConstruct %64 %36 %40
%63 = OpImageRead %62 %48 %65 NonPrivateTexel
%66 = OpCompositeExtract %5 %63 0
%68 = OpCompositeConstruct %67 %40 %40 %40 %40
OpImageWrite %52 %36 %68 NonPrivateTexel
%71 = OpCompositeConstruct %64 %40 %44
%70 = OpImageRead %69 %56 %71 MakeTexelVisible|NonPrivateTexel %72
%73 = OpBitcast %67 %70
%74 = OpCompositeExtract %10 %73 0
%75 = OpConvertSToF %5 %74
%76 = OpCompositeConstruct %64 %40 %44
%77 = OpCompositeConstruct %67 %36 %36 %36 %36
%78 = OpBitcast %69 %77
OpImageWrite %56 %76 %78 MakeTexelAvailable|NonPrivateTexel %72
%80 = OpImageTexelPointer %79 %60 %36 %34
%81 = OpAtomicIAdd %10 %80 %72 %34 %40
%82 = OpConvertUToF %5 %81
%84 = OpAccessChain %83 %31 %34
OpStore %84 %66
%85 = OpAccessChain %83 %31 %38
OpStore %85 %75
%86 = OpAccessChain %83 %31 %42
OpStore %86 %82
OpReturn
OpFunctionEnd
#endif
