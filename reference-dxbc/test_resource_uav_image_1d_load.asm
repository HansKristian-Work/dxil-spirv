SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 37
; Schema: 0
               OpCapability Shader
               OpCapability Image1D
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %TEXCOORD %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %TEXCOORD "TEXCOORD"
               OpName %SV_TARGET "SV_TARGET"
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %8 NonWritable
               OpDecorate %TEXCOORD Flat
               OpDecorate %TEXCOORD Location 0
               OpDecorate %SV_TARGET Location 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 1D 0 0 0 2 R32f
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
       %uint = OpTypeInt 32 0
     %v3uint = OpTypeVector %uint 3
%_ptr_Input_v3uint = OpTypePointer Input %v3uint
   %TEXCOORD = OpVariable %_ptr_Input_v3uint Input
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%_ptr_Input_uint = OpTypePointer Input %uint
     %uint_0 = OpConstant %uint 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %35

         %35 = OpLabel
         %16 =   OpLoad %6 %8
         %18 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_0
         %20 =   OpLoad %uint %18
         %21 =   OpImageRead %v4float %16 %20 NonPrivateTexel
         %22 =   OpCompositeExtract %float %21 0
         %23 =   OpCompositeExtract %float %21 1
         %24 =   OpCompositeExtract %float %21 2
         %25 =   OpCompositeExtract %float %21 3
         %28 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %28 %22
         %29 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %29 %23
         %31 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %31 %24
         %33 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %33 %25
                 OpReturn
               OpFunctionEnd

