SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 59
; Schema: 0
               OpCapability Shader
               OpCapability ImageBuffer
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %BUFFER_ADDRESS
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %BUFFER_ADDRESS "BUFFER_ADDRESS"
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %BUFFER_ADDRESS Flat
               OpDecorate %BUFFER_ADDRESS Location 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
          %6 = OpTypeImage %uint Buffer 0 0 0 2 R32ui
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
     %v2uint = OpTypeVector %uint 2
%_ptr_Input_v2uint = OpTypePointer Input %v2uint
%BUFFER_ADDRESS = OpVariable %_ptr_Input_v2uint Input
%_ptr_Input_uint = OpTypePointer Input %uint
     %uint_0 = OpConstant %uint 0
%_ptr_Image_uint = OpTypePointer Image %uint
     %uint_5 = OpConstant %uint 5
    %uint_10 = OpConstant %uint 10
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %57

         %57 = OpLabel
         %14 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %16 =   OpLoad %uint %14
         %18 =   OpImageTexelPointer %_ptr_Image_uint %8 %16 %uint_0
         %19 =   OpAtomicLoad %uint %18 %uint_5 %uint_0
         %21 =   OpIAdd %uint %19 %uint_10
         %23 =   OpImageTexelPointer %_ptr_Image_uint %8 %16 %uint_0
         %24 =   OpAtomicExchange %uint %23 %uint_5 %uint_0 %21
         %26 =   OpImageTexelPointer %_ptr_Image_uint %8 %16 %uint_0
         %27 =   OpAtomicCompareExchange %uint %26 %uint_5 %uint_0 %uint_0 %24 %uint_10
         %28 =   OpImageTexelPointer %_ptr_Image_uint %8 %16 %uint_0
         %29 =   OpAtomicIAdd %uint %28 %uint_5 %uint_0 %27
         %30 =   OpImageTexelPointer %_ptr_Image_uint %8 %16 %uint_0
         %31 =   OpAtomicISub %uint %30 %uint_5 %uint_0 %29
         %32 =   OpImageTexelPointer %_ptr_Image_uint %8 %16 %uint_0
         %33 =   OpAtomicSMin %uint %32 %uint_5 %uint_0 %31
         %34 =   OpImageTexelPointer %_ptr_Image_uint %8 %16 %uint_0
         %35 =   OpAtomicSMax %uint %34 %uint_5 %uint_0 %33
         %36 =   OpImageTexelPointer %_ptr_Image_uint %8 %16 %uint_0
         %37 =   OpAtomicUMin %uint %36 %uint_5 %uint_0 %35
         %38 =   OpImageTexelPointer %_ptr_Image_uint %8 %16 %uint_0
         %39 =   OpAtomicUMax %uint %38 %uint_5 %uint_0 %37
         %40 =   OpImageTexelPointer %_ptr_Image_uint %8 %16 %uint_0
         %41 =   OpAtomicAnd %uint %40 %uint_5 %uint_0 %39
         %42 =   OpImageTexelPointer %_ptr_Image_uint %8 %16 %uint_0
         %43 =   OpAtomicOr %uint %42 %uint_5 %uint_0 %41
         %44 =   OpImageTexelPointer %_ptr_Image_uint %8 %16 %uint_0
         %45 =   OpAtomicXor %uint %44 %uint_5 %uint_0 %43
         %46 =   OpImageTexelPointer %_ptr_Image_uint %8 %16 %uint_0
         %47 =   OpAtomicIAdd %uint %46 %uint_5 %uint_0 %uint_1
         %49 =   OpImageTexelPointer %_ptr_Image_uint %8 %16 %uint_0
         %50 =   OpAtomicISub %uint %49 %uint_5 %uint_0 %uint_1
         %51 =   OpImageTexelPointer %_ptr_Image_uint %8 %16 %uint_0
                 OpAtomicStore %51 %uint_5 %uint_0 %50
         %52 =   OpImageTexelPointer %_ptr_Image_uint %8 %16 %uint_0
         %53 =   OpAtomicIAdd %uint %52 %uint_5 %uint_0 %uint_1
         %54 =   OpImageTexelPointer %_ptr_Image_uint %8 %16 %uint_0
         %55 =   OpAtomicISub %uint %54 %uint_5 %uint_0 %uint_2
                 OpReturn
               OpFunctionEnd

