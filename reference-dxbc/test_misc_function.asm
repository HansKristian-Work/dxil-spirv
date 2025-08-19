SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 30
; Schema: 0
               OpCapability Shader
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SV_TARGET "SV_TARGET"
               OpName %_ ""
               OpDecorate %SV_TARGET Location 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%_ptr_Output_float = OpTypePointer Output %float
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
    %float_1 = OpConstant %float 1
     %uint_1 = OpConstant %uint 1
    %float_2 = OpConstant %float 2
     %uint_2 = OpConstant %uint 2
    %float_3 = OpConstant %float 3
     %uint_3 = OpConstant %uint 3
    %float_4 = OpConstant %float 4
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %26

         %26 = OpLabel
         %25 =   OpFunctionCall %void %_
                 OpReturn
               OpFunctionEnd
          %_ = OpFunction %void None %2

         %10 = OpLabel
                 OpBranch %28

         %28 = OpLabel
         %12 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %12 %float_1
         %16 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %16 %float_2
         %19 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %19 %float_3
         %22 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %22 %float_4
                 OpReturn
               OpFunctionEnd

