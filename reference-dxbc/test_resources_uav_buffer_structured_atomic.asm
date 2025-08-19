SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 115
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
     %uint_1 = OpConstant %uint 1
     %uint_4 = OpConstant %uint 4
    %uint_20 = OpConstant %uint 20
%_ptr_StorageBuffer_uint = OpTypePointer StorageBuffer %uint
     %uint_5 = OpConstant %uint 5
    %uint_10 = OpConstant %uint 10
     %uint_2 = OpConstant %uint 2
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %113

        %113 = OpLabel
         %14 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_0
         %16 =   OpLoad %uint %14
         %17 =   OpAccessChain %_ptr_Input_uint %BUFFER_ADDRESS %uint_1
         %19 =   OpLoad %uint %17
         %23 =   OpIMul %uint %16 %uint_20
         %25 =   OpIAdd %uint %23 %19
         %27 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %25
         %28 =   OpAtomicLoad %uint %27 %uint_5 %uint_0
         %30 =   OpIAdd %uint %28 %uint_10
         %33 =   OpIMul %uint %16 %uint_20
         %34 =   OpIAdd %uint %33 %19
         %35 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %34
         %36 =   OpAtomicExchange %uint %35 %uint_5 %uint_0 %30
         %39 =   OpIMul %uint %16 %uint_20
         %40 =   OpIAdd %uint %39 %19
         %41 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %40
         %42 =   OpAtomicCompareExchange %uint %41 %uint_5 %uint_0 %uint_0 %36 %uint_10
         %44 =   OpIMul %uint %16 %uint_20
         %45 =   OpIAdd %uint %44 %19
         %46 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %45
         %47 =   OpAtomicIAdd %uint %46 %uint_5 %uint_0 %42
         %49 =   OpIMul %uint %16 %uint_20
         %50 =   OpIAdd %uint %49 %19
         %51 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %50
         %52 =   OpAtomicISub %uint %51 %uint_5 %uint_0 %47
         %54 =   OpIMul %uint %16 %uint_20
         %55 =   OpIAdd %uint %54 %19
         %56 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %55
         %57 =   OpAtomicSMin %uint %56 %uint_5 %uint_0 %52
         %59 =   OpIMul %uint %16 %uint_20
         %60 =   OpIAdd %uint %59 %19
         %61 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %60
         %62 =   OpAtomicSMax %uint %61 %uint_5 %uint_0 %57
         %64 =   OpIMul %uint %16 %uint_20
         %65 =   OpIAdd %uint %64 %19
         %66 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %65
         %67 =   OpAtomicUMin %uint %66 %uint_5 %uint_0 %62
         %69 =   OpIMul %uint %16 %uint_20
         %70 =   OpIAdd %uint %69 %19
         %71 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %70
         %72 =   OpAtomicUMax %uint %71 %uint_5 %uint_0 %67
         %74 =   OpIMul %uint %16 %uint_20
         %75 =   OpIAdd %uint %74 %19
         %76 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %75
         %77 =   OpAtomicAnd %uint %76 %uint_5 %uint_0 %72
         %79 =   OpIMul %uint %16 %uint_20
         %80 =   OpIAdd %uint %79 %19
         %81 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %80
         %82 =   OpAtomicOr %uint %81 %uint_5 %uint_0 %77
         %84 =   OpIMul %uint %16 %uint_20
         %85 =   OpIAdd %uint %84 %19
         %86 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %85
         %87 =   OpAtomicXor %uint %86 %uint_5 %uint_0 %82
         %89 =   OpIMul %uint %16 %uint_20
         %90 =   OpIAdd %uint %89 %19
         %91 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %90
         %92 =   OpAtomicIAdd %uint %91 %uint_5 %uint_0 %uint_1
         %94 =   OpIMul %uint %16 %uint_20
         %95 =   OpIAdd %uint %94 %19
         %96 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %95
         %97 =   OpAtomicISub %uint %96 %uint_5 %uint_0 %uint_1
         %99 =   OpIMul %uint %16 %uint_20
        %100 =   OpIAdd %uint %99 %19
        %101 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %100
                 OpAtomicStore %101 %uint_5 %uint_0 %97
        %103 =   OpIMul %uint %16 %uint_20
        %104 =   OpIAdd %uint %103 %19
        %105 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %104
        %106 =   OpAtomicIAdd %uint %105 %uint_5 %uint_0 %uint_1
        %108 =   OpIMul %uint %16 %uint_20
        %109 =   OpIAdd %uint %108 %19
        %110 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %109
        %111 =   OpAtomicISub %uint %110 %uint_5 %uint_0 %uint_2
                 OpReturn
               OpFunctionEnd

