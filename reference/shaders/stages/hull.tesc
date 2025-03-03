#version 460
layout(vertices = 4) out;

layout(set = 0, binding = 0, std140) uniform _10_12
{
    vec4 _m0[1];
} _12;

layout(location = 0) in float VSValue[];
layout(location = 0) out float HSValue[4];
layout(location = 1) patch out float PATCH;

void hull_main()
{
    float _36[4];
    _36[0u] = VSValue[0u];
    _36[1u] = VSValue[1u];
    _36[2u] = VSValue[2u];
    _36[3u] = VSValue[3u];
    uint _53 = uint(int(VSValue[0u]));
    bool _56 = _53 < 4u;
    float _57;
    if (_56)
    {
        _57 = _36[_53];
    }
    else
    {
        _57 = 0.0;
    }
    if (_56)
    {
        _36[_53] = _57 + 40.0;
    }
    HSValue[gl_InvocationID] = (((VSValue[0u] + float(gl_InvocationID)) + VSValue[1u]) + VSValue[2u]) + _36[3u];
}

void patch_main()
{
    float _68[4];
    _68[0u] = VSValue[0u];
    _68[1u] = VSValue[1u];
    _68[2u] = VSValue[2u];
    _68[3u] = VSValue[3u];
    uint _81 = uint(int(VSValue[0u]));
    bool _83 = _81 < 4u;
    float _84;
    if (_83)
    {
        _84 = _68[_81];
    }
    else
    {
        _84 = 0.0;
    }
    if (_83)
    {
        _68[_81] = _84 + 40.0;
    }
    gl_TessLevelOuter[0u] = VSValue[0u];
    gl_TessLevelOuter[1u] = VSValue[1u];
    gl_TessLevelOuter[2u] = VSValue[2u];
    gl_TessLevelOuter[3u] = HSValue[0u] + VSValue[0u];
    gl_TessLevelInner[0u] = HSValue[0u];
    gl_TessLevelInner[1u] = HSValue[1u];
    PATCH = _12._m0[0u].x + _68[3u];
}

void main()
{
    hull_main();
    barrier();
    if (gl_InvocationID == 0u)
    {
        patch_main();
    }
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 127
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationControl %3 "main" %16 %20 %21 %25 %27 %33
OpExecutionMode %3 Quads
OpExecutionMode %3 SpacingEqual
OpExecutionMode %3 VertexOrderCw
OpExecutionMode %3 OutputVertices 4
OpName %3 "main"
OpName %10 ""
OpName %16 "VSValue"
OpName %20 "HSValue"
OpName %21 "SV_TessFactor"
OpName %25 "SV_InsideTessFactor"
OpName %27 "PATCH"
OpName %28 "hull_main"
OpName %30 "patch_main"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %16 Location 0
OpDecorate %20 Location 0
OpDecorate %21 BuiltIn TessLevelOuter
OpDecorate %21 Patch
OpDecorate %25 BuiltIn TessLevelInner
OpDecorate %25 Patch
OpDecorate %27 Location 1
OpDecorate %27 Patch
OpDecorate %33 BuiltIn InvocationId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 1
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpConstant %5 5
%14 = OpTypeArray %7 %13
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpConstant %5 4
%18 = OpTypeArray %7 %17
%19 = OpTypePointer Output %18
%20 = OpVariable %19 Output
%21 = OpVariable %19 Output
%22 = OpConstant %5 2
%23 = OpTypeArray %7 %22
%24 = OpTypePointer Output %23
%25 = OpVariable %24 Output
%26 = OpTypePointer Output %7
%27 = OpVariable %26 Output
%32 = OpTypePointer Input %5
%33 = OpVariable %32 Input
%35 = OpTypePointer Function %18
%37 = OpTypePointer Input %7
%39 = OpConstant %5 0
%41 = OpTypePointer Function %7
%50 = OpConstant %5 3
%55 = OpTypeBool
%59 = OpConstant %7 40
%92 = OpTypePointer Uniform %8
%115 = OpConstantNull %7
%123 = OpConstantNull %7
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %107
%107 = OpLabel
%103 = OpFunctionCall %1 %28
%104 = OpLoad %5 %33
%105 = OpIEqual %55 %104 %39
OpControlBarrier %22 %17 %39
OpSelectionMerge %109 None
OpBranchConditional %105 %108 %109
%108 = OpLabel
%106 = OpFunctionCall %1 %30
OpBranch %109
%109 = OpLabel
OpReturn
OpFunctionEnd
%28 = OpFunction %1 None %2
%29 = OpLabel
%36 = OpVariable %35 Function
OpBranch %111
%111 = OpLabel
%34 = OpLoad %5 %33
%38 = OpAccessChain %37 %16 %39
%40 = OpLoad %7 %38
%42 = OpAccessChain %41 %36 %39
OpStore %42 %40
%43 = OpAccessChain %37 %16 %6
%44 = OpLoad %7 %43
%45 = OpAccessChain %41 %36 %6
OpStore %45 %44
%46 = OpAccessChain %37 %16 %22
%47 = OpLoad %7 %46
%48 = OpAccessChain %41 %36 %22
OpStore %48 %47
%49 = OpAccessChain %37 %16 %50
%51 = OpLoad %7 %49
%52 = OpAccessChain %41 %36 %50
OpStore %52 %51
%53 = OpConvertFToS %5 %40
%56 = OpULessThan %55 %53 %17
%54 = OpAccessChain %41 %36 %53
OpSelectionMerge %113 None
OpBranchConditional %56 %112 %113
%112 = OpLabel
%114 = OpLoad %7 %54
OpBranch %113
%113 = OpLabel
%57 = OpPhi %7 %114 %112 %115 %111
%58 = OpFAdd %7 %57 %59
OpSelectionMerge %117 None
OpBranchConditional %56 %116 %117
%116 = OpLabel
OpStore %54 %58
OpBranch %117
%117 = OpLabel
%60 = OpLoad %7 %52
%61 = OpConvertUToF %7 %34
%62 = OpFAdd %7 %40 %61
%63 = OpFAdd %7 %62 %44
%64 = OpFAdd %7 %63 %47
%65 = OpFAdd %7 %64 %60
%67 = OpLoad %5 %33
%66 = OpAccessChain %26 %20 %67
OpStore %66 %65
OpReturn
OpFunctionEnd
%30 = OpFunction %1 None %2
%31 = OpLabel
%68 = OpVariable %35 Function
OpBranch %119
%119 = OpLabel
%69 = OpAccessChain %37 %16 %39
%70 = OpLoad %7 %69
%71 = OpAccessChain %41 %68 %39
OpStore %71 %70
%72 = OpAccessChain %37 %16 %6
%73 = OpLoad %7 %72
%74 = OpAccessChain %41 %68 %6
OpStore %74 %73
%75 = OpAccessChain %37 %16 %22
%76 = OpLoad %7 %75
%77 = OpAccessChain %41 %68 %22
OpStore %77 %76
%78 = OpAccessChain %37 %16 %50
%79 = OpLoad %7 %78
%80 = OpAccessChain %41 %68 %50
OpStore %80 %79
%81 = OpConvertFToS %5 %70
%83 = OpULessThan %55 %81 %17
%82 = OpAccessChain %41 %68 %81
OpSelectionMerge %121 None
OpBranchConditional %83 %120 %121
%120 = OpLabel
%122 = OpLoad %7 %82
OpBranch %121
%121 = OpLabel
%84 = OpPhi %7 %122 %120 %123 %119
%85 = OpFAdd %7 %84 %59
OpSelectionMerge %125 None
OpBranchConditional %83 %124 %125
%124 = OpLabel
OpStore %82 %85
OpBranch %125
%125 = OpLabel
%86 = OpAccessChain %26 %20 %39
%87 = OpLoad %7 %86
%88 = OpAccessChain %26 %20 %6
%89 = OpLoad %7 %88
%90 = OpFAdd %7 %87 %70
%91 = OpLoad %7 %80
%93 = OpAccessChain %92 %12 %39 %39
%94 = OpLoad %8 %93
%95 = OpCompositeExtract %7 %94 0
%96 = OpFAdd %7 %95 %91
%97 = OpAccessChain %26 %21 %39
OpStore %97 %70
%98 = OpAccessChain %26 %21 %6
OpStore %98 %73
%99 = OpAccessChain %26 %21 %22
OpStore %99 %76
%100 = OpAccessChain %26 %21 %50
OpStore %100 %90
%101 = OpAccessChain %26 %25 %39
OpStore %101 %87
%102 = OpAccessChain %26 %25 %6
OpStore %102 %89
OpStore %27 %96
OpReturn
OpFunctionEnd
#endif
