SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 59
; Schema: 0
               OpCapability Shader
               OpCapability StorageImageArrayDynamicIndexing
               OpCapability StorageImageWriteWithoutFormat
               OpCapability RuntimeDescriptorArray
               OpCapability StorageImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %TEXCOORD %COLOR
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %_ ""
               OpName %TEXCOORD "TEXCOORD"
               OpName %COLOR "COLOR"
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %9 NonReadable
               OpDecorate %_arr_float_uint_4 ArrayStride 4
               OpMemberDecorate %_ 0 Offset 0
               OpDecorate %_ Block
               OpDecorate %15 DescriptorSet 0
               OpDecorate %15 Binding 0
               OpDecorate %TEXCOORD Flat
               OpDecorate %TEXCOORD Location 0
               OpDecorate %COLOR NoPerspective
               OpDecorate %COLOR Location 2
               OpDecorate %32 NonUniform
               OpDecorate %35 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 2D 0 0 0 2 Unknown
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
%_ptr_Input_v4float = OpTypePointer Input %v4float
      %COLOR = OpVariable %_ptr_Input_v4float Input
     %uint_0 = OpConstant %uint 0
    %uint_16 = OpConstant %uint 16
     %uint_2 = OpConstant %uint 2
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_Input_uint = OpTypePointer Input %uint
     %uint_1 = OpConstant %uint 1
     %v2uint = OpTypeVector %uint 2
%_ptr_Input_float = OpTypePointer Input %float
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
         %45 =   OpAccessChain %_ptr_Input_float %COLOR %uint_0
         %46 =   OpLoad %float %45
         %47 =   OpAccessChain %_ptr_Input_float %COLOR %uint_1
         %48 =   OpLoad %float %47
         %49 =   OpAccessChain %_ptr_Input_float %COLOR %uint_2
         %50 =   OpLoad %float %49
         %51 =   OpAccessChain %_ptr_Input_float %COLOR %uint_3
         %53 =   OpLoad %float %51
         %55 =   OpCompositeConstruct %v2uint %38 %41
         %56 =   OpCompositeConstruct %v4float %46 %48 %50 %53
                 OpImageWrite %35 %55 %56 NonPrivateTexel
                 OpReturn
               OpFunctionEnd

