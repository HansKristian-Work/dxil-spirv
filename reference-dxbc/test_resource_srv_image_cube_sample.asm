SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 125
; Schema: 0
               OpCapability Shader
               OpCapability MinLod
               OpCapability ImageQuery
               OpCapability DerivativeControl
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %11 %TEXCOORD %DEPTH_REF %LOD_BIAS %LOD_CLAMP %LAYER %TEXCOORD_2 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3 %SV_TARGET_4
               OpExecutionMode %main OriginUpperLeft
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
          %6 = OpTypeImage %float Cube 0 0 0 1 Unknown
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
         %41 = OpTypeSampledImage %6
    %v2float = OpTypeVector %float 2
    %float_0 = OpConstant %float 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %123

        %123 = OpLabel
         %28 =   OpLoad %6 %8
         %29 =   OpLoad %9 %11
         %30 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %33 =   OpLoad %float %30
         %34 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %36 =   OpLoad %float %34
         %37 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_2
         %39 =   OpLoad %float %37
         %42 =   OpSampledImage %41 %28 %29
         %45 =   OpCompositeConstruct %v3float %33 %36 %39
         %44 =   OpImageQueryLod %v2float %42 %45
         %46 =   OpCompositeExtract %float %44 0
         %47 =   OpLoad %float %LOD_BIAS
         %48 =   OpLoad %float %LOD_CLAMP
         %51 =   OpCompositeConstruct %v3float %33 %36 %39
         %50 =   OpImageSampleImplicitLod %v4float %42 %51 None
         %52 =   OpCompositeExtract %float %50 0
         %53 =   OpCompositeExtract %float %50 1
         %54 =   OpCompositeExtract %float %50 2
         %55 =   OpCompositeExtract %float %50 3
         %58 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %58 %52
         %59 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %59 %53
         %60 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %60 %54
         %61 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %61 %55
         %64 =   OpCompositeConstruct %v3float %33 %36 %39
         %63 =   OpImageSampleExplicitLod %v4float %42 %64 Lod %46
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
         %75 =   OpCompositeConstruct %v3float %33 %36 %39
         %74 =   OpImageSampleImplicitLod %v4float %42 %75 Bias %47
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
         %86 =   OpCompositeConstruct %v3float %33 %36 %39
         %85 =   OpImageSampleImplicitLod %v4float %42 %86 MinLod %48
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
         %96 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_0
         %97 =   OpLoad %float %96
         %98 =   OpDPdx %float %97
         %99 =   OpDPdy %float %97
        %100 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_1
        %101 =   OpLoad %float %100
        %102 =   OpDPdx %float %101
        %103 =   OpDPdy %float %101
        %104 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_2
        %105 =   OpLoad %float %104
        %106 =   OpDPdx %float %105
        %107 =   OpDPdy %float %105
        %111 =   OpCompositeConstruct %v3float %33 %36 %39
        %112 =   OpCompositeConstruct %v3float %98 %102 %106
        %113 =   OpCompositeConstruct %v3float %99 %103 %107
        %110 =   OpImageSampleExplicitLod %v4float %42 %111 Grad %112 %113
        %114 =   OpCompositeExtract %float %110 0
        %115 =   OpCompositeExtract %float %110 1
        %116 =   OpCompositeExtract %float %110 2
        %117 =   OpCompositeExtract %float %110 3
        %119 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %119 %114
        %120 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %120 %115
        %121 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %121 %116
        %122 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %122 %117
                 OpReturn
               OpFunctionEnd

