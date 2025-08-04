SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 42
; Schema: 0
               OpCapability Shader
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability ImageQuery
               OpCapability RuntimeDescriptorArray
               OpCapability SampledImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %SV_TARGET %SV_TARGET_1 %SV_TARGET_3
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %_ ""
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_3 "SV_TARGET_3"
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
               OpDecorate %SV_TARGET_3 Location 3
               OpDecorate %26 NonUniform
               OpDecorate %29 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 2D 0 0 1 1 Unknown
%_runtimearr_6 = OpTypeRuntimeArray %6
%_ptr_UniformConstant__runtimearr_6 = OpTypePointer UniformConstant %_runtimearr_6
          %9 = OpVariable %_ptr_UniformConstant__runtimearr_6 UniformConstant
       %uint = OpTypeInt 32 0
     %uint_4 = OpConstant %uint 4
%_arr_float_uint_4 = OpTypeArray %float %uint_4
          %_ = OpTypeStruct %_arr_float_uint_4
%_ptr_Uniform__ = OpTypePointer Uniform %_
         %15 = OpVariable %_ptr_Uniform__ Uniform
     %v2uint = OpTypeVector %uint 2
%_ptr_Output_v2uint = OpTypePointer Output %v2uint
  %SV_TARGET = OpVariable %_ptr_Output_v2uint Output
%_ptr_Output_uint = OpTypePointer Output %uint
%SV_TARGET_1 = OpVariable %_ptr_Output_uint Output
%SV_TARGET_3 = OpVariable %_ptr_Output_uint Output
     %uint_0 = OpConstant %uint 0
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
        %__0 = OpTypeStruct %v2uint %uint
     %uint_1 = OpConstant %uint 1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %40

         %40 = OpLabel
         %24 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %uint_0
         %25 =   OpLoad %float %24
         %26 =   OpBitcast %uint %25
         %28 =   OpAccessChain %_ptr_UniformConstant_6 %9 %26
         %29 =   OpLoad %6 %28
         %30 =   OpImageQuerySize %v2uint %29
         %31 =   OpCompositeExtract %uint %30 0
         %32 =   OpCompositeExtract %uint %30 1
         %33 =   OpCompositeConstruct %v2uint %31 %32
         %37 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_0
                 OpStore %37 %31
         %38 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_1
                 OpStore %38 %32
                 OpStore %SV_TARGET_1 %uint_1
         %39 =   OpImageQuerySamples %uint %29
                 OpStore %SV_TARGET_3 %39
                 OpReturn
               OpFunctionEnd

