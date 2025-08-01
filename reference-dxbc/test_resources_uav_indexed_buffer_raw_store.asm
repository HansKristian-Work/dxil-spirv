SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 46
; Schema: 0
               OpCapability Shader
               OpCapability StorageBufferArrayDynamicIndexing
               OpCapability RuntimeDescriptorArray
               OpCapability StorageBufferArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %10 %BUFFER_INDEX %BUFFER_ADDRESS
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %BUFFER_INDEX "BUFFER_INDEX"
               OpName %BUFFER_ADDRESS "BUFFER_ADDRESS"
               OpDecorate %_runtimearr_uint ArrayStride 4
               OpMemberDecorate %SSBO 0 Offset 0
               OpDecorate %SSBO Block
               OpDecorate %10 DescriptorSet 0
               OpDecorate %10 Binding 0
               OpDecorate %10 NonReadable
               OpDecorate %BUFFER_INDEX Flat
               OpDecorate %BUFFER_INDEX Location 0
               OpDecorate %BUFFER_INDEX Component 2
               OpDecorate %BUFFER_ADDRESS Flat
               OpDecorate %BUFFER_ADDRESS Location 0
               OpDecorate %16 NonUniform
               OpDecorate %18 NonUniform
               OpDecorate %32 NonUniform
               OpDecorate %33 NonUniform
               OpDecorate %35 NonUniform
               OpDecorate %37 NonUniform
               OpDecorate %38 NonUniform
               OpDecorate %40 NonUniform
               OpDecorate %43 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_runtimearr_uint = OpTypeRuntimeArray %uint
       %SSBO = OpTypeStruct %_runtimearr_uint
%_runtimearr_SSBO = OpTypeRuntimeArray %SSBO
%_ptr_StorageBuffer__runtimearr_SSBO = OpTypePointer StorageBuffer %_runtimearr_SSBO
         %10 = OpVariable %_ptr_StorageBuffer__runtimearr_SSBO StorageBuffer
%_ptr_Input_uint = OpTypePointer Input %uint
%BUFFER_INDEX = OpVariable %_ptr_Input_uint Input
     %v2uint = OpTypeVector %uint 2
%_ptr_Input_v2uint = OpTypePointer Input %v2uint
%BUFFER_ADDRESS = OpVariable %_ptr_Input_v2uint Input
%_ptr_StorageBuffer_SSBO = OpTypePointer StorageBuffer %SSBO
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
                 OpBranch %44

         %44 = OpLabel
         %16 =   OpLoad %uint %BUFFER_INDEX
         %18 =   OpAccessChain %_ptr_StorageBuffer_SSBO %10 %16
         %19 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %21 =   OpLoad %uint %19
         %22 =   OpIMul %uint %21 %uint_4
         %24 =   OpIAdd %uint %22 %uint_2
         %30 =   OpShiftRightLogical %uint %24 %uint_2
         %32 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %30
                 OpStore %32 %uint_1 NonPrivatePointer
         %34 =   OpIAdd %uint %30 %uint_1
         %33 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %34
                 OpStore %33 %uint_2 NonPrivatePointer
         %36 =   OpIAdd %uint %30 %uint_2
         %35 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %36
                 OpStore %35 %uint_3 NonPrivatePointer
         %37 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %uint_1
                 OpStore %37 %uint_1 NonPrivatePointer
         %39 =   OpIAdd %uint %uint_1 %uint_1
         %38 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %39
                 OpStore %38 %uint_2 NonPrivatePointer
         %41 =   OpIAdd %uint %uint_1 %uint_2
         %40 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %41
                 OpStore %40 %uint_3 NonPrivatePointer
         %43 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %uint_1
                 OpStore %43 %uint_6 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

