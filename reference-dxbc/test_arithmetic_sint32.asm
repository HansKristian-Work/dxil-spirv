SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 117
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
         %46 = OpExtInstImport "GLSL.std.450"
               OpMemoryModel Logical Vulkan
               OpEntryPoint GLCompute %main "main" %9 %13
               OpExecutionMode %main LocalSize 1 1 1
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
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
     %uint_4 = OpConstant %uint 4
     %uint_5 = OpConstant %uint 5
     %uint_6 = OpConstant %uint 6
     %uint_7 = OpConstant %uint 7
     %uint_8 = OpConstant %uint 8
     %uint_9 = OpConstant %uint 9
    %uint_10 = OpConstant %uint 10
    %uint_11 = OpConstant %uint 11
    %uint_12 = OpConstant %uint 12
    %uint_13 = OpConstant %uint 13
    %uint_14 = OpConstant %uint 14
    %uint_15 = OpConstant %uint 15
    %uint_16 = OpConstant %uint 16
    %uint_17 = OpConstant %uint 17
    %uint_18 = OpConstant %uint 18
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %115

        %115 = OpLabel
         %16 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_0
         %17 =   OpLoad %uint %16
         %18 =   OpBitcast %uint %17
         %20 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_1
         %21 =   OpLoad %uint %20
         %22 =   OpBitcast %uint %21
         %23 =   OpBitwiseAnd %uint %18 %22
         %25 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_2
         %26 =   OpLoad %uint %25
         %27 =   OpBitcast %uint %26
         %28 =   OpBitwiseOr %uint %23 %27
         %30 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_3
         %31 =   OpLoad %uint %30
         %32 =   OpBitcast %uint %31
         %33 =   OpBitwiseXor %uint %28 %32
         %34 =   OpNot %uint %33
         %36 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_4
         %37 =   OpLoad %uint %36
         %38 =   OpBitcast %uint %37
         %39 =   OpIAdd %uint %34 %38
         %41 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_5
         %42 =   OpLoad %uint %41
         %43 =   OpBitcast %uint %42
         %44 =   OpISub %uint %39 %43
         %45 =   OpSNegate %uint %44
         %47 =   OpExtInst %uint %46 SAbs %45
         %49 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_6
         %50 =   OpLoad %uint %49
         %51 =   OpBitcast %uint %50
         %52 =   OpIMul %uint %47 %51
         %54 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_7
         %55 =   OpLoad %uint %54
         %56 =   OpBitcast %uint %55
         %57 =   OpShiftLeftLogical %uint %52 %56
         %59 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_8
         %60 =   OpLoad %uint %59
         %61 =   OpBitcast %uint %60
         %62 =   OpShiftRightArithmetic %uint %57 %61
         %64 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_9
         %65 =   OpLoad %uint %64
         %66 =   OpBitcast %uint %65
         %67 =   OpShiftRightLogical %uint %62 %66
         %69 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_10
         %70 =   OpLoad %uint %69
         %71 =   OpBitcast %uint %70
         %72 =   OpExtInst %uint %46 SMin %67 %71
         %74 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_11
         %75 =   OpLoad %uint %74
         %76 =   OpBitcast %uint %75
         %77 =   OpExtInst %uint %46 SMax %72 %76
         %79 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_12
         %80 =   OpLoad %uint %79
         %81 =   OpBitcast %uint %80
         %83 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_13
         %84 =   OpLoad %uint %83
         %85 =   OpBitcast %uint %84
         %86 =   OpExtInst %uint %46 SClamp %77 %81 %85
         %88 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_14
         %89 =   OpLoad %uint %88
         %90 =   OpBitcast %uint %89
         %92 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_15
         %93 =   OpLoad %uint %92
         %94 =   OpBitcast %uint %93
         %96 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_16
         %97 =   OpLoad %uint %96
         %98 =   OpBitcast %uint %97
         %99 =   OpBitFieldInsert %uint %86 %90 %94 %98
        %101 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_17
        %102 =   OpLoad %uint %101
        %103 =   OpBitcast %uint %102
        %105 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_18
        %106 =   OpLoad %uint %105
        %107 =   OpBitcast %uint %106
        %108 =   OpBitFieldSExtract %uint %99 %103 %107
        %109 =   OpBitCount %uint %108
        %110 =   OpBitReverse %uint %109
        %111 =   OpExtInst %uint %46 FindILsb %110
        %112 =   OpExtInst %uint %46 FindSMsb %111
        %113 =   OpBitcast %uint %112
        %114 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_0
                 OpStore %114 %113 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

