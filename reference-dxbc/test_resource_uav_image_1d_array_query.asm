SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 22
; Schema: 0
               OpCapability Shader
               OpCapability Image1D
               OpCapability ImageQuery
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %SV_TARGET %SV_TARGET_1
               OpExecutionMode %main OriginUpperLeft
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
          %6 = OpTypeImage %float 1D 0 1 0 2 Unknown
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
       %uint = OpTypeInt 32 0
%_ptr_Output_uint = OpTypePointer Output %uint
  %SV_TARGET = OpVariable %_ptr_Output_uint Output
%SV_TARGET_1 = OpVariable %_ptr_Output_uint Output
     %v2uint = OpTypeVector %uint 2
          %_ = OpTypeStruct %uint %uint
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %20

         %20 = OpLabel
         %13 =   OpLoad %6 %8
         %15 =   OpImageQuerySize %v2uint %13
         %16 =   OpCompositeExtract %uint %15 0
         %17 =   OpCompositeExtract %uint %15 1
                 OpStore %SV_TARGET %16
                 OpStore %SV_TARGET_1 %17
                 OpReturn
               OpFunctionEnd

