SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 21
; Schema: 0
               OpCapability Shader
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %SV_POSITION %DELTA %SV_DEPTH
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main DepthReplacing
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SV_POSITION "SV_POSITION"
               OpName %DELTA "DELTA"
               OpName %SV_DEPTH "SV_DEPTH"
               OpDecorate %SV_POSITION BuiltIn FragCoord
               OpDecorate %DELTA Location 1
               OpDecorate %SV_DEPTH BuiltIn FragDepth
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
    %v4float = OpTypeVector %float 4
%_ptr_Input_v4float = OpTypePointer Input %v4float
%SV_POSITION = OpVariable %_ptr_Input_v4float Input
%_ptr_Input_float = OpTypePointer Input %float
      %DELTA = OpVariable %_ptr_Input_float Input
%_ptr_Output_float = OpTypePointer Output %float
   %SV_DEPTH = OpVariable %_ptr_Output_float Output
       %uint = OpTypeInt 32 0
     %uint_2 = OpConstant %uint 2
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %19

         %19 = OpLabel
         %13 =   OpAccessChain %_ptr_Input_float %SV_POSITION %uint_2
         %16 =   OpLoad %float %13
         %17 =   OpLoad %float %DELTA
         %18 =   OpFAdd %float %17 %16
                 OpStore %SV_DEPTH %18
                 OpReturn
               OpFunctionEnd

