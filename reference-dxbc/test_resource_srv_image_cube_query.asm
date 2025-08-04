SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 30
; Schema: 0
               OpCapability Shader
               OpCapability ImageQuery
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2
               OpExecutionMode %main OriginUpperLeft
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
          %6 = OpTypeImage %float Cube 0 0 0 1 Unknown
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
       %uint = OpTypeInt 32 0
     %v2uint = OpTypeVector %uint 2
%_ptr_Output_v2uint = OpTypePointer Output %v2uint
  %SV_TARGET = OpVariable %_ptr_Output_v2uint Output
%_ptr_Output_uint = OpTypePointer Output %uint
%SV_TARGET_1 = OpVariable %_ptr_Output_uint Output
%SV_TARGET_2 = OpVariable %_ptr_Output_uint Output
     %uint_0 = OpConstant %uint 0
          %_ = OpTypeStruct %v2uint %uint
     %uint_1 = OpConstant %uint 1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %28

         %28 = OpLabel
         %16 =   OpLoad %6 %8
         %17 =   OpImageQuerySizeLod %v2uint %16 %uint_0
         %19 =   OpCompositeExtract %uint %17 0
         %20 =   OpCompositeExtract %uint %17 1
         %21 =   OpCompositeConstruct %v2uint %19 %20
         %25 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_0
                 OpStore %25 %19
         %26 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_1
                 OpStore %26 %20
                 OpStore %SV_TARGET_1 %uint_1
         %27 =   OpImageQueryLevels %uint %16
                 OpStore %SV_TARGET_2 %27
                 OpReturn
               OpFunctionEnd

