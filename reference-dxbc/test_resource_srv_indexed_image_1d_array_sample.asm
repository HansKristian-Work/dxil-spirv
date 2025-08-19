SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 160
; Schema: 0
               OpCapability Shader
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability MinLod
               OpCapability Sampled1D
               OpCapability ImageQuery
               OpCapability DerivativeControl
               OpCapability SignedZeroInfNanPreserve
               OpCapability RuntimeDescriptorArray
               OpCapability SampledImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %19 %TEXCOORD %DEPTH_REF %LOD_BIAS %LOD_CLAMP %LAYER %TEXCOORD_2 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3 %SV_TARGET_4 %SV_TARGET_5 %SV_TARGET_6 %SV_TARGET_7
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %_ ""
               OpName %TEXCOORD "TEXCOORD"
               OpName %DEPTH_REF "DEPTH_REF"
               OpName %LOD_BIAS "LOD_BIAS"
               OpName %LOD_CLAMP "LOD_CLAMP"
               OpName %LAYER "LAYER"
               OpName %TEXCOORD_2 "TEXCOORD_2"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_2 "SV_TARGET_2"
               OpName %SV_TARGET_3 "SV_TARGET_3"
               OpName %SV_TARGET_4 "SV_TARGET_4"
               OpName %SV_TARGET_5 "SV_TARGET_5"
               OpName %SV_TARGET_6 "SV_TARGET_6"
               OpName %SV_TARGET_7 "SV_TARGET_7"
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %_arr_float_uint_4 ArrayStride 4
               OpMemberDecorate %_ 0 Offset 0
               OpDecorate %_ Block
               OpDecorate %15 DescriptorSet 0
               OpDecorate %15 Binding 0
               OpDecorate %19 DescriptorSet 0
               OpDecorate %19 Binding 0
               OpDecorate %TEXCOORD Location 0
               OpDecorate %DEPTH_REF Location 1
               OpDecorate %LOD_BIAS Location 1
               OpDecorate %LOD_BIAS Component 1
               OpDecorate %LOD_CLAMP Location 1
               OpDecorate %LOD_CLAMP Component 2
               OpDecorate %LAYER Location 1
               OpDecorate %LAYER Component 3
               OpDecorate %TEXCOORD_2 Location 2
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
               OpDecorate %SV_TARGET_2 Location 2
               OpDecorate %SV_TARGET_3 Location 3
               OpDecorate %SV_TARGET_4 Location 4
               OpDecorate %SV_TARGET_5 Location 5
               OpDecorate %SV_TARGET_6 Location 6
               OpDecorate %SV_TARGET_7 Location 7
               OpDecorate %43 NonUniform
               OpDecorate %46 NonUniform
               OpDecorate %49 NonUniform
               OpDecorate %54 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 1D 0 1 0 1 Unknown
%_runtimearr_6 = OpTypeRuntimeArray %6
%_ptr_UniformConstant__runtimearr_6 = OpTypePointer UniformConstant %_runtimearr_6
          %9 = OpVariable %_ptr_UniformConstant__runtimearr_6 UniformConstant
       %uint = OpTypeInt 32 0
     %uint_4 = OpConstant %uint 4
%_arr_float_uint_4 = OpTypeArray %float %uint_4
          %_ = OpTypeStruct %_arr_float_uint_4
%_ptr_Uniform__ = OpTypePointer Uniform %_
         %15 = OpVariable %_ptr_Uniform__ Uniform
         %16 = OpTypeSampler
%_runtimearr_16 = OpTypeRuntimeArray %16
%_ptr_UniformConstant__runtimearr_16 = OpTypePointer UniformConstant %_runtimearr_16
         %19 = OpVariable %_ptr_UniformConstant__runtimearr_16 UniformConstant
    %v3float = OpTypeVector %float 3
%_ptr_Input_v3float = OpTypePointer Input %v3float
   %TEXCOORD = OpVariable %_ptr_Input_v3float Input
%_ptr_Input_float = OpTypePointer Input %float
  %DEPTH_REF = OpVariable %_ptr_Input_float Input
   %LOD_BIAS = OpVariable %_ptr_Input_float Input
  %LOD_CLAMP = OpVariable %_ptr_Input_float Input
      %LAYER = OpVariable %_ptr_Input_float Input
 %TEXCOORD_2 = OpVariable %_ptr_Input_float Input
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_2 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_3 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_4 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_5 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_6 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_7 = OpVariable %_ptr_Output_v4float Output
     %uint_0 = OpConstant %uint 0
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
         %53 = OpTypeSampledImage %6
    %v2float = OpTypeVector %float 2
    %float_0 = OpConstant %float 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %158

        %158 = OpLabel
         %41 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %uint_0
         %42 =   OpLoad %float %41
         %43 =   OpBitcast %uint %42
         %45 =   OpAccessChain %_ptr_UniformConstant_6 %9 %43
         %46 =   OpLoad %6 %45
         %48 =   OpAccessChain %_ptr_UniformConstant_16 %19 %43
         %49 =   OpLoad %16 %48
         %50 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %51 =   OpLoad %float %50
         %52 =   OpLoad %float %LAYER
         %54 =   OpSampledImage %53 %46 %49
         %56 =   OpImageQueryLod %v2float %54 %51
         %57 =   OpCompositeExtract %float %56 0
         %58 =   OpLoad %float %LOD_BIAS
         %59 =   OpLoad %float %LOD_CLAMP
         %62 =   OpCompositeConstruct %v2float %51 %52
         %61 =   OpImageSampleImplicitLod %v4float %54 %62 None
         %63 =   OpCompositeExtract %float %61 0
         %64 =   OpCompositeExtract %float %61 1
         %65 =   OpCompositeExtract %float %61 2
         %66 =   OpCompositeExtract %float %61 3
         %69 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %69 %63
         %70 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %70 %64
         %72 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %72 %65
         %74 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %74 %66
         %79 =   OpCompositeConstruct %v2float %51 %52
         %78 =   OpImageSampleImplicitLod %v4float %54 %79 ConstOffset %int_n1
         %80 =   OpCompositeExtract %float %78 0
         %81 =   OpCompositeExtract %float %78 1
         %82 =   OpCompositeExtract %float %78 2
         %83 =   OpCompositeExtract %float %78 3
         %85 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %85 %80
         %86 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %86 %81
         %87 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %87 %82
         %88 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %88 %83
         %90 =   OpCompositeConstruct %v2float %51 %52
         %89 =   OpImageSampleExplicitLod %v4float %54 %90 Lod %57
         %91 =   OpCompositeExtract %float %89 0
         %92 =   OpCompositeExtract %float %89 1
         %93 =   OpCompositeExtract %float %89 2
         %94 =   OpCompositeExtract %float %89 3
         %96 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %96 %91
         %97 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %97 %92
         %98 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %98 %93
         %99 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %99 %94
        %101 =   OpCompositeConstruct %v2float %51 %52
        %100 =   OpImageSampleImplicitLod %v4float %54 %101 Bias %58
        %102 =   OpCompositeExtract %float %100 0
        %103 =   OpCompositeExtract %float %100 1
        %104 =   OpCompositeExtract %float %100 2
        %105 =   OpCompositeExtract %float %100 3
        %107 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %107 %102
        %108 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %108 %103
        %109 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %109 %104
        %110 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %110 %105
        %112 =   OpCompositeConstruct %v2float %51 %52
        %111 =   OpImageSampleImplicitLod %v4float %54 %112 MinLod %59
        %113 =   OpCompositeExtract %float %111 0
        %114 =   OpCompositeExtract %float %111 1
        %115 =   OpCompositeExtract %float %111 2
        %116 =   OpCompositeExtract %float %111 3
        %118 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %118 %113
        %119 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %119 %114
        %120 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %120 %115
        %121 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %121 %116
        %123 =   OpCompositeConstruct %v2float %51 %52
        %122 =   OpImageSampleImplicitLod %v4float %54 %123 Bias|ConstOffset|MinLod %58 %int_n1 %59
        %124 =   OpCompositeExtract %float %122 0
        %125 =   OpCompositeExtract %float %122 1
        %126 =   OpCompositeExtract %float %122 2
        %127 =   OpCompositeExtract %float %122 3
        %129 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_0
                 OpStore %129 %124
        %130 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_1
                 OpStore %130 %125
        %131 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_2
                 OpStore %131 %126
        %132 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_3
                 OpStore %132 %127
        %133 =   OpLoad %float %TEXCOORD_2
        %134 =   OpDPdx %float %133
        %135 =   OpDPdy %float %133
        %137 =   OpCompositeConstruct %v2float %51 %52
        %136 =   OpImageSampleExplicitLod %v4float %54 %137 Grad %134 %135
        %138 =   OpCompositeExtract %float %136 0
        %139 =   OpCompositeExtract %float %136 1
        %140 =   OpCompositeExtract %float %136 2
        %141 =   OpCompositeExtract %float %136 3
        %143 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_0
                 OpStore %143 %138
        %144 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_1
                 OpStore %144 %139
        %145 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_2
                 OpStore %145 %140
        %146 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_3
                 OpStore %146 %141
        %148 =   OpCompositeConstruct %v2float %51 %52
        %147 =   OpImageSampleExplicitLod %v4float %54 %148 Grad|ConstOffset %134 %135 %int_n1
        %149 =   OpCompositeExtract %float %147 0
        %150 =   OpCompositeExtract %float %147 1
        %151 =   OpCompositeExtract %float %147 2
        %152 =   OpCompositeExtract %float %147 3
        %154 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_0
                 OpStore %154 %149
        %155 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_1
                 OpStore %155 %150
        %156 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_2
                 OpStore %156 %151
        %157 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_3
                 OpStore %157 %152
                 OpReturn
               OpFunctionEnd

