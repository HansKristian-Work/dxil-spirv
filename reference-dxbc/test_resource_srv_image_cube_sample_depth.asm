SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 55
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %11 %TEXCOORD %DEPTH_REF %LOD_BIAS %LOD_CLAMP %LAYER %TEXCOORD_2 %SV_TARGET %SV_TARGET_1
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
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float Cube 0 0 0 1 Unknown
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
 %TEXCOORD_2 = OpVariable %_ptr_Input_v3float Input
%_ptr_Output_float = OpTypePointer Output %float
  %SV_TARGET = OpVariable %_ptr_Output_float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_float Output
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
         %40 = OpTypeImage %float Cube 1 0 0 1 Unknown
         %41 = OpTypeSampledImage %40
    %float_0 = OpConstant %float 0
    %v4float = OpTypeVector %float 4
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %53

         %53 = OpLabel
         %24 =   OpLoad %6 %8
         %25 =   OpLoad %9 %11
         %26 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %29 =   OpLoad %float %26
         %30 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %32 =   OpLoad %float %30
         %33 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_2
         %35 =   OpLoad %float %33
         %37 =   OpLoad %float %DEPTH_REF
         %42 =   OpSampledImage %41 %24 %25
         %45 =   OpCompositeConstruct %v3float %29 %32 %35
         %44 =   OpImageSampleDrefImplicitLod %float %42 %45 %37 None
         %47 =   OpCompositeConstruct %v4float %44 %44 %44 %44
         %48 =   OpCompositeExtract %float %47 0
                 OpStore %SV_TARGET %48
         %50 =   OpCompositeConstruct %v3float %29 %32 %35
         %49 =   OpImageSampleDrefExplicitLod %float %42 %50 %37 Lod %float_0
         %51 =   OpCompositeConstruct %v4float %49 %49 %49 %49
         %52 =   OpCompositeExtract %float %51 0
                 OpStore %SV_TARGET_1 %52
                 OpReturn
               OpFunctionEnd

