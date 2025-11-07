#version 460
layout(triangles) in;
layout(max_vertices = 2, points) out;

layout(constant_id = 1001) const uint ViewIDToViewport = 0u;

layout(set = 10, binding = 22, std140) uniform ViewInstancingOffsetsUBO
{
    uint ViewID_Layer;
} ViewInstancingOffsets;

layout(location = 0) in vec4 TEXCOORD[3];
layout(location = 0) out vec4 TEXCOORD_1;

void main()
{
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[1u].gl_Position.x;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    gl_Layer = int(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(16u), int(16u)));
    gl_ViewportIndex = int(bitfieldExtract(ViewIDToViewport, int(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u)) * 8u), int(8u)));
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[1u].gl_Position.x;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    gl_Layer = int(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(16u), int(16u)));
    gl_ViewportIndex = int(bitfieldExtract(ViewIDToViewport, int(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u)) * 8u), int(8u)));
    EmitVertex();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 81
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability MultiViewport
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %12 %14 %15 %54 %62
OpExecutionMode %3 Invocations 1
OpExecutionMode %3 OutputVertices 2
OpExecutionMode %3 Triangles
OpExecutionMode %3 OutputPoints
OpName %3 "main"
OpName %11 "TEXCOORD"
OpName %12 "SV_Position"
OpName %14 "TEXCOORD"
OpName %15 "SV_Position"
OpName %45 "ViewInstancingOffsetsUBO"
OpMemberName %45 0 "ViewID_Layer"
OpName %47 "ViewInstancingOffsets"
OpName %58 "ViewIDToViewport"
OpDecorate %11 Location 0
OpDecorate %12 BuiltIn Position
OpDecorate %14 Location 0
OpDecorate %15 BuiltIn Position
OpDecorate %45 Block
OpMemberDecorate %45 0 Offset 0
OpDecorate %47 DescriptorSet 10
OpDecorate %47 Binding 22
OpDecorate %54 BuiltIn Layer
OpDecorate %58 SpecId 1001
OpDecorate %62 BuiltIn ViewportIndex
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeInt 32 0
%8 = OpConstant %7 3
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpVariable %10 Input
%13 = OpTypePointer Output %6
%14 = OpVariable %13 Output
%15 = OpVariable %13 Output
%16 = OpTypePointer Input %5
%18 = OpConstant %7 0
%21 = OpConstant %7 1
%24 = OpConstant %7 2
%36 = OpTypePointer Output %5
%45 = OpTypeStruct %7
%46 = OpTypePointer Uniform %45
%47 = OpVariable %46 Uniform
%48 = OpTypePointer Uniform %7
%52 = OpConstant %7 16
%53 = OpTypePointer Output %7
%54 = OpVariable %53 Output
%58 = OpSpecConstant %7 0
%60 = OpConstant %7 8
%62 = OpVariable %53 Output
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %79
%79 = OpLabel
%17 = OpAccessChain %16 %11 %18 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %16 %11 %18 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %16 %11 %18 %24
%25 = OpLoad %5 %23
%26 = OpAccessChain %16 %11 %18 %8
%27 = OpLoad %5 %26
%28 = OpAccessChain %16 %12 %21 %18
%29 = OpLoad %5 %28
%30 = OpAccessChain %16 %12 %21 %21
%31 = OpLoad %5 %30
%32 = OpAccessChain %16 %12 %21 %24
%33 = OpLoad %5 %32
%34 = OpAccessChain %16 %12 %21 %8
%35 = OpLoad %5 %34
%37 = OpAccessChain %36 %14 %18
OpStore %37 %19
%38 = OpAccessChain %36 %14 %21
OpStore %38 %22
%39 = OpAccessChain %36 %14 %24
OpStore %39 %25
%40 = OpAccessChain %36 %14 %8
OpStore %40 %27
%41 = OpAccessChain %36 %15 %18
OpStore %41 %29
%42 = OpAccessChain %36 %15 %21
OpStore %42 %31
%43 = OpAccessChain %36 %15 %24
OpStore %43 %33
%44 = OpAccessChain %36 %15 %8
OpStore %44 %35
%49 = OpAccessChain %48 %47 %18
%50 = OpLoad %7 %49
%51 = OpBitFieldUExtract %7 %50 %52 %52
OpStore %54 %51
%55 = OpAccessChain %48 %47 %18
%56 = OpLoad %7 %55
%57 = OpBitFieldUExtract %7 %56 %18 %52
%59 = OpIMul %7 %57 %60
%61 = OpBitFieldUExtract %7 %58 %59 %60
OpStore %62 %61
OpEmitVertex
%63 = OpAccessChain %36 %14 %18
OpStore %63 %19
%64 = OpAccessChain %36 %14 %21
OpStore %64 %22
%65 = OpAccessChain %36 %14 %24
OpStore %65 %25
%66 = OpAccessChain %36 %14 %8
OpStore %66 %27
%67 = OpAccessChain %36 %15 %18
OpStore %67 %29
%68 = OpAccessChain %36 %15 %21
OpStore %68 %31
%69 = OpAccessChain %36 %15 %24
OpStore %69 %33
%70 = OpAccessChain %36 %15 %8
OpStore %70 %35
%71 = OpAccessChain %48 %47 %18
%72 = OpLoad %7 %71
%73 = OpBitFieldUExtract %7 %72 %52 %52
OpStore %54 %73
%74 = OpAccessChain %48 %47 %18
%75 = OpLoad %7 %74
%76 = OpBitFieldUExtract %7 %75 %18 %52
%77 = OpIMul %7 %76 %60
%78 = OpBitFieldUExtract %7 %58 %77 %60
OpStore %62 %78
OpEmitVertex
OpReturn
OpFunctionEnd
#endif
