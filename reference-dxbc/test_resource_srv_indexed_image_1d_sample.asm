SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 151
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
               OpDecorate %53 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 1D 0 0 0 1 Unknown
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
         %52 = OpTypeSampledImage %6
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
                 OpBranch %149

        %149 = OpLabel
         %41 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %uint_0
         %42 =   OpLoad %float %41
         %43 =   OpBitcast %uint %42
         %45 =   OpAccessChain %_ptr_UniformConstant_6 %9 %43
         %46 =   OpLoad %6 %45
         %48 =   OpAccessChain %_ptr_UniformConstant_16 %19 %43
         %49 =   OpLoad %16 %48
         %50 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %51 =   OpLoad %float %50
         %53 =   OpSampledImage %52 %46 %49
         %55 =   OpImageQueryLod %v2float %53 %51
         %56 =   OpCompositeExtract %float %55 0
         %57 =   OpLoad %float %LOD_BIAS
         %58 =   OpLoad %float %LOD_CLAMP
         %60 =   OpImageSampleImplicitLod %v4float %53 %51 None
         %61 =   OpCompositeExtract %float %60 0
         %62 =   OpCompositeExtract %float %60 1
         %63 =   OpCompositeExtract %float %60 2
         %64 =   OpCompositeExtract %float %60 3
         %67 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %67 %61
         %68 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %68 %62
         %70 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %70 %63
         %72 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %72 %64
         %76 =   OpImageSampleImplicitLod %v4float %53 %51 ConstOffset %int_n1
         %77 =   OpCompositeExtract %float %76 0
         %78 =   OpCompositeExtract %float %76 1
         %79 =   OpCompositeExtract %float %76 2
         %80 =   OpCompositeExtract %float %76 3
         %82 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %82 %77
         %83 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %83 %78
         %84 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %84 %79
         %85 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %85 %80
         %86 =   OpImageSampleExplicitLod %v4float %53 %51 Lod %56
         %87 =   OpCompositeExtract %float %86 0
         %88 =   OpCompositeExtract %float %86 1
         %89 =   OpCompositeExtract %float %86 2
         %90 =   OpCompositeExtract %float %86 3
         %92 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %92 %87
         %93 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %93 %88
         %94 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %94 %89
         %95 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %95 %90
         %96 =   OpImageSampleImplicitLod %v4float %53 %51 Bias %57
         %97 =   OpCompositeExtract %float %96 0
         %98 =   OpCompositeExtract %float %96 1
         %99 =   OpCompositeExtract %float %96 2
        %100 =   OpCompositeExtract %float %96 3
        %102 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %102 %97
        %103 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %103 %98
        %104 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %104 %99
        %105 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %105 %100
        %106 =   OpImageSampleImplicitLod %v4float %53 %51 MinLod %58
        %107 =   OpCompositeExtract %float %106 0
        %108 =   OpCompositeExtract %float %106 1
        %109 =   OpCompositeExtract %float %106 2
        %110 =   OpCompositeExtract %float %106 3
        %112 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %112 %107
        %113 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %113 %108
        %114 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %114 %109
        %115 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %115 %110
        %116 =   OpImageSampleImplicitLod %v4float %53 %51 Bias|ConstOffset|MinLod %57 %int_n1 %58
        %117 =   OpCompositeExtract %float %116 0
        %118 =   OpCompositeExtract %float %116 1
        %119 =   OpCompositeExtract %float %116 2
        %120 =   OpCompositeExtract %float %116 3
        %122 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_0
                 OpStore %122 %117
        %123 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_1
                 OpStore %123 %118
        %124 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_2
                 OpStore %124 %119
        %125 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_3
                 OpStore %125 %120
        %126 =   OpLoad %float %TEXCOORD_2
        %127 =   OpDPdx %float %126
        %128 =   OpDPdy %float %126
        %129 =   OpImageSampleExplicitLod %v4float %53 %51 Grad %127 %128
        %130 =   OpCompositeExtract %float %129 0
        %131 =   OpCompositeExtract %float %129 1
        %132 =   OpCompositeExtract %float %129 2
        %133 =   OpCompositeExtract %float %129 3
        %135 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_0
                 OpStore %135 %130
        %136 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_1
                 OpStore %136 %131
        %137 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_2
                 OpStore %137 %132
        %138 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_3
                 OpStore %138 %133
        %139 =   OpImageSampleExplicitLod %v4float %53 %51 Grad|ConstOffset %127 %128 %int_n1
        %140 =   OpCompositeExtract %float %139 0
        %141 =   OpCompositeExtract %float %139 1
        %142 =   OpCompositeExtract %float %139 2
        %143 =   OpCompositeExtract %float %139 3
        %145 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_0
                 OpStore %145 %140
        %146 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_1
                 OpStore %146 %141
        %147 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_2
                 OpStore %147 %142
        %148 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_3
                 OpStore %148 %143
                 OpReturn
               OpFunctionEnd

