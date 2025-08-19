SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 36
; Schema: 0
               OpCapability Shader
               OpCapability Geometry
               OpCapability GeometryStreams
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Geometry %main "main" %BUFFER_A_ATTR %BUFFER_A_ATTR_1 %SV_POSITION
               OpExecutionMode %main Invocations 1
               OpExecutionMode %main OutputVertices 1
               OpExecutionMode %main InputPoints
               OpExecutionMode %main OutputPoints
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %BUFFER_A_ATTR "BUFFER_A_ATTR"
               OpName %BUFFER_A_ATTR_1 "BUFFER_A_ATTR_1"
               OpName %SV_POSITION "SV_POSITION"
               OpDecorate %BUFFER_A_ATTR Location 0
               OpDecorate %BUFFER_A_ATTR_1 Location 1
               OpDecorate %SV_POSITION Stream 1
               OpDecorate %SV_POSITION BuiltIn Position
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
        %int = OpTypeInt 32 1
      %v2int = OpTypeVector %int 2
%_ptr_Output_v2int = OpTypePointer Output %v2int
%BUFFER_A_ATTR = OpVariable %_ptr_Output_v2int Output
       %uint = OpTypeInt 32 0
%_ptr_Output_uint = OpTypePointer Output %uint
%BUFFER_A_ATTR_1 = OpVariable %_ptr_Output_uint Output
      %float = OpTypeFloat 32
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
%SV_POSITION = OpVariable %_ptr_Output_v4float Output
%_ptr_Output_int = OpTypePointer Output %int
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
%_ptr_Output_float = OpTypePointer Output %float
    %float_4 = OpConstant %float 4
    %float_5 = OpConstant %float 5
    %float_6 = OpConstant %float 6
    %float_7 = OpConstant %float 7
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %34

         %34 = OpLabel
         %17 =   OpAccessChain %_ptr_Output_int %BUFFER_A_ATTR %uint_0
         %20 =   OpBitcast %int %uint_1
                 OpStore %17 %20
         %21 =   OpAccessChain %_ptr_Output_int %BUFFER_A_ATTR %uint_1
         %23 =   OpBitcast %int %uint_2
                 OpStore %21 %23
                 OpStore %BUFFER_A_ATTR_1 %uint_3
                 OpEmitStreamVertex %uint_0
                 OpEndStreamPrimitive %uint_0
         %26 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_0
                 OpStore %26 %float_4
         %28 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_1
                 OpStore %28 %float_5
         %30 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_2
                 OpStore %30 %float_6
         %32 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_3
                 OpStore %32 %float_7
                 OpEmitStreamVertex %uint_1
                 OpEndStreamPrimitive %uint_1
                 OpReturn
               OpFunctionEnd

