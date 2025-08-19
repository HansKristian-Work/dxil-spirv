SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 145
; Schema: 0
               OpCapability Shader
               OpCapability MinLod
               OpCapability Sampled1D
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
          %6 = OpTypeImage %float 1D 0 1 0 1 Unknown
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
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
         %38 = OpTypeSampledImage %6
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
                 OpBranch %143

        %143 = OpLabel
         %31 =   OpLoad %6 %8
         %32 =   OpLoad %9 %11
         %33 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %36 =   OpLoad %float %33
         %37 =   OpLoad %float %LAYER
         %39 =   OpSampledImage %38 %31 %32
         %41 =   OpImageQueryLod %v2float %39 %36
         %42 =   OpCompositeExtract %float %41 0
         %43 =   OpLoad %float %LOD_BIAS
         %44 =   OpLoad %float %LOD_CLAMP
         %47 =   OpCompositeConstruct %v2float %36 %37
         %46 =   OpImageSampleImplicitLod %v4float %39 %47 None
         %48 =   OpCompositeExtract %float %46 0
         %49 =   OpCompositeExtract %float %46 1
         %50 =   OpCompositeExtract %float %46 2
         %51 =   OpCompositeExtract %float %46 3
         %54 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %54 %48
         %55 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %55 %49
         %57 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %57 %50
         %59 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %59 %51
         %64 =   OpCompositeConstruct %v2float %36 %37
         %63 =   OpImageSampleImplicitLod %v4float %39 %64 ConstOffset %int_n1
         %65 =   OpCompositeExtract %float %63 0
         %66 =   OpCompositeExtract %float %63 1
         %67 =   OpCompositeExtract %float %63 2
         %68 =   OpCompositeExtract %float %63 3
         %70 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %70 %65
         %71 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %71 %66
         %72 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %72 %67
         %73 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %73 %68
         %75 =   OpCompositeConstruct %v2float %36 %37
         %74 =   OpImageSampleExplicitLod %v4float %39 %75 Lod %42
         %76 =   OpCompositeExtract %float %74 0
         %77 =   OpCompositeExtract %float %74 1
         %78 =   OpCompositeExtract %float %74 2
         %79 =   OpCompositeExtract %float %74 3
         %81 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %81 %76
         %82 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %82 %77
         %83 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %83 %78
         %84 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %84 %79
         %86 =   OpCompositeConstruct %v2float %36 %37
         %85 =   OpImageSampleImplicitLod %v4float %39 %86 Bias %43
         %87 =   OpCompositeExtract %float %85 0
         %88 =   OpCompositeExtract %float %85 1
         %89 =   OpCompositeExtract %float %85 2
         %90 =   OpCompositeExtract %float %85 3
         %92 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %92 %87
         %93 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %93 %88
         %94 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %94 %89
         %95 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %95 %90
         %97 =   OpCompositeConstruct %v2float %36 %37
         %96 =   OpImageSampleImplicitLod %v4float %39 %97 MinLod %44
         %98 =   OpCompositeExtract %float %96 0
         %99 =   OpCompositeExtract %float %96 1
        %100 =   OpCompositeExtract %float %96 2
        %101 =   OpCompositeExtract %float %96 3
        %103 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %103 %98
        %104 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %104 %99
        %105 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %105 %100
        %106 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %106 %101
        %108 =   OpCompositeConstruct %v2float %36 %37
        %107 =   OpImageSampleImplicitLod %v4float %39 %108 Bias|ConstOffset|MinLod %43 %int_n1 %44
        %109 =   OpCompositeExtract %float %107 0
        %110 =   OpCompositeExtract %float %107 1
        %111 =   OpCompositeExtract %float %107 2
        %112 =   OpCompositeExtract %float %107 3
        %114 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_0
                 OpStore %114 %109
        %115 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_1
                 OpStore %115 %110
        %116 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_2
                 OpStore %116 %111
        %117 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_3
                 OpStore %117 %112
        %118 =   OpLoad %float %TEXCOORD_2
        %119 =   OpDPdx %float %118
        %120 =   OpDPdy %float %118
        %122 =   OpCompositeConstruct %v2float %36 %37
        %121 =   OpImageSampleExplicitLod %v4float %39 %122 Grad %119 %120
        %123 =   OpCompositeExtract %float %121 0
        %124 =   OpCompositeExtract %float %121 1
        %125 =   OpCompositeExtract %float %121 2
        %126 =   OpCompositeExtract %float %121 3
        %128 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_0
                 OpStore %128 %123
        %129 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_1
                 OpStore %129 %124
        %130 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_2
                 OpStore %130 %125
        %131 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_3
                 OpStore %131 %126
        %133 =   OpCompositeConstruct %v2float %36 %37
        %132 =   OpImageSampleExplicitLod %v4float %39 %133 Grad|ConstOffset %119 %120 %int_n1
        %134 =   OpCompositeExtract %float %132 0
        %135 =   OpCompositeExtract %float %132 1
        %136 =   OpCompositeExtract %float %132 2
        %137 =   OpCompositeExtract %float %132 3
        %139 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_0
                 OpStore %139 %134
        %140 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_1
                 OpStore %140 %135
        %141 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_2
                 OpStore %141 %136
        %142 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_3
                 OpStore %142 %137
                 OpReturn
               OpFunctionEnd

