SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 23
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %INDEX
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main EarlyFragmentTests
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %INDEX "INDEX"
               OpDecorate %_runtimearr_uint ArrayStride 4
               OpMemberDecorate %SSBO 0 Offset 0
               OpDecorate %SSBO Block
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %INDEX Flat
               OpDecorate %INDEX Location 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_runtimearr_uint = OpTypeRuntimeArray %uint
       %SSBO = OpTypeStruct %_runtimearr_uint
%_ptr_StorageBuffer_SSBO = OpTypePointer StorageBuffer %SSBO
          %9 = OpVariable %_ptr_StorageBuffer_SSBO StorageBuffer
%_ptr_Input_uint = OpTypePointer Input %uint
      %INDEX = OpVariable %_ptr_Input_uint Input
     %uint_4 = OpConstant %uint 4
%_ptr_StorageBuffer_uint = OpTypePointer StorageBuffer %uint
     %uint_0 = OpConstant %uint 0
     %uint_5 = OpConstant %uint 5
     %uint_1 = OpConstant %uint 1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %21

         %21 = OpLabel
         %12 =   OpLoad %uint %INDEX
         %16 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %12
         %18 =   OpAtomicOr %uint %16 %uint_5 %uint_0 %uint_1
                 OpReturn
               OpFunctionEnd

