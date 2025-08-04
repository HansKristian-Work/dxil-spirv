SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 73
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
               OpDecorate %37 NonUniform
               OpDecorate %40 NonUniform
               OpDecorate %43 NonUniform
               OpDecorate %57 NonUniform
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
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
         %55 = OpTypeImage %float Cube 1 1 0 1 Unknown
         %56 = OpTypeSampledImage %55
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %71

         %71 = OpLabel
         %35 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %uint_0
         %36 =   OpLoad %float %35
         %37 =   OpBitcast %uint %36
         %39 =   OpAccessChain %_ptr_UniformConstant_6 %9 %37
         %40 =   OpLoad %6 %39
         %42 =   OpAccessChain %_ptr_UniformConstant_16 %19 %37
         %43 =   OpLoad %16 %42
         %44 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %45 =   OpLoad %float %44
         %46 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %48 =   OpLoad %float %46
         %49 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_2
         %51 =   OpLoad %float %49
         %53 =   OpLoad %float %DEPTH_REF
         %54 =   OpLoad %float %LAYER
         %57 =   OpSampledImage %56 %40 %43
         %58 =   OpCompositeConstruct %v4float %45 %48 %51 %54
         %59 =   OpImageDrefGather %v4float %57 %58 %53
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
                 OpReturn
               OpFunctionEnd

