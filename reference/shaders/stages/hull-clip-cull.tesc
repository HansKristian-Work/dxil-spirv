#version 460
layout(vertices = 4) out;

layout(location = 0) out vec2 HSValue[4];
layout(location = 1) out vec2 SV_ClipDistance[4];
layout(location = 1, component = 2) out float SV_CullDistance[4][2];

void hull_main()
{
    HSValue[gl_InvocationID].x = (gl_in[gl_InvocationID].gl_CullDistance[0u] + gl_in[gl_InvocationID].gl_ClipDistance[0u]) + gl_in[gl_InvocationID].gl_CullDistance[1u];
    HSValue[gl_InvocationID].y = (gl_in[gl_InvocationID].gl_CullDistance[0u] + gl_in[gl_InvocationID].gl_ClipDistance[1u]) + gl_in[gl_InvocationID].gl_CullDistance[1u];
    SV_ClipDistance[gl_InvocationID].x = 1.0;
    SV_ClipDistance[gl_InvocationID].y = 2.0;
    SV_CullDistance[gl_InvocationID][0u] = 3.0;
    SV_CullDistance[gl_InvocationID][1u] = 4.0;
}

void patch_main()
{
    gl_TessLevelOuter[0u] = 0.0;
    gl_TessLevelOuter[1u] = 0.0;
    gl_TessLevelOuter[2u] = 0.0;
    gl_TessLevelOuter[3u] = 0.0;
    gl_TessLevelInner[0u] = 0.0;
    gl_TessLevelInner[1u] = 0.0;
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
; Bound: 88
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpCapability ClipDistance
OpCapability CullDistance
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationControl %3 "main" %13 %14 %18 %19 %22 %25 %27 %33
OpExecutionMode %3 Quads
OpExecutionMode %3 SpacingEqual
OpExecutionMode %3 VertexOrderCw
OpExecutionMode %3 OutputVertices 4
OpName %3 "main"
OpName %18 "HSValue"
OpName %19 "SV_ClipDistance"
OpName %22 "SV_CullDistance"
OpName %25 "SV_TessFactor"
OpName %27 "SV_InsideTessFactor"
OpName %28 "hull_main"
OpName %30 "patch_main"
OpDecorate %13 BuiltIn ClipDistance
OpDecorate %14 BuiltIn CullDistance
OpDecorate %18 Location 0
OpDecorate %19 Location 1
OpDecorate %22 Location 1
OpDecorate %22 Component 2
OpDecorate %25 BuiltIn TessLevelOuter
OpDecorate %25 Patch
OpDecorate %27 BuiltIn TessLevelInner
OpDecorate %27 Patch
OpDecorate %33 BuiltIn InvocationId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypeInt 32 0
%8 = OpConstant %7 2
%9 = OpTypeArray %5 %8
%10 = OpConstant %7 32
%11 = OpTypeArray %9 %10
%12 = OpTypePointer Input %11
%13 = OpVariable %12 Input
%14 = OpVariable %12 Input
%15 = OpConstant %7 4
%16 = OpTypeArray %6 %15
%17 = OpTypePointer Output %16
%18 = OpVariable %17 Output
%19 = OpVariable %17 Output
%20 = OpTypeArray %9 %15
%21 = OpTypePointer Output %20
%22 = OpVariable %21 Output
%23 = OpTypeArray %5 %15
%24 = OpTypePointer Output %23
%25 = OpVariable %24 Output
%26 = OpTypePointer Output %9
%27 = OpVariable %26 Output
%32 = OpTypePointer Input %7
%33 = OpVariable %32 Input
%35 = OpTypePointer Input %5
%37 = OpConstant %7 0
%40 = OpConstant %7 1
%50 = OpTypePointer Output %5
%57 = OpConstant %5 1
%60 = OpConstant %5 2
%63 = OpConstant %5 3
%66 = OpConstant %5 4
%68 = OpConstant %5 0
%72 = OpConstant %7 3
%77 = OpTypeBool
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %80
%80 = OpLabel
%75 = OpFunctionCall %1 %28
%76 = OpLoad %7 %33
%78 = OpIEqual %77 %76 %37
OpControlBarrier %8 %15 %37
OpSelectionMerge %82 None
OpBranchConditional %78 %81 %82
%81 = OpLabel
%79 = OpFunctionCall %1 %30
OpBranch %82
%82 = OpLabel
OpReturn
OpFunctionEnd
%28 = OpFunction %1 None %2
%29 = OpLabel
OpBranch %84
%84 = OpLabel
%34 = OpLoad %7 %33
%36 = OpAccessChain %35 %13 %34 %37
%38 = OpLoad %5 %36
%39 = OpAccessChain %35 %13 %34 %40
%41 = OpLoad %5 %39
%42 = OpAccessChain %35 %14 %34 %37
%43 = OpLoad %5 %42
%44 = OpFAdd %5 %43 %38
%45 = OpFAdd %5 %43 %41
%46 = OpAccessChain %35 %14 %34 %40
%47 = OpLoad %5 %46
%48 = OpFAdd %5 %44 %47
%49 = OpFAdd %5 %45 %47
%52 = OpLoad %7 %33
%51 = OpAccessChain %50 %18 %52 %37
OpStore %51 %48
%54 = OpLoad %7 %33
%53 = OpAccessChain %50 %18 %54 %40
OpStore %53 %49
%56 = OpLoad %7 %33
%55 = OpAccessChain %50 %19 %56 %37
OpStore %55 %57
%59 = OpLoad %7 %33
%58 = OpAccessChain %50 %19 %59 %40
OpStore %58 %60
%62 = OpLoad %7 %33
%61 = OpAccessChain %50 %22 %62 %37
OpStore %61 %63
%65 = OpLoad %7 %33
%64 = OpAccessChain %50 %22 %65 %40
OpStore %64 %66
OpReturn
OpFunctionEnd
%30 = OpFunction %1 None %2
%31 = OpLabel
OpBranch %86
%86 = OpLabel
%67 = OpAccessChain %50 %25 %37
OpStore %67 %68
%69 = OpAccessChain %50 %25 %40
OpStore %69 %68
%70 = OpAccessChain %50 %25 %8
OpStore %70 %68
%71 = OpAccessChain %50 %25 %72
OpStore %71 %68
%73 = OpAccessChain %50 %27 %37
OpStore %73 %68
%74 = OpAccessChain %50 %27 %40
OpStore %74 %68
OpReturn
OpFunctionEnd
#endif
