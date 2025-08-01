SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 59
; Schema: 0
               OpCapability Shader
               OpCapability StorageImageArrayDynamicIndexing
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
          %6 = OpTypeImage %float 2D 0 0 0 2 R32f
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
     %uint_1 = OpConstant %uint 1
     %v2uint = OpTypeVector %uint 2
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %57

         %57 = OpLabel
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
         %39 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_1
         %41 =   OpLoad %uint %39
         %45 =   OpCompositeConstruct %v2uint %38 %41
         %44 =   OpImageRead %v4float %35 %45 NonPrivateTexel
         %46 =   OpCompositeExtract %float %44 0
         %47 =   OpCompositeExtract %float %44 1
         %48 =   OpCompositeExtract %float %44 2
         %49 =   OpCompositeExtract %float %44 3
         %52 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %52 %46
         %53 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %53 %47
         %54 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %54 %48
         %55 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %55 %49
                 OpReturn
               OpFunctionEnd

