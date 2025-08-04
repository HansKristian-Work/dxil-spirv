SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 141
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
               OpDecorate %40 NonUniform
               OpDecorate %43 NonUniform
               OpDecorate %46 NonUniform
               OpDecorate %58 NonUniform
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
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
         %57 = OpTypeSampledImage %6
    %v2float = OpTypeVector %float 2
    %float_0 = OpConstant %float 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %139

        %139 = OpLabel
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
         %56 =   OpLoad %float %LAYER
         %58 =   OpSampledImage %57 %43 %46
         %61 =   OpCompositeConstruct %v3float %48 %51 %54
         %60 =   OpImageQueryLod %v2float %58 %61
         %62 =   OpCompositeExtract %float %60 0
         %63 =   OpLoad %float %LOD_BIAS
         %64 =   OpLoad %float %LOD_CLAMP
         %67 =   OpCompositeConstruct %v4float %48 %51 %54 %56
         %66 =   OpImageSampleImplicitLod %v4float %58 %67 None
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
         %77 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %77 %71
         %80 =   OpCompositeConstruct %v4float %48 %51 %54 %56
         %79 =   OpImageSampleExplicitLod %v4float %58 %80 Lod %62
         %81 =   OpCompositeExtract %float %79 0
         %82 =   OpCompositeExtract %float %79 1
         %83 =   OpCompositeExtract %float %79 2
         %84 =   OpCompositeExtract %float %79 3
         %86 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %86 %81
         %87 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %87 %82
         %88 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %88 %83
         %89 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %89 %84
         %91 =   OpCompositeConstruct %v4float %48 %51 %54 %56
         %90 =   OpImageSampleImplicitLod %v4float %58 %91 Bias %63
         %92 =   OpCompositeExtract %float %90 0
         %93 =   OpCompositeExtract %float %90 1
         %94 =   OpCompositeExtract %float %90 2
         %95 =   OpCompositeExtract %float %90 3
         %97 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %97 %92
         %98 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %98 %93
         %99 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %99 %94
        %100 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %100 %95
        %102 =   OpCompositeConstruct %v4float %48 %51 %54 %56
        %101 =   OpImageSampleImplicitLod %v4float %58 %102 MinLod %64
        %103 =   OpCompositeExtract %float %101 0
        %104 =   OpCompositeExtract %float %101 1
        %105 =   OpCompositeExtract %float %101 2
        %106 =   OpCompositeExtract %float %101 3
        %108 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %108 %103
        %109 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %109 %104
        %110 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %110 %105
        %111 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %111 %106
        %112 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_0
        %113 =   OpLoad %float %112
        %114 =   OpDPdx %float %113
        %115 =   OpDPdy %float %113
        %116 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_1
        %117 =   OpLoad %float %116
        %118 =   OpDPdx %float %117
        %119 =   OpDPdy %float %117
        %120 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_2
        %121 =   OpLoad %float %120
        %122 =   OpDPdx %float %121
        %123 =   OpDPdy %float %121
        %127 =   OpCompositeConstruct %v4float %48 %51 %54 %56
        %128 =   OpCompositeConstruct %v3float %114 %118 %122
        %129 =   OpCompositeConstruct %v3float %115 %119 %123
        %126 =   OpImageSampleExplicitLod %v4float %58 %127 Grad %128 %129
        %130 =   OpCompositeExtract %float %126 0
        %131 =   OpCompositeExtract %float %126 1
        %132 =   OpCompositeExtract %float %126 2
        %133 =   OpCompositeExtract %float %126 3
        %135 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %135 %130
        %136 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %136 %131
        %137 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %137 %132
        %138 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %138 %133
                 OpReturn
               OpFunctionEnd

