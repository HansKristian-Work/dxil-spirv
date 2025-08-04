SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 179
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
               OpDecorate %45 NonUniform
               OpDecorate %48 NonUniform
               OpDecorate %51 NonUniform
               OpDecorate %60 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 2D 0 1 0 1 Unknown
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
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
         %59 = OpTypeSampledImage %6
    %float_0 = OpConstant %float 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
      %v2int = OpTypeVector %int 2
         %87 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %177

        %177 = OpLabel
         %43 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %uint_0
         %44 =   OpLoad %float %43
         %45 =   OpBitcast %uint %44
         %47 =   OpAccessChain %_ptr_UniformConstant_6 %9 %45
         %48 =   OpLoad %6 %47
         %50 =   OpAccessChain %_ptr_UniformConstant_16 %19 %45
         %51 =   OpLoad %16 %50
         %52 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %53 =   OpLoad %float %52
         %54 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %56 =   OpLoad %float %54
         %58 =   OpLoad %float %LAYER
         %60 =   OpSampledImage %59 %48 %51
         %62 =   OpCompositeConstruct %v2float %53 %56
         %61 =   OpImageQueryLod %v2float %60 %62
         %63 =   OpCompositeExtract %float %61 0
         %64 =   OpLoad %float %LOD_BIAS
         %65 =   OpLoad %float %LOD_CLAMP
         %68 =   OpCompositeConstruct %v3float %53 %56 %58
         %67 =   OpImageSampleImplicitLod %v4float %60 %68 None
         %69 =   OpCompositeExtract %float %67 0
         %70 =   OpCompositeExtract %float %67 1
         %71 =   OpCompositeExtract %float %67 2
         %72 =   OpCompositeExtract %float %67 3
         %75 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %75 %69
         %76 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %76 %70
         %77 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %77 %71
         %79 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %79 %72
         %85 =   OpCompositeConstruct %v3float %53 %56 %58
         %84 =   OpImageSampleImplicitLod %v4float %60 %85 ConstOffset %87
         %88 =   OpCompositeExtract %float %84 0
         %89 =   OpCompositeExtract %float %84 1
         %90 =   OpCompositeExtract %float %84 2
         %91 =   OpCompositeExtract %float %84 3
         %93 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %93 %88
         %94 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %94 %89
         %95 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %95 %90
         %96 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %96 %91
         %98 =   OpCompositeConstruct %v3float %53 %56 %58
         %97 =   OpImageSampleExplicitLod %v4float %60 %98 Lod %63
         %99 =   OpCompositeExtract %float %97 0
        %100 =   OpCompositeExtract %float %97 1
        %101 =   OpCompositeExtract %float %97 2
        %102 =   OpCompositeExtract %float %97 3
        %104 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %104 %99
        %105 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %105 %100
        %106 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %106 %101
        %107 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %107 %102
        %109 =   OpCompositeConstruct %v3float %53 %56 %58
        %108 =   OpImageSampleImplicitLod %v4float %60 %109 Bias %64
        %110 =   OpCompositeExtract %float %108 0
        %111 =   OpCompositeExtract %float %108 1
        %112 =   OpCompositeExtract %float %108 2
        %113 =   OpCompositeExtract %float %108 3
        %115 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %115 %110
        %116 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %116 %111
        %117 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %117 %112
        %118 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %118 %113
        %120 =   OpCompositeConstruct %v3float %53 %56 %58
        %119 =   OpImageSampleImplicitLod %v4float %60 %120 MinLod %65
        %121 =   OpCompositeExtract %float %119 0
        %122 =   OpCompositeExtract %float %119 1
        %123 =   OpCompositeExtract %float %119 2
        %124 =   OpCompositeExtract %float %119 3
        %126 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %126 %121
        %127 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %127 %122
        %128 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %128 %123
        %129 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %129 %124
        %131 =   OpCompositeConstruct %v3float %53 %56 %58
        %130 =   OpImageSampleImplicitLod %v4float %60 %131 Bias|ConstOffset|MinLod %64 %87 %65
        %132 =   OpCompositeExtract %float %130 0
        %133 =   OpCompositeExtract %float %130 1
        %134 =   OpCompositeExtract %float %130 2
        %135 =   OpCompositeExtract %float %130 3
        %137 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_0
                 OpStore %137 %132
        %138 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_1
                 OpStore %138 %133
        %139 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_2
                 OpStore %139 %134
        %140 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_3
                 OpStore %140 %135
        %141 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_0
        %142 =   OpLoad %float %141
        %143 =   OpDPdx %float %142
        %144 =   OpDPdy %float %142
        %145 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_1
        %146 =   OpLoad %float %145
        %147 =   OpDPdx %float %146
        %148 =   OpDPdy %float %146
        %152 =   OpCompositeConstruct %v3float %53 %56 %58
        %153 =   OpCompositeConstruct %v2float %143 %147
        %154 =   OpCompositeConstruct %v2float %144 %148
        %151 =   OpImageSampleExplicitLod %v4float %60 %152 Grad %153 %154
        %155 =   OpCompositeExtract %float %151 0
        %156 =   OpCompositeExtract %float %151 1
        %157 =   OpCompositeExtract %float %151 2
        %158 =   OpCompositeExtract %float %151 3
        %160 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_0
                 OpStore %160 %155
        %161 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_1
                 OpStore %161 %156
        %162 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_2
                 OpStore %162 %157
        %163 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_3
                 OpStore %163 %158
        %165 =   OpCompositeConstruct %v3float %53 %56 %58
        %166 =   OpCompositeConstruct %v2float %143 %147
        %167 =   OpCompositeConstruct %v2float %144 %148
        %164 =   OpImageSampleExplicitLod %v4float %60 %165 Grad|ConstOffset %166 %167 %87
        %168 =   OpCompositeExtract %float %164 0
        %169 =   OpCompositeExtract %float %164 1
        %170 =   OpCompositeExtract %float %164 2
        %171 =   OpCompositeExtract %float %164 3
        %173 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_0
                 OpStore %173 %168
        %174 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_1
                 OpStore %174 %169
        %175 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_2
                 OpStore %175 %170
        %176 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_3
                 OpStore %176 %171
                 OpReturn
               OpFunctionEnd

