SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 37
; Schema: 0
               OpCapability Shader
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability Sampled1D
               OpCapability ImageQuery
               OpCapability SignedZeroInfNanPreserve
               OpCapability RuntimeDescriptorArray
               OpCapability SampledImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %_ ""
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_2 "SV_TARGET_2"
               OpName %__0 ""
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %_arr_float_uint_4 ArrayStride 4
               OpMemberDecorate %_ 0 Offset 0
               OpDecorate %_ Block
               OpDecorate %15 DescriptorSet 0
               OpDecorate %15 Binding 0
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
               OpDecorate %SV_TARGET_2 Location 2
               OpDecorate %24 NonUniform
               OpDecorate %27 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 1D 0 1 0 1 Unknown
%_runtimearr_6 = OpTypeRuntimeArray %6
%_ptr_UniformConstant__runtimearr_6 = OpTypePointer UniformConstant %_runtimearr_6
          %9 = OpVariable %_ptr_UniformConstant__runtimearr_6 UniformConstant
       %uint = OpTypeInt 32 0
     %uint_4 = OpConstant %uint 4
%_arr_float_uint_4 = OpTypeArray %float %uint_4
          %_ = OpTypeStruct %_arr_float_uint_4
%_ptr_Uniform__ = OpTypePointer Uniform %_
         %15 = OpVariable %_ptr_Uniform__ Uniform
%_ptr_Output_uint = OpTypePointer Output %uint
  %SV_TARGET = OpVariable %_ptr_Output_uint Output
%SV_TARGET_1 = OpVariable %_ptr_Output_uint Output
%SV_TARGET_2 = OpVariable %_ptr_Output_uint Output
     %uint_0 = OpConstant %uint 0
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
     %v2uint = OpTypeVector %uint 2
        %__0 = OpTypeStruct %uint %uint
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %35

         %35 = OpLabel
         %22 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %uint_0
         %23 =   OpLoad %float %22
         %24 =   OpBitcast %uint %23
         %26 =   OpAccessChain %_ptr_UniformConstant_6 %9 %24
         %27 =   OpLoad %6 %26
         %29 =   OpImageQuerySizeLod %v2uint %27 %uint_0
         %30 =   OpCompositeExtract %uint %29 0
         %31 =   OpCompositeExtract %uint %29 1
                 OpStore %SV_TARGET %30
                 OpStore %SV_TARGET_1 %31
         %34 =   OpImageQueryLevels %uint %27
                 OpStore %SV_TARGET_2 %34
                 OpReturn
               OpFunctionEnd

