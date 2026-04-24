SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 66
; Schema: 0
               OpCapability Shader
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %14 %BUFFER_ADDRESS %SV_TARGET %SV_TARGET_1 %SV_TARGET_3
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %SSBO_0 "SSBO"
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
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %9 NonWritable
               OpDecorate %9 Aliased
               OpDecorate %14 DescriptorSet 0
               OpDecorate %14 Binding 0
               OpDecorate %14 NonWritable
               OpDecorate %14 Aliased
               OpDecorate %BUFFER_ADDRESS Flat
               OpDecorate %BUFFER_ADDRESS Location 0
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
               OpDecorate %SV_TARGET_3 Location 3
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_runtimearr_uint = OpTypeRuntimeArray %uint
       %SSBO = OpTypeStruct %_runtimearr_uint
%_ptr_StorageBuffer_SSBO = OpTypePointer StorageBuffer %SSBO
          %9 = OpVariable %_ptr_StorageBuffer_SSBO StorageBuffer
     %v2uint = OpTypeVector %uint 2
%_runtimearr_v2uint = OpTypeRuntimeArray %v2uint
     %SSBO_0 = OpTypeStruct %_runtimearr_v2uint
%_ptr_StorageBuffer_SSBO_0 = OpTypePointer StorageBuffer %SSBO_0
         %14 = OpVariable %_ptr_StorageBuffer_SSBO_0 StorageBuffer
%_ptr_Input_v2uint = OpTypePointer Input %v2uint
%BUFFER_ADDRESS = OpVariable %_ptr_Input_v2uint Input
%_ptr_Output_v2uint = OpTypePointer Output %v2uint
  %SV_TARGET = OpVariable %_ptr_Output_v2uint Output
%SV_TARGET_1 = OpVariable %_ptr_Output_v2uint Output
%_ptr_Output_uint = OpTypePointer Output %uint
%SV_TARGET_3 = OpVariable %_ptr_Output_uint Output
%_ptr_Input_uint = OpTypePointer Input %uint
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
                 OpBranch %64

         %64 = OpLabel
         %23 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %25 =   OpLoad %uint %23
         %26 =   OpIMul %uint %25 %uint_4
         %30 =   OpIMul %uint %uint_16 %25
         %34 =   OpIMul %uint %25 %uint_2
         %35 =   OpIAdd %uint %34 %uint_1
         %38 =   OpAccessChain %_ptr_StorageBuffer_v2uint %14 %uint_0 %35
         %39 =   OpLoad %v2uint %38 NonPrivatePointer
         %40 =   OpCompositeExtract %uint %39 0
         %41 =   OpCompositeExtract %uint %39 1
         %45 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_7
         %46 =   OpLoad %uint %45 NonPrivatePointer
         %48 =   OpIAdd %uint %uint_7 %uint_1
         %47 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %48
         %49 =   OpLoad %uint %47 NonPrivatePointer
         %50 =   OpCompositeConstruct %v2uint %46 %49
         %51 =   OpCompositeExtract %uint %50 0
         %52 =   OpCompositeExtract %uint %50 1
         %54 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_0
                 OpStore %54 %40
         %55 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_1
                 OpStore %55 %41
         %56 =   OpAccessChain %_ptr_Output_uint %SV_TARGET_1 %uint_0
                 OpStore %56 %51
         %57 =   OpAccessChain %_ptr_Output_uint %SV_TARGET_1 %uint_1
                 OpStore %57 %52
         %58 =   OpIMul %uint %uint_16 %25
         %60 =   OpIMul %uint %25 %uint_4
         %61 =   OpIAdd %uint %60 %uint_2
         %62 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %61
         %63 =   OpLoad %uint %62 NonPrivatePointer
                 OpStore %SV_TARGET_3 %63
                 OpReturn
               OpFunctionEnd

