SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 62
; Schema: 0
               OpCapability Shader
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability Sampled1D
               OpCapability RuntimeDescriptorArray
               OpCapability SampledImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %TEXCOORD %SV_TARGET %SV_TARGET_1
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %_ ""
               OpName %TEXCOORD "TEXCOORD"
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
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
               OpDecorate %27 NonUniform
               OpDecorate %30 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 1D 0 0 0 1 Unknown
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
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_v4float Output
     %uint_0 = OpConstant %uint 0
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_Input_uint = OpTypePointer Input %uint
     %uint_1 = OpConstant %uint 1
%_ptr_Output_float = OpTypePointer Output %float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %60

         %60 = OpLabel
         %25 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %uint_0
         %26 =   OpLoad %float %25
         %27 =   OpBitcast %uint %26
         %29 =   OpAccessChain %_ptr_UniformConstant_6 %9 %27
         %30 =   OpLoad %6 %29
         %32 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_0
         %33 =   OpLoad %uint %32
         %35 =   OpImageFetch %v4float %30 %33 Lod %uint_1
         %36 =   OpCompositeExtract %float %35 0
         %37 =   OpCompositeExtract %float %35 1
         %38 =   OpCompositeExtract %float %35 2
         %39 =   OpCompositeExtract %float %35 3
         %42 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %42 %36
         %43 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %43 %37
         %44 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %44 %38
         %46 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %46 %39
         %50 =   OpImageFetch %v4float %30 %33 Lod|ConstOffset %uint_1 %int_n1
         %51 =   OpCompositeExtract %float %50 0
         %52 =   OpCompositeExtract %float %50 1
         %53 =   OpCompositeExtract %float %50 2
         %54 =   OpCompositeExtract %float %50 3
         %56 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %56 %51
         %57 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %57 %52
         %58 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %58 %53
         %59 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %59 %54
                 OpReturn
               OpFunctionEnd

