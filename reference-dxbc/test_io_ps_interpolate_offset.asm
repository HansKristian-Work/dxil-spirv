SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 45
; Schema: 0
               OpCapability Shader
               OpCapability InterpolationFunction
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
         %28 = OpExtInstImport "GLSL.std.450"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %OFFSET %IN_SCALAR %IN_VECTOR %IN_VECTOR_1 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %OFFSET "OFFSET"
               OpName %IN_SCALAR "IN_SCALAR"
               OpName %IN_VECTOR "IN_VECTOR"
               OpName %IN_VECTOR_1 "IN_VECTOR_1"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_2 "SV_TARGET_2"
               OpDecorate %OFFSET Location 3
               OpDecorate %IN_SCALAR NoPerspective
               OpDecorate %IN_SCALAR Location 0
               OpDecorate %IN_VECTOR Location 1
               OpDecorate %IN_VECTOR_1 Centroid
               OpDecorate %IN_VECTOR_1 Location 2
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
               OpDecorate %SV_TARGET_2 Location 2
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
    %v2float = OpTypeVector %float 2
%_ptr_Input_v2float = OpTypePointer Input %v2float
     %OFFSET = OpVariable %_ptr_Input_v2float Input
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
                 OpBranch %43

         %43 = OpLabel
         %20 =   OpAccessChain %_ptr_Input_float %OFFSET %uint_0
         %23 =   OpLoad %float %20
         %24 =   OpAccessChain %_ptr_Input_float %OFFSET %uint_1
         %26 =   OpLoad %float %24
         %27 =   OpCompositeConstruct %v2float %23 %26
         %29 =   OpExtInst %float %28 InterpolateAtOffset %IN_SCALAR %27
                 OpStore %SV_TARGET %29
         %30 =   OpAccessChain %_ptr_Input_float %IN_VECTOR %uint_0
         %31 =   OpExtInst %float %28 InterpolateAtOffset %30 %27
         %32 =   OpAccessChain %_ptr_Input_float %IN_VECTOR %uint_1
         %33 =   OpExtInst %float %28 InterpolateAtOffset %32 %27
         %34 =   OpAccessChain %_ptr_Input_float %IN_VECTOR %uint_2
         %36 =   OpExtInst %float %28 InterpolateAtOffset %34 %27
         %38 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %38 %31
         %39 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %39 %33
         %40 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %40 %36
         %41 =   OpAccessChain %_ptr_Input_float %IN_VECTOR_1 %uint_1
         %42 =   OpExtInst %float %28 InterpolateAtOffset %41 %27
                 OpStore %SV_TARGET_2 %42
                 OpReturn
               OpFunctionEnd

