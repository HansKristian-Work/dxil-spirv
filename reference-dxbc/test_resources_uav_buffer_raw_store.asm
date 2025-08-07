SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 47
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
    %uint_16 = OpConstant %uint 16
     %uint_8 = OpConstant %uint 8
%_ptr_StorageBuffer_uint = OpTypePointer StorageBuffer %uint
     %uint_7 = OpConstant %uint 7
     %uint_6 = OpConstant %uint 6
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %45

         %45 = OpLabel
         %14 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %16 =   OpLoad %uint %14
         %17 =   OpIMul %uint %16 %uint_4
         %25 =   OpIMul %uint %uint_16 %16
         %29 =   OpIMul %uint %16 %uint_4
         %30 =   OpIAdd %uint %29 %uint_2
         %32 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %30
                 OpStore %32 %uint_1 NonPrivatePointer
         %34 =   OpIAdd %uint %30 %uint_1
         %33 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %34
                 OpStore %33 %uint_2 NonPrivatePointer
         %36 =   OpIAdd %uint %30 %uint_2
         %35 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %36
                 OpStore %35 %uint_3 NonPrivatePointer
         %38 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_7
                 OpStore %38 %uint_1 NonPrivatePointer
         %40 =   OpIAdd %uint %uint_7 %uint_1
         %39 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %40
                 OpStore %39 %uint_2 NonPrivatePointer
         %42 =   OpIAdd %uint %uint_7 %uint_2
         %41 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %42
                 OpStore %41 %uint_3 NonPrivatePointer
         %44 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_7
                 OpStore %44 %uint_6 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

