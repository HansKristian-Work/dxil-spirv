SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 70
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
               OpEntryPoint Fragment %main "main" %9 %15 %19 %TEXCOORD %DEPTH_REF %LOD_BIAS %LOD_CLAMP %LAYER %TEXCOORD_2 %SV_TARGET %SV_TARGET_1
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
               OpDecorate %36 NonUniform
               OpDecorate %39 NonUniform
               OpDecorate %42 NonUniform
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
   %LOD_BIAS = OpVariable %_ptr_Input_float Input
  %LOD_CLAMP = OpVariable %_ptr_Input_float Input
      %LAYER = OpVariable %_ptr_Input_float Input
 %TEXCOORD_2 = OpVariable %_ptr_Input_v3float Input
%_ptr_Output_float = OpTypePointer Output %float
  %SV_TARGET = OpVariable %_ptr_Output_float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_float Output
     %uint_0 = OpConstant %uint 0
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
         %55 = OpTypeImage %float Cube 1 0 0 1 Unknown
         %56 = OpTypeSampledImage %55
    %float_0 = OpConstant %float 0
    %v4float = OpTypeVector %float 4
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %68

         %68 = OpLabel
         %34 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %uint_0
         %35 =   OpLoad %float %34
         %36 =   OpBitcast %uint %35
         %38 =   OpAccessChain %_ptr_UniformConstant_6 %9 %36
         %39 =   OpLoad %6 %38
         %41 =   OpAccessChain %_ptr_UniformConstant_16 %19 %36
         %42 =   OpLoad %16 %41
         %43 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %44 =   OpLoad %float %43
         %45 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %47 =   OpLoad %float %45
         %48 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_2
         %50 =   OpLoad %float %48
         %52 =   OpLoad %float %DEPTH_REF
         %57 =   OpSampledImage %56 %39 %42
         %60 =   OpCompositeConstruct %v3float %44 %47 %50
         %59 =   OpImageSampleDrefImplicitLod %float %57 %60 %52 None
         %62 =   OpCompositeConstruct %v4float %59 %59 %59 %59
         %63 =   OpCompositeExtract %float %62 0
                 OpStore %SV_TARGET %63
         %65 =   OpCompositeConstruct %v3float %44 %47 %50
         %64 =   OpImageSampleDrefExplicitLod %float %57 %65 %52 Lod %float_0
         %66 =   OpCompositeConstruct %v4float %64 %64 %64 %64
         %67 =   OpCompositeExtract %float %66 0
                 OpStore %SV_TARGET_1 %67
                 OpReturn
               OpFunctionEnd

