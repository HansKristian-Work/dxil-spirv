SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 43
; Schema: 0
               OpCapability Shader
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability Sampled1D
               OpCapability ImageQuery
               OpCapability RuntimeDescriptorArray
               OpCapability SampledImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2
               OpExecutionMode %main OriginUpperLeft
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
               OpDecorate %30 NonUniform
               OpDecorate %33 NonUniform
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
    %uint_16 = OpConstant %uint 16
     %uint_2 = OpConstant %uint 2
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
     %v2uint = OpTypeVector %uint 2
        %__0 = OpTypeStruct %uint %uint
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %41

         %41 = OpLabel
         %20 =   OpIMul %uint %uint_0 %uint_16
         %23 =   OpIMul %uint %uint_0 %uint_4
         %24 =   OpIAdd %uint %20 %23
         %25 =   OpShiftRightLogical %uint %24 %uint_2
         %28 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %25
         %29 =   OpLoad %float %28
         %30 =   OpBitcast %uint %29
         %32 =   OpAccessChain %_ptr_UniformConstant_6 %9 %30
         %33 =   OpLoad %6 %32
         %35 =   OpImageQuerySizeLod %v2uint %33 %uint_0
         %36 =   OpCompositeExtract %uint %35 0
         %37 =   OpCompositeExtract %uint %35 1
                 OpStore %SV_TARGET %36
                 OpStore %SV_TARGET_1 %37
         %40 =   OpImageQueryLevels %uint %33
                 OpStore %SV_TARGET_2 %40
                 OpReturn
               OpFunctionEnd

