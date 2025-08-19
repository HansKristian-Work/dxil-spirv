SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 129
; Schema: 0
               OpCapability Shader
               OpCapability ImageGatherExtended
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %11 %TEXCOORD %DEPTH_REF %LAYER %OFFSET %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3 %SV_TARGET_4 %SV_TARGET_5
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %TEXCOORD "TEXCOORD"
               OpName %DEPTH_REF "DEPTH_REF"
               OpName %LAYER "LAYER"
               OpName %OFFSET "OFFSET"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_2 "SV_TARGET_2"
               OpName %SV_TARGET_3 "SV_TARGET_3"
               OpName %SV_TARGET_4 "SV_TARGET_4"
               OpName %SV_TARGET_5 "SV_TARGET_5"
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
               OpDecorate %SV_TARGET_4 Location 4
               OpDecorate %SV_TARGET_5 Location 5
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
%SV_TARGET_3 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_4 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_5 = OpVariable %_ptr_Output_v4float Output
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
    %v2float = OpTypeVector %float 2
%_ptr_Input_int = OpTypePointer Input %int
     %v2uint = OpTypeVector %uint 2
         %50 = OpTypeSampledImage %6
%_ptr_Output_float = OpTypePointer Output %float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
         %70 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %127

        %127 = OpLabel
         %30 =   OpLoad %6 %8
         %31 =   OpLoad %9 %11
         %32 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %35 =   OpLoad %float %32
         %36 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %38 =   OpLoad %float %36
         %42 =   OpAccessChain %_ptr_Input_int %OFFSET %uint_0
         %43 =   OpLoad %int %42
         %44 =   OpBitcast %uint %43
         %45 =   OpAccessChain %_ptr_Input_int %OFFSET %uint_1
         %46 =   OpLoad %int %45
         %47 =   OpBitcast %uint %46
         %51 =   OpSampledImage %50 %30 %31
         %52 =   OpCompositeConstruct %v2float %35 %38
         %53 =   OpImageGather %v4float %51 %52 %uint_0
         %54 =   OpCompositeExtract %float %53 0
         %55 =   OpCompositeExtract %float %53 1
         %56 =   OpCompositeExtract %float %53 2
         %57 =   OpCompositeExtract %float %53 3
         %60 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %60 %54
         %61 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %61 %55
         %62 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %62 %56
         %64 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %64 %57
         %66 =   OpCompositeConstruct %v2float %35 %38
         %69 =   OpImageGather %v4float %51 %66 %uint_0 ConstOffset %70
         %71 =   OpCompositeExtract %float %69 0
         %72 =   OpCompositeExtract %float %69 1
         %73 =   OpCompositeExtract %float %69 2
         %74 =   OpCompositeExtract %float %69 3
         %76 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %76 %71
         %77 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %77 %72
         %78 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %78 %73
         %79 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %79 %74
         %80 =   OpCompositeConstruct %v2float %35 %38
         %81 =   OpImageGather %v4float %51 %80 %uint_1
         %82 =   OpCompositeExtract %float %81 0
         %83 =   OpCompositeExtract %float %81 1
         %84 =   OpCompositeExtract %float %81 2
         %85 =   OpCompositeExtract %float %81 3
         %87 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %87 %82
         %88 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %88 %83
         %89 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %89 %84
         %90 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %90 %85
         %91 =   OpCompositeConstruct %v2float %35 %38
         %92 =   OpImageGather %v4float %51 %91 %uint_2
         %93 =   OpCompositeExtract %float %92 0
         %94 =   OpCompositeExtract %float %92 1
         %95 =   OpCompositeExtract %float %92 2
         %96 =   OpCompositeExtract %float %92 3
         %98 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %98 %93
         %99 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %99 %94
        %100 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %100 %95
        %101 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %101 %96
        %102 =   OpCompositeConstruct %v2float %35 %38
        %103 =   OpImageGather %v4float %51 %102 %uint_3
        %104 =   OpCompositeExtract %float %103 0
        %105 =   OpCompositeExtract %float %103 1
        %106 =   OpCompositeExtract %float %103 2
        %107 =   OpCompositeExtract %float %103 3
        %109 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %109 %104
        %110 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %110 %105
        %111 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %111 %106
        %112 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %112 %107
        %113 =   OpCompositeConstruct %v2float %35 %38
        %114 =   OpBitcast %int %44
        %115 =   OpBitcast %int %47
        %117 =   OpCompositeConstruct %v2int %114 %115
        %116 =   OpImageGather %v4float %51 %113 %uint_0 Offset %117
        %118 =   OpCompositeExtract %float %116 0
        %119 =   OpCompositeExtract %float %116 1
        %120 =   OpCompositeExtract %float %116 2
        %121 =   OpCompositeExtract %float %116 3
        %123 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_0
                 OpStore %123 %118
        %124 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_1
                 OpStore %124 %119
        %125 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_2
                 OpStore %125 %120
        %126 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_3
                 OpStore %126 %121
                 OpReturn
               OpFunctionEnd

