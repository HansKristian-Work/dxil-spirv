SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 56
; Schema: 0
               OpCapability Shader
               OpCapability StorageImageArrayDynamicIndexing
               OpCapability Image1D
               OpCapability RuntimeDescriptorArray
               OpCapability StorageImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %TEXCOORD %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %_ ""
               OpName %TEXCOORD "TEXCOORD"
               OpName %SV_TARGET "SV_TARGET"
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %9 NonWritable
               OpDecorate %_arr_float_uint_4 ArrayStride 4
               OpMemberDecorate %_ 0 Offset 0
               OpDecorate %_ Block
               OpDecorate %15 DescriptorSet 0
               OpDecorate %15 Binding 0
               OpDecorate %TEXCOORD Flat
               OpDecorate %TEXCOORD Location 0
               OpDecorate %SV_TARGET Location 0
               OpDecorate %32 NonUniform
               OpDecorate %35 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 1D 0 1 0 2 R32f
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
     %uint_0 = OpConstant %uint 0
    %uint_16 = OpConstant %uint 16
     %uint_2 = OpConstant %uint 2
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_Input_uint = OpTypePointer Input %uint
     %v2uint = OpTypeVector %uint 2
%_ptr_Output_float = OpTypePointer Output %float
     %uint_1 = OpConstant %uint 1
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %54

         %54 = OpLabel
         %22 =   OpIMul %uint %uint_0 %uint_16
         %25 =   OpIMul %uint %uint_0 %uint_4
         %26 =   OpIAdd %uint %22 %25
         %27 =   OpShiftRightLogical %uint %26 %uint_2
         %30 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %27
         %31 =   OpLoad %float %30
         %32 =   OpBitcast %uint %31
         %34 =   OpAccessChain %_ptr_UniformConstant_6 %9 %32
         %35 =   OpLoad %6 %34
         %37 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_0
         %38 =   OpLoad %uint %37
         %41 =   OpCompositeConstruct %v2uint %38 %uint_2
         %39 =   OpImageRead %v4float %35 %41 NonPrivateTexel
         %42 =   OpCompositeExtract %float %39 0
         %43 =   OpCompositeExtract %float %39 1
         %44 =   OpCompositeExtract %float %39 2
         %45 =   OpCompositeExtract %float %39 3
         %48 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %48 %42
         %49 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %49 %43
         %51 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %51 %44
         %52 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %52 %45
                 OpReturn
               OpFunctionEnd

