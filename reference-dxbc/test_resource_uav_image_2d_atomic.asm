SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 33
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %TEXCOORD %VALUE %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
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
          %6 = OpTypeImage %uint 2D 0 0 0 2 R32ui
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
     %v2uint = OpTypeVector %uint 2
%_ptr_Image_uint = OpTypePointer Image %uint
     %uint_5 = OpConstant %uint 5
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %31

         %31 = OpLabel
         %17 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_0
         %19 =   OpLoad %uint %17
         %20 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_1
         %22 =   OpLoad %uint %20
         %25 =   OpLoad %uint %VALUE
         %26 =   OpCompositeConstruct %v2uint %19 %22
         %28 =   OpImageTexelPointer %_ptr_Image_uint %8 %26 %uint_0
         %29 =   OpAtomicIAdd %uint %28 %uint_5 %uint_0 %25
                 OpStore %SV_TARGET %29
                 OpReturn
               OpFunctionEnd

