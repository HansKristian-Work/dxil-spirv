SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 67
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
               OpDecorate %33 NonUniform
               OpDecorate %36 NonUniform
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
    %uint_16 = OpConstant %uint 16
     %uint_2 = OpConstant %uint 2
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_Input_uint = OpTypePointer Input %uint
     %uint_1 = OpConstant %uint 1
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %65

         %65 = OpLabel
         %23 =   OpIMul %uint %uint_0 %uint_16
         %26 =   OpIMul %uint %uint_0 %uint_4
         %27 =   OpIAdd %uint %23 %26
         %28 =   OpShiftRightLogical %uint %27 %uint_2
         %31 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %28
         %32 =   OpLoad %float %31
         %33 =   OpBitcast %uint %32
         %35 =   OpAccessChain %_ptr_UniformConstant_6 %9 %33
         %36 =   OpLoad %6 %35
         %38 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_0
         %39 =   OpLoad %uint %38
         %41 =   OpImageFetch %v4float %36 %39 Lod %uint_1
         %42 =   OpCompositeExtract %float %41 0
         %43 =   OpCompositeExtract %float %41 1
         %44 =   OpCompositeExtract %float %41 2
         %45 =   OpCompositeExtract %float %41 3
         %48 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %48 %42
         %49 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %49 %43
         %50 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %50 %44
         %51 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %51 %45
         %55 =   OpImageFetch %v4float %36 %39 Lod|ConstOffset %uint_1 %int_n1
         %56 =   OpCompositeExtract %float %55 0
         %57 =   OpCompositeExtract %float %55 1
         %58 =   OpCompositeExtract %float %55 2
         %59 =   OpCompositeExtract %float %55 3
         %61 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %61 %56
         %62 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %62 %57
         %63 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %63 %58
         %64 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %64 %59
                 OpReturn
               OpFunctionEnd

