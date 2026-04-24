SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 42
; Schema: 0
               OpCapability Shader
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
          %6 = OpTypeImage %float 2D 0 0 0 2 R32f
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
     %uint_1 = OpConstant %uint 1
     %v2uint = OpTypeVector %uint 2
%_ptr_Output_float = OpTypePointer Output %float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %40

         %40 = OpLabel
         %16 =   OpLoad %6 %8
         %18 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_0
         %20 =   OpLoad %uint %18
         %21 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_1
         %23 =   OpLoad %uint %21
         %27 =   OpCompositeConstruct %v2uint %20 %23
         %26 =   OpImageRead %v4float %16 %27 NonPrivateTexel
         %28 =   OpCompositeExtract %float %26 0
         %29 =   OpCompositeExtract %float %26 1
         %30 =   OpCompositeExtract %float %26 2
         %31 =   OpCompositeExtract %float %26 3
         %34 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %34 %28
         %35 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %35 %29
         %36 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %36 %30
         %38 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %38 %31
                 OpReturn
               OpFunctionEnd

