SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 95
; Schema: 0
               OpCapability Shader
               OpCapability Float16
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
         %22 = OpExtInstImport "GLSL.std.450"
               OpMemoryModel Logical Vulkan
               OpEntryPoint GLCompute %main "main" %9 %13
               OpExecutionMode %main LocalSize 1 1 1
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpExecutionMode %main SignedZeroInfNanPreserve 16
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
       %half = OpTypeFloat 16
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
     %uint_4 = OpConstant %uint 4
     %uint_5 = OpConstant %uint 5
     %uint_6 = OpConstant %uint 6
%half_0x1p_0 = OpConstant %half 0x1p+0
     %uint_7 = OpConstant %uint 7
     %uint_8 = OpConstant %uint 8
     %uint_9 = OpConstant %uint 9
    %uint_10 = OpConstant %uint 10
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %93

         %93 = OpLabel
         %16 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_0
         %17 =   OpLoad %uint %16
         %19 =   OpBitcast %float %17
         %21 =   OpFConvert %half %19
         %23 =   OpExtInst %half %22 Trunc %21
         %24 =   OpExtInst %half %22 FAbs %23
         %25 =   OpFNegate %half %24
         %27 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_1
         %28 =   OpLoad %uint %27
         %29 =   OpBitcast %float %28
         %30 =   OpFConvert %half %29
         %31 =   OpFAdd %half %25 %30
         %32 =   OpExtInst %half %22 RoundEven %31
         %34 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_2
         %35 =   OpLoad %uint %34
         %36 =   OpBitcast %float %35
         %37 =   OpFConvert %half %36
         %38 =   OpFSub %half %32 %37
         %39 =   OpExtInst %half %22 Floor %38
         %41 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_3
         %42 =   OpLoad %uint %41
         %43 =   OpBitcast %float %42
         %44 =   OpFConvert %half %43
         %45 =   OpFMul %half %39 %44
         %46 =   OpExtInst %half %22 Ceil %45
         %48 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_4
         %49 =   OpLoad %uint %48
         %50 =   OpBitcast %float %49
         %51 =   OpFConvert %half %50
         %53 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_5
         %54 =   OpLoad %uint %53
         %55 =   OpBitcast %float %54
         %56 =   OpFConvert %half %55
         %57 =   OpExtInst %half %22 Fma %46 %51 %56
         %59 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_6
         %60 =   OpLoad %uint %59
         %61 =   OpBitcast %float %60
         %62 =   OpFConvert %half %61
         %63 =   OpFDiv %half %57 %62
         %64 =   OpFDiv %half %half_0x1p_0 %63
         %66 =   OpExtInst %half %22 Fract %64
         %68 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_7
         %69 =   OpLoad %uint %68
         %70 =   OpBitcast %float %69
         %71 =   OpFConvert %half %70
         %72 =   OpExtInst %half %22 NMin %66 %71
         %74 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_8
         %75 =   OpLoad %uint %74
         %76 =   OpBitcast %float %75
         %77 =   OpFConvert %half %76
         %78 =   OpExtInst %half %22 NMax %72 %77
         %80 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_9
         %81 =   OpLoad %uint %80
         %82 =   OpBitcast %float %81
         %83 =   OpFConvert %half %82
         %85 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_10
         %86 =   OpLoad %uint %85
         %87 =   OpBitcast %float %86
         %88 =   OpFConvert %half %87
         %89 =   OpExtInst %half %22 NClamp %78 %83 %88
         %90 =   OpFConvert %float %89
         %91 =   OpBitcast %uint %90
         %92 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_0
                 OpStore %92 %91 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

