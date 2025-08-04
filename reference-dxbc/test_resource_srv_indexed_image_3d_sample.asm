SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 184
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
               OpDecorate %43 NonUniform
               OpDecorate %46 NonUniform
               OpDecorate %49 NonUniform
               OpDecorate %60 NonUniform
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
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
         %59 = OpTypeSampledImage %6
    %v2float = OpTypeVector %float 2
    %float_0 = OpConstant %float 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
      %int_1 = OpConstant %int 1
      %v3int = OpTypeVector %int 3
         %88 = OpConstantComposite %v3int %int_n1 %int_0 %int_1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %182

        %182 = OpLabel
         %41 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %uint_0
         %42 =   OpLoad %float %41
         %43 =   OpBitcast %uint %42
         %45 =   OpAccessChain %_ptr_UniformConstant_6 %9 %43
         %46 =   OpLoad %6 %45
         %48 =   OpAccessChain %_ptr_UniformConstant_16 %19 %43
         %49 =   OpLoad %16 %48
         %50 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %51 =   OpLoad %float %50
         %52 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %54 =   OpLoad %float %52
         %55 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_2
         %57 =   OpLoad %float %55
         %60 =   OpSampledImage %59 %46 %49
         %63 =   OpCompositeConstruct %v3float %51 %54 %57
         %62 =   OpImageQueryLod %v2float %60 %63
         %64 =   OpCompositeExtract %float %62 0
         %65 =   OpLoad %float %LOD_BIAS
         %66 =   OpLoad %float %LOD_CLAMP
         %69 =   OpCompositeConstruct %v3float %51 %54 %57
         %68 =   OpImageSampleImplicitLod %v4float %60 %69 None
         %70 =   OpCompositeExtract %float %68 0
         %71 =   OpCompositeExtract %float %68 1
         %72 =   OpCompositeExtract %float %68 2
         %73 =   OpCompositeExtract %float %68 3
         %76 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %76 %70
         %77 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %77 %71
         %78 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %78 %72
         %79 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %79 %73
         %86 =   OpCompositeConstruct %v3float %51 %54 %57
         %85 =   OpImageSampleImplicitLod %v4float %60 %86 ConstOffset %88
         %89 =   OpCompositeExtract %float %85 0
         %90 =   OpCompositeExtract %float %85 1
         %91 =   OpCompositeExtract %float %85 2
         %92 =   OpCompositeExtract %float %85 3
         %94 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %94 %89
         %95 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %95 %90
         %96 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %96 %91
         %97 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %97 %92
         %99 =   OpCompositeConstruct %v3float %51 %54 %57
         %98 =   OpImageSampleExplicitLod %v4float %60 %99 Lod %64
        %100 =   OpCompositeExtract %float %98 0
        %101 =   OpCompositeExtract %float %98 1
        %102 =   OpCompositeExtract %float %98 2
        %103 =   OpCompositeExtract %float %98 3
        %105 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %105 %100
        %106 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %106 %101
        %107 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %107 %102
        %108 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %108 %103
        %110 =   OpCompositeConstruct %v3float %51 %54 %57
        %109 =   OpImageSampleImplicitLod %v4float %60 %110 Bias %65
        %111 =   OpCompositeExtract %float %109 0
        %112 =   OpCompositeExtract %float %109 1
        %113 =   OpCompositeExtract %float %109 2
        %114 =   OpCompositeExtract %float %109 3
        %116 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %116 %111
        %117 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %117 %112
        %118 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %118 %113
        %119 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %119 %114
        %121 =   OpCompositeConstruct %v3float %51 %54 %57
        %120 =   OpImageSampleImplicitLod %v4float %60 %121 MinLod %66
        %122 =   OpCompositeExtract %float %120 0
        %123 =   OpCompositeExtract %float %120 1
        %124 =   OpCompositeExtract %float %120 2
        %125 =   OpCompositeExtract %float %120 3
        %127 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %127 %122
        %128 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %128 %123
        %129 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %129 %124
        %130 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %130 %125
        %132 =   OpCompositeConstruct %v3float %51 %54 %57
        %131 =   OpImageSampleImplicitLod %v4float %60 %132 Bias|ConstOffset|MinLod %65 %88 %66
        %133 =   OpCompositeExtract %float %131 0
        %134 =   OpCompositeExtract %float %131 1
        %135 =   OpCompositeExtract %float %131 2
        %136 =   OpCompositeExtract %float %131 3
        %138 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_0
                 OpStore %138 %133
        %139 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_1
                 OpStore %139 %134
        %140 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_2
                 OpStore %140 %135
        %141 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_3
                 OpStore %141 %136
        %142 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_0
        %143 =   OpLoad %float %142
        %144 =   OpDPdx %float %143
        %145 =   OpDPdy %float %143
        %146 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_1
        %147 =   OpLoad %float %146
        %148 =   OpDPdx %float %147
        %149 =   OpDPdy %float %147
        %150 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_2
        %151 =   OpLoad %float %150
        %152 =   OpDPdx %float %151
        %153 =   OpDPdy %float %151
        %157 =   OpCompositeConstruct %v3float %51 %54 %57
        %158 =   OpCompositeConstruct %v3float %144 %148 %152
        %159 =   OpCompositeConstruct %v3float %145 %149 %153
        %156 =   OpImageSampleExplicitLod %v4float %60 %157 Grad %158 %159
        %160 =   OpCompositeExtract %float %156 0
        %161 =   OpCompositeExtract %float %156 1
        %162 =   OpCompositeExtract %float %156 2
        %163 =   OpCompositeExtract %float %156 3
        %165 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_0
                 OpStore %165 %160
        %166 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_1
                 OpStore %166 %161
        %167 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_2
                 OpStore %167 %162
        %168 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_3
                 OpStore %168 %163
        %170 =   OpCompositeConstruct %v3float %51 %54 %57
        %171 =   OpCompositeConstruct %v3float %144 %148 %152
        %172 =   OpCompositeConstruct %v3float %145 %149 %153
        %169 =   OpImageSampleExplicitLod %v4float %60 %170 Grad|ConstOffset %171 %172 %88
        %173 =   OpCompositeExtract %float %169 0
        %174 =   OpCompositeExtract %float %169 1
        %175 =   OpCompositeExtract %float %169 2
        %176 =   OpCompositeExtract %float %169 3
        %178 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_0
                 OpStore %178 %173
        %179 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_1
                 OpStore %179 %174
        %180 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_2
                 OpStore %180 %175
        %181 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_3
                 OpStore %181 %176
                 OpReturn
               OpFunctionEnd

