#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, r32f) uniform readonly image2D _9[];
layout(set = 1, binding = 0) uniform writeonly uimageBuffer _14[];
layout(set = 2, binding = 0, r32i) uniform coherent iimage2D _19[];
layout(set = 3, binding = 0, r32ui) uniform coherent uimage1D _23[];

layout(location = 0) flat in uint INDEX;
layout(location = 0, component = 1) flat in ivec3 UV;
layout(location = 0) out vec3 SV_Target;

void main()
{
    uint _36 = uint(UV.x);
    uint _40 = uint(UV.y);
    uint _44 = uint(UV.z);
    vec4 _51 = imageLoad(_9[INDEX + 0u], ivec2(uvec2(_36, _40)));
    imageStore(_14[INDEX + 0u], int(_36), uvec4(_40));
    uint _61 = INDEX + 0u;
    ivec4 _66 = imageLoad(_19[_61], ivec2(uvec2(_40, _44)));
    imageStore(_19[_61], ivec2(uvec2(_40, _44)), ivec4(uvec4(_36)));
    uint _80 = imageAtomicAdd(_23[INDEX + 0u], int(_36), _40);
    SV_Target.x = _51.x;
    SV_Target.y = float(int(uvec4(_66).x));
    SV_Target.z = float(_80);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 88
; Schema: 0
OpCapability Shader
OpCapability StorageImageArrayDynamicIndexing
OpCapability Image1D
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpCapability RuntimeDescriptorArray
OpCapability StorageTexelBufferArrayDynamicIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %25 %28 %31
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %25 "INDEX"
OpName %28 "UV"
OpName %31 "SV_Target"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonWritable
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 0
OpDecorate %14 NonReadable
OpDecorate %19 DescriptorSet 2
OpDecorate %19 Binding 0
OpDecorate %19 Coherent
OpDecorate %23 DescriptorSet 3
OpDecorate %23 Binding 0
OpDecorate %23 Coherent
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
%47 = OpTypePointer UniformConstant %6
%50 = OpTypeVector %5 4
%52 = OpTypeVector %10 2
%56 = OpTypePointer UniformConstant %11
%59 = OpTypeVector %10 4
%62 = OpTypePointer UniformConstant %16
%65 = OpTypeVector %15 4
%75 = OpTypePointer UniformConstant %20
%78 = OpTypePointer Image %10
%82 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %86
%86 = OpLabel
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
%46 = OpIAdd %10 %45 %34
%48 = OpAccessChain %47 %9 %46
%49 = OpLoad %6 %48
%53 = OpCompositeConstruct %52 %36 %40
%51 = OpImageRead %50 %49 %53 None
%54 = OpCompositeExtract %5 %51 0
%55 = OpIAdd %10 %45 %34
%57 = OpAccessChain %56 %14 %55
%58 = OpLoad %11 %57
%60 = OpCompositeConstruct %59 %40 %40 %40 %40
OpImageWrite %58 %36 %60
%61 = OpIAdd %10 %45 %34
%63 = OpAccessChain %62 %19 %61
%64 = OpLoad %16 %63
%67 = OpCompositeConstruct %52 %40 %44
%66 = OpImageRead %65 %64 %67 None
%68 = OpBitcast %59 %66
%69 = OpCompositeExtract %10 %68 0
%70 = OpConvertSToF %5 %69
%71 = OpCompositeConstruct %52 %40 %44
%72 = OpCompositeConstruct %59 %36 %36 %36 %36
%73 = OpBitcast %65 %72
OpImageWrite %64 %71 %73
%74 = OpIAdd %10 %45 %34
%76 = OpAccessChain %75 %23 %74
%77 = OpLoad %20 %76
%79 = OpImageTexelPointer %78 %76 %36 %34
%80 = OpAtomicIAdd %10 %79 %38 %34 %40
%81 = OpConvertUToF %5 %80
%83 = OpAccessChain %82 %31 %34
OpStore %83 %54
%84 = OpAccessChain %82 %31 %38
OpStore %84 %70
%85 = OpAccessChain %82 %31 %42
OpStore %85 %81
OpReturn
OpFunctionEnd
#endif
