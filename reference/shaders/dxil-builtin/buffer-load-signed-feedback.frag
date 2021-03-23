#version 460
#extension GL_ARB_sparse_texture2 : require

struct SparseTexel
{
    uint _m0;
    ivec4 _m1;
};

struct _32
{
    uint _m0;
    uint _m1;
    uint _m2;
    uint _m3;
    uint _m4;
};

layout(set = 0, binding = 0) uniform isamplerBuffer _8;
layout(set = 0, binding = 0, r32i) uniform readonly iimageBuffer _11;

layout(location = 0) flat in uint TEXCOORD;
layout(location = 0) out ivec2 SV_Target;

void main()
{
    uint _68;
    ivec4 _69;
    _68 = sparseTexelFetchARB(_8, int(TEXCOORD), _69);
    SparseTexel _23 = SparseTexel(_68, _69);
    uvec4 _27 = uvec4(_23._m1);
    _32 _33 = _32(_27.x, _27.y, _27.z, _27.w, _23._m0);
    uint _41 = uint(sparseTexelsResidentARB(int(_33._m4)));
    uint _70;
    ivec4 _71;
    _70 = sparseImageLoadARB(_11, int(TEXCOORD), _71);
    SparseTexel _44 = SparseTexel(_70, _71);
    uvec4 _47 = uvec4(_44._m1);
    _32 _52 = _32(_47.x, _47.y, _47.z, _47.w, _44._m0);
    uint _59 = uint(sparseTexelsResidentARB(int(_52._m4)));
    SV_Target.x = int(((_41 + _33._m0) + _52._m0) + _59);
    SV_Target.y = int(((_41 + _33._m1) + _52._m1) + _59);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 68
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpCapability SampledBuffer
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14 %17
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "TEXCOORD"
OpName %17 "SV_Target"
OpName %22 "SparseTexel"
OpName %32 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %11 NonWritable
OpDecorate %14 Flat
OpDecorate %14 Location 0
OpDecorate %17 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 Buffer 0 0 0 2 R32i
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeInt 32 0
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%15 = OpTypeVector %5 2
%16 = OpTypePointer Output %15
%17 = OpVariable %16 Output
%21 = OpTypeVector %5 4
%22 = OpTypeStruct %12 %21
%26 = OpTypeVector %12 4
%32 = OpTypeStruct %12 %12 %12 %12 %12
%37 = OpTypeBool
%39 = OpConstant %12 0
%40 = OpConstant %12 1
%62 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %67
%67 = OpLabel
%18 = OpLoad %9 %11
%19 = OpLoad %6 %8
%20 = OpLoad %12 %14
%23 = OpImageSparseFetch %22 %19 %20
%24 = OpCompositeExtract %12 %23 0
%25 = OpCompositeExtract %21 %23 1
%27 = OpBitcast %26 %25
%28 = OpCompositeExtract %12 %27 0
%29 = OpCompositeExtract %12 %27 1
%30 = OpCompositeExtract %12 %27 2
%31 = OpCompositeExtract %12 %27 3
%33 = OpCompositeConstruct %32 %28 %29 %30 %31 %24
%34 = OpCompositeExtract %12 %33 0
%35 = OpCompositeExtract %12 %33 1
%36 = OpCompositeExtract %12 %33 4
%38 = OpImageSparseTexelsResident %37 %36
%41 = OpSelect %12 %38 %40 %39
%42 = OpIAdd %12 %41 %34
%43 = OpIAdd %12 %41 %35
%44 = OpImageSparseRead %22 %18 %20
%45 = OpCompositeExtract %12 %44 0
%46 = OpCompositeExtract %21 %44 1
%47 = OpBitcast %26 %46
%48 = OpCompositeExtract %12 %47 0
%49 = OpCompositeExtract %12 %47 1
%50 = OpCompositeExtract %12 %47 2
%51 = OpCompositeExtract %12 %47 3
%52 = OpCompositeConstruct %32 %48 %49 %50 %51 %45
%53 = OpCompositeExtract %12 %52 0
%54 = OpCompositeExtract %12 %52 1
%55 = OpCompositeExtract %12 %52 4
%56 = OpImageSparseTexelsResident %37 %55
%57 = OpIAdd %12 %42 %53
%58 = OpIAdd %12 %43 %54
%59 = OpSelect %12 %56 %40 %39
%60 = OpIAdd %12 %57 %59
%61 = OpIAdd %12 %58 %59
%63 = OpAccessChain %62 %17 %39
%64 = OpBitcast %5 %60
OpStore %63 %64
%65 = OpAccessChain %62 %17 %40
%66 = OpBitcast %5 %61
OpStore %65 %66
OpReturn
OpFunctionEnd
#endif
