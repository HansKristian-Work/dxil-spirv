SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 44
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %SV_POSITION %SEL %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
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
    %float_0 = OpConstant %float 0
%_ptr_Input_float = OpTypePointer Input %float
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
   %float_n1 = OpConstant %float -1
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
    %float_1 = OpConstant %float 1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %37

         %37 = OpLabel
         %14 =   OpLoad %int %SEL
         %16 =   OpBitcast %uint %14
                 OpSelectionMerge %42 None
                 OpSwitch %16 %42 3 %41 7 %39 9 %40 17 %38

         %41 =     OpLabel
         %23 =       OpAccessChain %_ptr_Input_float %SV_POSITION %uint_0
         %19 =       OpLoad %float %23
                     OpBranch %42

         %39 =     OpLabel
         %25 =       OpAccessChain %_ptr_Input_float %SV_POSITION %uint_1
         %27 =       OpLoad %float %25
                     OpBranch %40

         %40 =     OpLabel
         %28 =       OpPhi %float %float_n1 %37 %27 %39
         %30 =       OpAccessChain %_ptr_Input_float %SV_POSITION %uint_2
         %32 =       OpLoad %float %30
         %20 =       OpFAdd %float %32 %28
                     OpBranch %42

         %38 =     OpLabel
         %33 =       OpAccessChain %_ptr_Input_float %SV_POSITION %uint_3
         %21 =       OpLoad %float %33
         %35 =       OpFDiv %float %float_1 %21
                     OpBranch %42

         %42 = OpLabel
         %17 =   OpPhi %float %float_0 %37 %19 %41 %20 %40 %35 %38
                 OpStore %SV_TARGET %17
                 OpReturn
               OpFunctionEnd

