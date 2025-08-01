SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 61
; Schema: 0
               OpCapability Shader
               OpCapability SampleRateShading
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %TEXCOORD %SV_SAMPLEINDEX %SV_TARGET %SV_TARGET_1
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %TEXCOORD "TEXCOORD"
               OpName %SV_SAMPLEINDEX "SV_SAMPLEINDEX"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %TEXCOORD Flat
               OpDecorate %TEXCOORD Location 0
               OpDecorate %SV_SAMPLEINDEX BuiltIn SampleId
               OpDecorate %SV_SAMPLEINDEX Flat
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 2D 0 0 1 1 Unknown
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
       %uint = OpTypeInt 32 0
     %v3uint = OpTypeVector %uint 3
%_ptr_Input_v3uint = OpTypePointer Input %v3uint
   %TEXCOORD = OpVariable %_ptr_Input_v3uint Input
%_ptr_Input_uint = OpTypePointer Input %uint
%SV_SAMPLEINDEX = OpVariable %_ptr_Input_uint Input
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_v4float Output
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
         %49 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %59

         %59 = OpLabel
         %19 =   OpLoad %6 %8
         %20 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_0
         %22 =   OpLoad %uint %20
         %23 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_1
         %25 =   OpLoad %uint %23
         %28 =   OpLoad %uint %SV_SAMPLEINDEX
         %30 =   OpCompositeConstruct %v2uint %22 %25
         %29 =   OpImageFetch %v4float %19 %30 Sample %28
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
         %41 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %41 %34
         %47 =   OpCompositeConstruct %v2uint %22 %25
         %46 =   OpImageFetch %v4float %19 %47 ConstOffset|Sample %49 %28
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

