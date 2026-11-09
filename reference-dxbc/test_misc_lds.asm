SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 67
; Schema: 0
               OpCapability Shader
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint GLCompute %main "main" %9 %13 %SV_DispatchThreadID %21 %gl_LocalInvocationIndex
               OpExecutionMode %main LocalSize 32 1 1
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %SSBO_0 "SSBO"
               OpName %SV_DispatchThreadID "SV_DispatchThreadID"
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
               OpDecorate %SV_DispatchThreadID BuiltIn GlobalInvocationId
               OpDecorate %gl_LocalInvocationIndex BuiltIn LocalInvocationIndex
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
    %uint_32 = OpConstant %uint 32
      %float = OpTypeFloat 32
%_arr_float_uint_32 = OpTypeArray %float %uint_32
%_ptr_Workgroup__arr_float_uint_32 = OpTypePointer Workgroup %_arr_float_uint_32
         %21 = OpVariable %_ptr_Workgroup__arr_float_uint_32 Workgroup
%_ptr_Input_uint = OpTypePointer Input %uint
     %uint_0 = OpConstant %uint 0
%gl_LocalInvocationIndex = OpVariable %_ptr_Input_uint Input
     %v2uint = OpTypeVector %uint 2
%_ptr_StorageBuffer_uint = OpTypePointer StorageBuffer %uint
%_ptr_Workgroup_float = OpTypePointer Workgroup %float
     %uint_2 = OpConstant %uint 2
    %uint_16 = OpConstant %uint 16
   %uint_264 = OpConstant %uint 264
       %bool = OpTypeBool
     %uint_1 = OpConstant %uint 1
       %main = OpFunction %void None %2

          %4 = OpLabel
         %50 =   OpUndef %float
                 OpBranch %59

         %59 = OpLabel
         %23 =   OpAccessChain %_ptr_Input_uint %SV_DispatchThreadID %uint_0
         %25 =   OpLoad %uint %23
         %27 =   OpLoad %uint %gl_LocalInvocationIndex
         %31 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %25
         %32 =   OpLoad %uint %31
         %33 =   OpBitcast %float %32
         %35 =   OpInBoundsAccessChain %_ptr_Workgroup_float %21 %27
                 OpStore %35 %33 MakePointerAvailable|NonPrivatePointer %uint_2
                 OpBranch %60

         %60 = OpLabel
         %37 =   OpPhi %uint %uint_16 %59 %39 %65
                 OpLoopMerge %66 %61 None
                 OpBranch %61

         %61 =   OpLabel
                   OpControlBarrier %uint_2 %uint_2 %uint_264
         %42 =     OpULessThan %bool %27 %37
                   OpSelectionMerge %63 None
                   OpBranchConditional %42 %62 %63

         %62 =       OpLabel
         %43 =         OpIAdd %uint %27 %37
         %44 =         OpInBoundsAccessChain %_ptr_Workgroup_float %21 %43
         %45 =         OpLoad %float %44 MakePointerVisible|NonPrivatePointer %uint_2
         %46 =         OpInBoundsAccessChain %_ptr_Workgroup_float %21 %27
         %47 =         OpLoad %float %46 MakePointerVisible|NonPrivatePointer %uint_2
         %48 =         OpFAdd %float %47 %45
                       OpBranch %63

         %63 =   OpLabel
         %49 =     OpPhi %float %50 %61 %48 %62
                   OpControlBarrier %uint_2 %uint_2 %uint_264
                   OpSelectionMerge %65 None
                   OpBranchConditional %42 %64 %65

         %64 =       OpLabel
         %51 =         OpInBoundsAccessChain %_ptr_Workgroup_float %21 %27
                       OpStore %51 %49 MakePointerAvailable|NonPrivatePointer %uint_2
                       OpBranch %65

         %65 =   OpLabel
         %39 =     OpShiftRightLogical %uint %37 %uint_1
         %53 =     OpINotEqual %bool %39 %uint_0
                   OpBranchConditional %53 %60 %66

         %66 = OpLabel
                 OpControlBarrier %uint_2 %uint_2 %uint_264
         %54 =   OpInBoundsAccessChain %_ptr_Workgroup_float %21 %uint_0
         %55 =   OpLoad %float %54 MakePointerVisible|NonPrivatePointer %uint_2
         %57 =   OpBitcast %uint %55
         %58 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %25
                 OpStore %58 %57 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

