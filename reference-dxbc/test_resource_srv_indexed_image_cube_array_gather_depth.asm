SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 78
; Schema: 0
               OpCapability Shader
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability SampledCubeArray
               OpCapability RuntimeDescriptorArray
               OpCapability SampledImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %19 %TEXCOORD %DEPTH_REF %LAYER %OFFSET %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %_ ""
               OpName %TEXCOORD "TEXCOORD"
               OpName %DEPTH_REF "DEPTH_REF"
               OpName %LAYER "LAYER"
               OpName %OFFSET "OFFSET"
               OpName %SV_TARGET "SV_TARGET"
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
               OpDecorate %43 NonUniform
               OpDecorate %46 NonUniform
               OpDecorate %49 NonUniform
               OpDecorate %62 NonUniform
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
     %uint_0 = OpConstant %uint 0
    %uint_16 = OpConstant %uint 16
     %uint_2 = OpConstant %uint 2
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
         %60 = OpTypeImage %float Cube 1 1 0 1 Unknown
         %61 = OpTypeSampledImage %60
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %76

         %76 = OpLabel
         %33 =   OpIMul %uint %uint_0 %uint_16
         %36 =   OpIMul %uint %uint_0 %uint_4
         %37 =   OpIAdd %uint %33 %36
         %38 =   OpShiftRightLogical %uint %37 %uint_2
         %41 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %38
         %42 =   OpLoad %float %41
         %43 =   OpBitcast %uint %42
         %45 =   OpAccessChain %_ptr_UniformConstant_6 %9 %43
         %46 =   OpLoad %6 %45
         %48 =   OpAccessChain %_ptr_UniformConstant_16 %19 %43
         %49 =   OpLoad %16 %48
         %50 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %51 =   OpLoad %float %50
         %52 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %54 =   OpLoad %float %52
         %55 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_2
         %56 =   OpLoad %float %55
         %58 =   OpLoad %float %DEPTH_REF
         %59 =   OpLoad %float %LAYER
         %62 =   OpSampledImage %61 %46 %49
         %63 =   OpCompositeConstruct %v4float %51 %54 %56 %59
         %64 =   OpImageDrefGather %v4float %62 %63 %58
         %65 =   OpCompositeExtract %float %64 0
         %66 =   OpCompositeExtract %float %64 1
         %67 =   OpCompositeExtract %float %64 2
         %68 =   OpCompositeExtract %float %64 3
         %71 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %71 %65
         %72 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %72 %66
         %73 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %73 %67
         %74 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %74 %68
                 OpReturn
               OpFunctionEnd

