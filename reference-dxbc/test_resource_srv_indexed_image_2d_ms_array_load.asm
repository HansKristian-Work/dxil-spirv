SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 73
; Schema: 0
               OpCapability Shader
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability SampleRateShading
               OpCapability RuntimeDescriptorArray
               OpCapability SampledImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %TEXCOORD %SV_SAMPLEINDEX %SV_TARGET %SV_TARGET_1
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %_ ""
               OpName %TEXCOORD "TEXCOORD"
               OpName %SV_SAMPLEINDEX "SV_SAMPLEINDEX"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %_arr_float_uint_4 ArrayStride 4
               OpMemberDecorate %_ 0 Offset 0
               OpDecorate %_ Block
               OpDecorate %15 DescriptorSet 0
               OpDecorate %15 Binding 0
               OpDecorate %TEXCOORD Flat
               OpDecorate %TEXCOORD Location 0
               OpDecorate %SV_SAMPLEINDEX BuiltIn SampleId
               OpDecorate %SV_SAMPLEINDEX Flat
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
               OpDecorate %29 NonUniform
               OpDecorate %32 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 2D 0 1 1 1 Unknown
%_runtimearr_6 = OpTypeRuntimeArray %6
%_ptr_UniformConstant__runtimearr_6 = OpTypePointer UniformConstant %_runtimearr_6
          %9 = OpVariable %_ptr_UniformConstant__runtimearr_6 UniformConstant
       %uint = OpTypeInt 32 0
     %uint_4 = OpConstant %uint 4
%_arr_float_uint_4 = OpTypeArray %float %uint_4
          %_ = OpTypeStruct %_arr_float_uint_4
%_ptr_Uniform__ = OpTypePointer Uniform %_
         %15 = OpVariable %_ptr_Uniform__ Uniform
     %v3uint = OpTypeVector %uint 3
%_ptr_Input_v3uint = OpTypePointer Input %v3uint
   %TEXCOORD = OpVariable %_ptr_Input_v3uint Input
%_ptr_Input_uint = OpTypePointer Input %uint
%SV_SAMPLEINDEX = OpVariable %_ptr_Input_uint Input
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_v4float Output
     %uint_0 = OpConstant %uint 0
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
     %uint_1 = OpConstant %uint 1
     %v2uint = OpTypeVector %uint 2
     %uint_2 = OpConstant %uint 2
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
      %v2int = OpTypeVector %int 2
         %61 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %71

         %71 = OpLabel
         %27 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %uint_0
         %28 =   OpLoad %float %27
         %29 =   OpBitcast %uint %28
         %31 =   OpAccessChain %_ptr_UniformConstant_6 %9 %29
         %32 =   OpLoad %6 %31
         %33 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_0
         %34 =   OpLoad %uint %33
         %35 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_1
         %37 =   OpLoad %uint %35
         %40 =   OpLoad %uint %SV_SAMPLEINDEX
         %43 =   OpCompositeConstruct %v3uint %34 %37 %uint_2
         %42 =   OpImageFetch %v4float %32 %43 Sample %40
         %44 =   OpCompositeExtract %float %42 0
         %45 =   OpCompositeExtract %float %42 1
         %46 =   OpCompositeExtract %float %42 2
         %47 =   OpCompositeExtract %float %42 3
         %50 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %50 %44
         %51 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %51 %45
         %52 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %52 %46
         %53 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %53 %47
         %59 =   OpCompositeConstruct %v3uint %34 %37 %uint_2
         %58 =   OpImageFetch %v4float %32 %59 ConstOffset|Sample %61 %40
         %62 =   OpCompositeExtract %float %58 0
         %63 =   OpCompositeExtract %float %58 1
         %64 =   OpCompositeExtract %float %58 2
         %65 =   OpCompositeExtract %float %58 3
         %67 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %67 %62
         %68 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %68 %63
         %69 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %69 %64
         %70 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %70 %65
                 OpReturn
               OpFunctionEnd

