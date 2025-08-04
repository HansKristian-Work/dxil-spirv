SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 49
; Schema: 0
               OpCapability Shader
               OpCapability ImageBuffer
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %BUFFER_ADDRESS %SV_TARGET %SV_TARGET_1
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %BUFFER_ADDRESS "BUFFER_ADDRESS"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %8 NonWritable
               OpDecorate %BUFFER_ADDRESS Flat
               OpDecorate %BUFFER_ADDRESS Location 0
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float Buffer 0 0 0 2 R32f
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
       %uint = OpTypeInt 32 0
     %v2uint = OpTypeVector %uint 2
%_ptr_Input_v2uint = OpTypePointer Input %v2uint
%BUFFER_ADDRESS = OpVariable %_ptr_Input_v2uint Input
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_v4float Output
%_ptr_Input_uint = OpTypePointer Input %uint
     %uint_0 = OpConstant %uint 0
     %uint_7 = OpConstant %uint 7
%_ptr_Output_float = OpTypePointer Output %float
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %47

         %47 = OpLabel
         %17 =   OpLoad %6 %8
         %19 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %21 =   OpLoad %uint %19
         %22 =   OpImageRead %v4float %17 %21 NonPrivateTexel
         %23 =   OpCompositeExtract %float %22 0
         %24 =   OpCompositeExtract %float %22 1
         %25 =   OpCompositeExtract %float %22 2
         %26 =   OpCompositeExtract %float %22 3
         %29 =   OpImageRead %v4float %17 %uint_7 NonPrivateTexel
         %30 =   OpCompositeExtract %float %29 0
         %31 =   OpCompositeExtract %float %29 1
         %32 =   OpCompositeExtract %float %29 2
         %33 =   OpCompositeExtract %float %29 3
         %36 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %36 %23
         %37 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %37 %24
         %39 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %39 %25
         %41 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %41 %26
         %43 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %43 %30
         %44 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %44 %31
         %45 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %45 %32
         %46 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %46 %33
                 OpReturn
               OpFunctionEnd

