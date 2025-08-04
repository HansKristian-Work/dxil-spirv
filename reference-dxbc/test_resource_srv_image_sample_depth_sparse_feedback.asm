SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 81
; Schema: 0
               OpCapability Shader
               OpCapability SparseResidency
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %11 %TEXCOORD %DEPTH_REF %LOD_BIAS %LOD_CLAMP %LAYER %TEXCOORD_2 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3
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
%_ptr_Output_float = OpTypePointer Output %float
  %SV_TARGET = OpVariable %_ptr_Output_float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_float Output
%SV_TARGET_2 = OpVariable %_ptr_Output_float Output
%SV_TARGET_3 = OpVariable %_ptr_Output_float Output
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
         %42 = OpTypeSampledImage %6
    %float_0 = OpConstant %float 0
    %v4float = OpTypeVector %float 4
%SparseTexel = OpTypeStruct %uint %v4float
          %_ = OpTypeStruct %float %float %float %float %uint
        %__0 = OpTypeStruct %uint %float
       %bool = OpTypeBool
    %float_1 = OpConstant %float 1
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %79

         %79 = OpLabel
         %28 =   OpLoad %6 %8
         %29 =   OpLoad %9 %11
         %30 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %33 =   OpLoad %float %30
         %34 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %36 =   OpLoad %float %34
         %39 =   OpLoad %float %LAYER
         %43 =   OpSampledImage %42 %28 %29
         %48 =   OpCompositeConstruct %v3float %33 %36 %39
         %47 =   OpImageSparseSampleImplicitLod %SparseTexel %43 %48 None
         %49 =   OpCompositeExtract %uint %47 0
         %50 =   OpCompositeExtract %v4float %47 1
         %51 =   OpCompositeExtract %float %50 0
         %52 =   OpCompositeExtract %float %50 1
         %53 =   OpCompositeExtract %float %50 2
         %54 =   OpCompositeExtract %float %50 3
         %56 =   OpCompositeConstruct %_ %51 %52 %53 %54 %49
         %57 =   OpCompositeExtract %uint %56 4
         %58 =   OpCompositeExtract %float %56 0
                 OpStore %SV_TARGET %58
         %62 =   OpImageSparseTexelsResident %bool %57
         %63 =   OpSelect %float %62 %float_1 %float_0
                 OpStore %SV_TARGET_1 %63
         %66 =   OpCompositeConstruct %v3float %33 %36 %39
         %65 =   OpImageSparseSampleExplicitLod %SparseTexel %43 %66 Lod %float_0
         %67 =   OpCompositeExtract %uint %65 0
         %68 =   OpCompositeExtract %v4float %65 1
         %69 =   OpCompositeExtract %float %68 0
         %70 =   OpCompositeExtract %float %68 1
         %71 =   OpCompositeExtract %float %68 2
         %72 =   OpCompositeExtract %float %68 3
         %73 =   OpCompositeConstruct %_ %69 %70 %71 %72 %67
         %74 =   OpCompositeExtract %uint %73 4
         %75 =   OpCompositeExtract %float %73 0
                 OpStore %SV_TARGET_2 %75
         %77 =   OpImageSparseTexelsResident %bool %74
         %78 =   OpSelect %float %77 %float_1 %float_0
                 OpStore %SV_TARGET_3 %78
                 OpReturn
               OpFunctionEnd

