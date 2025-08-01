SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 105
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
         %40 = OpExtInstImport "GLSL.std.450"
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
    %uint_19 = OpConstant %uint 19
    %uint_20 = OpConstant %uint 20
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %103

        %103 = OpLabel
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
         %61 =   OpUDiv %uint %57 %60
         %63 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_11
         %64 =   OpLoad %uint %63
         %65 =   OpUMod %uint %61 %64
         %67 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_12
         %68 =   OpLoad %uint %67
         %69 =   OpExtInst %uint %40 UMin %65 %68
         %71 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_13
         %72 =   OpLoad %uint %71
         %73 =   OpExtInst %uint %40 UMax %69 %72
         %75 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_14
         %76 =   OpLoad %uint %75
         %78 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_15
         %79 =   OpLoad %uint %78
         %80 =   OpExtInst %uint %40 UClamp %73 %76 %79
         %82 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_16
         %83 =   OpLoad %uint %82
         %85 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_17
         %86 =   OpLoad %uint %85
         %88 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_18
         %89 =   OpLoad %uint %88
         %90 =   OpBitFieldInsert %uint %80 %83 %86 %89
         %92 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_19
         %93 =   OpLoad %uint %92
         %95 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_20
         %96 =   OpLoad %uint %95
         %97 =   OpBitFieldUExtract %uint %90 %93 %96
         %98 =   OpBitCount %uint %97
         %99 =   OpBitReverse %uint %98
        %100 =   OpExtInst %uint %40 FindILsb %99
        %101 =   OpExtInst %uint %40 FindUMsb %100
        %102 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_0
                 OpStore %102 %101 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

