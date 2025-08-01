SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 163
; Schema: 0
               OpCapability Shader
               OpCapability MinLod
               OpCapability ImageQuery
               OpCapability DerivativeControl
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %11 %TEXCOORD %DEPTH_REF %LOD_BIAS %LOD_CLAMP %LAYER %TEXCOORD_2 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3 %SV_TARGET_4 %SV_TARGET_5 %SV_TARGET_6 %SV_TARGET_7
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
               OpName %SV_TARGET_3 "SV_TARGET_3"
               OpName %SV_TARGET_4 "SV_TARGET_4"
               OpName %SV_TARGET_5 "SV_TARGET_5"
               OpName %SV_TARGET_6 "SV_TARGET_6"
               OpName %SV_TARGET_7 "SV_TARGET_7"
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
               OpDecorate %SV_TARGET_3 Location 3
               OpDecorate %SV_TARGET_4 Location 4
               OpDecorate %SV_TARGET_5 Location 5
               OpDecorate %SV_TARGET_6 Location 6
               OpDecorate %SV_TARGET_7 Location 7
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
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_2 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_3 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_4 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_5 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_6 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_7 = OpVariable %_ptr_Output_v4float Output
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
         %43 = OpTypeSampledImage %6
    %float_0 = OpConstant %float 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
      %v2int = OpTypeVector %int 2
         %71 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %161

        %161 = OpLabel
         %33 =   OpLoad %6 %8
         %34 =   OpLoad %9 %11
         %35 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %38 =   OpLoad %float %35
         %39 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %41 =   OpLoad %float %39
         %44 =   OpSampledImage %43 %33 %34
         %46 =   OpCompositeConstruct %v2float %38 %41
         %45 =   OpImageQueryLod %v2float %44 %46
         %47 =   OpCompositeExtract %float %45 0
         %48 =   OpLoad %float %LOD_BIAS
         %49 =   OpLoad %float %LOD_CLAMP
         %52 =   OpCompositeConstruct %v2float %38 %41
         %51 =   OpImageSampleImplicitLod %v4float %44 %52 None
         %53 =   OpCompositeExtract %float %51 0
         %54 =   OpCompositeExtract %float %51 1
         %55 =   OpCompositeExtract %float %51 2
         %56 =   OpCompositeExtract %float %51 3
         %59 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %59 %53
         %60 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %60 %54
         %61 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %61 %55
         %63 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %63 %56
         %69 =   OpCompositeConstruct %v2float %38 %41
         %68 =   OpImageSampleImplicitLod %v4float %44 %69 ConstOffset %71
         %72 =   OpCompositeExtract %float %68 0
         %73 =   OpCompositeExtract %float %68 1
         %74 =   OpCompositeExtract %float %68 2
         %75 =   OpCompositeExtract %float %68 3
         %77 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %77 %72
         %78 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %78 %73
         %79 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %79 %74
         %80 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %80 %75
         %82 =   OpCompositeConstruct %v2float %38 %41
         %81 =   OpImageSampleExplicitLod %v4float %44 %82 Lod %47
         %83 =   OpCompositeExtract %float %81 0
         %84 =   OpCompositeExtract %float %81 1
         %85 =   OpCompositeExtract %float %81 2
         %86 =   OpCompositeExtract %float %81 3
         %88 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %88 %83
         %89 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %89 %84
         %90 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %90 %85
         %91 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %91 %86
         %93 =   OpCompositeConstruct %v2float %38 %41
         %92 =   OpImageSampleImplicitLod %v4float %44 %93 Bias %48
         %94 =   OpCompositeExtract %float %92 0
         %95 =   OpCompositeExtract %float %92 1
         %96 =   OpCompositeExtract %float %92 2
         %97 =   OpCompositeExtract %float %92 3
         %99 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %99 %94
        %100 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %100 %95
        %101 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %101 %96
        %102 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %102 %97
        %104 =   OpCompositeConstruct %v2float %38 %41
        %103 =   OpImageSampleImplicitLod %v4float %44 %104 MinLod %49
        %105 =   OpCompositeExtract %float %103 0
        %106 =   OpCompositeExtract %float %103 1
        %107 =   OpCompositeExtract %float %103 2
        %108 =   OpCompositeExtract %float %103 3
        %110 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %110 %105
        %111 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %111 %106
        %112 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %112 %107
        %113 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %113 %108
        %115 =   OpCompositeConstruct %v2float %38 %41
        %114 =   OpImageSampleImplicitLod %v4float %44 %115 Bias|ConstOffset|MinLod %48 %71 %49
        %116 =   OpCompositeExtract %float %114 0
        %117 =   OpCompositeExtract %float %114 1
        %118 =   OpCompositeExtract %float %114 2
        %119 =   OpCompositeExtract %float %114 3
        %121 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_0
                 OpStore %121 %116
        %122 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_1
                 OpStore %122 %117
        %123 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_2
                 OpStore %123 %118
        %124 =   OpAccessChain %_ptr_Output_float %SV_TARGET_5 %uint_3
                 OpStore %124 %119
        %125 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_0
        %126 =   OpLoad %float %125
        %127 =   OpDPdx %float %126
        %128 =   OpDPdy %float %126
        %129 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_1
        %130 =   OpLoad %float %129
        %131 =   OpDPdx %float %130
        %132 =   OpDPdy %float %130
        %136 =   OpCompositeConstruct %v2float %38 %41
        %137 =   OpCompositeConstruct %v2float %127 %131
        %138 =   OpCompositeConstruct %v2float %128 %132
        %135 =   OpImageSampleExplicitLod %v4float %44 %136 Grad %137 %138
        %139 =   OpCompositeExtract %float %135 0
        %140 =   OpCompositeExtract %float %135 1
        %141 =   OpCompositeExtract %float %135 2
        %142 =   OpCompositeExtract %float %135 3
        %144 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_0
                 OpStore %144 %139
        %145 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_1
                 OpStore %145 %140
        %146 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_2
                 OpStore %146 %141
        %147 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_3
                 OpStore %147 %142
        %149 =   OpCompositeConstruct %v2float %38 %41
        %150 =   OpCompositeConstruct %v2float %127 %131
        %151 =   OpCompositeConstruct %v2float %128 %132
        %148 =   OpImageSampleExplicitLod %v4float %44 %149 Grad|ConstOffset %150 %151 %71
        %152 =   OpCompositeExtract %float %148 0
        %153 =   OpCompositeExtract %float %148 1
        %154 =   OpCompositeExtract %float %148 2
        %155 =   OpCompositeExtract %float %148 3
        %157 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_0
                 OpStore %157 %152
        %158 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_1
                 OpStore %158 %153
        %159 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_2
                 OpStore %159 %154
        %160 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_3
                 OpStore %160 %155
                 OpReturn
               OpFunctionEnd

