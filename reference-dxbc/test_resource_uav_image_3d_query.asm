SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 31
; Schema: 0
               OpCapability Shader
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
          %6 = OpTypeImage %float 3D 0 0 0 2 Unknown
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
       %uint = OpTypeInt 32 0
     %v3uint = OpTypeVector %uint 3
%_ptr_Output_v3uint = OpTypePointer Output %v3uint
  %SV_TARGET = OpVariable %_ptr_Output_v3uint Output
%_ptr_Output_uint = OpTypePointer Output %uint
%SV_TARGET_1 = OpVariable %_ptr_Output_uint Output
          %_ = OpTypeStruct %v3uint %uint
     %uint_1 = OpConstant %uint 1
     %uint_0 = OpConstant %uint 0
     %uint_2 = OpConstant %uint 2
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %29

         %29 = OpLabel
         %15 =   OpLoad %6 %8
         %16 =   OpImageQuerySize %v3uint %15
         %17 =   OpCompositeExtract %uint %16 0
         %18 =   OpCompositeExtract %uint %16 1
         %19 =   OpCompositeExtract %uint %16 2
         %20 =   OpCompositeConstruct %v3uint %17 %18 %19
         %24 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_0
                 OpStore %24 %17
         %26 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_1
                 OpStore %26 %18
         %27 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_2
                 OpStore %27 %19
                 OpStore %SV_TARGET_1 %uint_1
                 OpReturn
               OpFunctionEnd

