SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 78
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
               OpDecorate %33 NonUniform
               OpDecorate %36 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 3D 0 0 0 1 Unknown
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
      %int_0 = OpConstant %int 0
      %int_1 = OpConstant %int 1
      %v3int = OpTypeVector %int 3
         %66 = OpConstantComposite %v3int %int_n1 %int_0 %int_1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %76

         %76 = OpLabel
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
         %40 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_1
         %42 =   OpLoad %uint %40
         %43 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_2
         %44 =   OpLoad %uint %43
         %47 =   OpCompositeConstruct %v3uint %39 %42 %44
         %46 =   OpImageFetch %v4float %36 %47 Lod %uint_1
         %48 =   OpCompositeExtract %float %46 0
         %49 =   OpCompositeExtract %float %46 1
         %50 =   OpCompositeExtract %float %46 2
         %51 =   OpCompositeExtract %float %46 3
         %54 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %54 %48
         %55 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %55 %49
         %56 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %56 %50
         %57 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %57 %51
         %64 =   OpCompositeConstruct %v3uint %39 %42 %44
         %63 =   OpImageFetch %v4float %36 %64 Lod|ConstOffset %uint_1 %66
         %67 =   OpCompositeExtract %float %63 0
         %68 =   OpCompositeExtract %float %63 1
         %69 =   OpCompositeExtract %float %63 2
         %70 =   OpCompositeExtract %float %63 3
         %72 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %72 %67
         %73 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %73 %68
         %74 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %74 %69
         %75 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %75 %70
                 OpReturn
               OpFunctionEnd

