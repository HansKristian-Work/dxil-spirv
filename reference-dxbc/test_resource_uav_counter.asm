SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 21
; Schema: 0
               OpCapability Shader
               OpCapability ImageBuffer
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint GLCompute %main "main" %9 %12
               OpExecutionMode %main LocalSize 32 1 1
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpDecorate %_runtimearr_uint ArrayStride 4
               OpMemberDecorate %SSBO 0 Offset 0
               OpDecorate %SSBO Block
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %9 NonReadable
               OpDecorate %9 NonWritable
               OpDecorate %12 DescriptorSet 0
               OpDecorate %12 Binding 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_runtimearr_uint = OpTypeRuntimeArray %uint
       %SSBO = OpTypeStruct %_runtimearr_uint
%_ptr_StorageBuffer_SSBO = OpTypePointer StorageBuffer %SSBO
          %9 = OpVariable %_ptr_StorageBuffer_SSBO StorageBuffer
         %10 = OpTypeImage %uint Buffer 0 0 0 2 R32ui
%_ptr_UniformConstant_10 = OpTypePointer UniformConstant %10
         %12 = OpVariable %_ptr_UniformConstant_10 UniformConstant
%_ptr_Image_uint = OpTypePointer Image %uint
     %uint_0 = OpConstant %uint 0
     %uint_5 = OpConstant %uint 5
     %uint_1 = OpConstant %uint 1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %19

         %19 = OpLabel
         %14 =   OpImageTexelPointer %_ptr_Image_uint %12 %uint_0 %uint_0
         %16 =   OpAtomicIAdd %uint %14 %uint_5 %uint_0 %uint_1
                 OpReturn
               OpFunctionEnd

