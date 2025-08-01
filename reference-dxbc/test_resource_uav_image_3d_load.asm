SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 43
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %TEXCOORD %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
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
          %6 = OpTypeImage %float 3D 0 0 0 2 R32f
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
     %uint_2 = OpConstant %uint 2
%_ptr_Output_float = OpTypePointer Output %float
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
         %29 =   OpCompositeConstruct %v3uint %20 %23 %26
         %28 =   OpImageRead %v4float %16 %29 NonPrivateTexel
         %30 =   OpCompositeExtract %float %28 0
         %31 =   OpCompositeExtract %float %28 1
         %32 =   OpCompositeExtract %float %28 2
         %33 =   OpCompositeExtract %float %28 3
         %36 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %36 %30
         %37 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %37 %31
         %38 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %38 %32
         %39 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %39 %33
                 OpReturn
               OpFunctionEnd

