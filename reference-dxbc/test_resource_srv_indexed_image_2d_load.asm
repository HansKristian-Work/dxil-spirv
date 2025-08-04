SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 71
; Schema: 0
               OpCapability Shader
               OpCapability SampledImageArrayDynamicIndexing
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
     %v2uint = OpTypeVector %uint 2
%_ptr_Output_float = OpTypePointer Output %float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
      %v2int = OpTypeVector %int 2
         %59 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %69

         %69 = OpLabel
         %25 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %uint_0
         %26 =   OpLoad %float %25
         %27 =   OpBitcast %uint %26
         %29 =   OpAccessChain %_ptr_UniformConstant_6 %9 %27
         %30 =   OpLoad %6 %29
         %32 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_0
         %33 =   OpLoad %uint %32
         %34 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_1
         %36 =   OpLoad %uint %34
         %40 =   OpCompositeConstruct %v2uint %33 %36
         %39 =   OpImageFetch %v4float %30 %40 Lod %uint_1
         %41 =   OpCompositeExtract %float %39 0
         %42 =   OpCompositeExtract %float %39 1
         %43 =   OpCompositeExtract %float %39 2
         %44 =   OpCompositeExtract %float %39 3
         %47 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %47 %41
         %48 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %48 %42
         %49 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %49 %43
         %51 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %51 %44
         %57 =   OpCompositeConstruct %v2uint %33 %36
         %56 =   OpImageFetch %v4float %30 %57 Lod|ConstOffset %uint_1 %59
         %60 =   OpCompositeExtract %float %56 0
         %61 =   OpCompositeExtract %float %56 1
         %62 =   OpCompositeExtract %float %56 2
         %63 =   OpCompositeExtract %float %56 3
         %65 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %65 %60
         %66 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %66 %61
         %67 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %67 %62
         %68 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %68 %63
                 OpReturn
               OpFunctionEnd

