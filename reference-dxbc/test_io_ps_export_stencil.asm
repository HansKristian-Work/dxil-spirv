SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 13
; Schema: 0
OpCapability Shader
OpCapability StencilExportEXT
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_shader_stencil_export"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %7 %9
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 StencilRefReplacingEXT
OpName %3 "main"
OpName %7 "STENCIL_REF"
OpName %9 "SV_STENCILREF"
OpDecorate %7 Flat
OpDecorate %7 Location 0
OpDecorate %9 BuiltIn FragStencilRefEXT
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypePointer Output %5
%9 = OpVariable %8 Output
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %11
%11 = OpLabel
%10 = OpLoad %5 %7
OpStore %9 %10
OpReturn
OpFunctionEnd

