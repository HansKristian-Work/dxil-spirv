SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 111
; Schema: 0
               OpCapability Shader
               OpCapability SampledImageArrayDynamicIndexing
               OpCapability RuntimeDescriptorArray
               OpCapability SampledImageArrayNonUniformIndexing
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_descriptor_indexing"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %9 %15 %19 %TEXCOORD %DEPTH_REF %LAYER %OFFSET %SV_TARGET %SV_TARGET_1 %SV_TARGET_2 %SV_TARGET_3
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %_ ""
               OpName %TEXCOORD "TEXCOORD"
               OpName %DEPTH_REF "DEPTH_REF"
               OpName %LAYER "LAYER"
               OpName %OFFSET "OFFSET"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_2 "SV_TARGET_2"
               OpName %SV_TARGET_3 "SV_TARGET_3"
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 0
               OpDecorate %_arr_float_uint_4 ArrayStride 4
               OpMemberDecorate %_ 0 Offset 0
               OpDecorate %_ Block
               OpDecorate %15 DescriptorSet 0
               OpDecorate %15 Binding 0
               OpDecorate %19 DescriptorSet 0
               OpDecorate %19 Binding 0
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
               OpDecorate %46 NonUniform
               OpDecorate %49 NonUniform
               OpDecorate %52 NonUniform
               OpDecorate %62 NonUniform
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float Cube 0 0 0 1 Unknown
%_runtimearr_6 = OpTypeRuntimeArray %6
%_ptr_UniformConstant__runtimearr_6 = OpTypePointer UniformConstant %_runtimearr_6
          %9 = OpVariable %_ptr_UniformConstant__runtimearr_6 UniformConstant
       %uint = OpTypeInt 32 0
     %uint_4 = OpConstant %uint 4
%_arr_float_uint_4 = OpTypeArray %float %uint_4
          %_ = OpTypeStruct %_arr_float_uint_4
%_ptr_Uniform__ = OpTypePointer Uniform %_
         %15 = OpVariable %_ptr_Uniform__ Uniform
         %16 = OpTypeSampler
%_runtimearr_16 = OpTypeRuntimeArray %16
%_ptr_UniformConstant__runtimearr_16 = OpTypePointer UniformConstant %_runtimearr_16
         %19 = OpVariable %_ptr_UniformConstant__runtimearr_16 UniformConstant
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
     %uint_0 = OpConstant %uint 0
    %uint_16 = OpConstant %uint 16
     %uint_2 = OpConstant %uint 2
%_ptr_Uniform_float = OpTypePointer Uniform %float
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
%_ptr_UniformConstant_16 = OpTypePointer UniformConstant %16
     %uint_1 = OpConstant %uint 1
         %61 = OpTypeSampledImage %6
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %109

        %109 = OpLabel
         %36 =   OpIMul %uint %uint_0 %uint_16
         %39 =   OpIMul %uint %uint_0 %uint_4
         %40 =   OpIAdd %uint %36 %39
         %41 =   OpShiftRightLogical %uint %40 %uint_2
         %44 =   OpAccessChain %_ptr_Uniform_float %15 %uint_0 %41
         %45 =   OpLoad %float %44
         %46 =   OpBitcast %uint %45
         %48 =   OpAccessChain %_ptr_UniformConstant_6 %9 %46
         %49 =   OpLoad %6 %48
         %51 =   OpAccessChain %_ptr_UniformConstant_16 %19 %46
         %52 =   OpLoad %16 %51
         %53 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_0
         %54 =   OpLoad %float %53
         %55 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_1
         %57 =   OpLoad %float %55
         %58 =   OpAccessChain %_ptr_Input_float %TEXCOORD %uint_2
         %59 =   OpLoad %float %58
         %62 =   OpSampledImage %61 %49 %52
         %63 =   OpCompositeConstruct %v3float %54 %57 %59
         %64 =   OpImageGather %v4float %62 %63 %uint_0
         %65 =   OpCompositeExtract %float %64 0
         %66 =   OpCompositeExtract %float %64 1
         %67 =   OpCompositeExtract %float %64 2
         %68 =   OpCompositeExtract %float %64 3
         %71 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %71 %65
         %72 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %72 %66
         %73 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %73 %67
         %74 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %74 %68
         %76 =   OpCompositeConstruct %v3float %54 %57 %59
         %77 =   OpImageGather %v4float %62 %76 %uint_1
         %78 =   OpCompositeExtract %float %77 0
         %79 =   OpCompositeExtract %float %77 1
         %80 =   OpCompositeExtract %float %77 2
         %81 =   OpCompositeExtract %float %77 3
         %83 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %83 %78
         %84 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %84 %79
         %85 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %85 %80
         %86 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_3
                 OpStore %86 %81
         %87 =   OpCompositeConstruct %v3float %54 %57 %59
         %88 =   OpImageGather %v4float %62 %87 %uint_2
         %89 =   OpCompositeExtract %float %88 0
         %90 =   OpCompositeExtract %float %88 1
         %91 =   OpCompositeExtract %float %88 2
         %92 =   OpCompositeExtract %float %88 3
         %94 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_0
                 OpStore %94 %89
         %95 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_1
                 OpStore %95 %90
         %96 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_2
                 OpStore %96 %91
         %97 =   OpAccessChain %_ptr_Output_float %SV_TARGET_2 %uint_3
                 OpStore %97 %92
         %98 =   OpCompositeConstruct %v3float %54 %57 %59
         %99 =   OpImageGather %v4float %62 %98 %uint_3
        %100 =   OpCompositeExtract %float %99 0
        %101 =   OpCompositeExtract %float %99 1
        %102 =   OpCompositeExtract %float %99 2
        %103 =   OpCompositeExtract %float %99 3
        %105 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_0
                 OpStore %105 %100
        %106 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_1
                 OpStore %106 %101
        %107 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_2
                 OpStore %107 %102
        %108 =   OpAccessChain %_ptr_Output_float %SV_TARGET_3 %uint_3
                 OpStore %108 %103
                 OpReturn
               OpFunctionEnd

