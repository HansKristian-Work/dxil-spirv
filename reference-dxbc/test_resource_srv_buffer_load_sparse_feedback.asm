SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 50
; Schema: 0
               OpCapability Shader
               OpCapability SparseResidency
               OpCapability SampledBuffer
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %SV_TARGET %SV_TARGET_1
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SparseTexel "SparseTexel"
               OpName %_ ""
               OpName %__0 ""
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float Buffer 0 0 0 1 Unknown
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%_ptr_Output_float = OpTypePointer Output %float
%SV_TARGET_1 = OpVariable %_ptr_Output_float Output
       %uint = OpTypeInt 32 0
 %uint_12345 = OpConstant %uint 12345
%SparseTexel = OpTypeStruct %uint %v4float
          %_ = OpTypeStruct %float %float %float %float %uint
        %__0 = OpTypeStruct %uint %v4float
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
       %bool = OpTypeBool
    %float_1 = OpConstant %float 1
    %float_0 = OpConstant %float 0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %48

         %48 = OpLabel
         %14 =   OpLoad %6 %8
         %18 =   OpImageSparseFetch %SparseTexel %14 %uint_12345
         %19 =   OpCompositeExtract %uint %18 0
         %20 =   OpCompositeExtract %v4float %18 1
         %21 =   OpCompositeExtract %float %20 0
         %22 =   OpCompositeExtract %float %20 1
         %23 =   OpCompositeExtract %float %20 2
         %24 =   OpCompositeExtract %float %20 3
         %26 =   OpCompositeConstruct %_ %21 %22 %23 %24 %19
         %27 =   OpCompositeExtract %uint %26 4
         %28 =   OpCompositeExtract %float %26 0
         %29 =   OpCompositeExtract %float %26 1
         %30 =   OpCompositeExtract %float %26 2
         %31 =   OpCompositeExtract %float %26 3
         %32 =   OpCompositeConstruct %v4float %28 %29 %30 %31
         %35 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %35 %28
         %37 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %37 %29
         %39 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %39 %30
         %41 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %41 %31
         %44 =   OpImageSparseTexelsResident %bool %27
         %45 =   OpSelect %float %44 %float_1 %float_0
                 OpStore %SV_TARGET_1 %45
                 OpReturn
               OpFunctionEnd

