SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 102
; Schema: 0
               OpCapability Shader
               OpCapability Int16
               OpCapability VulkanMemoryModel
         %47 = OpExtInstImport "GLSL.std.450"
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
     %ushort = OpTypeInt 16 0
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
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %100

        %100 = OpLabel
         %16 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_0
         %17 =   OpLoad %uint %16
         %19 =   OpUConvert %ushort %17
         %21 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_1
         %22 =   OpLoad %uint %21
         %23 =   OpUConvert %ushort %22
         %24 =   OpBitwiseAnd %ushort %19 %23
         %26 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_2
         %27 =   OpLoad %uint %26
         %28 =   OpUConvert %ushort %27
         %29 =   OpBitwiseOr %ushort %24 %28
         %31 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_3
         %32 =   OpLoad %uint %31
         %33 =   OpUConvert %ushort %32
         %34 =   OpBitwiseXor %ushort %29 %33
         %35 =   OpNot %ushort %34
         %37 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_4
         %38 =   OpLoad %uint %37
         %39 =   OpUConvert %ushort %38
         %40 =   OpIAdd %ushort %35 %39
         %42 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_5
         %43 =   OpLoad %uint %42
         %44 =   OpUConvert %ushort %43
         %45 =   OpISub %ushort %40 %44
         %46 =   OpSNegate %ushort %45
         %48 =   OpExtInst %ushort %47 SAbs %46
         %50 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_6
         %51 =   OpLoad %uint %50
         %52 =   OpUConvert %ushort %51
         %53 =   OpIMul %ushort %48 %52
         %55 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_7
         %56 =   OpLoad %uint %55
         %57 =   OpUConvert %ushort %56
         %58 =   OpShiftLeftLogical %ushort %53 %57
         %60 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_8
         %61 =   OpLoad %uint %60
         %62 =   OpUConvert %ushort %61
         %63 =   OpShiftRightArithmetic %ushort %58 %62
         %65 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_9
         %66 =   OpLoad %uint %65
         %67 =   OpUConvert %ushort %66
         %68 =   OpShiftRightLogical %ushort %63 %67
         %70 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_10
         %71 =   OpLoad %uint %70
         %72 =   OpUConvert %ushort %71
         %73 =   OpUDiv %ushort %68 %72
         %75 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_11
         %76 =   OpLoad %uint %75
         %77 =   OpUConvert %ushort %76
         %78 =   OpUMod %ushort %73 %77
         %80 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_12
         %81 =   OpLoad %uint %80
         %82 =   OpUConvert %ushort %81
         %83 =   OpExtInst %ushort %47 UMin %78 %82
         %85 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_13
         %86 =   OpLoad %uint %85
         %87 =   OpUConvert %ushort %86
         %88 =   OpExtInst %ushort %47 UMax %83 %87
         %90 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_14
         %91 =   OpLoad %uint %90
         %92 =   OpUConvert %ushort %91
         %94 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_15
         %95 =   OpLoad %uint %94
         %96 =   OpUConvert %ushort %95
         %97 =   OpExtInst %ushort %47 UClamp %88 %92 %96
         %98 =   OpUConvert %uint %97
         %99 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_0
                 OpStore %99 %98 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

