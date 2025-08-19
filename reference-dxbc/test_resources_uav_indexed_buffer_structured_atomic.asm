SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 120
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
               OpDecorate %32 NonUniform
               OpDecorate %40 NonUniform
               OpDecorate %46 NonUniform
               OpDecorate %51 NonUniform
               OpDecorate %56 NonUniform
               OpDecorate %61 NonUniform
               OpDecorate %66 NonUniform
               OpDecorate %71 NonUniform
               OpDecorate %76 NonUniform
               OpDecorate %81 NonUniform
               OpDecorate %86 NonUniform
               OpDecorate %91 NonUniform
               OpDecorate %96 NonUniform
               OpDecorate %101 NonUniform
               OpDecorate %106 NonUniform
               OpDecorate %110 NonUniform
               OpDecorate %115 NonUniform
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
     %uint_1 = OpConstant %uint 1
     %uint_4 = OpConstant %uint 4
    %uint_20 = OpConstant %uint 20
%_ptr_StorageBuffer_uint = OpTypePointer StorageBuffer %uint
     %uint_5 = OpConstant %uint 5
    %uint_10 = OpConstant %uint 10
     %uint_2 = OpConstant %uint 2
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %118

        %118 = OpLabel
         %16 =   OpLoad %uint %BUFFER_INDEX
         %18 =   OpAccessChain %_ptr_StorageBuffer_SSBO %10 %16
         %19 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %21 =   OpLoad %uint %19
         %22 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_1
         %24 =   OpLoad %uint %22
         %28 =   OpIMul %uint %21 %uint_20
         %30 =   OpIAdd %uint %28 %24
         %32 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %30
         %33 =   OpAtomicLoad %uint %32 %uint_5 %uint_0
         %35 =   OpIAdd %uint %33 %uint_10
         %38 =   OpIMul %uint %21 %uint_20
         %39 =   OpIAdd %uint %38 %24
         %40 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %39
         %41 =   OpAtomicExchange %uint %40 %uint_5 %uint_0 %35
         %44 =   OpIMul %uint %21 %uint_20
         %45 =   OpIAdd %uint %44 %24
         %46 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %45
         %47 =   OpAtomicCompareExchange %uint %46 %uint_5 %uint_0 %uint_0 %41 %uint_10
         %49 =   OpIMul %uint %21 %uint_20
         %50 =   OpIAdd %uint %49 %24
         %51 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %50
         %52 =   OpAtomicIAdd %uint %51 %uint_5 %uint_0 %47
         %54 =   OpIMul %uint %21 %uint_20
         %55 =   OpIAdd %uint %54 %24
         %56 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %55
         %57 =   OpAtomicISub %uint %56 %uint_5 %uint_0 %52
         %59 =   OpIMul %uint %21 %uint_20
         %60 =   OpIAdd %uint %59 %24
         %61 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %60
         %62 =   OpAtomicSMin %uint %61 %uint_5 %uint_0 %57
         %64 =   OpIMul %uint %21 %uint_20
         %65 =   OpIAdd %uint %64 %24
         %66 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %65
         %67 =   OpAtomicSMax %uint %66 %uint_5 %uint_0 %62
         %69 =   OpIMul %uint %21 %uint_20
         %70 =   OpIAdd %uint %69 %24
         %71 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %70
         %72 =   OpAtomicUMin %uint %71 %uint_5 %uint_0 %67
         %74 =   OpIMul %uint %21 %uint_20
         %75 =   OpIAdd %uint %74 %24
         %76 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %75
         %77 =   OpAtomicUMax %uint %76 %uint_5 %uint_0 %72
         %79 =   OpIMul %uint %21 %uint_20
         %80 =   OpIAdd %uint %79 %24
         %81 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %80
         %82 =   OpAtomicAnd %uint %81 %uint_5 %uint_0 %77
         %84 =   OpIMul %uint %21 %uint_20
         %85 =   OpIAdd %uint %84 %24
         %86 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %85
         %87 =   OpAtomicOr %uint %86 %uint_5 %uint_0 %82
         %89 =   OpIMul %uint %21 %uint_20
         %90 =   OpIAdd %uint %89 %24
         %91 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %90
         %92 =   OpAtomicXor %uint %91 %uint_5 %uint_0 %87
         %94 =   OpIMul %uint %21 %uint_20
         %95 =   OpIAdd %uint %94 %24
         %96 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %95
         %97 =   OpAtomicIAdd %uint %96 %uint_5 %uint_0 %uint_1
         %99 =   OpIMul %uint %21 %uint_20
        %100 =   OpIAdd %uint %99 %24
        %101 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %100
        %102 =   OpAtomicISub %uint %101 %uint_5 %uint_0 %uint_1
        %104 =   OpIMul %uint %21 %uint_20
        %105 =   OpIAdd %uint %104 %24
        %106 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %105
                 OpAtomicStore %106 %uint_5 %uint_0 %102
        %108 =   OpIMul %uint %21 %uint_20
        %109 =   OpIAdd %uint %108 %24
        %110 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %109
        %111 =   OpAtomicIAdd %uint %110 %uint_5 %uint_0 %uint_1
        %113 =   OpIMul %uint %21 %uint_20
        %114 =   OpIAdd %uint %113 %24
        %115 =   OpAccessChain %_ptr_StorageBuffer_uint %18 %uint_0 %114
        %116 =   OpAtomicISub %uint %115 %uint_5 %uint_0 %uint_2
                 OpReturn
               OpFunctionEnd

