#version 460

layout(set = 10, binding = 22, std140) uniform ViewInstancingOffsetsUBO
{
    uint ViewID_Layer;
} ViewInstancingOffsets;

void main()
{
    float _19 = float(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u)));
    gl_Position.x = _19;
    gl_Position.y = _19;
    gl_Position.z = _19;
    gl_Position.w = _19;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 30
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8
OpName %3 "main"
OpName %8 "SV_Position"
OpName %10 "ViewInstancingOffsetsUBO"
OpMemberName %10 0 "ViewID_Layer"
OpName %12 "ViewInstancingOffsets"
OpDecorate %8 BuiltIn Position
OpDecorate %10 Block
OpMemberDecorate %10 0 Offset 0
OpDecorate %12 DescriptorSet 10
OpDecorate %12 Binding 22
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpTypeInt 32 0
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypePointer Uniform %9
%15 = OpConstant %9 0
%18 = OpConstant %9 16
%20 = OpTypePointer Output %5
%23 = OpConstant %9 1
%25 = OpConstant %9 2
%27 = OpConstant %9 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %28
%28 = OpLabel
%14 = OpAccessChain %13 %12 %15
%16 = OpLoad %9 %14
%17 = OpBitFieldUExtract %9 %16 %15 %18
%19 = OpConvertUToF %5 %17
%21 = OpAccessChain %20 %8 %15
OpStore %21 %19
%22 = OpAccessChain %20 %8 %23
OpStore %22 %19
%24 = OpAccessChain %20 %8 %25
OpStore %24 %19
%26 = OpAccessChain %20 %8 %27
OpStore %26 %19
OpReturn
OpFunctionEnd
#endif
