#version 460
layout(vertices = 4) out;

layout(set = 10, binding = 22, std140) uniform ViewInstancingOffsetsUBO
{
    uint ViewID_Layer;
} ViewInstancingOffsets;

layout(location = 0) in float VSValue[];
layout(location = 0) out float HSValue[4];
layout(location = 1) out uint SV_RenderTargetArrayIndex[4];
layout(location = 1, component = 1) out uint SV_ViewportArrayIndex[4];

void hull_main()
{
    uint _35 = bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u));
    HSValue[gl_InvocationID] = float(gl_InvocationID + _35);
    SV_RenderTargetArrayIndex[gl_InvocationID] = _35;
    SV_ViewportArrayIndex[gl_InvocationID] = _35;
}

void patch_main()
{
    gl_TessLevelOuter[0u] = 1.0;
    gl_TessLevelOuter[1u] = 1.0;
    gl_TessLevelOuter[2u] = 1.0;
    gl_TessLevelOuter[3u] = 1.0;
    gl_TessLevelInner[0u] = 1.0;
    gl_TessLevelInner[1u] = 1.0;
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
; Bound: 72
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationControl %3 "main" %10 %14 %17 %18 %19 %23 %38
OpExecutionMode %3 Quads
OpExecutionMode %3 SpacingEqual
OpExecutionMode %3 VertexOrderCw
OpExecutionMode %3 OutputVertices 4
OpName %3 "main"
OpName %10 "VSValue"
OpName %14 "HSValue"
OpName %17 "SV_RenderTargetArrayIndex"
OpName %18 "SV_ViewportArrayIndex"
OpName %19 "SV_TessFactor"
OpName %23 "SV_InsideTessFactor"
OpName %24 "hull_main"
OpName %26 "patch_main"
OpName %28 "ViewInstancingOffsetsUBO"
OpMemberName %28 0 "ViewID_Layer"
OpName %30 "ViewInstancingOffsets"
OpDecorate %10 Location 0
OpDecorate %14 Location 0
OpDecorate %17 Location 1
OpDecorate %18 Location 1
OpDecorate %18 Component 1
OpDecorate %19 BuiltIn TessLevelOuter
OpDecorate %19 Patch
OpDecorate %23 BuiltIn TessLevelInner
OpDecorate %23 Patch
OpDecorate %28 Block
OpMemberDecorate %28 0 Offset 0
OpDecorate %30 DescriptorSet 10
OpDecorate %30 Binding 22
OpDecorate %38 BuiltIn InvocationId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeInt 32 0
%7 = OpConstant %6 32
%8 = OpTypeArray %5 %7
%9 = OpTypePointer Input %8
%10 = OpVariable %9 Input
%11 = OpConstant %6 4
%12 = OpTypeArray %5 %11
%13 = OpTypePointer Output %12
%14 = OpVariable %13 Output
%15 = OpTypeArray %6 %11
%16 = OpTypePointer Output %15
%17 = OpVariable %16 Output
%18 = OpVariable %16 Output
%19 = OpVariable %13 Output
%20 = OpConstant %6 2
%21 = OpTypeArray %5 %20
%22 = OpTypePointer Output %21
%23 = OpVariable %22 Output
%28 = OpTypeStruct %6
%29 = OpTypePointer Uniform %28
%30 = OpVariable %29 Uniform
%31 = OpTypePointer Uniform %6
%33 = OpConstant %6 0
%36 = OpConstant %6 16
%37 = OpTypePointer Input %6
%38 = OpVariable %37 Input
%42 = OpTypePointer Output %5
%45 = OpTypePointer Output %6
%51 = OpConstant %5 1
%53 = OpConstant %6 1
%56 = OpConstant %6 3
%61 = OpTypeBool
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %64
%64 = OpLabel
%59 = OpFunctionCall %1 %24
%60 = OpLoad %6 %38
%62 = OpIEqual %61 %60 %33
OpControlBarrier %20 %11 %33
OpSelectionMerge %66 None
OpBranchConditional %62 %65 %66
%65 = OpLabel
%63 = OpFunctionCall %1 %26
OpBranch %66
%66 = OpLabel
OpReturn
OpFunctionEnd
%24 = OpFunction %1 None %2
%25 = OpLabel
OpBranch %68
%68 = OpLabel
%32 = OpAccessChain %31 %30 %33
%34 = OpLoad %6 %32
%35 = OpBitFieldUExtract %6 %34 %33 %36
%39 = OpLoad %6 %38
%40 = OpIAdd %6 %39 %35
%41 = OpConvertUToF %5 %40
%44 = OpLoad %6 %38
%43 = OpAccessChain %42 %14 %44
OpStore %43 %41
%47 = OpLoad %6 %38
%46 = OpAccessChain %45 %17 %47
OpStore %46 %35
%49 = OpLoad %6 %38
%48 = OpAccessChain %45 %18 %49
OpStore %48 %35
OpReturn
OpFunctionEnd
%26 = OpFunction %1 None %2
%27 = OpLabel
OpBranch %70
%70 = OpLabel
%50 = OpAccessChain %42 %19 %33
OpStore %50 %51
%52 = OpAccessChain %42 %19 %53
OpStore %52 %51
%54 = OpAccessChain %42 %19 %20
OpStore %54 %51
%55 = OpAccessChain %42 %19 %56
OpStore %55 %51
%57 = OpAccessChain %42 %23 %33
OpStore %57 %51
%58 = OpAccessChain %42 %23 %53
OpStore %58 %51
OpReturn
OpFunctionEnd
#endif
