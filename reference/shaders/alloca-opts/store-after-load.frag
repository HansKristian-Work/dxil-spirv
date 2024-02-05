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
    uint _71 = A % 3u;
    float _76 = _35[_71];
    float _77 = _36[_71];
    float _78 = _37[_71];
    float _79 = _38[_71];
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
    uint _112 = A % 6u;
    SV_Target.x = (_35[_112] * P.x) + _76;
    SV_Target.y = (_36[_112] * P.y) + _77;
    SV_Target.z = (_37[_112] * P.z) + _78;
    SV_Target.w = (_38[_112] * P.w) + _79;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 136
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
%90 = OpConstant %5 4
%101 = OpConstant %5 5
%129 = OpTypePointer Output %7
%3 = OpFunction %1 None %2
%4 = OpLabel
%35 = OpVariable %34 Function
%36 = OpVariable %34 Function
%37 = OpVariable %34 Function
%38 = OpVariable %34 Function
OpBranch %134
%134 = OpLabel
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
%71 = OpUMod %5 %32 %30
%72 = OpAccessChain %46 %35 %71
%73 = OpAccessChain %46 %36 %71
%74 = OpAccessChain %46 %37 %71
%75 = OpAccessChain %46 %38 %71
%76 = OpLoad %7 %72
%77 = OpLoad %7 %73
%78 = OpLoad %7 %74
%79 = OpLoad %7 %75
%80 = OpAccessChain %39 %12 %21 %30
%81 = OpLoad %8 %80
%82 = OpCompositeExtract %7 %81 0
%83 = OpCompositeExtract %7 %81 1
%84 = OpCompositeExtract %7 %81 2
%85 = OpCompositeExtract %7 %81 3
%86 = OpAccessChain %46 %35 %30
%87 = OpAccessChain %46 %36 %30
%88 = OpAccessChain %46 %37 %30
%89 = OpAccessChain %46 %38 %30
OpStore %86 %82
OpStore %87 %83
OpStore %88 %84
OpStore %89 %85
%91 = OpAccessChain %39 %12 %21 %90
%92 = OpLoad %8 %91
%93 = OpCompositeExtract %7 %92 0
%94 = OpCompositeExtract %7 %92 1
%95 = OpCompositeExtract %7 %92 2
%96 = OpCompositeExtract %7 %92 3
%97 = OpAccessChain %46 %35 %90
%98 = OpAccessChain %46 %36 %90
%99 = OpAccessChain %46 %37 %90
%100 = OpAccessChain %46 %38 %90
OpStore %97 %93
OpStore %98 %94
OpStore %99 %95
OpStore %100 %96
%102 = OpAccessChain %39 %12 %21 %101
%103 = OpLoad %8 %102
%104 = OpCompositeExtract %7 %103 0
%105 = OpCompositeExtract %7 %103 1
%106 = OpCompositeExtract %7 %103 2
%107 = OpCompositeExtract %7 %103 3
%108 = OpAccessChain %46 %35 %101
%109 = OpAccessChain %46 %36 %101
%110 = OpAccessChain %46 %37 %101
%111 = OpAccessChain %46 %38 %101
OpStore %108 %104
OpStore %109 %105
OpStore %110 %106
OpStore %111 %107
%112 = OpUMod %5 %32 %6
%113 = OpAccessChain %46 %35 %112
%114 = OpAccessChain %46 %36 %112
%115 = OpAccessChain %46 %37 %112
%116 = OpAccessChain %46 %38 %112
%117 = OpLoad %7 %113
%118 = OpLoad %7 %114
%119 = OpLoad %7 %115
%120 = OpLoad %7 %116
%121 = OpFMul %7 %117 %22
%122 = OpFMul %7 %118 %25
%123 = OpFMul %7 %119 %28
%124 = OpFMul %7 %120 %31
%125 = OpFAdd %7 %121 %76
%126 = OpFAdd %7 %122 %77
%127 = OpFAdd %7 %123 %78
%128 = OpFAdd %7 %124 %79
%130 = OpAccessChain %129 %18 %21
OpStore %130 %125
%131 = OpAccessChain %129 %18 %24
OpStore %131 %126
%132 = OpAccessChain %129 %18 %27
OpStore %132 %127
%133 = OpAccessChain %129 %18 %30
OpStore %133 %128
OpReturn
OpFunctionEnd
#endif
