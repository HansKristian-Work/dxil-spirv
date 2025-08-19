SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 44
; Schema: 0
               OpCapability Shader
               OpCapability StorageImageWriteWithoutFormat
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpCapability FragmentShaderPixelInterlockEXT
               OpExtension "SPV_EXT_fragment_shader_interlock"
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %_
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main PixelInterlockOrderedEXT
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %_ ""
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %_ BuiltIn FragCoord
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 2D 0 0 0 2 R32f
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
    %v4float = OpTypeVector %float 4
%_ptr_Input_v4float = OpTypePointer Input %v4float
          %_ = OpVariable %_ptr_Input_v4float Input
%_ptr_Input_float = OpTypePointer Input %float
       %uint = OpTypeInt 32 0
     %uint_1 = OpConstant %uint 1
     %uint_0 = OpConstant %uint 0
     %v2uint = OpTypeVector %uint 2
     %uint_5 = OpConstant %uint 5
    %float_2 = OpConstant %float 2
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %42

         %42 = OpLabel
         %12 =   OpLoad %6 %8
         %14 =   OpAccessChain %_ptr_Input_float %_ %uint_1
         %17 =   OpLoad %float %14
         %18 =   OpConvertFToS %uint %17
         %19 =   OpAccessChain %_ptr_Input_float %_ %uint_0
         %21 =   OpLoad %float %19
         %22 =   OpConvertFToS %uint %21
         %26 =   OpCompositeConstruct %v2uint %22 %18
                 OpBeginInvocationInterlockEXT
         %25 =   OpImageRead %v4float %12 %26 MakeTexelVisible|NonPrivateTexel %uint_5
         %28 =   OpCompositeExtract %float %25 0
         %29 =   OpCompositeExtract %float %25 1
         %30 =   OpCompositeExtract %float %25 2
         %31 =   OpCompositeExtract %float %25 3
         %32 =   OpCompositeConstruct %v4float %28 %29 %30 %31
         %33 =   OpFMul %float %28 %float_2
         %35 =   OpCompositeInsert %v4float %33 %32 0
         %36 =   OpCompositeExtract %float %35 0
         %37 =   OpCompositeExtract %float %35 1
         %38 =   OpCompositeExtract %float %35 2
         %39 =   OpCompositeExtract %float %35 3
         %40 =   OpCompositeConstruct %v2uint %22 %18
         %41 =   OpCompositeConstruct %v4float %36 %37 %38 %39
                 OpImageWrite %12 %40 %41 MakeTexelAvailable|NonPrivateTexel %uint_5
                 OpEndInvocationInterlockEXT
                 OpReturn
               OpFunctionEnd

