SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 92
; Schema: 0
               OpCapability Shader
               OpCapability SampledCubeArray
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %11 %TEXCOORD %DEPTH_REF %LAYER %OFFSET %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %TEXCOORD "TEXCOORD"
               OpName %DEPTH_REF "DEPTH_REF"
               OpName %LAYER "LAYER"
               OpName %OFFSET "OFFSET"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_2 "SV_TARGET_2"
               OpName %SV_TARGET_3 "SV_TARGET_3"
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
               OpDecorate %SV_TARGET_3 Location 3
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float Cube 0 1 0 1 Unknown
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
%SV_TARGET_1 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_2 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_3 = OpVariable %_ptr_Output_v4float Output
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
         %42 = OpTypeSampledImage %6
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %90

         %90 = OpLabel
         %28 =   OpLoad %6 %8
         %29 =   OpLoad %9 %11
         %30 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %33 =   OpLoad %float %30
         %34 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %36 =   OpLoad %float %34
         %37 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_2
         %39 =   OpLoad %float %37
         %41 =   OpLoad %float %LAYER
         %43 =   OpSampledImage %42 %28 %29
         %44 =   OpCompositeConstruct %v4float %33 %36 %39 %41
         %45 =   OpImageGather %v4float %43 %44 %uint_0
         %46 =   OpCompositeExtract %float %45 0
         %47 =   OpCompositeExtract %float %45 1
         %48 =   OpCompositeExtract %float %45 2
         %49 =   OpCompositeExtract %float %45 3
         %52 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %52 %46
         %53 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %53 %47
         %54 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %54 %48
         %55 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %55 %49
         %57 =   OpCompositeConstruct %v4float %33 %36 %39 %41
         %58 =   OpImageGather %v4float %43 %57 %uint_1
         %59 =   OpCompositeExtract %float %58 0
         %60 =   OpCompositeExtract %float %58 1
         %61 =   OpCompositeExtract %float %58 2
         %62 =   OpCompositeExtract %float %58 3
         %64 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %64 %59
         %65 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %65 %60
         %66 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %66 %61
         %67 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %67 %62
         %68 =   OpCompositeConstruct %v4float %33 %36 %39 %41
         %69 =   OpImageGather %v4float %43 %68 %uint_2
         %70 =   OpCompositeExtract %float %69 0
         %71 =   OpCompositeExtract %float %69 1
         %72 =   OpCompositeExtract %float %69 2
         %73 =   OpCompositeExtract %float %69 3
         %75 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %75 %70
         %76 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %76 %71
         %77 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %77 %72
         %78 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %78 %73
         %79 =   OpCompositeConstruct %v4float %33 %36 %39 %41
         %80 =   OpImageGather %v4float %43 %79 %uint_3
         %81 =   OpCompositeExtract %float %80 0
         %82 =   OpCompositeExtract %float %80 1
         %83 =   OpCompositeExtract %float %80 2
         %84 =   OpCompositeExtract %float %80 3
         %86 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %86 %81
         %87 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %87 %82
         %88 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %88 %83
         %89 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %89 %84
                 OpReturn
               OpFunctionEnd

