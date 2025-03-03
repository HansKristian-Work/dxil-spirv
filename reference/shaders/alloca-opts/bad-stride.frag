#version 460

layout(set = 0, binding = 0, std140) uniform _10_12
{
    vec4 _m0[6];
} _12;

layout(location = 0) flat in uint A;
layout(location = 1) in vec4 P;
layout(location = 0) out vec4 SV_Target;

void main()
{
    float _35[6];
    float _36[6];
    float _37[6];
    float _38[6];
    _35[0u] = _12._m0[0u].x;
    _36[0u] = _12._m0[0u].y;
    _37[0u] = _12._m0[0u].z;
    _38[0u] = _12._m0[0u].w;
    _35[1u] = _12._m0[1u].x;
    _36[1u] = _12._m0[1u].y;
    _37[1u] = _12._m0[1u].z;
    _38[1u] = _12._m0[1u].w;
    _35[2u] = _12._m0[3u].x;
    _36[2u] = _12._m0[3u].y;
    _37[2u] = _12._m0[3u].z;
    _38[2u] = _12._m0[3u].w;
    uint _71 = A % 6u;
    float _81;
    if (_71 < 6u)
    {
        _81 = _35[_71];
    }
    else
    {
        _81 = 0.0;
    }
    float _82;
    if (_71 < 6u)
    {
        _82 = _36[_71];
    }
    else
    {
        _82 = 0.0;
    }
    float _83;
    if (_71 < 6u)
    {
        _83 = _37[_71];
    }
    else
    {
        _83 = 0.0;
    }
    float _84;
    if (_71 < 6u)
    {
        _84 = _38[_71];
    }
    else
    {
        _84 = 0.0;
    }
    SV_Target.x = _81 * P.x;
    SV_Target.y = _82 * P.y;
    SV_Target.z = _83 * P.z;
    SV_Target.w = _84 * P.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 112
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14 %16 %18
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %14 "A"
OpName %16 "P"
OpName %18 "SV_Target"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %14 Flat
OpDecorate %14 Location 0
OpDecorate %16 Location 1
OpDecorate %18 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 6
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypePointer Input %5
%14 = OpVariable %13 Input
%15 = OpTypePointer Input %8
%16 = OpVariable %15 Input
%17 = OpTypePointer Output %8
%18 = OpVariable %17 Output
%19 = OpTypePointer Input %7
%21 = OpConstant %5 0
%24 = OpConstant %5 1
%27 = OpConstant %5 2
%30 = OpConstant %5 3
%33 = OpTypeArray %7 %6
%34 = OpTypePointer Function %33
%39 = OpTypePointer Uniform %8
%46 = OpTypePointer Function %7
%73 = OpTypeBool
%89 = OpTypePointer Output %7
%98 = OpConstantNull %7
%102 = OpConstantNull %7
%106 = OpConstantNull %7
%110 = OpConstantNull %7
%3 = OpFunction %1 None %2
%4 = OpLabel
%35 = OpVariable %34 Function
%36 = OpVariable %34 Function
%37 = OpVariable %34 Function
%38 = OpVariable %34 Function
OpBranch %94
%94 = OpLabel
%20 = OpAccessChain %19 %16 %21
%22 = OpLoad %7 %20
%23 = OpAccessChain %19 %16 %24
%25 = OpLoad %7 %23
%26 = OpAccessChain %19 %16 %27
%28 = OpLoad %7 %26
%29 = OpAccessChain %19 %16 %30
%31 = OpLoad %7 %29
%32 = OpLoad %5 %14
%40 = OpAccessChain %39 %12 %21 %21
%41 = OpLoad %8 %40
%42 = OpCompositeExtract %7 %41 0
%43 = OpCompositeExtract %7 %41 1
%44 = OpCompositeExtract %7 %41 2
%45 = OpCompositeExtract %7 %41 3
%47 = OpAccessChain %46 %35 %21
%48 = OpAccessChain %46 %36 %21
%49 = OpAccessChain %46 %37 %21
%50 = OpAccessChain %46 %38 %21
OpStore %47 %42
OpStore %48 %43
OpStore %49 %44
OpStore %50 %45
%51 = OpAccessChain %39 %12 %21 %24
%52 = OpLoad %8 %51
%53 = OpCompositeExtract %7 %52 0
%54 = OpCompositeExtract %7 %52 1
%55 = OpCompositeExtract %7 %52 2
%56 = OpCompositeExtract %7 %52 3
%57 = OpAccessChain %46 %35 %24
%58 = OpAccessChain %46 %36 %24
%59 = OpAccessChain %46 %37 %24
%60 = OpAccessChain %46 %38 %24
OpStore %57 %53
OpStore %58 %54
OpStore %59 %55
OpStore %60 %56
%61 = OpAccessChain %39 %12 %21 %30
%62 = OpLoad %8 %61
%63 = OpCompositeExtract %7 %62 0
%64 = OpCompositeExtract %7 %62 1
%65 = OpCompositeExtract %7 %62 2
%66 = OpCompositeExtract %7 %62 3
%67 = OpAccessChain %46 %35 %27
%68 = OpAccessChain %46 %36 %27
%69 = OpAccessChain %46 %37 %27
%70 = OpAccessChain %46 %38 %27
OpStore %67 %63
OpStore %68 %64
OpStore %69 %65
OpStore %70 %66
%71 = OpUMod %5 %32 %6
%74 = OpULessThan %73 %71 %6
%72 = OpAccessChain %46 %35 %71
%76 = OpULessThan %73 %71 %6
%75 = OpAccessChain %46 %36 %71
%78 = OpULessThan %73 %71 %6
%77 = OpAccessChain %46 %37 %71
%80 = OpULessThan %73 %71 %6
%79 = OpAccessChain %46 %38 %71
OpSelectionMerge %96 None
OpBranchConditional %74 %95 %96
%95 = OpLabel
%97 = OpLoad %7 %72
OpBranch %96
%96 = OpLabel
%81 = OpPhi %7 %97 %95 %98 %94
OpSelectionMerge %100 None
OpBranchConditional %76 %99 %100
%99 = OpLabel
%101 = OpLoad %7 %75
OpBranch %100
%100 = OpLabel
%82 = OpPhi %7 %101 %99 %102 %96
OpSelectionMerge %104 None
OpBranchConditional %78 %103 %104
%103 = OpLabel
%105 = OpLoad %7 %77
OpBranch %104
%104 = OpLabel
%83 = OpPhi %7 %105 %103 %106 %100
OpSelectionMerge %108 None
OpBranchConditional %80 %107 %108
%107 = OpLabel
%109 = OpLoad %7 %79
OpBranch %108
%108 = OpLabel
%84 = OpPhi %7 %109 %107 %110 %104
%85 = OpFMul %7 %81 %22
%86 = OpFMul %7 %82 %25
%87 = OpFMul %7 %83 %28
%88 = OpFMul %7 %84 %31
%90 = OpAccessChain %89 %18 %21
OpStore %90 %85
%91 = OpAccessChain %89 %18 %24
OpStore %91 %86
%92 = OpAccessChain %89 %18 %27
OpStore %92 %87
%93 = OpAccessChain %89 %18 %30
OpStore %93 %88
OpReturn
OpFunctionEnd
#endif
