SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 32
; Schema: 0
               OpCapability Shader
               OpCapability SampledCubeArray
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
          %6 = OpTypeImage %float Cube 0 1 0 1 Unknown
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
       %uint = OpTypeInt 32 0
     %v2uint = OpTypeVector %uint 2
%_ptr_Output_v2uint = OpTypePointer Output %v2uint
  %SV_TARGET = OpVariable %_ptr_Output_v2uint Output
%_ptr_Output_uint = OpTypePointer Output %uint
%SV_TARGET_1 = OpVariable %_ptr_Output_uint Output
%SV_TARGET_2 = OpVariable %_ptr_Output_uint Output
     %v3uint = OpTypeVector %uint 3
     %uint_0 = OpConstant %uint 0
          %_ = OpTypeStruct %v2uint %uint
     %uint_1 = OpConstant %uint 1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %30

         %30 = OpLabel
         %16 =   OpLoad %6 %8
         %18 =   OpImageQuerySizeLod %v3uint %16 %uint_0
         %20 =   OpCompositeExtract %uint %18 0
         %21 =   OpCompositeExtract %uint %18 1
         %22 =   OpCompositeConstruct %v2uint %20 %21
         %23 =   OpCompositeExtract %uint %18 2
         %26 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_0
                 OpStore %26 %20
         %27 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_1
                 OpStore %27 %21
                 OpStore %SV_TARGET_1 %23
         %29 =   OpImageQueryLevels %uint %16
                 OpStore %SV_TARGET_2 %29
                 OpReturn
               OpFunctionEnd

