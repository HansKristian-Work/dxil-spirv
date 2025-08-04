SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 53
; Schema: 0
               OpCapability Shader
               OpCapability Sampled1D
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %TEXCOORD %SV_TARGET %SV_TARGET_1
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %TEXCOORD "TEXCOORD"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %TEXCOORD Flat
               OpDecorate %TEXCOORD Location 0
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 1D 0 1 0 1 Unknown
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
       %uint = OpTypeInt 32 0
     %v3uint = OpTypeVector %uint 3
%_ptr_Input_v3uint = OpTypePointer Input %v3uint
   %TEXCOORD = OpVariable %_ptr_Input_v3uint Input
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_v4float Output
%_ptr_Input_uint = OpTypePointer Input %uint
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
     %v2uint = OpTypeVector %uint 2
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %51

         %51 = OpLabel
         %17 =   OpLoad %6 %8
         %19 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_0
         %21 =   OpLoad %uint %19
         %26 =   OpCompositeConstruct %v2uint %21 %uint_2
         %24 =   OpImageFetch %v4float %17 %26 Lod %uint_1
         %27 =   OpCompositeExtract %float %24 0
         %28 =   OpCompositeExtract %float %24 1
         %29 =   OpCompositeExtract %float %24 2
         %30 =   OpCompositeExtract %float %24 3
         %33 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %33 %27
         %34 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %34 %28
         %35 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %35 %29
         %36 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %36 %30
         %41 =   OpCompositeConstruct %v2uint %21 %uint_2
         %40 =   OpImageFetch %v4float %17 %41 Lod|ConstOffset %uint_1 %int_n1
         %42 =   OpCompositeExtract %float %40 0
         %43 =   OpCompositeExtract %float %40 1
         %44 =   OpCompositeExtract %float %40 2
         %45 =   OpCompositeExtract %float %40 3
         %47 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %47 %42
         %48 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %48 %43
         %49 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %49 %44
         %50 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %50 %45
                 OpReturn
               OpFunctionEnd

