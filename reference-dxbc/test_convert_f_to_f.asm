SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 21
; Schema: 0
               OpCapability Shader
               OpCapability Float16
               OpCapability Float64
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %INPUT %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpExecutionMode %main SignedZeroInfNanPreserve 16
               OpExecutionMode %main SignedZeroInfNanPreserve 64
               OpName %main "main"
               OpName %INPUT "INPUT"
               OpName %SV_TARGET "SV_TARGET"
               OpDecorate %INPUT Location 0
               OpDecorate %SV_TARGET Location 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
%_ptr_Input_float = OpTypePointer Input %float
      %INPUT = OpVariable %_ptr_Input_float Input
%_ptr_Output_float = OpTypePointer Output %float
  %SV_TARGET = OpVariable %_ptr_Output_float Output
       %half = OpTypeFloat 16
     %double = OpTypeFloat 64
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %19

         %19 = OpLabel
         %10 =   OpLoad %float %INPUT
         %12 =   OpFConvert %half %10
         %14 =   OpFConvert %double %12
         %15 =   OpFConvert %float %14
         %16 =   OpFConvert %double %15
         %17 =   OpFConvert %half %16
         %18 =   OpFConvert %float %17
                 OpStore %SV_TARGET %18
                 OpReturn
               OpFunctionEnd

