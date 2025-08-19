SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 37
; Schema: 0
               OpCapability Shader
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %SV_POSITION %SEL %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SV_POSITION "SV_POSITION"
               OpName %SEL "SEL"
               OpName %SV_TARGET "SV_TARGET"
               OpDecorate %SV_POSITION BuiltIn FragCoord
               OpDecorate %SEL Flat
               OpDecorate %SEL Location 1
               OpDecorate %SV_TARGET Location 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
    %v4float = OpTypeVector %float 4
%_ptr_Input_v4float = OpTypePointer Input %v4float
%SV_POSITION = OpVariable %_ptr_Input_v4float Input
        %int = OpTypeInt 32 1
%_ptr_Input_int = OpTypePointer Input %int
        %SEL = OpVariable %_ptr_Input_int Input
%_ptr_Output_float = OpTypePointer Output %float
  %SV_TARGET = OpVariable %_ptr_Output_float Output
       %uint = OpTypeInt 32 0
%_ptr_Input_float = OpTypePointer Input %float
     %uint_3 = OpConstant %uint 3
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %30

         %30 = OpLabel
         %14 =   OpLoad %int %SEL
         %16 =   OpBitcast %uint %14
                 OpSelectionMerge %35 None
                 OpSwitch %16 %34 3 %33 6 %32 7 %32 9 %31

         %34 =     OpLabel
         %18 =       OpAccessChain %_ptr_Input_float %SV_POSITION %uint_3
         %20 =       OpLoad %float %18
                     OpStore %SV_TARGET %20
                     OpBranch %35

         %33 =     OpLabel
         %21 =       OpAccessChain %_ptr_Input_float %SV_POSITION %uint_0
         %23 =       OpLoad %float %21
                     OpStore %SV_TARGET %23
                     OpBranch %35

         %32 =     OpLabel
         %24 =       OpAccessChain %_ptr_Input_float %SV_POSITION %uint_1
         %26 =       OpLoad %float %24
                     OpStore %SV_TARGET %26
                     OpBranch %35

         %31 =     OpLabel
         %27 =       OpAccessChain %_ptr_Input_float %SV_POSITION %uint_2
         %29 =       OpLoad %float %27
                     OpStore %SV_TARGET %29
                     OpBranch %35

         %35 = OpLabel
                 OpReturn
               OpFunctionEnd

