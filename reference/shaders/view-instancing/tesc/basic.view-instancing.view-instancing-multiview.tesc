#version 460
#extension GL_EXT_multiview : require
layout(vertices = 4) out;

layout(constant_id = 1000) const uint ViewIndexToViewInstanceMap = 0u;

layout(location = 0) in float VSValue[];
layout(location = 0) out float HSValue[4];
layout(location = 1) out uint SV_RenderTargetArrayIndex[4];
layout(location = 1, component = 1) out uint SV_ViewportArrayIndex[4];

void hull_main()
{
    uint _33 = bitfieldExtract(ViewIndexToViewInstanceMap, int(gl_ViewIndex * 2u), int(2u));
    HSValue[gl_InvocationID] = float(gl_InvocationID + _33);
    SV_RenderTargetArrayIndex[gl_InvocationID] = _33;
    SV_ViewportArrayIndex[gl_InvocationID] = _33;
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
// MultiviewCompatible
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 69
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpCapability MultiView
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationControl %3 "main" %10 %14 %17 %18 %19 %23 %30 %34
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
OpName %28 "ViewIndexToViewInstanceMap"
OpDecorate %10 Location 0
OpDecorate %14 Location 0
OpDecorate %17 Location 1
OpDecorate %18 Location 1
OpDecorate %18 Component 1
OpDecorate %19 BuiltIn TessLevelOuter
OpDecorate %19 Patch
OpDecorate %23 BuiltIn TessLevelInner
OpDecorate %23 Patch
OpDecorate %28 SpecId 1000
OpDecorate %30 BuiltIn ViewIndex
OpDecorate %34 BuiltIn InvocationId
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
%28 = OpSpecConstant %6 0
%29 = OpTypePointer Input %6
%30 = OpVariable %29 Input
%34 = OpVariable %29 Input
%38 = OpTypePointer Output %5
%41 = OpTypePointer Output %6
%47 = OpConstant %6 0
%48 = OpConstant %5 1
%50 = OpConstant %6 1
%53 = OpConstant %6 3
%58 = OpTypeBool
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %61
%61 = OpLabel
%56 = OpFunctionCall %1 %24
%57 = OpLoad %6 %34
%59 = OpIEqual %58 %57 %47
OpControlBarrier %20 %11 %47
OpSelectionMerge %63 None
OpBranchConditional %59 %62 %63
%62 = OpLabel
%60 = OpFunctionCall %1 %26
OpBranch %63
%63 = OpLabel
OpReturn
OpFunctionEnd
%24 = OpFunction %1 None %2
%25 = OpLabel
OpBranch %65
%65 = OpLabel
%31 = OpLoad %6 %30
%32 = OpIMul %6 %31 %20
%33 = OpBitFieldUExtract %6 %28 %32 %20
%35 = OpLoad %6 %34
%36 = OpIAdd %6 %35 %33
%37 = OpConvertUToF %5 %36
%40 = OpLoad %6 %34
%39 = OpAccessChain %38 %14 %40
OpStore %39 %37
%43 = OpLoad %6 %34
%42 = OpAccessChain %41 %17 %43
OpStore %42 %33
%45 = OpLoad %6 %34
%44 = OpAccessChain %41 %18 %45
OpStore %44 %33
OpReturn
OpFunctionEnd
%26 = OpFunction %1 None %2
%27 = OpLabel
OpBranch %67
%67 = OpLabel
%46 = OpAccessChain %38 %19 %47
OpStore %46 %48
%49 = OpAccessChain %38 %19 %50
OpStore %49 %48
%51 = OpAccessChain %38 %19 %20
OpStore %51 %48
%52 = OpAccessChain %38 %19 %53
OpStore %52 %48
%54 = OpAccessChain %38 %23 %47
OpStore %54 %48
%55 = OpAccessChain %38 %23 %50
OpStore %55 %48
OpReturn
OpFunctionEnd
#endif
