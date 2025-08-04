SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 61
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
          %6 = OpTypeImage %float 3D 0 0 0 1 Unknown
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
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
      %int_1 = OpConstant %int 1
      %v3int = OpTypeVector %int 3
         %49 = OpConstantComposite %v3int %int_n1 %int_0 %int_1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %59

         %59 = OpLabel
         %17 =   OpLoad %6 %8
         %19 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_0
         %21 =   OpLoad %uint %19
         %22 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_1
         %24 =   OpLoad %uint %22
         %25 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_2
         %27 =   OpLoad %uint %25
         %30 =   OpCompositeConstruct %v3uint %21 %24 %27
         %29 =   OpImageFetch %v4float %17 %30 Lod %uint_1
         %31 =   OpCompositeExtract %float %29 0
         %32 =   OpCompositeExtract %float %29 1
         %33 =   OpCompositeExtract %float %29 2
         %34 =   OpCompositeExtract %float %29 3
         %37 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %37 %31
         %38 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %38 %32
         %39 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %39 %33
         %40 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %40 %34
         %47 =   OpCompositeConstruct %v3uint %21 %24 %27
         %46 =   OpImageFetch %v4float %17 %47 Lod|ConstOffset %uint_1 %49
         %50 =   OpCompositeExtract %float %46 0
         %51 =   OpCompositeExtract %float %46 1
         %52 =   OpCompositeExtract %float %46 2
         %53 =   OpCompositeExtract %float %46 3
         %55 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %55 %50
         %56 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %56 %51
         %57 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %57 %52
         %58 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %58 %53
                 OpReturn
               OpFunctionEnd

