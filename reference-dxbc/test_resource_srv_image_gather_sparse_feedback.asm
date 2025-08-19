SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 134
; Schema: 0
               OpCapability Shader
               OpCapability ImageGatherExtended
               OpCapability SparseResidency
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %11 %TEXCOORD %DEPTH_REF %OFFSET %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3 %SV_TARGET_4 %SV_TARGET_5
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %TEXCOORD "TEXCOORD"
               OpName %DEPTH_REF "DEPTH_REF"
               OpName %OFFSET "OFFSET"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_2 "SV_TARGET_2"
               OpName %SV_TARGET_3 "SV_TARGET_3"
               OpName %SV_TARGET_4 "SV_TARGET_4"
               OpName %SV_TARGET_5 "SV_TARGET_5"
               OpName %SparseTexel "SparseTexel"
               OpName %_ ""
               OpName %__0 ""
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %11 DescriptorSet 0
               OpDecorate %11 Binding 0
               OpDecorate %TEXCOORD Location 0
               OpDecorate %DEPTH_REF Location 1
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
        %int = OpTypeInt 32 1
      %v2int = OpTypeVector %int 2
%_ptr_Input_v2int = OpTypePointer Input %v2int
     %OFFSET = OpVariable %_ptr_Input_v2int Input
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%_ptr_Output_float = OpTypePointer Output %float
%SV_TARGET_1 = OpVariable %_ptr_Output_float Output
%SV_TARGET_2 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_3 = OpVariable %_ptr_Output_float Output
%SV_TARGET_4 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_5 = OpVariable %_ptr_Output_float Output
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
    %v2float = OpTypeVector %float 2
%_ptr_Input_int = OpTypePointer Input %int
     %v2uint = OpTypeVector %uint 2
         %50 = OpTypeSampledImage %6
%SparseTexel = OpTypeStruct %uint %v4float
          %_ = OpTypeStruct %float %float %float %float %uint
        %__0 = OpTypeStruct %uint %v4float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
       %bool = OpTypeBool
    %float_1 = OpConstant %float 1
    %float_0 = OpConstant %float 0
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
         %86 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %132

        %132 = OpLabel
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
         %54 =   OpImageSparseGather %SparseTexel %51 %52 %uint_0
         %55 =   OpCompositeExtract %uint %54 0
         %56 =   OpCompositeExtract %v4float %54 1
         %57 =   OpCompositeExtract %float %56 0
         %58 =   OpCompositeExtract %float %56 1
         %59 =   OpCompositeExtract %float %56 2
         %60 =   OpCompositeExtract %float %56 3
         %62 =   OpCompositeConstruct %_ %57 %58 %59 %60 %55
         %63 =   OpCompositeExtract %uint %62 4
         %64 =   OpCompositeExtract %float %62 0
         %65 =   OpCompositeExtract %float %62 1
         %66 =   OpCompositeExtract %float %62 2
         %67 =   OpCompositeExtract %float %62 3
         %68 =   OpCompositeConstruct %v4float %64 %65 %66 %67
         %71 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %71 %64
         %72 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %72 %65
         %73 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %73 %66
         %75 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %75 %67
         %78 =   OpImageSparseTexelsResident %bool %63
         %79 =   OpSelect %float %78 %float_1 %float_0
                 OpStore %SV_TARGET_1 %79
         %82 =   OpCompositeConstruct %v2float %35 %38
         %85 =   OpImageSparseGather %SparseTexel %51 %82 %uint_0 ConstOffset %86
         %87 =   OpCompositeExtract %uint %85 0
         %88 =   OpCompositeExtract %v4float %85 1
         %89 =   OpCompositeExtract %float %88 0
         %90 =   OpCompositeExtract %float %88 1
         %91 =   OpCompositeExtract %float %88 2
         %92 =   OpCompositeExtract %float %88 3
         %93 =   OpCompositeConstruct %_ %89 %90 %91 %92 %87
         %94 =   OpCompositeExtract %uint %93 4
         %95 =   OpCompositeExtract %float %93 0
         %96 =   OpCompositeExtract %float %93 1
         %97 =   OpCompositeExtract %float %93 2
         %98 =   OpCompositeExtract %float %93 3
         %99 =   OpCompositeConstruct %v4float %95 %96 %97 %98
        %101 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %101 %95
        %102 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %102 %96
        %103 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %103 %97
        %104 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %104 %98
        %105 =   OpImageSparseTexelsResident %bool %94
        %106 =   OpSelect %float %105 %float_1 %float_0
                 OpStore %SV_TARGET_3 %106
        %107 =   OpCompositeConstruct %v2float %35 %38
        %108 =   OpBitcast %int %44
        %109 =   OpBitcast %int %47
        %111 =   OpCompositeConstruct %v2int %108 %109
        %110 =   OpImageSparseGather %SparseTexel %51 %107 %uint_0 Offset %111
        %112 =   OpCompositeExtract %uint %110 0
        %113 =   OpCompositeExtract %v4float %110 1
        %114 =   OpCompositeExtract %float %113 0
        %115 =   OpCompositeExtract %float %113 1
        %116 =   OpCompositeExtract %float %113 2
        %117 =   OpCompositeExtract %float %113 3
        %118 =   OpCompositeConstruct %_ %114 %115 %116 %117 %112
        %119 =   OpCompositeExtract %uint %118 4
        %120 =   OpCompositeExtract %float %118 0
        %121 =   OpCompositeExtract %float %118 1
        %122 =   OpCompositeExtract %float %118 2
        %123 =   OpCompositeExtract %float %118 3
        %124 =   OpCompositeConstruct %v4float %120 %121 %122 %123
        %126 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %126 %120
        %127 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %127 %121
        %128 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %128 %122
        %129 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %129 %123
        %130 =   OpImageSparseTexelsResident %bool %119
        %131 =   OpSelect %float %130 %float_1 %float_0
                 OpStore %SV_TARGET_5 %131
                 OpReturn
               OpFunctionEnd

