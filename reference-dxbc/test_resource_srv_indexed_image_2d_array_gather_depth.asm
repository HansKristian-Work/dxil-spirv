SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 116
; Schema: 0
               OpCapability Shader
               OpCapability ImageGatherExtended
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability RuntimeDescriptorArray
               OpCapability SampledImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %19 %TEXCOORD %DEPTH_REF %LAYER %OFFSET %SV_TARGET %SV_TARGET_1 %SV_TARGET_2
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %_ ""
               OpName %TEXCOORD "TEXCOORD"
               OpName %DEPTH_REF "DEPTH_REF"
               OpName %LAYER "LAYER"
               OpName %OFFSET "OFFSET"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_2 "SV_TARGET_2"
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
               OpDecorate %LAYER Location 1
               OpDecorate %LAYER Component 1
               OpDecorate %OFFSET Flat
               OpDecorate %OFFSET Location 2
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
               OpDecorate %SV_TARGET_2 Location 2
               OpDecorate %45 NonUniform
               OpDecorate %48 NonUniform
               OpDecorate %51 NonUniform
               OpDecorate %72 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 2D 0 1 0 1 Unknown
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
      %LAYER = OpVariable %_ptr_Input_float Input
        %int = OpTypeInt 32 1
      %v2int = OpTypeVector %int 2
%_ptr_Input_v2int = OpTypePointer Input %v2int
     %OFFSET = OpVariable %_ptr_Input_v2int Input
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_2 = OpVariable %_ptr_Output_v4float Output
     %uint_0 = OpConstant %uint 0
    %uint_16 = OpConstant %uint 16
     %uint_2 = OpConstant %uint 2
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
    %v2float = OpTypeVector %float 2
%_ptr_Input_int = OpTypePointer Input %int
     %v2uint = OpTypeVector %uint 2
         %70 = OpTypeImage %float 2D 1 1 0 1 Unknown
         %71 = OpTypeSampledImage %70
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
         %90 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %114

        %114 = OpLabel
         %35 =   OpIMul %uint %uint_0 %uint_16
         %38 =   OpIMul %uint %uint_0 %uint_4
         %39 =   OpIAdd %uint %35 %38
         %40 =   OpShiftRightLogical %uint %39 %uint_2
         %43 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %40
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
         %59 =   OpLoad %float %DEPTH_REF
         %60 =   OpLoad %float %LAYER
         %62 =   OpAccessChain %_ptr_Input_int %OFFSET %uint_0
         %63 =   OpLoad %int %62
         %64 =   OpBitcast %uint %63
         %65 =   OpAccessChain %_ptr_Input_int %OFFSET %uint_1
         %66 =   OpLoad %int %65
         %67 =   OpBitcast %uint %66
         %72 =   OpSampledImage %71 %48 %51
         %73 =   OpCompositeConstruct %v3float %53 %56 %60
         %74 =   OpImageDrefGather %v4float %72 %73 %59
         %75 =   OpCompositeExtract %float %74 0
         %76 =   OpCompositeExtract %float %74 1
         %77 =   OpCompositeExtract %float %74 2
         %78 =   OpCompositeExtract %float %74 3
         %81 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %81 %75
         %82 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %82 %76
         %83 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %83 %77
         %84 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %84 %78
         %86 =   OpCompositeConstruct %v3float %53 %56 %60
         %89 =   OpImageDrefGather %v4float %72 %86 %59 ConstOffset %90
         %91 =   OpCompositeExtract %float %89 0
         %92 =   OpCompositeExtract %float %89 1
         %93 =   OpCompositeExtract %float %89 2
         %94 =   OpCompositeExtract %float %89 3
         %96 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %96 %91
         %97 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %97 %92
         %98 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %98 %93
         %99 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %99 %94
        %100 =   OpCompositeConstruct %v3float %53 %56 %60
        %101 =   OpBitcast %int %64
        %102 =   OpBitcast %int %67
        %104 =   OpCompositeConstruct %v2int %101 %102
        %103 =   OpImageDrefGather %v4float %72 %100 %59 Offset %104
        %105 =   OpCompositeExtract %float %103 0
        %106 =   OpCompositeExtract %float %103 1
        %107 =   OpCompositeExtract %float %103 2
        %108 =   OpCompositeExtract %float %103 3
        %110 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %110 %105
        %111 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %111 %106
        %112 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %112 %107
        %113 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %113 %108
                 OpReturn
               OpFunctionEnd

