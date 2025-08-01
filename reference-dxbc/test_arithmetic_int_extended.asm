SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 80
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint GLCompute %main "main" %10 %14
               OpExecutionMode %main LocalSize 1 1 1
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %SSBO_0 "SSBO"
               OpName %WideArithResult "WideArithResult"
               OpDecorate %_runtimearr_v2uint ArrayStride 8
               OpMemberDecorate %SSBO 0 Offset 0
               OpDecorate %SSBO Block
               OpDecorate %10 DescriptorSet 0
               OpDecorate %10 Binding 0
               OpDecorate %10 NonWritable
               OpDecorate %10 Restrict
               OpDecorate %_runtimearr_v2uint_0 ArrayStride 8
               OpMemberDecorate %SSBO_0 0 Offset 0
               OpDecorate %SSBO_0 Block
               OpDecorate %14 DescriptorSet 0
               OpDecorate %14 Binding 0
               OpDecorate %14 NonReadable
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
     %v2uint = OpTypeVector %uint 2
%_runtimearr_v2uint = OpTypeRuntimeArray %v2uint
       %SSBO = OpTypeStruct %_runtimearr_v2uint
%_ptr_StorageBuffer_SSBO = OpTypePointer StorageBuffer %SSBO
         %10 = OpVariable %_ptr_StorageBuffer_SSBO StorageBuffer
%_runtimearr_v2uint_0 = OpTypeRuntimeArray %v2uint
     %SSBO_0 = OpTypeStruct %_runtimearr_v2uint_0
%_ptr_StorageBuffer_SSBO_0 = OpTypePointer StorageBuffer %SSBO_0
         %14 = OpVariable %_ptr_StorageBuffer_SSBO_0 StorageBuffer
     %uint_0 = OpConstant %uint 0
%_ptr_StorageBuffer_v2uint = OpTypePointer StorageBuffer %v2uint
%WideArithResult = OpTypeStruct %uint %uint
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %78

         %78 = OpLabel
         %17 =   OpAccessChain %_ptr_StorageBuffer_v2uint %10 %uint_0 %uint_0
         %18 =   OpLoad %v2uint %17
         %19 =   OpCompositeExtract %uint %18 0
         %20 =   OpCompositeExtract %uint %18 1
         %23 =   OpIAddCarry %WideArithResult %19 %20
         %24 =   OpCompositeExtract %uint %23 0
         %25 =   OpCompositeExtract %uint %23 1
         %26 =   OpCompositeConstruct %v2uint %24 %25
         %27 =   OpCompositeExtract %uint %26 0
         %28 =   OpCompositeExtract %uint %26 1
         %29 =   OpCompositeConstruct %v2uint %27 %28
         %30 =   OpAccessChain %_ptr_StorageBuffer_v2uint %14 %uint_0 %uint_0
                 OpStore %30 %29 NonPrivatePointer
         %32 =   OpAccessChain %_ptr_StorageBuffer_v2uint %10 %uint_0 %uint_1
         %33 =   OpLoad %v2uint %32
         %34 =   OpCompositeExtract %uint %33 0
         %35 =   OpCompositeExtract %uint %33 1
         %37 =   OpISubBorrow %WideArithResult %34 %35
         %38 =   OpCompositeExtract %uint %37 0
         %39 =   OpCompositeExtract %uint %37 1
         %40 =   OpCompositeConstruct %v2uint %38 %39
         %41 =   OpCompositeExtract %uint %40 0
         %42 =   OpCompositeExtract %uint %40 1
         %43 =   OpCompositeConstruct %v2uint %41 %42
         %44 =   OpAccessChain %_ptr_StorageBuffer_v2uint %14 %uint_0 %uint_1
                 OpStore %44 %43 NonPrivatePointer
         %46 =   OpAccessChain %_ptr_StorageBuffer_v2uint %10 %uint_0 %uint_2
         %47 =   OpLoad %v2uint %46
         %48 =   OpCompositeExtract %uint %47 0
         %49 =   OpCompositeExtract %uint %47 1
         %51 =   OpBitcast %uint %48
         %52 =   OpBitcast %uint %49
         %53 =   OpSMulExtended %WideArithResult %51 %52
         %54 =   OpCompositeExtract %uint %53 0
         %55 =   OpCompositeExtract %uint %53 1
         %56 =   OpCompositeConstruct %v2uint %54 %55
         %57 =   OpCompositeExtract %uint %56 0
         %58 =   OpCompositeExtract %uint %56 1
         %59 =   OpBitcast %uint %57
         %60 =   OpBitcast %uint %58
         %62 =   OpCompositeConstruct %v2uint %59 %60
         %63 =   OpAccessChain %_ptr_StorageBuffer_v2uint %14 %uint_0 %uint_2
                 OpStore %63 %62 NonPrivatePointer
         %65 =   OpAccessChain %_ptr_StorageBuffer_v2uint %10 %uint_0 %uint_3
         %66 =   OpLoad %v2uint %65
         %67 =   OpCompositeExtract %uint %66 0
         %68 =   OpCompositeExtract %uint %66 1
         %70 =   OpUMulExtended %WideArithResult %67 %68
         %71 =   OpCompositeExtract %uint %70 0
         %72 =   OpCompositeExtract %uint %70 1
         %73 =   OpCompositeConstruct %v2uint %71 %72
         %74 =   OpCompositeExtract %uint %73 0
         %75 =   OpCompositeExtract %uint %73 1
         %76 =   OpCompositeConstruct %v2uint %74 %75
         %77 =   OpAccessChain %_ptr_StorageBuffer_v2uint %14 %uint_0 %uint_3
                 OpStore %77 %76 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

