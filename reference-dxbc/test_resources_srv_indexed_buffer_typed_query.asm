SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 22
; Schema: 0
               OpCapability Shader
               OpCapability SampledBuffer
               OpCapability ImageQuery
               OpCapability RuntimeDescriptorArray
               OpCapability UniformTexelBufferArrayDynamicIndexing
               OpCapability UniformTexelBufferArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %BUFFER_INDEX %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %BUFFER_INDEX "BUFFER_INDEX"
               OpName %SV_TARGET "SV_TARGET"
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %BUFFER_INDEX Flat
               OpDecorate %BUFFER_INDEX Location 0
               OpDecorate %BUFFER_INDEX Component 2
               OpDecorate %SV_TARGET Location 0
               OpDecorate %15 NonUniform
               OpDecorate %18 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float Buffer 0 0 0 1 Unknown
%_runtimearr_6 = OpTypeRuntimeArray %6
%_ptr_UniformConstant__runtimearr_6 = OpTypePointer UniformConstant %_runtimearr_6
          %9 = OpVariable %_ptr_UniformConstant__runtimearr_6 UniformConstant
       %uint = OpTypeInt 32 0
%_ptr_Input_uint = OpTypePointer Input %uint
%BUFFER_INDEX = OpVariable %_ptr_Input_uint Input
%_ptr_Output_uint = OpTypePointer Output %uint
  %SV_TARGET = OpVariable %_ptr_Output_uint Output
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %20

         %20 = OpLabel
         %15 =   OpLoad %uint %BUFFER_INDEX
         %17 =   OpAccessChain %_ptr_UniformConstant_6 %9 %15
         %18 =   OpLoad %6 %17
         %19 =   OpImageQuerySize %uint %18
                 OpStore %SV_TARGET %19
                 OpReturn
               OpFunctionEnd

