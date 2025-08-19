SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 30
; Schema: 0
               OpCapability Shader
               OpCapability ImageQuery
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
               OpName %_ ""
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %8 NonReadable
               OpDecorate %8 NonWritable
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 2D 0 1 0 2 Unknown
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
       %uint = OpTypeInt 32 0
     %v2uint = OpTypeVector %uint 2
%_ptr_Output_v2uint = OpTypePointer Output %v2uint
  %SV_TARGET = OpVariable %_ptr_Output_v2uint Output
%_ptr_Output_uint = OpTypePointer Output %uint
%SV_TARGET_1 = OpVariable %_ptr_Output_uint Output
     %v3uint = OpTypeVector %uint 3
          %_ = OpTypeStruct %v2uint %uint
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %28

         %28 = OpLabel
         %15 =   OpLoad %6 %8
         %17 =   OpImageQuerySize %v3uint %15
         %18 =   OpCompositeExtract %uint %17 0
         %19 =   OpCompositeExtract %uint %17 1
         %20 =   OpCompositeConstruct %v2uint %18 %19
         %21 =   OpCompositeExtract %uint %17 2
         %24 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_0
                 OpStore %24 %18
         %26 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_1
                 OpStore %26 %19
                 OpStore %SV_TARGET_1 %21
                 OpReturn
               OpFunctionEnd

