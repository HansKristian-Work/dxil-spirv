SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 62
; Schema: 0
               OpCapability Shader
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
     %uint_1 = OpConstant %uint 1
       %bool = OpTypeBool
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
     %uint_4 = OpConstant %uint 4
     %uint_5 = OpConstant %uint 5
     %uint_6 = OpConstant %uint 6
     %uint_7 = OpConstant %uint 7
     %uint_8 = OpConstant %uint 8
     %uint_9 = OpConstant %uint 9
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %60

         %60 = OpLabel
         %16 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_0
         %17 =   OpLoad %uint %16
         %19 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_1
         %20 =   OpLoad %uint %19
         %22 =   OpIEqual %bool %17 %20
         %23 =   OpSelect %uint %22 %uint_1 %uint_0
         %24 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_0
                 OpStore %24 %23 NonPrivatePointer
         %25 =   OpINotEqual %bool %17 %20
         %26 =   OpSelect %uint %25 %uint_1 %uint_0
         %27 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_1
                 OpStore %27 %26 NonPrivatePointer
         %28 =   OpSLessThan %bool %17 %20
         %29 =   OpSelect %uint %28 %uint_1 %uint_0
         %31 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_2
                 OpStore %31 %29 NonPrivatePointer
         %32 =   OpSLessThanEqual %bool %17 %20
         %33 =   OpSelect %uint %32 %uint_1 %uint_0
         %35 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_3
                 OpStore %35 %33 NonPrivatePointer
         %36 =   OpSGreaterThan %bool %17 %20
         %37 =   OpSelect %uint %36 %uint_1 %uint_0
         %39 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_4
                 OpStore %39 %37 NonPrivatePointer
         %40 =   OpSGreaterThanEqual %bool %17 %20
         %41 =   OpSelect %uint %40 %uint_1 %uint_0
         %43 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_5
                 OpStore %43 %41 NonPrivatePointer
         %44 =   OpULessThan %bool %17 %20
         %45 =   OpSelect %uint %44 %uint_1 %uint_0
         %47 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_6
                 OpStore %47 %45 NonPrivatePointer
         %48 =   OpULessThanEqual %bool %17 %20
         %49 =   OpSelect %uint %48 %uint_1 %uint_0
         %51 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_7
                 OpStore %51 %49 NonPrivatePointer
         %52 =   OpUGreaterThan %bool %17 %20
         %53 =   OpSelect %uint %52 %uint_1 %uint_0
         %55 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_8
                 OpStore %55 %53 NonPrivatePointer
         %56 =   OpUGreaterThanEqual %bool %17 %20
         %57 =   OpSelect %uint %56 %uint_1 %uint_0
         %59 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_9
                 OpStore %59 %57 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

