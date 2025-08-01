SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 146
; Schema: 0
               OpCapability Shader
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability MinLod
               OpCapability SampledCubeArray
               OpCapability ImageQuery
               OpCapability DerivativeControl
               OpCapability RuntimeDescriptorArray
               OpCapability SampledImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %19 %TEXCOORD %DEPTH_REF %LOD_BIAS %LOD_CLAMP %LAYER %TEXCOORD_2 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3 %SV_TARGET_4
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
               OpDecorate %46 NonUniform
               OpDecorate %49 NonUniform
               OpDecorate %52 NonUniform
               OpDecorate %63 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float Cube 0 1 0 1 Unknown
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
    %uint_16 = OpConstant %uint 16
     %uint_2 = OpConstant %uint 2
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
         %62 = OpTypeSampledImage %6
    %v2float = OpTypeVector %float 2
    %float_0 = OpConstant %float 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %144

        %144 = OpLabel
         %36 =   OpIMul %uint %uint_0 %uint_16
         %39 =   OpIMul %uint %uint_0 %uint_4
         %40 =   OpIAdd %uint %36 %39
         %41 =   OpShiftRightLogical %uint %40 %uint_2
         %44 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %41
         %45 =   OpLoad %float %44
         %46 =   OpBitcast %uint %45
         %48 =   OpAccessChain %_ptr_UniformConstant_6 %9 %46
         %49 =   OpLoad %6 %48
         %51 =   OpAccessChain %_ptr_UniformConstant_16 %19 %46
         %52 =   OpLoad %16 %51
         %53 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %54 =   OpLoad %float %53
         %55 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %57 =   OpLoad %float %55
         %58 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_2
         %59 =   OpLoad %float %58
         %61 =   OpLoad %float %LAYER
         %63 =   OpSampledImage %62 %49 %52
         %66 =   OpCompositeConstruct %v3float %54 %57 %59
         %65 =   OpImageQueryLod %v2float %63 %66
         %67 =   OpCompositeExtract %float %65 0
         %68 =   OpLoad %float %LOD_BIAS
         %69 =   OpLoad %float %LOD_CLAMP
         %72 =   OpCompositeConstruct %v4float %54 %57 %59 %61
         %71 =   OpImageSampleImplicitLod %v4float %63 %72 None
         %73 =   OpCompositeExtract %float %71 0
         %74 =   OpCompositeExtract %float %71 1
         %75 =   OpCompositeExtract %float %71 2
         %76 =   OpCompositeExtract %float %71 3
         %79 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %79 %73
         %80 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %80 %74
         %81 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %81 %75
         %82 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %82 %76
         %85 =   OpCompositeConstruct %v4float %54 %57 %59 %61
         %84 =   OpImageSampleExplicitLod %v4float %63 %85 Lod %67
         %86 =   OpCompositeExtract %float %84 0
         %87 =   OpCompositeExtract %float %84 1
         %88 =   OpCompositeExtract %float %84 2
         %89 =   OpCompositeExtract %float %84 3
         %91 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %91 %86
         %92 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %92 %87
         %93 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %93 %88
         %94 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %94 %89
         %96 =   OpCompositeConstruct %v4float %54 %57 %59 %61
         %95 =   OpImageSampleImplicitLod %v4float %63 %96 Bias %68
         %97 =   OpCompositeExtract %float %95 0
         %98 =   OpCompositeExtract %float %95 1
         %99 =   OpCompositeExtract %float %95 2
        %100 =   OpCompositeExtract %float %95 3
        %102 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %102 %97
        %103 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %103 %98
        %104 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %104 %99
        %105 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %105 %100
        %107 =   OpCompositeConstruct %v4float %54 %57 %59 %61
        %106 =   OpImageSampleImplicitLod %v4float %63 %107 MinLod %69
        %108 =   OpCompositeExtract %float %106 0
        %109 =   OpCompositeExtract %float %106 1
        %110 =   OpCompositeExtract %float %106 2
        %111 =   OpCompositeExtract %float %106 3
        %113 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %113 %108
        %114 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %114 %109
        %115 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %115 %110
        %116 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %116 %111
        %117 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_0
        %118 =   OpLoad %float %117
        %119 =   OpDPdx %float %118
        %120 =   OpDPdy %float %118
        %121 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_1
        %122 =   OpLoad %float %121
        %123 =   OpDPdx %float %122
        %124 =   OpDPdy %float %122
        %125 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_2
        %126 =   OpLoad %float %125
        %127 =   OpDPdx %float %126
        %128 =   OpDPdy %float %126
        %132 =   OpCompositeConstruct %v4float %54 %57 %59 %61
        %133 =   OpCompositeConstruct %v3float %119 %123 %127
        %134 =   OpCompositeConstruct %v3float %120 %124 %128
        %131 =   OpImageSampleExplicitLod %v4float %63 %132 Grad %133 %134
        %135 =   OpCompositeExtract %float %131 0
        %136 =   OpCompositeExtract %float %131 1
        %137 =   OpCompositeExtract %float %131 2
        %138 =   OpCompositeExtract %float %131 3
        %140 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %140 %135
        %141 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %141 %136
        %142 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %142 %137
        %143 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %143 %138
                 OpReturn
               OpFunctionEnd

