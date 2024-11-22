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
; Bound: 86
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpCapability ClipDistance
OpCapability CullDistance
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationControl %3 "main" %13 %14 %17 %18 %20 %23 %25 %31
OpExecutionMode %3 Quads
OpExecutionMode %3 SpacingEqual
OpExecutionMode %3 VertexOrderCw
OpExecutionMode %3 OutputVertices 4
OpName %3 "main"
OpName %17 "HSValue"
OpName %18 "SV_ClipDistance"
OpName %20 "SV_CullDistance"
OpName %23 "SV_TessFactor"
OpName %25 "SV_InsideTessFactor"
OpName %26 "hull_main"
OpName %28 "patch_main"
OpDecorate %13 BuiltIn ClipDistance
OpDecorate %14 BuiltIn CullDistance
OpDecorate %17 Location 0
OpDecorate %18 Location 1
OpDecorate %20 Location 1
OpDecorate %20 Component 2
OpDecorate %23 BuiltIn TessLevelOuter
OpDecorate %23 Patch
OpDecorate %25 BuiltIn TessLevelInner
OpDecorate %25 Patch
OpDecorate %31 BuiltIn InvocationId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypeInt 32 0
%8 = OpConstant %7 2
%9 = OpTypeArray %5 %8
%10 = OpConstant %7 4
%11 = OpTypeArray %9 %10
%12 = OpTypePointer Input %11
%13 = OpVariable %12 Input
%14 = OpVariable %12 Input
%15 = OpTypeArray %6 %10
%16 = OpTypePointer Output %15
%17 = OpVariable %16 Output
%18 = OpVariable %16 Output
%19 = OpTypePointer Output %11
%20 = OpVariable %19 Output
%21 = OpTypeArray %5 %10
%22 = OpTypePointer Output %21
%23 = OpVariable %22 Output
%24 = OpTypePointer Output %9
%25 = OpVariable %24 Output
%30 = OpTypePointer Input %7
%31 = OpVariable %30 Input
%33 = OpTypePointer Input %5
%35 = OpConstant %7 0
%38 = OpConstant %7 1
%48 = OpTypePointer Output %5
%55 = OpConstant %5 1
%58 = OpConstant %5 2
%61 = OpConstant %5 3
%64 = OpConstant %5 4
%66 = OpConstant %5 0
%70 = OpConstant %7 3
%75 = OpTypeBool
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %78
%78 = OpLabel
%73 = OpFunctionCall %1 %26
%74 = OpLoad %7 %31
%76 = OpIEqual %75 %74 %35
OpControlBarrier %8 %10 %35
OpSelectionMerge %80 None
OpBranchConditional %76 %79 %80
%79 = OpLabel
%77 = OpFunctionCall %1 %28
OpBranch %80
%80 = OpLabel
OpReturn
OpFunctionEnd
%26 = OpFunction %1 None %2
%27 = OpLabel
OpBranch %82
%82 = OpLabel
%32 = OpLoad %7 %31
%34 = OpAccessChain %33 %13 %32 %35
%36 = OpLoad %5 %34
%37 = OpAccessChain %33 %13 %32 %38
%39 = OpLoad %5 %37
%40 = OpAccessChain %33 %14 %32 %35
%41 = OpLoad %5 %40
%42 = OpFAdd %5 %41 %36
%43 = OpFAdd %5 %41 %39
%44 = OpAccessChain %33 %14 %32 %38
%45 = OpLoad %5 %44
%46 = OpFAdd %5 %42 %45
%47 = OpFAdd %5 %43 %45
%50 = OpLoad %7 %31
%49 = OpAccessChain %48 %17 %50 %35
OpStore %49 %46
%52 = OpLoad %7 %31
%51 = OpAccessChain %48 %17 %52 %38
OpStore %51 %47
%54 = OpLoad %7 %31
%53 = OpAccessChain %48 %18 %54 %35
OpStore %53 %55
%57 = OpLoad %7 %31
%56 = OpAccessChain %48 %18 %57 %38
OpStore %56 %58
%60 = OpLoad %7 %31
%59 = OpAccessChain %48 %20 %60 %35
OpStore %59 %61
%63 = OpLoad %7 %31
%62 = OpAccessChain %48 %20 %63 %38
OpStore %62 %64
OpReturn
OpFunctionEnd
%28 = OpFunction %1 None %2
%29 = OpLabel
OpBranch %84
%84 = OpLabel
%65 = OpAccessChain %48 %23 %35
OpStore %65 %66
%67 = OpAccessChain %48 %23 %38
OpStore %67 %66
%68 = OpAccessChain %48 %23 %8
OpStore %68 %66
%69 = OpAccessChain %48 %23 %70
OpStore %69 %66
%71 = OpAccessChain %48 %25 %35
OpStore %71 %66
%72 = OpAccessChain %48 %25 %38
OpStore %72 %66
OpReturn
OpFunctionEnd
#endif
