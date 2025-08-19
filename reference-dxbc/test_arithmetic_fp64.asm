SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 90
; Schema: 0
               OpCapability Shader
               OpCapability Float64
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
         %22 = OpExtInstImport "GLSL.std.450"
               OpMemoryModel Logical Vulkan
               OpEntryPoint GLCompute %main "main" %9 %13
               OpExecutionMode %main LocalSize 1 1 1
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpExecutionMode %main SignedZeroInfNanPreserve 64
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
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
     %uint_4 = OpConstant %uint 4
     %uint_5 = OpConstant %uint 5
     %uint_6 = OpConstant %uint 6
   %double_1 = OpConstant %double 1
     %uint_7 = OpConstant %uint 7
     %uint_8 = OpConstant %uint 8
     %uint_9 = OpConstant %uint 9
    %uint_10 = OpConstant %uint 10
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %88

         %88 = OpLabel
         %16 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_0
         %17 =   OpLoad %uint %16
         %19 =   OpBitcast %float %17
         %21 =   OpFConvert %double %19
         %23 =   OpExtInst %double %22 FAbs %21
         %24 =   OpFNegate %double %23
         %26 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_1
         %27 =   OpLoad %uint %26
         %28 =   OpBitcast %float %27
         %29 =   OpFConvert %double %28
         %30 =   OpFAdd %double %24 %29
         %32 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_2
         %33 =   OpLoad %uint %32
         %34 =   OpBitcast %float %33
         %35 =   OpFConvert %double %34
         %36 =   OpFSub %double %30 %35
         %38 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_3
         %39 =   OpLoad %uint %38
         %40 =   OpBitcast %float %39
         %41 =   OpFConvert %double %40
         %42 =   OpFMul %double %36 %41
         %44 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_4
         %45 =   OpLoad %uint %44
         %46 =   OpBitcast %float %45
         %47 =   OpFConvert %double %46
         %49 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_5
         %50 =   OpLoad %uint %49
         %51 =   OpBitcast %float %50
         %52 =   OpFConvert %double %51
         %53 =   OpExtInst %double %22 Fma %42 %47 %52
         %55 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_6
         %56 =   OpLoad %uint %55
         %57 =   OpBitcast %float %56
         %58 =   OpFConvert %double %57
         %59 =   OpFDiv %double %53 %58
         %60 =   OpFDiv %double %double_1 %59
         %63 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_7
         %64 =   OpLoad %uint %63
         %65 =   OpBitcast %float %64
         %66 =   OpFConvert %double %65
         %67 =   OpExtInst %double %22 NMin %60 %66
         %69 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_8
         %70 =   OpLoad %uint %69
         %71 =   OpBitcast %float %70
         %72 =   OpFConvert %double %71
         %73 =   OpExtInst %double %22 NMax %67 %72
         %75 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_9
         %76 =   OpLoad %uint %75
         %77 =   OpBitcast %float %76
         %78 =   OpFConvert %double %77
         %80 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_10
         %81 =   OpLoad %uint %80
         %82 =   OpBitcast %float %81
         %83 =   OpFConvert %double %82
         %84 =   OpExtInst %double %22 NClamp %73 %78 %83
         %85 =   OpFConvert %float %84
         %86 =   OpBitcast %uint %85
         %87 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_0
                 OpStore %87 %86 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

