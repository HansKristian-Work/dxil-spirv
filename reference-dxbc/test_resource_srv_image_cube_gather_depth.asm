SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 57
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %11 %TEXCOORD %DEPTH_REF %LAYER %OFFSET %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %TEXCOORD "TEXCOORD"
               OpName %DEPTH_REF "DEPTH_REF"
               OpName %LAYER "LAYER"
               OpName %OFFSET "OFFSET"
               OpName %SV_TARGET "SV_TARGET"
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %11 DescriptorSet 0
               OpDecorate %11 Binding 0
               OpDecorate %TEXCOORD Location 0
               OpDecorate %DEPTH_REF Location 1
               OpDecorate %LAYER Location 1
               OpDecorate %LAYER Component 1
               OpDecorate %OFFSET Flat
               OpDecorate %OFFSET Location 2
               OpDecorate %SV_TARGET Location 0
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
      %LAYER = OpVariable %_ptr_Input_float Input
        %int = OpTypeInt 32 1
      %v3int = OpTypeVector %int 3
%_ptr_Input_v3int = OpTypePointer Input %v3int
     %OFFSET = OpVariable %_ptr_Input_v3int Input
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
         %39 = OpTypeImage %float Cube 1 0 0 1 Unknown
         %40 = OpTypeSampledImage %39
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %55

         %55 = OpLabel
         %25 =   OpLoad %6 %8
         %26 =   OpLoad %9 %11
         %27 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %30 =   OpLoad %float %27
         %31 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %33 =   OpLoad %float %31
         %34 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_2
         %36 =   OpLoad %float %34
         %38 =   OpLoad %float %DEPTH_REF
         %41 =   OpSampledImage %40 %25 %26
         %42 =   OpCompositeConstruct %v3float %30 %33 %36
         %43 =   OpImageDrefGather %v4float %41 %42 %38
         %44 =   OpCompositeExtract %float %43 0
         %45 =   OpCompositeExtract %float %43 1
         %46 =   OpCompositeExtract %float %43 2
         %47 =   OpCompositeExtract %float %43 3
         %50 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %50 %44
         %51 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %51 %45
         %52 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %52 %46
         %53 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %53 %47
                 OpReturn
               OpFunctionEnd

