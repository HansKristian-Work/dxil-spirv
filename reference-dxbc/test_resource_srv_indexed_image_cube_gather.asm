SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 106
; Schema: 0
               OpCapability Shader
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability SignedZeroInfNanPreserve
               OpCapability RuntimeDescriptorArray
               OpCapability SampledImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %19 %TEXCOORD %DEPTH_REF %LAYER %OFFSET %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3
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
      %LAYER = OpVariable %_ptr_Input_float Input
        %int = OpTypeInt 32 1
      %v3int = OpTypeVector %int 3
%_ptr_Input_v3int = OpTypePointer Input %v3int
     %OFFSET = OpVariable %_ptr_Input_v3int Input
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_2 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_3 = OpVariable %_ptr_Output_v4float Output
     %uint_0 = OpConstant %uint 0
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
         %56 = OpTypeSampledImage %6
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %104

        %104 = OpLabel
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
         %58 =   OpCompositeConstruct %v3float %48 %51 %54
         %59 =   OpImageGather %v4float %57 %58 %uint_0
         %60 =   OpCompositeExtract %float %59 0
         %61 =   OpCompositeExtract %float %59 1
         %62 =   OpCompositeExtract %float %59 2
         %63 =   OpCompositeExtract %float %59 3
         %66 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %66 %60
         %67 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %67 %61
         %68 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %68 %62
         %69 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %69 %63
         %71 =   OpCompositeConstruct %v3float %48 %51 %54
         %72 =   OpImageGather %v4float %57 %71 %uint_1
         %73 =   OpCompositeExtract %float %72 0
         %74 =   OpCompositeExtract %float %72 1
         %75 =   OpCompositeExtract %float %72 2
         %76 =   OpCompositeExtract %float %72 3
         %78 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %78 %73
         %79 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %79 %74
         %80 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %80 %75
         %81 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %81 %76
         %82 =   OpCompositeConstruct %v3float %48 %51 %54
         %83 =   OpImageGather %v4float %57 %82 %uint_2
         %84 =   OpCompositeExtract %float %83 0
         %85 =   OpCompositeExtract %float %83 1
         %86 =   OpCompositeExtract %float %83 2
         %87 =   OpCompositeExtract %float %83 3
         %89 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %89 %84
         %90 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %90 %85
         %91 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %91 %86
         %92 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %92 %87
         %93 =   OpCompositeConstruct %v3float %48 %51 %54
         %94 =   OpImageGather %v4float %57 %93 %uint_3
         %95 =   OpCompositeExtract %float %94 0
         %96 =   OpCompositeExtract %float %94 1
         %97 =   OpCompositeExtract %float %94 2
         %98 =   OpCompositeExtract %float %94 3
        %100 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %100 %95
        %101 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %101 %96
        %102 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %102 %97
        %103 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %103 %98
                 OpReturn
               OpFunctionEnd

