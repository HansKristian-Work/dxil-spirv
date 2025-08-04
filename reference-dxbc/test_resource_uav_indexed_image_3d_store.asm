SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 55
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
               OpDecorate %26 NonUniform
               OpDecorate %29 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 3D 0 0 0 2 Unknown
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
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_Input_uint = OpTypePointer Input %uint
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
%_ptr_Input_float = OpTypePointer Input %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %53

         %53 = OpLabel
         %24 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %uint_0
         %25 =   OpLoad %float %24
         %26 =   OpBitcast %uint %25
         %28 =   OpAccessChain %_ptr_UniformConstant_6 %9 %26
         %29 =   OpLoad %6 %28
         %31 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_0
         %32 =   OpLoad %uint %31
         %33 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_1
         %35 =   OpLoad %uint %33
         %36 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_2
         %38 =   OpLoad %uint %36
         %41 =   OpAccessChain %_ptr_Input_float %COLOR %uint_0
         %42 =   OpLoad %float %41
         %43 =   OpAccessChain %_ptr_Input_float %COLOR %uint_1
         %44 =   OpLoad %float %43
         %45 =   OpAccessChain %_ptr_Input_float %COLOR %uint_2
         %46 =   OpLoad %float %45
         %47 =   OpAccessChain %_ptr_Input_float %COLOR %uint_3
         %49 =   OpLoad %float %47
         %51 =   OpCompositeConstruct %v3uint %32 %35 %38
         %52 =   OpCompositeConstruct %v4float %42 %44 %46 %49
                 OpImageWrite %29 %51 %52 NonPrivateTexel
                 OpReturn
               OpFunctionEnd

