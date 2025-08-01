SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 41
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %BUFFER_ADDRESS
               OpExecutionMode %main OriginUpperLeft
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
     %uint_4 = OpConstant %uint 4
     %uint_2 = OpConstant %uint 2
     %v3uint = OpTypeVector %uint 3
     %uint_1 = OpConstant %uint 1
     %uint_3 = OpConstant %uint 3
%_ptr_StorageBuffer_uint = OpTypePointer StorageBuffer %uint
     %uint_6 = OpConstant %uint 6
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %39

         %39 = OpLabel
         %14 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %16 =   OpLoad %uint %14
         %17 =   OpIMul %uint %16 %uint_4
         %19 =   OpIAdd %uint %17 %uint_2
         %25 =   OpShiftRightLogical %uint %19 %uint_2
         %27 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %25
                 OpStore %27 %uint_1 NonPrivatePointer
         %29 =   OpIAdd %uint %25 %uint_1
         %28 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %29
                 OpStore %28 %uint_2 NonPrivatePointer
         %31 =   OpIAdd %uint %25 %uint_2
         %30 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %31
                 OpStore %30 %uint_3 NonPrivatePointer
         %32 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_1
                 OpStore %32 %uint_1 NonPrivatePointer
         %34 =   OpIAdd %uint %uint_1 %uint_1
         %33 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %34
                 OpStore %33 %uint_2 NonPrivatePointer
         %36 =   OpIAdd %uint %uint_1 %uint_2
         %35 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %36
                 OpStore %35 %uint_3 NonPrivatePointer
         %38 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_1
                 OpStore %38 %uint_6 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

