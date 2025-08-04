SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 111
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
               OpDecorate %39 NonUniform
               OpDecorate %42 NonUniform
               OpDecorate %45 NonUniform
               OpDecorate %66 NonUniform
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
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
    %v2float = OpTypeVector %float 2
%_ptr_Input_int = OpTypePointer Input %int
     %v2uint = OpTypeVector %uint 2
         %64 = OpTypeImage %float 2D 1 1 0 1 Unknown
         %65 = OpTypeSampledImage %64
%_ptr_Output_float = OpTypePointer Output %float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
         %85 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %109

        %109 = OpLabel
         %37 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %uint_0
         %38 =   OpLoad %float %37
         %39 =   OpBitcast %uint %38
         %41 =   OpAccessChain %_ptr_UniformConstant_6 %9 %39
         %42 =   OpLoad %6 %41
         %44 =   OpAccessChain %_ptr_UniformConstant_16 %19 %39
         %45 =   OpLoad %16 %44
         %46 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %47 =   OpLoad %float %46
         %48 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %50 =   OpLoad %float %48
         %53 =   OpLoad %float %DEPTH_REF
         %54 =   OpLoad %float %LAYER
         %56 =   OpAccessChain %_ptr_Input_int %OFFSET %uint_0
         %57 =   OpLoad %int %56
         %58 =   OpBitcast %uint %57
         %59 =   OpAccessChain %_ptr_Input_int %OFFSET %uint_1
         %60 =   OpLoad %int %59
         %61 =   OpBitcast %uint %60
         %66 =   OpSampledImage %65 %42 %45
         %67 =   OpCompositeConstruct %v3float %47 %50 %54
         %68 =   OpImageDrefGather %v4float %66 %67 %53
         %69 =   OpCompositeExtract %float %68 0
         %70 =   OpCompositeExtract %float %68 1
         %71 =   OpCompositeExtract %float %68 2
         %72 =   OpCompositeExtract %float %68 3
         %75 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %75 %69
         %76 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %76 %70
         %77 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %77 %71
         %79 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %79 %72
         %81 =   OpCompositeConstruct %v3float %47 %50 %54
         %84 =   OpImageDrefGather %v4float %66 %81 %53 ConstOffset %85
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
         %95 =   OpCompositeConstruct %v3float %47 %50 %54
         %96 =   OpBitcast %int %58
         %97 =   OpBitcast %int %61
         %99 =   OpCompositeConstruct %v2int %96 %97
         %98 =   OpImageDrefGather %v4float %66 %95 %53 Offset %99
        %100 =   OpCompositeExtract %float %98 0
        %101 =   OpCompositeExtract %float %98 1
        %102 =   OpCompositeExtract %float %98 2
        %103 =   OpCompositeExtract %float %98 3
        %105 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %105 %100
        %106 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %106 %101
        %107 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %107 %102
        %108 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %108 %103
                 OpReturn
               OpFunctionEnd

