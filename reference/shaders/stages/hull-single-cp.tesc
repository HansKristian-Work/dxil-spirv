#version 460
layout(vertices = 1) out;

layout(location = 0) in float VSValue[];
layout(location = 0) out float HSValue[1];
layout(location = 1) patch out float PATCH;

void hull_main()
{
    HSValue[gl_InvocationID] = (VSValue[1u] + VSValue[0u]) + VSValue[2u];
}

void patch_main()
{
    gl_TessLevelOuter[0u] = VSValue[0u];
    gl_TessLevelOuter[1u] = VSValue[1u];
    gl_TessLevelOuter[2u] = VSValue[2u];
    gl_TessLevelInner[0u] = HSValue[0u];
    PATCH = VSValue[3u];
}

void main()
{
    hull_main();
    patch_main();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 66
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationControl %3 "main" %10 %14 %18 %22 %24 %41
OpExecutionMode %3 Triangles
OpExecutionMode %3 SpacingEqual
OpExecutionMode %3 VertexOrderCcw
OpExecutionMode %3 OutputVertices 1
OpName %3 "main"
OpName %10 "VSValue"
OpName %14 "HSValue"
OpName %18 "SV_TessFactor"
OpName %22 "SV_InsideTessFactor"
OpName %24 "PATCH"
OpName %25 "hull_main"
OpName %27 "patch_main"
OpDecorate %10 Location 0
OpDecorate %14 Location 0
OpDecorate %18 BuiltIn TessLevelOuter
OpDecorate %18 Patch
OpDecorate %22 BuiltIn TessLevelInner
OpDecorate %22 Patch
OpDecorate %24 Location 1
OpDecorate %24 Patch
OpDecorate %41 BuiltIn InvocationId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeInt 32 0
%7 = OpConstant %6 5
%8 = OpTypeArray %5 %7
%9 = OpTypePointer Input %8
%10 = OpVariable %9 Input
%11 = OpConstant %6 1
%12 = OpTypeArray %5 %11
%13 = OpTypePointer Output %12
%14 = OpVariable %13 Output
%15 = OpConstant %6 4
%16 = OpTypeArray %5 %15
%17 = OpTypePointer Output %16
%18 = OpVariable %17 Output
%19 = OpConstant %6 2
%20 = OpTypeArray %5 %19
%21 = OpTypePointer Output %20
%22 = OpVariable %21 Output
%23 = OpTypePointer Output %5
%24 = OpVariable %23 Output
%29 = OpTypePointer Input %5
%31 = OpConstant %6 0
%40 = OpTypePointer Input %6
%41 = OpVariable %40 Input
%52 = OpConstant %6 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %60
%60 = OpLabel
%58 = OpFunctionCall %1 %25
%59 = OpFunctionCall %1 %27
OpReturn
OpFunctionEnd
%25 = OpFunction %1 None %2
%26 = OpLabel
OpBranch %62
%62 = OpLabel
%30 = OpAccessChain %29 %10 %31
%32 = OpLoad %5 %30
%33 = OpAccessChain %29 %10 %11
%34 = OpLoad %5 %33
%35 = OpFAdd %5 %34 %32
%36 = OpAccessChain %29 %10 %19
%37 = OpLoad %5 %36
%38 = OpFAdd %5 %35 %37
%42 = OpLoad %6 %41
%39 = OpAccessChain %23 %14 %42
OpStore %39 %38
OpReturn
OpFunctionEnd
%27 = OpFunction %1 None %2
%28 = OpLabel
OpBranch %64
%64 = OpLabel
%43 = OpAccessChain %23 %14 %31
%44 = OpLoad %5 %43
%45 = OpAccessChain %29 %10 %31
%46 = OpLoad %5 %45
%47 = OpAccessChain %29 %10 %11
%48 = OpLoad %5 %47
%49 = OpAccessChain %29 %10 %19
%50 = OpLoad %5 %49
%51 = OpAccessChain %29 %10 %52
%53 = OpLoad %5 %51
%54 = OpAccessChain %23 %18 %31
OpStore %54 %46
%55 = OpAccessChain %23 %18 %11
OpStore %55 %48
%56 = OpAccessChain %23 %18 %19
OpStore %56 %50
%57 = OpAccessChain %23 %22 %31
OpStore %57 %44
OpStore %24 %53
OpReturn
OpFunctionEnd
#endif
