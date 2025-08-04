SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 168
; Schema: 0
               OpCapability Shader
               OpCapability Float16
               OpCapability DenormPreserve
               OpCapability DenormFlushToZero
               OpCapability RoundingModeRTE
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
         %29 = OpExtInstImport "GLSL.std.450"
               OpMemoryModel Logical Vulkan
               OpEntryPoint GLCompute %main "main" %9 %13
               OpExecutionMode %main LocalSize 1 1 1
               OpExecutionMode %main DenormPreserve 16
               OpExecutionMode %main DenormFlushToZero 32
               OpExecutionMode %main RoundingModeRTE 16
               OpExecutionMode %main RoundingModeRTE 32
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
      %float = OpTypeFloat 32
       %half = OpTypeFloat 16
     %uint_1 = OpConstant %uint 1
     %v2half = OpTypeVector %half 2
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
%half_0x1p_0 = OpConstant %half 0x1p+0
        %109 = OpConstantComposite %v2half %half_0x1p_0 %half_0x1p_0
    %uint_14 = OpConstant %uint 14
    %uint_15 = OpConstant %uint 15
    %uint_16 = OpConstant %uint 16
    %uint_17 = OpConstant %uint 17
    %uint_18 = OpConstant %uint 18
    %uint_19 = OpConstant %uint 19
    %uint_20 = OpConstant %uint 20
    %uint_21 = OpConstant %uint 21
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %166

        %166 = OpLabel
         %16 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_0
         %17 =   OpLoad %uint %16
         %19 =   OpBitcast %float %17
         %21 =   OpFConvert %half %19
         %23 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_1
         %24 =   OpLoad %uint %23
         %25 =   OpBitcast %float %24
         %26 =   OpFConvert %half %25
         %28 =   OpCompositeConstruct %v2half %21 %26
         %30 =   OpExtInst %v2half %29 Trunc %28
         %31 =   OpExtInst %v2half %29 FAbs %30
         %32 =   OpFNegate %v2half %31
         %34 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_2
         %35 =   OpLoad %uint %34
         %36 =   OpBitcast %float %35
         %37 =   OpFConvert %half %36
         %39 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_3
         %40 =   OpLoad %uint %39
         %41 =   OpBitcast %float %40
         %42 =   OpFConvert %half %41
         %43 =   OpCompositeConstruct %v2half %37 %42
         %44 =   OpFAdd %v2half %32 %43
         %45 =   OpExtInst %v2half %29 RoundEven %44
         %47 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_4
         %48 =   OpLoad %uint %47
         %49 =   OpBitcast %float %48
         %50 =   OpFConvert %half %49
         %52 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_5
         %53 =   OpLoad %uint %52
         %54 =   OpBitcast %float %53
         %55 =   OpFConvert %half %54
         %56 =   OpCompositeConstruct %v2half %50 %55
         %57 =   OpFSub %v2half %45 %56
         %58 =   OpExtInst %v2half %29 Floor %57
         %60 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_6
         %61 =   OpLoad %uint %60
         %62 =   OpBitcast %float %61
         %63 =   OpFConvert %half %62
         %65 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_7
         %66 =   OpLoad %uint %65
         %67 =   OpBitcast %float %66
         %68 =   OpFConvert %half %67
         %69 =   OpCompositeConstruct %v2half %63 %68
         %70 =   OpFMul %v2half %58 %69
         %71 =   OpExtInst %v2half %29 Ceil %70
         %73 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_8
         %74 =   OpLoad %uint %73
         %75 =   OpBitcast %float %74
         %76 =   OpFConvert %half %75
         %78 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_9
         %79 =   OpLoad %uint %78
         %80 =   OpBitcast %float %79
         %81 =   OpFConvert %half %80
         %82 =   OpCompositeConstruct %v2half %76 %81
         %84 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_10
         %85 =   OpLoad %uint %84
         %86 =   OpBitcast %float %85
         %87 =   OpFConvert %half %86
         %89 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_11
         %90 =   OpLoad %uint %89
         %91 =   OpBitcast %float %90
         %92 =   OpFConvert %half %91
         %93 =   OpCompositeConstruct %v2half %87 %92
         %94 =   OpExtInst %v2half %29 Fma %71 %82 %93
         %96 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_12
         %97 =   OpLoad %uint %96
         %98 =   OpBitcast %float %97
         %99 =   OpFConvert %half %98
        %101 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_13
        %102 =   OpLoad %uint %101
        %103 =   OpBitcast %float %102
        %104 =   OpFConvert %half %103
        %105 =   OpCompositeConstruct %v2half %99 %104
        %106 =   OpFDiv %v2half %94 %105
        %107 =   OpFDiv %v2half %109 %106
        %110 =   OpExtInst %v2half %29 Fract %107
        %112 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_14
        %113 =   OpLoad %uint %112
        %114 =   OpBitcast %float %113
        %115 =   OpFConvert %half %114
        %117 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_15
        %118 =   OpLoad %uint %117
        %119 =   OpBitcast %float %118
        %120 =   OpFConvert %half %119
        %121 =   OpCompositeConstruct %v2half %115 %120
        %122 =   OpExtInst %v2half %29 NMin %110 %121
        %124 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_16
        %125 =   OpLoad %uint %124
        %126 =   OpBitcast %float %125
        %127 =   OpFConvert %half %126
        %129 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_17
        %130 =   OpLoad %uint %129
        %131 =   OpBitcast %float %130
        %132 =   OpFConvert %half %131
        %133 =   OpCompositeConstruct %v2half %127 %132
        %134 =   OpExtInst %v2half %29 NMax %122 %133
        %136 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_18
        %137 =   OpLoad %uint %136
        %138 =   OpBitcast %float %137
        %139 =   OpFConvert %half %138
        %141 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_19
        %142 =   OpLoad %uint %141
        %143 =   OpBitcast %float %142
        %144 =   OpFConvert %half %143
        %145 =   OpCompositeConstruct %v2half %139 %144
        %147 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_20
        %148 =   OpLoad %uint %147
        %149 =   OpBitcast %float %148
        %150 =   OpFConvert %half %149
        %152 =   OpAccessChain %_ptr_StorageBuffer_uint %9 %uint_0 %uint_21
        %153 =   OpLoad %uint %152
        %154 =   OpBitcast %float %153
        %155 =   OpFConvert %half %154
        %156 =   OpCompositeConstruct %v2half %150 %155
        %157 =   OpExtInst %v2half %29 NClamp %134 %145 %156
        %158 =   OpCompositeExtract %half %157 0
        %159 =   OpFConvert %float %158
        %160 =   OpBitcast %uint %159
        %161 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_0
                 OpStore %161 %160 NonPrivatePointer
        %162 =   OpCompositeExtract %half %157 1
        %163 =   OpFConvert %float %162
        %164 =   OpBitcast %uint %163
        %165 =   OpAccessChain %_ptr_StorageBuffer_uint %13 %uint_0 %uint_0
                 OpStore %165 %164 NonPrivatePointer
                 OpReturn
               OpFunctionEnd

