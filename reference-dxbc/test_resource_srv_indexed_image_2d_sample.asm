SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 183
; Schema: 0
               OpCapability Shader
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability MinLod
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
               OpDecorate %51 NonUniform
               OpDecorate %54 NonUniform
               OpDecorate %57 NonUniform
               OpDecorate %65 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 2D 0 0 0 1 Unknown
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
    %v2float = OpTypeVector %float 2
%_ptr_Input_v2float = OpTypePointer Input %v2float
 %TEXCOORD_2 = OpVariable %_ptr_Input_v2float Input
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
     %uint_1 = OpConstant %uint 1
         %64 = OpTypeSampledImage %6
    %float_0 = OpConstant %float 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
      %v2int = OpTypeVector %int 2
         %91 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %181

        %181 = OpLabel
         %41 =   OpIMul %uint %uint_0 %uint_16
         %44 =   OpIMul %uint %uint_0 %uint_4
         %45 =   OpIAdd %uint %41 %44
         %46 =   OpShiftRightLogical %uint %45 %uint_2
         %49 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %46
         %50 =   OpLoad %float %49
         %51 =   OpBitcast %uint %50
         %53 =   OpAccessChain %_ptr_UniformConstant_6 %9 %51
         %54 =   OpLoad %6 %53
         %56 =   OpAccessChain %_ptr_UniformConstant_16 %19 %51
         %57 =   OpLoad %16 %56
         %58 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %59 =   OpLoad %float %58
         %60 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %62 =   OpLoad %float %60
         %65 =   OpSampledImage %64 %54 %57
         %67 =   OpCompositeConstruct %v2float %59 %62
         %66 =   OpImageQueryLod %v2float %65 %67
         %68 =   OpCompositeExtract %float %66 0
         %69 =   OpLoad %float %LOD_BIAS
         %70 =   OpLoad %float %LOD_CLAMP
         %73 =   OpCompositeConstruct %v2float %59 %62
         %72 =   OpImageSampleImplicitLod %v4float %65 %73 None
         %74 =   OpCompositeExtract %float %72 0
         %75 =   OpCompositeExtract %float %72 1
         %76 =   OpCompositeExtract %float %72 2
         %77 =   OpCompositeExtract %float %72 3
         %80 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %80 %74
         %81 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %81 %75
         %82 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %82 %76
         %83 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %83 %77
         %89 =   OpCompositeConstruct %v2float %59 %62
         %88 =   OpImageSampleImplicitLod %v4float %65 %89 ConstOffset %91
         %92 =   OpCompositeExtract %float %88 0
         %93 =   OpCompositeExtract %float %88 1
         %94 =   OpCompositeExtract %float %88 2
         %95 =   OpCompositeExtract %float %88 3
         %97 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %97 %92
         %98 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %98 %93
         %99 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %99 %94
        %100 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %100 %95
        %102 =   OpCompositeConstruct %v2float %59 %62
        %101 =   OpImageSampleExplicitLod %v4float %65 %102 Lod %68
        %103 =   OpCompositeExtract %float %101 0
        %104 =   OpCompositeExtract %float %101 1
        %105 =   OpCompositeExtract %float %101 2
        %106 =   OpCompositeExtract %float %101 3
        %108 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %108 %103
        %109 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %109 %104
        %110 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %110 %105
        %111 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %111 %106
        %113 =   OpCompositeConstruct %v2float %59 %62
        %112 =   OpImageSampleImplicitLod %v4float %65 %113 Bias %69
        %114 =   OpCompositeExtract %float %112 0
        %115 =   OpCompositeExtract %float %112 1
        %116 =   OpCompositeExtract %float %112 2
        %117 =   OpCompositeExtract %float %112 3
        %119 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %119 %114
        %120 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %120 %115
        %121 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %121 %116
        %122 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %122 %117
        %124 =   OpCompositeConstruct %v2float %59 %62
        %123 =   OpImageSampleImplicitLod %v4float %65 %124 MinLod %70
        %125 =   OpCompositeExtract %float %123 0
        %126 =   OpCompositeExtract %float %123 1
        %127 =   OpCompositeExtract %float %123 2
        %128 =   OpCompositeExtract %float %123 3
        %130 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %130 %125
        %131 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %131 %126
        %132 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %132 %127
        %133 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %133 %128
        %135 =   OpCompositeConstruct %v2float %59 %62
        %134 =   OpImageSampleImplicitLod %v4float %65 %135 Bias|ConstOffset|MinLod %69 %91 %70
        %136 =   OpCompositeExtract %float %134 0
        %137 =   OpCompositeExtract %float %134 1
        %138 =   OpCompositeExtract %float %134 2
        %139 =   OpCompositeExtract %float %134 3
        %141 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_0
                 OpStore %141 %136
        %142 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_1
                 OpStore %142 %137
        %143 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_2
                 OpStore %143 %138
        %144 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_3
                 OpStore %144 %139
        %145 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_0
        %146 =   OpLoad %float %145
        %147 =   OpDPdx %float %146
        %148 =   OpDPdy %float %146
        %149 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_1
        %150 =   OpLoad %float %149
        %151 =   OpDPdx %float %150
        %152 =   OpDPdy %float %150
        %156 =   OpCompositeConstruct %v2float %59 %62
        %157 =   OpCompositeConstruct %v2float %147 %151
        %158 =   OpCompositeConstruct %v2float %148 %152
        %155 =   OpImageSampleExplicitLod %v4float %65 %156 Grad %157 %158
        %159 =   OpCompositeExtract %float %155 0
        %160 =   OpCompositeExtract %float %155 1
        %161 =   OpCompositeExtract %float %155 2
        %162 =   OpCompositeExtract %float %155 3
        %164 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_0
                 OpStore %164 %159
        %165 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_1
                 OpStore %165 %160
        %166 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_2
                 OpStore %166 %161
        %167 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_3
                 OpStore %167 %162
        %169 =   OpCompositeConstruct %v2float %59 %62
        %170 =   OpCompositeConstruct %v2float %147 %151
        %171 =   OpCompositeConstruct %v2float %148 %152
        %168 =   OpImageSampleExplicitLod %v4float %65 %169 Grad|ConstOffset %170 %171 %91
        %172 =   OpCompositeExtract %float %168 0
        %173 =   OpCompositeExtract %float %168 1
        %174 =   OpCompositeExtract %float %168 2
        %175 =   OpCompositeExtract %float %168 3
        %177 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_0
                 OpStore %177 %172
        %178 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_1
                 OpStore %178 %173
        %179 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_2
                 OpStore %179 %174
        %180 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_3
                 OpStore %180 %175
                 OpReturn
               OpFunctionEnd

