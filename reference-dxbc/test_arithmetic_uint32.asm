SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 127
; Schema: 0
               OpCapability Shader
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
         %40 = OpExtInstImport "GLSL.std.450"
               OpMemoryModel Logical Vulkan
               OpEntryPoint GLCompute %main "main" %9 %13
               OpExecutionMode %main LocalSize 1 1 1
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SSBO "SSBO"
               OpName %SSBO_0 "SSBO"
               OpName %UDiv "UDiv"
               OpName %num "num"
               OpName %den "den"
               OpName %UMod "UMod"
               OpName %num_0 "num"
               OpName %den_0 "den"
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
         %61 = OpTypeFunction %uint %uint %uint
%uint_4294967295 = OpConstant %uint 4294967295
       %bool = OpTypeBool
         %71 = OpConstantNull %uint
    %uint_11 = OpConstant %uint 11
         %85 = OpConstantNull %uint
    %uint_12 = OpConstant %uint 12
    %uint_13 = OpConstant %uint 13
    %uint_14 = OpConstant %uint 14
    %uint_15 = OpConstant %uint 15
    %uint_16 = OpConstant %uint 16
    %uint_17 = OpConstant %uint 17
    %uint_18 = OpConstant %uint 18
    %uint_19 = OpConstant %uint 19
    %uint_20 = OpConstant %uint 20
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %126

        %126 = OpLabel
         %16 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_0
         %17 =   OpLoad %uint %16
         %19 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_1
         %20 =   OpLoad %uint %19
         %21 =   OpBitwiseAnd %uint %17 %20
         %23 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_2
         %24 =   OpLoad %uint %23
         %25 =   OpBitwiseOr %uint %21 %24
         %27 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_3
         %28 =   OpLoad %uint %27
         %29 =   OpBitwiseXor %uint %25 %28
         %30 =   OpNot %uint %29
         %32 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_4
         %33 =   OpLoad %uint %32
         %34 =   OpIAdd %uint %30 %33
         %36 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_5
         %37 =   OpLoad %uint %36
         %38 =   OpISub %uint %34 %37
         %39 =   OpSNegate %uint %38
         %41 =   OpExtInst %uint %40 SAbs %39
         %43 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_6
         %44 =   OpLoad %uint %43
         %45 =   OpIMul %uint %41 %44
         %47 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_7
         %48 =   OpLoad %uint %47
         %49 =   OpShiftLeftLogical %uint %45 %48
         %51 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_8
         %52 =   OpLoad %uint %51
         %53 =   OpShiftRightArithmetic %uint %49 %52
         %55 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_9
         %56 =   OpLoad %uint %55
         %57 =   OpShiftRightLogical %uint %53 %56
         %59 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_10
         %60 =   OpLoad %uint %59
         %74 =   OpFunctionCall %uint %UDiv %57 %60
         %76 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_11
         %77 =   OpLoad %uint %76
         %88 =   OpFunctionCall %uint %UMod %74 %77
         %90 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_12
         %91 =   OpLoad %uint %90
         %92 =   OpExtInst %uint %40 UMin %88 %91
         %94 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_13
         %95 =   OpLoad %uint %94
         %96 =   OpExtInst %uint %40 UMax %92 %95
         %98 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_14
         %99 =   OpLoad %uint %98
        %101 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_15
        %102 =   OpLoad %uint %101
        %103 =   OpExtInst %uint %40 UClamp %96 %99 %102
        %105 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_16
        %106 =   OpLoad %uint %105
        %108 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_17
        %109 =   OpLoad %uint %108
        %111 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_18
        %112 =   OpLoad %uint %111
        %113 =   OpBitFieldInsert %uint %103 %106 %109 %112
        %115 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_19
        %116 =   OpLoad %uint %115
        %118 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_20
        %119 =   OpLoad %uint %118
        %120 =   OpBitFieldUExtract %uint %113 %116 %119
        %121 =   OpBitCount %uint %120
        %122 =   OpBitReverse %uint %121
        %123 =   OpExtInst %uint %40 FindILsb %122
        %124 =   OpExtInst %uint %40 FindUMsb %123
        %125 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_0
                 OpStore %125 %124 NonPrivatePointer
                 OpReturn
               OpFunctionEnd
       %UDiv = OpFunction %uint None %61
        %num = OpFunctionParameter %uint
        %den = OpFunctionParameter %uint

         %65 = OpLabel
         %70 =   OpIEqual %bool %den %71
                 OpSelectionMerge %68 Flatten
                 OpBranchConditional %70 %68 %67

         %67 =     OpLabel
         %72 =       OpUDiv %uint %num %den
                     OpBranch %68

         %68 = OpLabel
         %73 =   OpPhi %uint %uint_4294967295 %65 %72 %67
                 OpReturnValue %73
               OpFunctionEnd
       %UMod = OpFunction %uint None %61
      %num_0 = OpFunctionParameter %uint
      %den_0 = OpFunctionParameter %uint

         %81 = OpLabel
         %84 =   OpIEqual %bool %den_0 %85
                 OpSelectionMerge %83 Flatten
                 OpBranchConditional %84 %83 %82

         %82 =     OpLabel
         %86 =       OpUMod %uint %num_0 %den_0
                     OpBranch %83

         %83 = OpLabel
         %87 =   OpPhi %uint %uint_4294967295 %81 %86 %82
                 OpReturnValue %87
               OpFunctionEnd

