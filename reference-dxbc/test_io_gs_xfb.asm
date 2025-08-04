SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 36
; Schema: 0
               OpCapability Shader
               OpCapability Geometry
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Geometry %main "main" %BUFFER_A_ATTR %BUFFER_A_ATTR_1 %BUFFER_B_ATTR
               OpExecutionMode %main Invocations 1
               OpExecutionMode %main OutputVertices 1
               OpExecutionMode %main InputPoints
               OpExecutionMode %main OutputPoints
               OpName %main "main"
               OpName %BUFFER_A_ATTR "BUFFER_A_ATTR"
               OpName %BUFFER_A_ATTR_1 "BUFFER_A_ATTR_1"
               OpName %BUFFER_B_ATTR "BUFFER_B_ATTR"
               OpDecorate %BUFFER_A_ATTR Location 0
               OpDecorate %BUFFER_A_ATTR_1 Location 0
               OpDecorate %BUFFER_A_ATTR_1 Component 3
               OpDecorate %BUFFER_B_ATTR Location 1
               OpDecorate %BUFFER_B_ATTR Component 2
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
    %v3float = OpTypeVector %float 3
%_ptr_Output_v3float = OpTypePointer Output %v3float
%BUFFER_A_ATTR = OpVariable %_ptr_Output_v3float Output
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
     %uint_4 = OpConstant %uint 4
%_ptr_Output_int = OpTypePointer Output %int
     %uint_5 = OpConstant %uint 5
     %uint_6 = OpConstant %uint 6
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %34

         %34 = OpLabel
         %17 =   OpAccessChain %_ptr_Output_float %BUFFER_A_ATTR %uint_0
                 OpStore %17 %float_1
         %20 =   OpAccessChain %_ptr_Output_float %BUFFER_A_ATTR %uint_1
                 OpStore %20 %float_2
         %23 =   OpAccessChain %_ptr_Output_float %BUFFER_A_ATTR %uint_2
                 OpStore %23 %float_3
                 OpStore %BUFFER_A_ATTR_1 %uint_4
                 OpEmitVertex
                 OpEndPrimitive
         %28 =   OpAccessChain %_ptr_Output_int %BUFFER_B_ATTR %uint_0
         %30 =   OpBitcast %int %uint_5
                 OpStore %28 %30
         %31 =   OpAccessChain %_ptr_Output_int %BUFFER_B_ATTR %uint_1
         %33 =   OpBitcast %int %uint_6
                 OpStore %31 %33
                 OpEmitVertex
                 OpEndPrimitive
                 OpReturn
               OpFunctionEnd

