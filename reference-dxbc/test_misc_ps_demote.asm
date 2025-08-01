SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 64
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %11 %TEXCOORD %SV_TARGET %discard_state
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %TEXCOORD "TEXCOORD"
               OpName %SV_TARGET "SV_TARGET"
               OpName %discard_state "discard_state"
               OpName %discard_exit "discard_exit"
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
%_ptr_Private_bool = OpTypePointer Private %bool
%discard_state = OpVariable %_ptr_Private_bool Private
      %false = OpConstantFalse %bool
%_ptr_Output_float = OpTypePointer Output %float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
       %true = OpConstantTrue %bool
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpStore %discard_state %false
                 OpBranch %52

         %52 = OpLabel
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
                 OpSelectionMerge %54 None
                 OpBranchConditional %40 %53 %54

         %53 =     OpLabel
                     OpStore %discard_state %true
                     OpBranch %54

         %54 = OpLabel
         %46 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %46 %34
         %47 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %47 %35
         %48 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %48 %36
         %50 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %50 %37
         %62 =   OpFunctionCall %void %discard_exit
                 OpReturn
               OpFunctionEnd
%discard_exit = OpFunction %void None %2

         %57 = OpLabel
         %60 =   OpLoad %bool %discard_state
                 OpSelectionMerge %59 None
                 OpBranchConditional %60 %58 %59

         %58 =     OpLabel
                     OpKill

         %59 = OpLabel
                 OpReturn
               OpFunctionEnd

