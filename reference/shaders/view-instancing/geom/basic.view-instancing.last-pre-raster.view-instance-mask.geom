#version 460
layout(triangles) in;
layout(max_vertices = 1, points) out;

layout(set = 10, binding = 23, std140) uniform ViewInstanceMaskUBO
{
    uint Mask;
} ViewInstanceMask;

layout(set = 10, binding = 22, std140) uniform ViewInstancingOffsetsUBO
{
    uint ViewID_Layer;
} ViewInstancingOffsets;

layout(location = 0) in vec4 TEXCOORD[3];
layout(location = 0) out vec4 TEXCOORD_1;

void main()
{
    if (bitfieldExtract(ViewInstanceMask.Mask, int(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u))), int(1u)) == 0u)
    {
        return;
    }
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[1u].gl_Position.x;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    gl_Layer = int(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(16u), int(16u)));
    EmitVertex();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 71
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %12 %14 %15 %65
OpExecutionMode %3 Invocations 1
OpExecutionMode %3 OutputVertices 1
OpExecutionMode %3 Triangles
OpExecutionMode %3 OutputPoints
OpName %3 "main"
OpName %11 "TEXCOORD"
OpName %12 "SV_Position"
OpName %14 "TEXCOORD"
OpName %15 "SV_Position"
OpName %16 "ViewInstanceMaskUBO"
OpMemberName %16 0 "Mask"
OpName %18 "ViewInstanceMask"
OpName %19 "ViewInstancingOffsetsUBO"
OpMemberName %19 0 "ViewID_Layer"
OpName %21 "ViewInstancingOffsets"
OpDecorate %11 Location 0
OpDecorate %12 BuiltIn Position
OpDecorate %14 Location 0
OpDecorate %15 BuiltIn Position
OpDecorate %16 Block
OpMemberDecorate %16 0 Offset 0
OpDecorate %18 DescriptorSet 10
OpDecorate %18 Binding 23
OpDecorate %19 Block
OpMemberDecorate %19 0 Offset 0
OpDecorate %21 DescriptorSet 10
OpDecorate %21 Binding 22
OpDecorate %65 BuiltIn Layer
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
%16 = OpTypeStruct %7
%17 = OpTypePointer Uniform %16
%18 = OpVariable %17 Uniform
%19 = OpTypeStruct %7
%20 = OpTypePointer Uniform %19
%21 = OpVariable %20 Uniform
%22 = OpTypePointer Uniform %7
%24 = OpConstant %7 0
%27 = OpConstant %7 16
%31 = OpConstant %7 1
%32 = OpTypeBool
%34 = OpTypePointer Input %5
%40 = OpConstant %7 2
%52 = OpTypePointer Output %5
%64 = OpTypePointer Output %7
%65 = OpVariable %64 Output
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %66
%66 = OpLabel
%23 = OpAccessChain %22 %21 %24
%25 = OpLoad %7 %23
%26 = OpBitFieldUExtract %7 %25 %24 %27
%28 = OpAccessChain %22 %18 %24
%29 = OpLoad %7 %28
%30 = OpBitFieldUExtract %7 %29 %26 %31
%33 = OpIEqual %32 %30 %24
OpSelectionMerge %68 None
OpBranchConditional %33 %67 %68
%67 = OpLabel
OpReturn
%68 = OpLabel
%35 = OpAccessChain %34 %11 %24 %24
%36 = OpLoad %5 %35
%37 = OpAccessChain %34 %11 %24 %31
%38 = OpLoad %5 %37
%39 = OpAccessChain %34 %11 %24 %40
%41 = OpLoad %5 %39
%42 = OpAccessChain %34 %11 %24 %8
%43 = OpLoad %5 %42
%44 = OpAccessChain %34 %12 %31 %24
%45 = OpLoad %5 %44
%46 = OpAccessChain %34 %12 %31 %31
%47 = OpLoad %5 %46
%48 = OpAccessChain %34 %12 %31 %40
%49 = OpLoad %5 %48
%50 = OpAccessChain %34 %12 %31 %8
%51 = OpLoad %5 %50
%53 = OpAccessChain %52 %14 %24
OpStore %53 %36
%54 = OpAccessChain %52 %14 %31
OpStore %54 %38
%55 = OpAccessChain %52 %14 %40
OpStore %55 %41
%56 = OpAccessChain %52 %14 %8
OpStore %56 %43
%57 = OpAccessChain %52 %15 %24
OpStore %57 %45
%58 = OpAccessChain %52 %15 %31
OpStore %58 %47
%59 = OpAccessChain %52 %15 %40
OpStore %59 %49
%60 = OpAccessChain %52 %15 %8
OpStore %60 %51
%61 = OpAccessChain %22 %21 %24
%62 = OpLoad %7 %61
%63 = OpBitFieldUExtract %7 %62 %27 %27
OpStore %65 %63
OpEmitVertex
OpReturn
OpFunctionEnd
#endif
