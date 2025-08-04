SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 95
; Schema: 0
               OpCapability Shader
               OpCapability ImageGatherExtended
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %11 %TEXCOORD %DEPTH_REF %LAYER %OFFSET %SV_TARGET %SV_TARGET_1 %SV_TARGET_2
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %TEXCOORD "TEXCOORD"
               OpName %DEPTH_REF "DEPTH_REF"
               OpName %LAYER "LAYER"
               OpName %OFFSET "OFFSET"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_2 "SV_TARGET_2"
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
      %LAYER = OpVariable %_ptr_Input_float Input
        %int = OpTypeInt 32 1
      %v2int = OpTypeVector %int 2
%_ptr_Input_v2int = OpTypePointer Input %v2int
     %OFFSET = OpVariable %_ptr_Input_v2int Input
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_2 = OpVariable %_ptr_Output_v4float Output
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
    %v2float = OpTypeVector %float 2
%_ptr_Input_int = OpTypePointer Input %int
     %v2uint = OpTypeVector %uint 2
         %48 = OpTypeImage %float 2D 1 0 0 1 Unknown
         %49 = OpTypeSampledImage %48
%_ptr_Output_float = OpTypePointer Output %float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
         %69 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %93

         %93 = OpLabel
         %27 =   OpLoad %6 %8
         %28 =   OpLoad %9 %11
         %29 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %32 =   OpLoad %float %29
         %33 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %35 =   OpLoad %float %33
         %38 =   OpLoad %float %DEPTH_REF
         %40 =   OpAccessChain %_ptr_Input_int %OFFSET %uint_0
         %41 =   OpLoad %int %40
         %42 =   OpBitcast %uint %41
         %43 =   OpAccessChain %_ptr_Input_int %OFFSET %uint_1
         %44 =   OpLoad %int %43
         %45 =   OpBitcast %uint %44
         %50 =   OpSampledImage %49 %27 %28
         %51 =   OpCompositeConstruct %v2float %32 %35
         %52 =   OpImageDrefGather %v4float %50 %51 %38
         %53 =   OpCompositeExtract %float %52 0
         %54 =   OpCompositeExtract %float %52 1
         %55 =   OpCompositeExtract %float %52 2
         %56 =   OpCompositeExtract %float %52 3
         %59 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %59 %53
         %60 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %60 %54
         %61 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %61 %55
         %63 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %63 %56
         %65 =   OpCompositeConstruct %v2float %32 %35
         %68 =   OpImageDrefGather %v4float %50 %65 %38 ConstOffset %69
         %70 =   OpCompositeExtract %float %68 0
         %71 =   OpCompositeExtract %float %68 1
         %72 =   OpCompositeExtract %float %68 2
         %73 =   OpCompositeExtract %float %68 3
         %75 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %75 %70
         %76 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %76 %71
         %77 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %77 %72
         %78 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %78 %73
         %79 =   OpCompositeConstruct %v2float %32 %35
         %80 =   OpBitcast %int %42
         %81 =   OpBitcast %int %45
         %83 =   OpCompositeConstruct %v2int %80 %81
         %82 =   OpImageDrefGather %v4float %50 %79 %38 Offset %83
         %84 =   OpCompositeExtract %float %82 0
         %85 =   OpCompositeExtract %float %82 1
         %86 =   OpCompositeExtract %float %82 2
         %87 =   OpCompositeExtract %float %82 3
         %89 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %89 %84
         %90 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %90 %85
         %91 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %91 %86
         %92 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %92 %87
                 OpReturn
               OpFunctionEnd

