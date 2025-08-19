SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 107
; Schema: 0
               OpCapability Shader
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability SampledCubeArray
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
         %57 = OpTypeSampledImage %6
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %105

        %105 = OpLabel
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
         %59 =   OpCompositeConstruct %v4float %48 %51 %54 %56
         %60 =   OpImageGather %v4float %58 %59 %uint_0
         %61 =   OpCompositeExtract %float %60 0
         %62 =   OpCompositeExtract %float %60 1
         %63 =   OpCompositeExtract %float %60 2
         %64 =   OpCompositeExtract %float %60 3
         %67 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %67 %61
         %68 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %68 %62
         %69 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %69 %63
         %70 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %70 %64
         %72 =   OpCompositeConstruct %v4float %48 %51 %54 %56
         %73 =   OpImageGather %v4float %58 %72 %uint_1
         %74 =   OpCompositeExtract %float %73 0
         %75 =   OpCompositeExtract %float %73 1
         %76 =   OpCompositeExtract %float %73 2
         %77 =   OpCompositeExtract %float %73 3
         %79 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %79 %74
         %80 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %80 %75
         %81 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %81 %76
         %82 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %82 %77
         %83 =   OpCompositeConstruct %v4float %48 %51 %54 %56
         %84 =   OpImageGather %v4float %58 %83 %uint_2
         %85 =   OpCompositeExtract %float %84 0
         %86 =   OpCompositeExtract %float %84 1
         %87 =   OpCompositeExtract %float %84 2
         %88 =   OpCompositeExtract %float %84 3
         %90 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %90 %85
         %91 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %91 %86
         %92 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %92 %87
         %93 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %93 %88
         %94 =   OpCompositeConstruct %v4float %48 %51 %54 %56
         %95 =   OpImageGather %v4float %58 %94 %uint_3
         %96 =   OpCompositeExtract %float %95 0
         %97 =   OpCompositeExtract %float %95 1
         %98 =   OpCompositeExtract %float %95 2
         %99 =   OpCompositeExtract %float %95 3
        %101 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %101 %96
        %102 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %102 %97
        %103 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %103 %98
        %104 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %104 %99
                 OpReturn
               OpFunctionEnd

