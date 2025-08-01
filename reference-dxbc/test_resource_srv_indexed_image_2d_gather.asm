SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 149
; Schema: 0
               OpCapability Shader
               OpCapability ImageGatherExtended
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability RuntimeDescriptorArray
               OpCapability SampledImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %19 %TEXCOORD %DEPTH_REF %LAYER %OFFSET %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3 %SV_TARGET_4 %SV_TARGET_5
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
               OpDecorate %48 NonUniform
               OpDecorate %51 NonUniform
               OpDecorate %54 NonUniform
               OpDecorate %72 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 2D 0 0 0 1 Unknown
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
    %uint_16 = OpConstant %uint 16
     %uint_2 = OpConstant %uint 2
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
    %v2float = OpTypeVector %float 2
%_ptr_Input_int = OpTypePointer Input %int
     %v2uint = OpTypeVector %uint 2
         %71 = OpTypeSampledImage %6
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
         %90 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %147

        %147 = OpLabel
         %38 =   OpIMul %uint %uint_0 %uint_16
         %41 =   OpIMul %uint %uint_0 %uint_4
         %42 =   OpIAdd %uint %38 %41
         %43 =   OpShiftRightLogical %uint %42 %uint_2
         %46 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %43
         %47 =   OpLoad %float %46
         %48 =   OpBitcast %uint %47
         %50 =   OpAccessChain %_ptr_UniformConstant_6 %9 %48
         %51 =   OpLoad %6 %50
         %53 =   OpAccessChain %_ptr_UniformConstant_16 %19 %48
         %54 =   OpLoad %16 %53
         %55 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %56 =   OpLoad %float %55
         %57 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %59 =   OpLoad %float %57
         %63 =   OpAccessChain %_ptr_Input_int %OFFSET %uint_0
         %64 =   OpLoad %int %63
         %65 =   OpBitcast %uint %64
         %66 =   OpAccessChain %_ptr_Input_int %OFFSET %uint_1
         %67 =   OpLoad %int %66
         %68 =   OpBitcast %uint %67
         %72 =   OpSampledImage %71 %51 %54
         %73 =   OpCompositeConstruct %v2float %56 %59
         %74 =   OpImageGather %v4float %72 %73 %uint_0
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
         %86 =   OpCompositeConstruct %v2float %56 %59
         %89 =   OpImageGather %v4float %72 %86 %uint_0 ConstOffset %90
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
        %100 =   OpCompositeConstruct %v2float %56 %59
        %101 =   OpImageGather %v4float %72 %100 %uint_1
        %102 =   OpCompositeExtract %float %101 0
        %103 =   OpCompositeExtract %float %101 1
        %104 =   OpCompositeExtract %float %101 2
        %105 =   OpCompositeExtract %float %101 3
        %107 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %107 %102
        %108 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %108 %103
        %109 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %109 %104
        %110 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %110 %105
        %111 =   OpCompositeConstruct %v2float %56 %59
        %112 =   OpImageGather %v4float %72 %111 %uint_2
        %113 =   OpCompositeExtract %float %112 0
        %114 =   OpCompositeExtract %float %112 1
        %115 =   OpCompositeExtract %float %112 2
        %116 =   OpCompositeExtract %float %112 3
        %118 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %118 %113
        %119 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %119 %114
        %120 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %120 %115
        %121 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %121 %116
        %122 =   OpCompositeConstruct %v2float %56 %59
        %123 =   OpImageGather %v4float %72 %122 %uint_3
        %124 =   OpCompositeExtract %float %123 0
        %125 =   OpCompositeExtract %float %123 1
        %126 =   OpCompositeExtract %float %123 2
        %127 =   OpCompositeExtract %float %123 3
        %129 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %129 %124
        %130 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %130 %125
        %131 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %131 %126
        %132 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %132 %127
        %133 =   OpCompositeConstruct %v2float %56 %59
        %134 =   OpBitcast %int %65
        %135 =   OpBitcast %int %68
        %137 =   OpCompositeConstruct %v2int %134 %135
        %136 =   OpImageGather %v4float %72 %133 %uint_0 Offset %137
        %138 =   OpCompositeExtract %float %136 0
        %139 =   OpCompositeExtract %float %136 1
        %140 =   OpCompositeExtract %float %136 2
        %141 =   OpCompositeExtract %float %136 3
        %143 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_0
                 OpStore %143 %138
        %144 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_1
                 OpStore %144 %139
        %145 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_2
                 OpStore %145 %140
        %146 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_3
                 OpStore %146 %141
                 OpReturn
               OpFunctionEnd

