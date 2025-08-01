SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 64
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %11 %TEXCOORD %DEPTH_REF %LOD_BIAS %LOD_CLAMP %LAYER %TEXCOORD_2 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %TEXCOORD "TEXCOORD"
               OpName %DEPTH_REF "DEPTH_REF"
               OpName %LOD_BIAS "LOD_BIAS"
               OpName %LOD_CLAMP "LOD_CLAMP"
               OpName %LAYER "LAYER"
               OpName %TEXCOORD_2 "TEXCOORD_2"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_2 "SV_TARGET_2"
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %11 DescriptorSet 0
               OpDecorate %11 Binding 0
               OpDecorate %TEXCOORD Location 0
               OpDecorate %DEPTH_REF Location 1
               OpDecorate %LOD_BIAS Location 1
               OpDecorate %LOD_BIAS Component 1
               OpDecorate %LOD_CLAMP Location 1
               OpDecorate %LOD_CLAMP Component 2
               OpDecorate %LAYER Location 1
               OpDecorate %LAYER Component 3
               OpDecorate %TEXCOORD_2 Location 2
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
               OpDecorate %SV_TARGET_2 Location 2
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 2D 0 0 0 1 Unknown
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
          %9 = OpTypeSampler
%_ptr_UniformConstant_9 = OpTypePointer UniformConstant %9
         %11 = OpVariable %_ptr_UniformConstant_9 UniformConstant
    %v3float = OpTypeVector %float 3
%_ptr_Input_v3float = OpTypePointer Input %v3float
   %TEXCOORD = OpVariable %_ptr_Input_v3float Input
%_ptr_Input_float = OpTypePointer Input %float
  %DEPTH_REF = OpVariable %_ptr_Input_float Input
   %LOD_BIAS = OpVariable %_ptr_Input_float Input
  %LOD_CLAMP = OpVariable %_ptr_Input_float Input
      %LAYER = OpVariable %_ptr_Input_float Input
    %v2float = OpTypeVector %float 2
%_ptr_Input_v2float = OpTypePointer Input %v2float
 %TEXCOORD_2 = OpVariable %_ptr_Input_v2float Input
%_ptr_Output_float = OpTypePointer Output %float
  %SV_TARGET = OpVariable %_ptr_Output_float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_float Output
%SV_TARGET_2 = OpVariable %_ptr_Output_float Output
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
         %40 = OpTypeImage %float 2D 1 0 0 1 Unknown
         %41 = OpTypeSampledImage %40
    %float_0 = OpConstant %float 0
    %v4float = OpTypeVector %float 4
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
      %v2int = OpTypeVector %int 2
         %55 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %62

         %62 = OpLabel
         %27 =   OpLoad %6 %8
         %28 =   OpLoad %9 %11
         %29 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %32 =   OpLoad %float %29
         %33 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %35 =   OpLoad %float %33
         %37 =   OpLoad %float %DEPTH_REF
         %42 =   OpSampledImage %41 %27 %28
         %45 =   OpCompositeConstruct %v2float %32 %35
         %44 =   OpImageSampleDrefImplicitLod %float %42 %45 %37 None
         %47 =   OpCompositeConstruct %v4float %44 %44 %44 %44
         %48 =   OpCompositeExtract %float %47 0
                 OpStore %SV_TARGET %48
         %53 =   OpCompositeConstruct %v2float %32 %35
         %52 =   OpImageSampleDrefImplicitLod %float %42 %53 %37 ConstOffset %55
         %56 =   OpCompositeConstruct %v4float %52 %52 %52 %52
         %57 =   OpCompositeExtract %float %56 0
                 OpStore %SV_TARGET_1 %57
         %59 =   OpCompositeConstruct %v2float %32 %35
         %58 =   OpImageSampleDrefExplicitLod %float %42 %59 %37 Lod %float_0
         %60 =   OpCompositeConstruct %v4float %58 %58 %58 %58
         %61 =   OpCompositeExtract %float %60 0
                 OpStore %SV_TARGET_2 %61
                 OpReturn
               OpFunctionEnd

