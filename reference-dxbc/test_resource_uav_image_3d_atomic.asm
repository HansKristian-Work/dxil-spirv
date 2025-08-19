SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 35
; Schema: 0
               OpCapability Shader
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %TEXCOORD %VALUE %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %TEXCOORD "TEXCOORD"
               OpName %VALUE "VALUE"
               OpName %SV_TARGET "SV_TARGET"
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %TEXCOORD Flat
               OpDecorate %TEXCOORD Location 0
               OpDecorate %VALUE Flat
               OpDecorate %VALUE Location 2
               OpDecorate %SV_TARGET Location 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
          %6 = OpTypeImage %uint 3D 0 0 0 2 R32ui
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
     %v3uint = OpTypeVector %uint 3
%_ptr_Input_v3uint = OpTypePointer Input %v3uint
   %TEXCOORD = OpVariable %_ptr_Input_v3uint Input
%_ptr_Input_uint = OpTypePointer Input %uint
      %VALUE = OpVariable %_ptr_Input_uint Input
%_ptr_Output_uint = OpTypePointer Output %uint
  %SV_TARGET = OpVariable %_ptr_Output_uint Output
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
%_ptr_Image_uint = OpTypePointer Image %uint
     %uint_5 = OpConstant %uint 5
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %33

         %33 = OpLabel
         %17 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_0
         %19 =   OpLoad %uint %17
         %20 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_1
         %22 =   OpLoad %uint %20
         %23 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_2
         %25 =   OpLoad %uint %23
         %27 =   OpLoad %uint %VALUE
         %28 =   OpCompositeConstruct %v3uint %19 %22 %25
         %30 =   OpImageTexelPointer %_ptr_Image_uint %8 %28 %uint_0
         %31 =   OpAtomicIAdd %uint %30 %uint_5 %uint_0 %27
                 OpStore %SV_TARGET %31
                 OpReturn
               OpFunctionEnd

