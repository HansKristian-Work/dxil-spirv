SPIR-V:
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 16
; Schema: 0
OpCapability Shader
OpCapability MultiViewport
OpCapability DrawParameters
OpCapability ShaderViewportIndexLayerEXT
OpExtension "SPV_EXT_shader_viewport_index_layer"
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %7 %9 %11
OpName %3 "main"
OpName %7 "SV_INSTANCEID"
OpName %9 "SV_ViewportArrayIndex"
OpDecorate %7 BuiltIn InstanceIndex
OpDecorate %9 BuiltIn ViewportIndex
OpDecorate %11 BuiltIn BaseInstance
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypePointer Output %5
%9 = OpVariable %8 Output
%11 = OpVariable %6 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %14
%14 = OpLabel
%10 = OpLoad %5 %7
%12 = OpLoad %5 %11
%13 = OpISub %5 %10 %12
OpStore %9 %13
OpReturn
OpFunctionEnd

