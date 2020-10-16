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
    _36[_53] += 40.0;
    HSValue[gl_InvocationID] = (((VSValue[0u] + float(gl_InvocationID)) + VSValue[1u]) + VSValue[2u]) + _36[3u];
}

void patch_main()
{
    float _66[4];
    _66[0u] = VSValue[0u];
    _66[1u] = VSValue[1u];
    _66[2u] = VSValue[2u];
    _66[3u] = VSValue[3u];
    uint _79 = uint(int(VSValue[0u]));
    _66[_79] += 40.0;
    gl_TessLevelInner[0u] = HSValue[0u];
    gl_TessLevelInner[1u] = HSValue[1u];
    gl_TessLevelOuter[0u] = VSValue[0u];
    gl_TessLevelOuter[1u] = VSValue[1u];
    gl_TessLevelOuter[2u] = VSValue[2u];
    gl_TessLevelOuter[3u] = HSValue[0u] + VSValue[0u];
    PATCH = _12._m0[0u].x + _66[3u];
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
; Bound: 113
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
%57 = OpConstant %7 40
%95 = OpTypePointer Uniform %8
%102 = OpTypeBool
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %105
%105 = OpLabel
%100 = OpFunctionCall %1 %28
%101 = OpLoad %5 %33
%103 = OpIEqual %102 %101 %39
OpControlBarrier %22 %17 %39
OpSelectionMerge %107 None
OpBranchConditional %103 %106 %107
%106 = OpLabel
%104 = OpFunctionCall %1 %30
OpBranch %107
%107 = OpLabel
OpReturn
OpFunctionEnd
%28 = OpFunction %1 None %2
%29 = OpLabel
%36 = OpVariable %35 Function
OpBranch %109
%109 = OpLabel
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
%54 = OpAccessChain %41 %36 %53
%55 = OpLoad %7 %54
%56 = OpFAdd %7 %55 %57
OpStore %54 %56
%58 = OpLoad %7 %52
%59 = OpConvertUToF %7 %34
%60 = OpFAdd %7 %40 %59
%61 = OpFAdd %7 %60 %44
%62 = OpFAdd %7 %61 %47
%63 = OpFAdd %7 %62 %58
%65 = OpLoad %5 %33
%64 = OpAccessChain %26 %20 %65
OpStore %64 %63
OpReturn
OpFunctionEnd
%30 = OpFunction %1 None %2
%31 = OpLabel
%66 = OpVariable %35 Function
OpBranch %111
%111 = OpLabel
%67 = OpAccessChain %37 %16 %39
%68 = OpLoad %7 %67
%69 = OpAccessChain %41 %66 %39
OpStore %69 %68
%70 = OpAccessChain %37 %16 %6
%71 = OpLoad %7 %70
%72 = OpAccessChain %41 %66 %6
OpStore %72 %71
%73 = OpAccessChain %37 %16 %22
%74 = OpLoad %7 %73
%75 = OpAccessChain %41 %66 %22
OpStore %75 %74
%76 = OpAccessChain %37 %16 %50
%77 = OpLoad %7 %76
%78 = OpAccessChain %41 %66 %50
OpStore %78 %77
%79 = OpConvertFToS %5 %68
%80 = OpAccessChain %41 %66 %79
%81 = OpLoad %7 %80
%82 = OpFAdd %7 %81 %57
OpStore %80 %82
%83 = OpAccessChain %26 %20 %39
%84 = OpLoad %7 %83
%85 = OpAccessChain %26 %25 %39
OpStore %85 %84
%86 = OpAccessChain %26 %20 %6
%87 = OpLoad %7 %86
%88 = OpAccessChain %26 %25 %6
OpStore %88 %87
%89 = OpAccessChain %26 %21 %39
OpStore %89 %68
%90 = OpAccessChain %26 %21 %6
OpStore %90 %71
%91 = OpAccessChain %26 %21 %22
OpStore %91 %74
%92 = OpFAdd %7 %84 %68
%93 = OpAccessChain %26 %21 %50
OpStore %93 %92
%94 = OpLoad %7 %78
%96 = OpAccessChain %95 %12 %39 %39
%97 = OpLoad %8 %96
%98 = OpCompositeExtract %7 %97 0
%99 = OpFAdd %7 %98 %94
OpStore %27 %99
OpReturn
OpFunctionEnd
#endif
