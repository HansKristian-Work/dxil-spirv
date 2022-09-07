#version 460
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_KHR_shader_subgroup_ballot : require

layout(set = 15, binding = 0, std430) restrict readonly buffer SSBO_Offsets
{
    uvec2 _m0[];
} _13;

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
} registers;

layout(set = 0, binding = 0) uniform usamplerBuffer _17[];
layout(set = 0, binding = 0, r32ui) uniform coherent writeonly uimageBuffer _21[];

layout(location = 0) flat in uint INDEX;
layout(location = 0, component = 1) flat in ivec3 UV;
layout(location = 0) out vec3 SV_Target;

void main()
{
    uint _45 = subgroupBroadcastFirst(INDEX);
    uint _50 = INDEX + 1u;
    uint _54 = subgroupBroadcastFirst(_50);
    uint _57 = uint(UV.x) >> 2u;
    uint _64 = (_57 < _13._m0[_45].y) ? (_57 + _13._m0[_45].x) : 1073741820u;
    uvec3 _76 = uvec3(texelFetch(_17[INDEX], int(_64)).x, texelFetch(_17[INDEX], int(_64 + 1u)).x, texelFetch(_17[INDEX], int(_64 + 2u)).x);
    uint _77 = _76.x;
    uint _78 = _76.y;
    uint _79 = _76.z;
    uint _83 = uint(UV.y) >> 2u;
    uint _88 = (_83 < _13._m0[_54].y) ? (_83 + _13._m0[_54].x) : 1073741820u;
    imageStore(_21[_50], int(_88), uvec4(_77));
    imageStore(_21[_50], int(_88 + 1u), uvec4(_78));
    imageStore(_21[_50], int(_88 + 2u), uvec4(_79));
    SV_Target.x = uintBitsToFloat(_77);
    SV_Target.y = uintBitsToFloat(_78);
    SV_Target.z = uintBitsToFloat(_79);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 100
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability GroupNonUniformBallot
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %23 %27 %31
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %11 "SSBO_Offsets"
OpName %23 "INDEX"
OpName %27 "UV"
OpName %31 "SV_Target"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %10 ArrayStride 8
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %13 DescriptorSet 15
OpDecorate %13 Binding 0
OpDecorate %13 NonWritable
OpDecorate %13 Restrict
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %21 DescriptorSet 0
OpDecorate %21 Binding 0
OpDecorate %21 Coherent
OpDecorate %23 Flat
OpDecorate %23 Location 0
OpDecorate %27 Flat
OpDecorate %27 Location 0
OpDecorate %27 Component 1
OpDecorate %31 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeVector %5 2
%10 = OpTypeRuntimeArray %9
%11 = OpTypeStruct %10
%12 = OpTypePointer StorageBuffer %11
%13 = OpVariable %12 StorageBuffer
%14 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%15 = OpTypeRuntimeArray %14
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%19 = OpTypeRuntimeArray %18
%20 = OpTypePointer UniformConstant %19
%21 = OpVariable %20 UniformConstant
%22 = OpTypePointer Input %5
%23 = OpVariable %22 Input
%24 = OpTypeInt 32 1
%25 = OpTypeVector %24 3
%26 = OpTypePointer Input %25
%27 = OpVariable %26 Input
%28 = OpTypeFloat 32
%29 = OpTypeVector %28 3
%30 = OpTypePointer Output %29
%31 = OpVariable %30 Output
%32 = OpTypePointer Input %24
%34 = OpConstant %5 0
%38 = OpConstant %5 1
%42 = OpTypePointer UniformConstant %14
%46 = OpConstant %5 3
%47 = OpTypePointer StorageBuffer %9
%51 = OpTypePointer UniformConstant %18
%58 = OpConstant %5 2
%62 = OpTypeBool
%65 = OpConstant %5 1073741820
%66 = OpTypeVector %5 4
%75 = OpTypeVector %5 3
%94 = OpTypePointer Output %28
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %98
%98 = OpLabel
%33 = OpAccessChain %32 %27 %34
%35 = OpLoad %24 %33
%36 = OpBitcast %5 %35
%37 = OpAccessChain %32 %27 %38
%39 = OpLoad %24 %37
%40 = OpBitcast %5 %39
%41 = OpLoad %5 %23
%43 = OpAccessChain %42 %17 %41
%44 = OpLoad %14 %43
%45 = OpGroupNonUniformBroadcastFirst %5 %46 %41
%48 = OpAccessChain %47 %13 %34 %45
%49 = OpLoad %9 %48
%50 = OpIAdd %5 %41 %38
%52 = OpAccessChain %51 %21 %50
%53 = OpLoad %18 %52
%54 = OpGroupNonUniformBroadcastFirst %5 %46 %50
%55 = OpAccessChain %47 %13 %34 %54
%56 = OpLoad %9 %55
%57 = OpShiftRightLogical %5 %36 %58
%59 = OpCompositeExtract %5 %49 0
%60 = OpCompositeExtract %5 %49 1
%61 = OpIAdd %5 %57 %59
%63 = OpULessThan %62 %57 %60
%64 = OpSelect %5 %63 %61 %65
%67 = OpImageFetch %66 %44 %64
%68 = OpCompositeExtract %5 %67 0
%70 = OpIAdd %5 %64 %38
%69 = OpImageFetch %66 %44 %70
%71 = OpCompositeExtract %5 %69 0
%73 = OpIAdd %5 %64 %58
%72 = OpImageFetch %66 %44 %73
%74 = OpCompositeExtract %5 %72 0
%76 = OpCompositeConstruct %75 %68 %71 %74
%77 = OpCompositeExtract %5 %76 0
%78 = OpCompositeExtract %5 %76 1
%79 = OpCompositeExtract %5 %76 2
%80 = OpBitcast %28 %77
%81 = OpBitcast %28 %78
%82 = OpBitcast %28 %79
%83 = OpShiftRightLogical %5 %40 %58
%84 = OpCompositeExtract %5 %56 0
%85 = OpCompositeExtract %5 %56 1
%86 = OpIAdd %5 %83 %84
%87 = OpULessThan %62 %83 %85
%88 = OpSelect %5 %87 %86 %65
%89 = OpCompositeConstruct %66 %77 %77 %77 %77
OpImageWrite %53 %88 %89
%90 = OpCompositeConstruct %66 %78 %78 %78 %78
%91 = OpIAdd %5 %88 %38
OpImageWrite %53 %91 %90
%92 = OpCompositeConstruct %66 %79 %79 %79 %79
%93 = OpIAdd %5 %88 %58
OpImageWrite %53 %93 %92
%95 = OpAccessChain %94 %31 %34
OpStore %95 %80
%96 = OpAccessChain %94 %31 %38
OpStore %96 %81
%97 = OpAccessChain %94 %31 %58
OpStore %97 %82
OpReturn
OpFunctionEnd
#endif
