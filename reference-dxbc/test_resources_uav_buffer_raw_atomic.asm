SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 132
; Schema: 0
               OpCapability Shader
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %BUFFER_ADDRESS
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %BUFFER_ADDRESS "BUFFER_ADDRESS"
               OpDecorate %_runtimearr_uint ArrayStride 4
               OpMemberDecorate %SSBO 0 Offset 0
               OpDecorate %SSBO Block
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %BUFFER_ADDRESS Flat
               OpDecorate %BUFFER_ADDRESS Location 0
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
%_ptr_Input_uint = OpTypePointer Input %uint
     %uint_0 = OpConstant %uint 0
     %uint_4 = OpConstant %uint 4
     %uint_2 = OpConstant %uint 2
    %uint_16 = OpConstant %uint 16
     %uint_8 = OpConstant %uint 8
%_ptr_StorageBuffer_uint = OpTypePointer StorageBuffer %uint
     %uint_5 = OpConstant %uint 5
    %uint_10 = OpConstant %uint 10
     %uint_1 = OpConstant %uint 1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %130

        %130 = OpLabel
         %14 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %16 =   OpLoad %uint %14
         %17 =   OpIMul %uint %16 %uint_4
         %21 =   OpIMul %uint %uint_16 %16
         %25 =   OpIMul %uint %16 %uint_4
         %26 =   OpIAdd %uint %25 %uint_2
         %28 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %26
         %29 =   OpAtomicLoad %uint %28 %uint_5 %uint_0
         %31 =   OpIAdd %uint %29 %uint_10
         %33 =   OpIMul %uint %uint_16 %16
         %35 =   OpIMul %uint %16 %uint_4
         %36 =   OpIAdd %uint %35 %uint_2
         %37 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %36
         %38 =   OpAtomicExchange %uint %37 %uint_5 %uint_0 %31
         %40 =   OpIMul %uint %uint_16 %16
         %42 =   OpIMul %uint %16 %uint_4
         %43 =   OpIAdd %uint %42 %uint_2
         %44 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %43
         %45 =   OpAtomicCompareExchange %uint %44 %uint_5 %uint_0 %uint_0 %38 %uint_10
         %46 =   OpIMul %uint %uint_16 %16
         %48 =   OpIMul %uint %16 %uint_4
         %49 =   OpIAdd %uint %48 %uint_2
         %50 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %49
         %51 =   OpAtomicIAdd %uint %50 %uint_5 %uint_0 %45
         %52 =   OpIMul %uint %uint_16 %16
         %54 =   OpIMul %uint %16 %uint_4
         %55 =   OpIAdd %uint %54 %uint_2
         %56 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %55
         %57 =   OpAtomicISub %uint %56 %uint_5 %uint_0 %51
         %58 =   OpIMul %uint %uint_16 %16
         %60 =   OpIMul %uint %16 %uint_4
         %61 =   OpIAdd %uint %60 %uint_2
         %62 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %61
         %63 =   OpAtomicSMin %uint %62 %uint_5 %uint_0 %57
         %64 =   OpIMul %uint %uint_16 %16
         %66 =   OpIMul %uint %16 %uint_4
         %67 =   OpIAdd %uint %66 %uint_2
         %68 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %67
         %69 =   OpAtomicSMax %uint %68 %uint_5 %uint_0 %63
         %70 =   OpIMul %uint %uint_16 %16
         %72 =   OpIMul %uint %16 %uint_4
         %73 =   OpIAdd %uint %72 %uint_2
         %74 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %73
         %75 =   OpAtomicUMin %uint %74 %uint_5 %uint_0 %69
         %76 =   OpIMul %uint %uint_16 %16
         %78 =   OpIMul %uint %16 %uint_4
         %79 =   OpIAdd %uint %78 %uint_2
         %80 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %79
         %81 =   OpAtomicUMax %uint %80 %uint_5 %uint_0 %75
         %82 =   OpIMul %uint %uint_16 %16
         %84 =   OpIMul %uint %16 %uint_4
         %85 =   OpIAdd %uint %84 %uint_2
         %86 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %85
         %87 =   OpAtomicAnd %uint %86 %uint_5 %uint_0 %81
         %88 =   OpIMul %uint %uint_16 %16
         %90 =   OpIMul %uint %16 %uint_4
         %91 =   OpIAdd %uint %90 %uint_2
         %92 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %91
         %93 =   OpAtomicOr %uint %92 %uint_5 %uint_0 %87
         %94 =   OpIMul %uint %uint_16 %16
         %96 =   OpIMul %uint %16 %uint_4
         %97 =   OpIAdd %uint %96 %uint_2
         %98 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %97
         %99 =   OpAtomicXor %uint %98 %uint_5 %uint_0 %93
        %100 =   OpIMul %uint %uint_16 %16
        %102 =   OpIMul %uint %16 %uint_4
        %103 =   OpIAdd %uint %102 %uint_2
        %104 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %103
        %105 =   OpAtomicIAdd %uint %104 %uint_5 %uint_0 %uint_1
        %107 =   OpIMul %uint %uint_16 %16
        %109 =   OpIMul %uint %16 %uint_4
        %110 =   OpIAdd %uint %109 %uint_2
        %111 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %110
        %112 =   OpAtomicISub %uint %111 %uint_5 %uint_0 %uint_1
        %113 =   OpIMul %uint %uint_16 %16
        %115 =   OpIMul %uint %16 %uint_4
        %116 =   OpIAdd %uint %115 %uint_2
        %117 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %116
                 OpAtomicStore %117 %uint_5 %uint_0 %112
        %118 =   OpIMul %uint %uint_16 %16
        %120 =   OpIMul %uint %16 %uint_4
        %121 =   OpIAdd %uint %120 %uint_2
        %122 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %121
        %123 =   OpAtomicIAdd %uint %122 %uint_5 %uint_0 %uint_1
        %124 =   OpIMul %uint %uint_16 %16
        %126 =   OpIMul %uint %16 %uint_4
        %127 =   OpIAdd %uint %126 %uint_2
        %128 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %127
        %129 =   OpAtomicISub %uint %128 %uint_5 %uint_0 %uint_2
                 OpReturn
               OpFunctionEnd

