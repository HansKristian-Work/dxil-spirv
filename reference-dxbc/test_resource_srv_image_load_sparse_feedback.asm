SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 89
; Schema: 0
               OpCapability Shader
               OpCapability SparseResidency
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %TEXCOORD %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %TEXCOORD "TEXCOORD"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_2 "SV_TARGET_2"
               OpName %SV_TARGET_3 "SV_TARGET_3"
               OpName %SparseTexel "SparseTexel"
               OpName %_ ""
               OpName %__0 ""
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %TEXCOORD Flat
               OpDecorate %TEXCOORD Location 0
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
               OpDecorate %SV_TARGET_2 Location 2
               OpDecorate %SV_TARGET_3 Location 3
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 2D 0 0 0 1 Unknown
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
       %uint = OpTypeInt 32 0
     %v3uint = OpTypeVector %uint 3
%_ptr_Input_v3uint = OpTypePointer Input %v3uint
   %TEXCOORD = OpVariable %_ptr_Input_v3uint Input
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
  %SV_TARGET = OpVariable %_ptr_Output_v4float Output
%_ptr_Output_float = OpTypePointer Output %float
%SV_TARGET_1 = OpVariable %_ptr_Output_float Output
%SV_TARGET_2 = OpVariable %_ptr_Output_v4float Output
%SV_TARGET_3 = OpVariable %_ptr_Output_float Output
%_ptr_Input_uint = OpTypePointer Input %uint
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %v2uint = OpTypeVector %uint 2
%SparseTexel = OpTypeStruct %uint %v4float
          %_ = OpTypeStruct %float %float %float %float %uint
        %__0 = OpTypeStruct %uint %v4float
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
       %bool = OpTypeBool
    %float_1 = OpConstant %float 1
    %float_0 = OpConstant %float 0
        %int = OpTypeInt 32 1
     %int_n1 = OpConstant %int -1
      %int_0 = OpConstant %int 0
      %v2int = OpTypeVector %int 2
         %66 = OpConstantComposite %v2int %int_n1 %int_0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %87

         %87 = OpLabel
         %20 =   OpLoad %6 %8
         %22 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_0
         %24 =   OpLoad %uint %22
         %25 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_1
         %27 =   OpLoad %uint %25
         %32 =   OpCompositeConstruct %v2uint %24 %27
         %31 =   OpImageSparseFetch %SparseTexel %20 %32 Lod %uint_1
         %33 =   OpCompositeExtract %uint %31 0
         %34 =   OpCompositeExtract %v4float %31 1
         %35 =   OpCompositeExtract %float %34 0
         %36 =   OpCompositeExtract %float %34 1
         %37 =   OpCompositeExtract %float %34 2
         %38 =   OpCompositeExtract %float %34 3
         %40 =   OpCompositeConstruct %_ %35 %36 %37 %38 %33
         %41 =   OpCompositeExtract %uint %40 4
         %42 =   OpCompositeExtract %float %40 0
         %43 =   OpCompositeExtract %float %40 1
         %44 =   OpCompositeExtract %float %40 2
         %45 =   OpCompositeExtract %float %40 3
         %46 =   OpCompositeConstruct %v4float %42 %43 %44 %45
         %49 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %49 %42
         %50 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %50 %43
         %51 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %51 %44
         %53 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %53 %45
         %56 =   OpImageSparseTexelsResident %bool %41
         %57 =   OpSelect %float %56 %float_1 %float_0
                 OpStore %SV_TARGET_1 %57
         %64 =   OpCompositeConstruct %v2uint %24 %27
         %63 =   OpImageSparseFetch %SparseTexel %20 %64 Lod|ConstOffset %uint_1 %66
         %67 =   OpCompositeExtract %uint %63 0
         %68 =   OpCompositeExtract %v4float %63 1
         %69 =   OpCompositeExtract %float %68 0
         %70 =   OpCompositeExtract %float %68 1
         %71 =   OpCompositeExtract %float %68 2
         %72 =   OpCompositeExtract %float %68 3
         %73 =   OpCompositeConstruct %_ %69 %70 %71 %72 %67
         %74 =   OpCompositeExtract %uint %73 4
         %75 =   OpCompositeExtract %float %73 0
         %76 =   OpCompositeExtract %float %73 1
         %77 =   OpCompositeExtract %float %73 2
         %78 =   OpCompositeExtract %float %73 3
         %79 =   OpCompositeConstruct %v4float %75 %76 %77 %78
         %81 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %81 %75
         %82 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %82 %76
         %83 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %83 %77
         %84 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %84 %78
         %85 =   OpImageSparseTexelsResident %bool %74
         %86 =   OpSelect %float %85 %float_1 %float_0
                 OpStore %SV_TARGET_3 %86
                 OpReturn
               OpFunctionEnd

