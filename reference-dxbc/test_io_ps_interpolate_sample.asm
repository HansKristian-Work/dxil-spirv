SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 42
; Schema: 0
               OpCapability Shader
               OpCapability SampleRateShading
               OpCapability InterpolationFunction
               OpCapability VulkanMemoryModel
         %21 = OpExtInstImport "GLSL.std.450"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %SV_SAMPLEINDEX %IN_SCALAR %IN_VECTOR %IN_VECTOR_1 %SV_TARGET %SV_TARGET_1 %SV_TARGET_2
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %SV_SAMPLEINDEX "SV_SAMPLEINDEX"
               OpName %IN_SCALAR "IN_SCALAR"
               OpName %IN_VECTOR "IN_VECTOR"
               OpName %IN_VECTOR_1 "IN_VECTOR_1"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpName %SV_TARGET_2 "SV_TARGET_2"
               OpDecorate %SV_SAMPLEINDEX BuiltIn SampleId
               OpDecorate %SV_SAMPLEINDEX Flat
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
       %uint = OpTypeInt 32 0
%_ptr_Input_uint = OpTypePointer Input %uint
%SV_SAMPLEINDEX = OpVariable %_ptr_Input_uint Input
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
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %40

         %40 = OpLabel
         %20 =   OpLoad %uint %SV_SAMPLEINDEX
         %22 =   OpExtInst %float %21 InterpolateAtSample %IN_SCALAR %20
                 OpStore %SV_TARGET %22
         %23 =   OpLoad %uint %SV_SAMPLEINDEX
         %24 =   OpAccessChain %_ptr_Input_float %IN_VECTOR %uint_0
         %26 =   OpExtInst %float %21 InterpolateAtSample %24 %23
         %27 =   OpAccessChain %_ptr_Input_float %IN_VECTOR %uint_1
         %29 =   OpExtInst %float %21 InterpolateAtSample %27 %23
         %30 =   OpAccessChain %_ptr_Input_float %IN_VECTOR %uint_2
         %32 =   OpExtInst %float %21 InterpolateAtSample %30 %23
         %34 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_0
                 OpStore %34 %26
         %35 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_1
                 OpStore %35 %29
         %36 =   OpAccessChain %_ptr_Output_float %SV_TARGET_1 %uint_2
                 OpStore %36 %32
         %37 =   OpLoad %uint %SV_SAMPLEINDEX
         %38 =   OpAccessChain %_ptr_Input_float %IN_VECTOR_1 %uint_1
         %39 =   OpExtInst %float %21 InterpolateAtSample %38 %37
                 OpStore %SV_TARGET_2 %39
                 OpReturn
               OpFunctionEnd

