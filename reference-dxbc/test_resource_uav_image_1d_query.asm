SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 20
; Schema: 0
               OpCapability Shader
               OpCapability Image1D
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
          %6 = OpTypeImage %float 1D 0 0 0 2 Unknown
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
       %uint = OpTypeInt 32 0
%_ptr_Output_uint = OpTypePointer Output %uint
  %SV_TARGET = OpVariable %_ptr_Output_uint Output
%SV_TARGET_1 = OpVariable %_ptr_Output_uint Output
          %_ = OpTypeStruct %uint %uint
     %uint_1 = OpConstant %uint 1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %18

         %18 = OpLabel
         %13 =   OpLoad %6 %8
         %14 =   OpImageQuerySize %uint %13
                 OpStore %SV_TARGET %14
                 OpStore %SV_TARGET_1 %uint_1
                 OpReturn
               OpFunctionEnd

