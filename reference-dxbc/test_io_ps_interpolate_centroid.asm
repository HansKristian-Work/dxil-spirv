SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 37
; Schema: 0
               OpCapability Shader
               OpCapability SampleRateShading
               OpCapability InterpolationFunction
               OpCapability VulkanMemoryModel
         %17 = OpExtInstImport "GLSL.std.450"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %IN_SCALAR %IN_VECTOR %IN_VECTOR_1 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %IN_SCALAR "IN_SCALAR"
               OpName %IN_VECTOR "IN_VECTOR"
               OpName %IN_VECTOR_1 "IN_VECTOR_1"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_2 "SV_TARGET_2"
               OpDecorate %IN_SCALAR NoPerspective
               OpDecorate %IN_SCALAR Location 0
               OpDecorate %IN_VECTOR Location 1
               OpDecorate %IN_VECTOR_1 Sample
               OpDecorate %IN_VECTOR_1 Location 2
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
               OpDecorate %SV_TARGET_2 Location 2
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
%_ptr_Input_float = OpTypePointer Input %float
  %IN_SCALAR = OpVariable %_ptr_Input_float Input
    %v3float = OpTypeVector %float 3
%_ptr_Input_v3float = OpTypePointer Input %v3float
  %IN_VECTOR = OpVariable %_ptr_Input_v3float Input
%IN_VECTOR_1 = OpVariable %_ptr_Input_v3float Input
%_ptr_Output_float = OpTypePointer Output %float
  %SV_TARGET = OpVariable %_ptr_Output_float Output
%_ptr_Output_v3float = OpTypePointer Output %v3float
%SV_TARGET_1 = OpVariable %_ptr_Output_v3float Output
%SV_TARGET_2 = OpVariable %_ptr_Output_float Output
       %uint = OpTypeInt 32 0
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %35

         %35 = OpLabel
         %18 =   OpExtInst %float %17 InterpolateAtCentroid %IN_SCALAR
                 OpStore %SV_TARGET %18
         %19 =   OpAccessChain %_ptr_Input_float %IN_VECTOR %uint_0
         %22 =   OpExtInst %float %17 InterpolateAtCentroid %19
         %23 =   OpAccessChain %_ptr_Input_float %IN_VECTOR %uint_1
         %25 =   OpExtInst %float %17 InterpolateAtCentroid %23
         %26 =   OpAccessChain %_ptr_Input_float %IN_VECTOR %uint_2
         %28 =   OpExtInst %float %17 InterpolateAtCentroid %26
         %30 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %30 %22
         %31 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %31 %25
         %32 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %32 %28
         %33 =   OpAccessChain %_ptr_Input_float %IN_VECTOR_1 %uint_1
         %34 =   OpExtInst %float %17 InterpolateAtCentroid %33
                 OpStore %SV_TARGET_2 %34
                 OpReturn
               OpFunctionEnd

