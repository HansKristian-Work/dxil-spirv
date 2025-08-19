SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 164
; Schema: 0
               OpCapability Shader
               OpCapability MinLod
               OpCapability ImageQuery
               OpCapability DerivativeControl
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %11 %TEXCOORD %DEPTH_REF %LOD_BIAS %LOD_CLAMP %LAYER %TEXCOORD_2 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3 %SV_TARGET_4 %SV_TARGET_5 %SV_TARGET_6 %SV_TARGET_7
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
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
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %11 DescriptorSet 0
               OpDecorate %11 Binding 0
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
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 2D 0 1 0 1 Unknown
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
          %9 = OpTypeSampler
%_ptr_UniformConstant_9 = OpTypePointer UniformConstant %9
         %11 = OpVariable %_ptr_UniformConstant_9 UniformConstant
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
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
         %44 = OpTypeSampledImage %6
    %float_0 = OpConstant %float 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
      %v2int = OpTypeVector %int 2
         %72 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %162

        %162 = OpLabel
         %33 =   OpLoad %6 %8
         %34 =   OpLoad %9 %11
         %35 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %38 =   OpLoad %float %35
         %39 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %41 =   OpLoad %float %39
         %43 =   OpLoad %float %LAYER
         %45 =   OpSampledImage %44 %33 %34
         %47 =   OpCompositeConstruct %v2float %38 %41
         %46 =   OpImageQueryLod %v2float %45 %47
         %48 =   OpCompositeExtract %float %46 0
         %49 =   OpLoad %float %LOD_BIAS
         %50 =   OpLoad %float %LOD_CLAMP
         %53 =   OpCompositeConstruct %v3float %38 %41 %43
         %52 =   OpImageSampleImplicitLod %v4float %45 %53 None
         %54 =   OpCompositeExtract %float %52 0
         %55 =   OpCompositeExtract %float %52 1
         %56 =   OpCompositeExtract %float %52 2
         %57 =   OpCompositeExtract %float %52 3
         %60 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %60 %54
         %61 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %61 %55
         %62 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %62 %56
         %64 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %64 %57
         %70 =   OpCompositeConstruct %v3float %38 %41 %43
         %69 =   OpImageSampleImplicitLod %v4float %45 %70 ConstOffset %72
         %73 =   OpCompositeExtract %float %69 0
         %74 =   OpCompositeExtract %float %69 1
         %75 =   OpCompositeExtract %float %69 2
         %76 =   OpCompositeExtract %float %69 3
         %78 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %78 %73
         %79 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %79 %74
         %80 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %80 %75
         %81 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %81 %76
         %83 =   OpCompositeConstruct %v3float %38 %41 %43
         %82 =   OpImageSampleExplicitLod %v4float %45 %83 Lod %48
         %84 =   OpCompositeExtract %float %82 0
         %85 =   OpCompositeExtract %float %82 1
         %86 =   OpCompositeExtract %float %82 2
         %87 =   OpCompositeExtract %float %82 3
         %89 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %89 %84
         %90 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %90 %85
         %91 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %91 %86
         %92 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %92 %87
         %94 =   OpCompositeConstruct %v3float %38 %41 %43
         %93 =   OpImageSampleImplicitLod %v4float %45 %94 Bias %49
         %95 =   OpCompositeExtract %float %93 0
         %96 =   OpCompositeExtract %float %93 1
         %97 =   OpCompositeExtract %float %93 2
         %98 =   OpCompositeExtract %float %93 3
        %100 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %100 %95
        %101 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %101 %96
        %102 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %102 %97
        %103 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %103 %98
        %105 =   OpCompositeConstruct %v3float %38 %41 %43
        %104 =   OpImageSampleImplicitLod %v4float %45 %105 MinLod %50
        %106 =   OpCompositeExtract %float %104 0
        %107 =   OpCompositeExtract %float %104 1
        %108 =   OpCompositeExtract %float %104 2
        %109 =   OpCompositeExtract %float %104 3
        %111 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %111 %106
        %112 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %112 %107
        %113 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %113 %108
        %114 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %114 %109
        %116 =   OpCompositeConstruct %v3float %38 %41 %43
        %115 =   OpImageSampleImplicitLod %v4float %45 %116 Bias|ConstOffset|MinLod %49 %72 %50
        %117 =   OpCompositeExtract %float %115 0
        %118 =   OpCompositeExtract %float %115 1
        %119 =   OpCompositeExtract %float %115 2
        %120 =   OpCompositeExtract %float %115 3
        %122 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_0
                 OpStore %122 %117
        %123 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_1
                 OpStore %123 %118
        %124 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_2
                 OpStore %124 %119
        %125 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_3
                 OpStore %125 %120
        %126 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_0
        %127 =   OpLoad %float %126
        %128 =   OpDPdx %float %127
        %129 =   OpDPdy %float %127
        %130 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_1
        %131 =   OpLoad %float %130
        %132 =   OpDPdx %float %131
        %133 =   OpDPdy %float %131
        %137 =   OpCompositeConstruct %v3float %38 %41 %43
        %138 =   OpCompositeConstruct %v2float %128 %132
        %139 =   OpCompositeConstruct %v2float %129 %133
        %136 =   OpImageSampleExplicitLod %v4float %45 %137 Grad %138 %139
        %140 =   OpCompositeExtract %float %136 0
        %141 =   OpCompositeExtract %float %136 1
        %142 =   OpCompositeExtract %float %136 2
        %143 =   OpCompositeExtract %float %136 3
        %145 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_0
                 OpStore %145 %140
        %146 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_1
                 OpStore %146 %141
        %147 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_2
                 OpStore %147 %142
        %148 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_3
                 OpStore %148 %143
        %150 =   OpCompositeConstruct %v3float %38 %41 %43
        %151 =   OpCompositeConstruct %v2float %128 %132
        %152 =   OpCompositeConstruct %v2float %129 %133
        %149 =   OpImageSampleExplicitLod %v4float %45 %150 Grad|ConstOffset %151 %152 %72
        %153 =   OpCompositeExtract %float %149 0
        %154 =   OpCompositeExtract %float %149 1
        %155 =   OpCompositeExtract %float %149 2
        %156 =   OpCompositeExtract %float %149 3
        %158 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_0
                 OpStore %158 %153
        %159 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_1
                 OpStore %159 %154
        %160 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_2
                 OpStore %160 %155
        %161 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_3
                 OpStore %161 %156
                 OpReturn
               OpFunctionEnd

