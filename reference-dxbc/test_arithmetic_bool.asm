SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 69
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
       %bool = OpTypeBool
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
     %uint_4 = OpConstant %uint 4
     %uint_5 = OpConstant %uint 5
     %uint_6 = OpConstant %uint 6
     %uint_7 = OpConstant %uint 7
     %uint_8 = OpConstant %uint 8
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %67

         %67 = OpLabel
         %16 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_0
         %17 =   OpLoad %uint %16
         %19 =   OpINotEqual %bool %uint_0 %17
         %21 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_1
         %22 =   OpLoad %uint %21
         %23 =   OpINotEqual %bool %uint_0 %22
         %24 =   OpLogicalAnd %bool %19 %23
         %25 =   OpSelect %uint %24 %uint_1 %uint_0
         %26 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_0
                 OpStore %26 %25 NonPrivatePointer
         %28 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_2
         %29 =   OpLoad %uint %28
         %30 =   OpINotEqual %bool %uint_0 %29
         %32 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_3
         %33 =   OpLoad %uint %32
         %34 =   OpINotEqual %bool %uint_0 %33
         %35 =   OpLogicalOr %bool %30 %34
         %36 =   OpSelect %uint %35 %uint_1 %uint_0
         %37 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_1
                 OpStore %37 %36 NonPrivatePointer
         %39 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_4
         %40 =   OpLoad %uint %39
         %41 =   OpINotEqual %bool %uint_0 %40
         %43 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_5
         %44 =   OpLoad %uint %43
         %45 =   OpINotEqual %bool %uint_0 %44
         %46 =   OpLogicalEqual %bool %41 %45
         %47 =   OpSelect %uint %46 %uint_1 %uint_0
         %48 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_2
                 OpStore %48 %47 NonPrivatePointer
         %50 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_6
         %51 =   OpLoad %uint %50
         %52 =   OpINotEqual %bool %uint_0 %51
         %54 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_7
         %55 =   OpLoad %uint %54
         %56 =   OpINotEqual %bool %uint_0 %55
         %57 =   OpLogicalNotEqual %bool %52 %56
         %58 =   OpSelect %uint %57 %uint_1 %uint_0
         %59 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_3
                 OpStore %59 %58 NonPrivatePointer
         %61 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_8
         %62 =   OpLoad %uint %61
         %63 =   OpINotEqual %bool %uint_0 %62
         %64 =   OpLogicalNot %bool %63
         %65 =   OpSelect %uint %64 %uint_1 %uint_0
         %66 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_4
                 OpStore %66 %65 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

