SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 126
; Schema: 0
               OpCapability Shader
               OpCapability MinLod
               OpCapability SampledCubeArray
               OpCapability ImageQuery
               OpCapability DerivativeControl
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %11 %TEXCOORD %DEPTH_REF %LOD_BIAS %LOD_CLAMP %LAYER %TEXCOORD_2 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3 %SV_TARGET_4
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
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float Cube 0 1 0 1 Unknown
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
 %TEXCOORD_2 = OpVariable %_ptr_Input_v3float Input
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_2 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_3 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_4 = OpVariable %_ptr_Output_v4float Output
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
         %42 = OpTypeSampledImage %6
    %v2float = OpTypeVector %float 2
    %float_0 = OpConstant %float 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %124

        %124 = OpLabel
         %28 =   OpLoad %6 %8
         %29 =   OpLoad %9 %11
         %30 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %33 =   OpLoad %float %30
         %34 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %36 =   OpLoad %float %34
         %37 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_2
         %39 =   OpLoad %float %37
         %41 =   OpLoad %float %LAYER
         %43 =   OpSampledImage %42 %28 %29
         %46 =   OpCompositeConstruct %v3float %33 %36 %39
         %45 =   OpImageQueryLod %v2float %43 %46
         %47 =   OpCompositeExtract %float %45 0
         %48 =   OpLoad %float %LOD_BIAS
         %49 =   OpLoad %float %LOD_CLAMP
         %52 =   OpCompositeConstruct %v4float %33 %36 %39 %41
         %51 =   OpImageSampleImplicitLod %v4float %43 %52 None
         %53 =   OpCompositeExtract %float %51 0
         %54 =   OpCompositeExtract %float %51 1
         %55 =   OpCompositeExtract %float %51 2
         %56 =   OpCompositeExtract %float %51 3
         %59 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %59 %53
         %60 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %60 %54
         %61 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %61 %55
         %62 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %62 %56
         %65 =   OpCompositeConstruct %v4float %33 %36 %39 %41
         %64 =   OpImageSampleExplicitLod %v4float %43 %65 Lod %47
         %66 =   OpCompositeExtract %float %64 0
         %67 =   OpCompositeExtract %float %64 1
         %68 =   OpCompositeExtract %float %64 2
         %69 =   OpCompositeExtract %float %64 3
         %71 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %71 %66
         %72 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %72 %67
         %73 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %73 %68
         %74 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %74 %69
         %76 =   OpCompositeConstruct %v4float %33 %36 %39 %41
         %75 =   OpImageSampleImplicitLod %v4float %43 %76 Bias %48
         %77 =   OpCompositeExtract %float %75 0
         %78 =   OpCompositeExtract %float %75 1
         %79 =   OpCompositeExtract %float %75 2
         %80 =   OpCompositeExtract %float %75 3
         %82 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %82 %77
         %83 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %83 %78
         %84 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %84 %79
         %85 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %85 %80
         %87 =   OpCompositeConstruct %v4float %33 %36 %39 %41
         %86 =   OpImageSampleImplicitLod %v4float %43 %87 MinLod %49
         %88 =   OpCompositeExtract %float %86 0
         %89 =   OpCompositeExtract %float %86 1
         %90 =   OpCompositeExtract %float %86 2
         %91 =   OpCompositeExtract %float %86 3
         %93 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %93 %88
         %94 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %94 %89
         %95 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %95 %90
         %96 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %96 %91
         %97 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_0
         %98 =   OpLoad %float %97
         %99 =   OpDPdx %float %98
        %100 =   OpDPdy %float %98
        %101 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_1
        %102 =   OpLoad %float %101
        %103 =   OpDPdx %float %102
        %104 =   OpDPdy %float %102
        %105 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_2
        %106 =   OpLoad %float %105
        %107 =   OpDPdx %float %106
        %108 =   OpDPdy %float %106
        %112 =   OpCompositeConstruct %v4float %33 %36 %39 %41
        %113 =   OpCompositeConstruct %v3float %99 %103 %107
        %114 =   OpCompositeConstruct %v3float %100 %104 %108
        %111 =   OpImageSampleExplicitLod %v4float %43 %112 Grad %113 %114
        %115 =   OpCompositeExtract %float %111 0
        %116 =   OpCompositeExtract %float %111 1
        %117 =   OpCompositeExtract %float %111 2
        %118 =   OpCompositeExtract %float %111 3
        %120 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %120 %115
        %121 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %121 %116
        %122 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %122 %117
        %123 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %123 %118
                 OpReturn
               OpFunctionEnd

