#version 460
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_buffer_reference_uvec2 : require

layout(buffer_reference) buffer PhysicalPointerFloat4NonWriteCBVArray;
layout(buffer_reference) buffer PhysicalPointerFloatNonWriteCBVArray;

layout(buffer_reference, buffer_reference_align = 16, std430) readonly buffer PhysicalPointerFloat4NonWriteCBVArray
{
    vec4 value[4096];
};

layout(buffer_reference, buffer_reference_align = 4, std430) readonly buffer PhysicalPointerFloatNonWriteCBVArray
{
    float value[16384];
};

layout(push_constant, std430) uniform RootConstants
{
    uvec2 _m0;
    uvec2 _m1;
    uvec2 _m2;
    uvec2 _m3;
} registers;

layout(location = 0) flat in uint A;
layout(location = 1) in vec4 P;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _84 = A % 6u;
    SV_Target.x = PhysicalPointerFloatNonWriteCBVArray(registers._m0).value[_84 * 4u] * P.x;
    SV_Target.y = PhysicalPointerFloatNonWriteCBVArray(registers._m0).value[(_84 * 4u) + 1u] * P.y;
    SV_Target.z = PhysicalPointerFloatNonWriteCBVArray(registers._m0).value[(_84 * 4u) + 2u] * P.z;
    SV_Target.w = PhysicalPointerFloatNonWriteCBVArray(registers._m0).value[(_84 * 4u) + 3u] * P.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 121
; Schema: 0
OpCapability Shader
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %11 %15 %17
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "RootConstants"
OpName %9 "registers"
OpName %11 "A"
OpName %15 "P"
OpName %17 "SV_Target"
OpName %37 "PhysicalPointerFloat4NonWriteCBVArray"
OpMemberName %37 0 "value"
OpName %89 "PhysicalPointerFloatNonWriteCBVArray"
OpMemberName %89 0 "value"
OpDecorate %7 Block
OpMemberDecorate %7 0 Offset 0
OpMemberDecorate %7 1 Offset 8
OpMemberDecorate %7 2 Offset 16
OpMemberDecorate %7 3 Offset 24
OpDecorate %11 Flat
OpDecorate %11 Location 0
OpDecorate %15 Location 1
OpDecorate %17 Location 0
OpDecorate %36 ArrayStride 16
OpMemberDecorate %37 0 Offset 0
OpDecorate %37 Block
OpMemberDecorate %37 0 NonWritable
OpDecorate %88 ArrayStride 4
OpMemberDecorate %89 0 Offset 0
OpDecorate %89 Block
OpMemberDecorate %89 0 NonWritable
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypeStruct %6 %6 %6 %6
%8 = OpTypePointer PushConstant %7
%9 = OpVariable %8 PushConstant
%10 = OpTypePointer Input %5
%11 = OpVariable %10 Input
%12 = OpTypeFloat 32
%13 = OpTypeVector %12 4
%14 = OpTypePointer Input %13
%15 = OpVariable %14 Input
%16 = OpTypePointer Output %13
%17 = OpVariable %16 Output
%18 = OpTypePointer PushConstant %6
%20 = OpConstant %5 0
%22 = OpTypePointer Input %12
%26 = OpConstant %5 1
%29 = OpConstant %5 2
%32 = OpConstant %5 3
%35 = OpConstant %5 4096
%36 = OpTypeArray %13 %35
%37 = OpTypeStruct %36
%38 = OpTypePointer PhysicalStorageBuffer %37
%40 = OpTypePointer PhysicalStorageBuffer %13
%68 = OpConstant %5 4
%76 = OpConstant %5 5
%85 = OpConstant %5 6
%87 = OpConstant %5 16384
%88 = OpTypeArray %12 %87
%89 = OpTypeStruct %88
%90 = OpTypePointer PhysicalStorageBuffer %89
%92 = OpTypePointer PhysicalStorageBuffer %12
%114 = OpTypePointer Output %12
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %119
%119 = OpLabel
%19 = OpAccessChain %18 %9 %20
%21 = OpLoad %6 %19
%23 = OpAccessChain %22 %15 %20
%24 = OpLoad %12 %23
%25 = OpAccessChain %22 %15 %26
%27 = OpLoad %12 %25
%28 = OpAccessChain %22 %15 %29
%30 = OpLoad %12 %28
%31 = OpAccessChain %22 %15 %32
%33 = OpLoad %12 %31
%34 = OpLoad %5 %11
%39 = OpBitcast %38 %21
%41 = OpInBoundsAccessChain %40 %39 %20 %20
%42 = OpLoad %13 %41 Aligned 16
%43 = OpCompositeExtract %12 %42 0
%44 = OpCompositeExtract %12 %42 1
%45 = OpCompositeExtract %12 %42 2
%46 = OpCompositeExtract %12 %42 3
%47 = OpBitcast %38 %21
%48 = OpInBoundsAccessChain %40 %47 %20 %26
%49 = OpLoad %13 %48 Aligned 16
%50 = OpCompositeExtract %12 %49 0
%51 = OpCompositeExtract %12 %49 1
%52 = OpCompositeExtract %12 %49 2
%53 = OpCompositeExtract %12 %49 3
%54 = OpBitcast %38 %21
%55 = OpInBoundsAccessChain %40 %54 %20 %29
%56 = OpLoad %13 %55 Aligned 16
%57 = OpCompositeExtract %12 %56 0
%58 = OpCompositeExtract %12 %56 1
%59 = OpCompositeExtract %12 %56 2
%60 = OpCompositeExtract %12 %56 3
%61 = OpBitcast %38 %21
%62 = OpInBoundsAccessChain %40 %61 %20 %32
%63 = OpLoad %13 %62 Aligned 16
%64 = OpCompositeExtract %12 %63 0
%65 = OpCompositeExtract %12 %63 1
%66 = OpCompositeExtract %12 %63 2
%67 = OpCompositeExtract %12 %63 3
%69 = OpBitcast %38 %21
%70 = OpInBoundsAccessChain %40 %69 %20 %68
%71 = OpLoad %13 %70 Aligned 16
%72 = OpCompositeExtract %12 %71 0
%73 = OpCompositeExtract %12 %71 1
%74 = OpCompositeExtract %12 %71 2
%75 = OpCompositeExtract %12 %71 3
%77 = OpBitcast %38 %21
%78 = OpInBoundsAccessChain %40 %77 %20 %76
%79 = OpLoad %13 %78 Aligned 16
%80 = OpCompositeExtract %12 %79 0
%81 = OpCompositeExtract %12 %79 1
%82 = OpCompositeExtract %12 %79 2
%83 = OpCompositeExtract %12 %79 3
%84 = OpUMod %5 %34 %85
%86 = OpIMul %5 %84 %68
%91 = OpBitcast %90 %21
%93 = OpInBoundsAccessChain %92 %91 %20 %86
%94 = OpIMul %5 %84 %68
%95 = OpIAdd %5 %94 %26
%96 = OpBitcast %90 %21
%97 = OpInBoundsAccessChain %92 %96 %20 %95
%98 = OpIMul %5 %84 %68
%99 = OpIAdd %5 %98 %29
%100 = OpBitcast %90 %21
%101 = OpInBoundsAccessChain %92 %100 %20 %99
%102 = OpIMul %5 %84 %68
%103 = OpIAdd %5 %102 %32
%104 = OpBitcast %90 %21
%105 = OpInBoundsAccessChain %92 %104 %20 %103
%106 = OpLoad %12 %93 Aligned 4
%107 = OpLoad %12 %97 Aligned 4
%108 = OpLoad %12 %101 Aligned 4
%109 = OpLoad %12 %105 Aligned 4
%110 = OpFMul %12 %106 %24
%111 = OpFMul %12 %107 %27
%112 = OpFMul %12 %108 %30
%113 = OpFMul %12 %109 %33
%115 = OpAccessChain %114 %17 %20
OpStore %115 %110
%116 = OpAccessChain %114 %17 %26
OpStore %116 %111
%117 = OpAccessChain %114 %17 %29
OpStore %117 %112
%118 = OpAccessChain %114 %17 %32
OpStore %118 %113
OpReturn
OpFunctionEnd
#endif
