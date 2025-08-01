SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 39
; Schema: 0
               OpCapability Shader
               OpCapability Geometry
               OpCapability GeometryStreams
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Geometry %main "main" %SV_POSITION %BUFFER_A_ATTR_1 %BUFFER_B_ATTR
               OpExecutionMode %main Invocations 1
               OpExecutionMode %main OutputVertices 1
               OpExecutionMode %main InputPoints
               OpExecutionMode %main OutputPoints
               OpName %main "main"
               OpName %SV_POSITION "SV_POSITION"
               OpName %BUFFER_A_ATTR_1 "BUFFER_A_ATTR_1"
               OpName %BUFFER_B_ATTR "BUFFER_B_ATTR"
               OpDecorate %SV_POSITION BuiltIn Position
               OpDecorate %BUFFER_A_ATTR_1 Location 1
               OpDecorate %BUFFER_B_ATTR Stream 1
               OpDecorate %BUFFER_B_ATTR Location 4
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
%SV_POSITION = OpVariable %_ptr_Output_v4float Output
       %uint = OpTypeInt 32 0
%_ptr_Output_uint = OpTypePointer Output %uint
%BUFFER_A_ATTR_1 = OpVariable %_ptr_Output_uint Output
        %int = OpTypeInt 32 1
      %v2int = OpTypeVector %int 2
%_ptr_Output_v2int = OpTypePointer Output %v2int
%BUFFER_B_ATTR = OpVariable %_ptr_Output_v2int Output
%_ptr_Output_float = OpTypePointer Output %float
     %uint_0 = OpConstant %uint 0
    %float_1 = OpConstant %float 1
     %uint_1 = OpConstant %uint 1
    %float_2 = OpConstant %float 2
     %uint_2 = OpConstant %uint 2
    %float_3 = OpConstant %float 3
     %uint_3 = OpConstant %uint 3
    %float_4 = OpConstant %float 4
     %uint_4 = OpConstant %uint 4
%_ptr_Output_int = OpTypePointer Output %int
     %uint_5 = OpConstant %uint 5
     %uint_6 = OpConstant %uint 6
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %37

         %37 = OpLabel
         %17 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_0
                 OpStore %17 %float_1
         %20 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_1
                 OpStore %20 %float_2
         %23 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_2
                 OpStore %23 %float_3
         %26 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_3
                 OpStore %26 %float_4
                 OpStore %BUFFER_A_ATTR_1 %uint_4
                 OpEmitStreamVertex %uint_0
                 OpEndStreamPrimitive %uint_0
         %31 =   OpAccessChain %_ptr_Output_int %BUFFER_B_ATTR %uint_0
         %33 =   OpBitcast %int %uint_5
                 OpStore %31 %33
         %34 =   OpAccessChain %_ptr_Output_int %BUFFER_B_ATTR %uint_1
         %36 =   OpBitcast %int %uint_6
                 OpStore %34 %36
                 OpEmitStreamVertex %uint_1
                 OpEndStreamPrimitive %uint_1
                 OpReturn
               OpFunctionEnd

