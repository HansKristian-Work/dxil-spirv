SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 96
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
               OpEntryPoint Fragment %main "main" %10 %BUFFER_INDEX %BUFFER_ADDRESS %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %BUFFER_INDEX "BUFFER_INDEX"
               OpName %BUFFER_ADDRESS "BUFFER_ADDRESS"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_2 "SV_TARGET_2"
               OpName %SV_TARGET_3 "SV_TARGET_3"
               OpDecorate %_runtimearr_uint ArrayStride 4
               OpMemberDecorate %SSBO 0 Offset 0
               OpDecorate %SSBO Block
               OpDecorate %10 DescriptorSet 0
               OpDecorate %10 Binding 0
               OpDecorate %10 NonWritable
               OpDecorate %10 Restrict
               OpDecorate %BUFFER_INDEX Flat
               OpDecorate %BUFFER_INDEX Location 0
               OpDecorate %BUFFER_INDEX Component 2
               OpDecorate %BUFFER_ADDRESS Flat
               OpDecorate %BUFFER_ADDRESS Location 0
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
               OpDecorate %SV_TARGET_2 Location 2
               OpDecorate %SV_TARGET_3 Location 3
               OpDecorate %24 NonUniform
               OpDecorate %26 NonUniform
               OpDecorate %43 NonUniform
               OpDecorate %45 NonUniform
               OpDecorate %53 NonUniform
               OpDecorate %55 NonUniform
               OpDecorate %67 NonUniform
               OpDecorate %69 NonUniform
               OpDecorate %72 NonUniform
               OpDecorate %76 NonUniform
               OpDecorate %92 NonUniform
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
%_ptr_Output_v2uint = OpTypePointer Output %v2uint
  %SV_TARGET = OpVariable %_ptr_Output_v2uint Output
%SV_TARGET_1 = OpVariable %_ptr_Output_v2uint Output
     %v4uint = OpTypeVector %uint 4
%_ptr_Output_v4uint = OpTypePointer Output %v4uint
%SV_TARGET_2 = OpVariable %_ptr_Output_v4uint Output
%_ptr_Output_uint = OpTypePointer Output %uint
%SV_TARGET_3 = OpVariable %_ptr_Output_uint Output
%_ptr_StorageBuffer_SSBO = OpTypePointer StorageBuffer %SSBO
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_7 = OpConstant %uint 7
     %uint_3 = OpConstant %uint 3
     %uint_4 = OpConstant %uint 4
    %uint_20 = OpConstant %uint 20
%_ptr_StorageBuffer_uint = OpTypePointer StorageBuffer %uint
   %uint_143 = OpConstant %uint 143
   %uint_331 = OpConstant %uint 331
     %uint_2 = OpConstant %uint 2
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %94

         %94 = OpLabel
         %24 =   OpLoad %uint %BUFFER_INDEX
         %26 =   OpAccessChain %_ptr_StorageBuffer_SSBO %10 %24
         %27 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %29 =   OpLoad %uint %27
         %30 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_1
         %32 =   OpLoad %uint %30
         %39 =   OpIMul %uint %29 %uint_20
         %41 =   OpIAdd %uint %39 %32
         %43 =   OpAccessChain %_ptr_StorageBuffer_uint %26 %uint_0 %41
         %44 =   OpLoad %uint %43
         %46 =   OpIAdd %uint %41 %uint_1
         %45 =   OpAccessChain %_ptr_StorageBuffer_uint %26 %uint_0 %46
         %47 =   OpLoad %uint %45
         %48 =   OpCompositeConstruct %v2uint %44 %47
         %49 =   OpCompositeExtract %uint %48 0
         %50 =   OpCompositeExtract %uint %48 1
         %53 =   OpAccessChain %_ptr_StorageBuffer_uint %26 %uint_0 %uint_143
         %54 =   OpLoad %uint %53
         %56 =   OpIAdd %uint %uint_143 %uint_1
         %55 =   OpAccessChain %_ptr_StorageBuffer_uint %26 %uint_0 %56
         %57 =   OpLoad %uint %55
         %58 =   OpCompositeConstruct %v2uint %54 %57
         %59 =   OpCompositeExtract %uint %58 0
         %60 =   OpCompositeExtract %uint %58 1
         %62 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_0
                 OpStore %62 %49
         %63 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_1
                 OpStore %63 %50
         %64 =   OpAccessChain %_ptr_Output_uint %SV_TARGET_1 %uint_0
                 OpStore %64 %59
         %65 =   OpAccessChain %_ptr_Output_uint %SV_TARGET_1 %uint_1
                 OpStore %65 %60
         %67 =   OpAccessChain %_ptr_StorageBuffer_uint %26 %uint_0 %uint_331
         %68 =   OpLoad %uint %67
         %70 =   OpIAdd %uint %uint_331 %uint_1
         %69 =   OpAccessChain %_ptr_StorageBuffer_uint %26 %uint_0 %70
         %71 =   OpLoad %uint %69
         %73 =   OpIAdd %uint %uint_331 %uint_2
         %72 =   OpAccessChain %_ptr_StorageBuffer_uint %26 %uint_0 %73
         %75 =   OpLoad %uint %72
         %77 =   OpIAdd %uint %uint_331 %uint_3
         %76 =   OpAccessChain %_ptr_StorageBuffer_uint %26 %uint_0 %77
         %78 =   OpLoad %uint %76
         %79 =   OpCompositeConstruct %v4uint %68 %71 %75 %78
         %80 =   OpCompositeExtract %uint %79 0
         %81 =   OpCompositeExtract %uint %79 1
         %82 =   OpCompositeExtract %uint %79 2
         %83 =   OpCompositeExtract %uint %79 3
         %85 =   OpAccessChain %_ptr_Output_uint %SV_TARGET_2 %uint_0
                 OpStore %85 %80
         %86 =   OpAccessChain %_ptr_Output_uint %SV_TARGET_2 %uint_1
                 OpStore %86 %81
         %87 =   OpAccessChain %_ptr_Output_uint %SV_TARGET_2 %uint_2
                 OpStore %87 %82
         %88 =   OpAccessChain %_ptr_Output_uint %SV_TARGET_2 %uint_3
                 OpStore %88 %83
         %90 =   OpIMul %uint %29 %uint_20
         %91 =   OpIAdd %uint %90 %32
         %92 =   OpAccessChain %_ptr_StorageBuffer_uint %26 %uint_0 %91
         %93 =   OpLoad %uint %92
                 OpStore %SV_TARGET_3 %93
                 OpReturn
               OpFunctionEnd

