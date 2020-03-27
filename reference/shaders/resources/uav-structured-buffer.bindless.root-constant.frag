#version 460
#extension GL_EXT_buffer_reference : require
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
layout(location = 0) out vec3 SV_Target;

uint _40;

void main()
{
    uint _36 = uint(int(gl_FragCoord.x));
    vec2 _44 = uintBitsToFloat(uvec2(imageLoad(_12[registers._m4 + 3u], int(_36)).x, _40));
    float _45 = _44.x;
    uint _63 = registers._m4 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u);
    uint _65 = _36 * 2u;
    vec2 _74 = uintBitsToFloat(uvec2(imageLoad(_12[_63], int(_65)).x, imageLoad(_12[_63], int(_65 + 1u)).x));
    float _77 = _74.x + _45;
    uint _84 = registers._m4 + (INDEX + 100u);
    uint _86 = _36 * 3u;
    vec3 _97 = uintBitsToFloat(uvec3(imageLoad(_12[nonuniformEXT(_84)], int(_86)).x, imageLoad(_12[nonuniformEXT(_84)], int(_86 + 1u)).x, imageLoad(_12[nonuniformEXT(_84)], int(_86 + 2u)).x));
    SV_Target.x = _77 + _97.x;
    SV_Target.y = (_74.y + _45) + _97.y;
    SV_Target.z = _77 + _97.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 110
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability RuntimeDescriptorArray
OpCapability StorageTexelBufferArrayDynamicIndexing
OpCapability StorageTexelBufferArrayNonUniformIndexing
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %16 %18 %21
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %16 "SV_Position"
OpName %18 "INDEX"
OpName %21 "SV_Target"
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
OpDecorate %79 NonUniform
OpDecorate %85 NonUniform
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
%19 = OpTypeVector %13 3
%20 = OpTypePointer Output %19
%21 = OpVariable %20 Output
%22 = OpTypePointer UniformConstant %9
%24 = OpTypePointer PushConstant %5
%26 = OpConstant %5 4
%29 = OpConstant %5 3
%32 = OpTypePointer Input %13
%34 = OpConstant %5 0
%37 = OpTypeVector %5 4
%41 = OpTypeVector %5 2
%43 = OpTypeVector %13 2
%49 = OpConstant %5 5
%52 = OpConstant %5 6
%55 = OpConstant %5 7
%66 = OpConstant %5 2
%71 = OpConstant %5 1
%80 = OpConstant %5 100
%95 = OpTypeVector %5 3
%104 = OpTypePointer Output %13
%3 = OpFunction %1 None %2
%4 = OpLabel
%40 = OpUndef %5
OpBranch %108
%108 = OpLabel
%25 = OpAccessChain %24 %8 %26
%27 = OpLoad %5 %25
%28 = OpIAdd %5 %27 %29
%23 = OpAccessChain %22 %12 %28
%30 = OpLoad %9 %23
%31 = OpLoad %5 %18
%33 = OpAccessChain %32 %16 %34
%35 = OpLoad %13 %33
%36 = OpConvertFToS %5 %35
%38 = OpImageRead %37 %30 %36
%39 = OpCompositeExtract %5 %38 0
%42 = OpCompositeConstruct %41 %39 %40
%44 = OpBitcast %43 %42
%45 = OpCompositeExtract %13 %44 0
%46 = OpAccessChain %24 %8 %26
%47 = OpLoad %5 %46
%48 = OpAccessChain %24 %8 %49
%50 = OpLoad %5 %48
%51 = OpAccessChain %24 %8 %52
%53 = OpLoad %5 %51
%54 = OpAccessChain %24 %8 %55
%56 = OpLoad %5 %54
%57 = OpCompositeConstruct %37 %47 %50 %53 %56
%58 = OpCompositeExtract %5 %57 0
%59 = OpIAdd %5 %58 %26
%61 = OpAccessChain %24 %8 %26
%62 = OpLoad %5 %61
%63 = OpIAdd %5 %62 %59
%60 = OpAccessChain %22 %12 %63
%64 = OpLoad %9 %60
%65 = OpIMul %5 %36 %66
%67 = OpImageRead %37 %64 %65
%68 = OpCompositeExtract %5 %67 0
%70 = OpIAdd %5 %65 %71
%69 = OpImageRead %37 %64 %70
%72 = OpCompositeExtract %5 %69 0
%73 = OpCompositeConstruct %41 %68 %72
%74 = OpBitcast %43 %73
%75 = OpCompositeExtract %13 %74 0
%76 = OpCompositeExtract %13 %74 1
%77 = OpFAdd %13 %75 %45
%78 = OpFAdd %13 %76 %45
%79 = OpIAdd %5 %31 %80
%82 = OpAccessChain %24 %8 %26
%83 = OpLoad %5 %82
%84 = OpIAdd %5 %83 %79
%81 = OpAccessChain %22 %12 %84
%85 = OpLoad %9 %81
%86 = OpIMul %5 %36 %29
%87 = OpImageRead %37 %85 %86
%88 = OpCompositeExtract %5 %87 0
%90 = OpIAdd %5 %86 %71
%89 = OpImageRead %37 %85 %90
%91 = OpCompositeExtract %5 %89 0
%93 = OpIAdd %5 %86 %66
%92 = OpImageRead %37 %85 %93
%94 = OpCompositeExtract %5 %92 0
%96 = OpCompositeConstruct %95 %88 %91 %94
%97 = OpBitcast %19 %96
%98 = OpCompositeExtract %13 %97 0
%99 = OpCompositeExtract %13 %97 1
%100 = OpCompositeExtract %13 %97 2
%101 = OpFAdd %13 %77 %98
%102 = OpFAdd %13 %78 %99
%103 = OpFAdd %13 %77 %100
%105 = OpAccessChain %104 %21 %34
OpStore %105 %101
%106 = OpAccessChain %104 %21 %71
OpStore %106 %102
%107 = OpAccessChain %104 %21 %66
OpStore %107 %103
OpReturn
OpFunctionEnd
#endif
