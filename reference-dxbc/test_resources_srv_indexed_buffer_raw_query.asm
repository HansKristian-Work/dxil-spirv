SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 21
; Schema: 0
               OpCapability Shader
               OpCapability StorageBufferArrayDynamicIndexing
               OpCapability ImageQuery
               OpCapability SignedZeroInfNanPreserve
               OpCapability RuntimeDescriptorArray
               OpCapability StorageBufferArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %10 %BUFFER_INDEX %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %BUFFER_INDEX "BUFFER_INDEX"
               OpName %SV_TARGET "SV_TARGET"
               OpDecorate %_runtimearr_uint ArrayStride 4
               OpMemberDecorate %SSBO 0 Offset 0
               OpDecorate %SSBO Block
               OpDecorate %10 DescriptorSet 0
               OpDecorate %10 Binding 0
               OpDecorate %10 NonWritable
               OpDecorate %10 Restrict
               OpDecorate %BUFFER_INDEX Flat
               OpDecorate %BUFFER_INDEX Location 0
               OpDecorate %BUFFER_INDEX Component 2
               OpDecorate %SV_TARGET Location 0
               OpDecorate %15 NonUniform
               OpDecorate %17 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_runtimearr_uint = OpTypeRuntimeArray %uint
       %SSBO = OpTypeStruct %_runtimearr_uint
%_runtimearr_SSBO = OpTypeRuntimeArray %SSBO
%_ptr_StorageBuffer__runtimearr_SSBO = OpTypePointer StorageBuffer %_runtimearr_SSBO
         %10 = OpVariable %_ptr_StorageBuffer__runtimearr_SSBO StorageBuffer
%_ptr_Input_uint = OpTypePointer Input %uint
%BUFFER_INDEX = OpVariable %_ptr_Input_uint Input
%_ptr_Output_uint = OpTypePointer Output %uint
  %SV_TARGET = OpVariable %_ptr_Output_uint Output
%_ptr_StorageBuffer_SSBO = OpTypePointer StorageBuffer %SSBO
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %19

         %19 = OpLabel
         %15 =   OpLoad %uint %BUFFER_INDEX
         %17 =   OpAccessChain %_ptr_StorageBuffer_SSBO %10 %15
         %18 =   OpArrayLength %uint %17 0
                 OpStore %SV_TARGET %18
                 OpReturn
               OpFunctionEnd

