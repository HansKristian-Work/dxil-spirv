SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 59
; Schema: 0
               OpCapability Shader
               OpCapability ImageBuffer
               OpCapability RuntimeDescriptorArray
               OpCapability StorageTexelBufferArrayDynamicIndexing
               OpCapability StorageTexelBufferArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %BUFFER_INDEX %BUFFER_ADDRESS
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %BUFFER_INDEX "BUFFER_INDEX"
               OpName %BUFFER_ADDRESS "BUFFER_ADDRESS"
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %BUFFER_INDEX Flat
               OpDecorate %BUFFER_INDEX Location 0
               OpDecorate %BUFFER_INDEX Component 2
               OpDecorate %BUFFER_ADDRESS Flat
               OpDecorate %BUFFER_ADDRESS Location 0
               OpDecorate %15 NonUniform
               OpDecorate %23 NonUniform
               OpDecorate %28 NonUniform
               OpDecorate %31 NonUniform
               OpDecorate %33 NonUniform
               OpDecorate %35 NonUniform
               OpDecorate %37 NonUniform
               OpDecorate %39 NonUniform
               OpDecorate %41 NonUniform
               OpDecorate %43 NonUniform
               OpDecorate %45 NonUniform
               OpDecorate %47 NonUniform
               OpDecorate %49 NonUniform
               OpDecorate %51 NonUniform
               OpDecorate %54 NonUniform
               OpDecorate %56 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
          %6 = OpTypeImage %uint Buffer 0 0 0 2 R32ui
%_runtimearr_6 = OpTypeRuntimeArray %6
%_ptr_UniformConstant__runtimearr_6 = OpTypePointer UniformConstant %_runtimearr_6
          %9 = OpVariable %_ptr_UniformConstant__runtimearr_6 UniformConstant
%_ptr_Input_uint = OpTypePointer Input %uint
%BUFFER_INDEX = OpVariable %_ptr_Input_uint Input
     %v2uint = OpTypeVector %uint 2
%_ptr_Input_v2uint = OpTypePointer Input %v2uint
%BUFFER_ADDRESS = OpVariable %_ptr_Input_v2uint Input
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
     %uint_0 = OpConstant %uint 0
%_ptr_Image_uint = OpTypePointer Image %uint
     %uint_5 = OpConstant %uint 5
    %uint_10 = OpConstant %uint 10
     %uint_1 = OpConstant %uint 1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %57

         %57 = OpLabel
         %15 =   OpLoad %uint %BUFFER_INDEX
         %17 =   OpAccessChain %_ptr_UniformConstant_6 %9 %15
         %19 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %21 =   OpLoad %uint %19
         %23 =   OpImageTexelPointer %_ptr_Image_uint %17 %21 %uint_0
         %24 =   OpAtomicLoad %uint %23 %uint_5 %uint_0
         %26 =   OpIAdd %uint %24 %uint_10
         %28 =   OpImageTexelPointer %_ptr_Image_uint %17 %21 %uint_0
         %29 =   OpAtomicExchange %uint %28 %uint_5 %uint_0 %26
         %31 =   OpImageTexelPointer %_ptr_Image_uint %17 %21 %uint_0
         %32 =   OpAtomicCompareExchange %uint %31 %uint_5 %uint_0 %uint_0 %29 %uint_10
         %33 =   OpImageTexelPointer %_ptr_Image_uint %17 %21 %uint_0
         %34 =   OpAtomicIAdd %uint %33 %uint_5 %uint_0 %32
         %35 =   OpImageTexelPointer %_ptr_Image_uint %17 %21 %uint_0
         %36 =   OpAtomicISub %uint %35 %uint_5 %uint_0 %34
         %37 =   OpImageTexelPointer %_ptr_Image_uint %17 %21 %uint_0
         %38 =   OpAtomicSMin %uint %37 %uint_5 %uint_0 %36
         %39 =   OpImageTexelPointer %_ptr_Image_uint %17 %21 %uint_0
         %40 =   OpAtomicSMax %uint %39 %uint_5 %uint_0 %38
         %41 =   OpImageTexelPointer %_ptr_Image_uint %17 %21 %uint_0
         %42 =   OpAtomicUMin %uint %41 %uint_5 %uint_0 %40
         %43 =   OpImageTexelPointer %_ptr_Image_uint %17 %21 %uint_0
         %44 =   OpAtomicUMax %uint %43 %uint_5 %uint_0 %42
         %45 =   OpImageTexelPointer %_ptr_Image_uint %17 %21 %uint_0
         %46 =   OpAtomicAnd %uint %45 %uint_5 %uint_0 %44
         %47 =   OpImageTexelPointer %_ptr_Image_uint %17 %21 %uint_0
         %48 =   OpAtomicOr %uint %47 %uint_5 %uint_0 %46
         %49 =   OpImageTexelPointer %_ptr_Image_uint %17 %21 %uint_0
         %50 =   OpAtomicXor %uint %49 %uint_5 %uint_0 %48
         %51 =   OpImageTexelPointer %_ptr_Image_uint %17 %21 %uint_0
         %52 =   OpAtomicIAdd %uint %51 %uint_5 %uint_0 %uint_1
         %54 =   OpImageTexelPointer %_ptr_Image_uint %17 %21 %uint_0
         %55 =   OpAtomicISub %uint %54 %uint_5 %uint_0 %uint_1
         %56 =   OpImageTexelPointer %_ptr_Image_uint %17 %21 %uint_0
                 OpAtomicStore %56 %uint_5 %uint_0 %55
                 OpReturn
               OpFunctionEnd

