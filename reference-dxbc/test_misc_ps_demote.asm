SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 53
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
               OpCapability DemoteToHelperInvocation
               OpExtension "SPV_EXT_demote_to_helper_invocation"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %11 %TEXCOORD %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %TEXCOORD "TEXCOORD"
               OpName %SV_TARGET "SV_TARGET"
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %11 DescriptorSet 0
               OpDecorate %11 Binding 0
               OpDecorate %TEXCOORD Location 0
               OpDecorate %SV_TARGET Location 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 2D 0 0 0 1 Unknown
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
          %9 = OpTypeSampler
%_ptr_UniformConstant_9 = OpTypePointer UniformConstant %9
         %11 = OpVariable %_ptr_UniformConstant_9 UniformConstant
    %v2float = OpTypeVector %float 2
%_ptr_Input_v2float = OpTypePointer Input %v2float
   %TEXCOORD = OpVariable %_ptr_Input_v2float Input
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%_ptr_Input_float = OpTypePointer Input %float
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
         %29 = OpTypeSampledImage %6
    %float_0 = OpConstant %float 0
       %bool = OpTypeBool
%float_0_00499999989 = OpConstant %float 0.00499999989
%_ptr_Output_float = OpTypePointer Output %float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %49

         %49 = OpLabel
         %18 =   OpLoad %6 %8
         %19 =   OpLoad %9 %11
         %21 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %24 =   OpLoad %float %21
         %25 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %27 =   OpLoad %float %25
         %30 =   OpSampledImage %29 %18 %19
         %33 =   OpCompositeConstruct %v2float %24 %27
         %32 =   OpImageSampleImplicitLod %v4float %30 %33 None
         %34 =   OpCompositeExtract %float %32 0
         %35 =   OpCompositeExtract %float %32 1
         %36 =   OpCompositeExtract %float %32 2
         %37 =   OpCompositeExtract %float %32 3
         %40 =   OpFOrdLessThan %bool %37 %float_0_00499999989
                 OpSelectionMerge %51 None
                 OpBranchConditional %40 %50 %51

         %50 =     OpLabel
                     OpDemoteToHelperInvocation
                     OpBranch %51

         %51 = OpLabel
         %43 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %43 %34
         %44 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %44 %35
         %45 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %45 %36
         %47 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %47 %37
                 OpReturn
               OpFunctionEnd

