SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 56
; Schema: 0
               OpCapability Shader
               OpCapability Float64
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint GLCompute %main "main" %9 %13
               OpExecutionMode %main LocalSize 1 1 1
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %SSBO_0 "SSBO"
               OpDecorate %_runtimearr_uint ArrayStride 4
               OpMemberDecorate %SSBO 0 Offset 0
               OpDecorate %SSBO Block
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %9 NonWritable
               OpDecorate %9 Restrict
               OpDecorate %_runtimearr_uint_0 ArrayStride 4
               OpMemberDecorate %SSBO_0 0 Offset 0
               OpDecorate %SSBO_0 Block
               OpDecorate %13 DescriptorSet 0
               OpDecorate %13 Binding 0
               OpDecorate %13 NonReadable
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_runtimearr_uint = OpTypeRuntimeArray %uint
       %SSBO = OpTypeStruct %_runtimearr_uint
%_ptr_StorageBuffer_SSBO = OpTypePointer StorageBuffer %SSBO
          %9 = OpVariable %_ptr_StorageBuffer_SSBO StorageBuffer
%_runtimearr_uint_0 = OpTypeRuntimeArray %uint
     %SSBO_0 = OpTypeStruct %_runtimearr_uint_0
%_ptr_StorageBuffer_SSBO_0 = OpTypePointer StorageBuffer %SSBO_0
         %13 = OpVariable %_ptr_StorageBuffer_SSBO_0 StorageBuffer
     %uint_0 = OpConstant %uint 0
%_ptr_StorageBuffer_uint = OpTypePointer StorageBuffer %uint
      %float = OpTypeFloat 32
     %double = OpTypeFloat 64
     %uint_1 = OpConstant %uint 1
       %bool = OpTypeBool
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
     %uint_4 = OpConstant %uint 4
     %uint_5 = OpConstant %uint 5
     %uint_6 = OpConstant %uint 6
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %54

         %54 = OpLabel
         %16 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_0
         %17 =   OpLoad %uint %16
         %19 =   OpBitcast %float %17
         %21 =   OpFConvert %double %19
         %23 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_1
         %24 =   OpLoad %uint %23
         %25 =   OpBitcast %float %24
         %26 =   OpFConvert %double %25
         %28 =   OpFOrdEqual %bool %21 %26
         %29 =   OpSelect %uint %28 %uint_1 %uint_0
         %30 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_0
                 OpStore %30 %29 NonPrivatePointer
         %31 =   OpFUnordNotEqual %bool %21 %26
         %32 =   OpSelect %uint %31 %uint_1 %uint_0
         %33 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_1
                 OpStore %33 %32 NonPrivatePointer
         %34 =   OpFOrdLessThan %bool %21 %26
         %35 =   OpSelect %uint %34 %uint_1 %uint_0
         %37 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_2
                 OpStore %37 %35 NonPrivatePointer
         %38 =   OpFOrdLessThanEqual %bool %21 %26
         %39 =   OpSelect %uint %38 %uint_1 %uint_0
         %41 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_3
                 OpStore %41 %39 NonPrivatePointer
         %42 =   OpFOrdGreaterThan %bool %21 %26
         %43 =   OpSelect %uint %42 %uint_1 %uint_0
         %45 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_4
                 OpStore %45 %43 NonPrivatePointer
         %46 =   OpFOrdGreaterThanEqual %bool %21 %26
         %47 =   OpSelect %uint %46 %uint_1 %uint_0
         %49 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_5
                 OpStore %49 %47 NonPrivatePointer
         %50 =   OpIsNan %bool %21
         %51 =   OpSelect %uint %50 %uint_1 %uint_0
         %53 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_6
                 OpStore %53 %51 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

