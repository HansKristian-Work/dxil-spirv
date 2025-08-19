SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 43
; Schema: 0
               OpCapability Shader
               OpCapability StorageImageWriteWithoutFormat
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %TEXCOORD %COLOR
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %TEXCOORD "TEXCOORD"
               OpName %COLOR "COLOR"
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %8 NonReadable
               OpDecorate %TEXCOORD Flat
               OpDecorate %TEXCOORD Location 0
               OpDecorate %COLOR NoPerspective
               OpDecorate %COLOR Location 2
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 3D 0 0 0 2 Unknown
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
       %uint = OpTypeInt 32 0
     %v3uint = OpTypeVector %uint 3
%_ptr_Input_v3uint = OpTypePointer Input %v3uint
   %TEXCOORD = OpVariable %_ptr_Input_v3uint Input
    %v4float = OpTypeVector %float 4
%_ptr_Input_v4float = OpTypePointer Input %v4float
      %COLOR = OpVariable %_ptr_Input_v4float Input
%_ptr_Input_uint = OpTypePointer Input %uint
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
%_ptr_Input_float = OpTypePointer Input %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %41

         %41 = OpLabel
         %16 =   OpLoad %6 %8
         %18 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_0
         %20 =   OpLoad %uint %18
         %21 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_1
         %23 =   OpLoad %uint %21
         %24 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_2
         %26 =   OpLoad %uint %24
         %29 =   OpAccessChain %_ptr_Input_float %COLOR %uint_0
         %30 =   OpLoad %float %29
         %31 =   OpAccessChain %_ptr_Input_float %COLOR %uint_1
         %32 =   OpLoad %float %31
         %33 =   OpAccessChain %_ptr_Input_float %COLOR %uint_2
         %34 =   OpLoad %float %33
         %35 =   OpAccessChain %_ptr_Input_float %COLOR %uint_3
         %37 =   OpLoad %float %35
         %39 =   OpCompositeConstruct %v3uint %20 %23 %26
         %40 =   OpCompositeConstruct %v4float %30 %32 %34 %37
                 OpImageWrite %16 %39 %40 NonPrivateTexel
                 OpReturn
               OpFunctionEnd

