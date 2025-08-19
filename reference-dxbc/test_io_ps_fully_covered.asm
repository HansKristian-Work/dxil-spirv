SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 17
; Schema: 0
               OpCapability Shader
               OpCapability SignedZeroInfNanPreserve
               OpCapability FragmentFullyCoveredEXT
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_fragment_fully_covered"
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %SV_TARGET %10
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SV_TARGET "SV_TARGET"
               OpDecorate %SV_TARGET Location 0
               OpDecorate %10 BuiltIn FullyCoveredEXT
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
%_ptr_Output_float = OpTypePointer Output %float
  %SV_TARGET = OpVariable %_ptr_Output_float Output
       %bool = OpTypeBool
%_ptr_Input_bool = OpTypePointer Input %bool
         %10 = OpVariable %_ptr_Input_bool Input
    %float_1 = OpConstant %float 1
    %float_0 = OpConstant %float 0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %15

         %15 = OpLabel
         %11 =   OpLoad %bool %10
         %12 =   OpSelect %float %11 %float_1 %float_0
                 OpStore %SV_TARGET %12
                 OpReturn
               OpFunctionEnd

