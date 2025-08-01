SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 36
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %12 %INDEX %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %_ ""
               OpName %INDEX "INDEX"
               OpName %SV_TARGET "SV_TARGET"
               OpDecorate %_arr_v4float_uint_4096 ArrayStride 16
               OpMemberDecorate %_ 0 Offset 0
               OpDecorate %_ Block
               OpDecorate %12 DescriptorSet 0
               OpDecorate %12 Binding 0
               OpDecorate %INDEX Flat
               OpDecorate %INDEX Location 0
               OpDecorate %SV_TARGET Location 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
  %uint_4096 = OpConstant %uint 4096
      %float = OpTypeFloat 32
    %v4float = OpTypeVector %float 4
%_arr_v4float_uint_4096 = OpTypeArray %v4float %uint_4096
          %_ = OpTypeStruct %_arr_v4float_uint_4096
%_ptr_Uniform__ = OpTypePointer Uniform %_
         %12 = OpVariable %_ptr_Uniform__ Uniform
%_ptr_Input_uint = OpTypePointer Input %uint
      %INDEX = OpVariable %_ptr_Input_uint Input
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%_ptr_Uniform_v4float = OpTypePointer Uniform %v4float
     %uint_0 = OpConstant %uint 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %34

         %34 = OpLabel
         %17 =   OpLoad %uint %INDEX
         %19 =   OpAccessChain %_ptr_Uniform_v4float %12 %uint_0 %17
         %21 =   OpLoad %v4float %19
         %22 =   OpCompositeExtract %float %21 0
         %24 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %24 %22
         %25 =   OpCompositeExtract %float %21 1
         %26 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %26 %25
         %28 =   OpCompositeExtract %float %21 2
         %29 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %29 %28
         %31 =   OpCompositeExtract %float %21 3
         %32 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %32 %31
                 OpReturn
               OpFunctionEnd

