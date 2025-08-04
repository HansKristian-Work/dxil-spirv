SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 136
; Schema: 0
               OpCapability Shader
               OpCapability ImageGatherExtended
               OpCapability SparseResidency
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %11 %TEXCOORD %DEPTH_REF %OFFSET %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3 %SV_TARGET_4 %SV_TARGET_5
               OpExecutionMode %main OriginUpperLeft
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
         %51 = OpTypeImage %float 2D 1 0 0 1 Unknown
         %52 = OpTypeSampledImage %51
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
         %88 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %134

        %134 = OpLabel
         %30 =   OpLoad %6 %8
         %31 =   OpLoad %9 %11
         %32 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %35 =   OpLoad %float %32
         %36 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %38 =   OpLoad %float %36
         %41 =   OpLoad %float %DEPTH_REF
         %43 =   OpAccessChain %_ptr_Input_int %OFFSET %uint_0
         %44 =   OpLoad %int %43
         %45 =   OpBitcast %uint %44
         %46 =   OpAccessChain %_ptr_Input_int %OFFSET %uint_1
         %47 =   OpLoad %int %46
         %48 =   OpBitcast %uint %47
         %53 =   OpSampledImage %52 %30 %31
         %54 =   OpCompositeConstruct %v2float %35 %38
         %56 =   OpImageSparseDrefGather %SparseTexel %53 %54 %41
         %57 =   OpCompositeExtract %uint %56 0
         %58 =   OpCompositeExtract %v4float %56 1
         %59 =   OpCompositeExtract %float %58 0
         %60 =   OpCompositeExtract %float %58 1
         %61 =   OpCompositeExtract %float %58 2
         %62 =   OpCompositeExtract %float %58 3
         %64 =   OpCompositeConstruct %_ %59 %60 %61 %62 %57
         %65 =   OpCompositeExtract %uint %64 4
         %66 =   OpCompositeExtract %float %64 0
         %67 =   OpCompositeExtract %float %64 1
         %68 =   OpCompositeExtract %float %64 2
         %69 =   OpCompositeExtract %float %64 3
         %70 =   OpCompositeConstruct %v4float %66 %67 %68 %69
         %73 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %73 %66
         %74 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %74 %67
         %75 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %75 %68
         %77 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %77 %69
         %80 =   OpImageSparseTexelsResident %bool %65
         %81 =   OpSelect %float %80 %float_1 %float_0
                 OpStore %SV_TARGET_1 %81
         %84 =   OpCompositeConstruct %v2float %35 %38
         %87 =   OpImageSparseDrefGather %SparseTexel %53 %84 %41 ConstOffset %88
         %89 =   OpCompositeExtract %uint %87 0
         %90 =   OpCompositeExtract %v4float %87 1
         %91 =   OpCompositeExtract %float %90 0
         %92 =   OpCompositeExtract %float %90 1
         %93 =   OpCompositeExtract %float %90 2
         %94 =   OpCompositeExtract %float %90 3
         %95 =   OpCompositeConstruct %_ %91 %92 %93 %94 %89
         %96 =   OpCompositeExtract %uint %95 4
         %97 =   OpCompositeExtract %float %95 0
         %98 =   OpCompositeExtract %float %95 1
         %99 =   OpCompositeExtract %float %95 2
        %100 =   OpCompositeExtract %float %95 3
        %101 =   OpCompositeConstruct %v4float %97 %98 %99 %100
        %103 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %103 %97
        %104 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %104 %98
        %105 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %105 %99
        %106 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %106 %100
        %107 =   OpImageSparseTexelsResident %bool %96
        %108 =   OpSelect %float %107 %float_1 %float_0
                 OpStore %SV_TARGET_3 %108
        %109 =   OpCompositeConstruct %v2float %35 %38
        %110 =   OpBitcast %int %45
        %111 =   OpBitcast %int %48
        %113 =   OpCompositeConstruct %v2int %110 %111
        %112 =   OpImageSparseDrefGather %SparseTexel %53 %109 %41 Offset %113
        %114 =   OpCompositeExtract %uint %112 0
        %115 =   OpCompositeExtract %v4float %112 1
        %116 =   OpCompositeExtract %float %115 0
        %117 =   OpCompositeExtract %float %115 1
        %118 =   OpCompositeExtract %float %115 2
        %119 =   OpCompositeExtract %float %115 3
        %120 =   OpCompositeConstruct %_ %116 %117 %118 %119 %114
        %121 =   OpCompositeExtract %uint %120 4
        %122 =   OpCompositeExtract %float %120 0
        %123 =   OpCompositeExtract %float %120 1
        %124 =   OpCompositeExtract %float %120 2
        %125 =   OpCompositeExtract %float %120 3
        %126 =   OpCompositeConstruct %v4float %122 %123 %124 %125
        %128 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_0
                 OpStore %128 %122
        %129 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_1
                 OpStore %129 %123
        %130 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_2
                 OpStore %130 %124
        %131 =   OpAccessChain %_ptr_Output_float %SV_TARGET_4 %uint_3
                 OpStore %131 %125
        %132 =   OpImageSparseTexelsResident %bool %121
        %133 =   OpSelect %float %132 %float_1 %float_0
                 OpStore %SV_TARGET_5 %133
                 OpReturn
               OpFunctionEnd

