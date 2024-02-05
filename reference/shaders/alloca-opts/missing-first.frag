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
    SV_Target.x = _35[_93] * P.x;
    SV_Target.y = _36[_93] * P.y;
    SV_Target.z = _37[_93] * P.z;
    SV_Target.w = _38[_93] * P.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 113
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
%106 = OpTypePointer Output %7
%3 = OpFunction %1 None %2
%4 = OpLabel
%35 = OpVariable %34 Function
%36 = OpVariable %34 Function
%37 = OpVariable %34 Function
%38 = OpVariable %34 Function
OpBranch %111
%111 = OpLabel
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
%94 = OpAccessChain %46 %35 %93
%95 = OpAccessChain %46 %36 %93
%96 = OpAccessChain %46 %37 %93
%97 = OpAccessChain %46 %38 %93
%98 = OpLoad %7 %94
%99 = OpLoad %7 %95
%100 = OpLoad %7 %96
%101 = OpLoad %7 %97
%102 = OpFMul %7 %98 %22
%103 = OpFMul %7 %99 %25
%104 = OpFMul %7 %100 %28
%105 = OpFMul %7 %101 %31
%107 = OpAccessChain %106 %18 %21
OpStore %107 %102
%108 = OpAccessChain %106 %18 %24
OpStore %108 %103
%109 = OpAccessChain %106 %18 %27
OpStore %109 %104
%110 = OpAccessChain %106 %18 %30
OpStore %110 %105
OpReturn
OpFunctionEnd
#endif
