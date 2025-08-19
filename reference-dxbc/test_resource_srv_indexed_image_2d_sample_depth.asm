SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 79
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
               OpEntryPoint Fragment %main "main" %9 %15 %19 %TEXCOORD %DEPTH_REF %LOD_BIAS %LOD_CLAMP %LAYER %TEXCOORD_2 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2
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
               OpDecorate %39 NonUniform
               OpDecorate %42 NonUniform
               OpDecorate %45 NonUniform
               OpDecorate %57 NonUniform
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
   %LOD_BIAS = OpVariable %_ptr_Input_float Input
  %LOD_CLAMP = OpVariable %_ptr_Input_float Input
      %LAYER = OpVariable %_ptr_Input_float Input
    %v2float = OpTypeVector %float 2
%_ptr_Input_v2float = OpTypePointer Input %v2float
 %TEXCOORD_2 = OpVariable %_ptr_Input_v2float Input
%_ptr_Output_float = OpTypePointer Output %float
  %SV_TARGET = OpVariable %_ptr_Output_float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_float Output
%SV_TARGET_2 = OpVariable %_ptr_Output_float Output
     %uint_0 = OpConstant %uint 0
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
         %55 = OpTypeImage %float 2D 1 0 0 1 Unknown
         %56 = OpTypeSampledImage %55
    %float_0 = OpConstant %float 0
    %v4float = OpTypeVector %float 4
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
      %v2int = OpTypeVector %int 2
         %70 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %77

         %77 = OpLabel
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
         %52 =   OpLoad %float %DEPTH_REF
         %57 =   OpSampledImage %56 %42 %45
         %60 =   OpCompositeConstruct %v2float %47 %50
         %59 =   OpImageSampleDrefImplicitLod %float %57 %60 %52 None
         %62 =   OpCompositeConstruct %v4float %59 %59 %59 %59
         %63 =   OpCompositeExtract %float %62 0
                 OpStore %SV_TARGET %63
         %68 =   OpCompositeConstruct %v2float %47 %50
         %67 =   OpImageSampleDrefImplicitLod %float %57 %68 %52 ConstOffset %70
         %71 =   OpCompositeConstruct %v4float %67 %67 %67 %67
         %72 =   OpCompositeExtract %float %71 0
                 OpStore %SV_TARGET_1 %72
         %74 =   OpCompositeConstruct %v2float %47 %50
         %73 =   OpImageSampleDrefExplicitLod %float %57 %74 %52 Lod %float_0
         %75 =   OpCompositeConstruct %v4float %73 %73 %73 %73
         %76 =   OpCompositeExtract %float %75 0
                 OpStore %SV_TARGET_2 %76
                 OpReturn
               OpFunctionEnd

