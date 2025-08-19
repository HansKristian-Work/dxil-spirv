SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 33
; Schema: 0
               OpCapability Shader
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %12 %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %_ ""
               OpName %SV_TARGET "SV_TARGET"
               OpDecorate %_arr_v4float_uint_8 ArrayStride 16
               OpMemberDecorate %_ 0 Offset 0
               OpDecorate %_ Block
               OpDecorate %12 DescriptorSet 0
               OpDecorate %12 Binding 0
               OpDecorate %SV_TARGET Location 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
     %uint_8 = OpConstant %uint 8
      %float = OpTypeFloat 32
    %v4float = OpTypeVector %float 4
%_arr_v4float_uint_8 = OpTypeArray %v4float %uint_8
          %_ = OpTypeStruct %_arr_v4float_uint_8
%_ptr_Uniform__ = OpTypePointer Uniform %_
         %12 = OpVariable %_ptr_Uniform__ Uniform
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
     %uint_2 = OpConstant %uint 2
%_ptr_Uniform_v4float = OpTypePointer Uniform %v4float
     %uint_0 = OpConstant %uint 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_1 = OpConstant %uint 1
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %31

         %31 = OpLabel
         %17 =   OpAccessChain %_ptr_Uniform_v4float %12 %uint_0 %uint_2
         %19 =   OpLoad %v4float %17
         %20 =   OpCompositeExtract %float %19 0
         %22 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %22 %20
         %23 =   OpCompositeExtract %float %19 1
         %24 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %24 %23
         %26 =   OpCompositeExtract %float %19 2
         %27 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %27 %26
         %28 =   OpCompositeExtract %float %19 3
         %29 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %29 %28
                 OpReturn
               OpFunctionEnd

