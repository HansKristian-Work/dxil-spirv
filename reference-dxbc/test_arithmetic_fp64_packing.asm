SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 39
; Schema: 0
               OpCapability Shader
               OpCapability Float64
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint GLCompute %main "main" %10 %14
               OpExecutionMode %main LocalSize 1 1 1
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpExecutionMode %main SignedZeroInfNanPreserve 64
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %SSBO_0 "SSBO"
               OpDecorate %_runtimearr_v2uint ArrayStride 8
               OpMemberDecorate %SSBO 0 Offset 0
               OpDecorate %SSBO Block
               OpDecorate %10 DescriptorSet 0
               OpDecorate %10 Binding 0
               OpDecorate %10 NonWritable
               OpDecorate %10 Restrict
               OpDecorate %_runtimearr_v2uint_0 ArrayStride 8
               OpMemberDecorate %SSBO_0 0 Offset 0
               OpDecorate %SSBO_0 Block
               OpDecorate %14 DescriptorSet 0
               OpDecorate %14 Binding 0
               OpDecorate %14 NonReadable
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
     %v2uint = OpTypeVector %uint 2
%_runtimearr_v2uint = OpTypeRuntimeArray %v2uint
       %SSBO = OpTypeStruct %_runtimearr_v2uint
%_ptr_StorageBuffer_SSBO = OpTypePointer StorageBuffer %SSBO
         %10 = OpVariable %_ptr_StorageBuffer_SSBO StorageBuffer
%_runtimearr_v2uint_0 = OpTypeRuntimeArray %v2uint
     %SSBO_0 = OpTypeStruct %_runtimearr_v2uint_0
%_ptr_StorageBuffer_SSBO_0 = OpTypePointer StorageBuffer %SSBO_0
         %14 = OpVariable %_ptr_StorageBuffer_SSBO_0 StorageBuffer
     %uint_0 = OpConstant %uint 0
%_ptr_StorageBuffer_v2uint = OpTypePointer StorageBuffer %v2uint
     %uint_1 = OpConstant %uint 1
     %double = OpTypeFloat 64
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %37

         %37 = OpLabel
         %17 =   OpAccessChain %_ptr_StorageBuffer_v2uint %10 %uint_0 %uint_0
         %18 =   OpLoad %v2uint %17
         %19 =   OpCompositeExtract %uint %18 0
         %20 =   OpCompositeExtract %uint %18 1
         %21 =   OpCompositeConstruct %v2uint %19 %20
         %23 =   OpAccessChain %_ptr_StorageBuffer_v2uint %10 %uint_0 %uint_1
         %24 =   OpLoad %v2uint %23
         %25 =   OpCompositeExtract %uint %24 0
         %26 =   OpCompositeExtract %uint %24 1
         %27 =   OpCompositeConstruct %v2uint %25 %26
         %29 =   OpBitcast %double %21
         %30 =   OpBitcast %double %27
         %31 =   OpFAdd %double %29 %30
         %32 =   OpBitcast %v2uint %31
         %33 =   OpCompositeExtract %uint %32 0
         %34 =   OpCompositeExtract %uint %32 1
         %35 =   OpCompositeConstruct %v2uint %33 %34
         %36 =   OpAccessChain %_ptr_StorageBuffer_v2uint %14 %uint_0 %uint_0
                 OpStore %36 %35 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

