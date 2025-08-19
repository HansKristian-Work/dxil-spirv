SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 33
; Schema: 0
               OpCapability Shader
               OpCapability ImageQuery
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_2 "SV_TARGET_2"
               OpName %_ ""
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
               OpDecorate %SV_TARGET_2 Location 2
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 3D 0 0 0 1 Unknown
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
       %uint = OpTypeInt 32 0
     %v3uint = OpTypeVector %uint 3
%_ptr_Output_v3uint = OpTypePointer Output %v3uint
  %SV_TARGET = OpVariable %_ptr_Output_v3uint Output
%_ptr_Output_uint = OpTypePointer Output %uint
%SV_TARGET_1 = OpVariable %_ptr_Output_uint Output
%SV_TARGET_2 = OpVariable %_ptr_Output_uint Output
     %uint_0 = OpConstant %uint 0
          %_ = OpTypeStruct %v3uint %uint
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %31

         %31 = OpLabel
         %16 =   OpLoad %6 %8
         %17 =   OpImageQuerySizeLod %v3uint %16 %uint_0
         %19 =   OpCompositeExtract %uint %17 0
         %20 =   OpCompositeExtract %uint %17 1
         %21 =   OpCompositeExtract %uint %17 2
         %22 =   OpCompositeConstruct %v3uint %19 %20 %21
         %26 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_0
                 OpStore %26 %19
         %27 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_1
                 OpStore %27 %20
         %28 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_2
                 OpStore %28 %21
                 OpStore %SV_TARGET_1 %uint_1
         %30 =   OpImageQueryLevels %uint %16
                 OpStore %SV_TARGET_2 %30
                 OpReturn
               OpFunctionEnd

