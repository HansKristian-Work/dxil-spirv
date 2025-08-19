SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 140
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
               OpEntryPoint Fragment %main "main" %9 %15 %19 %TEXCOORD %DEPTH_REF %LOD_BIAS %LOD_CLAMP %LAYER %TEXCOORD_2 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3 %SV_TARGET_4
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
               OpDecorate %40 NonUniform
               OpDecorate %43 NonUniform
               OpDecorate %46 NonUniform
               OpDecorate %57 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float Cube 0 0 0 1 Unknown
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
     %uint_0 = OpConstant %uint 0
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
         %56 = OpTypeSampledImage %6
    %v2float = OpTypeVector %float 2
    %float_0 = OpConstant %float 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %138

        %138 = OpLabel
         %38 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %uint_0
         %39 =   OpLoad %float %38
         %40 =   OpBitcast %uint %39
         %42 =   OpAccessChain %_ptr_UniformConstant_6 %9 %40
         %43 =   OpLoad %6 %42
         %45 =   OpAccessChain %_ptr_UniformConstant_16 %19 %40
         %46 =   OpLoad %16 %45
         %47 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %48 =   OpLoad %float %47
         %49 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %51 =   OpLoad %float %49
         %52 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_2
         %54 =   OpLoad %float %52
         %57 =   OpSampledImage %56 %43 %46
         %60 =   OpCompositeConstruct %v3float %48 %51 %54
         %59 =   OpImageQueryLod %v2float %57 %60
         %61 =   OpCompositeExtract %float %59 0
         %62 =   OpLoad %float %LOD_BIAS
         %63 =   OpLoad %float %LOD_CLAMP
         %66 =   OpCompositeConstruct %v3float %48 %51 %54
         %65 =   OpImageSampleImplicitLod %v4float %57 %66 None
         %67 =   OpCompositeExtract %float %65 0
         %68 =   OpCompositeExtract %float %65 1
         %69 =   OpCompositeExtract %float %65 2
         %70 =   OpCompositeExtract %float %65 3
         %73 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %73 %67
         %74 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %74 %68
         %75 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %75 %69
         %76 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %76 %70
         %79 =   OpCompositeConstruct %v3float %48 %51 %54
         %78 =   OpImageSampleExplicitLod %v4float %57 %79 Lod %61
         %80 =   OpCompositeExtract %float %78 0
         %81 =   OpCompositeExtract %float %78 1
         %82 =   OpCompositeExtract %float %78 2
         %83 =   OpCompositeExtract %float %78 3
         %85 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %85 %80
         %86 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %86 %81
         %87 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %87 %82
         %88 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %88 %83
         %90 =   OpCompositeConstruct %v3float %48 %51 %54
         %89 =   OpImageSampleImplicitLod %v4float %57 %90 Bias %62
         %91 =   OpCompositeExtract %float %89 0
         %92 =   OpCompositeExtract %float %89 1
         %93 =   OpCompositeExtract %float %89 2
         %94 =   OpCompositeExtract %float %89 3
         %96 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %96 %91
         %97 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %97 %92
         %98 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %98 %93
         %99 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %99 %94
        %101 =   OpCompositeConstruct %v3float %48 %51 %54
        %100 =   OpImageSampleImplicitLod %v4float %57 %101 MinLod %63
        %102 =   OpCompositeExtract %float %100 0
        %103 =   OpCompositeExtract %float %100 1
        %104 =   OpCompositeExtract %float %100 2
        %105 =   OpCompositeExtract %float %100 3
        %107 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %107 %102
        %108 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %108 %103
        %109 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %109 %104
        %110 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %110 %105
        %111 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_0
        %112 =   OpLoad %float %111
        %113 =   OpDPdx %float %112
        %114 =   OpDPdy %float %112
        %115 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_1
        %116 =   OpLoad %float %115
        %117 =   OpDPdx %float %116
        %118 =   OpDPdy %float %116
        %119 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_2
        %120 =   OpLoad %float %119
        %121 =   OpDPdx %float %120
        %122 =   OpDPdy %float %120
        %126 =   OpCompositeConstruct %v3float %48 %51 %54
        %127 =   OpCompositeConstruct %v3float %113 %117 %121
        %128 =   OpCompositeConstruct %v3float %114 %118 %122
        %125 =   OpImageSampleExplicitLod %v4float %57 %126 Grad %127 %128
        %129 =   OpCompositeExtract %float %125 0
        %130 =   OpCompositeExtract %float %125 1
        %131 =   OpCompositeExtract %float %125 2
        %132 =   OpCompositeExtract %float %125 3
        %134 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %134 %129
        %135 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %135 %130
        %136 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %136 %131
        %137 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %137 %132
                 OpReturn
               OpFunctionEnd

