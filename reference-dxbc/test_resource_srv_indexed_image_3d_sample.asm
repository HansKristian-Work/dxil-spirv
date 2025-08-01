SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 189
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
               OpDecorate %49 NonUniform
               OpDecorate %52 NonUniform
               OpDecorate %55 NonUniform
               OpDecorate %65 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 3D 0 0 0 1 Unknown
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
 %TEXCOORD_2 = OpVariable %_ptr_Input_v3float Input
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
    %v2float = OpTypeVector %float 2
    %float_0 = OpConstant %float 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
      %int_1 = OpConstant %int 1
      %v3int = OpTypeVector %int 3
         %93 = OpConstantComposite %v3int %int_n1 %int_0 %int_1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %187

        %187 = OpLabel
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
         %58 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %60 =   OpLoad %float %58
         %61 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_2
         %62 =   OpLoad %float %61
         %65 =   OpSampledImage %64 %52 %55
         %68 =   OpCompositeConstruct %v3float %57 %60 %62
         %67 =   OpImageQueryLod %v2float %65 %68
         %69 =   OpCompositeExtract %float %67 0
         %70 =   OpLoad %float %LOD_BIAS
         %71 =   OpLoad %float %LOD_CLAMP
         %74 =   OpCompositeConstruct %v3float %57 %60 %62
         %73 =   OpImageSampleImplicitLod %v4float %65 %74 None
         %75 =   OpCompositeExtract %float %73 0
         %76 =   OpCompositeExtract %float %73 1
         %77 =   OpCompositeExtract %float %73 2
         %78 =   OpCompositeExtract %float %73 3
         %81 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %81 %75
         %82 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %82 %76
         %83 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %83 %77
         %84 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %84 %78
         %91 =   OpCompositeConstruct %v3float %57 %60 %62
         %90 =   OpImageSampleImplicitLod %v4float %65 %91 ConstOffset %93
         %94 =   OpCompositeExtract %float %90 0
         %95 =   OpCompositeExtract %float %90 1
         %96 =   OpCompositeExtract %float %90 2
         %97 =   OpCompositeExtract %float %90 3
         %99 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %99 %94
        %100 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %100 %95
        %101 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %101 %96
        %102 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %102 %97
        %104 =   OpCompositeConstruct %v3float %57 %60 %62
        %103 =   OpImageSampleExplicitLod %v4float %65 %104 Lod %69
        %105 =   OpCompositeExtract %float %103 0
        %106 =   OpCompositeExtract %float %103 1
        %107 =   OpCompositeExtract %float %103 2
        %108 =   OpCompositeExtract %float %103 3
        %110 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %110 %105
        %111 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %111 %106
        %112 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %112 %107
        %113 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %113 %108
        %115 =   OpCompositeConstruct %v3float %57 %60 %62
        %114 =   OpImageSampleImplicitLod %v4float %65 %115 Bias %70
        %116 =   OpCompositeExtract %float %114 0
        %117 =   OpCompositeExtract %float %114 1
        %118 =   OpCompositeExtract %float %114 2
        %119 =   OpCompositeExtract %float %114 3
        %121 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %121 %116
        %122 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %122 %117
        %123 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %123 %118
        %124 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %124 %119
        %126 =   OpCompositeConstruct %v3float %57 %60 %62
        %125 =   OpImageSampleImplicitLod %v4float %65 %126 MinLod %71
        %127 =   OpCompositeExtract %float %125 0
        %128 =   OpCompositeExtract %float %125 1
        %129 =   OpCompositeExtract %float %125 2
        %130 =   OpCompositeExtract %float %125 3
        %132 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %132 %127
        %133 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %133 %128
        %134 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %134 %129
        %135 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %135 %130
        %137 =   OpCompositeConstruct %v3float %57 %60 %62
        %136 =   OpImageSampleImplicitLod %v4float %65 %137 Bias|ConstOffset|MinLod %70 %93 %71
        %138 =   OpCompositeExtract %float %136 0
        %139 =   OpCompositeExtract %float %136 1
        %140 =   OpCompositeExtract %float %136 2
        %141 =   OpCompositeExtract %float %136 3
        %143 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_0
                 OpStore %143 %138
        %144 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_1
                 OpStore %144 %139
        %145 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_2
                 OpStore %145 %140
        %146 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_3
                 OpStore %146 %141
        %147 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_0
        %148 =   OpLoad %float %147
        %149 =   OpDPdx %float %148
        %150 =   OpDPdy %float %148
        %151 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_1
        %152 =   OpLoad %float %151
        %153 =   OpDPdx %float %152
        %154 =   OpDPdy %float %152
        %155 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_2
        %156 =   OpLoad %float %155
        %157 =   OpDPdx %float %156
        %158 =   OpDPdy %float %156
        %162 =   OpCompositeConstruct %v3float %57 %60 %62
        %163 =   OpCompositeConstruct %v3float %149 %153 %157
        %164 =   OpCompositeConstruct %v3float %150 %154 %158
        %161 =   OpImageSampleExplicitLod %v4float %65 %162 Grad %163 %164
        %165 =   OpCompositeExtract %float %161 0
        %166 =   OpCompositeExtract %float %161 1
        %167 =   OpCompositeExtract %float %161 2
        %168 =   OpCompositeExtract %float %161 3
        %170 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_0
                 OpStore %170 %165
        %171 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_1
                 OpStore %171 %166
        %172 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_2
                 OpStore %172 %167
        %173 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_3
                 OpStore %173 %168
        %175 =   OpCompositeConstruct %v3float %57 %60 %62
        %176 =   OpCompositeConstruct %v3float %149 %153 %157
        %177 =   OpCompositeConstruct %v3float %150 %154 %158
        %174 =   OpImageSampleExplicitLod %v4float %65 %175 Grad|ConstOffset %176 %177 %93
        %178 =   OpCompositeExtract %float %174 0
        %179 =   OpCompositeExtract %float %174 1
        %180 =   OpCompositeExtract %float %174 2
        %181 =   OpCompositeExtract %float %174 3
        %183 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_0
                 OpStore %183 %178
        %184 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_1
                 OpStore %184 %179
        %185 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_2
                 OpStore %185 %180
        %186 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_3
                 OpStore %186 %181
                 OpReturn
               OpFunctionEnd

