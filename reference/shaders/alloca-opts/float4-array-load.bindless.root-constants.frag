#version 460
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 5, binding = 0, scalar) uniform BindlessCBV
{
    float _m0[16384];
} _15[];

layout(set = 5, binding = 0, std140) uniform _19_22
{
    vec4 _m0[4096];
} _22[];

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

layout(location = 0) flat in uint A;
layout(location = 1) in vec4 P;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _91 = A % 6u;
    SV_Target.x = _15[registers._m5]._m0[_91 * 4u] * P.x;
    SV_Target.y = _15[registers._m5]._m0[(_91 * 4u) + 1u] * P.y;
    SV_Target.z = _15[registers._m5]._m0[(_91 * 4u) + 2u] * P.z;
    SV_Target.w = _15[registers._m5]._m0[(_91 * 4u) + 3u] * P.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 120
; Schema: 0
OpCapability Shader
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %24 %26 %28
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %12 "BindlessCBV"
OpName %19 "BindlessCBV"
OpName %24 "A"
OpName %26 "P"
OpName %28 "SV_Target"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %11 ArrayStride 4
OpDecorate %12 Block
OpMemberDecorate %12 0 Offset 0
OpDecorate %15 DescriptorSet 5
OpDecorate %15 Binding 0
OpDecorate %18 ArrayStride 16
OpDecorate %19 Block
OpMemberDecorate %19 0 Offset 0
OpDecorate %22 DescriptorSet 5
OpDecorate %22 Binding 0
OpDecorate %24 Flat
OpDecorate %24 Location 0
OpDecorate %26 Location 1
OpDecorate %28 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeFloat 32
%10 = OpConstant %5 16384
%11 = OpTypeArray %9 %10
%12 = OpTypeStruct %11
%13 = OpTypeRuntimeArray %12
%14 = OpTypePointer Uniform %13
%15 = OpVariable %14 Uniform
%16 = OpTypeVector %9 4
%17 = OpConstant %5 4096
%18 = OpTypeArray %16 %17
%19 = OpTypeStruct %18
%20 = OpTypeRuntimeArray %19
%21 = OpTypePointer Uniform %20
%22 = OpVariable %21 Uniform
%23 = OpTypePointer Input %5
%24 = OpVariable %23 Input
%25 = OpTypePointer Input %16
%26 = OpVariable %25 Input
%27 = OpTypePointer Output %16
%28 = OpVariable %27 Output
%29 = OpTypePointer Uniform %12
%31 = OpTypePointer PushConstant %5
%33 = OpConstant %5 5
%35 = OpTypePointer Uniform %19
%39 = OpTypePointer Input %9
%41 = OpConstant %5 0
%44 = OpConstant %5 1
%47 = OpConstant %5 2
%50 = OpConstant %5 3
%53 = OpTypePointer Uniform %16
%78 = OpConstant %5 4
%92 = OpConstant %5 6
%94 = OpTypePointer Uniform %9
%113 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %118
%118 = OpLabel
%32 = OpAccessChain %31 %8 %33
%34 = OpLoad %5 %32
%30 = OpAccessChain %29 %15 %34
%37 = OpAccessChain %31 %8 %33
%38 = OpLoad %5 %37
%36 = OpAccessChain %35 %22 %38
%40 = OpAccessChain %39 %26 %41
%42 = OpLoad %9 %40
%43 = OpAccessChain %39 %26 %44
%45 = OpLoad %9 %43
%46 = OpAccessChain %39 %26 %47
%48 = OpLoad %9 %46
%49 = OpAccessChain %39 %26 %50
%51 = OpLoad %9 %49
%52 = OpLoad %5 %24
%54 = OpAccessChain %53 %36 %41 %41
%55 = OpLoad %16 %54
%56 = OpCompositeExtract %9 %55 0
%57 = OpCompositeExtract %9 %55 1
%58 = OpCompositeExtract %9 %55 2
%59 = OpCompositeExtract %9 %55 3
%60 = OpAccessChain %53 %36 %41 %44
%61 = OpLoad %16 %60
%62 = OpCompositeExtract %9 %61 0
%63 = OpCompositeExtract %9 %61 1
%64 = OpCompositeExtract %9 %61 2
%65 = OpCompositeExtract %9 %61 3
%66 = OpAccessChain %53 %36 %41 %47
%67 = OpLoad %16 %66
%68 = OpCompositeExtract %9 %67 0
%69 = OpCompositeExtract %9 %67 1
%70 = OpCompositeExtract %9 %67 2
%71 = OpCompositeExtract %9 %67 3
%72 = OpAccessChain %53 %36 %41 %50
%73 = OpLoad %16 %72
%74 = OpCompositeExtract %9 %73 0
%75 = OpCompositeExtract %9 %73 1
%76 = OpCompositeExtract %9 %73 2
%77 = OpCompositeExtract %9 %73 3
%79 = OpAccessChain %53 %36 %41 %78
%80 = OpLoad %16 %79
%81 = OpCompositeExtract %9 %80 0
%82 = OpCompositeExtract %9 %80 1
%83 = OpCompositeExtract %9 %80 2
%84 = OpCompositeExtract %9 %80 3
%85 = OpAccessChain %53 %36 %41 %33
%86 = OpLoad %16 %85
%87 = OpCompositeExtract %9 %86 0
%88 = OpCompositeExtract %9 %86 1
%89 = OpCompositeExtract %9 %86 2
%90 = OpCompositeExtract %9 %86 3
%91 = OpUMod %5 %52 %92
%93 = OpIMul %5 %91 %78
%95 = OpAccessChain %94 %30 %41 %93
%96 = OpIMul %5 %91 %78
%97 = OpIAdd %5 %96 %44
%98 = OpAccessChain %94 %30 %41 %97
%99 = OpIMul %5 %91 %78
%100 = OpIAdd %5 %99 %47
%101 = OpAccessChain %94 %30 %41 %100
%102 = OpIMul %5 %91 %78
%103 = OpIAdd %5 %102 %50
%104 = OpAccessChain %94 %30 %41 %103
%105 = OpLoad %9 %95
%106 = OpLoad %9 %98
%107 = OpLoad %9 %101
%108 = OpLoad %9 %104
%109 = OpFMul %9 %105 %42
%110 = OpFMul %9 %106 %45
%111 = OpFMul %9 %107 %48
%112 = OpFMul %9 %108 %51
%114 = OpAccessChain %113 %28 %41
OpStore %114 %109
%115 = OpAccessChain %113 %28 %44
OpStore %115 %110
%116 = OpAccessChain %113 %28 %47
OpStore %116 %111
%117 = OpAccessChain %113 %28 %50
OpStore %117 %112
OpReturn
OpFunctionEnd
#endif
