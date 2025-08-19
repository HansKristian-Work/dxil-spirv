SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 17
; Schema: 0
               OpCapability Shader
               OpCapability ImageQuery
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %SV_TARGET "SV_TARGET"
               OpDecorate %_runtimearr_uint ArrayStride 4
               OpMemberDecorate %SSBO 0 Offset 0
               OpDecorate %SSBO Block
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %9 NonReadable
               OpDecorate %9 NonWritable
               OpDecorate %SV_TARGET Location 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_runtimearr_uint = OpTypeRuntimeArray %uint
       %SSBO = OpTypeStruct %_runtimearr_uint
%_ptr_StorageBuffer_SSBO = OpTypePointer StorageBuffer %SSBO
          %9 = OpVariable %_ptr_StorageBuffer_SSBO StorageBuffer
%_ptr_Output_uint = OpTypePointer Output %uint
  %SV_TARGET = OpVariable %_ptr_Output_uint Output
    %uint_20 = OpConstant %uint 20
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %15

         %15 = OpLabel
         %12 =   OpArrayLength %uint %9 0
         %13 =   OpUDiv %uint %12 %uint_20
                 OpStore %SV_TARGET %13
                 OpReturn
               OpFunctionEnd

