SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 91
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %BUFFER_ADDRESS %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %BUFFER_ADDRESS "BUFFER_ADDRESS"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_2 "SV_TARGET_2"
               OpName %SV_TARGET_3 "SV_TARGET_3"
               OpDecorate %_runtimearr_uint ArrayStride 4
               OpMemberDecorate %SSBO 0 Offset 0
               OpDecorate %SSBO Block
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %9 NonWritable
               OpDecorate %BUFFER_ADDRESS Flat
               OpDecorate %BUFFER_ADDRESS Location 0
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
               OpDecorate %SV_TARGET_2 Location 2
               OpDecorate %SV_TARGET_3 Location 3
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_runtimearr_uint = OpTypeRuntimeArray %uint
       %SSBO = OpTypeStruct %_runtimearr_uint
%_ptr_StorageBuffer_SSBO = OpTypePointer StorageBuffer %SSBO
          %9 = OpVariable %_ptr_StorageBuffer_SSBO StorageBuffer
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
%_ptr_Input_uint = OpTypePointer Input %uint
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
                 OpBranch %89

         %89 = OpLabel
         %22 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %24 =   OpLoad %uint %22
         %25 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_1
         %27 =   OpLoad %uint %25
         %34 =   OpIMul %uint %24 %uint_20
         %36 =   OpIAdd %uint %34 %27
         %38 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %36
         %39 =   OpLoad %uint %38 NonPrivatePointer
         %41 =   OpIAdd %uint %36 %uint_1
         %40 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %41
         %42 =   OpLoad %uint %40 NonPrivatePointer
         %43 =   OpCompositeConstruct %v2uint %39 %42
         %44 =   OpCompositeExtract %uint %43 0
         %45 =   OpCompositeExtract %uint %43 1
         %48 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_143
         %49 =   OpLoad %uint %48 NonPrivatePointer
         %51 =   OpIAdd %uint %uint_143 %uint_1
         %50 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %51
         %52 =   OpLoad %uint %50 NonPrivatePointer
         %53 =   OpCompositeConstruct %v2uint %49 %52
         %54 =   OpCompositeExtract %uint %53 0
         %55 =   OpCompositeExtract %uint %53 1
         %57 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_0
                 OpStore %57 %44
         %58 =   OpAccessChain %_ptr_Output_uint %SV_TARGET %uint_1
                 OpStore %58 %45
         %59 =   OpAccessChain %_ptr_Output_uint %SV_TARGET_1 %uint_0
                 OpStore %59 %54
         %60 =   OpAccessChain %_ptr_Output_uint %SV_TARGET_1 %uint_1
                 OpStore %60 %55
         %62 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_331
         %63 =   OpLoad %uint %62 NonPrivatePointer
         %65 =   OpIAdd %uint %uint_331 %uint_1
         %64 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %65
         %66 =   OpLoad %uint %64 NonPrivatePointer
         %68 =   OpIAdd %uint %uint_331 %uint_2
         %67 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %68
         %70 =   OpLoad %uint %67 NonPrivatePointer
         %72 =   OpIAdd %uint %uint_331 %uint_3
         %71 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %72
         %73 =   OpLoad %uint %71 NonPrivatePointer
         %74 =   OpCompositeConstruct %v4uint %63 %66 %70 %73
         %75 =   OpCompositeExtract %uint %74 0
         %76 =   OpCompositeExtract %uint %74 1
         %77 =   OpCompositeExtract %uint %74 2
         %78 =   OpCompositeExtract %uint %74 3
         %80 =   OpAccessChain %_ptr_Output_uint %SV_TARGET_2 %uint_0
                 OpStore %80 %75
         %81 =   OpAccessChain %_ptr_Output_uint %SV_TARGET_2 %uint_1
                 OpStore %81 %76
         %82 =   OpAccessChain %_ptr_Output_uint %SV_TARGET_2 %uint_2
                 OpStore %82 %77
         %83 =   OpAccessChain %_ptr_Output_uint %SV_TARGET_2 %uint_3
                 OpStore %83 %78
         %85 =   OpIMul %uint %24 %uint_20
         %86 =   OpIAdd %uint %85 %27
         %87 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %86
         %88 =   OpLoad %uint %87 NonPrivatePointer
                 OpStore %SV_TARGET_3 %88
                 OpReturn
               OpFunctionEnd

