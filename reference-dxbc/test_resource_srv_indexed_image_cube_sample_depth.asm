SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 75
; Schema: 0
               OpCapability Shader
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability RuntimeDescriptorArray
               OpCapability SampledImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %19 %TEXCOORD %DEPTH_REF %LOD_BIAS %LOD_CLAMP %LAYER %TEXCOORD_2 %SV_TARGET %SV_TARGET_1
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
               OpDecorate %42 NonUniform
               OpDecorate %45 NonUniform
               OpDecorate %48 NonUniform
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
%_ptr_Output_float = OpTypePointer Output %float
  %SV_TARGET = OpVariable %_ptr_Output_float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_float Output
     %uint_0 = OpConstant %uint 0
    %uint_16 = OpConstant %uint 16
     %uint_2 = OpConstant %uint 2
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
         %60 = OpTypeImage %float Cube 1 0 0 1 Unknown
         %61 = OpTypeSampledImage %60
    %float_0 = OpConstant %float 0
    %v4float = OpTypeVector %float 4
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %73

         %73 = OpLabel
         %32 =   OpIMul %uint %uint_0 %uint_16
         %35 =   OpIMul %uint %uint_0 %uint_4
         %36 =   OpIAdd %uint %32 %35
         %37 =   OpShiftRightLogical %uint %36 %uint_2
         %40 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %37
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
         %54 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_2
         %55 =   OpLoad %float %54
         %57 =   OpLoad %float %DEPTH_REF
         %62 =   OpSampledImage %61 %45 %48
         %65 =   OpCompositeConstruct %v3float %50 %53 %55
         %64 =   OpImageSampleDrefImplicitLod %float %62 %65 %57 None
         %67 =   OpCompositeConstruct %v4float %64 %64 %64 %64
         %68 =   OpCompositeExtract %float %67 0
                 OpStore %SV_TARGET %68
         %70 =   OpCompositeConstruct %v3float %50 %53 %55
         %69 =   OpImageSampleDrefExplicitLod %float %62 %70 %57 Lod %float_0
         %71 =   OpCompositeConstruct %v4float %69 %69 %69 %69
         %72 =   OpCompositeExtract %float %71 0
                 OpStore %SV_TARGET_1 %72
                 OpReturn
               OpFunctionEnd

