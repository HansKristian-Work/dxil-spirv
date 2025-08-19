SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 82
; Schema: 0
               OpCapability Shader
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
         %20 = OpExtInstImport "GLSL.std.450"
               OpMemoryModel Logical Vulkan
               OpEntryPoint GLCompute %main "main" %9 %13
               OpExecutionMode %main LocalSize 1 1 1
               OpExecutionMode %main SignedZeroInfNanPreserve 32
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
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
     %uint_4 = OpConstant %uint 4
     %uint_5 = OpConstant %uint 5
     %uint_6 = OpConstant %uint 6
    %float_1 = OpConstant %float 1
     %uint_7 = OpConstant %uint 7
     %uint_8 = OpConstant %uint 8
     %uint_9 = OpConstant %uint 9
    %uint_10 = OpConstant %uint 10
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %80

         %80 = OpLabel
         %16 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_0
         %17 =   OpLoad %uint %16
         %19 =   OpBitcast %float %17
         %21 =   OpExtInst %float %20 Trunc %19
         %22 =   OpExtInst %float %20 FAbs %21
         %23 =   OpFNegate %float %22
         %25 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_1
         %26 =   OpLoad %uint %25
         %27 =   OpBitcast %float %26
         %28 =   OpFAdd %float %23 %27
         %29 =   OpExtInst %float %20 RoundEven %28
         %31 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_2
         %32 =   OpLoad %uint %31
         %33 =   OpBitcast %float %32
         %34 =   OpFSub %float %29 %33
         %35 =   OpExtInst %float %20 Floor %34
         %37 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_3
         %38 =   OpLoad %uint %37
         %39 =   OpBitcast %float %38
         %40 =   OpFMul %float %35 %39
         %41 =   OpExtInst %float %20 Ceil %40
         %43 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_4
         %44 =   OpLoad %uint %43
         %45 =   OpBitcast %float %44
         %47 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_5
         %48 =   OpLoad %uint %47
         %49 =   OpBitcast %float %48
         %50 =   OpExtInst %float %20 Fma %41 %45 %49
         %52 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_6
         %53 =   OpLoad %uint %52
         %54 =   OpBitcast %float %53
         %55 =   OpFDiv %float %50 %54
         %56 =   OpFDiv %float %float_1 %55
         %58 =   OpExtInst %float %20 Fract %56
         %60 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_7
         %61 =   OpLoad %uint %60
         %62 =   OpBitcast %float %61
         %63 =   OpExtInst %float %20 NMin %58 %62
         %65 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_8
         %66 =   OpLoad %uint %65
         %67 =   OpBitcast %float %66
         %68 =   OpExtInst %float %20 NMax %63 %67
         %70 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_9
         %71 =   OpLoad %uint %70
         %72 =   OpBitcast %float %71
         %74 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_10
         %75 =   OpLoad %uint %74
         %76 =   OpBitcast %float %75
         %77 =   OpExtInst %float %20 NClamp %68 %72 %76
         %78 =   OpBitcast %uint %77
         %79 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_0
                 OpStore %79 %78 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

