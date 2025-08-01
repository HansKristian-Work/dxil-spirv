SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 145
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
               OpDecorate %62 NonUniform
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
    %uint_16 = OpConstant %uint 16
     %uint_2 = OpConstant %uint 2
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
         %61 = OpTypeSampledImage %6
    %v2float = OpTypeVector %float 2
    %float_0 = OpConstant %float 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %143

        %143 = OpLabel
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
         %62 =   OpSampledImage %61 %49 %52
         %65 =   OpCompositeConstruct %v3float %54 %57 %59
         %64 =   OpImageQueryLod %v2float %62 %65
         %66 =   OpCompositeExtract %float %64 0
         %67 =   OpLoad %float %LOD_BIAS
         %68 =   OpLoad %float %LOD_CLAMP
         %71 =   OpCompositeConstruct %v3float %54 %57 %59
         %70 =   OpImageSampleImplicitLod %v4float %62 %71 None
         %72 =   OpCompositeExtract %float %70 0
         %73 =   OpCompositeExtract %float %70 1
         %74 =   OpCompositeExtract %float %70 2
         %75 =   OpCompositeExtract %float %70 3
         %78 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %78 %72
         %79 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %79 %73
         %80 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %80 %74
         %81 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %81 %75
         %84 =   OpCompositeConstruct %v3float %54 %57 %59
         %83 =   OpImageSampleExplicitLod %v4float %62 %84 Lod %66
         %85 =   OpCompositeExtract %float %83 0
         %86 =   OpCompositeExtract %float %83 1
         %87 =   OpCompositeExtract %float %83 2
         %88 =   OpCompositeExtract %float %83 3
         %90 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %90 %85
         %91 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %91 %86
         %92 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %92 %87
         %93 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %93 %88
         %95 =   OpCompositeConstruct %v3float %54 %57 %59
         %94 =   OpImageSampleImplicitLod %v4float %62 %95 Bias %67
         %96 =   OpCompositeExtract %float %94 0
         %97 =   OpCompositeExtract %float %94 1
         %98 =   OpCompositeExtract %float %94 2
         %99 =   OpCompositeExtract %float %94 3
        %101 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %101 %96
        %102 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %102 %97
        %103 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %103 %98
        %104 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %104 %99
        %106 =   OpCompositeConstruct %v3float %54 %57 %59
        %105 =   OpImageSampleImplicitLod %v4float %62 %106 MinLod %68
        %107 =   OpCompositeExtract %float %105 0
        %108 =   OpCompositeExtract %float %105 1
        %109 =   OpCompositeExtract %float %105 2
        %110 =   OpCompositeExtract %float %105 3
        %112 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %112 %107
        %113 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %113 %108
        %114 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %114 %109
        %115 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %115 %110
        %116 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_0
        %117 =   OpLoad %float %116
        %118 =   OpDPdx %float %117
        %119 =   OpDPdy %float %117
        %120 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_1
        %121 =   OpLoad %float %120
        %122 =   OpDPdx %float %121
        %123 =   OpDPdy %float %121
        %124 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_2
        %125 =   OpLoad %float %124
        %126 =   OpDPdx %float %125
        %127 =   OpDPdy %float %125
        %131 =   OpCompositeConstruct %v3float %54 %57 %59
        %132 =   OpCompositeConstruct %v3float %118 %122 %126
        %133 =   OpCompositeConstruct %v3float %119 %123 %127
        %130 =   OpImageSampleExplicitLod %v4float %62 %131 Grad %132 %133
        %134 =   OpCompositeExtract %float %130 0
        %135 =   OpCompositeExtract %float %130 1
        %136 =   OpCompositeExtract %float %130 2
        %137 =   OpCompositeExtract %float %130 3
        %139 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %139 %134
        %140 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %140 %135
        %141 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %141 %136
        %142 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %142 %137
                 OpReturn
               OpFunctionEnd

