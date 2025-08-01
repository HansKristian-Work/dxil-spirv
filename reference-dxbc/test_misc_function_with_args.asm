SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 35
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
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
          %9 = OpTypeFunction %void %float %float %float %float
%_ptr_Output_float = OpTypePointer Output %float
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
    %float_1 = OpConstant %float 1
    %float_2 = OpConstant %float 2
    %float_3 = OpConstant %float 3
    %float_4 = OpConstant %float 4
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %31

         %31 = OpLabel
         %26 =   OpFunctionCall %void %_ %float_1 %float_2 %float_3 %float_4
                 OpReturn
               OpFunctionEnd
          %_ = OpFunction %void None %9
         %10 = OpFunctionParameter %float
         %11 = OpFunctionParameter %float
         %12 = OpFunctionParameter %float
         %13 = OpFunctionParameter %float

         %15 = OpLabel
                 OpBranch %33

         %33 = OpLabel
         %17 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %17 %10
         %20 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %20 %11
         %22 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %22 %12
         %24 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %24 %13
                 OpReturn
               OpFunctionEnd

