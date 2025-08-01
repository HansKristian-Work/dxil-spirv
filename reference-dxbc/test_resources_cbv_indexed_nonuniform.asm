SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 39
; Schema: 0
               OpCapability Shader
               OpCapability UniformBufferArrayDynamicIndexing
               OpCapability RuntimeDescriptorArray
               OpCapability UniformBufferArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %13 %INDEX %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %_ ""
               OpName %INDEX "INDEX"
               OpName %SV_TARGET "SV_TARGET"
               OpDecorate %_arr_v4float_uint_8 ArrayStride 16
               OpMemberDecorate %_ 0 Offset 0
               OpDecorate %_ Block
               OpDecorate %13 DescriptorSet 0
               OpDecorate %13 Binding 0
               OpDecorate %INDEX Flat
               OpDecorate %INDEX Location 0
               OpDecorate %SV_TARGET Location 0
               OpDecorate %18 NonUniform
               OpDecorate %20 NonUniform
               OpDecorate %23 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
     %uint_8 = OpConstant %uint 8
      %float = OpTypeFloat 32
    %v4float = OpTypeVector %float 4
%_arr_v4float_uint_8 = OpTypeArray %v4float %uint_8
          %_ = OpTypeStruct %_arr_v4float_uint_8
%_runtimearr__ = OpTypeRuntimeArray %_
%_ptr_Uniform__runtimearr__ = OpTypePointer Uniform %_runtimearr__
         %13 = OpVariable %_ptr_Uniform__runtimearr__ Uniform
%_ptr_Input_uint = OpTypePointer Input %uint
      %INDEX = OpVariable %_ptr_Input_uint Input
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%_ptr_Uniform__ = OpTypePointer Uniform %_
     %uint_2 = OpConstant %uint 2
%_ptr_Uniform_v4float = OpTypePointer Uniform %v4float
     %uint_0 = OpConstant %uint 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_1 = OpConstant %uint 1
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %37

         %37 = OpLabel
         %18 =   OpLoad %uint %INDEX
         %20 =   OpAccessChain %_ptr_Uniform__ %13 %18
         %23 =   OpAccessChain %_ptr_Uniform_v4float %20 %uint_0 %uint_2
         %25 =   OpLoad %v4float %23
         %26 =   OpCompositeExtract %float %25 0
         %28 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %28 %26
         %29 =   OpCompositeExtract %float %25 1
         %30 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %30 %29
         %32 =   OpCompositeExtract %float %25 2
         %33 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %33 %32
         %34 =   OpCompositeExtract %float %25 3
         %35 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %35 %34
                 OpReturn
               OpFunctionEnd

