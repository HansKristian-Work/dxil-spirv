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
    _35[1u] = _12._m0[1u].x;
    _36[1u] = _12._m0[1u].y;
    _37[1u] = _12._m0[1u].z;
    _38[1u] = _12._m0[1u].w;
    _35[2u] = _12._m0[2u].x;
    _36[2u] = _12._m0[2u].y;
    _37[2u] = _12._m0[2u].z;
    _38[2u] = _12._m0[2u].w;
    _35[3u] = _12._m0[3u].x;
    _36[3u] = _12._m0[3u].y;
    _37[3u] = _12._m0[3u].z;
    _38[3u] = _12._m0[3u].w;
    _35[4u] = _12._m0[4u].x;
    _36[4u] = _12._m0[4u].y;
    _37[4u] = _12._m0[4u].z;
    _38[4u] = _12._m0[4u].w;
    _35[5u] = _12._m0[5u].x;
    _36[5u] = _12._m0[5u].y;
    _37[5u] = _12._m0[5u].z;
    _38[5u] = _12._m0[5u].w;
    uint _93 = A % 6u;
    float _103;
    if (_93 < 6u)
    {
        _103 = _35[_93];
    }
    else
    {
        _103 = 0.0;
    }
    float _104;
    if (_93 < 6u)
    {
        _104 = _36[_93];
    }
    else
    {
        _104 = 0.0;
    }
    float _105;
    if (_93 < 6u)
    {
        _105 = _37[_93];
    }
    else
    {
        _105 = 0.0;
    }
    float _106;
    if (_93 < 6u)
    {
        _106 = _38[_93];
    }
    else
    {
        _106 = 0.0;
    }
    SV_Target.x = _103 * P.x;
    SV_Target.y = _104 * P.y;
    SV_Target.z = _105 * P.z;
    SV_Target.w = _106 * P.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 134
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
%71 = OpConstant %5 4
%82 = OpConstant %5 5
%95 = OpTypeBool
%111 = OpTypePointer Output %7
%120 = OpConstantNull %7
%124 = OpConstantNull %7
%128 = OpConstantNull %7
%132 = OpConstantNull %7
%3 = OpFunction %1 None %2
%4 = OpLabel
%35 = OpVariable %34 Function
%36 = OpVariable %34 Function
%37 = OpVariable %34 Function
%38 = OpVariable %34 Function
OpBranch %116
%116 = OpLabel
%20 = OpAccessChain %19 %16 %21
%22 = OpLoad %7 %20
%23 = OpAccessChain %19 %16 %24
%25 = OpLoad %7 %23
%26 = OpAccessChain %19 %16 %27
%28 = OpLoad %7 %26
%29 = OpAccessChain %19 %16 %30
%31 = OpLoad %7 %29
%32 = OpLoad %5 %14
%40 = OpAccessChain %39 %12 %21 %24
%41 = OpLoad %8 %40
%42 = OpCompositeExtract %7 %41 0
%43 = OpCompositeExtract %7 %41 1
%44 = OpCompositeExtract %7 %41 2
%45 = OpCompositeExtract %7 %41 3
%47 = OpAccessChain %46 %35 %24
%48 = OpAccessChain %46 %36 %24
%49 = OpAccessChain %46 %37 %24
%50 = OpAccessChain %46 %38 %24
OpStore %47 %42
OpStore %48 %43
OpStore %49 %44
OpStore %50 %45
%51 = OpAccessChain %39 %12 %21 %27
%52 = OpLoad %8 %51
%53 = OpCompositeExtract %7 %52 0
%54 = OpCompositeExtract %7 %52 1
%55 = OpCompositeExtract %7 %52 2
%56 = OpCompositeExtract %7 %52 3
%57 = OpAccessChain %46 %35 %27
%58 = OpAccessChain %46 %36 %27
%59 = OpAccessChain %46 %37 %27
%60 = OpAccessChain %46 %38 %27
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
%67 = OpAccessChain %46 %35 %30
%68 = OpAccessChain %46 %36 %30
%69 = OpAccessChain %46 %37 %30
%70 = OpAccessChain %46 %38 %30
OpStore %67 %63
OpStore %68 %64
OpStore %69 %65
OpStore %70 %66
%72 = OpAccessChain %39 %12 %21 %71
%73 = OpLoad %8 %72
%74 = OpCompositeExtract %7 %73 0
%75 = OpCompositeExtract %7 %73 1
%76 = OpCompositeExtract %7 %73 2
%77 = OpCompositeExtract %7 %73 3
%78 = OpAccessChain %46 %35 %71
%79 = OpAccessChain %46 %36 %71
%80 = OpAccessChain %46 %37 %71
%81 = OpAccessChain %46 %38 %71
OpStore %78 %74
OpStore %79 %75
OpStore %80 %76
OpStore %81 %77
%83 = OpAccessChain %39 %12 %21 %82
%84 = OpLoad %8 %83
%85 = OpCompositeExtract %7 %84 0
%86 = OpCompositeExtract %7 %84 1
%87 = OpCompositeExtract %7 %84 2
%88 = OpCompositeExtract %7 %84 3
%89 = OpAccessChain %46 %35 %82
%90 = OpAccessChain %46 %36 %82
%91 = OpAccessChain %46 %37 %82
%92 = OpAccessChain %46 %38 %82
OpStore %89 %85
OpStore %90 %86
OpStore %91 %87
OpStore %92 %88
%93 = OpUMod %5 %32 %6
%96 = OpULessThan %95 %93 %6
%94 = OpAccessChain %46 %35 %93
%98 = OpULessThan %95 %93 %6
%97 = OpAccessChain %46 %36 %93
%100 = OpULessThan %95 %93 %6
%99 = OpAccessChain %46 %37 %93
%102 = OpULessThan %95 %93 %6
%101 = OpAccessChain %46 %38 %93
OpSelectionMerge %118 None
OpBranchConditional %96 %117 %118
%117 = OpLabel
%119 = OpLoad %7 %94
OpBranch %118
%118 = OpLabel
%103 = OpPhi %7 %119 %117 %120 %116
OpSelectionMerge %122 None
OpBranchConditional %98 %121 %122
%121 = OpLabel
%123 = OpLoad %7 %97
OpBranch %122
%122 = OpLabel
%104 = OpPhi %7 %123 %121 %124 %118
OpSelectionMerge %126 None
OpBranchConditional %100 %125 %126
%125 = OpLabel
%127 = OpLoad %7 %99
OpBranch %126
%126 = OpLabel
%105 = OpPhi %7 %127 %125 %128 %122
OpSelectionMerge %130 None
OpBranchConditional %102 %129 %130
%129 = OpLabel
%131 = OpLoad %7 %101
OpBranch %130
%130 = OpLabel
%106 = OpPhi %7 %131 %129 %132 %126
%107 = OpFMul %7 %103 %22
%108 = OpFMul %7 %104 %25
%109 = OpFMul %7 %105 %28
%110 = OpFMul %7 %106 %31
%112 = OpAccessChain %111 %18 %21
OpStore %112 %107
%113 = OpAccessChain %111 %18 %24
OpStore %113 %108
%114 = OpAccessChain %111 %18 %27
OpStore %114 %109
%115 = OpAccessChain %111 %18 %30
OpStore %115 %110
OpReturn
OpFunctionEnd
#endif
