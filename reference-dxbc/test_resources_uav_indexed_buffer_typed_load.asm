SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 54
; Schema: 0
               OpCapability Shader
               OpCapability ImageBuffer
               OpCapability RuntimeDescriptorArray
               OpCapability StorageTexelBufferArrayDynamicIndexing
               OpCapability StorageTexelBufferArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %BUFFER_INDEX %BUFFER_ADDRESS %SV_TARGET %SV_TARGET_1
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %BUFFER_INDEX "BUFFER_INDEX"
               OpName %BUFFER_ADDRESS "BUFFER_ADDRESS"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %9 NonWritable
               OpDecorate %BUFFER_INDEX Flat
               OpDecorate %BUFFER_INDEX Location 0
               OpDecorate %BUFFER_INDEX Component 2
               OpDecorate %BUFFER_ADDRESS Flat
               OpDecorate %BUFFER_ADDRESS Location 0
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
               OpDecorate %20 NonUniform
               OpDecorate %23 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float Buffer 0 0 0 2 R32f
%_runtimearr_6 = OpTypeRuntimeArray %6
%_ptr_UniformConstant__runtimearr_6 = OpTypePointer UniformConstant %_runtimearr_6
          %9 = OpVariable %_ptr_UniformConstant__runtimearr_6 UniformConstant
       %uint = OpTypeInt 32 0
%_ptr_Input_uint = OpTypePointer Input %uint
%BUFFER_INDEX = OpVariable %_ptr_Input_uint Input
     %v2uint = OpTypeVector %uint 2
%_ptr_Input_v2uint = OpTypePointer Input %v2uint
%BUFFER_ADDRESS = OpVariable %_ptr_Input_v2uint Input
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_v4float Output
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
     %uint_0 = OpConstant %uint 0
     %uint_7 = OpConstant %uint 7
%_ptr_Output_float = OpTypePointer Output %float
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %52

         %52 = OpLabel
         %20 =   OpLoad %uint %BUFFER_INDEX
         %22 =   OpAccessChain %_ptr_UniformConstant_6 %9 %20
         %23 =   OpLoad %6 %22
         %24 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %26 =   OpLoad %uint %24
         %27 =   OpImageRead %v4float %23 %26 NonPrivateTexel
         %28 =   OpCompositeExtract %float %27 0
         %29 =   OpCompositeExtract %float %27 1
         %30 =   OpCompositeExtract %float %27 2
         %31 =   OpCompositeExtract %float %27 3
         %34 =   OpImageRead %v4float %23 %uint_7 NonPrivateTexel
         %35 =   OpCompositeExtract %float %34 0
         %36 =   OpCompositeExtract %float %34 1
         %37 =   OpCompositeExtract %float %34 2
         %38 =   OpCompositeExtract %float %34 3
         %41 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %41 %28
         %42 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %42 %29
         %44 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %44 %30
         %46 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %46 %31
         %48 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %48 %35
         %49 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %49 %36
         %50 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %50 %37
         %51 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %51 %38
                 OpReturn
               OpFunctionEnd

