SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 93
; Schema: 0
               OpCapability Shader
               OpCapability Int16
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
         %48 = OpExtInstImport "GLSL.std.450"
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
     %ushort = OpTypeInt 16 0
   %v2ushort = OpTypeVector %ushort 2
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
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %91

         %91 = OpLabel
         %16 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_0
         %17 =   OpLoad %uint %16
         %20 =   OpBitcast %v2ushort %17
         %22 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_1
         %23 =   OpLoad %uint %22
         %24 =   OpBitcast %v2ushort %23
         %25 =   OpBitwiseAnd %v2ushort %20 %24
         %27 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_2
         %28 =   OpLoad %uint %27
         %29 =   OpBitcast %v2ushort %28
         %30 =   OpBitwiseOr %v2ushort %25 %29
         %32 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_3
         %33 =   OpLoad %uint %32
         %34 =   OpBitcast %v2ushort %33
         %35 =   OpBitwiseXor %v2ushort %30 %34
         %36 =   OpNot %v2ushort %35
         %38 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_4
         %39 =   OpLoad %uint %38
         %40 =   OpBitcast %v2ushort %39
         %41 =   OpIAdd %v2ushort %36 %40
         %43 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_5
         %44 =   OpLoad %uint %43
         %45 =   OpBitcast %v2ushort %44
         %46 =   OpISub %v2ushort %41 %45
         %47 =   OpSNegate %v2ushort %46
         %49 =   OpExtInst %v2ushort %48 SAbs %47
         %51 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_6
         %52 =   OpLoad %uint %51
         %53 =   OpBitcast %v2ushort %52
         %54 =   OpIMul %v2ushort %49 %53
         %56 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_7
         %57 =   OpLoad %uint %56
         %58 =   OpBitcast %v2ushort %57
         %59 =   OpShiftLeftLogical %v2ushort %54 %58
         %61 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_8
         %62 =   OpLoad %uint %61
         %63 =   OpBitcast %v2ushort %62
         %64 =   OpShiftRightArithmetic %v2ushort %59 %63
         %66 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_9
         %67 =   OpLoad %uint %66
         %68 =   OpBitcast %v2ushort %67
         %69 =   OpShiftRightLogical %v2ushort %64 %68
         %71 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_10
         %72 =   OpLoad %uint %71
         %73 =   OpBitcast %v2ushort %72
         %74 =   OpExtInst %v2ushort %48 SMin %69 %73
         %76 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_11
         %77 =   OpLoad %uint %76
         %78 =   OpBitcast %v2ushort %77
         %79 =   OpExtInst %v2ushort %48 SMax %74 %78
         %81 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_12
         %82 =   OpLoad %uint %81
         %83 =   OpBitcast %v2ushort %82
         %85 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_13
         %86 =   OpLoad %uint %85
         %87 =   OpBitcast %v2ushort %86
         %88 =   OpExtInst %v2ushort %48 SClamp %79 %83 %87
         %89 =   OpBitcast %uint %88
         %90 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_0
                 OpStore %90 %89 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

