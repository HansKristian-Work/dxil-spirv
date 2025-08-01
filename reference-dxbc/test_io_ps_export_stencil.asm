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
               OpEntryPoint Fragment %main "main" %STENCIL_REF %SV_STENCILREF
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main StencilRefReplacingEXT
               OpName %main "main"
               OpName %STENCIL_REF "STENCIL_REF"
               OpName %SV_STENCILREF "SV_STENCILREF"
               OpDecorate %STENCIL_REF Flat
               OpDecorate %STENCIL_REF Location 0
               OpDecorate %SV_STENCILREF BuiltIn FragStencilRefEXT
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_ptr_Input_uint = OpTypePointer Input %uint
%STENCIL_REF = OpVariable %_ptr_Input_uint Input
%_ptr_Output_uint = OpTypePointer Output %uint
%SV_STENCILREF = OpVariable %_ptr_Output_uint Output
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %11

         %11 = OpLabel
         %10 =   OpLoad %uint %STENCIL_REF
                 OpStore %SV_STENCILREF %10
                 OpReturn
               OpFunctionEnd

