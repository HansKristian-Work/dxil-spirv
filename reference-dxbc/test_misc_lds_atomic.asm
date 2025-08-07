SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 40
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint GLCompute %main "main" %9 %13 %SV_DispatchThreadID %20
               OpExecutionMode %main LocalSize 1 1 1
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %SSBO_0 "SSBO"
               OpName %SV_DispatchThreadID "SV_DispatchThreadID"
               OpDecorate %_runtimearr_uint ArrayStride 4
               OpMemberDecorate %SSBO 0 Offset 0
               OpDecorate %SSBO Block
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 1
               OpDecorate %9 NonWritable
               OpDecorate %9 Restrict
               OpDecorate %_runtimearr_uint_0 ArrayStride 4
               OpMemberDecorate %SSBO_0 0 Offset 0
               OpDecorate %SSBO_0 Block
               OpDecorate %13 DescriptorSet 0
               OpDecorate %13 Binding 0
               OpDecorate %13 NonReadable
               OpDecorate %SV_DispatchThreadID BuiltIn GlobalInvocationId
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
     %v3uint = OpTypeVector %uint 3
%_ptr_Input_v3uint = OpTypePointer Input %v3uint
%SV_DispatchThreadID = OpVariable %_ptr_Input_v3uint Input
     %uint_1 = OpConstant %uint 1
%_arr_uint_uint_1 = OpTypeArray %uint %uint_1
%_ptr_Workgroup__arr_uint_uint_1 = OpTypePointer Workgroup %_arr_uint_uint_1
         %20 = OpVariable %_ptr_Workgroup__arr_uint_uint_1 Workgroup
%_ptr_Input_uint = OpTypePointer Input %uint
     %uint_0 = OpConstant %uint 0
     %v2uint = OpTypeVector %uint 2
%_ptr_StorageBuffer_uint = OpTypePointer StorageBuffer %uint
%_ptr_Workgroup_uint = OpTypePointer Workgroup %uint
     %uint_2 = OpConstant %uint 2
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %38

         %38 = OpLabel
         %22 =   OpAccessChain %_ptr_Input_uint %SV_DispatchThreadID %uint_0
         %24 =   OpLoad %uint %22
         %28 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %24
         %29 =   OpLoad %uint %28
         %31 =   OpInBoundsAccessChain %_ptr_Workgroup_uint %20 %uint_0
         %32 =   OpAtomicIAdd %uint %31 %uint_2 %uint_0 %29
         %34 =   OpInBoundsAccessChain %_ptr_Workgroup_uint %20 %uint_0
         %35 =   OpAtomicXor %uint %34 %uint_2 %uint_0 %29
         %37 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %24
                 OpStore %37 %35 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

