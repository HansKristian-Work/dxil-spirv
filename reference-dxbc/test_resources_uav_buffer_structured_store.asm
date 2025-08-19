SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 48
; Schema: 0
               OpCapability Shader
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %BUFFER_ADDRESS
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %BUFFER_ADDRESS "BUFFER_ADDRESS"
               OpDecorate %_runtimearr_uint ArrayStride 4
               OpMemberDecorate %SSBO 0 Offset 0
               OpDecorate %SSBO Block
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %9 NonReadable
               OpDecorate %BUFFER_ADDRESS Flat
               OpDecorate %BUFFER_ADDRESS Location 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_runtimearr_uint = OpTypeRuntimeArray %uint
       %SSBO = OpTypeStruct %_runtimearr_uint
%_ptr_StorageBuffer_SSBO = OpTypePointer StorageBuffer %SSBO
          %9 = OpVariable %_ptr_StorageBuffer_SSBO StorageBuffer
     %v2uint = OpTypeVector %uint 2
%_ptr_Input_v2uint = OpTypePointer Input %v2uint
%BUFFER_ADDRESS = OpVariable %_ptr_Input_v2uint Input
%_ptr_Input_uint = OpTypePointer Input %uint
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_7 = OpConstant %uint 7
     %uint_3 = OpConstant %uint 3
     %v3uint = OpTypeVector %uint 3
     %uint_2 = OpConstant %uint 2
     %uint_4 = OpConstant %uint 4
    %uint_20 = OpConstant %uint 20
%_ptr_StorageBuffer_uint = OpTypePointer StorageBuffer %uint
   %uint_143 = OpConstant %uint 143
     %uint_6 = OpConstant %uint 6
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %46

         %46 = OpLabel
         %14 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %16 =   OpLoad %uint %14
         %17 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_1
         %19 =   OpLoad %uint %17
         %29 =   OpIMul %uint %16 %uint_20
         %31 =   OpIAdd %uint %29 %19
         %33 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %31
                 OpStore %33 %uint_1 NonPrivatePointer
         %35 =   OpIAdd %uint %31 %uint_1
         %34 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %35
                 OpStore %34 %uint_2 NonPrivatePointer
         %37 =   OpIAdd %uint %31 %uint_2
         %36 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %37
                 OpStore %36 %uint_3 NonPrivatePointer
         %39 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_143
                 OpStore %39 %uint_1 NonPrivatePointer
         %41 =   OpIAdd %uint %uint_143 %uint_1
         %40 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %41
                 OpStore %40 %uint_2 NonPrivatePointer
         %43 =   OpIAdd %uint %uint_143 %uint_2
         %42 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %43
                 OpStore %42 %uint_3 NonPrivatePointer
         %45 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_143
                 OpStore %45 %uint_6 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

