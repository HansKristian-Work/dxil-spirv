SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 30
; Schema: 0
               OpCapability Shader
               OpCapability StorageBufferArrayDynamicIndexing
               OpCapability ImageBuffer
               OpCapability RuntimeDescriptorArray
               OpCapability StorageTexelBufferArrayDynamicIndexing
               OpCapability StorageBufferArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint GLCompute %main "main" %10 %13 %SV_GROUPID
               OpExecutionMode %main LocalSize 32 1 1
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
               OpDecorate %13 DescriptorSet 0
               OpDecorate %13 Binding 0
               OpDecorate %SV_GROUPID BuiltIn WorkgroupId
               OpDecorate %20 NonUniform
               OpDecorate %24 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_runtimearr_uint = OpTypeRuntimeArray %uint
       %SSBO = OpTypeStruct %_runtimearr_uint
%_runtimearr_SSBO = OpTypeRuntimeArray %SSBO
%_ptr_StorageBuffer__runtimearr_SSBO = OpTypePointer StorageBuffer %_runtimearr_SSBO
         %10 = OpVariable %_ptr_StorageBuffer__runtimearr_SSBO StorageBuffer
         %11 = OpTypeImage %uint Buffer 0 0 0 2 R32ui
%_ptr_UniformConstant_11 = OpTypePointer UniformConstant %11
         %13 = OpVariable %_ptr_UniformConstant_11 UniformConstant
     %v3uint = OpTypeVector %uint 3
%_ptr_Input_v3uint = OpTypePointer Input %v3uint
 %SV_GROUPID = OpVariable %_ptr_Input_v3uint Input
%_ptr_Input_uint = OpTypePointer Input %uint
     %uint_0 = OpConstant %uint 0
%_ptr_StorageBuffer_SSBO = OpTypePointer StorageBuffer %SSBO
%_ptr_Image_uint = OpTypePointer Image %uint
     %uint_5 = OpConstant %uint 5
     %uint_1 = OpConstant %uint 1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %28

         %28 = OpLabel
         %18 =   OpAccessChain %_ptr_Input_uint %SV_GROUPID %uint_0
         %20 =   OpLoad %uint %18
         %24 =   OpImageTexelPointer %_ptr_Image_uint %13 %uint_0 %uint_0
         %25 =   OpAtomicIAdd %uint %24 %uint_5 %uint_0 %uint_1
                 OpReturn
               OpFunctionEnd

