#version 460
layout(vertices = 3) out;

layout(location = 1) in uint SV_RenderTargetArrayIndex[];
layout(location = 1, component = 1) in uint SV_ViewportArrayIndex[];
layout(location = 0) out vec4 SV_Position[3];
layout(location = 1) out uint SV_RenderTargetArrayIndex_1[3];
layout(location = 1, component = 1) out uint SV_ViewportArrayIndex_1[3];

void hull_main()
{
    SV_Position[gl_InvocationID].x = gl_in[gl_InvocationID].gl_Position.x;
    SV_Position[gl_InvocationID].y = gl_in[gl_InvocationID].gl_Position.y;
    SV_Position[gl_InvocationID].z = gl_in[gl_InvocationID].gl_Position.z;
    SV_Position[gl_InvocationID].w = gl_in[gl_InvocationID].gl_Position.w;
    SV_RenderTargetArrayIndex_1[gl_InvocationID] = SV_RenderTargetArrayIndex[gl_InvocationID];
    SV_ViewportArrayIndex_1[gl_InvocationID] = SV_ViewportArrayIndex[gl_InvocationID];
}

void patch_main()
{
    gl_TessLevelOuter[0u] = 1.0;
    gl_TessLevelOuter[1u] = 1.0;
    gl_TessLevelOuter[2u] = 1.0;
    gl_TessLevelInner[0u] = 1.0;
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
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 85
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint TessellationControl %3 "main" %11 %14 %15 %19 %22 %23 %27 %31 %37
OpExecutionMode %3 Triangles
OpExecutionMode %3 SpacingEqual
OpExecutionMode %3 VertexOrderCcw
OpExecutionMode %3 OutputVertices 3
OpName %3 "main"
OpName %11 "SV_Position"
OpName %14 "SV_RenderTargetArrayIndex"
OpName %15 "SV_ViewportArrayIndex"
OpName %19 "SV_Position"
OpName %22 "SV_RenderTargetArrayIndex"
OpName %23 "SV_ViewportArrayIndex"
OpName %27 "SV_TessFactor"
OpName %31 "SV_InsideTessFactor"
OpName %32 "hull_main"
OpName %34 "patch_main"
OpDecorate %11 BuiltIn Position
OpDecorate %14 Location 1
OpDecorate %15 Location 1
OpDecorate %15 Component 1
OpDecorate %19 Location 0
OpDecorate %22 Location 1
OpDecorate %23 Location 1
OpDecorate %23 Component 1
OpDecorate %27 BuiltIn TessLevelOuter
OpDecorate %27 Patch
OpDecorate %31 BuiltIn TessLevelInner
OpDecorate %31 Patch
OpDecorate %37 BuiltIn InvocationId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeInt 32 0
%8 = OpConstant %7 32
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypeArray %7 %8
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%15 = OpVariable %13 Input
%16 = OpConstant %7 3
%17 = OpTypeArray %6 %16
%18 = OpTypePointer Output %17
%19 = OpVariable %18 Output
%20 = OpTypeArray %7 %16
%21 = OpTypePointer Output %20
%22 = OpVariable %21 Output
%23 = OpVariable %21 Output
%24 = OpConstant %7 4
%25 = OpTypeArray %5 %24
%26 = OpTypePointer Output %25
%27 = OpVariable %26 Output
%28 = OpConstant %7 2
%29 = OpTypeArray %5 %28
%30 = OpTypePointer Output %29
%31 = OpVariable %30 Output
%36 = OpTypePointer Input %7
%37 = OpVariable %36 Input
%39 = OpTypePointer Input %5
%41 = OpConstant %7 0
%44 = OpConstant %7 1
%50 = OpTypePointer Output %5
%61 = OpTypePointer Output %7
%69 = OpConstant %5 1
%75 = OpTypeBool
%77 = OpConstant %7 4104
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %79
%79 = OpLabel
%73 = OpFunctionCall %1 %32
%74 = OpLoad %7 %37
%76 = OpIEqual %75 %74 %41
OpControlBarrier %28 %28 %77
OpSelectionMerge %81 None
OpBranchConditional %76 %80 %81
%80 = OpLabel
%78 = OpFunctionCall %1 %34
OpBranch %81
%81 = OpLabel
OpBranch %82
%82 = OpLabel
OpReturn
OpFunctionEnd
%32 = OpFunction %1 None %2
%33 = OpLabel
OpBranch %83
%83 = OpLabel
%38 = OpLoad %7 %37
%40 = OpAccessChain %39 %11 %38 %41
%42 = OpLoad %5 %40
%43 = OpAccessChain %39 %11 %38 %44
%45 = OpLoad %5 %43
%46 = OpAccessChain %39 %11 %38 %28
%47 = OpLoad %5 %46
%48 = OpAccessChain %39 %11 %38 %16
%49 = OpLoad %5 %48
%52 = OpLoad %7 %37
%51 = OpAccessChain %50 %19 %52 %41
OpStore %51 %42
%54 = OpLoad %7 %37
%53 = OpAccessChain %50 %19 %54 %44
OpStore %53 %45
%56 = OpLoad %7 %37
%55 = OpAccessChain %50 %19 %56 %28
OpStore %55 %47
%58 = OpLoad %7 %37
%57 = OpAccessChain %50 %19 %58 %16
OpStore %57 %49
%59 = OpAccessChain %36 %14 %38
%60 = OpLoad %7 %59
%63 = OpLoad %7 %37
%62 = OpAccessChain %61 %22 %63
OpStore %62 %60
%64 = OpAccessChain %36 %15 %38
%65 = OpLoad %7 %64
%67 = OpLoad %7 %37
%66 = OpAccessChain %61 %23 %67
OpStore %66 %65
OpReturn
OpFunctionEnd
%34 = OpFunction %1 None %2
%35 = OpLabel
OpBranch %84
%84 = OpLabel
%68 = OpAccessChain %50 %27 %41
OpStore %68 %69
%70 = OpAccessChain %50 %27 %44
OpStore %70 %69
%71 = OpAccessChain %50 %27 %28
OpStore %71 %69
%72 = OpAccessChain %50 %31 %41
OpStore %72 %69
OpReturn
OpFunctionEnd
#endif
