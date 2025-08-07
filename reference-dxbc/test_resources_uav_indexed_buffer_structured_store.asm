SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 53
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
               OpDecorate %38 NonUniform
               OpDecorate %39 NonUniform
               OpDecorate %41 NonUniform
               OpDecorate %44 NonUniform
               OpDecorate %45 NonUniform
               OpDecorate %47 NonUniform
               OpDecorate %50 NonUniform
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
                 OpBranch %51

         %51 = OpLabel
         %16 =   OpLoad %uint %BUFFER_INDEX
         %18 =   OpAccessChain %_ptr_StorageBuffer_SSBO %10 %16
         %19 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %21 =   OpLoad %uint %19
         %22 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_1
         %24 =   OpLoad %uint %22
         %34 =   OpIMul %uint %21 %uint_20
         %36 =   OpIAdd %uint %34 %24
         %38 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %36
                 OpStore %38 %uint_1 NonPrivatePointer
         %40 =   OpIAdd %uint %36 %uint_1
         %39 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %40
                 OpStore %39 %uint_2 NonPrivatePointer
         %42 =   OpIAdd %uint %36 %uint_2
         %41 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %42
                 OpStore %41 %uint_3 NonPrivatePointer
         %44 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %uint_143
                 OpStore %44 %uint_1 NonPrivatePointer
         %46 =   OpIAdd %uint %uint_143 %uint_1
         %45 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %46
                 OpStore %45 %uint_2 NonPrivatePointer
         %48 =   OpIAdd %uint %uint_143 %uint_2
         %47 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %48
                 OpStore %47 %uint_3 NonPrivatePointer
         %50 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %uint_143
                 OpStore %50 %uint_6 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

