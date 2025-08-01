SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 29
; Schema: 0
               OpCapability Shader
               OpCapability ImageBuffer
               OpCapability StorageImageWriteWithoutFormat
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %BUFFER_ADDRESS
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %BUFFER_ADDRESS "BUFFER_ADDRESS"
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %8 NonReadable
               OpDecorate %BUFFER_ADDRESS Flat
               OpDecorate %BUFFER_ADDRESS Location 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float Buffer 0 0 0 2 Unknown
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
       %uint = OpTypeInt 32 0
     %v2uint = OpTypeVector %uint 2
%_ptr_Input_v2uint = OpTypePointer Input %v2uint
%BUFFER_ADDRESS = OpVariable %_ptr_Input_v2uint Input
%_ptr_Input_uint = OpTypePointer Input %uint
     %uint_0 = OpConstant %uint 0
    %v4float = OpTypeVector %float 4
    %float_1 = OpConstant %float 1
    %float_2 = OpConstant %float 2
    %float_3 = OpConstant %float 3
    %float_4 = OpConstant %float 4
     %uint_7 = OpConstant %uint 7
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %27

         %27 = OpLabel
         %13 =   OpLoad %6 %8
         %15 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %17 =   OpLoad %uint %15
         %24 =   OpCompositeConstruct %v4float %float_1 %float_2 %float_3 %float_4
                 OpImageWrite %13 %17 %24 NonPrivateTexel
         %26 =   OpCompositeConstruct %v4float %float_1 %float_2 %float_3 %float_4
                 OpImageWrite %13 %uint_7 %26 NonPrivateTexel
                 OpReturn
               OpFunctionEnd

