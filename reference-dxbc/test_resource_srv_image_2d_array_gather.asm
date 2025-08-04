SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 130
; Schema: 0
               OpCapability Shader
               OpCapability ImageGatherExtended
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %11 %TEXCOORD %DEPTH_REF %LAYER %OFFSET %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3 %SV_TARGET_4 %SV_TARGET_5
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
          %6 = OpTypeImage %float 2D 0 1 0 1 Unknown
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
         %51 = OpTypeSampledImage %6
%_ptr_Output_float = OpTypePointer Output %float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
         %71 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %128

        %128 = OpLabel
         %30 =   OpLoad %6 %8
         %31 =   OpLoad %9 %11
         %32 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %35 =   OpLoad %float %32
         %36 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %38 =   OpLoad %float %36
         %41 =   OpLoad %float %LAYER
         %43 =   OpAccessChain %_ptr_Input_int %OFFSET %uint_0
         %44 =   OpLoad %int %43
         %45 =   OpBitcast %uint %44
         %46 =   OpAccessChain %_ptr_Input_int %OFFSET %uint_1
         %47 =   OpLoad %int %46
         %48 =   OpBitcast %uint %47
         %52 =   OpSampledImage %51 %30 %31
         %53 =   OpCompositeConstruct %v3float %35 %38 %41
         %54 =   OpImageGather %v4float %52 %53 %uint_0
         %55 =   OpCompositeExtract %float %54 0
         %56 =   OpCompositeExtract %float %54 1
         %57 =   OpCompositeExtract %float %54 2
         %58 =   OpCompositeExtract %float %54 3
         %61 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %61 %55
         %62 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %62 %56
         %63 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %63 %57
         %65 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %65 %58
         %67 =   OpCompositeConstruct %v3float %35 %38 %41
         %70 =   OpImageGather %v4float %52 %67 %uint_0 ConstOffset %71
         %72 =   OpCompositeExtract %float %70 0
         %73 =   OpCompositeExtract %float %70 1
         %74 =   OpCompositeExtract %float %70 2
         %75 =   OpCompositeExtract %float %70 3
         %77 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %77 %72
         %78 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %78 %73
         %79 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %79 %74
         %80 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %80 %75
         %81 =   OpCompositeConstruct %v3float %35 %38 %41
         %82 =   OpImageGather %v4float %52 %81 %uint_1
         %83 =   OpCompositeExtract %float %82 0
         %84 =   OpCompositeExtract %float %82 1
         %85 =   OpCompositeExtract %float %82 2
         %86 =   OpCompositeExtract %float %82 3
         %88 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %88 %83
         %89 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %89 %84
         %90 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %90 %85
         %91 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %91 %86
         %92 =   OpCompositeConstruct %v3float %35 %38 %41
         %93 =   OpImageGather %v4float %52 %92 %uint_2
         %94 =   OpCompositeExtract %float %93 0
         %95 =   OpCompositeExtract %float %93 1
         %96 =   OpCompositeExtract %float %93 2
         %97 =   OpCompositeExtract %float %93 3
         %99 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %99 %94
        %100 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %100 %95
        %101 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %101 %96
        %102 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %102 %97
        %103 =   OpCompositeConstruct %v3float %35 %38 %41
        %104 =   OpImageGather %v4float %52 %103 %uint_3
        %105 =   OpCompositeExtract %float %104 0
        %106 =   OpCompositeExtract %float %104 1
        %107 =   OpCompositeExtract %float %104 2
        %108 =   OpCompositeExtract %float %104 3
        %110 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %110 %105
        %111 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %111 %106
        %112 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %112 %107
        %113 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %113 %108
        %114 =   OpCompositeConstruct %v3float %35 %38 %41
        %115 =   OpBitcast %int %45
        %116 =   OpBitcast %int %48
        %118 =   OpCompositeConstruct %v2int %115 %116
        %117 =   OpImageGather %v4float %52 %114 %uint_0 Offset %118
        %119 =   OpCompositeExtract %float %117 0
        %120 =   OpCompositeExtract %float %117 1
        %121 =   OpCompositeExtract %float %117 2
        %122 =   OpCompositeExtract %float %117 3
        %124 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_0
                 OpStore %124 %119
        %125 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_1
                 OpStore %125 %120
        %126 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_2
                 OpStore %126 %121
        %127 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_3
                 OpStore %127 %122
                 OpReturn
               OpFunctionEnd

