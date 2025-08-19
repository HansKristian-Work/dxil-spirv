SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 53
; Schema: 0
               OpCapability Shader
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint GLCompute %main "main" %9 %13
               OpExecutionMode %main LocalSize 1 1 1
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %SSBO_0 "SSBO"
               OpDecorate %_runtimearr_uint ArrayStride 4
               OpMemberDecorate %SSBO 0 Offset 0
               OpDecorate %SSBO Block
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %9 NonWritable
               OpDecorate %9 Restrict
               OpDecorate %_runtimearr_uint_0 ArrayStride 4
               OpMemberDecorate %SSBO_0 0 Offset 0
               OpDecorate %SSBO_0 Block
               OpDecorate %13 DescriptorSet 0
               OpDecorate %13 Binding 0
               OpDecorate %13 NonReadable
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_runtimearr_uint = OpTypeRuntimeArray %uint
       %SSBO = OpTypeStruct %_runtimearr_uint
%_ptr_StorageBuffer_SSBO = OpTypePointer StorageBuffer %SSBO
          %9 = OpVariable %_ptr_StorageBuffer_SSBO StorageBuffer
%_runtimearr_uint_0 = OpTypeRuntimeArray %uint
     %SSBO_0 = OpTypeStruct %_runtimearr_uint_0
%_ptr_StorageBuffer_SSBO_0 = OpTypePointer StorageBuffer %SSBO_0
         %13 = OpVariable %_ptr_StorageBuffer_SSBO_0 StorageBuffer
     %uint_0 = OpConstant %uint 0
%_ptr_StorageBuffer_uint = OpTypePointer StorageBuffer %uint
      %float = OpTypeFloat 32
     %uint_1 = OpConstant %uint 1
       %bool = OpTypeBool
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
     %uint_4 = OpConstant %uint 4
     %uint_5 = OpConstant %uint 5
     %uint_6 = OpConstant %uint 6
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %51

         %51 = OpLabel
         %16 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_0
         %17 =   OpLoad %uint %16
         %19 =   OpBitcast %float %17
         %21 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_1
         %22 =   OpLoad %uint %21
         %23 =   OpBitcast %float %22
         %25 =   OpFOrdEqual %bool %19 %23
         %26 =   OpSelect %uint %25 %uint_1 %uint_0
         %27 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_0
                 OpStore %27 %26 NonPrivatePointer
         %28 =   OpFUnordNotEqual %bool %19 %23
         %29 =   OpSelect %uint %28 %uint_1 %uint_0
         %30 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_1
                 OpStore %30 %29 NonPrivatePointer
         %31 =   OpFOrdLessThan %bool %19 %23
         %32 =   OpSelect %uint %31 %uint_1 %uint_0
         %34 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_2
                 OpStore %34 %32 NonPrivatePointer
         %35 =   OpFOrdLessThanEqual %bool %19 %23
         %36 =   OpSelect %uint %35 %uint_1 %uint_0
         %38 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_3
                 OpStore %38 %36 NonPrivatePointer
         %39 =   OpFOrdGreaterThan %bool %19 %23
         %40 =   OpSelect %uint %39 %uint_1 %uint_0
         %42 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_4
                 OpStore %42 %40 NonPrivatePointer
         %43 =   OpFOrdGreaterThanEqual %bool %19 %23
         %44 =   OpSelect %uint %43 %uint_1 %uint_0
         %46 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_5
                 OpStore %46 %44 NonPrivatePointer
         %47 =   OpIsNan %bool %19
         %48 =   OpSelect %uint %47 %uint_1 %uint_0
         %50 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_6
                 OpStore %50 %48 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

