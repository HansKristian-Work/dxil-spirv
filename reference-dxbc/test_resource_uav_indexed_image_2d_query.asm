SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 46
; Schema: 0
               OpCapability Shader
               OpCapability StorageImageArrayDynamicIndexing
               OpCapability ImageQuery
               OpCapability RuntimeDescriptorArray
               OpCapability StorageImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %SV_TARGET %SV_TARGET_1
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %_ ""
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %__0 ""
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %9 NonReadable
               OpDecorate %9 NonWritable
               OpDecorate %_arr_float_uint_4 ArrayStride 4
               OpMemberDecorate %_ 0 Offset 0
               OpDecorate %_ Block
               OpDecorate %15 DescriptorSet 0
               OpDecorate %15 Binding 0
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
               OpDecorate %31 NonUniform
               OpDecorate %34 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 2D 0 0 0 2 Unknown
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
     %uint_0 = OpConstant %uint 0
    %uint_16 = OpConstant %uint 16
     %uint_2 = OpConstant %uint 2
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
        %__0 = OpTypeStruct %v2uint %uint
     %uint_1 = OpConstant %uint 1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %44

         %44 = OpLabel
         %21 =   OpIMul %uint %uint_0 %uint_16
         %24 =   OpIMul %uint %uint_0 %uint_4
         %25 =   OpIAdd %uint %21 %24
         %26 =   OpShiftRightLogical %uint %25 %uint_2
         %29 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %26
         %30 =   OpLoad %float %29
         %31 =   OpBitcast %uint %30
         %33 =   OpAccessChain %_ptr_UniformConstant_6 %9 %31
         %34 =   OpLoad %6 %33
         %35 =   OpImageQuerySize %v2uint %34
         %36 =   OpCompositeExtract %uint %35 0
         %37 =   OpCompositeExtract %uint %35 1
         %38 =   OpCompositeConstruct %v2uint %36 %37
         %42 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_0
                 OpStore %42 %36
         %43 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_1
                 OpStore %43 %37
                 OpStore %SV_TARGET_1 %uint_1
                 OpReturn
               OpFunctionEnd

