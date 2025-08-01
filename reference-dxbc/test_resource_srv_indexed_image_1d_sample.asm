SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 156
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
               OpDecorate %59 NonUniform
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
    %uint_16 = OpConstant %uint 16
     %uint_2 = OpConstant %uint 2
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
         %58 = OpTypeSampledImage %6
    %v2float = OpTypeVector %float 2
    %float_0 = OpConstant %float 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_1 = OpConstant %uint 1
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %154

        %154 = OpLabel
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
         %59 =   OpSampledImage %58 %52 %55
         %61 =   OpImageQueryLod %v2float %59 %57
         %62 =   OpCompositeExtract %float %61 0
         %63 =   OpLoad %float %LOD_BIAS
         %64 =   OpLoad %float %LOD_CLAMP
         %66 =   OpImageSampleImplicitLod %v4float %59 %57 None
         %67 =   OpCompositeExtract %float %66 0
         %68 =   OpCompositeExtract %float %66 1
         %69 =   OpCompositeExtract %float %66 2
         %70 =   OpCompositeExtract %float %66 3
         %73 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %73 %67
         %74 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %74 %68
         %76 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %76 %69
         %77 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %77 %70
         %81 =   OpImageSampleImplicitLod %v4float %59 %57 ConstOffset %int_n1
         %82 =   OpCompositeExtract %float %81 0
         %83 =   OpCompositeExtract %float %81 1
         %84 =   OpCompositeExtract %float %81 2
         %85 =   OpCompositeExtract %float %81 3
         %87 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %87 %82
         %88 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %88 %83
         %89 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %89 %84
         %90 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %90 %85
         %91 =   OpImageSampleExplicitLod %v4float %59 %57 Lod %62
         %92 =   OpCompositeExtract %float %91 0
         %93 =   OpCompositeExtract %float %91 1
         %94 =   OpCompositeExtract %float %91 2
         %95 =   OpCompositeExtract %float %91 3
         %97 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %97 %92
         %98 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %98 %93
         %99 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %99 %94
        %100 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %100 %95
        %101 =   OpImageSampleImplicitLod %v4float %59 %57 Bias %63
        %102 =   OpCompositeExtract %float %101 0
        %103 =   OpCompositeExtract %float %101 1
        %104 =   OpCompositeExtract %float %101 2
        %105 =   OpCompositeExtract %float %101 3
        %107 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %107 %102
        %108 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %108 %103
        %109 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %109 %104
        %110 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %110 %105
        %111 =   OpImageSampleImplicitLod %v4float %59 %57 MinLod %64
        %112 =   OpCompositeExtract %float %111 0
        %113 =   OpCompositeExtract %float %111 1
        %114 =   OpCompositeExtract %float %111 2
        %115 =   OpCompositeExtract %float %111 3
        %117 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %117 %112
        %118 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %118 %113
        %119 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %119 %114
        %120 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %120 %115
        %121 =   OpImageSampleImplicitLod %v4float %59 %57 Bias|ConstOffset|MinLod %63 %int_n1 %64
        %122 =   OpCompositeExtract %float %121 0
        %123 =   OpCompositeExtract %float %121 1
        %124 =   OpCompositeExtract %float %121 2
        %125 =   OpCompositeExtract %float %121 3
        %127 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_0
                 OpStore %127 %122
        %128 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_1
                 OpStore %128 %123
        %129 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_2
                 OpStore %129 %124
        %130 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_3
                 OpStore %130 %125
        %131 =   OpLoad %float %TEXCOORD_2
        %132 =   OpDPdx %float %131
        %133 =   OpDPdy %float %131
        %134 =   OpImageSampleExplicitLod %v4float %59 %57 Grad %132 %133
        %135 =   OpCompositeExtract %float %134 0
        %136 =   OpCompositeExtract %float %134 1
        %137 =   OpCompositeExtract %float %134 2
        %138 =   OpCompositeExtract %float %134 3
        %140 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_0
                 OpStore %140 %135
        %141 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_1
                 OpStore %141 %136
        %142 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_2
                 OpStore %142 %137
        %143 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_3
                 OpStore %143 %138
        %144 =   OpImageSampleExplicitLod %v4float %59 %57 Grad|ConstOffset %132 %133 %int_n1
        %145 =   OpCompositeExtract %float %144 0
        %146 =   OpCompositeExtract %float %144 1
        %147 =   OpCompositeExtract %float %144 2
        %148 =   OpCompositeExtract %float %144 3
        %150 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_0
                 OpStore %150 %145
        %151 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_1
                 OpStore %151 %146
        %152 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_2
                 OpStore %152 %147
        %153 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_3
                 OpStore %153 %148
                 OpReturn
               OpFunctionEnd

