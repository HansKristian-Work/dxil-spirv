SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 39
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
%_ptr_Input_float = OpTypePointer Input %float
     %uint_3 = OpConstant %uint 3
    %float_1 = OpConstant %float 1
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %32

         %32 = OpLabel
         %14 =   OpLoad %int %SEL
         %16 =   OpBitcast %uint %14
                 OpSelectionMerge %37 None
                 OpSwitch %16 %36 3 %35 6 %34 7 %34 9 %33

         %36 =     OpLabel
         %18 =       OpAccessChain %_ptr_Input_float %SV_POSITION %uint_3
         %20 =       OpLoad %float %18
         %21 =       OpFDiv %float %float_1 %20
                     OpStore %SV_TARGET %21
                     OpBranch %37

         %35 =     OpLabel
         %23 =       OpAccessChain %_ptr_Input_float %SV_POSITION %uint_0
         %25 =       OpLoad %float %23
                     OpStore %SV_TARGET %25
                     OpBranch %37

         %34 =     OpLabel
         %26 =       OpAccessChain %_ptr_Input_float %SV_POSITION %uint_1
         %28 =       OpLoad %float %26
                     OpStore %SV_TARGET %28
                     OpBranch %37

         %33 =     OpLabel
         %29 =       OpAccessChain %_ptr_Input_float %SV_POSITION %uint_2
         %31 =       OpLoad %float %29
                     OpStore %SV_TARGET %31
                     OpBranch %37

         %37 = OpLabel
                 OpReturn
               OpFunctionEnd

