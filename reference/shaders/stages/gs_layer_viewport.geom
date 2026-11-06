#version 460
layout(triangles) in;
layout(max_vertices = 3, triangle_strip) out;

layout(location = 1) in uint SV_RenderTargetArrayIndex[3];
layout(location = 1, component = 1) in uint SV_ViewportArrayIndex[3];
layout(location = 1) flat out uvec2 COLOR;

void main()
{
    uint _51 = 0u;
    uint _23;
    bool _49;
    for (;;)
    {
        gl_Position.x = gl_in[_51].gl_Position.x;
        gl_Position.y = gl_in[_51].gl_Position.y;
        gl_Position.z = gl_in[_51].gl_Position.z;
        gl_Position.w = gl_in[_51].gl_Position.w;
        COLOR.x = SV_RenderTargetArrayIndex[_51];
        COLOR.y = SV_ViewportArrayIndex[_51];
        EmitVertex();
        _23 = _51 + 1u;
        _49 = _23 == 3u;
        if (_49)
        {
            break;
        }
        else
        {
            _51 = _23;
            continue;
        }
    }
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 59
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Geometry %3 "main" %11 %14 %15 %17 %20
OpExecutionMode %3 Invocations 1
OpExecutionMode %3 OutputVertices 3
OpExecutionMode %3 Triangles
OpExecutionMode %3 OutputTriangleStrip
OpName %3 "main"
OpName %11 "SV_Position"
OpName %14 "SV_RenderTargetArrayIndex"
OpName %15 "SV_ViewportArrayIndex"
OpName %17 "SV_Position"
OpName %20 "COLOR"
OpDecorate %11 BuiltIn Position
OpDecorate %14 Location 1
OpDecorate %15 Location 1
OpDecorate %15 Component 1
OpDecorate %17 BuiltIn Position
OpDecorate %20 Flat
OpDecorate %20 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeInt 32 0
%8 = OpConstant %7 3
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypeArray %7 %8
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%15 = OpVariable %13 Input
%16 = OpTypePointer Output %6
%17 = OpVariable %16 Output
%18 = OpTypeVector %7 2
%19 = OpTypePointer Output %18
%20 = OpVariable %19 Output
%22 = OpConstant %7 0
%24 = OpTypePointer Input %5
%28 = OpConstant %7 1
%31 = OpConstant %7 2
%35 = OpTypePointer Input %7
%40 = OpTypePointer Output %5
%45 = OpTypePointer Output %7
%48 = OpTypeBool
%50 = OpTypePointer Function %7
%3 = OpFunction %1 None %2
%4 = OpLabel
%51 = OpVariable %50 Function
OpBranch %52
%52 = OpLabel
OpStore %51 %22
OpBranch %53
%53 = OpLabel
%21 = OpLoad %7 %51
%25 = OpAccessChain %24 %11 %21 %22
%26 = OpLoad %5 %25
%27 = OpAccessChain %24 %11 %21 %28
%29 = OpLoad %5 %27
%30 = OpAccessChain %24 %11 %21 %31
%32 = OpLoad %5 %30
%33 = OpAccessChain %24 %11 %21 %8
%34 = OpLoad %5 %33
%36 = OpAccessChain %35 %14 %21
%37 = OpLoad %7 %36
%38 = OpAccessChain %35 %15 %21
%39 = OpLoad %7 %38
%41 = OpAccessChain %40 %17 %22
OpStore %41 %26
%42 = OpAccessChain %40 %17 %28
OpStore %42 %29
%43 = OpAccessChain %40 %17 %31
OpStore %43 %32
%44 = OpAccessChain %40 %17 %8
OpStore %44 %34
%46 = OpAccessChain %45 %20 %22
OpStore %46 %37
%47 = OpAccessChain %45 %20 %28
OpStore %47 %39
OpEmitVertex
%23 = OpIAdd %7 %21 %28
%49 = OpIEqual %48 %23 %8
OpLoopMerge %56 %55 None
OpBranch %54
%54 = OpLabel
OpSelectionMerge %58 None
OpBranchConditional %49 %56 %55
%58 = OpLabel
OpUnreachable
%55 = OpLabel
OpStore %51 %23
OpBranch %53
%56 = OpLabel
OpBranch %57
%57 = OpLabel
OpReturn
OpFunctionEnd
#endif
