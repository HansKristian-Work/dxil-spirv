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
OpEntryPoint GLCompute %3 "main" %9 %13
OpExecutionMode %3 LocalSize 1 1 1
OpExecutionMode %3 DenormPreserve 16
OpExecutionMode %3 DenormFlushToZero 32
OpExecutionMode %3 RoundingModeRTE 16
OpExecutionMode %3 RoundingModeRTE 32
OpName %3 "main"
OpName %7 "SSBO"
OpName %11 "SSBO"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonWritable
OpDecorate %9 Restrict
OpDecorate %10 ArrayStride 4
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %13 NonReadable
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypePointer StorageBuffer %7
%9 = OpVariable %8 StorageBuffer
%10 = OpTypeRuntimeArray %5
%11 = OpTypeStruct %10
%12 = OpTypePointer StorageBuffer %11
%13 = OpVariable %12 StorageBuffer
%14 = OpConstant %5 0
%15 = OpTypePointer StorageBuffer %5
%18 = OpTypeFloat 32
%20 = OpTypeFloat 16
%22 = OpConstant %5 1
%27 = OpTypeVector %20 2
%33 = OpConstant %5 2
%38 = OpConstant %5 3
%46 = OpConstant %5 4
%51 = OpConstant %5 5
%59 = OpConstant %5 6
%64 = OpConstant %5 7
%72 = OpConstant %5 8
%77 = OpConstant %5 9
%83 = OpConstant %5 10
%88 = OpConstant %5 11
%95 = OpConstant %5 12
%100 = OpConstant %5 13
%108 = OpConstant %20 0x1p+0
%109 = OpConstantComposite %27 %108 %108
%111 = OpConstant %5 14
%116 = OpConstant %5 15
%123 = OpConstant %5 16
%128 = OpConstant %5 17
%135 = OpConstant %5 18
%140 = OpConstant %5 19
%146 = OpConstant %5 20
%151 = OpConstant %5 21
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %166
%166 = OpLabel
%16 = OpAccessChain %15 %9 %14 %14
%17 = OpLoad %5 %16
%19 = OpBitcast %18 %17
%21 = OpFConvert %20 %19
%23 = OpAccessChain %15 %9 %14 %22
%24 = OpLoad %5 %23
%25 = OpBitcast %18 %24
%26 = OpFConvert %20 %25
%28 = OpCompositeConstruct %27 %21 %26
%30 = OpExtInst %27 %29 Trunc %28
%31 = OpExtInst %27 %29 FAbs %30
%32 = OpFNegate %27 %31
%34 = OpAccessChain %15 %9 %14 %33
%35 = OpLoad %5 %34
%36 = OpBitcast %18 %35
%37 = OpFConvert %20 %36
%39 = OpAccessChain %15 %9 %14 %38
%40 = OpLoad %5 %39
%41 = OpBitcast %18 %40
%42 = OpFConvert %20 %41
%43 = OpCompositeConstruct %27 %37 %42
%44 = OpFAdd %27 %32 %43
%45 = OpExtInst %27 %29 RoundEven %44
%47 = OpAccessChain %15 %9 %14 %46
%48 = OpLoad %5 %47
%49 = OpBitcast %18 %48
%50 = OpFConvert %20 %49
%52 = OpAccessChain %15 %9 %14 %51
%53 = OpLoad %5 %52
%54 = OpBitcast %18 %53
%55 = OpFConvert %20 %54
%56 = OpCompositeConstruct %27 %50 %55
%57 = OpFSub %27 %45 %56
%58 = OpExtInst %27 %29 Floor %57
%60 = OpAccessChain %15 %9 %14 %59
%61 = OpLoad %5 %60
%62 = OpBitcast %18 %61
%63 = OpFConvert %20 %62
%65 = OpAccessChain %15 %9 %14 %64
%66 = OpLoad %5 %65
%67 = OpBitcast %18 %66
%68 = OpFConvert %20 %67
%69 = OpCompositeConstruct %27 %63 %68
%70 = OpFMul %27 %58 %69
%71 = OpExtInst %27 %29 Ceil %70
%73 = OpAccessChain %15 %9 %14 %72
%74 = OpLoad %5 %73
%75 = OpBitcast %18 %74
%76 = OpFConvert %20 %75
%78 = OpAccessChain %15 %9 %14 %77
%79 = OpLoad %5 %78
%80 = OpBitcast %18 %79
%81 = OpFConvert %20 %80
%82 = OpCompositeConstruct %27 %76 %81
%84 = OpAccessChain %15 %9 %14 %83
%85 = OpLoad %5 %84
%86 = OpBitcast %18 %85
%87 = OpFConvert %20 %86
%89 = OpAccessChain %15 %9 %14 %88
%90 = OpLoad %5 %89
%91 = OpBitcast %18 %90
%92 = OpFConvert %20 %91
%93 = OpCompositeConstruct %27 %87 %92
%94 = OpExtInst %27 %29 Fma %71 %82 %93
%96 = OpAccessChain %15 %9 %14 %95
%97 = OpLoad %5 %96
%98 = OpBitcast %18 %97
%99 = OpFConvert %20 %98
%101 = OpAccessChain %15 %9 %14 %100
%102 = OpLoad %5 %101
%103 = OpBitcast %18 %102
%104 = OpFConvert %20 %103
%105 = OpCompositeConstruct %27 %99 %104
%106 = OpFDiv %27 %94 %105
%107 = OpFDiv %27 %109 %106
%110 = OpExtInst %27 %29 Fract %107
%112 = OpAccessChain %15 %9 %14 %111
%113 = OpLoad %5 %112
%114 = OpBitcast %18 %113
%115 = OpFConvert %20 %114
%117 = OpAccessChain %15 %9 %14 %116
%118 = OpLoad %5 %117
%119 = OpBitcast %18 %118
%120 = OpFConvert %20 %119
%121 = OpCompositeConstruct %27 %115 %120
%122 = OpExtInst %27 %29 NMin %110 %121
%124 = OpAccessChain %15 %9 %14 %123
%125 = OpLoad %5 %124
%126 = OpBitcast %18 %125
%127 = OpFConvert %20 %126
%129 = OpAccessChain %15 %9 %14 %128
%130 = OpLoad %5 %129
%131 = OpBitcast %18 %130
%132 = OpFConvert %20 %131
%133 = OpCompositeConstruct %27 %127 %132
%134 = OpExtInst %27 %29 NMax %122 %133
%136 = OpAccessChain %15 %9 %14 %135
%137 = OpLoad %5 %136
%138 = OpBitcast %18 %137
%139 = OpFConvert %20 %138
%141 = OpAccessChain %15 %9 %14 %140
%142 = OpLoad %5 %141
%143 = OpBitcast %18 %142
%144 = OpFConvert %20 %143
%145 = OpCompositeConstruct %27 %139 %144
%147 = OpAccessChain %15 %9 %14 %146
%148 = OpLoad %5 %147
%149 = OpBitcast %18 %148
%150 = OpFConvert %20 %149
%152 = OpAccessChain %15 %9 %14 %151
%153 = OpLoad %5 %152
%154 = OpBitcast %18 %153
%155 = OpFConvert %20 %154
%156 = OpCompositeConstruct %27 %150 %155
%157 = OpExtInst %27 %29 NClamp %134 %145 %156
%158 = OpCompositeExtract %20 %157 0
%159 = OpFConvert %18 %158
%160 = OpBitcast %5 %159
%161 = OpAccessChain %15 %13 %14 %14
OpStore %161 %160 NonPrivatePointer
%162 = OpCompositeExtract %20 %157 1
%163 = OpFConvert %18 %162
%164 = OpBitcast %5 %163
%165 = OpAccessChain %15 %13 %14 %14
OpStore %165 %164 NonPrivatePointer
OpReturn
OpFunctionEnd

