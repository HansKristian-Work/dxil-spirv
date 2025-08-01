SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 51
; Schema: 0
               OpCapability Shader
               OpCapability UniformBufferArrayDynamicIndexing
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %11 %19 %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %_ ""
               OpName %__0 ""
               OpName %SV_TARGET "SV_TARGET"
               OpDecorate %_arr_float_uint_4 ArrayStride 4
               OpMemberDecorate %_ 0 Offset 0
               OpDecorate %_ Block
               OpDecorate %11 DescriptorSet 1
               OpDecorate %11 Binding 0
               OpDecorate %_arr_v4float_uint_8 ArrayStride 16
               OpMemberDecorate %__0 0 Offset 0
               OpDecorate %__0 Block
               OpDecorate %19 DescriptorSet 0
               OpDecorate %19 Binding 0
               OpDecorate %SV_TARGET Location 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
     %uint_4 = OpConstant %uint 4
      %float = OpTypeFloat 32
%_arr_float_uint_4 = OpTypeArray %float %uint_4
          %_ = OpTypeStruct %_arr_float_uint_4
%_ptr_Uniform__ = OpTypePointer Uniform %_
         %11 = OpVariable %_ptr_Uniform__ Uniform
     %uint_8 = OpConstant %uint 8
    %v4float = OpTypeVector %float 4
%_arr_v4float_uint_8 = OpTypeArray %v4float %uint_8
        %__0 = OpTypeStruct %_arr_v4float_uint_8
   %uint_256 = OpConstant %uint 256
%_arr___0_uint_256 = OpTypeArray %__0 %uint_256
%_ptr_Uniform__arr___0_uint_256 = OpTypePointer Uniform %_arr___0_uint_256
         %19 = OpVariable %_ptr_Uniform__arr___0_uint_256 Uniform
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
     %uint_0 = OpConstant %uint 0
    %uint_16 = OpConstant %uint 16
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_Uniform___0 = OpTypePointer Uniform %__0
%_ptr_Uniform_v4float = OpTypePointer Uniform %v4float
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %49

         %49 = OpLabel
         %22 =   OpIMul %uint %uint_0 %uint_16
         %25 =   OpIMul %uint %uint_1 %uint_4
         %27 =   OpIAdd %uint %22 %25
         %28 =   OpShiftRightLogical %uint %27 %uint_2
         %31 =   OpAccessChain %_ptr_Uniform_float %11 %uint_0 %28
         %32 =   OpLoad %float %31
         %33 =   OpBitcast %uint %32
         %35 =   OpAccessChain %_ptr_Uniform___0 %19 %33
         %37 =   OpAccessChain %_ptr_Uniform_v4float %35 %uint_0 %uint_2
         %38 =   OpLoad %v4float %37
         %39 =   OpCompositeExtract %float %38 0
         %41 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %41 %39
         %42 =   OpCompositeExtract %float %38 1
         %43 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %43 %42
         %44 =   OpCompositeExtract %float %38 2
         %45 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %45 %44
         %46 =   OpCompositeExtract %float %38 3
         %47 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %47 %46
                 OpReturn
               OpFunctionEnd

