SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 33
; Schema: 0
               OpCapability Shader
               OpCapability StorageBufferArrayDynamicIndexing
               OpCapability ImageBuffer
               OpCapability SignedZeroInfNanPreserve
               OpCapability RuntimeDescriptorArray
               OpCapability StorageTexelBufferArrayDynamicIndexing
               OpCapability StorageBufferArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint GLCompute %main "main" %10 %14 %SV_GROUPID
               OpExecutionMode %main LocalSize 32 1 1
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %SV_GROUPID "SV_GROUPID"
               OpDecorate %_runtimearr_uint ArrayStride 4
               OpMemberDecorate %SSBO 0 Offset 0
               OpDecorate %SSBO Block
               OpDecorate %10 DescriptorSet 0
               OpDecorate %10 Binding 0
               OpDecorate %10 NonReadable
               OpDecorate %10 NonWritable
               OpDecorate %14 DescriptorSet 0
               OpDecorate %14 Binding 0
               OpDecorate %SV_GROUPID BuiltIn WorkgroupId
               OpDecorate %21 NonUniform
               OpDecorate %27 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_runtimearr_uint = OpTypeRuntimeArray %uint
       %SSBO = OpTypeStruct %_runtimearr_uint
%_runtimearr_SSBO = OpTypeRuntimeArray %SSBO
%_ptr_StorageBuffer__runtimearr_SSBO = OpTypePointer StorageBuffer %_runtimearr_SSBO
         %10 = OpVariable %_ptr_StorageBuffer__runtimearr_SSBO StorageBuffer
         %11 = OpTypeImage %uint Buffer 0 0 0 2 R32ui
%_runtimearr_11 = OpTypeRuntimeArray %11
%_ptr_UniformConstant__runtimearr_11 = OpTypePointer UniformConstant %_runtimearr_11
         %14 = OpVariable %_ptr_UniformConstant__runtimearr_11 UniformConstant
     %v3uint = OpTypeVector %uint 3
%_ptr_Input_v3uint = OpTypePointer Input %v3uint
 %SV_GROUPID = OpVariable %_ptr_Input_v3uint Input
%_ptr_Input_uint = OpTypePointer Input %uint
     %uint_0 = OpConstant %uint 0
%_ptr_StorageBuffer_SSBO = OpTypePointer StorageBuffer %SSBO
%_ptr_UniformConstant_11 = OpTypePointer UniformConstant %11
%_ptr_Image_uint = OpTypePointer Image %uint
     %uint_5 = OpConstant %uint 5
     %uint_1 = OpConstant %uint 1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %31

         %31 = OpLabel
         %19 =   OpAccessChain %_ptr_Input_uint %SV_GROUPID %uint_0
         %21 =   OpLoad %uint %19
         %25 =   OpAccessChain %_ptr_UniformConstant_11 %14 %21
         %27 =   OpImageTexelPointer %_ptr_Image_uint %25 %uint_0 %uint_0
         %28 =   OpAtomicIAdd %uint %27 %uint_5 %uint_0 %uint_1
                 OpReturn
               OpFunctionEnd

