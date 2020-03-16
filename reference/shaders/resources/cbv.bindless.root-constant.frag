#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 5, binding = 0, std140) uniform BindlessCBV
{
    vec4 _m0[4096];
} _16[];

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

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _27 = registers._m5 + 3u;
    uint _32 = registers._m5 + 5u;
    uint _70 = registers._m5 + (uvec4(registers._m4, registers._m5, registers._m6, registers._m7).x + 4u);
    uint _86 = registers._m5 + (INDEX + 100u);
    SV_Target.x = ((_16[_32]._m0[0u].x + _16[_27]._m0[0u].x) + _16[_70]._m0[0u].x) + _16[_86]._m0[0u].x;
    SV_Target.y = ((_16[_32]._m0[0u].y + _16[_27]._m0[0u].y) + _16[_70]._m0[0u].y) + _16[_86]._m0[0u].y;
    SV_Target.z = ((_16[_32]._m0[0u].z + _16[_27]._m0[0u].z) + _16[_70]._m0[0u].z) + _16[_86]._m0[0u].z;
    SV_Target.w = ((_16[_32]._m0[0u].w + _16[_27]._m0[0u].w) + _16[_70]._m0[0u].w) + _16[_86]._m0[0u].w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 106
; Schema: 0
OpCapability Shader
OpCapability UniformBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %18 %20
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %13 "BindlessCBV"
OpName %18 "INDEX"
OpName %20 "SV_Target"
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
OpDecorate %12 ArrayStride 16
OpDecorate %13 Block
OpMemberDecorate %13 0 Offset 0
OpDecorate %16 DescriptorSet 5
OpDecorate %16 Binding 0
OpDecorate %18 Flat
OpDecorate %18 Location 0
OpDecorate %20 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeFloat 32
%10 = OpTypeVector %9 4
%11 = OpConstant %5 4096
%12 = OpTypeArray %10 %11
%13 = OpTypeStruct %12
%14 = OpTypeRuntimeArray %13
%15 = OpTypePointer Uniform %14
%16 = OpVariable %15 Uniform
%17 = OpTypePointer Input %5
%18 = OpVariable %17 Input
%19 = OpTypePointer Output %10
%20 = OpVariable %19 Output
%21 = OpTypePointer Uniform %13
%23 = OpTypePointer PushConstant %5
%25 = OpConstant %5 5
%28 = OpConstant %5 3
%34 = OpConstant %5 0
%35 = OpTypePointer Uniform %10
%53 = OpConstant %5 4
%58 = OpConstant %5 6
%61 = OpConstant %5 7
%63 = OpTypeVector %5 4
%82 = OpConstant %5 100
%97 = OpTypePointer Output %9
%100 = OpConstant %5 1
%102 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %104
%104 = OpLabel
%24 = OpAccessChain %23 %8 %25
%26 = OpLoad %5 %24
%27 = OpIAdd %5 %26 %28
%22 = OpAccessChain %21 %16 %27
%30 = OpAccessChain %23 %8 %25
%31 = OpLoad %5 %30
%32 = OpIAdd %5 %31 %25
%29 = OpAccessChain %21 %16 %32
%33 = OpLoad %5 %18
%36 = OpAccessChain %35 %22 %34 %34
%37 = OpLoad %10 %36
%38 = OpCompositeExtract %9 %37 0
%39 = OpCompositeExtract %9 %37 1
%40 = OpCompositeExtract %9 %37 2
%41 = OpCompositeExtract %9 %37 3
%42 = OpAccessChain %35 %29 %34 %34
%43 = OpLoad %10 %42
%44 = OpCompositeExtract %9 %43 0
%45 = OpCompositeExtract %9 %43 1
%46 = OpCompositeExtract %9 %43 2
%47 = OpCompositeExtract %9 %43 3
%48 = OpFAdd %9 %44 %38
%49 = OpFAdd %9 %45 %39
%50 = OpFAdd %9 %46 %40
%51 = OpFAdd %9 %47 %41
%52 = OpAccessChain %23 %8 %53
%54 = OpLoad %5 %52
%55 = OpAccessChain %23 %8 %25
%56 = OpLoad %5 %55
%57 = OpAccessChain %23 %8 %58
%59 = OpLoad %5 %57
%60 = OpAccessChain %23 %8 %61
%62 = OpLoad %5 %60
%64 = OpCompositeConstruct %63 %54 %56 %59 %62
%65 = OpCompositeExtract %5 %64 0
%66 = OpIAdd %5 %65 %53
%68 = OpAccessChain %23 %8 %25
%69 = OpLoad %5 %68
%70 = OpIAdd %5 %69 %66
%67 = OpAccessChain %21 %16 %70
%71 = OpAccessChain %35 %67 %34 %34
%72 = OpLoad %10 %71
%73 = OpCompositeExtract %9 %72 0
%74 = OpCompositeExtract %9 %72 1
%75 = OpCompositeExtract %9 %72 2
%76 = OpCompositeExtract %9 %72 3
%77 = OpFAdd %9 %48 %73
%78 = OpFAdd %9 %49 %74
%79 = OpFAdd %9 %50 %75
%80 = OpFAdd %9 %51 %76
%81 = OpIAdd %5 %33 %82
%84 = OpAccessChain %23 %8 %25
%85 = OpLoad %5 %84
%86 = OpIAdd %5 %85 %81
%83 = OpAccessChain %21 %16 %86
%87 = OpAccessChain %35 %83 %34 %34
%88 = OpLoad %10 %87
%89 = OpCompositeExtract %9 %88 0
%90 = OpCompositeExtract %9 %88 1
%91 = OpCompositeExtract %9 %88 2
%92 = OpCompositeExtract %9 %88 3
%93 = OpFAdd %9 %77 %89
%94 = OpFAdd %9 %78 %90
%95 = OpFAdd %9 %79 %91
%96 = OpFAdd %9 %80 %92
%98 = OpAccessChain %97 %20 %34
OpStore %98 %93
%99 = OpAccessChain %97 %20 %100
OpStore %99 %94
%101 = OpAccessChain %97 %20 %102
OpStore %101 %95
%103 = OpAccessChain %97 %20 %28
OpStore %103 %96
OpReturn
OpFunctionEnd
#endif
