SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 74
; Schema: 0
               OpCapability Shader
               OpCapability StorageBufferArrayDynamicIndexing
               OpCapability SignedZeroInfNanPreserve
               OpCapability RuntimeDescriptorArray
               OpCapability StorageBufferArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %10 %16 %BUFFER_INDEX %BUFFER_ADDRESS %SV_TARGET %SV_TARGET_1 %SV_TARGET_3
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %SSBO_0 "SSBO"
               OpName %BUFFER_INDEX "BUFFER_INDEX"
               OpName %BUFFER_ADDRESS "BUFFER_ADDRESS"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_3 "SV_TARGET_3"
               OpDecorate %_runtimearr_uint ArrayStride 4
               OpMemberDecorate %SSBO 0 Offset 0
               OpDecorate %SSBO Block
               OpDecorate %_runtimearr_v2uint ArrayStride 8
               OpMemberDecorate %SSBO_0 0 Offset 0
               OpDecorate %SSBO_0 Block
               OpDecorate %10 DescriptorSet 0
               OpDecorate %10 Binding 0
               OpDecorate %10 NonWritable
               OpDecorate %10 Aliased
               OpDecorate %16 DescriptorSet 0
               OpDecorate %16 Binding 0
               OpDecorate %16 NonWritable
               OpDecorate %16 Aliased
               OpDecorate %BUFFER_INDEX Flat
               OpDecorate %BUFFER_INDEX Location 0
               OpDecorate %BUFFER_INDEX Component 2
               OpDecorate %BUFFER_ADDRESS Flat
               OpDecorate %BUFFER_ADDRESS Location 0
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
               OpDecorate %SV_TARGET_3 Location 3
               OpDecorate %26 NonUniform
               OpDecorate %28 NonUniform
               OpDecorate %30 NonUniform
               OpDecorate %46 NonUniform
               OpDecorate %53 NonUniform
               OpDecorate %55 NonUniform
               OpDecorate %70 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_runtimearr_uint = OpTypeRuntimeArray %uint
       %SSBO = OpTypeStruct %_runtimearr_uint
%_runtimearr_SSBO = OpTypeRuntimeArray %SSBO
%_ptr_StorageBuffer__runtimearr_SSBO = OpTypePointer StorageBuffer %_runtimearr_SSBO
         %10 = OpVariable %_ptr_StorageBuffer__runtimearr_SSBO StorageBuffer
     %v2uint = OpTypeVector %uint 2
%_runtimearr_v2uint = OpTypeRuntimeArray %v2uint
     %SSBO_0 = OpTypeStruct %_runtimearr_v2uint
%_runtimearr_SSBO_0 = OpTypeRuntimeArray %SSBO_0
%_ptr_StorageBuffer__runtimearr_SSBO_0 = OpTypePointer StorageBuffer %_runtimearr_SSBO_0
         %16 = OpVariable %_ptr_StorageBuffer__runtimearr_SSBO_0 StorageBuffer
%_ptr_Input_uint = OpTypePointer Input %uint
%BUFFER_INDEX = OpVariable %_ptr_Input_uint Input
%_ptr_Input_v2uint = OpTypePointer Input %v2uint
%BUFFER_ADDRESS = OpVariable %_ptr_Input_v2uint Input
%_ptr_Output_v2uint = OpTypePointer Output %v2uint
  %SV_TARGET = OpVariable %_ptr_Output_v2uint Output
%SV_TARGET_1 = OpVariable %_ptr_Output_v2uint Output
%_ptr_Output_uint = OpTypePointer Output %uint
%SV_TARGET_3 = OpVariable %_ptr_Output_uint Output
%_ptr_StorageBuffer_SSBO = OpTypePointer StorageBuffer %SSBO
%_ptr_StorageBuffer_SSBO_0 = OpTypePointer StorageBuffer %SSBO_0
     %uint_0 = OpConstant %uint 0
     %uint_4 = OpConstant %uint 4
     %uint_2 = OpConstant %uint 2
    %uint_16 = OpConstant %uint 16
     %uint_8 = OpConstant %uint 8
     %uint_1 = OpConstant %uint 1
%_ptr_StorageBuffer_v2uint = OpTypePointer StorageBuffer %v2uint
     %uint_7 = OpConstant %uint 7
%_ptr_StorageBuffer_uint = OpTypePointer StorageBuffer %uint
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %72

         %72 = OpLabel
         %26 =   OpLoad %uint %BUFFER_INDEX
         %28 =   OpAccessChain %_ptr_StorageBuffer_SSBO %10 %26
         %30 =   OpAccessChain %_ptr_StorageBuffer_SSBO_0 %16 %26
         %31 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %33 =   OpLoad %uint %31
         %34 =   OpIMul %uint %33 %uint_4
         %38 =   OpIMul %uint %uint_16 %33
         %42 =   OpIMul %uint %33 %uint_2
         %43 =   OpIAdd %uint %42 %uint_1
         %46 =   OpAccessChain %_ptr_StorageBuffer_v2uint %30 %uint_0 %43
         %47 =   OpLoad %v2uint %46 NonPrivatePointer
         %48 =   OpCompositeExtract %uint %47 0
         %49 =   OpCompositeExtract %uint %47 1
         %53 =   OpAccessChain %_ptr_StorageBuffer_uint %28 %uint_0 %uint_7
         %54 =   OpLoad %uint %53 NonPrivatePointer
         %56 =   OpIAdd %uint %uint_7 %uint_1
         %55 =   OpAccessChain %_ptr_StorageBuffer_uint %28 %uint_0 %56
         %57 =   OpLoad %uint %55 NonPrivatePointer
         %58 =   OpCompositeConstruct %v2uint %54 %57
         %59 =   OpCompositeExtract %uint %58 0
         %60 =   OpCompositeExtract %uint %58 1
         %62 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_0
                 OpStore %62 %48
         %63 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_1
                 OpStore %63 %49
         %64 =   OpAccessChain %_ptr_Output_uint %SV_TARGET_1 %uint_0
                 OpStore %64 %59
         %65 =   OpAccessChain %_ptr_Output_uint %SV_TARGET_1 %uint_1
                 OpStore %65 %60
         %66 =   OpIMul %uint %uint_16 %33
         %68 =   OpIMul %uint %33 %uint_4
         %69 =   OpIAdd %uint %68 %uint_2
         %70 =   OpAccessChain %_ptr_StorageBuffer_uint %28 %uint_0 %69
         %71 =   OpLoad %uint %70 NonPrivatePointer
                 OpStore %SV_TARGET_3 %71
                 OpReturn
               OpFunctionEnd

