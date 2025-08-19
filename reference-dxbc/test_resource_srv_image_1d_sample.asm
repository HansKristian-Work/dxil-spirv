SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 136
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
          %6 = OpTypeImage %float 1D 0 0 0 1 Unknown
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
         %37 = OpTypeSampledImage %6
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
                 OpBranch %134

        %134 = OpLabel
         %31 =   OpLoad %6 %8
         %32 =   OpLoad %9 %11
         %33 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %36 =   OpLoad %float %33
         %38 =   OpSampledImage %37 %31 %32
         %40 =   OpImageQueryLod %v2float %38 %36
         %41 =   OpCompositeExtract %float %40 0
         %42 =   OpLoad %float %LOD_BIAS
         %43 =   OpLoad %float %LOD_CLAMP
         %45 =   OpImageSampleImplicitLod %v4float %38 %36 None
         %46 =   OpCompositeExtract %float %45 0
         %47 =   OpCompositeExtract %float %45 1
         %48 =   OpCompositeExtract %float %45 2
         %49 =   OpCompositeExtract %float %45 3
         %52 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %52 %46
         %53 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %53 %47
         %55 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %55 %48
         %57 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %57 %49
         %61 =   OpImageSampleImplicitLod %v4float %38 %36 ConstOffset %int_n1
         %62 =   OpCompositeExtract %float %61 0
         %63 =   OpCompositeExtract %float %61 1
         %64 =   OpCompositeExtract %float %61 2
         %65 =   OpCompositeExtract %float %61 3
         %67 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %67 %62
         %68 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %68 %63
         %69 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %69 %64
         %70 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %70 %65
         %71 =   OpImageSampleExplicitLod %v4float %38 %36 Lod %41
         %72 =   OpCompositeExtract %float %71 0
         %73 =   OpCompositeExtract %float %71 1
         %74 =   OpCompositeExtract %float %71 2
         %75 =   OpCompositeExtract %float %71 3
         %77 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %77 %72
         %78 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %78 %73
         %79 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %79 %74
         %80 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %80 %75
         %81 =   OpImageSampleImplicitLod %v4float %38 %36 Bias %42
         %82 =   OpCompositeExtract %float %81 0
         %83 =   OpCompositeExtract %float %81 1
         %84 =   OpCompositeExtract %float %81 2
         %85 =   OpCompositeExtract %float %81 3
         %87 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %87 %82
         %88 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %88 %83
         %89 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %89 %84
         %90 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %90 %85
         %91 =   OpImageSampleImplicitLod %v4float %38 %36 MinLod %43
         %92 =   OpCompositeExtract %float %91 0
         %93 =   OpCompositeExtract %float %91 1
         %94 =   OpCompositeExtract %float %91 2
         %95 =   OpCompositeExtract %float %91 3
         %97 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %97 %92
         %98 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %98 %93
         %99 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %99 %94
        %100 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %100 %95
        %101 =   OpImageSampleImplicitLod %v4float %38 %36 Bias|ConstOffset|MinLod %42 %int_n1 %43
        %102 =   OpCompositeExtract %float %101 0
        %103 =   OpCompositeExtract %float %101 1
        %104 =   OpCompositeExtract %float %101 2
        %105 =   OpCompositeExtract %float %101 3
        %107 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_0
                 OpStore %107 %102
        %108 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_1
                 OpStore %108 %103
        %109 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_2
                 OpStore %109 %104
        %110 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_3
                 OpStore %110 %105
        %111 =   OpLoad %float %TEXCOORD_2
        %112 =   OpDPdx %float %111
        %113 =   OpDPdy %float %111
        %114 =   OpImageSampleExplicitLod %v4float %38 %36 Grad %112 %113
        %115 =   OpCompositeExtract %float %114 0
        %116 =   OpCompositeExtract %float %114 1
        %117 =   OpCompositeExtract %float %114 2
        %118 =   OpCompositeExtract %float %114 3
        %120 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_0
                 OpStore %120 %115
        %121 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_1
                 OpStore %121 %116
        %122 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_2
                 OpStore %122 %117
        %123 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_3
                 OpStore %123 %118
        %124 =   OpImageSampleExplicitLod %v4float %38 %36 Grad|ConstOffset %112 %113 %int_n1
        %125 =   OpCompositeExtract %float %124 0
        %126 =   OpCompositeExtract %float %124 1
        %127 =   OpCompositeExtract %float %124 2
        %128 =   OpCompositeExtract %float %124 3
        %130 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_0
                 OpStore %130 %125
        %131 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_1
                 OpStore %131 %126
        %132 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_2
                 OpStore %132 %127
        %133 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_3
                 OpStore %133 %128
                 OpReturn
               OpFunctionEnd

