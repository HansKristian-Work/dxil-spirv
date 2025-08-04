SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 60
; Schema: 0
               OpCapability Shader
               OpCapability SparseResidency
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %8 %TEXCOORD %SV_TARGET %SV_TARGET_1
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %TEXCOORD "TEXCOORD"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SparseTexel "SparseTexel"
               OpName %_ ""
               OpName %__0 ""
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %8 NonWritable
               OpDecorate %TEXCOORD Flat
               OpDecorate %TEXCOORD Location 0
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
          %6 = OpTypeImage %float 2D 0 0 0 2 R32f
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
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %58

         %58 = OpLabel
         %18 =   OpLoad %6 %8
         %20 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_0
         %22 =   OpLoad %uint %20
         %23 =   OpAccessChain %_ptr_Input_uint %TEXCOORD %uint_1
         %25 =   OpLoad %uint %23
         %30 =   OpCompositeConstruct %v2uint %22 %25
         %29 =   OpImageSparseRead %SparseTexel %18 %30 NonPrivateTexel
         %31 =   OpCompositeExtract %uint %29 0
         %32 =   OpCompositeExtract %v4float %29 1
         %33 =   OpCompositeExtract %float %32 0
         %34 =   OpCompositeExtract %float %32 1
         %35 =   OpCompositeExtract %float %32 2
         %36 =   OpCompositeExtract %float %32 3
         %38 =   OpCompositeConstruct %_ %33 %34 %35 %36 %31
         %39 =   OpCompositeExtract %uint %38 4
         %40 =   OpCompositeExtract %float %38 0
         %41 =   OpCompositeExtract %float %38 1
         %42 =   OpCompositeExtract %float %38 2
         %43 =   OpCompositeExtract %float %38 3
         %44 =   OpCompositeConstruct %v4float %40 %41 %42 %43
         %47 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_0
                 OpStore %47 %40
         %48 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_1
                 OpStore %48 %41
         %49 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_2
                 OpStore %49 %42
         %51 =   OpAccessChain %_ptr_Output_float %SV_TARGET %uint_3
                 OpStore %51 %43
         %54 =   OpImageSparseTexelsResident %bool %39
         %55 =   OpSelect %float %54 %float_1 %float_0
                 OpStore %SV_TARGET_1 %55
                 OpReturn
               OpFunctionEnd

