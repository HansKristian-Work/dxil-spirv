#version 460
layout(vertices = 4) out;

layout(location = 0) out vec2 HSValue[4];
layout(location = 1) out vec2 SV_ClipDistance[4];
layout(location = 1, component = 2) out float SV_CullDistance[4][2];

void hull_main()
{
    float _46 = gl_in[gl_InvocationID].gl_CullDistance[1u] + gl_in[gl_InvocationID].gl_CullDistance[0u];
    HSValue[gl_InvocationID].x = _46 + gl_in[gl_InvocationID].gl_ClipDistance[0u];
    HSValue[gl_InvocationID].y = _46 + gl_in[gl_InvocationID].gl_ClipDistance[1u];
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
; Bound: 87
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
%49 = OpTypePointer Output %5
%56 = OpConstant %5 1
%59 = OpConstant %5 2
%62 = OpConstant %5 3
%65 = OpConstant %5 4
%67 = OpConstant %5 0
%71 = OpConstant %7 3
%76 = OpTypeBool
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %79
%79 = OpLabel
%74 = OpFunctionCall %1 %28
%75 = OpLoad %7 %33
%77 = OpIEqual %76 %75 %37
OpControlBarrier %8 %15 %37
OpSelectionMerge %81 None
OpBranchConditional %77 %80 %81
%80 = OpLabel
%78 = OpFunctionCall %1 %30
OpBranch %81
%81 = OpLabel
OpReturn
OpFunctionEnd
%28 = OpFunction %1 None %2
%29 = OpLabel
OpBranch %83
%83 = OpLabel
%34 = OpLoad %7 %33
%36 = OpAccessChain %35 %13 %34 %37
%38 = OpLoad %5 %36
%39 = OpAccessChain %35 %13 %34 %40
%41 = OpLoad %5 %39
%42 = OpAccessChain %35 %14 %34 %37
%43 = OpLoad %5 %42
%44 = OpAccessChain %35 %14 %34 %40
%45 = OpLoad %5 %44
%46 = OpFAdd %5 %45 %43
%47 = OpFAdd %5 %46 %38
%48 = OpFAdd %5 %46 %41
%51 = OpLoad %7 %33
%50 = OpAccessChain %49 %18 %51 %37
OpStore %50 %47
%53 = OpLoad %7 %33
%52 = OpAccessChain %49 %18 %53 %40
OpStore %52 %48
%55 = OpLoad %7 %33
%54 = OpAccessChain %49 %19 %55 %37
OpStore %54 %56
%58 = OpLoad %7 %33
%57 = OpAccessChain %49 %19 %58 %40
OpStore %57 %59
%61 = OpLoad %7 %33
%60 = OpAccessChain %49 %22 %61 %37
OpStore %60 %62
%64 = OpLoad %7 %33
%63 = OpAccessChain %49 %22 %64 %40
OpStore %63 %65
OpReturn
OpFunctionEnd
%30 = OpFunction %1 None %2
%31 = OpLabel
OpBranch %85
%85 = OpLabel
%66 = OpAccessChain %49 %25 %37
OpStore %66 %67
%68 = OpAccessChain %49 %25 %40
OpStore %68 %67
%69 = OpAccessChain %49 %25 %8
OpStore %69 %67
%70 = OpAccessChain %49 %25 %71
OpStore %70 %67
%72 = OpAccessChain %49 %27 %37
OpStore %72 %67
%73 = OpAccessChain %49 %27 %40
OpStore %73 %67
OpReturn
OpFunctionEnd
#endif
