SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 178
; Schema: 0
               OpCapability Shader
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability MinLod
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
               OpDecorate %45 NonUniform
               OpDecorate %48 NonUniform
               OpDecorate %51 NonUniform
               OpDecorate %59 NonUniform
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
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
         %58 = OpTypeSampledImage %6
    %float_0 = OpConstant %float 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
      %v2int = OpTypeVector %int 2
         %86 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %176

        %176 = OpLabel
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
         %59 =   OpSampledImage %58 %48 %51
         %61 =   OpCompositeConstruct %v2float %53 %56
         %60 =   OpImageQueryLod %v2float %59 %61
         %62 =   OpCompositeExtract %float %60 0
         %63 =   OpLoad %float %LOD_BIAS
         %64 =   OpLoad %float %LOD_CLAMP
         %67 =   OpCompositeConstruct %v2float %53 %56
         %66 =   OpImageSampleImplicitLod %v4float %59 %67 None
         %68 =   OpCompositeExtract %float %66 0
         %69 =   OpCompositeExtract %float %66 1
         %70 =   OpCompositeExtract %float %66 2
         %71 =   OpCompositeExtract %float %66 3
         %74 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %74 %68
         %75 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %75 %69
         %76 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %76 %70
         %78 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %78 %71
         %84 =   OpCompositeConstruct %v2float %53 %56
         %83 =   OpImageSampleImplicitLod %v4float %59 %84 ConstOffset %86
         %87 =   OpCompositeExtract %float %83 0
         %88 =   OpCompositeExtract %float %83 1
         %89 =   OpCompositeExtract %float %83 2
         %90 =   OpCompositeExtract %float %83 3
         %92 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %92 %87
         %93 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %93 %88
         %94 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %94 %89
         %95 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %95 %90
         %97 =   OpCompositeConstruct %v2float %53 %56
         %96 =   OpImageSampleExplicitLod %v4float %59 %97 Lod %62
         %98 =   OpCompositeExtract %float %96 0
         %99 =   OpCompositeExtract %float %96 1
        %100 =   OpCompositeExtract %float %96 2
        %101 =   OpCompositeExtract %float %96 3
        %103 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %103 %98
        %104 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %104 %99
        %105 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %105 %100
        %106 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %106 %101
        %108 =   OpCompositeConstruct %v2float %53 %56
        %107 =   OpImageSampleImplicitLod %v4float %59 %108 Bias %63
        %109 =   OpCompositeExtract %float %107 0
        %110 =   OpCompositeExtract %float %107 1
        %111 =   OpCompositeExtract %float %107 2
        %112 =   OpCompositeExtract %float %107 3
        %114 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %114 %109
        %115 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %115 %110
        %116 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %116 %111
        %117 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %117 %112
        %119 =   OpCompositeConstruct %v2float %53 %56
        %118 =   OpImageSampleImplicitLod %v4float %59 %119 MinLod %64
        %120 =   OpCompositeExtract %float %118 0
        %121 =   OpCompositeExtract %float %118 1
        %122 =   OpCompositeExtract %float %118 2
        %123 =   OpCompositeExtract %float %118 3
        %125 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %125 %120
        %126 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %126 %121
        %127 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %127 %122
        %128 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %128 %123
        %130 =   OpCompositeConstruct %v2float %53 %56
        %129 =   OpImageSampleImplicitLod %v4float %59 %130 Bias|ConstOffset|MinLod %63 %86 %64
        %131 =   OpCompositeExtract %float %129 0
        %132 =   OpCompositeExtract %float %129 1
        %133 =   OpCompositeExtract %float %129 2
        %134 =   OpCompositeExtract %float %129 3
        %136 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_0
                 OpStore %136 %131
        %137 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_1
                 OpStore %137 %132
        %138 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_2
                 OpStore %138 %133
        %139 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_3
                 OpStore %139 %134
        %140 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_0
        %141 =   OpLoad %float %140
        %142 =   OpDPdx %float %141
        %143 =   OpDPdy %float %141
        %144 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_1
        %145 =   OpLoad %float %144
        %146 =   OpDPdx %float %145
        %147 =   OpDPdy %float %145
        %151 =   OpCompositeConstruct %v2float %53 %56
        %152 =   OpCompositeConstruct %v2float %142 %146
        %153 =   OpCompositeConstruct %v2float %143 %147
        %150 =   OpImageSampleExplicitLod %v4float %59 %151 Grad %152 %153
        %154 =   OpCompositeExtract %float %150 0
        %155 =   OpCompositeExtract %float %150 1
        %156 =   OpCompositeExtract %float %150 2
        %157 =   OpCompositeExtract %float %150 3
        %159 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_0
                 OpStore %159 %154
        %160 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_1
                 OpStore %160 %155
        %161 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_2
                 OpStore %161 %156
        %162 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_3
                 OpStore %162 %157
        %164 =   OpCompositeConstruct %v2float %53 %56
        %165 =   OpCompositeConstruct %v2float %142 %146
        %166 =   OpCompositeConstruct %v2float %143 %147
        %163 =   OpImageSampleExplicitLod %v4float %59 %164 Grad|ConstOffset %165 %166 %86
        %167 =   OpCompositeExtract %float %163 0
        %168 =   OpCompositeExtract %float %163 1
        %169 =   OpCompositeExtract %float %163 2
        %170 =   OpCompositeExtract %float %163 3
        %172 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_0
                 OpStore %172 %167
        %173 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_1
                 OpStore %173 %168
        %174 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_2
                 OpStore %174 %169
        %175 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_3
                 OpStore %175 %170
                 OpReturn
               OpFunctionEnd

