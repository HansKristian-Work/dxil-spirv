SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 145
; Schema: 0
               OpCapability Shader
               OpCapability ImageGatherExtended
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability SignedZeroInfNanPreserve
               OpCapability RuntimeDescriptorArray
               OpCapability SampledImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %19 %TEXCOORD %DEPTH_REF %LAYER %OFFSET %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3 %SV_TARGET_4 %SV_TARGET_5
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %_ ""
               OpName %TEXCOORD "TEXCOORD"
               OpName %DEPTH_REF "DEPTH_REF"
               OpName %LAYER "LAYER"
               OpName %OFFSET "OFFSET"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_2 "SV_TARGET_2"
               OpName %SV_TARGET_3 "SV_TARGET_3"
               OpName %SV_TARGET_4 "SV_TARGET_4"
               OpName %SV_TARGET_5 "SV_TARGET_5"
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
               OpDecorate %SV_TARGET_3 Location 3
               OpDecorate %SV_TARGET_4 Location 4
               OpDecorate %SV_TARGET_5 Location 5
               OpDecorate %42 NonUniform
               OpDecorate %45 NonUniform
               OpDecorate %48 NonUniform
               OpDecorate %67 NonUniform
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
%SV_TARGET_3 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_4 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_5 = OpVariable %_ptr_Output_v4float Output
     %uint_0 = OpConstant %uint 0
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
    %v2float = OpTypeVector %float 2
%_ptr_Input_int = OpTypePointer Input %int
     %v2uint = OpTypeVector %uint 2
         %66 = OpTypeSampledImage %6
%_ptr_Output_float = OpTypePointer Output %float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
         %86 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %143

        %143 = OpLabel
         %40 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %uint_0
         %41 =   OpLoad %float %40
         %42 =   OpBitcast %uint %41
         %44 =   OpAccessChain %_ptr_UniformConstant_6 %9 %42
         %45 =   OpLoad %6 %44
         %47 =   OpAccessChain %_ptr_UniformConstant_16 %19 %42
         %48 =   OpLoad %16 %47
         %49 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %50 =   OpLoad %float %49
         %51 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %53 =   OpLoad %float %51
         %56 =   OpLoad %float %LAYER
         %58 =   OpAccessChain %_ptr_Input_int %OFFSET %uint_0
         %59 =   OpLoad %int %58
         %60 =   OpBitcast %uint %59
         %61 =   OpAccessChain %_ptr_Input_int %OFFSET %uint_1
         %62 =   OpLoad %int %61
         %63 =   OpBitcast %uint %62
         %67 =   OpSampledImage %66 %45 %48
         %68 =   OpCompositeConstruct %v3float %50 %53 %56
         %69 =   OpImageGather %v4float %67 %68 %uint_0
         %70 =   OpCompositeExtract %float %69 0
         %71 =   OpCompositeExtract %float %69 1
         %72 =   OpCompositeExtract %float %69 2
         %73 =   OpCompositeExtract %float %69 3
         %76 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %76 %70
         %77 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %77 %71
         %78 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %78 %72
         %80 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %80 %73
         %82 =   OpCompositeConstruct %v3float %50 %53 %56
         %85 =   OpImageGather %v4float %67 %82 %uint_0 ConstOffset %86
         %87 =   OpCompositeExtract %float %85 0
         %88 =   OpCompositeExtract %float %85 1
         %89 =   OpCompositeExtract %float %85 2
         %90 =   OpCompositeExtract %float %85 3
         %92 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %92 %87
         %93 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %93 %88
         %94 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %94 %89
         %95 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %95 %90
         %96 =   OpCompositeConstruct %v3float %50 %53 %56
         %97 =   OpImageGather %v4float %67 %96 %uint_1
         %98 =   OpCompositeExtract %float %97 0
         %99 =   OpCompositeExtract %float %97 1
        %100 =   OpCompositeExtract %float %97 2
        %101 =   OpCompositeExtract %float %97 3
        %103 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %103 %98
        %104 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %104 %99
        %105 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %105 %100
        %106 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %106 %101
        %107 =   OpCompositeConstruct %v3float %50 %53 %56
        %108 =   OpImageGather %v4float %67 %107 %uint_2
        %109 =   OpCompositeExtract %float %108 0
        %110 =   OpCompositeExtract %float %108 1
        %111 =   OpCompositeExtract %float %108 2
        %112 =   OpCompositeExtract %float %108 3
        %114 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %114 %109
        %115 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %115 %110
        %116 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %116 %111
        %117 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %117 %112
        %118 =   OpCompositeConstruct %v3float %50 %53 %56
        %119 =   OpImageGather %v4float %67 %118 %uint_3
        %120 =   OpCompositeExtract %float %119 0
        %121 =   OpCompositeExtract %float %119 1
        %122 =   OpCompositeExtract %float %119 2
        %123 =   OpCompositeExtract %float %119 3
        %125 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %125 %120
        %126 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %126 %121
        %127 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %127 %122
        %128 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %128 %123
        %129 =   OpCompositeConstruct %v3float %50 %53 %56
        %130 =   OpBitcast %int %60
        %131 =   OpBitcast %int %63
        %133 =   OpCompositeConstruct %v2int %130 %131
        %132 =   OpImageGather %v4float %67 %129 %uint_0 Offset %133
        %134 =   OpCompositeExtract %float %132 0
        %135 =   OpCompositeExtract %float %132 1
        %136 =   OpCompositeExtract %float %132 2
        %137 =   OpCompositeExtract %float %132 3
        %139 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_0
                 OpStore %139 %134
        %140 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_1
                 OpStore %140 %135
        %141 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_2
                 OpStore %141 %136
        %142 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_3
                 OpStore %142 %137
                 OpReturn
               OpFunctionEnd

