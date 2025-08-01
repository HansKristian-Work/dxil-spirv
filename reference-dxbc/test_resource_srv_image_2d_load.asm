SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 59
; Schema: 0
               OpCapability Shader
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
          %6 = OpTypeImage %float 2D 0 0 0 1 Unknown
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
     %v2uint = OpTypeVector %uint 2
%_ptr_Output_float = OpTypePointer Output %float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
      %v2int = OpTypeVector %int 2
         %47 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %57

         %57 = OpLabel
         %17 =   OpLoad %6 %8
         %19 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_0
         %21 =   OpLoad %uint %19
         %22 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_1
         %24 =   OpLoad %uint %22
         %28 =   OpCompositeConstruct %v2uint %21 %24
         %27 =   OpImageFetch %v4float %17 %28 Lod %uint_1
         %29 =   OpCompositeExtract %float %27 0
         %30 =   OpCompositeExtract %float %27 1
         %31 =   OpCompositeExtract %float %27 2
         %32 =   OpCompositeExtract %float %27 3
         %35 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %35 %29
         %36 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %36 %30
         %37 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %37 %31
         %39 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %39 %32
         %45 =   OpCompositeConstruct %v2uint %21 %24
         %44 =   OpImageFetch %v4float %17 %45 Lod|ConstOffset %uint_1 %47
         %48 =   OpCompositeExtract %float %44 0
         %49 =   OpCompositeExtract %float %44 1
         %50 =   OpCompositeExtract %float %44 2
         %51 =   OpCompositeExtract %float %44 3
         %53 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %53 %48
         %54 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %54 %49
         %55 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %55 %50
         %56 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %56 %51
                 OpReturn
               OpFunctionEnd

