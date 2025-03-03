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
    uint _92 = A % 6u;
    float _102;
    if (_92 < 6u)
    {
        _102 = _35[_92];
    }
    else
    {
        _102 = 0.0;
    }
    float _103;
    if (_92 < 6u)
    {
        _103 = _36[_92];
    }
    else
    {
        _103 = 0.0;
    }
    float _104;
    if (_92 < 6u)
    {
        _104 = _37[_92];
    }
    else
    {
        _104 = 0.0;
    }
    float _105;
    if (_92 < 6u)
    {
        _105 = _38[_92];
    }
    else
    {
        _105 = 0.0;
    }
    SV_Target.x = _102 * P.x;
    SV_Target.y = _103 * P.y;
    SV_Target.z = _104 * P.z;
    SV_Target.w = _105 * P.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 133
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
%81 = OpConstant %5 4
%94 = OpTypeBool
%110 = OpTypePointer Output %7
%119 = OpConstantNull %7
%123 = OpConstantNull %7
%127 = OpConstantNull %7
%131 = OpConstantNull %7
%3 = OpFunction %1 None %2
%4 = OpLabel
%35 = OpVariable %34 Function
%36 = OpVariable %34 Function
%37 = OpVariable %34 Function
%38 = OpVariable %34 Function
OpBranch %115
%115 = OpLabel
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
%61 = OpAccessChain %39 %12 %21 %27
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
%71 = OpAccessChain %39 %12 %21 %30
%72 = OpLoad %8 %71
%73 = OpCompositeExtract %7 %72 0
%74 = OpCompositeExtract %7 %72 1
%75 = OpCompositeExtract %7 %72 2
%76 = OpCompositeExtract %7 %72 3
%77 = OpAccessChain %46 %35 %30
%78 = OpAccessChain %46 %36 %30
%79 = OpAccessChain %46 %37 %30
%80 = OpAccessChain %46 %38 %30
OpStore %77 %73
OpStore %78 %74
OpStore %79 %75
OpStore %80 %76
%82 = OpAccessChain %39 %12 %21 %81
%83 = OpLoad %8 %82
%84 = OpCompositeExtract %7 %83 0
%85 = OpCompositeExtract %7 %83 1
%86 = OpCompositeExtract %7 %83 2
%87 = OpCompositeExtract %7 %83 3
%88 = OpAccessChain %46 %35 %81
%89 = OpAccessChain %46 %36 %81
%90 = OpAccessChain %46 %37 %81
%91 = OpAccessChain %46 %38 %81
OpStore %88 %84
OpStore %89 %85
OpStore %90 %86
OpStore %91 %87
%92 = OpUMod %5 %32 %6
%95 = OpULessThan %94 %92 %6
%93 = OpAccessChain %46 %35 %92
%97 = OpULessThan %94 %92 %6
%96 = OpAccessChain %46 %36 %92
%99 = OpULessThan %94 %92 %6
%98 = OpAccessChain %46 %37 %92
%101 = OpULessThan %94 %92 %6
%100 = OpAccessChain %46 %38 %92
OpSelectionMerge %117 None
OpBranchConditional %95 %116 %117
%116 = OpLabel
%118 = OpLoad %7 %93
OpBranch %117
%117 = OpLabel
%102 = OpPhi %7 %118 %116 %119 %115
OpSelectionMerge %121 None
OpBranchConditional %97 %120 %121
%120 = OpLabel
%122 = OpLoad %7 %96
OpBranch %121
%121 = OpLabel
%103 = OpPhi %7 %122 %120 %123 %117
OpSelectionMerge %125 None
OpBranchConditional %99 %124 %125
%124 = OpLabel
%126 = OpLoad %7 %98
OpBranch %125
%125 = OpLabel
%104 = OpPhi %7 %126 %124 %127 %121
OpSelectionMerge %129 None
OpBranchConditional %101 %128 %129
%128 = OpLabel
%130 = OpLoad %7 %100
OpBranch %129
%129 = OpLabel
%105 = OpPhi %7 %130 %128 %131 %125
%106 = OpFMul %7 %102 %22
%107 = OpFMul %7 %103 %25
%108 = OpFMul %7 %104 %28
%109 = OpFMul %7 %105 %31
%111 = OpAccessChain %110 %18 %21
OpStore %111 %106
%112 = OpAccessChain %110 %18 %24
OpStore %112 %107
%113 = OpAccessChain %110 %18 %27
OpStore %113 %108
%114 = OpAccessChain %110 %18 %30
OpStore %114 %109
OpReturn
OpFunctionEnd
#endif
