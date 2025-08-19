SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 169
; Schema: 0
               OpCapability Shader
               OpCapability MinLod
               OpCapability ImageQuery
               OpCapability DerivativeControl
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %11 %TEXCOORD %DEPTH_REF %LOD_BIAS %LOD_CLAMP %LAYER %TEXCOORD_2 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3 %SV_TARGET_4 %SV_TARGET_5 %SV_TARGET_6 %SV_TARGET_7
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
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
          %6 = OpTypeImage %float 3D 0 0 0 1 Unknown
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
     %uint_2 = OpConstant %uint 2
         %44 = OpTypeSampledImage %6
    %v2float = OpTypeVector %float 2
    %float_0 = OpConstant %float 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
      %int_1 = OpConstant %int 1
      %v3int = OpTypeVector %int 3
         %73 = OpConstantComposite %v3int %int_n1 %int_0 %int_1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %167

        %167 = OpLabel
         %31 =   OpLoad %6 %8
         %32 =   OpLoad %9 %11
         %33 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %36 =   OpLoad %float %33
         %37 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %39 =   OpLoad %float %37
         %40 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_2
         %42 =   OpLoad %float %40
         %45 =   OpSampledImage %44 %31 %32
         %48 =   OpCompositeConstruct %v3float %36 %39 %42
         %47 =   OpImageQueryLod %v2float %45 %48
         %49 =   OpCompositeExtract %float %47 0
         %50 =   OpLoad %float %LOD_BIAS
         %51 =   OpLoad %float %LOD_CLAMP
         %54 =   OpCompositeConstruct %v3float %36 %39 %42
         %53 =   OpImageSampleImplicitLod %v4float %45 %54 None
         %55 =   OpCompositeExtract %float %53 0
         %56 =   OpCompositeExtract %float %53 1
         %57 =   OpCompositeExtract %float %53 2
         %58 =   OpCompositeExtract %float %53 3
         %61 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %61 %55
         %62 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %62 %56
         %63 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %63 %57
         %64 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %64 %58
         %71 =   OpCompositeConstruct %v3float %36 %39 %42
         %70 =   OpImageSampleImplicitLod %v4float %45 %71 ConstOffset %73
         %74 =   OpCompositeExtract %float %70 0
         %75 =   OpCompositeExtract %float %70 1
         %76 =   OpCompositeExtract %float %70 2
         %77 =   OpCompositeExtract %float %70 3
         %79 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %79 %74
         %80 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %80 %75
         %81 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %81 %76
         %82 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %82 %77
         %84 =   OpCompositeConstruct %v3float %36 %39 %42
         %83 =   OpImageSampleExplicitLod %v4float %45 %84 Lod %49
         %85 =   OpCompositeExtract %float %83 0
         %86 =   OpCompositeExtract %float %83 1
         %87 =   OpCompositeExtract %float %83 2
         %88 =   OpCompositeExtract %float %83 3
         %90 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %90 %85
         %91 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %91 %86
         %92 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %92 %87
         %93 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %93 %88
         %95 =   OpCompositeConstruct %v3float %36 %39 %42
         %94 =   OpImageSampleImplicitLod %v4float %45 %95 Bias %50
         %96 =   OpCompositeExtract %float %94 0
         %97 =   OpCompositeExtract %float %94 1
         %98 =   OpCompositeExtract %float %94 2
         %99 =   OpCompositeExtract %float %94 3
        %101 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %101 %96
        %102 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %102 %97
        %103 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %103 %98
        %104 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %104 %99
        %106 =   OpCompositeConstruct %v3float %36 %39 %42
        %105 =   OpImageSampleImplicitLod %v4float %45 %106 MinLod %51
        %107 =   OpCompositeExtract %float %105 0
        %108 =   OpCompositeExtract %float %105 1
        %109 =   OpCompositeExtract %float %105 2
        %110 =   OpCompositeExtract %float %105 3
        %112 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %112 %107
        %113 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %113 %108
        %114 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %114 %109
        %115 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %115 %110
        %117 =   OpCompositeConstruct %v3float %36 %39 %42
        %116 =   OpImageSampleImplicitLod %v4float %45 %117 Bias|ConstOffset|MinLod %50 %73 %51
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
        %127 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_0
        %128 =   OpLoad %float %127
        %129 =   OpDPdx %float %128
        %130 =   OpDPdy %float %128
        %131 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_1
        %132 =   OpLoad %float %131
        %133 =   OpDPdx %float %132
        %134 =   OpDPdy %float %132
        %135 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_2
        %136 =   OpLoad %float %135
        %137 =   OpDPdx %float %136
        %138 =   OpDPdy %float %136
        %142 =   OpCompositeConstruct %v3float %36 %39 %42
        %143 =   OpCompositeConstruct %v3float %129 %133 %137
        %144 =   OpCompositeConstruct %v3float %130 %134 %138
        %141 =   OpImageSampleExplicitLod %v4float %45 %142 Grad %143 %144
        %145 =   OpCompositeExtract %float %141 0
        %146 =   OpCompositeExtract %float %141 1
        %147 =   OpCompositeExtract %float %141 2
        %148 =   OpCompositeExtract %float %141 3
        %150 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_0
                 OpStore %150 %145
        %151 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_1
                 OpStore %151 %146
        %152 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_2
                 OpStore %152 %147
        %153 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_3
                 OpStore %153 %148
        %155 =   OpCompositeConstruct %v3float %36 %39 %42
        %156 =   OpCompositeConstruct %v3float %129 %133 %137
        %157 =   OpCompositeConstruct %v3float %130 %134 %138
        %154 =   OpImageSampleExplicitLod %v4float %45 %155 Grad|ConstOffset %156 %157 %73
        %158 =   OpCompositeExtract %float %154 0
        %159 =   OpCompositeExtract %float %154 1
        %160 =   OpCompositeExtract %float %154 2
        %161 =   OpCompositeExtract %float %154 3
        %163 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_0
                 OpStore %163 %158
        %164 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_1
                 OpStore %164 %159
        %165 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_2
                 OpStore %165 %160
        %166 =   OpAccessChain %_ptr_Output_float %SV_TARGET_7 %uint_3
                 OpStore %166 %161
                 OpReturn
               OpFunctionEnd

