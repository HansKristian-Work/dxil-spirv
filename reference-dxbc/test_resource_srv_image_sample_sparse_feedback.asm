SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 167
; Schema: 0
               OpCapability Shader
               OpCapability SparseResidency
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
               OpName %SparseTexel "SparseTexel"
               OpName %_ ""
               OpName %__0 ""
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
   %LOD_BIAS = OpVariable %_ptr_Input_float Input
  %LOD_CLAMP = OpVariable %_ptr_Input_float Input
      %LAYER = OpVariable %_ptr_Input_float Input
    %v2float = OpTypeVector %float 2
%_ptr_Input_v2float = OpTypePointer Input %v2float
 %TEXCOORD_2 = OpVariable %_ptr_Input_v2float Input
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%_ptr_Output_float = OpTypePointer Output %float
%SV_TARGET_1 = OpVariable %_ptr_Output_float Output
%SV_TARGET_2 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_3 = OpVariable %_ptr_Output_float Output
%SV_TARGET_4 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_5 = OpVariable %_ptr_Output_float Output
%SV_TARGET_6 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_7 = OpVariable %_ptr_Output_float Output
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
         %45 = OpTypeSampledImage %6
    %float_0 = OpConstant %float 0
%SparseTexel = OpTypeStruct %uint %v4float
          %_ = OpTypeStruct %float %float %float %float %uint
        %__0 = OpTypeStruct %uint %v4float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
       %bool = OpTypeBool
    %float_1 = OpConstant %float 1
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
      %v2int = OpTypeVector %int 2
        %110 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %165

        %165 = OpLabel
         %34 =   OpLoad %6 %8
         %35 =   OpLoad %9 %11
         %36 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %39 =   OpLoad %float %36
         %40 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %42 =   OpLoad %float %40
         %44 =   OpLoad %float %LAYER
         %46 =   OpSampledImage %45 %34 %35
         %48 =   OpCompositeConstruct %v2float %39 %42
         %47 =   OpImageQueryLod %v2float %46 %48
         %49 =   OpCompositeExtract %float %47 0
         %50 =   OpLoad %float %LOD_BIAS
         %51 =   OpLoad %float %LOD_CLAMP
         %55 =   OpCompositeConstruct %v3float %39 %42 %44
         %54 =   OpImageSparseSampleImplicitLod %SparseTexel %46 %55 None
         %56 =   OpCompositeExtract %uint %54 0
         %57 =   OpCompositeExtract %v4float %54 1
         %58 =   OpCompositeExtract %float %57 0
         %59 =   OpCompositeExtract %float %57 1
         %60 =   OpCompositeExtract %float %57 2
         %61 =   OpCompositeExtract %float %57 3
         %63 =   OpCompositeConstruct %_ %58 %59 %60 %61 %56
         %64 =   OpCompositeExtract %uint %63 4
         %65 =   OpCompositeExtract %float %63 0
         %66 =   OpCompositeExtract %float %63 1
         %67 =   OpCompositeExtract %float %63 2
         %68 =   OpCompositeExtract %float %63 3
         %69 =   OpCompositeConstruct %v4float %65 %66 %67 %68
         %72 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %72 %65
         %73 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %73 %66
         %74 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %74 %67
         %76 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %76 %68
         %79 =   OpImageSparseTexelsResident %bool %64
         %80 =   OpSelect %float %79 %float_1 %float_0
                 OpStore %SV_TARGET_1 %80
         %83 =   OpCompositeConstruct %v3float %39 %42 %44
         %82 =   OpImageSparseSampleExplicitLod %SparseTexel %46 %83 Lod %49
         %84 =   OpCompositeExtract %uint %82 0
         %85 =   OpCompositeExtract %v4float %82 1
         %86 =   OpCompositeExtract %float %85 0
         %87 =   OpCompositeExtract %float %85 1
         %88 =   OpCompositeExtract %float %85 2
         %89 =   OpCompositeExtract %float %85 3
         %90 =   OpCompositeConstruct %_ %86 %87 %88 %89 %84
         %91 =   OpCompositeExtract %uint %90 4
         %92 =   OpCompositeExtract %float %90 0
         %93 =   OpCompositeExtract %float %90 1
         %94 =   OpCompositeExtract %float %90 2
         %95 =   OpCompositeExtract %float %90 3
         %96 =   OpCompositeConstruct %v4float %92 %93 %94 %95
         %98 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %98 %92
         %99 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %99 %93
        %100 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %100 %94
        %101 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %101 %95
        %102 =   OpImageSparseTexelsResident %bool %91
        %103 =   OpSelect %float %102 %float_1 %float_0
                 OpStore %SV_TARGET_3 %103
        %108 =   OpCompositeConstruct %v3float %39 %42 %44
        %107 =   OpImageSparseSampleImplicitLod %SparseTexel %46 %108 Bias|ConstOffset|MinLod %50 %110 %51
        %111 =   OpCompositeExtract %uint %107 0
        %112 =   OpCompositeExtract %v4float %107 1
        %113 =   OpCompositeExtract %float %112 0
        %114 =   OpCompositeExtract %float %112 1
        %115 =   OpCompositeExtract %float %112 2
        %116 =   OpCompositeExtract %float %112 3
        %117 =   OpCompositeConstruct %_ %113 %114 %115 %116 %111
        %118 =   OpCompositeExtract %uint %117 4
        %119 =   OpCompositeExtract %float %117 0
        %120 =   OpCompositeExtract %float %117 1
        %121 =   OpCompositeExtract %float %117 2
        %122 =   OpCompositeExtract %float %117 3
        %123 =   OpCompositeConstruct %v4float %119 %120 %121 %122
        %125 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %125 %119
        %126 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %126 %120
        %127 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %127 %121
        %128 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %128 %122
        %129 =   OpImageSparseTexelsResident %bool %118
        %130 =   OpSelect %float %129 %float_1 %float_0
                 OpStore %SV_TARGET_5 %130
        %131 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_0
        %132 =   OpLoad %float %131
        %133 =   OpDPdx %float %132
        %134 =   OpDPdy %float %132
        %135 =   OpAccessChain %_ptr_Input_float %TEXCOORD_2 %uint_1
        %136 =   OpLoad %float %135
        %137 =   OpDPdx %float %136
        %138 =   OpDPdy %float %136
        %142 =   OpCompositeConstruct %v3float %39 %42 %44
        %143 =   OpCompositeConstruct %v2float %133 %137
        %144 =   OpCompositeConstruct %v2float %134 %138
        %141 =   OpImageSparseSampleExplicitLod %SparseTexel %46 %142 Grad %143 %144
        %145 =   OpCompositeExtract %uint %141 0
        %146 =   OpCompositeExtract %v4float %141 1
        %147 =   OpCompositeExtract %float %146 0
        %148 =   OpCompositeExtract %float %146 1
        %149 =   OpCompositeExtract %float %146 2
        %150 =   OpCompositeExtract %float %146 3
        %151 =   OpCompositeConstruct %_ %147 %148 %149 %150 %145
        %152 =   OpCompositeExtract %uint %151 4
        %153 =   OpCompositeExtract %float %151 0
        %154 =   OpCompositeExtract %float %151 1
        %155 =   OpCompositeExtract %float %151 2
        %156 =   OpCompositeExtract %float %151 3
        %157 =   OpCompositeConstruct %v4float %153 %154 %155 %156
        %159 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_0
                 OpStore %159 %153
        %160 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_1
                 OpStore %160 %154
        %161 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_2
                 OpStore %161 %155
        %162 =   OpAccessChain %_ptr_Output_float %SV_TARGET_6 %uint_3
                 OpStore %162 %156
        %163 =   OpImageSparseTexelsResident %bool %152
        %164 =   OpSelect %float %163 %float_1 %float_0
                 OpStore %SV_TARGET_7 %164
                 OpReturn
               OpFunctionEnd

