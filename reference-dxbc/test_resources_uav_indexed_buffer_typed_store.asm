SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 34
; Schema: 0
               OpCapability Shader
               OpCapability ImageBuffer
               OpCapability StorageImageWriteWithoutFormat
               OpCapability SignedZeroInfNanPreserve
               OpCapability RuntimeDescriptorArray
               OpCapability StorageTexelBufferArrayDynamicIndexing
               OpCapability StorageTexelBufferArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %BUFFER_INDEX %BUFFER_ADDRESS
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %BUFFER_INDEX "BUFFER_INDEX"
               OpName %BUFFER_ADDRESS "BUFFER_ADDRESS"
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %9 NonReadable
               OpDecorate %BUFFER_INDEX Flat
               OpDecorate %BUFFER_INDEX Location 0
               OpDecorate %BUFFER_INDEX Component 2
               OpDecorate %BUFFER_ADDRESS Flat
               OpDecorate %BUFFER_ADDRESS Location 0
               OpDecorate %16 NonUniform
               OpDecorate %19 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float Buffer 0 0 0 2 Unknown
%_runtimearr_6 = OpTypeRuntimeArray %6
%_ptr_UniformConstant__runtimearr_6 = OpTypePointer UniformConstant %_runtimearr_6
          %9 = OpVariable %_ptr_UniformConstant__runtimearr_6 UniformConstant
       %uint = OpTypeInt 32 0
%_ptr_Input_uint = OpTypePointer Input %uint
%BUFFER_INDEX = OpVariable %_ptr_Input_uint Input
     %v2uint = OpTypeVector %uint 2
%_ptr_Input_v2uint = OpTypePointer Input %v2uint
%BUFFER_ADDRESS = OpVariable %_ptr_Input_v2uint Input
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
     %uint_0 = OpConstant %uint 0
    %v4float = OpTypeVector %float 4
    %float_1 = OpConstant %float 1
    %float_2 = OpConstant %float 2
    %float_3 = OpConstant %float 3
    %float_4 = OpConstant %float 4
     %uint_7 = OpConstant %uint 7
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %32

         %32 = OpLabel
         %16 =   OpLoad %uint %BUFFER_INDEX
         %18 =   OpAccessChain %_ptr_UniformConstant_6 %9 %16
         %19 =   OpLoad %6 %18
         %20 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %22 =   OpLoad %uint %20
         %29 =   OpCompositeConstruct %v4float %float_1 %float_2 %float_3 %float_4
                 OpImageWrite %19 %22 %29 NonPrivateTexel
         %31 =   OpCompositeConstruct %v4float %float_1 %float_2 %float_3 %float_4
                 OpImageWrite %19 %uint_7 %31 NonPrivateTexel
                 OpReturn
               OpFunctionEnd

