SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 154
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
         %74 = OpTypeFunction %v2ushort %v2ushort %v2ushort
%ushort_65535 = OpConstant %ushort 65535
       %bool = OpTypeBool
         %86 = OpConstantNull %ushort
         %89 = OpUndef %v2ushort
         %96 = OpConstantNull %ushort
    %uint_11 = OpConstant %uint 11
        %115 = OpConstantNull %ushort
        %118 = OpUndef %v2ushort
        %125 = OpConstantNull %ushort
    %uint_12 = OpConstant %uint 12
    %uint_13 = OpConstant %uint 13
    %uint_14 = OpConstant %uint 14
    %uint_15 = OpConstant %uint 15
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %152

        %152 = OpLabel
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
        %101 =   OpFunctionCall %v2ushort %UDiv %69 %73
        %103 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_11
        %104 =   OpLoad %uint %103
        %105 =   OpBitcast %v2ushort %104
        %130 =   OpFunctionCall %v2ushort %UMod %101 %105
        %132 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_12
        %133 =   OpLoad %uint %132
        %134 =   OpBitcast %v2ushort %133
        %135 =   OpExtInst %v2ushort %48 UMin %130 %134
        %137 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_13
        %138 =   OpLoad %uint %137
        %139 =   OpBitcast %v2ushort %138
        %140 =   OpExtInst %v2ushort %48 UMax %135 %139
        %142 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_14
        %143 =   OpLoad %uint %142
        %144 =   OpBitcast %v2ushort %143
        %146 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_15
        %147 =   OpLoad %uint %146
        %148 =   OpBitcast %v2ushort %147
        %149 =   OpExtInst %v2ushort %48 UClamp %140 %144 %148
        %150 =   OpBitcast %uint %149
        %151 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_0
                 OpStore %151 %150 NonPrivatePointer
                 OpReturn
               OpFunctionEnd
       %UDiv = OpFunction %v2ushort None %74
        %num = OpFunctionParameter %v2ushort
        %den = OpFunctionParameter %v2ushort

         %78 = OpLabel
         %82 =   OpCompositeExtract %ushort %num 0
         %83 =   OpCompositeExtract %ushort %den 0
         %85 =   OpIEqual %bool %83 %86
                 OpSelectionMerge %81 Flatten
                 OpBranchConditional %85 %81 %80

         %80 =     OpLabel
         %87 =       OpUDiv %ushort %82 %83
                     OpBranch %81

         %81 = OpLabel
         %88 =   OpPhi %ushort %ushort_65535 %78 %87 %80
         %90 =   OpCompositeInsert %v2ushort %88 %89 0
         %93 =   OpCompositeExtract %ushort %num 1
         %94 =   OpCompositeExtract %ushort %den 1
         %95 =   OpIEqual %bool %94 %96
                 OpSelectionMerge %92 Flatten
                 OpBranchConditional %95 %92 %91

         %91 =     OpLabel
         %97 =       OpUDiv %ushort %93 %94
                     OpBranch %92

         %92 = OpLabel
         %98 =   OpPhi %ushort %ushort_65535 %81 %97 %91
         %99 =   OpCompositeInsert %v2ushort %98 %90 1
                 OpReturnValue %99
               OpFunctionEnd
       %UMod = OpFunction %v2ushort None %74
      %num_0 = OpFunctionParameter %v2ushort
      %den_0 = OpFunctionParameter %v2ushort

        %109 = OpLabel
        %112 =   OpCompositeExtract %ushort %num_0 0
        %113 =   OpCompositeExtract %ushort %den_0 0
        %114 =   OpIEqual %bool %113 %115
                 OpSelectionMerge %111 Flatten
                 OpBranchConditional %114 %111 %110

        %110 =     OpLabel
        %116 =       OpUMod %ushort %112 %113
                     OpBranch %111

        %111 = OpLabel
        %117 =   OpPhi %ushort %ushort_65535 %109 %116 %110
        %119 =   OpCompositeInsert %v2ushort %117 %118 0
        %122 =   OpCompositeExtract %ushort %num_0 1
        %123 =   OpCompositeExtract %ushort %den_0 1
        %124 =   OpIEqual %bool %123 %125
                 OpSelectionMerge %121 Flatten
                 OpBranchConditional %124 %121 %120

        %120 =     OpLabel
        %126 =       OpUMod %ushort %122 %123
                     OpBranch %121

        %121 = OpLabel
        %127 =   OpPhi %ushort %ushort_65535 %111 %126 %120
        %128 =   OpCompositeInsert %v2ushort %127 %119 1
                 OpReturnValue %128
               OpFunctionEnd

