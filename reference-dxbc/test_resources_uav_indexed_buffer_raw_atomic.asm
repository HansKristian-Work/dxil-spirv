SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 137
; Schema: 0
               OpCapability Shader
               OpCapability StorageBufferArrayDynamicIndexing
               OpCapability SignedZeroInfNanPreserve
               OpCapability RuntimeDescriptorArray
               OpCapability StorageBufferArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %10 %BUFFER_INDEX %BUFFER_ADDRESS
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %BUFFER_INDEX "BUFFER_INDEX"
               OpName %BUFFER_ADDRESS "BUFFER_ADDRESS"
               OpDecorate %_runtimearr_uint ArrayStride 4
               OpMemberDecorate %SSBO 0 Offset 0
               OpDecorate %SSBO Block
               OpDecorate %10 DescriptorSet 0
               OpDecorate %10 Binding 0
               OpDecorate %BUFFER_INDEX Flat
               OpDecorate %BUFFER_INDEX Location 0
               OpDecorate %BUFFER_INDEX Component 2
               OpDecorate %BUFFER_ADDRESS Flat
               OpDecorate %BUFFER_ADDRESS Location 0
               OpDecorate %16 NonUniform
               OpDecorate %18 NonUniform
               OpDecorate %33 NonUniform
               OpDecorate %42 NonUniform
               OpDecorate %49 NonUniform
               OpDecorate %55 NonUniform
               OpDecorate %61 NonUniform
               OpDecorate %67 NonUniform
               OpDecorate %73 NonUniform
               OpDecorate %79 NonUniform
               OpDecorate %85 NonUniform
               OpDecorate %91 NonUniform
               OpDecorate %97 NonUniform
               OpDecorate %103 NonUniform
               OpDecorate %109 NonUniform
               OpDecorate %116 NonUniform
               OpDecorate %122 NonUniform
               OpDecorate %127 NonUniform
               OpDecorate %133 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_runtimearr_uint = OpTypeRuntimeArray %uint
       %SSBO = OpTypeStruct %_runtimearr_uint
%_runtimearr_SSBO = OpTypeRuntimeArray %SSBO
%_ptr_StorageBuffer__runtimearr_SSBO = OpTypePointer StorageBuffer %_runtimearr_SSBO
         %10 = OpVariable %_ptr_StorageBuffer__runtimearr_SSBO StorageBuffer
%_ptr_Input_uint = OpTypePointer Input %uint
%BUFFER_INDEX = OpVariable %_ptr_Input_uint Input
     %v2uint = OpTypeVector %uint 2
%_ptr_Input_v2uint = OpTypePointer Input %v2uint
%BUFFER_ADDRESS = OpVariable %_ptr_Input_v2uint Input
%_ptr_StorageBuffer_SSBO = OpTypePointer StorageBuffer %SSBO
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
                 OpBranch %135

        %135 = OpLabel
         %16 =   OpLoad %uint %BUFFER_INDEX
         %18 =   OpAccessChain %_ptr_StorageBuffer_SSBO %10 %16
         %19 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %21 =   OpLoad %uint %19
         %22 =   OpIMul %uint %21 %uint_4
         %26 =   OpIMul %uint %uint_16 %21
         %30 =   OpIMul %uint %21 %uint_4
         %31 =   OpIAdd %uint %30 %uint_2
         %33 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %31
         %34 =   OpAtomicLoad %uint %33 %uint_5 %uint_0
         %36 =   OpIAdd %uint %34 %uint_10
         %38 =   OpIMul %uint %uint_16 %21
         %40 =   OpIMul %uint %21 %uint_4
         %41 =   OpIAdd %uint %40 %uint_2
         %42 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %41
         %43 =   OpAtomicExchange %uint %42 %uint_5 %uint_0 %36
         %45 =   OpIMul %uint %uint_16 %21
         %47 =   OpIMul %uint %21 %uint_4
         %48 =   OpIAdd %uint %47 %uint_2
         %49 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %48
         %50 =   OpAtomicCompareExchange %uint %49 %uint_5 %uint_0 %uint_0 %43 %uint_10
         %51 =   OpIMul %uint %uint_16 %21
         %53 =   OpIMul %uint %21 %uint_4
         %54 =   OpIAdd %uint %53 %uint_2
         %55 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %54
         %56 =   OpAtomicIAdd %uint %55 %uint_5 %uint_0 %50
         %57 =   OpIMul %uint %uint_16 %21
         %59 =   OpIMul %uint %21 %uint_4
         %60 =   OpIAdd %uint %59 %uint_2
         %61 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %60
         %62 =   OpAtomicISub %uint %61 %uint_5 %uint_0 %56
         %63 =   OpIMul %uint %uint_16 %21
         %65 =   OpIMul %uint %21 %uint_4
         %66 =   OpIAdd %uint %65 %uint_2
         %67 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %66
         %68 =   OpAtomicSMin %uint %67 %uint_5 %uint_0 %62
         %69 =   OpIMul %uint %uint_16 %21
         %71 =   OpIMul %uint %21 %uint_4
         %72 =   OpIAdd %uint %71 %uint_2
         %73 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %72
         %74 =   OpAtomicSMax %uint %73 %uint_5 %uint_0 %68
         %75 =   OpIMul %uint %uint_16 %21
         %77 =   OpIMul %uint %21 %uint_4
         %78 =   OpIAdd %uint %77 %uint_2
         %79 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %78
         %80 =   OpAtomicUMin %uint %79 %uint_5 %uint_0 %74
         %81 =   OpIMul %uint %uint_16 %21
         %83 =   OpIMul %uint %21 %uint_4
         %84 =   OpIAdd %uint %83 %uint_2
         %85 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %84
         %86 =   OpAtomicUMax %uint %85 %uint_5 %uint_0 %80
         %87 =   OpIMul %uint %uint_16 %21
         %89 =   OpIMul %uint %21 %uint_4
         %90 =   OpIAdd %uint %89 %uint_2
         %91 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %90
         %92 =   OpAtomicAnd %uint %91 %uint_5 %uint_0 %86
         %93 =   OpIMul %uint %uint_16 %21
         %95 =   OpIMul %uint %21 %uint_4
         %96 =   OpIAdd %uint %95 %uint_2
         %97 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %96
         %98 =   OpAtomicOr %uint %97 %uint_5 %uint_0 %92
         %99 =   OpIMul %uint %uint_16 %21
        %101 =   OpIMul %uint %21 %uint_4
        %102 =   OpIAdd %uint %101 %uint_2
        %103 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %102
        %104 =   OpAtomicXor %uint %103 %uint_5 %uint_0 %98
        %105 =   OpIMul %uint %uint_16 %21
        %107 =   OpIMul %uint %21 %uint_4
        %108 =   OpIAdd %uint %107 %uint_2
        %109 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %108
        %110 =   OpAtomicIAdd %uint %109 %uint_5 %uint_0 %uint_1
        %112 =   OpIMul %uint %uint_16 %21
        %114 =   OpIMul %uint %21 %uint_4
        %115 =   OpIAdd %uint %114 %uint_2
        %116 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %115
        %117 =   OpAtomicISub %uint %116 %uint_5 %uint_0 %uint_1
        %118 =   OpIMul %uint %uint_16 %21
        %120 =   OpIMul %uint %21 %uint_4
        %121 =   OpIAdd %uint %120 %uint_2
        %122 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %121
                 OpAtomicStore %122 %uint_5 %uint_0 %117
        %123 =   OpIMul %uint %uint_16 %21
        %125 =   OpIMul %uint %21 %uint_4
        %126 =   OpIAdd %uint %125 %uint_2
        %127 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %126
        %128 =   OpAtomicIAdd %uint %127 %uint_5 %uint_0 %uint_1
        %129 =   OpIMul %uint %uint_16 %21
        %131 =   OpIMul %uint %21 %uint_4
        %132 =   OpIAdd %uint %131 %uint_2
        %133 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %132
        %134 =   OpAtomicISub %uint %133 %uint_5 %uint_0 %uint_2
                 OpReturn
               OpFunctionEnd

