SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 43
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
          %9 = OpTypeFunction %v4float %float %float %float %float
%float_0_200000003 = OpConstant %float 0.200000003
  %float_0_5 = OpConstant %float 0.5
    %float_1 = OpConstant %float 1
%float_0_800000012 = OpConstant %float 0.800000012
%_ptr_Output_float = OpTypePointer Output %float
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %39

         %39 = OpLabel
         %20 =   OpFunctionCall %v4float %_ %float_0_200000003 %float_0_5 %float_1 %float_0_800000012
         %25 =   OpCompositeExtract %float %20 0
         %27 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %27 %25
         %30 =   OpCompositeExtract %float %20 1
         %31 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %31 %30
         %33 =   OpCompositeExtract %float %20 2
         %34 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %34 %33
         %36 =   OpCompositeExtract %float %20 3
         %37 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %37 %36
                 OpReturn
               OpFunctionEnd
          %_ = OpFunction %v4float None %9
         %10 = OpFunctionParameter %float
         %11 = OpFunctionParameter %float
         %12 = OpFunctionParameter %float
         %13 = OpFunctionParameter %float

         %15 = OpLabel
                 OpBranch %41

         %41 = OpLabel
         %16 =   OpFMul %float %10 %13
         %17 =   OpFMul %float %11 %13
         %18 =   OpFMul %float %12 %13
         %19 =   OpCompositeConstruct %v4float %16 %17 %18 %13
                 OpReturnValue %19
               OpFunctionEnd

