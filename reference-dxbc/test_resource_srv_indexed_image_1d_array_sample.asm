SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 165
; Schema: 0
               OpCapability Shader
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability MinLod
               OpCapability Sampled1D
               OpCapability ImageQuery
               OpCapability DerivativeControl
               OpCapability RuntimeDescriptorArray
               OpCapability SampledImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %19 %TEXCOORD %DEPTH_REF %LOD_BIAS %LOD_CLAMP %LAYER %TEXCOORD_2 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3 %SV_TARGET_4 %SV_TARGET_5 %SV_TARGET_6 %SV_TARGET_7
               OpExecutionMode %main OriginUpperLeft
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
               OpDecorate %49 NonUniform
               OpDecorate %52 NonUniform
               OpDecorate %55 NonUniform
               OpDecorate %60 NonUniform
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
    %uint_16 = OpConstant %uint 16
     %uint_2 = OpConstant %uint 2
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
         %59 = OpTypeSampledImage %6
    %v2float = OpTypeVector %float 2
    %float_0 = OpConstant %float 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_1 = OpConstant %uint 1
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %163

        %163 = OpLabel
         %39 =   OpIMul %uint %uint_0 %uint_16
         %42 =   OpIMul %uint %uint_0 %uint_4
         %43 =   OpIAdd %uint %39 %42
         %44 =   OpShiftRightLogical %uint %43 %uint_2
         %47 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %44
         %48 =   OpLoad %float %47
         %49 =   OpBitcast %uint %48
         %51 =   OpAccessChain %_ptr_UniformConstant_6 %9 %49
         %52 =   OpLoad %6 %51
         %54 =   OpAccessChain %_ptr_UniformConstant_16 %19 %49
         %55 =   OpLoad %16 %54
         %56 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %57 =   OpLoad %float %56
         %58 =   OpLoad %float %LAYER
         %60 =   OpSampledImage %59 %52 %55
         %62 =   OpImageQueryLod %v2float %60 %57
         %63 =   OpCompositeExtract %float %62 0
         %64 =   OpLoad %float %LOD_BIAS
         %65 =   OpLoad %float %LOD_CLAMP
         %68 =   OpCompositeConstruct %v2float %57 %58
         %67 =   OpImageSampleImplicitLod %v4float %60 %68 None
         %69 =   OpCompositeExtract %float %67 0
         %70 =   OpCompositeExtract %float %67 1
         %71 =   OpCompositeExtract %float %67 2
         %72 =   OpCompositeExtract %float %67 3
         %75 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %75 %69
         %76 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %76 %70
         %78 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %78 %71
         %79 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %79 %72
         %84 =   OpCompositeConstruct %v2float %57 %58
         %83 =   OpImageSampleImplicitLod %v4float %60 %84 ConstOffset %int_n1
         %85 =   OpCompositeExtract %float %83 0
         %86 =   OpCompositeExtract %float %83 1
         %87 =   OpCompositeExtract %float %83 2
         %88 =   OpCompositeExtract %float %83 3
         %90 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %90 %85
         %91 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %91 %86
         %92 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %92 %87
         %93 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %93 %88
         %95 =   OpCompositeConstruct %v2float %57 %58
         %94 =   OpImageSampleExplicitLod %v4float %60 %95 Lod %63
         %96 =   OpCompositeExtract %float %94 0
         %97 =   OpCompositeExtract %float %94 1
         %98 =   OpCompositeExtract %float %94 2
         %99 =   OpCompositeExtract %float %94 3
        %101 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %101 %96
        %102 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %102 %97
        %103 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %103 %98
        %104 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %104 %99
        %106 =   OpCompositeConstruct %v2float %57 %58
        %105 =   OpImageSampleImplicitLod %v4float %60 %106 Bias %64
        %107 =   OpCompositeExtract %float %105 0
        %108 =   OpCompositeExtract %float %105 1
        %109 =   OpCompositeExtract %float %105 2
        %110 =   OpCompositeExtract %float %105 3
        %112 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %112 %107
        %113 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %113 %108
        %114 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %114 %109
        %115 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %115 %110
        %117 =   OpCompositeConstruct %v2float %57 %58
        %116 =   OpImageSampleImplicitLod %v4float %60 %117 MinLod %65
        %118 =   OpCompositeExtract %float %116 0
        %119 =   OpCompositeExtract %float %116 1
        %120 =   OpCompositeExtract %float %116 2
        %121 =   OpCompositeExtract %float %116 3
        %123 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %123 %118
        %124 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %124 %119
        %125 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %125 %120
        %126 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %126 %121
        %128 =   OpCompositeConstruct %v2float %57 %58
        %127 =   OpImageSampleImplicitLod %v4float %60 %128 Bias|ConstOffset|MinLod %64 %int_n1 %65
        %129 =   OpCompositeExtract %float %127 0
        %130 =   OpCompositeExtract %float %127 1
        %131 =   OpCompositeExtract %float %127 2
        %132 =   OpCompositeExtract %float %127 3
        %134 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_0
                 OpStore %134 %129
        %135 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_1
                 OpStore %135 %130
        %136 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_2
                 OpStore %136 %131
        %137 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_3
                 OpStore %137 %132
        %138 =   OpLoad %float %TEXCOORD_2
        %139 =   OpDPdx %float %138
        %140 =   OpDPdy %float %138
        %142 =   OpCompositeConstruct %v2float %57 %58
        %141 =   OpImageSampleExplicitLod %v4float %60 %142 Grad %139 %140
        %143 =   OpCompositeExtract %float %141 0
        %144 =   OpCompositeExtract %float %141 1
        %145 =   OpCompositeExtract %float %141 2
        %146 =   OpCompositeExtract %float %141 3
        %148 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_0
                 OpStore %148 %143
        %149 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_1
                 OpStore %149 %144
        %150 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_2
                 OpStore %150 %145
        %151 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_3
                 OpStore %151 %146
        %153 =   OpCompositeConstruct %v2float %57 %58
        %152 =   OpImageSampleExplicitLod %v4float %60 %153 Grad|ConstOffset %139 %140 %int_n1
        %154 =   OpCompositeExtract %float %152 0
        %155 =   OpCompositeExtract %float %152 1
        %156 =   OpCompositeExtract %float %152 2
        %157 =   OpCompositeExtract %float %152 3
        %159 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_0
                 OpStore %159 %154
        %160 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_1
                 OpStore %160 %155
        %161 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_2
                 OpStore %161 %156
        %162 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_3
                 OpStore %162 %157
                 OpReturn
               OpFunctionEnd

